// 11.5 Samleopgave: Tre små forbedringer
// Koden fra 10.6 med tre forbedringer, der hver har fået sit eget commit:
// 1. Beskeder, der ikke er fejl, forsvinder af sig selv efter 3 sekunder
// 2. Antallet af favoritter står ved "Vis kun favoritter"
// 3. En mere hjælpsom tekst, når der ikke er nogen favoritter at vise
import './style.css';

const API_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 24;
const MAX_STAT = 255;
const MAX_TEAM_SIZE = 6;
const MAX_ROUNDS = 200;
const PLACEHOLDER_IMAGE = '/placeholder.svg';
const STORAGE_KEY = 'pokedex-state'; // forstavelsen holder det adskilt fra andre projekter

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

// ---------- Gem og hent ----------

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
  const text = localStorage.getItem(key);

  if (text === null) {
    return fallback;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn(`Kunne ikke læse de gemte data for "${key}"`, error);
    return fallback;
  }
}

// ---------- Tilstand ----------
// Kun det, brugeren selv har valgt, bliver gemt.
// Kortene hentes fra PokéAPI hver gang, så dem gemmer vi ikke

const defaultState = {
  favorites: [], // navne
  team: [], // navne
  search: '',
  typeFilter: 'Alle',
  sort: 'id',
  showOnlyFavorites: false,
};

// favorites og team får nye tomme arrays, så state ikke kommer til at dele arrays med defaultState.
// Det, der er gemt, overskriver standardværdierne
const state = { ...defaultState, favorites: [], team: [], ...load(STORAGE_KEY, {}) };

function saveState() {
  save(STORAGE_KEY, state);
}

// Det, der ikke gemmes
let cards = []; // den side, der er hentet lige nu
let teamCards = []; // kortene på holdet, som også kan ligge på andre sider
let offset = 0;

// ---------- Elementer ----------

const searchForm = document.querySelector('#search-form');
const searchNameInput = document.querySelector('#search-name');
const searchButton = searchForm.querySelector('button');
const searchInput = document.querySelector('#search');
const typeSelect = document.querySelector('#type-filter');
const sortSelect = document.querySelector('#sort');
const onlyFavoritesInput = document.querySelector('#only-favorites');
const favoriteCount = document.querySelector('#favorite-count');
const resetFiltersButton = document.querySelector('#reset-filters');
const resetAllButton = document.querySelector('#reset-all');
const statusElement = document.querySelector('#status');
const statsElement = document.querySelector('#stats');
const container = document.querySelector('#card-container');
const detail = document.querySelector('#detail');
const previousButton = document.querySelector('#previous');
const nextButton = document.querySelector('#next');
const pageInfo = document.querySelector('#page-info');
const teamStats = document.querySelector('#team-stats');
const teamContainer = document.querySelector('#team-container');
const battleButton = document.querySelector('#battle');
const resetTeamButton = document.querySelector('#reset-team');
const battleResult = document.querySelector('#battle-result');
const battleLog = document.querySelector('#battle-log');

// ---------- Hent fra API'et ----------

async function fetchJson(url, notFoundMessage) {
  let response;

  try {
    response = await fetch(url);
  } catch {
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
    height: data.height / 10,
    weight: data.weight / 10,
    stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
  };
}

// ---------- Visning af kort ----------

function getTypeClass(type) {
  return typeClasses[type] ?? 'type-unknown';
}

const calculatePercent = (value, max) => Math.round((value / max) * 100);

// createCard() kender ikke til state. Favoritter og hold markeres i render()
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

// Tilføjer en række knapper nederst på et kort
function addActions(cardElement, buttonsHtml) {
  const actions = document.createElement('div');
  actions.classList.add('card-actions');
  actions.innerHTML = buttonsHtml;
  cardElement.append(actions);
}

// ---------- Status ----------

const STATUS_DURATION = 3000; // millisekunder

let statusTimer = null;

