export type ChronoEntry = { year: string; title: string; text: string };

export const CHRONOLOGIE: ChronoEntry[] = [
  {
    year: "1160",
    title: "LES FONDATIONS TEMPLIERES",
    text: "Les Chevaliers du Temple s'installent a Vaour. En explorant la Gresigne, ils decouvrent des zones de silence et des anomalies magnetiques singulieres, notamment autour du Dolmen de Peyrelevade. Ils consignent secretement ces phenomenes geologiques et magnetiques.",
  },
  {
    year: "1307",
    title: "LA CLANDESTINITE",
    text: "Lors de l'arrestation des Templiers par Philippe le Bel, une poignee de dissidents du site de Vaour refuse de se rendre. Replies au coeur de la Gresigne sous la canopee dense, ils jurent de proteger les secrets de la foret de generation en generation.",
  },
  {
    year: "1412",
    title: "LE BAPTEME DE LA PIERRE D'ANCRE",
    text: "Apres une decennie d'observations, les Templiers de Vaour constatent que la roche du Dolmen de Peyrelevade semble immunisee contre les foudres les plus violentes. Ils y gravent leur premiere marque et adoptent le Dolmen comme embleme originel : l'Ancre, pacte scelle dans la pierre, silence absolu et bouclier des secrets magnetiques de la Terre.",
  },
  {
    year: "1666",
    title: "LE PACTE DES MATS ROYAUX",
    text: "Sous Louis XIV, Colbert envoie Louis de Froidour restructurer la Gresigne et selectionner les chenes sessiles pour la Marine Royale. Pour proteger ses secrets des inspecteurs du Roi, l'Ordre s'infiltre parmi les bucherons et erige clandestinement des bornes de pierre le long du Mur de la Gresigne. Le Chene devient le symbole absolu de l'Ordre.",
  },
  {
    year: "1843",
    title: "LE MANIFESTE DE GUILLAUME DE GRESIGNE",
    text: "Face aux mines de charbon de Carmaux et aux machines a vapeur, l'erudit botaniste tarnais Guillaume de Gresigne cree officiellement la societe secrete sous le nom d'Ordre des Pionniers : preserver la foret, ses ecosystemes et ses tresors archeologiques de l'industrialisation.",
  },
  {
    year: "1944",
    title: "L'OMBRE DE LA RESISTANCE",
    text: "Les Pionniers utilisent leur connaissance chirurgicale de la topographie pour guider, ravitailler et cacher les Maquisards de la Gresigne, sans jamais laisser une trace exploitable par l'occupant.",
  },
  {
    year: "AUJOURD'HUI",
    title: "LA RESISTANCE NUMERIQUE",
    text: "Face a l'Aveuglement Moderne, l'Ordre bascule dans la clandestinite technologique totale (Low-Tech durcie) pour preserver les facultes cognitives, aiguiser l'instinct biologique et rester invisible.",
  },
];

export type LexiconEntry = { term: string; def: string };

export const LEXIQUE: LexiconEntry[] = [
  {
    term: "L'AVEUGLEMENT MODERNE",
    def: "La dependance toxique et generalisee de la societe civile aux reseaux cellulaires (4G/5G), a la geolocalisation permanente et aux flux de donnees externes.",
  },
  {
    term: "LE TERMINAL CIVIL",
    def: "Le smartphone personnel du candidat. Outil de tracage et de dependance qui atrophie les sens naturels.",
  },
  {
    term: "LE WHITEOUT",
    def: "Le protocole de cure numerique : confiscation et mise sous scelles des Terminaux Civils des l'arrivee au QG a 08h00.",
  },
  {
    term: "LE NODE",
    def: "Le terminal tactique durci hors-ligne fourni par l'Ordre. Mode Kiosque strict, carte vectorielle locale (MBTiles) et moteur d'enigmes.",
  },
  {
    term: "LE MURMURE",
    def: "Le reseau radio proprietaire, autonome et chiffre (LoRa 868 MHz / AES-128) reliant les equipes au PC operationnel de Vaour.",
  },
  {
    term: "LE MAQUIS TECHNOLOGIQUE",
    def: "La doctrine operationnelle de l'Ordre : usage exclusif de la Low-Tech durcie, outils souverains, incassables, hors-reseau et indetectables.",
  },
  {
    term: "LE MERIDIEN DE GRESIGNE",
    def: "La frontiere invisible materialisant l'entree sur le territoire de l'Ordre et le basculement en autonomie totale.",
  },
  {
    term: "LA TEMPETE",
    def: "Le mecanisme de retraction dynamique de la zone autorisee, simulant le resserrement de la menace et forcant le regroupement des equipes.",
  },
  {
    term: "ROOT",
    def: "La console de supervision centrale (Ecorce-Mere) operee par les Auditeurs depuis le QG de Vaour pour suivre les positions chiffrees et envoyer les alertes.",
  },
  {
    term: "L'EFFROI SAUVAGE",
    def: "Tout comportement bruyant ou desordonne perturbant la faune locale ou degradant la foret, en violation de la charte Zero Trace.",
  },
  {
    term: "L'AUDIT FINAL",
    def: "La phase d'evaluation au QG (J+1) ou les preuves de terrain (boite noire, photos, releves LoRa) sont analysees par le Jury pour attribuer les grades physiques.",
  },
];

