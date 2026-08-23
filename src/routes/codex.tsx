import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { HudNav } from "@/components/hud/HudNav";
import {
  ARCHITECTURE,
  ASTRONOMIE,
  CHAMPIGNONS,
  DANGERS,
  FAUNE,
  FLORE,
  PATRIMOINE,
  type CodexNote,
} from "@/lib/codex";

export const Route = createFileRoute("/codex")({
  head: () => ({
    meta: [
      { title: "Codex de la Gresigne | Flore, Faune & Protocoles" },
      {
        name: "description",
        content:
          "Compendium offline de l'Ordre : flore et champignons toxiques, faune a points, patrimoine du Tarn, reperes celestes et conduites a tenir face aux dangers naturels.",
      },
      { property: "og:title", content: "Codex de la Gresigne" },
      {
        property: "og:description",
        content:
          "Fiches flore, champignons mortels, faune, architecture templiere, astronomie de terrain et protocoles d'urgence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CodexPage,
});

const TABS = [
  { key: "flore", label: "5.1 FLORE" },
  { key: "champi", label: "5.2 CHAMPI" },
  { key: "faune", label: "5.3 FAUNE" },
  { key: "terrain", label: "5.4 TERRAIN" },
  { key: "urgence", label: "5.7 URGENCE" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function NoteList({ title, notes }: { title: string; notes: CodexNote[] }) {
  return (
    <div className="hud-panel p-3">
      <p className="hud-label">{title}</p>
      <ul className="mt-2 divide-y divide-border/60">
        {notes.map((n) => (
          <li key={n.name} className="py-2">
            <p className="text-[13px] text-foreground">{n.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodexPage() {
  const [tab, setTab] = useState<TabKey>("flore");

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-10">
      <header className="border-b border-border py-3">
        <h1 className="text-glow text-sm tracking-[0.25em] text-foreground">CODEX DE LA GRESIGNE</h1>
        <p className="hud-label mt-1">FORET DOMANIALE / BASE LOCALE DU NODE</p>
      </header>
      <HudNav />

      <div className="grid grid-cols-3 gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`hud-corners border py-2 text-[10px] tracking-[0.14em] ${
              tab === t.key
                ? "border-primary bg-primary/25 text-foreground shadow-hud"
                : "border-border text-muted-foreground hover:border-ring"
            }`}
            aria-pressed={tab === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "flore" && (
        <section className="mt-2 space-y-2">
          {FLORE.map((f) => (
            <article
              key={f.name}
              className={`hud-panel p-3 ${f.danger ? "border-destructive" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-sm text-foreground">{f.name}</h2>
                <span className={`hud-label ${f.danger ? "text-destructive" : ""}`}>
                  {f.danger ? "TOXIQUE CRITIQUE" : `+${f.points} PT`}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{f.role}</p>
              {f.symptoms && (
                <>
                  <p className="hud-label mt-2 text-destructive">SYMPTOMES</p>
                  <p className="text-xs text-foreground">{f.symptoms}</p>
                </>
              )}
              {f.secours && (
                <>
                  <p className="hud-label mt-2">CONDUITE A TENIR</p>
                  <p className="text-xs text-foreground">{f.secours}</p>
                </>
              )}
            </article>
          ))}
        </section>
      )}

      {tab === "champi" && (
        <section className="mt-2 space-y-2">
          {CHAMPIGNONS.map((c) => (
            <article
              key={c.name}
              className={`hud-panel p-3 ${c.danger ? "border-destructive" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-sm text-foreground">{c.name}</h2>
                <span className={`hud-label ${c.danger ? "tac-blink text-destructive" : ""}`}>
                  {c.danger ? "TOXIQUE MORTEL" : "COMESTIBLE"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{c.role}</p>
              {c.symptoms && (
                <>
                  <p className="hud-label mt-2 text-destructive">SYMPTOMES</p>
                  <p className="text-xs text-foreground">{c.symptoms}</p>
                </>
              )}
              {c.secours && (
                <>
                  <p className="hud-label mt-2">CONDUITE A TENIR</p>
                  <p className="text-xs text-foreground">{c.secours}</p>
                </>
              )}
            </article>
          ))}
        </section>
      )}

      {tab === "faune" && (
        <section className="mt-2 space-y-2">
          {(["GRAND MAMMIFERE", "PREDATEUR / NOCTURNE", "DISCRETION / TOTEM"] as const).map((rank) => (
            <div key={rank} className="hud-panel p-3">
              <p className="hud-label">{rank}</p>
              <ul className="mt-2 divide-y divide-border/60">
                {FAUNE.filter((a) => a.rank === rank).map((a) => (
                  <li key={a.name} className="py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-foreground">{a.name}</span>
                      <span className="tabular-nums text-alert">+{a.points} PTS</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {tab === "terrain" && (
        <section className="mt-2 space-y-2">
          <NoteList title="5.4 ARCHITECTURE" notes={ARCHITECTURE} />
          <NoteList title="5.5 ASTRONOMIE & REPERES CELESTES" notes={ASTRONOMIE} />
          <NoteList title="5.6 PATRIMOINE HISTORIQUE & INDUSTRIEL" notes={PATRIMOINE} />
        </section>
      )}

      {tab === "urgence" && (
        <section className="mt-2 space-y-2">
          {DANGERS.map((d) => (
            <article key={d.name} className="hud-panel border-destructive p-3">
              <h2 className="text-sm text-alert">{d.name}</h2>
              <ol className="mt-2 space-y-1">
                {d.steps.map((s) => (
                  <li key={s} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="text-alert">-</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
          <p className="hud-label text-center">ALERTE SECOURS REELS : 112 / CANAL SOS LORA</p>
        </section>
      )}
    </main>
  );
}

