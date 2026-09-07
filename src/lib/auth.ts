import { redirect } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";

export type Role = "JOUEUR" | "ADMIN";

export interface Profile {
  role: Role;
  name: string;
  team: string;
  loggedAt: number;
}

const KEY = "gresigne-session-v1";
/** Code d'accès maître du jeu (modifiable ici avant le run). */
export const ADMIN_PIN = "868-QG";

let session: Profile | null = load();
const listeners = new Set<() => void>();

function load(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (p && (p.role === "JOUEUR" || p.role === "ADMIN") && typeof p.name === "string") return p;
    return null;
  } catch {
    return null;
  }
}

function emit() {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function login(profile: Omit<Profile, "loggedAt">) {
  session = { ...profile, loggedAt: Date.now() };
  emit();
}

export function logout() {
  session = null;
  emit();
}

export function getSession(): Profile | null {
  return session;
}

export function useSession(): Profile | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => session,
  );
}

/** Redirection à utiliser dans beforeLoad des routes joueur. */
export function requirePlayer() {
  if (!session) throw redirect({ to: "/connexion" });
}

/** Redirection à utiliser dans beforeLoad des routes admin. */
export function requireAdmin() {
  if (!session || session.role !== "ADMIN") throw redirect({ to: "/connexion" });
}
