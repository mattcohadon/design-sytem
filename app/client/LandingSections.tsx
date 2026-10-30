import { ComponentCloud } from './ComponentCloud.js';
import { FigmaVisual, ShipVisual, SyncVisual } from './StepVisuals.js';
import type { ReactNode } from 'react';
import {
  AccessibilityIcon,
  ArrowRightIcon,
  FileCodeIcon,
  MousePointerClickIcon,
  PaletteIcon,
  RefreshCwIcon,
  SparklesIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const REPO = 'https://github.com/mattcohadon/design-sytem';

/** Pastille d'annonce au-dessus du titre : la dernière nouveauté, cliquable. */
export function HeroEyebrow() {
  return (
    <a
      href="#/composants/button"
      className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/70 py-1 pr-3 pl-1 text-xs backdrop-blur outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/30"
    >
      <Badge className="rounded-full">Nouveau</Badge>
      Chaque composant montre tous ses états
      <ArrowRightIcon className="size-3.5" aria-hidden />
    </a>
  );
}

/** Deux appels à l'action sous l'accroche. */
export function HeroActions() {
  const go = (id: string) => (e: React.MouseEvent) => {
    // Le routage utilise le hash : on défile sans le changer.
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="flex flex-wrap justify-center gap-3 pt-2">
      <Button
        size="lg"
        render={<a href="#liste-composants" onClick={go('liste-composants')} />}
      >
        Voir les composants
      </Button>
      <Button size="lg" variant="outline" render={<a href="#/demarrage" />}>
        Démarrer en cinq étapes
      </Button>
    </div>
  );
}

function SectionTitle({
  id,
  title,
  lead,
  center,
}: {
  id: string;
  title: string;
  lead: string;
  center?: boolean;
}) {
  return (
    <header
      className={`grid max-w-2xl gap-2 ${center ? 'mx-auto text-center' : ''}`}
    >
      <h2 id={id} className="text-3xl font-medium tracking-tight">
        {title}
      </h2>
      <p className="text-base text-muted-foreground">{lead}</p>
    </header>
  );
}

/** Teinte douce tirée du dégradé du hero (bleu vers rose), claire et sombre. */
const tint =
  'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--hero-blue)_32%,transparent),color-mix(in_srgb,var(--hero-mid)_75%,transparent))] text-[color-mix(in_srgb,var(--hero-blue)_75%,black)] dark:text-[var(--hero-blue)]';

function Argument({
  icon,
  title,
  children,
  href,
  cta,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href?: string;
  cta?: string;
}) {
  return (
    <li className="grid content-start gap-3 bg-background p-6 text-foreground md:p-8">
      <span
        className={`grid size-9 place-items-center rounded-lg [&>svg]:size-4 ${tint}`}
      >
        {icon}
      </span>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{children}</p>
      {href && cta && (
        <a
          href={href}
          className="inline-flex min-h-8 w-fit items-center gap-1 rounded-md text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {cta}
          <ArrowRightIcon className="size-3.5" aria-hidden />
        </a>
      )}
    </li>
  );
}

const steps = [
  {
    title: 'Dessinez dans Figma',
    text: 'Chaque composant a ses variantes, ses états et ses variables de couleur. Rien n’est dessiné en dur : un token change, le dessin suit.',
    visual: <FigmaVisual />,
  },
  {
    title: 'Synchronisez',
    text: 'Quand la bibliothèque change, une pull request résume ce qui bouge et signale les changements cassants. Chaque synchro est tracée dans le Changelog.',
    visual: <SyncVisual />,
  },
  {
    title: 'Livrez',
    text: 'Copiez le code depuis la page du composant. Ses états, ses props et ses règles d’usage sont déjà documentés : personne n’a à les deviner.',
    visual: <ShipVisual />,
  },
];

const faq = [
  [
    'Dois-je installer un paquet ?',
    'Non. Vous copiez les fichiers du composant dans votre projet et vous les modifiez à votre guise. Chaque page liste les quelques dépendances à installer.',
  ],
  [
    'Quelle pile technique ?',
    'React 19, TypeScript, Tailwind v4 et Base UI. Les composants suivent les conventions d’un projet shadcn : dossier components/ui et alias @/.',
  ],
  [
    'Et si je n’utilise pas Figma ?',
    'Rien ne l’impose. La documentation, les tokens et les composants fonctionnent seuls ; Figma est un plus pour garder le dessin et le code alignés.',
  ],
  [
    'Puis-je adapter les couleurs à ma marque ?',
    'Oui. Modifiez les tokens dans l’éditeur, comparez le clair et le sombre, puis validez. Vous pouvez aussi demander une palette à l’assistant et relire le diff avant de l’appliquer.',
  ],
] as const;

/** Arguments, parcours Figma → code, blocs et questions : tout ce qui précède la liste des composants. */
export function LandingIntro({
  components,
  tokens,
  preview,
}: {
  components: number;
  tokens: number;
  /** Aperçus réels des blocs mis en avant (iframe en vignette). */
  preview: ReactNode;
}) {
  return (
    <div className="grid gap-16 pt-4 pb-4">
      <ComponentCloud />

      <section aria-labelledby="atouts" className="grid gap-6">
        <SectionTitle
          id="atouts"
          title="Ce que votre équipe y gagne"
          lead="Un design system se juge à l’usage. Voici ce qui change, concrètement, entre le dessin, le code et la doc."
        />
        <ul className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-3">
          <Argument
            icon={<FileCodeIcon />}
            title="Une doc qui ne ment pas"
            href="#/composants/badge"
            cta="Voir une page"
          >
            Description, exemple copiable, variantes, props et dépendances sont
            lus dans le code source. Si le code change, la page change avec lui.
          </Argument>
          <Argument
            icon={<MousePointerClickIcon />}
            title="Tous les états, d’un coup d’œil"
            href="#/composants/button"
            cta="Voir Button"
          >
            Repos, survol, appui, focus clavier, désactivé, invalide : chaque
            état est forcé dans l’aperçu, tel que le code le rend. Plus aucune
            capture à refaire à la main.
          </Argument>
          <Argument
            icon={<PaletteIcon />}
            title="Changez une valeur, tout suit"
            href="#/tokens"
            cta="Ouvrir les tokens"
          >
            {tokens} tokens pilotent les couleurs et les rayons. Chaque
            validation entre dans un historique : vous annulez une révision
            précise sans toucher aux autres.
          </Argument>
          <Argument
            icon={<RefreshCwIcon />}
            title="Figma et code parlent la même langue"
            href="#/changelog"
            cta="Voir le Changelog"
          >
            Les composants existent dans Figma avec les mêmes variantes et les
            mêmes variables. Quand la bibliothèque change, une synchro propose
            la mise à jour en pull request.
          </Argument>
          <Argument
            icon={<AccessibilityIcon />}
            title="Accessible, en clair comme en sombre"
          >
            Bâti sur Base UI : clavier, focus visible et rôles ARIA dès le
            départ. Chaque page dit quoi vérifier, et chaque aperçu passe du
            clair au sombre d’un clic.
          </Argument>
          <Argument
            icon={<SparklesIcon />}
            title="Prêt pour les produits d’IA"
            href="#liste-blocs"
            cta="Voir les blocs"
          >
            Message, saisie du prompt, choix du modèle, curseur d’effort, trace
            de raisonnement, diff : les briques d’une conversation avec une IA
            sont déjà là.
          </Argument>
        </ul>
      </section>

      <section aria-labelledby="parcours" className="grid gap-6">
        <SectionTitle
          id="parcours"
          title="Du Figma au code, sans traduction"
          lead="Le dessin et le code partagent les mêmes variantes, les mêmes états et les mêmes variables. Trois étapes, aucune ressaisie."
        />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="grid content-start gap-3">
              {s.visual}
              <h3 className="flex items-center gap-2 text-base font-medium">
                <span
                  aria-hidden
                  className={`grid size-6 place-items-center rounded-full text-xs font-medium tabular-nums ${tint}`}
                >
                  {i + 1}
                </span>
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="blocs-vedette" className="grid gap-6">
        <SectionTitle
          id="blocs-vedette"
          title="Des blocs pour aller plus vite"
          lead="Des assemblages complets, prêts à copier : une conversation, une saisie, un choix de modèle. Ce sont les vrais composants, pas des maquettes."
        />
        {preview}
      </section>

      <section aria-labelledby="questions" className="grid gap-6">
        <SectionTitle
          id="questions"
          title="Questions fréquentes"
          center
          lead="Ce qu’on nous demande avant de copier le premier composant."
        />
        <Accordion className="mx-auto w-full max-w-3xl">
          {faq.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
          <AccordionItem value="code">
            <AccordionTrigger>Où est le code ?</AccordionTrigger>
            <AccordionContent>
              Sur{' '}
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                GitHub
              </a>
              , dans le dépôt du projet : composants, blocs, tokens et
              documentation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section
        aria-labelledby="debut"
        className="grid justify-items-center gap-4 rounded-2xl border px-6 py-14 text-center"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 62% 92% at 50% 100%, color-mix(in srgb, var(--hero-blue) var(--hero-strength), transparent) 16.5%, var(--hero-mid) 80%, var(--background) 100%)',
        }}
      >
        <h2
          id="debut"
          className="text-3xl font-medium tracking-tight text-[var(--hero-fg)]"
        >
          Parcourez les {components} composants
        </h2>
        <p className="max-w-xl text-base text-[var(--hero-fg-muted)]">
          Choisissez-en un : vous verrez son exemple, ses états, ses règles
          d’usage et son code, prêts à copier.
        </p>
        <HeroActions />
      </section>
    </div>
  );
}
