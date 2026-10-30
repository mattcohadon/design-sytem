import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Toile de dessin à taille fixe, réduite ou agrandie d'un bloc à la largeur disponible.
 * Sert aux visuels décoratifs de la landing : le fond suit les tokens (clair et sombre),
 * la toile est inerte (ni focus ni clic) et décrite en une phrase pour les lecteurs d'écran.
 */
export function ScaledCanvas({
  width,
  height,
  label,
  className = '',
  children,
}: {
  width: number;
  height: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / width);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      style={{ height: height * scale }}
      className={`relative isolate overflow-hidden rounded-xl border bg-fill-1 ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 70% at 50% 45%, color-mix(in srgb, var(--hero-blue) 20%, transparent), transparent 75%), radial-gradient(ellipse 50% 60% at 85% 85%, color-mix(in srgb, var(--hero-mid) 70%, transparent), transparent 70%)',
        }}
      />
      <div
        inert
        aria-hidden
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
