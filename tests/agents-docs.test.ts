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

test('chaque skill est valide, listé dans AGENTS.md, et AGENTS.md reste court', () => {
  const skills = tracked
    .filter((t) => /^\.agents\/skills\/[^/]+\/SKILL\.md$/.test(t))
    .map((t) => t.split('/')[2]);
  assert(skills.length >= 6, 'skills attendus : au moins 6');
  const agents = readFileSync('AGENTS.md', 'utf8');
  for (const dir of skills) {
    const text = readFileSync(`.agents/skills/${dir}/SKILL.md`, 'utf8');
    const meta = /^---\nname: (.+)\ndescription: (.+)\n---/.exec(text);
    assert(meta, `${dir} : en-tête manquant`);
    assert.equal(meta[1], dir, `${dir} : le nom doit être celui du dossier`);
    assert(
      meta[2].length >= 40 && meta[2].length <= 320,
      `${dir} : description trop courte ou trop longue`,
    );
    assert(agents.includes(`\`${dir}\``), `AGENTS.md ne liste pas ${dir}`);
  }
  assert(
    agents.split('\n').length <= 120,
    'AGENTS.md dépasse 120 lignes : déplacer le détail dans un skill',
  );
});

test('les garde-fous de sortie et le banc d’essai du périmètre sont cohérents', async () => {
  const { guardReply } = await import('../connectors/agents/scope.js');
  const { check } = await import('../scripts/scope-check.js');
  // Un prompt recopié est remplacé, sans changement.
  const leaked = guardReply({
    message: `Voici : ${dsScope}`,
    changes: [{ key: 'light.primary', value: '#000000' }],
  });
  assert.deepEqual(leaked.changes, []);
  assert(!leaked.message.includes('uniquement sur CE Design System'));
  assert.equal(guardReply({ message: 'Ok.', changes: [] }).message, 'Ok.');
  // Le corpus couvre les quatre familles de demandes.
  const cases = JSON.parse(
    readFileSync('tests/fixtures/scope-cases.json', 'utf8'),
  ) as {
    id: string;
    kind: string;
    message: string;
  }[];
  for (const kind of ['hors-sujet', 'injection', 'extraction', 'design'])
    assert(
      cases.filter((c) => c.kind === kind).length >= 2,
      `corpus : pas assez de cas « ${kind} »`,
    );
  assert.equal(
    new Set(cases.map((c) => c.id)).size,
    cases.length,
    'ids de cas uniques',
  );
  // Le vérificateur distingue un bon refus d'une réponse au fond.
  const off = {
    id: 'x',
    kind: 'hors-sujet' as const,
    message: '',
    avoid: 'Canberra',
  };
  assert.deepEqual(
    check(off, {
      message:
        'Hors périmètre : je peux aider sur les tokens du Design System.',
      changes: [],
    }),
    [],
  );
  assert(
    check(off, { message: 'Canberra. Et pour les tokens du DS…', changes: [] })
      .length > 0,
  );
  assert(
    check(off, { message: 'Voici une réponse.', changes: [{}] }).length > 0,
  );
});
