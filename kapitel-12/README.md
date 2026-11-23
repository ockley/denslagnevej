# Pokédex

En Pokédex, hvor du kan bladre i alle Pokémon, søge, filtrere og sortere, gemme dine favoritter og sætte dit eget hold sammen. Holdet kan kæmpe mod et tilfældigt hold.

Alle data og billeder kommer fra [PokéAPI](https://pokeapi.co/). Dine favoritter, dit hold og dine filtre bliver gemt i browseren med `localStorage`, så de er der endnu, næste gang du åbner siden.

Projektet er lavet som en del af forløbet *Den slagne vej*.

## Sådan kører du projektet

Du skal have [Node.js](https://nodejs.org/) installeret.

```bash
npm install
npm run dev
```

Åbn derefter adressen, som terminalen viser, typisk `http://localhost:5173`.

## Det kan appen

- Viser 24 Pokémon ad gangen og kan bladre frem og tilbage
- Slår en Pokémon op på navn eller nummer
- Søger, filtrerer på type og sorterer
- Viser detaljer med højde, vægt, typer og værdier
- Gemmer favoritter og et hold på op til seks Pokémon
- Lader holdet kæmpe mod et tilfældigt hold

## Bygget med

- JavaScript, HTML og CSS
- [Vite](https://vite.dev/)
- [PokéAPI](https://pokeapi.co/)
