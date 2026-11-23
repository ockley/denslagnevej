// Appens tilstand, og hvordan den gemmes og ændres
import { MAX_TEAM_SIZE, STORAGE_KEY } from './config.js';

const defaultState = {
  favorites: [], // navne
  team: [], // navne
  search: '',
  typeFilter: 'Alle',
  sort: 'id',
  showOnlyFavorites: false,
};

function load(key, fallback) {
  const text = localStorage.getItem(key);

  if (text === null) {
    return fallback;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn(`Kunne ikke læse de gemte data for "${key}"`, error);
    return fallback;
  }
}

// Det, brugeren har valgt, og som bliver gemt.
// favorites og team får nye arrays, så de ikke deles med defaultState
export const state = { ...defaultState, favorites: [], team: [], ...load(STORAGE_KEY, {}) };

// Det, der hentes fra PokéAPI og derfor ikke gemmes
export const session = {
  cards: [], // den side, der er hentet lige nu
  teamCards: [], // kortene på holdet, som også kan ligge på andre sider
  offset: 0,
};

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetFilters() {
  state.search = defaultState.search;
  state.typeFilter = defaultState.typeFilter;
  state.sort = defaultState.sort;
  state.showOnlyFavorites = defaultState.showOnlyFavorites;
  saveState();
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, defaultState, { favorites: [], team: [] });
  session.teamCards = [];
}

export function toggleFavorite(name) {
  if (state.favorites.includes(name)) {
    state.favorites = state.favorites.filter((favorite) => favorite !== name);
  } else {
    state.favorites.push(name);
  }
  saveState();
}

export function isTeamFull() {
  return state.team.length >= MAX_TEAM_SIZE;
}

// Returnerer en besked til brugeren og en markering af, om det gik galt
export function addToTeam(card) {
  if (state.team.includes(card.name)) {
    return { message: `${card.name} er allerede på dit hold.`, isError: true };
  }

  if (isTeamFull()) {
    return {
      message: `Dit hold er fuldt. Der må højst være ${MAX_TEAM_SIZE} Pokémon.`,
      isError: true,
    };
  }

  state.team.push(card.name);
  session.teamCards.push(card);
  saveState();
  return { message: `${card.name} er kommet på holdet.`, isError: false };
}

export function removeFromTeam(name) {
  state.team = state.team.filter((teamName) => teamName !== name);
  session.teamCards = session.teamCards.filter((card) => card.name !== name);
  saveState();
}

export function clearTeam() {
  state.team = [];
  session.teamCards = [];
  saveState();
}

// Kortene i holdets rækkefølge
export function getTeam() {
  return state.team
    .map((name) => session.teamCards.find((card) => card.name === name))
    .filter((card) => card !== undefined);
}

// Søgning, filtre og sortering fra kapitel 8, nu styret af state
export function getVisibleCards() {
  const search = state.search.trim().toLowerCase();

  return session.cards
    .filter((card) => card.name.toLowerCase().includes(search))
    .filter((card) => state.typeFilter === 'Alle' || card.types.includes(state.typeFilter))
    .filter((card) => !state.showOnlyFavorites || state.favorites.includes(card.name))
    .sort((a, b) => {
      if (state.sort === 'name') return a.name.localeCompare(b.name, 'da');
      if (state.sort === 'damage') return b.damage - a.damage;
      if (state.sort === 'hp') return b.hp - a.hp;
      return a.id - b.id;
    });
}

export function findCard(id) {
  const allCards = [...session.cards, ...session.teamCards];
  return allCards.find((card) => card.id === id);
}
