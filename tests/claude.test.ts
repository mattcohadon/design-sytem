import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  ClaudeAdapter,
  claudeArgs,
  claudeFigmaArgs,
  figmaServer,
  figmaTools,
  parseClaudeResult,
} from '../connectors/agents/claude.js';
import { tokensSchema } from '../app/shared/model.js';

const seed = tokensSchema.parse(
  JSON.parse(
    await readFile(
      new URL('../workspace/design-system.tokens.json', import.meta.url),
      'utf8',
    ),
  ),
);
const context = { tokens: seed, brief: '', rules: '', history: [] };
const skip =
  process.platform === 'win32' ? 'Faux CLI en script shebang' : false;

/** Faux `claude` : répond à --version / --help, sinon renvoie `output` et note ses entrées. */
async function fakeClaude(
  t: { after: (fn: () => Promise<void>) => void },
  output: unknown,
  help = '--tools --strict-mcp-config --setting-sources --no-session-persistence --json-schema',
) {
  const dir = await mkdtemp(path.join(tmpdir(), 'ds-fake-claude-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const log = path.join(dir, 'call.json');
  const bin = path.join(dir, 'claude');
  await writeFile(
    bin,
    `#!${process.execPath}
const fs = require('node:fs');
const args = process.argv.slice(2);
if (args[0] === '--version') { process.stdout.write('9.9.9 (Claude Code)'); process.exit(0); }
if (args[0] === '--help') { process.stdout.write(${JSON.stringify(help)}); process.exit(0); }
let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  fs.writeFileSync(${JSON.stringify(log)}, JSON.stringify({ args, input, cwd: process.cwd() }));
  process.stdout.write(${JSON.stringify(JSON.stringify(output))});
});
`,
  );
  await chmod(bin, 0o755);
  return { bin, call: async () => JSON.parse(await readFile(log, 'utf8')) };
}
const success = (reply: unknown) => ({
  type: 'result',
  subtype: 'success',
  is_error: false,
  permission_denials: [],
  structured_output: reply,
});

test('profil Claude : aucun outil, aucun MCP, aucun réglage, aucune permission large', () => {
  const at = (flag: string) => claudeArgs[claudeArgs.indexOf(flag) + 1];
  assert.equal(at('--tools'), '');
  assert.equal(at('--setting-sources'), '');
  assert.equal(at('--mcp-config'), '{"mcpServers":{}}');
  assert(claudeArgs.includes('--strict-mcp-config'));
  assert(claudeArgs.includes('--no-session-persistence'));
  assert(
    !claudeArgs.some((a) =>
      /dangerously|bypassPermissions|acceptEdits|--bare/.test(a),
    ),
  );
});

test('profil Figma : seul le serveur Figma et trois outils précis, rien d’autre ne change', () => {
  const at = (flag: string) =>
    claudeFigmaArgs[claudeFigmaArgs.indexOf(flag) + 1];
  assert.equal(at('--tools'), '');
  assert.equal(at('--setting-sources'), '');
  assert(claudeFigmaArgs.includes('--strict-mcp-config'));
  assert.deepEqual(Object.keys(JSON.parse(at('--mcp-config')).mcpServers), [
    figmaServer,
  ]);
  assert.equal(at('--allowedTools'), figmaTools.join(','));
  assert(figmaTools.every((t) => t.startsWith('mcp__plugin_figma_figma__')));
  assert(!figmaTools.some((t) => /delete|remove/i.test(t)));
  assert(
    !claudeFigmaArgs.some((a) =>
      /dangerously|bypassPermissions|acceptEdits|--bare/.test(a),
    ),
  );
  // Le profil sans autorisation reste fermé.
  assert(!claudeArgs.includes('--allowedTools'));
});

test(
  'CLI absent ou trop ancien : indisponible, mode manuel conservé',
  { skip },
  async (t) => {
    assert.equal(
      (await new ClaudeAdapter('ds-studio-missing-claude').status()).available,
      false,
    );
    const old = await fakeClaude(t, {}, '--print --model');
    const status = await new ClaudeAdapter(old.bin).status();
    assert.equal(status.available, false);
    assert.match(status.detail, /trop ancien/);
  },
);

test(
  'proposition multi-tokens : contexte par stdin, dossier vide hors dépôt',
  { skip },
  async (t) => {
    const fake = await fakeClaude(
      t,
      success({
        message: 'Palette plus chaude.',
        changes: [
          { key: 'light.primary', value: 'oklch(0.6 0.18 40)' },
          { key: 'dark.primary', value: 'oklch(0.7 0.16 40)' },
        ],
      }),
    );
    const reply = await new ClaudeAdapter(fake.bin).reply(
      'Réchauffe la marque',
      context,
    );
    assert.equal(reply.changes.length, 2);
    const call = await fake.call();
    assert.equal(call.args[call.args.indexOf('--tools') + 1], '');
    assert.match(JSON.parse(call.input).message, /Réchauffe/);
    assert.ok(JSON.parse(call.input).context.tokens['light.primary']);
    assert.ok(!call.cwd.startsWith(process.cwd()));
  },
);

test('erreur, outil tenté ou token inconnu : refus sans proposition', () => {
  assert.throws(
    () =>
      parseClaudeResult(
        JSON.stringify({
          type: 'result',
          is_error: true,
          result: 'OAuth expiré',
        }),
      ),
    /claude auth status/,
  );
  assert.throws(
    () =>
      parseClaudeResult(
        JSON.stringify({
          ...success({ message: '', changes: [] }),
          permission_denials: [{ tool_name: 'Bash' }],
        }),
      ),
    /outil/,
  );
  assert.throws(() =>
    parseClaudeResult(
      JSON.stringify(
        success({
          message: '',
          changes: [{ key: 'color.brand', value: '#000000' }],
        }),
      ),
    ),
  );
  assert.throws(() => parseClaudeResult('pas du JSON'), /illisible/);
});

test('réponse texte JSON (sans structured_output) acceptée', () => {
  const reply = parseClaudeResult(
    JSON.stringify({
      type: 'result',
      is_error: false,
      result: '```json\n{"message":"ok","changes":[]}\n```',
    }),
  );
  assert.deepEqual(reply, { message: 'ok', changes: [] });
});
