import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Un token change, tout suit : hors des fichiers qui définissent les valeurs, aucune couleur en dur.
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', 'app/client'],
  { encoding: 'utf8' },
)
  .split('\n')
  .filter(
    (f) =>
      /\.(tsx|ts)$/.test(f) &&
      !f.startsWith('app/client/sortui/') &&
      !/(docDetails|dosDonts|docContent)\.ts$/.test(f),
  );

test('aucune classe Tailwind ni style en ligne avec une couleur hexadécimale', () => {
  const bad: string[] = [];
  for (const f of files) {
    readFileSync(f, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (
          /\[#[0-9a-fA-F]{3,8}\]/.test(line) ||
          /:\s*['"]#[0-9a-fA-F]{3,8}['"]/.test(line)
        )
          bad.push(`${f}:${i + 1}`);
      });
  }
  assert.deepEqual(bad, [], `couleurs en dur : ${bad.join(', ')}`);
});
