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
    reward: "+5 pts / +3 pts par observation validée.",
  },
];
