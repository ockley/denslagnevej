const type = prompt('Hvilken type er din Pokémon?');
const cleanType = type.trim().toLowerCase();

if (cleanType === 'vand') {
  alert('Pas på elektriske angreb!');
}

// Ekstra: det hele i én linje
const quickType = prompt('Hvilken type er din Pokémon?').trim().toLowerCase();

if (cleanType === 'vand') {
  alert('Pas på elektriske angreb!'); 
}