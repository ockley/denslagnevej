// 2.9 Samleopgave: Kampen

// 1. Fire kort med livspoint (hp)
const cards = [
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40, hp: 60 },
  { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35, hp: 65 },
  { name: 'Squirtle', type: 'Vand', attack: 'Water Gun', damage: 30, hp: 70 },
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 30, hp: 75 },
];

// 2. Vis kortene i prompten og lad brugeren vælge et tal fra 1 til 4
const answer = prompt(`Vælg din Pokémon:
1: ${cards[0].name} (${cards[0].type})
2: ${cards[1].name} (${cards[1].type})
3: ${cards[2].name} (${cards[2].type})
4: ${cards[3].name} (${cards[3].type})`);

// 3. Tjek svaret. Vi kan ikke stoppe programmet midtvejs endnu,
// så vi gemmer i isValid, om svaret duer, og kører kun kampen, hvis det gør
const choice = Number(answer);
let isValid = true;
let errorMessage = '';

if (answer === null) {
  isValid = false;
  errorMessage = 'Du annullerede, så der blev ingen kamp.';
} else if (answer.trim() === '') {
  isValid = false;
  errorMessage = 'Du skrev ikke noget.';
} else if (Number.isNaN(choice)) {
  isValid = false;
  errorMessage = `"${answer}" er ikke et tal.`;
} else if (choice < 1 || choice > 4) {
  isValid = false;
  errorMessage = 'Du skal vælge et tal fra 1 til 4.';
}

if (isValid) {
  // Brugeren tænker i 1 til 4, arrayet i 0 til 3
  const player = cards[choice - 1];

  // 4. Tilfældig modstander
  const opponent = cards[Math.floor(Math.random() * cards.length)];

  // Livspointene gemmes i egne variable, så kortene i arrayet ikke bliver ændret
  let playerHp = player.hp;
  let opponentHp = opponent.hp;

  // 5. Spillerens angreb. Er det effektivt, gør det dobbelt skade
  const playerIsEffective =
    (player.type === 'Vand' && opponent.type === 'Ild') ||
    (player.type === 'Ild' && opponent.type === 'Græs') ||
    (player.type === 'Græs' && opponent.type === 'Vand') ||
    (player.type === 'Elektrisk' && opponent.type === 'Vand');

  let playerDamage = player.damage;
  if (playerIsEffective) {
    playerDamage *= 2;
  }

  // 6. Ekstra: 20 % chance for et kritisk angreb
  const playerIsCritical = Math.random() < 0.2;
  if (playerIsCritical) {
    playerDamage = Math.round(playerDamage * 1.5);
  }

  // Modstanderens angreb. Den samme kode igen, bare med rollerne byttet om.
  // I kapitel 4 lærer du at skrive den én gang i en funktion
  const opponentIsEffective =
    (opponent.type === 'Vand' && player.type === 'Ild') ||
    (opponent.type === 'Ild' && player.type === 'Græs') ||
    (opponent.type === 'Græs' && player.type === 'Vand') ||
    (opponent.type === 'Elektrisk' && player.type === 'Vand');

  let opponentDamage = opponent.damage;
  if (opponentIsEffective) {
    opponentDamage *= 2;
  }

  const opponentIsCritical = Math.random() < 0.2;
  if (opponentIsCritical) {
    opponentDamage = Math.round(opponentDamage * 1.5);
  }

  // 7. Træk skaden fra. Livspointene må ikke blive negative
  opponentHp -= playerDamage;
  playerHp -= opponentDamage;

  if (opponentHp < 0) {
    opponentHp = 0;
  }
  if (playerHp < 0) {
    playerHp = 0;
  }

  // 8. Find vinderen
  let result = 'Uafgjort!';
  if (playerHp > opponentHp) {
    result = 'Du vandt!';
  } else if (opponentHp > playerHp) {
    result = 'Computeren vandt!';
  }

  // Små tekster til forløbet. Ternary operatoren fra 2.7 vælger mellem to tekster
  const playerNote = `${playerIsEffective ? ' (effektivt!)' : ''}${playerIsCritical ? ' (kritisk!)' : ''}`;
  const opponentNote = `${opponentIsEffective ? ' (effektivt!)' : ''}${opponentIsCritical ? ' (kritisk!)' : ''}`;

  // 9. Vis kampens forløb
  alert(`***** Kampen *****
Du: ${player.name} (${player.type}) – ${player.hp} HP
Computer: ${opponent.name} (${opponent.type}) – ${opponent.hp} HP

${player.name} bruger ${player.attack}: ${playerDamage} i skade${playerNote}
${opponent.name} bruger ${opponent.attack}: ${opponentDamage} i skade${opponentNote}

${player.name} har ${playerHp} HP tilbage
${opponent.name} har ${opponentHp} HP tilbage

${result}
******************`);
} else {
  alert(errorMessage);
}
