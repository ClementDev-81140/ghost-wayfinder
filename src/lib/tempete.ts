export type PhaseId = 0 | 1 | 2 | 3;

export const PHASES = [
  { id: 0, label: "PHASE 01", window: "00H00 - 06H00", radius: 1 },
  { id: 1, label: "PHASE 02", window: "06H00 - 12H00", radius: 0.78 },
  { id: 2, label: "PHASE 03", window: "12H00 - 18H00", radius: 0.56 },
  { id: 3, label: "PHASE 04", window: "18H00 - 24H00", radius: 0.34 },
] as const;

export type Sector = {
  code: string;
  x: number; // 0..1 normalized position on the map
  y: number;
  enigma: string;
  points: number;
};

export const SECTORS: Sector[] = [
  { code: "GR-01", x: 0.5, y: 0.5, enigma: "Le Chene des Serments", points: 40 },
  { code: "GR-02", x: 0.34, y: 0.42, enigma: "Cache du Charbonnier", points: 25 },
  { code: "GR-03", x: 0.66, y: 0.58, enigma: "Ruines de Saint-Amans", points: 25 },
  { code: "GR-04", x: 0.62, y: 0.33, enigma: "Source des Corbieres", points: 20 },
  { code: "GR-05", x: 0.24, y: 0.68, enigma: "Ligne de crete Ouest", points: 15 },
  { code: "GR-06", x: 0.79, y: 0.24, enigma: "Poste avance Vaour", points: 15 },
  { code: "GR-07", x: 0.16, y: 0.22, enigma: "Fosse aux Loups", points: 10 },
  { code: "GR-08", x: 0.84, y: 0.79, enigma: "Verrou de la Vere", points: 10 },
];

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