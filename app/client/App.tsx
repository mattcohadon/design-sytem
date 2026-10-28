import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  RefreshCwIcon,
  HistoryIcon,
  MoonIcon,
  SunIcon,
  XIcon,
  MenuIcon,
  SearchIcon,
  PaletteIcon,
  SwatchBookIcon,
  UploadIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AssistantBar } from './AssistantBar.js';
import { FigmaSpec } from './FigmaSpec.js';
import { GetStarted, Welcome } from './Docs.js';
import { Changelog } from './Changelog.js';
import { Hero } from './Hero.js';
import { NextPage, type NextTarget } from './NextPage.js';
import { isNew, NewTag } from './NewTag.js';
import { ComponentDocs, CopyExampleButton } from './ComponentDocs.js';
import { PreviewFrame } from './PreviewFrame.js';
import { HomeBar, Landing } from './Landing.js';
import { OnThisPage } from './OnThisPage.js';
import { Search } from './Search.js';
import { inScope, useComponentTokens } from './useComponentTokens.js';
import { manifest } from './preview/manifest.js';
import { useTokenDraft } from './useTokenDraft.js';
import { announceChange, useDesignState } from './useDesignState.js';
import {
  bootstrap,
  commit,
  exportTokens,
  request,
  type Bootstrap,
} from './api.js';
import {
  contrastPairs,
  fontFamilies,
  pairContrast,
  parseColor,
  tokenKeys,
  tokenMode,
  toHex,
  withHex,
  type ColorName,
  type Mode,
  type Proposal,
  type TokenKey,
  type Tokens,
} from '../shared/model.js';

type Route =
  | { kind: 'home' }
  | { kind: 'welcome' }
  | { kind: 'start' }
  | { kind: 'history' }
  | { kind: 'tokens' }
  | { kind: 'component'; id: string };
const componentPrefix = '#/composants/';
const pageLabels: Partial<Record<Route['kind'], string>> = {
  home: 'Composants',
  welcome: 'Bienvenue',
  start: 'Démarrage',
  history: 'Changelog',
};
/** Seuls #/, #/tokens et #/composants/<id> sont des pages ; #ds-title (lien d’évitement) est ignoré. */
const routeOf = (hash: string): Route | null =>
  hash === '' || hash === '#' || hash === '#/' || hash === '#/composants'
    ? { kind: 'home' }
    : hash === '#/bienvenue'
      ? { kind: 'welcome' }
      : hash === '#/changelog'
        ? { kind: 'history' }
        : hash === '#/demarrage'
          ? { kind: 'start' }
          : hash === '#/tokens'
            ? { kind: 'tokens' }
            : hash.startsWith(componentPrefix)
              ? {
                  kind: 'component',
                  id: decodeURIComponent(hash.slice(componentPrefix.length)),
                }
              : null;
// Composants dont l'usage ouvre un menu ou une fenêtre : l'aperçu garde de la place pour l'afficher.
const roomy = new Set([
  'alert-dialog',
  'dialog',
  'sheet',
  'drawer',
  'popover',
  'hover-card',
  'tooltip',
  'dropdown-menu',
  'context-menu',
  'command',
  'select',
  'combobox',
  'navigation-menu',
  'menubar',
  'sonner',
  'calendar',
]);

const modeLabels: Record<Mode, string> = { light: 'Clair', dark: 'Sombre' };
// Damier sous la couleur : beaucoup de tokens SortUI ont une opacité.
const checker =
  'repeating-conic-gradient(oklch(0.9 0 0) 0 25%, oklch(1 0 0) 0 50%) 0 0 / 10px 10px';
