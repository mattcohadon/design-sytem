import { lstat, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  colorNames,
  fontFamilies,
  formatOklch,
  oklchToSrgb,
  parseColor,
  type TokenKey,
  type TokenValue,
  type Tokens,
} from '../../app/shared/model.js';

// Lecture seule des variables Figma : aucune écriture vers Figma n'existe ici.
// Les noms reprennent la planche créée dans Figma (collections et modes).
export const figmaCollections = {
  colors: 'DS-Studio · Couleurs',
  base: 'DS-Studio · Base',
};
export interface FigmaConfig {
  token: string;
  fileKey: string;
}
interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}
type FigmaValue =
  RGBA | number | string | boolean | { type: 'VARIABLE_ALIAS'; id: string };
interface FigmaVariable {
  name: string;
  variableCollectionId: string;
  resolvedType: string;
  valuesByMode: Record<string, FigmaValue>;
}
export interface FigmaVariablesResponse {
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<
      string,
      { name: string; modes: { modeId: string; name: string }[] }
    >;
  };
}

const fileKeyPattern = /^[0-9a-zA-Z]{22,128}$/;
/** Variables d'environnement, sinon `.ds-studio/figma.json` (privé, hors Git). */
export async function loadFigmaConfig(
  dataDir: string,
): Promise<FigmaConfig | null> {
  let config: Partial<FigmaConfig> = {
    token: process.env.FIGMA_TOKEN,
    fileKey: process.env.FIGMA_FILE_KEY,
  };
  if (!config.token || !config.fileKey) {
    const file = path.join(dataDir, 'figma.json');
    try {
      const stat = await lstat(file);
      if (stat.isSymbolicLink() || stat.size > 4096) return null;
      config = JSON.parse(await readFile(file, 'utf8'));
    } catch {
      return null;
    }
  }
  if (
    typeof config.token !== 'string' ||
    !config.token.trim() ||
    typeof config.fileKey !== 'string' ||
    !fileKeyPattern.test(config.fileKey)
  )
    return null;
  return { token: config.token.trim(), fileKey: config.fileKey };
}

/** Appel REST officiel ; le jeton n'apparaît jamais dans un message d'erreur. */
export async function fetchFigmaVariables(
  config: FigmaConfig,
  signal?: AbortSignal,
): Promise<FigmaVariablesResponse> {
  let response: Response;
  try {
    response = await fetch(
      `https://api.figma.com/v1/files/${config.fileKey}/variables/local`,
      {
        headers: { 'X-Figma-Token': config.token },
        signal: signal ?? AbortSignal.timeout(20_000),
      },
    );
  } catch {
    throw new Error('Figma injoignable. Vérifiez Internet puis réessayez.');
  }
  if (response.status === 403)
    throw new Error(
      'Figma refuse la lecture des variables : vérifiez le jeton (droit file_variables:read) et que le fichier est dans un espace Enterprise où votre siège est complet.',
    );
  if (response.status === 404)
    throw new Error(
      'Figma ne trouve pas ce fichier : vérifiez la clé du fichier.',
    );
  if (!response.ok)
    throw new Error(`Figma a répondu ${response.status}. Réessayez plus tard.`);
  return (await response.json()) as FigmaVariablesResponse;
}

const toRgba = (value: string): RGBA => {
  const color = parseColor(value)!;
  const hex = /^#([0-9a-fA-F]{6})$/.exec(value);
  const [r, g, b] = hex
    ? hex[1].match(/../g)!.map((x) => parseInt(x, 16) / 255)
    : oklchToSrgb(color);
  return { r, g, b, a: color.alpha };
};
// Figma stocke du sRGB : en deçà d'un demi-niveau 8 bits, c'est la même couleur.
const sameColor = (x: RGBA, y: RGBA) =>
  Math.abs(x.r - y.r) * 255 < 0.6 &&
  Math.abs(x.g - y.g) * 255 < 0.6 &&
  Math.abs(x.b - y.b) * 255 < 0.6 &&
  Math.abs(x.a - y.a) < 0.006;
const toTokenColor = ({ r, g, b, a }: RGBA) => {
  const hex = `#${[r, g, b]
    .map((x) =>
      Math.round(Math.min(1, Math.max(0, x)) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase()}`;
  return a >= 0.995 ? hex : formatOklch({ ...parseColor(hex)!, alpha: a });
};

/** Changements à proposer : seulement les tokens dont Figma diffère vraiment. */
export function figmaChanges(
  tokens: Tokens,
  data: FigmaVariablesResponse,
): { changes: { key: TokenKey; value: TokenValue }[]; ignored: string[] } {
  const { variables, variableCollections } = data.meta;
  const collection = (name: string) =>
    Object.entries(variableCollections).find(([, c]) => c.name === name);
  const colors = collection(figmaCollections.colors);
  const base = collection(figmaCollections.base);
  if (!colors || !base)
    throw new Error(
      `Collections « ${figmaCollections.colors} » et « ${figmaCollections.base} » introuvables dans le fichier Figma.`,
    );
  const resolve = (
    value: FigmaValue,
    modeName: string,
    depth = 0,
  ): FigmaValue => {
    if (typeof value !== 'object' || !('type' in value)) return value;
    const target = variables[value.id];
    if (!target || depth > 5)
      throw new Error('Alias Figma introuvable ou circulaire.');
    const modes = variableCollections[target.variableCollectionId]?.modes ?? [];
    const mode = modes.find((m) => m.name === modeName) ?? modes[0];
    return resolve(target.valuesByMode[mode.modeId], modeName, depth + 1);
  };
  const changes: { key: TokenKey; value: TokenValue }[] = [];
  const ignored: string[] = [];
  for (const variable of Object.values(variables)) {
    const short = variable.name.split('/').pop()!;
    if (variable.variableCollectionId === colors[0]) {
      if (!(colorNames as readonly string[]).includes(short)) {
        ignored.push(variable.name);
        continue;
      }
      for (const mode of colors[1].modes) {
        const prefix = mode.name.toLowerCase();
        if (prefix !== 'light' && prefix !== 'dark') continue;
        const key = `${prefix}.${short}` as TokenKey;
        const value = resolve(variable.valuesByMode[mode.modeId], mode.name);
        if (typeof value !== 'object' || !('r' in value)) continue;
        if (!sameColor(value, toRgba(String(tokens[key].$value))))
          changes.push({ key, value: toTokenColor(value) });
      }
    } else if (variable.variableCollectionId === base[0]) {
      const value = resolve(variable.valuesByMode[base[1].modes[0].modeId], '');
      if (variable.name === 'radius/base' && typeof value === 'number') {
        const radius = Math.round(value * 100) / 100;
        if (radius !== tokens['radius.base'].$value)
          changes.push({ key: 'radius.base', value: radius });
      } else if (variable.name === 'font/sans' && typeof value === 'string') {
        if (!(fontFamilies as readonly string[]).includes(value))
          throw new Error(
            `font/sans = « ${value} » : valeurs acceptées ${fontFamilies.join(', ')}.`,
          );
        if (value !== tokens['font.sans'].$value)
          changes.push({ key: 'font.sans', value });
      } else ignored.push(variable.name);
    }
  }
  return { changes, ignored };
}
