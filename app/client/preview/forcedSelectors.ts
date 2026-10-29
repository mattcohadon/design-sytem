// Réécrit un sélecteur CSS pour qu'un état s'active par attribut au lieu du pointeur ou du clavier :
// `.x:hover` devient `.x[data-force-hover]`. Même spécificité, donc même cascade.
const rules: [RegExp, string][] = [
  [/:hover\b/g, '[data-force-hover]'],
  [/:active\b/g, '[data-force-active]'],
  [/:focus-visible\b|:focus-within\b|:focus\b/g, '[data-force-focus]'],
  [/:disabled\b/g, '[data-force-disabled]'],
];

/** Sélecteur réécrit, ou null s'il ne contient aucun état à forcer. */
export function forceSelector(selector: string): string | null {
  let out = selector;
  for (const [re, to] of rules) out = out.replace(re, to);
  return out === selector ? null : out;
}
