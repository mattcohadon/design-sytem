import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statefulIds, entryOf } from '../app/client/componentStates.js';
import { forceSelector } from '../app/client/preview/forcedSelectors.js';
import { manifest } from '../app/client/preview/manifest.js';

const ids = new Set(manifest.flatMap((f) => f.items.map((i) => i.id)));

test('états : chaque composant listé existe, commence au repos, sans doublon', () => {
  assert.ok(statefulIds.length >= 45);
  for (const id of statefulIds) {
    assert.ok(ids.has(id), `${id} n'est pas une page`);
    const labels = entryOf(id)!.states.map((s) => s.label);
    assert.equal(labels[0], 'Repos', id);
    assert.equal(new Set(labels).size, labels.length, `${id} : doublon`);
  }
});

test('états : les composants purement visuels n’ont pas de section', () => {
  for (const id of [
    'separator',
    'skeleton',
    'kbd',
    'badge',
    'avatar',
    'spinner',
  ])
    assert.equal(entryOf(id), undefined, id);
});

test('sélecteurs : un état se force par attribut, à spécificité égale', () => {
  assert.equal(forceSelector('.btn:hover'), '.btn[data-force-hover]');
  assert.equal(forceSelector('.btn:active'), '.btn[data-force-active]');
  assert.equal(forceSelector('.a:focus-visible'), '.a[data-force-focus]');
  assert.equal(forceSelector('.a:focus-within'), '.a[data-force-focus]');
  assert.equal(forceSelector('.a:disabled'), '.a[data-force-disabled]');
  // « group-hover » : l'attribut va sur l'élément parent, les enfants suivent.
  assert.equal(
    forceSelector('.x:is(:where(.group\\/b):hover *)'),
    '.x:is(:where(.group\\/b)[data-force-hover] *)',
  );
  assert.equal(forceSelector('.plain'), null);
  assert.equal(forceSelector('.a[aria-invalid="true"]'), null);
});
