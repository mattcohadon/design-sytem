import { Fragment, type ReactNode } from 'react';

// shortcut: sous-ensemble de Markdown (titres, listes, code, gras, italique, liens https) pour les
// réponses de l'assistant ; pas de tableaux ni d'HTML. À remplacer par une bibliothèque si le besoin grandit.
const inline =
  /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\(https:\/\/[^\s)]+\)|https:\/\/[^\s)]+)/g;

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(inline).map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        if (part.startsWith('`'))
          return (
            <code key={i} className="rounded bg-fill-2 px-1 font-mono">
              {part.slice(1, -1)}
            </code>
          );
        if (part.startsWith('**'))
          return (
            <strong key={i}>
              <Inline text={part.slice(2, -2)} />
            </strong>
          );
        if (part.startsWith('*'))
          return (
            <em key={i}>
              <Inline text={part.slice(1, -1)} />
            </em>
          );
        const link = /^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/.exec(part);
        return (
          <a
            key={i}
            href={link ? link[2] : part}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            {link ? link[1] : part}
          </a>
        );
      })}
    </>
  );
}

/** Met en forme le Markdown d'une réponse sans jamais injecter de HTML : tout passe par des éléments React. */
export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (line.startsWith('```')) {
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++)
        code.push(lines[i]);
      i++;
      blocks.push(
        <pre
          key={blocks.length}
          className="overflow-auto rounded-lg bg-fill-2 p-2 font-mono"
        >
          {code.join('\n')}
        </pre>,
      );
    } else if (/^#{1,4}\s/.test(line)) {
      blocks.push(
        <p key={blocks.length} className="font-semibold">
          <Inline text={line.replace(/^#+\s+/, '')} />
        </p>,
      );
      i++;
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      for (; i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i]); i++)
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''));
      const List = ordered ? 'ol' : 'ul';
      blocks.push(
        <List
          key={blocks.length}
          className={`grid gap-1 pl-4 ${ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {items.map((item, n) => (
            <li key={n}>
              <Inline text={item} />
            </li>
          ))}
        </List>,
      );
    } else {
      const para: string[] = [];
      for (
        ;
        i < lines.length &&
        lines[i].trim() &&
        !/^(```|#{1,4}\s|\s*([-*]|\d+\.)\s)/.test(lines[i]);
        i++
      )
        para.push(lines[i]);
      blocks.push(
        <p key={blocks.length}>
          {para.map((l, n) => (
            <Fragment key={n}>
              {n > 0 && <br />}
              <Inline text={l} />
            </Fragment>
          ))}
        </p>,
      );
    }
  }
  return (
    <div className="grid min-w-0 gap-2 [overflow-wrap:anywhere]">{blocks}</div>
  );
}
