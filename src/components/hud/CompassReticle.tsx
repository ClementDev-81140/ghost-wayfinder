type Props = {
  heading: number;
  lat: number;
  lon: number;
  outOfZone: boolean;
};

const TICKS = Array.from({ length: 36 }, (_, i) => i * 10);

export function CompassReticle({ heading, lat, lon, outOfZone }: Props) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
        <line x1="100" y1="6" x2="100" y2="194" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
        <line x1="6" y1="100" x2="194" y2="100" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
        {TICKS.map((t) => (
          <line
            key={t}
            x1="100"
            y1="8"
            x2="100"
            y2={t % 90 === 0 ? 20 : 14}
            stroke="currentColor"
            strokeWidth={t % 90 === 0 ? 1.4 : 0.6}
            opacity="0.7"
            transform={`rotate(${t} 100 100)`}
          />
        ))}
        <g transform={`rotate(${heading} 100 100)`}>
          <polygon
            points="100,26 106,52 100,46 94,52"
            className={outOfZone ? "fill-alert" : "fill-current"}
          />
        </g>
        <circle cx="100" cy="100" r="3" className={outOfZone ? "fill-alert" : "fill-current"} />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="hud-label">CAP</span>
        <span className="text-3xl tabular-nums text-foreground">
          {String(Math.round(heading)).padStart(3, "0")}&#176;
        </span>
        <span className="text-[11px] text-muted-foreground">{lat.toFixed(5)}</span>
        <span className="text-[11px] text-muted-foreground">{lon.toFixed(5)}</span>
      </div>
    </div>
  );
}