export const DOCTRINE = {
  classification: "CONFIDENTIEL / CONSEIL DES ERUDITS",
  qg: "QUARTIER GENERAL DE VAOUR (TARN)",
  version: "BIBLE DE CONCEPTION V5 - THE WILD QUEST",
};

export const BRIEFING = {
  ou: "Foret Domaniale de la Gresigne (Tarn). PC, preparation et jury au QG de Vaour.",
  quoi: "Epreuve d'aventure, d'orientation, de secourisme et de survie en immersion totale sur 24 h (09h00 a 09h00 J+1).",
  qui: "Equipes de 2 a 3 adultes.",
};

export type PlanEntry = { time: string; title: string; text: string };

export const PLANNING_JOUEUR: PlanEntry[] = [
  { time: "08h00", title: "BRIEFING AU QG DE VAOUR", text: "Saisie des Terminaux Civils. Distribution des Nodes, boitiers LoRa et sacs de bivouac." },
  { time: "08h30", title: "LE LARGAGE", text: "Depose des equipes yeux bandes en lisiere de la Gresigne." },
  { time: "09h00 (H0)", title: "LANCEMENT DU CHRONO", text: "Compteur a 24:00:00. Brouillard de guerre total. Recherche de la premiere balise topographique." },
  { time: "13h00", title: "SAFARI PHOTO SAUVAGE", text: "Detection d'un grand mammifere, capture et premiers points bonus." },
  { time: "14h00 (H+5)", title: "POP-UP ALERTE PNJ", text: "Vibration LoRa. Compte a rebours de 2h00 : secourir le randonneur comedien aux Gres Rouges avant 16h00." },
  { time: "15h30", title: "SAUVETAGE DU PNJ", text: "Fin des gestes de secours, identification de la Belladone, obtention de la cle USB de diagnostic." },
  { time: "18h00 (H+9)", title: "TEMPETE PHASE 2", text: "Fermeture du secteur Nord. Le Node pousse les equipes vers le centre geographique." },
  { time: "19h00", title: "DECOUVERTE DU DRONE", text: "Localisation du VULCAIN-X, extraction de la boite noire et du container etanche." },
  { time: "20h00", title: "GEL NOCTURNE / BIVOUAC", text: "Arret immediat des deplacements. Montage du campement, photo pour le bonus Zero Trace." },
  { time: "22h00 - 06h00", title: "BLACKOUT TACTIQUE", text: "Carte verrouillee. Seul l'onglet de decodage textuel reste actif (enigmes d'histoire a la frontale)." },
  { time: "J+1 06h00", title: "LEVEE DU GEL", text: "Zone autorisee reduite au minimum autour du point de ralliement final." },
  { time: "07h30", title: "CONSOLE DE DECODAGE", text: "Couplage de la cle USB du PNJ et de la boite noire pour valider l'ouverture du systeme." },
  { time: "08h00 (H+24)", title: "EXTRACTION FINALE", text: "Fin du chrono a Vaour, restitution du materiel." },
];

export const PLANNING_ADMIN: PlanEntry[] = [
  { time: "06h30", title: "AUDIT RADIO LORA", text: "Ping des gateways fixes de Vaour et remontee du Network Server." },
  { time: "07h00", title: "INITIALISATION DES NODES", text: "Injection de la base ([Run 1] / [Run 2]) et appairage Bluetooth des boitiers." },
  { time: "09h00 (H0)", title: "DOWNLINK D'ACTIVATION", text: "Lancement simultane des chronos. Surveillance du premier ping GPS (paquet 8 octets)." },
  { time: "12h00 (H+3)", title: "TEMPETE PHASE 1", text: "Injection du code radio de fermeture du secteur Nord." },
  { time: "13h45", title: "DEPLOIEMENT DU COMEDIEN", text: "Le PNJ confirme sa position hors-jeu aux Gres Rouges par talkie de securite." },
  { time: "14h00 (H+5)", title: "INJECTION ALERTE POP-UP", text: "Downlink LoRa : vibration des terminaux et demarrage du chrono secondaire de 2h00." },
  { time: "16h00 (H+7)", title: "VERROUILLAGE QUETE PNJ", text: "Coupure de l'enigme du randonneur, evacuation discrete du comedien." },
  { time: "18h00 (H+9)", title: "TEMPETE PHASE 2 & BIVOUAC", text: "Commande de restriction de zone, passage en surveillance de mouvement nocturne." },
  { time: "18h30 - 22h00", title: "AUDIT TRACKING GPS", text: "Deplacement > 15 m apres le gel : malus automatique de -15 pts." },
  { time: "22h00 - 06h00", title: "VEILLE PASSIVE", text: "Ecoute active exclusive du canal d'urgence SOS." },
  { time: "J+1 09h00", title: "SESSION DU JURY", text: "Audit bivouac et safari photo, calcul du score sur 100 et impression des diplomes." },
];
