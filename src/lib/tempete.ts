export type PhaseId = 0 | 1 | 2 | 3;

/* ------------------------------------------------------------------ */
/* Referentiel geographique reel : Foret Domaniale de Gresigne (Tarn)  */
/* ------------------------------------------------------------------ */

/** Emprise cartographique reelle du massif (WGS84) */
export const BOUNDS = {
  south: 43.99,
  north: 44.12,
  west: 1.64,
  east: 1.82,
} as const;

/** Centre du massif, entre Penne et Vaour */
export const CENTER = {
  lat: (BOUNDS.south + BOUNDS.north) / 2,
  lon: (BOUNDS.west + BOUNDS.east) / 2,
};

const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((CENTER.lat * Math.PI) / 180);

/** Largeur/hauteur reelle de l'emprise, en metres (~14,4 km) */
export const MAP_SPAN_M = Math.round((BOUNDS.east - BOUNDS.west) * M_PER_DEG_LON);
export const MAP_SPAN_M_NS = Math.round((BOUNDS.north - BOUNDS.south) * M_PER_DEG_LAT);
/** Demi-emprise : reference des rayons de la Tempete */
const HALF_SPAN_M = MAP_SPAN_M / 2;

/** WGS84 -> position normalisee 0..1 sur la carte */
export function latLonToXY(lat: number, lon: number) {
  return {
    x: (lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west),
    y: (BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south),
  };
}

/** Position normalisee -> WGS84 */
export function xyToLatLon(p: { x: number; y: number }) {
  return {
    lat: BOUNDS.north - p.y * (BOUNDS.north - BOUNDS.south),
    lon: BOUNDS.west + p.x * (BOUNDS.east - BOUNDS.west),
  };
}

/** Rayons reels des 4 anneaux de la Tempete, en metres */
export const PHASE_RADIUS_M = [7000, 5000, 3200, 1800] as const;

export const PHASES = [
  { id: 0, label: "PHASE 01", window: "00H00 - 06H00", radiusM: PHASE_RADIUS_M[0], radius: PHASE_RADIUS_M[0] / HALF_SPAN_M },
  { id: 1, label: "PHASE 02", window: "06H00 - 12H00", radiusM: PHASE_RADIUS_M[1], radius: PHASE_RADIUS_M[1] / HALF_SPAN_M },
  { id: 2, label: "PHASE 03", window: "12H00 - 18H00", radiusM: PHASE_RADIUS_M[2], radius: PHASE_RADIUS_M[2] / HALF_SPAN_M },
  { id: 3, label: "PHASE 04", window: "18H00 - 24H00", radiusM: PHASE_RADIUS_M[3], radius: PHASE_RADIUS_M[3] / HALF_SPAN_M },
] as const;

export type SectorKind = "QUETE" | "PNJ" | "CACHE" | "ARBRE" | "FAUNE";

export type Sector = {
  code: string;
  lat: number;
  lon: number;
  x: number; // 0..1 normalized position on the map (derive du WGS84)
  y: number;
  place: string;
  enigma: string;
  points: number;
  kind: SectorKind;
  brief: string;
};

export const KIND_LABEL: Record<SectorKind, string> = {
  QUETE: "OBJECTIF DE QUETE",
  PNJ: "POINT DE RENDEZ-VOUS PNJ",
  CACHE: "CACHE DE L'ORDRE",
  ARBRE: "ARBRE A POINTS",
  FAUNE: "SPOT FAUNE",
};

export const SECTORS: Sector[] = [
  {
    code: "GR-01",
    x: 0.5,
    y: 0.5,
    enigma: "Carcasse VULCAIN-X",
    points: 40,
    kind: "QUETE",
    brief: "Extraire la boite noire et le container medical du drone ICARE-868 pres du Dolmen de Peyrelevade.",
  },
  {
    code: "GR-02",
    x: 0.34,
    y: 0.42,
    enigma: "Cache du Charbonnier",
    points: 25,
    kind: "CACHE",
    brief: "Fragment de cle LoRa dissimule dans une ancienne charbonniere.",
  },
  {
    code: "GR-03",
    x: 0.66,
    y: 0.58,
    enigma: "Ruines de Saint-Amans",
    points: 25,
    kind: "QUETE",
    brief: "Balise radio de l'Ordre a coupler pour reconstituer la cle de decodage.",
  },
  {
    code: "GR-04",
    x: 0.62,
    y: 0.33,
    enigma: "Source des Corbieres",
    points: 20,
    kind: "PNJ",
    brief: "Zone de derive du randonneur egare (fenetre 14H00 - 16H00). Bilan vital, PLS, hydratation.",
  },
  {
    code: "GR-05",
    x: 0.24,
    y: 0.68,
    enigma: "Chene des Serments",
    points: 15,
    kind: "ARBRE",
    brief: "Chene rouvre millenaire : cavite support d'antenne, releve du marquage de l'Ordre.",
  },
  {
    code: "GR-06",
    x: 0.79,
    y: 0.24,
    enigma: "Coulee des Cervides",
    points: 15,
    kind: "FAUNE",
    brief: "Passage a cerfs et chevreuils a l'aube. Approche face au vent, photo nette : +5 Pts.",
  },
  {
    code: "GR-07",
    x: 0.16,
    y: 0.22,
    enigma: "Fosse aux Loups",
    points: 10,
    kind: "FAUNE",
    brief: "Terrier de renard et coulee de genette au crepuscule : +3 Pts par cliche valide.",
  },
  {
    code: "GR-08",
    x: 0.84,
    y: 0.79,
    enigma: "Verrou de la Vere",
    points: 10,
    kind: "CACHE",
    brief: "Cache d'exfiltration : point de depot final du container medical.",
  },
];

/** Emprise cartographique simulee : 100 unites carte = 6 km de terrain */
export const MAP_SPAN_M = 6000;

export function bearingTo(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return (Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360;
}

export function distanceMeters(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.round(Math.hypot(to.x - from.x, to.y - from.y) * MAP_SPAN_M);
}

export function phaseForHour(hour: number): PhaseId {
  return Math.min(3, Math.floor(hour / 6)) as PhaseId;
}

export function distanceFromCenter(s: { x: number; y: number }) {
  return Math.hypot(s.x - 0.5, s.y - 0.5) * 2;
}

export function isSectorActive(s: { x: number; y: number }, phase: PhaseId) {
  return distanceFromCenter(s) <= PHASES[phase].radius;
}

export function secondsUntilNextPhase(now: Date) {
  const h = now.getUTCHours();
  const boundary = (Math.floor(h / 6) + 1) * 6;
  const next = new Date(now);
  next.setUTCHours(boundary, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
}

export function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function formatCoord(value: number, axis: "lat" | "lon") {
  const hemi = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.floor((abs - deg) * 60);
  const sec = (((abs - deg) * 60 - min) * 60).toFixed(1);
  return `${hemi} ${String(deg).padStart(2, "0")}${String.fromCharCode(176)}${String(min).padStart(2, "0")}'${sec.padStart(4, "0")}"`;
}

/** Base camp: Vaour, Foret de Gresigne */
export const QG = { lat: 44.0532, lon: 1.7724 };