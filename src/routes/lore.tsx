import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { HudNav } from "@/components/hud/HudNav";
import {
  BRIEFING,
  CHRONOLOGIE,
  DOCTRINE,
  LEXIQUE,
  PLANNING_ADMIN,
  PLANNING_JOUEUR,
  type PlanEntry,
} from "@/lib/lore";

export const Route = createFileRoute("/lore")({
  head: () => ({
    meta: [
      { title: "Archives de l'Ordre des Pionniers | The Wild Quest" },
      {
        name: "description",
        content:
          "Chronologie secrete de la Foret de Gresigne (1160-aujourd'hui), lexique officiel de l'Ordre et plannings des 24 heures d'epreuve.",
      },
      { property: "og:title", content: "Archives de l'Ordre des Pionniers" },
      {
        property: "og:description",
        content:
          "Fondations templieres, Pierre d'Ancre de 1412, pacte des mats royaux de 1666, manifeste de 1843, maquis de 1944 et resistance numerique.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LorePage,
});

function Timeline({ entries }: { entries: PlanEntry[] }) {
  return (
    <ol className="mt-3 space-y-3 border-l border-border pl-3">
      {entries.map((e) => (
        <li key={e.time + e.title} className="relative">
          <span className="absolute -left-[17px] top-1 block h-2 w-2 rounded-full bg-alert" />
          <p className="text-xs tracking-[0.18em] text-alert">{e.time}</p>
          <p className="text-[12px] tracking-[0.12em] text-foreground">{e.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{e.text}</p>
        </li>
      ))}
    </ol>
  );
}

function LorePage() {
  const [plan, setPlan] = useState<"joueur" | "admin">("joueur");

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-8">
      <header className="border-b border-border py-3">
        <h1 className="text-glow text-sm tracking-[0.25em] text-foreground">
          ARCHIVES DE L&apos;ORDRE
        </h1>
        <p className="hud-label mt-1">{DOCTRINE.classification}</p>
        <p className="hud-label">{DOCTRINE.qg}</p>
      </header>

      <HudNav />

      <section className="hud-panel hud-corners p-3">
        <p className="hud-label">SESSION DE RECRUTEMENT OFFICIELLE</p>
        <dl className="mt-2 space-y-2 text-[12px] leading-relaxed">
          <div>
            <dt className="hud-label">OU</dt>
            <dd className="text-muted-foreground">{BRIEFING.ou}</dd>
          </div>
          <div>
            <dt className="hud-label">QUOI</dt>
            <dd className="text-muted-foreground">{BRIEFING.quoi}</dd>
          </div>
          <div>
            <dt className="hud-label">POUR QUI</dt>
            <dd className="text-muted-foreground">{BRIEFING.qui}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-2 hud-panel p-3">
        <p className="hud-label">CHRONOLOGIE SECRETE</p>
        <ol className="mt-3 space-y-3 border-l border-border pl-3">
          {CHRONOLOGIE.map((c) => (
            <li key={c.year} className="relative">
              <span className="absolute -left-[17px] top-1 block h-2 w-2 rounded-full bg-alert" />
              <p className="text-xs tracking-[0.2em] text-alert">{c.year}</p>
              <p className="text-[12px] tracking-[0.12em] text-foreground">{c.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{c.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-2 hud-panel p-3">
        <p className="hud-label">LEXIQUE DE L&apos;ORDRE</p>
        <dl className="mt-2 space-y-2">
          {LEXIQUE.map((l) => (
            <div key={l.term} className="border border-border p-2">
              <dt className="text-[12px] tracking-[0.14em] text-foreground">{l.term}</dt>
              <dd className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{l.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-2 hud-panel p-3">
        <p className="hud-label">CADRAGE DU TEMPS / 24 HEURES</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["joueur", "admin"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`hud-corners border py-2 text-[10px] tracking-[0.14em] ${
                plan === p
                  ? "border-primary bg-primary/25 text-foreground shadow-hud"
                  : "border-border text-muted-foreground hover:border-ring"
              }`}
              aria-pressed={plan === p}
            >
              {p === "joueur" ? "JOURNEE DU JOUEUR" : "PILOTAGE ROOT"}
            </button>
          ))}
        </div>
        <Timeline entries={plan === "joueur" ? PLANNING_JOUEUR : PLANNING_ADMIN} />
      </section>

      <footer className="hud-label mt-4 text-center">{DOCTRINE.version}</footer>
    </main>
  );
}

