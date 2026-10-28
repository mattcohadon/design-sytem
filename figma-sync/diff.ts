import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Snapshot, SnapshotSet } from './snapshot.js';

// Compare deux snapshots. Un renommage garde la même clé Figma : c'est un renommage, pas une suppression.
export interface Change {
  kind: 'component' | 'componentSet' | 'style';
  action: 'created' | 'deleted' | 'renamed' | 'modified';
  key: string;
  name: string;
  from?: string;
  details: string[];
  breaking: boolean;
}
export interface Diff {
  empty: boolean;
  changes: Change[];
}

const empty: Snapshot = {
  fileKey: '',
  components: [],
  componentSets: [],
  styles: [],
};

function setDetails(
  a: SnapshotSet,
  b: SnapshotSet,
): { details: string[]; breaking: boolean } {
  const details: string[] = [];
  let breaking = false;
  const added = (n: string[], o: string[]) => n.filter((x) => !o.includes(x));
  for (const v of added(b.variants, a.variants))
    details.push(`variante ajoutée : ${v}`);
  for (const v of added(a.variants, b.variants))
    (details.push(`variante supprimée : ${v}`), (breaking = true));
  for (const p of Object.keys(b.properties).filter((p) => !(p in a.properties)))
    details.push(`propriété ajoutée : ${p}`);
  for (const p of Object.keys(a.properties).filter((p) => !(p in b.properties)))
    (details.push(`propriété retirée : ${p}`), (breaking = true));
  for (const [p, nv] of Object.entries(b.properties)) {
    const ov = a.properties[p];
    if (ov && JSON.stringify(ov) !== JSON.stringify(nv))
      details.push(`propriété modifiée : ${p}`);
  }
  return { details, breaking };
}

function compare<T extends { key: string; name: string; description: string }>(
  kind: Change['kind'],
  before: T[],
  after: T[],
  extra: (a: T, b: T) => { details: string[]; breaking: boolean },
): Change[] {
  const old = new Map(before.map((x) => [x.key, x]));
  const now = new Map(after.map((x) => [x.key, x]));
  const out: Change[] = [];
  for (const [key, b] of now) {
    const a = old.get(key);
    if (!a) {
      out.push({
        kind,
        action: 'created',
        key,
        name: b.name,
        details: [],
        breaking: false,
      });
      continue;
    }
    const e = extra(a, b);
    const details = [...e.details];
    if (a.description !== b.description) details.push('description modifiée');
    if (a.name !== b.name)
      out.push({
        kind,
        action: 'renamed',
        key,
        name: b.name,
        from: a.name,
        details,
        breaking: true,
      });
    else if (details.length)
      out.push({
        kind,
        action: 'modified',
        key,
        name: b.name,
        details,
        breaking: e.breaking,
      });
  }
  for (const [key, a] of old)
    if (!now.has(key))
      out.push({
        kind,
        action: 'deleted',
        key,
        name: a.name,
        details: [],
        breaking: true,
      });
  return out;
}

export function diffSnapshots(before: Snapshot | null, after: Snapshot): Diff {
  const a = before ?? empty;
  const none = () => ({ details: [] as string[], breaking: false });
  const changes = [
    ...compare(
      'componentSet',
      a.componentSets,
      after.componentSets,
      setDetails,
    ),
    ...compare('component', a.components, after.components, none),
    ...compare('style', a.styles, after.styles, none),
  ].sort((x, y) => `${x.kind}${x.name}`.localeCompare(`${y.kind}${y.name}`));
  return { empty: changes.length === 0, changes };
}

export function summary(diff: Diff): string {
  if (diff.empty) return 'Aucun changement dans la bibliothèque Figma.\n';
  const label = {
    created: 'créé',
    deleted: 'supprimé',
    renamed: 'renommé',
    modified: 'modifié',
  };
  const lines = diff.changes.map((c) => {
    const head = `- ${c.breaking ? '⚠️ ' : ''}**${c.name}** (${c.kind}) ${label[c.action]}${c.from ? ` (avant : ${c.from})` : ''}`;
    return [head, ...c.details.map((d) => `  - ${d}`)].join('\n');
  });
  return `## Changements Figma\n\n${lines.join('\n')}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [
    oldPath,
    newPath,
    outJson = 'figma-sync/diff.json',
    outMd = 'figma-sync/diff.md',
  ] = process.argv.slice(2);
  if (!oldPath || !newPath) {
    console.error(
      'Usage : diff.ts <ancien snapshot|-> <nouveau snapshot> [diff.json] [diff.md]',
    );
    process.exit(1);
  }
  const before =
    oldPath === '-'
      ? null
      : (JSON.parse(await readFile(oldPath, 'utf8')) as Snapshot);
  const d = diffSnapshots(
    before,
    JSON.parse(await readFile(newPath, 'utf8')) as Snapshot,
  );
  await writeFile(outJson, JSON.stringify(d, null, 2) + '\n');
  await writeFile(outMd, summary(d));
  console.log(d.empty ? 'EMPTY' : `${d.changes.length} changements`);
}
