// 5.9 Samleopgave: Kampen til sidste livspoint
import './style.css';

const cards = [
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40, hp: 60, maxHp: 60, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35, hp: 65, maxHp: 65, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
  { name: 'Squirtle', type: 'Vand', attack: 'Water Gun', damage: 30, hp: 70, maxHp: 70, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 30, hp: 75, maxHp: 75, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
];

// Sikkerhedstælleren fra 5.7, så kampen aldrig kan køre for evigt
const MAX_ROUNDS = 50;

const container = document.querySelector('#card-container');
const battleLog = document.querySelector('#battle-log');

// ---------- Visning af kort (som i kapitel 4) ----------

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

// ---------- Valg af kort ----------

function chooseCardIndex() {
  // Nu kan vi bygge listen med en løkke, så den passer, uanset hvor mange kort der er
  let text = 'Vælg din Pokémon:';
  for (let i = 0; i < cards.length; i++) {
    text += `\n${i + 1}: ${cards[i].name} (${cards[i].type})`;
  }

  const answer = prompt(text);

  if (answer === null) return null;
  if (answer.trim() === '') return null;

  const choice = Number(answer);
  if (Number.isNaN(choice)) return null;
  if (choice < 1 || choice > cards.length) return null;

  return choice - 1;
}

function getOpponentIndex(playerIndex) {
  let index = Math.floor(Math.random() * cards.length);
  if (index === playerIndex) {
    index = (index + 1) % cards.length;
  }
  return index;
}

// ---------- Reglerne (som i kapitel 4) ----------

function isEffective(attackType, defenseType) {
  return (
    (attackType === 'Vand' && defenseType === 'Ild') ||
    (attackType === 'Ild' && defenseType === 'Græs') ||
    (attackType === 'Græs' && defenseType === 'Vand') ||
    (attackType === 'Elektrisk' && defenseType === 'Vand')
  );
}

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

// Nu returnerer attack hele resultatet plus teksten,
// fordi vi skal tælle de kritiske angreb til sidst
function attack(attacker, defender) {
  const result = calculateDamage(attacker, defender);

  defender.hp -= result.damage;
  if (defender.hp < 0) {
    defender.hp = 0;
  }

  let text = `${attacker.name} bruger ${attacker.attack} og gør ${result.damage} i skade`;
  if (result.isEffective) text += ' (effektivt!)';
  if (result.isCritical) text += ' (kritisk!)';

  return { text: text, isCritical: result.isCritical };
}

// ---------- Selve kampen ----------

const playerIndex = chooseCardIndex();

if (playerIndex === null) {
  battleLog.textContent = 'Du valgte ikke et gyldigt kort. Genindlæs siden for at prøve igen.';
} else {
  const player = cards[playerIndex];
  const opponent = cards[getOpponentIndex(playerIndex)];

  const list = document.createElement('ol');
  battleLog.append(list);

  let attacker = player;
  let defender = opponent;
  let round = 0;
  let criticalCount = 0;

  // Kampen fortsætter, så længe begge kort har livspoint tilbage
  while (player.hp > 0 && opponent.hp > 0) {
    round++;

    const result = attack(attacker, defender);
    if (result.isCritical) {
      criticalCount++;
    }

    const item = document.createElement('li');
    item.textContent = `Runde ${round}: ${result.text}`;
    list.append(item);

    // Byt om på angriber og forsvarer med en midlertidig variabel
    const temp = attacker;
    attacker = defender;
    defender = temp;

    if (round >= MAX_ROUNDS) {
      break;
    }
  }

  // Opdater kortene, så livspoint-bjælkerne viser resultatet
  container.append(createCard(player));
  container.append(createCard(opponent));

  let winner = 'Ingen vandt';
  if (player.hp > opponent.hp) {
    winner = `Du vandt med ${player.name}!`;
  } else if (opponent.hp > player.hp) {
    winner = `Computeren vandt med ${opponent.name}!`;
  }

  const resultElement = document.createElement('p');
  resultElement.classList.add('result');
  resultElement.textContent = winner;
  battleLog.append(resultElement);

  const summary = document.createElement('p');
  summary.classList.add('summary');
  // Ternary fra 2.7, så der står "1 runde" og ikke "1 runder"
  const roundText = round === 1 ? 'runde' : 'runder';
  summary.textContent = `Kampen varede ${round} ${roundText} med ${criticalCount} kritiske angreb.`;
  battleLog.append(summary);
}
