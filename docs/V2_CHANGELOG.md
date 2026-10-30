# V2.0.0 — changements et portée

## V1.1 → V2

| Domaine           | V1.1                                  | V2                                                                                       |
| ----------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Manuel            | Édition, diff, validation, historique | Conservés ; session renouvelable et conflits visibles avant validation                   |
| PFE               | Fichiers workspace seulement          | Brief privé configurable et export Markdown, sans compte                                 |
| Tokens            | Sélection et saisie brute             | Recherche, couleur visuelle, dimensions typées et brouillon récupérable                  |
| Données           | État atomique sans copie précédente   | Copie précédente complète, restauration confirmée et original archivé                    |
| Processus         | Serveur enfant avec pipes du panneau  | Processus détaché et journal privé indépendant                                           |
| Tests             | CI V1.1 en échec sur trois OS         | Cas portables, tests de crash, de brief et de reprise réelle ; résultats dans le rapport |
| Figma / autres IA | Non implémentés                       | Toujours non implémentés, aucune fausse connexion                                        |

## Problèmes résolus

- Test Node dépendant des installations du runner : sonde réelle conservée et
  branches utilisateur/absence contrôlées sur copie isolée du script.
- Serveur lié aux pipes du panneau ; processus et descripteur de journal désormais
  indépendants. Le contrôle reste fondé sur une identité privée et un bail exclusif.
- Réponse de statut asynchrone pouvant réinjecter un ancien état pendant une action :
  génération d’opération vérifiée avant de modifier l’état du panneau.
- Lecture des données désormais bornée et refus des liens vérifié aussi avant commit.
- Perte du brouillon à la recharge ; capacité HTTP périmée après restart ; absence
  de secours de données. Les propositions expirées exigent toujours un nouveau diff.

## Fonctionnalités ajoutées

Brief privé avec contrôle de conflit, lien Figma validé mais non téléchargé,
export Markdown ; recherche, sélecteur de couleur et contraste proposé immédiat ; brouillon par onglet avec
abandon explicite ; accès clavier direct et navigation des panneaux ; blocage du
diff périmé ; sauvegarde de la révision précédente et restauration guidée.

## Décisions techniques

Pas de nouvelle dépendance. React/TypeScript, Node HTTP et Zod conservés. Deux
petits modules serveur partagent la lecture privée et l’écriture atomique. Le
schéma des tokens reste version 1 : les données V1.1 restent lisibles et le seed
modifié ne réinitialise jamais un état existant. Le brief est indépendant des
révisions du DS et reste ignoré par Git. Le chat Codex reçoit le brief privé lors
d’un envoi explicite ; sa restriction sans outils et sa version qualifiée restent
inchangées. Le bootstrap manuel ne lance plus aucun CLI.

