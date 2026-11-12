const damage = 40;

const rating = damage > 30 ? 'Stærkt angreb!' : 'Svagt angreb';
console.log(rating);

console.log(`Angrebet gør ${damage} i skade (${damage > 30 ? 'stærkt' : 'svagt'})`);

// Ekstra
const wins = 3;
console.log(`${wins} ${wins === 1 ? 'sejr' : 'sejre'}`);