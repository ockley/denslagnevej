// Faste indstillinger for hele appen. Ret dem her, så gælder det alle steder

// PokéAPI
export const API_URL = 'https://pokeapi.co/api/v2';
export const PAGE_SIZE = 24;
export const MAX_STAT = 255; // den højeste værdi, en stat kan have

// Holdet og kampen
export const MAX_TEAM_SIZE = 6;
export const MAX_ROUNDS = 200;
export const EFFECTIVE_MULTIPLIER = 2;
export const CRITICAL_CHANCE = 0.2;
export const CRITICAL_MULTIPLIER = 1.5;

// Visning
export const LOW_HP_PERCENT = 30; // under denne grænse bliver bjælken rød
export const STATUS_DURATION = 3000; // millisekunder
export const PLACEHOLDER_IMAGE = '/placeholder.svg';

// Gemte data
export const STORAGE_KEY = 'pokedex-state';