Le journal serveur emploie un descripteur fichier plutôt que des pipes appartenant
au contrôleur ; comportement conforme au modèle de processus détachés de Node.
Références primaires : [processus enfants Node](https://nodejs.org/api/child_process.html#optionsdetached),
[écritures et synchronisation Node](https://nodejs.org/docs/latest-v22.x/api/fs.html).

## Tests exécutés

Plusieurs passes locales : TypeScript/build, suites store/API/agents, navigateur,
préparation npm réelle sur copie propre, cycles arrêt/redémarrage, concurrence,
crash serveur et panneau, crash pendant rafale de commits, restauration et
conservation après changement de seed. Une erreur de synchronisation du test de
Tab (avant montage React) a été reproduite et corrigée en attendant la vraie UI,
sans supprimer le contrôle clavier. Le scan a signalé une URL de credentials
**fictive dans un test** ; fixture reformulée, aucune exception de scan ajoutée.

La première CI V2 a aussi identifié une hypothèse POSIX dans le harness Windows :
`child.kill('SIGTERM')` y termine de force. Le test Windows emploie maintenant
l’arrêt HTTP privé réel, toujours avec contrôle de libération du verrou. Le wrapper
terminal ne transforme plus le Ctrl+C Windows en kill forcé du serveur enfant ;
le geste de console natif reste à tester sur un poste Windows.

La seconde CI V2, [40420840720](https://github.com/ElGrandeXu/DS-Studio/actions/runs/40420840720),
a réussi intégralement sur Ubuntu, macOS et Windows. Aucun contrôle natif
Finder/Windows Script Host n’en est déduit.

Comptages, résultats CI et limites exactes : [rapport de livraison](DELIVERY_REPORT.md).
Un scénario simulé de capacité expirée est complété par un onglet réel conservé
pendant un redémarrage processus dans la suite des lanceurs.

## Limitations

Node/npm restent des prérequis externes. Les wrappers non signés Finder et Windows
Script Host peuvent être bloqués par les protections locales ; la CI ne valide
pas leur acceptation graphique. Pas de contournement proposé. La copie précédente
ne remplace pas une sauvegarde externe ; pas de garantie contre panne électrique.
Après restauration vers une révision plus ancienne, recharger les onglets. Le
brouillon ne garantit pas la reprise après fermeture du navigateur. Le brief
privé s’enregistre explicitement ; un rechargement demandé avant sauvegarde perd
ses modifications non enregistrées. Pas d’audit WCAG complet, de test Safari/Firefox
ou de nouvelle qualification cloud Codex pendant cette livraison.

## Design System SortUI

- Les composants maison (bouton, carte, formulaire, navigation) sont remplacés par
  les 66 composants et 7 blocs de [SortUI](https://sortui.dev) (MIT), copiés dans
  `app/client/sortui/` avec Tailwind CSS v4 et Base UI.
- Tokens v2 : 59 couleurs OKLCH par mode clair / sombre, `radius.base`, `font.sans`.
  L’éditeur filtre par mode, convertit le sélecteur de couleur en OKLCH et contrôle
  onze paires de contraste en composant l’opacité sur le fond.
- Catalogue et scénarios rendus en iframe (`?preview=1`), isolés du chrome de l’atelier.
  Nouveaux scénarios : assistant (blocs chat), accueil assistant, widgets.
- Migration automatique et archivée des états V1 (voir [TOKENS](TOKENS.md)).

## Synchro Figma

- Composant Figma `Alert` (nouveau dans la bibliothèque) : rattaché au composant existant
  `alert.tsx` et à sa démo, sans modification de code. Aucune variante ni propriété
  ajoutée côté code (écarts : propriété `Flip Icon`, correspondance `Type` → `variant`).

## Page d'accueil

- Nouvelle landing : pastille « Nouveau », titre « Un design system fidèle à son code. », deux actions,
  six arguments (chacun mène à la page qui le prouve), parcours « Du Figma au code » en trois étapes,
  trois blocs en aperçu et une carte « Voir tous les blocs », FAQ de cinq questions, puis la liste complète.
- Le contenu suit la grille de la barre de navigation (`max-w-6xl`) ; pas de barre latérale sur l'accueil.
- Les chiffres cités (composants, tokens) sont calculés depuis le projet, pas écrits à la main.
- À fournir : quatre images (une en 16/9, trois en 4/3), emplacements « Image à fournir » dans
  `app/client/LandingSections.tsx`.
- Limite : vérifiée sur ordinateur ; mobile contrôlé en haut de page seulement.

## États des composants

- 47 composants interactifs ont une section « États » : repos, survol, appui, focus clavier, désactivé,
  invalide, sélectionné. Les états sont forcés par attribut (`data-force-*`) sur le vrai CSS du composant.
  Les fenêtres et menus montrent les états de leur déclencheur, avec une note.
- Table des états : `app/client/componentStates.ts` ; test dédié dans `tests/componentStates.test.ts`.
- Côté Figma : 37 ensembles ont une propriété `interaction` alignée sur ces états. Button n'y est pas encore
  (page « Pas touch »), et plusieurs valeurs de survol sont estimées.

## Assistant Figma

- Avec Claude, l'interrupteur « Figma » de la barre d'assistant autorise l'écriture
  dans Figma (serveur `plugin:figma:figma`, quatre outils). Il reste activé d'une demande à l'autre jusqu'à ce que l'utilisateur le coupe. Sans lien dans la
  demande, l'assistant travaille dans le fichier par défaut `figmaDefaultFile`.
- La réponse confirme ce qui est fait et redonne toujours un lien Figma ; les réponses sont mises en forme
  (Markdown sans HTML injecté) et la conversation peut être agrandie.
- Éditeur de tokens : les couleurs opaques s'affichent en `#rrggbb` ; les couleurs avec opacité restent en OKLCH.
- Mise en place et limites : [ASSISTANT_FIGMA](ASSISTANT_FIGMA.md). Les interdits (suppression, page
  « Pas touch ») sont dans le prompt seulement ; aucune relecture avant écriture. Testé à la main une fois
  (page de test créée) ; les tests automatiques couvrent le profil, le lien et l'interface, pas Figma.
