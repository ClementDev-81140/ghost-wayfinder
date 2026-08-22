export type FloraEntry = {
  name: string;
  latin?: string;
  role: string;
  danger?: "critique" | "mortel";
  symptoms?: string;
  secours?: string;
  points: number;
};

export const FLORE: FloraEntry[] = [
  {
    name: "Chêne Rouvre & Chêne Pubescent",
    role: "Arbres rois de la Grésigne. Troncs massifs et cavités naturelles : supports des Caches de l'Ombre et des antennes du réseau radio. Arbre majestueux isolé : +1 pt supplémentaire.",
    points: 2,
  },
  {
    name: "Hêtre Commun (Fau)",
    role: "Zones sombres et humides. Forme la Canopée Noire, idéale pour se déplacer à l'abri des détections.",
    points: 1,
  },
  {
    name: "Fougère Aigle",
    role: "Couverture parfaite pour le camouflage au sol lors des phases de discrétion.",
    points: 0.5,
  },
  {
    name: "Néflier Sauvage",
    role: "Arbuste produisant des nèfles consommables après les premières gelées. Nourriture de survie.",
    points: 1,
  },
  {
    name: "Alliaire Officinale",
    role: "Commune en sous-bois. Feuilles froissées à forte odeur d'ail : antiseptique et condiment de survie historique.",
    points: 1,
  },
  {
    name: "Fragon Faux-Houx",
    role: "Sous-arbrisseau toujours vert aux baies rouges toxiques, emblématique du sous-bois calcaire tarnais. Vertus circulatoires, usage en balai d'appoint.",
    points: 1,
  },
  {
    name: "Leucanthème / Grande Marguerite Sauvage",
    role: "Abondante en clairières et lisières. Indicateur d'un sol calcaire équilibré et repère visuel de terrain.",
    points: 0.5,
  },
  {
    name: "Belladone",
    role: "Fleurs en clochettes violettes, baies noires luisantes.",
    danger: "critique",
    symptoms:
      "Mydriase (pupilles très dilatées), tachycardie, sécheresse buccale intense, visage rouge, forte fièvre, hallucinations.",
    secours:
      "Isoler à l'ombre au calme. Si conscient : rincer la bouche, boire par petites gorgées. Si inconscient : PLS et alerte immédiate.",
    points: 2,
  },
  {
    name: "Datura Officinal",
    role: "Fleurs blanches en trompette, fruits épineux.",
    danger: "critique",
    symptoms:
      "Confusion mentale totale, désorientation, amnésie, agressivité inconsciente, vision floue, rougeur cutanée.",
    secours:
      "Maintenir sans violence pour éviter les blessures, isoler du bruit. Ne rien donner à boire si troubles de conscience. PLS en cas d'évanouissement.",
    points: 2,
  },
];

export type FungiEntry = {
  name: string;
  role: string;
  danger?: "mortel";
  symptoms?: string;
  secours?: string;
};

export const CHAMPIGNONS: FungiEntry[] = [
  {
    name: "Cèpe de Bordeaux & Cèpe Tête-de-Nègre",
    role: "Abondants sous les chênes et hêtres de Grésigne. Comestibles de choix, indicateurs d'un sol riche et préservé.",
  },
  {
    name: "Oronge (Amanite des Césars)",
    role: "Chapeau orange vif, lames jaunes. Très recherchée dans les bois thermophiles du Tarn. Comestible noble historique.",
  },
  {
    name: "Amanite Phalloïde",
    role: "Chapeau verdâtre, volve et anneau blancs. Responsable de la majorité des empoisonnements mortels (syndrome phalloïdien, destruction du foie).",
    danger: "mortel",
    symptoms:
      "6 h à 24 h après ingestion : vomissements violents, diarrhées, crampes abdominales, forte déshydratation.",
    secours:
      "Allonger la victime. Petites gorgées d'eau si consciente et sans vomissements. Conserver un reste du champignon et appeler le 112 sans attendre.",
  },
  {
    name: "Gyromitre (Fausse Morille)",
    role: "Chapeau cérébriforme brun-rouge. Contient de la gyromitrine (destruction des globules rouges et atteinte nerveuse).",
    danger: "mortel",
    symptoms: "6 h à 12 h après ingestion : maux de tête, vertiges, vomissements, somnolence.",
    secours:
      "Repos à l'abri, surveillance de la conscience, PLS en cas de perte de connaissance, alerte médicale rapide.",
  },
];

export type FaunaEntry = {
  name: string;
  rank: "GRAND MAMMIFERE" | "PREDATEUR / NOCTURNE" | "DISCRETION / TOTEM";
  points: number;
  note: string;
};