function showStatus(text, isError = false) {
  statusElement.textContent = text;
  statusElement.classList.toggle('is-error', isError);

  // Forbedring 1: Stop en tidligere nedtælling, så en ny besked ikke bliver fjernet for tidligt
  clearTimeout(statusTimer);

  // Fejl bliver stående, så brugeren kan nå at læse dem. Andre beskeder forsvinder.
  // "Henter ..." skal også blive stående, til hentningen er færdig
  if (!isError && text !== '' && !text.startsWith('Henter')) {
    statusTimer = setTimeout(() => {
      statusElement.textContent = '';
    }, STATUS_DURATION);
  }
}

// ---------- Tegn samlingen ----------

function getVisibleCards() {
  const search = state.search.trim().toLowerCase();

  return cards
    .filter((card) => card.name.toLowerCase().includes(search))
    .filter((card) => state.typeFilter === 'Alle' || card.types.includes(state.typeFilter))
    .filter((card) => !state.showOnlyFavorites || state.favorites.includes(card.name))
    .sort((a, b) => {
      if (state.sort === 'name') return a.name.localeCompare(b.name, 'da');
      if (state.sort === 'damage') return b.damage - a.damage;
      if (state.sort === 'hp') return b.hp - a.hp;
      return a.id - b.id;
    });
}

