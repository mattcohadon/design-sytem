# Assistant : écrire dans Figma (sur autorisation)

Par défaut l'assistant n'a aucun outil. Avec Claude, un interrupteur « Autoriser Figma pour cette demande » ouvre, pour cette seule demande, le serveur MCP de Figma et quatre outils : `create_session`, `use_figma`, `get_screenshot`, `get_metadata`. L'interrupteur se referme après l'envoi.

## Mise en place (une fois)

1. Installez le plugin Figma de Claude Code.
2. Dans un `claude` interactif, lancez `/mcp`, choisissez `plugin:figma:figma` et connectez-vous. L'assistant reprend ce nom de serveur pour retrouver la connexion.
3. Sans lien dans la demande, l'assistant travaille dans le fichier par défaut (`figmaDefaultFile` dans `connectors/agents/claude.ts`). Avec un lien, il travaille dans ce fichier.

## À savoir

- Les écritures Figma ne passent pas par le diff de tokens : rien n'est à valider avant. Utilisez un fichier ou une page de travail.
- Le prompt interdit les suppressions et la page « Pas touch » ; ce n'est pas un contrôle technique.
- Délai porté à 10 minutes pour ces demandes.
