import { BOUNDS } from "@/lib/tempete";
import type { Waypoint } from "@/lib/ops";

export type ParsedWaypoint = Omit<Waypoint, "id">;

function clean(v: string) {
  return v.replace(/^["']|["']$/g, "").trim();
}

function valid(lat: number, lon: number) {
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

/** Le point tombe-t-il dans l'emprise cartographiee du massif ? */
export function inBounds(p: { lat: number; lon: number }) {
  return p.lat >= BOUNDS.south && p.lat <= BOUNDS.north && p.lon >= BOUNDS.west && p.lon <= BOUNDS.east;
}

function parseGpx(text: string): ParsedWaypoint[] {
  const out: ParsedWaypoint[] = [];
  const re = /<(wpt|trkpt|rtept)\b[^>]*\blat="([-\d.]+)"[^>]*\blon="([-\d.]+)"[^>]*>([\s\S]*?)<\/\1>|<(wpt|trkpt|rtept)\b[^>]*\blat="([-\d.]+)"[^>]*\blon="([-\d.]+)"[^>]*\/>/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    const lat = Number(m[2] ?? m[6]);
    const lon = Number(m[3] ?? m[7]);
    if (!valid(lat, lon)) continue;
    const body = m[4] ?? "";
    const name = /<name>([\s\S]*?)<\/name>/.exec(body)?.[1]?.trim();
    const desc = /<desc>([\s\S]*?)<\/desc>/.exec(body)?.[1]?.trim();
    i += 1;
    out.push({ name: name || `POINT-${String(i).padStart(2, "0")}`, lat, lon, note: desc || "" });
  }
  return out;
}

function parseJson(text: string): ParsedWaypoint[] {
  const data = JSON.parse(text);
  // GeoJSON
  if (data && data.type === "FeatureCollection" && Array.isArray(data.features)) {
    return data.features
      .filter((f: any) => f?.geometry?.type === "Point")
      .map((f: any, i: number) => ({
        name: String(f.properties?.name ?? f.properties?.nom ?? `POINT-${String(i + 1).padStart(2, "0")}`),
        lat: Number(f.geometry.coordinates[1]),
        lon: Number(f.geometry.coordinates[0]),
        note: String(f.properties?.description ?? f.properties?.note ?? ""),
      }))
      .filter((p: ParsedWaypoint) => valid(p.lat, p.lon));
  }
  const arr = Array.isArray(data) ? data : [];
  return arr
    .map((r: any, i: number) => ({
      name: String(r.name ?? r.nom ?? r.label ?? r.code ?? `POINT-${String(i + 1).padStart(2, "0")}`),
      lat: Number(r.lat ?? r.latitude ?? r.y),
      lon: Number(r.lon ?? r.lng ?? r.longitude ?? r.x),
      note: String(r.note ?? r.desc ?? r.description ?? ""),
    }))
    .filter((p: ParsedWaypoint) => valid(p.lat, p.lon));
}

function parseCsv(text: string): ParsedWaypoint[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const first = lines[0];
  if (!first) return [];

  const sep = first.includes(";") ? ";" : first.includes("\t") ? "\t" : ",";
  const header = first.toLowerCase();
  const hasHeader = /lat/.test(header) && /(lon|lng)/.test(header);

  let iName = 0;
  let iLat = 1;
  let iLon = 2;
  let iNote = 3;

  if (hasHeader) {
    const cols = first.split(sep).map((c) => clean(c).toLowerCase());
    iLat = cols.findIndex((c) => c.startsWith("lat"));
    iLon = cols.findIndex((c) => c.startsWith("lon") || c.startsWith("lng"));
    iName = cols.findIndex((c) => ["name", "nom", "label", "code", "point"].includes(c));
    iNote = cols.findIndex((c) => ["note", "desc", "description", "commentaire"].includes(c));
  }

  const rows = hasHeader ? lines.slice(1) : lines;
  const out: ParsedWaypoint[] = [];
  rows.forEach((line, i) => {
    const cells = line.split(sep).map(clean);
    const lat = Number(cells[iLat]?.replace(",", "."));
    const lon = Number(cells[iLon]?.replace(",", "."));
    if (!valid(lat, lon)) return;
    out.push({
      name: (iName >= 0 ? cells[iName] : "") || `POINT-${String(i + 1).padStart(2, "0")}`,
      lat,
      lon,
      note: (iNote >= 0 ? cells[iNote] : "") || "",
    });
  });
  return out;
}

/** Detecte le format (GPX / GeoJSON / JSON / CSV / colle brut) et renvoie les points */
export function parseWaypoints(text: string): ParsedWaypoint[] {
  const t = text.trim();
  if (!t) return [];
  if (t.startsWith("<")) return parseGpx(t);
  if (t.startsWith("{") || t.startsWith("[")) {
    try {
      return parseJson(t);
    } catch {
      return [];
    }
  }
  return parseCsv(t);
}
