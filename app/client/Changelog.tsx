import { useEffect, useState } from 'react';
import { SearchIcon, Undo2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Revision, TokenValue } from '../shared/model.js';
import log from '../../figma-sync/changelog.json';
import type { FigmaLogEntry } from '../../figma-sync/changelog.js';
import { describe, tally } from '../../figma-sync/describe.js';

const day = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const hour = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
});

const isColor = (key: string) => /^(light|dark)\./.test(key);

function Value({ k, value }: { k: string; value: TokenValue }) {
  if (isColor(k))
    return (
      <span
        role="img"
        aria-label={String(value)}
        title={String(value)}
        className="inline-block size-3.5 rounded-full ring-1 ring-border"
        style={{ background: String(value) }}
      />
    );
  return <span className="tabular-nums">{String(value)}</span>;
}

type Event =
  | { kind: 'token'; date: string; event: Revision }
  | { kind: 'figma'; date: string; entry: FigmaLogEntry; version: number };

type Filter = 'all' | 'token' | 'figma';

/** Sans accents ni majuscules, pour que « bibliotheque » trouve « Bibliothèque ». */
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Une synchro Figma écrite à minuit UTC n'a pas d'heure connue : on n'affiche que la date. */
const hasTime = (iso: string) => !iso.endsWith('T00:00:00.000Z');

