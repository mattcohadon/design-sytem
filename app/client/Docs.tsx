import type { ReactNode } from 'react';

function Page({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-8 p-4 py-10">
      <div className="grid gap-3 text-center">
        <h2
          id="ds-title"
          tabIndex={-1}
          className="text-3xl font-medium tracking-tight outline-none"
        >
          {title}
        </h2>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">{lead}</p>
      </div>
      <div className="grid gap-6 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

const H = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-medium tracking-tight">{children}</h3>
);
const List = ({ items }: { items: ReactNode[] }) => (
  <ul className="grid gap-2 pl-5 [&>li]:list-disc [&>li]:marker:text-muted-foreground">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);
const Code = ({ children }: { children: string }) => (
  <pre className="overflow-auto rounded-xl border bg-fill-1 p-3 font-mono text-xs">
    {children}
  </pre>
);

export function Welcome() {
  return (
    <Page
      title="Bienvenue"
      lead="DS-Studio est un atelier local pour explorer et faire évoluer un design system : une seule source de tokens, toutes les vues."
    >
      <section className="grid gap-3">
        <H>Ce que contient l’atelier</H>
        <List
          items={[
            <>
              <strong>Composants</strong> : les composants et blocs SortUI,
              chacun avec ses exemples et, s’il existe dans Figma, sa
              spécification (propriétés et variantes).
            </>,
            <>
              <strong>Tokens</strong> : 120 valeurs (couleurs claires et
              sombres, rayon, police) qui pilotent tous les composants à la
              fois.
            </>,
            <>
              <strong>Un assistant</strong> : demandez un changement en
              français, il propose des tokens. Rien n’est écrit sans votre
              validation.
            </>,
            <>
              <strong>Un historique</strong> : chaque validation est enregistrée
              et peut être annulée une à une.
            </>,
          ]}
        />
      </section>
      <section className="grid gap-3">
        <H>Comment ça s’articule avec Figma</H>
        <List
          items={[
            'Quand vous publiez la bibliothèque Figma, une pull request met à jour la spécification des composants.',
            'Les valeurs des variables Figma ne sont pas lues automatiquement : le bouton « Sync Figma » ne fonctionne qu’avec un plan Enterprise.',
            'Le code fait foi pour le comportement et l’accessibilité ; Figma fait foi pour l’apparence.',
          ]}
        />
      </section>
      <p className="text-muted-foreground">
        Pour commencer, ouvrez la page « Démarrage » dans la navigation, ou
        allez directement à la liste des composants.
      </p>
    </Page>
  );
}

export function GetStarted() {
  return (
    <Page
      title="Démarrage"
      lead="De l’installation à votre premier changement de token validé, en cinq étapes."
    >
      <section className="grid gap-3">
        <H>1. Lancer l’atelier</H>
        <p>Il faut Node 22.12 ou plus récent. Dans le dossier du projet :</p>
        <Code>{`npm ci
npm run build
npm start`}</Code>
        <p>
          L’atelier s’ouvre sur http://127.0.0.1:4310. Vos données restent dans
          le dossier .ds-studio, hors de Git.
        </p>
      </section>
      <section className="grid gap-3">
        <H>2. Parcourir les composants</H>
        <p>
          Choisissez un composant dans la navigation ou sur la page « Composants
          ». Le bouton « Tokens » d’une page composant ouvre l’éditeur à côté de
          l’aperçu.
        </p>
      </section>
      <section className="grid gap-3">
        <H>3. Proposer un changement</H>
        <List
          items={[
            'Dans Tokens, choisissez un token, saisissez une valeur (OKLCH ou #RRGGBB) et cliquez sur « Proposer ».',
            'Une fenêtre montre la différence et les contrastes. Validez pour enregistrer, ou abandonnez : rien n’est écrit.',
            'Tous les aperçus se mettent à jour avec la nouvelle valeur.',
          ]}
        />
      </section>
      <section className="grid gap-3">
        <H>4. Demander à l’assistant</H>
        <p>
          La barre en bas de l’écran accepte une demande comme « palette plus
          chaleureuse, clair et sombre ». Elle propose des tokens à valider. Le
          mode « Manuel » désactive l’assistant. Claude doit être connecté sur
          votre poste : lancez{' '}
          <code className="font-mono text-xs">claude auth login</code> une fois.
        </p>
      </section>
      <section className="grid gap-3">
        <H>5. Annuler ou exporter</H>
        <p>
          La page « Changelog » annule une révision précise sans toucher aux
          autres. « Exporter les tokens » et « Importer un JSON » servent à
          passer vos tokens à une autre application.
        </p>
      </section>
    </Page>
  );
}