function renderCollection() {
  const list = getVisibleCards();
  const isTeamFull = state.team.length >= MAX_TEAM_SIZE;

  // Forbedring 2: Vis antallet af favoritter ved afkrydsningsfeltet
  favoriteCount.textContent = `(${state.favorites.length})`;

  if (list.length === 0) {
    // Forbedring 3: Fortæl, hvad brugeren kan gøre, i stedet for bare at sige, at der ikke er noget
    if (state.showOnlyFavorites && state.favorites.length === 0) {
      container.innerHTML = '<p class="empty">Du har ingen favoritter endnu. Klik på ♡ på et kort for at gøre det til en favorit.</p>';
    } else if (state.showOnlyFavorites) {
      container.innerHTML = '<p class="empty">Ingen af dine favoritter passer til søgningen på denne side.</p>';
    } else {
      container.innerHTML = '<p class="empty">Ingen kort fundet</p>';
    }
  } else {
    const cardElements = list.map((card) => {
      const cardElement = createCard(card);
      const isFavorite = state.favorites.includes(card.name);
      const isOnTeam = state.team.includes(card.name);

      let teamLabel = 'Til holdet';
      if (isOnTeam) teamLabel = 'På holdet';

      addActions(cardElement, `
        <button class="favorite-button" data-name="${card.name}" aria-label="Favorit: ${card.name}" aria-pressed="${isFavorite}">${isFavorite ? '♥' : '♡'}</button>
        <button class="add-team-button" data-name="${card.name}">${teamLabel}</button>
      `);

      cardElement.classList.toggle('is-favorite', isFavorite);

      // Knappen er slået fra, når kortet er på holdet, eller holdet er fuldt
      cardElement.querySelector('.add-team-button').disabled = isOnTeam || isTeamFull;

      return cardElement;
    });

    container.replaceChildren(...cardElements);
  }

  renderStats(list);
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

// ---------- Tegn holdet ----------

function getUniqueTypes(list) {
  const allTypes = [];
  list.forEach((card) => allTypes.push(...card.types));

  // Behold kun en type, første gang den optræder
  return allTypes.filter((type, index) => allTypes.indexOf(type) === index);
}

function renderTeam() {
  // Holdet vises i den rækkefølge, navnene står i state.team
  const team = state.team
    .map((name) => teamCards.find((card) => card.name === name))
    .filter((card) => card !== undefined);

  if (team.length === 0) {
    teamContainer.innerHTML = '<p class="empty">Dit hold er tomt. Tilføj Pokémon fra samlingen nedenfor.</p>';
  } else {
    teamContainer.replaceChildren(...team.map((card) => {
      const cardElement = createCard(card);
      addActions(cardElement, `<button class="remove-button secondary" data-name="${card.name}">Fjern</button>`);
      return cardElement;
    }));
  }

  // Statistikken beregnes hver gang og gemmes ikke
  const totalDamage = team.reduce((sum, card) => sum + card.damage, 0);
  const totalHp = team.reduce((sum, card) => sum + card.maxHp, 0);
  const averageHp = team.length > 0 ? totalHp / team.length : 0;
  const types = getUniqueTypes(team);

  teamStats.innerHTML = `
    <li><strong>${team.length} / ${MAX_TEAM_SIZE}</strong> på holdet</li>
    <li><strong>${totalDamage}</strong> samlet skade</li>
    <li><strong>${averageHp.toFixed(1)}</strong> gns. livspoint</li>
    <li><strong>${types.join(', ') || '–'}</strong> typer</li>
  `;

  battleButton.disabled = team.length === 0;
  resetTeamButton.disabled = team.length === 0;
}

// Opskriften: Ændr state, gem, og kald render()
function render() {
  renderCollection();
  renderTeam();
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

// ---------- Favoritter og hold ----------

function toggleFavorite(name) {
  if (state.favorites.includes(name)) {
    state.favorites = state.favorites.filter((favorite) => favorite !== name);
  } else {
    state.favorites.push(name);
  }
}

function addToTeam(card) {
  if (state.team.includes(card.name)) {
    showStatus(`${card.name} er allerede på dit hold.`, true);
    return;
  }

  if (state.team.length >= MAX_TEAM_SIZE) {
    showStatus(`Dit hold er fuldt. Der må højst være ${MAX_TEAM_SIZE} Pokémon.`, true);
    return;
  }

  state.team.push(card.name);
  teamCards.push(card);
  showStatus(`${card.name} er kommet på holdet.`);
}

function removeFromTeam(name) {
  state.team = state.team.filter((teamName) => teamName !== name);
  teamCards = teamCards.filter((card) => card.name !== name);
}

// ---------- Ekstra: holdkamp ----------

function isEffective(attackType, defenseType) {
  return (
    (attackType === 'Vand' && defenseType === 'Ild') ||
    (attackType === 'Ild' && defenseType === 'Græs') ||
    (attackType === 'Græs' && defenseType === 'Vand') ||
    (attackType === 'Elektrisk' && defenseType === 'Vand')
  );
}

function attack(attacker, defender) {
  let damage = attacker.damage;
  if (isEffective(attacker.type, defender.type)) damage *= 2;

  defender.hp = Math.max(0, defender.hp - damage);
  return `${attacker.name} angriber ${defender.name} og gør ${damage} i skade`;
}

function teamBattle() {
  // Kopier kortene, så kampen ikke ændrer livspointene i samlingen
  const myTeam = teamCards.map((card) => ({ ...card }));

  // Et tilfældigt hold af samme størrelse blandt dem, der ikke er på brugerens hold.
  // sort() med et tilfældigt tal blander listen. Det er ikke helt jævnt, men fint her
  const opponents = cards
    .filter((card) => !state.team.includes(card.name))
    .sort(() => Math.random() - 0.5)
    .slice(0, myTeam.length)
    .map((card) => ({ ...card }));

  if (opponents.length === 0) {
    battleResult.textContent = 'Der er ingen modstandere at kæmpe mod på denne side.';
    return;
  }

  const lines = [];
  let isMyTurn = true;

  // Den første Pokémon, der stadig kan kæmpe, går i ringen
  let mine = myTeam.find((card) => card.hp > 0);
  let theirs = opponents.find((card) => card.hp > 0);

  while (mine && theirs && lines.length < MAX_ROUNDS) {
    if (isMyTurn) {
      lines.push(attack(mine, theirs));
    } else {
      lines.push(attack(theirs, mine));
    }

    isMyTurn = !isMyTurn;
    mine = myTeam.find((card) => card.hp > 0);
    theirs = opponents.find((card) => card.hp > 0);
  }

  const opponentNames = opponents.map((card) => card.name).join(', ');

  if (mine && !theirs) {
    battleResult.textContent = `Dit hold vandt over ${opponentNames}!`;
  } else if (theirs && !mine) {
    battleResult.textContent = `${opponentNames} vandt over dit hold.`;
  } else {
    battleResult.textContent = 'Uafgjort!';
  }

  battleLog.replaceChildren(...lines.map((line) => {
    const item = document.createElement('li');
    item.textContent = line;
    return item;
  }));
}

// ---------- Hent data ----------

async function loadPage() {
  showStatus('Henter Pokémon ...');
  previousButton.disabled = true;
  nextButton.disabled = true;

  try {
    const list = await fetchList(PAGE_SIZE, offset);
    const allData = await Promise.all(list.map((pokemon) => fetchPokemon(pokemon.name)));

    cards = allData.map(toCard);
    render();
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    previousButton.disabled = offset === 0;
    nextButton.disabled = false;
    pageInfo.textContent = `Nr. ${offset + 1}–${offset + PAGE_SIZE}`;
  }
}

// Holdet er gemt som navne. Når siden starter, henter vi kortene til dem
async function loadTeam() {
  if (state.team.length === 0) return;

  try {
    const allData = await Promise.all(state.team.map((name) => fetchPokemon(name.toLowerCase())));
    teamCards = allData.map(toCard);
    renderTeam();
  } catch (error) {
    showStatus(`Holdet kunne ikke hentes. ${error.message}`, true);
  }
}

// ---------- Hændelser ----------

// Én lytter til knapperne og kortene i samlingen.
// Knapperne tjekkes først, og return sørger for, at klikket ikke også åbner kortet
container.addEventListener('click', (event) => {
  const heart = event.target.closest('.favorite-button');
  if (heart) {
    toggleFavorite(heart.dataset.name);
    saveState();
    render();
    return;
  }

  const addButton = event.target.closest('.add-team-button');
  if (addButton) {
    const card = cards.find((item) => item.name === addButton.dataset.name);
    addToTeam(card);
    saveState();
    render();
    return;
  }

  const cardElement = event.target.closest('.card');
  if (cardElement) {
    const card = cards.find((item) => item.id === Number(cardElement.dataset.id));
    showDetail(card);
  }
});

teamContainer.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-button');
  if (!removeButton) return;

  removeFromTeam(removeButton.dataset.name);
  saveState();
  render();
});

