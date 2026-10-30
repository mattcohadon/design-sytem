# Claude Code

Lisez START_HERE.md et AGENTS.md : ce sont les instructions communes du projet.
Le chat Claude intégré (`connectors/agents/claude.ts`) ne propose que des tokens,
sans outils ni accès fichier, sauf l'interrupteur « Figma » activé pour une demande
(voir AGENTS.md). Il ne répond que sur le Design System (`connectors/agents/scope.ts`). Vous pouvez modifier le starter depuis votre
terminal avec vos propres permissions : c’est un autre usage, pas l’adaptateur
embarqué. Claude Code ne découvre pas `.agents/skills/` tout seul : lisez explicitement le skill utile
(`token-change`, `document-component`, `component-states`, `component-audit`, `figma-sync-review`, `safe-recovery`).
Pour mesurer le périmètre de l'assistant intégré : `npm run test:scope` (vrai appel, consomme du quota). N’importez aucun cache de compte.

## Synchro Figma → PR

Quand le workflow `figma-sync` vous appelle, lisez `docs/FIGMA_SYNC.md` et le skill
`.agents/skills/figma-sync-review/SKILL.md` : nommage Figma → code, fichiers interdits, « À reporter dans Figma ».
