import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { entryOf, type Force } from '../componentStates.js';
import { stateDemos } from './stateDemos.js';
import { applyForced, installForcedStates } from './forcedStates.js';
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

/** Ce qui change visuellement : sert à repérer un état sans style propre (identique au repos). */
const SIGNATURE = [
  'backgroundColor',
  'color',
  'borderColor',
  'outlineColor',
  'boxShadow',
  'textDecorationLine',
  'opacity',
  'transform',
] as const;
/** Signature de toute la zone : un état peut changer le style d'un parent (champ désactivé, groupe invalide). */
const signature = (box: HTMLElement) =>
  [box, ...Array.from(box.querySelectorAll('*')).slice(0, 400)]
    .map((el) => {
      const cs = getComputedStyle(el);
      return SIGNATURE.map((k) => cs[k]).join('|');
    })
    .join('§');

/** Les états d'un composant côte à côte : chacun est forcé par attribut (hover, active, focus, disabled, invalid). */
export function StatesView({ id }: { id: string }) {
  const inner = useRef<HTMLDivElement>(null);
  const boxes = useRef<Map<string, HTMLDivElement>>(new Map());
  const [same, setSame] = useState<Set<string>>(new Set());
  useEffect(() => {
    installForcedStates();
  }, []);
  useEffect(() => {
    const el = inner.current;
    if (!el || window.parent === window) return;
    const report = () =>
      window.parent.postMessage(
        { type: 'ds-fit', height: el.getBoundingClientRect().height },
        location.origin,
      );
    const observer = new ResizeObserver(report);
    observer.observe(el);
    report();
    return () => observer.disconnect();
  }, [id]);
  const entry = entryOf(id);
  // Un état sans style propre (par exemple « Appui » sur un bouton sans :active) est signalé, pas dupliqué.
  useEffect(() => {
    if (!entry) return;
    const timer = setTimeout(() => {
      const base = boxes.current.get(entry.states[0].label);
      if (!base) return;
      const rest = signature(base);
      const next = new Set<string>();
      for (const st of entry.states.slice(1)) {
        const box = boxes.current.get(st.label);
        if (box && signature(box) === rest) next.add(st.label);
      }
      setSame(next);
    }, 600);
    return () => clearTimeout(timer);
  }, [id, entry]);
  const demo = families.flatMap((f) => f.demos).find((d) => d.id === id);
  if (!demo || !entry)
    return (
      <p role="alert" className="p-6 text-sm">
        Aucun état pour : {id}
      </p>
    );
  return (
    <div ref={inner} className="grid gap-6 p-6">
      {entry.states.map((state) => (
        <StateCell
          key={state.label}
          label={state.label}
          force={state.force}
          selector={entry.selector}
          first={entry.first}
          hidden={same.has(state.label)}
          register={(el) =>
            el
              ? boxes.current.set(state.label, el)
              : boxes.current.delete(state.label)
          }
        >
          <DemoBoundary>
            {(stateDemos[id] ?? demo.render)(state.variant)}
          </DemoBoundary>
        </StateCell>
      ))}
    </div>
  );
}

function StateCell({
  label,
  force,
  selector,
  first,
  hidden,
  register,
  children,
}: {
  label: string;
  force: Force[];
  selector?: string;
  first?: boolean;
  hidden: boolean;
  register: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    register(el);
    return el ? applyForced(el, force, selector, first) : undefined;
  }, [force, selector, first, register]);
  return (
    <section aria-label={label} className="grid gap-2">
      <h4 className="text-xs font-medium text-muted-foreground">{label}</h4>
      {hidden && (
        <p className="text-xs text-muted-foreground">
          Aucun style propre : identique au repos.
        </p>
      )}
      <div ref={box} hidden={hidden}>
        {children}
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
