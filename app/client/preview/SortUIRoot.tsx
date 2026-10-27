import { useLayoutEffect, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { tokenCss, type Mode, type Tokens } from '../../shared/model.js';

/**
 * Pose les tokens sur <html> : les portails SortUI (menus, dialogues, toasts)
 * sont rendus dans <body> et doivent hériter des mêmes variables.
 */
export function SortUIRoot({
  tokens,
  mode,
  children,
}: {
  tokens: Tokens;
  mode: Mode;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    for (const [name, value] of Object.entries(tokenCss(tokens, mode)))
      root.style.setProperty(name, value);
    root.classList.toggle('dark', mode === 'dark');
  }, [tokens, mode]);
  return (
    <TooltipProvider>
      {children}
      <Toaster theme={mode} position="bottom-center" />
    </TooltipProvider>
  );
}
