// 4.7 Samleopgave: Kampen med funktioner
import './style.css';

// Plan (punkt 1):
// - getTypeClass, calculatePercent og createCard viser et kort
// - chooseCardIndex lader brugeren vælge et kort
// - getOpponentIndex finder en tilfældig modstander
// - isEffective og calculateDamage er reglerne for et angreb
// - attack udfører et angreb og returnerer en tekst til forløbet
// - showCards, addLogLine og getResultText viser det hele på siden

const cards = [
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40, hp: 60, maxHp: 60, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35, hp: 65, maxHp: 65, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
  { name: 'Squirtle', type: 'Vand', attack: 'Water Gun', damage: 30, hp: 70, maxHp: 70, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 30, hp: 75, maxHp: 75, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
];

const container = document.querySelector('#card-container');
const battleLog = document.querySelector('#battle-log');

// ---------- Visning af kort ----------

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

function showCards(player, opponent) {
  container.innerHTML = '';
  container.append(createCard(player));
  container.append(createCard(opponent));
}

function addLogLine(text) {
  const line = document.createElement('p');
  line.textContent = text;
  battleLog.append(line);
}

// ---------- Valg af kort ----------

// Returnerer indekset for det valgte kort, eller null hvis svaret ikke duer
function chooseCardIndex() {
  const answer = prompt(`Vælg din Pokémon:
1: ${cards[0].name} (${cards[0].type})
2: ${cards[1].name} (${cards[1].type})
3: ${cards[2].name} (${cards[2].type})
4: ${cards[3].name} (${cards[3].type})`);

  if (answer === null) return null;
  if (answer.trim() === '') return null;

  const choice = Number(answer);
  if (Number.isNaN(choice)) return null;
  if (choice < 1 || choice > cards.length) return null;

  return choice - 1;
}

// Vælger et tilfældigt kort, der ikke er spillerens eget.
// Rammer vi spillerens kort, tager vi bare det næste. % sørger for,
// at vi starter forfra ved 0, hvis vi var på det sidste kort
function getOpponentIndex(playerIndex) {
  let index = Math.floor(Math.random() * cards.length);
  if (index === playerIndex) {
    index = (index + 1) % cards.length;
  }
  return index;
}

// ---------- Reglerne ----------

function isEffective(attackType, defenseType) {
  return (
    (attackType === 'Vand' && defenseType === 'Ild') ||
    (attackType === 'Ild' && defenseType === 'Græs') ||
    (attackType === 'Græs' && defenseType === 'Vand') ||
    (attackType === 'Elektrisk' && defenseType === 'Vand')
  );
}

// Returnerer et objekt, fordi vi skal bruge tre oplysninger om angrebet
function calculateDamage(attacker, defender) {
  let damage = attacker.damage;

  const effective = isEffective(attacker.type, defender.type);
  if (effective) {
    damage *= 2;
  }

  const critical = Math.random() < 0.2;
  if (critical) {
    damage = Math.round(damage * 1.5);
  }

  return { damage: damage, isEffective: effective, isCritical: critical };
}

// Udfører et angreb og returnerer en beskrivelse af det
function attack(attacker, defender) {
  const result = calculateDamage(attacker, defender);

  defender.hp -= result.damage;
  if (defender.hp < 0) {
    defender.hp = 0;
  }

  let text = `${attacker.name} bruger ${attacker.attack} og gør ${result.damage} i skade`;
  if (result.isEffective) text += ' (effektivt!)';
  if (result.isCritical) text += ' (kritisk!)';
  return text;
}

function getResultText(player, opponent) {
  if (player.hp > opponent.hp) return 'Du vandt!';
  if (opponent.hp > player.hp) return 'Computeren vandt!';
  return 'Uafgjort!';
}

// ---------- Selve kampen ----------

const playerIndex = chooseCardIndex();

if (playerIndex === null) {
  addLogLine('Du valgte ikke et gyldigt kort. Genindlæs siden for at prøve igen.');
} else {
  const player = cards[playerIndex];
  const opponent = cards[getOpponentIndex(playerIndex)];

  addLogLine(attack(player, opponent));
  addLogLine(attack(opponent, player));

  showCards(player, opponent);

  const result = document.createElement('p');
  result.classList.add('result');
  result.textContent = getResultText(player, opponent);
  battleLog.append(result);
}
