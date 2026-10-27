import { useEffect, useState } from 'react';
import { ArrowUpIcon, SparklesIcon, SquareIcon, XIcon } from 'lucide-react';
import {
  AIChatComposer,
  AIChatComposerLeading,
  AIChatComposerSubmit,
  AIChatComposerTextarea,
  AIChatComposerTrailing,
} from '@/components/ui/ai-chat-composer';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Message, MessageContent } from '@/components/ui/message';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Spinner } from '@/components/ui/spinner';

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

const suggestions = [
  'Rends la palette plus chaleureuse, en clair et en sombre.',
  'Vérifie les contrastes AA et corrige ce qui échoue.',
  'Arrondis davantage les composants.',
];
const input = 'assistant-input';
const mod =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
    ? '⌘'
    : 'Ctrl';

/** Barre d'assistant flottante, centrée en bas : propose des tokens, jamais d'écriture directe. */
export function AssistantBar(p: Props) {
  const [hidden, setHidden] = useState(false);
  const manual = p.agent === 'manual';
  const name = p.agent === 'claude' ? 'Claude' : 'Codex';
  const unavailable = !manual && p.info && !p.info.available;
  const focus = () =>
    setTimeout(() => document.getElementById(input)?.focus(), 50);
  // Cmd/Ctrl+K : aller droit à la barre, depuis n'importe quelle page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      if (manual) p.onAgent('claude');
      focus();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });
  return (
    <div className="pointer-events-none sticky bottom-0 z-30 mt-auto flex justify-center bg-gradient-to-t from-background from-70% to-transparent px-4 pt-10 pb-4">
      <div className="pointer-events-auto grid w-full max-w-3xl gap-2">
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
                      <BubbleContent className="text-sm whitespace-pre-wrap">
                        {c.text}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ))}
            </div>
          </div>
        )}
        {!manual && p.chat.length === 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 max-sm:hidden">
            {suggestions.map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="xs"
                className="rounded-full bg-popover shadow-xs"
                disabled={p.thinking}
                onClick={() => {
                  p.onMessage(s);
                  focus();
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 px-1 text-xs">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {p.thinking ? (
              <Spinner className="size-3" />
            ) : (
              <SparklesIcon className="size-3" />
            )}
          </span>
          <strong className="font-medium">
            {manual
              ? 'Assistant désactivé'
              : p.thinking
                ? `${name} réfléchit…`
                : `Demandez à ${name}`}
          </strong>
          <span className="text-muted-foreground max-sm:hidden">
            {unavailable
              ? p.info!.detail
              : 'Il propose des tokens, vous validez chaque diff.'}
          </span>
          <Kbd className="ml-auto max-sm:hidden">{mod} K</Kbd>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setHidden(false);
            p.onSend();
          }}
        >
          <AIChatComposer className="bg-card shadow-xl ring-2 ring-primary/40 focus-within:ring-primary">
            <AIChatComposerTextarea
              id={input}
              aria-label="Votre demande"
              placeholder={
                manual
                  ? 'Mode manuel : modifiez les tokens dans l’éditeur, ou choisissez Claude.'
                  : `Décrivez le changement voulu, ${name} prépare le diff…`
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
