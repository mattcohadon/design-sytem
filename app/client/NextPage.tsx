import { useEffect, useRef, useState } from 'react';

export interface NextTarget {
  href: string;
  label: string;
}

// Distance de défilement « en trop » (px de molette ou de glissé) pour ouvrir la page suivante.
const THRESHOLD = 400;
const atBottom = () =>
  innerHeight + scrollY >= document.documentElement.scrollHeight - 2;

/**
 * Pied de page : continuer à défiler en bas de page remplit une barre, puis ouvre la page suivante.
 * Le lien reste cliquable et atteignable au clavier.
 */
export function NextPage({ next }: { next: NextTarget }) {
  const [pull, setPull] = useState(0);
  const state = useRef({ pull: 0, locked: false, lastWheel: 0, touchY: 0 });
  useEffect(() => {
    const s = state.current;
    s.pull = 0;
    setPull(0);
    let reset = 0;
    const set = (value: number) => {
      s.pull = Math.max(0, Math.min(value, THRESHOLD));
      setPull(s.pull);
      clearTimeout(reset);
      // Sans nouveau geste, la barre se vide.
      if (s.pull > 0 && s.pull < THRESHOLD)
        reset = window.setTimeout(() => set(0), 700);
    };
    const advance = () => {
      s.locked = true;
      s.pull = 0;
      location.hash = next.href;
    };
    const ignored = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest(
        '[role="dialog"],aside[aria-label="Éditeur de tokens"],textarea,input,select',
      );
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      const pause = now - s.lastWheel;
      s.lastWheel = now;
      // Après un changement de page, l'élan de la molette est ignoré jusqu'à un nouveau geste.
      if (s.locked) {
        if (pause > 250) s.locked = false;
        else return;
      }
      if (ignored(e.target)) return;
      if (e.deltaY > 0 && atBottom()) {
        const value = s.pull + e.deltaY;
        if (value >= THRESHOLD) advance();
        else set(value);
      } else if (s.pull > 0) set(0);
    };
    const onTouchStart = (e: TouchEvent) => {
      s.touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (s.locked || ignored(e.target)) return;
      const dy = s.touchY - (e.touches[0]?.clientY ?? s.touchY);
      if (dy > 0 && atBottom()) {
        if (dy * 2 >= THRESHOLD) advance();
        else set(dy * 2);
      }
    };
    const onTouchEnd = () => {
      s.locked = false;
      if (s.pull < THRESHOLD) set(0);
    };
    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      clearTimeout(reset);
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
    };
  }, [next.href]);
  const active = pull > 0;
  const ratio = pull / THRESHOLD;
  return (
    <a
      href={next.href}
      // Le bloc se soulève légèrement à mesure que l'on tire : le geste a un retour physique.
      style={{
        transform: `translateY(${-ratio * 10}px) scale(${1 + ratio * 0.015})`,
      }}
      className="group mt-16 mb-28 grid justify-items-center gap-3 rounded-2xl border px-6 py-8 text-center transition-[transform,background-color] duration-300 ease-out outline-none hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-ring/30 motion-reduce:transition-none"
    >
      {/* Les deux messages se superposent et se fondent l'un dans l'autre. */}
      <span className="grid text-xs text-muted-foreground">
        <span
          className="col-start-1 row-start-1 transition-opacity duration-300 motion-reduce:transition-none"
          style={{ opacity: active ? 0 : 1 }}
        >
          Page suivante
        </span>
        <span
          className="col-start-1 row-start-1 transition-opacity duration-300 motion-reduce:transition-none"
          style={{ opacity: active ? 1 : 0 }}
        >
          Continuez à scroller pour passer à «&nbsp;{next.label}&nbsp;»
        </span>
      </span>
      <span className="text-lg font-medium tracking-tight">{next.label} →</span>
      <span
        aria-hidden
        className="h-1 w-48 overflow-hidden rounded-full bg-fill-2"
      >
        <span
          data-pull={Math.round(ratio * 100)}
          className="block h-full rounded-full bg-primary transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${ratio * 100}%` }}
        />
      </span>
    </a>
  );
}
