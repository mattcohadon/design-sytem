import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown } from '../app/client/MiniMarkdown.js';

const html = (text: string) => renderToStaticMarkup(<Markdown text={text} />);

test('markdown : gras, code, listes, titres et liens https', () => {
  const out = html(
    '## Titre\n**gras** et `code`\n\n- un\n- deux\n\n1. a\n2. b\n\nVoir [Figma](https://www.figma.com/design/x) ou https://example.com',
  );
  assert.match(out, /<strong>gras<\/strong>/);
  assert.match(out, /<code[^>]*>code<\/code>/);
  assert.match(out, /<ul[^>]*><li>un<\/li><li>deux<\/li><\/ul>/);
  assert.match(out, /<ol[^>]*><li>a<\/li><li>b<\/li><\/ol>/);
  assert.match(
    out,
    /<a href="https:\/\/www\.figma\.com\/design\/x"[^>]*>Figma<\/a>/,
  );
  assert.match(out, /<a href="https:\/\/example\.com"/);
});

test('markdown : aucun HTML ni lien non https n’est injecté', () => {
  const out = html(
    '<script>alert(1)</script> [x](javascript:alert(1)) <img src=x onerror=alert(1)>',
  );
  assert(!out.includes('<script'));
  assert(!out.includes('<img'));
  assert(!out.includes('href="javascript'));
});
