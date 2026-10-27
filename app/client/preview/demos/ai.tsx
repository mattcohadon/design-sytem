import { useState } from 'react';
import {
  ArrowUpIcon,
  FileTextIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import {
  AIChatComposer,
  AIChatComposerLeading,
  AIChatComposerSubmit,
  AIChatComposerTextarea,
  AIChatComposerTrailing,
} from '@/components/ui/ai-chat-composer';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import {
  Diff,
  DiffContent,
  DiffHeader,
  DiffStats,
  DiffTitle,
} from '@/components/ui/diff';
import { FileIcon } from '@/components/ui/file-icon';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '@/components/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/components/ui/trace';
import type { Family } from './types.js';

const before = `:root {
  --primary: oklch(0.585 0.233 277.117);
  --radius: 0.625rem;
}
`;
const after = `:root {
  --primary: oklch(0.55 0.2 30);
  --radius: 0.75rem;
}
`;

function ComposerDemo() {
  const [sent, setSent] = useState('');
  return (
    <form
      className="grid w-full max-w-lg gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setSent(String(data.get('prompt') ?? ''));
        e.currentTarget.reset();
      }}
    >
      <AIChatComposer>
        <AIChatComposerTextarea
          name="prompt"
          aria-label="Votre demande"
          placeholder="Propose une couleur de marque plus chaleureuse… (/ pour les commandes)"
          tokens={['@tokens', '@brief']}
          commands={[
            { value: 'tokens', label: 'Tokens', group: 'Contexte' },
            { value: 'brief', label: 'Brief PFE', group: 'Contexte' },
          ]}
        />
        <AIChatComposerLeading>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Joindre"
          >
            <PlusIcon />
          </Button>
        </AIChatComposerLeading>
        <AIChatComposerTrailing>
          <AIChatComposerSubmit aria-label="Envoyer">
            <ArrowUpIcon />
          </AIChatComposerSubmit>
        </AIChatComposerTrailing>
      </AIChatComposer>
      <p className="text-xs text-muted-foreground" role="status">
        {sent
          ? `Démonstration : « ${sent} » non envoyé.`
          : 'Aucune IA appelée.'}
      </p>
    </form>
  );
}

const conversation = [
  {
    id: 'm1',
    role: 'user',
    text: 'Le bouton principal manque de contraste en sombre.',
  },
  {
    id: 'm2',
    role: 'assistant',
    text: 'dark.primary-foreground sur dark.primary donne 4,9:1.',
  },
  { id: 'm3', role: 'user', text: 'Et le texte atténué ?' },
  {
    id: 'm4',
    role: 'assistant',
    text: 'dark.muted-foreground sur dark.background : 7,1:1.',
  },
  { id: 'm5', role: 'user', text: 'Parfait, propose un rayon plus doux.' },
  {
    id: 'm6',
    role: 'assistant',
    text: 'radius.base : 10 → 12. À valider dans le diff.',
  },
] as const;

export const ai: Family = {
  id: 'ai',
  title: 'Interfaces conversationnelles',
  demos: [
    {
      id: 'ai-chat-composer',
      title: 'AI Chat Composer',
      render: () => <ComposerDemo />,
    },
    {
      id: 'attachment',
      title: 'Attachment',
      render: () => (
        <AttachmentGroup className="max-w-lg">
          <Attachment className="w-60">
            <AttachmentMedia>
              <FileIcon type="pdf" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>brief-pfe.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 240 Ko</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Retirer">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-60" state="uploading">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>tokens.json</AttachmentTitle>
              <AttachmentDescription>Envoi…</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment className="w-60" state="error">
            <AttachmentMedia>
              <FileIcon type="archive" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>export.zip</AttachmentTitle>
              <AttachmentDescription>
                Fichier trop volumineux
              </AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
      ),
    },
    {
      id: 'bubble',
      title: 'Bubble',
      render: () => (
        <BubbleGroup className="w-full max-w-md">
          <Bubble>
            <BubbleContent>Bonjour ! Qu’aimeriez-vous changer ?</BubbleContent>
          </Bubble>
          <Bubble align="end" variant="tinted">
            <BubbleContent>Une palette plus chaleureuse.</BubbleContent>
            <BubbleReactions>👍</BubbleReactions>
          </Bubble>
          <Bubble variant="outline">
            <BubbleContent>Je propose trois nuances.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      ),
    },
    {
      id: 'message',
      title: 'Message',
      render: () => (
        <div className="grid w-full max-w-md gap-4">
          <Message>
            <MessageAvatar>
              <span className="text-xs font-medium">DS</span>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>Assistant · 10:42</MessageHeader>
              <Bubble>
                <BubbleContent>Le diff est prêt à être validé.</BubbleContent>
              </Bubble>
              <MessageFooter>Proposition seulement</MessageFooter>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>Merci, je regarde.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </div>
      ),
    },
    {
      id: 'message-scroller',
      title: 'Message Scroller',
      render: () => (
        <MessageScrollerProvider>
          <MessageScroller className="h-56 w-full max-w-md rounded-xl border">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-3 p-4">
                {conversation.map((m) => (
                  <MessageScrollerItem
                    key={m.id}
                    messageId={m.id}
                    scrollAnchor={m.role === 'user'}
                  >
                    <Message align={m.role === 'user' ? 'end' : 'start'}>
                      <MessageContent>
                        <Bubble
                          variant={m.role === 'user' ? 'secondary' : 'default'}
                        >
                          <BubbleContent>{m.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      ),
    },
    {
      id: 'trace',
      title: 'AI Trace',
      render: () => (
        <Trace className="max-w-md text-sm">
          <TraceLine>
            <TraceIcon>
              <SearchIcon />
            </TraceIcon>
            <TraceTitle>Lecture des tokens</TraceTitle>
            <TraceDescription>120</TraceDescription>
          </TraceLine>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceTitle>Calcul des contrastes</TraceTitle>
                <TraceDescription>11 paires</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              Toutes les paires texte / fond dépassent 4,5:1 sauf
              muted-foreground en clair.
            </TraceCollapsibleContent>
          </TraceCollapsible>
          <TraceLine status="running">
            <TraceTitle>Préparation du diff</TraceTitle>
          </TraceLine>
        </Trace>
      ),
    },
    {
      id: 'diff',
      title: 'Diff',
      render: () => (
        <Diff
          oldValue={before}
          newValue={after}
          fileName="theme.css"
          className="w-full max-w-lg rounded-xl border"
        >
          <DiffHeader>
            <FileIcon type="file" className="size-4" />
            <DiffTitle>theme.css</DiffTitle>
            <DiffStats />
          </DiffHeader>
          <DiffContent />
        </Diff>
      ),
    },
  ],
};
