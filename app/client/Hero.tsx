import type { CSSProperties } from 'react';
import { NewTag } from './NewTag.js';

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
      {/* Grand arc : un dégradé radial centré au-dessus du bandeau, du bleu vers le fond de page. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 85% 135% at 50% -25%, color-mix(in srgb, var(--hero-blue) var(--hero-strength, 55%), transparent) 0%, var(--hero-mid) 80%, var(--background) 100%)',
        }}
      />
      <div className="t-texts-reveal mx-auto grid max-w-3xl gap-4 px-6 pt-16 pb-24 text-center">
        <h2
          id="ds-title"
          tabIndex={-1}
          className="text-5xl font-medium tracking-tight outline-none"
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
          className="mx-auto max-w-xl text-base text-muted-foreground"
          style={{ '--t-index': 1 } as CSSProperties}
        >
          {lead}
        </p>
      </div>
    </section>
  );
}
