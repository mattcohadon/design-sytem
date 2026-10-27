import { createRoot } from 'react-dom/client';
import App from './App.js';
import './studio.css';

// L'atelier suit le réglage clair / sombre du système.
const dark = matchMedia('(prefers-color-scheme: dark)');
const applyScheme = () =>
  document.documentElement.classList.toggle('dark', dark.matches);
applyScheme();
dark.addEventListener('change', applyScheme);

createRoot(document.getElementById('root')!).render(<App />);
