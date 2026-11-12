const attacker = { name: 'Dark Vaporeon', type: 'Vand', attack: 'Bite', damage: 30 };
const defender = { name: 'Charmander', type: 'Ild', attack: 'Ember', damage: 35 };

const isEffective =
  (attacker.type === 'Vand' && defender.type === 'Ild') ||
  (attacker.type === 'Ild' && defender.type === 'Græs') ||
  (attacker.type === 'Græs' && defender.type === 'Vand');

let damage = attacker.damage;

if (isEffective) {
  damage *= 2;
}

if (!isEffective) {
  console.log('Angrebet var ikke særligt effektivt');
}

alert(`${attacker.name} angriber ${defender.name} med ${attacker.attack} og gør ${damage} i skade.`);