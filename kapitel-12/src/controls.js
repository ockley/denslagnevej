// Lytterne til felterne og knapperne. Hver lytter følger opskriften: ændr, gem, tegn
import { changePage, startTeamBattle } from './actions.js';
import { clearTeam, resetAll, resetFilters, saveState, state } from './state.js';
import { elements, render, renderCollection, showBattle, syncControls } from './ui/render.js';

// Kobler et felt til en egenskab i state
function bindControl(element, eventName, key, readValue) {
  element.addEventListener(eventName, () => {
    state[key] = readValue(element);
    saveState();
    renderCollection();
  });
}

export function setupControls() {
  bindControl(elements.searchInput, 'input', 'search', (input) => input.value);
  bindControl(elements.typeSelect, 'change', 'typeFilter', (select) => select.value);
  bindControl(elements.sortSelect, 'change', 'sort', (select) => select.value);
  bindControl(elements.onlyFavoritesInput, 'change', 'showOnlyFavorites', (input) => input.checked);

  elements.resetFiltersButton.addEventListener('click', () => {
    resetFilters();
    syncControls();
    renderCollection();
  });

  elements.resetAllButton.addEventListener('click', () => {
    if (!confirm('Vil du slette dine favoritter, dit hold og dine filtre?')) return;

    resetAll();
    syncControls();
    showBattle('');
    render();
  });

  elements.resetTeamButton.addEventListener('click', () => {
    clearTeam();
    showBattle('');
    render();
  });

  elements.battleButton.addEventListener('click', startTeamBattle);
  elements.previousButton.addEventListener('click', () => changePage(-1));
  elements.nextButton.addEventListener('click', () => changePage(1));
}
