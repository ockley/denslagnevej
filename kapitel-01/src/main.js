// 1.8 Samleopgave: Dit Pokémon-hold

// 1. Holdets navn
const teamName = prompt('Hvad skal dit hold hedde?');

// 2. Tre kort som objekter i et array
const cards = [
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40 },
  { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35 },
  { name: 'Squirtle', type: 'Vand', attack: 'Water Gun', damage: 30 },
];

// 3. Et fjerde kort fra brugeren. Number() sørger for, at skaden bliver et tal
cards.push({
  name: prompt('Hvad hedder dit fjerde kort?'),
  type: prompt('Hvilken type er det?'),
  attack: prompt('Hvad hedder angrebet?'),
  damage: Number(prompt('Hvor meget skade gør angrebet?')),
});

// 4. Samlet skade. Vi kan endnu ikke bruge løkker, så vi henter hvert kort med sit indeks
const totalDamage = cards[0].damage + cards[1].damage + cards[2].damage + cards[3].damage;

// 5. Gennemsnit. length i stedet for 4, så det stadig passer, hvis der kommer flere kort
const averageDamage = totalDamage / cards.length;

// 6. Holdet i konsollen
console.table(cards);

// 7. Opsummering over flere linjer med en template literal
alert(`***** Holdet: ${teamName} *****
Antal kort: ${cards.length}
Samlet skade: ${totalDamage}
Gennemsnitlig skade: ${averageDamage.toFixed(1)}
****************************`);
