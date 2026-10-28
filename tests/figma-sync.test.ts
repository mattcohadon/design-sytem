import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSnapshot, type Fetcher } from '../figma-sync/snapshot.js';
import { diffSnapshots } from '../figma-sync/diff.js';

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
