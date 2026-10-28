# Synchro Figma → Pull Request

Publier la bibliothèque Figma ouvre une PR qui met à jour code et doc. Rien n'est jamais poussé sur `main`.

```
Publication Figma → webhook LIBRARY_PUBLISH → relais Cloudflare (relay/)
  → repository_dispatch → workflow figma-sync → snapshot + diff → Claude → PR
```

Périmètre : composants, variantes, propriétés et styles (API REST). Les valeurs des variables ne sont pas lisibles
sans plan Enterprise : la PR le rappelle quand Figma annonce des variables modifiées, et l'export reste manuel.

## Mise en place (une fois)

1. **GitHub → Settings → Actions → General** : cocher « Allow GitHub Actions to create and approve pull requests ».
2. **Secrets du dépôt** : `FIGMA_TOKEN` (lecture seule : `library_content:read`, `file_content:read`),
   `ANTHROPIC_API_KEY`. Variable du dépôt : `FIGMA_FILE_KEY`.
3. Facultatif : secret `PR_TOKEN` (jeton fine-grained limité à ce dépôt : Contents et Pull requests en écriture).
   Sans lui, la PR est créée par `GITHUB_TOKEN` et **la CI ne se lance pas dessus** (limite GitHub).
4. **Relais** : `cd relay && npm install`, puis `npx wrangler secret put` pour `FIGMA_PASSCODE`, `FIGMA_FILE_KEY`,
   `GITHUB_TOKEN` (fine-grained, ce dépôt seul, Contents: Read and write), puis `npm run deploy`.
5. **Webhook Figma** (jeton `webhooks:write`, à révoquer ensuite). Remplacez les trois valeurs entre `<>` :

```bash
curl -X POST https://api.figma.com/v2/webhooks \
  -H "X-Figma-Token: <JETON_WEBHOOKS_WRITE>" -H "Content-Type: application/json" \
  -d '{"event_type":"LIBRARY_PUBLISH","context":"team","context_id":"697200442559560521",
       "endpoint":"<URL_DU_WORKER>","passcode":"<PASSCODE_SECRET_100_CARACTERES_MAX>",
       "description":"DS sync"}'
```

Lister : `GET /v2/webhooks?context=team&context_id=<TEAM_ID>` (`webhooks:read`). Supprimer : `DELETE /v2/webhooks/<ID>`.

## Relance manuelle et test

- Actions → « Figma sync » → Run workflow. Sans changement depuis `figma-sync/snapshot.json` : aucune PR.
- En local : `FIGMA_TOKEN=… FIGMA_FILE_KEY=… npm run figma:snapshot`, puis
  `npm run figma:diff -- figma-sync/snapshot.json <nouveau>`.

## Débogage

- Figma : `GET /v2/webhooks/<ID>/requests` (7 derniers jours).
- GitHub : onglet Actions, workflow « Figma sync ».
- Relais : `npx wrangler tail`. Les logs ne contiennent aucun secret.
