// Opret kortdata
const cardData = {
  // Du kan bruge prompt() mens objektet bliver oprettet
  name: prompt("Hvad er din Pokemons navn?"),
  type: prompt("Hvad er din Pokemons type?"),
  attack: prompt("Hvad er din Pokemons angreb?"),
  damage: 0,
};

// Du kan også bruge prompt() efter objektet er oprettet
// Number() sørger for, at skaden bliver gemt som et tal
cardData.damage = Number(prompt("Hvad er din Pokemons skade?"));

// Lav opsummering af kortet i en template streng
const cardSummary = `***** Pokemon Kort *****
Navn: ${cardData.name}
Type: ${cardData.type}
Angreb: ${cardData.attack} (skade: ${cardData.damage})
*************************`;

// Vis kortopsummeringen i en alert
alert(cardSummary);