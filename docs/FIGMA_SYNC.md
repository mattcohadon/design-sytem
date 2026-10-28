# Synchro Figma → Pull Request

Le workflow `figma-sync` interroge la bibliothèque Figma toutes les heures. S'il voit un changement, une PR met à jour
code et doc. Rien n'est jamais poussé sur `main`.

```
cron horaire (ou « Run workflow ») → snapshot Figma → diff avec figma-sync/snapshot.json
  → aucun changement : fin, pas de PR
  → changements : Claude adapte code + doc → PR (résumé, changements cassants, checklist « à reporter dans Figma »)
```

Périmètre : composants, variantes, propriétés et styles (API REST). Les valeurs des variables ne sont pas lisibles
sans plan Enterprise : leur export reste manuel.

## Mise en place (une fois)

1. **GitHub → Settings → Actions → General** : cocher « Allow GitHub Actions to create and approve pull requests ».
2. **Secrets du dépôt** : `FIGMA_TOKEN` (lecture seule : `library_content:read`, `file_content:read`),
   `ANTHROPIC_API_KEY`. **Variable** du dépôt : `FIGMA_FILE_KEY` (le segment après `/design/` dans l'URL du fichier).
3. Facultatif : secret `PR_TOKEN` (jeton fine-grained limité à ce dépôt : Contents et Pull requests en écriture).
   Sans lui, la PR est créée par `GITHUB_TOKEN` et **la CI ne se lance pas dessus** (limite GitHub).
4. Premier lancement : Actions → « Figma sync » → Run workflow. `figma-sync/snapshot.json` n'existe pas encore, donc tout
   apparaît « créé » : une PR d'amorçage s'ouvre. Relisez-la et fusionnez-la.

## Au quotidien

Publiez la bibliothèque dans Figma. Dans l'heure, ou tout de suite via « Run workflow », la PR s'ouvre si quelque
chose a changé. La fusion met `snapshot.json` à jour, donc le même changement ne rouvre pas de PR.

Limites : délai jusqu'à une heure (GitHub peut retarder les tâches planifiées) ; GitHub désactive les tâches planifiées
après 60 jours sans activité sur un dépôt public (réactivez-les dans l'onglet Actions).

## Test et débogage

- En local : `FIGMA_TOKEN=… FIGMA_FILE_KEY=… npm run figma:snapshot`, puis
  `npm run figma:diff -- figma-sync/snapshot.json <nouveau>` (`-` à la place de l'ancien snapshot si aucun).
- GitHub : onglet Actions, workflow « Figma sync », puis le résumé de l'exécution.
- Erreur 403 de Figma : le jeton n'a pas les bons scopes ou n'a pas accès au fichier.
