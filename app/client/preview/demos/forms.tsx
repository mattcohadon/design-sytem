import { useState } from 'react';
import { fr } from 'react-day-picker/locale';
import { MailIcon, SearchIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Family } from './types.js';

const villes = [
  'Bordeaux',
  'Lille',
  'Lyon',
  'Marseille',
  'Nantes',
  'Paris',
  'Rennes',
  'Toulouse',
];
const formats = [
  { label: 'Atelier', value: 'atelier' },
  { label: 'Conférence', value: 'conference' },
  { label: 'Visite', value: 'visite' },
];

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={fr}
      className="rounded-lg border"
    />
  );
}
function SliderDemo() {
  const [value, setValue] = useState(40);
  return (
    <div className="grid w-64 gap-2 text-sm">
      <span>Budget : {value} €</span>
      <Slider
        value={value}
        onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
        max={100}
        aria-label="Budget"
      />
    </div>
  );
}

export const forms: Family = {
  id: 'forms',
  title: 'Formulaires',
  demos: [
    {
      id: 'input',
      title: 'Input',
      render: () => (
        <div className="grid w-72 gap-2">
          <Input placeholder="camille@example.com" type="email" />
          <Input placeholder="Désactivé" disabled />
          <Input placeholder="Invalide" aria-invalid />
        </div>
      ),
    },
    {
      id: 'input-group',
      title: 'Input Group',
      render: () => (
        <InputGroup className="w-80">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Rechercher un atelier" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Chercher</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ),
    },
    {
      id: 'input-otp',
      title: 'Input OTP',
      render: () => (
        <InputOTP maxLength={6} aria-label="Code de vérification">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      ),
    },
    {
      id: 'textarea',
      title: 'Textarea',
      render: () => (
        <Textarea
          className="w-80"
          placeholder="Décrivez votre idée d’atelier…"
        />
      ),
    },
    {
      id: 'label',
      title: 'Label',
      render: () => (
        <div className="flex items-center gap-2">
          <Checkbox id="label-demo" />
          <Label htmlFor="label-demo">Recevoir la lettre du quartier</Label>
        </div>
      ),
    },
    {
      id: 'field',
      title: 'Field',
      render: () => (
        <FieldSet className="w-80">
          <FieldLegend>Inscription</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-name">Prénom</FieldLabel>
              <Input id="field-name" placeholder="Camille" />
              <FieldDescription>Affiché sur votre badge.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="field-mail">
                <MailIcon className="size-4" /> E-mail
              </FieldLabel>
              <Input id="field-mail" aria-invalid defaultValue="camille@" />
              <FieldError>Adresse e-mail incomplète.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="field-cgu" />
              <FieldLabel htmlFor="field-cgu">
                J’accepte les conditions
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      id: 'checkbox',
      title: 'Checkbox',
      render: () => (
        <div className="grid gap-3">
          {['Ateliers', 'Conférences', 'Visites'].map((label, i) => (
            <Label key={label} className="flex items-center gap-2">
              <Checkbox defaultChecked={i === 0} /> {label}
            </Label>
          ))}
          <Label className="flex items-center gap-2 opacity-60">
            <Checkbox disabled /> Indisponible
          </Label>
        </div>
      ),
    },
    {
      id: 'radio-group',
      title: 'Radio Group',
      render: () => (
        <RadioGroup defaultValue="matin" aria-label="Créneau">
          {[
            ['matin', 'Matin'],
            ['midi', 'Midi'],
            ['soir', 'Soir'],
          ].map(([value, label]) => (
            <Label key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} /> {label}
            </Label>
          ))}
        </RadioGroup>
      ),
    },
    {
      id: 'switch',
      title: 'Switch',
      render: () => (
        <div className="grid gap-3">
          <Label className="flex items-center gap-2">
            <Switch defaultChecked /> Notifications
          </Label>
          <Label className="flex items-center gap-2">
            <Switch size="sm" /> Mode compact
          </Label>
        </div>
      ),
    },
    {
      id: 'slider',
      title: 'Slider',
      render: () => <SliderDemo />,
    },
    {
      id: 'select',
      title: 'Select',
      render: () => (
        <Select items={formats} defaultValue="atelier">
          <SelectTrigger className="w-56" aria-label="Format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Formats</SelectLabel>
              {formats.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: 'native-select',
      title: 'Native Select',
      render: () => (
        <NativeSelect aria-label="Ville" defaultValue="Bordeaux">
          {villes.map((v) => (
            <NativeSelectOption key={v} value={v}>
              {v}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ),
    },
    {
      id: 'combobox',
      title: 'Combobox',
      render: () => (
        <Combobox items={villes}>
          <ComboboxInput placeholder="Choisir une ville" className="w-64" />
          <ComboboxContent>
            <ComboboxEmpty>Aucune ville.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      ),
    },
    {
      id: 'calendar',
      title: 'Calendar',
      render: () => <CalendarDemo />,
    },
  ],
};
