import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { instruction, figmaInstruction } from '../connectors/agents/claude.js';
import { dsScope } from '../connectors/agents/scope.js';

const tracked = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' },
)
  .split('\n')
  .filter(Boolean);
const files = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];

test('les fichiers d’agents ne citent que des chemins qui existent', () => {
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const cited = [...text.matchAll(/`([^`\s]+\.(?:ts|tsx|md|json|yml))`/g)]
      .map((m) => m[1])
      .filter((p) => !p.includes('*') && !p.startsWith('.ds-studio'));
    for (const p of cited) {
      const found = tracked.some((t) => t === p || t.endsWith(`/${p}`));
      assert(found, `${file} cite « ${p} » qui n’existe pas`);
    }
  }
});

test('le périmètre « Design System uniquement » est dans les consignes', () => {
  assert.match(dsScope, /uniquement sur CE Design System/);
  assert.match(dsScope, /refuse en une phrase/);
  assert(instruction.includes(dsScope), 'prompt Claude sans périmètre');
  assert(figmaInstruction.includes('Pas touch'));
  assert(
    readFileSync('connectors/agents/codex.ts', 'utf8').includes('${dsScope}'),
    'prompt Codex sans périmètre',
  );
  assert.match(
    readFileSync('AGENTS.md', 'utf8'),
    /uniquement le Design System/,
  );
});
