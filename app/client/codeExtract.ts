// Extraction de code lisible depuis les sources du dépôt : exemple d'une démo, imports utiles,
// variantes d'un composant. Fonctions pures, testées dans tests/codeExtract.test.ts.

/** Position de la fermeture qui équilibre l'ouvrant à `open`, en ignorant les chaînes entre guillemets. */
function matching(src: string, open: number): number {
  const pairs: Record<string, string> = { '(': ')', '{': '}', '[': ']' };
  const stack: string[] = [];
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === '`') {
      const end = src.indexOf(c, i + 1);
      if (end < 0) return -1;
      i = end;
    } else if (pairs[c]) stack.push(pairs[c]);
    else if (c === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) return i;
    }
  }
  return -1;
}

function dedent(text: string): string {
  const lines = text.replace(/^\n+|\s+$/g, '').split('\n');
  const indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length),
  );
  return lines.map((l) => l.slice(indent)).join('\n');
}

/** Imports de `source` dont au moins un nom apparaît dans `snippet` (modules relatifs exclus). */
export function usedImports(source: string, snippet: string): string {
  const words = new Set(snippet.match(/[A-Za-z_]\w*/g));
  const lines: string[] = [];
  const re =
    /import\s+(type\s+)?(?:([A-Za-z_]\w*)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*['"]([^'"]+)['"]/g;
  for (const m of source.matchAll(re)) {
    const [, type, def, named, from] = m;
    if (from.startsWith('.') || type) continue;
    const names = (named ?? '')
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n && !n.startsWith('type '))
      .filter((n) => words.has(n.split(/\s+as\s+/).pop()!));
    const keepDefault = def && words.has(def) ? def : '';
    if (!names.length && !keepDefault) continue;
    const parts = [keepDefault, names.length ? `{ ${names.join(', ')} }` : '']
      .filter(Boolean)
      .join(', ');
    lines.push(`import ${parts} from '${from}';`);
  }
  return lines.join('\n');
}

/**
 * Code d'usage d'une démo : le JSX de `render`, précédé des imports qu'il utilise.
 * Une démo qui délègue à un composant local (`<XDemo />`) livre aussi sa fonction.
 * shortcut: suppose un source formaté par prettier (fin de bloc par indentation) ; un source autrement formaté renvoie null.
 */
export function extractExample(source: string, id: string): string | null {
  const at = source.indexOf(`id: '${id}'`);
  if (at < 0) return null;
  const marker = source.indexOf('render: () =>', at);
  if (marker < 0) return null;
  // Les sources sont formatées par prettier : la fin du JSX est la ligne « ), » de même indentation
  // que `render:` (compter les parenthèses échouerait sur un texte comme « ⌘[ »).
  const indent = source.slice(source.lastIndexOf('\n', marker) + 1, marker);
  let i = marker + 'render: () =>'.length;
  while (/\s/.test(source[i])) i++;
  let body: string;
  if (source[i] === '(') {
    const end = source.indexOf(`\n${indent}),`, i);
    if (end < 0) return null;
    body = dedent(source.slice(i + 1, end));
  } else {
    const end = source.indexOf(',\n', i);
    body = source.slice(i, end < 0 ? undefined : end).trim();
  }
  const local = body.match(/^<(\w+)\s*\/>$/)?.[1];
  const fn =
    local &&
    new RegExp(`^function ${local}\\([^)]*\\)[^{]*\\{`, 'm').exec(source);
  if (fn) {
    const end = source.indexOf('\n}\n', fn.index);
    if (end > 0) body = `${dedent(source.slice(fn.index, end + 2))}\n\n${body}`;
  }
  const imports = usedImports(source, body);
  return imports ? `${imports}\n\n${body}` : body;
}

export interface VariantGroup {
  name: string;
  options: string[];
  default?: string;
}
export interface Spec {
  variants: VariantGroup[];
  parts: string[];
  /** Primitive Base UI utilisée, ex. « dialog ». */
  primitive?: string;
  /** Paquets npm à installer (hors react). */
  packages: string[];
  /** Autres composants SortUI requis. */
  requires: string[];
}

/** Clés d'un objet littéral au premier niveau : `key:` ou `"key":` suivi de `{` ou d'une valeur. */
function keysOf(block: string): string[] {
  const keys: string[] = [];
  let depth = 0;
  for (let i = 1; i < block.length - 1; i++) {
    const c = block[i];
    if (c === '"' || c === '`') {
      const end = block.indexOf(c, i + 1);
      if (depth === 0) {
        const after = block.slice(end + 1).match(/^\s*:/);
        const before = block.slice(0, i).match(/[{,]\s*$/);
        if (after && before) keys.push(block.slice(i + 1, end));
      }
      i = end;
    } else if ('({['.includes(c)) depth++;
    else if (')}]'.includes(c)) depth--;
    else if (
      depth === 0 &&
      /[A-Za-z_]/.test(c) &&
      /[{,]\s*$/.test(block.slice(0, i))
    ) {
      const m = block.slice(i).match(/^([A-Za-z_][\w-]*)\s*:/);
      if (m) keys.push(m[1]);
    }
  }
  return keys;
}

/** Variantes (cva), sous-composants exportés et dépendances d'un composant SortUI. */
export function parseSpec(source: string): Spec {
  const variants: VariantGroup[] = [];
  const v = source.indexOf('variants: {');
  if (v >= 0) {
    const open = source.indexOf('{', v);
    const end = matching(source, open);
    const block = source.slice(open, end + 1);
    const defaults = source.match(/defaultVariants:\s*\{([^}]*)\}/)?.[1] ?? '';
    for (const name of keysOf(block)) {
      const at = block.indexOf(`${name}: {`);
      if (at < 0) continue;
      const o = block.indexOf('{', at);
      const options = keysOf(block.slice(o, matching(block, o) + 1));
      const def = defaults.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1];
      variants.push({ name, options, default: def });
    }
  }
  const exported = source.match(/export\s*\{([^}]*)\}/)?.[1] ?? '';
  const parts = exported
    .split(',')
    .map((n) => n.trim())
    .filter((n) => n && !/Variants$/.test(n));
  const packages = new Set<string>();
  const requires: string[] = [];
  let primitive: string | undefined;
  for (const m of source.matchAll(/from\s*"([^"]+)"/g)) {
    const from = m[1];
    const base = from.match(/^@base-ui\/react\/(.+)$/)?.[1];
    if (base) {
      if (!/^(merge-props|use-render)$/.test(base)) primitive ??= base;
      packages.add('@base-ui/react');
    } else if (from.startsWith('@/components/ui/'))
      requires.push(from.slice('@/components/ui/'.length));
    else if (
      !from.startsWith('.') &&
      !from.startsWith('@/') &&
      from !== 'cn' &&
      from !== 'react'
    )
      packages.add(
        from.startsWith('@')
          ? from.split('/').slice(0, 2).join('/')
          : from.split('/')[0],
      );
  }
  return {
    variants,
    parts,
    primitive,
    packages: [...packages],
    requires: [...new Set(requires)],
  };
}
