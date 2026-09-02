import { Link, createFileRoute } from "@tanstack/react-router";

import { fmtDateTime, useOps } from "@/lib/ops";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "QG Root - Dashboard Maitre du Jeu" },
      {
        name: "description",
        content:
          "Dashboard administrateur de l'operation Whiteout : supervision LoRa, run de terrain, jury et pilotage de la Tempete.",
      },
      { property: "og:title", content: "QG Root - Dashboard Maitre du Jeu" },
      {
        property: "og:description",
        content: "Console de pilotage de l'epreuve 24H en foret de Gresigne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminHome,
});

const TILES = [
  { to: "/admin/supervision", title: "SUPERVISION", desc: "Positions GPS, temps de reaction et historique des contraintes de zone." },
  { to: "/admin/run", title: "RUN DE TERRAIN", desc: "Initialisation des terminaux, chronometre et downlinks LoRa programmes." },
  { to: "/admin/jury", title: "JURY", desc: "Tableau des equipes, releves GPS, photos de bivouac et diplomes." },
] as const;

function AdminHome() {
  const ops = useOps();
  const ready = ops.teams.filter((t) => t.initialized).length;
  const pending = ops.downlinks.filter((d) => !d.sent).length;

  return (
    <>
      <header className="hud-panel mb-3 p-3">
        <h1 className="text-sm tracking-[0.2em] text-glow">QUARTIER GENERAL - VAOUR</h1>
        <p className="text-[10px] text-muted-foreground">
          Interface Root reservee au maitre du jeu. Aucune donnee n'est visible depuis les terminaux joueurs.
        </p>
      </header>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="EQUIPES" value={String(ops.teams.length)} />
        <Tile label="TERMINAUX ARMES" value={`${ready}/${ops.teams.length}`} />
        <Tile label="DOWNLINKS EN FILE" value={String(pending)} />
        <Tile
          label="CHRONO"
          value={ops.run.started && ops.run.startedAt ? fmtDateTime(ops.run.startedAt) : "NON LANCE"}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="hud-panel block p-3 hover:border-primary">
            <h2 className="text-xs tracking-[0.2em] text-glow">{t.title}</h2>
            <p className="mt-1 text-[10px] text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-panel p-2">
      <p className="text-[9px] tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="text-sm text-glow">{value}</p>
    </div>
  );
}
