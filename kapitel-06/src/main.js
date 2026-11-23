// 6.5 Samleopgave: Kortbyggeren
import './style.css';

// Alle nye kort får samme billede. Filen ligger i public-mappen
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const cards = [];

const form = document.querySelector('#card-form');
const nameInput = document.querySelector('#name');
const typeInput = document.querySelector('#type');
const attackInput = document.querySelector('#attack');
const damageInput = document.querySelector('#damage');
const hpInput = document.querySelector('#hp');
const errorElement = document.querySelector('#error');
const preview = document.querySelector('#preview');
const container = document.querySelector('#card-container');
const randomButton = document.querySelector('#random-button');

// ---------- Visning af kort ----------

function getTypeClass(type) {
  if (type === 'Vand') return 'type-water';
  if (type === 'Ild') return 'type-fire';
  if (type === 'Græs') return 'type-grass';
  if (type === 'Elektrisk') return 'type-electric';
  return 'type-unknown';
}

function calculatePercent(hp, maxHp) {
  // Mens brugeren skriver, kan livspointene være tomme eller 0.
  // Så giver divisionen ikke mening, og vi viser en tom bjælke
  if (!maxHp) return 0;
  return Math.round((hp / maxHp) * 100);
}

function createCard(card) {
  const cardElement = document.createElement('article');
  cardElement.classList.add('card', getTypeClass(card.type));

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

// ---------- Formularen ----------

// Læser alle felterne og returnerer et kortobjekt.
// Både forhåndsvisningen og submit bruger den samme funktion
function readForm() {
  const hp = Number(hpInput.value);

  return {
    name: nameInput.value.trim(),
    type: typeInput.value,
    attack: attackInput.value.trim(),
    damage: Number(damageInput.value),
    hp: hp,
    maxHp: hp, // Et nyt kort har alle sine livspoint
    image: PLACEHOLDER_IMAGE,
  };
}

function updatePreview() {
  const card = readForm();

  // Tomme felter får en pladsholder, så kortet ikke ser tomt ud
  if (card.name === '') card.name = 'Navn';
  if (card.attack === '') card.attack = 'Angreb';

  preview.innerHTML = '';
  preview.append(createCard(card));
}

// Returnerer en fejlbesked, eller en tom tekst hvis alt er i orden
function validate(card) {
  if (card.name === '') return 'Kortet skal have et navn.';
  if (card.attack === '') return 'Kortet skal have et angreb.';
  if (Number.isNaN(card.damage) || card.damage < 1 || card.damage > 200) {
    return 'Skaden skal være et tal mellem 1 og 200.';
  }
  if (Number.isNaN(card.hp) || card.hp < 1 || card.hp > 300) {
    return 'Livspointene skal være et tal mellem 1 og 300.';
  }
  return '';
}

// Hændelser fra felterne bobler op til formularen,
// så én lytter dækker alle felterne. Du lærer hvorfor i 7.3
form.addEventListener('input', updatePreview);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const card = readForm();
  const error = validate(card);

  if (error !== '') {
    errorElement.textContent = error;
    return;
  }

  cards.push(card);
  container.append(createCard(card));

  errorElement.textContent = '';
  form.reset();
  updatePreview();
});

// ---------- Ekstra: tilfældigt kort ----------

const randomNames = ['Sparky', 'Bobler', 'Glødeklump', 'Mosling', 'Lynhale', 'Plaske'];
const randomTypes = ['Vand', 'Ild', 'Græs', 'Elektrisk'];
const randomAttacks = ['Tackle', 'Ember', 'Water Gun', 'Vine Whip', 'Spark'];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

randomButton.addEventListener('click', () => {
  nameInput.value = pickRandom(randomNames);
  typeInput.value = pickRandom(randomTypes);
  attackInput.value = pickRandom(randomAttacks);
  damageInput.value = Math.floor(Math.random() * 60) + 10;
  hpInput.value = Math.floor(Math.random() * 100) + 50;

  // At sætte en værdi fra JavaScript udløser ikke input-hændelsen,
  // så vi opdaterer forhåndsvisningen selv
  updatePreview();
});

// Vis et kort fra start
updatePreview();
