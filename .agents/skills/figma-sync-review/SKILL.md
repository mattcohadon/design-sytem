---
name: figma-sync-review
description: Relire ou préparer une PR de synchro Figma du Design System : ce qui change, changements cassants, ce qu'il faut reporter dans Figma.
---

# Synchro Figma

À lire avec `docs/FIGMA_SYNC.md`. Le workflow `figma-sync` compare l'état de la bibliothèque Figma au snapshot et
ouvre une PR sur la branche unique `figma-sync`.

- **Ne modifiez jamais** `figma-sync/snapshot.json`, `diff.json`, `diff.md` ni `changelog.json` : le workflow les écrit.
- Nommage : `Famille/Composant/Variante/Taille` donne un composant en kebab-case ; `Variant=Primary` →
  `variant="default"`, `Size=Large` → `size="lg"`. N'inventez aucune variante ni propriété absente du diff.
- Le comportement et l'accessibilité du code font foi ; Figma fait foi pour l'apparence. Ce que le code change et
  que Figma possède va dans « À reporter dans Figma » (cases à cocher).
- Mettre à jour les démos (`app/client/preview/demos/`, `manifest.ts`) et `docs/V2_CHANGELOG.md` ; garder
  `tests/catalogue.test.ts`, `npm run build` et `npm test` verts.
- Ambiguïté : la signaler dans la PR (« Incertitudes »), ne pas deviner. Les valeurs des variables ne sont pas
  lisibles par l'API de lecture : ne les recopiez pas.
- Jamais d'écriture dans la page Figma « Pas touch ».
