// Règles « à faire / à éviter » par cas d'usage. Chaque cas décrit une situation, le bon geste
// et l'erreur courante : à lire avant d'utiliser le composant, pas après.
export interface Case {
  when: string;
  do: string;
  dont: string;
}

const c = (when: string, doIt: string, dont: string): Case => ({
  when,
  do: doIt,
  dont,
});

export const dosDonts: Record<string, Case[]> = {
  // --- Actions et éléments de base ---
  button: [
    c(
      'Plusieurs actions dans une zone',
      'Un seul bouton principal ; les autres en Contour ou Discret.',
      'Trois boutons principaux côte à côte : rien ne ressort.',
    ),
    c(
      'Libellé',
      '« Enregistrer le token », un verbe et son objet.',
      '« OK » ou « Valider » sans contexte.',
    ),
    c(
      'Bouton icône',
      'size="icon" avec un aria-label : « Ajouter ».',
      'Une icône seule, sans nom accessible.',
    ),
    c(
      'Aller vers une autre page',
      'Un lien (variante Lien ou render) : le navigateur sait ouvrir un onglet.',
      'Un bouton dont le clic change window.location.',
    ),
  ],
  'button-group': [
    c(
      'Actions voisines',
      'Regrouper des formats d’export : JSON, CSS, Figma.',
      'Mélanger une action destructive et des actions neutres.',
    ),
    c(
      'Taille et variante',
      'Même variante et même taille pour tous les boutons.',
      'Un bouton Principal au milieu de boutons Contour.',
    ),
  ],
  toggle: [
    c(
      'État activé',
      'Un fond marqué et aria-pressed.',
      'Seulement une teinte de couleur légèrement différente.',
    ),
    c(
      'Action ponctuelle',
      'Un Button pour « Exporter ».',
      'Un Toggle qui se désactive aussitôt après le clic.',
    ),
  ],
  'toggle-group': [
    c(
      'Choix unique ou multiple',
      'Choix unique pour l’alignement, multiple pour Gras et Italique.',
      'Mélanger les deux logiques dans un même groupe.',
    ),
    c(
      'Nombre d’options',
      'Trois à cinq options visibles d’un coup.',
      'Huit options : préférer un Select.',
    ),
  ],
  badge: [
    c(
      'Statut',
      'Un mot : « Nouveau », « Bêta ».',
      'Une phrase entière dans l’étiquette.',
    ),
    c(
      'Couleur',
      'Le texte dit le statut, la couleur le renforce.',
      'Un statut rouge sans texte.',
    ),
  ],
  kbd: [
    c(
      'Raccourci',
      '<Kbd>⌘</Kbd><Kbd>K</Kbd> dans un KbdGroup.',
      'Écrire « Cmd+K » dans un texte courant.',
    ),
    c(
      'Plateforme',
      'Afficher ⌘ sur Mac, Ctrl ailleurs.',
      'Afficher un seul raccourci pour tous les systèmes.',
    ),
  ],
  separator: [
    c(
      'Regrouper',
      'Séparer deux groupes d’actions d’un menu.',
      'Mettre un filet entre chaque ligne d’une liste.',
    ),
    c(
      'Vertical',
      'Donner une hauteur au parent.',
      'Un séparateur vertical dans un parent sans hauteur : il disparaît.',
    ),
  ],
  avatar: [
    c(
      'Image absente',
      'Prévoir AvatarFallback avec les initiales.',
      'Laisser un cercle vide si la photo ne charge pas.',
    ),
    c('Pile', 'Quatre avatars puis « +N ».', 'Vingt avatars empilés.'),
  ],
  'simple-icon': [
    c(
      'Logo de service',
      'siGithub avec title="GitHub" si le logo est seul.',
      'Un logo seul sans nom accessible.',
    ),
    c(
      'Icône d’interface',
      'Utiliser lucide-react.',
      'Détourner un logo de marque pour dire « paramètres ».',
    ),
  ],
  'file-icon': [
    c(
      'Liste de fichiers',
      'Icône plus nom du fichier.',
      'Icône seule : le type ne suffit pas à identifier un fichier.',
    ),
    c(
      'Type inconnu',
      'Laisser le type « file » par défaut.',
      'Choisir un type au hasard.',
    ),
  ],
  spinner: [
    c(
      'Bouton en cours d’envoi',
      'Spinner dans le bouton, bouton désactivé.',
      'Laisser cliquer plusieurs fois pendant l’attente.',
    ),
    c(
      'Attente longue',
      'Ajouter un texte : « Génération en cours… ».',
      'Un spinner seul pendant dix secondes.',
    ),
  ],
  skeleton: [
    c(
      'Chargement d’une liste',
      'Trois lignes de la taille des vraies lignes.',
      'Un grand rectangle qui ne ressemble à rien.',
    ),
    c(
      'Contenu rapide',
      'Aucun squelette sous 200 ms.',
      'Un clignotement pour un chargement instantané.',
    ),
  ],
  'aspect-ratio': [
    c(
      'Image',
      'ratio 16 / 9 et object-cover.',
      'Étirer l’image pour qu’elle remplisse le cadre.',
    ),
    c(
      'Texte',
      'Laisser le texte à sa hauteur naturelle.',
      'Le placer dans un ratio fixe : il déborde.',
    ),
  ],
  direction: [
    c(
      'Langue de droite à gauche',
      'DirectionProvider et dir="rtl" sur le conteneur.',
      'Seulement le fournisseur, sans l’attribut dir.',
    ),
    c(
      'Icônes directionnelles',
      'Les inverser avec le sens.',
      'Laisser une flèche « suivant » pointer vers la gauche en RTL.',
    ),
  ],
  // --- Formulaires ---
  input: [
    c(
      'Libellé',
      'Un Label visible au-dessus du champ.',
      'Un placeholder qui disparaît à la saisie et remplace le libellé.',
    ),
    c(
      'Type de donnée',
      'type="email" et autocomplete adaptés.',
      'type="text" pour tout.',
    ),
    c(
      'Erreur',
      'aria-invalid et un message qui dit comment corriger.',
      'Une bordure rouge sans explication.',
    ),
  ],
  'input-group': [
    c(
      'Recherche',
      'Icône à gauche, champ, bouton à droite.',
      'Quatre boutons accrochés au même champ.',
    ),
    c(
      'Unité',
      'InputGroupText pour « € » ou « px ».',
      'Écrire l’unité dans le placeholder.',
    ),
  ],
  'input-otp': [
    c(
      'Code reçu',
      'Validation automatique à la dernière case.',
      'Demander de cliquer sur « Valider » après un code complet.',
    ),
    c(
      'Collage',
      'Accepter le code entier collé.',
      'Obliger à saisir chaque chiffre à la main.',
    ),
  ],
  textarea: [
    c(
      'Texte libre',
      'Afficher la limite : « 120 / 500 ».',
      'Couper le texte en silence à la limite.',
    ),
    c('Valeur courte', 'Un Input.', 'Un Textarea d’une ligne.'),
  ],
  label: [
    c(
      'Lien au champ',
      'htmlFor ou champ imbriqué.',
      'Un libellé posé à côté sans lien : le clic n’active rien.',
    ),
    c(
      'Formulation',
      '« Adresse e-mail ».',
      '« Entrez ici votre adresse e-mail s’il vous plaît ».',
    ),
  ],
  field: [
    c(
      'Erreur de saisie',
      'FieldError sous le champ, au moment de la sortie.',
      'Une alerte en haut de page qui n’indique pas le champ.',
    ),
    c(
      'Groupe de champs',
      'FieldSet avec FieldLegend.',
      'Une série de champs sans titre commun.',
    ),
  ],
  checkbox: [
    c(
      'Cases multiples',
      'Chaque case se coche indépendamment.',
      'Utiliser des cases pour un choix exclusif.',
    ),
    c(
      'Libellé',
      'Phrase positive : « Recevoir les notifications ».',
      'Négation : « Ne pas me notifier ».',
    ),
  ],
  'radio-group': [
    c(
      'Options',
      'Toutes visibles, une présélectionnée.',
      'Aucune option cochée au départ pour un réglage courant.',
    ),
    c(
      'Nombre',
      'Jusqu’à sept options.',
      'Quinze options : utiliser un Select.',
    ),
  ],
  switch: [
    c(
      'Réglage',
      'Effet immédiat à la bascule.',
      'Un interrupteur qu’il faut valider avec un bouton.',
    ),
    c(
      'Libellé',
      'Nommer le réglage : « Mode sombre ».',
      'Écrire « Activer / Désactiver » dans le libellé.',
    ),
  ],
  slider: [
    c(
      'Valeur',
      'Afficher le nombre à côté.',
      'Une position sans valeur lisible.',
    ),
    c(
      'Valeur exacte',
      'Associer un Input.',
      'Demander 37,5 % de précision au pixel.',
    ),
  ],
  select: [
    c(
      'Options longues',
      'Les trier et grouper.',
      'Les laisser dans un ordre arbitraire.',
    ),
    c(
      'Choix vide',
      'Un texte « Choisir un pays ».',
      'Présélectionner la première option sans que ce soit voulu.',
    ),
  ],
  'native-select': [
    c(
      'Mobile',
      'Le sélecteur natif du système.',
      'Un menu personnalisé difficile à toucher.',
    ),
    c(
      'Contenu riche',
      'Passer au Select.',
      'Mettre des icônes dans les options natives.',
    ),
  ],
  combobox: [
    c(
      'Liste longue',
      'Filtrer pendant la saisie.',
      'Demander de faire défiler 300 options.',
    ),
    c(
      'Aucun résultat',
      'Afficher ComboboxEmpty.',
      'Laisser une liste vide, sans message.',
    ),
  ],
  calendar: [
    c(
      'Dates impossibles',
      'Les désactiver avec disabled.',
      'Les laisser sélectionnables puis afficher une erreur.',
    ),
    c(
      'Date connue',
      'Offrir aussi un champ de saisie.',
      'Obliger à naviguer sur dix ans pour une date de naissance.',
    ),
  ],
  // --- Navigation et structure ---
  breadcrumb: [
    c(
      'Page courante',
      'BreadcrumbPage, non cliquable.',
      'Un lien vers la page où l’on est déjà.',
    ),
    c(
      'Chemin long',
      'Masquer le milieu avec une ellipse.',
      'Afficher sept niveaux qui débordent.',
    ),
  ],
  pagination: [
    c(
      'Page courante',
      'isActive et aria-current.',
      'Distinguer la page courante par la couleur seule.',
    ),
    c(
      'Grand nombre de pages',
      'Première, dernière, courante et voisines.',
      'Afficher les 80 numéros.',
    ),
  ],
  tabs: [
    c(
      'Vues d’un même objet',
      'Onglets à parts égales : Aperçu, Code, Tokens.',
      'Des onglets qui mènent à des pages différentes.',
    ),
    c('Libellés', 'Un ou deux mots.', 'Des phrases qui passent à la ligne.'),
  ],
  'navigation-menu': [
    c(
      'Rubriques',
      'Un panneau par rubrique avec des liens apparentés.',
      'Un panneau qui reprend toute la navigation du site.',
    ),
    c(
      'Navigation courante',
      'Marquer la page active.',
      'Ne rien indiquer sur la page courante.',
    ),
  ],
  menubar: [
    c(
      'Application riche',
      'Menus Fichier, Édition, Affichage.',
      'Une barre de menus pour un site vitrine.',
    ),
    c(
      'Raccourcis',
      'Les afficher dans chaque entrée.',
      'Cacher les raccourcis qui existent.',
    ),
  ],
  sidebar: [
    c(
      'Sections',
      'Cinq à sept destinations par groupe.',
      'Trente liens sans groupes.',
    ),
    c(
      'Mobile',
      'Panneau modal ouvert par un bouton.',
      'Une barre fixe qui mange la moitié de l’écran.',
    ),
  ],
  accordion: [
    c(
      'FAQ',
      'Une question par section.',
      'Cacher une information indispensable dans une section fermée.',
    ),
    c(
      'Ouverture',
      'Une section à la fois pour un contenu long.',
      'Tout ouvert par défaut.',
    ),
  ],
  collapsible: [
    c(
      'Options avancées',
      'Un déclencheur explicite : « Options avancées ».',
      'Un simple chevron sans texte.',
    ),
    c(
      'Plusieurs zones',
      'Passer à Accordion.',
      'Empiler cinq Collapsible sans lien entre eux.',
    ),
  ],
  'scroll-area': [
    c(
      'Hauteur',
      'Hauteur maximale définie.',
      'Aucune hauteur : rien ne défile.',
    ),
    c(
      'Page entière',
      'Laisser le défilement natif.',
      'Envelopper toute la page.',
    ),
  ],
  resizable: [
    c(
      'Taille minimale',
      'minSize sur chaque panneau.',
      'Laisser un panneau se réduire à zéro.',
    ),
    c(
      'Poignée',
      'withHandle pour montrer qu’on peut tirer.',
      'Une poignée invisible.',
    ),
  ],
  carousel: [
    c(
      'Suite visible',
      'Laisser entrevoir l’élément suivant.',
      'Cacher que d’autres éléments existent.',
    ),
    c(
      'Défilement',
      'Boutons et geste, à la main.',
      'Défilement automatique qui échappe à l’utilisateur.',
    ),
  ],
  // --- Affichage de données ---
  card: [
    c('Contenu', 'Un sujet par carte.', 'Une carte qui contient trois sujets.'),
    c(
      'Imbrication',
      'Séparer par des espacements.',
      'Des cartes dans des cartes.',
    ),
  ],
  item: [
    c(
      'Liste de personnes',
      'Avatar, nom, description, action.',
      'Des données chiffrées en colonnes : utiliser Table.',
    ),
    c(
      'Ligne cliquable',
      'render pour en faire un lien.',
      'Un onClick sur un div.',
    ),
  ],
  table: [
    c(
      'Nombres',
      'Alignés à droite.',
      'Alignés à gauche : on ne compare pas les unités.',
    ),
    c(
      'Mise en page',
      'Utiliser des tableaux pour des données.',
      'Utiliser un tableau pour aligner des blocs.',
    ),
  ],
  empty: [
    c(
      'Première visite',
      'Expliquer et proposer l’action.',
      'Un « Aucune donnée » sec.',
    ),
    c(
      'Filtre sans résultat',
      'Proposer d’effacer le filtre.',
      'Dire « rien encore » alors que c’est un filtre.',
    ),
  ],
  alert: [
    c(
      'Message',
      'Le titre dit l’événement, la description la suite.',
      'Un message vague : « Une erreur est survenue ».',
    ),
    c('Quantité', 'Une alerte à la fois par zone.', 'Cinq alertes empilées.'),
  ],
  progress: [
    c(
      'Tâche mesurable',
      'Barre avec pourcentage lisible.',
      'Barre bloquée à 99 % sans explication.',
    ),
    c('Durée inconnue', 'Un Spinner.', 'Une barre qui avance au hasard.'),
  ],
  'usage-bar': [
    c(
      'Quota',
      'Segments nommés et légende.',
      'Segments distingués par la couleur seule.',
    ),
    c(
      'Total',
      'max dans la même unité que les segments.',
      'Mélanger des Mo et des Go.',
    ),
  ],
  chart: [
    c(
      'Couleurs',
      'Celles du thème : chart-*.',
      'Des couleurs écrites en dur qui ignorent le mode sombre.',
    ),
    c(
      'Accessibilité',
      'Donner un résumé en texte.',
      'Le graphique est la seule source d’information.',
    ),
  ],
  marker: [
    c(
      'Fil de discussion',
      '« Aujourd’hui » en variante separator.',
      'Un Marker pour afficher un statut : utiliser Badge.',
    ),
    c('Longueur', 'Quelques mots.', 'Un paragraphe dans le repère.'),
  ],
  sonner: [
    c(
      'Confirmation',
      'Un toast court, avec « Annuler » si c’est réversible.',
      'Une erreur de formulaire dans un toast qui disparaît.',
    ),
    c('Placement', 'Un seul Toaster à la racine.', 'Un Toaster par page.'),
  ],
  // --- Superpositions et menus ---
  dialog: [
    c(
      'Tâche courte',
      'Un formulaire de deux champs.',
      'Une page entière de formulaire dans une fenêtre.',
    ),
    c(
      'Titre',
      'Toujours un DialogTitle, même masqué.',
      'Une fenêtre sans titre : le lecteur d’écran ne la nomme pas.',
    ),
    c(
      'Suppression',
      'Passer à Alert Dialog.',
      'Une Dialog qui se ferme au clic extérieur pour une action irréversible.',
    ),
  ],
  'alert-dialog': [
    c(
      'Action destructive',
      'Nommer l’action et ce qui est perdu.',
      'Des boutons « Oui » et « Non ».',
    ),
    c(
      'Focus',
      'Sur l’action la moins risquée.',
      'Sur « Supprimer » par défaut.',
    ),
  ],
  sheet: [
    c(
      'Contenu long',
      'Pied fixe, corps qui défile.',
      'Un pied qui défile avec le texte.',
    ),
    c(
      'Côté',
      'Droite pour le détail, gauche pour la navigation.',
      'Un panneau du bas sur bureau.',
    ),
  ],
  drawer: [
    c('Mobile', 'Actions à portée du pouce.', 'Un drawer sur grand écran.'),
    c(
      'Fermeture',
      'Un bouton en plus du geste.',
      'Seulement le glissement pour fermer.',
    ),
  ],
  popover: [
    c(
      'Réglage rapide',
      'Un panneau court ancré au bouton.',
      'Un formulaire de dix champs.',
    ),
    c(
      'Fermeture',
      'Échap et clic extérieur.',
      'Un panneau qu’on ne peut pas fermer au clavier.',
    ),
  ],
  'hover-card': [
    c(
      'Aperçu',
      'Prévisualiser un profil depuis un lien.',
      'Mettre l’action principale dans la carte.',
    ),
    c(
      'Tactile',
      'Prévoir un autre moyen d’accès.',
      'Compter sur le survol sur téléphone.',
    ),
  ],
  tooltip: [
    c(
      'Bouton icône',
      'Nommer l’action : « Supprimer ».',
      'Répéter le libellé déjà visible.',
    ),
    c('Contenu', 'Quelques mots.', 'Un lien ou un bouton dans l’info-bulle.'),
  ],
  'dropdown-menu': [
    c(
      'Actions',
      'Verbes ; destructive en dernier, séparée.',
      'Une action destructive au milieu, sans séparation.',
    ),
    c(
      'Taille',
      'Moins de sept entrées par groupe.',
      'Vingt entrées dans un seul menu.',
    ),
  ],
  'context-menu': [
    c(
      'Raccourcis avancés',
      'Doubler chaque action d’un bouton visible.',
      'Cacher une action uniquement dans le clic droit.',
    ),
    c(
      'Contenu',
      'Les mêmes entrées que le menu visible.',
      'Des entrées différentes sans lien logique.',
    ),
  ],
  command: [
    c(
      'Recherche globale',
      'Groupes et raccourcis visibles.',
      'Une liste plate et non triée.',
    ),
    c('Ouverture', '⌘K et Échap.', 'Aucun raccourci pour ouvrir.'),
  ],
  // --- Interfaces conversationnelles ---
  'ai-chat-composer': [
    c(
      'Envoi',
      'Entrée envoie, Maj+Entrée saute une ligne, et le dire.',
      'Envoyer à Entrée sans l’indiquer.',
    ),
    c(
      'Échec',
      'Conserver le texte saisi.',
      'Vider le champ avant la confirmation d’envoi.',
    ),
  ],
  attachment: [
    c(
      'Fichier en envoi',
      'Afficher l’état et un bouton de retrait.',
      'Une pièce jointe sans état.',
    ),
    c('Nom long', 'Tronquer au milieu.', 'Laisser déborder.'),
  ],
  bubble: [
    c(
      'Émetteur',
      'Nommer l’auteur en texte.',
      'Se fier à l’alignement et à la couleur.',
    ),
    c(
      'Variante',
      'Une variante par rôle.',
      'Une variante différente à chaque message.',
    ),
  ],
  message: [
    c(
      'Messages d’un auteur',
      'Un MessageGroup, un seul avatar.',
      'Un avatar répété à chaque ligne.',
    ),
    c(
      'Actions',
      'Au pied du message, focalisables.',
      'Visibles seulement au survol.',
    ),
  ],
  'message-scroller': [
    c(
      'Lecture plus haut',
      'Ne pas ramener en bas.',
      'Forcer le défilement à chaque message.',
    ),
    c(
      'Nouveau message',
      'Bouton « aller en bas ».',
      'Aucun indice qu’un message est arrivé.',
    ),
  ],
  trace: [
    c(
      'Détail technique',
      'Replié par défaut.',
      'Tout déplié : le résultat est noyé.',
    ),
    c(
      'Erreur',
      'Déplier l’étape en erreur.',
      'Cacher l’erreur dans un détail replié.',
    ),
  ],
  diff: [
    c(
      'Relecture',
      'Garder quelques lignes de contexte.',
      'Montrer seulement les lignes modifiées.',
    ),
    c(
      'Signalement',
      'Symbole + / − en plus de la couleur.',
      'La couleur seule.',
    ),
  ],
  // --- Blocs ---
  'chat-sidebar-01': [
    c(
      'Données',
      'Brancher votre liste de conversations.',
      'Garder les conversations d’exemple en production.',
    ),
    c(
      'Navigation',
      'Marquer la conversation courante.',
      'Laisser toutes les lignes identiques.',
    ),
  ],
  'chat-thread-01': [
    c(
      'Messages',
      'Brancher votre source de messages.',
      'Laisser les messages fictifs.',
    ),
    c(
      'Arrivée de messages',
      'Les annoncer poliment.',
      'Les ajouter sans signal pour les lecteurs d’écran.',
    ),
  ],
  'chat-welcome-01': [
    c(
      'Suggestions',
      'Trois ou quatre propositions concrètes.',
      'Dix suggestions génériques.',
    ),
    c(
      'Conversation en cours',
      'Masquer l’accueil.',
      'L’afficher au-dessus des messages.',
    ),
  ],
  'prompt-input-01': [
    c(
      'Réglages',
      'Les garder discrets et libellés.',
      'Surcharger le champ d’options.',
    ),
    c('Envoi', 'Raccourci annoncé.', 'Un raccourci caché.'),
  ],
  'model-picker-01': [
    c(
      'Choix',
      'Une phrase par modèle : usage, vitesse, coût.',
      'Seulement des noms techniques.',
    ),
    c(
      'Liste longue',
      'Ajouter une recherche.',
      'Afficher quinze modèles sans recherche.',
    ),
  ],
  'effort-slider-01': [
    c('Niveaux', 'Nommer les niveaux.', 'Afficher un nombre sans sens.'),
    c(
      'Effet',
      'Expliquer le compromis vitesse et qualité.',
      'Ne rien dire de la conséquence.',
    ),
  ],
  'sleep-widget-01': [
    c(
      'Données',
      'Brancher vos propres données.',
      'Présenter les valeurs fictives comme réelles.',
    ),
    c('Graphique', 'Donner les valeurs en texte.', 'Le graphique seul.'),
  ],
};
