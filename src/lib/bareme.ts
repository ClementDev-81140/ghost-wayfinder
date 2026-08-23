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
  { label: "Demande d'indice de progression ou d'aide au QG", cost: "-2 PTS / INDICE" },
  { label: "Incursion hors-zone (Tempete > 5 min)", cost: "-5 PTS / 10 MIN" },
  { label: "Retard d'extraction a Vaour au-dela de 24h", cost: "-5 PTS / 15 MIN" },
  { label: "Violation du couvre-feu nocturne (deplacement 20h00 - 06h00)", cost: "-15 PTS" },
  { label: "Non-respect d'un critere Zero Trace au bivouac", cost: "-25 PTS / DISQUALIFICATION", fatal: true },
  { label: "Declenchement du bouton SOS ou du sifflet d'urgence", cost: "DISQUALIFICATION IMMEDIATE", fatal: true },
  { label: "Extraction au-dela de 25h", cost: "DISQUALIFICATION ABSOLUE", fatal: true },
];

export type Bonus = { label: string; gain: string };

export const BONUS: Bonus[] = [
  { label: "Depollution d'un site majeur signale par le QG (Zone Critique)", gain: "+5 PTS" },
  { label: "Nettoyage actif de la nature", gain: "+2 PTS / KG" },
  { label: "Dechet insolite (coup de coeur du jury : batterie, plastique incruste...)", gain: "+5 PTS" },
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

export type OfficialDoc = { grade: string; title: string; motto: string; body: string };

export const DOCUMENTS: OfficialDoc[] = [
  {
    grade: "Pionnier Apprenti",
    title: "SAUF-CONDUIT DU REVENANT",
    motto: "Le premier pas est toujours le plus rude, mais la terre se souvient de ceux qui osent la fouler.",
    body: "Ce document atteste que le detenteur a brave son premier bapteme du feu. Le terrain s'est montre redoutable, le comedien insaisissable et la faune farouche. Pourtant l'essentiel est acquis : l'experience est gravee, les pieges sont reperes. Ce sauf-conduit vous invite officiellement a revenir pour votre second passage, avec un statut prioritaire. Revenez plus fort, la foret vous attend.",
  },
  {
    grade: "Pionnier Sentinelle de Reserve",
    title: "BREVET DE VIGILANCE",
    motto: "La survie pure ne s'improvise pas, elle se decrete.",
    body: "Valide sur le fil au detriment des quetes secondaires, votre parcours prouve votre resilience face a la contraction de la zone. En vertu de vos competences de survie brute, ce brevet vous affecte officiellement a la Surveillance des Lisieres en tant que Sentinelle de Reserve. Soyez le rempart la ou le monde sauvage commence.",
  },
  {
    grade: "Pionnier Cartographe de Terrain",
    title: "CERTIFICAT D'APTITUDE CARTOGRAPHIQUE",
    motto: "Tracer la voie, meme lorsque les ombres s'allongent.",
    body: "Felicitations pour votre excellente exploration du secteur et la localisation rapide du drone. Malgre quelques alertes de la faune et de legeres imprecisions lors du bilan vital du randonneur, votre maitrise du terrain est incontestable. Vous etes eleve au rang de Cartographe de Terrain. La carte est votre arme.",
  },
  {
    grade: "Pionnier Eclaireur-Sauveteur",
    title: "DIPLOME DE TRES HAUTE APTITUDE",
    motto: "Orientation parfaite, discretion totale, secours absolu. L'Elite.",
    body: "Face au secours, face au chronometre, face a la nature, vous avez frole la perfection. Votre Safari Photo est valide, vos reflexes de secourisme ont sauve des vies. Par decret de l'Ordre, vous recevez la bordure en fil d'or et l'acces exclusif au statut de Maitre du Jeu. Vous n'obeissez plus aux regles, vous les gardez.",
  },
  {
    grade: "Pionnier de l'Ombre",
    title: "DIPLOME DES SECRETS MAJEURS",
    motto: "Les yeux ordinaires regardent la carte. Les votres ont vu la verite.",
    body: "Vous n'avez pas seulement suivi le sentier. Vous avez decode les anomalies, franchi les barrieres invisibles et perce le secret enfoui qui dort sous ce jeu. Ce titre de Gardien du Mythe certifie votre initiation aux arcanes de notre organisation. Gardez le silence, car le secret vous garde.",
  },
];

export function docFor(gradeName: string): OfficialDoc | undefined {
  return DOCUMENTS.find((d) => d.grade === gradeName);
}

export type NpcGrade = { name: string; thread: string; profil: string; attribut: string };

export const GRADES_NPC: NpcGrade[] = [
  {
    name: "Pionnier Auditeur de Session",
    thread: "FIL BLEU MARINE",
    profil:
      "Le maitre du jeu. Depuis le QG de Vaour ou via le Murmure, il gere la narration, applique le Whiteout, valide les requetes, declenche la Tempete et applique les malus. Il extrait les releves, valide le Safari Photo et prepare les enveloppes.",
    attribut: "La console de supervision (Ecorce-Mere / Root-Terminal) et le chronometre de crise officiel.",
  },
  {
    name: "Pionnier Coordinateur de Terrain",
    thread: "FIL SABLE / TERRE DU TARN",
    profil:
      "L'oeil technique sur le terrain : mise en place invisible du drone et du comedien, securite physique des equipes, controle des consignes, intervention immediate en cas d'urgence medicale ou de rupture des limites de la Tempete.",
    attribut: "Le Trauma-Kit de l'Ordre et la cle de deverrouillage d'urgence des Terminaux Civils.",
  },
  {
    name: "Pionnier Inspecteur General",
    thread: "FOND NOIR MAT & VERT KAKI / FIL ROUGE",
    profil:
      "L'autorite supreme : supervise Auditeurs et Coordinateurs, tranche les cas litigieux lors de l'Audit Final et signe les Diplomes ou Lettres de Resiliation. Garant ultime du Manifeste de 1843.",
    attribut: "Le Sceau officiel de l'Ordre et la Cle Maitresse de chiffrement du reseau LoRa.",
  },
  {
    name: "Pionnier Sympathisant de l'Ordre",
    thread: "FIL VERT CITRON FLASH",
    profil:
      "Allie precieux de la confrerie : proprietaire terrien, partenaire local ou ancien Pionnier. Il soutient la cause et applique la resistance numerique au quotidien sans participer aux operations.",
    attribut: "Reconnaissance officielle et droit d'acces moral au cercle, sans pouvoir d'administration.",
  },
];

