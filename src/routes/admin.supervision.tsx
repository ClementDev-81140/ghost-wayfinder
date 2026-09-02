import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { fmtTime, isCurfew, logEvent, pushFix, toLatLon, useOps } from "@/lib/ops";
import { PHASES, distanceFromCenter, formatCoord, phaseForHour } from "@/lib/tempete";

export const Route = createFileRoute("/admin/supervision")({
  head: () => ({
    meta: [
      { title: "Console de Supervision Temps Reel - QG Whiteout" },
      {
        name: "description",
        content:
          "Console QG : positions GPS des patrouilles, temps de reaction aux alertes et historique des contraintes de zone.",
      },
      { property: "og:title", content: "Console de Supervision Temps Reel" },
      { property: "og:description", content: "Suivi LoRa 868 MHz des patrouilles en foret de Gresigne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Supervision,
});

type Track = { x: number; y: number; battery: number };

function Supervision() {
  const ops = useOps();
  const [now, setNow] = useState(() => Date.now());
  const [tracks, setTracks] = useState<Record<string, Track>>({});
  const [pendingAlert, setPendingAlert] = useState<{ team: string; at: number } | null>(null);
  const lastPhase = useRef<number>(-1);

  const date = new Date(now);
  const phase = phaseForHour(date.getHours());
  const radius = PHASES[phase].radius;
  const curfew = isCurfew(date);

  // horloge + derive GPS simulee (cycle 30 s cote terminal)
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    setTracks((prev) => {
      const next = { ...prev };
      ops.teams.forEach((team, i) => {
        if (!next[team.id]) {
          next[team.id] = { x: 0.35 + i * 0.15, y: 0.45 + (i % 2) * 0.12, battery: 100 - i * 7 };
        }
      });
      return next;
    });
  }, [ops.teams]);

  useEffect(() => {
    const t = window.setInterval(() => {
      setTracks((prev) => {
        const next: Record<string, Track> = {};
        Object.entries(prev).forEach(([id, p]) => {
          next[id] = {
            x: Math.min(0.96, Math.max(0.04, p.x + (Math.random() - 0.5) * 0.03)),
            y: Math.min(0.96, Math.max(0.04, p.y + (Math.random() - 0.5) * 0.03)),
            battery: Math.max(5, p.battery - 0.1),
          };
        });
        return next;
      });
    }, 5000);
    return () => window.clearInterval(t);
  }, []);

  // uplink 5 min simule : on enregistre un fix toutes les 30 s pour la demo
  useEffect(() => {
    const t = window.setInterval(() => {
      Object.entries(tracks).forEach(([id, p]) => {
        const c = toLatLon(p);
        pushFix(id, { at: Date.now(), lat: c.lat, lon: c.lon, battery: Math.round(p.battery) });
      });
    }, 30000);
    return () => window.clearInterval(t);
  }, [tracks]);

  useEffect(() => {
    if (lastPhase.current === -1) {
      lastPhase.current = phase;
      return;
    }
    if (lastPhase.current !== phase) {
      lastPhase.current = phase;
      logEvent({
        kind: "ZONE",
        team: "TOUTES",
        detail: `Contraction ${PHASES[phase].label} - rayon autorise ${Math.round(radius * 100)}%`,
      });
    }
  }, [phase, radius]);

  const outCount = useMemo(
    () => Object.values(tracks).filter((p) => distanceFromCenter(p) > radius).length,
    [tracks, radius],
  );

  const reactions = ops.events.filter((e) => typeof e.reaction === "number");
  const avgReaction = reactions.length
    ? Math.round(reactions.reduce((a, e) => a + (e.reaction ?? 0), 0) / reactions.length)
    : null;

  function triggerAlert(teamName: string) {
    const at = Date.now();
    setPendingAlert({ team: teamName, at });
    logEvent({ kind: "ALERTE", team: teamName, detail: "Alerte downlink emise (attente ACK terminal)" });
  }

  function ack() {
    if (!pendingAlert) return;
    const reaction = Math.round((Date.now() - pendingAlert.at) / 1000);
    logEvent({ kind: "ACK", team: pendingAlert.team, detail: "Accuse de reception terminal", reaction });
    setPendingAlert(null);
  }

  return (
    <>
      <header className="hud-panel mb-3 flex flex-wrap items-center justify-between gap-2 p-3">
        <div>
          <h1 className="text-sm tracking-[0.2em] text-glow">CONSOLE DE SUPERVISION</h1>
          <p className="text-[10px] text-muted-foreground">
            Passerelle LoRa 868 MHz - Vaour / rafraichissement temps reel
          </p>
        </div>
        <div className="text-right text-[10px] text-muted-foreground">
          <div className="text-lg text-glow">{fmtTime(now)}</div>
          {PHASES[phase].label} - {PHASES[phase].window}
        </div>
      </header>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Cell label="PATROUILLES" value={String(ops.teams.length)} />
        <Cell label="HORS-ZONE" value={String(outCount)} danger={outCount > 0} />
        <Cell label="REACTION MOY." value={avgReaction === null ? "--" : `${avgReaction} s`} />
        <Cell label="COUVRE-FEU" value={curfew ? "ACTIF" : "INACTIF"} danger={curfew} />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <section className="hud-panel relative aspect-square overflow-hidden p-0">
          <svg viewBox="0 0 100 100" className="h-full w-full text-primary">
            <circle cx="50" cy="50" r={radius * 50} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} opacity="0.2">
                <line x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke="currentColor" strokeWidth="0.2" />
                <line x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke="currentColor" strokeWidth="0.2" />
              </g>
            ))}
            {ops.teams.map((t) => {
              const p = tracks[t.id];
              if (!p) return null;
              const out = distanceFromCenter(p) > radius;
              return (
                <g key={t.id}>
                  <circle
                    cx={p.x * 100}
                    cy={p.y * 100}
                    r="1.8"
                    fill={out ? "oklch(0.7 0.19 45)" : "oklch(0.8 0.02 260)"}
                  />
                  <text x={p.x * 100 + 2.5} y={p.y * 100 + 1} fontSize="2.6" fill="currentColor">
                    {t.name.split(" ")[1] ?? t.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        <section className="hud-panel p-3">
          <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">POSITIONS GPS</h2>
          <div className="space-y-2">
            {ops.teams.map((t) => {
              const p = tracks[t.id];
              const c = p ? toLatLon(p) : null;
              const out = p ? distanceFromCenter(p) > radius : false;
              return (
                <div key={t.id} className="border border-border p-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-glow">{t.name}</span>
                    <span className={out ? "text-destructive" : "text-muted-foreground"}>
                      {out ? "HORS-ZONE" : "EN ZONE"}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-muted-foreground">
                    <span>{c ? formatCoord(c.lat, "lat") : "--"}</span>
                    <span>{c ? formatCoord(c.lon, "lon") : "--"}</span>
                    <span>BAT {p ? Math.round(p.battery) : "--"}%</span>
                    <span>{t.terminal}</span>
                  </div>
                  <button
                    onClick={() => triggerAlert(t.name)}
                    className="mt-2 border border-destructive/60 px-2 py-1 text-[9px] tracking-[0.15em] text-destructive hover:bg-destructive/15"
                  >
                    EMETTRE ALERTE
                  </button>
                </div>
              );
            })}
          </div>

          {pendingAlert && (
            <div className="mt-3 border border-destructive p-2 text-[10px]">
              <p className="text-destructive">
                ALERTE EN COURS - {pendingAlert.team} ({Math.round((now - pendingAlert.at) / 1000)} s)
              </p>
              <button onClick={ack} className="mt-1 w-full border border-primary bg-primary/20 py-1 text-[10px]">
                ENREGISTRER L'ACCUSE DE RECEPTION
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="hud-panel mt-3 p-3">
        <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">
          HISTORIQUE DES CONTRAINTES DE ZONE ET ALERTES
        </h2>
        <ul className="max-h-72 space-y-1 overflow-auto text-[10px]">
          {ops.events.length === 0 && <li className="text-muted-foreground">Aucun evenement enregistre.</li>}
          {ops.events.map((e) => (
            <li key={e.id} className="flex gap-2 border-b border-border/40 pb-1">
              <span className="text-muted-foreground">{fmtTime(e.at)}</span>
              <span className={e.kind === "ALERTE" || e.kind === "SOS" ? "text-destructive" : "text-glow"}>
                [{e.kind}]
              </span>
              <span className="text-muted-foreground">{e.team}</span>
              <span>{e.detail}</span>
              {typeof e.reaction === "number" && <span className="ml-auto">{e.reaction} s</span>}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Cell({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="hud-panel p-2">
      <p className="text-[9px] tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`text-sm ${danger ? "text-destructive" : "text-glow"}`}>{value}</p>
    </div>
  );
}
