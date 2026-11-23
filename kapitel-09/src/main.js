// 9.8 Samleopgave: Pokédex
import './style.css';

const API_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 24;
const MAX_STAT = 255; // den højeste værdi, en stat kan have
const PLACEHOLDER_IMAGE = '/placeholder.svg';

// ---------- Opslagstabeller ----------

const typeNames = {
  normal: 'Normal',
  fire: 'Ild',
  water: 'Vand',
  grass: 'Græs',
  electric: 'Elektrisk',
  ice: 'Is',
  fighting: 'Kamp',
  poison: 'Gift',
  ground: 'Jord',
  flying: 'Flyvende',
  psychic: 'Psykisk',
  bug: 'Insekt',
  rock: 'Sten',
  ghost: 'Spøgelse',
  dragon: 'Drage',
  dark: 'Mørke',
  steel: 'Stål',
  fairy: 'Fe',
};

// Det danske typenavn bestemmer CSS-klassen.
// Et opslagsobjekt erstatter den lange række af if'er fra de tidligere kapitler
const typeClasses = {
  Normal: 'type-normal',
  Ild: 'type-fire',
  Vand: 'type-water',
  Græs: 'type-grass',
  Elektrisk: 'type-electric',
  Is: 'type-ice',
  Kamp: 'type-fighting',
  Gift: 'type-poison',
  Jord: 'type-ground',
  Flyvende: 'type-flying',
  Psykisk: 'type-psychic',
  Insekt: 'type-bug',
  Sten: 'type-rock',
  Spøgelse: 'type-ghost',
  Drage: 'type-dragon',
  Mørke: 'type-dark',
  Stål: 'type-steel',
  Fe: 'type-fairy',
};

const statNames = {
  hp: 'Livspoint',
  attack: 'Angreb',
  defense: 'Forsvar',
  'special-attack': 'Specialangreb',
  'special-defense': 'Specialforsvar',
  speed: 'Fart',
};

// ---------- Data ----------

let cards = []; // får en ny værdi for hver side, så den skal være let
let offset = 0; // hvor mange Pokémon vi springer over

// ---------- Elementer ----------

const searchForm = document.querySelector('#search-form');
const searchNameInput = document.querySelector('#search-name');
const searchButton = searchForm.querySelector('button');
const searchInput = document.querySelector('#search');
const typeSelect = document.querySelector('#type-filter');
const sortSelect = document.querySelector('#sort');
const resetButton = document.querySelector('#reset');
const statusElement = document.querySelector('#status');
const statsElement = document.querySelector('#stats');
const container = document.querySelector('#card-container');
const detail = document.querySelector('#detail');
const previousButton = document.querySelector('#previous');
const nextButton = document.querySelector('#next');
const pageInfo = document.querySelector('#page-info');

// ---------- Hent fra API'et ----------

// Henter en adresse og returnerer dataene som JSON.
// Går noget galt, bliver der kastet en fejl med en besked, brugeren kan forstå
async function fetchJson(url, notFoundMessage) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    // Vi har ikke brug for selve fejlen her, så catch står uden (error).
    // fetch() fejler kun på denne måde, når der slet ikke er forbindelse
    throw new Error('Der er ingen forbindelse til nettet. Tjek din forbindelse, og prøv igen.');
  }

  if (!response.ok) {
    throw new Error(notFoundMessage);
  }

  return await response.json();
}

async function fetchPokemon(nameOrId) {
  return await fetchJson(`${API_URL}/pokemon/${nameOrId}`, `Jeg kunne ikke finde "${nameOrId}". Tjek stavningen.`);
}

async function fetchList(count, start) {
  const data = await fetchJson(`${API_URL}/pokemon?limit=${count}&offset=${start}`, 'Listen kunne ikke hentes.');
  return data.results;
}

// ---------- Fra API-data til kort ----------

