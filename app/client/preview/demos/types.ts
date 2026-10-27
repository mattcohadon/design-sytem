import type { ReactNode } from 'react';

/** Une démonstration du catalogue : un composant SortUI (id = nom du registre). */
export interface Demo {
  id: string;
  title: string;
  render: () => ReactNode;
}
export interface Family {
  id: string;
  title: string;
  demos: Demo[];
}
