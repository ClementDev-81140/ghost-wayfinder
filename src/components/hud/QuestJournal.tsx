import { SECTORS, isSectorActive, type PhaseId } from "@/lib/tempete";

export function QuestJournal({ phase }: { phase: PhaseId }) {
  const active = SECTORS.filter((s) => isSectorActive(s, phase));
  const purged = SECTORS.length - active.length;

  return (
    <div className="hud-panel p-3">
      <div className="flex items-baseline justify-between">
        <span className="hud-label">JOURNAL DE QUETES</span>
        <span className="hud-label text-destructive">{purged} PURGEE(S)</span>
      </div>
      <ul className="mt-2 divide-y divide-border/60">
        {active.map((s) => (
          <li key={s.code} className="flex items-center justify-between py-2 text-sm">
            <span className="text-muted-foreground">{s.code}</span>
            <span className="flex-1 px-3 text-foreground">{s.enigma}</span>
            <span className="tabular-nums text-primary-foreground">+{s.points}</span>
          </li>
        ))}
        {active.length === 0 && (
          <li className="py-3 text-sm text-destructive">AUCUNE ENIGME ACTIVE</li>
        )}
      </ul>
    </div>
  );
}