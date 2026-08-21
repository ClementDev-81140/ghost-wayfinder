import { useSyncExternalStore } from "react";

import { OBJECTIFS, SAFARI_CAP, TOTAL_MAX } from "@/lib/bareme";

export type Capture = {
  id: string;
  species: string;
  rank: string;
  points: number;
  at: number;
  thumb: string;
  lat: number;
  lon: number;
};

export type ScoreState = {
  /** objectifs du bareme valides par le jury (hors safari photo) */
  objectives: Record<string, boolean>;
  penalties: number;
  disqualified: boolean;
  captures: Capture[];
};

const KEY = "gresigne-score-v2";
const DEFAULT: ScoreState = { objectives: {}, penalties: 0, disqualified: false, captures: [] };

let state: ScoreState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...(JSON.parse(raw) as ScoreState) };
  } catch {
    state = DEFAULT;
  }
}

function commit(next: ScoreState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* stockage local sature : on garde l'etat en memoire */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ScoreState {
  load();
  return state;
}

export function safariPoints(s: ScoreState) {
  return Math.min(SAFARI_CAP, s.captures.reduce((acc, c) => acc + c.points, 0));
}

export function objectivePoints(s: ScoreState) {
  return OBJECTIFS.filter((o) => o.id !== "safari" && s.objectives[o.id]).reduce(
    (acc, o) => acc + o.points,
    0,
  );
}

export function totalPoints(s: ScoreState) {
  if (s.disqualified) return 0;
  const raw = objectivePoints(s) + safariPoints(s) - s.penalties;
  return Math.max(0, Math.min(TOTAL_MAX, raw));
}

export function useScore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT);
}

export function addCapture(capture: Capture) {
  load();
  commit({ ...state, captures: [capture, ...state.captures].slice(0, 40) });
}

export function toggleObjective(id: string) {
  load();
  commit({ ...state, objectives: { ...state.objectives, [id]: !state.objectives[id] } });
}

export function addPenalty(points: number) {
  load();
  commit({ ...state, penalties: state.penalties + points });
}

export function disqualify() {
  load();
  commit({ ...state, disqualified: true });
}

export function resetScore() {
  commit(DEFAULT);
}
