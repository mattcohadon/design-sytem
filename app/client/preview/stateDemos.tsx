import type { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { Textarea } from '@/components/ui/textarea';

/**
 * Un seul exemplaire du composant, sans ses variantes ni ses états déjà montrés dans l'exemple
 * principal : sinon chaque état s'appliquerait aussi aux champs désactivés ou invalides de la démo.
 * Les composants absents d'ici utilisent leur démo telle quelle.
 */
export const stateDemos: Record<string, (variant?: string) => ReactNode> = {
  toggle: (variant) => (
    <div className="flex gap-2">
      <Toggle defaultPressed={variant === 'checked'} aria-label="Gras">
        Gras
      </Toggle>
      <Toggle
        variant="outline"
        defaultPressed={variant === 'checked'}
        aria-label="Italique"
      >
        Italique
      </Toggle>
    </div>
  ),
  input: () => <Input className="w-72" placeholder="camille@example.com" />,
  textarea: () => (
    <Textarea className="w-80" placeholder="Décrivez votre idée d’atelier…" />
  ),
  field: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="state-name">Prénom</FieldLabel>
      <Input id="state-name" placeholder="Camille" />
      <FieldDescription>Affiché sur votre badge.</FieldDescription>
    </Field>
  ),
  checkbox: (variant) => (
    <Label className="flex items-center gap-2">
      <Checkbox defaultChecked={variant === 'checked'} /> Ateliers
    </Label>
  ),
  'radio-group': (variant) => (
    <RadioGroup
      defaultValue={variant === 'checked' ? 'matin' : undefined}
      aria-label="Créneau"
    >
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="matin" /> Matin
      </Label>
    </RadioGroup>
  ),
  switch: (variant) => (
    <Label className="flex items-center gap-2">
      <Switch defaultChecked={variant === 'checked'} /> Notifications
    </Label>
  ),
  slider: () => (
    <div className="w-64">
      <Slider defaultValue={40} max={100} aria-label="Budget" />
    </div>
  ),
};
