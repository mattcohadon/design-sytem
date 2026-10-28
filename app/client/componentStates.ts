// États montrés sur la page de chaque composant interactif. Chaque état est forcé dans l'aperçu
// (voir preview/forcedStates.ts) : hover, active, focus, disabled et invalid se voient en même temps.
export type Force =
  'hover' | 'active' | 'focus' | 'disabled' | 'invalid' | 'selected';

export interface StateSpec {
  /** Nom affiché au-dessus de l'aperçu. */
  label: string;
  force: Force[];
  /** Variante de l'exemple à montrer (par exemple « checked ») ; voir preview/stateDemos.tsx. */
  variant?: string;
}

/** Comment un composant montre ses états. */
export interface StateEntry {
  states: StateSpec[];
  /** Éléments qui reçoivent l'état ; par défaut, tous les éléments interactifs de l'exemple. */
  selector?: string;
  /** Un seul élément reçoit l'état (le premier) : listes d'onglets, de pages, de jours. */
  first?: boolean;
  /** Précision affichée sous le titre de la section. */
  note?: string;
}

const s = (label: string, ...force: Force[]): StateSpec => ({ label, force });
const checked = (label: string, ...force: Force[]): StateSpec => ({
  label,
  force,
  variant: 'checked',
});
const rest = s('Repos');
const hover = s('Survol', 'hover');
const active = s('Appui', 'active');
const focus = s('Focus clavier', 'focus');
const disabled = s('Désactivé', 'disabled');
const invalid = s('Invalide', 'invalid');
const selected = s('Sélectionné', 'selected');

/** Boutons, bascules, onglets… : tout ce qu'on survole, presse et désactive. */
const pointer = [rest, hover, active, focus, disabled];
/** Liens de navigation : pas d'appui ni de désactivation à montrer. */
const link = [rest, hover, focus];
/** Champs de saisie. */
const field = [rest, hover, focus, invalid, disabled];

const e = (
  states: StateSpec[],
  opts: Omit<StateEntry, 'states'> = {},
): StateEntry => ({ states, ...opts });

/** Cases à cocher, boutons radio et interrupteurs : l'état coché a ses propres survol, focus et désactivé. */
const toggle = [
  rest,
  hover,
  active,
  focus,
  disabled,
  checked('Coché'),
  checked('Coché · survol', 'hover'),
  checked('Coché · focus clavier', 'focus'),
  checked('Coché · désactivé', 'disabled'),
];

const trigger =
  'Ce sont les états du déclencheur : le contenu ouvert se voit dans l’aperçu principal.';

const table: Record<string, StateEntry> = {
  // Actions
  button: e(pointer),
  'button-group': e(pointer, { first: true }),
  toggle: e([
    ...pointer,
    checked('Activé'),
    checked('Activé · survol', 'hover'),
  ]),
  'toggle-group': e(pointer, { first: true }),
  // Formulaires
  input: e(field),
  'input-group': e(field),
  'input-otp': e(field),
  textarea: e(field),
  field: e(field),
  checkbox: e([...toggle, s('Invalide', 'invalid')]),
  'radio-group': e(toggle),
  switch: e(toggle),
  slider: e(pointer),
  select: e(field),
  'native-select': e(field),
  combobox: e(field),
  calendar: e(pointer, { selector: '[role="gridcell"] button', first: true }),
  // Navigation
  breadcrumb: e(link, { first: true }),
  pagination: e(pointer, { first: true }),
  // Le premier onglet est le sélectionné : le survol se voit sur un onglet inactif.
  tabs: e(pointer, {
    selector: '[role="tab"]:not([aria-selected="true"])',
    first: true,
  }),
  'navigation-menu': e(pointer, { first: true }),
  menubar: e(pointer, { first: true }),
  sidebar: e(pointer, { first: true }),
  accordion: e(pointer, { first: true }),
  collapsible: e(pointer),
  carousel: e(pointer),
  resizable: e([rest, hover, active, focus]),
  // Surcouches : les états du déclencheur ; le contenu ouvert se voit dans l'aperçu principal.
  dialog: e(pointer, { note: trigger }),
  'alert-dialog': e(pointer, { note: trigger }),
  sheet: e(pointer, { note: trigger }),
  drawer: e(pointer, { note: trigger }),
  popover: e(pointer, { note: trigger }),
  'hover-card': e(link, { note: trigger }),
  tooltip: e(link, { note: trigger }),
  'dropdown-menu': e(pointer, { note: trigger }),
  // cmdk sélectionne le premier choix d'office : l'état se voit sur un autre.
  command: e([rest, selected], {
    selector: '[role="option"]:not([data-selected="true"])',
    first: true,
  }),
  // Affichage
  item: e(link, { first: true }),
  table: e([rest, hover], { selector: 'tbody tr', first: true }),
  'usage-bar': e([rest, hover, focus], { first: true }),
  sonner: e(pointer, { note: trigger }),
  // IA
  'ai-chat-composer': e(field),
  attachment: e(pointer),
  trace: e(pointer),
  'chat-sidebar-01': e(pointer, { first: true }),
  'prompt-input-01': e(field),
  'model-picker-01': e(pointer),
  'effort-slider-01': e(pointer),
};

/** États d'un composant interactif, ou undefined s'il n'en a pas à montrer. */
export const entryOf = (id: string): StateEntry | undefined => table[id];
export const statesOf = (id: string): StateSpec[] | undefined =>
  table[id]?.states;
export const noteOf = (id: string): string | undefined => table[id]?.note;
export const statefulIds = Object.keys(table);
