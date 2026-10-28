import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { actions } from './demos/actions.js';
import { ai } from './demos/ai.js';
import { display } from './demos/display.js';
import { forms } from './demos/forms.js';
import { navigation } from './demos/navigation.js';
import { overlays } from './demos/overlays.js';
import type { Demo, Family } from './demos/types.js';
import { blocks } from './blocks.js';

export const families: Family[] = [
  actions,
  forms,
  navigation,
  display,
  overlays,
  ai,
  { id: 'blocks', title: 'Blocs', demos: blocks },
];

/** Une démonstration qui échoue ne doit pas masquer les 72 autres. */
class DemoBoundary extends Component<
  { children: ReactNode },
  { error?: Error }
> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <p role="alert" className="text-sm text-destructive-foreground">
        Démonstration indisponible : {this.state.error.message}
      </p>
    ) : (
      this.props.children
    );
  }
}

/**
 * Monte la démonstration à l’approche du viewport. Certaines (cmdk) appellent
 * scrollIntoView au montage, ce qui ferait défiler l’atelier hors de l’iframe.
 */
function Lazy({ children }: { children: () => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown(true);
      },
      { rootMargin: '0px 0px 120px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);
  return <div ref={ref}>{shown ? children() : <div className="h-24" />}</div>;
}

/** Page d’un seul composant, rendue seule dans l’iframe de l’atelier. */
export function ComponentView({
  id,
  thumb = false,
}: {
  id: string;
  thumb?: boolean;
}) {
  const inner = useRef<HTMLDivElement>(null);
  // L'atelier ajuste la hauteur de l'iframe à celle du composant : on lui envoie la nôtre.
  useEffect(() => {
    const el = inner.current;
    if (!el || thumb || window.parent === window) return;
    const report = () =>
      window.parent.postMessage(
        { type: 'ds-fit', height: el.getBoundingClientRect().height },
        location.origin,
      );
    const observer = new ResizeObserver(report);
    observer.observe(el);
    report();
    return () => observer.disconnect();
  }, [id, thumb]);
  const demo = families.flatMap((f) => f.demos).find((d) => d.id === id);
  if (!demo)
    return (
      <p role="alert" className="p-6 text-sm">
        Composant inconnu : {id}
      </p>
    );
  return (
    <section
      id={demo.id}
      aria-label={demo.title}
      className={
        thumb
          ? 'flex min-h-screen items-center justify-center overflow-hidden p-4'
          : 'flex min-h-screen items-center'
      }
    >
      <div
        ref={inner}
        className={thumb ? undefined : 'mx-auto w-full max-w-4xl p-6'}
      >
        <DemoBoundary>{demo.render()}</DemoBoundary>
      </div>
    </section>
  );
}

function DemoSection({ demo }: { demo: Demo }) {
  return (
    <section
      id={demo.id}
      aria-labelledby={`${demo.id}-title`}
      className="scroll-mt-28 border-t py-6"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 id={`${demo.id}-title`} className="text-sm font-medium">
          {demo.title}
        </h3>
        <code className="text-2xs text-muted-foreground">{demo.id}</code>
      </div>
      <DemoBoundary>
        <Lazy>{demo.render}</Lazy>
      </DemoBoundary>
    </section>
  );
}

export function Catalogue() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = families
    .map((f) => ({
      ...f,
      demos: f.demos.filter(
        (d) => !q || d.id.includes(q) || d.title.toLowerCase().includes(q),
      ),
    }))
    .filter((f) => f.demos.length);
  const total = families.reduce((n, f) => n + f.demos.length, 0);
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24">
      <header className="sticky top-0 z-30 -mx-4 grid gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Catalogue SortUI</h2>
          <Badge variant="secondary">
            {total - blocks.length} composants · {blocks.length} blocs
          </Badge>
        </div>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Filtrer les composants"
            placeholder="button, dialog, chat…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <nav
          aria-label="Familles"
          className="flex flex-wrap gap-x-3 gap-y-1 text-xs"
        >
          {visible.map((f) => (
            <a
              key={f.id}
              href={`#family-${f.id}`}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {f.title} ({f.demos.length})
            </a>
          ))}
        </nav>
      </header>
      {!visible.length && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Aucun composant.
        </p>
      )}
      {visible.map((f) => (
        <div key={f.id} id={`family-${f.id}`} className="scroll-mt-28 pt-8">
          <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {f.title}
          </h2>
          {f.demos.map((d) => (
            <DemoSection key={d.id} demo={d} />
          ))}
        </div>
      ))}
    </div>
  );
}
