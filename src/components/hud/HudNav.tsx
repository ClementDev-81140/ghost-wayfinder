import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/", label: "HUD" },
  { to: "/quetes", label: "QUETES" },
  { to: "/codex", label: "CODEX" },
  { to: "/photo", label: "PHOTO" },
  { to: "/lore", label: "LORE" },
  { to: "/bareme", label: "BAREME" },
  { to: "/simulateur", label: "MAQUIS" },
] as const;

export function HudNav() {
  return (
    <nav className="py-2">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
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
          to="/admin"
          className="border border-destructive/60 px-3 py-1 text-[10px] tracking-[0.18em] text-destructive hover:bg-destructive/15"
        >
          ACCES ROOT / QG
        </Link>
      </div>
    </nav>
  );
}