/** Paire de contraste à afficher pour un token : la sienne, sinon primaire / texte. */
function pairFor(key: TokenKey): [ColorName, ColorName] {
  const name = key.split('.')[1] as ColorName;
  return (
    contrastPairs.find(([fg, bg]) => fg === name || bg === name) ??
    contrastPairs[1]
  );
}
const sourceLabels: Record<Proposal['source'], string> = {
  manual: 'Manuel',
  codex: 'Codex',
  claude: 'Claude',
  figma: 'Figma',
  import: 'Import',
  undo: 'Annulation',
  migration: 'Migration',
};
const brand = [
  'primary',
  'primary-foreground',
  'destructive',
  'destructive-foreground',
  'ring',
];
/** Famille d’un token couleur, pour regrouper la palette (ordre d’affichage). */
const families: [string, (name: string) => boolean][] = [
  ['Marque et états', (n) => brand.includes(n)],
  [
    'Textes',
    (n) =>
      n === 'foreground' ||
      (n.endsWith('-foreground') &&
        !n.startsWith('sidebar') &&
        !n.startsWith('syntax')),
  ],
  [
    'Contrôles et bordures',
    (n) => /^(border|input|control|field|fill-)/.test(n),
  ],
  ['Barre latérale', (n) => n.startsWith('sidebar')],
  ['Graphiques', (n) => n.startsWith('chart-')],
  ['Code', (n) => n.startsWith('syntax-')],
  ['Fonds et surfaces', () => true],
];
function familyOf(key: TokenKey) {
  const name = key.split('.')[1];
  return families.find(([, test]) => test(name))![0];
}
/** Pastille de couleur sur damier, ou rien si la valeur n’est pas une couleur. */
function Chip({
  value,
  className = 'size-4',
}: {
  value: string | number;
  className?: string;
}) {
  if (typeof value !== 'string' || !parseColor(value)) return null;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-sm ring-1 ring-border ring-inset align-middle ${className}`}
      style={{ background: `linear-gradient(${value}, ${value}), ${checker}` }}
    />
  );
}
function ContrastVerdict({ ratio }: { ratio: number }) {
  return ratio >= 4.5 ? (
    <Badge variant="secondary">AA texte courant</Badge>
  ) : (
    <Badge variant="destructive">Contraste à améliorer</Badge>
  );
}
export default function App() {
  const { state, setState, error: stateError } = useDesignState();
  const [boot, setBoot] = useState<Bootstrap>();
  const [key, setKey] = useState<TokenKey>(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem('ds-studio-token-draft-v2') || 'null',
      );
      if (tokenKeys.includes(saved?.key)) return saved.key;
    } catch {
      /* Facultatif. */
    }
    return 'light.primary';
  });
  const [mode, setMode] = useState<Mode>(() => tokenMode(key) ?? 'light');
  const { draft, setDraft, recovered, discard } = useTokenDraft(
    key,
    state?.tokens[key].$value,
  );
  const [search, setSearch] = useState('');
  const [agents, setAgents] = useState<Bootstrap['agents']>([]);
  const [proposal, setProposal] = useState<Proposal>();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [agent, setAgent] = useState('claude');
  const [route, setRoute] = useState<Route>(
    () => routeOf(location.hash) ?? { kind: 'home' },
  );
  const [menu, setMenu] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([]);
  const [thinking, setThinking] = useState(false);
  const [saving, setSaving] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    bootstrap()
      .then(setBoot)
      .catch((e) => setError(e.message));
    return () => controller.current?.abort();
  }, []);
  useEffect(() => {
    const sync = () => {
      const next = routeOf(location.hash);
      if (!next) return;
      setRoute(next);
      setMenu(false);
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);
  // La liste est longue : on amène la page active dans le champ de la barre latérale.
  const ready = !!state;
  useEffect(() => {
    document
      .querySelector('nav[aria-label="Navigation"] a[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [route, ready]);
  useEffect(() => {
    const item =
      route.kind === 'component'
        ? manifest.flatMap((f) => f.items).find((i) => i.id === route.id)
        : undefined;
    document.title = `${item?.title ?? pageLabels[route.kind] ?? 'Tokens'} · Stride UI`;
  }, [route]);
  useEffect(() => {
    if (agent !== 'manual')
      request<Bootstrap['agents']>('agents')
        .then(setAgents)
        .catch((e) => setError(e.message));
  }, [agent]);
  const current = state?.tokens[key].$value;
  const scope = useComponentTokens(
    route.kind === 'component' ? route.id : undefined,
  );
  useEffect(() => {
    if (!showTokens) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTokens(false);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [showTokens]);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );
  // Sur une page composant, l'éditeur ne propose que ses tokens : on choisit le premier.
  useEffect(() => {
    if (scope && !inScope(scope, key)) {
      const first = tokenKeys.find(
        (k) => (tokenMode(k) ?? mode) === mode && inScope(scope, k),
      );
      if (first) setKey(first);
    }
  }, [scope]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearError = () => {
    setError('');
    setNotice('');
  };
  async function perform(action: () => Promise<void>) {
    clearError();
    try {
      await action();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function proposeToken() {
    if (!state) return;
    await perform(async () => {
      const token = state.tokens[key];
      const value = token.$type === 'dimension' ? Number(draft) : draft;
      setProposal(
        await request<Proposal>('proposals', {
          revision: state.revision,
          changes: [{ key, value }],
        }),
      );
    });
  }
  async function accept() {
    if (!proposal) return;
    setSaving(true);
    await perform(async () => {
      const next = await commit(proposal);
      try {
        sessionStorage.removeItem('ds-studio-token-draft-v2');
      } catch {
        /* Facultatif. */
      }
      setState(next);
      setProposal(undefined);
      announceChange();
      setNotice(`Révision ${next.revision} enregistrée sur disque.`);
    });
    setSaving(false);
  }
  async function sendMessage() {
    if (!state || !message.trim() || thinking) return;
    const text = message;
    setMessage('');
    setThinking(true);
    clearError();
    const previous = chat.slice(-10);
    setChat([...chat, { role: 'user', text }]);
    const abort = new AbortController();
    controller.current = abort;
    try {
      const result = await request<{
        message: string;
        proposal: Proposal | null;
      }>(
        'agent',
        { agent, message: text, revision: state.revision, history: previous },
        abort.signal,
      );
      setChat((c) => [...c, { role: 'assistant', text: result.message }]);
      if (result.proposal) setProposal(result.proposal);
    } catch (e) {
      setError(
        abort.signal.aborted
          ? 'Demande interrompue. Aucun changement accepté.'
          : (e as Error).message,
      );
    } finally {
      setThinking(false);
      controller.current = null;
    }
  }
  if (!state)
    return (
      <main className="grid min-h-svh place-content-center gap-2 p-6 text-center">
        <h1 className="text-lg font-semibold">DS-Studio</h1>
        <p role="alert" className="text-sm">
          {stateError || 'Ouverture du Design System…'}
        </p>
        <p className="text-sm text-muted-foreground">
          Lancez le serveur local puis rechargez cette page.
        </p>
      </main>
    );
  const selectedAgent = agents.find((a) => a.id === agent);
  const staleProposal = !!proposal && proposal.revision !== state.revision;
  const token = state.tokens[key];
  const pairMode = tokenMode(key) ?? mode;
  const pair = pairFor(key);
  const savedContrast = pairContrast(state.tokens, pairMode, pair);
  const draftContrast =
    token.$type === 'color' && parseColor(draft) && tokenMode(key)
      ? pairContrast(
          {
            ...state.tokens,
            [key]: { $type: 'color', $value: draft },
          } as Tokens,
          pairMode,
          pair,
        )
      : undefined;
  const query = search.trim().toLowerCase();
  // Sans recherche, seuls les tokens du mode affiché sont listés.
  const matchingKeys = tokenKeys.filter(
    (k) =>
      (query
        ? k.toLowerCase().includes(query)
        : (tokenMode(k) ?? mode) === mode) && inScope(scope, k),
  );
  const pickerHex =
    token.$type === 'color' ? (toHex(draft) ?? toHex(String(current))) : null;
  const iframeQuery = `preview=1&mode=${mode}`;
  const dirty = draft !== String(current);
  const found =
    route.kind === 'component'
      ? manifest
          .flatMap((f) => f.items.map((i) => ({ ...i, family: f.title })))
          .find((i) => i.id === route.id)
      : undefined;
  const q = navQuery.trim().toLowerCase();
  const match = (i: { id: string; title: string }) =>
    !q || i.title.toLowerCase().includes(q) || i.id.includes(q);
  // Liste plate et alphabétique, comme sortui.dev ; les blocs forment un groupe à part.
  const byTitle = (a: { title: string }, b: { title: string }) =>
    a.title.localeCompare(b.title, 'fr');
  const components = manifest
    .filter((f) => f.id !== 'blocks')
    .flatMap((f) => f.items)
    .sort(byTitle);
  const blocks = manifest
    .filter((f) => f.id === 'blocks')
    .flatMap((f) => f.items);
  const pages = [...components, ...blocks];
  const at = found ? pages.findIndex((i) => i.id === found.id) : -1;
  // Ordre de lecture : Bienvenue, Démarrage, Composants, Tokens, Changelog ; puis les composants un à un.
  const nextPage: NextTarget | null = found
    ? at >= 0 && at < pages.length - 1
      ? { href: `#/composants/${pages[at + 1].id}`, label: pages[at + 1].title }
      : null
    : (
        {
          welcome: { href: '#/demarrage', label: 'Démarrage' },
          start: { href: '#/', label: 'Composants' },
          home: { href: '#/tokens', label: 'Tokens' },
          tokens: { href: '#/changelog', label: 'Changelog' },
          history: null,
          component: null,
        } as const
      )[route.kind];
  const editor = (
    <div className="grid gap-4 rounded-2xl border bg-card p-4 text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium">
          Tokens sémantiques{' '}
          <span className="font-normal text-muted-foreground tabular-nums">
            · {scope ? matchingKeys.length : tokenKeys.length}
          </span>
        </h3>
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Mode affiché"
          value={[mode]}
          onValueChange={(value) => {
            const m = value[0] as Mode | undefined;
            if (!m) return;
            setMode(m);
            const name = key.split('.')[1];
            if (tokenMode(key)) setKey(`${m}.${name}` as TokenKey);
          }}
        >
          {(['light', 'dark'] as const).map((m) => (
            <ToggleGroupItem key={m} value={m}>
              {modeLabels[m]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Field>
        <FieldLabel htmlFor="token-search">Rechercher un token</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="token-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="primary, dark.border, radius…"
          />
        </InputGroup>
        <p role="status" className="text-xs text-muted-foreground">
          {matchingKeys.length} résultat(s).{' '}
          {search && 'La sélection courante reste accessible.'}
        </p>
      </Field>
      <div className="grid gap-3">
        {families.map(([family]) => {
          const keys = matchingKeys.filter(
            (k) => state.tokens[k].$type === 'color' && familyOf(k) === family,
          );
          if (!keys.length) return null;
          return (
            <div key={family} className="grid gap-1.5">
              <span className="text-2xs text-muted-foreground">{family}</span>
              <div className="flex flex-wrap gap-1.5">
                {keys.map((k) => (
                  <button
                    title={k}
                    aria-label={`Sélectionner ${k}`}
                    aria-pressed={key === k}
                    key={k}
                    className="size-7 rounded-md ring-1 ring-border outline-none ring-inset hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-2 aria-pressed:ring-foreground aria-pressed:ring-offset-2 aria-pressed:ring-offset-card motion-safe:transition-transform"
                    style={{
                      background: `linear-gradient(${state.tokens[k].$value}, ${state.tokens[k].$value}), ${checker}`,
                    }}
                    onClick={() => setKey(k)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <form
        className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          void proposeToken();
        }}
      >
        <Field>
          <FieldLabel htmlFor="token-key">Token</FieldLabel>
          <NativeSelect
            id="token-key"
            className="w-full"
            value={key}
            onChange={(e) => setKey(e.target.value as TokenKey)}
          >
            {[...new Set([key, ...matchingKeys])].map((k) => (
              <NativeSelectOption key={k}>{k}</NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="token-value">Valeur</FieldLabel>
          {token.$type === 'fontFamily' ? (
            <NativeSelect
              id="token-value"
              className="w-full"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            >
              {fontFamilies.map((f) => (
                <NativeSelectOption key={f}>{f}</NativeSelectOption>
              ))}
            </NativeSelect>
          ) : (
            <InputGroup>
              {token.$type === 'color' && (
                <InputGroupAddon>
                  <Chip value={parseColor(draft) ? draft : String(current)} />
                </InputGroupAddon>
              )}
              <InputGroupInput
                id="token-value"
                aria-label="Valeur du token"
                className="font-mono"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                required
                type={token.$type === 'dimension' ? 'number' : 'text'}
                min={token.$type === 'dimension' ? 0 : undefined}
                max={token.$type === 'dimension' ? 128 : undefined}
                step={token.$type === 'dimension' ? 'any' : undefined}
                maxLength={60}
                spellCheck={false}
              />
              {token.$type === 'dimension' && (
                <InputGroupAddon align="inline-end">px</InputGroupAddon>
              )}
            </InputGroup>
          )}
        </Field>
        <Button type="submit" disabled={!dirty}>
          Proposer
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {pickerHex && (
          <label className="flex items-center gap-2">
            <input
              aria-label="Sélecteur de couleur"
              type="color"
              className="h-7 w-10 cursor-pointer rounded-md border bg-transparent p-0.5"
              value={pickerHex.toLowerCase()}
              onChange={(e) =>
                setDraft(
                  withHex(
                    parseColor(draft) ? draft : String(current),
                    e.target.value,
                  ),
                )
              }
            />
            Choisir visuellement (converti en OKLCH, opacité conservée)
          </label>
        )}
        <span>
          {token.$type === 'color'
            ? 'oklch(L C H) ou oklch(L C H / A%), #RRGGBB accepté · '
            : token.$type === 'dimension'
              ? 'Pixels, de 0 à 128 · '
              : ''}
          Rien n’est écrit avant validation.
        </span>
      </div>
      {dirty && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-fill-1 px-3 py-2 text-xs"
        >
          <span>
            {recovered
              ? 'Brouillon récupéré dans cet onglet.'
              : 'Brouillon non enregistré.'}{' '}
            Rien n’est appliqué.
          </span>
          <Button type="button" variant="ghost" size="xs" onClick={discard}>
            Abandonner le brouillon
          </Button>
        </div>
      )}
      <Separator />
      <div className="grid gap-2 text-xs">
        <p aria-live="polite" className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-muted-foreground">
            {pair[0]} / {pair[1]} ({modeLabels[pairMode].toLowerCase()})
          </span>
          <strong className="tabular-nums">{savedContrast.toFixed(2)}:1</strong>
          <ContrastVerdict ratio={savedContrast} />
        </p>
        {draftContrast !== undefined && dirty && (
          <p role="status" className="flex flex-wrap items-center gap-2">
            Contraste proposé :
            <strong className="tabular-nums">
              {draftContrast.toFixed(2)}:1
            </strong>
            <ContrastVerdict ratio={draftContrast} />
            <span className="basis-full text-muted-foreground">
              Cette indication ne certifie pas tous les états du composant.
            </span>
          </p>
        )}
      </div>
    </div>
  );
  const frameSrc = `/?${iframeQuery}&view=component&id=${found?.id ?? 'button'}`;
  const navLink = (active: boolean) =>
    `block rounded-lg px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30 hover:bg-fill-1 ${
      active ? 'bg-fill-2 font-medium' : 'text-foreground/80'
    }`;
  const navTitle = 'px-2.5 pb-1 text-xs text-muted-foreground';
  const navList = (
    <nav aria-label="Navigation" className="grid gap-5">
      <div className="grid gap-0.5">
        <p className={navTitle}>Premiers pas</p>
        {[
          ['welcome', '#/bienvenue', 'Bienvenue'],
          ['start', '#/demarrage', 'Démarrage'],
          ['home', '#/', 'Composants'],
          ['tokens', '#/tokens', 'Tokens'],
        ].map(([kind, href, label]) => (
          <a
            key={kind}
            href={href}
            aria-current={route.kind === kind ? 'page' : undefined}
            className={navLink(route.kind === kind)}
          >
            {label}
          </a>
        ))}
      </div>
      <Input
        type="search"
        aria-label="Filtrer les composants"
        placeholder={`Filtrer les ${pages.length} pages…`}
        value={navQuery}
        onChange={(e) => setNavQuery(e.target.value)}
      />
      {[
        { title: 'Composants', items: components.filter(match) },
        { title: 'Blocs', items: blocks.filter(match) },
      ]
        .filter((g) => g.items.length)
        .map((group) => (
          <div key={group.title} className="grid gap-0.5">
            <p className={navTitle}>{group.title}</p>
            {group.items.map((item) => (
              <a
                key={item.id}
                href={`#/composants/${item.id}`}
                aria-current={item.id === found?.id ? 'page' : undefined}
                className={navLink(item.id === found?.id)}
              >
                {item.title}
                {isNew(item.id) && (
                  <>
                    {' '}
                    <NewTag />
                  </>
                )}
              </a>
            ))}
          </div>
        ))}
      {q && !components.some(match) && !blocks.some(match) && (
        <p className="px-2.5 text-xs text-muted-foreground">Aucune page.</p>
      )}
      <p className="grid gap-0.5 px-2.5 text-2xs text-muted-foreground">
        <span>Local · V2</span>
        <span>{boot?.figma.label ?? 'Figma non connecté'}</span>
      </p>
    </nav>
  );
  const hero: { title: string; lead: string } | null = found
    ? { title: found.title, lead: found.family }
    : (
        {
          home: {
            title: 'Composants',
            lead: `${components.length} composants et ${blocks.length} blocs SortUI, pilotés par vos tokens. Choisissez-en un pour voir ses exemples et sa spécification Figma.`,
          },
          welcome: {
            title: 'Bienvenue',
            lead: 'DS-Studio est un atelier local pour explorer et faire évoluer un design system : une seule source de tokens, toutes les vues.',
          },
          start: {
            title: 'Démarrage',
            lead: 'De l’installation à votre premier changement de token validé, en cinq étapes.',
          },
          history: {
            title: 'Changelog',
            lead: 'Annuler une révision n’écrase pas les autres tokens. L’annulation s’enregistre elle aussi.',
          },
          tokens: {
            title: 'Tokens',
            lead: 'Modifiez une valeur, validez : chaque composant se met à jour partout.',
          },
          component: null,
        } as const
      )[route.kind];
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <a
        href="#ds-title"
        className="sr-only z-50 rounded-lg bg-background px-3 py-2 text-sm font-medium shadow-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-[90rem] items-center gap-3 px-6">
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Ouvrir la navigation"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-auto p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              {navList}
            </SheetContent>
          </Sheet>
          <a
            href="#/"
            className="-mx-1.5 flex items-center gap-2 rounded-lg px-1.5 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <SwatchBookIcon className="size-4" />
            <h1 className="text-sm font-medium tracking-tight">Stride UI</h1>
            <span className="text-xs text-muted-foreground italic">v2.0.4</span>
          </a>
          <div className="ml-auto">
            <Search components={components} blocks={blocks} />
          </div>
          <nav
            aria-label="Principal"
            className="flex items-center gap-0.5 text-sm"
          >
            {[
              ['home', '#/', 'Composants', 'max-sm:hidden'],
              ['tokens', '#/tokens', 'Tokens', 'max-sm:hidden'],
              ['history', '#/changelog', `Changelog · ${state.revision}`, ''],
            ].map(([kind, href, label, extra]) => (
              <a
                key={kind}
                href={href}
                aria-current={route.kind === kind ? 'page' : undefined}
                className={`rounded-lg px-2.5 py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${extra} ${
                  route.kind === kind
                    ? 'bg-fill-2 font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {kind === 'history' && (
                  <HistoryIcon className="size-4 sm:hidden" aria-hidden />
                )}
                <span
                  className={kind === 'history' ? 'max-sm:sr-only' : undefined}
                >
                  {label}
                </span>
              </a>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={
              dark ? 'Passer au thème clair' : 'Passer au thème sombre'
            }
            aria-pressed={dark}
            onClick={() => {
              const next = !dark;
              document.documentElement.classList.toggle('dark', next);
              setDark(next);
              try {
                localStorage.setItem('stride-theme', next ? 'dark' : 'light');
              } catch {
                /* Facultatif : sans stockage, le thème suit le système. */
              }
              const m: Mode = next ? 'dark' : 'light';
              setMode(m);
              if (tokenMode(key))
                setKey(`${m}.${key.split('.')[1]}` as TokenKey);
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Exporter les tokens"
            title="Exporter les tokens"
            onClick={() => void perform(exportTokens)}
          >
            <DownloadIcon />
          </Button>
        </div>
      </header>
      <div className="grid gap-3 px-4 empty:hidden" aria-live="polite">
        {(error || stateError) && !proposal && (
          <Alert variant="destructive">
            <AlertDescription>{error || stateError}</AlertDescription>
          </Alert>
        )}
        {notice && (
          <p role="status" className="text-xs text-muted-foreground">
            {notice}
          </p>
        )}
        {boot?.migratedFrom && (
          <Alert role="status">
            <AlertTitle>Tokens V1 migrés vers SortUI</AlertTitle>
            <AlertDescription>
              Original conservé dans .ds-studio/{boot.migratedFrom}.
            </AlertDescription>
          </Alert>
        )}
      </div>
      {hero && (
        // La clé relance l'effet de texte à chaque nouvelle page.
        <Hero
          key={`${route.kind}:${found?.id ?? ''}`}
          title={hero.title}
          lead={hero.lead}
        />
      )}
      <div
        className={`mx-auto grid w-full max-w-[90rem] flex-1 gap-8 px-4 lg:grid-cols-[13rem_minmax(0,1fr)] ${
          route.kind === 'home'
            ? ''
            : 'xl:grid-cols-[13rem_minmax(0,1fr)_11rem]'
        }`}
      >
        <aside className="sticky top-12 hidden max-h-[calc(100svh-3rem)] self-start overflow-auto border-r py-6 pr-4 lg:block">
          {navList}
        </aside>
        <main className="min-w-0">
          <div key={`${route.kind}:${found?.id ?? ''}`} className="page-enter">
            {route.kind === 'history' ? (
              <section aria-label="Changelog">
                <Changelog
                  history={state.history}
                  sourceLabel={(source) => sourceLabels[source]}
                  onUndo={(event) =>
                    void perform(async () =>
                      setProposal(
                        await request('undo', {
                          revision: state.revision,
                          id: event.id,
                        }),
                      ),
                    )
                  }
                />
              </section>
            ) : route.kind === 'welcome' ? (
              <Welcome />
            ) : route.kind === 'start' ? (
              <GetStarted />
            ) : route.kind === 'home' ? (
              <Landing components={components} blocks={blocks} />
            ) : (
              <div className={'grid gap-6 p-4'}>
                <section
                  aria-labelledby="ds-title"
                  className="grid min-w-0 gap-4"
                >
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <div className="flex items-center gap-2">
                      {found && (
                        <>
                          <Button
                            variant={showTokens ? 'secondary' : 'outline'}
                            size="sm"
                            aria-pressed={showTokens}
                            onClick={() => setShowTokens(!showTokens)}
                          >
                            <PaletteIcon data-icon="inline-start" />
                            Tokens
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label="Composant précédent"
                            disabled={at <= 0}
                            render={
                              at > 0 ? (
                                <a href={`#/composants/${pages[at - 1].id}`} />
                              ) : undefined
                            }
                          >
                            <ChevronLeftIcon />
                          </Button>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {at + 1} / {pages.length}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label="Composant suivant"
                            disabled={at >= pages.length - 1}
                            render={
                              at < pages.length - 1 ? (
                                <a href={`#/composants/${pages[at + 1].id}`} />
                              ) : undefined
                            }
                          >
                            <ChevronRightIcon />
                          </Button>
                        </>
                      )}
                      {!found && route.kind === 'tokens' && (
                        <>
                          <Button
                            variant="ghost"
                            title={
                              boot?.figma.connected
                                ? 'Lire les variables Figma et proposer les différences'
                                : 'Figma non configuré : npm run figma:setup'
                            }
                            disabled={syncing}
                            onClick={() =>
                              void perform(async () => {
                                setSyncing(true);
                                try {
                                  const result = await request<{
                                    proposal: Proposal | null;
                                  }>('figma-sync', {
                                    revision: state.revision,
                                  });
                                  if (result.proposal)
                                    setProposal(result.proposal);
                                  else
                                    setNotice(
                                      'Figma et DS-Studio sont déjà identiques.',
                                    );
                                } finally {
                                  setSyncing(false);
                                }
                              })
                            }
                          >
                            <RefreshCwIcon
                              data-icon="inline-start"
                              className={syncing ? 'animate-spin' : undefined}
                            />
                            <span className="max-sm:sr-only">
                              {syncing ? 'Lecture de Figma…' : 'Sync Figma'}
                            </span>
                          </Button>
                          <label
                            className={buttonVariants({ variant: 'ghost' })}
                          >
                            <UploadIcon data-icon="inline-start" />
                            <span className="max-sm:sr-only">
                              Importer un JSON
                            </span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".json,application/json"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (file)
                                  void perform(async () => {
                                    if (file.size > 128000)
                                      throw new Error(
                                        'Fichier trop volumineux (128 Ko maximum).',
                                      );
                                    const tokens = JSON.parse(
                                      await file.text(),
                                    );
                                    setProposal(
                                      await request('import', {
                                        revision: state.revision,
                                        tokens,
                                      }),
                                    );
                                  });
                              }}
                            />
                          </label>
                        </>
                      )}
                      <Badge variant="outline" className="tabular-nums">
                        r{state.revision}
                      </Badge>
                    </div>
                  </div>
                  {found ? (
                    <>
                      <h3 className="sr-only">Aperçu</h3>
                      <CopyExampleButton id={found.id} />
                      <PreviewFrame
                        title={`Composant ${found.title}`}
                        src={frameSrc}
                        minHeight={roomy.has(found.id) ? 400 : 160}
                      />
                      <ComponentDocs
                        id={found.id}
                        title={found.title}
                        scope={scope}
                      />
                      <FigmaSpec id={found.id} />
                    </>
                  ) : (
                    <>
                      {editor}
                      <iframe
                        className="catalogue-frame h-64 w-full rounded-2xl border bg-background"
                        title="Aperçu en direct"
                        src={frameSrc}
                      />
                    </>
                  )}
                </section>
                {found && showTokens && (
                  <aside
                    aria-label="Éditeur de tokens"
                    className="fixed inset-x-2 top-14 bottom-20 z-40 grid content-start gap-2 overflow-auto rounded-2xl border bg-background p-2 shadow-lg sm:inset-x-auto sm:right-4 sm:w-[26rem]"
                  >
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="justify-self-end"
                      aria-label="Fermer les tokens"
                      onClick={() => setShowTokens(false)}
                    >
                      <XIcon />
                    </Button>
                    {scope && (
                      <p className="px-2 text-xs text-muted-foreground">
                        Seuls les tokens utilisés par ce composant sont listés.
                      </p>
                    )}
                    {editor}
                  </aside>
                )}
              </div>
            )}
            {nextPage && <NextPage next={nextPage} />}
          </div>
        </main>
        {/* L'accueil n'a que deux listes, reliées par la barre du bas : pas de sommaire. */}
        <aside
          className={`sticky top-12 hidden self-start py-6 ${route.kind === 'home' ? '' : 'xl:block'}`}
        >
          <OnThisPage routeKey={`${route.kind}${found?.id ?? ''}`} />
        </aside>
      </div>
      {route.kind === 'home' ? (
        <HomeBar />
      ) : (
        <AssistantBar
          agent={agent}
          onAgent={(a) => {
            setAgent(a);
            setChat([]);
          }}
          info={selectedAgent}
          message={message}
          onMessage={setMessage}
          chat={chat}
          thinking={thinking}
          onSend={() => void sendMessage()}
          onStop={() => controller.current?.abort()}
        />
      )}{' '}
      <Dialog
        open={!!proposal}
        onOpenChange={(open) => {
          if (!open && !saving) setProposal(undefined);
        }}
      >
        <DialogContent
          showCloseButton={false}
          initialFocus={cancelButton}
          className="sm:max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>Valider le changement</DialogTitle>
            <DialogDescription>
              Proposition{' '}
              {proposal && sourceLabels[proposal.source].toLowerCase()} · basée
              sur la révision {proposal?.revision}. Ces valeurs seront
              enregistrées sur votre machine.
            </DialogDescription>
          </DialogHeader>
          {staleProposal && (
            <Alert variant="destructive">
              <AlertDescription>
                Une autre validation a modifié le DS. Fermez ce diff et refaites
                votre proposition ; aucun écrasement n’est permis.
              </AlertDescription>
            </Alert>
          )}
          <div className="max-h-[50vh] overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Avant</TableHead>
                  <TableHead>Après</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-xs">
                {proposal?.patches.map((p) => (
                  <TableRow key={p.key}>
                    <TableHead scope="row" className="font-medium">
                      {p.key}
                    </TableHead>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Chip value={p.before} />
                        <del className="text-destructive-foreground">
                          {p.before}
                        </del>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Chip value={p.after} />
                        <ins className="no-underline">{p.after}</ins>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              ref={cancelButton}
              variant="outline"
              onClick={() => setProposal(undefined)}
              disabled={saving}
            >
              Ne pas appliquer
            </Button>
            <Button
              onClick={() => void accept()}
              disabled={saving || staleProposal}
            >
              {saving ? 'Enregistrement…' : 'Valider et enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
