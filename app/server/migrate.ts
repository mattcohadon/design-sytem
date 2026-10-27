import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  applyChanges,
  diff,
  type State,
  type TokenKey,
  type TokenValue,
  type Tokens,
} from '../shared/model.js';

// Format V1 (palette Lisière, 18 tokens hexadécimaux), conservé uniquement pour la migration.
const v1Defaults = {
  'color.brand': '#3154C4',
  'color.brandHover': '#243F99',
  'color.onBrand': '#FFFFFF',
  'color.surface': '#FFFFFF',
  'color.canvas': '#F3F5FA',
  'color.text': '#19243D',
  'color.muted': '#536078',
  'color.border': '#BCC5D6',
  'color.danger': '#B4233E',
  'color.success': '#18734B',
  'color.focus': '#7856C8',
  'font.family': 'system-ui',
  'font.body': 16,
  'font.heading': 28,
  'space.sm': 8,
  'space.md': 16,
  'space.lg': 24,
  'radius.control': 10,
} as const;
type V1Key = keyof typeof v1Defaults;
const v1Value = z.object({
  $type: z.string(),
  $value: z.union([z.string(), z.number()]),
});
export const v1StateSchema = z.object({
  version: z.literal(1),
  revision: z.number().int().nonnegative(),
  tokens: z.object(
    Object.fromEntries(
      Object.keys(v1Defaults).map((k) => [k, v1Value]),
    ) as Record<V1Key, typeof v1Value>,
  ),
  history: z.array(z.unknown()),
});
export type V1State = z.infer<typeof v1StateSchema>;

/** Où va une valeur V1 personnalisée. Les tokens sans équivalent SortUI ne sont pas repris. */
const mapping: Partial<Record<V1Key, TokenKey[]>> = {
  'color.brand': ['light.primary', 'light.sidebar-primary'],
  'color.onBrand': [
    'light.primary-foreground',
    'light.sidebar-primary-foreground',
  ],
  'color.canvas': ['light.background'],
  'color.surface': ['light.card', 'light.popover'],
  'color.text': [
    'light.foreground',
    'light.card-foreground',
    'light.popover-foreground',
  ],
  'color.muted': ['light.muted-foreground'],
  'color.border': ['light.border'],
  'color.danger': ['light.destructive'],
  'color.focus': ['light.ring'],
  'radius.control': ['radius.base'],
  'font.family': ['font.sans'],
};
export const droppedV1Keys = (Object.keys(v1Defaults) as V1Key[]).filter(
  (k) => !mapping[k],
);

/**
 * Part du seed SortUI et ne reprend que les valeurs V1 modifiées par l’étudiant.
 * L’historique V1 ne peut pas être rejoué sur les clés V2 : l’original est archivé
 * par l’appelant et la reprise devient une révision « migration » annulable.
 */
export function migrateV1(v1: V1State, seed: Tokens): State {
  const changes: { key: TokenKey; value: TokenValue }[] = [];
  for (const [oldKey, targets] of Object.entries(mapping) as [
    V1Key,
    TokenKey[],
  ][]) {
    const value = v1.tokens[oldKey].$value;
    if (value === v1Defaults[oldKey]) continue;
    for (const key of targets) changes.push({ key, value });
  }
  const tokens = structuredClone(seed);
  const patches = changes.length
    ? diff(tokens, applyChanges(tokens, changes))
    : [];
  if (!patches.length) return { version: 2, revision: 0, tokens, history: [] };
  return {
    version: 2,
    revision: 1,
    tokens: applyChanges(
      tokens,
      patches.map((p) => ({ key: p.key, value: p.after })),
    ),
    history: [
      {
        id: randomUUID(),
        revision: 1,
        date: new Date().toISOString(),
        source: 'migration',
        patches,
      },
    ],
  };
}
