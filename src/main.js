// Opret arrays
const players = ['Karsten', 'Inge', 'Villads', 'Vicky'];
const points = [10, 20, 30, 40];

// Ret og tilføj
players[1] = 'Ingrid';
players.push('Bodil');
console.log(players.length); // 5

// Opret indeks
let index = 2;

// Udskriv alert med navn og point
alert(`${players.at(index)} fik ${points.at(index)} point.`);

index = 4;
// skriver undefined i point, da der ikke er et point for Bodil
alert(`${players.at(index)} fik ${points.at(index)} point.`); 