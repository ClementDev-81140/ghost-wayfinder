import { PHASES, SECTORS, isSectorActive, type PhaseId } from "@/lib/tempete";

type Props = {
  phase: PhaseId;
  player: { x: number; y: number };
  outOfZone: boolean;
  selected?: string | null;
  onSelect?: (code: string) => void;
};

const KIND_COLOR: Record<string, string> = {
  QUETE: "oklch(0.7 0.19 45)",
  PNJ: "oklch(0.7 0.19 45)",
  CACHE: "currentColor",
  ARBRE: "currentColor",
  FAUNE: "currentColor",
};

export function TacticalMap({ phase, player, outOfZone, selected, onSelect }: Props) {
  const radius = PHASES[phase].radius;

  return (
    <div className="hud-panel relative aspect-square w-full overflow-hidden">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-primary">
        <defs>
          <pattern id="hachures" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="oklch(0.55 0.2 27)" strokeWidth="1.2" opacity="0.55" />
          </pattern>
          <mask id="outside">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <circle cx="50" cy="50" r={radius * 50} fill="black" />
          </mask>
        </defs>

        {/* relief vectoriel simplifie de la Gresigne */}
        <path
          d="M8 74 C 22 58, 30 70, 44 52 S 68 44, 78 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <path
          d="M4 40 C 20 36, 34 46, 52 34 S 82 38, 96 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.35"
        />
        <path d="M0 86 C 26 80, 40 92, 66 84 S 92 92, 100 88" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />

        {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((g) => (
          <g key={g} opacity="0.18">
            <line x1={g} y1="0" x2={g} y2="100" stroke="currentColor" strokeWidth="0.25" />
            <line x1="0" y1={g} x2="100" y2={g} stroke="currentColor" strokeWidth="0.25" />
          </g>
        ))}

        <rect x="0" y="0" width="100" height="100" fill="url(#hachures)" mask="url(#outside)" />
        <circle
          cx="50"
          cy="50"
          r={radius * 50}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />

        {selected &&
          (() => {
            const t = SECTORS.find((s) => s.code === selected);
            if (!t) return null;
            return (
              <line
                x1={player.x * 100}
                y1={player.y * 100}
                x2={t.x * 100}
                y2={t.y * 100}
                stroke="oklch(0.7 0.19 45)"
                strokeWidth="0.6"
                strokeDasharray="2 1.5"
              />
            );
          })()}

        {SECTORS.map((s) => {
          const active = isSectorActive(s, phase);
          const isSel = selected === s.code;
          return (
            <g
              key={s.code}
              opacity={active ? 1 : 0.35}
              onClick={() => active && onSelect?.(s.code)}
              className={active ? "cursor-pointer" : "cursor-not-allowed"}
            >
              <rect
                x={s.x * 100 - 4}
                y={s.y * 100 - 4}
                width="8"
                height="8"
                fill="transparent"
              />
              {isSel && (
                <rect
                  x={s.x * 100 - 3.6}
                  y={s.y * 100 - 3.6}
                  width="7.2"
                  height="7.2"
                  fill="none"
                  stroke="oklch(0.7 0.19 45)"
                  strokeWidth="0.5"
                  className="tac-pulse"
                />
              )}
              <rect
                x={s.x * 100 - 2}
                y={s.y * 100 - 2}
                width="4"
                height="4"
                fill={isSel ? "oklch(0.7 0.19 45)" : "none"}
                fillOpacity={isSel ? 0.35 : 1}
                stroke={active ? KIND_COLOR[s.kind] ?? "currentColor" : "oklch(0.55 0.2 27)"}
                strokeWidth="0.6"
              />
              <text
                x={s.x * 100 + 3.5}
                y={s.y * 100 + 1.5}
                fontSize="3"
                fill="currentColor"
                className="font-mono"
              >
                {s.code}
              </text>
            </g>
          );
        })}

        <g className={outOfZone ? "text-alert" : "text-foreground"}>
          <circle cx={player.x * 100} cy={player.y * 100} r="2.4" className="fill-current" />
          <circle
            cx={player.x * 100}
            cy={player.y * 100}
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="tac-pulse"
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-2">
        <span className="hud-label">CARTE VECTORIELLE / GRESIGNE</span>
        <span className="hud-label">OFFLINE</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-2">
        <span className="hud-label">ZONE ACTIVE {Math.round(radius * 100)}%</span>
        <span className="hud-label text-destructive">TOUCHER UN CARRE = CAP</span>
      </div>
    </div>
  );
}