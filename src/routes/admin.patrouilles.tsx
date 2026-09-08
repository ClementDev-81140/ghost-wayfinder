import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  TEAM_COLORS,
  addTeam,
  duplicateTeam,
  logEvent,
  removeTeam,
  teamTotals,
  updateTeam,
  useOps,
} from "@/lib/ops";

export const Route = createFileRoute("/admin/patrouilles")({
  head: () => ({
    meta: [
      { title: "Gestion des Patrouilles - QG Operation Whiteout" },
      {
        name: "description",
        content:
          "Creer, renommer et armer les patrouilles de joueurs : effectifs, terminaux LoRa, couleurs de suivi et notes du maitre du jeu.",
      },
      { property: "og:title", content: "Gestion des Patrouilles" },
      {
        property: "og:description",
        content: "Console du maitre du jeu pour piloter les equipes engagees sur l'epreuve de 24 heures.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PatrouillesPage,
});

function PatrouillesPage() {
  const ops = useOps();
  const [name, setName] = useState("");
  const [terminal, setTerminal] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  function create() {
    const n = name.trim().toUpperCase() || `PATROUILLE ${ops.teams.length + 1}`;
    const term = terminal.trim().toUpperCase() || `TB-ESP32-${String(ops.teams.length + 1).padStart(3, "0")}`;
    addTeam(n, term);
    logEvent({ kind: "SYS", team: n, detail: `Patrouille creee - terminal ${term}` });
    setName("");
    setTerminal("");
  }

  return (
    <>
      <header className="hud-panel mb-3 p-3">
        <h1 className="text-sm tracking-[0.2em] text-glow">GESTION DES PATROUILLES</h1>
        <p className="text-[10px] text-muted-foreground">
          Effectifs, terminaux LoRa 868 MHz, couleurs de suivi carte et etat d'armement.
        </p>
      </header>

      <section className="hud-panel mb-3 grid gap-2 p-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NOM DE LA PATROUILLE"
          className="border border-border bg-background px-2 py-1 text-[10px] uppercase"
        />
        <input
          value={terminal}
          onChange={(e) => setTerminal(e.target.value)}
          placeholder="TERMINAL (TB-ESP32-004)"
          className="border border-border bg-background px-2 py-1 text-[10px] uppercase"
        />
        <button onClick={create} className="btn-neon px-3 py-1 text-[10px] tracking-[0.15em]">
          + ENGAGER LA PATROUILLE
        </button>
      </section>

      <div className="space-y-2">
        {ops.teams.map((t) => {
          const totals = teamTotals(t, ops.audit);
          const expanded = open === t.id;
          return (
            <section key={t.id} className="hud-panel p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  aria-hidden
                  className="h-3 w-3 border border-border"
                  style={{ background: t.color }}
                />
                <input
                  value={t.name}
                  onChange={(e) => updateTeam(t.id, { name: e.target.value.toUpperCase() })}
                  className="flex-1 min-w-40 border border-border bg-background px-2 py-1 text-[11px] tracking-[0.12em] text-glow"
                />
                <input
                  value={t.terminal}
                  onChange={(e) => updateTeam(t.id, { terminal: e.target.value.toUpperCase() })}
                  className="w-40 border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground"
                />
                <button
                  onClick={() => {
                    updateTeam(t.id, { initialized: !t.initialized });
                    logEvent({
                      kind: "SYS",
                      team: t.name,
                      detail: t.initialized ? "Terminal desarme" : "Terminal arme",
                    });
                  }}
                  className={`border px-2 py-1 text-[9px] tracking-[0.15em] ${
                    t.initialized
                      ? "border-primary bg-primary/20 text-glow"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {t.initialized ? "ARME" : "NON ARME"}
                </button>
                <span className="text-[10px] text-muted-foreground">
                  {t.members.length} MEMBRES - {totals.total} PTS
                </span>
                <button
                  onClick={() => setOpen(expanded ? null : t.id)}
                  className="border border-border px-2 py-1 text-[9px] text-muted-foreground"
                >
                  {expanded ? "REPLIER" : "DETAIL"}
                </button>
              </div>

              {expanded && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <h3 className="mb-1 text-[9px] tracking-[0.2em] text-muted-foreground">EFFECTIF</h3>
                    <div className="space-y-1">
                      {t.members.map((m, i) => (
                        <div key={i} className="flex gap-1">
                          <input
                            value={m}
                            onChange={(e) => {
                              const next = [...t.members];
                              next[i] = e.target.value.toUpperCase();
                              updateTeam(t.id, { members: next });
                            }}
                            className="flex-1 border border-border bg-background px-2 py-1 text-[10px]"
                          />
                          <button
                            onClick={() =>
                              updateTeam(t.id, { members: t.members.filter((_, j) => j !== i) })
                            }
                            className="border border-destructive/60 px-2 text-[9px] text-destructive"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => updateTeam(t.id, { members: [...t.members, "NOUVEAU PIONNIER"] })}
                        className="border border-border px-2 py-1 text-[9px] text-muted-foreground"
                      >
                        + AJOUTER UN PIONNIER
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 text-[9px] tracking-[0.2em] text-muted-foreground">
                      COULEUR DE SUIVI
                    </h3>
                    <div className="mb-3 flex gap-1">
                      {TEAM_COLORS.map((c) => (
                        <button
                          key={c}
                          aria-label={`Couleur ${c}`}
                          onClick={() => updateTeam(t.id, { color: c })}
                          className={`h-5 w-5 border ${t.color === c ? "border-primary" : "border-border"}`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <h3 className="mb-1 text-[9px] tracking-[0.2em] text-muted-foreground">
                      NOTES DU MAITRE DU JEU
                    </h3>
                    <textarea
                      value={t.notes}
                      onChange={(e) => updateTeam(t.id, { notes: e.target.value })}
                      rows={3}
                      className="w-full border border-border bg-background px-2 py-1 text-[10px]"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => duplicateTeam(t.id)}
                        className="border border-border px-2 py-1 text-[9px] text-muted-foreground"
                      >
                        DUPLIQUER
                      </button>
                      <button
                        onClick={() => updateTeam(t.id, { fixes: [] })}
                        className="border border-border px-2 py-1 text-[9px] text-muted-foreground"
                      >
                        PURGER LES RELEVES
                      </button>
                      <button
                        onClick={() => removeTeam(t.id)}
                        className="border border-destructive/60 px-2 py-1 text-[9px] text-destructive"
                      >
                        RETIRER
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