function getStat(data, statName) {
  return data.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0;
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

function toCard(data) {
  const hp = getStat(data, 'hp');
  const types = data.types.map((item) => typeNames[item.type.name] ?? item.type.name);

  return {
    id: data.id,
    name: capitalize(data.name),
    type: types[0],
    types: types,
    attack: data.moves[0]?.move.name ?? 'tackle',
    damage: getStat(data, 'attack'),
    hp: hp,
    maxHp: hp,
    image: data.sprites.front_default ?? PLACEHOLDER_IMAGE,
    // Ekstra oplysninger til detaljepanelet, så vi ikke skal hente igen
    height: data.height / 10, // decimeter til meter
    weight: data.weight / 10, // hektogram til kilo
    stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
  };
}

// ---------- Visning af kort ----------

function getTypeClass(type) {
  return typeClasses[type] ?? 'type-unknown';
}

const calculatePercent = (value, max) => Math.round((value / max) * 100);

function createCard(card) {
  const cardElement = document.createElement('article');
  cardElement.classList.add('card', getTypeClass(card.type));
  cardElement.dataset.id = card.id;

  const percent = calculatePercent(card.hp, card.maxHp);

  cardElement.innerHTML = `
    <header class="card-header">
      <h2>${card.name}</h2>
      <span class="card-hp">${card.hp} HP</span>
    </header>
    <img class="card-image" src="${card.image}" alt="${card.name}">
    <p class="card-type">#${card.id} · ${card.types.join(' / ')}</p>
    <div class="hp-bar">
      <div class="hp-fill" style="width: ${percent}%"></div>
    </div>
    <p class="card-attack">
      <strong>${card.attack}</strong>
      <span>${card.damage}</span>
    </p>
  `;

  return cardElement;
}

// ---------- Status ----------

function showStatus(text, isError = false) {
  statusElement.textContent = text;
  statusElement.classList.toggle('is-error', isError);
}

// ---------- Samlingen (fra kapitel 8) ----------

function render(list) {
  if (list.length === 0) {
    container.innerHTML = '<p class="empty">Ingen kort fundet</p>';
    return;
  }
  container.replaceChildren(...list.map(createCard));
}

function renderStats(list) {
  const count = list.length;
  const totalDamage = list.reduce((sum, card) => sum + card.damage, 0);
  const averageDamage = count > 0 ? totalDamage / count : 0;
  const strongest = [...list].sort((a, b) => b.damage - a.damage)[0];

  statsElement.innerHTML = `
    <li><strong>${count}</strong> kort</li>
    <li><strong>${totalDamage}</strong> samlet skade</li>
    <li><strong>${averageDamage.toFixed(1)}</strong> gns. skade</li>
    <li><strong>${strongest?.name ?? '–'}</strong> stærkest</li>
  `;
}

function showList() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedType = typeSelect.value;
  const sortBy = sortSelect.value;

  const list = cards
    .filter((card) => card.name.toLowerCase().includes(search))
    // includes() på arrayet, så en Pokémon med to typer findes under dem begge
    .filter((card) => selectedType === 'Alle' || card.types.includes(selectedType))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'da');
      if (sortBy === 'damage') return b.damage - a.damage;
      if (sortBy === 'hp') return b.hp - a.hp;
      return a.id - b.id;
    });

  render(list);
  renderStats(list);
}

// ---------- Detaljepanelet ----------

function showDetail(card) {
  const typeBadges = card.types
    .map((type) => `<li class="${getTypeClass(type)}">${type}</li>`)
    .join('');

  const statBars = card.stats
    .map((stat) => `
      <li>
        <span>${statNames[stat.name] ?? stat.name}</span>
        <strong>${stat.value}</strong>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${calculatePercent(stat.value, MAX_STAT)}%"></div>
        </div>
      </li>
    `)
    .join('');

  detail.replaceChildren(createCard(card));
  detail.insertAdjacentHTML('beforeend', `
    <dl>
      <dt>Nummer</dt><dd>#${card.id}</dd>
      <dt>Højde</dt><dd>${card.height} m</dd>
      <dt>Vægt</dt><dd>${card.weight} kg</dd>
      <dt>Typer</dt><dd><ul class="type-badges">${typeBadges}</ul></dd>
    </dl>
    <ul class="stat-list">${statBars}</ul>
  `);
}

// ---------- Hent en side med Pokémon ----------

async function loadPage() {
  showStatus('Henter Pokémon ...');
  previousButton.disabled = true;
  nextButton.disabled = true;

  try {
    const list = await fetchList(PAGE_SIZE, offset);
    const allData = await Promise.all(list.map((pokemon) => fetchPokemon(pokemon.name)));

    cards = allData.map(toCard);
    showList();
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    previousButton.disabled = offset === 0;
    nextButton.disabled = false;
    pageInfo.textContent = `Nr. ${offset + 1}–${offset + PAGE_SIZE}`;
  }
}

// ---------- Hændelser ----------

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  let query = searchNameInput.value.trim().toLowerCase();
  if (query === '') {
    showStatus('Skriv et navn eller et nummer.', true);
    return;
  }

  // "025" skal virke som "25". Er det et tal, laver vi det om til et rent tal
  if (!Number.isNaN(Number(query))) {
    query = String(Number(query));
  }

  showStatus('Henter ...');
  searchButton.disabled = true;

  try {
    const data = await fetchPokemon(query);
    showDetail(toCard(data));
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    searchButton.disabled = false;
    searchNameInput.value = '';
  }
});

searchInput.addEventListener('input', showList);
typeSelect.addEventListener('change', showList);
sortSelect.addEventListener('change', showList);

container.addEventListener('click', (event) => {
  const cardElement = event.target.closest('.card');
  if (!cardElement) return;

  // data-attributter er altid tekst, så id'et skal laves om til et tal
  const card = cards.find((item) => item.id === Number(cardElement.dataset.id));
  if (card) {
    showDetail(card);
  }
});

resetButton.addEventListener('click', () => {
  searchInput.value = '';
  typeSelect.value = 'Alle';
  sortSelect.value = 'id';
  showList();
});

previousButton.addEventListener('click', () => {
  offset = Math.max(0, offset - PAGE_SIZE);
  loadPage();
});

nextButton.addEventListener('click', () => {
  offset += PAGE_SIZE;
  loadPage();
});

loadPage();
