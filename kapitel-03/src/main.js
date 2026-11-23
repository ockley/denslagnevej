// 3.7 Samleopgave: Pokémon-kortet
import './style.css';

// 1. Kortets data
const cardData = {
  name: 'Pikachu',
  type: 'Elektrisk',
  attack: 'Thunderbolt',
  damage: 40,
  hp: 80,
  maxHp: 100,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
};

// 2. Byg kortet med JavaScript. index.html indeholder kun den tomme container
const container = document.querySelector('#card-container');
const cardElement = document.createElement('article');
cardElement.classList.add('card');

// Typen er på dansk, klassen på engelsk, så vi oversætter med en betingelse
let typeClass = 'type-unknown';
if (cardData.type === 'Vand') {
  typeClass = 'type-water';
} else if (cardData.type === 'Ild') {
  typeClass = 'type-fire';
} else if (cardData.type === 'Græs') {
  typeClass = 'type-grass';
} else if (cardData.type === 'Elektrisk') {
  typeClass = 'type-electric';
}
cardElement.classList.add(typeClass);

let percent = Math.round((cardData.hp / cardData.maxHp) * 100);

cardElement.innerHTML = `
  <header class="card-header">
    <h2>${cardData.name}</h2>
    <span class="card-hp">${cardData.hp} / ${cardData.maxHp} HP</span>
  </header>
  <img class="card-image" src="${cardData.image}" alt="${cardData.name}">
  <p class="card-type">${cardData.type}</p>
  <div class="hp-bar">
    <div class="hp-fill" style="width: ${percent}%"></div>
  </div>
  <p class="card-attack">
    <strong>${cardData.attack}</strong>
    <span>${cardData.damage}</span>
  </p>
`;

container.append(cardElement);

// 3. Udseendet ligger i style.css: ramme, hjørner, skygge og typefarver

// 4. Under 30 % bliver bjælken rød, og ved 0 ser kortet besvimet ud
const hpBar = document.querySelector('.hp-bar');

if (percent < 30) {
  hpBar.classList.add('critical');
}
if (cardData.hp === 0) {
  cardElement.classList.add('fainted');
}

// 5. Spørg, hvor meget skade kortet har taget, og tjek svaret som i 2.6
const answer = prompt(`${cardData.name} har ${cardData.hp} HP. Hvor meget skade har kortet taget?`);

if (answer === null) {
  console.log('Du annullerede. Kortet er uændret.');
} else if (answer.trim() === '') {
  alert('Du skrev ikke noget.');
} else {
  const damageTaken = Number(answer);

  if (Number.isNaN(damageTaken)) {
    alert(`"${answer}" er ikke et tal.`);
  } else {
    cardData.hp -= damageTaken;

    // Livspointene må ikke blive negative
    if (cardData.hp < 0) {
      cardData.hp = 0;
    }

    // Opdater de elementer, der allerede står på siden
    percent = Math.round((cardData.hp / cardData.maxHp) * 100);

    document.querySelector('.card-hp').textContent = `${cardData.hp} / ${cardData.maxHp} HP`;
    document.querySelector('.hp-fill').style.width = `${percent}%`;

    if (percent < 30) {
      hpBar.classList.add('critical');
    }
    if (cardData.hp === 0) {
      cardElement.classList.add('fainted');
    }
  }
}
