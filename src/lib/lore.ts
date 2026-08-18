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
    year: "1843",
    title: "LE MANIFESTE DE GUILLAUME DE GRESIGNE",
    text: "Face aux mines de charbon de Carmaux et aux machines a vapeur, l'erudit botaniste tarnais Guillaume de Gresigne refonde la societe secrete sous le nom d'Ordre des Pionniers : preserver la foret, ses ecosystemes et ses tresors archeologiques de l'industrialisation.",
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
    term: "LE TERMINAL CIVIL",
    def: "Le smartphone personnel du joueur. Outil de dependance absolue qui atrophie les sens humains et rompt le lien biologique avec la nature.",
  },
  {
    term: "LE WHITEOUT",
    def: "L'epreuve initiatique de la cure numerique : confiscation et scelle du Terminal Civil dans une enveloppe securisee des le debut de l'aventure.",
  },
  {
    term: "LE MURMURE",
    def: "Le reseau radio ferme et crypte de l'Ordre utilisant le protocole LoRa (868 MHz).",
  },
  {
    term: "L'AVEUGLEMENT MODERNE",
    def: "La dependance toxique aux reseaux cellulaires civils (3G/4G/5G), aux notifications constantes et a l'assistance GPS/satellite.",
  },
];

export const DOCTRINE = {
  classification: "CONFIDENTIEL / CONSEIL DES ERUDITS",
  qg: "QUARTIER GENERAL DE VAOUR (TARN)",
  version: "BIBLE DE CONCEPTION V4 - THE WILD QUEST",
};
