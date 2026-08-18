import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { HudNav } from "@/components/hud/HudNav";
import { QUETES } from "@/lib/quetes";

export const Route = createFileRoute("/quetes")({
  head: () => ({
    meta: [
      { title: "Journal de Quetes - ICARE-868 | Operation Gresigne" },
      {
        name: "description",
        content:
          "Trame principale ICARE-868, mission PNJ ephemere Alerte Randonneur et safari photo animalier : objectifs, etapes de terrain et recompenses.",
      },
      { property: "og:title", content: "Journal de Quetes - ICARE-868" },
      {
        property: "og:description",
        content:
          "Crash du drone VULCAIN-X, secourisme sur PNJ comedien et bonus discretion faune de la Gresigne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuetesPage,
});

function QuetesPage() {
  const [open, setOpen] = useState<string | null>(QUETES[0]?.id ?? null);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-10">
      <header className="border-b border-border py-3">
        <h1 className="text-sm tracking-[0.25em] text-foreground">JOURNAL DE QUETES</h1>
        <p className="hud-label mt-1">ARBORESCENCE STOCKEE LOCALEMENT / OFFLINE</p>
      </header>
      <HudNav />

      <div className="space-y-2">
        {QUETES.map((q) => {
          const expanded = open === q.id;
          return (
            <article key={q.id} className="hud-panel">
              <button
                onClick={() => setOpen(expanded ? null : q.id)}
                className="flex w-full items-center justify-between gap-3 p-3 text-left"
                aria-expanded={expanded}
              >
                <span>
                  <span className="hud-label block">
                    {q.code} / {q.kind}
                  </span>
                  <span className="text-sm text-foreground">{q.title}</span>
                </span>
                <span className="text-alert">{expanded ? "-" : "+"}</span>
              </button>

              {expanded && (
                <div className="border-t border-border p-3">
                  {q.window && (
                    <p className="mb-2 text-xs tracking-[0.15em] text-alert tac-pulse">
                      FENETRE CRITIQUE {q.window}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{q.brief}</p>
                  <ol className="mt-3 space-y-2">
                    {q.steps.map((s, i) => (
                      <li key={s.label} className="border-l-2 border-primary pl-3">
                        <p className="text-xs tracking-[0.15em] text-foreground">
                          {String(i + 1).padStart(2, "0")} / {s.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{s.detail}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="hud-label mt-3">RECOMPENSE</p>
                  <p className="text-xs text-foreground">{q.reward}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="hud-label mt-4 text-center">
        FICHES BOTANIQUES DANS LE{" "}
        <Link to="/codex" className="text-alert">
          CODEX
        </Link>
      </p>
    </main>
  );
}
