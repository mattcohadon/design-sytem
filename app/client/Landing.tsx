import { ChevronRightIcon } from 'lucide-react';
import { isNew, NewTag } from './NewTag.js';
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
              className="flex h-12 items-center justify-between gap-2 rounded-xl border bg-card px-4 text-sm text-card-foreground outline-none transition-colors hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <span className="truncate">{item.title}</span>
              <span className="flex shrink-0 items-center gap-2">
                {isNew(item.id) && <NewTag />}
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
    <div className="grid gap-8 py-8">
      <Grid title="Composants" items={components} />
      <Grid title="Blocs" items={blocks} />
    </div>
  );
}
