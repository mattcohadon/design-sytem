import { useState } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  PlusIcon,
  TrashIcon,
  UnderlineIcon,
} from 'lucide-react';
import { siFigma, siGithub, siReact } from 'simple-icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group';
import { DirectionProvider } from '@/components/ui/direction';
import { FileIcon } from '@/components/ui/file-icon';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SimpleIcon } from '@/components/ui/simple-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Family } from './types.js';

function DirectionDemo() {
  const [rtl, setRtl] = useState(false);
  return (
    <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        className="flex flex-wrap items-center gap-2"
      >
        <Button variant="outline" onClick={() => setRtl(!rtl)}>
          {rtl ? 'Passer en LTR' : 'Passer en RTL'}
        </Button>
        <ButtonGroup>
          <Button variant="outline">Premier</Button>
          <Button variant="outline">Dernier</Button>
        </ButtonGroup>
      </div>
    </DirectionProvider>
  );
}

export const actions: Family = {
  id: 'actions',
  title: 'Actions et éléments de base',
  demos: [
    {
      id: 'button',
      title: 'Button',
      render: () => (
        <div className="flex flex-wrap items-center gap-2">
          <Button>Principal</Button>
          <Button variant="outline">Contour</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="ghost">Discret</Button>
          <Button variant="destructive">
            <TrashIcon data-icon="inline-start" />
            Supprimer
          </Button>
          <Button variant="link">Lien</Button>
          <Button size="icon" aria-label="Ajouter">
            <PlusIcon />
          </Button>
          <Button disabled>Indisponible</Button>
        </div>
      ),
    },
    {
      id: 'button-group',
      title: 'Button Group',
      render: () => (
        <ButtonGroup>
          <ButtonGroupText>Export</ButtonGroupText>
          <Button variant="outline">JSON</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">CSS</Button>
          <Button variant="outline">Figma</Button>
        </ButtonGroup>
      ),
    },
    {
      id: 'toggle',
      title: 'Toggle',
      render: () => (
        <div className="flex gap-2">
          <Toggle aria-label="Gras">
            <BoldIcon />
          </Toggle>
          <Toggle variant="outline" defaultPressed>
            <ItalicIcon />
            Italique
          </Toggle>
        </div>
      ),
    },
    {
      id: 'toggle-group',
      title: 'Toggle Group',
      render: () => (
        <ToggleGroup variant="outline" defaultValue={['bold']} multiple>
          <ToggleGroupItem value="bold" aria-label="Gras">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italique">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Souligné">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      id: 'badge',
      title: 'Badge',
      render: () => (
        <div className="flex flex-wrap gap-2">
          <Badge>Nouveau</Badge>
          <Badge variant="secondary">Brouillon</Badge>
          <Badge variant="outline">Bordeaux</Badge>
          <Badge variant="destructive">Erreur</Badge>
        </div>
      ),
    },
    {
      id: 'kbd',
      title: 'Kbd',
      render: () => (
        <p className="text-sm text-muted-foreground">
          Recherche rapide :{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </p>
      ),
    },
    {
      id: 'separator',
      title: 'Separator',
      render: () => (
        <div className="text-sm">
          <p className="font-medium">SortUI</p>
          <p className="text-muted-foreground">
            Un DS construit sur shadcn/ui.
          </p>
          <Separator className="my-3" />
          <div className="flex h-5 items-center gap-3">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Blocs</span>
            <Separator orientation="vertical" />
            <span>Thème</span>
          </div>
        </div>
      ),
    },
    {
      id: 'avatar',
      title: 'Avatar',
      render: () => (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>CL</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
        </div>
      ),
    },
    {
      id: 'simple-icon',
      title: 'Simple Icon',
      render: () => (
        <div className="flex gap-4 text-foreground">
          <SimpleIcon icon={siGithub} title="GitHub" className="size-6" />
          <SimpleIcon icon={siFigma} title="Figma" className="size-6" />
          <SimpleIcon icon={siReact} title="React" className="size-6" />
        </div>
      ),
    },
    {
      id: 'file-icon',
      title: 'File Icon',
      render: () => (
        <div className="flex gap-3">
          {(
            [
              'file',
              'document',
              'spreadsheet',
              'presentation',
              'pdf',
              'archive',
            ] as const
          ).map((type) => (
            <FileIcon key={type} type={type} title={type} className="size-8" />
          ))}
        </div>
      ),
    },
    {
      id: 'spinner',
      title: 'Spinner',
      render: () => (
        <div className="flex items-center gap-4">
          <Spinner />
          <Button disabled>
            <Spinner />
            Envoi…
          </Button>
        </div>
      ),
    },
    {
      id: 'skeleton',
      title: 'Skeleton',
      render: () => (
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ),
    },
    {
      id: 'aspect-ratio',
      title: 'Aspect Ratio',
      render: () => (
        <div className="w-60">
          <AspectRatio ratio={16 / 9} className="rounded-lg bg-fill-2">
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              16 / 9
            </div>
          </AspectRatio>
        </div>
      ),
    },
    {
      id: 'direction',
      title: 'Direction',
      render: () => <DirectionDemo />,
    },
  ],
};
