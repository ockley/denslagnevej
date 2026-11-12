const cards = [
  { name: 'Dark Vaporeon', type: 'Vand', attack: 'Bite', damage: 30 },
  { name: 'Pikachu', type: 'Elektrisk', attack: 'Thunderbolt', damage: 40 },
  { name: 'Bulbasaur', type: 'Græs', attack: 'Vine Whip', damage: 25 },
];

console.table(cards);
console.log(cards[0].name); // Dark Vaporeon
console.log(cards.at(-1).damage); // 25

cards.push({ name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35 });
console.table(cards);

const card = cards[1];
alert(`${card.name} (${card.type}) angriber med ${card.attack} og gør ${card.damage} i skade.`);