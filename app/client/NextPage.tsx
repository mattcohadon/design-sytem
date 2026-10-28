import { useEffect, useRef, useState } from 'react';

export interface NextTarget {
  href: string;
  label: string;
}

// Distance de défilement « en trop » (px de molette ; glissé tactile ×1,5) pour ouvrir la page suivante.
const THRESHOLD = 1000;
// Part de l'écart restant rattrapée à chaque image : plus petit = plus doux.
const FOLLOW = 0.14;
// Verrou partagé entre les pages : la nouvelle page crée son propre composant, mais l'élan de la
// molette qui a ouvert la précédente ne doit pas en ouvrir une troisième.
const gesture = { locked: false, lastWheel: 0 };
const atBottom = () =>
  innerHeight + scrollY >= document.documentElement.scrollHeight - 2;

/**
 * Fin de page : continuer à défiler en bas remplit une barre de progression sous le nom de la page
 * suivante ; quand elle est pleine, la page s'ouvre. Le lien reste cliquable et atteignable au clavier.
 * La barre est animée hors de React (une écriture de style par image) pour rester fluide.
 */
export function NextPage({ next }: { next: NextTarget }) {
  const [active, setActive] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const s = { pull: 0, touchY: 0 };
    const view = { target: 0, shown: 0, frame: 0 };
    let reset = 0;
    const paint = () => {
      view.frame = 0;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      view.shown = reduce
        ? view.target
        : view.shown + (view.target - view.shown) * FOLLOW;
      if (Math.abs(view.target - view.shown) < 0.002) view.shown = view.target;
      if (bar.current) bar.current.style.transform = `scaleX(${view.shown})`;
      if (view.shown !== view.target) view.frame = requestAnimationFrame(paint);
    };
    const move = (ratio: number) => {
      view.target = ratio;
      if (bar.current)
        bar.current.dataset.pull = String(Math.round(ratio * 100));
      view.frame ||= requestAnimationFrame(paint);
    };
    const set = (value: number) => {
      s.pull = Math.max(0, Math.min(value, THRESHOLD));
      move(s.pull / THRESHOLD);
      setActive(s.pull > 0);
      clearTimeout(reset);
      // Sans nouveau geste, la barre redescend.
      if (s.pull > 0 && s.pull < THRESHOLD)
        reset = window.setTimeout(() => set(0), 900);
    };
    const advance = () => {
      gesture.locked = true;
      s.pull = 0;
      // La barre se remplit jusqu'au bout, puis la page suivante s'ouvre.
      move(1);
      location.hash = next.href;
    };
    const ignored = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest(
        '[role="dialog"],aside[aria-label="Éditeur de tokens"],textarea,input,select',
      );
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      const pause = now - gesture.lastWheel;
      gesture.lastWheel = now;
      // Après un changement de page, l'élan de la molette est ignoré jusqu'à un nouveau geste.
      if (gesture.locked) {
        if (pause > 250) gesture.locked = false;
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
      if (gesture.locked || ignored(e.target)) return;
      const dy = s.touchY - (e.touches[0]?.clientY ?? s.touchY);
      if (dy > 0 && atBottom()) {
        if (dy * 1.5 >= THRESHOLD) advance();
        else set(dy * 1.5);
      }
    };
    const onTouchEnd = () => {
      gesture.locked = false;
      if (s.pull < THRESHOLD) set(0);
    };
    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      clearTimeout(reset);
      cancelAnimationFrame(view.frame);
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
    };
  }, [next.href]);
  return (
    <>
      <a
        href={next.href}
        className="mt-16 mb-28 grid justify-items-center gap-2 rounded-lg px-6 py-4 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
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
        <span className="text-lg font-medium tracking-tight">
          {next.label} →
        </span>
        {/* Piste #EDEDED ; la barre se remplit avec le geste. */}
        <span
          aria-hidden
          className="mt-1 h-1 w-48 overflow-hidden rounded-full bg-[#ededed] dark:bg-white/10"
        >
          <span
            ref={bar}
            data-pull="0"
            className="block h-full w-full origin-left rounded-full bg-primary will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
      </a>
    </>
  );
}