resetTeamButton.addEventListener('click', () => {
  state.team = [];
  teamCards = [];
  battleResult.textContent = '';
  battleLog.innerHTML = '';
  saveState();
  render();
});

battleButton.addEventListener('click', teamBattle);

searchInput.addEventListener('input', () => {
  state.search = searchInput.value;
  saveState();
  renderCollection();
});

typeSelect.addEventListener('change', () => {
  state.typeFilter = typeSelect.value;
  saveState();
  renderCollection();
});

sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  saveState();
  renderCollection();
});

onlyFavoritesInput.addEventListener('change', () => {
  state.showOnlyFavorites = onlyFavoritesInput.checked;
  saveState();
  renderCollection();
});

// Sætter felterne ud fra state. Bruges ved start og efter nulstilling
function syncControls() {
  searchInput.value = state.search;
  typeSelect.value = state.typeFilter;
  sortSelect.value = state.sort;
  onlyFavoritesInput.checked = state.showOnlyFavorites;
}

resetFiltersButton.addEventListener('click', () => {
  state.search = defaultState.search;
  state.typeFilter = defaultState.typeFilter;
  state.sort = defaultState.sort;
  state.showOnlyFavorites = defaultState.showOnlyFavorites;
  saveState();
  syncControls();
  renderCollection();
});

resetAllButton.addEventListener('click', () => {
  if (!confirm('Vil du slette dine favoritter, dit hold og dine filtre?')) return;

  localStorage.removeItem(STORAGE_KEY);
  // Nye tomme arrays, så state ikke deler arrays med defaultState
  Object.assign(state, defaultState, { favorites: [], team: [] });
  teamCards = [];
  syncControls();
  render();
});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  let query = searchNameInput.value.trim().toLowerCase();
  if (query === '') {
    showStatus('Skriv et navn eller et nummer.', true);
    return;
  }

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

previousButton.addEventListener('click', () => {
  offset = Math.max(0, offset - PAGE_SIZE);
  loadPage();
});

nextButton.addEventListener('click', () => {
  offset += PAGE_SIZE;
  loadPage();
});

// ---------- Start ----------

syncControls();
render();
loadTeam();
loadPage();
