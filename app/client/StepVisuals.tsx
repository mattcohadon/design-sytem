import type { ReactNode } from 'react';
import { CheckIcon, CopyIcon, GitPullRequestIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScaledCanvas } from './ScaledCanvas.js';

const W = 600;
const H = 450;

/** Carte posée sur la toile : position et rotation en pixels de la toile. */
function Tile({
  x,
  y,
  w,
  r = 0,
  className = '',
  children,
}: {
  x: number;
  y: number;
  w: number;
  r?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute rounded-2xl border bg-card p-4 text-card-foreground shadow-sm ${className}`}
      style={{ left: x, top: y, width: w, transform: `rotate(${r}deg)` }}
    >
      {children}
    </div>
  );
}

const variants = ['default', 'outline', 'ghost'] as const;
const label = { default: 'Default', outline: 'Outline', ghost: 'Ghost' };

/** Étape 1 : un composant dessiné avec ses variantes, ses états et ses variables. */
export function FigmaVisual() {
  return (
    <ScaledCanvas
      width={W}
      height={H}
      label="Un composant Button avec ses variantes Default, Outline et Ghost, ses états au repos, au focus et désactivé, et ses variables de couleur"
    >
      <Tile x={24} y={28} w={366} r={-1}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Button</span>
          <Badge variant="outline">Composant</Badge>
        </div>
        <div className="grid grid-cols-[4.5rem_repeat(3,1fr)] items-center gap-x-2 gap-y-3">
          <span />
          {variants.map((v) => (
            <span key={v} className="text-xs text-muted-foreground">
              {label[v]}
            </span>
          ))}
          <span className="text-xs text-muted-foreground">Repos</span>
          {variants.map((v) => (
            <Button key={v} variant={v} size="sm">
              Valider
            </Button>
          ))}
          <span className="text-xs text-muted-foreground">Focus</span>
          {variants.map((v) => (
            <Button
              key={v}
              variant={v}
              size="sm"
              className="ring-3 ring-ring/40"
            >
              Valider
            </Button>
          ))}
          <span className="text-xs text-muted-foreground">Désactivé</span>
          {variants.map((v) => (
            <Button key={v} variant={v} size="sm" disabled>
              Valider
            </Button>
          ))}
        </div>
      </Tile>
      <Tile x={414} y={64} w={162} r={2}>
        <span className="text-sm font-medium">Variables</span>
        <ul className="mt-3 grid gap-2 text-xs">
          {[
            ['primary', 'bg-primary'],
            ['foreground', 'bg-foreground'],
            ['muted', 'bg-muted-foreground'],
            ['border', 'bg-border'],
          ].map(([name, swatch]) => (
            <li key={name} className="flex items-center gap-2">
              <span className={`size-4 rounded-full ${swatch}`} />
              <span className="font-mono text-2xs">light.{name}</span>
            </li>
          ))}
        </ul>
      </Tile>
      <Tile x={96} y={338} w={400} r={1}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Propriétés</span>
          <Badge variant="secondary">Variant=Outline</Badge>
          <Badge variant="secondary">State=Focus</Badge>
          <Badge variant="secondary">Size=Small</Badge>
        </div>
      </Tile>
    </ScaledCanvas>
  );
}

/** Étape 2 : la pull request de synchro et son entrée de changelog. */
export function SyncVisual() {
  return (
    <ScaledCanvas
      width={W}
      height={H}
      label="Une pull request de synchro Figma qui résume les changements, et l'entrée correspondante du changelog"
    >
      <Tile x={30} y={30} w={540} r={-1}>
        <div className="flex items-center gap-3">
          <GitPullRequestIcon className="size-5 text-primary" />
          <span className="text-base font-medium">Figma sync : 29 oct.</span>
          <Badge className="ml-auto">Ouverte</Badge>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Entrée du Changelog
        </p>
        <ul className="mt-2 grid gap-2 text-sm">
          <li className="flex items-center gap-2">
            <Badge variant="secondary">1 ajout</Badge>
            Nouveau composant « Alert »
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="secondary">1 modification</Badge>
            Composant « Button » modifié
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="destructive">Changement cassant</Badge>
            Variante « link » supprimée
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {['ubuntu', 'macos', 'windows'].map((os) => (
            <span key={os} className="flex items-center gap-1">
              <CheckIcon className="size-3.5 text-primary" />
              check ({os})
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Fusionner</Button>
          <Button size="sm" variant="outline">
            Voir le diff
          </Button>
        </div>
      </Tile>
      <Tile x={290} y={322} w={290} r={3}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Bibliothèque Figma v2</span>
          <Badge variant="outline">Figma</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          29 oct. 2026 · 1 ajout
        </p>
        <p className="mt-2 text-sm">Nouveau composant « Alert »</p>
      </Tile>
    </ScaledCanvas>
  );
}

/** Étape 3 : la page d'un composant, son aperçu, son exemple et son code à copier. */
export function ShipVisual() {
  return (
    <ScaledCanvas
      width={W}
      height={H}
      label="La page d'un composant Button avec son aperçu, ses états, son exemple de code et un bouton pour le copier"
    >
      <Tile x={28} y={26} w={544} r={-0.5}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">Button</span>
          <Badge>New</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Déclenche une action. Ses états et ses props sont documentés.
        </p>
        <Tabs defaultValue="code" className="mt-3">
          <TabsList>
            <TabsTrigger value="apercu">Aperçu</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border bg-fill-1 p-3">
          <Button size="sm">Enregistrer</Button>
          <Button size="sm" variant="outline">
            Annuler
          </Button>
          <Button size="sm" variant="ghost">
            Ignorer
          </Button>
          <Button size="sm" disabled>
            Désactivé
          </Button>
        </div>
        <div className="mt-3 rounded-xl border bg-fill-2 p-3 font-mono text-xs leading-relaxed">
          <div className="mb-2 flex items-center justify-between font-sans">
            <span className="text-muted-foreground">button-exemple.tsx</span>
            <span className="flex items-center gap-1 text-foreground">
              <CopyIcon className="size-3.5" />
              Copier
            </span>
          </div>
          <div className="text-muted-foreground">
            import {'{'} Button {'}'} from "@/components/ui/button"
          </div>
          <div className="mt-2">
            <span className="text-primary">{'<Button'}</span> variant="outline"{' '}
            size="sm"
            <span className="text-primary">{'>'}</span>
          </div>
          <div className="pl-4">Enregistrer</div>
          <div className="text-primary">{'</Button>'}</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          États
          {['Survol', 'Appui', 'Focus', 'Désactivé', 'Invalide'].map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </Tile>
    </ScaledCanvas>
  );
}
