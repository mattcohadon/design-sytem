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
      const tops = entries.map(
        (e) => document.getElementById(e.id)?.getBoundingClientRect().top ?? 0,
      );
      let index = -1;
      tops.forEach((top, i) => {
        if (top <= READING_LINE) index = i;
      });
      let next: Active = { index, progress: 0 };
      if (index >= 0) {
        // La dernière section s'étend jusqu'au bas du contenu principal.
        const end =
          index + 1 < tops.length
            ? tops[index + 1]
            : (document.querySelector('main')?.getBoundingClientRect().bottom ??
              tops[index]);
        const span = Math.max(end - tops[index], 1);
        next.progress = Math.min(
          1,
          Math.max(0, (READING_LINE - tops[index]) / span),
        );
      }
      // En bas de page, une dernière section courte ne remonterait jamais jusqu'à la ligne.
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2)
        next = { index: entries.length - 1, progress: 1 };
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
            className={`relative isolate overflow-hidden rounded-lg px-2.5 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
              current
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {current && (
              // Barre de progression derrière le texte, qui avance avec le défilement.
              <span
                aria-hidden
                data-progress={active.progress}
                className="absolute inset-y-0 left-0 -z-10 rounded-lg bg-fill-3"
                style={{ width: `${Math.max(active.progress, 0.04) * 100}%` }}
              />
            )}
            {e.text}
          </a>
        );
      })}
    </nav>
  );
}
