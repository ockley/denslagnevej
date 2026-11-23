// 8.9 Samleopgave: Samlingen
// Udfordringen er klaret: Der er ingen for-løkker, kun array-metoder
import './style.css';

const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

// ---------- Data ----------

const cards = [
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 30, hp: 75, maxHp: 75, image: `${SPRITE_URL}1.png` },
  { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35, hp: 65, maxHp: 65, image: `${SPRITE_URL}4.png` },
  { name: 'Squirtle', type: 'Vand', attack: 'Water Gun', damage: 30, hp: 70, maxHp: 70, image: `${SPRITE_URL}7.png` },
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40, hp: 60, maxHp: 60, image: `${SPRITE_URL}25.png` },
  { name: 'Vulpix', type: 'Ild', attack: 'Flamethrower', damage: 45, hp: 55, maxHp: 55, image: `${SPRITE_URL}37.png` },
  { name: 'Oddish', type: 'Græs', attack: 'Absorb', damage: 20, hp: 80, maxHp: 80, image: `${SPRITE_URL}43.png` },
  { name: 'Psyduck', type: 'Vand', attack: 'Confusion', damage: 25, hp: 85, maxHp: 85, image: `${SPRITE_URL}54.png` },
  { name: 'Growlithe', type: 'Ild', attack: 'Fire Fang', damage: 40, hp: 70, maxHp: 70, image: `${SPRITE_URL}58.png` },
  { name: 'Magnemite', type: 'Elektrisk', attack: 'Thunder Shock', damage: 30, hp: 50, maxHp: 50, image: `${SPRITE_URL}81.png` },
  { name: 'Staryu', type: 'Vand', attack: 'Bubble Beam', damage: 35, hp: 60, maxHp: 60, image: `${SPRITE_URL}120.png` },
  { name: 'Jolteon', type: 'Elektrisk', attack: 'Pin Missile', damage: 50, hp: 65, maxHp: 65, image: `${SPRITE_URL}135.png` },
  { name: 'Chikorita', type: 'Græs', attack: 'Razor Leaf', damage: 35, hp: 90, maxHp: 90, image: `${SPRITE_URL}152.png` },
];

// ---------- Elementer ----------

const searchInput = document.querySelector('#search');
const typeSelect = document.querySelector('#type-filter');
const sortSelect = document.querySelector('#sort');
const resetButton = document.querySelector('#reset');
const statsElement = document.querySelector('#stats');
const container = document.querySelector('#card-container');
const detail = document.querySelector('#detail');

// ---------- Kort ----------

function getTypeClass(type) {
  if (type === 'Vand') return 'type-water';
  if (type === 'Ild') return 'type-fire';
  if (type === 'Græs') return 'type-grass';
  if (type === 'Elektrisk') return 'type-electric';
  return 'type-unknown';
}

const calculatePercent = (hp, maxHp) => Math.round((hp / maxHp) * 100);

function createCard(card) {
  const cardElement = document.createElement('article');
  cardElement.classList.add('card', getTypeClass(card.type));

  // Navnet bruges til at finde kortet igen, når der bliver klikket.
  // Indekset duer ikke, for det ændrer sig, når listen er filtreret eller sorteret
  cardElement.dataset.name = card.name;

  const percent = calculatePercent(card.hp, card.maxHp);

  cardElement.innerHTML = `
    <header class="card-header">
      <h2>${card.name}</h2>
      <span class="card-hp">${card.hp} HP</span>
    </header>
    <img class="card-image" src="${card.image}" alt="${card.name}">
    <p class="card-type">${card.type}</p>
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

// ---------- Visning ----------

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

  // En tom liste ville give 0 / 0, som er NaN. Så viser vi bare 0
  let averageDamage = 0;
  if (count > 0) {
    averageDamage = totalDamage / count;
  }

  // Det stærkeste kort finder vi ved at sortere en kopi og tage det første
  const strongest = [...list].sort((a, b) => b.damage - a.damage)[0];

  // ?. og ?? fra kapitel 9 ville gøre det kortere. Her er det skrevet med en betingelse
  let strongestText = '–';
  if (strongest) {
    strongestText = `${strongest.name} (${strongest.damage})`;
  }

  statsElement.innerHTML = `
    <li><strong>${count}</strong> kort</li>
    <li><strong>${totalDamage}</strong> samlet skade</li>
    <li><strong>${averageDamage.toFixed(1)}</strong> gns. skade</li>
    <li><strong>${strongestText}</strong> stærkest</li>
  `;
}

// Alt, der bestemmer, hvad der skal vises, er samlet her
function showList() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedType = typeSelect.value;
  const sortBy = sortSelect.value;

  const list = cards
    .filter((card) => card.name.toLowerCase().includes(search))
    .filter((card) => selectedType === 'Alle' || card.type === selectedType)
    .sort((a, b) => {
      if (sortBy === 'damage') return b.damage - a.damage;
      if (sortBy === 'hp') return b.hp - a.hp;
      return a.name.localeCompare(b.name, 'da');
    });

  render(list);
  renderStats(list);
}

function showDetail(card) {
  detail.replaceChildren(createCard(card));

  const facts = document.createElement('dl');
  facts.innerHTML = `
    <dt>Type</dt><dd>${card.type}</dd>
    <dt>Angreb</dt><dd>${card.attack}</dd>
    <dt>Skade</dt><dd>${card.damage}</dd>
    <dt>Livspoint</dt><dd>${card.hp} / ${card.maxHp}</dd>
  `;
  detail.append(facts);
}

// ---------- Hændelser ----------

searchInput.addEventListener('input', showList);
typeSelect.addEventListener('change', showList);
sortSelect.addEventListener('change', showList);

// Event delegation: Én lytter på containeren dækker alle kortene
container.addEventListener('click', (event) => {
  const cardElement = event.target.closest('.card');
  if (!cardElement) return;

  const card = cards.find((item) => item.name === cardElement.dataset.name);
  if (card) {
    showDetail(card);
  }
});

resetButton.addEventListener('click', () => {
  searchInput.value = '';
  typeSelect.value = 'Alle';
  sortSelect.value = 'name';

  // At sætte værdier fra JavaScript udløser ikke hændelserne,
  // så vi kalder selv showList()
  showList();
});

showList();
