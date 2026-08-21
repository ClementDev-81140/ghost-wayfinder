export type QuestStep = { label: string; detail: string };

export type Quest = {
  id: string;
  code: string;
  title: string;
  kind: "TRAME PRINCIPALE" | "PNJ EPHEMERE" | "BONUS DISCRETION";
  window?: string;
  brief: string;
  steps: QuestStep[];
  reward: string;
  points?: number;
};

export const QUETES: Quest[] = [
  {
    id: "icare-868",
    code: "ICARE-868",
    title: "Le Projet ICARE-868",
    kind: "TRAME PRINCIPALE",
    brief:
      "Lors d'une liaison automatisée de ravitaillement des caches de l'Ordre, le Drone Autonome de Livraison Médicale Lourde VULCAIN-X a subi une anomalie magnétique majeure près du Dolmen de Peyrelevade. Navigation neutralisée, atterrissage forcé en plein cœur de la Forêt de Grésigne. Avant l'impact, le transpondeur a crypté ses fichiers et fragmenté sa clé de décodage sur plusieurs balises radio disséminées dans les bois.",
    steps: [
      {
        label: "LOCALISER LA CARCASSE",
        detail:
          "Structure factice de 1,5 m d'envergure : hélices brisées, verrières d'impact, voyants LED sur batterie.",
      },
      {
        label: "EXTRAIRE LA BOITE NOIRE",
        detail: "Récupération physique de la boîte noire et du container médical étanche.",
      },
      {
        label: "COUPLER LES FRAGMENTS DE CLE",
        detail:
          "Assembler les fragments numériques via l'interface LoRa pour programmer l'exfiltration.",
      },
    ],
    reward: "Exfiltration programmée - trame principale validée.",
    points: 40,
  },
  {
    id: "alerte-randonneur",
    code: "PNJ-14H",
    title: "L'Alerte Randonneur",
    kind: "PNJ EPHEMERE",
    window: "14H00 - 16H00",
    brief:
      "À 14h00, alerte pop-up LoRa : un éclaireur de l'Ordre est signalé égaré, inconscient suite à un choc thermique et à une intoxication. Fenêtre critique de 2h00. À 16h00 le comédien quitte sa position et la quête s'efface à tout jamais.",
    steps: [
      { label: "BILAN VITAL REEL", detail: "Conscience, respiration, circulation, température." },
      { label: "PLS + HYDRATATION", detail: "Position Latérale de Sécurité, eau par petites gouttes si conscient, mise à l'ombre." },
      {
        label: "IDENTIFIER LA PLANTE TOXIQUE",
        detail:
          "Inspecter les environs : Belladone (clochettes violettes, baies noires) ou Datura (trompettes blanches, fruits épineux). Saisir le remède virtuel dans l'application.",
      },
    ],
    reward:
      "Clé USB étanche contenant les diagnostics de vol du drone : réduction du rayon de recherche de la carcasse.",
    points: 15,
  },
  {
    id: "safari-photo",
    code: "FAUNE-CAM",
    title: "Safari Photo Animalier",
    kind: "BONUS DISCRETION",
    brief:
      "Toute rencontre animale fortuite peut être valorisée si la photographie est nette. Grand mammifère : +5 pts. Oiseau discret ou petit prédateur : +3 pts.",
    steps: [
      {
        label: "CAPTURE FAUNE UNIQUEMENT",
        detail:
          "Galerie native Android bloquée par le mode kiosque : capture en direct obligatoire via le module Capture Faune.",
      },
      {
        label: "HORODATAGE & GEOLOCALISATION",
        detail: "Chaque cliché est instantanément horodaté et géolocalisé par le système.",
      },
      { label: "VALIDATION JURY", detail: "Contrôle final par le jury du Quartier Général de Vaour." },
    ],
    reward: "+5 pts / +3 pts par observation validée (plafond 10 pts).",
    points: 10,
  },
  {
    id: "memoire-pierres",
    code: "PIERRE-07",
    title: "La Mémoire des Pierres",
    kind: "BONUS DISCRETION",
    points: 7,
    brief:
      "Dolmen de Peyrelevade : la roche porte des gravures qui ne révèlent leur tracé que sous éclairage rasant. Le champ magnétique local, responsable de la chute du VULCAIN-X, perturbe toute boussole classique.",
    steps: [
      { label: "DECODER LES GRAVURES", detail: "Éclairage rasant sur les dalles, relevé des symboles lumineux de l'Ordre." },
      { label: "RELEVER LES ANOMALIES", detail: "Comparer le cap magnétique et le cap réel autour du dolmen, consigner les écarts." },
    ],
    reward: "+7 pts et corrélation avec la zone de crash du drone.",
  },
  {
    id: "relais-canopee",
    code: "RELAIS-06",
    title: "Le Relais de la Canopée",
    kind: "TRAME PRINCIPALE",
    points: 6,
    brief:
      "L'ancien mât de guet domine la Canopée Noire. Son relais radio est muet : il faut reconstituer le signal pour rétablir la portée 868 MHz vers Vaour.",
    steps: [
      { label: "ATTEINDRE LE MAT DE GUET", detail: "Progression discrète sous couvert jusqu'au point haut." },
      { label: "RECONSTITUER LE SIGNAL", detail: "Réaligner l'antenne et retrouver la séquence d'accord du relais." },
    ],
    reward: "+6 pts et couverture radio étendue sur le secteur nord.",
  },
  {
    id: "herbarium",
    code: "HERBA-06",
    title: "L'Herbarium de l'Ordre",
    kind: "BONUS DISCRETION",
    points: 6,
    brief:
      "Les Pionniers entretiennent depuis 1843 une cartographie des plantes officinales de la Grésigne. Trois espèces doivent être relevées et situées.",
    steps: [
      { label: "IDENTIFIER 3 ESPECES", detail: "Reconnaissance botanique appuyée sur les fiches du Codex." },
      { label: "CARTOGRAPHIER", detail: "Horodatage et géolocalisation de chaque relevé sur Le Node." },
    ],
    reward: "+6 pts au bareme officiel.",
  },
  {
    id: "cache-maquisards",
    code: "MAQUIS-06",
    title: "La Cache des Maquisards",
    kind: "TRAME PRINCIPALE",
    points: 6,
    brief:
      "Un conteneur étanche de la Résistance de 1944 dort encore sous la Grésigne. Son emplacement est protégé par une énigme historique laissée par l'Ordre.",
    steps: [
      { label: "RESOUDRE L'ENIGME HISTORIQUE", detail: "Croiser les archives de l'Ordre et les repères de terrain." },
      { label: "RECUPERER LE CONTENEUR", detail: "Extraction sans dégradation du site, remise en état après ouverture." },
    ],
    reward: "+6 pts et pièce d'archive versée au dossier final.",
  },
];