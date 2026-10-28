import { Badge } from '@/components/ui/badge';
import { figmaIds, syncedAt } from './FigmaSpec.js';

const NEW_DAYS = 30;

/** Un composant est « nouveau » s'il vient de la bibliothèque Figma, jusqu'à 30 jours après la synchro. */
export const isNew = (id: string) =>
  figmaIds.has(id) &&
  (!syncedAt || Date.now() - Date.parse(syncedAt) < NEW_DAYS * 864e5);

export function NewTag() {
  return (
    <Badge className="h-4 rounded-full px-1.5 text-2xs leading-none">New</Badge>
  );
}
