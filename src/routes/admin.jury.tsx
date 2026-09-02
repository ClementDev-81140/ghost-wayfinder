import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { gradeFor } from "@/lib/bareme";
import { addTeam, fmtDateTime, updateTeam, useOps, type Team } from "@/lib/ops";
import { formatCoord } from "@/lib/tempete";

export const Route = createFileRoute("/admin/jury")({
  head: () => ({
    meta: [
      { title: "Page du Jury - Scores, Releves GPS et Diplomes" },
      {
        name: "description",
        content:
          "Page du jury : tableau des equipes avec score, releves GPS, photos de bivouac et impression des diplomes de l'Ordre.",
      },
      { property: "og:title", content: "Page du Jury - Operation Whiteout" },
      { property: "og:description", content: "Audit final des patrouilles et edition des diplomes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JuryPage,
});

function JuryPage() {
  const ops = useOps();
  const [open, setOpen] = useState<string | null>(null);
  const [diploma, setDiploma] = useState<Team | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const ranked = [...ops.teams].sort(
    (a, b) => b.score - b.penalties - (a.score - a.penalties),
  );

  function onPhoto(teamId: string, file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateTeam(teamId, { bivouac: String(reader.result) });
    reader.readAsDataURL(file);
  }

  if (diploma) {
    return <Diploma team={diploma} onBack={() => setDiploma(null)} />;
  }

  return (
    <>
      <header className="hud-panel mb-3 flex flex-wrap items-center justify-between gap-2 p-3">
        <div>
          <h1 className="text-sm tracking-[0.2em] text-glow">AUDIT FINAL - COMMISSION DU JURY</h1>
          <p className="text-[10px] text-muted-foreground">
            Notation sur 100 points, verification des releves GPS et edition des diplomes
          </p>
        </div>
        <button
          onClick={() => {
            const n = ops.teams.length + 1;
            addTeam(`PATROUILLE ${n}`, `TB-ESP32-${String(n).padStart(3, "0")}`);
          }}
          className="border border-border px-3 py-1 text-[10px] tracking-[0.15em] text-muted-foreground"
        >
          + AJOUTER UNE EQUIPE
        </button>
      </header>

      <section className="hud-panel overflow-x-auto p-3">
        <table className="w-full text-left text-[10px]">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-1">RANG</th>
              <th>EQUIPE</th>
              <th>TERMINAL</th>
              <th>SCORE</th>
              <th>MALUS</th>
              <th>TOTAL</th>
              <th>GRADE</th>
              <th>BIVOUAC</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((t, i) => {
              const total = Math.max(0, Math.min(100, t.score - t.penalties));
              return (
                <tr key={t.id} className="border-b border-border/40 align-top">
                  <td className="py-2">{String(i + 1).padStart(2, "0")}</td>
                  <td className="text-glow">{t.name}</td>
                  <td className="text-muted-foreground">{t.terminal}</td>
                  <td>
                    <input
                      type="number"
                      value={t.score}
                      min={0}
                      max={100}
                      onChange={(e) => updateTeam(t.id, { score: Number(e.target.value) })}
                      className="w-14 border border-border bg-background px-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={t.penalties}
                      min={0}
                      onChange={(e) => updateTeam(t.id, { penalties: Number(e.target.value) })}
                      className="w-14 border border-border bg-background px-1"
                    />
                  </td>
                  <td className="text-glow">{total}</td>
                  <td className="text-muted-foreground">{gradeFor(total)?.nom ?? "-"}</td>
                  <td>
                    {t.bivouac ? (
                      <img src={t.bivouac} alt={`Bivouac ${t.name}`} className="h-10 w-14 object-cover" />
                    ) : (
                      <span className="text-muted-foreground">aucune</span>
                    )}
                    <input
                      ref={(el) => {
                        fileRefs.current[t.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onPhoto(t.id, e.target.files?.[0])}
                    />
                    <button
                      onClick={() => fileRefs.current[t.id]?.click()}
                      className="mt-1 block border border-border px-1 text-[9px] text-muted-foreground"
                    >
                      CHARGER
                    </button>
                  </td>
                  <td className="space-y-1">
                    <button
                      onClick={() => setOpen(open === t.id ? null : t.id)}
                      className="block w-full border border-border px-2 py-1 text-[9px] text-muted-foreground"
                    >
                      RELEVES GPS
                    </button>
                    <button
                      onClick={() => setDiploma(t)}
                      className="block w-full border border-primary bg-primary/20 px-2 py-1 text-[9px]"
                    >
                      DIPLOME
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {open && (
        <section className="hud-panel mt-3 p-3">
          <h2 className="mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">
            RELEVES GPS - {ops.teams.find((t) => t.id === open)?.name}
          </h2>
          <ul className="max-h-72 space-y-1 overflow-auto text-[10px] text-muted-foreground">
            {(ops.teams.find((t) => t.id === open)?.fixes ?? []).length === 0 && (
              <li>Aucun uplink enregistre pour cette patrouille.</li>
            )}
            {(ops.teams.find((t) => t.id === open)?.fixes ?? []).map((f, i) => (
              <li key={i} className="flex gap-3 border-b border-border/40 pb-1">
                <span>{fmtDateTime(f.at)}</span>
                <span>{formatCoord(f.lat, "lat")}</span>
                <span>{formatCoord(f.lon, "lon")}</span>
                <span className="ml-auto">BAT {f.battery}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function Diploma({ team, onBack }: { team: Team; onBack: () => void }) {
  const total = Math.max(0, Math.min(100, team.score - team.penalties));
  const grade = gradeFor(total);

  return (
    <>
      <div className="mb-3 flex gap-2 print:hidden">
        <button onClick={onBack} className="border border-border px-3 py-1 text-[10px] text-muted-foreground">
          RETOUR
        </button>
        <button
          onClick={() => window.print()}
          className="border border-primary bg-primary/20 px-3 py-1 text-[10px] tracking-[0.15em]"
        >
          IMPRIMER LE DIPLOME
        </button>
      </div>

      <article className="hud-panel mx-auto max-w-2xl p-8 text-center print:border-none">
        <p className="text-[10px] tracking-[0.35em] text-muted-foreground">ORDRE DES PIONNIERS - MAQUIS TECHNOLOGIQUE</p>
        <h1 className="mt-4 text-xl tracking-[0.25em] text-glow">DIPLOME D'AUDIT FINAL</h1>
        <p className="mt-6 text-[11px] text-muted-foreground">Delivre a la patrouille</p>
        <p className="mt-1 text-lg tracking-[0.2em]">{team.name}</p>
        <p className="mt-6 text-[11px] text-muted-foreground">
          pour avoir accompli l'epreuve de 24 heures en Foret Domaniale de la Gresigne
        </p>
        <div className="mt-6 flex items-center justify-center gap-10">
          <div>
            <p className="text-3xl text-glow">{total}</p>
            <p className="text-[9px] tracking-[0.2em] text-muted-foreground">POINTS / 100</p>
          </div>
          <div>
            <p className="text-lg tracking-[0.15em]">{grade?.nom ?? "NON CLASSE"}</p>
            <p className="text-[9px] tracking-[0.2em] text-muted-foreground">GRADE ATTRIBUE</p>
          </div>
        </div>
        {team.bivouac && (
          <img src={team.bivouac} alt={`Bivouac ${team.name}`} className="mx-auto mt-6 h-40 object-cover" />
        )}
        <p className="mt-8 text-[10px] text-muted-foreground">
          Vaour, le {new Date().toLocaleDateString("fr-FR")} - Terminal {team.terminal}
        </p>
        <p className="mt-1 text-[9px] tracking-[0.2em] text-muted-foreground">SIGNATURE ROOT ______________________</p>
      </article>
    </>
  );
}
