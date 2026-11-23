// 7.5 Samleopgave: Kampen med knapper
import './style.css';

const PLACEHOLDER_IMAGE = '/placeholder.svg';
const MAX_ROUNDS = 50;
const ROUND_DELAY = 900; // millisekunder mellem hver runde

// ---------- Data ----------
// Alt, hvad appen skal huske, står her. Klik ændrer dataene, og render() tegner siden

const cards = [
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40, hp: 60, maxHp: 60, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35, hp: 65, maxHp: 65, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
  { name: 'Squirtle', type: 'Vand', attack: 'Water Gun', damage: 30, hp: 70, maxHp: 70, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 30, hp: 75, maxHp: 75, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
];

let selectedIndex = null; // brugerens kort
let opponentIndex = null; // modstanderens kort
let battleLog = []; // én tekst for hver runde
let message = 'Vælg dit kort nedenfor.';
let isFighting = false; // sand, mens kampen bliver afspillet
let isBattleOver = false; // sand, når der er fundet en vinder

// ---------- Elementer ----------

const arenaCards = document.querySelector('#arena-cards');
const messageElement = document.querySelector('#message');
const logElement = document.querySelector('#battle-log');
const container = document.querySelector('#card-container');
const findOpponentButton = document.querySelector('#find-opponent');
const fightButton = document.querySelector('#fight');
const newBattleButton = document.querySelector('#new-battle');
const form = document.querySelector('#new-card');
const errorElement = document.querySelector('#error');

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

  const percent = calculatePercent(card.hp, card.maxHp);

  cardElement.innerHTML = `
    <header class="card-header">
      <h2>${card.name}</h2>
      <span class="card-hp">${card.hp} / ${card.maxHp} HP</span>
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

  if (percent < 30) {
    cardElement.querySelector('.hp-bar').classList.add('critical');
  }
  if (card.hp === 0) {
    cardElement.classList.add('fainted');
  }

  return cardElement;
}

// ---------- Reglerne (fra kapitel 4 og 5) ----------

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
  const effective = isEffective(attacker.type, defender.type);
  const critical = Math.random() < 0.2;

  if (effective) damage *= 2;
  if (critical) damage = Math.round(damage * 1.5);

  defender.hp -= damage;
  if (defender.hp < 0) {
    defender.hp = 0;
  }

  let text = `${attacker.name} bruger ${attacker.attack} og gør ${damage} i skade`;
  if (effective) text += ' (effektivt!)';
  if (critical) text += ' (kritisk!)';
  return text;
}

// ---------- Tegn siden ud fra dataene ----------

function createEmptySlot(text) {
  const slot = document.createElement('div');
  slot.classList.add('empty-slot');
  slot.textContent = text;
  return slot;
}

function render() {
  // Samlingen
  container.innerHTML = '';
  for (let i = 0; i < cards.length; i++) {
    const cardElement = createCard(cards[i]);
    cardElement.dataset.index = i;

    if (i === selectedIndex) cardElement.classList.add('selected');
    if (i === opponentIndex) cardElement.classList.add('is-opponent');

    container.append(cardElement);
  }

  // Arenaen. data-side bruges til at finde det kort, der skal ryste
  arenaCards.innerHTML = '';

  if (selectedIndex === null) {
    arenaCards.append(createEmptySlot('Dit kort'));
  } else {
    const playerElement = createCard(cards[selectedIndex]);
    playerElement.dataset.side = 'player';
    arenaCards.append(playerElement);
  }

  const versus = document.createElement('span');
  versus.classList.add('versus');
  versus.textContent = 'VS';
  arenaCards.append(versus);

  if (opponentIndex === null) {
    arenaCards.append(createEmptySlot('Modstander'));
  } else {
    const opponentElement = createCard(cards[opponentIndex]);
    opponentElement.dataset.side = 'opponent';
    arenaCards.append(opponentElement);
  }

  // Beskeden og forløbet
  messageElement.textContent = message;

  logElement.innerHTML = '';
  for (const entry of battleLog) {
    const item = document.createElement('li');
    item.textContent = entry;
    logElement.append(item);
  }

  // Knapperne er kun aktive, når det giver mening ud fra dataene
  findOpponentButton.disabled = selectedIndex === null || isFighting || isBattleOver;
  fightButton.disabled = selectedIndex === null || opponentIndex === null || isFighting || isBattleOver;
  newBattleButton.disabled = isFighting;
}

// ---------- Valg af kort ----------

container.addEventListener('click', (event) => {
  const cardElement = event.target.closest('.card');
  if (!cardElement) return;

  // Man kan ikke skifte kort midt i eller efter en kamp
  if (isFighting || isBattleOver) return;

  selectedIndex = Number(cardElement.dataset.index);

  // Vælger brugeren modstanderens kort, må vi finde en ny modstander
  if (selectedIndex === opponentIndex) {
    opponentIndex = null;
  }

  message = 'Find en modstander.';
  render();
});

findOpponentButton.addEventListener('click', () => {
  // Bliv ved med at trække et tilfældigt kort, så længe det er brugerens eget
  let index = Math.floor(Math.random() * cards.length);
  while (index === selectedIndex) {
    index = Math.floor(Math.random() * cards.length);
  }

  opponentIndex = index;
  message = 'Klar til kamp!';
  render();
});

// ---------- Kampen ----------

let attackerSide = 'player';

// Afspiller én runde og planlægger selv den næste med setTimeout
function playRound() {
  const player = cards[selectedIndex];
  const opponent = cards[opponentIndex];

  let defenderSide = 'opponent';
  let text = '';

  if (attackerSide === 'player') {
    text = attack(player, opponent);
  } else {
    text = attack(opponent, player);
    defenderSide = 'player';
  }

  battleLog.push(`Runde ${battleLog.length + 1}: ${text}`);

  // Er kampen slut?
  if (player.hp === 0 || opponent.hp === 0 || battleLog.length >= MAX_ROUNDS) {
    isFighting = false;
    isBattleOver = true;

    if (player.hp > opponent.hp) {
      message = `Du vandt med ${player.name}!`;
    } else if (opponent.hp > player.hp) {
      message = `${opponent.name} vandt!`;
    } else {
      message = 'Uafgjort!';
    }
  }

  render();

  // render() har lavet nye elementer, så det ramte kort får klassen på ny,
  // og animationen bliver afspillet hver gang
  const hitCard = arenaCards.querySelector(`[data-side="${defenderSide}"]`);
  hitCard.classList.add('hit');

  // Byt angriber, og planlæg næste runde, hvis kampen ikke er slut
  if (attackerSide === 'player') {
    attackerSide = 'opponent';
  } else {
    attackerSide = 'player';
  }

  if (isFighting) {
    setTimeout(playRound, ROUND_DELAY);
  }
}

function startBattle() {
  isFighting = true;
  attackerSide = 'player';
  battleLog = [];
  render();

  // Klar, parat, kamp! med et halvt sekunds mellemrum
  const countdown = ['Klar', 'Parat', 'Kamp!'];
  for (let i = 0; i < countdown.length; i++) {
    setTimeout(() => {
      messageElement.textContent = countdown[i];
    }, i * 500);
  }

  setTimeout(() => {
    message = 'Kampen er i gang ...';
    playRound();
  }, countdown.length * 500);
}

fightButton.addEventListener('click', startBattle);

newBattleButton.addEventListener('click', () => {
  for (const card of cards) {
    card.hp = card.maxHp;
  }

  selectedIndex = null;
  opponentIndex = null;
  battleLog = [];
  isBattleOver = false;
  message = 'Vælg dit kort nedenfor.';
  render();
});

// Ekstra: Enter starter kampen, når knappen er aktiv.
// Står brugeren i formularen, skal Enter i stedet sende formularen
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  if (event.target.closest('form')) return;
  if (fightButton.disabled) return;

  startBattle();
});

// ---------- Nye kort ----------

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const type = document.querySelector('#type').value;
  const damage = Number(document.querySelector('#damage').value);

  if (name === '') {
    errorElement.textContent = 'Kortet skal have et navn.';
    return;
  }
  if (Number.isNaN(damage) || damage < 1 || damage > 200) {
    errorElement.textContent = 'Skaden skal være et tal mellem 1 og 200.';
    return;
  }

  cards.push({ name: name, type: type, attack: 'Tackle', damage: damage, hp: 100, maxHp: 100, image: PLACEHOLDER_IMAGE });

  errorElement.textContent = '';
  form.reset();
  render();
});

render();
