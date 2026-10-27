import { useState } from 'react';
import {
  CalendarIcon,
  CopyIcon,
  LogOutIcon,
  PaletteIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Family } from './types.js';

function CommandItems() {
  return (
    <>
      <CommandEmpty>Aucun résultat.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <CalendarIcon /> Calendrier
        </CommandItem>
        <CommandItem>
          <PaletteIcon /> Tokens
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Réglages">
        <CommandItem>
          <UserIcon /> Profil <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <SettingsIcon /> Préférences <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
function CommandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-3">
      <Command className="w-80 rounded-xl border">
        <CommandInput placeholder="Rechercher une commande…" />
        <CommandList>
          <CommandItems />
        </CommandList>
      </Command>
      <Button variant="outline" className="w-fit" onClick={() => setOpen(true)}>
        <SearchIcon /> Palette <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Rechercher une commande…" />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

export const overlays: Family = {
  id: 'overlays',
  title: 'Superpositions et menus',
  demos: [
    {
      id: 'dialog',
      title: 'Dialog',
      render: () => (
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Modifier le profil
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le profil</DialogTitle>
              <DialogDescription>
                Démonstration : rien n’est enregistré.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="dialog-name">Nom</Label>
              <Input id="dialog-name" defaultValue="Camille" />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Annuler
              </DialogClose>
              <DialogClose render={<Button />}>Enregistrer</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: 'alert-dialog',
      title: 'Alert Dialog',
      render: () => (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Supprimer le brouillon
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le brouillon ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action de démonstration ne supprime rien.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
    {
      id: 'sheet',
      title: 'Sheet',
      render: () => (
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Ouvrir le panneau
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
              <SheetDescription>
                Affinez la liste des ateliers.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 px-4">
              <Label htmlFor="sheet-city">Ville</Label>
              <Input id="sheet-city" defaultValue="Bordeaux" />
            </div>
            <SheetFooter>
              <SheetClose render={<Button />}>Appliquer</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ),
    },
    {
      id: 'drawer',
      title: 'Drawer',
      render: () => (
        <Drawer>
          <DrawerTrigger render={<Button variant="outline" />}>
            Ouvrir le tiroir
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Objectif de la semaine</DrawerTitle>
              <DrawerDescription>
                Glissez vers le bas pour fermer.
              </DrawerDescription>
            </DrawerHeader>
            <p className="px-4 text-center text-5xl font-semibold">
              3 ateliers
            </p>
            <DrawerFooter>
              <DrawerClose render={<Button />}>Valider</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ),
    },
    {
      id: 'popover',
      title: 'Popover',
      render: () => (
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Dimensions
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Taille de la carte en pixels.
              </PopoverDescription>
            </PopoverHeader>
            <div className="grid grid-cols-2 gap-2">
              <Input aria-label="Largeur" defaultValue="320" />
              <Input aria-label="Hauteur" defaultValue="240" />
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      id: 'hover-card',
      title: 'Hover Card',
      render: () => (
        <HoverCard>
          <HoverCardTrigger render={<Button variant="link" />}>
            SortUI
          </HoverCardTrigger>
          <HoverCardContent className="flex w-72 gap-3">
            <Avatar>
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 text-sm">
              <span className="font-medium">SortUI</span>
              <span className="text-muted-foreground">
                Les composants shadcn/ui restylés sur un seul jeu de tokens.
              </span>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      id: 'tooltip',
      title: 'Tooltip',
      render: () => (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="outline" size="icon" aria-label="Copier" />
            }
          >
            <CopyIcon />
          </TooltipTrigger>
          <TooltipContent>
            Copier <Kbd>⌘C</Kbd>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'dropdown-menu',
      title: 'Dropdown Menu',
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Mon compte
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Camille</DropdownMenuLabel>
              <DropdownMenuItem>
                <UserIcon /> Profil{' '}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon /> Réglages
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: 'context-menu',
      title: 'Context Menu',
      render: () => (
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            Clic droit ici
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem>
              Retour <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Recharger</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Inspecter</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
    },
    {
      id: 'command',
      title: 'Command',
      render: () => <CommandDemo />,
    },
  ],
};
