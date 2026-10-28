import { Undo2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Revision, TokenValue } from '../shared/model.js';

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

/** Changelog en frise verticale : une révision par point, la plus récente en haut. */
export function Changelog({
  history,
  sourceLabel,
  onUndo,
}: {
  history: Revision[];
  sourceLabel: (source: Revision['source']) => string;
  onUndo: (event: Revision) => void;
}) {
  if (!history.length)
    return (
      <p className="py-8 text-sm text-muted-foreground">
        Aucun changement enregistré. Chaque validation apparaîtra ici, annulable
        une à une.
      </p>
    );
  const events = [...history].reverse();
  return (
    <ol className="py-8">
      {events.map((event, i) => {
        const date = new Date(event.date);
        const last = i === events.length - 1;
        return (
          <li
            key={event.id}
            className="grid grid-cols-[1.25rem_1fr] gap-x-4 sm:grid-cols-[7rem_1.25rem_1fr]"
          >
            <div className="hidden pt-0.5 text-right text-xs text-muted-foreground tabular-nums sm:block">
              <time dateTime={event.date}>
                <span className="block text-foreground">
                  {day.format(date)}
                </span>
                {hour.format(date)}
              </time>
            </div>
            <div className="flex flex-col items-center" aria-hidden>
              <span
                className={`mt-1 size-3 shrink-0 rounded-full border-2 ${
                  i === 0
                    ? 'border-primary bg-primary'
                    : 'border-border bg-background'
                }`}
              />
              {!last && <span className="w-px flex-1 bg-fill-4" />}
            </div>
            <div className={`grid content-start gap-2 ${last ? '' : 'pb-8'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium">
                  Révision {event.revision}
                </h3>
                <Badge variant="outline">{sourceLabel(event.source)}</Badge>
                {i === 0 && <Badge className="rounded-full">Actuelle</Badge>}
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
            </div>
          </li>
        );
      })}
    </ol>
  );
}
