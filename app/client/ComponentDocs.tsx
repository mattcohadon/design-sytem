import { useEffect, useState, type ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from './CodeBlock.js';
import { extractExample, parseSpec, type Spec } from './codeExtract.js';
import { docContent } from './docContent.js';
import { docDetails } from './docDetails.js';
import type { ComponentScope } from './useComponentTokens.js';
import { manifest } from './preview/manifest.js';

// Fichiers lus à la demande : démos par famille, sources SortUI et blocs.
const load = (glob: Record<string, () => Promise<unknown>>, path: string) =>
  glob[path]?.() as Promise<string> | undefined;
const demos = import.meta.glob('./preview/demos/*.tsx', {
  query: '?raw',
  import: 'default',
});
const blockDemos = import.meta.glob('./preview/blocks.tsx', {
  query: '?raw',
  import: 'default',
});
const components = import.meta.glob('./sortui/components/ui/*.tsx', {
  query: '?raw',
  import: 'default',
});
const blockSources = import.meta.glob(
  './sortui/registry/blocks/*/components/*.tsx',
  { query: '?raw', import: 'default' },
);

interface Loaded {
  id: string;
  example: string | null;
  /** Fichiers à copier : chemin affiché, contenu. */
  files: { path: string; code: string }[];
  spec: Spec | null;
}

async function loadAll(id: string): Promise<Loaded> {
  const family = manifest.find((f) => f.items.some((i) => i.id === id))?.id;
  const demoSource =
    family === 'blocks'
      ? await load(blockDemos, './preview/blocks.tsx')
      : await load(demos, `./preview/demos/${family}.tsx`);
  const example = demoSource ? extractExample(demoSource, id) : null;
  if (family === 'blocks') {
    const files = await Promise.all(
      Object.keys(blockSources)
        .filter((p) => p.includes(`/blocks/${id}/`))
        .map(async (p) => ({
          path: p.replace('./sortui/', ''),
          code: (await load(blockSources, p)) ?? '',
        })),
    );
    return { id, example, files, spec: null };
  }
  const code = await load(components, `./sortui/components/ui/${id}.tsx`);
  return {
    id,
    example,
    files: code ? [{ path: `components/ui/${id}.tsx`, code }] : [],
    spec: code ? parseSpec(code) : null,
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="grid gap-3">
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

function Bullets({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="grid content-start gap-2 rounded-xl border p-4">
      <h4 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h4>
      <ul className="grid gap-1.5 pl-4 text-sm [&>li]:list-disc [&>li]:marker:text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t py-2.5 first:border-t-0 sm:grid-cols-[11rem_1fr]">
      <dt className="text-xs font-medium">{name}</dt>
      <dd className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {children}
      </dd>
    </div>
  );
}

/** Documentation d'un composant : description, installation, exemple copiable, spécifications, code source. */
export function ComponentDocs({
  id,
  title,
  scope,
}: {
  id: string;
  title: string;
  scope?: ComponentScope;
}) {
  const [data, setData] = useState<Loaded>();
  useEffect(() => {
    let live = true;
    void loadAll(id).then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [id]);
  const doc = docContent[id];
  const details = docDetails[id];
  // Le contenu d'un autre composant ne doit jamais s'afficher le temps du chargement.
  const loaded = data?.id === id ? data : undefined;
  const spec = loaded?.spec;
  const install = spec?.packages.length
    ? `npm install ${spec.packages.join(' ')}`
    : null;
  const tokens = scope ? [...scope.names].sort() : [];
  return (
    <div className="grid gap-8 pt-4">
      {doc && (
        <Section title="Description">
          <p className="max-w-3xl text-sm leading-relaxed">{doc.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Bullets title="Quand l’utiliser" items={doc.use} />
            <Bullets title="Quand l’éviter" items={doc.avoid} />
          </div>
        </Section>
      )}
      {loaded && loaded.files.length > 0 && (
        <Section title="Installation">
          <ol className="grid max-w-3xl gap-3 text-sm">
            {install && (
              <li className="grid gap-2">
                <span>Installer les dépendances.</span>
                <CodeBlock code={install} label="terminal" />
              </li>
            )}
            <li>
              Copier{' '}
              {loaded.files.map((f, i) => (
                <span key={f.path}>
                  {i > 0 && ', '}
                  <code className="rounded bg-fill-2 px-1 py-0.5 font-mono text-xs">
                    {f.path}
                  </code>
                </span>
              ))}{' '}
              dans votre projet
              {spec?.requires.length
                ? `, avec ${spec.requires.join(', ')}`
                : ''}
              .
            </li>
          </ol>
        </Section>
      )}
      {loaded?.example && (
        <Section title="Exemple">
          <CodeBlock code={loaded.example} label={`${id}-exemple.tsx`} />
        </Section>
      )}
      {details?.parts && (
        <Section title="Anatomie">
          <dl className="rounded-xl border px-4 py-1">
            {Object.entries(details.parts).map(([part, role]) => (
              <Row key={part} name={part}>
                {role}
              </Row>
            ))}
          </dl>
        </Section>
      )}
      <Section title="Spécifications">
        <dl className="rounded-xl border px-4 py-1">
          {spec?.variants.map((v) => (
            <Row key={v.name} name={`Variante · ${v.name}`}>
              {v.options.map((o) => (
                <Badge
                  key={o}
                  variant={o === v.default ? 'secondary' : 'outline'}
                >
                  {o}
                  {o === v.default && ' (défaut)'}
                </Badge>
              ))}
            </Row>
          ))}
          {spec && spec.parts.length > 0 && !details?.parts && (
            <Row name="Sous-composants">
              {spec.parts.map((p) => (
                <code key={p} className="font-mono">
                  {p}
                </code>
              ))}
            </Row>
          )}
          {spec?.primitive && (
            <Row name="Primitive">Base UI · {spec.primitive}</Row>
          )}
          {tokens.length > 0 && (
            <Row name="Tokens de couleur">
              {tokens.map((t) => (
                <code key={t} className="font-mono">
                  {t}
                </code>
              ))}
              {scope?.radius && <code className="font-mono">radius</code>}
            </Row>
          )}
          {doc && <Row name="Accessibilité">{doc.a11y}</Row>}
          {!spec && !doc && (
            <Row name={title}>Pas de spécification disponible.</Row>
          )}
        </dl>
      </Section>
      {details?.props && (
        <Section title="Propriétés">
          <div className="overflow-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Nom</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {details.props.map(([name, type, desc]) => (
                  <tr key={name} className="border-t align-top">
                    <td className="px-3 py-2 font-mono">{name}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {type}
                    </td>
                    <td className="px-3 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
      {details?.tips && (
        <Section title="Bonnes pratiques">
          <ul className="grid max-w-3xl gap-2 pl-5 text-sm [&>li]:list-disc [&>li]:marker:text-muted-foreground">
            {details.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Section>
      )}
      {loaded && loaded.files.length > 0 && (
        <Section title="Code source">
          {loaded.files.map((f) => (
            <CodeBlock key={f.path} code={f.code} label={f.path} collapsed />
          ))}
        </Section>
      )}
    </div>
  );
}
