---
name: document-component
description: Ajouter ou mettre à jour la page de doc d'un composant ou d'un bloc du Design System (démo, entrée de menu, contenu éditorial, règles d'usage) sans casser le catalogue.
---

# Documenter un composant

La page d'un composant lit ses variantes, dépendances et tokens dans le code ; seul le contenu éditorial s'écrit
à la main. Étapes, dans cet ordre :

1. **Composant** : `app/client/sortui/components/ui/<id>.tsx` (SortUI, importé). N'y changez que ce qui est
   nécessaire ; jamais pour un simple style (utiliser les tokens).
2. **Démo** : un objet `{ id, title, render }` dans `app/client/preview/demos/<famille>.tsx`
   (`actions`, `forms`, `navigation`, `display`, `overlays`, `ai`) ou `preview/blocks.tsx` pour un bloc.
   L'`id` est en kebab-case.
3. **Menu** : l'entrée correspondante dans `app/client/preview/manifest.ts`, dans la même famille.
4. **Contenu** : `docContent.ts` (`summary`, `use`, `avoid`, `a11y`), puis si utile `docDetails.ts`
   (`parts`, `props` en `[nom, type, description]`, `tips`) et `dosDonts.ts` (cas `c(quand, faire, éviter)`).
   Texte en français, phrases courtes, un verbe et son objet pour les libellés.
5. **États** : si le composant est interactif, voir le skill `component-states`.
6. **Tests** : `tests/catalogue.test.ts` compte les composants (66), les blocs (7) et les entrées du menu (73) :
   mettez ces nombres à jour si vous en ajoutez. Lancer `npm test`, `npm run build`, `npm run test:e2e`.
7. **Journal** : une ligne dans `docs/V2_CHANGELOG.md`.

Contrôles avant de rendre la main : page lisible en clair et en sombre, clavier, 320 / 768 / 1440 px,
aucune couleur en dur. Un exemple copiable doit fonctionner tel quel.
