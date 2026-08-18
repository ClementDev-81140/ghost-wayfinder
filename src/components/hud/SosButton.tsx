import { useEffect, useRef, useState } from "react";

type Props = { onArmed: () => void };

export function SosButton({ onArmed }: Props) {
  const [progress, setProgress] = useState(0);
  const [confirming, setConfirming] = useState<0 | 1 | 2>(0);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const start = () => {
    if (confirming > 0) return;
    const started = Date.now();
    timer.current = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / 3000);
      setProgress(p);
      if (p >= 1) {
        if (timer.current) window.clearInterval(timer.current);
        setProgress(0);
        setConfirming(1);
      }
    }, 50);
  };

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    setProgress(0);
  };

  if (confirming > 0) {
    return (
      <div className="hud-panel absolute right-0 top-12 z-40 w-56 border-alert p-3 shadow-alert">
        <p className="hud-label text-alert">
          CONFIRMATION {confirming}/2
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {confirming === 1 ? "Declencher l'alerte de detresse ?" : "Confirmer l'emission radio 22 dBm ?"}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => (confirming === 1 ? setConfirming(2) : (setConfirming(0), onArmed()))}
            className="flex-1 bg-alert py-2 text-xs tracking-widest text-alert-foreground"
          >
            OUI
          </button>
          <button
            onClick={() => setConfirming(0)}
            className="flex-1 border border-border py-2 text-xs tracking-widest text-muted-foreground"
          >
            NON
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onContextMenu={(e) => e.preventDefault()}
      className="relative h-11 w-20 select-none overflow-hidden border-2 border-alert text-sm tracking-[0.2em] text-alert"
      aria-label="Bouton SOS, appui long 3 secondes"
    >
      <span
        className="absolute inset-y-0 left-0 bg-alert/30"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative">SOS</span>
    </button>
  );
}