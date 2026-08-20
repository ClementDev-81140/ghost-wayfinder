export type FloraEntry = {
  name: string;
  latin?: string;
  role: string;
  danger?: "critique";
  symptoms?: string;
  secours?: string;
  points: number;
};

export const FLORE: FloraEntry[] = [
  {
    name: "Chêne Rouvre & Chêne Pubescent",
    role: "Arbres rois de la Grésigne. Troncs massifs et cavités naturelles : supports des Caches de l'Ombre et des antennes du réseau radio.",
    points: 2,
  },
  {
    name: "Hêtre Commun (Fau)",
    role: "Zones sombres et humides. Forme la Canopée Noire, idéale pour se déplacer à l'abri des satellites de surveillance.",
    points: 1,
  },
  {
    name: "Fougère Aigle",
    role: "Couverture parfaite pour le camouflage au sol lors des phases de discrétion.",
    points: 0.5,
  },
  {
    name: "Néflier Sauvage",
    role: "Produit des nèfles consommables après les premières gelées. Nourriture de survie cruciale.",
    points: 1.5,
  },
  {
    name: "Belladone",
    role: "Fleurs en clochettes violettes, baies noires luisantes.",
    danger: "critique",
    symptoms:
      "Mydriase (pupilles très dilatées), tachycardie, sécheresse buccale intense, choc thermique (forte fièvre), hallucinations.",
    secours: "PLS, hydratation par petites gouttes si conscient, alerte immédiate.",
    points: 2,
  },
  {
    name: "Datura Officinal",
    role: "Fleurs blanches en trompette, fruits épineux.",
    danger: "critique",
    symptoms:
      "Confusion mentale totale, amnésie, comportement agressif inconscient, rougeur cutanée.",
    secours: "PLS, maintien des fonctions vitales, isolement à l'ombre.",
    points: 2,
  },
];

export type FaunaEntry = {
  name: string;
  rank: "GRAND MAMMIFERE" | "PREDATEUR / NOCTURNE" | "AMBIANCE";
  points: number;
  note: string;
};

export const FAUNE: FaunaEntry[] = [
  {
    name: "Cerf Élaphe",
    rank: "GRAND MAMMIFERE",
    points: 5,
    note: "Approche face au vent, absence totale de bruits de pas.",
  },
  {
    name: "Sanglier d'Europe",
    rank: "GRAND MAMMIFERE",
    points: 5,
    note: "Approche face au vent, silence absolu.",
  },
  {
    name: "Chevreuil",
    rank: "GRAND MAMMIFERE",
    points: 5,
    note: "Fuite rapide : photographier depuis un couvert.",
  },
  {
    name: "Genette Commune",
    rank: "PREDATEUR / NOCTURNE",
    points: 3,
    note: "Carnivore nocturne tacheté au corps élancé.",
  },
  { name: "Renard Roux", rank: "PREDATEUR / NOCTURNE", points: 3, note: "Lisières au crépuscule." },
  {
    name: "Engoulevent d'Europe",
    rank: "PREDATEUR / NOCTURNE",
    points: 3,
    note: "Plumage couleur écorce, invisible au sol.",
  },
  {
    name: "Vipère Aspic",
    rank: "AMBIANCE",
    points: 0,
    note: "Danger permanent sur les roches ensoleillées près du Dolmen.",
  },
  {
    name: "Lucane Cerf-Volant",
    rank: "AMBIANCE",
    points: 0,
    note: "Plus grand coléoptère d'Europe, totem de l'Ordre.",
  },
  {
    name: "Salamandre Tachetée",
    rank: "AMBIANCE",
    points: 0,
    note: "Indique aux Pionniers que l'eau des ruisseaux est pure et potable.",
  },
];
