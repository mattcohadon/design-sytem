# Réutiliser ce dépôt pour votre propre Design System

Stride UI est un atelier **local** : il tourne sur votre machine, sans serveur ni
compte. Cette page explique comment le reprendre pour **votre** DS. Pour l'usage
en classe, voir le [guide étudiant](STUDENT_GUIDE.md).

## 1. Récupérer le projet

Sur GitHub, **Use this template** (ou **Fork**), puis clonez votre copie. Gardez
votre dépôt **privé** tant que le travail n'est pas prêt à être montré.

Prérequis : **Node.js 22.12+** (voir [.nvmrc](../.nvmrc)), npm, un navigateur moderne.
Rien d'autre : ni Python, ni Docker, ni compte Figma ou IA pour démarrer.

```sh
npm ci
npm run doctor   # vérifie les prérequis, sans lire d'identifiants
npm run build
npm start
```

Ouvrez **http://127.0.0.1:4310** (pas `localhost`). Ctrl+C arrête le serveur.
Le lanceur à double-clic (`Stride-UI.app`, `.vbs`, `.desktop`) est un confort, pas
une obligation : voir le [README](../README.md#installer-et-lancer).

## 2. Mettre vos tokens à la place de SortUI

Les valeurs vivent dans `workspace/design-system.tokens.json` (120 clés : 59
couleurs en `light.*` et `dark.*`, `radius.base`, `font.sans`).

1. Lancez l'application, exportez les tokens depuis l'interface.
2. Modifiez les valeurs dans le JSON. **Toutes les clés doivent rester présentes,
   sans clé en plus.** Couleurs en `oklch(L C H)` ou `#RRGGBB`.
3. Réimportez-les dans l'interface : un **diff** s'affiche, rien n'est écrit
   avant votre acceptation, et chaque changement reste annulable.

Détails et limites : [TOKENS.md](TOKENS.md). Les ombres, tailles de texte et
animations sont fixes dans `app/client/sortui.css`.

Les composants (`app/client/sortui/`) sont ceux de SortUI (MIT). Les adapter à
votre marque passe d'abord par les tokens ; ne modifiez le code des composants
que si les tokens ne suffisent pas.

## 3. Brancher votre fichier Figma (facultatif)

La lecture seule suffit pour comparer et synchroniser.

1. Dans Figma : **Settings → Security → Personal access tokens**, scopes
   `file_content:read` et `library_content:read`.
2. `npm run figma:setup` (ou `pbpaste | npm run figma:setup -- "<lien du fichier>"`).
   Le jeton va dans `.ds-studio/figma.json`, jamais dans Git.
3. **Remplacez le fichier Figma d'origine** là où il est écrit en dur :
   - `connectors/agents/claude.ts` : `figmaDefaultFile` (fichier utilisé par
     l'assistant quand la demande n'en cite aucun) ;
   - `figma-sync/snapshot.json` : à supprimer, il sera recréé à la première synchro ;
   - `tests/figma.test.ts` : une clé d'exemple, à remplacer si vous la voulez à vous.

## 4. Synchro Figma → pull request (facultatif)

Chaque publication de votre bibliothèque ouvre une PR (code, doc et entrée de
Changelog). Mise en place en 4 étapes (permissions Actions, secrets
`FIGMA_TOKEN` et `CLAUDE_CODE_OAUTH_TOKEN`, variable `FIGMA_FILE_KEY`) :
[FIGMA_SYNC.md](FIGMA_SYNC.md).

À savoir avant d'activer :

- la synchro **consomme le quota de votre abonnement Claude** ;
- sans jeton `PR_TOKEN`, la CI ne se lance pas sur les PR de synchro ;
- rien n'est jamais poussé sur `main`.

## 5. Assistant IA (facultatif)

Le mode manuel fonctionne sans IA. Pour l'assistant intégré :

- **Claude** : avoir `claude` installé et connecté ;
- **Codex** : voir le [README](../README.md#codex-embarqué-facultatif) ;
- **Écrire dans Figma** depuis le chat : [ASSISTANT_FIGMA.md](ASSISTANT_FIGMA.md).
  Ces écritures **ne sont pas relues avant d'avoir lieu** : utilisez un fichier
  ou une page de travail.

L'assistant est limité au DS par ses consignes (`AGENTS.md`, `connectors/agents/scope.ts`).
C'est une consigne, pas un contrôle technique.

## 6. Avant de publier votre dépôt

- `npm run scan` : cherche des secrets dans les fichiers suivis par Git.
- `.ds-studio/` (vos données locales), `.env` et vos jetons restent **hors Git**.
- Mettez à jour le nom du produit, la licence et votre nom dans `LICENSE` et
  `package.json` (`name`, `description`, `license`, `repository`).
- Retirez ce qui concerne l'enseignement si vous n'en avez pas l'usage :
  `workspace/PFE.md`, `docs/TEACHER_GUIDE.md`, `START_HERE.md`.

## Vérifier que tout marche

```sh
npm run check && npm test && npm run build
npm run test:e2e   # nécessite : npx playwright install chromium
```

`npm run test:live` contacte un service IA et peut consommer du quota : ne le
lancez que si vous voulez qualifier Codex.
