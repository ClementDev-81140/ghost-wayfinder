import { useSyncExternalStore } from "react";

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
  base: number;
  penalties: number;
  captures: Capture[];
};

const KEY = "gresigne-score-v1";
const DEFAULT: ScoreState = { base: 120, penalties: 0, captures: [] };

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

export function totalPoints(s: ScoreState) {
  return s.base + s.captures.reduce((acc, c) => acc + c.points, 0) - s.penalties;
}

export function useScore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT);
}

export function addCapture(capture: Capture) {
  load();
  commit({ ...state, captures: [capture, ...state.captures].slice(0, 40) });
}

export function addPenalty(points: number) {
  load();
  commit({ ...state, penalties: state.penalties + points });
}

export function resetScore() {
  commit(DEFAULT);
}
