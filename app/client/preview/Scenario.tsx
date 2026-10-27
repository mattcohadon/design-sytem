import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatThread } from '@/registry/blocks/chat-thread-01/components/chat-thread';
import { ChatWelcome } from '@/registry/blocks/chat-welcome-01/components/chat-welcome';
import { EffortSlider } from '@/registry/blocks/effort-slider-01/components/effort-slider';
import { PromptInput } from '@/registry/blocks/prompt-input-01/components/prompt-input';
import { SleepWidget } from '@/registry/blocks/sleep-widget-01/components/sleep-widget';
import {
  ChatSidebarDemo,
  ModelPickerDemo,
  effortLevels,
  messages,
  suggestions,
} from './blocks.js';

export const scenarios = [
  { id: 'cards', label: 'Découvrir' },
  { id: 'form', label: 'Inscription' },
  { id: 'chat', label: 'Assistant (blocs chat)' },
  { id: 'welcome', label: 'Accueil assistant' },
  { id: 'widgets', label: 'Widgets' },
] as const;

function BookingCard() {
  const [booked, setBooked] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-2xs tracking-wide uppercase">
          Atelier · 45 min
        </CardDescription>
        <CardTitle>Faire moins, mais mieux.</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <p>
          Un atelier pour imaginer des services plus attentifs au quotidien.
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">6 places disponibles</Badge>
          <span>Gratuit</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <Button onClick={() => setBooked(!booked)}>
          {booked ? 'Réservation confirmée ✓' : 'Réserver une place'}
        </Button>
        <span role="status" className="text-xs text-muted-foreground">
          {booked ? 'Inscription de démonstration, aucune donnée envoyée.' : ''}
        </span>
      </CardFooter>
    </Card>
  );
}

function SignupForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="signup-name">Votre prénom</FieldLabel>
          <Input
            id="signup-name"
            placeholder="Camille"
            required
            onChange={() => setSent(false)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-mail">Adresse e-mail</FieldLabel>
          <Input
            id="signup-mail"
            type="email"
            placeholder="camille@example.com"
            required
            onChange={() => setSent(false)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-off">Champ désactivé</FieldLabel>
          <Input id="signup-off" placeholder="Non disponible" disabled />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="signup-cgu" name="cgu" required />
          <FieldLabel htmlFor="signup-cgu">
            J’accepte les conditions de démonstration
          </FieldLabel>
        </Field>
        <Button type="submit" className="w-fit">
          S’inscrire
        </Button>
        <p role="status" className="text-sm text-muted-foreground">
          {sent
            ? 'Merci ! Démonstration locale, aucune inscription réelle.'
            : ''}
        </p>
      </FieldGroup>
    </form>
  );
}

const tabContext: Record<string, string> = {
  Découvrir: 'Des idées à explorer près de chez vous.',
  Favoris: 'Vos ateliers favoris apparaîtront ici.',
  Profil: 'Votre espace personnel de démonstration.',
};

function Lisiere({ scenario }: { scenario: string }) {
  const [tab, setTab] = useState('Découvrir');
  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-5 py-6">
      <header className="flex items-center justify-between">
        <strong className="text-xl font-semibold tracking-tight">
          lisière<span className="text-primary">®</span>
        </strong>
        <Badge variant="outline">Bordeaux</Badge>
      </header>
      <nav aria-label="Navigation du scénario" className="grid gap-2">
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
          <TabsList>
            {Object.keys(tabContext).map((t) => (
              <TabsTrigger key={t} value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {tabContext[tab]}
        </p>
      </nav>
      <main className="grid gap-4">
        <span className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
          Le quotidien, autrement
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          De petites idées.
          <br />
          De vrais liens.
        </h1>
        <p className="text-muted-foreground">
          Des ateliers pour apprendre, partager et se rencontrer.
        </p>
        {scenario === 'form' ? (
          <Card>
            <CardHeader>
              <CardTitle>Rejoignez le mouvement.</CardTitle>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
          </Card>
        ) : (
          <div className="scenario-grid grid grid-cols-1 gap-4 min-[700px]:grid-cols-2">
            <BookingCard />
            <Card>
              <CardHeader>
                <CardDescription className="text-2xs tracking-wide uppercase">
                  À votre rythme
                </CardDescription>
                <CardTitle>Un quartier qui inspire.</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Explorez vos prochaines rencontres.
              </CardContent>
              <CardFooter>
                <Button variant="outline">Voir les ateliers</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
      <footer className="border-t pt-4 text-xs text-muted-foreground">
        lisière · scénario d’exemple fictif, composants SortUI
      </footer>
    </div>
  );
}

function ChatApp() {
  return (
    <SidebarProvider className="h-svh min-h-0">
      <ChatSidebarDemo />
      <SidebarInset className="flex min-h-0 flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <SidebarTrigger />
          <ModelPickerDemo />
        </header>
        <ChatThread messages={messages} className="min-h-0 flex-1" />
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <PromptInput placeholder="Demandez une modification de token" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Scenario({ scenario }: { scenario: string }) {
  if (scenario === 'chat') return <ChatApp />;
  if (scenario === 'welcome')
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <ChatWelcome
          greeting="Que voulez-vous améliorer ?"
          suggestions={suggestions}
        />
      </div>
    );
  if (scenario === 'widgets')
    return (
      <div className="flex flex-wrap items-start justify-center gap-6 p-6">
        <SleepWidget />
        <EffortSlider
          levels={effortLevels}
          minLabel="Plus rapide"
          maxLabel="Plus réfléchi"
        />
      </div>
    );
  return <Lisiere scenario={scenario} />;
}
