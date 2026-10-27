import { z } from 'zod';

// Tokens v2 : la palette SortUI (shadcn/ui), un jeu clair et un jeu sombre.
// Ce sous-ensemble explicite utilise les noms $type/$value, pas toute la norme DTCG.
export const colorNames = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'chart-6',
  'chart-7',
  'chart-8',
  'chart-9',
  'chart-10',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
  'fill-1',
  'fill-2',
  'fill-3',
  'fill-4',
  'field',
  'raised',
  'control',
  'control-hover',
  'control-border',
  'field-border',
  'syntax-foreground',
  'syntax-comment',
  'syntax-keyword',
  'syntax-string',
  'syntax-constant',
  'syntax-function',
  'syntax-variable',
  'syntax-tag',
  'syntax-added',
  'syntax-removed',
  'syntax-added-word',
  'syntax-removed-word',
] as const;
export type ColorName = (typeof colorNames)[number];
export const modes = ['light', 'dark'] as const;
export type Mode = (typeof modes)[number];
export const fontFamilies = [
  'system-ui',
  'Arial',
  'Georgia',
  'Verdana',
] as const;

const num = String.raw`(?:\d+(?:\.\d+)?|\.\d+)`;
const oklchPattern = new RegExp(
  String.raw`^oklch\(\s*(${num})(%?)\s+(${num})\s+(${num})(?:deg)?\s*(?:\/\s*(${num})(%?)\s*)?\)$`,
);
const hexPattern = /^#([0-9a-fA-F]{6})$/;

export interface Oklch {
  l: number;
  c: number;
  h: number;
  alpha: number;
}
/** Lit `oklch(L C H [/ A])` ou `#RRGGBB`. Renvoie null hors des bornes acceptées. */
export function parseColor(value: string): Oklch | null {
  const hex = hexPattern.exec(value);
  if (hex) {
    const [r, g, b] = hex[1].match(/../g)!.map((x) => parseInt(x, 16) / 255);
    return { ...srgbToOklch(r, g, b), alpha: 1 };
  }
  const m = oklchPattern.exec(value.trim());
  if (!m) return null;
  const l = Number(m[1]) / (m[2] ? 100 : 1);
  const c = Number(m[3]);
  const h = Number(m[4]);
  const alpha = m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1);
  if (l > 1 || c > 0.5 || h > 360 || alpha > 1) return null;
  return { l, c, h, alpha };
}
const round = (x: number, digits: number) =>
  Number(x.toFixed(digits)).toString();
export function formatOklch({ l, c, h, alpha }: Oklch): string {
  const base = `${round(l, 4)} ${round(c, 4)} ${round(c < 0.0005 ? 0 : h, 3)}`;
  return alpha >= 1
    ? `oklch(${base})`
    : `oklch(${base} / ${round(alpha * 100, 1)}%)`;
}

const color = z
  .object({
    $type: z.literal('color'),
    $value: z
      .string()
      .max(60)
      .refine((v) => parseColor(v) !== null, {
        message:
          'Couleur attendue : oklch(L C H) ou oklch(L C H / A%), ou #RRGGBB',
      }),
  })
  .strict();
const dimension = z
  .object({
    $type: z.literal('dimension'),
    $value: z.number().finite().min(0).max(128),
  })
  .strict();
const font = z
  .object({
    $type: z.literal('fontFamily'),
    $value: z.enum(fontFamilies),
  })
  .strict();

const shape = {
  ...Object.fromEntries(
    modes.flatMap((mode) =>
      colorNames.map((name) => [`${mode}.${name}`, color]),
    ),
  ),
  'radius.base': dimension,
  'font.sans': font,
} as Record<`${Mode}.${ColorName}`, typeof color> & {
  'radius.base': typeof dimension;
  'font.sans': typeof font;
};
export const tokensSchema = z.object(shape).strict();
export type Tokens = z.infer<typeof tokensSchema>;
export type TokenKey = keyof Tokens;
export const tokenKeys = Object.keys(tokensSchema.shape) as TokenKey[];
export type TokenValue = string | number;
export const changeSchema = z
  .object({
    key: z.enum(tokenKeys as [TokenKey, ...TokenKey[]]),
    value: z.union([z.string().max(100), z.number().finite()]),
  })
  .strict();
export const proposeSchema = z
  .object({
    revision: z.number().int().nonnegative(),
    changes: z.array(changeSchema).min(1).max(tokenKeys.length),
  })
  .strict();
export interface Patch {
  key: TokenKey;
  before: TokenValue;
  after: TokenValue;
}
export const revisionSources = [
  'manual',
  'codex',
  'claude',
  'import',
  'undo',
  'migration',
] as const;
export interface Revision {
  id: string;
  revision: number;
  date: string;
  source: (typeof revisionSources)[number];
  patches: Patch[];
}
export interface State {
  version: 2;
  revision: number;
  tokens: Tokens;
  history: Revision[];
}
export interface Proposal {
  id: string;
  revision: number;
  source: Revision['source'];
  patches: Patch[];
}
export const patchSchema = z
  .object({
    key: z.enum(tokenKeys as [TokenKey, ...TokenKey[]]),
    before: z.union([z.string(), z.number()]),
    after: z.union([z.string(), z.number()]),
  })
  .strict();
