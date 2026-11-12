let cardSummary = '***** Pokemon Kort *****\n';

let cardInput = prompt("Hvad er din Pokemons navn?");
cardSummary += 'Navn: ' + cardInput + '\n';

cardInput = prompt("Hvad er din Pokemons type?");
cardSummary += 'Type: ' + cardInput + '\n';

cardInput = prompt("Hvad er din Pokemons angreb?");
let skade = prompt("Hvor meget skade giver det?");
cardSummary += 'Angreb: ' + cardInput + ' skade(' + skade + ')\n';

cardSummary += '*************************';

alert(cardSummary);

// Ekstra
let hp = 100;
hp -= 30;
console.log(hp); // 70
hp += 10;
console.log(hp); // 80