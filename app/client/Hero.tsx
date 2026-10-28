import type { CSSProperties } from 'react';
import { NewTag } from './NewTag.js';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Bandeau d'ouverture de page : la navigation et le contenu commencent en dessous. */
export function Hero({
  title,
  lead,
  isNew = false,
}: {
  title: string;
  lead: string;
  isNew?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Dégradé bleu nuit qui s'éclaircit vers le fond de page, avec un grain léger et un arc discret. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, #050d18 0%, #0f2236 30%, #1f3b57 55%, #3d5a75 72%, var(--background) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <svg
        aria-hidden
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        fill="none"
        className="absolute inset-0 -z-10 size-full"
      >
        <path
          d="M-100 90C400 40 1000 40 1540 80"
          stroke="white"
          strokeOpacity="0.25"
        />
      </svg>
      <div className="t-texts-reveal mx-auto grid max-w-3xl gap-4 px-6 pt-16 pb-24 text-center">
        <h2
          id="ds-title"
          tabIndex={-1}
          className="text-5xl font-medium tracking-tight text-white outline-none"
          style={{ '--t-index': 0 } as CSSProperties}
        >
          {title}
          {isNew && (
            <span className="ml-3 align-middle">
              <NewTag large />
            </span>
          )}
        </h2>
        <p
          className="mx-auto max-w-xl text-base text-white/80"
          style={{ '--t-index': 1 } as CSSProperties}
        >
          {lead}
        </p>
      </div>
    </section>
  );
}
