// Deux documents séparés : l’atelier (styles.css) et les aperçus SortUI en iframe
// (Tailwind). Chaque entrée charge uniquement sa propre feuille de style.
if (new URLSearchParams(location.search).get('preview') === '1')
  void import('./preview/main.js');
else void import('./studio.js');
