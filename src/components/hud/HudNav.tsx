import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/", label: "HUD" },
  { to: "/quetes", label: "QUETES" },
  { to: "/codex", label: "CODEX" },
  { to: "/photo", label: "PHOTO" },
  { to: "/lore", label: "LORE" },
] as const;

export function HudNav() {
  return (
    <nav className="grid grid-cols-5 gap-2 py-2">
      {LINKS.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          activeOptions={{ exact: true }}
          className="border border-border py-2 text-center text-[10px] tracking-[0.12em] text-muted-foreground"
          activeProps={{
            className:
              "border border-primary bg-primary/25 py-2 text-center text-[10px] tracking-[0.12em] text-foreground shadow-hud",
          }}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
