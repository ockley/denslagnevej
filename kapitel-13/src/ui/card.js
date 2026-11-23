// Bygger HTML til kort og detaljepanel. Filen kender ikke til state
import '../styles/card.css';
import { LOW_HP_PERCENT, MAX_STAT } from '../config.js';

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

function getTypeClass(type) {
  return typeClasses[type] ?? 'type-unknown';
}

const calculatePercent = (value, max) => Math.round((value / max) * 100);

// Navnet er en knap, så kortet også kan vælges med tastaturet.
// Et klik på knappen bobler op til kortet, så lytteren i main.js virker uændret
export function createCard(card) {
  const cardElement = document.createElement('article');
  cardElement.classList.add('card', getTypeClass(card.type));
  cardElement.dataset.id = card.id;

  const percent = calculatePercent(card.hp, card.maxHp);

  cardElement.innerHTML = `
    <header class="card-header">
      <h2><button class="card-name" aria-label="Vis detaljer om ${card.name}">${card.name}</button></h2>
      <span class="card-hp">${card.hp} HP</span>
    </header>
    <img class="card-image" src="${card.image}" alt="${card.name}">
    <p class="card-type">#${card.id} · ${card.types.join(' / ')}</p>
    <div class="hp-bar">
      <div class="hp-fill"></div>
    </div>
    <p class="card-attack">
      <strong>${card.attack}</strong>
      <span>${card.damage}</span>
    </p>
  `;

  // JavaScript bestemmer tallet, CSS bestemmer udseendet
  cardElement.querySelector('.hp-fill').style.setProperty('--hp', `${percent}%`);

  if (percent < LOW_HP_PERCENT) {
    cardElement.querySelector('.hp-bar').classList.add('critical');
  }

  return cardElement;
}

// Tilføjer en række knapper nederst på et kort
export function addActions(cardElement, buttonsHtml) {
  const actions = document.createElement('div');
  actions.classList.add('card-actions');
  actions.innerHTML = buttonsHtml;
  cardElement.append(actions);
}

function createStatBar(stat) {
  const item = document.createElement('li');
  item.innerHTML = `
    <span>${statNames[stat.name] ?? stat.name}</span>
    <strong>${stat.value}</strong>
    <div class="stat-bar"><div class="stat-fill"></div></div>
  `;
  item
    .querySelector('.stat-fill')
    .style.setProperty('--value', `${calculatePercent(stat.value, MAX_STAT)}%`);
  return item;
}

// Returnerer alt det, der skal stå i detaljepanelet
export function createDetail(card) {
  const typeBadges = card.types
    .map((type) => `<li class="${getTypeClass(type)}">${type}</li>`)
    .join('');

  const facts = document.createElement('dl');
  facts.innerHTML = `
    <dt>Nummer</dt><dd>#${card.id}</dd>
    <dt>Højde</dt><dd>${card.height} m</dd>
    <dt>Vægt</dt><dd>${card.weight} kg</dd>
    <dt>Typer</dt><dd><ul class="type-badges">${typeBadges}</ul></dd>
  `;

  const statList = document.createElement('ul');
  statList.classList.add('stat-list');
  statList.append(...card.stats.map(createStatBar));

  return [createCard(card), facts, statList];
}
