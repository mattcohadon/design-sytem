import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  colorNames,
  oklchToSrgb,
  parseColor,
  tokensSchema,
} from '../app/shared/model.js';
import {
  figmaChanges,
  loadFigmaConfig,
  type FigmaVariablesResponse,
} from '../connectors/figma/variables.js';

const seed = tokensSchema.parse(
  JSON.parse(
    await readFile(
      new URL('../workspace/design-system.tokens.json', import.meta.url),
      'utf8',
    ),
  ),
);
// Même conversion que l'export vers Figma (sRGB arrondi à 4 décimales).
const rgba = (v: string) => {
  const c = parseColor(v)!;
  const [r, g, b] = oklchToSrgb(c);
  // Figma stocke des float32 : 0.9901 revient en 0.9901000261306763.
  const k = (x: number) => Math.fround(Math.round(x * 10000) / 10000);
  return { r: k(r), g: k(g), b: k(b), a: k(c.alpha) };
};
/** Réponse REST simulée, fidèle aux variables créées dans Figma. */
function figmaFile(tokens = seed): FigmaVariablesResponse {
  const variables: FigmaVariablesResponse['meta']['variables'] = {};
  for (const name of colorNames)
    variables[`v-${name}`] = {
      name: `group/${name}`,
      variableCollectionId: 'c-colors',
      resolvedType: 'COLOR',
      valuesByMode: {
        'm-light': rgba(tokens[`light.${name}`].$value),
        'm-dark': rgba(tokens[`dark.${name}`].$value),
      },
    };
  variables['v-radius'] = {
    name: 'radius/base',
    variableCollectionId: 'c-base',
    resolvedType: 'FLOAT',
    valuesByMode: { 'm-value': tokens['radius.base'].$value },
  };
  variables['v-font'] = {
    name: 'font/sans',
    variableCollectionId: 'c-base',
    resolvedType: 'STRING',
    valuesByMode: { 'm-value': tokens['font.sans'].$value },
  };
  return {
    meta: {
      variables,
      variableCollections: {
        'c-colors': {
          name: 'DS-Studio · Couleurs',
          modes: [
            { modeId: 'm-light', name: 'Light' },
            { modeId: 'm-dark', name: 'Dark' },
          ],
        },
        'c-base': {
          name: 'DS-Studio · Base',
          modes: [{ modeId: 'm-value', name: 'Value' }],
        },
      },
    },
  };
}

test('fichier Figma inchangé : aucune proposition malgré la conversion sRGB', () => {
  assert.deepEqual(figmaChanges(seed, figmaFile()), {
    changes: [],
    ignored: [],
  });
});

test('seules les vraies différences remontent, au bon format', () => {
  const data = figmaFile();
  const v = data.meta.variables;
  (v['v-primary'].valuesByMode['m-light'] as object) = {
    r: 1,
    g: 0.5,
    b: 0,
    a: 1,
  };
  (v['v-border'].valuesByMode['m-dark'] as object) = {
    r: 1,
    g: 1,
    b: 1,
    a: 0.2,
  };
  v['v-radius'].valuesByMode['m-value'] = 12;
  v['v-font'].valuesByMode['m-value'] = 'Georgia';
  const { changes } = figmaChanges(seed, data);
  assert.deepEqual(changes.map((c) => c.key).sort(), [
    'dark.border',
    'font.sans',
    'light.primary',
    'radius.base',
  ]);
  assert.equal(
    changes.find((c) => c.key === 'light.primary')!.value,
    '#FF8000',
  );
  assert.match(
    String(changes.find((c) => c.key === 'dark.border')!.value),
    /^oklch\(1 0 0 \/ 20%\)$/,
  );
});

test('alias Figma résolus ; variables inconnues ignorées sans erreur', () => {
  const data = figmaFile();
  data.meta.variables['v-ring'].valuesByMode['m-light'] = {
    type: 'VARIABLE_ALIAS',
    id: 'v-primary',
  };
  data.meta.variables['v-extra'] = {
    name: 'brand/extra',
    variableCollectionId: 'c-colors',
    resolvedType: 'COLOR',
    valuesByMode: { 'm-light': { r: 0, g: 0, b: 0, a: 1 } },
  };
  const { changes, ignored } = figmaChanges(seed, data);
  assert.deepEqual(
    changes.map((c) => c.key),
    ['light.ring'],
  );
  assert.deepEqual(ignored, ['brand/extra']);
});

test('police hors liste ou collections absentes : refus explicite', () => {
  const data = figmaFile();
  data.meta.variables['v-font'].valuesByMode['m-value'] = 'Comic Sans';
  assert.throws(() => figmaChanges(seed, data), /font\/sans/);
  assert.throws(
    () =>
      figmaChanges(seed, { meta: { variables: {}, variableCollections: {} } }),
    /introuvables/,
  );
});

test('configuration : fichier privé lu, clé ou jeton invalide ignoré', async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'ds-figma-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  delete process.env.FIGMA_TOKEN;
  delete process.env.FIGMA_FILE_KEY;
  assert.equal(await loadFigmaConfig(dir), null);
  const key = 'b9693Sr72RWJUDUNfK2xuM';
  await writeFile(
    path.join(dir, 'figma.json'),
    JSON.stringify({ fileKey: key, token: ' t ' }),
  );
  assert.deepEqual(await loadFigmaConfig(dir), { fileKey: key, token: 't' });
  await writeFile(
    path.join(dir, 'figma.json'),
    JSON.stringify({ fileKey: '../x', token: 't' }),
  );
  assert.equal(await loadFigmaConfig(dir), null);
});
