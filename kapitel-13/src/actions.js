// Det, der sker, når brugeren gør noget, der kræver data eller regler.
// Filen kobler api.js, state.js, battle.js og visningen sammen
import { fetchList, fetchPokemon, toCard } from './api.js';
import { pickOpponents, teamBattle } from './battle.js';
import { PAGE_SIZE } from './config.js';
import { getTeam, session, state } from './state.js';
import {
  elements,
  render,
  renderTeam,
  showBattle,
  showDetail,
  showPageInfo,
  showStatus,
} from './ui/render.js';

export async function loadPage() {
  showStatus('Henter Pokémon ...');
  elements.previousButton.disabled = true;
  elements.nextButton.disabled = true;

  try {
    const list = await fetchList(PAGE_SIZE, session.offset);
    const allData = await Promise.all(list.map((pokemon) => fetchPokemon(pokemon.name)));

    session.cards = allData.map(toCard);
    render();
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    elements.previousButton.disabled = session.offset === 0;
    elements.nextButton.disabled = false;
    showPageInfo(session.offset + 1, session.offset + PAGE_SIZE);
  }
}

export function changePage(direction) {
  session.offset = Math.max(0, session.offset + direction * PAGE_SIZE);
  loadPage();
}

// Holdet er gemt som navne. Når siden starter, henter vi kortene til dem
export async function loadTeam() {
  if (state.team.length === 0) return;

  try {
    const allData = await Promise.all(state.team.map((name) => fetchPokemon(name.toLowerCase())));
    session.teamCards = allData.map(toCard);
    renderTeam();
  } catch (error) {
    showStatus(`Holdet kunne ikke hentes. ${error.message}`, true);
  }
}

export async function lookUp(text) {
  let query = text.trim().toLowerCase();

  if (query === '') {
    showStatus('Skriv et navn eller et nummer.', true);
    return;
  }

  // "025" skal virke som "25"
  if (!Number.isNaN(Number(query))) {
    query = String(Number(query));
  }

  showStatus('Henter ...');
  const button = elements.searchForm.querySelector('button');
  button.disabled = true;

  try {
    const data = await fetchPokemon(query);
    showDetail(toCard(data));
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    button.disabled = false;
    elements.searchNameInput.value = '';
  }
}

export function startTeamBattle() {
  const team = getTeam();
  const opponents = pickOpponents(session.cards, state.team, team.length);

  if (opponents.length === 0) {
    showBattle('Der er ingen modstandere at kæmpe mod på denne side.');
    return;
  }

  const result = teamBattle(team, opponents);
  const opponentNames = opponents.map((card) => card.name).join(', ');

  let text = 'Uafgjort!';
  if (result.winner === 'player') text = `Dit hold vandt over ${opponentNames}!`;
  if (result.winner === 'opponent') text = `${opponentNames} vandt over dit hold.`;

  showBattle(text, result.lines);
}
