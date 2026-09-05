import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import {
  addMission,
  removeMission,
  resetMissions,
  updateMission,
  useOps,
  type Mission,
  type MissionType,
} from "@/lib/ops";
import { formatCoord, latLonToXY, xyToLatLon } from "@/lib/tempete";

export const Route = createFileRoute("/admin/missions")({
  head: () => ({
    meta: [
      { title: "Missions - Placement GPS des objectifs" },
      {
        name: "description",
        content:
          "Carte de placement des missions principales et secondaires : le maitre du jeu pose chaque objectif sur un point GPS reel de la Gresigne.",
      },
      { property: "og:title", content: "Missions - Operation Whiteout" },
      {
        property: "og:description",
        content: "Placement GPS des missions principales et secondaires sur la carte du massif.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MissionsPage,
});

const TYPES: MissionType[] = ["PRINCIPALE", "SECONDAIRE"];

function MissionsPage() {
  const ops = useOps();
  const missions = ops.missions ?? [];
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(missions[0]?.id ?? null);
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState({
    code: "",
    title: "",
    type: "SECONDAIRE" as MissionType,
    points: 5,
    brief: "",
  });

  const current = missions.find((m) => m.id === selected) ?? null;

  function pointFromEvent(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    return xyToLatLon({ x, y });
  }

  function handleMapClick(e: React.MouseEvent<SVGSVGElement>) {
    const { lat, lon } = pointFromEvent(e);
    if (placing) {
      addMission({
        code: draft.code.trim().toUpperCase() || "MISSION",
        title: draft.title.trim() || "Nouvel objectif",
        type: draft.type,
        points: Number(draft.points) || 0,
        brief: draft.brief.trim(),
        lat,
        lon,
        active: true,
      });
      setPlacing(false);
      setDraft({ code: "", title: "", type: "SECONDAIRE", points: 5, brief: "" });
      return;
    }
    if (current) updateMission(current.id, { lat, lon });
  }

  return (
    <>
      <header className="hud-panel mb-3 p-3">
        <h1 className="text-sm tracking-[0.2em] text-glow">PLACEMENT DES MISSIONS</h1>
        <p className="text-[10px] text-muted-foreground">
          Selectionner une mission puis cliquer sur la carte pour fixer son point GPS. Les coordonnees sont reelles
          (Foret Domaniale de la Gresigne).
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <div className="hud-panel relative aspect-square w-full overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full cursor-crosshair text-primary"
            onClick={handleMapClick}
          >
            {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((g) => (
              <g key={g} opacity="0.18">
                <line x1={g} y1="0" x2={g} y2="100" stroke="currentColor" strokeWidth="0.25" />
                <line x1="0" y1={g} x2="100" y2={g} stroke="currentColor" strokeWidth="0.25" />
              </g>
            ))}
            <path
              d="M8 74 C 22 58, 30 70, 44 52 S 68 44, 78 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.45"
            />
            <path
              d="M4 40 C 20 36, 34 46, 52 34 S 82 38, 96 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              opacity="0.3"
            />

            {missions.map((m) => {
              const p = latLonToXY(m.lat, m.lon);
              const isSel = m.id === selected;
              const color = m.type === "PRINCIPALE" ? "oklch(0.7 0.19 45)" : "currentColor";
              return (
                <g
                  key={m.id}
                  opacity={m.active ? 1 : 0.35}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(m.id);
                    setPlacing(false);
                  }}
                >
                  {isSel && (
                    <circle
                      cx={p.x * 100}
                      cy={p.y * 100}
                      r="5"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.5"
                      className="tac-pulse"
                    />
                  )}
                  {m.type === "PRINCIPALE" ? (
                    <rect
                      x={p.x * 100 - 2.2}
                      y={p.y * 100 - 2.2}
                      width="4.4"
                      height="4.4"
                      fill={isSel ? color : "none"}
                      fillOpacity={0.35}
                      stroke={color}
                      strokeWidth="0.6"
                    />
                  ) : (
                    <circle
                      cx={p.x * 100}
                      cy={p.y * 100}
                      r="2.2"
                      fill={isSel ? color : "none"}
                      fillOpacity={0.35}
                      stroke={color}
                      strokeWidth="0.6"
                    />
                  )}
                  <text x={p.x * 100 + 3.2} y={p.y * 100 + 1.4} fontSize="2.8" fill="currentColor" className="font-mono">
                    {m.code}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-2">
            <span className="hud-label">CARTE GRESIGNE / PLACEMENT GPS</span>
            <span className="hud-label text-destructive">
              {placing ? "CLIQUER POUR POSER" : current ? `DEPLACE ${current.code}` : "AUCUNE SELECTION"}
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-2">
            <span className="hud-label">CARRE = PRINCIPALE</span>
            <span className="hud-label">CERCLE = SECONDAIRE</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="hud-panel p-3">
            <div className="flex items-baseline justify-between">
              <span className="hud-label">NOUVELLE MISSION</span>
              <button
                type="button"
                onClick={() => resetMissions()}
                className="border border-border px-2 py-1 text-[9px] tracking-[0.16em] text-muted-foreground hover:text-foreground"
              >
                REINITIALISER
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                placeholder="CODE"
                className="border border-border bg-background px-2 py-1 text-xs"
              />
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as MissionType })}
                className="border border-border bg-background px-2 py-1 text-xs"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="INTITULE"
                className="col-span-2 border border-border bg-background px-2 py-1 text-xs"
              />
              <input
                type="number"
                value={draft.points}
                onChange={(e) => setDraft({ ...draft, points: Number(e.target.value) })}
                placeholder="POINTS"
                className="border border-border bg-background px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  setPlacing(true);
                  setSelected(null);
                }}
                className="btn-neon px-2 py-1 text-[10px] tracking-[0.16em]"
              >
                {placing ? "EN ATTENTE DU CLIC..." : "POSER SUR LA CARTE"}
              </button>
              <textarea
                value={draft.brief}
                onChange={(e) => setDraft({ ...draft, brief: e.target.value })}
                placeholder="BRIEFING"
                rows={2}
                className="col-span-2 border border-border bg-background px-2 py-1 text-xs"
              />
            </div>
          </div>

          <div className="hud-panel p-3">
            <span className="hud-label">MISSIONS DEPLOYEES</span>
            <ul className="mt-2 divide-y divide-border/60">
              {missions.map((m) => (
                <MissionRow key={m.id} m={m} selected={m.id === selected} onSelect={() => setSelected(m.id)} />
              ))}
              {missions.length === 0 && (
                <li className="py-3 text-xs text-destructive">AUCUNE MISSION ENREGISTREE</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function MissionRow({ m, selected, onSelect }: { m: Mission; selected: boolean; onSelect: () => void }) {
  return (
    <li className={`py-2 ${selected ? "bg-primary/10" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={onSelect} className="flex-1 text-left">
          <span className="text-xs text-glow">{m.code}</span>
          <span className="ml-2 text-xs text-foreground">{m.title}</span>
          <span className="ml-2 text-[9px] tracking-[0.16em] text-muted-foreground">{m.type}</span>
        </button>
        <span className="tabular-nums text-xs text-primary-foreground">+{m.points}</span>
        <button
          type="button"
          onClick={() => updateMission(m.id, { active: !m.active })}
          className="border border-border px-2 py-1 text-[9px] tracking-[0.14em] text-muted-foreground hover:text-foreground"
        >
          {m.active ? "ACTIVE" : "INACTIVE"}
        </button>
        <button
          type="button"
          onClick={() => removeMission(m.id)}
          className="border border-destructive/60 px-2 py-1 text-[9px] tracking-[0.14em] text-destructive"
        >
          SUPPR
        </button>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
        <span className="tabular-nums">{formatCoord(m.lat, "lat")}</span>
        <span className="tabular-nums">{formatCoord(m.lon, "lon")}</span>
        <input
          type="number"
          step="0.0001"
          value={m.lat}
          onChange={(e) => updateMission(m.id, { lat: Number(e.target.value) })}
          className="w-24 border border-border bg-background px-1 py-0.5 text-[10px]"
        />
        <input
          type="number"
          step="0.0001"
          value={m.lon}
          onChange={(e) => updateMission(m.id, { lon: Number(e.target.value) })}
          className="w-24 border border-border bg-background px-1 py-0.5 text-[10px]"
        />
      </div>
      {m.brief && <p className="mt-1 text-[10px] text-muted-foreground">{m.brief}</p>}
    </li>
  );
}
