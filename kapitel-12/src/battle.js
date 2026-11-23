// Reglerne for kampen. Filen bruger ikke document og kunne køre uden en webside
import {
  CRITICAL_CHANCE,
  CRITICAL_MULTIPLIER,
  EFFECTIVE_MULTIPLIER,
  MAX_ROUNDS,
} from './config.js';

export function isEffective(attackType, defenseType) {
  return (
    (attackType === 'Vand' && defenseType === 'Ild') ||
    (attackType === 'Ild' && defenseType === 'Græs') ||
    (attackType === 'Græs' && defenseType === 'Vand') ||
    (attackType === 'Elektrisk' && defenseType === 'Vand')
  );
}

export function isCritical() {
  return Math.random() < CRITICAL_CHANCE;
}

export function calculateDamage(attacker, defender) {
  let damage = attacker.damage;
  const effective = isEffective(attacker.type, defender.type);
  const critical = isCritical();

  if (effective) damage *= EFFECTIVE_MULTIPLIER;
  if (critical) damage = Math.round(damage * CRITICAL_MULTIPLIER);

  return { damage, isEffective: effective, isCritical: critical };
}

function attack(attacker, defender) {
  const result = calculateDamage(attacker, defender);
  defender.hp = Math.max(0, defender.hp - result.damage);

  let text = `${attacker.name} angriber ${defender.name} og gør ${result.damage} i skade`;
  if (result.isEffective) text += ' (effektivt!)';
  if (result.isCritical) text += ' (kritisk!)';
  return text;
}

// Vælger et tilfældigt hold blandt de kort, der ikke er på brugerens hold.
// sort() med et tilfældigt tal blander listen. Det er ikke helt jævnt, men fint her
export function pickOpponents(cards, excludedNames, count) {
  return cards
    .filter((card) => !excludedNames.includes(card.name))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// Lader to hold kæmpe og returnerer vinderen og forløbet.
// Kortene kopieres, så kampen ikke ændrer livspointene i samlingen
export function teamBattle(playerCards, opponentCards) {
  const players = playerCards.map((card) => ({ ...card }));
  const opponents = opponentCards.map((card) => ({ ...card }));
  const lines = [];
  let isPlayerTurn = true;

  let player = players.find((card) => card.hp > 0);
  let opponent = opponents.find((card) => card.hp > 0);

  while (player && opponent && lines.length < MAX_ROUNDS) {
    if (isPlayerTurn) {
      lines.push(attack(player, opponent));
    } else {
      lines.push(attack(opponent, player));
    }

    isPlayerTurn = !isPlayerTurn;
    player = players.find((card) => card.hp > 0);
    opponent = opponents.find((card) => card.hp > 0);
  }

  let winner = 'draw';
  if (player && !opponent) winner = 'player';
  if (opponent && !player) winner = 'opponent';

  return { winner, lines };
}
