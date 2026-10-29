// Phrases du journal Figma : partagées par la page Changelog (navigateur) et le corps des PR de synchro.
// Aucun import Node ici : ce fichier est aussi chargé côté client.
import type { Change } from './diff.js';

export type LogChange = Pick<
  Change,
  'kind' | 'action' | 'name' | 'from' | 'details' | 'breaking'
>;

const noun = {
  componentSet: 'composant',
  component: 'composant',
  style: 'style',
};
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** « Nouveau composant « Alert » », « Style « Fill » supprimé »… */
export function describe(c: LogChange): string {
  const n = noun[c.kind];
  switch (c.action) {
    case 'created':
      return `Nouveau ${n} « ${c.name} »`;
    case 'deleted':
      return `${cap(n)} « ${c.name} » supprimé`;
    case 'renamed':
      return `${cap(n)} « ${c.from ?? '?'} » renommé en « ${c.name} »`;
    case 'modified':
      return `${cap(n)} « ${c.name} » modifié`;
  }
}

const plural = (n: number, one: string, many: string) =>
  `${n} ${n > 1 ? many : one}`;

/** « 1 ajout · 2 modifications · 1 changement cassant ». */
export function tally(changes: LogChange[]): string {
  const count = (a: Change['action']) =>
    changes.filter((c) => c.action === a).length;
  const parts = [
    [count('created'), 'ajout', 'ajouts'],
    [count('modified'), 'modification', 'modifications'],
    [count('renamed'), 'renommage', 'renommages'],
    [count('deleted'), 'suppression', 'suppressions'],
    [
      changes.filter((c) => c.breaking).length,
      'changement cassant',
      'changements cassants',
    ],
  ] as const;
  return parts
    .filter(([n]) => n > 0)
    .map(([n, one, many]) => plural(n, one, many))
    .join(' · ');
}

/** Bloc Markdown ajouté au corps de la PR : ce qui apparaîtra dans le Changelog après la fusion. */
export function markdown(changes: LogChange[]): string {
  if (!changes.length) return '';
  const lines = changes.flatMap((c) => [
    `- ${c.breaking ? '⚠️ ' : ''}${describe(c)}`,
    ...c.details.map((d) => `  - ${d}`),
  ]);
  return `## Entrée du Changelog\n\nCette synchro apparaîtra dans la page Changelog (Bibliothèque Figma) : ${tally(changes)}.\n\n${lines.join('\n')}\n`;
}
