import { Badge } from '@/components/ui/badge';
import { figmaIds } from './FigmaSpec.js';

/** Un composant est « nouveau » dès qu'il vient de la bibliothèque Figma (snapshot de la synchro). */
export const isNew = (id: string) => figmaIds.has(id);

export function NewTag() {
  return (
    <Badge className="h-4 rounded-full px-1.5 text-2xs leading-none">New</Badge>
  );
}
