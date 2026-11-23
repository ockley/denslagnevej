// Al kontakt med PokéAPI. Filen ved intet om HTML
import { API_URL, PLACEHOLDER_IMAGE } from './config.js';

const typeNames = {
  normal: 'Normal',
  fire: 'Ild',
  water: 'Vand',
  grass: 'Græs',
  electric: 'Elektrisk',
  ice: 'Is',
  fighting: 'Kamp',
  poison: 'Gift',
  ground: 'Jord',
  flying: 'Flyvende',
  psychic: 'Psykisk',
  bug: 'Insekt',
  rock: 'Sten',
  ghost: 'Spøgelse',
  dragon: 'Drage',
  dark: 'Mørke',
  steel: 'Stål',
  fairy: 'Fe',
};

// Henter en adresse og returnerer JSON, eller kaster en fejl, brugeren kan forstå
async function fetchJson(url, notFoundMessage) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    // fetch() fejler kun på denne måde, når der slet ikke er forbindelse
    throw new Error('Der er ingen forbindelse til nettet. Tjek din forbindelse, og prøv igen.');
  }

  if (!response.ok) {
    throw new Error(notFoundMessage);
  }

  return await response.json();
}

export async function fetchPokemon(nameOrId) {
  return await fetchJson(
    `${API_URL}/pokemon/${nameOrId}`,
    `Jeg kunne ikke finde "${nameOrId}". Tjek stavningen.`,
  );
}

export async function fetchList(count, start) {
  const data = await fetchJson(
    `${API_URL}/pokemon?limit=${count}&offset=${start}`,
    'Listen kunne ikke hentes.',
  );
  return data.results;
}

function getStat(data, statName) {
  return data.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0;
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

// Oversætter API'ets format til vores eget kortformat
export function toCard(data) {
  const hp = getStat(data, 'hp');
  const types = data.types.map((item) => typeNames[item.type.name] ?? item.type.name);

  return {
    id: data.id,
    name: capitalize(data.name),
    type: types[0],
    types: types,
    attack: data.moves[0]?.move.name ?? 'tackle',
    damage: getStat(data, 'attack'),
    hp: hp,
    maxHp: hp,
    image: data.sprites.front_default ?? PLACEHOLDER_IMAGE,
    height: data.height / 10, // API'et bruger decimeter
    weight: data.weight / 10, // og hektogram
    stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
  };
}
