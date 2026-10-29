# Adaptateurs d’agents

## Contrat commun

`connectors/agents/types.ts` définit `status()` et `reply(message, context, signal)`.
Entrée : tokens structurés, contexte PFE, règles et dix messages précédents maximum.
Sortie : `{message, changes:[{key,value}]}` validée par Zod. L’adaptateur ne reçoit
pas de Store et ne peut pas accepter une proposition. Le contrôleur HTTP prépare
le diff avec la révision de départ ; l’UI décide de sa validation humaine.

Les conversations de fournisseurs ne sont pas reprises ni mélangées. Le chat embarqué
est en mémoire dans le navigateur ; après recharge l’historique affiché est vide.
Les refus, délais et interruptions n’entraînent aucun renvoi automatique ni commit.
Pas d’orchestration parallèle de plusieurs agents dans la V2 : architecture multi-fournisseurs,
un fournisseur intégré et qualifié, deux points d’extension indisponibles.

## Codex — TESTED sous Linux avec 0.164.0

Le CLI officiel fournit `exec --json`, `--ephemeral` et `--ignore-user-config`.
Ce dernier ignore la configuration globale mais conserve la gestion officielle de
l’authentification. Référence : [official OpenAI documentation — CLI](https://learn.chatgpt.com/docs/cli/reference).
L’activation des outils shell est une option documentée ; le profil du starter la
désactive ainsi que les plugins, apps, MCP et la recherche web.
[Configuration officielle](https://learn.chatgpt.com/docs/config-file/config-reference).

Le processus n’est pas lancé dans le dépôt : un dossier temporaire vide évite de
charger la configuration du projet. Pas de shell interpolé : arguments en liste,
prompt via stdin. Authentification par `codex login`, effectuée par l’utilisateur.
Le starter ne déduit pas la validité d’une session de l’existence d’un fichier.
La disponibilité initiale signifie seulement binaire/version détectés ; le compte,
le réseau et le quota sont réellement sollicités à l’envoi. Délai maximum 120 s.

Choix : `exec` plutôt qu’app-server réduit les RPC, sessions et approbations à
maintenir pour ce profil à propositions seules. Le flux manuel reste indépendant.
Le protocole et la version ont été exécutés, pas seulement décrits. Pour changer
la version acceptée, refaire le smoke test, le test hostile, le refus sans auth,
la proposition/validation via API et les essais sur chaque OS cible.

## Claude Code — TESTED sous macOS avec 2.1.311

`connectors/agents/claude.ts` lance `claude -p --output-format json` avec :

- `--tools ""` : aucun outil (ni fichier, ni shell, ni web) ;
- `--strict-mcp-config --mcp-config '{"mcpServers":{}}'` : aucun serveur MCP ;
- `--setting-sources ""` : aucun réglage utilisateur ou projet, donc ni hooks ni plugins ;
- `--no-session-persistence` : conversation non conservée par le CLI ;
- `--json-schema` : réponse `{message, changes}` imposée, `key` limitée aux 120 tokens.

**Exception Figma (profil `claudeFigmaArgs`).** Quand l'utilisateur active l'interrupteur « Figma » pour une
demande, `--mcp-config` déclare le seul serveur `plugin:figma:figma` et `--allowedTools` limite l'accès à
`create_session`, `use_figma`, `get_screenshot` et `get_metadata`. Le reste du profil est identique, la
sortie reste validée, tout refus d'outil (`permission_denials`) reste une erreur, et le délai passe de 3 à
10 minutes. Réponse complétée d'un lien Figma (`withFigmaLink`). Testé à la main une fois (page créée) ;
les tests automatiques couvrent le profil et le lien, pas Figma. Voir [ASSISTANT_FIGMA](ASSISTANT_FIGMA.md).

Le processus tourne dans un dossier temporaire vide, avec une liste blanche de
variables d’environnement ; le contexte passe par stdin. `--bare` n’est pas utilisé :
il refuse l’authentification OAuth du CLI. Le CLI est accepté sur ses capacités
(options présentes dans `--help`), pas sur une version figée, car il se met à jour
seul. Une réponse en erreur, illisible, avec un outil tenté ou un token inconnu est
refusée sans proposition. Les propositions portent la source `claude` et passent par
le même diff et la même validation humaine que le mode manuel.

Authentification : `claude auth login`, faite par l’utilisateur ; `claude auth status`
pour vérifier. Tests : `tests/claude.test.ts` (faux CLI) et `tests/http.test.ts`.
Essai réel (27/10/2026, macOS, CLI 2.1.311, compte claude.ai) : sans connexion, refus
en moins d’une seconde avec « vérifiez claude auth status » et aucune écriture ;
connecté, une demande « primaire plus chaleureuse » rend en 22 s une proposition de
6 tokens (clair et sombre, barre latérale incluse), source `claude`, révision
inchangée avant validation. Les ratios annoncés par Claude (5,2 / 6,4 / 2,8:1)
concordent avec `contrast()`. Non testé : quota épuisé, Windows et Linux.

## Gemini CLI — NOT IMPLEMENTED

Point d’extension : `unvalidatedAdapter('gemini')`. La [référence headless officielle](https://geminicli.com/docs/cli/headless/)
présente JSON/stream-json. L’authentification et les callbacks de permissions restent
à éprouver dans un vrai processus embarqué. Ne pas utiliser de mode yolo ou
supposer qu’un login étudiant permet un usage gratuit sans quota. Même série de
tests que Claude avant d’exposer un bouton actif.
