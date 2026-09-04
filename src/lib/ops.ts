import { useSyncExternalStore } from "react";

import { latLonToXY, xyToLatLon } from "@/lib/tempete";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Balise = {
  id: string;
  code: string;
  label: string;
  /** coordonnees reelles WGS84 dans la Foret de Gresigne */
  lat: number;
  lon: number;
  x: number;
  y: number;
  points: number;
  validated: boolean;
};

export type OpsEvent = {
  id: string;
  at: number;
  kind: "ALERTE" | "ACK" | "ZONE" | "LORA" | "SOS" | "MSG" | "SYS";
  team: string;
  detail: string;
  /** temps de reaction en secondes (pour les ACK) */
  reaction?: number;
};

export type Downlink = {
  id: string;
  /** ISO datetime local, ex 2026-09-02T18:00 */
  at: string;
  payload: "ZONE-1" | "ZONE-2" | "ZONE-3" | "PNJ" | "COUVRE-FEU" | "AUDIT";
  team: string;
  sent: boolean;
};

export type GpsFix = { at: number; lat: number; lon: number; battery: number };

export type Team = {
  id: string;
  name: string;
  terminal: string;
  initialized: boolean;
  score: number;
  penalties: number;
  bivouac: string | null; // dataURL photo
  fixes: GpsFix[];
};

export type OpsState = {
  teams: Team[];
  events: OpsEvent[];
  downlinks: Downlink[];
  balises: Balise[];
  run: { started: boolean; startedAt: number | null; curfew: boolean };
};

/* ------------------------------------------------------------------ */
/* Donnees par defaut                                                  */
/* ------------------------------------------------------------------ */

const RAW_BALISES: Array<Omit<Balise, "x" | "y" | "validated">> = [
  { id: "b1", code: "BAL-01", label: "Carcasse VULCAIN-X (coeur du massif)", lat: 44.0555, lon: 1.7295, points: 15 },
  { id: "b2", code: "BAL-02", label: "Cache du Charbonnier (Larroque)", lat: 44.0619, lon: 1.6906, points: 10 },
  { id: "b3", code: "BAL-03", label: "Ruines du Chateau de Penne", lat: 44.0664, lon: 1.7375, points: 12 },
  { id: "b4", code: "BAL-04", label: "Remparts de Puycelsi", lat: 44.0975, lon: 1.6997, points: 8 },
  { id: "b5", code: "BAL-05", label: "Chene des Serments (sud Gresigne)", lat: 44.0301, lon: 1.7108, points: 8 },
  { id: "b6", code: "BAL-06", label: "Verrou de la Vere (Castelnau-de-Montmiral)", lat: 44.0125, lon: 1.7511, points: 12 },
  { id: "b7", code: "BAL-07", label: "Gorges de l'Aveyron (Bruniquel)", lat: 44.055, lon: 1.6633, points: 10 },
  { id: "b8", code: "BAL-08", label: "QG de Vaour (point d'exfiltration)", lat: 44.0532, lon: 1.7724, points: 5 },
];

export const DEFAULT_BALISES: Balise[] = RAW_BALISES.map((b) => ({
  ...b,
  ...latLonToXY(b.lat, b.lon),
  validated: false,
}));

function team(id: string, name: string, terminal: string): Team {
  return { id, name, terminal, initialized: false, score: 0, penalties: 0, bivouac: null, fixes: [] };
}

const DEFAULT: OpsState = {
  teams: [
    team("t1", "PATROUILLE ALPHA", "TB-ESP32-001"),
    team("t2", "PATROUILLE BRAVO", "TB-ESP32-002"),
    team("t3", "PATROUILLE CHARLIE", "TB-ESP32-003"),
  ],
  events: [],
  downlinks: [],
  balises: DEFAULT_BALISES,
  run: { started: false, startedAt: null, curfew: false },
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

const KEY = "gresigne-ops-v1";
let state: OpsState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...(JSON.parse(raw) as OpsState) };
  } catch {
    state = DEFAULT;
  }
}

function commit(next: OpsState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota depasse : etat conserve en memoire */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): OpsState {
  load();
  return state;
}

export function useOps() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT);
}

const uid = () => Math.random().toString(36).slice(2, 9);

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export function logEvent(e: Omit<OpsEvent, "id" | "at">) {
  load();
  commit({ ...state, events: [{ ...e, id: uid(), at: Date.now() }, ...state.events].slice(0, 200) });
}

export function pushFix(teamId: string, fix: GpsFix) {
  load();
  commit({
    ...state,
    teams: state.teams.map((t) =>
      t.id === teamId ? { ...t, fixes: [fix, ...t.fixes].slice(0, 60) } : t,
    ),
  });
}

export function updateTeam(teamId: string, patch: Partial<Team>) {
  load();
  commit({ ...state, teams: state.teams.map((t) => (t.id === teamId ? { ...t, ...patch } : t)) });
}

export function addTeam(name: string, terminal: string) {
  load();
  commit({ ...state, teams: [...state.teams, team(uid(), name, terminal)] });
}

export function toggleBalise(id: string) {
  load();
  commit({
    ...state,
    balises: state.balises.map((b) => (b.id === id ? { ...b, validated: !b.validated } : b)),
  });
}

export function resetBalises() {
  load();
  commit({ ...state, balises: state.balises.map((b) => ({ ...b, validated: false })) });
}

export function scheduleDownlink(d: Omit<Downlink, "id" | "sent">) {
  load();
  commit({ ...state, downlinks: [...state.downlinks, { ...d, id: uid(), sent: false }] });
}

export function markDownlinkSent(id: string) {
  load();
  commit({ ...state, downlinks: state.downlinks.map((d) => (d.id === id ? { ...d, sent: true } : d)) });
}

export function removeDownlink(id: string) {
  load();
  commit({ ...state, downlinks: state.downlinks.filter((d) => d.id !== id) });
}

export function setRun(patch: Partial<OpsState["run"]>) {
  load();
  commit({ ...state, run: { ...state.run, ...patch } });
}

export function resetOps() {
  commit(DEFAULT);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Convertit une position carte normalisee en coordonnees WGS84 reelles (emprise Gresigne) */
export function toLatLon(p: { x: number; y: number }) {
  return xyToLatLon(p);
}

export function isCurfew(date: Date) {
  const h = date.getHours();
  return h >= 23 || h < 6;
}

export function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("fr-FR", { hour12: false });
}

export function fmtDateTime(ts: number) {
  return new Date(ts).toLocaleString("fr-FR", { hour12: false });
}
