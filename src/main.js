const damage = 30;

console.log(damage >= 30); // true
console.log(damage === 30); // true
console.log(damage !== 30); // false

const isStrong = damage > 25;
console.log(isStrong); // true
console.log(typeof isStrong); // boolean

console.log('30' === 30); // false – tekst og tal er ikke ens
console.log('Vand' === 'vand'); // false – store og små bogstaver tæller