import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ADMIN_PIN, login } from "@/lib/auth";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion - Operation Whiteout" },
      {
        name: "description",
        content:
          "Identification des terminaux de l'operation Whiteout : acces joueur ou acces maitre du jeu.",
      },
      { property: "og:title", content: "Connexion - Operation Whiteout" },
      { property: "og:description", content: "Choisis ton acces : joueur ou maitre du jeu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConnexionPage,
});

type Mode = "CHOIX" | "JOUEUR" | "ADMIN";

function ConnexionPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("CHOIX");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function loginJoueur(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("INDICATIF REQUIS");
      return;
    }
    login({ role: "JOUEUR", name: name.trim().toUpperCase(), team: team.trim().toUpperCase() || "SANS EQUIPE" });
    navigate({ to: "/" });
  }

  function loginAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (pin !== ADMIN_PIN) {
      setError("CODE REFUSE - TENTATIVE CONSIGNEE");
      setPin("");
      return;
    }
    login({ role: "ADMIN", name: "MAITRE DU JEU", team: "QG VAOUR" });
    navigate({ to: "/admin" });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 tac-boot">
      <header className="hud-panel mb-4 p-4 text-center">
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground">FORET DE GRESIGNE - EPREUVE 24H</p>
        <h1 className="mt-1 text-lg tracking-[0.25em] text-glow tac-flicker">OPERATION WHITEOUT</h1>
        <p className="mt-1 text-[10px] text-muted-foreground">Terminal securise - identification obligatoire</p>
      </header>

      {mode === "CHOIX" && (
        <div className="grid gap-3">
          <button
            onClick={() => {
              setMode("JOUEUR");
              setError("");
            }}
            className="hud-corners btn-neon border border-primary bg-primary/15 p-4 text-left hover:bg-primary/30"
          >
            <p className="text-sm tracking-[0.2em] text-glow">JOUEUR</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Terminal de terrain : HUD, quetes, codex, photo, simulateur Maquis.
            </p>
          </button>
          <button
            onClick={() => {
              setMode("ADMIN");
              setError("");
            }}
            className="hud-corners border border-destructive/60 bg-destructive/10 p-4 text-left hover:bg-destructive/20"
          >
            <p className="text-sm tracking-[0.2em] text-destructive">ADMIN / MAITRE DU JEU</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Quartier general : supervision, run de terrain, missions, jury. Code requis.
            </p>
          </button>
        </div>
      )}

      {mode === "JOUEUR" && (
        <form onSubmit={loginJoueur} className="hud-panel p-4">
          <h2 className="text-xs tracking-[0.2em] text-glow">ACCES JOUEUR</h2>
          <label className="mt-3 block text-[10px] tracking-[0.15em] text-muted-foreground">
            INDICATIF (NOM D'AGENT)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              className="mt-1 w-full border border-border bg-background/60 px-2 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="EX. FAUCON-2"
            />
          </label>
          <label className="mt-3 block text-[10px] tracking-[0.15em] text-muted-foreground">
            EQUIPE
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              maxLength={24}
              className="mt-1 w-full border border-border bg-background/60 px-2 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="EX. MAQUIS NORD"
            />
          </label>
          {error && <p className="mt-2 text-[10px] tracking-[0.15em] text-glow-alert">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-neon flex-1 border border-primary bg-primary/20 py-2 text-xs tracking-[0.2em]">
              INITIALISER LE TERMINAL
            </button>
            <button
              type="button"
              onClick={() => setMode("CHOIX")}
              className="border border-border px-3 py-2 text-[10px] tracking-[0.15em] text-muted-foreground hover:text-foreground"
            >
              RETOUR
            </button>
          </div>
        </form>
      )}

      {mode === "ADMIN" && (
        <form onSubmit={loginAdmin} className="hud-panel p-4">
          <h2 className="text-xs tracking-[0.2em] text-glow-alert">ACCES ROOT / QG</h2>
          <label className="mt-3 block text-[10px] tracking-[0.15em] text-muted-foreground">
            CODE MAITRE DU JEU
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 w-full border border-border bg-background/60 px-2 py-2 text-sm text-foreground focus:border-destructive focus:outline-none"
              placeholder="****"
              autoFocus
            />
          </label>
          {error && <p className="mt-2 text-[10px] tracking-[0.15em] text-glow-alert">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="flex-1 border border-destructive bg-destructive/20 py-2 text-xs tracking-[0.2em] text-destructive hover:bg-destructive/30"
            >
              OUVRIR LE QG
            </button>
            <button
              type="button"
              onClick={() => setMode("CHOIX")}
              className="border border-border px-3 py-2 text-[10px] tracking-[0.15em] text-muted-foreground hover:text-foreground"
            >
              RETOUR
            </button>
          </div>
          <p className="mt-3 text-[9px] text-muted-foreground">
            Code par defaut : 868-QG (modifiable dans src/lib/auth.ts)
          </p>
        </form>
      )}
    </main>
  );
}
