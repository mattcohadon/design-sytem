import { useEffect, useState } from 'react';
import { colorNames } from '../shared/model.js';

// Sources des composants SortUI, chargées à la demande (un fragment par composant).
const sources = import.meta.glob('./sortui/components/ui/*.tsx', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

export interface ComponentScope {
  id: string;
  names: Set<string>;
  radius: boolean;
}

const prefixes =
  'bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|caret|shadow|placeholder';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Tokens réellement cités par les classes Tailwind du composant (couleurs et rayon). */
function scan(id: string, source: string): ComponentScope {
  const names = new Set<string>();
  for (const name of colorNames)
    if (
      new RegExp(`(?<![\\w-])(?:${prefixes})-${escape(name)}(?![\\w-])`).test(
        source,
      )
    )
      names.add(name);
  // « border » seul colore la bordure avec le token border ; « ring » et « outline » aussi.
  if (/(?<![\w-])border(?![\w-])/.test(source)) names.add('border');
  return { id, names, radius: /(?<![\w-])rounded(?![\w])/.test(source) };
}

/** Périmètre de tokens d'un composant, ou undefined si sa source est introuvable (blocs). */
export function useComponentTokens(id?: string): ComponentScope | undefined {
  const [scope, setScope] = useState<ComponentScope>();
  useEffect(() => {
    const load = id ? sources[`./sortui/components/ui/${id}.tsx`] : undefined;
    if (!id || !load) return;
    let live = true;
    load().then((src) => live && setScope(scan(id, src)));
    return () => {
      live = false;
    };
  }, [id]);
  return scope && scope.id === id ? scope : undefined;
}

/** Un token (clé « light.primary », « radius.base »…) appartient-il au périmètre ? */
export function inScope(
  scope: ComponentScope | undefined,
  key: string,
): boolean {
  if (!scope) return true;
  if (key === 'radius.base') return scope.radius;
  if (key === 'font.sans') return false;
  return scope.names.has(key.slice(key.indexOf('.') + 1));
}
