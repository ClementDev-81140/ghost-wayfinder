import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { HudNav } from "@/components/hud/HudNav";
import { FAUNE, FLORE } from "@/lib/codex";

export const Route = createFileRoute("/codex")({
  head: () => ({
    meta: [
      { title: "Codex Biologique de la Gresigne | Flore & Faune" },
      {
        name: "description",
        content:
          "Compendium offline : chenes, hetre, fougere aigle, neflier, plantes toxiques (Belladone, Datura) et rangs d'observation de la faune de la Gresigne.",
      },
      { property: "og:title", content: "Codex Biologique de la Gresigne" },
      {
        property: "og:description",
        content:
          "Fiches flore et faune avec symptomes d'intoxication, gestes de secours et bareme d'observation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CodexPage,
});

function CodexPage() {
  const [tab, setTab] = useState<"flore" | "faune">("flore");

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-10">
      <header className="border-b border-border py-3">
        <h1 className="text-sm tracking-[0.25em] text-foreground">COMPENDIUM BIOLOGIQUE</h1>
        <p className="hud-label mt-1">FORET DE GRESIGNE / BASE LOCALE</p>
      </header>
      <HudNav />

      <div className="grid grid-cols-2 gap-2">
        {(["flore", "faune"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border py-2 text-[11px] tracking-[0.18em] ${
              tab === t
                ? "border-primary bg-primary/25 text-foreground shadow-hud"
                : "border-border text-muted-foreground"
            }`}
          >
            {t === "flore" ? "4.1 FLORE" : "4.2 FAUNE"}
          </button>
        ))}
      </div>

      {tab === "flore" ? (
        <section className="mt-2 space-y-2">
          {FLORE.map((f) => (
            <article
              key={f.name}
              className={`hud-panel p-3 ${f.danger ? "border-destructive" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-sm text-foreground">{f.name}</h2>
                <span className={`hud-label ${f.danger ? "text-destructive" : ""}`}>
                  {f.danger ? "TOXIQUE CRITIQUE" : `${f.points} PT`}
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
                  <p className="hud-label mt-2">SECOURS</p>
                  <p className="text-xs text-foreground">{f.secours}</p>
                </>
              )}
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-2 space-y-2">
          {(["GRAND MAMMIFERE", "PREDATEUR / NOCTURNE", "AMBIANCE"] as const).map((rank) => (
            <div key={rank} className="hud-panel p-3">
              <p className="hud-label">{rank}</p>
              <ul className="mt-2 divide-y divide-border/60">
                {FAUNE.filter((a) => a.rank === rank).map((a) => (
                  <li key={a.name} className="py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-foreground">{a.name}</span>
                      <span className="tabular-nums text-alert">
                        {a.points > 0 ? `+${a.points} PTS` : "LORE"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
