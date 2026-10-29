import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSnapshot, type Fetcher } from '../figma-sync/snapshot.js';
import { diffSnapshots } from '../figma-sync/diff.js';
import { appendEntry } from '../figma-sync/changelog.js';
import {
  describe as sentence,
  markdown,
  tally,
} from '../figma-sync/describe.js';

const json = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) => new Response(JSON.stringify(body), { status, headers });

const fake: Fetcher = async (url) => {
  if (url.includes('/component_sets'))
    return json({
      meta: {
        component_sets: [
          { key: 's1', name: 'Button', node_id: '1:1', description: '' },
        ],
      },
    });
  if (url.includes('/components'))
    return json({
      meta: {
        components: [
          {
            key: 'c1',
            name: 'Variant=primary',
            containing_frame: { containingStateGroup: { name: 'Button' } },
          },
          { key: 'c2', name: 'Icon' },
        ],
      },
    });
  if (url.includes('/styles'))
    return json({
      meta: { styles: [{ key: 'st1', name: 'Fill', style_type: 'FILL' }] },
    });
  return json({
    nodes: {
      '1:1': {
        document: {
          componentPropertyDefinitions: {
            Variant: {
              type: 'VARIANT',
              defaultValue: 'primary',
              variantOptions: ['secondary', 'primary'],
            },
          },
          children: [
            { name: 'Variant=secondary' },
            { name: 'Variant=primary' },
          ],
        },
      },
    },
  });
};

test('snapshot : trié, sans variantes isolées, propriétés lues', async () => {
  const s = await buildSnapshot('t', 'F'.repeat(22), fake);
  assert.deepEqual(
    s.components.map((c) => c.key),
    ['c2'],
  );
  assert.deepEqual(s.componentSets[0].variants, [
    'Variant=primary',
    'Variant=secondary',
  ]);
  assert.deepEqual(s.componentSets[0].properties.Variant.options, [
    'primary',
    'secondary',
  ]);
});

test('snapshot : 403 explicite, 429 réessayé', async () => {
  await assert.rejects(
    buildSnapshot('t', 'k', async () => json({}, 403)),
    /403/,
  );
  let n = 0;
  const flaky: Fetcher = async (u, i) =>
    n++ === 0 ? json({}, 429, { 'retry-after': '0' }) : fake(u, i);
  assert.equal((await buildSnapshot('t', 'k', flaky)).styles.length, 1);
});

test('diff : vide, création, renommage et suppression cassants', async () => {
  const a = await buildSnapshot('t', 'k', fake);
  assert.equal(diffSnapshots(a, a).empty, true);
  assert.equal(
    diffSnapshots(null, a).changes.every((c) => c.action === 'created'),
    true,
  );
  const b = structuredClone(a);
  b.componentSets[0].name = 'Btn';
  b.componentSets[0].variants.pop();
  delete b.componentSets[0].properties.Variant;
  b.components = [];
  const d = diffSnapshots(a, b);
  const set = d.changes.find((c) => c.kind === 'componentSet')!;
  assert.equal(set.action, 'renamed');
  assert.equal(set.from, 'Button');
  assert.ok(set.details.includes('variante supprimée : Variant=secondary'));
  assert.ok(set.details.includes('propriété retirée : Variant'));
  assert.equal(
    d.changes.find((c) => c.kind === 'component')!.action,
    'deleted',
  );
  assert.ok(d.changes.every((c) => c.breaking));
});

test('changelog : une entrée par diff non vide, rien si vide', async () => {
  const a = await buildSnapshot('t', 'k', fake);
  const created = diffSnapshots(null, a);
  const log = appendEntry([], created, '2026-01-01T00:00:00.000Z');
  assert.equal(log.length, 1);
  assert.equal(log[0].date, '2026-01-01T00:00:00.000Z');
  assert.equal(log[0].changes.length, created.changes.length);
  assert.equal(
    log[0].changes.every((c) => c.action === 'created'),
    true,
  );
  assert.deepEqual(appendEntry(log, diffSnapshots(a, a)), log);
});

test('journal : phrases lisibles, décompte et bloc de PR', () => {
  const base = { details: [] as string[], breaking: false };
  const changes = [
    {
      kind: 'componentSet' as const,
      action: 'created' as const,
      name: 'Alert',
      ...base,
    },
    {
      kind: 'componentSet' as const,
      action: 'modified' as const,
      name: 'Button',
      details: ['variante ajoutée : ghost'],
      breaking: false,
    },
    {
      kind: 'componentSet' as const,
      action: 'renamed' as const,
      name: 'Toggle',
      from: 'Switch',
      details: [],
      breaking: true,
    },
    {
      kind: 'style' as const,
      action: 'deleted' as const,
      name: 'Fill',
      details: [],
      breaking: true,
    },
  ];
  assert.equal(sentence(changes[0]), 'Nouveau composant « Alert »');
  assert.equal(sentence(changes[1]), 'Composant « Button » modifié');
  assert.equal(
    sentence(changes[2]),
    'Composant « Switch » renommé en « Toggle »',
  );
  assert.equal(sentence(changes[3]), 'Style « Fill » supprimé');
  assert.equal(
    tally(changes),
    '1 ajout · 1 modification · 1 renommage · 1 suppression · 2 changements cassants',
  );
  assert.equal(tally(changes.slice(0, 1)), '1 ajout');
  const md = markdown(changes);
  assert.match(md, /## Entrée du Changelog/);
  assert.match(md, /- Nouveau composant « Alert »/);
  assert.match(md, /  - variante ajoutée : ghost/);
  assert.match(md, /- ⚠️ Composant « Switch » renommé en « Toggle »/);
  assert.equal(markdown([]), '');
});
