import { useEffect, useState } from 'react';

interface Entry {
  id: string;
  text: string;
}
interface Active {
  index: number;
  /** Avancement dans la section active, de 0 à 1. */
  progress: number;
}

// Ligne de lecture : juste sous la barre du haut collante.
const READING_LINE = 96;

/**
 * « Sur cette page » : les titres h3 du contenu principal, relus à chaque changement de page.
 * Au défilement, une barre de progression remplit l'élément de la section en cours puis passe au suivant.
 */
export function OnThisPage({ routeKey }: { routeKey: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState<Active>({ index: -1, progress: 0 });
  useEffect(() => {
    // Les pages se montent après la navigation : on relit le DOM une fois le rendu fait.
    const timer = setTimeout(() => {
      const found = [...document.querySelectorAll<HTMLElement>('main h3')].map(
        (h, i) => {
          h.id ||= `section-${i}`;
          h.style.scrollMarginTop = '5rem';
          return { id: h.id, text: h.textContent ?? '' };
        },
      );
      setEntries(found);
    }, 150);
    return () => clearTimeout(timer);
  }, [routeKey]);
  useEffect(() => {
    if (entries.length < 2) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      if (maxScroll <= 0) {
        setActive((cur) =>
          cur.index === -1 ? cur : { index: -1, progress: 0 },
        );
        return;
      }
      // Position de défilement à laquelle le titre de chaque section atteint la ligne de lecture.
      const n = entries.length;
      const starts = entries.map(
        (e) =>
          scrollY +
          (document.getElementById(e.id)?.getBoundingClientRect().top ?? 0) -
          READING_LINE,
      );
      // Sur une page courte, les dernières sections ne seraient jamais atteintes : on répartit
      // toute la plage de défilement entre les sections, pour une progression régulière.
      const share = (maxScroll * (n - 1)) / n;
      const k = starts[n - 1] > share ? share / Math.max(starts[n - 1], 1) : 1;
      const marks = [...starts.map((v) => Math.max(v, 0) * k), maxScroll];
      let index = -1;
      for (let i = 0; i < n; i++) if (scrollY >= marks[i] - 1) index = i;
      let next: Active = { index, progress: 0 };
      if (index >= 0) {
        const span = Math.max(marks[index + 1] - marks[index], 1);
        next.progress = Math.min(
          1,
          Math.max(0, (scrollY - marks[index]) / span),
        );
      }
      next.progress = Math.round(next.progress * 200) / 200;
      setActive((cur) =>
        cur.index === next.index && cur.progress === next.progress ? cur : next,
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
  }, [entries]);
  if (entries.length < 2) return null;
  return (
    <nav aria-label="Sur cette page" className="grid gap-1 text-sm">
      <p className="px-2.5 pb-1 text-xs text-muted-foreground">
        Sur cette page
      </p>
      {entries.map((e, i) => {
        const current = i === active.index;
        return (
          <a
            key={e.id}
            href={`#${e.id}`}
            aria-current={current ? 'location' : undefined}
            onClick={(ev) => {
              // Le routage utilise le hash : on défile sans le changer.
              ev.preventDefault();
              document
                .getElementById(e.id)
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`relative isolate overflow-hidden rounded-lg px-2.5 py-1.5 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
              current
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {/* Barre derrière le texte : pleine une fois la section passée, vide avant, et qui s'efface ou
                apparaît en douceur d'un élément à l'autre. */}
            <span
              aria-hidden
              data-progress={current ? active.progress : undefined}
              className="absolute inset-y-0 left-0 -z-10 rounded-lg bg-fill-3 transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
              style={{
                opacity: current ? 1 : 0,
                width: current
                  ? `${Math.max(active.progress, 0.04) * 100}%`
                  : i < active.index
                    ? '100%'
                    : '0%',
              }}
            />
            {e.text}
          </a>
        );
      })}
    </nav>
  );
}
