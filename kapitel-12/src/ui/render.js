// Tegner siden ud fra state. Alle opslag i DOM'en ligger her
import { MAX_TEAM_SIZE, STATUS_DURATION } from '../config.js';
import { getTeam, getVisibleCards, isTeamFull, state } from '../state.js';
import { addActions, createCard, createDetail } from './card.js';

export const elements = {
  searchForm: document.querySelector('#search-form'),
  searchNameInput: document.querySelector('#search-name'),
  searchInput: document.querySelector('#search'),
  typeSelect: document.querySelector('#type-filter'),
  sortSelect: document.querySelector('#sort'),
  onlyFavoritesInput: document.querySelector('#only-favorites'),
  resetFiltersButton: document.querySelector('#reset-filters'),
  resetAllButton: document.querySelector('#reset-all'),
  container: document.querySelector('#card-container'),
  previousButton: document.querySelector('#previous'),
  nextButton: document.querySelector('#next'),
  teamContainer: document.querySelector('#team-container'),
  battleButton: document.querySelector('#battle'),
  resetTeamButton: document.querySelector('#reset-team'),
};

const statusElement = document.querySelector('#status');
const statsElement = document.querySelector('#stats');
const favoriteCount = document.querySelector('#favorite-count');
const detail = document.querySelector('#detail');
const pageInfo = document.querySelector('#page-info');
const teamStats = document.querySelector('#team-stats');
const battleResult = document.querySelector('#battle-result');
const battleLog = document.querySelector('#battle-log');

// ---------- Status ----------

let statusTimer = null;

export function showStatus(text, isError = false) {
  statusElement.textContent = text;
  statusElement.classList.toggle('is-error', isError);
  clearTimeout(statusTimer);

  // Fejl og "Henter ..." bliver stående. Andre beskeder forsvinder af sig selv
  if (!isError && text !== '' && !text.startsWith('Henter')) {
    statusTimer = setTimeout(() => {
      statusElement.textContent = '';
    }, STATUS_DURATION);
  }
}

// ---------- Samlingen ----------

function getEmptyText() {
  if (state.showOnlyFavorites && state.favorites.length === 0) {
    return 'Du har ingen favoritter endnu. Klik på ♡ på et kort for at gøre det til en favorit.';
  }
  if (state.showOnlyFavorites) {
    return 'Ingen af dine favoritter passer til søgningen på denne side.';
  }
  return 'Ingen kort fundet';
}

function createCollectionCard(card) {
  const cardElement = createCard(card);
  const isFavorite = state.favorites.includes(card.name);
  const isOnTeam = state.team.includes(card.name);

  addActions(
    cardElement,
    `
    <button class="favorite-button" data-name="${card.name}" aria-label="Favorit: ${card.name}" aria-pressed="${isFavorite}">${isFavorite ? '♥' : '♡'}</button>
    <button class="add-team-button" data-name="${card.name}">${isOnTeam ? 'På holdet' : 'Til holdet'}</button>
  `,
  );

  cardElement.classList.toggle('is-favorite', isFavorite);
  cardElement.querySelector('.add-team-button').disabled = isOnTeam || isTeamFull();

  return cardElement;
}

function renderStats(list) {
  const count = list.length;
  const totalDamage = list.reduce((sum, card) => sum + card.damage, 0);
  const averageDamage = count > 0 ? totalDamage / count : 0;
  const strongest = [...list].sort((a, b) => b.damage - a.damage)[0];

  statsElement.innerHTML = `
    <li><strong>${count}</strong> kort</li>
    <li><strong>${totalDamage}</strong> samlet skade</li>
    <li><strong>${averageDamage.toFixed(1)}</strong> gns. skade</li>
    <li><strong>${strongest?.name ?? '–'}</strong> stærkest</li>
  `;
}

export function renderCollection() {
  const list = getVisibleCards();
  favoriteCount.textContent = `(${state.favorites.length})`;

  if (list.length === 0) {
    elements.container.innerHTML = `<p class="empty">${getEmptyText()}</p>`;
  } else {
    elements.container.replaceChildren(...list.map(createCollectionCard));
  }

  renderStats(list);
}

// ---------- Holdet ----------

function getUniqueTypes(list) {
  const allTypes = [];
  list.forEach((card) => allTypes.push(...card.types));
  return allTypes.filter((type, index) => allTypes.indexOf(type) === index);
}

function createTeamCard(card) {
  const cardElement = createCard(card);
  addActions(
    cardElement,
    `<button class="remove-button secondary" data-name="${card.name}">Fjern</button>`,
  );
  return cardElement;
}

export function renderTeam() {
  const team = getTeam();

  if (team.length === 0) {
    elements.teamContainer.innerHTML =
      '<p class="empty">Dit hold er tomt. Tilføj Pokémon fra samlingen nedenfor.</p>';
  } else {
    elements.teamContainer.replaceChildren(...team.map(createTeamCard));
  }

  const totalDamage = team.reduce((sum, card) => sum + card.damage, 0);
  const totalHp = team.reduce((sum, card) => sum + card.maxHp, 0);
  const averageHp = team.length > 0 ? totalHp / team.length : 0;

  teamStats.innerHTML = `
    <li><strong>${team.length} / ${MAX_TEAM_SIZE}</strong> på holdet</li>
    <li><strong>${totalDamage}</strong> samlet skade</li>
    <li><strong>${averageHp.toFixed(1)}</strong> gns. livspoint</li>
    <li><strong>${getUniqueTypes(team).join(', ') || '–'}</strong> typer</li>
  `;

  elements.battleButton.disabled = team.length === 0;
  elements.resetTeamButton.disabled = team.length === 0;
}

export function render() {
  renderCollection();
  renderTeam();
}

// ---------- Resten ----------

export function showDetail(card) {
  detail.replaceChildren(...createDetail(card));
}

export function showBattle(text, lines = []) {
  battleResult.textContent = text;
  battleLog.replaceChildren(
    ...lines.map((line) => {
      const item = document.createElement('li');
      item.textContent = line;
      return item;
    }),
  );
}

export function showPageInfo(from, to) {
  pageInfo.textContent = `Nr. ${from}–${to}`;
}

// Sætter felterne ud fra state. Bruges ved start og efter nulstilling
export function syncControls() {
  elements.searchInput.value = state.search;
  elements.typeSelect.value = state.typeFilter;
  elements.sortSelect.value = state.sort;
  elements.onlyFavoritesInput.checked = state.showOnlyFavorites;
}
