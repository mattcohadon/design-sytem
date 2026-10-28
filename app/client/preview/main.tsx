import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../sortui.css';
import { modes, type Mode } from '../../shared/model.js';
import { useDesignState } from '../useDesignState.js';
import { Catalogue, ComponentView, StatesView } from './Catalogue.js';
import { Scenario } from './Scenario.js';
import { SortUIRoot } from './SortUIRoot.js';

// La landing d'exemple ne se charge que dans sa propre vue.
const SalesLanding = lazy(() =>
  import('./SalesLanding.js').then((m) => ({ default: m.SalesLanding })),
);

// Document isolé (iframe) : seul le CSS SortUI s’applique, sans le chrome de l’atelier.
const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'scenario';
const scenario = params.get('scenario') ?? 'cards';
const component = params.get('id') ?? '';
const thumb = params.get('thumb') === '1';
// Une vignette ne doit jamais faire défiler l'atelier : certaines démos (cmdk) appellent scrollIntoView au montage.
if (thumb) Element.prototype.scrollIntoView = () => {};
const requested = params.get('mode');
const mode: Mode = modes.includes(requested as Mode)
  ? (requested as Mode)
  : 'light';

function Preview() {
  const { state, error } = useDesignState();
  if (!state)
    return (
      <p role="alert" style={{ padding: 16 }}>
        {error || 'Chargement de l’aperçu…'}
      </p>
    );
  return (
    <SortUIRoot tokens={state.tokens} mode={mode}>
      {view === 'catalogue' ? (
        <Catalogue />
      ) : view === 'landing' ? (
        <Suspense fallback={null}>
          <SalesLanding />
        </Suspense>
      ) : view === 'states' ? (
        <StatesView id={component} />
      ) : view === 'component' ? (
        <ComponentView id={component} thumb={thumb} />
      ) : (
        <Scenario scenario={scenario} />
      )}
    </SortUIRoot>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
