export type Objective = {
  id: string;
  code: string;
  label: string;
  detail: string;
  points: number;
  group: "PRINCIPALE" | "ANNEXE" | "BIVOUAC";
};

/** Bareme officiel : 40 (trame) + 50 (annexes) + 10 (bivouac) = 100 pts */
export const OBJECTIFS: Objective[] = [
  {
    id: "icare-1",
    code: "ICARE-1",
    label: "Localisation & extraction physique",
    detail:
      "Localiser la carcasse du VULCAIN-X (1,5 m d'envergure, helices brisees, LED sur batterie), extraire la boite noire et le conteneur medical etanche.",
    points: 20,
    group: "PRINCIPALE",
  },
  {
    id: "icare-2",
    code: "ICARE-2",
    label: "Casse-tete & decodage numerique",
    detail: "Resoudre l'enigme logique et le casse-tete sur l'interface du Node.",
    points: 20,
    group: "PRINCIPALE",
  },
  {
    id: "pnj-secours",
    code: "PNJ-A",
    label: "Alerte Randonneur / secourisme",
    detail: "Bilan vital reel, Position Laterale de Securite, hydratation et mise a l'ombre.",
    points: 8,
    group: "ANNEXE",
  },
  {
    id: "pnj-botanique",
    code: "PNJ-B",
    label: "Alerte Randonneur / botanique",
    detail:
      "Identifier la plante toxique (Belladone ou Datura), administrer le remede virtuel sur Le Node, recuperer la cle USB de diagnostic de vol.",
    points: 7,
    group: "ANNEXE",
  },
  {
    id: "safari",
    code: "FAUNE-CAM",
    label: "Safari photo animalier",
    detail:
      "Plafond 10 pts. Grand mammifere +5 pts, petit predateur / oiseau / reptile discret +3 pts. Capture en direct uniquement.",
    points: 10,
    group: "ANNEXE",
  },
  {
    id: "dolmen",
    code: "PIERRE-07",
    label: "La Memoire des Pierres",
    detail: "Dolmen de Peyrelevade : decodage des gravures lumineuses et releve des anomalies magnetiques.",
    points: 7,
    group: "ANNEXE",
  },
  {
    id: "canopee",
    code: "RELAIS-06",
    label: "Le Relais de la Canopee",
    detail: "Reconstitution du signal radio sur l'ancien mat de guet.",
    points: 6,
    group: "ANNEXE",
  },
  {
    id: "herbarium",
    code: "HERBA-06",
    label: "L'Herbarium de l'Ordre",
    detail: "Cartographier et identifier 3 especes vegetales officinales de la Gresigne.",
    points: 6,
    group: "ANNEXE",
  },
  {
    id: "maquis",
    code: "MAQUIS-06",
    label: "La Cache des Maquisards",
    detail: "Enigme historique et recuperation du conteneur etanche de la Resistance.",
    points: 6,
    group: "ANNEXE",
  },
  {
    id: "zero-trace",
    code: "BIVOUAC",
    label: "Discretion & bivouac zero trace",
    detail:
      "Audit jury : aucun feu sauvage (rechauds gaz seuls), sols respectes (pas de coupe ni tranchee), zero dechet et discretion visuelle totale.",
    points: 10,
    group: "BIVOUAC",
  },
];

export const TOTAL_MAX = OBJECTIFS.reduce((a, o) => a + o.points, 0);
export const SAFARI_CAP = 10;

export type Malus = { label: string; cost: string; fatal?: boolean };

export const MALUS: Malus[] = [
  { label: "Indice de progression ou aide demandee au QG", cost: "-5 PTS / INDICE" },
  { label: "Incursion hors-zone (Tempete > 5 min)", cost: "-5 PTS / 10 MIN" },
  { label: "Retard d'extraction a Vaour au-dela de 24h", cost: "-5 PTS / 15 MIN" },
  { label: "Violation du couvre-feu nocturne (20h00 - 06h00)", cost: "-15 PTS" },
  { label: "Non-respect d'un critere Zero Trace au bivouac", cost: "-X PTS / DISQUALIFICATION" , fatal: true },
  { label: "Declenchement du bouton SOS ou du sifflet d'urgence", cost: "SCORE = 0", fatal: true },
  { label: "Extraction au-dela de 25h", cost: "DISQUALIFICATION ABSOLUE", fatal: true },
];

export type Grade = {
  name: string;
  range: string;
  min: number;
  profil: string;
  reward: string;
  secret?: boolean;
};

export const GRADES: Grade[] = [
  {
    name: "Pionnier Eclaireur-Sauveteur",
    range: "85 - 100 PTS",
    min: 85,
    profil:
      "L'Elite : orientation parfaite, discretion totale (safari photo valide), reflexes de secourisme impeccables face au comedien.",
    reward:
      "Ecusson brode haut de gamme borde de fil d'Or + Diplome de Tres Haute Aptitude. Ouvre l'acces au recrutement des Auditeurs de Session.",
  },
  {
    name: "Pionnier Cartographe de Terrain",
    range: "70 - 84 PTS",
    min: 70,
    profil:
      "Excellente exploration, drone localise rapidement, mais manque de discretion (faune effrayee) ou erreurs mineures sur le bilan vital.",
    reward: "Ecusson brode borde de fil d'Argent + Certificat d'Aptitude Cartographique.",
  },
  {
    name: "Pionnier Sentinelle de Reserve",
    range: "50 - 69 PTS",
    min: 50,
    profil:
      "Mission validee sur le fil : objectif brut et survie pure privilegies au detriment des quetes secondaires.",
    reward: "Ecusson brode borde de fil de Bronze + Brevet de Vigilance (surveillance des lisieres).",
  },
  {
    name: "Pionnier Apprenti",
    range: "< 50 PTS",
    min: 0,
    profil:
      "La Releve : premier bapteme du feu. Le reperage est fait, les pieges sont identifies, les bases sont posees.",
    reward:
      "Ecusson brode en Fil Blanc + Brevet d'Initiation + Sauf-Conduit du Revenant (retour prioritaire sur le terrain).",
  },
  {
    name: "Pionnier de l'Ombre",
    range: "CONDITION SECRETE",
    min: 0,
    secret: true,
    profil:
      "L'Initie : a decode les anomalies du terrain, franchi les lisieres invisibles et perce le secret enfoui de l'Ordre.",
    reward:
      "Ecusson en Fil Noir Luminescent + Diplome des Secrets Majeurs. Titre de Gardien du Mythe et acces aux canaux caches.",
  },
];

export function gradeFor(score: number): Grade {
  return GRADES.find((g) => !g.secret && score >= g.min) ?? GRADES[3]!;
}
