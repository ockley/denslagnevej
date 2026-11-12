const teamName = prompt("Hvad hedder dit hold?");

const cards = [
  { name: 'Dark Vaporeon', type: 'Vand', attack: 'Bite', damage: 30 },
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40 },
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 25 },
];

const newCardName = prompt("Hvilket kort vil du tilføje?");
const newCardType = prompt("Hvilken type er kortet?");
const newCardAttack = prompt("Hvilket angreb har kortet?");
const newCardDamage = Number(prompt("Hvor meget skade gør kortet?"));

cards.push({ name: newCardName, type: newCardType, attack: newCardAttack, damage: newCardDamage });

const totalDamage = cards[0].damage + cards[1].damage + cards[2].damage + cards[3].damage;
const averageDamage = totalDamage / cards.length;

console.table(cards);

const output = `***** Hold: ${teamName} *****
Antal kort: ${cards.length}
Samlet skade: ${totalDamage}
Gennemsnitlig skade: ${averageDamage.toFixed(1)}
****************************`;

alert(output);