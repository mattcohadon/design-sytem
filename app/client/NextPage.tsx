import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface NextTarget {
  href: string;
  label: string;
}

// Distance de défilement « en trop » (px de molette ; glissé tactile ×1,5) pour ouvrir la page suivante.
const THRESHOLD = 1000;
const atBottom = () =>
  innerHeight + scrollY >= document.documentElement.scrollHeight - 2;

/**
 * Fin de page : continuer à défiler en bas fait monter un demi-cercle depuis le bord inférieur de
 * l'écran ; quand il est plein, la page suivante s'ouvre. Le lien reste cliquable et atteignable au clavier.
 */
export function NextPage({ next }: { next: NextTarget }) {
  const [pull, setPull] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const state = useRef({ pull: 0, locked: false, lastWheel: 0, touchY: 0 });
  useEffect(() => {
    const s = state.current;
    s.pull = 0;
    let reset = 0;
    const set = (value: number) => {
      s.pull = Math.max(0, Math.min(value, THRESHOLD));
      setPull(s.pull);
      clearTimeout(reset);
      // Sans nouveau geste, le demi-cercle redescend.
      if (s.pull > 0 && s.pull < THRESHOLD)
        reset = window.setTimeout(() => set(0), 900);
    };
    const advance = () => {
      s.locked = true;
      s.pull = 0;
      // Le demi-cercle reste plein le temps de l'ouverture, puis s'efface en fondu.
      setPull(THRESHOLD);
      setLeaving(true);
      location.hash = next.href;
      reset = window.setTimeout(() => {
        setLeaving(false);
        setPull(0);
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
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
    };
  }, [next.href]);
  const active = pull > 0;
  const ratio = pull / THRESHOLD;
  // Rayon final : le demi-cercle couvre l'écran en largeur comme en hauteur.
  const radius = Math.ceil(Math.hypot(innerWidth / 2, innerHeight) * 1.05);
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
        <div
          aria-hidden
          data-pull={Math.round(ratio * 100)}
          className="pointer-events-none fixed bottom-0 left-1/2 z-20 rounded-full bg-primary/15 ring-1 ring-primary/25 transition-[transform,opacity] ease-out motion-reduce:transition-none"
          style={{
            width: radius * 2,
            height: radius * 2,
            // Centré sur le bord inférieur : seule la moitié haute est visible, c'est le demi-cercle.
            transform: `translate(-50%, 50%) scale(${ratio})`,
            opacity: leaving ? 0 : active ? 1 : 0,
            transitionDuration: leaving ? '450ms' : '250ms',
          }}
        />,
        document.body,
      )}
    </>
  );
}
