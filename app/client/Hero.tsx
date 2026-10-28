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
    <section className="relative isolate min-h-[25rem] overflow-hidden">
      {/* Grand arc (maquette Figma) : radial centré en haut, bleu → rose → fond de page, avec un grain léger. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `var(--hero-grain), radial-gradient(ellipse 62% 92% at 50% 0%, color-mix(in srgb, var(--hero-blue) var(--hero-strength), transparent) 16.5%, var(--hero-mid) 80%, var(--background) 100%)`,
          backgroundBlendMode: 'soft-light, normal',
        }}
      />
      <div className="t-texts-reveal mx-auto grid max-w-3xl gap-4 px-6 pt-32 pb-20 text-center">
        <h2
          id="ds-title"
          tabIndex={-1}
          className="text-5xl font-medium tracking-tight text-[#0a0a0a] outline-none dark:text-foreground"
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
          className="mx-auto max-w-xl text-base text-[#4a4a4a] dark:text-muted-foreground"
          style={{ '--t-index': 1 } as CSSProperties}
        >
          {lead}
        </p>
      </div>
    </section>
  );
}
