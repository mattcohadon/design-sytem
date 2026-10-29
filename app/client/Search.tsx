import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { isNew, NewTag } from './NewTag.js';

interface Page {
  id: string;
  title: string;
}

const intro = [
  { hash: '#/', title: 'Composants' },
  { hash: '#/bienvenue', title: 'Bienvenue' },
  { hash: '#/demarrage', title: 'Démarrage' },
  { hash: '#/tokens', title: 'Tokens' },
  { hash: '#/changelog', title: 'Changelog' },
];

/** Recherche de pages : bouton dans la barre du haut, palette ouverte aussi par Cmd/Ctrl + K. */
export function Search({
  components,
  blocks,
}: {
  components: Page[];
  blocks: Page[];
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
  const go = (hash: string) => {
    setOpen(false);
    location.hash = hash;
  };
  const pages = (label: string, list: Page[]) => (
    <CommandGroup heading={label}>
      {list.map((p) => (
        <CommandItem
          key={p.id}
          value={`${p.title} ${p.id}`}
          onSelect={() => go(`#/composants/${p.id}`)}
        >
          {p.title}
          {isNew(p.id) && <NewTag />}
        </CommandItem>
      ))}
    </CommandGroup>
  );
  return (
    <>
      <button
        type="button"
        aria-label="Rechercher"
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-2 rounded-lg bg-fill-1 px-2.5 text-sm text-muted-foreground transition-colors outline-none hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-40 lg:w-52"
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="max-sm:hidden">Rechercher…</span>
        <kbd className="ml-auto text-2xs max-md:hidden">⌘K</kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Rechercher"
        description="Pages, composants et blocs."
      >
        <Command>
          <CommandInput placeholder="Rechercher une page, un composant…" />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup heading="Premiers pas">
              {intro.map((p) => (
                <CommandItem
                  key={p.hash}
                  value={p.title}
                  onSelect={() => go(p.hash)}
                >
                  {p.title}
                </CommandItem>
              ))}
            </CommandGroup>
            {pages('Composants', components)}
            {pages('Blocs', blocks)}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
