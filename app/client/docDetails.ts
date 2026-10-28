import type { DocDetails } from './docContent.js';

// Détails par composant, famille par famille. Les noms de propriétés viennent des primitives
// Base UI et du code SortUI ; les variantes, elles, sont lues automatiquement dans le composant.
export const docDetails: Record<string, DocDetails> = {
  // --- Actions et éléments de base ---
  button: {
    props: [
      [
        'variant',
        'default | outline | secondary | ghost | destructive | link',
        'Importance visuelle. Une seule variante default par zone.',
      ],
      [
        'size',
        'xs | sm | default | lg | xl | icon…',
        'Hauteur de 24 à 40 px. Les tailles icon-* sont carrées et réservées aux boutons sans texte.',
      ],
      [
        'disabled',
        'boolean',
        'Désactive le bouton et le retire du parcours clavier.',
      ],
      [
        'render',
        'ReactElement',
        'Rend un autre élément (un lien, par exemple) avec le style du bouton.',
      ],
    ],
    tips: [
      'Un verbe à l’infinitif ou à l’impératif : « Enregistrer », pas « OK ».',
      'Icône avant le texte avec data-icon="inline-start", après avec inline-end : le padding s’ajuste.',
      'Un bouton icône seul porte toujours un aria-label.',
    ],
  },
  'button-group': {
    parts: {
      ButtonGroup:
        'Conteneur : raccorde les bords des boutons et gère l’orientation.',
      ButtonGroupSeparator: 'Filet entre deux boutons du même groupe.',
      ButtonGroupText:
        'Texte statique intégré au groupe, comme une étiquette « Export ».',
    },
    tips: [
      'Les boutons d’un groupe partagent la même variante et la même taille.',
      'Orientation verticale pour les barres latérales étroites.',
    ],
  },
  toggle: {
    props: [
      ['pressed / defaultPressed', 'boolean', 'État contrôlé ou initial.'],
      [
        'onPressedChange',
        '(pressed: boolean) => void',
        'Appelé à chaque bascule.',
      ],
      [
        'variant',
        'default | outline',
        'Outline ajoute une bordure visible au repos.',
      ],
    ],
    tips: [
      'Un état activé doit se voir sans la couleur seule : fond plus marqué.',
    ],
  },
  'toggle-group': {
    parts: {
      ToggleGroup:
        'Conteneur : porte la valeur sélectionnée et le mode de choix.',
      ToggleGroupItem: 'Un choix du groupe. Sa valeur est la clé de sélection.',
    },
    props: [
      [
        'multiple',
        'boolean',
        'Autorise plusieurs choix à la fois ; sinon un seul.',
      ],
      [
        'value / defaultValue',
        'string[]',
        'Valeurs sélectionnées, contrôlées ou initiales.',
      ],
      [
        'onValueChange',
        '(value: string[]) => void',
        'Appelé quand la sélection change.',
      ],
    ],
    tips: ['Même taille et même variante pour tous les éléments.'],
  },
  badge: {
    tips: [
      'Un à deux mots. Pour un compteur, un nombre seul.',
      'Variante destructive réservée aux erreurs et états bloquants.',
    ],
  },
  kbd: {
    parts: {
      Kbd: 'Une touche, rendue dans un élément <kbd>.',
      KbdGroup: 'Plusieurs touches d’un même raccourci, avec espacement.',
    },
    tips: [
      'Écrire les touches telles qu’elles apparaissent sur le clavier : ⌘, Ctrl, Maj.',
    ],
  },
  separator: {
    props: [
      [
        'orientation',
        'horizontal | vertical',
        'Sens du filet ; un séparateur vertical a besoin d’un parent de hauteur définie.',
      ],
    ],
    tips: [
      'Préférer l’espace à une ligne quand le regroupement est déjà clair.',
    ],
  },
  avatar: {
    parts: {
      Avatar: 'Conteneur rond, dimensionné par className.',
      AvatarImage: 'Photo ; si elle échoue, le repli s’affiche.',
      AvatarFallback: 'Initiales ou icône affichées sans image.',
      AvatarBadge: 'Pastille de statut (en ligne, absent) en coin.',
      AvatarGroup: 'Pile d’avatars qui se chevauchent.',
      AvatarGroupCount: 'Pastille « +N » en bout de pile.',
    },
    tips: [
      'Toujours prévoir un repli : une image peut manquer.',
      'Limiter la pile à quatre avatars, puis « +N ».',
    ],
  },
  'simple-icon': {
    props: [
      [
        'icon',
        'SimpleIcon',
        'Objet issu de simple-icons (siGithub, siFigma…).',
      ],
    ],
    tips: ['Respecter les consignes de marque du logo représenté.'],
  },
  'file-icon': {
    props: [
      [
        'type',
        'FileIconType',
        'Type de fichier à représenter (pdf, image, code…).',
      ],
    ],
    tips: ['Toujours afficher le nom du fichier à côté.'],
  },
  spinner: {
    tips: [
      'Taille adaptée au contexte : petit dans un bouton, plus grand seul.',
      'Au-delà de deux secondes, afficher aussi un texte d’état.',
    ],
  },
  skeleton: {
    tips: [
      'Reproduire la forme et la taille du contenu final pour éviter tout saut de mise en page.',
    ],
  },
  'aspect-ratio': {
    props: [
      ['ratio', 'number', 'Rapport largeur / hauteur, par exemple 16 / 9.'],
    ],
    tips: [
      'Ajouter object-cover sur l’image pour qu’elle remplisse le cadre sans se déformer.',
    ],
  },
  direction: {
    parts: {
      DirectionProvider: 'Fournit le sens aux composants Base UI enfants.',
      useDirection: 'Hook qui lit le sens courant.',
    },
    props: [['direction', 'ltr | rtl', 'Sens d’écriture à appliquer.']],
    tips: [
      'Poser aussi dir sur le conteneur HTML : le fournisseur ne le fait pas à votre place.',
    ],
  },

  // --- Formulaires ---
  input: {
    props: [
      [
        'size',
        'default | lg | xl',
        'Hauteur du champ ; accepte aussi un nombre, comme l’attribut HTML size.',
      ],
      [
        'type',
        'text | email | password…',
        'Type HTML : fournit le clavier mobile et la validation du navigateur.',
      ],
      [
        'aria-invalid',
        'boolean',
        'Affiche l’état d’erreur (bordure et anneau rouges).',
      ],
    ],
    tips: [
      'Utiliser le bon type et autocomplete : le navigateur remplit à votre place.',
      'Un placeholder donne un exemple, jamais le libellé.',
    ],
  },
  'input-group': {
    parts: {
      InputGroup:
        'Conteneur : une seule bordure et un seul anneau de focus pour tout le groupe.',
      InputGroupAddon:
        'Zone attachée au champ ; align : inline-start, inline-end, block-start ou block-end.',
      InputGroupInput: 'Le champ de saisie sans bordure propre.',
      InputGroupTextarea: 'Variante multiligne du champ.',
      InputGroupButton: 'Bouton compact intégré au groupe.',
      InputGroupText: 'Texte statique, comme une unité ou un préfixe.',
    },
    tips: [
      'Un champ, une action : n’attacher qu’un bouton.',
      'Les icônes d’ajout restent décoratives.',
    ],
  },
  'input-otp': {
    parts: {
      InputOTP: 'Conteneur : porte la valeur et la longueur du code.',
      InputOTPGroup: 'Groupe de cases voisines.',
      InputOTPSlot: 'Une case ; son index désigne le caractère affiché.',
      InputOTPSeparator: 'Séparateur visuel entre deux groupes (123-456).',
    },
    props: [
      ['maxLength', 'number', 'Nombre de caractères du code.'],
      [
        'value / onChange',
        'string / (value: string) => void',
        'Valeur contrôlée.',
      ],
      [
        'onComplete',
        '(value: string) => void',
        'Appelé quand toutes les cases sont remplies.',
      ],
      [
        'pattern',
        'RegExp source',
        'Caractères autorisés ; chiffres seulement par défaut dans la plupart des cas.',
      ],
    ],
    tips: [
      'Valider automatiquement dès que le code est complet.',
      'Autoriser le collage du code entier.',
    ],
  },
  textarea: {
    props: [
      [
        'rows',
        'number',
        'Hauteur initiale en lignes ; le champ garde la taille de l’utilisateur.',
      ],
    ],
    tips: ['Afficher le compteur de caractères si une limite existe.'],
  },
  label: {
    props: [
      [
        'htmlFor',
        'string',
        'Identifiant du champ associé. Inutile si le champ est imbriqué dans le label.',
      ],
    ],
    tips: [
      'Court et explicite : le nom de la donnée attendue.',
      'Marquer les champs facultatifs plutôt que les obligatoires.',
    ],
  },
  field: {
    parts: {
      Field:
        'Un champ complet ; orientation : vertical, horizontal ou responsive.',
      FieldLabel: 'Libellé du champ.',
      FieldDescription: 'Texte d’aide sous le champ.',
      FieldError: 'Message d’erreur ; accepte une liste d’erreurs.',
      FieldGroup: 'Empile plusieurs champs avec un espacement homogène.',
      FieldSet: 'Regroupe des champs liés dans un fieldset.',
      FieldLegend: 'Titre du fieldset (variante legend ou label).',
      FieldSeparator: 'Séparateur entre groupes, avec libellé facultatif.',
      FieldContent: 'Colonne libellé + description en orientation horizontale.',
      FieldTitle: 'Titre non interactif dans un champ.',
    },
    tips: [
      'Une erreur dit comment corriger : « Entrez une adresse comme nom@exemple.fr ».',
      'Valider à la sortie du champ, pas à chaque frappe.',
    ],
  },
  checkbox: {
    props: [
      ['checked / defaultChecked', 'boolean', 'État contrôlé ou initial.'],
      [
        'onCheckedChange',
        '(checked: boolean) => void',
        'Appelé à chaque changement.',
      ],
      [
        'indeterminate',
        'boolean',
        'État mixte, pour une case parent dont les enfants sont partiellement cochés.',
      ],
      ['required / disabled', 'boolean', 'Contraintes du formulaire.'],
    ],
    tips: ['Le libellé décrit ce qui se passe quand la case est cochée.'],
  },
  'radio-group': {
    parts: {
      RadioGroup: 'Conteneur : porte la valeur choisie.',
      RadioGroupItem: 'Une option ; sa valeur identifie le choix.',
    },
    props: [
      [
        'value / defaultValue',
        'string',
        'Option choisie, contrôlée ou initiale.',
      ],
      [
        'onValueChange',
        '(value: string) => void',
        'Appelé au changement de choix.',
      ],
    ],
    tips: [
      'Présélectionner l’option la plus courante, sauf si le choix doit être délibéré.',
    ],
  },
  switch: {
    props: [
      ['size', 'sm | default', 'Taille de l’interrupteur.'],
      ['checked / defaultChecked', 'boolean', 'État contrôlé ou initial.'],
      [
        'onCheckedChange',
        '(checked: boolean) => void',
        'Appelé à chaque bascule : l’effet doit être immédiat.',
      ],
    ],
    tips: [
      'Le libellé nomme le réglage, pas l’action : « Notifications », pas « Activer les notifications ».',
    ],
  },
  slider: {
    parts: {
      Slider: 'Piste, plage et poignée(s).',
      SliderLabel: 'Libellé lié au curseur.',
      SliderValue: 'Affiche la valeur courante.',
    },
    props: [
      [
        'value / defaultValue',
        'number | number[]',
        'Un nombre, ou deux pour une plage.',
      ],
      ['min / max / step', 'number', 'Bornes et pas.'],
      ['onValueChange', '(value) => void', 'Appelé pendant le glissement.'],
      [
        'onValueCommitted',
        '(value) => void',
        'Appelé au relâchement : pour enregistrer.',
      ],
    ],
    tips: ['Montrer la valeur numérique : la position seule est imprécise.'],
  },
  select: {
    parts: {
      Select: 'Racine : valeur et état d’ouverture.',
      SelectTrigger:
        'Bouton qui affiche la valeur ; size : sm, default, lg, xl.',
      SelectValue: 'Valeur courante, ou texte de remplacement.',
      SelectContent: 'Liste déroulante.',
      SelectItem: 'Une option.',
      SelectGroup: 'Groupe d’options.',
      SelectLabel: 'Titre d’un groupe.',
      SelectSeparator: 'Filet entre groupes.',
    },
    props: [
      ['value / defaultValue', 'string', 'Option choisie.'],
      ['onValueChange', '(value) => void', 'Appelé au choix.'],
      [
        'items',
        'Record | Array',
        'Correspondance valeur → libellé pour afficher le texte dans le bouton.',
      ],
    ],
    tips: [
      'Trier les options par ordre logique (alphabétique, fréquence).',
      'Prévoir une option vide claire : « Choisir… ».',
    ],
  },
  'native-select': {
    parts: {
      NativeSelect: 'Le <select> natif stylé ; size : sm, default, lg, xl.',
      NativeSelectOption: 'Une option.',
      NativeSelectOptGroup: 'Groupe d’options.',
    },
    tips: [
      'Choisir ce composant sur mobile : le sélecteur du système est plus ergonomique.',
    ],
  },
  combobox: {
    parts: {
      Combobox: 'Racine : valeur, saisie et filtrage.',
      ComboboxInput:
        'Champ de recherche ; showTrigger et showClear ajoutent les boutons.',
      ComboboxContent: 'Fenêtre des résultats.',
      ComboboxList: 'Liste des options affichées.',
      ComboboxItem: 'Une option.',
      ComboboxEmpty: 'Message quand aucun résultat ne correspond.',
      ComboboxChips: 'Zone des valeurs choisies en mode multiple.',
      ComboboxChip: 'Une valeur choisie, avec bouton de retrait.',
    },
    props: [
      ['items', 'T[]', 'Données à filtrer.'],
      ['value / onValueChange', 'T | T[]', 'Sélection contrôlée.'],
      ['multiple', 'boolean', 'Autorise plusieurs choix, affichés en puces.'],
      [
        'onInputValueChange',
        '(text: string) => void',
        'Suit la saisie, par exemple pour chercher côté serveur.',
      ],
    ],
    tips: ['Toujours fournir un état « Aucun résultat ».'],
  },
  calendar: {
    props: [
      [
        'mode',
        'single | multiple | range',
        'Sélection d’un jour, de plusieurs ou d’une plage.',
      ],
      [
        'selected / onSelect',
        'Date | Date[] | DateRange',
        'Sélection contrôlée.',
      ],
      ['numberOfMonths', 'number', 'Nombre de mois affichés côte à côte.'],
      ['disabled', 'Matcher', 'Jours non sélectionnables (passé, week-ends…).'],
      ['locale', 'Locale', 'Langue et premier jour de la semaine (date-fns).'],
    ],
    tips: [
      'Désactiver les dates impossibles plutôt que d’afficher une erreur après coup.',
    ],
  },

  // --- Navigation et structure ---
  breadcrumb: {
    parts: {
      Breadcrumb: 'Élément <nav> nommé « fil d’Ariane ».',
      BreadcrumbList: 'Liste ordonnée des niveaux.',
      BreadcrumbItem: 'Un niveau.',
      BreadcrumbLink:
        'Lien vers un niveau parent ; accepte render pour un lien de routeur.',
      BreadcrumbPage: 'Niveau courant, non cliquable.',
      BreadcrumbSeparator: 'Séparateur décoratif entre deux niveaux.',
      BreadcrumbEllipsis: 'Remplace les niveaux masqués sur un chemin long.',
    },
    tips: [
      'Le dernier niveau est la page courante, jamais un lien.',
      'Au-delà de quatre niveaux, masquer le milieu derrière une ellipse.',
    ],
  },
  pagination: {
    parts: {
      Pagination: 'Élément <nav> nommé « pagination ».',
      PaginationContent: 'Liste des éléments.',
      PaginationItem: 'Un emplacement de la liste.',
      PaginationLink: 'Lien vers une page ; isActive marque la page courante.',
      PaginationPrevious: 'Page précédente.',
      PaginationNext: 'Page suivante.',
      PaginationEllipsis: 'Pages masquées.',
    },
    props: [
      [
        'isActive',
        'boolean',
        'Marque la page courante et pose aria-current="page".',
      ],
    ],
    tips: ['Afficher la première, la dernière, la courante et ses voisines.'],
  },
  tabs: {
    parts: {
      Tabs: 'Racine : onglet actif et orientation.',
      TabsList:
        'Rangée d’onglets ; variant : default, secondary, primary ou line.',
      TabsTrigger: 'Un onglet ; sa valeur désigne son panneau.',
      TabsTriggerDescription: 'Sous-texte dans un onglet.',
      TabsTriggerCount: 'Compteur dans un onglet.',
      TabsContent: 'Panneau associé à un onglet.',
    },
    props: [
      ['value / defaultValue', 'string', 'Onglet actif, contrôlé ou initial.'],
      [
        'onValueChange',
        '(value: string) => void',
        'Appelé au changement d’onglet.',
      ],
      [
        'orientation',
        'horizontal | vertical',
        'Sens de la rangée et des flèches clavier.',
      ],
    ],
    tips: [
      'Libellés d’un ou deux mots.',
      'Ne pas masquer d’information obligatoire dans un onglet inactif.',
    ],
  },
  'navigation-menu': {
    parts: {
      NavigationMenu:
        'Racine ; align, sideOffset et anchor règlent la position du panneau.',
      NavigationMenuList: 'Liste des rubriques.',
      NavigationMenuItem: 'Une rubrique.',
      NavigationMenuTrigger: 'Ouvre le panneau d’une rubrique.',
      NavigationMenuContent: 'Contenu du panneau.',
      NavigationMenuLink: 'Lien, dans le panneau ou en rubrique simple.',
    },
    tips: [
      'Un panneau regroupe des liens apparentés, avec une courte description.',
    ],
  },
  menubar: {
    parts: {
      Menubar: 'Barre qui contient les menus.',
      MenubarMenu: 'Un menu complet.',
      MenubarTrigger: 'Titre du menu dans la barre.',
      MenubarContent: 'Liste déroulante du menu.',
      MenubarItem: 'Une commande ; MenubarShortcut y affiche son raccourci.',
      MenubarCheckboxItem: 'Commande à cocher.',
      MenubarRadioGroup: 'Commandes à choix unique (avec MenubarRadioItem).',
      MenubarSub: 'Sous-menu (MenubarSubTrigger + MenubarSubContent).',
    },
    tips: ['Garder les noms de menus standard : Fichier, Édition, Affichage.'],
  },
  sidebar: {
    parts: {
      SidebarProvider:
        'Fournit l’état ouvert ou replié ; defaultOpen, open et onOpenChange.',
      Sidebar:
        'Le panneau ; side : left ou right, variant : sidebar, floating ou inset, collapsible : offcanvas, icon ou none.',
      SidebarHeader: 'En-tête fixe.',
      SidebarContent: 'Zone défilante principale.',
      SidebarFooter: 'Pied fixe.',
      SidebarGroup: 'Section titrée (SidebarGroupLabel, SidebarGroupContent).',
      SidebarMenu:
        'Liste de destinations (SidebarMenuItem, SidebarMenuButton).',
      SidebarTrigger: 'Bouton pour ouvrir ou replier.',
      SidebarInset: 'Zone de contenu à côté de la barre latérale.',
    },
    tips: [
      'Regrouper les destinations par sections de cinq à sept éléments.',
      'Le mode icône garde les libellés accessibles via des info-bulles.',
    ],
  },
  accordion: {
    parts: {
      Accordion: 'Racine ; multiple autorise plusieurs sections ouvertes.',
      AccordionItem: 'Une section ; sa valeur l’identifie.',
      AccordionTrigger: 'En-tête cliquable.',
      AccordionContent: 'Contenu replié.',
    },
    props: [
      ['multiple', 'boolean', 'Plusieurs sections ouvertes en même temps.'],
      ['value / defaultValue', 'string[]', 'Sections ouvertes.'],
      [
        'onValueChange',
        '(value: string[]) => void',
        'Appelé à l’ouverture ou à la fermeture.',
      ],
    ],
    tips: ['Titres sous forme de questions ou de sujets courts.'],
  },
  collapsible: {
    parts: {
      Collapsible: 'Racine ; open, defaultOpen, onOpenChange.',
      CollapsibleTrigger: 'Bouton qui replie ou déplie.',
      CollapsibleContent: 'Zone repliable.',
    },
    tips: ['Le déclencheur dit ce qu’il révèle : « Options avancées ».'],
  },
  'scroll-area': {
    parts: {
      ScrollArea: 'Conteneur défilant ; sa hauteur doit être bornée.',
      ScrollBar: 'Barre de défilement ; orientation vertical ou horizontal.',
    },
    tips: ['Donner une hauteur ou une largeur maximale, sinon rien ne défile.'],
  },
  resizable: {
    parts: {
      ResizablePanelGroup: 'Groupe ; orientation horizontal ou vertical.',
      ResizablePanel:
        'Un panneau ; defaultSize, minSize et maxSize bornent sa taille.',
      ResizableHandle:
        'Poignée entre deux panneaux ; withHandle affiche une prise visible.',
    },
    tips: [
      'Fixer une taille minimale : un panneau écrasé devient inutilisable.',
    ],
  },
  carousel: {
    parts: {
      Carousel: 'Racine ; orientation, opts (Embla) et setApi.',
      CarouselContent: 'Piste qui défile.',
      CarouselItem: 'Une diapositive.',
      CarouselPrevious: 'Bouton précédent.',
      CarouselNext: 'Bouton suivant.',
    },
    tips: [
      'Laisser entrevoir la diapositive suivante : on comprend qu’il y a une suite.',
      'Pas de défilement automatique.',
    ],
  },

  // --- Affichage de données ---
  card: {
    parts: {
      Card: 'Conteneur ; size : default ou sm.',
      CardHeader: 'En-tête : titre, description et action.',
      CardTitle: 'Titre de la carte.',
      CardDescription: 'Texte secondaire sous le titre.',
      CardAction: 'Action alignée à droite de l’en-tête.',
      CardContent: 'Corps de la carte.',
      CardFooter: 'Pied : boutons ou métadonnées.',
    },
    tips: [
      'Un sujet par carte.',
      'Si la carte entière mène quelque part, un seul lien dans le titre suffit.',
    ],
  },
  item: {
    parts: {
      Item: 'Ligne ; variant : default, outline ou muted ; size : default, sm ou xs.',
      ItemMedia: 'Icône, avatar ou image à gauche.',
      ItemContent: 'Colonne texte : titre et description.',
      ItemTitle: 'Titre de la ligne.',
      ItemDescription: 'Texte secondaire.',
      ItemActions: 'Boutons à droite.',
      ItemGroup: 'Liste de lignes ; ItemSeparator les sépare.',
      ItemHeader: 'Bandeau au-dessus du contenu.',
      ItemFooter: 'Bandeau sous le contenu.',
    },
    tips: ['Item accepte render : une ligne entière peut être un lien.'],
  },
  table: {
    parts: {
      Table: 'Tableau avec défilement horizontal intégré.',
      TableHeader: 'Groupe des en-têtes.',
      TableHead: 'Cellule d’en-tête de colonne.',
      TableBody: 'Corps du tableau.',
      TableRow: 'Une ligne.',
      TableCell: 'Une cellule.',
      TableFooter: 'Ligne de total ou de synthèse.',
      TableCaption: 'Légende lue par les lecteurs d’écran.',
    },
    tips: [
      'Aligner les nombres à droite.',
      'Toujours une légende ou un titre associé au tableau.',
    ],
  },
  empty: {
    parts: {
      Empty: 'Conteneur centré.',
      EmptyMedia: 'Illustration ou icône ; variant : default ou icon.',
      EmptyHeader: 'Groupe titre et description.',
      EmptyTitle: 'Titre : ce qui est vide.',
      EmptyDescription: 'Pourquoi, et quoi faire.',
      EmptyContent: 'Actions proposées.',
    },
    tips: [
      'Proposer une action concrète : « Créer un composant ».',
      'Distinguer « rien encore » de « aucun résultat pour ce filtre ».',
    ],
  },
  alert: {
    parts: {
      Alert: 'Conteneur ; variant : default ou destructive.',
      AlertTitle: 'Titre court du message.',
      AlertDescription: 'Détail et suite à donner.',
      AlertAction: 'Bouton aligné dans l’alerte.',
    },
    tips: [
      'Le titre dit ce qui s’est passé, la description dit quoi faire.',
      'Pas plus d’une alerte visible par zone.',
    ],
  },
  progress: {
    parts: {
      Progress:
        'Barre ; variant : default ou dashed, segments règle le nombre de tirets.',
      ProgressCircle:
        'Version circulaire ; thickness règle l’épaisseur de l’anneau.',
      ProgressLabel: 'Libellé de la tâche.',
      ProgressValue: 'Pourcentage affiché.',
      ProgressTrack: 'Rail de la barre.',
      ProgressIndicator: 'Remplissage.',
    },
    props: [
      [
        'value',
        'number | null',
        'Valeur courante ; null affiche un état indéterminé.',
      ],
      ['min / max', 'number', 'Bornes, 0 et 100 par défaut.'],
    ],
    tips: ['Afficher la valeur en texte à côté de la barre.'],
  },
  'usage-bar': {
    parts: {
      UsageBar: 'Racine ; max est le total auquel les segments se rapportent.',
      UsageBarHeader: 'Ligne de titre et de total.',
      UsageBarTrack: 'Rail qui contient les segments.',
      UsageBarSegment:
        'Une part ; name et value, variant : default, muted, primary, striped ou dashed.',
      UsageBarLegend: 'Légende sous la barre.',
      UsageBarLegendItem:
        'Une entrée de légende, au survol elle met le segment en valeur.',
      UsageBarAxis: 'Graduation sous la barre.',
    },
    props: [
      ['max', 'number', 'Le tout, dans la même unité que les segments.'],
      [
        'active / onActiveChange',
        'string | null',
        'Segment mis en valeur, contrôlé.',
      ],
    ],
    tips: [
      'Distinguer les segments par la trame (variant) et pas seulement par la couleur.',
    ],
  },
  chart: {
    parts: {
      ChartContainer:
        'Racine ; config associe chaque série à un libellé et une couleur.',
      ChartTooltip: 'Info-bulle Recharts.',
      ChartTooltipContent: 'Rendu de l’info-bulle ; nameKey et hideIcon.',
      ChartLegend: 'Légende Recharts.',
      ChartLegendContent: 'Rendu de la légende.',
    },
    props: [
      [
        'config',
        'ChartConfig',
        'Pour chaque série : label, icône et couleur (variable CSS --chart-*).',
      ],
    ],
    tips: [
      'Utiliser les couleurs chart-* du thème : elles suivent le mode clair et sombre.',
      'Prévoir un texte ou un tableau équivalent.',
    ],
  },
  marker: {
    parts: {
      Marker:
        'Conteneur ; variant : default, separator (filets de part et d’autre) ou border.',
      MarkerIcon: 'Icône facultative.',
      MarkerContent: 'Texte du repère.',
    },
    tips: ['Court : « Aujourd’hui », « Conversation archivée ».'],
  },
  sonner: {
    parts: { Toaster: 'À placer une fois à la racine de l’application.' },
    props: [
      [
        'toast(message, options)',
        'function',
        'Déclenche une notification ; description, action et duration en options.',
      ],
      [
        'position',
        'top-right | bottom-center…',
        'Emplacement des toasts (sur Toaster).',
      ],
    ],
    tips: [
      'Réserver aux confirmations non bloquantes.',
      'Proposer « Annuler » pour une action réversible.',
    ],
  },

  // --- Superpositions et menus ---
  dialog: {
    parts: {
      Dialog: 'Racine : état ouvert ou fermé.',
      DialogTrigger: 'Bouton qui ouvre la fenêtre.',
      DialogContent:
        'La fenêtre ; showCloseButton affiche la croix de fermeture.',
      DialogHeader: 'Groupe titre et description.',
      DialogTitle: 'Titre : obligatoire, il nomme la fenêtre.',
      DialogDescription: 'Texte d’explication lu à l’ouverture.',
      DialogFooter: 'Boutons d’action, l’action principale en dernier.',
      DialogClose: 'Bouton qui ferme la fenêtre.',
    },
    props: [
      ['open / defaultOpen', 'boolean', 'État contrôlé ou initial.'],
      [
        'onOpenChange',
        '(open: boolean) => void',
        'Appelé à l’ouverture et à la fermeture, y compris par Échap.',
      ],
      [
        'modal',
        'boolean | "trap-focus"',
        'Rend le reste de la page inerte ; vrai par défaut.',
      ],
    ],
    tips: [
      'Un titre toujours présent, même masqué visuellement.',
      'Le bouton d’annulation est toujours disponible.',
    ],
  },
  'alert-dialog': {
    parts: {
      AlertDialog: 'Racine.',
      AlertDialogTrigger: 'Bouton qui ouvre la confirmation.',
      AlertDialogContent: 'La fenêtre ; size : default ou sm.',
      AlertDialogHeader: 'Groupe titre, description et média.',
      AlertDialogMedia: 'Icône d’avertissement.',
      AlertDialogTitle: 'La question posée.',
      AlertDialogDescription: 'Conséquence de l’action.',
      AlertDialogFooter: 'Les deux boutons.',
      AlertDialogCancel: 'Annule et ferme.',
      AlertDialogAction: 'Confirme l’action.',
    },
    tips: [
      'Nommer l’action dans le bouton : « Supprimer le token », pas « Oui ».',
      'Dire ce qui est perdu et si c’est récupérable.',
    ],
  },
  sheet: {
    parts: {
      Sheet: 'Racine.',
      SheetTrigger: 'Bouton d’ouverture.',
      SheetContent:
        'Le panneau ; side : top, right, bottom ou left, et showCloseButton.',
      SheetHeader: 'Groupe titre et description.',
      SheetTitle: 'Titre obligatoire.',
      SheetDescription: 'Texte d’explication.',
      SheetFooter: 'Boutons d’action.',
      SheetClose: 'Bouton de fermeture.',
    },
    tips: ['Côté droit pour les détails, côté gauche pour la navigation.'],
  },
  drawer: {
    parts: {
      Drawer: 'Racine ; showSwipeHandle affiche la poignée de glissement.',
      DrawerTrigger: 'Bouton d’ouverture.',
      DrawerContent: 'Le panneau.',
      DrawerHeader: 'Groupe titre et description.',
      DrawerTitle: 'Titre obligatoire.',
      DrawerDescription: 'Texte d’explication.',
      DrawerFooter: 'Boutons d’action.',
      DrawerClose: 'Bouton de fermeture.',
    },
    props: [
      [
        'swipeDirection',
        'down | up | left | right',
        'Sens du geste de fermeture.',
      ],
    ],
    tips: ['Garder les actions dans la zone du pouce, en bas.'],
  },
  popover: {
    parts: {
      Popover: 'Racine.',
      PopoverTrigger: 'Élément qui ouvre le panneau.',
      PopoverContent:
        'Panneau ; side, align, sideOffset et alignOffset le positionnent.',
      PopoverHeader: 'Groupe titre et description.',
      PopoverTitle: 'Titre du panneau.',
      PopoverDescription: 'Explication.',
    },
    props: [
      [
        'side / align',
        'top | right | bottom | left / start | center | end',
        'Position du panneau, ajustée si l’écran manque de place.',
      ],
    ],
    tips: ['Garder le contenu court : au-delà, une Dialog est plus adaptée.'],
  },
  'hover-card': {
    parts: {
      HoverCard: 'Racine.',
      HoverCardTrigger: 'Lien ou élément survolé.',
      HoverCardContent: 'Carte d’aperçu ; side, align, sideOffset.',
    },
    tips: [
      'Réserver aux informations secondaires : la carte n’existe pas au toucher.',
    ],
  },
  tooltip: {
    parts: {
      TooltipProvider:
        'Partage le délai d’apparition entre plusieurs info-bulles.',
      Tooltip: 'Racine.',
      TooltipTrigger: 'Élément survolé ou focalisé.',
      TooltipContent:
        'Texte ; side (top par défaut), align, sideOffset (8 par défaut).',
    },
    tips: [
      'Quelques mots, jamais de lien ni de bouton.',
      'Ne pas répéter ce que le libellé dit déjà.',
    ],
  },
  'dropdown-menu': {
    parts: {
      DropdownMenu: 'Racine.',
      DropdownMenuTrigger: 'Bouton qui ouvre le menu.',
      DropdownMenuContent: 'Liste du menu.',
      DropdownMenuItem: 'Commande ; variant : default ou destructive.',
      DropdownMenuCheckboxItem: 'Commande à cocher.',
      DropdownMenuRadioGroup:
        'Commandes à choix unique (avec DropdownMenuRadioItem).',
      DropdownMenuLabel: 'Titre de groupe.',
      DropdownMenuSeparator: 'Filet entre groupes.',
      DropdownMenuShortcut: 'Raccourci affiché à droite.',
      DropdownMenuSub: 'Sous-menu.',
    },
    tips: [
      'Verbes à l’infinitif. Actions destructives en dernier, séparées et en variante destructive.',
      'Pas plus de sept entrées par groupe.',
    ],
  },
  'context-menu': {
    parts: {
      ContextMenu: 'Racine.',
      ContextMenuTrigger: 'Zone sensible au clic droit.',
      ContextMenuContent: 'Liste du menu.',
      ContextMenuItem: 'Commande ; variant : default ou destructive.',
      ContextMenuCheckboxItem: 'Commande à cocher.',
      ContextMenuRadioGroup: 'Commandes à choix unique.',
      ContextMenuSub: 'Sous-menu.',
      ContextMenuShortcut: 'Raccourci affiché à droite.',
    },
    tips: [
      'Reprendre les mêmes entrées qu’un menu visible : le clic droit ne se découvre pas.',
    ],
  },
  command: {
    parts: {
      Command: 'Racine : filtre et sélection.',
      CommandDialog:
        'Palette ouverte dans une fenêtre ; title, description et showCloseButton.',
      CommandInput: 'Champ de recherche.',
      CommandList: 'Liste défilante.',
      CommandEmpty: 'Message sans résultat.',
      CommandGroup: 'Groupe titré.',
      CommandItem: 'Une commande.',
      CommandShortcut: 'Raccourci affiché à droite.',
      CommandSeparator: 'Filet entre groupes.',
    },
    tips: [
      'Ouvrir au raccourci ⌘K et refermer à Échap.',
      'Trier par pertinence et grouper par type.',
    ],
  },

  // --- Interfaces conversationnelles ---
  'ai-chat-composer': {
    parts: {
      AIChatComposer: 'Racine : état du texte, du dictage et de la taille.',
      AIChatComposerHeader:
        'Bandeau au-dessus du champ (pièces jointes, contexte).',
      AIChatComposerTextarea: 'Zone de saisie qui grandit avec le texte.',
      AIChatComposerLeading: 'Actions à gauche du champ.',
      AIChatComposerTrailing: 'Actions à droite du champ.',
      AIChatComposerDictate: 'Bouton de dictée vocale.',
      AIChatComposerSubmit:
        'Bouton d’envoi, désactivé tant que le champ est vide.',
      AIChatComposerDictationError: 'Message d’erreur de dictée.',
    },
    tips: [
      'Entrée envoie, Maj+Entrée saute une ligne : le dire dans le placeholder.',
      'Garder le texte saisi si l’envoi échoue.',
    ],
  },
  attachment: {
    parts: {
      Attachment:
        'Conteneur ; type : file, card ou image ; variant, size et orientation.',
      AttachmentGroup: 'Liste de pièces jointes.',
      AttachmentMedia: 'Vignette ou icône du fichier.',
      AttachmentContent: 'Colonne texte.',
      AttachmentTitle: 'Nom du fichier.',
      AttachmentDescription: 'Taille, type ou état.',
      AttachmentActions: 'Zone des actions.',
      AttachmentAction: 'Une action, par exemple retirer.',
      AttachmentTrigger: 'Rend toute la pièce cliquable.',
    },
    tips: ['Afficher l’état d’envoi : en cours, terminé, échec.'],
  },
  bubble: {
    parts: {
      BubbleGroup: 'Suite de bulles du même émetteur.',
      Bubble:
        'Une bulle ; variant : default, secondary, muted, tinted, outline, ghost ou destructive ; align : start ou end.',
      BubbleContent: 'Contenu de la bulle.',
      BubbleReactions: 'Réactions attachées ; align et side.',
    },
    tips: [
      'Aligner à droite l’utilisateur, à gauche l’assistant, et le nommer en texte.',
    ],
  },
  message: {
    parts: {
      MessageGroup: 'Messages consécutifs du même auteur.',
      Message: 'Un message ; align : start ou end.',
      MessageAvatar: 'Avatar de l’auteur.',
      MessageHeader: 'Nom et heure.',
      MessageContent: 'Corps du message.',
      MessageFooter: 'Actions et état (copier, régénérer).',
    },
    tips: [
      'Grouper les messages consécutifs pour n’afficher l’avatar qu’une fois.',
    ],
  },
  'message-scroller': {
    parts: {
      MessageScrollerProvider: 'Partage l’état de défilement avec le bouton.',
      MessageScroller: 'Racine.',
      MessageScrollerViewport: 'Zone qui défile.',
      MessageScrollerContent: 'Colonne des messages.',
      MessageScrollerItem: 'Un message repéré pour le suivi.',
      MessageScrollerButton: 'Bouton « aller en bas » quand on a remonté.',
    },
    tips: [
      'Ne jamais ramener de force en bas quand la personne lit plus haut.',
    ],
  },
  trace: {
    parts: {
      Trace: 'Une étape ; status : running, error ou pending.',
      TraceLine: 'Trait qui relie les étapes.',
      TraceIcon: 'Icône d’état.',
      TraceTitle: 'Nom de l’étape.',
      TraceDescription: 'Détail court.',
      TraceCollapsible: 'Zone repliable pour la sortie complète.',
      TraceCollapsibleTrigger: 'Bouton qui déplie le détail.',
      TraceCollapsibleContent: 'Détail complet.',
    },
    tips: ['Replier le détail par défaut, déplier sur erreur.'],
  },
  diff: {
    parts: {
      Diff: 'Racine : reçoit oldValue, newValue et fileName, et calcule les différences.',
      DiffHeader: 'Bandeau du fichier.',
      DiffTitle: 'Nom du fichier.',
      DiffStats: 'Lignes ajoutées et supprimées.',
      DiffContent: 'Lignes du diff avec numéros et marques.',
    },
    tips: [
      'Afficher un contexte de quelques lignes autour de chaque changement.',
    ],
  },

  // --- Blocs ---
  'chat-sidebar-01': {
    tips: [
      'Bloc de démonstration : copiez les fichiers du registre et adaptez les données.',
    ],
  },
  'chat-thread-01': {
    tips: [
      'Les messages d’exemple sont fictifs : branchez votre source de données.',
    ],
  },
  'chat-welcome-01': { tips: ['Limiter les suggestions à trois ou quatre.'] },
  'prompt-input-01': {
    tips: [
      'Combine plusieurs composants : le zoomer d’abord dans le composant d’origine.',
    ],
  },
  'model-picker-01': {
    tips: ['Décrire chaque modèle en une phrase : usage, vitesse, coût.'],
  },
  'effort-slider-01': { tips: ['Nommer les niveaux plutôt que des nombres.'] },
  'sleep-widget-01': {
    tips: [
      'Exemple de composition de cartes et de graphiques : les données sont fictives.',
    ],
  },
};
