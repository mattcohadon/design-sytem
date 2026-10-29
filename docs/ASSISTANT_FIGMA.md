# Assistant : écrire dans Figma (sur autorisation)

Par défaut l'assistant n'a aucun outil. Avec Claude, un interrupteur « Autoriser Figma pour cette demande » ouvre, pour cette seule demande, le serveur MCP de Figma et trois outils : `use_figma`, `get_screenshot`, `get_metadata`. L'interrupteur se referme après l'envoi.

## Mise en place (une fois)

1. `claude mcp add --transport http figma https://mcp.figma.com/mcp`
2. Dans un `claude` interactif, lancez `/mcp`, choisissez `figma` et connectez-vous.
3. Collez le lien du fichier Figma dans la demande : l'assistant ne travaille que dans ce fichier.

## À savoir

- Les écritures Figma ne passent pas par le diff de tokens : rien n'est à valider avant. Utilisez un fichier ou une page de travail.
- Le prompt interdit les suppressions et la page « Pas touch » ; ce n'est pas un contrôle technique.
- Délai porté à 10 minutes pour ces demandes.
