import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Copie dans le presse-papiers ; repli sur une zone de texte quand l'API est indisponible (page non sécurisée). */
export async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    try {
      return document.execCommand('copy');
    } finally {
      area.remove();
    }
  }
}

/** Bloc de code en lecture seule avec bouton « Copier ». Pas de coloration syntaxique (pas de dépendance). */
export function CodeBlock({
  code,
  label,
  collapsed = false,
}: {
  code: string;
  label: string;
  /** Hauteur réduite, avec un bouton pour tout afficher. */
  collapsed?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(!collapsed);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="overflow-hidden rounded-xl border bg-fill-1">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <Button
          variant="ghost"
          size="xs"
          onClick={async () => {
            if (await copy(code)) {
              setCopied(true);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setCopied(false), 2000);
            }
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copié' : 'Copier'}
          <span className="sr-only"> le code : {label}</span>
        </Button>
      </div>
      {/* tabIndex : une zone qui défile doit être atteignable au clavier. */}
      <pre
        tabIndex={0}
        className={`overflow-auto p-3 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
          open ? 'max-h-[32rem]' : 'max-h-48'
        }`}
      >
        <code>{code}</code>
      </pre>
      {collapsed && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-full border-t py-1.5 text-xs text-muted-foreground outline-none hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {open ? 'Réduire' : 'Afficher tout le code'}
        </button>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Code copié' : ''}
      </span>
    </div>
  );
}
