// Contenu éditorial des pages composant : à quoi sert le composant, quand l'utiliser ou l'éviter,
// et ce qu'il garantit en accessibilité. Les variantes, dépendances et tokens sont lus dans le code.
export interface DocContent {
  summary: string;
  use: string[];
  avoid: string[];
  a11y: string;
}

/** Détails facultatifs : rôle des sous-composants, propriétés clés et bonnes pratiques. */
export interface DocDetails {
  parts?: Record<string, string>;
  /** [nom, type, description] : seulement les propriétés qui comptent, pas toute l'API. */
  props?: [string, string, string][];
  tips?: string[];
}

export const docContent: Record<string, DocContent> = {
  button: {
    summary:
      'Déclenche une action. Six variantes visuelles et des tailles de 24 à 40 px, avec icône à gauche ou à droite.',
    use: [
      'Valider, envoyer, créer ou supprimer',
      'Une action principale par zone (variante Principal)',
    ],
    avoid: [
      'Naviguer vers une autre page : utiliser la variante Lien',
      'Plusieurs boutons Principal côte à côte',
    ],
    a11y: 'Élément <button> natif : focus visible, Entrée et Espace. Un bouton icône exige un aria-label.',
  },
  'button-group': {
    summary:
      'Regroupe des boutons liés en une seule barre aux bords raccordés.',
    use: [
      'Actions voisines (exporter en JSON, CSS ou Figma)',
      'Choix d’un format ou d’une vue',
    ],
    avoid: [
      'Des actions sans rapport entre elles',
      'Plus de cinq boutons : préférer un menu',
    ],
    a11y: 'Chaque bouton reste focalisable. Donner un rôle group et un libellé si le groupe a un sens commun.',
  },
  toggle: {
    summary: 'Bouton à deux états, activé ou non, comme Gras ou Italique.',
    use: ['Activer une option de mise en forme', 'Filtrer en un clic'],
    avoid: [
      'Une action ponctuelle : utiliser un Button',
      'Un réglage enregistré : utiliser un Switch',
    ],
    a11y: 'Expose aria-pressed. Un toggle icône exige un aria-label.',
  },
  'toggle-group': {
    summary: 'Ensemble de toggles, en choix unique ou multiple.',
    use: [
      'Alignement du texte (choix unique)',
      'Styles cumulables (choix multiple)',
    ],
    avoid: [
      'Plus de cinq options : préférer un Select',
      'Naviguer entre des vues : utiliser Tabs',
    ],
    a11y: 'Navigation aux flèches dans le groupe, état exposé sur chaque élément.',
  },
  badge: {
    summary: 'Étiquette courte pour un statut, une catégorie ou un compteur.',
    use: ['Statut (nouveau, bêta, erreur)', 'Compteur à côté d’un libellé'],
    avoid: ['Du texte long', 'Une action cliquable : utiliser un Button'],
    a11y: 'Ne pas porter l’information par la couleur seule : le texte doit dire le statut.',
  },
  kbd: {
    summary: 'Affiche une touche ou un raccourci clavier.',
    use: ['Indiquer un raccourci dans un menu ou une info-bulle'],
    avoid: ['Du texte courant ou une action'],
    a11y: 'Élément <kbd> sémantique : lu comme une saisie clavier par les lecteurs d’écran.',
  },
  separator: {
    summary: 'Ligne fine qui sépare deux blocs, horizontale ou verticale.',
    use: ['Séparer des groupes d’éléments dans un menu ou une carte'],
    avoid: ['Créer de l’espace : utiliser une marge'],
    a11y: 'Décoratif par défaut, masqué aux lecteurs d’écran ; vertical, il porte aria-orientation.',
  },
  avatar: {
    summary:
      'Image ronde d’une personne ou d’une entité, avec repli sur des initiales.',
    use: ['Identifier un auteur ou un membre', 'Piles d’avatars avec compteur'],
    avoid: ['Une illustration ou un logo carré'],
    a11y: 'Fournir un texte alternatif ou des initiales lisibles ; l’avatar seul ne porte pas le nom.',
  },
  'simple-icon': {
    summary: 'Logo de marque issu de Simple Icons, coloré par le thème.',
    use: ['Afficher GitHub, Figma, React…', 'Listes de services connectés'],
    avoid: ['Des icônes d’interface : utiliser lucide-react'],
    a11y: 'Décoratif par défaut ; ajouter un titre si le logo est le seul libellé.',
  },
  'file-icon': {
    summary:
      'Icône qui représente un type de fichier à partir de son extension.',
    use: ['Listes de fichiers et pièces jointes'],
    avoid: ['Afficher un aperçu du contenu'],
    a11y: 'Décorative : le nom du fichier doit rester affiché à côté.',
  },
  spinner: {
    summary: 'Indicateur de chargement animé, de durée inconnue.',
    use: [
      'Attente courte après une action',
      'À l’intérieur d’un bouton en cours d’envoi',
    ],
    avoid: [
      'Une progression mesurable : utiliser Progress',
      'Un chargement de page : préférer un Skeleton',
    ],
    a11y: 'Rôle status avec libellé « Chargement ». L’animation est neutralisée si le mouvement réduit est demandé.',
  },
  skeleton: {
    summary:
      'Forme grise qui réserve la place d’un contenu en cours de chargement.',
    use: ['Cartes, listes et tableaux avant l’arrivée des données'],
    avoid: ['Une attente de quelques millisecondes'],
    a11y: 'Masqué aux lecteurs d’écran ; annoncer le chargement sur le conteneur (aria-busy).',
  },
  'aspect-ratio': {
    summary: 'Conserve un rapport largeur / hauteur fixe pour son contenu.',
    use: ['Images et vidéos sans décalage de mise en page'],
    avoid: ['Du texte de hauteur variable'],
    a11y: 'Neutre : l’image contenue porte son propre texte alternatif.',
  },
  direction: {
    summary:
      'Fournit le sens d’écriture (gauche-droite ou droite-gauche) aux composants enfants.',
    use: ['Interfaces en arabe ou en hébreu', 'Tester l’inversion'],
    avoid: ['Changer le sens sans l’attribut dir sur le conteneur'],
    a11y: 'Doit aller de pair avec l’attribut dir du document ou du conteneur.',
  },
  input: {
    summary: 'Champ de saisie sur une ligne.',
    use: ['Nom, e-mail, recherche'],
    avoid: [
      'Du texte long : utiliser Textarea',
      'Un choix fermé : utiliser Select',
    ],
    a11y: 'Toujours associé à un Label. aria-invalid affiche l’état d’erreur.',
  },
  'input-group': {
    summary:
      'Champ de saisie avec des éléments attachés : icône, texte, bouton.',
    use: ['Recherche avec icône', 'Montant avec devise'],
    avoid: ['Empiler plusieurs actions dans le champ'],
    a11y: 'Les ajouts décoratifs restent masqués ; le champ garde son Label.',
  },
  'input-otp': {
    summary: 'Saisie d’un code à usage unique, un chiffre par case.',
    use: ['Codes de vérification reçus par SMS ou e-mail'],
    avoid: ['Un mot de passe ou une saisie libre'],
    a11y: 'Le collage du code entier est pris en charge ; chaque case est annoncée avec sa position.',
  },
  textarea: {
    summary: 'Champ de saisie sur plusieurs lignes.',
    use: ['Commentaires, descriptions, messages'],
    avoid: ['Une valeur courte : utiliser Input'],
    a11y: 'Associé à un Label ; indiquer la limite de caractères avec un texte d’aide.',
  },
  label: {
    summary: 'Libellé d’un champ de formulaire, relié à lui.',
    use: ['Tout champ de saisie, case ou interrupteur'],
    avoid: ['Remplacer le libellé par un placeholder'],
    a11y: 'Un clic sur le libellé active le champ. Obligatoire pour les lecteurs d’écran.',
  },
  field: {
    summary:
      'Assemble libellé, champ, aide et message d’erreur en un bloc cohérent.',
    use: ['Chaque champ d’un formulaire', 'Messages de validation'],
    avoid: ['Un champ isolé sans libellé'],
    a11y: 'Relie l’aide et l’erreur au champ (aria-describedby) ; l’erreur est annoncée.',
  },
  checkbox: {
    summary: 'Case à cocher, avec état indéterminé possible.',
    use: ['Choix multiples', 'Accepter des conditions'],
    avoid: [
      'Une seule option exclusive : utiliser Radio Group',
      'Un effet immédiat : utiliser Switch',
    ],
    a11y: 'Cliquable via son libellé, activée à l’Espace ; l’état indéterminé est exposé.',
  },
  'radio-group': {
    summary: 'Liste de choix dont un seul peut être sélectionné.',
    use: ['Moins de sept options, toutes visibles'],
    avoid: [
      'Beaucoup d’options : utiliser Select',
      'Choix multiples : utiliser Checkbox',
    ],
    a11y: 'Navigation aux flèches, un seul arrêt de tabulation pour le groupe.',
  },
  switch: {
    summary: 'Interrupteur qui active ou désactive un réglage immédiatement.',
    use: ['Notifications, mode sombre'],
    avoid: ['Un choix validé plus tard par un bouton : utiliser Checkbox'],
    a11y: 'Rôle switch, activé à l’Espace. Libellé obligatoire.',
  },
  slider: {
    summary: 'Curseur pour choisir une valeur ou une plage dans un intervalle.',
    use: ['Volume, prix, niveau d’effort'],
    avoid: ['Une valeur exacte à saisir : utiliser Input'],
    a11y: 'Flèches, Début et Fin déplacent la valeur ; la valeur courante est annoncée.',
  },
  select: {
    summary: 'Liste déroulante pour choisir une option parmi plusieurs.',
    use: ['Plus de cinq options', 'Pays, langue, fuseau'],
    avoid: [
      'Peu d’options : Radio Group',
      'Une liste longue à filtrer : Combobox',
    ],
    a11y: 'Ouvert au clavier, option cherchée par saisie, groupes annoncés.',
  },
  'native-select': {
    summary:
      'Liste déroulante native du navigateur, stylée aux couleurs du système.',
    use: ['Mobile, où le sélecteur natif est le plus fiable'],
    avoid: ['Du contenu riche dans les options : utiliser Select'],
    a11y: 'Comportement natif complet, y compris au lecteur d’écran.',
  },
  combobox: {
    summary: 'Champ de recherche associé à une liste d’options filtrée.',
    use: ['Listes longues (pays, utilisateurs)', 'Saisie avec suggestions'],
    avoid: ['Moins de sept options : Select ou Radio Group'],
    a11y: 'Rôle combobox, résultats annoncés, navigation aux flèches, Échap ferme.',
  },
  calendar: {
    summary: 'Grille de mois pour choisir une date ou une plage.',
    use: ['Réservations', 'Filtres de période'],
    avoid: ['Une date connue à saisir : utiliser Input'],
    a11y: 'Flèches pour les jours, PageUp/PageDown pour les mois ; date annoncée en toutes lettres.',
  },
  breadcrumb: {
    summary:
      'Fil d’Ariane : le chemin de la page courante dans l’arborescence.',
    use: ['Hiérarchies de plus de deux niveaux'],
    avoid: ['Un parcours linéaire en étapes'],
    a11y: 'Navigation nommée, page courante marquée aria-current.',
  },
  pagination: {
    summary: 'Navigation entre les pages d’une liste.',
    use: ['Tableaux et résultats volumineux'],
    avoid: ['Un défilement continu', 'Moins d’une page'],
    a11y: 'Navigation nommée ; page courante marquée ; boutons précédent et suivant libellés.',
  },
  tabs: {
    summary: 'Onglets qui basculent entre des vues d’un même contexte.',
    use: ['Plusieurs vues d’un même objet', 'Contenu à parts égales'],
    avoid: [
      'Un parcours à étapes ordonnées',
      'Navigation entre pages : utiliser des liens',
    ],
    a11y: 'Rôle tablist ; flèches pour changer d’onglet ; panneau relié à son onglet.',
  },
  'navigation-menu': {
    summary:
      'Barre de navigation avec panneaux déroulants pour les grands sites.',
    use: ['En-tête d’un site avec plusieurs rubriques'],
    avoid: ['Un menu d’actions : utiliser Dropdown Menu'],
    a11y: 'Navigation au clavier entre rubriques et panneaux ; Échap referme.',
  },
  menubar: {
    summary: 'Barre de menus façon application bureau (Fichier, Édition…).',
    use: ['Outils riches avec beaucoup de commandes'],
    avoid: ['Un site classique : utiliser Navigation Menu'],
    a11y: 'Rôle menubar ; flèches entre menus ; raccourcis annoncés.',
  },
  sidebar: {
    summary: 'Panneau latéral de navigation, repliable, avec sections.',
    use: ['Applications avec de nombreuses sections'],
    avoid: ['Moins de cinq destinations : barre du haut'],
    a11y: 'Repère de navigation ; sur mobile, s’ouvre en panneau modal avec piège de focus.',
  },
  accordion: {
    summary: 'Liste de sections qui se déplient une à une.',
    use: ['FAQ', 'Contenu long à scanner'],
    avoid: ['Un contenu critique à garder visible'],
    a11y: 'En-têtes boutons avec aria-expanded ; flèches pour passer d’un en-tête à l’autre.',
  },
  collapsible: {
    summary: 'Zone unique qui se replie et se déplie.',
    use: ['Options avancées', 'Détails à la demande'],
    avoid: ['Plusieurs sections liées : utiliser Accordion'],
    a11y: 'Déclencheur avec aria-expanded relié au contenu.',
  },
  'scroll-area': {
    summary: 'Zone défilante avec barres de défilement discrètes et homogènes.',
    use: ['Listes bornées en hauteur', 'Panneaux latéraux'],
    avoid: ['Toute la page : laisser le défilement natif'],
    a11y: 'Défilement au clavier et à la molette préservé ; la zone doit être focalisable.',
  },
  resizable: {
    summary:
      'Panneaux dont l’utilisateur ajuste la taille en tirant une poignée.',
    use: ['Éditeur avec liste et aperçu', 'Panneaux d’outils'],
    avoid: ['Une mise en page qui doit rester fixe'],
    a11y: 'Poignée focalisable déplacée aux flèches ; valeur annoncée.',
  },
  carousel: {
    summary: 'Diaporama d’éléments défilants, au geste ou aux boutons.',
    use: ['Galeries et suggestions'],
    avoid: [
      'Du contenu essentiel : le caché derrière un geste est souvent raté',
    ],
    a11y: 'Boutons précédent et suivant ; éléments annoncés avec leur rang.',
  },
  card: {
    summary:
      'Conteneur avec en-tête, contenu et pied pour regrouper une information.',
    use: ['Résumés, réglages, éléments d’une grille'],
    avoid: ['Emboîter des cartes dans des cartes'],
    a11y: 'Si toute la carte est cliquable, un seul lien doit porter le nom.',
  },
  item: {
    summary: 'Ligne de liste avec média, titre, description et actions.',
    use: ['Listes de fichiers, de personnes, de paramètres'],
    avoid: ['Des données tabulaires : utiliser Table'],
    a11y: 'Titre et description lus ensemble ; actions focalisables individuellement.',
  },
  table: {
    summary: 'Tableau de données avec en-têtes, lignes et pied.',
    use: ['Comparer des valeurs sur plusieurs colonnes'],
    avoid: ['Mettre en page du contenu', 'Peu de données : utiliser Item'],
    a11y: 'Balises <table> natives : en-têtes reliés aux cellules, légende recommandée.',
  },
  empty: {
    summary: 'État vide : explique l’absence de contenu et propose une action.',
    use: ['Liste sans résultat', 'Première utilisation'],
    avoid: ['Un chargement en cours : utiliser Skeleton'],
    a11y: 'Titre et description lisibles ; l’action proposée est un vrai bouton.',
  },
  alert: {
    summary: 'Message inline qui informe, avertit ou signale une erreur.',
    use: ['Résultat d’une action', 'Information persistante dans la page'],
    avoid: [
      'Une confirmation fugace : utiliser Sonner',
      'Un choix bloquant : utiliser Alert Dialog',
    ],
    a11y: 'Rôle alert pour les erreurs, annoncé immédiatement ; ne pas compter sur la couleur seule.',
  },
  progress: {
    summary: 'Barre de progression d’une tâche mesurable.',
    use: ['Envoi de fichier', 'Étapes d’un parcours'],
    avoid: ['Durée inconnue : utiliser Spinner'],
    a11y: 'Rôle progressbar avec valeur courante, minimum et maximum.',
  },
  'usage-bar': {
    summary:
      'Barre segmentée qui répartit la consommation d’un quota entre plusieurs catégories, avec légende.',
    use: [
      'Stockage, crédits, limites d’un forfait',
      'Montrer ce qui consomme le quota',
    ],
    avoid: ['Une progression de tâche : utiliser Progress'],
    a11y: 'Donner la valeur en texte à côté, la barre seule ne suffit pas.',
  },
  chart: {
    summary: 'Graphiques thémés par les tokens : courbes, barres, aires.',
    use: ['Tendances et comparaisons'],
    avoid: ['Deux ou trois valeurs : un texte suffit'],
    a11y: 'Prévoir un résumé textuel ou un tableau équivalent ; les séries ne se distinguent pas par la couleur seule.',
  },
  marker: {
    summary:
      'Repère intercalé dans un fil : événement système, séparateur de date ou de section, avec icône facultative.',
    use: [
      'Marquer « Aujourd’hui » ou « Conversation archivée » dans une discussion',
      'Séparer des sections d’un fil',
    ],
    avoid: ['Un statut sur un élément : utiliser Badge', 'Un titre de page'],
    a11y: 'Le texte porte le sens ; l’icône est décorative. Pour une date, préférer un titre de niveau approprié.',
  },
  sonner: {
    summary: 'Notifications temporaires (toasts) empilées en bord d’écran.',
    use: ['Confirmer une action réussie', 'Annuler une action récente'],
    avoid: [
      'Une erreur à corriger dans un formulaire : utiliser Alert',
      'Une information critique',
    ],
    a11y: 'Annoncé poliment (aria-live). Laisser assez de temps de lecture ; ne pas y mettre d’action unique.',
  },
  dialog: {
    summary: 'Fenêtre modale qui interrompt le parcours pour une tâche ciblée.',
    use: ['Formulaire court', 'Confirmation avec contexte'],
    avoid: [
      'Un message simple : utiliser Alert',
      'Du contenu long : utiliser Sheet ou une page',
    ],
    a11y: 'Piège le focus, Échap ferme, titre et description reliés. Rend le reste inerte.',
  },
  'alert-dialog': {
    summary:
      'Modale de confirmation pour une action destructive ou irréversible.',
    use: ['Supprimer, quitter sans enregistrer'],
    avoid: [
      'Une information : utiliser Alert',
      'Un formulaire : utiliser Dialog',
    ],
    a11y: 'Rôle alertdialog ; le focus arrive sur l’action la moins risquée ; pas de fermeture au clic extérieur.',
  },
  sheet: {
    summary: 'Panneau modal qui glisse depuis un bord de l’écran.',
    use: ['Filtres, réglages, formulaires longs'],
    avoid: ['Un message court : utiliser Dialog'],
    a11y: 'Comme Dialog : focus piégé, Échap ferme, titre obligatoire.',
  },
  drawer: {
    summary:
      'Panneau depuis le bas, fermable par un geste, pensé pour le mobile.',
    use: ['Actions et sélections sur téléphone'],
    avoid: ['Le bureau, où un Dialog est plus naturel'],
    a11y: 'Focus piégé ; un bouton de fermeture reste disponible pour qui ne glisse pas.',
  },
  popover: {
    summary:
      'Panneau flottant ancré à un élément, qui accueille du contenu interactif.',
    use: ['Réglages rapides', 'Sélecteurs dans un formulaire'],
    avoid: [
      'Du texte seul : utiliser Tooltip',
      'Une tâche longue : utiliser Dialog',
    ],
    a11y: 'Déclencheur avec aria-expanded ; Échap ferme et rend le focus.',
  },
  'hover-card': {
    summary: 'Carte d’aperçu qui apparaît au survol d’un lien.',
    use: ['Prévisualiser un profil ou une page'],
    avoid: ['Du contenu indispensable : inaccessible au tactile'],
    a11y: 'S’ouvre aussi au focus clavier ; ne pas y cacher d’action unique.',
  },
  tooltip: {
    summary: 'Info-bulle courte au survol ou au focus.',
    use: ['Nommer un bouton icône', 'Préciser un raccourci'],
    avoid: ['Du contenu long ou interactif : utiliser Popover'],
    a11y: 'S’ouvre au focus, Échap la ferme ; ne remplace pas un libellé visible.',
  },
  'dropdown-menu': {
    summary: 'Menu d’actions qui s’ouvre depuis un bouton.',
    use: ['Actions secondaires d’une ligne', 'Menu utilisateur'],
    avoid: ['Choisir une valeur de formulaire : utiliser Select'],
    a11y: 'Rôle menu ; flèches, Début, Fin, recherche par lettre ; Échap ferme.',
  },
  'context-menu': {
    summary: 'Menu ouvert par clic droit ou appui long.',
    use: ['Raccourcis pour les utilisateurs avancés'],
    avoid: ['Une action qui n’existe qu’ici : la doubler d’un bouton visible'],
    a11y: 'Ouvert aussi par la touche menu ; même navigation qu’un Dropdown Menu.',
  },
  command: {
    summary: 'Palette de commandes avec recherche et raccourcis.',
    use: ['Recherche globale', 'Actions rapides au clavier'],
    avoid: ['Une liste courte : utiliser Select'],
    a11y: 'Champ combobox, résultats navigables aux flèches, Entrée valide.',
  },
  'ai-chat-composer': {
    summary:
      'Zone de saisie de conversation avec envoi, pièces jointes et sélection de modèle.',
    use: ['Interfaces d’assistant'],
    avoid: ['Un champ de recherche simple'],
    a11y: 'Libellé du champ, envoi par Entrée et par bouton ; état de génération annoncé.',
  },
  attachment: {
    summary: 'Pièce jointe affichée avec son nom, son type et un état.',
    use: ['Fichiers ajoutés à un message'],
    avoid: ['Un aperçu plein écran'],
    a11y: 'Nom et état lisibles ; bouton de retrait libellé.',
  },
  bubble: {
    summary: 'Bulle de message avec variantes selon l’émetteur.',
    use: ['Fils de conversation'],
    avoid: ['Un bloc de contenu hors discussion : utiliser Card'],
    a11y: 'Indiquer l’émetteur en texte, pas seulement par l’alignement ou la couleur.',
  },
  message: {
    summary: 'Message complet : avatar, contenu, métadonnées et actions.',
    use: ['Historique d’une conversation'],
    avoid: ['Des notifications : utiliser Sonner'],
    a11y: 'Structure lisible dans l’ordre chronologique ; actions focalisables.',
  },
  'message-scroller': {
    summary:
      'Liste de messages qui reste collée en bas pendant l’arrivée de nouveaux.',
    use: ['Fils de discussion en direct'],
    avoid: ['Des listes statiques'],
    a11y: 'Les nouveaux messages sont annoncés poliment ; le défilement manuel n’est jamais forcé.',
  },
  trace: {
    summary:
      'Affiche les étapes de raisonnement ou d’exécution d’un assistant.',
    use: ['Expliquer ce que l’IA a fait'],
    avoid: ['Du contenu à lire en priorité : le replier par défaut'],
    a11y: 'Sections repliables avec aria-expanded ; état de chaque étape en texte.',
  },
  diff: {
    summary: 'Compare deux versions d’un texte ou d’un code, ligne par ligne.',
    use: ['Relire les modifications proposées'],
    avoid: ['Afficher un seul contenu'],
    a11y: 'Ajouts et suppressions signalés par un symbole et pas seulement par la couleur.',
  },
  'chat-sidebar-01': {
    summary:
      'Bloc : liste des conversations avec recherche et nouvelle discussion.',
    use: ['Colonne de gauche d’un assistant'],
    avoid: ['Une navigation de site'],
    a11y: 'Liste navigable, conversation courante marquée.',
  },
  'chat-thread-01': {
    summary: 'Bloc : fil de messages avec saisie et défilement automatique.',
    use: ['Zone principale d’un assistant'],
    avoid: ['Un fil de commentaires sans temps réel'],
    a11y: 'Nouveaux messages annoncés ; saisie libellée.',
  },
  'chat-welcome-01': {
    summary:
      'Bloc : écran d’accueil d’un assistant avec suggestions de départ.',
    use: ['Conversation vide'],
    avoid: ['Une conversation en cours'],
    a11y: 'Suggestions en boutons ; titre de niveau clair.',
  },
  'prompt-input-01': {
    summary: 'Bloc : champ de demande avancé avec options.',
    use: ['Saisie d’un prompt avec réglages'],
    avoid: ['Un formulaire de contact'],
    a11y: 'Libellé du champ, raccourci d’envoi annoncé.',
  },
  'model-picker-01': {
    summary: 'Bloc : choix d’un modèle avec description de chaque option.',
    use: ['Sélection d’un modèle ou d’une offre'],
    avoid: ['Une liste de plus de dix modèles sans recherche'],
    a11y: 'Combobox accessible ; description lue avec l’option.',
  },
  'effort-slider-01': {
    summary: 'Bloc : curseur pour régler le niveau d’effort ou de réflexion.',
    use: ['Compromis vitesse et qualité'],
    avoid: ['Un réglage binaire : utiliser Switch'],
    a11y: 'Curseur nommé ; niveau annoncé en toutes lettres.',
  },
  'sleep-widget-01': {
    summary:
      'Bloc : widget de suivi du sommeil, exemple de composition de plusieurs composants.',
    use: ['Modèle pour des cartes de suivi'],
    avoid: ['Données de santé réelles : le bloc est une démonstration'],
    a11y: 'Valeurs données en texte à côté du graphique.',
  },
};
