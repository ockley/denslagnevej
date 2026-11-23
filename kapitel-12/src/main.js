// 12.7 Samleopgave: Ryd op
// main.js starter appen og kobler delene sammen
import './styles/base.css';
import './styles/layout.css';
import { loadPage, loadTeam, lookUp } from './actions.js';
import { setupControls } from './controls.js';
import { addToTeam, findCard, removeFromTeam, session, toggleFavorite } from './state.js';
import { elements, render, showDetail, showStatus, syncControls } from './ui/render.js';

elements.container.addEventListener('click', (event) => {
  const heart = event.target.closest('.favorite-button');
  const addButton = event.target.closest('.add-team-button');
  const cardElement = event.target.closest('.card');

  if (heart) {
    toggleFavorite(heart.dataset.name);
  } else if (addButton) {
    const result = addToTeam(session.cards.find((card) => card.name === addButton.dataset.name));
    showStatus(result.message, result.isError);
  } else if (cardElement) {
    showDetail(findCard(Number(cardElement.dataset.id)));
    return; // detaljepanelet ændrer ikke state, så der er intet at tegne
  }

  render();
});

elements.teamContainer.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-button');
  const cardElement = event.target.closest('.card');

  if (removeButton) {
    removeFromTeam(removeButton.dataset.name);
    render();
  } else if (cardElement) {
    showDetail(findCard(Number(cardElement.dataset.id)));
  }
});

elements.searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  lookUp(elements.searchNameInput.value);
});

setupControls();
syncControls();
render();
loadTeam();
loadPage();
