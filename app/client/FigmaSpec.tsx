import { Badge } from '@/components/ui/badge';
import snapshot from '../../figma-sync/snapshot.json';

interface FigmaSet {
  name: string;
  properties: Record<
    string,
    { type: string; default: string; options?: string[] }
  >;
  variants: string[];
}

export const slug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Date de la dernière synchro Figma (absente d'un ancien snapshot). */
export const syncedAt = (snapshot as { syncedAt?: string }).syncedAt;

/** Identifiants de pages qui existent aussi dans la bibliothèque Figma. */
const componentSets = snapshot.componentSets as unknown as FigmaSet[];

export const figmaIds = new Set(componentSets.map((x) => slug(x.name)));

/** Ce que Figma décrit pour ce composant : mis à jour par chaque PR « Figma sync » fusionnée. */
export function FigmaSpec({ id }: { id: string }) {
  const set = componentSets.find((s) => slug(s.name) === id);
  if (!set) return null;
  return (
    <section
      aria-label="Spécification Figma"
      className="grid gap-3 rounded-2xl border bg-card p-4 text-card-foreground"
    >
      <h3 className="text-sm font-medium">Spécification Figma · {set.name}</h3>
      <dl className="grid gap-2 text-xs">
        {Object.entries(set.properties).map(([name, p]) => (
          <div key={name} className="grid gap-1 sm:grid-cols-[14rem_1fr]">
            {/* « Libellé#12:3 » : on retire l'identifiant interne de Figma. */}
            <dt className="font-medium">{name.replace(/#\d+:\d+$/, '')}</dt>
            <dd className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
              <Badge variant="outline">{p.type}</Badge>
              {p.options ? p.options.join(' · ') : `défaut : ${p.default}`}
            </dd>
          </div>
        ))}
      </dl>
      <details className="text-2xs text-muted-foreground">
        <summary className="cursor-pointer">
          {set.variants.length} variantes
        </summary>
        <p className="mt-1.5 break-words">{set.variants.join(' ; ')}</p>
      </details>
    </section>
  );
}
