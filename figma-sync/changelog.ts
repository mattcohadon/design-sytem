import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Diff } from './diff.js';
import { markdown, type LogChange } from './describe.js';

// Journal des synchros Figma, affiché dans la page Changelog : une entrée par PR de synchro.
export interface FigmaLogEntry {
  date: string;
  changes: LogChange[];
}

export function appendEntry(
  log: FigmaLogEntry[],
  diff: Diff,
  date = new Date().toISOString(),
): FigmaLogEntry[] {
  if (diff.empty) return log;
  const changes = diff.changes.map(
    ({ kind, action, name, from, details, breaking }) => ({
      kind,
      action,
      name,
      ...(from ? { from } : {}),
      details,
      breaking,
    }),
  );
  return [...log, { date, changes }];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  // `--markdown <diff.json>` : affiche le bloc de la PR sans toucher au journal.
  if (args[0] === '--markdown') {
    const diff = JSON.parse(await readFile(args[1], 'utf8')) as Diff;
    process.stdout.write(
      appendEntry([], diff)[0]
        ? markdown(appendEntry([], diff)[0].changes)
        : '',
    );
    process.exit(0);
  }
  const [diffPath, logPath = 'figma-sync/changelog.json'] = args;
  if (!diffPath) {
    console.error('Usage : changelog.ts <diff.json> [changelog.json]');
    process.exit(1);
  }
  const diff = JSON.parse(await readFile(diffPath, 'utf8')) as Diff;
  const log = JSON.parse(
    await readFile(logPath, 'utf8').catch(() => '[]'),
  ) as FigmaLogEntry[];
  await writeFile(
    logPath,
    JSON.stringify(appendEntry(log, diff), null, 2) + '\n',
  );
}
