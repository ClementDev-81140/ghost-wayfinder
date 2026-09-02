import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  fmtDateTime,
  logEvent,
  markDownlinkSent,
  removeDownlink,
  scheduleDownlink,
  setRun,
  updateTeam,
  useOps,
  type Downlink,
} from "@/lib/ops";
import { formatClock } from "@/lib/tempete";

export const Route = createFileRoute("/admin/run")({
  head: () => ({
    meta: [
      { title: "Run de Terrain - Initialisation et Downlinks LoRa" },
      {
        name: "description",
        content:
          "Mode Run de terrain : initialisation des terminaux durcis, activation du chronometre 24H et downlinks LoRa programmables par date.",
      },
      { property: "og:title", content: "Run de Terrain - Operation Whiteout" },
      { property: "og:description", content: "Armement des terminaux, chrono 24H et file de downlinks 4 octets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RunPage,
});

const PAYLOADS: Downlink["payload"][] = ["ZONE-1", "ZONE-2", "ZONE-3", "PNJ", "COUVRE-FEU", "AUDIT"];

function RunPage() {
  const ops = useOps();
  const [now, setNow] = useState(() => Date.now());
  const [at, setAt] = useState("");
  const [payload, setPayload] = useState<Downlink["payload"]>("ZONE-1");
  const [team, setTeam] = useState("TOUTES");

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // Emission automatique des downlinks arrives a echeance
  useEffect(() => {
    ops.downlinks
      .filter((d) => !d.sent && new Date(d.at).getTime() <= now)
      .forEach((d) => {
        markDownlinkSent(d.id);
        logEvent({ kind: "LORA", team: d.team, detail: `Downlink 4 octets emis : ${d.payload}` });
      });
  }, [ops.downlinks, now]);

  const elapsed = ops.run.startedAt ? Math.floor((now - ops.run.startedAt) / 1000) : 0;
  const remaining = Math.max(0, 24 * 3600 - elapsed);
  const allReady = ops.teams.every((t) => t.initialized);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!at) return;
    scheduleDownlink({ at, payload, team });
    logEvent({ kind: "SYS", team, detail: `Downlink ${payload} programme pour ${at.replace("T", " ")}` });
    setAt("");
  }

  return (
    <>
      <header className="hud-panel mb-3 flex flex-wrap items-center justify-between gap-2 p-3">
        <div>
          <h1 className="text-sm tracking-[0.2em] text-glow">MODE RUN DE TERRAIN</h1>
          <p className="text-[10px] text-muted-foreground">
            Armement des terminaux durcis, chronometre d'epreuve et file radio descendante
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-glow">{formatClock(ops.run.started ? remaining : 24 * 3600)}</div>
          <div className="text-[10px] text-muted-foreground">
            {ops.run.started ? "TEMPS RESTANT" : "CHRONO EN ATTENTE"}
          </div>
        </div>
      </header>

      <section className="hud-panel mb-3 p-3">
        <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">
          ETAPE 1 - INITIALISATION DES TERMINAUX
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {ops.teams.map((t) => (
            <div key={t.id} className="border border-border p-2 text-[10px]">
              <p className="text-glow">{t.name}</p>
              <p className="text-muted-foreground">{t.terminal}</p>
              <p className={t.initialized ? "text-primary" : "text-destructive"}>
                {t.initialized ? "TERMINAL ARME / KIOSQUE ACTIF" : "NON INITIALISE"}
              </p>
              <button
                onClick={() => {
                  updateTeam(t.id, { initialized: !t.initialized });
                  logEvent({
                    kind: "SYS",
                    team: t.name,
                    detail: t.initialized ? "Terminal desarme" : "Terminal initialise (kiosque + BLE T-Beam)",
                  });
                }}
                className="mt-2 w-full border border-primary bg-primary/15 py-1 text-[9px] tracking-[0.15em]"
              >
                {t.initialized ? "DESARMER" : "INITIALISER"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="hud-panel mb-3 p-3">
        <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">ETAPE 2 - CHRONOMETRE D'EPREUVE</h2>
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <button
            disabled={!allReady && !ops.run.started}
            onClick={() => {
              const started = !ops.run.started;
              setRun({ started, startedAt: started ? Date.now() : null });
              logEvent({ kind: "SYS", team: "TOUTES", detail: started ? "TOP DEPART 24H" : "Chrono arrete" });
            }}
            className="border border-primary bg-primary/20 px-3 py-1 tracking-[0.15em] disabled:opacity-40"
          >
            {ops.run.started ? "ARRETER LE RUN" : "LANCER LE RUN 24H"}
          </button>
          <button
            onClick={() => {
              setRun({ curfew: !ops.run.curfew });
              logEvent({
                kind: "ZONE",
                team: "TOUTES",
                detail: ops.run.curfew ? "Couvre-feu leve" : "Couvre-feu impose",
              });
            }}
            className="border border-border px-3 py-1 tracking-[0.15em] text-muted-foreground"
          >
            COUVRE-FEU : {ops.run.curfew ? "ACTIF" : "INACTIF"}
          </button>
          <span className="text-muted-foreground">
            {ops.run.startedAt ? `Depart : ${fmtDateTime(ops.run.startedAt)}` : "Tous les terminaux doivent etre armes."}
          </span>
        </div>
      </section>

      <section className="hud-panel p-3">
        <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">
          ETAPE 3 - DOWNLINKS LORA PROGRAMMABLES (4 OCTETS)
        </h2>
        <form onSubmit={submit} className="mb-3 flex flex-wrap items-end gap-2 text-[10px]">
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">DATE / HEURE</span>
            <input
              type="datetime-local"
              value={at}
              onChange={(e) => setAt(e.target.value)}
              className="border border-border bg-background px-2 py-1 text-[10px]"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">TRAME</span>
            <select
              value={payload}
              onChange={(e) => setPayload(e.target.value as Downlink["payload"])}
              className="border border-border bg-background px-2 py-1 text-[10px]"
            >
              {PAYLOADS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">DESTINATAIRE</span>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="border border-border bg-background px-2 py-1 text-[10px]"
            >
              <option value="TOUTES">TOUTES</option>
              {ops.teams.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <button className="border border-primary bg-primary/20 px-3 py-1 tracking-[0.15em]">PROGRAMMER</button>
        </form>

        <ul className="space-y-1 text-[10px]">
          {ops.downlinks.length === 0 && <li className="text-muted-foreground">Aucun downlink programme.</li>}
          {[...ops.downlinks]
            .sort((a, b) => a.at.localeCompare(b.at))
            .map((d) => (
              <li key={d.id} className="flex items-center gap-2 border-b border-border/40 pb-1">
                <span className="text-muted-foreground">{d.at.replace("T", " ")}</span>
                <span className="text-glow">{d.payload}</span>
                <span className="text-muted-foreground">{d.team}</span>
                <span className={d.sent ? "text-primary" : "text-destructive"}>{d.sent ? "EMIS" : "EN FILE"}</span>
                <button
                  onClick={() => removeDownlink(d.id)}
                  className="ml-auto border border-border px-2 text-[9px] text-muted-foreground"
                >
                  SUPPRIMER
                </button>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