export const FAUNE: FaunaEntry[] = [
  {
    name: "Cerf Élaphe",
    rank: "GRAND MAMMIFERE",
    points: 5,
    note: "Plus grand mammifère de la forêt. Approche face au vent, absence totale de bruits de pas.",
  },
  {
    name: "Sanglier d'Europe",
    rank: "GRAND MAMMIFERE",
    points: 5,
    note: "Traceur de sol majeur, repérable à ses souilles et retours de terre. Puissant et méfiant.",
  },
  {
    name: "Chevreuil",
    rank: "GRAND MAMMIFERE",
    points: 5,
    note: "Cervidé agile des taillis bas, sensible au moindre craquement de branche.",
  },
  {
    name: "Genette Commune",
    rank: "PREDATEUR / NOCTURNE",
    points: 3,
    note: "Carnivore nocturne au corps élancé et à la queue annelée. Indicateur d'un biotope très préservé.",
  },
  {
    name: "Renard Roux",
    rank: "PREDATEUR / NOCTURNE",
    points: 3,
    note: "Prédateur opportuniste, maître du camouflage en sous-bois. Lisières au crépuscule.",
  },
  {
    name: "Engoulevent d'Europe",
    rank: "PREDATEUR / NOCTURNE",
    points: 2,
    note: "Oiseau nocturne au plumage couleur écorce, invisible au sol le jour, chant continu les nuits d'été.",
  },
  {
    name: "Vipère Aspic",
    rank: "DISCRETION / TOTEM",
    points: 2,
    note: "Reptile venimeux des roches ensoleillées près des ruines et du Dolmen. Vigilance constante.",
  },
  {
    name: "Lucane Cerf-Volant",
    rank: "DISCRETION / TOTEM",
    points: 2,
    note: "Plus grand coléoptère d'Europe, larves nourries de bois mort de chêne. Totem de l'Ordre.",
  },
  {
    name: "Salamandre Tachetée",
    rank: "DISCRETION / TOTEM",
    points: 2,
    note: "Amphibien noir et jaune des zones humides. Signale aux recrues une eau de ruisseau pure.",
  },
];

export type CodexNote = { name: string; text: string };

export const ARCHITECTURE: CodexNote[] = [
  {
    name: "Commanderie Templière de Vaour (XIIe s.)",
    text: "Édifiée à partir de 1160 par la volonté de Pierre de Saint-Jean. Centre militaire, agricole et financier des Templiers dans le Bas-Albigeois.",
  },
  {
    name: "Mur de la Grésigne (XVIIe s.)",
    text: "Enceinte en maçonnerie sèche ordonnée sous Louis XIV lors de la Réformation des Forêts (Louis de Froidour, 1666) pour délimiter le domaine royal et stopper le marronnage.",
  },
  {
    name: "Pigeonniers du Tarn",
    text: "Symboles du statut social d'Ancien Régime et fournisseurs de fiente, engrais historique à haute valeur.",
  },
  {
    name: "Bastides Albigeoises",
    text: "Villes neuves du XIIIe siècle bâties sur plan orthogonal strict en réponse aux désordres de la Croisade contre les Albigeois.",
  },
];

export const ASTRONOMIE: CodexNote[] = [
  {
    name: "L'Étoile Polaire",
    text: "Alignement dans le prolongement du grand axe de la Grande Ourse pour trouver le Nord sans boussole.",
  },
  {
    name: "La Constellation d'Orion",
    text: "Ciel d'hiver et nuits fraîches : la ligne de sa Ceinture indique l'Est à son lever et l'Ouest à son coucher.",
  },
  {
    name: "Le Ciel Noir de Grésigne",
    text: "Cuvette géographique préservée de l'éclairage urbain : lecture nocturne des cartes par alignement d'étoiles.",
  },
];

export const PATRIMOINE: CodexNote[] = [
  {
    name: "Vignoble de Gaillac",
    text: "Origine gallo-romaine, développé au Moyen Âge par les moines de l'Abbaye Saint-Michel. Cépages historiques reconnus.",
  },
  {
    name: "Le Saut du Tarn (Saint-Juéry)",
    text: "Chute d'eau transformée dès la fin du XIXe siècle en haut lieu de la métallurgie lourde (outils, tôle durcie).",
  },
  {
    name: "Dolmen de Peyrelevade (Vaour)",
    text: "Plus grand mégalithe du Tarn, néolithique. Témoin de rites funéraires ancestraux et cœur des anomalies magnétiques.",
  },
  {
    name: "Mine de Cagnac-les-Mines",
    text: "Charbon exploité depuis le Moyen Âge, essor au XIXe siècle et luttes ouvrières guidées par Jean Jaurès.",
  },
];

export type DangerProtocol = { name: string; steps: string[] };

export const DANGERS: DangerProtocol[] = [
  {
    name: "Orage & Foudre",
    steps: [
      "S'éloigner des crêtes, points hauts et arbres isolés.",
      "Ne pas rester près des structures métalliques (clôtures, antennes).",
      "S'écarter de 10 m les uns des autres pour éviter la propagation d'un arc électrique.",
      "S'accroupir pieds joints sur un sac isolant, tête rentrée. Ne jamais s'allonger au sol.",
    ],
  },
  {
    name: "Pluie Diluvienne & Crue Éclair",
    steps: [
      "Quitter rapidement les fonds de vallées, ravines et lits de ruisseaux.",
      "Rejoindre un point haut sécurisé sur le relief.",
      "Ne jamais traverser un cours d'eau en crue à pied.",
    ],
  },
  {
    name: "Feu de Forêt",
    steps: [
      "Déterminer la direction du vent et fuir perpendiculairement à l'avancée des fumées.",
      "Se diriger vers une zone dégagée, une piste, un champ ou une zone déjà brûlée.",
      "En forte fumée : rester près du sol et couvrir le visage d'un tissu humide.",
    ],
  },
  {
    name: "Canicule & Coup de Chaleur",
    steps: [
      "Stopper tout effort dès l'apparition de vertiges ou maux de tête.",
      "Mettre à l'ombre, desserrer les vêtements, rafraîchir visage et cou.",
      "Faire boire de l'eau fraîche par petites gorgées si la personne est consciente.",
    ],
  },
];
