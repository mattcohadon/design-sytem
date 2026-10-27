import { useState } from 'react';
import {
  CalendarIcon,
  PaletteIcon,
  ScaleIcon,
  SparklesIcon,
} from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  ChatSidebar,
  type Conversation,
} from '@/registry/blocks/chat-sidebar-01/components/chat-sidebar';
import {
  ChatThread,
  type ChatMessage,
} from '@/registry/blocks/chat-thread-01/components/chat-thread';
import {
  ChatWelcome,
  type ChatSuggestion,
} from '@/registry/blocks/chat-welcome-01/components/chat-welcome';
import { EffortSlider } from '@/registry/blocks/effort-slider-01/components/effort-slider';
import { ModelPicker } from '@/registry/blocks/model-picker-01/components/model-picker';
import { PromptInput } from '@/registry/blocks/prompt-input-01/components/prompt-input';
import { SleepWidget } from '@/registry/blocks/sleep-widget-01/components/sleep-widget';
import type { Demo } from './demos/types.js';

// Données d’exemple fictives : aucune conversation ni IA réelle.
export const conversations: Conversation[] = [
  {
    id: 'c1',
    title: 'Palette plus chaleureuse',
    group: 'Aujourd’hui',
    pinned: true,
  },
  { id: 'c2', title: 'Contrastes du mode sombre', group: 'Aujourd’hui' },
  { id: 'c3', title: 'Rayon des cartes', group: 'Hier' },
  { id: 'c4', title: 'Audit du formulaire', group: '7 derniers jours' },
  { id: 'c5', title: 'Migration des tokens V1', group: '7 derniers jours' },
];
export const user = { name: 'Camille L.', plan: 'Étudiant·e' };
export const messages: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content: 'Le bouton principal manque-t-il de contraste en mode sombre ?',
    attachments: [
      { name: 'design-system.tokens.json', description: 'JSON · 14 Ko' },
    ],
  },
  {
    id: 'a1',
    role: 'assistant',
    reasoning: {
      seconds: 4,
      steps: [
        'Lecture de dark.primary et dark.primary-foreground.',
        'Calcul du ratio WCAG après composition sur dark.background.',
      ],
    },
    content:
      'Non : **4,9:1**, au-dessus du seuil AA de 4,5:1 pour le texte courant.\n\nEn revanche `dark.muted-foreground` sur `dark.card` mérite une vérification sur les petites tailles.',
    status: 'done',
  },
  { id: 'u2', role: 'user', content: 'Propose une valeur plus lumineuse.' },
  {
    id: 'a2',
    role: 'assistant',
    content:
      'Je propose `oklch(0.75 0 0)`. La proposition passera par le diff : rien n’est écrit sans votre validation.',
    status: 'done',
  },
];
export const suggestions: ChatSuggestion[] = [
  {
    label: 'Auditer les contrastes',
    prompt: 'Vérifie toutes les paires texte / fond en clair et en sombre.',
    icon: ScaleIcon,
  },
  {
    label: 'Palette chaleureuse',
    prompt:
      'Propose une couleur primaire plus chaleureuse pour les deux modes.',
    icon: PaletteIcon,
  },
  {
    label: 'Planifier un test',
    prompt: 'Prépare un test utilisateur de la réservation en trois tâches.',
    icon: CalendarIcon,
  },
  {
    label: 'Résumer le brief',
    prompt: 'Résume mon brief PFE en trois critères de réussite.',
    icon: SparklesIcon,
  },
];
export const effortLevels = [
  'Rapide',
  'Moyen',
  'Élevé',
  'Poussé',
  'Max',
  'Ultra',
];

export function ChatSidebarDemo({
  contained = false,
}: {
  contained?: boolean;
}) {
  const [active, setActive] = useState<string | null>('c2');
  const [items, setItems] = useState(conversations);
  return (
    <ChatSidebar
      collapsible={contained ? 'none' : undefined}
      conversations={items}
      activeId={active}
      user={user}
      onSelect={setActive}
      onTogglePin={(id) =>
        setItems((list) =>
          list.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
        )
      }
      onDelete={(id) => setItems((list) => list.filter((c) => c.id !== id))}
    />
  );
}
export function ModelPickerDemo() {
  const [model, setModel] = useState('thinking');
  return <ModelPicker value={model} onValueChange={setModel} />;
}

export const blocks: Demo[] = [
  {
    id: 'chat-sidebar-01',
    title: 'Chat Sidebar',
    render: () => (
      <SidebarProvider className="h-[28rem] min-h-0 w-72 overflow-hidden rounded-xl border">
        <ChatSidebarDemo contained />
      </SidebarProvider>
    ),
  },
  {
    id: 'chat-thread-01',
    title: 'Chat Thread',
    render: () => (
      <div className="h-[30rem] w-full overflow-hidden rounded-xl border">
        <ChatThread messages={messages} className="h-full" />
      </div>
    ),
  },
  {
    id: 'chat-welcome-01',
    title: 'Chat Welcome',
    render: () => (
      <ChatWelcome
        greeting="Que voulez-vous améliorer ?"
        suggestions={suggestions}
      />
    ),
  },
  {
    id: 'prompt-input-01',
    title: 'Prompt Input',
    render: () => (
      <PromptInput
        className="w-full max-w-xl"
        placeholder="Demandez une modification de token"
      />
    ),
  },
  {
    id: 'model-picker-01',
    title: 'Model Picker',
    render: () => <ModelPickerDemo />,
  },
  {
    id: 'effort-slider-01',
    title: 'Effort Slider',
    render: () => (
      <EffortSlider
        levels={effortLevels}
        minLabel="Plus rapide"
        maxLabel="Plus réfléchi"
      />
    ),
  },
  {
    id: 'sleep-widget-01',
    title: 'Sleep Widget',
    render: () => <SleepWidget />,
  },
];
