import { useEffect, useRef, useState } from 'react';
import { isNew, NewTag } from './NewTag.js';
import type { ManifestFamily } from './preview/manifest.js';

type Item = ManifestFamily['items'][number];

/** Thème de l'atelier (classe `dark` sur <html>), suivi pour que les aperçus le reprennent. */
function useDark() {
  const read = () => document.documentElement.classList.contains('dark');
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return dark;
}

/**
 * Aperçu réel du composant : l'iframe d'aperçu est montée à l'approche du viewport,
 * rendue au double de la vignette puis réduite de moitié.
 */
function Thumb({
  id,
  title,
  dark,
}: {
  id: string;
  title: string;
  dark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const observer = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setShown(true),
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-background"
    >
      {shown && (
        <iframe
          title={`Aperçu ${title}`}
          src={`/?preview=1&thumb=1&mode=${dark ? 'dark' : 'light'}&view=component&id=${id}`}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          className="pointer-events-none absolute top-0 left-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
        />
      )}
    </div>
  );
}

function Grid({ title, items }: { title: string; items: Item[] }) {
  const dark = useDark();
  return (
    <section
      id={`liste-${title.toLowerCase()}`}
      aria-label={title}
      className="scroll-mt-20 grid gap-3"
    >
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title} · {items.length}
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#/composants/${item.id}`}
              className="grid gap-2 rounded-xl border bg-card p-2 text-sm text-card-foreground outline-none transition-colors hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <Thumb id={item.id} title={item.title} dark={dark} />
              <span className="flex items-center justify-between gap-2 px-2 pb-1">
                <span className="truncate">{item.title}</span>
                {isNew(item.id) && <NewTag />}
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

/** Remplace la barre de l'assistant sur l'accueil : accès direct aux deux listes. */
export function HomeBar() {
  return (
    <div className="pointer-events-none sticky bottom-4 z-30 mt-auto flex justify-center px-4 pt-6">
      <nav
        aria-label="Listes"
        className="pointer-events-auto flex gap-1 rounded-2xl border bg-popover p-1 text-sm shadow-popover"
      >
        {['Composants', 'Blocs'].map((name) => (
          <a
            key={name}
            href={`#liste-${name.toLowerCase()}`}
            onClick={(e) => {
              // Le routage utilise le hash : on défile sans le changer.
              e.preventDefault();
              document
                .getElementById(`liste-${name.toLowerCase()}`)
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-xl px-4 py-2 outline-none transition-colors hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {name}
          </a>
        ))}
      </nav>
    </div>
  );
}
