import { useState } from 'react';
import { ArrowUpIcon, SquareIcon, XIcon } from 'lucide-react';
import {
  AIChatComposer,
  AIChatComposerLeading,
  AIChatComposerSubmit,
  AIChatComposerTextarea,
  AIChatComposerTrailing,
} from '@/components/ui/ai-chat-composer';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Message, MessageContent } from '@/components/ui/message';
import { useSidebar } from '@/components/ui/sidebar';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';

export interface ChatLine {
  role: 'user' | 'assistant';
  text: string;
}
interface Props {
  agent: string;
  onAgent: (agent: string) => void;
  info?: { available: boolean; detail: string };
  message: string;
  onMessage: (message: string) => void;
  chat: ChatLine[];
  thinking: boolean;
  onSend: () => void;
  onStop: () => void;
}

/** Barre d'assistant flottante, centrée en bas : propose des tokens, jamais d'écriture directe. */
export function AssistantBar(p: Props) {
  const [hidden, setHidden] = useState(false);
  const { state, isMobile } = useSidebar();
  // Barre latérale ouverte : on décale la barre de la moitié de sa largeur pour la centrer
  // sur la fenêtre et non sur le contenu. Sous 1100 px elle recouvrirait la navigation.
  const onWindow = !isMobile && state === 'expanded';
  const manual = p.agent === 'manual';
  const name = p.agent === 'claude' ? 'Claude' : 'Codex';
  const unavailable = !manual && p.info && !p.info.available;
  return (
    <div
      className={`pointer-events-none sticky bottom-4 z-30 mt-auto flex justify-center px-4 pt-6 transition-transform duration-200 ${
        onWindow
          ? 'min-[1100px]:-translate-x-[calc(var(--sidebar-width)/2)] min-[1100px]:[&>div]:max-w-[min(42rem,calc(100vw_-_2*var(--sidebar-width)_-_2rem))]'
          : ''
      }`}
    >
      <div className="pointer-events-auto grid w-full max-w-2xl gap-2">
        {!hidden && p.chat.length > 0 && (
          <div className="grid max-h-[40svh] gap-2 overflow-auto rounded-2xl border bg-popover p-3 text-popover-foreground shadow-popover">
            <Button
              variant="ghost"
              size="icon-xs"
              className="justify-self-end"
              aria-label="Masquer la conversation"
              onClick={() => setHidden(true)}
            >
              <XIcon />
            </Button>
            <div
              className="grid gap-2"
              aria-label="Conversation"
              aria-live="polite"
            >
              {p.chat.map((c, i) => (
                <Message key={i} align={c.role === 'user' ? 'end' : 'start'}>
                  <MessageContent>
                    <span className="sr-only">
                      {c.role === 'user' ? 'Vous' : name} :
                    </span>
                    <Bubble
                      variant={c.role === 'user' ? 'secondary' : 'default'}
                    >
                      <BubbleContent className="text-xs whitespace-pre-wrap">
                        {c.text}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ))}
            </div>
          </div>
        )}
        {unavailable && (
          <p
            role="status"
            className="rounded-lg bg-popover px-3 py-2 text-xs text-muted-foreground shadow-popover"
          >
            {p.info!.detail}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setHidden(false);
            p.onSend();
          }}
        >
          <AIChatComposer className="shadow-popover">
            <AIChatComposerTextarea
              aria-label="Votre demande"
              placeholder={
                manual
                  ? 'Mode manuel : modifiez les tokens dans l’éditeur.'
                  : `Demandez à ${name} : « palette plus chaleureuse, clair et sombre »`
              }
              maxLength={8000}
              disabled={manual || p.thinking}
              value={p.message}
              onChange={(e) => p.onMessage(e.target.value)}
            />
            <AIChatComposerLeading>
              <NativeSelect
                size="sm"
                aria-label="Mode de travail"
                value={p.agent}
                onChange={(e) => p.onAgent(e.target.value)}
              >
                <NativeSelectOption value="claude">Claude</NativeSelectOption>
                <NativeSelectOption value="codex">Codex</NativeSelectOption>
                <NativeSelectOption value="manual">Manuel</NativeSelectOption>
              </NativeSelect>
            </AIChatComposerLeading>
            <AIChatComposerTrailing>
              {p.thinking ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Arrêter"
                  onClick={p.onStop}
                >
                  <SquareIcon />
                </Button>
              ) : (
                <AIChatComposerSubmit
                  aria-label={`Envoyer à ${name}`}
                  disabled={manual || !p.message.trim() || !p.info?.available}
                >
                  <ArrowUpIcon />
                </AIChatComposerSubmit>
              )}
            </AIChatComposerTrailing>
          </AIChatComposer>
        </form>
      </div>
    </div>
  );
}
