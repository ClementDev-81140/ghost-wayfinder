import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { CompassReticle } from "@/components/hud/CompassReticle";
import { HudNav } from "@/components/hud/HudNav";
import { LoraPanel } from "@/components/hud/LoraPanel";
import { MessageQg } from "@/components/hud/MessageQg";
import { QuestJournal } from "@/components/hud/QuestJournal";
import { SosButton } from "@/components/hud/SosButton";
import { SosOverlay } from "@/components/hud/SosOverlay";
import { TacticalMap } from "@/components/hud/TacticalMap";
import { addPenalty, totalPoints, useScore } from "@/lib/score";
import {
  KIND_LABEL,
  PHASES,
  SECTORS,
  bearingTo,
  distanceMeters,
  QG,
  distanceFromCenter,
  formatClock,
  formatCoord,
  phaseForHour,
  secondsUntilNextPhase,
  type PhaseId,
} from "@/lib/tempete";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operation Gresigne - HUD Tactique Offline" },
      {
        name: "description",
        content:
          "Interface tactique offline-first pour le jeu de la Gresigne : carte vectorielle, Tempete en 4 phases, liaison LoRa 868 MHz et bouton SOS.",
      },
      { property: "og:title", content: "Operation Gresigne - HUD Tactique Offline" },
      {
        property: "og:description",
        content:
          "HUD gaming militaire : reticule de boussole, contraction de zone, uplinks LoRa 8 octets et protocole SOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [phase, setPhase] = useState<PhaseId>(0);
  const [countdown, setCountdown] = useState(0);
  const [gpsIn, setGpsIn] = useState(30);
  const [uplinkIn, setUplinkIn] = useState(300);
  const [heading, setHeading] = useState(42);
  const [player, setPlayer] = useState({ x: 0.52, y: 0.47 });
  const [pos, setPos] = useState({ lat: QG.lat, lon: QG.lon });
  const scoreState = useScore();
  const score = totalPoints(scoreState);
  const [outSeconds, setOutSeconds] = useState(0);
  const [sos, setSos] = useState(false);
  const [waypoint, setWaypoint] = useState<string | null>("GR-01");
  const penaltyRef = useRef(false);

  const outOfZone = distanceFromCenter(player) > PHASES[phase].radius;
  const target = SECTORS.find((s) => s.code === waypoint) ?? null;
  const nav = target
    ? {
        label: `${target.code} ${target.enigma}`,
        bearing: bearingTo(player, target),
        distance: distanceMeters(player, target),
      }
    : null;

  useEffect(() => {
    const now = new Date();
    setPhase(phaseForHour(now.getUTCHours()));
    setCountdown(secondsUntilNextPhase(now));
  }, []);

  useEffect(() => {
    if (sos) return;
    const id = window.setInterval(() => {
      const now = new Date();
      setPhase(phaseForHour(now.getUTCHours()));
      setCountdown(secondsUntilNextPhase(now));
      setGpsIn((v) => (v <= 1 ? 30 : v - 1));
      setUplinkIn((v) => (v <= 1 ? 300 : v - 1));
      setHeading((h) => (h + (Math.random() * 4 - 2) + 360) % 360);
    }, 1000);
    return () => window.clearInterval(id);
  }, [sos]);

  // Echantillonnage GPS intermittent : la position ne bouge qu'au cycle 30s
  useEffect(() => {
    if (gpsIn !== 30 || sos) return;
    setPos({
      lat: QG.lat + (player.y - 0.5) * -0.06,
      lon: QG.lon + (player.x - 0.5) * 0.08,
    });
  }, [gpsIn, player, sos]);

  // Penalite hors-zone : -5 pts apres 5 minutes consecutives
  useEffect(() => {
    if (!outOfZone || sos) {
      setOutSeconds(0);
      penaltyRef.current = false;
      return;
    }
    const id = window.setInterval(() => {
      setOutSeconds((s) => {
        const next = s + 1;
        if (next >= 300 && !penaltyRef.current) {
          penaltyRef.current = true;
          addPenalty(5);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [outOfZone, sos]);

  if (sos) {
    return <SosOverlay lat={pos.lat} lon={pos.lon} onCancel={() => setSos(false)} />;
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-md px-3 pb-8">
      {outOfZone && (
        <div className="tac-flash pointer-events-none fixed inset-0 z-30" aria-hidden />
      )}

      <header className="relative z-40 flex items-start justify-between border-b border-border py-3">
        <div>
          <h1 className="text-sm tracking-[0.25em] text-foreground">OPERATION GRESIGNE</h1>
          <p className="hud-label mt-1">MODE KIOSQUE VERROUILLE / OFFLINE-FIRST</p>
          <p className="hud-label">SCORE {score} PTS</p>
          <p className="hud-label">PREUVES PHOTO {scoreState.captures.length}</p>
        </div>
        <div className="flex items-start gap-2">
          <MessageQg lat={pos.lat} lon={pos.lon} />
          <SosButton onArmed={() => setSos(true)} />
        </div>
      </header>

      <div className="relative z-40">
        <HudNav />
      </div>

      <section className="mt-3 grid grid-cols-2 gap-2">
        <div className="hud-panel p-3">
          <p className="hud-label">TEMPETE / {PHASES[phase].label}</p>
          <p className="mt-1 text-2xl tabular-nums text-alert">{formatClock(countdown)}</p>
          <p className="hud-label mt-1">{PHASES[phase].window}</p>
        </div>
        <div className="hud-panel p-3">
          <p className="hud-label">STATUT ZONE</p>
          <p className={`mt-1 text-lg ${outOfZone ? "text-alert tac-pulse" : "text-foreground"}`}>
            {outOfZone ? "HORS-ZONE" : "EN ZONE"}
          </p>
          <p className="hud-label mt-1">
            {outOfZone ? `MALUS -5 PTS DANS ${formatClock(Math.max(0, 300 - outSeconds))}` : "AUCUN MALUS"}
          </p>
        </div>
      </section>

      <section className="mt-2 hud-panel p-3 text-primary">
        <CompassReticle
          heading={heading}
          lat={pos.lat}
          lon={pos.lon}
          outOfZone={outOfZone}
          target={nav}
        />
        <div className="mt-2 flex justify-between border-t border-border pt-2">
          <span className="text-xs text-muted-foreground">{formatCoord(pos.lat, "lat")}</span>
          <span className="text-xs text-muted-foreground">{formatCoord(pos.lon, "lon")}</span>
        </div>
      </section>

      <section className="mt-2">
        <TacticalMap
          phase={phase}
          player={player}
          outOfZone={outOfZone}
          selected={waypoint}
          onSelect={setWaypoint}
        />

        {target ? (
          <div className="mt-2 hud-panel p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="hud-label">{KIND_LABEL[target.kind]}</p>
                <p className="text-xs tracking-[0.14em] text-foreground">
                  {target.code} / {target.enigma.toUpperCase()}
                </p>
              </div>
              <span className="text-xs text-alert">+{target.points} PTS</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{target.brief}</p>
            <div className="mt-2 flex justify-between border-t border-border pt-2">
              <span className="hud-label">
                CAP {String(Math.round(nav?.bearing ?? 0)).padStart(3, "0")}&#176;
              </span>
              <span className="hud-label">DISTANCE {nav?.distance} M</span>
              <button onClick={() => setWaypoint(null)} className="hud-label text-alert">
                ANNULER
              </button>
            </div>
          </div>
        ) : (
          <p className="hud-label mt-2">
            SELECTIONNER UN CARRE SUR LA CARTE POUR OBTENIR LE CAP
          </p>
        )}
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              ["CENTRE", { x: 0.5, y: 0.5 }],
              ["PERIPHERIE", { x: 0.72, y: 0.66 }],
              ["LISIERE", { x: 0.9, y: 0.15 }],
            ] as const
          ).map(([label, p]) => (
            <button
              key={label}
              onClick={() => setPlayer({ ...p })}
              className="border border-border py-2 text-[11px] tracking-[0.15em] text-muted-foreground"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hud-label mt-1">SIMULATION DEPLACEMENT EQUIPE</p>
      </section>

      <section className="mt-2 space-y-2">
        <LoraPanel
          uplinkIn={uplinkIn}
          lastDownlink={`REDUCTION ZONE ${PHASES[phase].label}`}
          rssi={-96}
          battery={87}
          gpsIn={gpsIn}
        />
        <QuestJournal phase={phase} />
      </section>

      <footer className="hud-label mt-4 text-center">
        QG VAOUR / TOUCHES ACCUEIL &amp; RETOUR NEUTRALISEES
      </footer>
    </main>
  );
}
