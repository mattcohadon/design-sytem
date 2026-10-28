import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Lecture seule de la bibliothèque Figma (composants, variantes, styles). Aucun LLM.
// Scopes du jeton : library_content:read + file_content:read. Pas de variables (Enterprise).
export interface SnapshotComponent {
  key: string;
  name: string;
  description: string;
}
export interface SnapshotSet extends SnapshotComponent {
  properties: Record<
    string,
    { type: string; default: string; options?: string[] }
  >;
  variants: string[];
}
export interface SnapshotStyle extends SnapshotComponent {
  type: string;
}
export interface Snapshot {
  fileKey: string;
  components: SnapshotComponent[];
  componentSets: SnapshotSet[];
  styles: SnapshotStyle[];
}

type Json = Record<string, any>;
export type Fetcher = (
  url: string,
  init: { headers: Record<string, string> },
) => Promise<Response>;
const api = 'https://api.figma.com';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const byKey = <T extends { key: string }>(a: T, b: T) =>
  a.key.localeCompare(b.key);

async function get(
  token: string,
  route: string,
  fetcher: Fetcher,
): Promise<Json> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetcher(api + route, {
      headers: { 'X-Figma-Token': token },
    });
    if (res.status === 429) {
      // Retry-After en secondes ; plafonné pour ne pas bloquer le job.
      const secs = Number(res.headers.get('retry-after')) || 2 ** attempt;
      await wait(Math.min(secs, 60) * 1000);
      continue;
    }
    if (res.status === 403)
      throw new Error(
        'Figma refuse la lecture (403) : vérifiez le jeton et ses scopes library_content:read et file_content:read.',
      );
    if (!res.ok)
      throw new Error(
        `Figma a répondu ${res.status} sur ${route.split('?')[0]}.`,
      );
    return (await res.json()) as Json;
  }
  throw new Error('Figma limite les requêtes (429) : réessayez plus tard.');
}

export async function buildSnapshot(
  token: string,
  fileKey: string,
  fetcher: Fetcher = fetch,
): Promise<Snapshot> {
  const base = `/v1/files/${encodeURIComponent(fileKey)}`;
  const [comps, sets, styles] = await Promise.all([
    get(token, `${base}/components`, fetcher),
    get(token, `${base}/component_sets`, fetcher),
    get(token, `${base}/styles`, fetcher),
  ]);
  const setItems: Json[] = sets.meta?.component_sets ?? [];
  // Les propriétés et variantes ne sont lisibles que sur les nœuds : lots de 50 identifiants.
  const nodes: Json = {};
  for (let i = 0; i < setItems.length; i += 50) {
    const ids = setItems
      .slice(i, i + 50)
      .map((s) => s.node_id)
      .join(',');
    const part = await get(
      token,
      `${base}/nodes?ids=${encodeURIComponent(ids)}&depth=1`,
      fetcher,
    );
    Object.assign(nodes, part.nodes);
  }
  const componentSets = setItems
    .map((s): SnapshotSet => {
      const doc: Json = nodes[s.node_id]?.document ?? {};
      const properties: SnapshotSet['properties'] = {};
      for (const [name, p] of Object.entries<Json>(
        doc.componentPropertyDefinitions ?? {},
      ))
        properties[name] = {
          type: String(p.type),
          default: String(p.defaultValue),
          ...(p.variantOptions
            ? { options: [...p.variantOptions].sort() }
            : {}),
        };
      const variants = (doc.children ?? [])
        .map((c: Json) => String(c.name))
        .sort();
      return {
        key: s.key,
        name: s.name,
        description: s.description ?? '',
        properties,
        variants,
      };
    })
    .sort(byKey);
  const components = (comps.meta?.components ?? [])
    // Les variantes d'un ensemble sont décrites par leur ensemble, pas comme composants isolés.
    .filter((c: Json) => !c.containing_frame?.containingStateGroup)
    .map((c: Json): SnapshotComponent => ({
      key: c.key,
      name: c.name,
      description: c.description ?? '',
    }))
    .sort(byKey);
  const styleList = (styles.meta?.styles ?? [])
    .map((s: Json): SnapshotStyle => ({
      key: s.key,
      name: s.name,
      description: s.description ?? '',
      type: s.style_type,
    }))
    .sort(byKey);
  return { fileKey, components, componentSets, styles: styleList };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { FIGMA_TOKEN: token, FIGMA_FILE_KEY: fileKey } = process.env;
  if (!token || !fileKey) {
    console.error(
      'FIGMA_TOKEN et FIGMA_FILE_KEY sont requis (secrets GitHub ou variables locales).',
    );
    process.exit(1);
  }
  const out = process.argv[2] ?? path.join('figma-sync', 'snapshot.json');
  const snap = await buildSnapshot(token, fileKey);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(snap, null, 2) + '\n');
  console.log(
    `${snap.componentSets.length} ensembles, ${snap.components.length} composants, ${snap.styles.length} styles → ${out}`,
  );
}
