import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface NextTarget {
  href: string;
  label: string;
}

// Distance de défilement « en trop » (px de molette ; glissé tactile ×1,5) pour ouvrir la page suivante.
const THRESHOLD = 1000;
// Part de l'écart restant rattrapée à chaque image : plus petit = plus doux.
const FOLLOW = 0.14;
const atBottom = () =>
  innerHeight + scrollY >= document.documentElement.scrollHeight - 2;

/**
 * Fin de page : continuer à défiler en bas fait monter un demi-cercle gris depuis le bord inférieur de
 * l'écran ; quand il est plein, la page suivante s'ouvre. Le lien reste cliquable et atteignable au clavier.
 * Le demi-cercle est animé hors de React (une écriture de style par image) pour rester fluide.
 */
export function NextPage({ next }: { next: NextTarget }) {
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const circle = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const s = { pull: 0, locked: false, lastWheel: 0, touchY: 0 };
    const view = { target: 0, shown: 0, frame: 0 };
    let reset = 0;
    const paint = () => {
      view.frame = 0;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      view.shown = reduce
        ? view.target
        : view.shown + (view.target - view.shown) * FOLLOW;
      if (Math.abs(view.target - view.shown) < 0.002) view.shown = view.target;
      if (circle.current)
        circle.current.style.transform = `translate3d(-50%, 50%, 0) scale(${view.shown})`;
      if (view.shown !== view.target) view.frame = requestAnimationFrame(paint);
    };
    const move = (ratio: number) => {
      view.target = ratio;
      if (circle.current)
        circle.current.dataset.pull = String(Math.round(ratio * 100));
      view.frame ||= requestAnimationFrame(paint);
    };
    const set = (value: number) => {
      s.pull = Math.max(0, Math.min(value, THRESHOLD));
      move(s.pull / THRESHOLD);
      setActive(s.pull > 0);
      clearTimeout(reset);
      // Sans nouveau geste, le demi-cercle redescend.
      if (s.pull > 0 && s.pull < THRESHOLD)
        reset = window.setTimeout(() => set(0), 900);
    };
    const advance = () => {
      s.locked = true;
      s.pull = 0;
      // Le demi-cercle reste plein le temps de l'ouverture, puis s'efface en fondu.
      move(1);
      setLeaving(true);
      location.hash = next.href;
      reset = window.setTimeout(() => {
        setLeaving(false);
        setActive(false);
        move(0);
      }, 500);
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
        if (dy * 1.5 >= THRESHOLD) advance();
        else set(dy * 1.5);
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
      </a>
      {createPortal(
        // Cercle centré sur le bord inférieur : seule sa moitié haute est visible. Son diamètre est
        // borné (moitié de la hauteur d'écran au plus) : il ne recouvre jamais toute la page.
        // « multiply » laisse le texte lisible par-dessus le gris.
        <div
          ref={circle}
          aria-hidden
          data-pull="0"
          className="pointer-events-none fixed bottom-0 left-1/2 z-20 rounded-full bg-[#ededed] mix-blend-multiply transition-opacity ease-out will-change-transform motion-reduce:transition-none dark:bg-white/10 dark:mix-blend-normal"
          style={{
            width: 'min(100svh, 90vw, 960px)',
            height: 'min(100svh, 90vw, 960px)',
            transform: 'translate3d(-50%, 50%, 0) scale(0)',
            opacity: active || leaving ? (leaving ? 0 : 1) : 0,
            transitionDuration: leaving ? '450ms' : '250ms',
          }}
        />,
        document.body,
      )}
    </>
  );
}
