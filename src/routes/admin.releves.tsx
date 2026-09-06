import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import {
  applyWaypointsToBalises,
  clearWaypoints,
  importWaypoints,
  removeWaypoint,
  useOps,
  waypointToMission,
} from "@/lib/ops";
import { inBounds, parseWaypoints, type ParsedWaypoint } from "@/lib/waypoints";
import { BOUNDS, latLonToXY } from "@/lib/tempete";

export const Route = createFileRoute("/admin/releves")({
  head: () => ({
    meta: [
      { title: "Releves GPS - QG Whiteout" },
      {
        name: "description",
        content:
          "Importer ses propres points GPS de la Foret de Gresigne (GPX, CSV, GeoJSON) pour actualiser la carte tactique de l'operation.",
      },
      { property: "og:title", content: "Releves GPS - QG Whiteout" },
      {
        property: "og:description",
        content: "Chargement des relevés terrain et mise a jour des balises de la carte.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RelevesPage,
});

const SAMPLE = `nom;lat;lon;note
Cache Charbonnier;44.0619;1.6906;charbonniere versant ouest
Guet de Penne;44.0664;1.7375;pied des ruines`;

function RelevesPage() {
  const ops = useOps();
  const waypoints = ops.waypoints ?? [];
  const fileRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState("");
  const [mode, setMode] = useState<"ADD" | "REPLACE">("ADD");
  const [status, setStatus] = useState<string>("");

  const preview = useMemo<ParsedWaypoint[]>(() => parseWaypoints(raw), [raw]);
  const outside = preview.filter((p) => !inBounds(p)).length;

  function onFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setRaw(String(reader.result ?? ""));
      setStatus(`FICHIER CHARGE : ${file.name}`);
    };
    reader.readAsText(file);
  }

  function doImport() {
    if (!preview.length) {
      setStatus("AUCUN POINT EXPLOITABLE DANS LA SOURCE");
      return;
    }
    importWaypoints(preview, mode);
    setStatus(`${preview.length} POINT(S) INTEGRE(S) - CARTE ACTUALISEE`);
    setRaw("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <header className="hud-panel mb-3 p-3">
        <h1 className="text-sm tracking-[0.2em] text-glow">RELEVES GPS - GRESIGNE</h1>
        <p className="text-[10px] text-muted-foreground">
          Charge tes propres points terrain (GPX, CSV, GeoJSON) : ils apparaissent immediatement sur la carte
          tactique des joueurs. Emprise cartographiee : {BOUNDS.south} / {BOUNDS.north} N, {BOUNDS.west} /{" "}
          {BOUNDS.east} E.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="hud-panel p-3">
          <h2 className="text-xs tracking-[0.2em] text-glow">SOURCE</h2>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".gpx,.csv,.txt,.json,.geojson"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              className="text-[10px] text-muted-foreground file:mr-2 file:border file:border-border file:bg-secondary/30 file:px-2 file:py-1 file:text-[10px] file:text-foreground"
            />
            <button
              type="button"
              onClick={() => setRaw(SAMPLE)}
              className="border border-border px-2 py-1 text-[10px] tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              EXEMPLE
            </button>
          </div>

          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={"nom;lat;lon;note\nou colle un GPX / GeoJSON"}
            className="mt-2 w-full border border-border bg-background/60 p-2 font-mono text-[10px] text-foreground outline-none focus:border-ring"
          />

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {(["ADD", "REPLACE"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  mode === m
                    ? "btn-neon border border-primary bg-primary/20 px-2 py-1 text-[10px] tracking-[0.14em] text-foreground"
                    : "border border-border px-2 py-1 text-[10px] tracking-[0.14em] text-muted-foreground hover:text-foreground"
                }
              >
                {m === "ADD" ? "AJOUTER" : "REMPLACER"}
              </button>
            ))}
            <button
              type="button"
              onClick={doImport}
              className="btn-neon border border-primary bg-primary/20 px-3 py-1 text-[10px] tracking-[0.16em] text-foreground"
            >
              INTEGRER {preview.length ? `(${preview.length})` : ""}
            </button>
          </div>

          <p className="mt-2 text-[10px] text-muted-foreground">
            {status || "Formats acceptes : GPX (wpt/trkpt), CSV avec entete lat/lon, GeoJSON, JSON."}
          </p>
          {outside > 0 && (
            <p className="text-[10px] text-destructive">
              {outside} point(s) hors emprise cartographiee : ils seront ignores a l'affichage.
            </p>
          )}
        </section>

        <section className="hud-panel p-3">
          <h2 className="text-xs tracking-[0.2em] text-glow">APERCU CARTE</h2>
          <div className="mt-2 aspect-square w-full border border-border">
            <svg viewBox="0 0 100 100" className="h-full w-full text-primary">
              {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((g) => (
                <g key={g} opacity="0.18">
                  <line x1={g} y1="0" x2={g} y2="100" stroke="currentColor" strokeWidth="0.25" />
                  <line x1="0" y1={g} x2="100" y2={g} stroke="currentColor" strokeWidth="0.25" />
                </g>
              ))}
              {waypoints.filter(inBounds).map((w) => {
                const p = latLonToXY(w.lat, w.lon);
                return (
                  <g key={w.id}>
                    <path
                      d={`M${p.x * 100 - 2} ${p.y * 100} h4 M${p.x * 100} ${p.y * 100 - 2} v4`}
                      stroke="oklch(0.7 0.19 45)"
                      strokeWidth="0.6"
                    />
                    <text x={p.x * 100 + 2.5} y={p.y * 100 + 1.2} fontSize="2.6" fill="currentColor">
                      {w.name.slice(0, 14)}
                    </text>
                  </g>
                );
              })}
              {preview.filter(inBounds).map((w, i) => {
                const p = latLonToXY(w.lat, w.lon);
                return (
                  <circle
                    key={`p${i}`}
                    cx={p.x * 100}
                    cy={p.y * 100}
                    r="1.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="1 1"
                  />
                );
              })}
            </svg>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Croix orange : releves integres. Cercles pointilles : previsualisation avant integration.
          </p>
        </section>
      </div>

      <section className="hud-panel mt-3 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs tracking-[0.2em] text-glow">RELEVES INTEGRES ({waypoints.length})</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyWaypointsToBalises()}
              className="btn-neon border border-primary bg-primary/20 px-2 py-1 text-[10px] tracking-[0.14em] text-foreground"
            >
              REMPLACER LES BALISES
            </button>
            <button
              type="button"
              onClick={() => clearWaypoints()}
              className="border border-border px-2 py-1 text-[10px] tracking-[0.14em] text-destructive hover:border-destructive"
            >
              TOUT EFFACER
            </button>
          </div>
        </div>

        {waypoints.length === 0 ? (
          <p className="mt-2 text-[10px] text-muted-foreground">Aucun releve charge pour l'instant.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1">NOM</th>
                  <th>LAT</th>
                  <th>LON</th>
                  <th>NOTE</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {waypoints.map((w) => (
                  <tr key={w.id} className="border-t border-border/60">
                    <td className="py-1 pr-2">{w.name}</td>
                    <td className="pr-2">{w.lat.toFixed(5)}</td>
                    <td className="pr-2">{w.lon.toFixed(5)}</td>
                    <td className="pr-2 text-muted-foreground">{w.note}</td>
                    <td className="py-1">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => waypointToMission(w.id, "PRINCIPALE")}
                          className="border border-border px-2 py-0.5 hover:border-ring"
                        >
                          MISSION P
                        </button>
                        <button
                          type="button"
                          onClick={() => waypointToMission(w.id, "SECONDAIRE")}
                          className="border border-border px-2 py-0.5 hover:border-ring"
                        >
                          MISSION S
                        </button>
                        <button
                          type="button"
                          onClick={() => removeWaypoint(w.id)}
                          className="border border-border px-2 py-0.5 text-destructive hover:border-destructive"
                        >
                          SUPPR
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
