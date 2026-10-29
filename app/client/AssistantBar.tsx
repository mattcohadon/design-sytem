import { useState } from 'react';
import { ArrowUpIcon, PenToolIcon, SquareIcon, XIcon } from 'lucide-react';
import {
  AIChatComposer,
  AIChatComposerLeading,
  AIChatComposerSubmit,
  AIChatComposerTextarea,
  AIChatComposerTrailing,
} from '@/components/ui/ai-chat-composer';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Message, MessageContent } from '@/components/ui/message';
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
  figma: boolean;
  onFigma: (on: boolean) => void;
  onSend: () => void;
  onStop: () => void;
}

/** Rend cliquables les liens https d'une réponse. */
function linkify(text: string) {
  return text.split(/(https:\/\/[^\s)]+)/).map((part, i) =>
    i % 2 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

/** Barre d'assistant flottante, centrée en bas : propose des tokens ; n'écrit dans Figma que si l'autorisation de la demande est cochée. */
export function AssistantBar(p: Props) {
  const [hidden, setHidden] = useState(false);
  const manual = p.agent === 'manual';
  const name = p.agent === 'claude' ? 'Claude' : 'Codex';
  const unavailable = !manual && p.info && !p.info.available;
  return (
    <div className="pointer-events-none sticky bottom-4 z-30 mt-auto flex justify-center px-4 pt-6">
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
                        {linkify(c.text)}
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
          <AIChatComposer className="shadow-[0_6px_28px_-6px_color-mix(in_oklch,var(--primary)_35%,transparent)]">
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
              {p.agent === 'claude' && (
                <Toggle
                  variant="outline"
                  size="sm"
                  aria-label="Autoriser Figma pour cette demande"
                  title="Autoriser Figma pour cette demande"
                  pressed={p.figma}
                  disabled={p.thinking}
                  onPressedChange={p.onFigma}
                >
                  <PenToolIcon />
                  Figma
                </Toggle>
              )}
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
