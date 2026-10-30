// Banc d'essai du périmètre « Design System uniquement » : appelle le vrai CLI Claude (quota, réseau).
// Usage : npm run test:scope [-- id1,id2]. Contexte volontairement vide : aucun token ni brief n'est envoyé.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { claudeArgs, instruction } from '../connectors/agents/claude.js';
import { guardReply } from '../connectors/agents/scope.js';
import { check, type Reply, type ScopeCase } from './scope-check.js';

const cases: ScopeCase[] = JSON.parse(
  readFileSync(
    new URL('../tests/fixtures/scope-cases.json', import.meta.url),
    'utf8',
  ),
);
const only = process.argv[2]?.split(',');
let failed = 0;
for (const c of cases.filter((x) => !only || only.includes(x.id))) {
  const r = spawnSync(
    'claude',
    [...claudeArgs, '--system-prompt', instruction],
    {
      input: JSON.stringify({
        context: { tokens: {}, brief: '', rules: '', history: [] },
        message: c.message,
      }),
      encoding: 'utf8',
      timeout: 170_000,
    },
  );
  let reply: Reply | undefined;
  try {
    const o = JSON.parse(r.stdout);
    reply = guardReply((o.structured_output ?? JSON.parse(o.result)) as Reply);
  } catch {
    /* sortie illisible : compté comme échec */
  }
  const problems = reply ? check(c, reply) : ['réponse illisible'];
  if (problems.length) failed++;
  console.log(
    `${problems.length ? 'ÉCHEC' : 'ok   '} ${c.kind.padEnd(10)} ${c.id}${problems.length ? ' : ' + problems.join(' ; ') : ''}`,
  );
  if (problems.length && reply)
    console.log('       ' + reply.message.slice(0, 240).replace(/\n/g, ' '));
}
console.log(`\n${cases.length - failed} / ${cases.length} conformes`);
process.exit(failed ? 1 : 0);
