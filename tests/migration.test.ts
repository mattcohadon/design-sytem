import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Store, restorePrevious } from '../app/server/store.js';
import { tokensSchema } from '../app/shared/model.js';

const seed = tokensSchema.parse(
  JSON.parse(
    await readFile(
      new URL('../workspace/design-system.tokens.json', import.meta.url),
      'utf8',
    ),
  ),
);
const v1Tokens = {
  'color.brand': { $type: 'color', $value: '#3154C4' },
  'color.brandHover': { $type: 'color', $value: '#243F99' },
  'color.onBrand': { $type: 'color', $value: '#FFFFFF' },
  'color.surface': { $type: 'color', $value: '#FFFFFF' },
  'color.canvas': { $type: 'color', $value: '#F3F5FA' },
  'color.text': { $type: 'color', $value: '#19243D' },
  'color.muted': { $type: 'color', $value: '#536078' },
  'color.border': { $type: 'color', $value: '#BCC5D6' },
  'color.danger': { $type: 'color', $value: '#B4233E' },
  'color.success': { $type: 'color', $value: '#18734B' },
  'color.focus': { $type: 'color', $value: '#7856C8' },
  'font.family': { $type: 'fontFamily', $value: 'system-ui' },
  'font.body': { $type: 'dimension', $value: 16 },
  'font.heading': { $type: 'dimension', $value: 28 },
  'space.sm': { $type: 'dimension', $value: 8 },
  'space.md': { $type: 'dimension', $value: 16 },
  'space.lg': { $type: 'dimension', $value: 24 },
  'radius.control': { $type: 'dimension', $value: 10 },
};
function v1State(overrides: Record<string, string | number> = {}) {
  const tokens = structuredClone(v1Tokens) as Record<
    string,
    { $type: string; $value: string | number }
  >;
  for (const [k, v] of Object.entries(overrides)) tokens[k].$value = v;
  return JSON.stringify(
    { version: 1, revision: 0, tokens, history: [] },
    null,
    2,
  );
}
async function dataDir(t: { after: (fn: () => Promise<void>) => void }) {
  const dir = await mkdtemp(path.join(tmpdir(), 'ds-migrate-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

test('V1 intacte : seed SortUI pur, original archivé tel quel', async (t) => {
  const dir = await dataDir(t);
  const raw = v1State();
  await writeFile(path.join(dir, 'state.json'), raw);
  const store = new Store(dir, seed);
  await store.init();
  const state = store.snapshot();
  assert.equal(state.version, 2);
  assert.equal(state.revision, 0);
  assert.deepEqual(state.tokens, seed);
  assert.ok(store.migratedFrom?.startsWith('state-v1-preserved-'));
  assert.equal(
    await readFile(path.join(dir, store.migratedFrom!), 'utf8'),
    raw,
  );
});

test('V1 personnalisée : valeurs reprises dans une révision « migration » annulable', async (t) => {
  const dir = await dataDir(t);
  await writeFile(
    path.join(dir, 'state.json'),
    v1State({ 'color.brand': '#8A3B20', 'radius.control': 14, 'space.md': 22 }),
  );
  const store = new Store(dir, seed);
  await store.init();
  const state = store.snapshot();
  assert.equal(state.revision, 1);
  assert.equal(state.history[0].source, 'migration');
  assert.equal(state.tokens['light.primary'].$value, '#8A3B20');
  assert.equal(state.tokens['light.sidebar-primary'].$value, '#8A3B20');
  assert.equal(state.tokens['radius.base'].$value, 14);
  assert.equal(
    state.tokens['dark.primary'].$value,
    seed['dark.primary'].$value,
  );
  // Le nouvel état se relit et la migration s’annule comme un changement ordinaire.
  const reopened = new Store(dir, seed);
  await reopened.init();
  assert.equal(reopened.migratedFrom, null);
  const undo = reopened.proposeUndo(1, state.history[0].id);
  await reopened.commit(undo.id);
  assert.deepEqual(reopened.snapshot().tokens, seed);
});

test('V1 invalide : refus sans écriture ni archive', async (t) => {
  const dir = await dataDir(t);
  const raw = JSON.stringify({
    version: 1,
    revision: 0,
    tokens: {},
    history: [],
  });
  await writeFile(path.join(dir, 'state.json'), raw);
  await assert.rejects(() => new Store(dir, seed).init(), /original préservé/);
  assert.equal(await readFile(path.join(dir, 'state.json'), 'utf8'), raw);
  assert.deepEqual(await readdir(dir), ['state.json']);
});

test('copie précédente V1 restaurable, migrée au démarrage suivant', async (t) => {
  const dir = await dataDir(t);
  const store = new Store(dir, seed);
  await store.init();
  await writeFile(
    path.join(dir, 'state.previous.json'),
    v1State({ 'color.brand': '#223355' }),
  );
  const restored = await restorePrevious(dir);
  assert.equal(restored.revision, 0);
  const reopened = new Store(dir, seed);
  await reopened.init();
  assert.equal(reopened.snapshot().tokens['light.primary'].$value, '#223355');
});
