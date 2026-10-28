import { useEffect, useState } from 'react';

interface Entry {
  id: string;
  text: string;
}

/** « Sur cette page » : les titres h3 du contenu principal, relus à chaque changement de page. */
export function OnThisPage({ routeKey }: { routeKey: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
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
  if (entries.length < 2) return null;
  return (
    <nav aria-label="Sur cette page" className="grid gap-1 text-sm">
      <p className="px-2.5 pb-1 text-xs text-muted-foreground">
        Sur cette page
      </p>
      {entries.map((e) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          onClick={(ev) => {
            // Le routage utilise le hash : on défile sans le changer.
            ev.preventDefault();
            document
              .getElementById(e.id)
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground"
        >
          {e.text}
        </a>
      ))}
    </nav>
  );
}
