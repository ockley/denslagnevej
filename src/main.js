const damage = Number(prompt('Hvor meget skade gør din Pokémons angreb?'));

// Variablen oprettes før blokken, så den kan bruges bagefter
let message;

if (damage > 30) {
    message = 'Stærkt angreb!';
} else {
    message = 'Almindeligt angreb!';
}

console.log(message);

let hp = 100;
const damageTaken = Number(prompt('Hvor meget skade har din Pokémon taget?'));

hp -= damageTaken;

if (hp > 50) {
  alert(`Frisk (${hp} livspoint tilbage)`);
} else if (hp > 0) {
  alert(`Såret (${hp} livspoint tilbage)`);
} else {
  alert('Besvimet');
}