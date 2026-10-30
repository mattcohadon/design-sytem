import { Undo2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  | { kind: 'figma'; date: string; entry: FigmaLogEntry };

/** Une synchro Figma écrite à minuit UTC n'a pas d'heure connue : on n'affiche que la date. */
const hasTime = (iso: string) => !iso.endsWith('T00:00:00.000Z');

/** Changelog en frise verticale : révisions de tokens et synchros de la bibliothèque Figma mêlées, la plus récente en haut. */
export function Changelog({
  history,
  sourceLabel,
  onUndo,
}: {
  history: Revision[];
  sourceLabel: (source: Revision['source']) => string;
  onUndo: (event: Revision) => void;
}) {
  const figma = log as FigmaLogEntry[];
  const events: Event[] = [
    ...history.map((event): Event => ({
      kind: 'token',
      date: event.date,
      event,
    })),
    ...figma.map((entry): Event => ({
      kind: 'figma',
      date: entry.date,
      entry,
    })),
  ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const current = events.findIndex((e) => e.kind === 'token');
  return (
    <>
      {!history.length && (
        <p className="pt-8 text-sm text-muted-foreground">
          Aucun changement enregistré. Chaque validation apparaîtra ici,
          annulable une à une.
        </p>
      )}
      <ol className="py-8">
        {events.map((item, i) => {
          const date = new Date(item.date);
          const last = i === events.length - 1;
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
                    i === current
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
                    current={i === current}
                    sourceLabel={sourceLabel}
                    onUndo={onUndo}
                  />
                ) : (
                  <FigmaEvent entry={item.entry} date={date} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
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

function FigmaEvent({ entry, date }: { entry: FigmaLogEntry; date: Date }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium">Bibliothèque Figma</h3>
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
