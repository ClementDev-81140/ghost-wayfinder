import { formatCoord } from "@/lib/tempete";

type Props = {
  lat: number;
  lon: number;
  onCancel: () => void;
};

export function SosOverlay({ lat, lon, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-4 overflow-y-auto bg-background/98 p-5">
      <div className="border-2 border-alert p-3 text-center shadow-alert">
        <p className="text-alert text-2xl tracking-[0.3em] tac-pulse">SOS ACTIF</p>
        <p className="hud-label mt-1">TRAME LORA CHIFFREE EMISE - 868 MHZ - 22 DBM</p>
      </div>

      <div className="hud-panel p-4">
        <p className="hud-label">POSITION GPS TEMPS REEL</p>
        <p className="mt-2 text-xl text-alert">{formatCoord(lat, "lat")}</p>
        <p className="text-xl text-alert">{formatCoord(lon, "lon")}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {lat.toFixed(6)} / {lon.toFixed(6)}
        </p>
      </div>

      <div className="hud-panel p-4 text-sm leading-relaxed">
        <p className="hud-label mb-2">CONSIGNES DE SECURITE REELLES</p>
        <ol className="list-decimal space-y-1 pl-5 text-foreground">
          <li>Rester groupes, ne pas quitter la position transmise.</li>
          <li>Rendre la position visible : lampe frontale vers le ciel.</li>
          <li>Chronometre de jeu suspendu, application figee.</li>
          <li>Le QG de Vaour accuse reception sous 3 minutes (downlink 4 octets).</li>
          <li>Urgence vitale : 112 / Secours en foret 18.</li>
        </ol>
      </div>

      <button
        onClick={onCancel}
        className="mt-auto border border-border py-3 text-sm tracking-[0.2em] text-muted-foreground"
      >
        ANNULER LE SOS (QG UNIQUEMENT)
      </button>
    </div>
  );
}