import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../app/client/', import.meta.url);

// Lecture statique : importer les démos exigerait un DOM.
async function demoIds(file: string, list: string) {
  const source = await readFile(new URL(file, root), 'utf8');
  const from = source.indexOf(`export const ${list}`);
  assert.ok(from >= 0, `${list} absent de ${file}`);
  return [...source.slice(from).matchAll(/^ {4,6}id: '([a-z0-9-]+)',$/gm)]
    .map((m) => m[1])
    .filter((id) => id !== list);
}

test('chaque composant et bloc SortUI importé a sa démonstration', async () => {
  const components = (await readdir(new URL('sortui/components/ui/', root)))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''));
  const blocks = await readdir(new URL('sortui/registry/blocks/', root));
  const demos = (
    await Promise.all(
      ['actions', 'forms', 'navigation', 'display', 'overlays', 'ai'].map((f) =>
        demoIds(`preview/demos/${f}.tsx`, f),
      ),
    )
  ).flat();
  assert.equal(components.length, 66);
  assert.equal(blocks.length, 7);
  assert.deepEqual([...demos].sort(), [...components].sort());
  assert.deepEqual(
    (await demoIds('preview/blocks.tsx', 'blocks')).sort(),
    [...blocks].sort(),
  );
});

test('la sidebar liste exactement les pages de composants et de blocs', async () => {
  const source = await readFile(new URL('preview/manifest.ts', root), 'utf8');
  const listed = [...source.matchAll(/^\s+id: '([a-z0-9-]+)',\n\s+title:/gm)]
    .map((m) => m[1])
    .filter(
      (id) =>
        !/^(actions|forms|navigation|display|overlays|ai|blocks)$/.test(id),
    );
  const demos = (
    await Promise.all([
      ...['actions', 'forms', 'navigation', 'display', 'overlays', 'ai'].map(
        (f) => demoIds(`preview/demos/${f}.tsx`, f),
      ),
      demoIds('preview/blocks.tsx', 'blocks'),
    ])
  ).flat();
  assert.equal(listed.length, 73);
  assert.deepEqual([...listed].sort(), [...demos].sort());
});
