import { useEffect } from 'react';
import {
  ArrowRightIcon,
  BellIcon,
  CheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';

// Contenu entièrement fictif : « Orbite » et ses clients n'existent pas.
const features = [
  {
    icon: ZapIcon,
    title: 'Des réponses en quelques secondes',
    text: 'Posez une question en français, obtenez un tableau de bord prêt à partager. Sans requête à écrire.',
  },
  {
    icon: UsersIcon,
    title: 'Toute l’équipe sur la même page',
    text: 'Produit, support et direction lisent les mêmes chiffres, mis à jour en continu.',
  },
  {
    icon: BellIcon,
    title: 'Alertes qui comptent',
    text: 'Orbite vous prévient quand un parcours se dégrade, avant que vos clients ne vous le disent.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Données hébergées en Europe',
    text: 'Chiffrement de bout en bout, export à tout moment, aucune revente de données.',
  },
];

const plans = [
  {
    name: 'Découverte',
    price: '0 €',
    note: 'Pour essayer, sans limite de durée',
    items: ['1 projet', '3 tableaux de bord', 'Historique de 30 jours'],
    cta: 'Commencer',
  },
  {
    name: 'Équipe',
    price: '29 €',
    note: 'par mois et par membre',
    items: [
      'Projets illimités',
      'Alertes en temps réel',
      'Historique de 24 mois',
      'Support par e-mail',
    ],
    cta: 'Essayer 14 jours',
    featured: true,
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    note: 'Pour les grandes organisations',
    items: ['Authentification unique', 'Hébergement dédié', 'Accompagnement'],
    cta: 'Nous contacter',
  },
];

const faq = [
  [
    'Faut-il une carte bancaire pour essayer ?',
    'Non. L’essai de 14 jours et l’offre Découverte ne demandent aucun moyen de paiement.',
  ],
  [
    'Puis-je exporter mes données ?',
    'Oui, à tout moment, en un clic, dans un format ouvert. Elles vous appartiennent.',
  ],
  [
    'Comment se passe la mise en place ?',
    'Comptez moins d’une heure : vous installez un script, puis Orbite construit vos premiers tableaux de bord.',
  ],
  [
    'Peut-on changer d’offre plus tard ?',
    'À tout moment. La facturation est ajustée au prorata, sans frais.',
  ],
];

const clients = [
  'Nordia',
  'Maison Delta',
  'Kelvin & Co',
  'Vertex Cafés',
  'Atelier Brume',
];

export function SalesLanding() {
  // Ouverte en plein écran, la page porte son propre titre et non celui de l'atelier.
  useEffect(() => {
    document.title = 'Orbite · Comprenez vos clients';
  }, []);
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#top"
        className="sr-only z-50 rounded-lg bg-background px-3 py-2 text-sm font-medium shadow-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="-mx-1 flex items-center gap-2 px-1 py-2 text-sm font-semibold tracking-tight rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <SparklesIcon className="size-4" />
          </span>
          Orbite
        </a>
        <nav
          aria-label="Principal"
          className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
        >
          <a
            href="#fonctionnalites"
            className="rounded-md px-1 py-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            Fonctionnalités
          </a>
          <a
            href="#tarifs"
            className="rounded-md px-1 py-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            Tarifs
          </a>
          <a
            href="#faq"
            className="rounded-md px-1 py-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            Questions
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Se connecter</Button>
          <Button>Essai gratuit</Button>
        </div>
      </header>
      <nav
        aria-label="Sections"
        className="flex justify-center gap-6 pb-2 text-sm text-muted-foreground md:hidden"
      >
        {[
          ['#fonctionnalites', 'Fonctionnalités'],
          ['#tarifs', 'Tarifs'],
          ['#faq', 'Questions'],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-md px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {label}
          </a>
        ))}
      </nav>

      <main id="top" tabIndex={-1} className="outline-none">
        <section className="relative isolate overflow-hidden">
          <svg
            aria-hidden
            viewBox="0 0 1440 520"
            preserveAspectRatio="xMidYMin slice"
            fill="none"
            stroke="currentColor"
            className="absolute inset-0 -z-10 size-full text-border [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
          >
            <circle cx="720" cy="760" r="480" />
            <circle cx="720" cy="760" r="640" />
            <circle cx="720" cy="760" r="800" />
          </svg>
          <div className="mx-auto grid max-w-3xl justify-items-center gap-6 px-6 pt-16 pb-12 text-center">
            <Badge variant="secondary">
              Nouveau · Tableaux de bord partagés
            </Badge>
            <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">
              Comprenez vos clients avant qu’ils ne partent
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Orbite transforme l’usage de votre produit en décisions claires.
              Une seule vue pour suivre la rétention, repérer les blocages et
              agir à temps.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg">
                Démarrer gratuitement <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" render={<a href="#apercu" />}>
                Voir la démo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              14 jours gratuits · sans carte bancaire
            </p>
          </div>
        </section>

        <section
          id="apercu"
          aria-label="Aperçu du produit"
          className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Rétention à 30 jours</CardTitle>
              <CardDescription>Par parcours d’inscription</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Progress value={82}>
                <ProgressLabel>Invitation d’équipe</ProgressLabel>
                <ProgressValue />
              </Progress>
              <Progress value={64}>
                <ProgressLabel>Import de données</ProgressLabel>
                <ProgressValue />
              </Progress>
              <Progress value={47}>
                <ProgressLabel>Premier rapport</ProgressLabel>
                <ProgressValue />
              </Progress>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
              <CardDescription>7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="flex items-baseline gap-2 text-4xl font-medium tracking-tight tabular-nums">
                12 480{' '}
                <Badge variant="secondary">
                  <TrendingUpIcon data-icon="inline-start" />
                  +8 %
                </Badge>
              </p>
              <div className="flex h-24 items-end gap-2" aria-hidden>
                {[40, 55, 48, 70, 62, 86, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-md bg-primary/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alertes</CardTitle>
              <CardDescription>Ce qui demande votre attention</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Alert variant="destructive">
                <BellIcon />
                <AlertTitle>Paiement : -14 % de conversion</AlertTitle>
                <AlertDescription>
                  Depuis la dernière mise en ligne, sur mobile.
                </AlertDescription>
              </Alert>
              <Alert>
                <CheckIcon />
                <AlertTitle>Inscription rétablie</AlertTitle>
                <AlertDescription>
                  Retour à la normale depuis 9 h 40.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        <section aria-label="Clients" className="border-y bg-muted/40 py-8">
          <p className="mb-4 text-center text-xs tracking-wide text-muted-foreground uppercase">
            Ils pilotent leur produit avec Orbite (clients fictifs)
          </p>
          <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-base font-medium text-muted-foreground">
            {clients.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section
          id="fonctionnalites"
          className="mx-auto grid max-w-6xl gap-10 px-6 py-20"
        >
          <div className="grid max-w-2xl gap-3">
            <h2 className="text-3xl font-medium tracking-tight">
              Tout ce qu’il faut, rien de superflu
            </h2>
            <p className="text-muted-foreground">
              Quatre idées simples, pensées pour les équipes qui livrent vite.
            </p>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="grid content-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-fill-2">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-label="Témoignage"
          className="mx-auto max-w-3xl px-6 pb-20 text-center"
        >
          <blockquote className="grid gap-4">
            <p className="text-2xl font-medium tracking-tight text-balance">
              « En deux semaines, nous avons repéré trois blocages que nous
              cherchions depuis un an. »
            </p>
            <footer className="text-sm text-muted-foreground">
              Responsable produit, Nordia · témoignage fictif
            </footer>
          </blockquote>
        </section>

        <section
          id="tarifs"
          className="mx-auto grid max-w-6xl gap-10 px-6 pb-20"
        >
          <div className="grid justify-items-center gap-3 text-center">
            <h2 className="text-3xl font-medium tracking-tight">
              Des tarifs lisibles
            </h2>
            <p className="text-muted-foreground">
              Changez d’offre quand vous voulez.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <li key={plan.name}>
                <Card
                  className={plan.featured ? 'ring-2 ring-primary' : undefined}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {plan.featured && <Badge>Le plus choisi</Badge>}
                    </CardTitle>
                    <CardDescription>{plan.note}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <p className="text-4xl font-medium tracking-tight">
                      {plan.price}
                    </p>
                    <ul className="grid gap-2 text-sm">
                      {plan.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckIcon className="size-4 text-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.featured ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mx-auto grid max-w-3xl gap-8 px-6 pb-20">
          <h2 className="text-center text-3xl font-medium tracking-tight">
            Questions fréquentes
          </h2>
          <Accordion>
            {faq.map(([question, answer]) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="grid justify-items-center gap-5 rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground">
            <h2 className="max-w-xl text-3xl font-medium tracking-tight text-balance">
              Prêt à voir ce que vos clients font vraiment ?
            </h2>
            <p className="max-w-md text-sm opacity-80">
              Créez votre compte en deux minutes. Aucune carte bancaire.
            </p>
            <Button size="lg" variant="secondary">
              Démarrer gratuitement
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p>© 2026 Orbite · Exemple de page, contenu fictif.</p>
          <nav aria-label="Pied de page" className="flex gap-5">
            <a
              href="#fonctionnalites"
              className="rounded-md px-1 py-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              Fonctionnalités
            </a>
            <a
              href="#tarifs"
              className="rounded-md px-1 py-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              Tarifs
            </a>
            <a
              href="#faq"
              className="rounded-md px-1 py-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              Questions
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
