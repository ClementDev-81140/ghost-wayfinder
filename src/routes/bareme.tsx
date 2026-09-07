import { requirePlayer } from "@/lib/auth";
{ createFileRoute } from "@tanstack/react-router";

import { HudNav } from "@/components/hud/HudNav";
import {
  BONUS,
  GRADES,
  GRADES_NPC,
  MALUS,
  OBJECTIFS,
  TOTAL_MAX,
  docFor,
  gradeFor,
} from "@/lib/bareme";
import { objectivePoints, safariPoints, toggleObjective, totalPoints, useScore } from "@/lib/score";


export const Route = createFileRoute("/bareme")({
  beforeLoad: () => requirePlayer(),
  head: () => ({
    meta: [
      { title: "Bareme Officiel & Ecussons de Grade | Operation Whiteout" },
      {
        name: "description",
        content:
          "Bareme 100 points de l'operation Whiteout : trame ICARE-868, six quetes annexes, bivouac zero trace, grille des malus et grades de l'Ordre.",
      },
      { property: "og:title", content: "Bareme Officiel & Ecussons de Grade" },
      {
        property: "og:description",
        content:
          "40 pts de trame principale, 50 pts d'annexes, 10 pts de bivouac zero trace, malus et audit final au QG de Vaour.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BaremePage,
});

const GROUPS = [
  { key: "PRINCIPALE", title: "TRAME PRINCIPALE / ICARE-868", cap: 40 },
  { key: "ANNEXE", title: "QUETES ANNEXES DE TERRAIN", cap: 50 },
  { key: "BIVOUAC", title: "DISCRETION & BIVOUAC ZERO TRACE", cap: 10 },
] as const;

function BaremePage() {
  const state = useScore();
  const score = totalPoints(state);
  const grade = gradeFor(score);
  const safari = safariPoints(state);
  const doc = docFor(grade.name);


  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-10">
      <header className="border-b border-border py-3">
        <h1 className="text-glow text-sm tracking-[0.25em] text-foreground">BAREME OFFICIEL / 100 PTS</h1>
        <p className="hud-label mt-1">AUDIT FINAL AU QG DE VAOUR</p>
      </header>
      <HudNav />

      <section className="hud-panel hud-corners tac-boot p-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="hud-label">SCORE COURANT</p>
            <p className="text-glow-alert text-3xl tabular-nums text-alert">
              {score}
              <span className="text-sm text-muted-foreground"> / {TOTAL_MAX}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="hud-label">GRADE PROJETE</p>
            <p className="text-sm text-foreground">{grade.name.toUpperCase()}</p>
          </div>
        </div>
        <div className="mt-2 h-2 w-full border border-border bg-secondary/20">
          <div className="h-full bg-primary/70" style={{ width: `${score}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border pt-2 text-center">
          <p className="hud-label">
            OBJECTIFS <span className="text-foreground">{objectivePoints(state)}</span>
          </p>
          <p className="hud-label">
            FAUNE <span className="text-foreground">{safari}/10</span>
          </p>
          <p className="hud-label">
            MALUS <span className="text-alert">-{state.penalties}</span>
          </p>
        </div>
        {state.disqualified && (
          <p className="tac-blink mt-2 text-xs tracking-[0.15em] text-alert">
            DISQUALIFICATION ACTIVE / SCORE FIGE A 0
          </p>
        )}
      </section>

      {GROUPS.map((g) => (
        <section key={g.key} className="mt-3">
          <div className="flex items-baseline justify-between">
            <h2 className="hud-label">{g.title}</h2>
            <span className="hud-label text-alert">{g.cap} PTS</span>
          </div>
          <ul className="mt-2 space-y-2">
            {OBJECTIFS.filter((o) => o.group === g.key).map((o) => {
              const done = o.id === "safari" ? safari > 0 : !!state.objectives[o.id];
              return (
                <li key={o.id} className="hud-panel p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="hud-label">{o.code}</p>
                      <p className="text-sm text-foreground">{o.label}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-alert">
                      {o.id === "safari" ? `${safari}/${o.points}` : `+${o.points}`} PTS
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{o.detail}</p>
                  {o.id !== "safari" && (
                    <button
                      onClick={() => toggleObjective(o.id)}
                      className={`hud-corners mt-2 w-full border py-2 text-[11px] tracking-[0.15em] ${
                        done
                          ? "border-primary bg-primary/25 text-foreground text-glow"
                          : "border-border bg-secondary/20 text-muted-foreground hover:border-ring"
                      }`}
                      aria-pressed={done}
                    >
                      {done ? "VALIDE PAR LE JURY" : "MARQUER COMME VALIDE"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="mt-4">
        <h2 className="hud-label">BONUS ZERO TRACE & DEPOLLUTION</h2>
        <ul className="hud-panel mt-2 divide-y divide-border/60">
          {BONUS.map((b) => (
            <li key={b.label} className="flex items-start justify-between gap-3 p-3">
              <span className="text-xs text-muted-foreground">{b.label}</span>
              <span className="whitespace-nowrap text-xs text-foreground text-glow">{b.gain}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">

        <h2 className="hud-label">GRILLE DES MALUS & PENALITES</h2>
        <ul className="hud-panel mt-2 divide-y divide-border/60">
          {MALUS.map((m) => (
            <li key={m.label} className="flex items-start justify-between gap-3 p-3">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <span className={`whitespace-nowrap text-xs ${m.fatal ? "text-alert tac-pulse" : "text-alert"}`}>
                {m.cost}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="hud-label">ECUSSONS & GRADES DE L'ORDRE</h2>
        <div className="mt-2 space-y-2">
          {GRADES.map((g) => {
            const current = !g.secret && g.name === grade.name;
            return (
              <article
                key={g.name}
                className={`hud-panel hud-corners p-3 ${current ? "border-primary shadow-hud" : ""}`}
              >
                <div className="flex items-baseline justify-between">
                  <p className={`text-sm ${current ? "text-glow text-foreground" : "text-foreground"}`}>
                    {g.name}
                  </p>
                  <span className="hud-label text-alert">{g.range}</span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{g.profil}</p>
                <p className="hud-label mt-2">RECOMPENSE</p>
                <p className="text-[12px] text-foreground">{g.reward}</p>
                {g.secret && (
                  <p className="mt-2 text-[11px] tracking-[0.15em] text-alert">
                    CONDITION SECRETE / DECOUVRIR LE SECRET ENFOUI DE L'ORDRE
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {doc && (
        <section className="mt-4">
          <h2 className="hud-label">DOCUMENT OFFICIEL PROJETE</h2>
          <article className="hud-panel hud-corners mt-2 border-primary p-3 shadow-hud">
            <p className="hud-label">ORDRE DES PIONNIERS</p>
            <p className="text-glow mt-1 text-sm tracking-[0.18em] text-foreground">{doc.title}</p>
            <p className="mt-2 text-[12px] italic leading-relaxed text-alert">{doc.motto}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{doc.body}</p>
          </article>
        </section>
      )}

      <section className="mt-4">
        <h2 className="hud-label">GRADES NON JOUEURS / ENCADREMENT</h2>
        <div className="mt-2 space-y-2">
          {GRADES_NPC.map((n) => (
            <article key={n.name} className="hud-panel p-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm text-foreground">{n.name}</p>
                <span className="hud-label whitespace-nowrap">{n.thread}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{n.profil}</p>
              <p className="hud-label mt-2">ATTRIBUT</p>
              <p className="text-[12px] text-foreground">{n.attribut}</p>
            </article>
          ))}
        </div>
      </section>



      <p className="hud-label mt-4 text-center">
        VALIDATION FINALE PAR LE JURY / RELEVES APPLICATION FAISANT FOI
      </p>
    </main>
  );
}
