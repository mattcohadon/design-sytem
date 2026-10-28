# Claude Code

Lisez START_HERE.md et AGENTS.md : ce sont les instructions communes du projet.
Le chat Claude intégré (`connectors/agents/claude.ts`) ne propose que des tokens,
sans outils ni accès fichier. Vous pouvez modifier le starter depuis votre
terminal avec vos propres permissions : c’est un autre usage, pas l’adaptateur
embarqué. Pour les tokens, lisez explicitement
`.agents/skills/token-change/SKILL.md`. N’importez aucun cache de compte.

## Synchro Figma → PR

Quand le workflow `figma-sync` vous appelle, suivez `docs/FIGMA_SYNC.md` et ces conventions.
Nommage Figma → code : `Famille/Composant/Variante/Taille` donne un composant en kebab-case,
`Variant=Primary` → `variant="default"` (voir `buttonVariants`), `Size=Large` → `size="lg"`.
Composants : `app/client/sortui/components/ui/`. Doc : démos `app/client/preview/demos/`, `preview/manifest.ts`
(gardez `tests/catalogue.test.ts` vert), `docs/V2_CHANGELOG.md`. Ne touchez jamais `figma-sync/snapshot.json`.
Comportement et accessibilité du code font foi ; Figma fait foi pour l’apparence. Ce que le code change
et que Figma possède va dans « À reporter dans Figma ».
