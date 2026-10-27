import { createRoot } from 'react-dom/client';
import '../sortui.css';
import { modes, type Mode } from '../../shared/model.js';
import { useDesignState } from '../useDesignState.js';
import { Catalogue, ComponentView } from './Catalogue.js';
import { Scenario } from './Scenario.js';
import { SortUIRoot } from './SortUIRoot.js';

// Document isolé (iframe) : seul le CSS SortUI s’applique, sans le chrome de l’atelier.
const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'scenario';
const scenario = params.get('scenario') ?? 'cards';
const component = params.get('id') ?? '';
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
      ) : view === 'component' ? (
        <ComponentView id={component} />
      ) : (
        <Scenario scenario={scenario} />
      )}
    </SortUIRoot>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
