import type { ReactNode } from 'react';
import { ScaledCanvas } from './ScaledCanvas.js';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';

/** Taille de la toile de dessin ; elle est réduite d'un bloc pour tenir dans la largeur disponible. */
const W = 1000;
const H = 560;

/** x, y : coin haut gauche dans la toile ; r : rotation en degrés. */
const items: { x: number; y: number; r: number; node: ReactNode }[] = [
  { x: 70, y: 70, r: -5, node: <Button size="lg">Enregistrer</Button> },
  {
    x: 300,
    y: 36,
    r: 3,
    node: <Badge size="lg">Nouveau · 66 composants</Badge>,
  },
  {
    x: 590,
    y: 62,
    r: -3,
    node: (
      <div className="flex items-center gap-3">
        <Switch defaultChecked />
        <span className="text-sm">Mode sombre</span>
      </div>
    ),
  },
  {
    x: 800,
    y: 120,
    r: 6,
    node: (
      <Button variant="outline" size="lg">
        Annuler
      </Button>
    ),
  },
  {
    x: 40,
    y: 210,
    r: 4,
    node: (
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked />
        <span className="text-sm">J’accepte les conditions</span>
      </div>
    ),
  },
  {
    x: 300,
    y: 170,
    r: -2,
    node: (
      <div className="grid w-64 gap-2">
        <span className="text-sm font-medium">Tokens</span>
        <Input placeholder="light.primary" tabIndex={-1} />
        <Slider defaultValue={[62]} aria-label="Rayon" />
      </div>
    ),
  },
  {
    x: 620,
    y: 190,
    r: 2,
    node: (
      <div className="grid w-52 gap-2">
        <span className="text-sm">Synchro Figma</span>
        <Progress value={68} aria-label="Avancement" />
      </div>
    ),
  },
  {
    x: 820,
    y: 270,
    r: -4,
    node: (
      <div className="flex -space-x-1">
        {['MC', 'AL', 'JB'].map((n) => (
          <Avatar key={n} className="ring-2 ring-card">
            <AvatarFallback>{n}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    ),
  },
  {
    x: 90,
    y: 360,
    r: -3,
    node: (
      <div className="flex items-center gap-2 text-sm">
        Rechercher <Kbd>⌘K</Kbd>
      </div>
    ),
  },
  {
    x: 330,
    y: 340,
    r: 3,
    node: (
      <div className="flex items-center gap-3">
        <Toggle variant="outline" defaultPressed>
          Gras
        </Toggle>
        <Spinner />
        <Badge variant="secondary">Beta</Badge>
      </div>
    ),
  },
  {
    x: 590,
    y: 360,
    r: -2,
    node: (
      <div className="grid w-60 gap-1">
        <span className="text-sm font-medium">Contraste</span>
        <span className="text-xs text-muted-foreground">
          4,5:1 sur le texte courant, en clair comme en sombre.
        </span>
      </div>
    ),
  },
  {
    x: 850,
    y: 440,
    r: 4,
    node: <Button variant="destructive">Supprimer</Button>,
  },
  {
    x: 180,
    y: 470,
    r: 2,
    node: <Badge variant="outline">v2.0.4</Badge>,
  },
  {
    x: 440,
    y: 470,
    r: -3,
    node: (
      <div className="flex items-center gap-2">
        <Button size="sm">Valider</Button>
        <Button size="sm" variant="ghost">
          Ignorer
        </Button>
      </div>
    ),
  },
];

/**
 * Nuage de composants : de vrais composants du design system posés en désordre, sans maquette.
 * Les couleurs viennent des tokens, donc le dessin suit le mode clair et le mode sombre.
 */
export function ComponentCloud({ className = '' }: { className?: string }) {
  return (
    <ScaledCanvas
      width={W}
      height={H}
      className={className}
      label="Un nuage de composants du design system : boutons, champs, interrupteurs, jauges et avatars"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute rounded-2xl border bg-card p-3 text-card-foreground shadow-sm"
          style={{
            left: item.x,
            top: item.y,
            transform: `rotate(${item.r}deg)`,
          }}
        >
          {item.node}
        </div>
      ))}
    </ScaledCanvas>
  );
}
