import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/admin", label: "QG", exact: true },
  { to: "/admin/supervision", label: "SUPERVISION", exact: false },
  { to: "/admin/missions", label: "MISSIONS", exact: false },
  { to: "/admin/run", label: "RUN TERRAIN", exact: false },
  { to: "/admin/jury", label: "JURY", exact: false },
  { to: "/admin/releves", label: "RELEVES GPS", exact: false },
] as const;

export function AdminNav() {
  return (
    <nav className="py-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.exact }}
            className="hud-corners border border-border bg-secondary/20 py-2 text-center text-[10px] tracking-[0.12em] text-muted-foreground hover:border-ring hover:bg-primary/15 hover:text-foreground"
            activeProps={{
              className:
                "hud-corners border border-primary bg-primary/25 py-2 text-center text-[10px] tracking-[0.12em] text-foreground shadow-hud text-glow",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <Link
          to="/"
          className="border border-border px-3 py-1 text-[10px] tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          RETOUR INTERFACE JOUEUR
        </Link>
      </div>
    </nav>
  );
}
