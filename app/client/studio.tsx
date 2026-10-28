import { createRoot } from 'react-dom/client';
import App from './App.js';
import './studio.css';

// Le choix de l'interrupteur (s'il existe) prime ; sinon l'atelier suit le système.
const dark = matchMedia('(prefers-color-scheme: dark)');
const stored = (() => {
  try {
    return localStorage.getItem('stride-theme');
  } catch {
    return null;
  }
})();
const applyScheme = () =>
  document.documentElement.classList.toggle(
    'dark',
    stored ? stored === 'dark' : dark.matches,
  );
applyScheme();
dark.addEventListener('change', applyScheme);

createRoot(document.getElementById('root')!).render(<App />);