/** Changelog en frise verticale : révisions de tokens et synchros de la bibliothèque Figma mêlées, la plus récente en haut. */
export function Changelog({
  history,
  sourceLabel,
  onUndo,
  onView,
}: {
  history: Revision[];
  sourceLabel: (source: Revision['source']) => string;
  onUndo: (event: Revision) => void;
  /** Prévient la page que la liste affichée a changé (pour relire « Sur cette page »). */
  onView?: (key: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const figma = log as FigmaLogEntry[];
  // La version d'une synchro est son rang dans le journal (ajouté seulement, jamais réordonné).
  const all: Event[] = [
    ...history.map((event): Event => ({
      kind: 'token',
      date: event.date,
      event,
    })),
    ...figma.map((entry, i): Event => ({
      kind: 'figma',
      date: entry.date,
      entry,
      version: i + 1,
    })),
  ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const q = fold(query.trim());
  const terms = q.split(/\s+/).filter(Boolean);
  const events = all.filter(
    (e) =>
      (filter === 'all' || filter === e.kind) &&
      (!terms.length ||
        terms.every((t) => fold(searchText(e, sourceLabel)).includes(t))),
  );
  // « Actuelle » reste sur la dernière révision de tokens, même filtrée.
  const currentId = history.at(-1)?.id;
  const view = `${filter}|${q}`;
  useEffect(() => onView?.(view), [view, onView]);
  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Rechercher dans le changelog"
            placeholder="Token, composant, révision…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <ToggleGroup
          variant="outline"
          spacing={0}
          aria-label="Filtrer le changelog"
          value={[filter]}
          onValueChange={(v) => setFilter((v[0] as Filter) ?? 'all')}
        >
          <ToggleGroupItem value="all">Tout</ToggleGroupItem>
          <ToggleGroupItem value="token">Tokens</ToggleGroupItem>
          <ToggleGroupItem value="figma">Bibliothèque Figma</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {!history.length && filter !== 'figma' && !q && (
        <p className="pt-8 text-sm text-muted-foreground">
          Aucun changement enregistré. Chaque validation apparaîtra ici,
          annulable une à une.
        </p>
      )}
      {!events.length && (history.length > 0 || filter === 'figma' || q) && (
        <p role="status" className="pt-8 text-sm text-muted-foreground">
          Aucun résultat. Essayez un autre mot ou un autre filtre.
        </p>
      )}
      <ol className="py-8">
        {events.map((item, i) => {
          const date = new Date(item.date);
          const last = i === events.length - 1;
          const current = item.kind === 'token' && item.event.id === currentId;
          return (
            <li
              key={item.kind === 'token' ? item.event.id : `figma-${item.date}`}
              className="grid grid-cols-[1.25rem_1fr] gap-x-4 sm:grid-cols-[7rem_1.25rem_1fr]"
            >
              <div className="hidden pt-0.5 text-right text-xs text-muted-foreground tabular-nums sm:block">
                <time dateTime={item.date}>
                  <span className="block text-foreground">
                    {day.format(date)}
                  </span>
                  {hasTime(item.date) ? hour.format(date) : null}
                </time>
              </div>
              <div className="flex flex-col items-center" aria-hidden>
                <span
                  className={`mt-1 size-3 shrink-0 rounded-full border-2 ${
                    current
                      ? 'border-primary bg-primary'
                      : item.kind === 'figma'
                        ? 'border-primary bg-background'
                        : 'border-border bg-background'
                  }`}
                />
                {!last && <span className="w-px flex-1 bg-fill-4" />}
              </div>
              <div className={`grid content-start gap-2 ${last ? '' : 'pb-8'}`}>
                {item.kind === 'token' ? (
                  <TokenEvent
                    event={item.event}
                    date={date}
                    current={current}
                    sourceLabel={sourceLabel}
                    onUndo={onUndo}
                  />
                ) : (
                  <FigmaEvent
                    entry={item.entry}
                    version={item.version}
                    date={date}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Tout ce qui s'affiche d'une entrée, pour la recherche. */
function searchText(
  e: Event,
  sourceLabel: (source: Revision['source']) => string,
) {
  if (e.kind === 'token')
    return [
      `Révision ${e.event.revision}`,
      sourceLabel(e.event.source),
      ...e.event.patches.flatMap((p) => [
        p.key,
        String(p.before),
        String(p.after),
      ]),
    ].join(' ');
  return [
    `Bibliothèque Figma v${e.version}`,
    tally(e.entry.changes),
    ...e.entry.changes.flatMap((c) => [describe(c), ...c.details]),
  ].join(' ');
}

function TokenEvent({
  event,
  date,
  current,
  sourceLabel,
  onUndo,
}: {
  event: Revision;
  date: Date;
  current: boolean;
  sourceLabel: (source: Revision['source']) => string;
  onUndo: (event: Revision) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium">Révision {event.revision}</h3>
        <Badge variant="outline">{sourceLabel(event.source)}</Badge>
        {current && <Badge className="rounded-full">Actuelle</Badge>}
        <time
          dateTime={event.date}
          className="text-xs text-muted-foreground tabular-nums sm:hidden"
        >
          {day.format(date)} · {hour.format(date)}
        </time>
      </div>
      <ul className="grid gap-1 text-xs">
        {event.patches.slice(0, 6).map((p) => (
          <li key={p.key} className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-2xs text-muted-foreground">
              {p.key}
            </code>
            <Value k={p.key} value={p.before} />
            <span aria-hidden className="text-muted-foreground">
              →
            </span>
            <Value k={p.key} value={p.after} />
          </li>
        ))}
        {event.patches.length > 6 && (
          <li className="text-muted-foreground">
            + {event.patches.length - 6} autres tokens
          </li>
        )}
      </ul>
      <Button
        variant="ghost"
        size="xs"
        className="w-fit"
        onClick={() => onUndo(event)}
      >
        <Undo2Icon data-icon="inline-start" />
        Annuler la révision {event.revision}
      </Button>
    </>
  );
}

function FigmaEvent({
  entry,
  version,
  date,
}: {
  entry: FigmaLogEntry;
  version: number;
  date: Date;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium">Bibliothèque Figma v{version}</h3>
        <Badge variant="outline">Figma</Badge>
        <span className="text-xs text-muted-foreground">
          {tally(entry.changes)}
        </span>
        <time
          dateTime={entry.date}
          className="text-xs text-muted-foreground tabular-nums sm:hidden"
        >
          {day.format(date)}
        </time>
      </div>
      <ul className="grid gap-1.5 text-sm">
        {entry.changes.map((c, i) => (
          <li key={i} className="grid gap-0.5">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{describe(c)}</span>
              {c.breaking && (
                <Badge variant="destructive">Changement cassant</Badge>
              )}
            </span>
            {c.details.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {c.details.join(' · ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
