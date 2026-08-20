import { useState } from "react";

const MOTIFS = [
  { code: "MED", label: "Blessure legere / soin requis", crit: false },
  { code: "NAV", label: "Equipe desorientee / demande de cap", crit: false },
  { code: "MAT", label: "Panne materiel (LoRa, batterie, lampe)", crit: true },
  { code: "PNJ", label: "Incident avec un PNJ ou un tiers", crit: true },
  { code: "ABD", label: "Demande d'extraction / abandon", crit: true },
] as const;

type Props = { lat: number; lon: number };

export function MessageQg({ lat, lon }: Props) {
  const [open, setOpen] = useState(false);
  const [motif, setMotif] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const reset = () => {
    setOpen(false);
    setMotif(null);
    setDetail("");
    setConfirm(false);
  };

  const send = () => {
    const stamp = new Date().toISOString().slice(11, 19);
    setSentAt(stamp);
    setCooldown(600);
    const id = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    reset();
  };

  const locked = cooldown > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={locked}
        className="h-11 w-20 select-none border-2 border-border text-[11px] leading-tight tracking-[0.12em] text-muted-foreground disabled:opacity-40"
        aria-label="Envoyer un message au QG"
      >
        MSG
        <br />
        QG
      </button>

      {locked && (
        <p className="hud-label absolute -bottom-4 right-0 whitespace-nowrap text-[9px]">
          RELAIS T-{cooldown}s
        </p>
      )}

      {open && (
        <div className="hud-panel absolute right-0 top-12 z-40 w-72 p-3">
          <p className="hud-label text-alert">CANAL QG - USAGE RESTREINT</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Uplink 16 octets prioritaire. Reserve aux besoins reels : chaque envoi est
            horodate et trace par le QG de Vaour. Un seul message par 10 minutes.
          </p>

          {!confirm ? (
            <>
              <div className="mt-3 space-y-1">
                {MOTIFS.map((m) => (
                  <button
                    key={m.code}
                    onClick={() => setMotif(m.code)}
                    className={`flex w-full items-center gap-2 border px-2 py-1.5 text-left text-[11px] ${
                      motif === m.code
                        ? "border-alert text-alert"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <span className="tracking-[0.16em]">{m.code}</span>
                    <span className="flex-1">{m.label}</span>
                    {m.crit && <span className="text-alert">!</span>}
                  </button>
                ))}
              </div>

              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value.slice(0, 120))}
                rows={2}
                placeholder="Precision (120 car. max)"
                className="mt-2 w-full resize-none border border-border bg-transparent p-2 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/60"
              />

              <div className="mt-2 flex gap-2">
                <button
                  disabled={!motif}
                  onClick={() => setConfirm(true)}
                  className="flex-1 border border-alert py-2 text-[11px] tracking-[0.16em] text-alert disabled:opacity-30"
                >
                  PREPARER
                </button>
                <button
                  onClick={reset}
                  className="flex-1 border border-border py-2 text-[11px] tracking-[0.16em] text-muted-foreground"
                >
                  FERMER
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 border border-alert p-2 text-[11px] text-foreground">
                <p className="hud-label text-alert">TRAME A EMETTRE</p>
                <p className="mt-1">MOTIF {motif}</p>
                <p className="text-muted-foreground">{detail || "AUCUNE PRECISION"}</p>
                <p className="mt-1 text-muted-foreground">
                  POS {lat.toFixed(5)} / {lon.toFixed(5)}
                </p>
              </div>
              <p className="mt-2 text-[11px] text-alert">
                Confirmer l'envoi ? Message injustifie = -5 pts.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={send}
                  className="flex-1 bg-alert py-2 text-[11px] tracking-[0.16em] text-alert-foreground"
                >
                  EMETTRE
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  className="flex-1 border border-border py-2 text-[11px] tracking-[0.16em] text-muted-foreground"
                >
                  RETOUR
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {sentAt && !open && (
        <p className="hud-label absolute -bottom-9 right-0 whitespace-nowrap text-[9px] text-alert">
          MSG TRANSMIS {sentAt}
        </p>
      )}
    </div>
  );
}