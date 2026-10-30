import { Badge } from '@/components/ui/badge';
import log from '../../figma-sync/changelog.json';
import type { FigmaLogEntry } from '../../figma-sync/changelog.js';
import { describe, tally } from '../../figma-sync/describe.js';

const day = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
/** Synchros de la bibliothèque Figma : une entrée par PR de synchro fusionnée, la plus récente en haut. */
export function FigmaChangelog() {
  const entries = [...(log as FigmaLogEntry[])].reverse();
  if (!entries.length) return null;
  return (
    <section aria-label="Synchros Figma" className="border-t pt-8">
      <h3 className="text-sm font-medium">Bibliothèque Figma</h3>
      <ol className="grid gap-6 py-6">
        {entries.map((e) => (
          <li key={e.date} className="grid gap-2">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <time dateTime={e.date} className="text-xs text-muted-foreground">
                {day.format(new Date(e.date))}
              </time>
              <span className="text-xs text-muted-foreground">
                {tally(e.changes)}
              </span>
            </div>
            <ul className="grid gap-1.5 text-sm">
              {e.changes.map((c, i) => (
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
          </li>
        ))}
      </ol>
    </section>
  );
}