export const stateSchema = z
  .object({
    version: z.literal(2),
    revision: z.number().int().nonnegative(),
    tokens: tokensSchema,
    history: z.array(
      z
        .object({
          id: z.string().uuid(),
          revision: z.number().int().positive(),
          date: z.string().datetime(),
          source: z.enum(revisionSources),
          patches: z.array(patchSchema).min(1),
        })
        .strict(),
    ),
  })
  .strict();
export const agentReplySchema = z
  .object({
    message: z.string().max(12000),
    changes: z.array(changeSchema).max(tokenKeys.length),
  })
  .strict();
export type AgentReply = z.infer<typeof agentReplySchema>;
export function applyChanges(
  tokens: Tokens,
  changes: { key: TokenKey; value: TokenValue }[],
): Tokens {
  const next = structuredClone(tokens);
  if (new Set(changes.map((c) => c.key)).size !== changes.length)
    throw new Error('Un token ne peut apparaître deux fois.');
  for (const change of changes) next[change.key].$value = change.value as never;
  return tokensSchema.parse(next);
}
export function diff(before: Tokens, after: Tokens): Patch[] {
  return tokenKeys
    .filter((key) => before[key].$value !== after[key].$value)
    .map((key) => ({
      key,
      before: before[key].$value,
      after: after[key].$value,
    }));
}
export function tokenMode(key: TokenKey): Mode | null {
  const prefix = key.split('.')[0];
  return (modes as readonly string[]).includes(prefix)
    ? (prefix as Mode)
    : null;
}
const fontStacks: Record<(typeof fontFamilies)[number], string> = {
  'system-ui':
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  Arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  Georgia: 'Georgia, "Times New Roman", serif',
  Verdana: 'Verdana, Geneva, sans-serif',
};
/** Variables CSS SortUI (`--primary`, `--radius`…) pour un mode donné. */
export function tokenCss(tokens: Tokens, mode: Mode): Record<string, string> {
  return {
    ...Object.fromEntries(
      colorNames.map((name) => [`--${name}`, tokens[`${mode}.${name}`].$value]),
    ),
    '--radius': `${tokens['radius.base'].$value}px`,
    '--font-sans': fontStacks[tokens['font.sans'].$value],
  };
}

// Conversions OKLab de Björn Ottosson, en sRGB, sans gestion de gamut avancée.
const toLinear = (x: number) =>
  x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
const toGamma = (x: number) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
function srgbToOklch(r: number, g: number, b: number) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}
/** sRGB encodé (0..1), ramené dans le gamut par écrêtage. */
export function oklchToSrgb({ l, c, h }: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((x) => clamp01(toGamma(x))) as [number, number, number];
}
export function toHex(value: string): string | null {
  const color = parseColor(value);
  if (!color) return null;
  return `#${oklchToSrgb(color)
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`.toUpperCase();
}
/** Remplace la teinte d’une couleur par un #RRGGBB choisi, en gardant son alpha. */
export function withHex(value: string, hex: string): string {
  const picked = parseColor(hex);
  if (!picked) return value;
  return formatOklch({ ...picked, alpha: parseColor(value)?.alpha ?? 1 });
}
/** Couleur opaque perçue : l’alpha est composé sur le fond donné, comme le navigateur. */
function flatten(value: string, backdrop: [number, number, number]) {
  const color = parseColor(value);
  if (!color) return backdrop;
  // Un #RRGGBB est déjà en sRGB : on évite l’aller-retour OKLCH et ses arrondis.
  const hex = hexPattern.exec(value);
  const rgb = hex
    ? hex[1].match(/../g)!.map((x) => parseInt(x, 16) / 255)
    : oklchToSrgb(color);
  return rgb.map(
    (x, i) => x * color.alpha + backdrop[i] * (1 - color.alpha),
  ) as [number, number, number];
}
const luminance = (rgb: [number, number, number]) => {
  const [r, g, b] = rgb.map(toLinear);
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
};
/** Ratio WCAG de deux couleurs du même mode, posées sur `background`. */
export function contrast(
  foreground: string,
  background: string,
  page = '#FFFFFF',
): number {
  const base = flatten(page, [1, 1, 1]);
  const bg = flatten(background, base);
  const x = luminance(flatten(foreground, bg)),
    y = luminance(bg);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Paires texte / fond dont le contraste est contrôlé dans l’éditeur. */
export const contrastPairs: [ColorName, ColorName][] = [
  ['foreground', 'background'],
  ['primary-foreground', 'primary'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['secondary-foreground', 'secondary'],
  ['muted-foreground', 'background'],
  ['accent-foreground', 'accent'],
  ['destructive-foreground', 'background'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-primary-foreground', 'sidebar-primary'],
  ['sidebar-accent-foreground', 'sidebar-accent'],
];
export function pairContrast(
  tokens: Tokens,
  mode: Mode,
  [fg, bg]: [ColorName, ColorName],
): number {
  return contrast(
    tokens[`${mode}.${fg}`].$value,
    tokens[`${mode}.${bg}`].$value,
    tokens[`${mode}.background`].$value,
  );
}
