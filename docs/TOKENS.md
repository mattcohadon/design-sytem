# Tokens et échanges locaux

Depuis le passage à SortUI, le JSON reste à clés sémantiques plates, mais chaque
couleur existe pour deux modes (`light.*`, `dark.*`) avec les noms shadcn/SortUI :

```json
{
  "light.primary": { "$type": "color", "$value": "oklch(0.585 0.233 277.117)" }
}
```

Cet extrait n’est **pas un fichier complet importable**. Exportez le fichier complet
par l’application ou prenez `workspace/design-system.tokens.json` comme modèle.
Toutes ses clés doivent rester présentes, sans clé supplémentaire.

120 clés : 59 couleurs × 2 modes, `radius.base` (pixels, 0 à 128, dont dérive toute
l’échelle `rounded-*`) et `font.sans` (`system-ui`, `Arial`, `Georgia` ou `Verdana`).
Les couleurs sont `oklch(L C H)` ou `oklch(L C H / A%)` (L 0–1 ou %, C 0–0,5, H 0–360,
alpha facultatif) ; `#RRGGBB` reste accepté. Pas d’alias ni d’unités composées.
Ombres, tailles de texte et animations SortUI sont fixes dans `app/client/sortui.css`.

## Migration depuis V1

Un `.ds-studio/state.json` V1 (palette Lisière, 18 tokens) est migré au démarrage.
L’original est d’abord copié dans `.ds-studio/state-v1-preserved-….json`. Seules les
valeurs V1 que vous aviez modifiées sont reprises (marque → `light.primary`, fond,
texte, bordure, focus, rayon, police), dans une révision `migration` annulable.
`brandHover`, `success`, tailles et espacements n’ont pas d’équivalent et ne sont pas
repris. L’historique V1 reste lisible dans l’archive, pas dans l’application. Ce format reprend les noms
`$type/$value` mais ne prétend pas implémenter toute la spécification DTCG (notamment
la représentation normative de couleur et dimension). Aucun convertisseur Figma
n’est fourni. Un export de plugin tiers doit être converti explicitement.

## Importer une palette

Exporter les tokens, modifier une valeur dans le JSON, puis importer via l’interface.
Le schéma et les valeurs sont validés avant proposition. Le diff et l’acceptation
sont les mêmes qu’en mode manuel. Un fichier invalide ne change ni le journal ni
le seed. Le navigateur transmet le contenu, jamais un chemin de fichier à ouvrir.

## Ajouter un token dans le code

Déclarer la clé et sa validation dans `model.ts`, la valeur de seed, les usages CSS
ou React et un contrôle visible. Le schéma strict (version 2) ne migre pas automatiquement
les états créés avec une ancienne liste de clés : concevoir et tester une migration
(voir `app/server/migrate.ts`) avant de distribuer un changement de schéma. Ne pas effacer les données de l’étudiant.
