# Den slagne vej – løsninger

Her ligger mine løsningsforslag til samleopgaverne i forløbet *Den slagne vej*. Hver mappe er et helt Vite-projekt, der kan køre for sig selv, og hvert kapitel bygger videre på det forrige. Slutningen af et kapitel er altså starten på det næste.

Prøv altid selv først. Det er i forsøget, du lærer mest, også når det ikke lykkes. Brug derefter løsningen til at sammenligne: Hvad gjorde jeg anderledes, og hvorfor?

Der er mange rigtige måder at løse opgaverne på. Min løsning er bare én af dem.

## Kapitlerne

| Kapitel | Samleopgave | Kode | Prøv i browseren |
| --- | --- | --- | --- |
| 1 | Dit Pokémon-hold | [kapitel-01](kapitel-01) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-01) |
| 2 | Kampen | [kapitel-02](kapitel-02) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-02) |
| 3 | Pokémon-kortet | [kapitel-03](kapitel-03) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-03) |
| 4 | Kampen med funktioner | [kapitel-04](kapitel-04) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-04) |
| 5 | Kampen til sidste livspoint | [kapitel-05](kapitel-05) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-05) |
| 6 | Kortbyggeren | [kapitel-06](kapitel-06) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-06) |
| 7 | Kampen med knapper | [kapitel-07](kapitel-07) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-07) |
| 8 | Samlingen | [kapitel-08](kapitel-08) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-08) |
| 9 | Pokédex | [kapitel-09](kapitel-09) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-09) |
| 10 | Mit hold | [kapitel-10](kapitel-10) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-10) |
| 11 | Tre små forbedringer | [kapitel-11](kapitel-11) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-11) |
| 12 | Ryd op | [kapitel-12](kapitel-12) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-12) |
| 13 | Online | [kapitel-13](kapitel-13) | [StackBlitz](https://stackblitz.com/github/ockley/denslagnevej/tree/main/kapitel-13) |

Kapitel 14 er dit eget projekt, så der er ingen løsning til det.

## Sådan kører du et kapitel på din egen computer

1. Hent projektet med den grønne knap **Code** og **Download ZIP**, eller klon det med Git.
2. Åbn mappen med det kapitel, du vil se, i VS Code, f.eks. `kapitel-07`.
3. Skriv i terminalen:

```bash
npm install
npm run dev
```

Kapitel 1 til 5 skriver i konsollen og bruger `prompt()` og `alert()`, så åbn udviklerværktøjerne, når siden kører.

## Hvis du vil udgive kapitel 13 på Netlify

Repositoryet indeholder alle kapitlerne, så Netlify skal vide, hvilken mappe projektet ligger i. Sæt **Base directory** til `kapitel-13` under indstillingerne for dit site. Resten står i `kapitel-13/netlify.toml`.
