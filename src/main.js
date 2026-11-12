const damage = Number(prompt('Hvor meget skade gør din Pokémons angreb?'));

// Variablen oprettes før blokken, så den kan bruges bagefter
let message = 'Almindeligt angreb';

if (damage > 30) {
  message = 'Stærkt angreb!';
}

console.log(message); 