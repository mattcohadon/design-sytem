# Contribuer

Merci d'avoir lu jusqu'ici. Le projet est un atelier local de Design System ; les
changements doivent rester petits et vérifiables.

## Avant d'ouvrir une PR

```sh
npm ci
npm run check && npm test && npm run build
npm run test:e2e   # si un parcours change (npx playwright install chromium)
npx prettier --check .
```

## Règles du DS

- Aucune couleur écrite en dur : tokens ou variables CSS. Un test le vérifie.
- Clair et sombre, contraste 4,5:1 (texte) et 3:1 (composants), états visibles,
  utilisable au clavier, widths 320 / 768 / 1440.
- Ne modifiez pas `.ds-studio/` (données locales) et ne commitez jamais de jeton.
  `npm run scan` cherche les secrets dans les fichiers suivis.

## Flux de travail

- Une branche par sujet, une PR par branche. Pas de poussée directe sur `main`.
- Les PR « Figma sync » sont ouvertes par le workflow : relisez-les, ne les réécrivez pas.
- Décisions utiles : `workspace/DECISIONS.md`. Architecture : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Pour reprendre le projet avec votre propre DS : [docs/REUSE.md](docs/REUSE.md).
Sécurité : [docs/SECURITY.md](docs/SECURITY.md).
