import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  colorNames,
  contrast,
  displayValue,
  formatOklch,
  pairContrast,
  parseColor,
  tokenCss,
  tokenKeys,
  tokensSchema,
  toHex,
  withHex,
} from '../app/shared/model.js';

const seed = tokensSchema.parse(
  JSON.parse(
    await readFile(
      new URL('../workspace/design-system.tokens.json', import.meta.url),
      'utf8',
    ),
  ),
);

test('seed SortUI : 59 couleurs par mode, rayon et police', () => {
  assert.equal(colorNames.length, 59);
  assert.equal(tokenKeys.length, 120);
  assert.equal(seed['light.primary'].$value, 'oklch(0.585 0.233 277.117)');
  assert.equal(seed['dark.border'].$value, 'oklch(1 0 0 / 10%)');
  assert.equal(seed['radius.base'].$value, 10);
});

test('couleurs acceptées et refusées', () => {
  for (const ok of [
    'oklch(0.5 0.1 200)',
    'oklch(50% 0.1 200)',
    'oklch(1 0 0 / 10%)',
    'oklch(0.2 0.05 30deg / 0.4)',
    '#8A3B20',
  ])
    assert.ok(parseColor(ok), ok);
  for (const bad of [
    'red',
    '#FFF',
    'oklch(1.2 0 0)',
    'oklch(0.5 0.9 10)',
    'oklch(0.5 0.1 400)',
    'oklch(0.5 0.1 10 / 120%)',
    'rgb(0 0 0)',
    'oklch(0.5 0.1 10); background: url(x)',
  ])
    assert.equal(parseColor(bad), null, bad);
});

test('conversions OKLCH ↔ hex stables, alpha conservé par le sélecteur', () => {
  assert.equal(toHex('oklch(1 0 0)'), '#FFFFFF');
  assert.equal(toHex('oklch(0 0 0)'), '#000000');
  assert.equal(toHex(formatOklch(parseColor('#8A3B20')!)), '#8A3B20');
  const picked = withHex('oklch(0.145 0 0 / 10%)', '#3154C4');
  assert.match(picked, / \/ 10%\)$/);
  assert.equal(toHex(picked), '#3154C4');
});

test('contraste : alpha composé sur le fond, ratios WCAG connus', () => {
  assert.equal(contrast('#000000', '#FFFFFF'), 21);
  assert.equal(contrast('#123456', '#123456'), 1);
  // Noir à 0 % sur blanc = blanc sur blanc.
  assert.equal(contrast('oklch(0 0 0 / 0%)', '#FFFFFF'), 1);
  const primary = pairContrast(seed, 'light', [
    'primary-foreground',
    'primary',
  ]);
  assert.ok(primary > 4.5 && primary < 4.7, String(primary));
});

test('variables CSS SortUI par mode', () => {
  const light = tokenCss(seed, 'light');
  const dark = tokenCss(seed, 'dark');
  assert.equal(light['--background'], seed['light.background'].$value);
  assert.equal(dark['--background'], seed['dark.background'].$value);
  assert.equal(light['--radius'], '10px');
  assert.match(light['--font-sans'], /^system-ui/);
  assert.equal(Object.keys(light).length, colorNames.length + 2);
});

test('displayValue : #rrggbb en minuscules pour une couleur opaque, inchangé sinon', () => {
  assert.equal(displayValue('oklch(0 0 0)'), '#000000');
  assert.equal(displayValue('oklch(1 0 0)'), '#ffffff');
  assert.equal(
    displayValue('oklch(0.5 0.1 200 / 40%)'),
    'oklch(0.5 0.1 200 / 40%)',
  );
  assert.equal(displayValue('12'), '12');
});
