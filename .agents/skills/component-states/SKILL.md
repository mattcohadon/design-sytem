---
name: component-states
description: Ajouter ou corriger les états forcés (survol, appui, focus, désactivé, invalide, sélectionné) d'un composant interactif dans sa page de doc.
---

# États d'un composant

Chaque composant interactif montre ses états côte à côte ; ils sont **forcés par attribut** (`data-force-*`) sur
le vrai CSS du composant, pas simulés.

1. Ajouter une entrée dans le tableau de `app/client/componentStates.ts` : `{ states: [s('Repos'), s('Survol',
'hover'), …], selector?, first?, note? }`. `selector` limite les éléments qui reçoivent l'état ; `first: true`
   n'en cible qu'un (onglets, pages, jours) ; `note` explique les composants à déclencheur (fenêtres, menus).
2. Une démo à instance unique, si l'exemple de la page en montre plusieurs, va dans
   `app/client/preview/stateDemos.tsx` (clé = id du composant ; `variant: 'checked'` pour les états cochés).
3. La mécanique (réécriture des sélecteurs `:hover`, `:focus-visible`, etc.) est dans `preview/forcedSelectors.ts`
   et `preview/forcedStates.ts` : ne la modifiez que pour corriger un état qui ne se force pas.
4. Un état sans style propre est signalé « identique au repos » automatiquement : ne le dupliquez pas.
5. Vérifier : `tests/componentStates.test.ts`, puis le test e2e « les états sont forcés » ; regarder la page en
   clair et en sombre. Côté Figma, la propriété `interaction` du composant doit porter les mêmes noms d'états.
