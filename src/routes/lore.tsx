import { createFileRoute } from "@tanstack/react-router";

import { HudNav } from "@/components/hud/HudNav";
import { CHRONOLOGIE, DOCTRINE, LEXIQUE } from "@/lib/lore";

export const Route = createFileRoute("/lore")({
  head: () => ({
    meta: [
      { title: "Archives de l'Ordre des Pionniers | The Wild Quest" },
      {
        name: "description",
        content:
          "Chronologie secrete de la Foret de Gresigne (1160-aujourd'hui) et lexique interdit de l'Ordre des Pionniers : Terminal Civil, Whiteout, Le Murmure.",
      },
      { property: "og:title", content: "Archives de l'Ordre des Pionniers" },
      {
        property: "og:description",
        content:
          "Fondations templieres, clandestinite de 1307, manifeste de 1843, maquis de 1944 et resistance numerique moderne.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LorePage,
});

function LorePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-8">
      <header className="border-b border-border py-3">
        <h1 className="text-sm tracking-[0.25em] text-foreground">ARCHIVES DE L&apos;ORDRE</h1>
        <p className="hud-label mt-1">{DOCTRINE.classification}</p>
        <p className="hud-label">{DOCTRINE.qg}</p>
      </header>

      <HudNav />

      <section className="hud-panel p-3">
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
        <p className="hud-label">LEXIQUE INTERDIT</p>
        <dl className="mt-2 space-y-2">
          {LEXIQUE.map((l) => (
            <div key={l.term} className="border border-border p-2">
              <dt className="text-[12px] tracking-[0.14em] text-foreground">{l.term}</dt>
              <dd className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{l.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="hud-label mt-4 text-center">{DOCTRINE.version}</footer>
    </main>
  );
}
