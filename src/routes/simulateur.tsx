import { requirePlayer } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { HudNav } from "@/components/hud/HudNav";
import {
  fmtTime,
  isCurfew,
  logEvent,
  resetBalises,
  toLatLon,
  toggleBalise,
  useOps,
} from "@/lib/ops";
import {
  PHASES,
  bearingTo,
  distanceFromCenter,
  distanceMeters,
  formatClock,
  formatCoord,
  phaseForHour,
  type PhaseId,
} from "@/lib/tempete";

export const Route = createFileRoute("/simulateur")({
  beforeLoad: () => requirePlayer(),
  head: () => ({
    meta: [
      { title: "Simulateur Maquis - Parcours Gresigne 24H" },
      {
        name: "description",
        content:
          "Simulateur de parcours en mode Maquis : cartographie interactive avec balises, contraction de Tempete, couvre-feu et score temps reel.",
      },
      { property: "og:title", content: "Simulateur Maquis - Parcours Gresigne" },
      {
        property: "og:description",
        content: "Entrainement offline : balises a valider, zone qui se contracte, couvre-feu et score live.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulateur,
});

const SPEEDS = [1, 60, 300, 900] as const;

function Simulateur() {
  const ops = useOps();
  const [simMinutes, setSimMinutes] = useState(0); // minutes ecoulees depuis 00h00
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(60);
  const [running, setRunning] = useState(false);
  const [player, setPlayer] = useState({ x: 0.52, y: 0.5 });
  const [target, setTarget] = useState<string | null>(null);
  const [outSince, setOutSince] = useState<number | null>(null);
  const [malus, setMalus] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const lastPhase = useRef<PhaseId>(0);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setSimMinutes((m) => (m + speed / 60) % 1440);
    }, 1000);
    return () => window.clearInterval(t);
  }, [running, speed]);

  const simDate = useMemo(() => {
    const d = new Date();
    d.setHours(Math.floor(simMinutes / 60), Math.floor(simMinutes % 60), 0, 0);
    return d;
  }, [simMinutes]);

  const phase = phaseForHour(simDate.getHours());
  const curfew = isCurfew(simDate);
  const radius = PHASES[phase].radius;
  const outOfZone = distanceFromCenter(player) > radius;
  const coords = toLatLon(player);

  useEffect(() => {
    if (lastPhase.current !== phase) {
      lastPhase.current = phase;
      setLog((l) => [`${fmtTime(Date.now())} TEMPETE ${PHASES[phase].label} - rayon ${Math.round(radius * 100)}%`, ...l].slice(0, 40));
    }
  }, [phase, radius]);

  // Penalite hors-zone : -5 pts par tranche de 5 minutes simulees
  useEffect(() => {
    if (!outOfZone) {
      setOutSince(null);
      return;
    }
    if (outSince === null) {
      setOutSince(simMinutes);
      setLog((l) => [`${fmtTime(Date.now())} ALERTE - franchissement de la limite active`, ...l].slice(0, 40));
      return;
    }
    if (simMinutes - outSince >= 5) {
      setOutSince(simMinutes);
      setMalus((m) => m + 5);
      setLog((l) => [`${fmtTime(Date.now())} MALUS -5 Pts (hors-zone > 5 min)`, ...l].slice(0, 40));
    }
  }, [outOfZone, simMinutes, outSince]);

  const validated = ops.balises.filter((b) => b.validated);
  const gained = validated.reduce((a, b) => a + b.points, 0);
  const curfewMalus = curfew && !outOfZone ? 0 : 0;
  const score = Math.max(0, gained - malus - curfewMalus);

  const targetBalise = ops.balises.find((b) => b.id === target) ?? null;
  const bearing = targetBalise ? bearingTo(player, targetBalise) : null;
  const dist = targetBalise ? distanceMeters(player, targetBalise) : null;

  function moveTo(e: React.MouseEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setPlayer({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }

  function validate(b: (typeof ops.balises)[number]) {
    const d = distanceMeters(player, b);
    if (b.validated) {
      toggleBalise(b.id);
      setLog((l) => [`${fmtTime(Date.now())} ${b.code} devalidee`, ...l].slice(0, 40));
      return;
    }
    if (d > 250) {
      setLog((l) => [`${fmtTime(Date.now())} ECHEC ${b.code} - hors de portee (${d} m)`, ...l].slice(0, 40));
      return;
    }
    if (distanceFromCenter(b) > radius) {
      setLog((l) => [`${fmtTime(Date.now())} ECHEC ${b.code} - balise purgee par la Tempete`, ...l].slice(0, 40));
      return;
    }
    toggleBalise(b.id);
    setLog((l) => [`${fmtTime(Date.now())} ${b.code} VALIDEE +${b.points} Pts`, ...l].slice(0, 40));
    logEvent({ kind: "SYS", team: "SIMULATEUR", detail: `${b.code} validee (+${b.points})` });
  }

  return (
    <main className="mx-auto max-w-5xl px-3 pb-16 tac-boot">
      <HudNav />

      <header className="hud-panel mb-3 flex flex-wrap items-center justify-between gap-2 p-3">
        <div>
          <h1 className="text-sm tracking-[0.2em] text-glow">SIMULATEUR MAQUIS</h1>
          <p className="text-[10px] text-muted-foreground">
            Parcours d'entrainement 24H - balises, Tempete, couvre-feu
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-glow">{formatClock(Math.round(simMinutes * 60))}</div>
          <div className="text-[10px] text-muted-foreground">{PHASES[phase].window}</div>
        </div>
      </header>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="SCORE LIVE" value={`${score} Pts`} accent />
        <Stat label="BALISES" value={`${validated.length}/${ops.balises.length}`} />
        <Stat label="MALUS" value={`-${malus} Pts`} />
        <Stat
          label="STATUT"
          value={outOfZone ? "HORS-ZONE" : curfew ? "COUVRE-FEU" : "EN ZONE"}
          danger={outOfZone || curfew}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
        <section className={`hud-panel relative aspect-square overflow-hidden ${outOfZone ? "animate-pulse" : ""}`}>
          <svg viewBox="0 0 100 100" className="h-full w-full cursor-crosshair text-primary" onClick={moveTo}>
            <defs>
              <pattern id="sim-hach" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="oklch(0.55 0.2 27)" strokeWidth="1.2" opacity="0.5" />
              </pattern>
              <mask id="sim-out">
                <rect width="100" height="100" fill="white" />
                <circle cx="50" cy="50" r={radius * 50} fill="black" />
              </mask>
            </defs>

            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} opacity="0.25">
                <line x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke="currentColor" strokeWidth="0.2" />
                <line x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke="currentColor" strokeWidth="0.2" />
              </g>
            ))}

            <circle cx="50" cy="50" r={radius * 50} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            <rect width="100" height="100" fill="url(#sim-hach)" mask="url(#sim-out)" />

            {curfew && <rect width="100" height="100" fill="oklch(0.2 0.05 260)" opacity="0.35" />}

            {targetBalise && (
              <line
                x1={player.x * 100}
                y1={player.y * 100}
                x2={targetBalise.x * 100}
                y2={targetBalise.y * 100}
                stroke="oklch(0.7 0.19 45)"
                strokeWidth="0.4"
                strokeDasharray="1.5 1.5"
              />
            )}

            {ops.balises.map((b) => {
              const purged = distanceFromCenter(b) > radius;
              const color = b.validated
                ? "oklch(0.75 0.16 150)"
                : purged
                  ? "oklch(0.5 0.02 260)"
                  : "oklch(0.7 0.19 45)";
              return (
                <g
                  key={b.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTarget(b.id);
                  }}
                >
                  <rect x={b.x * 100 - 1.8} y={b.y * 100 - 1.8} width="3.6" height="3.6" fill={color} />
                  <text x={b.x * 100 + 3} y={b.y * 100 + 1.2} fontSize="2.6" fill="currentColor">
                    {b.code}
                  </text>
                </g>
              );
            })}

            <g>
              <circle cx={player.x * 100} cy={player.y * 100} r="2" fill="oklch(0.85 0.02 260)" />
              <circle cx={player.x * 100} cy={player.y * 100} r="4.5" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </g>
          </svg>
          <p className="absolute bottom-1 left-2 text-[9px] text-muted-foreground">
            CLIC = DEPLACEMENT / CLIC BALISE = CAP
          </p>
        </section>

        <div className="space-y-3">
          <section className="hud-panel p-3">
            <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">PILOTAGE TEMPS</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                className="border border-primary bg-primary/20 px-3 py-1 text-[10px] tracking-[0.15em]"
              >
                {running ? "PAUSE" : "LANCER"}
              </button>
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`border px-2 py-1 text-[10px] ${speed === s ? "border-primary bg-primary/25" : "border-border text-muted-foreground"}`}
                >
                  x{s}
                </button>
              ))}
              <button
                onClick={() => {
                  setSimMinutes(0);
                  setMalus(0);
                  setLog([]);
                  resetBalises();
                }}
                className="border border-destructive/60 px-2 py-1 text-[10px] text-destructive"
              >
                RESET
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
              <span>{formatCoord(coords.lat, "lat")}</span>
              <span>{formatCoord(coords.lon, "lon")}</span>
            </div>
          </section>

          <section className="hud-panel p-3">
            <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">CAP VERS BALISE</h2>
            {targetBalise ? (
              <div className="space-y-1 text-[11px]">
                <p className="text-glow">{targetBalise.code} - {targetBalise.label}</p>
                <p className="text-muted-foreground">
                  CAP {String(Math.round(bearing ?? 0)).padStart(3, "0")}° / {dist} m / +{targetBalise.points} Pts
                </p>
                <button
                  onClick={() => validate(targetBalise)}
                  className="mt-1 w-full border border-primary bg-primary/20 py-1 text-[10px] tracking-[0.15em]"
                >
                  {targetBalise.validated ? "ANNULER VALIDATION" : "VALIDER LA BALISE (< 250 m)"}
                </button>
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground">Aucune balise selectionnee.</p>
            )}
          </section>

          <section className="hud-panel p-3">
            <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">JOURNAL DE COURSE</h2>
            <ul className="max-h-52 space-y-1 overflow-auto text-[10px] text-muted-foreground">
              {log.length === 0 && <li>En attente d'evenements...</li>}
              {log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent, danger }: { label: string; value: string; accent?: boolean; danger?: boolean }) {
  return (
    <div className="hud-panel p-2">
      <p className="text-[9px] tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`text-sm ${danger ? "text-destructive" : accent ? "text-glow" : ""}`}>{value}</p>
    </div>
  );
}
