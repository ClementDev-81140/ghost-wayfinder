type Props = {
  uplinkIn: number;
  lastDownlink: string;
  rssi: number;
  battery: number;
  gpsIn: number;
};

function Row({ k, v, alert }: { k: string; v: string; alert?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="hud-label">{k}</span>
      <span className={alert ? "text-alert tabular-nums" : "text-foreground tabular-nums"}>{v}</span>
    </div>
  );
}

export function LoraPanel({ uplinkIn, lastDownlink, rssi, battery, gpsIn }: Props) {
  return (
    <div className="hud-panel p-3">
      <div className="flex items-center justify-between">
        <span className="hud-label">LIAISON LORA 868 MHZ</span>
        <span className="text-xs text-primary-foreground">BLE / TTGO T-BEAM</span>
      </div>
      <div className="mt-2 divide-y divide-border/50">
        <Row k="Uplink 8 octets" v={`T-${uplinkIn}s`} />
        <Row k="Dernier downlink" v={lastDownlink} />
        <Row k="RSSI" v={`${rssi} dBm`} alert={rssi < -110} />
        <Row k="GPS cyclique 30s" v={`T-${gpsIn}s`} />
        <Row k="Batterie durcie" v={`${battery}%`} alert={battery < 20} />
        <Row k="Reseau civil" v="AUCUN / OFFLINE-FIRST" />
      </div>
    </div>
  );
}