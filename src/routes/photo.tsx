import { requirePlayer } from "@/lib/auth";
{ createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { HudNav } from "@/components/hud/HudNav";
import { FAUNE, type FaunaEntry } from "@/lib/codex";
import { addCapture, totalPoints, useScore } from "@/lib/score";
import { QG, formatCoord } from "@/lib/tempete";

export const Route = createFileRoute("/photo")({
  beforeLoad: () => requirePlayer(),
  head: () => ({
    meta: [
      { title: "Safari Photo - Validation des Quetes | Operation Whiteout" },
      {
        name: "description",
        content:
          "Module de capture photo anti-triche : validation des especes de la Gresigne et attribution automatique des points au score total.",
      },
      { property: "og:title", content: "Safari Photo - Validation des Quetes" },
      {
        property: "og:description",
        content:
          "Capture directe par optique du terminal durci, galerie bloquee, points animaliers ajoutes au score de l'equipe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhotoMode,
});

const CIBLES = FAUNE.filter((f) => f.points > 0);

function PhotoMode() {
  const score = useScore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camera, setCamera] = useState<"idle" | "live" | "error">("idle");
  const [shot, setShot] = useState<string | null>(null);
  const [target, setTarget] = useState<FaunaEntry | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamera("live");
    } catch {
      setCamera("error");
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const w = 320;
    const h = Math.round((video.videoHeight / (video.videoWidth || 1)) * w) || 240;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(video, 0, 0, w, h);
    setShot(canvas.toDataURL("image/jpeg", 0.6));
    stop();
    setCamera("idle");
  }, [stop]);

  const validate = useCallback(() => {
    if (!shot || !target) return;
    addCapture({
      id: `${Date.now()}`,
      species: target.name,
      rank: target.rank,
      points: target.points,
      at: Date.now(),
      thumb: shot,
      lat: QG.lat,
      lon: QG.lon,
    });
    setFlash(`+${target.points} PTS / ${target.name.toUpperCase()}`);
    setShot(null);
    setTarget(null);
    window.setTimeout(() => setFlash(null), 3200);
  }, [shot, target]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-8">
      <header className="border-b border-border py-3">
        <h1 className="text-sm tracking-[0.25em] text-foreground">SAFARI PHOTO</h1>
        <p className="hud-label mt-1">CAPTURE DIRECTE / GALERIE BLOQUEE</p>
        <p className="hud-label">SCORE TOTAL {totalPoints(score)} PTS</p>
      </header>

      <HudNav />

      {flash && (
        <p className="tac-pulse mb-2 border border-alert bg-alert/15 py-2 text-center text-xs tracking-[0.18em] text-alert">
          {flash}
        </p>
      )}

      <section className="hud-panel p-3">
        <p className="hud-label">OPTIQUE TERMINAL DURCI</p>
        <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden border border-border bg-black">
          {shot ? (
            <img src={shot} alt="Cliche animalier en attente de validation" className="h-full w-full object-cover" />
          ) : (
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          )}
          <div className="pointer-events-none absolute inset-6 border border-primary/60" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-alert" />
        </div>

        {camera === "error" && (
          <p className="mt-2 text-[11px] tracking-[0.12em] text-alert">
            OPTIQUE INDISPONIBLE / AUTORISATION CAMERA REFUSEE
          </p>
        )}

        <div className="mt-2 grid grid-cols-2 gap-2">
          {!shot && camera !== "live" && (
            <button
              onClick={start}
              className="col-span-2 border border-primary bg-primary/25 py-3 text-xs tracking-[0.18em] text-foreground"
            >
              ACTIVER L&apos;OPTIQUE
            </button>
          )}
          {!shot && camera === "live" && (
            <button
              onClick={capture}
              className="col-span-2 border border-alert bg-alert/20 py-3 text-xs tracking-[0.18em] text-alert"
            >
              DECLENCHER LA CAPTURE
            </button>
          )}
          {shot && (
            <>
              <button
                onClick={() => {
                  setShot(null);
                  setTarget(null);
                }}
                className="border border-border py-3 text-xs tracking-[0.16em] text-muted-foreground"
              >
                REJETER
              </button>
              <button
                onClick={validate}
                disabled={!target}
                className="border border-primary bg-primary/25 py-3 text-xs tracking-[0.16em] text-foreground disabled:opacity-40"
              >
                VALIDER {target ? `+${target.points}` : ""}
              </button>
            </>
          )}
        </div>
      </section>

      <section className="mt-2 hud-panel p-3">
        <p className="hud-label">IDENTIFICATION DE L&apos;ESPECE</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CIBLES.map((f) => {
            const active = target?.name === f.name;
            return (
              <button
                key={f.name}
                onClick={() => setTarget(f)}
                className={`border p-2 text-left text-[11px] tracking-[0.08em] ${
                  active
                    ? "border-primary bg-primary/25 text-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                <span className="block">{f.name.toUpperCase()}</span>
                <span className="text-alert">+{f.points} PTS</span>
              </button>
            );
          })}
        </div>
        <p className="hud-label mt-2">SELECTION OBLIGATOIRE AVANT VALIDATION</p>
      </section>

      <section className="mt-2 hud-panel p-3">
        <p className="hud-label">JOURNAL DES PREUVES ({score.captures.length})</p>
        {score.captures.length === 0 ? (
          <p className="mt-2 text-[11px] tracking-[0.12em] text-muted-foreground">
            AUCUNE PREUVE ENREGISTREE
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {score.captures.map((c) => (
              <li key={c.id} className="flex items-center gap-2 border border-border p-2">
                <img src={c.thumb} alt={`Preuve ${c.species}`} className="h-12 w-16 object-cover" />
                <div className="flex-1">
                  <p className="text-[11px] tracking-[0.12em] text-foreground">
                    {c.species.toUpperCase()}
                  </p>
                  <p className="hud-label">
                    {formatCoord(c.lat, "lat")} / {formatCoord(c.lon, "lon")}
                  </p>
                </div>
                <span className="text-xs text-alert">+{c.points}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
