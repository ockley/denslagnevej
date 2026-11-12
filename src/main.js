const fornavn = 'Karsten';
const efternavn = prompt('Hvad er dit efternavn?');

console.log(fornavn + ' ' + efternavn);

const tal1 = 10;
const tal2 = 5;
console.log(tal1 + tal2); // plus
console.log(tal1 - tal2); // minus
console.log(tal1 * tal2); // gange
console.log(tal1 / tal2); // division

const tekstTal = '10';
console.log(tekstTal + tal2); // skriver 105 i stedet for 15

const skade = Number(prompt('Hvor meget skade gør din Pokémons angreb?'));
console.log(typeof skade); // number

const kritiskSkade = skade * 2;
alert('Et kritisk angreb gør ' + kritiskSkade + ' i skade.');