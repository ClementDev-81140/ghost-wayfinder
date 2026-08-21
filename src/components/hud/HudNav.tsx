import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/", label: "HUD" },
  { to: "/quetes", label: "QUETES" },
  { to: "/codex", label: "CODEX" },
  { to: "/photo", label: "PHOTO" },
  { to: "/lore", label: "LORE" },
  { to: "/bareme", label: "BAREME" },
] as const;

export function HudNav() {
  return (
    <nav className="grid grid-cols-3 gap-2 sm:grid-cols-6 py-2">
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
    </nav>
  );
}
