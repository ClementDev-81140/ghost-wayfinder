import { Link, useNavigate } from "@tanstack/react-router";

import { logout, useSession } from "@/lib/auth";

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
  const navigate = useNavigate();
  const session = useSession();

  return (
    <nav className="py-2">
      <div className="mb-2 flex items-center justify-between text-[10px] tracking-[0.15em] text-muted-foreground">
        <span className="text-glow">
          {session ? `${session.name} - ${session.team}` : "TERMINAL NON IDENTIFIE"}
        </span>
        <button
          onClick={() => {
            logout();
            navigate({ to: "/connexion", replace: true });
          }}
          className="border border-border px-2 py-0.5 text-muted-foreground hover:text-foreground"
        >
          FIN DE SESSION
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            className="hud-corners border border-border bg-secondary/20 py-2 text-center text-[10px] tracking-[0.12em] text-muted-foreground hover:border-neon/70 hover:bg-primary/15 hover:text-neon hover:text-glow"
            activeProps={{
              className:
                "hud-corners btn-neon bg-primary/20 py-2 text-center text-[10px] tracking-[0.12em] text-glow tac-flicker",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <Link
          to="/connexion"
          className="border border-destructive/60 px-3 py-1 text-[10px] tracking-[0.18em] text-destructive hover:bg-destructive/15"
        >
          ACCES ROOT / QG
        </Link>
      </div>
    </nav>
  );
}
