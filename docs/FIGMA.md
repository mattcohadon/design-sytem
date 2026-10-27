# Figma : source de vérité réelle, pas intégration simulée

**Lecture des variables : IMPLEMENTED, essai réel en attente du jeton.** Le bouton
« Sync Figma » lit les variables d’un fichier autorisé (API REST officielle, lecture
seule) et prépare un diff ; rien n’est appliqué sans validation humaine. **Écriture
vers Figma : NOT IMPLEMENTED.** Les outils Figma d’une session de développement ne
sont pas distribués avec ce starter et ne constituent pas une connexion de l’application.

## Sync Figma (lecture seule)

1. Figma > Settings > Security > Personal access tokens : créer un jeton avec le seul
   droit `file_variables:read`. L’API des variables exige un espace Enterprise et un
   siège complet sur le fichier.
2. `npm run figma:setup` demande le lien du fichier et le jeton (masqué) et les écrit
   dans `.ds-studio/figma.json` (mode 600, hors Git). `FIGMA_TOKEN` et `FIGMA_FILE_KEY`
   sont aussi acceptés. Redémarrer DS-Studio ; l’en-tête affiche alors Figma connecté.
3. **Sync Figma** appelle `GET /v1/files/:key/variables/local`, compare les collections
   « DS-Studio · Couleurs » (modes Light / Dark) et « DS-Studio · Base » (`radius/base`,
   `font/sans`) à l’état courant, et ne propose que les tokens réellement différents,
   avec la source « Figma » dans l’historique. Les alias sont résolus, les variables
   inconnues sont ignorées, une police hors liste est refusée.
4. Figma stocke du sRGB : deux couleurs sont égales à un demi-niveau 8 bits près, donc
   un fichier inchangé ne propose rien. Une couleur modifiée dans Figma revient en
   `#RRGGBB` (ou OKLCH avec opacité), pas en OKLCH d’origine.

Le jeton ne quitte jamais la machine sauf vers `api.figma.com` et n’apparaît dans aucun
message d’erreur. Testé : parseur sur les valeurs réelles du fichier (0 écart, retouche
simulée détectée), route HTTP avec Figma simulé. Non testé : appel réseau réel.

La [documentation Figma officielle du serveur distant](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
indique que seuls les clients du catalogue autorisé peuvent se connecter. Un
nouveau client doit passer par la procédure d’admission. DS-Studio n’est pas déclaré
client autorisé. Ne jamais usurper un client, extraire un jeton, réutiliser une session
Codex ou recopier des cookies pour contourner cette restriction.

## Parcours réaliste aujourd’hui

1. Garder votre DS réel dans Figma et identifier son périmètre de travail.
2. Exporter volontairement des données non sensibles par un moyen autorisé dont
   vous contrôlez les droits. Ne pas confondre un export de composants avec leur
   comportement responsive dans du code.
3. Convertir explicitement les tokens vers le [format local](TOKENS.md), puis importer
   le fichier dans DS-Studio et accepter le diff. V2 ne fournit pas ce convertisseur.
4. Tester vos décisions localement. Exporter les tokens courants pour documenter un
   rapprochement manuel avec Figma. L’export ne modifie pas votre fichier Figma.

Le JSON local constitue le mode autonome démontré, pas une synchronisation bidirectionnelle.
Les plans, limites et droits d’édition réels devront être contrôlés pour chaque étudiant.
Pas de polling automatique Figma prévu et aucune gratuité permanente promise.

## Intégration future : contrat, pas code opérationnel

`connectors/figma/contract.ts` sépare lecture, proposition et application validée.
Une réalisation doit :

- Employer un client officiellement autorisé et l’OAuth officiel propre à l’étudiant.
  Tester d’abord une lecture minimale d’un **fichier de test explicitement autorisé**.
- Définir une liste autorisée de fichier et variables, avec une révision de départ.
  Échouer si la cible, les droits ou la révision diffèrent.
- Préparer un diff structuré, afficher l’impact et obtenir une validation humaine
  liée au hash de la proposition, à la cible et à la révision, à usage unique.
- Recontrôler les droits et la révision juste avant l’écriture, limiter l’opération,
  relire les valeurs après exécution et garder une trace d’audit sans secret.
- En cas de timeout, relire avant toute nouvelle tentative pour ne pas doubler une
  écriture. Prévoir refus, annulation, révocation et restauration sur une copie.

L’agent de discussion ne doit jamais disposer simultanément d’un MCP Figma libre.
Un simple skill « demande confirmation » ne constitue pas une barrière. Conserver
les outils distants derrière le contrôleur, ou rester non connecté si le fournisseur
ne permet pas ce contrôle. Le contrat TypeScript ne met pas en œuvre ces garanties.

Le serveur officiel dispose d’outils d’écriture ; ne pas supposer qu’un accès MCP
est en lecture seule. Les [outils officiels](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
et les [droits et limites](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)
seront à relire lors de la connexion, car ils peuvent évoluer.
