import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parseSpec } from '../app/client/codeExtract.js';
import { docContent } from '../app/client/docContent.js';
import { docDetails } from '../app/client/docDetails.js';
import { manifest } from '../app/client/preview/manifest.js';

const ids = manifest.flatMap((f) => f.items.map((i) => i.id));
const ui = (id: string) => `app/client/sortui/components/ui/${id}.tsx`;

test('chaque page composant a sa description, et aucun contenu n’est orphelin', () => {
  for (const id of ids)
    assert.ok(docContent[id], `description manquante : ${id}`);
  for (const id of [...Object.keys(docContent), ...Object.keys(docDetails)])
    assert.ok(ids.includes(id), `contenu pour une page inconnue : ${id}`);
});

test('les sous-composants documentés existent dans le code du composant', () => {
  for (const [id, details] of Object.entries(docDetails)) {
    if (!details.parts) continue;
    // Les blocs n'ont pas de fichier ui : leurs parties ne sont pas listées.
    const exported = new Set(parseSpec(readFileSync(ui(id), 'utf8')).parts);
    for (const part of Object.keys(details.parts))
      assert.ok(exported.has(part), `${id} n'exporte pas ${part}`);
  }
});
