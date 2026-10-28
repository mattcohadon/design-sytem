import type { Force } from '../componentStates.js';
import { forceSelector } from './forcedSelectors.js';

/** Éléments sur lesquels on force l'état : tout ce qui se survole, se presse ou prend le focus. */
const INTERACTIVE =
  'button, a[href], input, textarea, select, summary, [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="slider"], [role="combobox"], [role="menuitem"], [role="option"], [role="separator"][tabindex], [data-slot$="-trigger"], [data-slot$="-handle"], [data-slot="slider-thumb"], [data-slot="input-otp-slot"], [data-slot="slider-control"], [data-slot="usage-bar-segment"], [tabindex]:not([tabindex="-1"])';

let installed = false;

/**
 * Pour chaque règle CSS qui dépend de :hover, :active, :focus ou :disabled, ajoute la même règle activée par
 * attribut (data-force-*). Les règles sous `@media (hover: hover)` sont recopiées sous `@media all` pour
 * que l'état se voie aussi sur un écran tactile.
 */
export function installForcedStates() {
  if (installed) return;
  installed = true;
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      forceRules(sheet, false);
    } catch {
      /* Feuille d'un autre domaine : illisible, on l'ignore. */
    }
  }
}

function forceRules(parent: CSSStyleSheet | CSSGroupingRule, inHover: boolean) {
  const additions: { at: number; text: string }[] = [];
  const list = parent.cssRules;
  for (let i = 0; i < list.length; i++) {
    const rule = list[i];
    if (rule instanceof CSSStyleRule) {
      const forced = forceSelector(rule.selectorText);
      if (forced)
        additions.push({ at: i + 1, text: `${forced}{${rule.style.cssText}}` });
    } else if (rule instanceof CSSMediaRule) {
      if (/hover:\s*hover/.test(rule.conditionText)) {
        const inner: string[] = [];
        for (const r of Array.from(rule.cssRules))
          if (r instanceof CSSStyleRule) {
            const forced = forceSelector(r.selectorText);
            if (forced) inner.push(`${forced}{${r.style.cssText}}`);
          }
        if (inner.length)
          additions.push({ at: i + 1, text: `@media all{${inner.join('')}}` });
      } else forceRules(rule, inHover);
    } else if (
      rule instanceof CSSLayerBlockRule ||
      rule instanceof CSSSupportsRule
    )
      forceRules(rule, inHover);
  }
  // On insère de la fin vers le début pour garder les positions valides.
  for (const a of additions.reverse()) {
    try {
      parent.insertRule(a.text, a.at);
    } catch {
      /* Règle que le navigateur refuse : on la saute. */
    }
  }
}

const attrs: Record<Force, Record<string, string>> = {
  hover: { 'data-force-hover': '' },
  active: { 'data-force-active': '' },
  focus: { 'data-force-focus': '', 'data-active': 'true' },
  disabled: {
    'data-force-disabled': '',
    'data-disabled': '',
    'aria-disabled': 'true',
    disabled: '',
  },
  invalid: { 'aria-invalid': 'true', 'data-invalid': '' },
  selected: {
    'data-selected': 'true',
    'aria-selected': 'true',
    'data-highlighted': '',
  },
};

/** Éléments qui reçoivent l'état : ceux du sélecteur donné (ou tous les interactifs), le premier seulement si `first`. */
export function targets(root: HTMLElement, selector?: string, first?: boolean) {
  const all = Array.from(root.querySelectorAll(selector ?? INTERACTIVE));
  return first ? all.slice(0, 1) : all;
}

/** Applique les états aux éléments ciblés de la zone ; renvoie ce qu'il faut pour arrêter l'observation. */
export function applyForced(
  root: HTMLElement,
  force: Force[],
  selector?: string,
  first?: boolean,
) {
  const apply = () => {
    for (const el of targets(root, selector, first))
      for (const f of force)
        for (const [k, v] of Object.entries(attrs[f])) el.setAttribute(k, v);
  };
  apply();
  // Certaines démos montent leur contenu après le premier rendu.
  const observer = new MutationObserver(apply);
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
