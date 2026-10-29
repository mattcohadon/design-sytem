import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { LandingIntro } from './LandingSections.js';
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

/** Blocs mis en avant : de vrais aperçus, pas des maquettes. */
const FEATURED = [
  ['chat-thread-01', 'Fil de conversation'],
  ['prompt-input-01', 'Saisie du prompt'],
  ['model-picker-01', 'Choix du modèle'],
] as const;

function FeaturedBlocks({ count }: { count: number }) {
  const dark = useDark();
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {FEATURED.map(([id, title]) => (
        <li key={id}>
          <a
            href={`#/composants/${id}`}
            className="grid gap-2 rounded-xl border bg-card p-2 text-sm text-card-foreground outline-none transition-colors hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <Thumb id={id} title={title} dark={dark} />
            <span className="px-2 pb-1">{title}</span>
          </a>
        </li>
      ))}
      <li>
        <a
          href="#liste-blocs"
          onClick={(e) => {
            // Le routage utilise le hash : on défile sans le changer.
            e.preventDefault();
            document
              .getElementById('liste-blocs')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group/all grid h-full grid-rows-[1fr_auto] gap-2 rounded-xl border border-dashed p-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-fill-1 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <span className="grid content-center justify-items-center gap-1 rounded-lg p-4">
            <span className="text-4xl font-medium tracking-tight text-foreground tabular-nums">
              {count - FEATURED.length}
            </span>
            <span>blocs supplémentaires</span>
          </span>
          <span className="flex items-center justify-between px-2 pb-1">
            Voir tous les blocs
            <ArrowRightIcon
              className="size-4 transition-transform group-hover/all:translate-x-0.5"
              aria-hidden
            />
          </span>
        </a>
      </li>
    </ul>
  );
}

/** Page d'accueil : arguments, parcours Figma → code, puis tous les composants et blocs. */
export function Landing({
  components,
  blocks,
  tokens,
}: {
  components: Item[];
  blocks: Item[];
  tokens: number;
}) {
  return (
    <div className="grid gap-16 py-8">
      <LandingIntro
        components={components.length}
        tokens={tokens}
        preview={<FeaturedBlocks count={blocks.length} />}
      />
      <div className="grid gap-8">
        <h2 className="text-3xl font-medium tracking-tight">
          Tous les composants et blocs
        </h2>
        <Grid title="Composants" items={components} />
        <Grid title="Blocs" items={blocks} />
      </div>
    </div>
  );
}

const LISTS = ['Composants', 'Blocs'];
// Ligne de lecture : juste sous la barre du haut collante.
const READING_LINE = 96;

/**
 * Remplace la barre de l'assistant sur l'accueil : accès direct aux deux listes.
 * Au défilement, une barre de progression remplit la liste en cours, puis passe à la suivante.
 */
export function HomeBar() {
  const [active, setActive] = useState({ index: -1, progress: 0 });
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      // Composants démarre à la ligne de lecture ; les listes suivantes dès que leur titre entre
      // dans la fenêtre (une liste courte en bas de page n'atteindrait jamais la ligne de lecture).
      const marks = [
        ...LISTS.map((name, i) => {
          const top =
            document
              .getElementById(`liste-${name.toLowerCase()}`)
              ?.getBoundingClientRect().top ?? 0;
          const line = i === 0 ? READING_LINE : innerHeight * 0.7;
          return Math.min(Math.max(scrollY + top - line, 0), maxScroll);
        }),
        maxScroll,
      ];
      let index = -1;
      LISTS.forEach((_, i) => {
        if (scrollY >= marks[i] - 1) index = i;
      });
      let progress = 0;
      if (index >= 0) {
        const span = Math.max(marks[index + 1] - marks[index], 1);
        progress = Math.min(1, Math.max(0, (scrollY - marks[index]) / span));
      }
      progress = Math.round(progress * 200) / 200;
      setActive((cur) =>
        cur.index === index && cur.progress === progress
          ? cur
          : { index, progress },
      );
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(measure);
    };
    measure();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="pointer-events-none sticky bottom-4 z-30 mt-auto flex justify-center px-4 pt-6">
      <nav
        aria-label="Listes"
        className="pointer-events-auto flex gap-1 rounded-2xl border bg-popover p-1 text-sm shadow-popover"
      >
        {LISTS.map((name, i) => {
          const current = i === active.index;
          return (
            <a
              key={name}
              href={`#liste-${name.toLowerCase()}`}
              aria-current={current ? 'location' : undefined}
              onClick={(e) => {
                // Le routage utilise le hash : on défile sans le changer.
                e.preventDefault();
                document
                  .getElementById(`liste-${name.toLowerCase()}`)
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`relative isolate overflow-hidden rounded-xl px-4 py-2 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/30 ${
                current
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span
                aria-hidden
                data-progress={current ? active.progress : undefined}
                className="absolute inset-y-0 left-0 -z-10 rounded-xl bg-fill-3 transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
                style={{
                  opacity: current ? 1 : 0,
                  width: current
                    ? `${Math.max(active.progress, 0.04) * 100}%`
                    : i < active.index
                      ? '100%'
                      : '0%',
                }}
              />
              {name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
