import { ChevronRightIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { figmaIds } from './FigmaSpec.js';
import type { ManifestFamily } from './preview/manifest.js';

type Item = ManifestFamily['items'][number];

function Grid({ title, items }: { title: string; items: Item[] }) {
  return (
    <section aria-label={title} className="grid gap-3">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title} · {items.length}
      </h3>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#/composants/${item.id}`}
              className="flex h-14 items-center justify-between gap-2 rounded-2xl border bg-card px-4 text-sm text-card-foreground shadow-card outline-none hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <span className="truncate">{item.title}</span>
              <span className="flex shrink-0 items-center gap-2">
                {figmaIds.has(item.id) && (
                  <Badge
                    variant="secondary"
                    title="Existe dans la bibliothèque Figma"
                  >
                    Figma
                  </Badge>
                )}
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Page d'accueil : tous les composants et blocs, par ordre alphabétique. */
export function Landing({
  components,
  blocks,
}: {
  components: Item[];
  blocks: Item[];
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 p-4 py-10">
      <div className="grid gap-3 text-center">
        <h2
          id="ds-title"
          tabIndex={-1}
          className="font-serif text-5xl tracking-tight outline-none"
        >
          Composants
        </h2>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          {components.length} composants et {blocks.length} blocs SortUI,
          pilotés par vos tokens. Choisissez-en un pour voir ses exemples et sa
          spécification Figma.
        </p>
      </div>
      <Grid title="Composants" items={components} />
      <Grid title="Blocs" items={blocks} />
    </div>
  );
}
