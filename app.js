// Flugwetter-App – Logik: Datenbank + Favoriten, Umkreissuche, Ampel, 3h-Fenster.

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MIN_WINDOW = 3;          // Fenster erst ab so vielen zusammenhängenden Stunden

// Bewertungsstufen fuer die Ampel. Die Stufe kommt aus dem Level im Profil (Einsteiger ->
// vorsichtig, Fortgeschritten -> standard, Erfahren -> erfahren); ohne Profil gilt "standard".
//  windMax/gustMax/dirTol: Grenzen (km/h, km/h, Grad) - darueber grenzwertig bis K.o. (mit Puffer)
//  gruen: ab diesem Anteil von windMax/gustMax ist eine Stunde nicht mehr "gut", sondern gelb
//  gustWarn/gustBad: Boendifferenz (Boen - Mittelwind) ab der gelb bzw. rot wird
const STUFEN = {
  vorsichtig: { label: "Vorsichtig", windMax: 18, gustMax: 26, dirTol: 16, gruen: 0.85, gustWarn: 20, gustBad: 30 },
  standard:   { label: "Standard",   windMax: 20, gustMax: 28, dirTol: 20, gruen: 0.90, gustWarn: 22, gustBad: 32 },
  erfahren:   { label: "Erfahren",   windMax: 24, gustMax: 32, dirTol: 24, gruen: 0.92, gustWarn: 25, gustBad: 35 },
};
const PROFILE = STUFEN.standard;
// Eigenes Profil (Schirm, Level, Heimat ...) - nur auf diesem Geraet, kein Konto
const PROFIL_KEY = "flugwetter_profile";
function ladeProfil() { try { return JSON.parse(localStorage.getItem(PROFIL_KEY)) || {}; } catch { return {}; } }
let profil = ladeProfil();
const LEVEL_STUFE = { einsteiger: "vorsichtig", fortgeschritten: "standard", erfahren: "erfahren" };
function aktuelleStufe() { return LEVEL_STUFE[profil.level] || "standard"; }
// Profi-Modus: erfahrene Piloten koennen eigene Wind-/Boen-/Richtungs-Grenzwerte hinterlegen statt
// der Werte der Stufe (Opt-in in den Einstellungen, Standard: aus fuer alle).
let proMode = localStorage.getItem("flugwetter_promode") === "1";
let proWindMax = parseInt(localStorage.getItem("flugwetter_pro_windmax"), 10) || PROFILE.windMax;
let proGustMax = parseInt(localStorage.getItem("flugwetter_pro_gustmax"), 10) || PROFILE.gustMax;
let proDirTol = parseInt(localStorage.getItem("flugwetter_pro_dirtol"), 10) || PROFILE.dirTol;
function activeProfile() {
  const st = STUFEN[aktuelleStufe()];
  return proMode ? { ...st, windMax: proWindMax, gustMax: proGustMax, dirTol: proDirTol, buffer: true } : { ...st, buffer: true };
}
const DEFAULT_RADIUS = 100;    // km
const MAX_CANDIDATES = 50;    // max. Plätze pro Suche (Performance bei großer DB)
const NAV_ICON = `<svg class="nav-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 L4.5 20.29 L5.21 21 L12 18 L18.79 21 L19.5 20.29 Z"/></svg>`;
// Monochrome Meta-Icons (Fahrzeit / Entfernung)
const IC_CAR = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14M5 13v4m14-4v4M7 17h.01M17 17h.01"/></svg>`;
const IC_PIN = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>`;
const IC_WIND = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.6 4.6a2 2 0 1 1 2 3.4H2"/><path d="M12.6 19.4a2 2 0 1 0 2-3.4H2"/><path d="M17.7 8a2.5 2.5 0 1 1 2 4H2"/></svg>`;
const IC_CABLECAR = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8l20-4"/><rect x="8" y="9" width="8" height="6" rx="1"/><path d="M10 15v3M14 15v3"/></svg>`;
const IC_SAT = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>`;
const IC_PHONE = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>`;
const IC_CLIPBOARD = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V2h6v2"/><path d="M9 10h6M9 14h6"/></svg>`;
const IC_GLOBE = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>`;
// Höhendifferenz-Schwelle, ab der "Thermik grundsätzlich möglich" als plausibel gilt (Standort-Eigenschaft)
const THERMIK_HOEHENDIFF_MIN = 300; // m

// Farb-Verlauf für Grenzwertig-Kacheln (s. rateHour "severity" + dayCardHtml): grün (0, knapp
// grenzwertig) bis gelb (1, kurz vor "nein") statt eines harten Sprungs auf volles Gelb. Für den
// Windsprung-K.o. (nein) geht der Verlauf weiter gelb->rot statt neutralem Grau (s. dayCardHtml).
const COLOR_GOOD = "#22c55e", COLOR_WARN = "#facc15", COLOR_BAD = "#ef4444";
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function lerpHex(hexA, hexB, t) {
  t = clamp01(t);
  const a = [1, 3, 5].map(i => parseInt(hexA.slice(i, i + 2), 16));
  const b = [1, 3, 5].map(i => parseInt(hexB.slice(i, i + 2), 16));
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
}
// Kleinster Abstand (Grad) von dir zum naechsten erlaubten Sektor - 0 wenn dir bereits drin liegt.
function sectorAngleDist(dir, sectors) {
  let best = 180;
  for (const [f, t] of sectors) {
    const span = (t - f + 360) % 360;
    const rel = (dir - f + 360) % 360;
    const d = rel <= span ? 0 : Math.min(rel - span, 360 - rel);
    if (d < best) best = d;
  }
  return best;
}

function degToCompass(deg) {
  const d = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return d[Math.round(deg / 22.5) % 16];
}
function weatherEmoji(code) {
  if (code === 0) return "☀️";
  if (code === 1) return "🌤️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "🌨️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "•";
}
function inSectors(dir, sectors, tol = 0) {
  return sectors.some(([f, t]) => {
    if (tol > 0 && ((t - f + 360) % 360) + 2 * tol >= 360) return true; // aufgeweitet > Vollkreis
    const lo = (f - tol + 360) % 360, hi = (t + tol) % 360;
    return lo <= hi ? (dir >= lo && dir <= hi) : (dir >= lo || dir <= hi);
  });
}
// ---- Sektor-Kompass: grün = erlaubte Windrichtung(en) des Platzes, grau = Rest, Nadel = aktueller Wind ----
function polarPt(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
// Bogen auf dem Ring (gestrichen, nicht gefuellt) - markiert die erlaubten Startrichtungen.
function sectorArcPath(cx, cy, r, from, to) {
  let a1 = to; if (a1 <= from) a1 += 360;
  const span = a1 - from;
  if (span >= 359) {  // Rundumsicht: ein Bogen waere entartet, deshalb voller Kreis
    return `M ${cx} ${(cy - r).toFixed(1)} A ${r} ${r} 0 1 1 ${(cx - 0.01).toFixed(2)} ${(cy - r).toFixed(1)}`;
  }
  const p0 = polarPt(cx, cy, r, from), p1 = polarPt(cx, cy, r, a1);
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}
// opts.neutral -> grau/inaktiv (Standardzustand, bevor eine Stunde angetippt wurde)
// opts.compact -> kleinere Darstellung (für die Zeile neben den Stunden-Pillen)
// opts.needle  -> Nadel im Kreis statt Pfeil ausserhalb (so in den Tageszeilen)
// opts.rating  -> "gut"/"grenz"/"nein" der angetippten Stunde: grün/gelb/rot (nicht nur Richtung, ganze Ampel)
//
// Beide Zeiger-Varianten markieren dieselbe Seite: die, AUS DER der Wind kommt.
// Liegt der Zeiger über dem grünen Bogen, passt die Windrichtung zum Startplatz.
function spotCompassSvg(spot, wd, opts = {}) {
  const cx = 50, cy = 50;
  const needle = !!opts.needle;
  const rRing = 34;
  // Nadel-Variante: Buchstaben aussen um den Ring.
  // Aussen-Pfeil-Variante: Buchstaben INNEN, sonst fraesse der Rand fuer sie den
  // Platz auf und der Pfeil bliebe winzig.
  const labelR = needle ? rRing + 16 : rRing - 14;
  const halb = needle ? labelR + 13 : 62;         // 62 = Pfeilruecken (59) + Rand
  const viewBox = `${50 - halb} ${50 - halb} ${2 * halb} ${2 * halb}`;
  const sectorColor = opts.neutral ? "rgba(148,163,184,.45)" : "var(--green)";
  // Erlaubte Startrichtungen als kraeftiger Bogen auf dem duennen Ring
  const arcs = (spot.sectors || []).map(([f, t]) =>
    `<path d="${sectorArcPath(cx, cy, rRing, f, t)}" fill="none" stroke="${sectorColor}" stroke-width="6" stroke-linecap="butt"/>`).join("");
  const labels = [["N", 0], ["O", 90], ["S", 180], ["W", 270]].map(([label, deg]) => {
    const p = polarPt(cx, cy, labelR, deg);
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="scp-dir">${label}</text>`;
  }).join("");
  const ratingColor = { gut: "var(--green-d)", grenz: "var(--amber)", nein: "var(--red)" }[opts.rating];
  const fits = inSectors(wd, spot.sectors, activeProfile().dirTol);
  const zeigerColor = opts.neutral ? "var(--muted)" : (ratingColor || (fits ? "var(--green-d)" : "var(--red)"));
  const tip = polarPt(cx, cy, rRing - 3, wd);
  const zeiger = needle
      // Tageszeilen: Nadel aus der Mitte zur Herkunftsseite
      ? `<line x1="${cx}" y1="${cy}" x2="${tip.x.toFixed(1)}" y2="${tip.y.toFixed(1)}" stroke="${zeigerColor}" stroke-width="4" stroke-linecap="round"/>
         <circle cx="${cx}" cy="${cy}" r="4" fill="${zeigerColor}"/>`
      // Oben im Wetter-Tab: kraeftiger Pfeil ausserhalb des Rings, zeigt nach innen
      // auf den Startplatz (Spitze bei Radius 41, Ruecken bei 59)
      : `<g transform="rotate(${Math.round(wd)} ${cx} ${cy})">
           <path d="M50 9 L64 -9 L50 -1 L36 -9 Z" fill="${zeigerColor}"/>
         </g>`;
  return `<svg viewBox="${viewBox}" class="scp${opts.neutral ? " idle" : ""}${opts.compact ? " scp-sm" : ""}" aria-hidden="true">
    <circle cx="${cx}" cy="${cy}" r="${rRing}" fill="none" stroke="rgba(148,163,184,.28)" stroke-width="3"/>
    ${arcs}
    ${labels}
    ${zeiger}
  </svg>`;
}
// Exakte Distanz in km. haversine() rundet auf ganze Kilometer (so ueberall in der
// Umkreissuche genutzt) - fuer kurze Strecken wie "400 m zum Campingplatz" braucht es
// den ungerundeten Wert.
function haversineExact(lat1, lon1, lat2, lon2) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function haversine(lat1, lon1, lat2, lon2) {
  return Math.round(haversineExact(lat1, lon1, lat2, lon2));
}

// Bewertung einer Stunde: 'gut' | 'grenz' | 'nein' + Grund (bei nein/grenz) + severity (0..1, nur
// bei 'grenz' - steuert den Farbverlauf grün->gelb in dayCardHtml statt eines harten Sprungs).
function rateHour(spot, ws, wd, wg, rain, isDay, wc) {
  const profile = activeProfile();
  const windMax = profile.windMax, gustMax = profile.gustMax, dirTol = profile.dirTol;
  // Puffer über den harten Grenzen: statt sofort "nein" gibt's dort erst "grenzwertig"
  // (mehr zutrauen, aber trotzdem warnen).
  const GUSTDIFF_WARN = profile.gustWarn, GUSTDIFF_BAD = profile.gustBad, gruen = profile.gruen;
  const dirTolBuf = dirTol + (profile.buffer ? 6 : 0);
  const windMaxBuf = windMax * (profile.buffer ? 1.15 : 1);
  const gustMaxBuf = gustMax * (profile.buffer ? 1.15 : 1);
  if (!isDay) return { rating: "nein", reason: "Nacht" };
  if (wc === 95 || wc === 96 || wc === 99) return { rating: "nein", reason: "Gewitter" };  // Gewitter (WMO) – unabhängig vom Regen
  if (rain > 0) return { rating: "nein", reason: "Regen" };
  const dirDist = sectorAngleDist(wd, spot.sectors); // 0 = passt, sonst Grad bis zum naechsten erlaubten Sektor
  // Richtung nur prüfen, wenn genug Wind da ist. Bei Nullwind (< windMin) ist die Richtung
  // bedeutungslos (Nullwind-Start) -> nicht wegen „falscher Richtung" ablehnen.
  if (ws >= spot.windMin && dirDist > dirTolBuf) return { rating: "nein", reason: "Richtung" };
  if (ws > windMaxBuf) return { rating: "nein", reason: "zu stark" };
  if (wg > gustMaxBuf) return { rating: "nein", reason: "Böen" };   // böig bleibt K.o. – auch bei Nullwind-Schnitt
  // Böendifferenz (Böen - Mittelwind): starke Schwankung = Turbulenz-Signal, unabhängig davon ob
  // Wind/Böen für sich genommen unauffällig aussehen (Mark: "fast immer ein Warnsignal"). Ab
  // GUSTDIFF_BAD harter K.o. (auch das faerbt die Kachel weich Richtung Rot statt neutralem Grau).
  const gustDiff = wg - ws;
  if (gustDiff > GUSTDIFF_BAD) {
    return { rating: "nein", reason: "windsprung", severity: clamp01((gustDiff - GUSTDIFF_BAD) / GUSTDIFF_BAD) };
  }
  // Nullwind/schwach: grenzwertig fliegbar (kein K.o.) - je näher an windMin (genug Wind zum
  // Aufziehen), desto grüner, je näher an 0, desto gelber.
  if (ws < spot.windMin) {
    const severity = spot.windMin > 0 ? clamp01((spot.windMin - ws) / spot.windMin) : 0;
    return { rating: "grenz", reason: dirDist <= dirTol ? "schwach" : "nullwind", severity };
  }
  // Richtung knapp daneben: Verlauf über den Puffer-Bereich dirTol..dirTolBuf.
  if (dirDist > dirTol) {
    return { rating: "grenz", reason: "randrichtung", severity: clamp01((dirDist - dirTol) / (dirTolBuf - dirTol)) };
  }
  if (gustDiff > GUSTDIFF_WARN) {
    return { rating: "grenz", reason: "windsprung", severity: clamp01((gustDiff - GUSTDIFF_WARN) / (GUSTDIFF_BAD - GUSTDIFF_WARN)) };
  }
  // Zu stark / böig: durchgehender Verlauf ab der 85%-Schwelle bis zur harten Nein-Grenze -
  // Text wechselt an windMax/gustMax von "recht stark"/"böig" zu "sehr stark"/"sehr böig".
  if (ws > windMax * gruen) {
    return { rating: "grenz", reason: ws > windMax ? "sehr stark" : "recht stark", severity: clamp01((ws - windMax * gruen) / (windMaxBuf - windMax * gruen)) };
  }
  if (wg > gustMax * gruen) {
    return { rating: "grenz", reason: wg > gustMax ? "sehr böig" : "böig", severity: clamp01((wg - gustMax * gruen) / (gustMaxBuf - gustMax * gruen)) };
  }
  return { rating: "gut", reason: "" };
}

function fmtHour(d) { return d.getHours().toString().padStart(2, "0") + ":00"; }
function fmtHourPlus(d) { return ((d.getHours() + 1) % 24).toString().padStart(2, "0") + ":00"; }

// Fenster (>= MIN_WINDOW zusammenhaengende flugbare Stunden). Gruen, wenn darin ein Kern aus
// guten Stunden liegt (>= MIN_WINDOW, eine einzelne leicht gelbe Stunde dazwischen ist erlaubt) -
// frueher machte jede gelbe Randstunde (z.B. schwacher Wind am Morgen) das ganze Fenster gelb.
// Ohne solchen Kern: gelbes Fenster ueber die ganze flugbare Strecke.
function guterKern(run) {
  const segs = [];
  let cur = null;
  run.forEach((h, i) => {
    if (h.rating === "gut") { if (!cur) { cur = { von: i, bis: i }; segs.push(cur); } else cur.bis = i; } else cur = null;
  });
  // Zwei Kerne mit genau einer leicht gelben Stunde dazwischen zusammenfassen
  for (let i = 0; i + 1 < segs.length;) {
    const luecke = segs[i + 1].von - segs[i].bis - 1;
    if (luecke === 1 && (run[segs[i].bis + 1].severity || 0) <= 0.5) { segs[i].bis = segs[i + 1].bis; segs.splice(i + 1, 1); } else i++;
  }
  const best = segs.filter(x => x.bis - x.von + 1 >= MIN_WINDOW).sort((x, y) => (y.bis - y.von) - (x.bis - x.von) || x.von - y.von)[0];
  return best ? run.slice(best.von, best.bis + 1) : null;
}
function findWindows(hours) {
  const wins = []; let run = [];
  const flush = () => {
    if (run.length >= MIN_WINDOW) {
      const kern = guterKern(run);
      if (kern) wins.push({ from: kern[0].t, to: kern[kern.length - 1].t, color: "gut", hours: kern.length });
      else wins.push({ from: run[0].t, to: run[run.length - 1].t, color: "grenz", hours: run.length });
    }
    run = [];
  };
  for (const h of hours) { if (h.rating === "nein") flush(); else run.push(h); }
  flush();
  return wins;
}
function windowLabel(w) {
  // Ende = letzte tatsächlich fliegbare Stunde (kein +1 -> nie zu optimistisch).
  return `${fmtHour(w.from)}–${fmtHour(w.to)}`;
}

function buildDailyMap(daily) {
  const map = {};
  daily.time.forEach((d, i) => {
    map[d] = {
      sunrise: new Date(daily.sunrise[i]),
      sunset: new Date(daily.sunset[i]),
      code: daily.weather_code ? daily.weather_code[i] : null,
      tmax: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[i]) : null,
      tmin: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[i]) : null,
    };
  });
  return map;
}

// Wandelt Open-Meteo-Antwort in bewertete Tage um.
function analyse(spot, data) {
  const h = data.hourly;
  const dmap = buildDailyMap(data.daily);
  const days = {};
  for (let i = 0; i < h.time.length; i++) {
    const t = new Date(h.time[i]);
    const key = h.time[i].slice(0, 10);
    const dl = dmap[key];
    const isDay = dl ? (t >= dl.sunrise && t <= dl.sunset) : (t.getHours() >= 8 && t.getHours() <= 20);
    const ws = h.wind_speed_10m[i], wd = h.wind_direction_10m[i], wg = h.wind_gusts_10m[i], rain = h.precipitation[i];
    const wc = h.weather_code ? h.weather_code[i] : null;
    // Flugart-Rohdaten (optional – nur vorhanden, wenn die Abfrage sie geliefert hat)
    const cl = h.cloud_cover_low ? h.cloud_cover_low[i] : null;
    const rad = h.shortwave_radiation ? h.shortwave_radiation[i] : null;
    const cape = h.cape ? h.cape[i] : null;
    const temp = h.temperature_2m ? h.temperature_2m[i] : null;
    const { rating, reason, severity } = rateHour(spot, ws, wd, wg, rain, isDay, wc);
    if (!days[key]) days[key] = { key, date: t, wx: dl, hours: [] };
    days[key].hours.push({ t, ws, wd, wg, rain, rating, reason, severity, isDay, cl, rad, cape, wc, temp });
  }
  return Object.values(days).map(day => {
    const dayHours = day.hours.filter(x => x.isDay);
    const windows = findWindows(dayHours);
    return { ...day, dayHours, windows };
  });
}

// Kurz-Label für den Grund (Anzeige rechts neben dem Ergebnis)
function grenzLabel(r) {
  const m = { "böig": "Böig", "schwach": "Wenig Wind", "nullwind": "Nullwind", "recht stark": "Recht stark",
    "randrichtung": "Richtung knapp", "sehr stark": "Sehr stark", "sehr böig": "Sehr böig", "windsprung": "Böig (Windsprung)" };
  return m[r] || "Grenzwertig";
}
function neinLabel(r) {
  const m = { "Regen": "Regen", "Richtung": "Windrichtung", "zu stark": "Zu viel Wind", "Böen": "Böig", "Nacht": "Nachts", "windsprung": "Windsprung" };
  return m[r] || r;
}
function neinText(r) {
  const m = { "Regen": "Regen", "Richtung": "Falsche Windrichtung", "zu stark": "Zu viel Wind", "Böen": "Zu böig", "Nacht": "Nachts", "windsprung": "Starker Windsprung" };
  return m[r] || r;
}
// Klartext-Grund pro Stunde (für das Uhrzeit-Detail)
function hourReason(rating, reason) {
  if (rating === "gut") return "passt ✓";
  const grenz = { "schwach": "wenig Wind", "böig": "grenzwertig – böig", "recht stark": "grenzwertig – recht stark", "nullwind": "kaum Wind – Richtung egal (Nullwind-Start)",
    "randrichtung": "grenzwertig – Richtung knapp daneben", "sehr stark": "grenzwertig – sehr stark", "sehr böig": "grenzwertig – sehr böig", "windsprung": "grenzwertig – großer Windsprung (Böen weit über Mittelwind)" };
  const nein = { "Richtung": "falsche Windrichtung", "Regen": "Regen", "zu stark": "zu viel Wind", "Böen": "zu böig", "Nacht": "nachts", "schwach": "zu wenig Wind", "windsprung": "starker Windsprung (Böen weit über Mittelwind)" };
  return rating === "grenz" ? (grenz[reason] || "grenzwertig") : (nein[reason] || reason);
}
function dominantReason(hours, rating) {
  const c = {};
  hours.forEach(x => { if (x.rating === rating) c[x.reason] = (c[x.reason] || 0) + 1; });
  const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : "";
}

// Status für einen Tag (idx 0=heute, 1=morgen): {status, win?, reason?, reasonLabel, past?}
// Für "heute" wird ein bereits abgelaufenes Fenster übersprungen, wenn es noch ein aktuelles/
// kommendes gibt - sonst wäre z.B. um 14 Uhr noch "6-9 Uhr" als Empfehlung zu sehen (past:true
// markiert diesen Fall, damit die Anzeige das als Vergangenheit statt als aktuellen Tipp zeigt).
function dayStatus(days, idx = 0) {
  const day = days[idx];
  if (!day) return { status: "nein", reason: "—", reasonLabel: "—" };
  const now = new Date();
  const isPast = w => idx === 0 && (w.to.getTime() + 3600000) <= now.getTime();
  const green = day.windows.filter(w => w.color === "gut");
  const yellow = day.windows.filter(w => w.color === "grenz");
  const greenNow = green.filter(w => !isPast(w));
  const yellowNow = yellow.filter(w => !isPast(w));
  if (greenNow.length) return { status: "gut", win: greenNow[0], reasonLabel: "Wind passt" };
  if (yellowNow.length) return { status: "grenz", win: yellowNow[0], reasonLabel: grenzLabel(dominantReason(day.dayHours, "grenz")) };
  if (green.length || yellow.length) {
    // Alle heutigen Fenster schon vorbei - letztes Fenster als Vergangenheit kennzeichnen statt
    // eine abgelaufene Uhrzeit unkommentiert als aktuellen Tipp zu zeigen.
    const lastGreen = green[green.length - 1], lastYellow = yellow[yellow.length - 1];
    const win = lastGreen || lastYellow;
    return { status: lastGreen ? "gut" : "grenz", win, past: true, reasonLabel: "War heute früh fliegbar" };
  }
  const r = dominantReason(day.dayHours, "nein") || "—";
  return { status: "nein", reason: r, reasonLabel: neinLabel(r), reasonText: neinText(r) };
}
function todayStatus(days) { return dayStatus(days, 0); }
// Route Stufe 2: Bewertung ab der Ankunftszeit. Zaehlt nur ein Fenster, in dem nach der
// Ankunft noch mindestens 1 Stunde bleibt; das Fenster beginnt fruehestens bei Ankunft.
const ANKUNFT_MIN_FLUG_MS = 3600000;
function ankunftStatus(days, idx, ankunft) {
  const day = days[idx];
  const basis = dayStatus(days, idx);
  if (!day || !ankunft) return basis;
  const an = ankunft.getTime();
  const nutzbar = day.windows
    .map(w => ({ w, von: Math.max(w.from.getTime(), an) }))
    .filter(x => x.w.to.getTime() - x.von >= ANKUNFT_MIN_FLUG_MS);
  const x = nutzbar.find(n => n.w.color === "gut") || nutzbar.find(n => n.w.color === "grenz");
  if (x) {
    const from = new Date(x.von);
    return { status: x.w.color, win: { ...x.w, from, hours: Math.round((x.w.to.getTime() - x.von) / 3600000) },
      reasonLabel: x.w.color === "gut" ? "Wind passt" : basis.reasonLabel, ankunft };
  }
  if (basis.status !== "nein") {
    // Am Tag waere es gegangen - aber nicht mehr, wenn man dort ankommt
    const hhmm = ankunft.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    return { status: "nein", reason: "spaet", reasonLabel: "Fenster vorbei", reasonText: `Bei Ankunft ${hhmm} vorbei`, ankunft };
  }
  return { ...basis, ankunft };
}

// Sterne-Bewertung für den gewählten Tag (emotional schnell erfassbar)
function todayRating(days, idx = 0) {
  const ts = dayStatus(days, idx);
  const day = days[idx];
  const w = idx === 1 ? "Morgen" : "Heute";
  // Sterne richten sich nach der Länge des tatsächlich nutzbaren Fensters (ts.win), nicht nach
  // der Summe verstreuter Einzel-Stunden über den Tag – sonst zählen isolierte Gut-Stunden
  // zwischen zwei Falsch-Richtung-Stunden mit, obwohl daraus kein wirklich fliegbares Fenster wird.
  const winHours = ts.win ? ts.win.hours : 0;
  const type = flightType(day, ts.win);
  if (ts.status === "gut") {
    const stars = winHours >= 5 ? 5 : 4;
    const q = stars === 5 ? "sehr gut" : "gut";
    return { stars, label: type ? `${w} ${q} – ${type.label}` : `${w} ${q} geeignet`, cls: "gut", type };
  }
  if (ts.status === "grenz") {
    const stars = winHours >= 4 ? 3 : 2;
    return { stars, label: type ? `Grenzwertig · ${type.label}` : "Grenzwertig", cls: "grenz", type };
  }
  return { stars: 1, label: `${w} nicht geeignet`, cls: "nein" };
}

// Kompakte Sterne+Kurzurteil pro Tag (für die 7-Tage-Liste – ohne "Heute/Morgen"-Präfix)
function dayVerdict(days, idx) {
  const ts = dayStatus(days, idx);
  const day = days[idx];
  const winHours = ts.win ? ts.win.hours : 0;
  if (ts.status === "gut") { const stars = winHours >= 5 ? 5 : 4; const type = flightType(day, ts.win); return { stars, cls: "gut", text: type ? type.label : (stars === 5 ? "sehr gut" : "gut") }; }
  if (ts.status === "grenz") { const stars = winHours >= 4 ? 3 : 2; return { stars, cls: "grenz", text: ts.reasonLabel || "grenzwertig" }; }
  return { stars: 1, cls: "nein", text: ts.reasonText || "nicht geeignet" };
}
function starStr(n) { return `<span class="on">${"★".repeat(n)}</span><span class="off">${"☆".repeat(5 - n)}</span>`; }

// ---- Flugart-Einordnung: Abgleiter / Soaring / Thermik / Streckenflug ----
// Heuristik: Wind → Soaring; Sonneneinstrahlung + CAPE + tiefe Wolken → Thermik. Schwellen justierbar.
// Bewusst vorsichtig/konservativ + als Tendenz formuliert (kein Versprechen, kein Thermik-Forecast).
const FLIGHT = {
  radTherm: 500,    // W/m² Mindest-Mittags-Einstrahlung für Thermik-Tendenz
  capeTherm: 300,   // J/kg Konvektions-Energie
  lowCloudMax: 55,  // % tiefe Wolken – darüber kaum Thermik
  soarWind: 16,     // km/h: ab hier Hangsoaring realistisch
  soarWindMax: 38,  // darüber nicht mehr als „Soaring" labeln
};
function flightType(day, win) {
  if (!day || !day.windows || !day.windows.length) return null;
  const fly = day.dayHours.filter(h => h.rating !== "nein");
  if (!fly.length) return null;
  // Nur die Stunden des angezeigten Fensters betrachten, damit die Flugart nicht aus
  // einer anderen Tageszeit stammt als das Fenster, das daneben angezeigt wird (z.B.
  // "Thermik-Tendenz" neben einem 07:00-09:00-Fenster wäre irreführend).
  const scoped = win ? fly.filter(h => h.t >= win.from && h.t <= win.to) : fly;
  const mid = scoped.filter(h => { const hr = h.t.getHours(); return hr >= 11 && hr <= 16; });
  const pool = mid.length ? mid : scoped;
  const hasData = pool.some(h => h.rad != null);
  const rad = Math.max(0, ...pool.map(h => h.rad || 0));
  const cape = Math.max(0, ...pool.map(h => h.cape || 0));
  const lowCloud = Math.min(100, ...pool.map(h => (h.cl == null ? 100 : h.cl)));
  const soar = scoped.some(h => h.ws >= FLIGHT.soarWind && h.ws <= FLIGHT.soarWindMax);
  const therm = hasData && lowCloud <= FLIGHT.lowCloudMax && rad >= FLIGHT.radTherm && cape >= FLIGHT.capeTherm;
  if (therm && soar) return { key: "th", label: "Thermik & Soaring möglich" };
  if (therm) return { key: "th", label: "Thermik-Tendenz" };
  if (soar) return { key: "soar", label: "Soaring möglich" };
  return { key: "glide", label: "eher Abgleiter" };
}

// DHV-Schwierigkeits-Hinweis: 1 = anspruchsvoll, 2 = sehr anspruchsvoll (nur für Erfahrene).
// Bei Liga „Anfänger" kommt ein deutlicher Zusatz dazu (warnen, aber nicht verstecken).
function diffWarn(spot) {
  const d = spot.diff || 0;
  if (!d) return null;
  const text = d === 2 ? "Sehr anspruchsvoll – nur für Erfahrene" : "Anspruchsvolles Gelände";
  return { d, text };
}
// Kurzfassung der DHV-Bemerkung fürs Detailfenster: bricht an einem Satz- oder Wortende ab,
// nie mitten im Wort. Der Originaltext (Sicherheits-/Rechtshinweis von DHV) wird dabei nie
// inhaltlich verändert oder gekürzt gespeichert – nur die Anzeige ist kompakt, "mehr" zeigt alles.
function remarkPreview(text, maxLen = 140) {
  const slice = text.slice(0, maxLen);
  const sentEnd = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (sentEnd > maxLen * 0.4) return slice.slice(0, sentEnd + 1);
  const wordEnd = slice.lastIndexOf(" ");
  return (wordEnd > 0 ? slice.slice(0, wordEnd) : slice) + "…";
}
// Ergänzende Original-DHV-Angaben (Bundesland/Gemeinde, Höhendifferenz, Gleitschirm-Ausstattung,
// offizielle Bemerkung). Nur Felder, die wir noch nicht in anderer Form zeigen (Höhe/Windrichtung
// stehen schon oben) – bewusst kompakt, kein komplettes DHV-Datenblatt.
function dhvExtra(spot, opts = {}) {
  const orte = !opts.skipOrt ? [spot.gemeinde, spot.bundesland].filter(Boolean).join(", ") : "";
  const hd = (!opts.skipHoehendiff && spot.hoehendiff) ? `Höhendifferenz ${spot.hoehendiff} m` : "";
  const line1 = [orte, hd].filter(Boolean).join(" · ");
  const line2 = (!opts.skipGleitschirm && spot.gleitschirm) ? `<div class="dhv-line"><span class="sa-label">Gleitschirm:</span> ${spot.gleitschirm}</div>` : "";
  const lande = (!opts.skipLande && spot.landeName) ? `<div class="dhv-line">🛬 <span class="sa-label">Landeplatz:</span> ${spot.landeName}${spot.landeHoehe != null ? " · " + spot.landeHoehe + " m" : ""}</div>` : "";
  const remark = spot.bemerkung ? (() => {
    const full = spot.bemerkung;
    const truncated = full.length > 140;
    if (!truncated) return `<div class="dhv-remark"><span class="sa-label">Bemerkung:</span> „${full}"</div>`;
    const preview = remarkPreview(full);
    return `<div class="dhv-remark"><span class="sa-label">Bemerkung:</span> „<span class="dhv-remark-short">${preview}</span><span class="dhv-remark-full" hidden>${full}</span>"<button type="button" class="dhv-remark-toggle" data-remark-toggle="1">mehr</button></div>`;
  })() : "";
  if (!line1 && !line2 && !lande && !remark) return "";
  return `<div class="dhv-extra">${line1 ? `<div class="dhv-line">${line1}</div>` : ""}${line2}${lande}${remark}</div>`;
}

// ---------------- Neues Details-Tab-Layout (Icon-Karten, Datentabelle, Start-/Landeplatz-Karten) ----------------
// Erste Stunde im Fenster mit spürbar steigender Einstrahlung (grobe Tendenz, kein Forecast)
function thermikStartHour(day, win) {
  if (!day || !win) return null;
  const hrs = day.dayHours.filter(h => h.t >= win.from && h.t <= win.to && h.rating !== "nein");
  const hit = hrs.find(h => h.rad != null && h.rad >= FLIGHT.radTherm * 0.6);
  return hit ? hit.t.getHours() : null;
}
// Schwierigkeit als Volltext – „keine besondere Angabe" statt erfundenem „leicht" (Fehlen einer
// DHV-Warnung heißt nicht „bestätigt leicht", nur dass DHV nichts vermerkt hat).
function diffLabelFull(spot) {
  const d = spot.diff || 0;
  if (d === 2) return { text: "sehr anspruchsvoll", cls: "d2" };
  if (d === 1) return { text: "anspruchsvoll", cls: "d1" };
  return { text: "keine besondere Angabe", cls: "d0" };
}
// Nicht-verfügbar-Platzhalter für Felder ohne echte Datengrundlage (nie fake Werte zeigen)
const NA = `<span class="na">nicht verfügbar</span>`;

// ---------------- Fetching ----------------
// Fetch mit automatischem Wiederholen bei Rate-Limit (429) oder Serverfehler (5xx).
async function fetchRetry(url, tries = 4) {
  let lastStatus = 0;
  for (let i = 0; i < tries; i++) {
    let res;
    try { res = await fetch(url); }
    catch (e) { if (i === tries - 1) throw e; await sleep(600 * (i + 1)); continue; }
    if (res.ok) return res;
    lastStatus = res.status;
    if (res.status === 429 || res.status >= 500) { await sleep(800 * Math.pow(2, i)); continue; }
    throw new Error("HTTP " + res.status);
  }
  throw new Error(lastStatus === 429 ? "Wetterdienst ausgelastet – bitte kurz warten und erneut suchen." : "HTTP " + lastStatus);
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- Wetter-Cache (Gerät, 60 Min) – spart Abrufe bei wiederholten Suchen / erneutem Öffnen ----
const WX_TTL = 60 * 60 * 1000;
function wxDay() { const d = new Date(); return `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`; }
function wxKey(kind, lat, lon) { return `wx_${kind}_${wxDay()}_${lat.toFixed(3)}_${lon.toFixed(3)}`; }
function wxGet(key) {
  try { const o = JSON.parse(localStorage.getItem(key)); return (o && Date.now() - o.t < WX_TTL) ? o.d : null; }
  catch { return null; }
}
function wxSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); }
  catch {
    try { Object.keys(localStorage).filter(k => k.startsWith("wx_")).forEach(k => localStorage.removeItem(k)); localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch {}
  }
}
function wxSweep() {
  try { Object.keys(localStorage).filter(k => k.startsWith("wx_")).forEach(k => { try { if (Date.now() - JSON.parse(localStorage.getItem(k)).t >= WX_TTL) localStorage.removeItem(k); } catch { localStorage.removeItem(k); } }); } catch {}
}
wxSweep();

async function fetchForecast(spot) {
  const key = wxKey("f7v2", spot.lat, spot.lon); // "f7v2": neues Stundenfeld (temperature_2m) -> alte Caches ("f7v") ignorieren
  const cached = wxGet(key); if (cached) return cached;
  // KEIN &elevation: der Parameter macht Open-Meteo instabil (12 m Höhendifferenz drehte die
  // Windrichtung um 90°+) und wich vom Bulk-Abruf ab -> Liste und Detail widersprachen sich.
  // Beide Pfade nutzen jetzt Open-Meteos eigene Geländehöhe = konsistent.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code,cloud_cover_low,shortwave_radiation,cape,temperature_2m` +
    `&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Europe%2FBerlin&forecast_days=5&wind_speed_unit=kmh`;
  const data = await (await fetchRetry(url)).json();
  wxSet(key, data);
  return data;
}
// ---------------- Windprofil: Wind in verschiedenen Höhen ----------------
// Zwei Quellen mit VERSCHIEDENEN Nullpunkten, das ist der Knackpunkt:
//  - 10/80/120/180 m sind ueber GRUND gemessen -> Hoehe ue. NN = Gelaendehoehe + x
//  - Druckflaechen (hPa) sind absolut, ihre echte Hoehe steht in geopotential_height
// Eigene Abfrage, absichtlich getrennt von fetchForecast: 32 zusaetzliche Stundenreihen
// duerfen niemals in die Umkreissuche mit bis zu 50 Plaetzen geraten.
// Zwischenflaechen (875/825/775/750 hPa) halbieren die Abstaende ueber dem Gelaende und
// machen die Rechnung auf 500-m-Schritte deutlich genauer. Ueber Grund endet die API
// bei 200 m - 300 m und hoeher nimmt sie zwar an, liefert aber null.
const WP_LEVELS = [1000, 975, 950, 925, 900, 875, 850, 825, 800, 775, 750, 700, 600];
const WP_BODEN = [10, 80, 120, 180, 200];
async function fetchWindProfil(spot) {
  const key = wxKey("wp2", spot.lat, spot.lon);
  const cached = wxGet(key); if (cached) return cached;
  const vars = [
    ...WP_BODEN.flatMap(h => [`wind_speed_${h}m`, `wind_direction_${h}m`]),
    ...WP_LEVELS.flatMap(p => [`wind_speed_${p}hPa`, `wind_direction_${p}hPa`, `geopotential_height_${p}hPa`]),
  ].join(",");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=${vars}&timezone=Europe%2FBerlin&forecast_days=5&wind_speed_unit=kmh`;
  const data = await (await fetchRetry(url)).json();
  wxSet(key, data);
  return data;
}
// Schichten einer Stunde, von unten nach oben, jeweils mit echter Hoehe ue. NN.
function windProfilStunde(data, iso) {
  const i = data.hourly.time.indexOf(iso);
  if (i < 0) return null;
  const grund = data.elevation;
  const schichten = [];
  WP_BODEN.forEach(h => {
    const ws = data.hourly[`wind_speed_${h}m`][i], wd = data.hourly[`wind_direction_${h}m`][i];
    if (ws == null || wd == null) return;
    schichten.push({ hoehe: Math.round(grund + h), ws, wd, quelle: "boden", ueberGrund: h });
  });
  WP_LEVELS.forEach(p => {
    const h = data.hourly[`geopotential_height_${p}hPa`][i];
    const ws = data.hourly[`wind_speed_${p}hPa`][i], wd = data.hourly[`wind_direction_${p}hPa`][i];
    // Flaechen unterhalb des Gelaendes liefern Fuellwerte (bei Gerlitzen dreimal exakt
    // dieselbe Zahl) - das sieht aus wie Wetter, ist aber keins. Raus damit.
    if (h == null || ws == null || wd == null || h <= grund + 10) return;
    schichten.push({ hoehe: Math.round(h), ws, wd, quelle: "modell", hpa: p });
  });
  schichten.sort((a, b) => a.hoehe - b.hoehe);
  return schichten.length ? { grund, schichten } : null;
}
function wpZahl(n) { return n.toLocaleString("de-DE"); }
// Wind zwischen zwei Modellflaechen: ueber die Komponenten rechnen, nicht ueber Grad.
// 350 Grad und 10 Grad ergeben als Mittel sonst 180 - also genau die Gegenrichtung.
function wpUv(ws, wd) { const r = wd * Math.PI / 180; return { u: -ws * Math.sin(r), v: -ws * Math.cos(r) }; }
function wpVonUv(u, v) { return { ws: Math.hypot(u, v), wd: (Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360 }; }
function wpInterpol(schichten, h) {
  let unten = null, oben = null;
  for (const s of schichten) { if (s.hoehe <= h) unten = s; if (s.hoehe >= h && !oben) oben = s; }
  if (!unten || !oben) return null;                       // ausserhalb der Daten: nie hochrechnen
  if (oben.hoehe === unten.hoehe) return { ws: oben.ws, wd: oben.wd };
  const t = (h - unten.hoehe) / (oben.hoehe - unten.hoehe);
  const a = wpUv(unten.ws, unten.wd), b = wpUv(oben.ws, oben.wd);
  return wpVonUv(a.u + (b.u - a.u) * t, a.v + (b.v - a.v) * t);
}
// Startplatz (echter Messwert) plus glatte 500-m-Schritte darueber. Die Modellflaechen
// liegen unregelmaessig (4 m bis 1200 m Abstand) - als Zeilenfolge liest sich das wirr.
// Zwischenwerte sind gerechnet, nicht gemessen; das steht auch unter dem Diagramm.
function wpRaster(prof) {
  const { grund, schichten } = prof;
  if (!schichten.length) return [];
  const start = schichten[0];
  const zeilen = [{ hoehe: start.hoehe, ws: start.ws, wd: start.wd, art: "start" }];
  const top = schichten[schichten.length - 1].hoehe;
  for (let h = Math.ceil((start.hoehe + 50) / 500) * 500; h <= grund + 2500 && h <= top; h += 500) {
    const w = wpInterpol(schichten, h);
    if (w) zeilen.push({ hoehe: h, ws: w.ws, wd: w.wd, art: "raster" });
  }
  return zeilen;
}
// Balkenfarbe nach Windstaerke: bis 15 km/h gruen, bis 30 gelb werdend, ab 45 voll rot.
// Bewusst eine feste Skala fuer alle Hoehen - in 2000 m gelten nicht die Startplatz-
// Grenzwerte, aber 45 km/h sind ueberall viel Wind.
function wpStaerkeFarbe(ws) {
  if (ws <= 15) return COLOR_GOOD;
  if (ws >= 45) return COLOR_BAD;
  return ws <= 30
    ? lerpHex(COLOR_GOOD, COLOR_WARN, (ws - 15) / 15)
    : lerpHex(COLOR_WARN, COLOR_BAD, (ws - 30) / 15);
}
// Open-Meteo liefert bei gesetzter Zeitzone naive Ortszeit-Stempel ("2026-08-27T12:00").
// Genau in dieser Form muss der Schluessel zurueckgebaut werden, um die Stunde zu finden.
function isoStunde(d) {
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
}
// Pfeil zeigt zur Herkunftsseite - dieselbe Lesart wie die Nadel in den Tageszeilen.
function wpPfeil(x, y, wd, farbe) {
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${Math.round(wd)})">
    <path d="M0 -6.5 L3.4 1.6 L0 -0.8 L-3.4 1.6 Z" fill="${farbe}"/></g>`;
}
function windProfilSvg(spot, prof, stundeLabel) {
  const { grund, schichten } = prof;
  const raster = wpRaster(prof);
  if (!raster.length) return `<p class="wp-note">Für diese Stunde liegen keine Höhenwinde vor.</p>`;
  const liste = raster.slice().reverse();                 // oben zuerst, so schaut man in den Himmel
  const darueber = schichten.filter(s => s.hoehe > grund + 2500).slice(-1);
  const maxWs = Math.max(...liste.map(s => s.ws), 5);

  // Zeilenraster statt Streudiagramm: die Schichten liegen 4 m bis 1200 m auseinander.
  // Auf einer massstabsgetreuen Achse klumpen die unteren vier zusammen und die
  // Beschriftungen ueberdrucken sich. Gleich hohe Zeilen loesen beides; die echten
  // Hoehen stehen als Zahl daneben und sagen die Wahrheit ueber die Abstaende.
  const W = 320, ZH = 25, mT = 17, links = 50, rechts = 78, band = 17;
  const barVon = links + 9, barBis = W - rechts;
  const H = mT + liste.length * ZH + band;
  const yZeile = i => mT + i * ZH + ZH / 2;

  // Zwei Farbkanäle mit je EINER Bedeutung:
  //  - Balken = Windstärke, gruen ueber gelb nach rot. Gleiche Farbsprache wie die
  //    Stundenkacheln darueber, damit man nicht zweimal umdenken muss.
  //  - Richtung wird nur in der Startplatz-Zeile bewertet (Zeilenhintergrund + Pfeil).
  //    In 2000 m ist die Startrichtung des Gelaendes schlicht bedeutungslos.
  const startZeile = liste.length - 1;                  // unterste Schicht = Startplatzhoehe
  const startPasst = inSectors(liste[startZeile].wd, spot.sectors, activeProfile().dirTol);
  const startFarbe = startPasst ? "var(--green)" : "var(--red)";

  const zeilen = liste.map((s, i) => {
    const y = yZeile(i);
    const istStart = i === startZeile;
    const breite = Math.max(3, (s.ws / maxWs) * (barBis - barVon));
    return `<g>
      <text x="${links - 9}" y="${(y + 3.4).toFixed(1)}" text-anchor="end" class="wp-h${istStart ? " on" : ""}">${wpZahl(s.hoehe)}</text>
      <rect x="${barVon}" y="${(y - 4.5).toFixed(1)}" width="${breite.toFixed(1)}" height="9" rx="4.5" fill="${wpStaerkeFarbe(s.ws)}" opacity="${istStart ? 1 : .8}"/>
      <text x="${(barBis + 26).toFixed(1)}" y="${(y + 3.8).toFixed(1)}" text-anchor="end" class="wp-val">${s.ws.toFixed(1).replace(".", ",")}</text>
      ${wpPfeil(barBis + 38, y, s.wd, istStart ? startFarbe : "var(--muted)")}
      <text x="${(barBis + 47).toFixed(1)}" y="${(y + 3.4).toFixed(1)}" class="wp-dir${istStart ? " on" : ""}">${degToCompass(s.wd)}</text>
    </g>`;
  }).join("");

  // Das Band ist die GELÄNDEhoehe des Modells - darauf beziehen sich die Bodenwerte.
  // Die DHV-Startplatzhoehe weicht davon oft ab (Modell rechnet mit 2-km-Rasterzellen).
  // Nur "Startplatz" draufzuschreiben waere falsch: dann stuende ueber dem Band eine
  // kleinere Zahl als im Band selbst.
  const yBand = mT + liste.length * ZH;
  const abw = spot.elevation != null ? Math.abs(spot.elevation - grund) : 0;
  const bandTxt = `Startplatz · ${wpZahl(Math.round(grund))} m` + (abw > 30 ? `   ·   laut DHV ${wpZahl(spot.elevation)} m` : "");
  // Startplatz-Zeile und das Band darunter gehoeren zusammen: EIN durchgehend getoenter
  // Block in der Richtungsfarbe, innen nur durch eine feine Linie geteilt. Vorher waren es
  // zwei Kaesten in zwei verschiedenen Farben, die nichts miteinander zu tun zu haben schienen.
  const yStartZeile = yZeile(startZeile) - ZH / 2;
  const startBlock = `<rect x="0" y="${yStartZeile.toFixed(1)}" width="${W}" height="${(ZH + band).toFixed(1)}" rx="7" fill="${startFarbe}" opacity=".13"/>
    <line x1="7" y1="${yBand + 0.5}" x2="${W - 7}" y2="${yBand + 0.5}" stroke="${startFarbe}" stroke-width="1" opacity=".35"/>`;
  const bodenBand = `<text x="8" y="${yBand + 12}" class="wp-boden-tx" fill="${startFarbe}">${escHtml(bandTxt)}</text>`;

  // Richtungsaenderung ueber die Hoehe - fuer den Piloten die eigentliche Aussage
  const unten = liste[liste.length - 1], obenS = liste[0];
  const dreh = Math.abs(((obenS.wd - unten.wd + 540) % 360) - 180);
  const scher = dreh >= 45
    ? `<div class="wp-scher">Dreht mit der Höhe: ${degToCompass(unten.wd)} → ${degToCompass(obenS.wd)}</div>` : "";
  const hoeher = darueber.length
    ? `<div class="wp-oben">Höher: ${darueber.map(s => `${wpZahl(s.hoehe)} m · ${Math.round(s.ws)} km/h ${degToCompass(s.wd)}`).join(" · ")}</div>` : "";

  // Spaltenköpfe stehen im SVG, damit sie exakt über ihren Zahlen sitzen. Als HTML-Zeile
  // darüber klebten sie an den Rändern und "km/h" stand über der Himmelsrichtung.
  const kopfzeile = `<text x="${links - 9}" y="9" text-anchor="end" class="wp-sp">m ü. NN</text>
    <text x="${(barBis + 26).toFixed(1)}" y="9" text-anchor="end" class="wp-sp">km/h</text>`;
  return `<div class="wp-kopf"><span class="wp-stunde">Windprofil · ${escHtml(stundeLabel)}</span></div>
    <svg class="wp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Windprofil">${kopfzeile}${startBlock}${zeilen}${bodenBand}</svg>
    ${scher}${hoeher}
    <p class="wp-note">Startplatz-Zeile aus dem Modell, die 500-m-Stufen darüber dazwischen gerechnet.
      Balkenfarbe = Windstärke, Richtung nur am Startplatz bewertet, Pfeil = Herkunft.
      Modell ~2 km, kein Talwind, keine Thermik.</p>`;
}
// Mehrere Plätze in EINEM Aufruf (heute + morgen) – für die Umkreis-/Regionssuche.
// Bereits zwischengespeicherte Plätze werden aus dem Cache bedient; nur fehlende werden angefragt.
async function fetchBulkToday(spots) {
  const out = new Array(spots.length);
  const missIdx = [], missSpots = [];
  spots.forEach((s, i) => {
    const c = wxGet(wxKey("b2u", s.lat, s.lon));
    if (c) out[i] = c; else { missIdx.push(i); missSpots.push(s); }
  });
  if (missSpots.length) {
    const lats = missSpots.map(s => s.lat).join(","), lons = missSpots.map(s => s.lon).join(",");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
      `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code,cloud_cover_low,shortwave_radiation,cape` +
      `&daily=sunrise,sunset&timezone=Europe%2FBerlin&forecast_days=2&wind_speed_unit=kmh`;
    const j = await (await fetchRetry(url)).json();
    const arr = Array.isArray(j) ? j : [j];
    arr.forEach((d, k) => { out[missIdx[k]] = d; wxSet(wxKey("b2u", missSpots[k].lat, missSpots[k].lon), d); });
  }
  return out;
}
async function fetchElevation(lat, lon) {
  const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
  if (!res.ok) throw new Error("Höhe?");
  return Math.round((await res.json()).elevation[0]);
}

// ---- Live-Windstationen (Pioupiou, offene API, CORS frei) ----
let piouCache = { t: 0, list: null };
async function fetchPiou() {
  if (piouCache.list && Date.now() - piouCache.t < 60000) return piouCache.list;
  try {
    const res = await fetch("https://api.pioupiou.fr/v1/live/all");
    if (!res.ok) return piouCache.list || [];
    const j = await res.json();
    const arr = (j.data || j).filter(s => s.location && s.location.latitude != null && s.measurements && s.measurements.wind_speed_avg != null);
    piouCache = { t: Date.now(), list: arr };
    return arr;
  } catch { return piouCache.list || []; }
}
// Wetter-Verlauf (Open-Meteo Historien-API, gratis/ohne Key) - letzte N Tage fuer den Startplatz.
// Aeltestes waehlbares Datum in etwa - Open-Meteo-Archiv geht Jahrzehnte zurueck, aber die letzten
// 2 Tage sind oft noch unvollstaendig, deshalb als spaetestes Datum sperren.
function histMaxDate() {
  const d = new Date(); d.setDate(d.getDate() - 2);
  return d.toISOString().slice(0, 10);
}
// Ein einzelner vergangener Tag, gleiche Felder wie die Vorhersage -> laeuft durch dieselbe
// analyse()-Funktion und dieselbe Tages-Karte (dayCardHtml).
async function fetchHistoryDay(spot, dateStr) {
  const key = wxKey("histday_" + dateStr, spot.lat, spot.lon);
  const cached = wxGet(key); if (cached) return cached;
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code,cloud_cover_low,shortwave_radiation,cape,temperature_2m` +
    `&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Europe%2FBerlin&wind_speed_unit=kmh&start_date=${dateStr}&end_date=${dateStr}`;
  const res = await fetchRetry(url);
  if (!res.ok) throw new Error("Verlauf für dieses Datum nicht verfügbar");
  const data = await res.json();
  wxSet(key, data);
  return data;
}
// Nächste Station ≤ 2 km mit frischer Messung (≤ 60 Min) – sonst null (nicht faken)
function liveWind(spot, stations) {
  if (!stations || !stations.length) return null;
  const now = Date.now(); let best = null, bestD = 2.01;
  for (const st of stations) {
    const m = st.measurements; if (!m || !m.date) continue;
    if (now - new Date(m.date).getTime() > 3600000) continue;
    const dd = haversineExact(spot.lat, spot.lon, st.location.latitude, st.location.longitude);
    if (dd < bestD) { bestD = dd; best = st; }
  }
  if (!best) return null;
  const m = best.measurements;
  return { name: (best.meta && best.meta.name) || "Station", dist: bestD, dir: Math.round(m.wind_heading),
    avg: Math.round(m.wind_speed_avg), max: Math.round(m.wind_speed_max), ago: Math.round((now - new Date(m.date).getTime()) / 60000) };
}
// Fahrzeit (Auto) von einem Startpunkt zu vielen Zielen in EINEM Aufruf (OSRM, gratis, ohne Schlüssel).
// Gibt Sekunden je Ziel zurück (gleiche Reihenfolge wie `spots`), oder [] bei Fehler.
async function fetchDriveTimes(origin, spots) {
  const coords = [[origin.lon, origin.lat], ...spots.map(s => [s.lon, s.lat])]
    .map(c => c[0].toFixed(5) + "," + c[1].toFixed(5)).join(";");
  const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&annotations=duration`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("OSRM " + res.status);
  const j = await res.json();
  return (j.durations && j.durations[0]) ? j.durations[0].slice(1) : [];
}
function formatDur(sec) {
  if (sec == null || isNaN(sec)) return "";
  const m = Math.round(sec / 60);
  if (m < 60) return m + " min";
  return Math.floor(m / 60) + " h " + (m % 60).toString().padStart(2, "0") + " min";
}
// Kompakte Fensterzeit für die Ergebnisliste: „15–22 Uhr"
function winTimeShort(w) { return `${w.from.getHours()}–${w.to.getHours()} Uhr`; }

// "Tipp für morgen": vergleicht die gemeinsame beste Zeit heute vs. morgen über alle Favoriten
function favoritesTipHtml(results) {
  if (!results.length) return "";
  const todayWins = results.map(r => dayStatus(r.days, 0)).filter(s => s.status === "gut" && !s.past).map(s => s.win);
  const tmrWins = results.map(r => dayStatus(r.days, 1)).filter(s => s.status === "gut").map(s => s.win);
  if (!tmrWins.length) return "";
  const from = new Date(Math.min(...tmrWins.map(w => w.from.getTime())));
  const to = new Date(Math.max(...tmrWins.map(w => w.to.getTime())));
  const zeit = `${from.getHours().toString().padStart(2, "0")}:00 – ${to.getHours().toString().padStart(2, "0")}:00 Uhr`;
  const vgl = todayWins.length
    ? (tmrWins.length >= todayWins.length ? "Morgen sind die Bedingungen ähnlich gut." : "Morgen sieht's etwas schwächer aus als heute.")
    : "Morgen sieht besser aus als heute.";
  return `<div class="fav-tip"><span class="fav-tip-ic">📅</span><div class="fav-tip-txt"><b>Tipp für morgen</b><br>${vgl} Beste Zeit: ${zeit}</div></div>`;
}

// ---------------- Speicher: User-Plätze + Favoriten ----------------
const USER_KEY = "flugwetter_user_spots", FAV_KEY = "flugwetter_favorites";
function loadUserSpots() { try { return JSON.parse(localStorage.getItem(USER_KEY)) || []; } catch { return []; } }
function saveUserSpots(l) { localStorage.setItem(USER_KEY, JSON.stringify(l)); }
function loadFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } }
function saveFavs(l) { localStorage.setItem(FAV_KEY, JSON.stringify(l)); if (typeof favMarkerErneuern === "function") favMarkerErneuern(); }
function isFav(id) { return loadFavs().includes(id); }
function toggleFav(id) {
  const f = loadFavs(); const i = f.indexOf(id);
  if (i >= 0) f.splice(i, 1); else f.push(id);
  saveFavs(f);
}
function allKnownSpots() { return SPOT_DB.concat(loadUserSpots()); }
function getSpot(id) { return allKnownSpots().find(s => s.id === id); }
function favoriteSpots() { const f = loadFavs(); return allKnownSpots().filter(s => f.includes(s.id)); }

// ---------------- Rendering: Favoriten-Karten (7 Tage) ----------------
function statusDot(status) {
  const cls = status === "gut" ? "gut" : status === "grenz" ? "grenz" : "nein";
  return `<span class="sdot ${cls}">●</span>`;
}
function fmtTime(d) { return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0"); }

// ---------------- Umgebung aus OpenStreetMap (Overpass) ----------------
// Übernachten (Camping, Stellplatz, Unterkunft) und Parkplätze rund um Lande- und
// Startplatz. Overpass ist ehrenamtlich betrieben und antwortet nicht immer (im Test
// kam ein 504, ein Spiegelserver lief in einen Timeout). Deshalb: Abruf nur beim
// Öffnen des Briefing-Tabs, 30 Tage zwischenspeichern, bei Problemen nichts anzeigen.
const CAMP_TTL = 30 * 24 * 3600 * 1000;
const CAMP_RADIUS_M = 15000;    // Übernachten: großzügig, dafür fährt man auch
const PARK_RADIUS_M = 3000;     // Parken: nur was wirklich zum Platz gehört
const CAMP_MAX = 25;
const PARK_MAX = 4;   // je Gruppe (Startplatz / Landeplatz)
let campMarkers = [];

// Schild-Icons (aus Marks Vorlage) - dieselbe Bildsprache wie auf der Karte.
// Es gibt genau diese drei Arten; Hotels sind bewusst nicht dabei.
const PIN = {
  camp_site: "icons/pin-camping.png",
  caravan_site: "icons/pin-stellplatz.png",
  parkplatz: "icons/pin-parkplatz.png",
};
function campKat(t) {
  if (t === "caravan_site") return "caravan_site";
  if (t === "parkplatz") return "parkplatz";
  return "camp_site";
}
function campTypeLabel(t) {
  return { caravan_site: "Wohnmobilstellplatz", parkplatz: "Parkplatz", camp_site: "Campingplatz" }[campKat(t)];
}
function campPin(t) { return PIN[campKat(t)]; }

// Overpass-Abfragen laufen ueber diese eine Funktion:
//  - nacheinander (Warteschlange): overpass-api.de erlaubt pro Nutzer nur ~2 parallele Abfragen.
//  - gestaffelt auf mehrere Server: antwortet der erste nach 4 s noch nicht, wird zusaetzlich
//    der zweite gefragt, nach 8 s der dritte - die erste brauchbare Antwort gewinnt, die
//    anderen werden abgebrochen. Ein Fehler (429/504/kein Netz) holt sofort den naechsten.
//    Vorher wartete jede Stufe bis zu 15 s - bei ueberlastetem Server hing die Karte minutenlang.
//  - nach 30 s ist Schluss, dann zeigt die Karte "Nochmal".
const OVERPASS_SERVER = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const OVERPASS_STAFFEL_MS = 4000, OVERPASS_MAX_MS = 30000;
let overpassKette = Promise.resolve();
function overpassRequest(query) {
  const lauf = overpassKette.then(() => new Promise((resolve, reject) => {
    const ctrls = [], timer = [];
    let gestartet = 0, offen = 0, fertig = false;
    const ende = () => { fertig = true; timer.forEach(clearTimeout); ctrls.forEach(c => c.abort()); };
    const naechster = () => {
      if (fertig || gestartet >= OVERPASS_SERVER.length) return;
      const url = OVERPASS_SERVER[gestartet++];
      const ctrl = new AbortController(); ctrls.push(ctrl); offen++;
      fetch(url, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(query),
      })
        .then(res => { if (!res.ok) throw new Error("Overpass " + res.status); return res.json(); })
        .then(j => { if (!fertig) { ende(); resolve(j); } })
        .catch(() => {
          offen--;
          if (fertig) return;
          if (gestartet < OVERPASS_SERVER.length) naechster();
          else if (offen === 0) { ende(); reject(new Error("Overpass nicht erreichbar")); }
        });
    };
    naechster();
    for (let i = 1; i < OVERPASS_SERVER.length; i++) timer.push(setTimeout(naechster, i * OVERPASS_STAFFEL_MS));
    timer.push(setTimeout(() => { if (!fertig) { ende(); reject(new Error("Overpass Zeitlimit")); } }, OVERPASS_MAX_MS));
  }));
  overpassKette = lauf.catch(() => {});   // ein Fehlschlag haelt die Schlange nicht an
  return lauf;
}

// Die ganze Umgebung eines Platzes in EINER Abfrage: Parken, Camping, Stellplatz, Hotel,
// Essen, Seilbahn. Vorher bis zu vier Einzelabfragen - jede konnte an der Ueberlast
// scheitern. Die Filter blenden danach nur noch ein/aus, ohne Netz.
// Gespeichert wird nur das Noetige (keine rohen OSM-Tags), 30 Tage.
function campParkAus(e) {
  const t = e.tags || {};
  const la = e.lat != null ? e.lat : e.center && e.center.lat;
  const lo = e.lon != null ? e.lon : e.center && e.center.lon;
  if (la == null || lo == null) return null;
  // Ausstattung nur uebernehmen, wenn sie in OSM ausdruecklich als "yes" getaggt ist.
  // Fehlt ein Tag, heisst das NICHT "nicht vorhanden" - dann zeigen wir es einfach nicht.
  const aus = [];
  if (t.tents === "yes") aus.push("zelt");
  if (t.caravans === "yes") aus.push("wohnwagen");
  if (t.shower === "yes") aus.push("dusche");
  if (t.power_supply === "yes") aus.push("strom");
  if (t.toilets === "yes") aus.push("wc");
  if (t.drinking_water === "yes") aus.push("wasser");
  const parken = t.amenity === "parking";
  const ort = [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(" ");
  return {
    name: t.name || (parken ? "Parkplatz" : "Ohne Namen"),
    type: parken ? "parkplatz" : t.tourism,
    parken, lat: la, lon: lo, aus,
    // fee=no ist eine ausdrueckliche Angabe, fehlendes Tag sagt nichts
    gratis: parken ? (t.fee === "no" ? true : t.fee ? false : null) : null,
    web: t.website || t["contact:website"] || "",
    tel: t.phone || t["contact:phone"] || "",
    adresse: [ort, [t["addr:postcode"], t["addr:city"]].filter(Boolean).join(" ")].filter(Boolean).join(", "),
    saison: t.opening_hours || "",
    plaetze: parken && t.capacity ? t.capacity : "",
  };
}
// Alte Zwischenspeicher (Einzelabfragen bis v127, umg1 bis v128) freigeben - localStorage ist knapp.
try { Object.keys(localStorage).filter(k => /^(poi4_|bf1_|umg1_|umg2_)/.test(k)).forEach(k => localStorage.removeItem(k)); } catch {}
// Nur die Bahn, die zum Start fuehrt - keine Nebenlifte im Skigebiet.
//  Ausgang: Bahnen, deren Bergstation hoechstens 1,5 km vom Start liegt und die von unten
//  heraufkommen. Von jeder aus wird von der Talstation Abschnitt fuer Abschnitt weiter
//  nach unten verbunden. Es bleibt EIN Weg - Nebenlifte, die oben abzweigen, kommen nicht mit.
// Schlepp- und Kinderlifte sind gar nicht erst in den Daten (s. tools/umgebung_bauen.py).
const BAHN_ZUM_START_KM = 1.5, BAHN_ANSCHLUSS_KM = 0.3;
const BAHN_KABINE = new Set(["Seilbahn", "Gondelbahn", "Standseilbahn", "Kombibahn"]);
function bahnEnden(l) { const c = l.coords; return [c[0], c[c.length - 1]].map(([lon, lat]) => ({ lat, lon })); }
// [Bergstation, Talstation]. Mit Hoehe (l.h, s. tools/bahn_hoehen.py) eindeutig; ohne
// (alte Daten, flache Bahn) geraten: das Ende naeher am Start ist oben.
function bahnObenUnten(l, spot) {
  const [a, b] = bahnEnden(l);
  if (l.h) {
    a.h = l.h[0]; b.h = l.h[1];
    if (Math.abs(a.h - b.h) >= 30) return a.h > b.h ? [a, b] : [b, a];
  }
  const zumStart = p => haversineExact(spot.lat, spot.lon, p.lat, p.lon);
  return zumStart(a) <= zumStart(b) ? [a, b] : [b, a];
}
function bahnenZumStart(spot, linien) {
  const zumStart = p => haversineExact(spot.lat, spot.lon, p.lat, p.lon);
  const kand = linien.map(l => {
    const [oben, unten] = bahnObenUnten(l, spot);
    return { l, oben, unten, d: zumStart(oben) };
  });
  // "Tiefer als" - mit Hoehe echt, ohne ueber den Abstand zum Start
  const tiefer = (p, q) => p.h != null && q.h != null ? p.h < q.h - 30 : zumStart(p) > zumStart(q);
  // Von einer Bahn aus Abschnitt fuer Abschnitt nach unten (Tal -> Mittel -> Berg)
  const kette = erste => {
    const weg = [erste];
    for (let unten = erste.unten; weg.length < 5;) {
      // Unterhalb einer Kabinenbahn nur noch Kabinenbahnen (mehrteilige Seilbahn) - ein
      // Sessellift dort unten gehoert fast immer zu einem anderen Hang des Skigebiets.
      const nurKabine = weg.some(k => BAHN_KABINE.has(k.l.art));
      const weiter = kand
        .filter(k => !weg.includes(k) && haversineExact(k.oben.lat, k.oben.lon, unten.lat, unten.lon) <= BAHN_ANSCHLUSS_KM
          && tiefer(k.unten, unten) && (!nurKabine || BAHN_KABINE.has(k.l.art)))
        .sort((x, y) => tiefer(x.unten, y.unten) ? -1 : tiefer(y.unten, x.unten) ? 1 : 0)[0];
      if (!weiter) break;
      weg.push(weiter); unten = weiter.unten;
    }
    return weg;
  };
  // Mit Hoehe: die Bahn muss von deutlich unterhalb des Starts heraufkommen. Liegt der Start
  // an ihrer Talstation (Falera, Uebungshaenge im Tal), fuehrt sie nicht zum Start, sondern weg.
  const kommtHoch = k => k.unten.h == null || !spot.elevation || k.unten.h < spot.elevation - 100;
  const lande = [];
  if (spot.landeLat != null) lande.push({ lat: spot.landeLat, lon: spot.landeLon });
  (spot.landeExtra || []).forEach(l => { if (l.lat != null) lande.push(l); });
  const zurLandung = weg => {
    if (!lande.length) return 0;
    const tal = weg[weg.length - 1].unten;
    return Math.min(...lande.map(l => haversineExact(l.lat, l.lon, tal.lat, tal.lon)));
  };
  const wege = kand.filter(k => k.d <= BAHN_ZUM_START_KM && kommtHoch(k)).map(k => {
    const weg = kette(k);
    return { k, weg, kabine: weg.some(x => BAHN_KABINE.has(x.l.art)), lande: zurLandung(weg) };
  });
  // Talstation moeglichst nah am Landeplatz: nach dem Flug will man wieder hoch bzw. zum
  // Auto an der Talstation (Zell am See: areitXpress statt Schmittenhoehebahn). Eine
  // Kabinenbahn zaehlt wie 1,5 km Vorsprung - Gerlitzen: Kanzelbahn + Gipfelbahn statt
  // eines der Sessellifte, die oben auch alle am Start enden. Gerundet auf 0,5 km, bei
  // Gleichstand gewinnt die Bahn, die naeher am Start ankommt.
  const wert = w => Math.round((w.lande - (w.kabine ? 1.5 : 0)) * 2);
  wege.sort((x, y) => (wert(x) - wert(y)) || x.k.d - y.k.d);
  return wege.length ? wege[0].weg.map(k => k.l) : [];
}
// Gondel-Icon an beiden Enden jeder gezeigten Bahn: Berg- und Talstation s. bahnObenUnten(). Wo zwei Abschnitte aneinanderstossen (unter 150 m),
// steht nur ein Icon "Mittelstation". Namen aus den OSM-Stationen, wenn eine dort liegt.
function bahnStationen(spot, linien, osmStationen) {
  const out = [];
  for (const l of linien) {
    const [oben, unten] = bahnObenUnten(l, spot);
    for (const [p, rolle] of [[oben, "Bergstation"], [unten, "Talstation"]]) {
      const da = out.find(o => haversineExact(o.lat, o.lon, p.lat, p.lon) < 0.15);
      if (da) { da.art = "Mittelstation"; da.bahnen.push(l.name || l.art); da.web = da.web || l.web || ""; continue; }
      const osm = osmStationen.find(st => haversineExact(st.lat, st.lon, p.lat, p.lon) < 0.15 && !GENERISCH.has(st.name));
      out.push({ lat: p.lat, lon: p.lon, art: rolle, bahnen: [l.name || l.art], osmName: osm ? osm.name : "",
        // Website: an der Bahn, sonst an der OSM-Station; Betreiber fuer die Suche
        web: l.web || (osm && osm.web) || "", tel: (osm && osm.tel) || "", betreiber: l.betreiber || "" });
    }
  }
  // Titel: Stationsname aus OSM, sonst die Bahn(en); darunter, welche Station es ist
  // Ohne Website: Google-Suche nach Bahn (+ Betreiber, + Ort) und "Preise" - klappt immer
  const ort = (spot.gemeinde || spot.region || "").replace(/^\d{4,5}\s*/, "").split(",")[0];
  // Gebietsname dazu ("Gipfelbahn" gibt es in vielen Skigebieten): "Gerlitzen (S)" -> "Gerlitzen"
  const gebiet = spot.name.replace(/\s*\([^)]*\)\s*$/, "").split(/\s+-\s+/)[0];
  return out.map(o => ({ lat: o.lat, lon: o.lon, art: o.art, name: o.osmName || o.bahnen.join(" / "), web: o.web, tel: o.tel,
    bahnWeb: true, sucheQ: o.web ? "" : [o.bahnen.filter(b => !BAHN_KABINE.has(b))[0] || o.bahnen[0], gebiet, o.betreiber, ort !== gebiet ? ort : "", "Preise"].filter(Boolean).join(" ") }));
}
// In OSM steht ein Lokal oft zweimal: als Gebaeude und als Punkt darin. Gleicher Name und
// weniger als 150 m auseinander = dasselbe. Namenlose ("Parkplatz", "Toilette") nur, wenn sie
// fast aufeinander liegen (30 m) - zwei Parkplaetze nebeneinander sind wirklich zwei.
const GENERISCH = new Set(["Parkplatz", "Toilette", "Bahnstation", "Ohne Namen", "Einkehr", "Unterkunft", "Supermarkt", "Haltestelle", "Tankstelle"]);
function ohneDoppelte(arr) {
  const out = [];
  for (const c of arr) {
    const grenze = GENERISCH.has(c.name) ? 0.03 : 0.15;
    if (!out.some(o => o.name === c.name && o.parken === c.parken && haversineExact(o.lat, o.lon, c.lat, c.lon) < grenze)) out.push(c);
  }
  return out;
}
// Vorberechnete Umgebung vom eigenen Server (umgebung/<id>.json, monatlich per GitHub
// Actions aus den OSM-Laenderdateien gebaut - s. tools/umgebung_bauen.py). Schnell und ohne
// Overpass. Fehlt die Datei (eigene Plaetze, neue DB-Eintraege) -> null, dann live.
async function fetchVorberechnet(spot) {
  if (!spot.id.startsWith("db_")) return null;
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`umgebung/${encodeURIComponent(spot.id)}.json`, { signal: ctrl.signal });
    if (!res.ok) return null;
    const v = await res.json();
    return v && Array.isArray(v.cp) ? v : null;
  } catch { return null; }
  finally { clearTimeout(to); }
}
async function fetchUmgebung(spot) {
  const sLat = spot.lat, sLon = spot.lon;
  const lLat = spot.landeLat != null ? spot.landeLat : sLat, lLon = spot.landeLon != null ? spot.landeLon : sLon;
  const r3 = x => x.toFixed(3);
  // umg3: seit v144 mit OePNV und Tankstelle - aeltere Eintraege haben die nicht
  const key = `umg3_${r3(sLat)}_${r3(sLon)}_${r3(lLat)}_${r3(lLon)}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) { const c = JSON.parse(raw); if (Date.now() - c.t < CAMP_TTL) return c.v; }
  } catch {}
  const um = (r, la, lo) => `(around:${r},${la},${lo})`;
  const q = `[out:json][timeout:25];(`
    + `nwr["tourism"~"^(camp_site|caravan_site)$"]${um(CAMP_RADIUS_M, lLat, lLon)};`
    + `nwr["amenity"="parking"]${um(PARK_RADIUS_M, lLat, lLon)};`
    + `nwr["amenity"="parking"]${um(PARK_RADIUS_M, sLat, sLon)};`
    + `nwr["tourism"~"^(hotel|guest_house|hostel|motel)$"]${um(10000, lLat, lLon)};`
    + `nwr["amenity"~"^(restaurant|cafe|biergarten)$"]${um(4000, sLat, sLon)};`
    + `nwr["amenity"~"^(restaurant|cafe|biergarten)$"]${um(4000, lLat, lLon)};`
    + `nwr["tourism"="alpine_hut"]${um(8000, sLat, sLon)};`
    + `nwr["shop"="supermarket"]${um(5000, sLat, sLon)};`
    + `nwr["shop"="supermarket"]${um(5000, lLat, lLon)};`
    + `nwr["amenity"="toilets"]${um(3000, sLat, sLon)};`
    + `nwr["amenity"="toilets"]${um(3000, lLat, lLon)};`
    + `node["highway"="bus_stop"]${um(2000, sLat, sLon)};node["highway"="bus_stop"]${um(2000, lLat, lLon)};`
    + `nwr["railway"~"^(station|halt|tram_stop)$"]${um(2000, sLat, sLon)};nwr["railway"~"^(station|halt|tram_stop)$"]${um(2000, lLat, lLon)};`
    + `nwr["amenity"="fuel"]${um(8000, lLat, lLon)};`
    + `node["aerialway"="station"]${um(7000, sLat, sLon)};`
    + `)->.p;.p out center 700;(`
    + `way["aerialway"~"^(cable_car|gondola|chair_lift|mixed_lift)$"]${um(7000, sLat, sLon)};`
    + `way["railway"="funicular"]${um(7000, sLat, sLon)};`
    + `)->.b;.b out geom 80;`;
  try {
    const data = await overpassRequest(q);
    const v = { cp: [], hotel: [], essen: [], supermarkt: [], toilette: [], oepnv: [], tankstelle: [], linien: [], stationen: [] };
    const seen = new Set();
    const klein = (p, art) => ({ name: p.name, lat: p.lat, lon: p.lon, web: p.web, tel: p.tel, adresse: p.adresse, saison: p.saison, aus: [], art });
    for (const e of data.elements || []) {
      if (seen.has(e.type + e.id)) continue; seen.add(e.type + e.id);
      const t = e.tags || {};
      if (e.type === "way" && Array.isArray(e.geometry) && (t.aerialway || t.railway === "funicular")) {
        if (e.geometry.length > 1) v.linien.push({ name: t.name || "", art: BF_BAHN_ART[t.aerialway] || BF_BAHN_ART[t.railway] || "Bergbahn",
          coords: e.geometry.map(g => [+g.lon.toFixed(5), +g.lat.toFixed(5)]) });
        continue;
      }
      if (t.amenity === "parking" || t.tourism === "camp_site" || t.tourism === "caravan_site") {
        const c = campParkAus(e); if (c) v.cp.push(c); continue;
      }
      if (t.aerialway === "station") { const p = osmPoi(e, "Bahnstation"); if (p) v.stationen.push(klein(p, "Bergbahn-Station")); continue; }
      if (t.highway === "bus_stop" || (OEPNV_ART[t.railway] && t.station !== "funicular")) {
        const p = osmPoi(e, "Haltestelle"); if (p) v.oepnv.push(klein(p, t.highway === "bus_stop" ? "Bushaltestelle" : OEPNV_ART[t.railway])); continue;
      }
      if (t.amenity === "fuel") { const p = osmPoi(e, t.brand || "Tankstelle"); if (p) v.tankstelle.push(klein(p, "Tankstelle")); continue; }
      if (t.shop === "supermarket") { const p = osmPoi(e, "Supermarkt"); if (p) v.supermarkt.push(klein(p, "Supermarkt")); continue; }
      if (t.amenity === "toilets") {
        const p = osmPoi(e, "Toilette");
        // Gebuehr nur zeigen, wenn ausdruecklich getaggt
        if (p) v.toilette.push(klein(p, t.fee === "no" ? "Toilette · kostenlos" : t.fee === "yes" ? "Toilette · gebührenpflichtig" : "Toilette"));
        continue;
      }
      if (BF_HOTEL_ART[t.tourism]) { const p = osmPoi(e, "Unterkunft"); if (p) v.hotel.push(klein(p, BF_HOTEL_ART[t.tourism])); continue; }
      const essArt = BF_ESSEN_ART[t.amenity] || BF_ESSEN_ART[t.tourism];
      if (essArt) { const p = osmPoi(e, "Einkehr"); if (p) v.essen.push(klein(p, essArt)); }
    }
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
    return v;
  } catch { return null; }
}
// Kleines Fenster beim Antippen eines Markers: was es ist, wie weit, und was man
// damit tun kann (navigieren, Website, anrufen).
// Alles, was ueber den Startplatz in den Daten steht - fuer den Info-Knopf im Kartenkasten.
// Leere Felder fallen weg, nichts wird geschaetzt.
function infosStart(spot) {
  const a = spot.acc || "";
  const zustieg = [a.includes("a") && "Auto", a.includes("b") && "Bergbahn", a.includes("f") && "zu Fuß"].filter(Boolean).join(", ");
  const rows = [
    ["Ort", [spot.gemeinde, spot.bundesland].filter(Boolean).join(", ")],
    ["Höhe", spot.elevation != null ? spot.elevation + " m ü. NN" : ""],
    ["Startrichtung", spot.sectorLabel || ""],
    ["Höhendifferenz", spot.hoehendiff ? spot.hoehendiff + " m" : ""],
    ["Schwierigkeit", spot.diff ? diffLabelFull(spot).text : ""],
    ["Zugelassen", spot.gleitschirm || ""],
    ["Zustieg", zustieg],
    ["Koordinaten", `${spot.lat.toFixed(5)}, ${spot.lon.toFixed(5)}`],
  ];
  const links = [];
  if (spot.dhv) links.push({ label: "DHV-Geländedaten", href: `https://service.dhv.de/db2/details.php?qi=glp_details&item=${spot.dhv}` });
  if (spot.vereinUrl) links.push({ label: "Verein", href: spot.vereinUrl });
  if (spot.livewetter) links.push({ label: "Live-Wetter", href: spot.livewetter });
  if (spot.webcam && spot.webcam !== spot.livewetter) links.push({ label: "Live-Cam", href: spot.webcam });
  return { rows, text: spot.bemerkung || "", links };
}
// Noetige Gleitzahl Start -> Landeplatz (Luftlinie / Hoehenunterschied), z. B. "Gleitzahl 3,6"
function gleitzahlTxt(spot, l) {
  if (l.hoehe == null || spot.elevation == null || spot.elevation <= l.hoehe || l.lat == null) return "";
  const m = haversineExact(spot.lat, spot.lon, l.lat, l.lon) * 1000;
  return m > 100 ? `Gleitzahl ${(m / (spot.elevation - l.hoehe)).toFixed(1).replace(".", ",")}` : "";
}
function infosLande(spot, l) {
  const rows = [["Höhe", l.hoehe != null ? l.hoehe + " m ü. NN" : ""]];
  if (l.lat != null && spot.lat != null) {
    const km = haversineExact(spot.lat, spot.lon, l.lat, l.lon);
    rows.push(["Entfernung zum Start", distTxt(km)]);
    if (l.hoehe != null && spot.elevation != null && spot.elevation > l.hoehe) {
      const dh = spot.elevation - l.hoehe;
      rows.push(["Höhendifferenz", `${dh} m`]);
      if (km * 1000 > 100) rows.push(["Gleitzahl", `${(km * 1000 / dh).toFixed(1).replace(".", ",")} nötig`]);
    }
    rows.push(["Koordinaten", `${l.lat.toFixed(5)}, ${l.lon.toFixed(5)}`]);
  }
  return { rows, text: "", links: [] };
}
function poiInfoHtml(infos) {
  const rows = infos.rows.filter(([, v]) => v);
  if (!rows.length && !infos.text && !infos.links.length) return "";
  return `<div class="poi-pop-detail" hidden>
    <div class="poi-info-rows">${rows.map(([k, v]) => `
      <div class="poi-info-row"><span>${escHtml(k)}</span><b>${escHtml(v)}</b></div>`).join("")}</div>
    ${infos.text ? `<p class="poi-info-text">„${escHtml(infos.text)}"</p>` : ""}
    ${infos.links.map(l => `<a class="poi-act" href="${escHtml(l.href)}" target="_blank" rel="noopener">${IC_GLOBE}${escHtml(l.label)}</a>`).join("")}
    <button type="button" class="poi-act" data-poi-back>${IC_ZURUECK}Zurück</button>
  </div>`;
}
const IC_INFO_KREIS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>`;
const IC_ZURUECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`;

function googleMapsSucheUrl(q) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
// Suchbegriff fuer Google Maps: Name + Adresse, ohne Adresse Name + Ort des Startplatzes.
// Namenlose Eintraege ("Parkplatz", "Toilette") bekommen keinen - Google wuerde nur raten.
const BF_GOOGLE_KAT = new Set(["camping", "stellplatz", "hotel", "essen", "supermarkt", "tankstelle"]);
function googleSuchbegriff(c, cat, spot) {
  if (!BF_GOOGLE_KAT.has(cat) || !c.name || GENERISCH.has(c.name)) return "";
  // Nur Hausnummer ohne Strasse ("2, 87645 Schwangau") hilft Google nicht - weglassen
  const adr = (c.adresse || "").replace(/^\d+\s*\w?\s*,\s*/, "");
  const ort = adr || (spot && (spot.gemeinde || spot.region)) || "";
  return [c.name, ort].filter(Boolean).join(", ");
}
function poiPopupHtml(c, titel, pin, untertitel, infos) {
  const zeilen = [];
  if (c.adresse) zeilen.push(c.adresse);
  if (c.plaetze) zeilen.push(`${escHtml(c.plaetze)} Stellplätze`);
  if (c.saison) zeilen.push(`Geöffnet: ${escHtml(c.saison)}`);
  if (c.aus && c.aus.length) zeilen.push(c.aus.map(k => (CAMP_AUS[k] || {}).label).filter(Boolean).join(" · "));
  const akt = [];
  akt.push(`<a class="poi-act primary" href="${mapsUrl(c)}" target="_blank" rel="noopener">${IC_CAR}Hierhin navigieren</a>`);
  if (c.web) akt.push(`<a class="poi-act" href="${escHtml(c.web)}" target="_blank" rel="noopener">${IC_GLOBE}${c.bahnWeb ? "Website der Bahn · Preise" : "Website"}</a>`);
  if (c.sucheQ) akt.push(`<a class="poi-act" href="https://www.google.com/search?q=${encodeURIComponent(c.sucheQ)}" target="_blank" rel="noopener">${IC_GLOBE}Preise &amp; Website suchen</a>`);
  if (c.tel) akt.push(`<a class="poi-act" href="tel:${escHtml(c.tel.replace(/\s/g, ""))}">${IC_PHONE}Anrufen</a>`);
  // Google-Bewertungen: nur als Link - Google erlaubt Places-Daten (Sterne) nicht auf einer
  // OSM-Karte, und speichern duerfte man sie auch nicht. Der Link oeffnet den Ort in Google Maps.
  if (c.googleQ) akt.push(`<a class="poi-act" href="${googleMapsSucheUrl(c.googleQ)}" target="_blank" rel="noopener">${IC_PIN}In Google Maps öffnen</a>`);
  const detail = infos ? poiInfoHtml(infos) : "";
  if (detail) akt.push(`<button type="button" class="poi-act" data-poi-info>${IC_INFO_KREIS}Alle Infos</button>`);
  return `<div class="poi-pop">
    <div class="poi-pop-head">
      <img src="${pin}" alt="">
      <div><b>${escHtml(titel)}</b><span>${escHtml(untertitel)}</span></div>
    </div>
    ${zeilen.length ? `<div class="poi-pop-info">${zeilen.map(z => `<div>${z}</div>`).join("")}</div>` : ""}
    <div class="poi-pop-acts">${akt.join("")}</div>
    ${detail}
  </div>`;
}
function poiPopup(html) {
  return new maplibregl.Popup({ offset: 16, closeButton: true, maxWidth: "260px", className: "poi-popup" }).setHTML(html);
}

// ---------------- Langes Drücken auf die Hauptkarte: eigenen Platz hier anlegen ----------------
// Bewusst ein eigener Timer statt des contextmenu-Ereignisses: auf iOS feuert contextmenu
// auf dem Karten-Canvas nicht verlaesslich. Windrichtungen werden NICHT geraten - der Druck
// fuellt nur Koordinaten, Ort und Hoehe vor, den Rest traegt der Nutzer im Formular ein.
const LP_DAUER = 600, LP_TOLERANZ = 10;   // ms halten, erlaubte Fingerbewegung in Pixeln
let lpTimer = null, lpVon = null, lpMarker = null, lpPopup = null;
const IC_PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;

function lpStop() { clearTimeout(lpTimer); lpTimer = null; lpVon = null; }
function lpAufraeumen() {
  if (lpPopup) { lpPopup.remove(); lpPopup = null; }
  if (lpMarker) { lpMarker.remove(); lpMarker = null; }
}
function lpPopupHtml(lat, lon, ort, hoehe, laedt) {
  const zeilen = [`${lat.toFixed(5)}, ${lon.toFixed(5)}`];
  if (ort) zeilen.push(escHtml(ort));
  if (hoehe != null) zeilen.push(`${hoehe} m ü. NN`);
  return `<div class="poi-pop">
    <div class="poi-pop-head">
      <img src="icons/pin-startplatz.png" alt="">
      <div><b>Hier einen Platz anlegen?</b><span>${laedt ? "Ort und Höhe werden geladen …" : "Windrichtungen trägst du selbst ein"}</span></div>
    </div>
    <div class="poi-pop-info">${zeilen.map(z => `<div>${z}</div>`).join("")}</div>
    <div class="poi-pop-acts">
      <button type="button" class="poi-act primary" data-neuerplatz="${lat.toFixed(5)},${lon.toFixed(5)}"
        data-ort="${escHtml(ort || "")}" data-hoehe="${hoehe != null ? hoehe : ""}">${IC_PLUS}Eigenen Platz anlegen</button>
    </div>
  </div>`;
}
async function lpAusloesen(el, x, y) {
  if (navigator.vibrate) navigator.vibrate(15);   // nur Android, iOS kennt das nicht
  const r = el.getBoundingClientRect();
  const ll = mapInstance.unproject([x - r.left, y - r.top]);
  const lat = ll.lat, lon = ll.lng;
  lpAufraeumen();
  const pin = document.createElement("div");
  pin.className = "map-marker map-marker-temp";
  pin.innerHTML = `<img src="icons/marker-start.png" alt="">`;
  lpPopup = poiPopup(lpPopupHtml(lat, lon, null, null, true));
  lpPopup.on("close", () => { if (lpMarker) { lpMarker.remove(); lpMarker = null; } lpPopup = null; });
  lpMarker = new maplibregl.Marker({ element: pin }).setLngLat([lon, lat]).setPopup(lpPopup).addTo(mapInstance);
  lpMarker.togglePopup();
  // Ort und Höhe kommen nach - der Kasten steht schon, damit es sich nicht hängend anfühlt
  const [ort, hoehe] = await Promise.all([
    reverseGeocode(lat, lon).catch(() => null),
    fetchElevation(lat, lon).catch(() => null),
  ]);
  if (lpPopup && lpPopup.isOpen()) lpPopup.setHTML(lpPopupHtml(lat, lon, ort, hoehe, false));
}
function lpSetup(el) {
  const start = (x, y, ziel) => {
    // Nicht auf Markern, Bedienelementen, Legende oder einem offenen Kasten
    if (ziel.closest && ziel.closest(".map-marker, .maplibregl-ctrl, .mini-style-toggle, .map-hier, .maplibregl-popup, .map-legend, .map-attrib")) return;
    lpVon = { x, y };
    lpTimer = setTimeout(() => { lpTimer = null; lpAusloesen(el, x, y); }, LP_DAUER);
  };
  const bewegt = (x, y) => {
    if (!lpVon) return;
    if (Math.abs(x - lpVon.x) > LP_TOLERANZ || Math.abs(y - lpVon.y) > LP_TOLERANZ) lpStop();
  };
  el.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) return lpStop();   // Zwei Finger = Zoomen, nicht halten
    const t = e.touches[0]; start(t.clientX, t.clientY, e.target);
  }, { passive: true });
  el.addEventListener("touchmove", e => { const t = e.touches[0]; if (t) bewegt(t.clientX, t.clientY); }, { passive: true });
  el.addEventListener("touchend", lpStop);
  el.addEventListener("touchcancel", lpStop);
  el.addEventListener("mousedown", e => { if (e.button === 0) start(e.clientX, e.clientY, e.target); });
  el.addEventListener("mousemove", e => bewegt(e.clientX, e.clientY));
  el.addEventListener("mouseup", lpStop);
  el.addEventListener("mouseleave", lpStop);
}
// Uebergabe ans Formular unter "Neu": Koordinaten, Ort und Hoehe stehen schon drin,
// Name und Windrichtungen fehlen noch - beides darf nicht geraten werden.
function neuerPlatzAus(lat, lon, ort, hoehe) {
  resetForm();
  form.lat.value = lat.toFixed(5);
  form.lon.value = lon.toFixed(5);
  if (ort) form.region.value = ort;
  if (hoehe) form.elevation.value = hoehe;
  location.hash = "#/add";
  setTimeout(() => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.name.focus({ preventScroll: true });
  }, 150);
}
// ---------------- Briefing-Karte: Umgebung mit Filtern (wie Park4night) ----------------
// Start- und Landeplatz sind immer zu sehen. Alles andere schaltet man ueber Chips an der
// Karte zu. Alle Kategorien kommen aus EINER Overpass-Abfrage (fetchUmgebung) - die
// Filter blenden nur ein/aus.
const BF_PICTO = {
  parken: `<path d="M9 18V6h4.2a3.4 3.4 0 0 1 0 6.8H9" stroke-width="2.8"/>`,
  bahn: `<path d="M3 6.5 21 3.5" /><path d="M12 5v3.2"/><rect x="6.5" y="8.2" width="11" height="10.3" rx="2.2"/><path d="M6.5 12.6h11"/>`,
  camping: `<path d="M12 5 3.5 19h17z"/><path d="M12 11.5 9.2 19h5.6z"/>`,
  stellplatz: `<path d="M3 16.5V8.5a1.5 1.5 0 0 1 1.5-1.5h9.5l4.5 4.5h1.5v5"/><path d="M3 16.5h2.8M10.2 16.5h3.6M18.2 16.5H21"/><circle cx="8" cy="16.8" r="1.9"/><circle cx="16" cy="16.8" r="1.9"/><path d="M6 10h4"/>`,
  hotel: `<path d="M3 18.5V6.5M3 14h18v4.5"/><path d="M21 14a3.5 3.5 0 0 0-3.5-3.5H11V14"/><circle cx="7" cy="11" r="1.7"/>`,
  essen: `<path d="M7 3.5v6a2 2 0 0 0 4 0v-6M9 9.5v11"/><path d="M17 3.5c-2.2 1.8-2.2 7.2 0 8.5v8.5"/>`,
  supermarkt: `<path d="M3 4.5h2.5l2.2 10.5h10.6l2-7.5H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/>`,
  oepnv: `<rect x="5" y="3.5" width="14" height="14" rx="3"/><path d="M5 11h14M9 20.5l-1.5-3M15 20.5l1.5-3"/><circle cx="8.5" cy="14.3" r=".9"/><circle cx="15.5" cy="14.3" r=".9"/>`,
  tankstelle: `<path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5v15.5M3.5 20.5h12"/><path d="M5 10h9"/><path d="M14 8.5l3 3V17a1.5 1.5 0 0 0 3 0V9l-2.5-2.5"/>`,
  toilette: `<circle cx="7.5" cy="5" r="1.6"/><path d="M5.5 9h4l1 5H9.5v6h-4v-6H4.5z"/><circle cx="16.5" cy="5" r="1.6"/><path d="M14.5 9h4v11M16.5 14v6M14.5 9v6"/>`,
};
const BF_CATS = {
  parken:     { label: "Parken",     farbe: "#2563eb" },
  bahn:       { label: "Seilbahn",   farbe: "#dc2626" },
  camping:    { label: "Camping",    farbe: "#16a34a" },
  stellplatz: { label: "Stellplatz", farbe: "#0d9488" },
  hotel:      { label: "Hotel",      farbe: "#7c3aed" },
  essen:      { label: "Essen",      farbe: "#ea580c" },
  supermarkt: { label: "Supermarkt", farbe: "#db2777" },
  toilette:   { label: "Toilette",   farbe: "#0284c7" },
  oepnv:      { label: "ÖPNV",       farbe: "#d97706" },
  tankstelle: { label: "Tankstelle", farbe: "#475569" },
};
const IC_VOLL_AN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`;
const IC_VOLL_AUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>`;
const BF_ORDER = ["parken", "bahn", "camping", "stellplatz", "hotel", "essen", "supermarkt", "toilette", "oepnv", "tankstelle"];
const BF_FILTER_KEY = "flugwetter_bf_filter";
const BF_DEFAULT = { parken: true, bahn: true, camping: false, stellplatz: false, hotel: false, essen: false, supermarkt: false, toilette: false, oepnv: false, tankstelle: false };
function bfFilter() {
  try { return { ...BF_DEFAULT, ...JSON.parse(localStorage.getItem(BF_FILTER_KEY) || "{}") }; } catch { return { ...BF_DEFAULT }; }
}
function bfSaveFilter(f) { try { localStorage.setItem(BF_FILTER_KEY, JSON.stringify(f)); } catch {} }
// Rundes Farbsymbol als Bild-URL (fuer Chips und Marker-Kasten) - dieselbe Grafik wie der Marker.
const bfIconCache = {};
function bfIconUrl(cat) {
  if (bfIconCache[cat]) return bfIconCache[cat];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="${BF_CATS[cat].farbe}" stroke="#fff" stroke-width="2"/>`
    + `<g transform="translate(4 4)" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${BF_PICTO[cat]}</g></svg>`;
  return (bfIconCache[cat] = "data:image/svg+xml," + encodeURIComponent(svg));
}

// Gemeinsame Felder fuer den Marker-Kasten (poiPopupHtml) aus OSM-Tags.
function osmPoi(e, fallbackName) {
  const t = e.tags || {};
  const lat = e.lat != null ? e.lat : e.center && e.center.lat;
  const lon = e.lon != null ? e.lon : e.center && e.center.lon;
  if (lat == null || lon == null) return null;
  const strasse = [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(" ");
  return {
    name: t.name || fallbackName, lat, lon, aus: [],
    web: t.website || t["contact:website"] || "",
    tel: t.phone || t["contact:phone"] || "",
    adresse: [strasse, [t["addr:postcode"], t["addr:city"]].filter(Boolean).join(" ")].filter(Boolean).join(", "),
    saison: t.opening_hours || "",
    tags: t,
  };
}
const BF_ESSEN_ART = { restaurant: "Restaurant", cafe: "Café", biergarten: "Biergarten", alpine_hut: "Berghütte" };
const OEPNV_ART = { station: "Bahnhof", halt: "Haltepunkt", tram_stop: "Straßenbahn" };
const BF_HOTEL_ART = { hotel: "Hotel", guest_house: "Pension", hostel: "Hostel", motel: "Motel" };
const BF_BAHN_ART = { cable_car: "Seilbahn", gondola: "Gondelbahn", chair_lift: "Sessellift", mixed_lift: "Kombibahn", funicular: "Standseilbahn" };
// Naechster Bezugspunkt (Start oder Landeplatz) - fuer die Entfernungsangabe im Kasten.
function bfNaechster(spot, lat, lon) {
  const ziele = [{ name: "Startplatz", lat: spot.lat, lon: spot.lon }];
  if (spot.landeLat != null) ziele.push({ name: "Landeplatz", lat: spot.landeLat, lon: spot.landeLon });
  let best = ziele[0], bestD = Infinity;
  for (const z of ziele) { const d = haversineExact(z.lat, z.lon, lat, lon); if (d < bestD) { bestD = d; best = z; } }
  return { dist: bestD, ziel: best.name };
}
// Treffer einer Kategorie aus den aufbereiteten Daten eines Platzes (s. bauUmgebung)
function umgItems(d, cat) {
  if (cat === "bahn") return d.bahn.stationen;
  return d[cat] || [];
}
// Seilbahn-Linien als eigene Ebene. setStyle (Karte/Satellit/Gelaende) wirft eigene Ebenen
// weg - deshalb nach jedem style.load erneut anlegen.
const BF_BAHN_SRC = "bf-bahn";
function bfBahnLayer(force) {
  const m = mapInstance; if (!m) return;
  const zeigen = !!bfFilter().bahn && m.getZoom() >= UMG_ZOOM;
  const gesehen = new Set(), features = [];
  if (zeigen) for (const { d } of umgDaten) for (const l of d.bahn.linien) {
    const k = l.name + "|" + l.coords.length + "|" + l.coords[0].join(",");
    if (gesehen.has(k)) continue; gesehen.add(k);
    features.push({ type: "Feature", geometry: { type: "LineString", coordinates: l.coords }, properties: { name: l.name, art: l.art } });
  }
  const data = { type: "FeatureCollection", features };
  try {
    const src = m.getSource(BF_BAHN_SRC);
    if (src) { if (force) src.setData(data); return; }   // ohne force nur anlegen: setData loest ein Neuzeichnen und damit wieder "idle" aus
    m.addSource(BF_BAHN_SRC, { type: "geojson", data });
    m.addLayer({ id: "bf-bahn-casing", type: "line", source: BF_BAHN_SRC, layout: { "line-cap": "round" },
      paint: { "line-color": "#fff", "line-width": 6, "line-opacity": 0.9 } });
    m.addLayer({ id: "bf-bahn-line", type: "line", source: BF_BAHN_SRC, layout: { "line-cap": "round" },
      paint: { "line-color": BF_CATS.bahn.farbe, "line-width": 3 } });
  } catch {}   // Stil noch nicht fertig - kommt mit dem naechsten "idle" erneut
}
// Symbole der eingeschalteten Kategorien fuer alle Plaetze im Kartenausschnitt (Daten: umgDaten)
let umgZaehler = {};
function bfRender() {
  campMarkers.forEach(m => m.remove());
  campMarkers = [];
  umgZaehler = {};
  const m = mapInstance;
  if (!m || typeof maplibregl === "undefined") return;
  if (m.getZoom() >= UMG_ZOOM) {
    const f = bfFilter(), b = m.getBounds(), gesehen = new Set();
    let n = 0;
    for (const cat of BF_ORDER) {
      if (!f[cat]) continue;
      umgZaehler[cat] = 0;
      for (const { spot, d } of umgDaten) for (const c of umgItems(d, cat)) {
        if (!b.contains([c.lon, c.lat])) continue;
        const key = cat + c.lat.toFixed(5) + c.lon.toFixed(5);
        if (gesehen.has(key)) continue; gesehen.add(key);
        umgZaehler[cat]++;
        if (n++ >= UMG_MAX_MARKER) continue;
        const el = document.createElement("div");
        el.className = `bf-marker bf-m-${cat}`;
        el.title = c.name;
        el.innerHTML = `<img src="${bfIconUrl(cat)}" alt="">`;
        const km = c.dist == null ? "" : distTxt(c.dist);
        const art = c.art || campTypeLabel(c.type);
        const sub = [art, km && (c.ziel || c.zielName) ? `${km} zum ${c.ziel || c.zielName}` : km,
          c.gratis === true ? "kostenlos" : c.gratis === false ? "gebührenpflichtig" : ""].filter(Boolean).join(" · ");
        campMarkers.push(new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([c.lon, c.lat])
          .setPopup(poiPopup(poiPopupHtml({ ...c, googleQ: googleSuchbegriff(c, cat, spot) }, c.name, bfIconUrl(cat), sub)))
          .addTo(m));
      }
    }
  }
  bfBahnLayer(true);
  bfUpdateChips();
}
// Alle Treffer eines Platzes aufbereitet: Entfernung zu Start/Landung, nach Kategorie sortiert.
// Aus den vorberechneten Daten (umgebung/<id>.json, s. fetchVorberechnet).
function bauUmgebung(spot, umg) {
  const lat = spot.landeLat != null ? spot.landeLat : spot.lat;
  const lon = spot.landeLon != null ? spot.landeLon : spot.lon;
  const mitZiel = c => ({ ...c, ...bfNaechster(spot, c.lat, c.lon) });
  const nah = (arr, n) => ohneDoppelte(arr.map(mitZiel).sort((a, b) => a.dist - b.dist)).slice(0, n);
  const d = {
    hotel: nah(umg.hotel || [], 30), essen: nah(umg.essen || [], 40), supermarkt: nah(umg.supermarkt || [], 15),
    toilette: nah(umg.toilette || [], 20), oepnv: nah(umg.oepnv || [], 15), tankstelle: nah(umg.tankstelle || [], 10),
    parken: [], camping: [], stellplatz: [], camp: [],
  };
  const linien = bahnenZumStart(spot, umg.linien || []);
  d.bahn = { linien, stationen: bahnStationen(spot, linien, umg.stationen || []).map(mitZiel) };
  const raw = ohneDoppelte(umg.cp || []);
  // Bezugspunkte fuer Parkplaetze: alle Landeplaetze und der Startplatz. Je Parkplatz
  // wird der naechstgelegene genommen und benannt - "363 m zum Landeplatz" hilft nicht,
  // wenn es vier davon gibt.
  const ziele = [];
  if (spot.landeLat != null && spot.landeLon != null) ziele.push({ name: kurzOrt(spot.landeName || "Landeplatz", spot.name), lat: spot.landeLat, lon: spot.landeLon });
  if (Array.isArray(spot.landeExtra)) spot.landeExtra.forEach(l => ziele.push({ name: kurzOrt(l.name, spot.name), lat: l.lat, lon: l.lon }));
  if (spot.lat != null) ziele.push({ name: "Startplatz", lat: spot.lat, lon: spot.lon });
  // Entfernung: Übernachten ab Landeplatz, Parken ab dem jeweils nächsten Ziel
  const mitDist = raw.map(c => {
    if (!c.parken || !ziele.length) return { ...c, dist: haversineExact(lat, lon, c.lat, c.lon) };
    let best = null, bestD = Infinity;
    for (const z of ziele) {
      const dz = haversineExact(z.lat, z.lon, c.lat, c.lon);
      if (dz < bestD) { bestD = dz; best = z; }
    }
    return { ...c, dist: bestD, zielName: best.name };
  });
  const sortiert = arr => arr.sort((a, b) => (a.name === "Ohne Namen") - (b.name === "Ohne Namen") || a.dist - b.dist);
  d.camp = sortiert(mitDist.filter(c => !c.parken)).slice(0, CAMP_MAX);
  d.camping = d.camp.filter(c => campKat(c.type) === "camp_site");
  d.stellplatz = d.camp.filter(c => campKat(c.type) === "caravan_site");
  // Getrennt deckeln: die Parkplaetze am Landeplatz liegen meist naeher, sonst waeren
  // die am Startplatz nach reiner Entfernungssortierung nie dabei.
  const parken = mitDist.filter(c => c.parken);
  d.parken = [
    ...sortiert(parken.filter(c => c.zielName === "Startplatz")).slice(0, PARK_MAX),
    ...sortiert(parken.filter(c => c.zielName !== "Startplatz")).slice(0, PARK_MAX),
  ];
  d.stand = umg.stand || "";
  return d;
}
// ---------------- Umgebung erscheint beim Heranzoomen ----------------
// Ab UMG_ZOOM holt die Karte fuer die naechsten Startplaetze im Ausschnitt die vorberechneten
// Daten (umgebung/<id>.json) und zeigt die eingeschalteten Kategorien (Filter: Knopf "Umgebung").
const UMG_ZOOM = 12, UMG_MAX_PLAETZE = 8, UMG_MAX_MARKER = 160;
const umgCache = new Map();   // spot.id -> Promise<aufbereitete Daten | null>
let umgDaten = [];            // [{ spot, d }] fuer den aktuellen Ausschnitt
let umgToken = 0, umgTimer = null, umgOffen = 0;
function umgHole(spot) {
  if (!spot.id.startsWith("db_")) return Promise.resolve(null);   // eigene Plaetze: keine vorberechnete Datei
  if (!umgCache.has(spot.id)) {
    umgCache.set(spot.id, fetchVorberechnet(spot).then(u => u ? bauUmgebung(spot, u) : null).catch(() => null)
      .then(d => { if (!d) umgCache.delete(spot.id); return d; }));
  }
  return umgCache.get(spot.id);
}
function umgAktualisieren() {
  clearTimeout(umgTimer);
  umgTimer = setTimeout(umgJetzt, 250);
}
async function umgJetzt() {
  const m = mapInstance, token = ++umgToken;
  if (!m) return;
  const aktiv = BF_ORDER.some(c => bfFilter()[c]);
  if (document.getElementById("mapView").hidden || m.getZoom() < UMG_ZOOM || !aktiv) {
    if (umgDaten.length || campMarkers.length) { umgDaten = []; bfRender(); }
    umgOffen = 0; bfUpdateChips();
    return;
  }
  // Plaetze, deren Start oder Landung im (etwas erweiterten) Ausschnitt liegt, die naechsten zuerst
  const b = m.getBounds(), c = m.getCenter();
  const dx = (b.getEast() - b.getWest()) * 0.15, dy = (b.getNorth() - b.getSouth()) * 0.15;
  const drin = (la, lo) => la != null && lo != null && la > b.getSouth() - dy && la < b.getNorth() + dy && lo > b.getWest() - dx && lo < b.getEast() + dx;
  const plaetze = allKnownSpots().filter(sp => sp.id.startsWith("db_") && (drin(sp.lat, sp.lon) || drin(sp.landeLat, sp.landeLon)))
    .map(sp => ({ sp, dist: haversineExact(c.lat, c.lng, sp.lat, sp.lon) }))
    .sort((x, y) => x.dist - y.dist).slice(0, UMG_MAX_PLAETZE).map(x => x.sp);
  umgOffen = plaetze.filter(sp => !umgCache.has(sp.id)).length;
  bfUpdateChips();
  const daten = await Promise.all(plaetze.map(async sp => ({ spot: sp, d: await umgHole(sp) })));
  if (token !== umgToken) return;   // Karte hat sich inzwischen weiterbewegt
  umgDaten = daten.filter(x => x.d);
  umgOffen = 0;
  bfRender();
}
// Karte auf Start und Landung zoomen - nah genug, dass die Umgebung (ab UMG_ZOOM) erscheint
function umgZoomAuf(spot) {
  const m = mapInstance; if (!m) return;
  const pts = [[spot.lon, spot.lat], ...umgPlaetze(spot).map(l => [l.lon, l.lat])];
  const lons = pts.map(q => q[0]), lats = pts.map(q => q[1]);
  const cam = m.cameraForBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
    { padding: { top: 90, bottom: 130, left: 50, right: 50 }, maxZoom: 14.5 });
  // Start und Landung moeglichst im Bild - aber nah genug, dass die Umgebung erscheint
  m.flyTo({ center: cam ? cam.center : [spot.lon, spot.lat], zoom: Math.max(cam ? cam.zoom : 13, UMG_ZOOM + 0.3), duration: 800 });
}
// Tipp auf einen Startplatz der Karte: reinzoomen und kurze Karte unten zeigen. Zweiter Tipp
// auf denselben Platz (oder "Details") oeffnet das Detailfenster.
let umgKarteId = null;
function spotAntippen(id, ts) {
  const spot = getSpot(id); if (!spot) return;
  if (umgKarteId === id) { openDetail(id); return; }
  umgKarteId = id;
  const st = !ts ? "" : ts.status === "gut" ? "Gute Bedingungen" : ts.status === "grenz" ? "Grenzwertig" : (ts.reasonText || "Nicht fliegbar");
  const ort = [spot.gemeinde, spot.bundesland].filter(Boolean).join(", ") || spot.region || "";
  const card = document.getElementById("umgCard");
  card.innerHTML = `<div class="uc-txt"><div class="uc-name">${escHtml(spot.name)}</div>
      <div class="uc-sub">${ts ? `<span class="uc-st ${ts.status}">${statusDot(ts.status)} ${escHtml(st)}</span> · ` : ""}${escHtml(ort)}${spot.elevation != null ? ` · ${spot.elevation} m` : ""}</div></div>
    <button type="button" class="uc-go" data-ucgo="${spot.id}">Details</button>
    <button type="button" class="uc-x" data-ucx aria-label="Schließen">✕</button>`;
  card.hidden = false;
  umgZoomAuf(spot);
}
function umgKarteZu() {
  umgKarteId = null;
  const card = document.getElementById("umgCard"); if (card) card.hidden = true;
}
// Meldung unten auf der Karte (laedt / Hinweis) und Zaehler im Umgebungs-Filter
let umgHinweis = "";
function bfUpdateChips() {
  fsUpdateCount();
  const msg = document.getElementById("bfMsg");
  if (msg) {
    if (umgOffen > 0) {
      msg.innerHTML = `<span class="bf-spin"></span><span>Umgebung wird geladen …</span>`;
      msg.className = "bf-msg"; msg.hidden = false;
    } else if (umgHinweis) {
      msg.innerHTML = `<span>${umgHinweis}</span>`;
      msg.className = "bf-msg"; msg.hidden = false;
    } else msg.hidden = true;
  }
  // Trefferzahl je Zeile (im aktuellen Ausschnitt) und Stand der Daten
  document.querySelectorAll("#fsRows .fs-cnt").forEach(c => {
    const cat = c.closest("[data-fscat]").dataset.fscat;
    c.textContent = umgZaehler[cat] != null ? String(umgZaehler[cat]) : "";
  });
  const standEl = document.getElementById("bfStand");
  const stand = (umgDaten.find(x => x.d.stand) || { d: {} }).d.stand;
  if (standEl) { if (stand) { const [j, mo] = stand.split("-"); standEl.textContent = ` · Stand ${mo}/${j}`; } else standEl.textContent = ""; }
}
const CAMP_AUS = {
  zelt:      { label: "Zelt",       ic: `<path d="M12 4 3 20h18z"/><path d="M12 4v16"/>` },
  wohnwagen: { label: "Wohnwagen",  ic: `<path d="M3 16V9a2 2 0 0 1 2-2h11a4 4 0 0 1 4 4v5"/><path d="M3 16h3M11 16h9"/><circle cx="8.5" cy="16" r="2"/>` },
  dusche:    { label: "Dusche",     ic: `<path d="M4 20V8a4 4 0 0 1 8 0"/><path d="M9 8h9"/><path d="M15 12v.01M18 12v.01M15 16v.01M18 16v.01M12 14v.01"/>` },
  strom:     { label: "Strom",      ic: `<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>` },
  wc:        { label: "WC",         ic: `<circle cx="8" cy="4" r="2"/><path d="M6 22v-6H4l2.5-7h3L12 16h-2v6z"/><circle cx="17" cy="4" r="2"/><path d="M14.5 22 17 9l2.5 13"/>` },
  wasser:    { label: "Trinkwasser",ic: `<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/>` },
};
// "Hohenneuffen - Nord Toplandeplatz" -> "Toplandeplatz": den Platznamen vorne abschneiden,
// damit in der Parkplatz-Zeile steht, ZU WELCHEM Ziel die Entfernung gilt.
function kurzOrt(name, spotName) {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "");
  const nSpot = norm(spotName.replace(/\s*\([^)]*\)\s*$/, ""));
  const nName = norm(name);
  if (!nSpot || !nName.startsWith(nSpot) || nName.length <= nSpot.length) return name;
  let zaehler = 0, i = 0;
  for (; i < name.length && zaehler < nSpot.length; i++) if (norm(name[i])) zaehler++;
  return name.slice(i).replace(/^[\s–-]+/, "").trim() || name;
}

// ---------------- Briefing-Tab: Platzregeln, Fotos, Kontakte ----------------
// Inhalte kommen aus briefings.js (nur fuer gepflegte Fluggebiete). Ohne Eintrag
// wird der Tab gar nicht erst angeboten - s. renderCard.
function briefingFor(spot) {
  return (typeof BRIEFING_BY_SPOT !== "undefined" && BRIEFING_BY_SPOT[spot.id]) || null;
}
// ---- Flug-Check: Kopfzeile + drei Schritte ----
// Fuellt sich aus dem, was die App ohnehin weiss (Bewertung, Fenster, Hoehen, Sektor,
// Zustieg) und ergaenzt gepflegte Texte aus briefings.js, wo vorhanden. Abschnitte ohne
// Inhalt fallen weg - sonst stuende bei den ~2800 ungepflegten Plaetzen ein leeres Geruest.
const FC_CHECK = `<svg class="fc-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>`;
const FC_WARN = `<svg class="fc-warn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>`;
const FC_INFO = `<svg class="fc-info-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>`;

// Zustiegs-Punkte bekommen statt des Hakens ihr eigenes Bild (Hike & Fly, Auto, Bergbahn)
const FC_ZUSTIEG_BILD = { hikefly: "icons/ic-hikefly.png", auto: "icons/ic-auto.png", bahn: "icons/ic-bahn.png" };
// Anreise-Symbole als Strichzeichnung in einer Kachel - leichter als die farbigen PNGs
// und sie nehmen die Textfarbe an, passen also in beiden Themes.
const ZUSTIEG_IC = {
  auto: `<rect x="2.6" y="9.4" width="18.8" height="6.8" rx="2.1"/><path d="M5.6 9.4 7.3 5.7A1.7 1.7 0 0 1 8.8 4.8h6.4a1.7 1.7 0 0 1 1.5.9l1.7 3.7"/><circle cx="6.9" cy="12.9" r="1"/><circle cx="17.1" cy="12.9" r="1"/><path d="M4.4 16.2v1.9M19.6 16.2v1.9"/>`,
  bahn: `<path d="M2 5.2 22 3.1"/><path d="M12 4.2v2.4"/><rect x="6.3" y="6.6" width="11.4" height="9" rx="2.4"/><path d="M6.3 10.6h11.4"/><path d="M9.4 15.6 8.2 18.2M14.6 15.6l1.2 2.6"/>`,
  fuss: `<circle cx="12.6" cy="4.3" r="1.9"/><path d="M10.7 21.4l1.9-6-2.3-2 1.1-4.8 3.2 1.6 1.4 2.8 2.6.9"/><path d="M10.4 8.6 7.3 10.2 6.1 13"/><path d="M12.3 15.4l2.3 2.3 1.1 3.7"/>`,
};
function anreiseHtml(items) {
  if (!items.length) return "";
  return `<div class="anr-list">${items.map(i => `
    <div class="anr-row">
      <span class="anr-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ZUSTIEG_IC[i.ic]}</svg></span>
      <div class="anr-txt"><div class="anr-titel">${escHtml(i.titel)}</div><div class="anr-sub">${escHtml(i.sub)}${i.href ? ` · <a class="anr-link" href="${i.href}" target="_blank" rel="noopener">Preise &amp; Zeiten ›</a>` : ""}</div></div>
    </div>`).join("")}</div>`;
}
function fcList(items) {
  if (!items || !items.length) return "";
  return `<ul class="fc-list">${items.map(t => {
    const txt = typeof t === "string" ? t : t.text;
    const bild = typeof t === "object" && t.bild ? FC_ZUSTIEG_BILD[t.bild] : null;
    const vorn = bild ? `<img class="fc-li-img" src="${bild}" alt="">` : FC_CHECK;
    return `<li>${vorn}<span>${escHtml(txt)}</span></li>`;
  }).join("")}</ul>`;
}
function fcStep(nr, titel, inhalt, offen) {
  if (!inhalt.trim()) return "";
  return `<details class="fc-step"${offen ? " open" : ""}>
    <summary><span class="fc-num">${nr}</span><span class="fc-title">${nr}. ${titel}</span></summary>
    <div class="fc-body">${inhalt}</div>
  </details>`;
}
// Was an diesem Platz grundsaetzlich geht (nicht das Tageswetter!).
// Zwei Quellen mit unterschiedlicher Verlaesslichkeit:
//  - Tandem/Schulung stehen als offizielle DHV-Angabe im Feld "gleitschirm" (98 % der Plaetze)
//  - Soaring/Thermik/Strecke sind aus der Hoehendifferenz abgeleitet, also eine Einschaetzung
const FLUGART_MIN = { soaring: 150, thermik: 400, strecke: 800 };
const FA_ICONS = {
  abgleiter: `<path d="M3 6l7 4 4-3 7 5"/><path d="M14 12v6"/><path d="M11 15l3 3 3-3"/>`,
  soaring:   `<path d="M3 14c3-4 6-4 9 0s6 4 9 0"/><path d="M3 19c3-4 6-4 9 0s6 4 9 0"/><path d="M7 8l5-4 5 4"/>`,
  thermik:   `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  strecke:   `<circle cx="5" cy="18" r="2.4"/><circle cx="19" cy="6" r="2.4"/><path d="M7.2 16.5C10 14 9 10 12.5 8.2"/><path d="M14.5 6.5l2-.5.5 2"/>`,
  tandem:    `<circle cx="8" cy="7" r="2.6"/><circle cx="16.5" cy="8.5" r="2"/><path d="M3 20v-2a5 5 0 0 1 10 0v2"/><path d="M14.5 20v-1.5a4 4 0 0 1 6.5-3.1"/>`,
  schulung:  `<path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>`,
};
function flugartenHtml(spot) {
  const hd = spot.hoehendiff;
  const g = (spot.gleitschirm || "").toLowerCase();
  const arten = [{ label: "Abgleiter", ic: "abgleiter", quelle: "hd" }];
  if (hd != null) {
    if (hd >= FLUGART_MIN.soaring) arten.push({ label: "Soaring", ic: "soaring", quelle: "hd" });
    if (hd >= FLUGART_MIN.thermik) arten.push({ label: "Thermik", ic: "thermik", quelle: "hd" });
    if (hd >= FLUGART_MIN.strecke) arten.push({ label: "Strecke / XC", ic: "strecke", quelle: "hd" });
  }
  if (g.includes("2-sitzig")) arten.push({ label: "Tandem", ic: "tandem", quelle: "dhv" });
  if (g.includes("schulung")) arten.push({ label: "Schulung", ic: "schulung", quelle: "dhv" });
  // Fussnote nur ueber das schreiben, was auch wirklich dasteht
  const ausHoehe = arten.filter(a => a.quelle === "hd" && a.label !== "Abgleiter").map(a => a.label);
  const ausDhv = arten.filter(a => a.quelle === "dhv").map(a => a.label);
  const teile = [];
  if (ausDhv.length) teile.push(`${ausDhv.join(" und ")} nach DHV-Angabe`);
  if (ausHoehe.length && hd != null) teile.push(`${ausHoehe.join(" und ")} aus ${hd} m Höhendifferenz geschätzt`);
  const svg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FA_ICONS[k]}</svg>`;
  return `<h4 class="fc-h4">Grundsätzlich möglich</h4>
    <div class="fa-grid">${arten.map(a => `
      <div class="fa-card fa-${a.quelle}">${svg(a.ic)}<span>${a.label}</span></div>`).join("")}</div>
    ${teile.length ? `<p class="fa-note">${teile.join(" · ")}</p>` : ""}`;
}

// Offizielle Notrufnummern je Land. 112 gilt EU-weit und in der Schweiz, die
// landesspezifischen Nummern fuehren aber direkter zur Bergrettung/Luftrettung.
const NOTRUF = {
  de: [{ name: "Notruf / Bergrettung", num: "112" }],
  at: [{ name: "Bergrettung", num: "140" }, { name: "Rettung", num: "144" }, { name: "Euronotruf", num: "112" }],
  ch: [{ name: "Rega (Luftrettung)", num: "1414" }, { name: "Sanitätsnotruf", num: "144" }, { name: "Euronotruf", num: "112" }],
  fr: [{ name: "SAMU", num: "15" }, { name: "Euronotruf", num: "112" }],
  it: [{ name: "Soccorso alpino", num: "118" }, { name: "Euronotruf", num: "112" }],
};
// Kontakte des Fluggebiets (nur gepflegte Gelaende) + Notrufnummern des Landes.
// opts.imBriefing: als Flug-Check-Schritt, also ohne eigene Ueberschrift.
function kontakteHtml(spot, opts = {}) {
  const b = briefingFor(spot);
  const eigene = (b && b.contacts) || [];
  const notruf = NOTRUF[spot.country] || NOTRUF.de;
  const zeile = c => `<a class="fc-contact${c.notruf ? " fc-c-notruf" : ""}" href="tel:${escHtml(c.phone)}">
      ${IC_PHONE}
      <span class="fc-c-name">${escHtml(c.name)}</span>
      <span class="fc-c-num">${escHtml(c.display || c.phone)}</span>
    </a>`;
  // Gepflegte Gelaende fuehren die Notrufnummern teils selbst auf (Gerlitzen z.B. alle drei)
  // - dieselbe Nummer nicht zweimal zeigen.
  const schonDa = new Set(eigene.map(c => (c.phone || "").replace(/[^\d+]/g, "")));
  const alle = [
    ...eigene.map(c => ({ ...c })),
    ...notruf.filter(n => !schonDa.has(n.num)).map(n => ({ name: n.name, phone: n.num, display: n.num, notruf: true })),
  ];
  if (!alle.length) return "";
  const body = `<div class="fc-contacts">${alle.map(zeile).join("")}</div>`;
  return opts.imBriefing ? body : `<h3 class="dv-h3">Kontakte &amp; Notfall</h3>${body}`;
}

// Start-, Lande- und Differenzhoehe stimmen ueberein? Bei rund 16 % der DHV-Eintraege
// nicht - dort werden die Einzelhoehen weggelassen statt eine falsche Rechnung zu zeigen.
function hoehenStimmig(spot) {
  return spot.elevation != null && spot.landeHoehe != null && spot.hoehendiff != null
    && Math.abs((spot.elevation - spot.landeHoehe) - spot.hoehendiff) <= 5;
}
function distTxt(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`;
}
// Kleine Zeilen-Icons fuer Landeplatz und Kurzueberblick
const LP_IC = {
  hoehe:   `<path d="M3 20l6-10 4 6 2-3 6 7z"/>`,
  dist:    `<path d="M3 12h18"/><path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/>`,
  abstand: `<path d="M12 3v18"/><path d="M8 7l4-4 4 4"/><path d="M8 17l4 4 4-4"/>`,
  gleit:   `<path d="M4 6l16 12"/><path d="M4 18h6"/><path d="M4 6v6"/>`,
  richtung: `<path d="M12 2v20"/><path d="M12 2l4 5h-8z"/><path d="M2 12h20"/>`,
  wind:    `<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/><path d="M3 11h7"/>`,
  boe:     `<path d="M3 9h9a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 15h12a2.5 2.5 0 1 1-2.5 2.5"/><path d="M17 12h2"/>`,
  temp:    `<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z"/>`,
  sonne:   `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  uhr:     `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
};
const lpSvg = k => `<svg class="lp-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${LP_IC[k]}</svg>`;
function lpRows(rows) {
  return `<div class="lp-rows">${rows.map(([ic, label, val, ok]) => `
    <div class="lp-row">${lpSvg(ic)}<span class="lp-label">${escHtml(label)}</span><span class="lp-val">${escHtml(val)}</span>${ok ? `<span class="lp-ok" title="passt">${FC_CHECK}</span>` : ""}</div>`).join("")}</div>`;
}
// Landeplätze als Reiter (nur ab zwei Plätzen). Gezeigt wird ausschliesslich, was in den
// Daten steht: Höhe, Entfernung zum Start, Höhendifferenz und die dafür nötige Gleitzahl.
function landeplatzHtml(spot, landeAlle) {
  if (!landeAlle.length) return "";
  const panels = landeAlle.map(l => {
    const rows = [];
    if (l.hoehe != null) rows.push(["hoehe", "Höhe", `${l.hoehe} m ü. NN`]);
    if (l.lat != null && spot.lat != null) {
      rows.push(["dist", "Entfernung", distTxt(haversineExact(spot.lat, spot.lon, l.lat, l.lon))]);
    }
    // Höhendifferenz und benötigte Gleitzahl: sagt einem Anfänger, ob der Platz
    // überhaupt erreichbar ist. Beides nur rechnen, wenn die Daten wirklich da sind.
    if (l.hoehe != null && spot.elevation != null && spot.elevation > l.hoehe && l.lat != null) {
      const dh = spot.elevation - l.hoehe;
      const weite = haversineExact(spot.lat, spot.lon, l.lat, l.lon) * 1000;
      rows.push(["abstand", "Höhendifferenz", `${dh} m`]);
      if (weite > 100) rows.push(["gleit", "Gleitzahl", `${(weite / dh).toFixed(1).replace(".", ",")} nötig`]);
    }
    return rows.length ? lpRows(rows) : `<p class="lp-leer">Zu diesem Landeplatz sind keine weiteren Daten hinterlegt.</p>`;
  });
  if (panels.length === 1) return `<div class="lp-box">${panels[0]}</div>`;
  return `<div class="lp-box">
    <div class="lp-tabs" role="tablist">${landeAlle.map((l, i) => `
      <button type="button" class="lp-tab${i === 0 ? " on" : ""}" data-lptab="${i}" role="tab">${escHtml(l.kurz || l.name)}</button>`).join("")}</div>
    ${panels.map((p, i) => `<div class="lp-panel" data-lppanel="${i}"${i ? " hidden" : ""}>${p}</div>`).join("")}
  </div>`;
}
// Kurzüberblick: die Tageswerte auf einen Blick. Bewusst die tatsächliche Vorhersage -
// die zugelassene Startrichtung des Platzes steht schon in der Checkliste in Schritt 2.
function kurzueberblickHtml(spot, day, ts, tagW) {
  if (!day || !day.dayHours || !day.dayHours.length) return "";
  const fenster = ts.win ? day.dayHours.filter(h => h.t >= ts.win.from && h.t <= ts.win.to) : [];
  const hrs = fenster.length ? fenster : day.dayHours;
  const rows = [];
  // Unter ~5 km/h ist die gemeldete Richtung Zufall - dann lieber "wechselnd" schreiben,
  // als aus einem Nullwind-Tag eine scheinbar klare Richtungsangabe zu machen.
  const richtHrs = hrs.filter(h => h.ws >= 5);
  // Haken, wenn es passt (nur mit fliegbarem Fenster): dieselben Grenzen wie die Ampel
  // ("gut"-Stunde) - Richtung im Startsektor, Wind und Boeen unter der gruenen Schwelle.
  const pr = activeProfile(), mitFenster = fenster.length > 0;
  const richtOk = mitFenster && richtHrs.length > 0 && richtHrs.every(h => sectorAngleDist(h.wd, spot.sectors) <= pr.dirTol);
  const windOk = mitFenster && Math.max(...hrs.map(h => h.ws)) <= pr.windMax * pr.gruen;
  const boeOk = mitFenster && Math.max(...hrs.map(h => h.wg)) <= pr.gustMax * pr.gruen;
  if (!richtHrs.length) rows.push(["richtung", "Windrichtung", "wechselnd (kaum Wind)"]);
  else {
    const richt = [];
    richtHrs.forEach(h => { const c = degToCompass(h.wd); if (richt[richt.length - 1] !== c) richt.push(c); });
    const uniq = [...new Set(richt)];
    const a = richt[0], b = richt[richt.length - 1];
    rows.push(["richtung", "Windrichtung", uniq.length === 1 ? uniq[0] : a === b ? uniq.slice(0, 3).join(" / ") : `${a}–${b}`, richtOk]);
  }
  const ws = hrs.map(h => Math.round(h.ws));
  rows.push(["wind", "Wind", `${Math.min(...ws)} – ${Math.max(...ws)} km/h`, windOk]);
  const wg = hrs.map(h => Math.round(h.wg));
  rows.push(["boe", "Böen", `bis ${Math.max(...wg)} km/h`, boeOk]);
  if (day.wx && day.wx.tmin != null && day.wx.tmax != null) rows.push(["temp", "Temperatur", `${day.wx.tmin} – ${day.wx.tmax} °C`]);
  const th = thermikStartHour(day, ts.win);
  if (th != null) rows.push(["sonne", "Thermik", `ab ca. ${th} Uhr`]);
  // "Beste Zeit" steht schon als Flugfenster-Kachel oben im Briefing
  return `<h3 class="fc-h4 ueb-h">${tagW || "Heute"} im Überblick</h3><div class="lp-box">${lpRows(rows)}
    <p class="lp-note">${fenster.length ? "Werte aus dem fliegbaren Fenster" : `Werte über den ganzen Tag – ${(tagW || "Heute").toLowerCase()} kein fliegbares Fenster`}</p></div>`;
}
// Eigene Notizen zum Platz - bleiben nur auf diesem Gerät (localStorage), gehen nirgends hin.
function notizenHtml(spot) {
  const txt = localStorage.getItem("flugwetter_note_" + spot.id) || "";
  return `<h3 class="dv-h3">Notizen</h3>
    <textarea class="bf-note" data-note="${escHtml(spot.id)}" rows="4"
      placeholder="Eigene Notizen hier hinzufügen …">${escHtml(txt)}</textarea>
    <p class="lp-note">Bleibt nur auf diesem Gerät.</p>`;
}
function briefingPanelHtml(spot, ctx) {
  const b = briefingFor(spot);
  const S = (b && b.sections) || {};
  const { days, dayIdx, ts, rt, driveSec } = ctx;
  const day = days[dayIdx] || {};

  // --- Kopfzeile: Bewertung, Flugfenster, Höhendifferenz ---
  const fliegbar = ts.status !== "nein";
  const winSec = (day.windows || []).reduce((s, w) => s + (w.to - w.from) / 1000, 0);
  // Das Briefing zeigt den auf der Startseite gewaehlten Tag - die Beschriftung muss
  // mitziehen, sonst steht "Heute fliegbar" ueber den Werten von morgen.
  const tagW = dayIdx === 1 ? "Morgen" : "Heute";
  const kacheln = [
    { ic: fliegbar ? FC_CHECK : FC_WARN, cls: fliegbar ? "ok" : "warn", urteil: true,
      wert: `${tagW} ${fliegbar ? "fliegbar" : "nicht fliegbar"}`,
      sub: fliegbar ? (rt.stars >= 4 ? "Gute Bedingungen" : "Grenzwertige Bedingungen") : ts.reasonText },
  ];
  if (winSec > 0) kacheln.push({ cls: "neutral", wert: formatDur(winSec), sub: "Flugfenster",
    sub2: ts.win ? windowLabel(ts.win) : null,
    ic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>` });
  if (spot.hoehendiff) kacheln.push({ cls: "neutral", wert: spot.hoehendiff + " m", sub: "Höhendifferenz",
    // Start- und Landehoehe nur zeigen, wenn sie zur Hoehendifferenz passen: bei 16 % der
    // DHV-Eintraege widersprechen sich die drei Angaben (teils identische Start-/Landehoehe
    // bei angegebener Differenz). Lieber nichts zeigen als eine sichtbar falsche Rechnung.
    sub2: hoehenStimmig(spot) ? `${spot.elevation} m – ${spot.landeHoehe} m` : null,
    ic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-10 4 6 2-3 6 7z"/></svg>` });
  // Drei einzelne Kacheln nebeneinander - bei fliegbarem Tag alle drei grün umrandet.
  const kopf = `<div class="fc-kopf ${fliegbar ? "ok" : "warn"}">${kacheln.map(k => `
    <div class="fc-tile ${k.cls || ""}${k.urteil ? " fc-tile-urteil" : ""}"><span class="fc-stat-ic">${k.ic}</span>
      <div class="fc-tile-txt"><div class="fc-stat-val">${k.wert}</div><div class="fc-stat-sub">${escHtml(k.sub)}</div>
        ${k.sub2 ? `<div class="fc-stat-sub2">${escHtml(k.sub2)}</div>` : ""}</div>
    </div>`).join("")}</div>`;

  // --- Schritt 1: Anreise & Start ---
  const zustieg = [];
  const a = spot.acc || "";
  if (a.includes("a")) zustieg.push({ ic: "auto", titel: "Mit dem Auto", sub: driveSec != null ? `erreichbar · ${formatDur(driveSec)} Fahrt` : "erreichbar" });
  if (a.includes("b")) {
    const base = (spot.name || "").replace(/\s*\([^)]*\)\s*$/, "").trim();   // Richtungs-Suffix "(N)" weg
    const q = encodeURIComponent(`${base} ${spot.region || ""} Bergbahn Seilbahn`.replace(/\s+/g, " ").trim());
    zustieg.push({ ic: "bahn", titel: "Bergbahn", sub: "vorhanden", href: `https://www.google.com/search?q=${q}` });
  }
  if (a.includes("f")) zustieg.push({ ic: "fuss", titel: "Zu Fuß erreichbar", sub: "(Hike & Fly)" });
  const landeAlle = [];
  if (spot.landeLat != null && spot.landeLon != null) landeAlle.push({ name: spot.landeName || "Landeplatz", lat: spot.landeLat, lon: spot.landeLon, hoehe: spot.landeHoehe });
  if (Array.isArray(spot.landeExtra)) landeAlle.push(...spot.landeExtra);
  // Der DHV liefert Haupt- und Zusatzlandeplaetze in beliebiger Reihenfolge ("Landeplatz 2"
  // vor "Landeplatz 1") - natuerlich sortieren, damit die Reiter in der erwarteten Folge stehen.
  landeAlle.sort((a, b) => (a.name || "").localeCompare(b.name || "", "de", { numeric: true }));
  landeAlle.forEach(l => { l.kurz = kurzOrt(l.name, spot.name); });
  const schritt1 = `
    <h4 class="fc-h4">Anreise</h4>
    ${anreiseHtml(zustieg)}
    ${(S.vorStart || []).length ? fcList(S.vorStart) : ""}`;

  // --- Schritt 2: Startplatz ---
  // Jede Angabe steht nur noch an EINER Stelle: Ort im Fensterkopf, Hoehendifferenz als Kachel,
  // Schwierigkeit als Hinweis oben, Landeplatz-Daten im Schritt 3, DHV-Bemerkung hier (mit "mehr").
  const datenRows = [];
  if (spot.sectorLabel) datenRows.push(["richtung", "Startrichtung", spot.sectorLabel]);
  if (spot.elevation != null) datenRows.push(["hoehe", "Höhe Startplatz", `${spot.elevation} m ü. NN`]);
  if (spot.gleitschirm) datenRows.push(["gleit", "Zugelassen", spot.gleitschirm]);
  const check2 = [...(S.startplatz || [])];
  const bemerkung = dhvExtra(spot, { skipLande: true, skipHoehendiff: true, skipOrt: true, skipGleitschirm: true });
  const schritt2 = `
    ${datenRows.length ? `<div class="lp-box">${lpRows(datenRows)}</div>` : ""}
    ${check2.length ? `<h4 class="fc-h4">Checkliste Startplatz</h4>${fcList(check2)}` : ""}
    ${flugartenHtml(spot)}
    ${bemerkung}`;

  // --- Schritt 3: Landeplatz ---
  // Mehrere Landeplätze bekommen je einen Reiter. Größe, Untergrund und bevorzugte
  // Landerichtung stehen bewusst NICHT drin - dazu gibt es in den DHV-Daten nichts.
  const schritt3 = `
    ${landeplatzHtml(spot, landeAlle)}
    ${(S.landeplatz || []).length ? fcList(S.landeplatz) : ""}
    ${(S.verboten || []).length ? `<h4 class="fc-h4">Wichtig</h4><ul class="fc-notes">${S.verboten.map(t =>
      `<li class="fc-warn">${FC_WARN}<span>${escHtml(t)}</span></li>`).join("")}</ul>` : ""}`;

  // --- Schritt 4: Kontakte & Notruf ---
  const links = [];
  if (spot.dhv) links.push({ icon: IC_CLIPBOARD, label: "DHV Info", href: `https://service.dhv.de/db2/details.php?qi=glp_details&item=${spot.dhv}` });
  if (spot.vereinUrl) links.push({ icon: IC_GLOBE, label: "Verein", href: spot.vereinUrl });
  const schritt4 = kontakteHtml(spot, { imBriefing: true })
    + (links.length ? `<div class="dv-actions">${links.map(a => `<a class="dv-act" href="${a.href}" target="_blank" rel="noopener"><span class="dv-act-ic">${a.icon}</span><span>${a.label}</span></a>`).join("")}</div>` : "");

  const schritte = [
    ["Anreise &amp; Start", schritt1],
    ["Startplatz", schritt2],
    ["Landeplatz", schritt3],
    ["Kontakte &amp; Notruf", schritt4],
  ].filter(([, inhalt]) => inhalt.trim());

  // Oben: Urteil + Hinweise fuer dich (Gelaende, Profil), dann die Tageswerte, dann der Flug-Check
  const persoenlich = profilHinweise(spot), warn = diffWarn(spot);
  const topHinweise = [...persoenlich, ...(warn && !persoenlich.length ? [{ typ: "warn", text: warn.text }] : [])];
  const hinweiseHtml = topHinweise.length ? `<ul class="fc-notes top-notes">${topHinweise.map(h =>
    `<li class="fc-${h.typ}">${h.typ === "warn" ? FC_WARN : FC_INFO}<span>${escHtml(h.text)}</span></li>`).join("")}</ul>` : "";
  return `${kopf}
    ${hinweiseHtml}
    ${kurzueberblickHtml(spot, day, ts, tagW)}
    <h3 class="fc-head">Flug-Check</h3>
    <p class="fc-head-sub">Deine Vorbereitung in ${schritte.length} Schritten</p>
    ${schritte.map(([titel, inhalt], i) => fcStep(i + 1, titel, inhalt, false)).join("")}
    <p class="bf-src bf-warn-note">Alle Angaben ohne Gewähr. Informiere dich vor dem Flug über die aktuellen
      Bedingungen und respektiere andere Piloten und die Natur.
      ${b ? `<span class="bf-src-quelle">Quelle: ${escHtml(b.source)}${b.updated ? ` · Stand ${escHtml(b.updated)}` : ""}</span>` : ""}</p>
    ${notizenHtml(spot)}`;
}


// "Live"-Tab: Live-Wetterstation + Live-Cam, jeweils nur falls fürs Gelände hinterlegt,
// plus Übersichtskarte mit Start- und Landeplatz + Link auf ein Satellitenbild des Landeplatzes.
// Station und Webcam als kompakte Chips - stehen oben im Wetter-Tab, nicht mehr
// als große Kacheln im Live-Tab. opts.stationImRow: die Station haengt schon als
// Link in der Live-Messzeile, dann waere der Chip eine Dopplung.
const IC_STATION = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="2"/><path d="M12 11v10"/><path d="M7.8 13.2a6 6 0 0 1 0-8.4"/><path d="M16.2 4.8a6 6 0 0 1 0 8.4"/><path d="M5 16a9.5 9.5 0 0 1 0-14"/><path d="M19 2a9.5 9.5 0 0 1 0 14"/></svg>`;
const IC_CAM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7.5 16 12l7 4.5z"/><rect x="1" y="5.5" width="15" height="13" rx="2"/></svg>`;
function liveChipsHtml(spot, opts = {}) {
  const chips = [];
  // Bei 57 der 63 Plaetze mit beiden Feldern steht dieselbe URL drin (meist eine
  // Holfuy-Seite, die Wind UND Bild zeigt) - dann nur EIN Chip statt zweier identischer.
  const gleicheQuelle = !!(spot.livewetter && spot.webcam && spot.livewetter === spot.webcam);
  if (spot.livewetter && !opts.stationImRow) {
    chips.push({ cls: "lb-live", ic: IC_STATION, label: gleicheQuelle ? "Live-Wetter & Cam" : "Live-Wetter", sub: "Station vor Ort", href: spot.livewetter });
  }
  if (spot.webcam && !gleicheQuelle) chips.push({ cls: "lb-cam", ic: IC_CAM, label: "Live-Cam", sub: "Bild vom Platz", href: spot.webcam });
  // Windy: punktgenaue Wetterkarte, gehoert zu den Wetter-Quellen (frueher im Details-Tab)
  if (spot.lat != null && spot.lon != null) {
    chips.push({ cls: "lb-windy", ic: IC_WIND, label: "Windy", sub: "Windkarte", href: `https://www.windy.com/?${spot.lat},${spot.lon},12` });
  }
  if (!chips.length) return "";
  // Grosse, farbige Knoepfe ueber die volle Breite - vorher kleine graue Chips, die leicht
  // uebersehen wurden. Live-Daten vor Ort sind vor dem Start das Wichtigste.
  return `<div class="lb-row">${chips.map(c => `
    <a class="lb-btn ${c.cls}" href="${c.href}" target="_blank" rel="noopener">
      <span class="lb-ic">${c.ic}</span>
      <span class="lb-txt"><span class="lb-label">${c.label}</span><span class="lb-sub">${c.sub}</span></span>
    </a>`).join("")}</div>`;
}
// Ein Tag als Karte (Kompass + Stunden-Streifen + Sterne-Urteil) - fuer Vorhersage-Tage UND fuer den
// Wetter-Verlauf (historischer Tag, gleiche Datenform dank identischer Open-Meteo-Felder).
function dayCardHtml(spot, days, i) {
  const day = days[i];
  const wd = WEEKDAYS[day.date.getDay()];
  const rv = dayVerdict(days, i);
  const hoursHtml = day.dayHours.map(x => {
    const cls = x.rating === "gut" ? "h gut" : x.rating === "grenz" ? "h grenz" : "h";
    // Grenzwertig: statt hartem Sprung auf volles Gelb ein weicher Verlauf über die ganze
    // Bandbreite (wenig Wind, Böen, Windgeschwindigkeit, Richtung) - severity aus rateHour.
    // Windsprung-K.o. (nein) faerbt zusätzlich weich gelb->rot statt neutralem Grau.
    const style = x.rating === "grenz" && x.severity != null ? ` style="background:${lerpHex(COLOR_GOOD, COLOR_WARN, x.severity)}"`
      : x.rating === "nein" && x.reason === "windsprung" && x.severity != null ? ` style="background:${lerpHex(COLOR_WARN, COLOR_BAD, x.severity)}"`
      : "";
    const info = `${wd} ${x.t.getHours()} Uhr · ${Math.round(x.ws)} km/h aus ${degToCompass(x.wd)} · Böen ${Math.round(x.wg)}`;
    const rtxt = hourReason(x.rating, x.reason);
    const hourLabel = `${wd} ${x.t.getHours()} Uhr`;
    const hwx = x.wc != null ? `<span class="h-wx">${weatherEmoji(x.wc)}</span>` : "";
    const htemp = x.temp != null ? `<span class="h-temp">${Math.round(x.temp)}°</span>` : "";
    return `<span class="${cls}"${style} title="${info} · ${rtxt}" data-info="${info}" data-reason="${rtxt}" data-rating="${x.rating}" data-ws="${x.ws}" data-wd="${x.wd}" data-wg="${x.wg}" data-hourlabel="${hourLabel}" data-iso="${isoStunde(x.t)}"><span class="h-num">${x.t.getHours()}</span>${hwx}${htemp}</span>`;
  }).join("");
  const winTxt = day.windows.length ? day.windows.map(windowLabel).join(" · ") : "";
  const rating = `<div class="drating ${rv.cls}"><span class="dstars">${starStr(rv.stars)}</span><span class="dverdict">${rv.text}</span>${winTxt ? `<span class="dwin"> · ${winTxt}</span>` : ""}</div>`;
  return `
    <div class="day ${day.windows.length ? "hasgreen" : ""}">
      <div class="dlabel-wd">${wd} ${day.date.getDate()}.${day.date.getMonth()+1}.</div>
      <div class="dright"><div class="hours">
        <div class="hour-pills">${hoursHtml}</div>
        <div class="scp-day-wrap">${spotCompassSvg(spot, 0, { neutral: true, compact: true, needle: true })}</div>
      </div><div class="hour-detail" hidden></div><div class="wp-inline" hidden></div><div class="dbottom">${rating}</div></div>
    </div>`;
}
function renderCard(spot, days, opts = {}) {
  const dayIdx = opts.dayIdx || 0;
  const dayW = dayIdx === 1 ? "morgen" : "heute";
  const ts = dayStatus(days, dayIdx);
  const now = new Date();
  const flat = days.flatMap(d => d.hours);
  const cur = flat.find(h => h.t.getHours() === now.getHours() && h.t.getDate() === now.getDate() && h.t.getMonth() === now.getMonth()) || flat[Math.min(12, flat.length - 1)];
  const sun = days[0] && days[0].wx;
  const nowFit = cur ? (cur.rating === "gut"
    ? `<span class="lw-fit gut">✓ passt gerade</span>`
    : cur.rating === "grenz"
      ? `<span class="lw-fit grenz">grenzwertig · ${grenzLabel(cur.reason)}</span>`
      : `<span class="lw-fit nein">passt gerade nicht · ${neinText(cur.reason)}</span>`) : "";
  const sunSpan = sun ? `<span class="sun-txt">🌅 ${fmtTime(sun.sunrise)} · 🌇 ${fmtTime(sun.sunset)}</span>` : "";
  // Gibt es eine echte Messung in der Nähe, entfällt der Modellwert "jetzt" - zwei
  // Zeilen mit unterschiedlichen Zahlen zur selben Uhrzeit verwirren mehr als sie nützen.
  // Sonnenauf-/-untergang wandern dann in die Live-Zeile.
  const nowBar = (cur && !opts.live) ? `
    <div class="nowbar">
      <span class="wind-ind">${spotCompassSvg(spot, cur.wd, { rating: cur.rating })}</span>
      <span class="wind-txt">jetzt <b>${Math.round(cur.ws)}</b> km/h aus <b>${degToCompass(cur.wd)}</b> · Böen ${Math.round(cur.wg)}</span>
      ${nowFit}
      ${sunSpan}
    </div>` : "";
  let liveHtml = "";
  if (opts.live) {
    const L = opts.live;
    // Live-Messung nach denselben Regeln (Sektoren + aktuelle Liga) bewerten -> passt es GERADE?
    const lf = rateHour(spot, L.avg, L.dir, L.max, 0, true, null);
    const fit = lf.rating === "gut"
      ? `<span class="lw-fit gut">✓ passt gerade</span>`
      : lf.rating === "grenz"
        ? `<span class="lw-fit grenz">grenzwertig · ${grenzLabel(lf.reason)}</span>`
        : `<span class="lw-fit nein">passt gerade nicht · ${neinText(lf.reason)}</span>`;
    liveHtml = `
    <div class="livewind">
      <span class="lw-dot" aria-hidden="true"></span>
      <span class="wind-ind">${spotCompassSvg(spot, L.dir, { rating: lf.rating })}</span>
      <span class="lw-txt"><b>Live ${L.avg}</b> km/h aus <b>${degToCompass(L.dir)}</b> · Böen ${L.max}</span>
      ${fit}
      <span class="lw-src">${L.name} · ${L.dist.toFixed(1)} km · vor ${L.ago} Min · gemessen${spot.livewetter
        ? ` <a class="lw-link" href="${spot.livewetter}" target="_blank" rel="noopener">Station ansehen ›</a>` : ""}</span>
      ${sunSpan}
    </div>`;
  }
  const badge = ts.status === "nein"
    ? `<span class="badge red">${statusDot("nein")} ${dayW}: ${ts.reasonText}</span>`
    : ts.past
      ? `<span class="badge ${ts.status === "gut" ? "green" : "amber"}">${statusDot(ts.status)} ${dayW}: war fliegbar (${windowLabel(ts.win)})</span>`
      : `<span class="badge ${ts.status === "gut" ? "green" : "amber"}">${statusDot(ts.status)} ${dayW} ${windowLabel(ts.win).replace(/^🟢 |^🟡 /, "")}</span>`;

  const daysHtml = days.slice(0, 7).map((day, i) => dayCardHtml(spot, days, i)).join("");

  const del = spot.id.startsWith("user_")
    ? `<button class="ic0" data-del="${spot.id}" title="Eigenen Platz löschen">🗑</button>` : "";

  const rt = todayRating(days, dayIdx);
  // Aktuelle Bedingungen stehen oben im Wetter-Tab (nicht mehr im Live-Tab). Nur beim
  // heutigen Tag - unter einer Morgen-Vorhersage waeren "jetzt"-Werte irrefuehrend.
  // Die fruehere Bewertungs-Karte darueber ist entfallen: Sterne und Einschaetzung
  // stehen ohnehin in der ersten Tageszeile.
  const statusCard = dayIdx === 0 ? (liveHtml || nowBar) : "";
  // Station/Webcam als Chips direkt darunter. Steckt die Station schon als Link in der
  // Live-Messzeile, entfaellt ihr Chip - sonst stuende dasselbe Ziel zweimal da.
  const liveChips = liveChipsHtml(spot, { stationImRow: !!(dayIdx === 0 && opts.live && spot.livewetter) });

  // Kompakt (Favoriten): nur Name/Region + Ampel-Badge in der Kopfzeile - der Rest der Karte
  // ist leer, die ganze Kachel oeffnet per Klick das volle Detailfenster (s. data-spot-Handler).
  const body = opts.collapsible
    ? ``
    // Detailfenster: Wetter-Tab unverändert; Details-Tab neu nach Mockup (Zustiegs-/Flugart-Karten,
    // Startplatz-Datentabelle, Start-/Landeplatz-Karten mit Bild+Navigation, Aktionen).
    : `
      <div class="dtabs" role="tablist">
        <button type="button" class="dtab on" data-tab="wetter" role="tab">Wetter</button>
        <button type="button" class="dtab" data-tab="briefing" role="tab">Briefing</button>
      </div>
      <div class="dtab-panels">
        <div class="dtab-panel" id="dtab-wetter">${statusCard}${liveChips}<div class="days">${daysHtml}</div>
          <div class="hist-section">
            <h3 class="dv-h3">📅 Wetter-Verlauf</h3>
            <input type="date" class="hist-date" data-hist="${spot.id}" max="${histMaxDate()}">
            <div class="hist-body"></div>
          </div>
        </div>
        <div class="dtab-panel" id="dtab-briefing" hidden>${briefingPanelHtml(spot, { days, dayIdx, ts, rt, driveSec: opts.driveSec })}</div>
      </div>`;

  const favOn = isFav(spot.id);
  const head = opts.collapsible
    ? `<div class="card-head">
        <div><div class="spot-name">${spot.name}</div><div class="spot-region">${spot.region || ""}</div></div>
        <div class="head-right">${badge}<button class="ic0 star on" data-fav="${spot.id}" title="Aus Favoriten entfernen">★</button>${del}</div>
      </div>`
    : `<div class="detail-topbar">
        <div class="dt-left">
          <div class="spot-name">${spot.name}</div>
          <div class="spot-region">📍 ${[spot.gemeinde, spot.bundesland].filter(Boolean).join(", ") || spot.region || ""}</div>
        </div>
        <div class="dt-right">
          <button type="button" class="ic0 dt-star${favOn ? " on" : ""}" data-fav="${spot.id}" title="${favOn ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}">${favOn ? "★" : "☆"}</button>
          <div class="dt-menu-wrap">
            <button type="button" class="ic0 dt-menu-btn" aria-haspopup="true" aria-expanded="false" title="Mehr">☰</button>
            <div class="dt-menu" hidden>
              <button type="button" class="dt-mi disabled" disabled>🔔 Flugwetter-Alarm<span class="dt-soon">bald</span></button>
              <button type="button" class="dt-mi" data-share="${spot.id}">📤 Teilen</button>
            </div>
          </div>
          <button type="button" class="ic0 dt-x" data-detailclose title="Schließen">✕</button>
        </div>
      </div>`;
  return `<div class="card" data-spot="${spot.id}">${head}${body}</div>`;
}

// Heute/Morgen fuer die Favoriten - bewusst eigener Zustand, unabhaengig vom Home-Screen (searchDay),
// damit ein Tageswechsel auf der einen Seite die andere nicht ungefragt mitaendert.
let favDay = 0;
let lastFavResults = [];
async function renderFavorites() {
  const list = document.getElementById("favList");
  const empty = document.getElementById("favEmpty");
  const headEl = document.getElementById("favHead");
  const tipEl = document.getElementById("favTip");
  const favs = favoriteSpots();
  empty.hidden = favs.length > 0;
  if (!favs.length) { list.innerHTML = ""; headEl.innerHTML = ""; tipEl.innerHTML = ""; lastFavResults = []; return; }
  list.innerHTML = favs.map(s => `<div class="card loading">Lade ${s.name} …</div>`).join("");
  headEl.innerHTML = ""; tipEl.innerHTML = "";
  lastFavResults = await Promise.all(favs.map(async s => {
    try { return { spot: s, days: analyse(s, await fetchForecast(s)) }; }
    catch (e) { return { spot: s, days: null, error: e.message }; }
  }));
  renderFavList();
}
// Reine Anzeige aus dem Cache (lastFavResults) - beim Heute/Morgen-Wechsel kein erneuter Abruf noetig,
// die Vorhersage deckt beide Tage schon ab (s. analyse()/dayStatus()).
function renderFavList() {
  const list = document.getElementById("favList");
  const headEl = document.getElementById("favHead");
  const tipEl = document.getElementById("favTip");
  const ok = lastFavResults.filter(r => r.days);
  const failed = lastFavResults.filter(r => !r.days);
  const dayW = favDay === 1 ? "Morgen" : "Heute";
  const rows = ok.map(r => ({ spot: r.spot, ts: dayStatus(r.days, favDay) }));
  const flyable = rows.filter(r => r.ts.status !== "nein").length;
  headEl.innerHTML = lastFavResults.length ? `<div class="fly-head">${dayW} · <b>${flyable}</b> von ${lastFavResults.length} fliegbar</div>` : "";
  const rowsHtml = rows.map(r => spotRowHtml(r.spot, r.ts, r.spot.region || "")).join("");
  const failedHtml = failed.map(r => `<div class="card"><div class="spot-name">${r.spot.name}</div><div class="spot-region">Fehler: ${r.error}</div></div>`).join("");
  list.innerHTML = rowsHtml ? `<div class="sc-list">${rowsHtml}</div>${failedHtml}` : failedHtml;
  tipEl.innerHTML = favDay === 0 ? favoritesTipHtml(ok) : "";
}
document.getElementById("favDayToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  favDay = parseInt(b.dataset.day, 10);
  document.querySelectorAll("#favDayToggle .rpill").forEach(x => x.classList.toggle("on", x === b));
  renderFavList();
});

// ---------------- „Wo kann ich heute fliegen?" ----------------
// PLZ (Deutschland) -> Koordinaten via zippopotam.us (kostenlos, ohne Schlüssel).
async function geocodePlz(plz) {
  const res = await fetch(`https://api.zippopotam.us/de/${plz}`);
  if (!res.ok) throw new Error("PLZ nicht gefunden");
  const j = await res.json();
  const p = j.places[0];
  return { lat: parseFloat(p.latitude), lon: parseFloat(p.longitude), label: `${plz} ${p["place name"]}` };
}

// Klick auf die Karte -> Ortsname zum Anklickpunkt (Nominatim/OSM, kostenlos, ohne Schlüssel).
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&accept-language=de`);
    if (!res.ok) return null;
    const j = await res.json();
    const a = j.address || {};
    return a.city || a.town || a.village || a.municipality || j.name || null;
  } catch { return null; }
}
// Freitext-Ortssuche (Nominatim FORWARD) - Fallback im Suchfeld, wenn kein eigener Startplatz passt
// (z.B. Ort, See, Berg). Nur bei Enter/Blur aufgerufen, nie beim Tippen (s. handleSearchInput).
async function forwardGeocode(query) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1&accept-language=de`);
    if (!res.ok) return null;
    const j = await res.json();
    if (!j.length) return null;
    return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon) };
  } catch { return null; }
}

// Umkreis-Auswahl (Pills)
let lastOrigin = null;
let searchDay = 0;         // 0 = heute, 1 = morgen
let rerunSearch = null;    // wiederholt die zuletzt ausgeführte Suche (für Tag-/Umkreiswechsel)
function dayWord() { return searchDay === 1 ? "Morgen" : "Heute"; }
function getRadius() {
  const on = document.querySelector("#radiusPills .rpill.on");
  return on ? parseInt(on.dataset.km, 10) : 100;
}
document.getElementById("radiusPills").addEventListener("click", e => {
  const p = e.target.closest(".rpill"); if (!p) return;
  document.querySelectorAll("#radiusPills .rpill").forEach(x => x.classList.toggle("on", x === p));
  localStorage.setItem("flugwetter_radius", p.dataset.km);
  if (lastOrigin) runFlySearch(lastOrigin.lat, lastOrigin.lon, lastOrigin.label, { focus: searchFocus });
});


// Gemeinsame Auswertung + Anzeige für eine Kandidatenliste.
// candidates: mit .dist (Anzeige-km oder null) und .sortKey (Zahl). origin: {lat,lon} oder null (für Fahrzeit).
async function renderSearch(candidates, origin, headline, opts = {}) {
  // Zustiegs-Filter wird NICHT mehr vor dem Kappen angewendet (sonst holt ein enger Filter
  // andere/weiter entfernte Plaetze als "Egal", weil er ueber den ganzen Umkreis statt nur die
  // ohnehin schon gezeigten naechsten 50 filtert). Er wirkt jetzt rein auf der Anzeige, s. renderFlyResults.
  const out = document.getElementById("flyResults");
  const mapFirstRun = document.getElementById("mapFirstRun");
  if (mapFirstRun) mapFirstRun.hidden = true;
  const cap = opts.max || MAX_CANDIDATES;
  const truncated = candidates.length > cap;
  candidates = candidates.slice(0, cap);
  if (!candidates.length) {
    out.innerHTML = `<p class="empty">Kein Startplatz gefunden. (Die Datenbank wächst noch.)</p>`;
    return;
  }
  out.innerHTML = ladeHtml(`Prüfe ${candidates.length} Plätze …`);
  try {
    const results = await fetchBulkToday(candidates);
    let drive = [];
    if (origin) { try { drive = await fetchDriveTimes(origin, candidates); } catch { drive = []; } }
    const rows = candidates.map((s, i) => {
      const drv = drive[i];
      // Route: wo unterwegs und wie weit neben der Strecke
      const anTxt = opts.ankunft ? ` · an ca. ${opts.ankunft(s).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}` : "";
      const subInfo = s.routeKm != null
        ? `${IC_ROUTE} nach ${Math.round(s.routeKm)} km${anTxt} · ${s.abseits < 1 ? "direkt an der Strecke" : Math.round(s.abseits) + " km abseits"}`
        : (drv != null ? IC_CAR + " " + formatDur(drv) + " · " : "") +
          (s.dist != null ? IC_PIN + " " + s.dist + " km" : (s.region || ""));
      const days = analyse(s, results[i]);
      const ankunft = opts.ankunft ? opts.ankunft(s) : null;
      const ts = ankunft ? ankunftStatus(days, searchDay, ankunft) : dayStatus(days, searchDay);
      ts.type = flightType(days[searchDay], ts.win);
      return { spot: s, ts, drive: drv, subInfo };
    });
    const rank = { gut: 0, grenz: 1, nein: 2 };
    // Route: in Fahrtrichtung statt "fliegbar zuerst" - man will wissen, was als Naechstes kommt
    if (opts.entlangRoute) rows.sort((a, b) => a.spot.routeKm - b.spot.routeKm);
    else rows.sort((a, b) =>
      rank[a.ts.status] - rank[b.ts.status] ||
      ((a.drive ?? a.spot.sortKey ?? Infinity) - (b.drive ?? b.spot.sortKey ?? Infinity)));
    lastHeadline = headline; lastTruncated = truncated;
    renderFlyResults(rows, headline, truncated);
    lastRows = rows;
    // opts.keepView: Suche kam vom Karten-Knopf - dann den Ausschnitt lassen,
    // sonst zoomt die Karte weg von der Stelle, die der Nutzer gerade angesteuert hat.
    updateMapMarkers(displayRowsFor(rows), opts.keepView ? { flyTo: false } : {});
  } catch (e) {
    out.innerHTML = `<p class="empty">Fehler beim Abruf: ${e.message}</p>`;
  }
}

// ---------------- Kartenansicht (MapLibre GL JS + OpenFreeMap, beides kostenlos/ohne Key) ----------------
// MapLibre wird erst beim ersten Erreichen der Kartenansicht nachgeladen (Karte ist Standardansicht,
// s. route()) - kein Ballast fürs Erststart-Ladegewicht, falls jemand doch zuerst die Liste nutzt.
// "bright" statt Geländekarte: klar/farbig statt überladen (Höhenlinien+Schummerung machten die Marker unlesbar).
const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
// Zusatz-Stile nur fuer die kleine Start/Landeplatz-Karte im Live-Tab (dort will man Gelaende/Satellit sehen).
// Hinweis Esri World Imagery: laut Nutzungsbedingungen fuer "commercial use" eigentlich ArcGIS-Lizenz noetig,
// wird aber breit von der OSM-/Hobby-Community fuer genau solche Low-Traffic-Zwecke genutzt (keine harten
// Limits, kein Key noetig). Bei Bedarf spaeter durch eine lizenzierte Quelle ersetzen.
const TERRAIN_STYLE = {
  version: 8,
  sources: {
    otm: {
      type: "raster",
      tiles: ["https://a.tile.opentopomap.org/{z}/{x}/{y}.png", "https://b.tile.opentopomap.org/{z}/{x}/{y}.png", "https://c.tile.opentopomap.org/{z}/{x}/{y}.png"],
      tileSize: 256, maxzoom: 17,
      attribution: '© OpenStreetMap contributors, SRTM | © <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA)',
    },
  },
  layers: [{ id: "otm", type: "raster", source: "otm" }],
};
const SATELLITE_STYLE = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256, maxzoom: 19,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    },
  },
  layers: [{ id: "esri", type: "raster", source: "esri" }],
};
const MINI_MAP_STYLES = { street: MAP_STYLE, sat: SATELLITE_STYLE, terrain: TERRAIN_STYLE };
// Statischer Attributions-Text statt MapLibres eigenem Attributions-Button (der ist aus seinem
// Container ausgebrochen und ueberlagerte andere Tabs/Inhalte).
function attribTextFor(mode) {
  return mode === "sat" ? "Kartendaten: © Esri, Maxar, Earthstar Geographics"
    : mode === "terrain" ? "Kartendaten: © OpenStreetMap-Mitwirkende, SRTM · © OpenTopoMap"
    : "Kartendaten: © OpenStreetMap-Mitwirkende";
}
let mapStyleMode = "street";
let lastRows = [];
let lastHeadline = "", lastTruncated = false;
let favOnlyFilter = false; // "Nur Favoriten"-Filter in der Ergebnisliste
let mapInstance = null;
let mapMarkers = [];
// Ziel aus den Suchvorschlaegen: ein Ort bekommt einen gruenen pulsierenden Punkt, ein
// Startplatz ein pulsierendes Icon - damit man auf der Karte sofort sieht, wo "das" ist.
// Gilt nur fuer die Suche, die es gesetzt hat (jede andere Suche setzt es zurueck).
let searchFocus = null;    // { type: "place" | "spot", id?, lat, lon, name }
let focusMarker = null;
// Letzter manueller Kartenausschnitt (Center+Zoom) - damit das Schliessen der Detailkarte oder ein
// Ansicht-Wechsel den Ausschnitt NICHT zuruecksetzen (s. restoreMapView, closeDetail, switchToMapView).
let lastMapView = null;
function restoreMapView() {
  if (mapInstance && lastMapView) mapInstance.jumpTo({ center: lastMapView.center, zoom: lastMapView.zoom });
}
let mapLibrePromise = null;
function loadMapLibre() {
  if (window.maplibregl) return Promise.resolve();
  if (mapLibrePromise) return mapLibrePromise;
  mapLibrePromise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Karte konnte nicht geladen werden (keine Verbindung?)"));
    document.head.appendChild(script);
  });
  return mapLibrePromise;
}
const MAP_LABEL_ZOOM = 10; // ab dieser Zoomstufe werden Startplatz-Namen neben den Punkten eingeblendet
// Kartenausschnitt für die Treffer. Der eigene Standort wird mit eingerahmt, sonst
// zoomt die Karte auf weit entfernte Treffer und der blaue Punkt liegt ausserhalb
// des Bildes (sah aus, als würde er nach kurzer Zeit verschwinden).
function rowsBounds(rows) {
  if (!rows.length) return null; // ohne Treffer bleibt die bisherige Logik (flyTo auf den Suchmittelpunkt)
  const pts = rows.map(r => [r.spot.lon, r.spot.lat]);
  if (userPos) pts.push([userPos.lon, userPos.lat]);
  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
  pts.forEach(([lon, lat]) => {
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon);
  });
  return [[minLon, minLat], [maxLon, maxLat]];
}
function updateMapLabelVisibility() {
  document.getElementById("mapEl").classList.toggle("show-labels", mapInstance.getZoom() >= MAP_LABEL_ZOOM);
}

// ---------------- Eigener Standort als blauer Punkt (wie in Karten-Apps) ----------------
// Bewusst getrennt von lastOrigin: das ist der Suchmittelpunkt und kann auch eine PLZ,
// eine Region oder ein Kartenklick sein - der blaue Punkt zeigt nur echte GPS-Positionen.
let userPos = null;
let userMarker = null;      // grosse Karte
function userDotEl() {
  const el = document.createElement("div");
  el.className = "user-dot";
  el.title = "Dein Standort";
  el.innerHTML = `<span class="user-dot-pulse"></span><span class="user-dot-core"></span>`;
  return el;
}
function syncUserDot() {
  if (!userPos || typeof maplibregl === "undefined") return;
  const at = [userPos.lon, userPos.lat];
  if (mapInstance) {
    if (userMarker) userMarker.setLngLat(at);
    else userMarker = new maplibregl.Marker({ element: userDotEl() }).setLngLat(at).addTo(mapInstance);
  }
}
function setUserPos(lat, lon) { userPos = { lat, lon }; syncUserDot(); }
// Stiller Positionsabruf beim Öffnen einer Karte - nur wenn der Standort früher schon
// freigegeben wurde, sonst würde hier ungefragt ein Berechtigungsdialog aufpoppen.
function refreshUserPos() {
  if (!navigator.geolocation || localStorage.getItem("flugwetter_geo_ok") !== "1") return;
  navigator.geolocation.getCurrentPosition(
    p => setUserPos(p.coords.latitude, p.coords.longitude),
    () => {},
    { maximumAge: 300000, timeout: 8000 }
  );
}

function umgPlaetze(spot) {
  const out = [];
  if (spot.landeLat != null && spot.landeLon != null) out.push({ name: spot.landeName || "Landeplatz", lat: spot.landeLat, lon: spot.landeLon, hoehe: spot.landeHoehe });
  if (Array.isArray(spot.landeExtra)) out.push(...spot.landeExtra);
  return out;
}
// Kreis-Polygon (GeoJSON) um lat/lon mit radiusKm - fuer die Umkreis-Visualisierung auf der Karte.
function circlePolygon(lat, lon, radiusKm, steps = 64) {
  const coords = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dLat = (radiusKm / 111.32) * Math.sin(angle);
    const dLon = (radiusKm / (111.32 * Math.cos(lat * Math.PI / 180))) * Math.cos(angle);
    coords.push([lon + dLon, lat + dLat]);
  }
  return { type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} };
}
const RADIUS_CIRCLE_SRC = "radius-circle";
function addRadiusCircleLayer() {
  if (!mapInstance || mapInstance.getSource(RADIUS_CIRCLE_SRC)) return;
  // try/catch statt isStyleLoaded()-Vorabcheck: das Hinzufuegen einer Quelle kann den Style kurz
  // wieder als "nicht fertig geladen" markieren (auch fuer spaetere addSource-Aufrufe im selben
  // "idle"-Tick) - ein missglückter Versuch wird beim naechsten "idle"-Event einfach wiederholt.
  try {
    mapInstance.addSource(RADIUS_CIRCLE_SRC, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    mapInstance.addLayer({ id: "radius-circle-fill", type: "fill", source: RADIUS_CIRCLE_SRC, paint: { "fill-color": "#06b6a4", "fill-opacity": 0.08 } });
    mapInstance.addLayer({ id: "radius-circle-line", type: "line", source: RADIUS_CIRCLE_SRC, paint: { "line-color": "#06b6a4", "line-width": 2, "line-dasharray": [2, 2] } });
  } catch {}
}
function updateRadiusCircle(lat, lon, radiusKm) {
  if (!mapInstance) return;
  addRadiusCircleLayer();
  const src = mapInstance.getSource(RADIUS_CIRCLE_SRC);
  if (src) src.setData({ type: "FeatureCollection", features: [circlePolygon(lat, lon, radiusKm)] });
}
// Alle weiteren Plätze im Umkreis (jenseits der gefärbten Top-Treffer) als GPU-gerenderte Punkt-
// Ebene statt einzelner DOM-Marker - so sind auch 1000+ Punkte in dichten Regionen kein Problem
// und es gibt keinen Deckel, der in den Alpen/der Schweiz den Kreisrand "leer" aussehen lässt.
const EXTRA_POINTS_SRC = "extra-points";
let lastExtraFeatures = [];
function addExtraPointsLayer() {
  if (!mapInstance || mapInstance.getSource(EXTRA_POINTS_SRC)) return;
  try {
    mapInstance.addSource(EXTRA_POINTS_SRC, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    mapInstance.addLayer({
      id: "extra-points-layer", type: "circle", source: EXTRA_POINTS_SRC,
      paint: {
        "circle-radius": 4, "circle-color": "#9fb0c2", "circle-opacity": 0.75,
        "circle-stroke-width": 1, "circle-stroke-color": "rgba(13,17,23,.6)",
      },
    });
    mapInstance.on("mouseenter", "extra-points-layer", () => { mapInstance.getCanvas().style.cursor = "pointer"; });
    mapInstance.on("mouseleave", "extra-points-layer", () => { mapInstance.getCanvas().style.cursor = ""; });
    mapInstance.on("click", "extra-points-layer", e => {
      const id = e.features[0] && e.features[0].properties.id;
      if (id) spotAntippen(id);
    });
  } catch {}
}
function updateExtraPoints(features) {
  lastExtraFeatures = features;
  if (!mapInstance) return;
  addExtraPointsLayer();
  const src = mapInstance.getSource(EXTRA_POINTS_SRC);
  if (src) src.setData({ type: "FeatureCollection", features });
}
// "Startplätze hier suchen": erscheint, sobald der Kartenausschnitt spuerbar vom
// Suchmittelpunkt weggeschoben wurde - wie in Karten-Apps. Schwelle haengt am
// eingestellten Umkreis, damit sie bei 25 km nicht dauernd und bei 250 km nie kommt.
function updateHierBtn() {
  const btn = document.getElementById("mapHierBtn");
  if (!btn || !mapInstance) return;
  const c = mapInstance.getCenter();
  let zeigen = true;
  if (routeGeo) zeigen = false;   // Route ist die Suche - kein "hier suchen" dazwischen
  else if (lastOrigin) {
    const d = haversineExact(lastOrigin.lat, lastOrigin.lon, c.lat, c.lng);
    zeigen = d > Math.max(2, getRadius() * 0.2);
  }
  btn.hidden = !zeigen;
}
async function ensureMap() {
  if (mapInstance) return mapInstance;
  await loadMapLibre();
  // Startzentrum direkt setzen statt per flyTo danach -> greift auch, bevor die Karte "ready" ist
  const center = lastOrigin ? [lastOrigin.lon, lastOrigin.lat] : [10.4, 49.5];
  const zoom = lastOrigin ? 8 : 5.4;
  mapInstance = new maplibregl.Map({
    container: "mapEl",
    style: MINI_MAP_STYLES[mapStyleMode],
    center, zoom, attributionControl: false,
    // Doppeltipp zoomt nicht mehr - zusammen mit "Tipp = hier suchen" war das nur
    // verwirrend. Zoomen geht weiter per Zwei-Finger-Geste und ueber die +/- Knoepfe.
    doubleClickZoom: false,
  });
  // Oben rechts sitzen Ebenen- und Filter-Knopf - Zoom deshalb unten rechts ueber dem Standort-Knopf
  mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
  mapInstance.on("zoom", updateMapLabelVisibility);
  mapInstance.on("moveend", () => {
    lastMapView = { center: mapInstance.getCenter(), zoom: mapInstance.getZoom() };
    updateHierBtn();
    umgAktualisieren();   // ab UMG_ZOOM kommen Parken, Seilbahn usw. dazu
  });
  // Umkreis-Kreis übersteht einen Kartenstil-Wechsel (setStyle wirft eigene Layer/Quellen weg) nicht,
  // deshalb nach jedem Stilwechsel neu anlegen + mit dem aktuellen Standort neu befüllen. "idle" statt
  // "style.load" (Letzteres feuert in dieser MapLibre-Version nicht zuverlässig) - addRadiusCircleLayer
  // ist idempotent (No-Op falls Quelle schon da), daher unproblematisch bei jedem Idle-Event.
  mapInstance.on("idle", () => {
    addRadiusCircleLayer();
    if (lastOrigin) updateRadiusCircle(lastOrigin.lat, lastOrigin.lon, getRadius());
    addExtraPointsLayer();
    updateExtraPoints(lastExtraFeatures);
    routeLinieZeichnen();
    bfBahnLayer();   // nach Kartenstil-Wechsel wieder anlegen
  });
  // Seilbahn-Linie antippen: Name (Layer entsteht erst mit der Umgebungsansicht, Listener darf vorher da sein)
  mapInstance.on("click", "bf-bahn-line", ev => {
    const pr = ev.features[0] && ev.features[0].properties; if (!pr) return;
    new maplibregl.Popup({ offset: 8, maxWidth: "240px", className: "poi-popup" }).setLngLat(ev.lngLat)
      .setHTML(`<div class="poi-pop"><div class="poi-pop-head"><img src="${bfIconUrl("bahn")}" alt=""><div><b>${escHtml(pr.name || pr.art)}</b><span>${escHtml(pr.art)}</span></div></div></div>`)
      .addTo(mapInstance);
  });
  mapInstance.on("mouseenter", "bf-bahn-line", () => { mapInstance.getCanvas().style.cursor = "pointer"; });
  mapInstance.on("mouseleave", "bf-bahn-line", () => { mapInstance.getCanvas().style.cursor = ""; });
  // Tippen auf freie Kartenflaeche startet KEINE Suche mehr (auf Wunsch) - man verschiebt
  // die Karte oft nur und loeste dabei versehentlich eine neue Suche aus. Woanders suchen:
  // Karte verschieben, dann "Startplaetze hier suchen". Langes Druecken legt weiter einen
  // eigenen Platz an (lpSetup), Tipp auf graue Punkte oeffnet weiter den Platz.
  lpSetup(document.getElementById("mapEl"));
  const bounds = rowsBounds(lastRows);
  if (bounds) mapInstance.fitBounds(bounds, { padding: 50, animate: false, maxZoom: 13 });
  updateMapMarkers(lastRows, { flyTo: false });
  updateMapLabelVisibility();
  syncUserDot();
  refreshUserPos();
  return mapInstance;
}
// Marker aus den aktuellen Suchergebnissen aufbauen – dieselben Daten wie die Listenansicht (rows).
const START_ICON_BY_STATUS = { gut: "icons/marker-start-gut.png", grenz: "icons/marker-start-grenz.png", nein: "icons/marker-start-nein.png" };
function updateMapMarkers(rows, opts = {}) {
  if (!mapInstance) return;
  mapMarkers.forEach(m => m.remove());
  mapMarkers = [];
  rows.forEach(r => {
    const el = document.createElement("div");
    el.className = "map-marker" + (searchFocus && searchFocus.type === "spot" && searchFocus.id === r.spot.id ? " map-marker-pulse" : "")
      + (istHeimat(r.spot) ? " mk-home" : "") + (isFav(r.spot.id) ? " mk-fav" : "");
    el.title = r.spot.name;
    el.innerHTML = `<img src="${START_ICON_BY_STATUS[r.ts.status] || START_ICON_BY_STATUS.nein}" alt=""><span class="map-marker-label ml-${r.ts.status}">${r.spot.name}</span>`;
    // stopPropagation: sonst bubbelt der Klick zum generischen Karten-Click-Handler durch (der
    // Klicks auf leere Kartenflächen als neue Ortssuche interpretiert) und startet ungewollt eine
    // zweite Suche samt Zoom-Animation im Hintergrund, während das Detailfenster schon offen ist.
    el.addEventListener("click", e => { e.stopPropagation(); spotAntippen(r.spot.id, r.ts); });
    const marker = new maplibregl.Marker({ element: el }).setLngLat([r.spot.lon, r.spot.lat]).addTo(mapInstance);
    mapMarkers.push(marker);

    const landePlaetze = [];
    if (r.spot.landeLat != null && r.spot.landeLon != null) landePlaetze.push({ name: r.spot.landeName || "Landeplatz", lat: r.spot.landeLat, lon: r.spot.landeLon });
    if (Array.isArray(r.spot.landeExtra)) landePlaetze.push(...r.spot.landeExtra);
    landePlaetze.forEach(l => {
      const lEl = document.createElement("div");
      lEl.className = "map-lande-marker"; lEl.title = l.name;
      lEl.innerHTML = `<img src="icons/marker-lande-black.png" alt=""><span class="map-marker-label">${l.name}</span>`;
      lEl.addEventListener("click", e => { e.stopPropagation(); spotAntippen(r.spot.id, r.ts); });
      const lMarker = new maplibregl.Marker({ element: lEl }).setLngLat([l.lon, l.lat]).addTo(mapInstance);
      mapMarkers.push(lMarker);
    });
  });
  // Alle weiteren Plätze im Umkreis (jenseits der geladenen/gefärbten Top-Treffer) als schlichte,
  // ungefärbte Punkte auf einer eigenen Kartenebene (kein Deckel - GPU-gerendert, siehe
  // updateExtraPoints). Zeigt beim Rauszoomen, dass da noch mehr ist. Wetter wird erst beim
  // Antippen live nachgeladen (openDetail holt sich das ohnehin frisch, unabhängig von rows).
  if (lastOrigin) {
    const shown = new Set(rows.map(r => r.spot.id));
    const radius = getRadius();
    const features = allKnownSpots()
      .filter(s => !shown.has(s.id) && haversine(lastOrigin.lat, lastOrigin.lon, s.lat, s.lon) <= radius)
      .map(s => ({ type: "Feature", geometry: { type: "Point", coordinates: [s.lon, s.lat] }, properties: { id: s.id, name: s.name } }));
    updateExtraPoints(features);
  } else {
    updateExtraPoints([]);
  }
  updateFocusMarker(rows);
  updateHomeMarker(rows);
  updateFavMarkers(rows);
  if (opts.flyTo === false) return;
  // Gesuchter Startplatz: nah ranzoomen, sonst geht er zwischen den Nachbarn im 100-km-Umkreis unter
  if (searchFocus && searchFocus.type === "spot") {
    mapInstance.flyTo({ center: [searchFocus.lon, searchFocus.lat], zoom: MAP_LABEL_ZOOM - 0.5, duration: 600 });   // knapp unter der Namens-Stufe: nur das Ziel traegt Namen
    updateMapLabelVisibility();
    return;
  }
  const bounds = rowsBounds(rows);
  if (bounds) mapInstance.fitBounds(bounds, { padding: 50, duration: 600, maxZoom: 13 });
  else if (lastOrigin) mapInstance.flyTo({ center: [lastOrigin.lon, lastOrigin.lat], zoom: 8, duration: 600 });
  updateMapLabelVisibility();
}
// Heimatgebiet aus dem Profil: der Startplatz pulsiert lila; liegt es ausserhalb der Treffer
// oder ist ein Ort/Standort, steht ein lila pulsierender Punkt dort.
function istHeimat(spot) {
  const h = profil.home; if (!h) return false;
  if (h.spotId) return h.spotId === spot.id;
  return foldText(h.name) === foldText(spot.name) && haversineExact(h.lat, h.lon, spot.lat, spot.lon) < 1;
}
let homeMarker = null;
function updateHomeMarker(rows) {
  if (homeMarker) { homeMarker.remove(); homeMarker = null; }
  const h = profil.home;
  if (!h || !mapInstance || typeof maplibregl === "undefined") return;
  if ((rows || []).some(r => istHeimat(r.spot))) return;   // Startplatz-Marker pulsiert selbst
  const el = document.createElement("div");
  el.className = "focus-dot home-dot"; el.title = "Heimat: " + h.name;
  el.innerHTML = `<span class="focus-dot-ring"></span><span class="focus-dot-core"></span>`;
  homeMarker = new maplibregl.Marker({ element: el }).setLngLat([h.lon, h.lat]).addTo(mapInstance);
}
// Favoriten: goldener Stern am Marker; liegt ein Favorit nicht in den Treffern (zu weit weg,
// anderer Ort gesucht), steht er trotzdem als Stern-Marker auf der Karte.
let favMarkers = [];
function updateFavMarkers(rows) {
  favMarkers.forEach(m => m.remove()); favMarkers = [];
  if (!mapInstance || typeof maplibregl === "undefined") return;
  const gezeigt = new Set((rows || []).map(r => r.spot.id));
  favoriteSpots().filter(sp => !gezeigt.has(sp.id) && sp.lat != null).forEach(sp => {
    const el = document.createElement("div");
    el.className = "fav-pin"; el.title = sp.name + " (Favorit)";
    el.innerHTML = `<span>★</span><b class="fav-pin-name">${escHtml(sp.name)}</b>`;
    el.addEventListener("click", e => { e.stopPropagation(); spotAntippen(sp.id); });
    favMarkers.push(new maplibregl.Marker({ element: el }).setLngLat([sp.lon, sp.lat]).addTo(mapInstance));
  });
}
function favMarkerErneuern() {
  if (!mapInstance) return;
  if (lastRows.length) updateMapMarkers(displayRowsFor(lastRows), { flyTo: false });
  else updateFavMarkers([]);
}
function homeMarkerErneuern() {
  if (mapInstance && lastRows.length) updateMapMarkers(displayRowsFor(lastRows), { flyTo: false });
  else updateHomeMarker([]);
}
function updateFocusMarker(rows) {
  if (focusMarker) { focusMarker.remove(); focusMarker = null; }
  const f = searchFocus;
  if (!f || !mapInstance) return;
  // Startplatz ist schon als farbiger Marker da (pulsiert ueber die Klasse) - nichts weiter tun.
  if (f.type === "spot" && rows.some(r => r.spot.id === f.id)) return;
  const el = document.createElement("div");
  if (f.type === "place") {
    el.className = "focus-dot"; el.title = f.name;
    el.innerHTML = `<span class="focus-dot-ring"></span><span class="focus-dot-core"></span>`;
  } else {
    // Startplatz durch Filter ausgeblendet oder ohne Wetter-Treffer: trotzdem zeigen
    el.className = "map-marker map-marker-pulse"; el.title = f.name;
    el.innerHTML = `<img src="${START_ICON_BY_STATUS.nein}" alt=""><span class="map-marker-label">${escHtml(f.name)}</span>`;
    el.addEventListener("click", e => { e.stopPropagation(); spotAntippen(f.id); });
  }
  focusMarker = new maplibregl.Marker({ element: el }).setLngLat([f.lon, f.lat]).addTo(mapInstance);
}
// ---------------- Startplaetze entlang einer Route (Stufe 1) ----------------
// Strecke von OSRM (gleicher Dienst wie die Fahrzeiten), dann alle Plaetze, die hoechstens
// "Umweg" km (Luftlinie) neben der Strecke liegen. Liste in Fahrtrichtung, Bewertung fuer den
// gewaehlten Tag. Stufe 2 (spaeter): Ankunftszeit je Platz und Bewertung genau dafuer.
const IC_ROUTE = `<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/></svg>`;
const ROUTE_MAX_PLAETZE = 80;   // mehr verkraftet die Wetter-Sammelabfrage nicht sinnvoll
const ROUTE_SRC = "route-linie";
let routeGeo = null;            // [[lon,lat], ...] der aktuellen Route, null = keine
let routeUmweg = (() => { try { return +localStorage.getItem("flugwetter_route_umweg") || 20; } catch { return 20; } })();

// annotations=duration: Fahrzeit je Abschnitt - daraus die Ankunftszeit an jedem Punkt der
// Strecke (Stufe 2). Gleiche Strecke nicht doppelt holen (Abfahrt/Umweg aendern).
const routeCache = new Map();
async function fetchRoute(a, b) {
  const key = [a.lat, a.lon, b.lat, b.lon].map(x => x.toFixed(4)).join(",");
  if (routeCache.has(key)) return routeCache.get(key);
  const url = `https://router.project-osrm.org/route/v1/driving/${a.lon.toFixed(5)},${a.lat.toFixed(5)};${b.lon.toFixed(5)},${b.lat.toFixed(5)}?overview=full&geometries=geojson&annotations=duration`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Routenserver antwortet nicht (" + res.status + ")");
  const j = await res.json();
  const r = j.routes && j.routes[0];
  if (!r) throw new Error("Keine Route gefunden");
  const coords = r.geometry.coordinates;
  // Kumulierte Fahrzeit je Punkt; fehlen die Abschnittszeiten, gleichmaessig verteilen
  const abschn = r.legs && r.legs[0] && r.legs[0].annotation && r.legs[0].annotation.duration;
  const zeit = [0];
  for (let i = 1; i < coords.length; i++) zeit.push(zeit[i - 1] + (abschn && abschn[i - 1] != null ? abschn[i - 1] : r.duration / (coords.length - 1)));
  const out = { coords, zeit, km: r.distance / 1000, sec: r.duration };
  routeCache.set(key, out);
  return out;
}
// Plaetze im Korridor: kleinster Abstand zur Strecke (flache Naeherung, auf ein paar
// hundert km genau genug) und die Position entlang der Strecke (km ab Start).
function plaetzeAmKorridor(coords, maxKm, zeit) {
  // Strecke auf Stuetzpunkte im Abstand >= 300 m ausduennen - OSRM liefert tausende.
  // Zu jedem Stuetzpunkt die Fahrzeit ab Start merken (Stufe 2).
  const pts = [coords[0]], ptsZeit = [0];
  coords.forEach((c, i) => {
    const l = pts[pts.length - 1];
    if (haversineExact(l[1], l[0], c[1], c[0]) >= 0.3 || i === coords.length - 1) { pts.push(c); ptsZeit.push(zeit ? zeit[i] : 0); }
  });
  const lat0 = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const kx = 111.32 * Math.cos(lat0 * Math.PI / 180), ky = 110.57;
  const xy = pts.map(([lon, lat]) => [lon * kx, lat * ky]);
  const kum = [0];
  for (let i = 1; i < xy.length; i++) kum.push(kum[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]));
  const lons = pts.map(p => p[0]), lats = pts.map(p => p[1]);
  const dLat = maxKm / ky, dLon = maxKm / kx;
  const box = [Math.min(...lons) - dLon, Math.min(...lats) - dLat, Math.max(...lons) + dLon, Math.max(...lats) + dLat];
  const out = [];
  for (const s of allKnownSpots()) {
    if (s.lon < box[0] || s.lon > box[2] || s.lat < box[1] || s.lat > box[3]) continue;
    const px = s.lon * kx, py = s.lat * ky;
    let best = Infinity, entlang = 0, sek = 0;
    for (let i = 1; i < xy.length; i++) {
      const [ax, ay] = xy[i - 1], [bx, by] = xy[i];
      const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
      const d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      if (d < best) { best = d; entlang = kum[i - 1] + t * Math.sqrt(l2); sek = ptsZeit[i - 1] + t * (ptsZeit[i] - ptsZeit[i - 1]); }
    }
    if (best <= maxKm) out.push({ ...s, routeKm: entlang, routeSek: sek, abseits: best, dist: Math.round(best), sortKey: entlang });
  }
  // Zu viele: die am weitesten abseits fliegen zuerst raus, danach in Fahrtrichtung
  out.sort((a, b) => a.abseits - b.abseits);
  return { plaetze: out.slice(0, ROUTE_MAX_PLAETZE).sort((a, b) => a.routeKm - b.routeKm), mehr: out.length > ROUTE_MAX_PLAETZE };
}
function routeLinieZeichnen() {
  if (!mapInstance) return;
  const data = { type: "FeatureCollection", features: routeGeo ? [{ type: "Feature", geometry: { type: "LineString", coordinates: routeGeo }, properties: {} }] : [] };
  try {
    const src = mapInstance.getSource(ROUTE_SRC);
    if (src) { src.setData(data); return; }
    if (!routeGeo) return;
    mapInstance.addSource(ROUTE_SRC, { type: "geojson", data });
    mapInstance.addLayer({ id: "route-rand", type: "line", source: ROUTE_SRC, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": 9, "line-opacity": 0.85 } });
    mapInstance.addLayer({ id: "route-linie", type: "line", source: ROUTE_SRC, layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#06b6a4", "line-width": 5 } });
  } catch {}   // Stil noch nicht fertig - kommt mit dem naechsten "idle"
}
function routeAufraeumen() {
  if (!routeGeo) return;
  routeGeo = null;
  routeLinieZeichnen();
}
// Start/Ziel aus dem Eingabefeld: gewaehlter Vorschlag, sonst erster Ortstreffer;
// leeres "Von" = eigener Standort.
function eigenerStandort() {
  return new Promise((ok, fehler) => {
    if (userPos) return ok({ lat: userPos.lat, lon: userPos.lon, name: "Mein Standort" });
    if (!navigator.geolocation) return fehler(new Error("Standort nicht verfügbar – bitte „Von“ eintragen"));
    navigator.geolocation.getCurrentPosition(p => {
      try { localStorage.setItem("flugwetter_geo_ok", "1"); } catch {}
      setUserPos(p.coords.latitude, p.coords.longitude);
      ok({ lat: p.coords.latitude, lon: p.coords.longitude, name: "Mein Standort" });
    }, () => fehler(new Error("Standort nicht freigegeben – bitte „Von“ eintragen")), { timeout: 10000, maximumAge: 300000 });
  });
}
async function routePunkt(inp, leerIstStandort) {
  const v = inp.value.trim();
  if (inp.dataset.lat) return { lat: +inp.dataset.lat, lon: +inp.dataset.lon, name: v };
  if (!v) {
    if (leerIstStandort) return eigenerStandort();
    throw new Error("Bitte ein Ziel eintragen");
  }
  if (/^\d{5}$/.test(v)) { const o = await geocodePlz(v); return { lat: o.lat, lon: o.lon, name: v }; }
  const treffer = await fetchPlaces(v).catch(() => []);
  if (treffer.length) return { lat: treffer[0].lat, lon: treffer[0].lon, name: treffer[0].name };
  const g = await forwardGeocode(v);
  if (g) return { lat: g.lat, lon: g.lon, name: v };
  throw new Error(`„${v}“ nicht gefunden`);
}
// Abfahrt (Stufe 2): Standard heute = jetzt auf die naechste Viertelstunde, morgen 08:00.
// Hat man selbst eine Zeit eingetragen, bleibt sie beim Tageswechsel stehen.
let routeAbManuell = false;
function routeAbStandard() {
  const inp = document.getElementById("routeAb");
  if (!inp || routeAbManuell) return;
  if (searchDay === 1) { inp.value = "08:00"; return; }
  const d = new Date(Date.now() + 15 * 60000);
  d.setMinutes(Math.floor(d.getMinutes() / 15) * 15);
  inp.value = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function routeAbfahrt() {
  const [h, m] = (document.getElementById("routeAb").value || "08:00").split(":").map(Number);
  const d = new Date(); d.setDate(d.getDate() + (searchDay === 1 ? 1 : 0)); d.setHours(h, m, 0, 0);
  return d;
}
// Umweg zum Platz grob schaetzen: Luftlinie x 1,4 (Strassen sind krumm) mit 45 km/h
const umwegSek = abseitsKm => abseitsKm * 1.4 / 45 * 3600;
async function runRouteSearch() {
  umgKarteZu();
  const out = document.getElementById("flyResults");
  await switchToMapView();
  out.hidden = false;   // Lade-/Fehlerhinweis auch in der Kartenansicht sichtbar
  out.innerHTML = ladeHtml("Route wird berechnet …");
  try {
    const [a, b] = await Promise.all([
      routePunkt(document.getElementById("routeVon"), true),
      routePunkt(document.getElementById("routeNach"), false),
    ]);
    const r = await fetchRoute(a, b);
    const { plaetze, mehr } = plaetzeAmKorridor(r.coords, routeUmweg, r.zeit);
    routeAbStandard();
    const ab = routeAbfahrt();
    const ankunft = s => new Date(ab.getTime() + (s.routeSek + umwegSek(s.abseits)) * 1000);
    // Kein Umkreis, kein Suchziel - die Route ist die Suche
    lastOrigin = null; searchFocus = null;
    const kreis = mapInstance && mapInstance.getSource(RADIUS_CIRCLE_SRC);
    if (kreis) kreis.setData({ type: "FeatureCollection", features: [] });
    routeGeo = r.coords;
    routeLinieZeichnen();
    updateHierBtn();
    rerunSearch = () => runRouteSearch();
    const headline = `${dayWord()} auf der Route <b>${escHtml(a.name)} → ${escHtml(b.name)}</b>`
      + ` · ${Math.round(r.km)} km, ${formatDur(r.sec)} · ±${routeUmweg} km`
      + ` · Abfahrt ${ab.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} – bewertet ab Ankunft`;
    if (!plaetze.length) { out.innerHTML = `<div class="fly-head">${headline}</div><p class="empty">Kein Startplatz innerhalb von ${routeUmweg} km neben der Strecke. Umweg vergrößern?</p>`; }
    else await renderSearch(plaetze, null, headline + (mehr ? ` · die ${ROUTE_MAX_PLAETZE} nächsten an der Strecke` : ""), { entlangRoute: true, keepView: true, max: ROUTE_MAX_PLAETZE, ankunft });
    if (mapInstance) {
      const lons = r.coords.map(c => c[0]), lats = r.coords.map(c => c[1]);
      mapInstance.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]], { padding: 40, duration: 600 });
    }
    // In der Kartenansicht die Liste wieder ausblenden - ausser es gibt nur eine Meldung
    if (plaetze.length) out.hidden = document.querySelector("#viewToggle .vpill.on[data-view=map]") != null;
  } catch (e) {
    out.innerHTML = `<p class="empty">${escHtml(e.message || "Route konnte nicht berechnet werden")}</p>`;
  }
}
// Eingabefelder: Ortsvorschlaege wie im Suchfeld (Photon), Auswahl merkt sich die Koordinaten
function routeFeld(inputId, sugId) {
  const inp = document.getElementById(inputId), box = document.getElementById(sugId);
  let timer = null, seq = 0, treffer = [];
  const zu = () => { box.hidden = true; box.innerHTML = ""; };
  inp.addEventListener("input", () => {
    delete inp.dataset.lat; delete inp.dataset.lon;
    clearTimeout(timer);
    const v = inp.value.trim(), n = ++seq;
    if (v.length < 3 || /^\d+$/.test(v)) { zu(); return; }
    timer = setTimeout(async () => {
      treffer = await fetchPlaces(v).catch(() => []);
      if (n !== seq || !treffer.length) { if (n === seq) zu(); return; }
      box.innerHTML = treffer.map((pl, i) => `<button type="button" class="sg-opt sg-place" data-i="${i}">
        <span class="sg-ic">${IC_PIN}</span><span class="sg-txt"><span class="sg-name">${escHtml(pl.name)}</span>
        <span class="sg-sub">${escHtml([pl.kind, pl.where].filter(Boolean).join(" · "))}</span></span></button>`).join("");
      box.hidden = false;
    }, 300);
  });
  box.addEventListener("pointerdown", e => e.preventDefault());
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-i]"); if (!b) return;
    const pl = treffer[+b.dataset.i];
    inp.value = pl.name; inp.dataset.lat = pl.lat; inp.dataset.lon = pl.lon;
    zu();
    if (inputId === "routeVon") document.getElementById("routeNach").focus();
    else inp.blur();
  });
  inp.addEventListener("blur", () => setTimeout(zu, 150));
  inp.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    e.preventDefault(); zu();
    if (inputId === "routeVon") document.getElementById("routeNach").focus();
    else { inp.blur(); runRouteSearch(); }
  });
}
routeFeld("routeVon", "routeVonSug");
routeAbStandard();
document.getElementById("routeAb").addEventListener("change", () => {
  routeAbManuell = true;
  if (routeGeo) runRouteSearch();   // Strecke kommt aus dem Zwischenspeicher, nur neu bewerten
});
routeFeld("routeNach", "routeNachSug");
document.getElementById("routeGo").addEventListener("click", () => runRouteSearch());
document.querySelectorAll("#routePanel [data-umweg]").forEach(b => {
  b.classList.toggle("on", +b.dataset.umweg === routeUmweg);
  b.addEventListener("click", () => {
    routeUmweg = +b.dataset.umweg;
    try { localStorage.setItem("flugwetter_route_umweg", String(routeUmweg)); } catch {}
    document.querySelectorAll("#routePanel [data-umweg]").forEach(x => x.classList.toggle("on", x === b));
    if (routeGeo) runRouteSearch();   // Route steht schon -> gleich neu filtern
  });
});
// Eigener Knopf ueber Karte/Liste: klappt das Route-Feld auf/zu
document.getElementById("routeBtn").addEventListener("click", () => {
  const panel = document.getElementById("routePanel"), btn = document.getElementById("routeBtn");
  panel.hidden = !panel.hidden;
  btn.classList.toggle("offen", !panel.hidden);
  btn.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
  if (!panel.hidden) document.getElementById(document.getElementById("routeNach").value ? "routeGo" : "routeNach").focus();
});
// Aktiv auf Kartenansicht wechseln - vom Toggle-Button UND vom Freitext-Ortssuche-Fallback genutzt.
async function switchToMapView() {
  document.querySelectorAll("#viewToggle .vpill").forEach(x => x.classList.toggle("on", x.dataset.view === "map"));
  document.getElementById("flyResults").hidden = true;
  document.getElementById("mapView").hidden = false;
  try { await ensureMap(); mapInstance.resize(); restoreMapView(); umgAktualisieren(); }
  catch (e) { document.getElementById("mapEl").innerHTML = `<p class="empty">${e.message}</p>`; }
}
document.getElementById("viewToggle").addEventListener("click", async e => {
  const b = e.target.closest(".vpill"); if (!b) return;
  if (b.dataset.view === "map") { await switchToMapView(); return; }
  umgKarteZu();
  document.querySelectorAll("#viewToggle .vpill").forEach(x => x.classList.toggle("on", x === b));
  document.getElementById("flyResults").hidden = false;
  document.getElementById("mapView").hidden = true;
});
// Fadenkreuz auf der Karte: immer den AKTUELLEN Standort neu ermitteln und dort suchen
// (nicht nur zur letzten, ggf. veralteten Suche zurückspringen).
document.getElementById("mapLocateBtn").addEventListener("click", () => {
  startGpsSearch();
});

// Umkreissuche ab einem Punkt (GPS oder PLZ)
async function runFlySearch(lat, lon, label, opts = {}) {
  umgKarteZu();
  routeAufraeumen();
  lastOrigin = { lat, lon, label };
  const focus = opts.focus || null;
  searchFocus = focus;
  rerunSearch = () => runFlySearch(lat, lon, label, { focus });
  const radius = getRadius();
  updateRadiusCircle(lat, lon, radius);
  const candidates = allKnownSpots()
    .map(s => { const d = haversine(lat, lon, s.lat, s.lon); return { ...s, dist: d, sortKey: d }; })
    .filter(s => s.dist <= radius)
    .sort((a, b) => a.sortKey - b.sortKey);
  const headline = `${dayWord()} im Umkreis ${radius} km${label ? " um <b>" + label + "</b>" : ""}`;
  await renderSearch(candidates, { lat, lon }, headline, opts);
}


// Heute/Morgen-Umschalter
document.getElementById("dayToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  searchDay = parseInt(b.dataset.day, 10);
  routeAbStandard();
  document.querySelectorAll("#dayToggle .rpill").forEach(x => x.classList.toggle("on", x === b));
  updateGreeting();
  if (rerunSearch) rerunSearch();
});

// Zusammenfassung am Filter-Knopf: aktive Zustieg-/Höhendifferenz-Filter (wenn nicht Egal)
function updateFilterSummary() {
  // Zaehler am Filter-Knopf der Karte: aktive Einschraenkungen (Umkreis zaehlt nicht - der
  // ist keine Einschraenkung, sondern die Suchweite)
  fsUpdateCount();
  const sum = document.getElementById("filterSummary");
  if (!sum) return;
  const parts = [];
  if (favOnlyFilter) parts.push("⭐ Favoriten");
  if (accFilter !== "all") parts.push(accShort(accFilter));
  if (minHoehendiff > 0) parts.push(`⛰️ ab ${minHoehendiff} m`);
  sum.textContent = parts.length ? "· " + parts.join(" · ") : "";
}
function applyFavSegUI() {
  document.querySelectorAll("#favSeg .apill").forEach(x => x.classList.toggle("on", (x.dataset.favonly === "1") === favOnlyFilter));
  updateFilterSummary();
}

// Zustieg-Filter (DHV-Erschließung): acc-Code f=zu Fuß, a=Auto, b=Bergbahn.
let accFilter = localStorage.getItem("flugwetter_acc") || "all";
function accMatch(spot, f) {
  if (f === "all") return true;
  const a = spot.acc;
  if (a == null) return false;              // unbekannt -> nur bei „Egal"
  if (f === "foot") return a.includes("f"); // zu Fuß erreichbar (auch wenn zusätzlich Auto/Bahn möglich)
  if (f === "auto") return a.includes("a");
  if (f === "bahn") return a.includes("b");
  return true;
}
function accLabel(f) {
  return { foot: "Hike & Fly (zu Fuß erreichbar)", auto: "mit Auto erreichbar", bahn: "mit Bergbahn erreichbar" }[f] || "";
}
function accShort(f) {
  return { foot: "🥾 Hike & Fly", auto: "🚗 Auto", bahn: "🚠 Bergbahn" }[f] || "";
}
function applyAccUI() {
  document.querySelectorAll("#accSeg .apill").forEach(x => x.classList.toggle("on", x.dataset.acc === accFilter));
  updateFilterSummary();
}

// Füllstand-Anzeige für alle .hd-slider-Regler (Grad statt reinem accent-color, s. CSS).
function updateSliderFill(el) {
  const min = parseFloat(el.min) || 0, max = parseFloat(el.max) || 100, val = parseFloat(el.value);
  el.style.setProperty("--range-progress", `${((val - min) / (max - min)) * 100}%`);
}

// Mindest-Höhendifferenz-Filter (Schieberegler): blendet kleine Übungshänge aus.
let minHoehendiff = parseInt(localStorage.getItem("flugwetter_minhd"), 10) || 0;
function hdMatch(spot, min) {
  if (min <= 0) return true;
  if (spot.id.startsWith("user_")) return true; // eigene Plätze bleiben immer sichtbar (Marks Entscheidung)
  if (spot.hoehendiff == null) return false;     // unbekannt -> nur bei "Egal" (analog Zustieg-Filter)
  return spot.hoehendiff >= min;
}
function applyHdUI() {
  const slider = document.getElementById("hdSlider"), val = document.getElementById("hdVal");
  slider.value = minHoehendiff;
  val.textContent = minHoehendiff > 0 ? `ab ${minHoehendiff} m` : "Egal";
  updateSliderFill(slider);
  updateFilterSummary();
}
const hdSlider = document.getElementById("hdSlider");
hdSlider.addEventListener("input", () => {
  document.getElementById("hdVal").textContent = `ab ${hdSlider.value} m`; // nur Live-Label beim Ziehen
  updateSliderFill(hdSlider);
});
hdSlider.addEventListener("change", () => {
  minHoehendiff = parseInt(hdSlider.value, 10) || 0;
  localStorage.setItem("flugwetter_minhd", String(minHoehendiff));
  applyHdUI();
  if (lastRows.length) { renderFlyResults(lastRows, lastHeadline, lastTruncated); updateMapMarkers(displayRowsFor(lastRows), { flyTo: false }); }
});

// Profi-Modus (Einstellungen): eigene Wind-/Böen-/Richtungs-Grenzwerte statt PROFILE (s. oben).
function applyProUI() {
  document.querySelectorAll("#proModeSeg .apill").forEach(x => x.classList.toggle("on", x.dataset.pro === (proMode ? "on" : "off")));
  document.getElementById("proSliders").hidden = !proMode;
  document.getElementById("proWindSlider").value = proWindMax;
  document.getElementById("proGustSlider").value = proGustMax;
  document.getElementById("proDirSlider").value = proDirTol;
  document.getElementById("proWindVal").textContent = `${proWindMax} km/h`;
  document.getElementById("proGustVal").textContent = `${proGustMax} km/h`;
  document.getElementById("proDirVal").textContent = `${proDirTol}°`;
  ["proWindSlider", "proGustSlider", "proDirSlider"].forEach(id => updateSliderFill(document.getElementById(id)));
}
document.getElementById("proModeSeg").addEventListener("click", e => {
  const b = e.target.closest("[data-pro]"); if (!b) return;
  proMode = b.dataset.pro === "on";
  localStorage.setItem("flugwetter_promode", proMode ? "1" : "0");
  applyProUI();
  if (rerunSearch) rerunSearch();
});
[["proWindSlider", "proWindVal", " km/h"], ["proGustSlider", "proGustVal", " km/h"], ["proDirSlider", "proDirVal", "°"]].forEach(([sliderId, valId, unit]) => {
  const el = document.getElementById(sliderId);
  el.addEventListener("input", () => {
    document.getElementById(valId).textContent = el.value + unit; // nur Live-Label
    updateSliderFill(el);
  });
});
document.getElementById("proWindSlider").addEventListener("change", () => {
  proWindMax = parseInt(document.getElementById("proWindSlider").value, 10);
  localStorage.setItem("flugwetter_pro_windmax", String(proWindMax));
  if (rerunSearch) rerunSearch();
});
document.getElementById("proGustSlider").addEventListener("change", () => {
  proGustMax = parseInt(document.getElementById("proGustSlider").value, 10);
  localStorage.setItem("flugwetter_pro_gustmax", String(proGustMax));
  if (rerunSearch) rerunSearch();
});
document.getElementById("proDirSlider").addEventListener("change", () => {
  proDirTol = parseInt(document.getElementById("proDirSlider").value, 10);
  localStorage.setItem("flugwetter_pro_dirtol", String(proDirTol));
  if (rerunSearch) rerunSearch();
});
// ⓘ-Erklärung je Grenzwert-Regler auf-/zuklappen
document.querySelectorAll(".pro-sliders .info-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const p = btn.closest(".hd-box").querySelector(".slider-info");
    p.hidden = !p.hidden;
  });
});
document.getElementById("accSeg").addEventListener("click", e => {
  const b = e.target.closest("[data-acc]"); if (!b) return;
  accFilter = b.dataset.acc;
  localStorage.setItem("flugwetter_acc", accFilter);
  applyAccUI();
  // Zustieg ist reine Anzeige-Filterung auf den schon geholten Ergebnissen -> kein neuer Abruf noetig
  // (verhindert auch, dass ein enger Filter plaetze zeigt, die "Egal" nie hatte, s. renderSearch).
  // Karte muss denselben Filter zeigen wie die Liste, sonst weichen Liste/Karte voneinander ab.
  if (lastRows.length) { renderFlyResults(lastRows, lastHeadline, lastTruncated); updateMapMarkers(displayRowsFor(lastRows), { flyTo: false }); }
});
document.getElementById("favSeg").addEventListener("click", e => {
  const b = e.target.closest("[data-favonly]"); if (!b) return;
  favOnlyFilter = b.dataset.favonly === "1";
  applyFavSegUI();
  if (lastRows.length) { renderFlyResults(lastRows, lastHeadline, lastTruncated); updateMapMarkers(displayRowsFor(lastRows), { flyTo: false }); }
});
// Hauptkarte: Filter-Feld und Ebenen-Menue (wie auf der Briefing-Karte). Das alte
// Klappfeld "Erweiterte Filter" ist weg - Umkreis, Favoriten, Zustieg und Hoehendifferenz
// stehen jetzt im Filter-Feld auf der Karte.
function mapTogglePop(id) {
  let sheetAuf = false;
  for (const [popId, btnId] of [["mapFilterSheet", "mapFilterBtn"], ["umgFilterSheet", "umgFilterBtn"], ["mapLayerPop", "mapLayerBtn"]]) {
    const pop = document.getElementById(popId), btn = document.getElementById(btnId);
    if (!pop) continue;
    const auf = popId === id && pop.hidden;
    if (auf && popId === "umgFilterSheet") fsOeffnen();
    pop.hidden = !auf;
    if (auf && pop.classList.contains("fsheet")) sheetAuf = true;
    if (btn) { btn.classList.toggle("on", auf); btn.setAttribute("aria-expanded", auf ? "true" : "false"); }
  }
  document.getElementById("mapFilterBackdrop").hidden = !sheetAuf;
}
// Zwei Filter-Felder (Park4Night-Art: Titel mit Zaehler, "Zuruecksetzen", Zeilen mit Haken,
// fester Knopf unten):
//  - "Startplaetze" (Trichter): Umkreis, Favoriten, Zustieg, Hoehe - wirkt sofort
//  - "Umgebung" (Pin): Parken, Seilbahn, Camping ... - gilt mit "Filter anwenden"; die Symbole
//    erscheinen beim Heranzoomen (ab UMG_ZOOM)
let fsPending = {};
function fsRowsHtml() {
  return BF_ORDER.map(cat => `<div class="fs-row${fsPending[cat] ? " on" : ""}" role="checkbox" tabindex="0" aria-checked="${fsPending[cat] ? "true" : "false"}" data-fscat="${cat}">
      <img src="${bfIconUrl(cat)}" alt=""><span class="fs-lbl">${BF_CATS[cat].label}</span><span class="fs-cnt"></span>
      <span class="fs-box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></div>`).join("");
}
function fsOeffnen() {
  fsPending = { ...bfFilter() };
  document.getElementById("fsRows").innerHTML = fsRowsHtml();
  bfUpdateChips();
}
function fsUpdateCount() {
  const nStart = [favOnlyFilter, accFilter !== "all", minHoehendiff > 0].filter(Boolean).length;
  const offen = !document.getElementById("umgFilterSheet").hidden;
  const nUmg = BF_ORDER.filter(c => offen && fsPending[c] != null ? fsPending[c] : bfFilter()[c]).length;
  const set = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n ? String(n) : ""; };
  set("mapFilterBadge", nStart);
  set("umgFilterBadge", BF_ORDER.filter(c => bfFilter()[c]).length);
  const t1 = document.getElementById("fsCountStart"); if (t1) t1.textContent = nStart ? `(${nStart})` : "";
  const t2 = document.getElementById("fsCountUmg"); if (t2) t2.textContent = nUmg ? `(${nUmg})` : "";
}
function fsAnwenden() {
  bfSaveFilter({ ...fsPending });
  mapTogglePop(null);
  fsUpdateCount();
  // Nicht nah genug dran: kurz sagen, wo die Symbole herkommen
  if (mapInstance && BF_ORDER.some(c => fsPending[c]) && mapInstance.getZoom() < UMG_ZOOM) {
    umgHinweis = "Näher heranzoomen – dann erscheinen Parken, Seilbahn &amp; Co.";
    setTimeout(() => { umgHinweis = ""; bfUpdateChips(); }, 5000);
  } else umgHinweis = "";
  bfUpdateChips();
  umgJetzt();
}
function fsUmgZuruecksetzen() {
  fsPending = { ...BF_DEFAULT };
  document.querySelectorAll("#fsRows .fs-row").forEach(r => {
    const on = !!fsPending[r.dataset.fscat];
    r.classList.toggle("on", on); r.setAttribute("aria-checked", on ? "true" : "false");
  });
  fsUpdateCount();
}
function fsStartZuruecksetzen() {
  favOnlyFilter = false; accFilter = "all"; minHoehendiff = 0;
  try { localStorage.setItem("flugwetter_acc", "all"); localStorage.setItem("flugwetter_minhd", "0"); } catch {}
  applyFavSegUI(); applyAccUI(); applyHdUI();
  if (lastRows.length) { renderFlyResults(lastRows, lastHeadline, lastTruncated); updateMapMarkers(displayRowsFor(lastRows), { flyTo: false }); }
}
document.getElementById("fsApply").addEventListener("click", fsAnwenden);
document.getElementById("fsReset").addEventListener("click", fsUmgZuruecksetzen);
document.getElementById("fsResetStart").addEventListener("click", fsStartZuruecksetzen);
document.getElementById("fsRows").addEventListener("keydown", e => {
  if ((e.key === " " || e.key === "Enter") && e.target.closest("[data-fscat]")) { e.preventDefault(); e.target.closest("[data-fscat]").click(); }
});
document.getElementById("mapFilterBtn").addEventListener("click", e => { e.stopPropagation(); mapTogglePop("mapFilterSheet"); });
document.getElementById("umgFilterBtn").addEventListener("click", e => { e.stopPropagation(); mapTogglePop("umgFilterSheet"); });
document.getElementById("mapLayerBtn").addEventListener("click", e => { e.stopPropagation(); mapTogglePop("mapLayerPop"); });
document.addEventListener("click", e => {
  if (e.target.closest("[data-mapclose]")) { mapTogglePop(null); return; }
  if (e.target.closest("#mapLayerPop .mini-style-btn")) { setTimeout(() => mapTogglePop(null), 150); return; }
  if (!e.target.closest("#mapFilterSheet, #umgFilterSheet, #mapLayerPop, #mapFilterBtn, #umgFilterBtn, #mapLayerBtn")) mapTogglePop(null);
});
document.addEventListener("click", e => { if (e.target.closest("[data-listefilter]")) filterAusListe(); });
// Aus der Liste: zur Karte springen und das Filter-Feld oeffnen
async function filterAusListe() {
  await switchToMapView();
  document.getElementById("mapView").scrollIntoView({ behavior: "smooth", block: "start" });
  mapTogglePop("mapFilterSheet");
}

updateHero(null);

// Erster Start (kein GPS, keine letzte Region): klarer, einladender Einstieg statt leerer Fläche
function renderFirstRun() {
  const out = document.getElementById("flyResults");
  if (!out) return;
  out.innerHTML = `
    <div class="firstrun">
      <div class="fr-ico"><img src="icons/logo-glider.png" alt=""></div>
      <div class="fr-title">Wo kannst du heute fliegen?</div>
      <div class="fr-sub">Ein Tipp – und du siehst die fliegbaren Startplätze in deiner Nähe.</div>
      <button type="button" class="fr-gps" id="frGps">📍 Meinen Standort verwenden</button>
      <div class="fr-or">oder oben einen <b>Ort</b> suchen</div>
    </div>`;
  const b = document.getElementById("frGps");
  if (b) b.addEventListener("click", startGpsSearch);
}
// Gleicher Einstiegs-Hinweis als Overlay über der Kartenansicht (jetzt Standardansicht) - für neue
// Nutzer ohne Standort/Region. Eigene Button-ID (frGpsMap), da renderFirstRun() gleichzeitig die
// (nur versteckte, aber weiterhin im DOM vorhandene) Liste mit derselben Struktur befüllt.
function renderFirstRunMap() {
  const out = document.getElementById("mapFirstRun");
  if (!out) return;
  out.hidden = false;
  out.innerHTML = `
    <div class="firstrun">
      <div class="fr-ico"><img src="icons/logo-glider.png" alt=""></div>
      <div class="fr-title">Wo kannst du heute fliegen?</div>
      <div class="fr-sub">Ein Tipp – und du siehst die fliegbaren Startplätze in deiner Nähe.</div>
      <button type="button" class="fr-gps" id="frGpsMap">📍 Meinen Standort verwenden</button>
      <div class="fr-or">oder oben einen <b>Ort</b> suchen</div>
    </div>`;
  const b = document.getElementById("frGpsMap");
  if (b) b.addEventListener("click", startGpsSearch);
}

// Standort per GPS (Button + Auto-Start)
function startGpsSearch() {
  const out = document.getElementById("flyResults"), btn = document.getElementById("gpsBtn");
  if (!navigator.geolocation) { out.innerHTML = `<p class="empty">Standort nicht unterstützt – nutze die Suche.</p>`; return; }
  if (btn) btn.classList.add("busy"); out.innerHTML = ladeHtml("Standort wird ermittelt …");
  navigator.geolocation.getCurrentPosition(async pos => {
    localStorage.setItem("flugwetter_geo_ok", "1");   // ab jetzt beim Öffnen automatisch
    setUserPos(pos.coords.latitude, pos.coords.longitude);
    await runFlySearch(pos.coords.latitude, pos.coords.longitude, null);
    if (btn) btn.classList.remove("busy");
  }, () => {
    if (btn) btn.classList.remove("busy");
    out.innerHTML = `<p class="empty">Standort nicht verfügbar (Berechtigung?). Nutze die Suche oben.</p>`;
  });
}
document.getElementById("gpsBtn").addEventListener("click", startGpsSearch);

// Leert Liste UND Karte bei einer Suche ohne Treffer - sonst bleiben in der (ggf. gerade
// unsichtbaren) Kartenansicht alte Marker einer früheren Suche stehen, ohne Hinweis auf 0 Treffer.
function clearSearchResults(message) {
  document.getElementById("flyResults").innerHTML = `<p class="empty">${message}</p>`;
  lastRows = []; lastHeadline = ""; lastTruncated = false;
  updateMapMarkers([], { flyTo: false });
}

// PLZ-Suche
async function plzSearch() {
  const inp = document.getElementById("plzInput"), out = document.getElementById("flyResults");
  const plz = inp.value.trim();
  if (!/^\d{5}$/.test(plz)) return;
  out.innerHTML = ladeHtml(`Suche PLZ ${plz} …`);
  try { const o = await geocodePlz(plz); await runFlySearch(o.lat, o.lon, o.label); }
  catch { clearSearchResults(`PLZ ${plz} nicht gefunden.`); }
}

// Startplatz-Namenssuche (wenn Text statt PLZ eingegeben wird). opts.allowGeocode: wenn kein
// eigener Startplatz passt, zusätzlich einen allgemeinen Ort/See/Berg per Nominatim versuchen
// (nur bei Enter/Blur gesetzt, nie beim Tippen - s. handleSearchInput weiter unten).
async function runNameSearch(q, opts = {}) {
  const ql = q.trim().toLowerCase();
  if (ql.length < 2) return;
  umgKarteZu();
  routeAufraeumen();
  searchFocus = null;
  const matches = allKnownSpots()
    .filter(s => (s.name + " " + (s.region || "")).toLowerCase().includes(ql))
    .map(s => { const d = lastOrigin ? haversine(lastOrigin.lat, lastOrigin.lon, s.lat, s.lon) : null; return { ...s, dist: d, sortKey: d ?? 0 }; })
    .slice(0, 40);
  if (matches.length) {
    rerunSearch = () => runNameSearch(q, opts);
    await renderSearch(matches, lastOrigin, `Suche „${q}“`);
    return;
  }
  if (opts.allowGeocode) { await tryForwardGeocode(q); return; }
  clearSearchResults(`Kein Startplatz „${q}“ gefunden.`);
}
// Fallback fuer die Namenssuche: kein eigener Startplatz gefunden -> allgemeinen Ort/See/Berg
// per Nominatim suchen, Karte dorthin oeffnen und wie eine Umkreissuche von dort aus behandeln.
async function tryForwardGeocode(q) {
  document.getElementById("flyResults").innerHTML = ladeHtml(`Suche Ort „${escHtml(q)}“ …`);
  const hit = await forwardGeocode(q);
  if (!hit) { clearSearchResults(`Kein Startplatz und kein Ort „${q}“ gefunden.`); return; }
  await switchToMapView();
  await runFlySearch(hit.lat, hit.lon, escHtml(q), { focus: { type: "place", lat: hit.lat, lon: hit.lon, name: q } });
}

// Kombiniertes Suchfeld: 5 Ziffern → PLZ, sonst Startplatzname (entprellt). Der Orts-Fallback
// (Nominatim) laeuft NIE im Tipp-Debounce, nur bei Enter/Verlassen des Feldes - sonst wuerde
// jeder Tastenanschlag ohne DB-Treffer einen Netz-Request ausloesen (Nominatim: max. 1/Sek.).
let nameSearchTimer;
function handleSearchInput(v) {
  clearTimeout(nameSearchTimer);
  v = v.trim();
  if (/^\d{5}$/.test(v)) { plzSearch(); return; }
  if (v.length >= 2 && !/^\d+$/.test(v)) nameSearchTimer = setTimeout(() => runNameSearch(v), 350);
}
// Bestaetigen per Enter oder Pfeil-Knopf. Danach Feld verlassen, damit die Handy-Tastatur
// zugeht und die Treffer sichtbar sind. lastSubmitted verhindert, dass der folgende blur
// dieselbe Suche (inkl. Nominatim-Abfrage) gleich nochmal startet.
let lastSubmitted = null;
function submitSearch() {
  const inp = document.getElementById("plzInput"), v = inp.value.trim();
  clearTimeout(nameSearchTimer);
  hideSuggest();
  if (/^\d{5}$/.test(v)) plzSearch(); else if (v.length >= 2) runNameSearch(v, { allowGeocode: true }); else return;
  lastSubmitted = v;
  inp.blur();
}
function syncSearchGo() {
  document.getElementById("searchGo").hidden = !document.getElementById("plzInput").value.trim();
}
// ---- Vorschlaege beim Tippen (rein lokal aus der Startplatz-DB, kein Netz) ----
// Umlaute/Akzente egal: "jochel" findet "Jöchelspitze", "zuerich" aber nicht "Zürich" (bewusst simpel).
const foldText = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
let suggestItems = [], suggestActive = -1;
// Rang: Name beginnt mit Eingabe < ein Wort im Namen beginnt damit < Name enthaelt sie < nur Ort passt.
function suggestSpots(q) {
  const f = foldText(q);
  const hits = [];
  for (const s of allKnownSpots()) {
    const n = foldText(s.name);
    let rank = n.startsWith(f) ? 0 : n.split(/[\s\-(/]+/).some(w => w.startsWith(f)) ? 1 : n.includes(f) ? 2 : -1;
    if (rank < 0 && foldText(`${s.region} ${s.gemeinde || ""}`).includes(f)) rank = 3;
    if (rank >= 0) hits.push({ s, rank, d: lastOrigin ? haversine(lastOrigin.lat, lastOrigin.lon, s.lat, s.lon) : null });
  }
  hits.sort((a, b) => a.rank - b.rank || (a.d ?? 0) - (b.d ?? 0) || a.s.name.localeCompare(b.s.name, "de"));
  return hits.slice(0, 6);
}
// Treffer im Namen fett - nur wenn er ohne Umlaut-Faltung auffindbar ist, sonst Name schlicht.
function markMatch(name, q) {
  const i = name.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return escHtml(name);
  return escHtml(name.slice(0, i)) + "<b>" + escHtml(name.slice(i, i + q.length)) + "</b>" + escHtml(name.slice(i + q.length));
}
function hideSuggest() {
  const box = document.getElementById("searchSuggest");
  box.hidden = true; box.innerHTML = ""; suggestItems = []; suggestActive = -1;
  document.getElementById("plzInput").setAttribute("aria-expanded", "false");
}
// ---- Orte (See, Berg, Stadt, Region) per Photon (komoot, OSM-Daten) ----
// Nominatim verbietet Autocomplete in seiner Nutzungsrichtlinie, Photon ist dafuer gebaut.
// Entprellt, je Suchbegriff gecacht, auf den Alpenraum + Nachbarn begrenzt (wo die DB Plaetze hat).
const PLACE_BBOX = "-5,41,19,55.5";   // lon/lat: Frankreich bis Oesterreich, Italien bis Nordsee
const PLACE_TYPES = { lake: "See", reservoir: "Stausee", water: "Gewässer", peak: "Berg", mountain_range: "Gebirge",
  ridge: "Bergrücken", volcano: "Berg", valley: "Tal", city: "Stadt", town: "Ort", village: "Ort", hamlet: "Ort",
  suburb: "Stadtteil", state: "Bundesland", region: "Region", county: "Landkreis", island: "Insel", country: "Land" };
const placeCache = new Map();
let placeTimer = null, placeSeq = 0, suggestPlaces = [];
async function fetchPlaces(q) {
  const key = foldText(q);
  if (placeCache.has(key)) return placeCache.get(key);
  const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=de&bbox=${PLACE_BBOX}`);
  if (!res.ok) throw new Error("photon " + res.status);
  const j = await res.json();
  const seen = new Set(), out = [];
  for (const f of j.features || []) {
    const pr = f.properties || {}, [lon, lat] = f.geometry?.coordinates || [];
    if (!pr.name || lat == null) continue;
    // Strassen, Haltestellen, Laeden usw. raus - gesucht sind Gebiete und Landmarken.
    if (["highway", "railway", "shop", "amenity", "building", "office", "public_transport"].includes(pr.osm_key)) continue;
    const where = [pr.state, pr.countrycode && pr.countrycode !== "DE" ? pr.country : ""].filter(Boolean).join(", ");
    const id = pr.name + "|" + where;
    if (seen.has(id)) continue; seen.add(id);
    out.push({ name: pr.name, lat, lon, kind: PLACE_TYPES[pr.osm_value] || PLACE_TYPES[pr.type] || "", where });
    if (out.length >= 4) break;
  }
  placeCache.set(key, out);
  return out;
}
function schedulePlaces(v) {
  clearTimeout(placeTimer);
  const seq = ++placeSeq;
  placeTimer = setTimeout(async () => {
    let places = [];
    try { places = await fetchPlaces(v); } catch { return; }   // offline/Dienst weg: einfach nur Startplaetze
    // Nur anzeigen, wenn noch dasselbe im Feld steht und die Liste offen ist.
    if (seq !== placeSeq || document.getElementById("searchSuggest").hidden) return;
    suggestPlaces = places;
    drawSuggest(v);
  }, 300);
}

let suggestSpotHits = [];
function renderSuggest(v) {
  v = v.trim();
  if (v.length < 2 || /^\d+$/.test(v)) { hideSuggest(); clearTimeout(placeTimer); placeSeq++; return; }
  suggestSpotHits = suggestSpots(v).slice(0, 5);
  suggestPlaces = placeCache.get(foldText(v)) || [];
  drawSuggest(v);
  if (v.length >= 3 && !placeCache.has(foldText(v))) schedulePlaces(v);
}
function drawSuggest(v) {
  // Mit Orten nur 3 Startplaetze - sonst rutschen die Orte am Handy unter die Tastatur.
  // Der Rest steckt in "Alle Treffer".
  const places = suggestPlaces, hits = places.length ? suggestSpotHits.slice(0, 3) : suggestSpotHits;
  suggestItems = [
    ...hits.map(h => ({ type: "spot", id: h.s.id, name: h.s.name })),
    ...places.map(pl => ({ type: "place", ...pl })),
    { type: "all" },
  ];
  suggestActive = -1;
  const icGlider = `<img src="icons/logo-glider.png" alt="">`;   // unser Gleitschirm-Logo = Startplatz
  const icPin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>`;
  const icFind = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
  const opt = (i, ic, name, sub, cls = "") => `<button type="button" class="sg-opt ${cls}" role="option" data-i="${i}">
      <span class="sg-ic">${ic}</span>
      <span class="sg-txt"><span class="sg-name">${name}</span>${sub ? `<span class="sg-sub">${escHtml(sub)}</span>` : ""}</span></button>`;
  let i = 0, html = "";
  if (hits.length) html += `<div class="sg-head">Startplätze</div>`;
  for (const h of hits) {
    const s = h.s;
    const sub = [s.region, s.sectorLabel ? `Start ${s.sectorLabel.replace(/ · /g, ", ")}` : "", s.elevation != null ? `${s.elevation} m` : "", h.d != null ? `${Math.round(h.d)} km` : ""].filter(Boolean).join(" · ");
    html += opt(i++, icGlider, markMatch(s.name, v), sub);
  }
  if (places.length) html += `<div class="sg-head">Orte &amp; Gebiete – Startplätze im Umkreis</div>`;
  for (const pl of places) html += opt(i++, icPin, markMatch(pl.name, v), [pl.kind, pl.where].filter(Boolean).join(" · "), "sg-place");
  const allLbl = hits.length ? `Alle Treffer für „${escHtml(v)}“` : `Ort „${escHtml(v)}“ suchen`;
  html += opt(i, icFind, allLbl, "", "sg-all");
  const box = document.getElementById("searchSuggest");
  box.innerHTML = html;
  box.hidden = false;
  document.getElementById("plzInput").setAttribute("aria-expanded", "true");
}
async function pickSuggest(i) {
  const it = suggestItems[i]; if (!it) return;
  const inp = document.getElementById("plzInput");
  hideSuggest();
  if (it.type === "all") { submitSearch(); return; }
  clearTimeout(nameSearchTimer); clearTimeout(placeTimer); placeSeq++;
  inp.value = it.name; syncSearchGo();
  lastSubmitted = it.name;   // blur danach soll keine zweite Suche starten
  inp.blur();
  // Karte dorthin, Startplaetze im eingestellten Umkreis wie bei der PLZ-Suche. Das Ziel
  // selbst pulsiert: Startplatz-Icon bzw. gruener Punkt beim Ort. Detail per Tipp aufs Icon.
  await switchToMapView();
  if (it.type === "spot") {
    const sp = getSpot(it.id); if (!sp) return;
    await runFlySearch(sp.lat, sp.lon, escHtml(sp.name), { focus: { type: "spot", id: sp.id, lat: sp.lat, lon: sp.lon, name: sp.name } });
  } else {
    await runFlySearch(it.lat, it.lon, escHtml(it.name), { focus: { type: "place", lat: it.lat, lon: it.lon, name: it.name } });
  }
  // Die Karte liegt am Handy unterhalb des Suchfelds - hinscrollen, sonst sieht man den Puls nicht.
  document.getElementById("mapView").scrollIntoView({ behavior: "smooth", block: "start" });
}
function moveSuggest(step) {
  if (!suggestItems.length) return;
  // Zustaende -1 (im Feld) .. n-1, im Kreis - nach dem letzten Eintrag geht's zurueck ins Feld.
  const n = suggestItems.length + 1;
  suggestActive = ((suggestActive + 1 + step) % n + n) % n - 1;
  document.querySelectorAll("#searchSuggest .sg-opt").forEach((b, k) => b.classList.toggle("on", k === suggestActive));
}
const sgBox = document.getElementById("searchSuggest");
// pointerdown ohne Fokuswechsel - sonst feuert vor dem click der blur des Feldes (Suche + Liste zu).
sgBox.addEventListener("pointerdown", e => e.preventDefault());
sgBox.addEventListener("click", e => { const b = e.target.closest(".sg-opt"); if (b) pickSuggest(+b.dataset.i); });

document.getElementById("plzInput").addEventListener("input", e => { lastSubmitted = null; syncSearchGo(); renderSuggest(e.target.value); handleSearchInput(e.target.value); });
document.getElementById("plzInput").addEventListener("focus", e => renderSuggest(e.target.value));
document.getElementById("plzInput").addEventListener("keydown", e => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    if (document.getElementById("searchSuggest").hidden) return;
    e.preventDefault(); moveSuggest(e.key === "ArrowDown" ? 1 : -1); return;
  }
  if (e.key === "Escape") { hideSuggest(); return; }
  if (e.key !== "Enter") return;
  e.preventDefault();
  if (suggestActive >= 0) { pickSuggest(suggestActive); return; }
  hideSuggest();
  submitSearch();
});
// pointerdown ohne Fokuswechsel: sonst feuert erst blur (Suche) und dann click (Suche nochmal).
document.getElementById("searchGo").addEventListener("pointerdown", e => e.preventDefault());
document.getElementById("searchGo").addEventListener("click", submitSearch);
document.getElementById("plzInput").addEventListener("blur", () => {
  hideSuggest();
  const v = document.getElementById("plzInput").value.trim();
  if (v === lastSubmitted) return;
  if (v.length >= 2 && !/^\d{5}$/.test(v) && !/^\d+$/.test(v)) runNameSearch(v, { allowGeocode: true });
});

function mapsUrl(s) {
  return `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=driving`;
}
// Kategorie-Illustration (dezente Postkarten-Grafik, kein echtes Foto des Orts – haben wir nicht).
// Zuordnung nach Höhe: Alpen / Mittelgebirge / Hügelland; Bild-Index deterministisch aus dem Namen.
function sceneImgFor(name, elevation) {
  const cat = (elevation != null && elevation >= 1500) ? "alpen" : (elevation == null || elevation >= 700) ? "mittel" : "huegel";
  let h = 0; const n = name || "";
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  const idx = (h % 10) + 1;
  return { cat, img: `img/cat-${cat}-${idx}.jpg` };
}
function spotScene(spot, status) {
  if (status === "nein") return { cat: "nein", img: "img/cat-nein.jpg" };  // Schlechtwetter-Motiv
  return sceneImgFor(spot.name, spot.elevation);
}

// Große Hero-Überschrift mit Live-Zähler ("Heute kannst du 13 Startplätze fliegen.")
function updateHero(flyable) {
  const el = document.getElementById("heroTitle");
  if (!el) return;
  const w = searchDay === 1 ? "Morgen" : "Heute";
  let l1, mid, l3;
  if (flyable == null) { l1 = "Wo kannst du"; mid = w.toLowerCase(); l3 = "fliegen?"; }
  else { const word = flyable === 1 ? "Startplatz" : "Startplätzen"; l1 = `${w} kannst du an`; mid = `${flyable} ${word}`; l3 = "fliegen."; }
  el.innerHTML = `<span class="ht-l">${l1}</span><span class="hl">${mid}</span> <span class="ht-l">${l3}</span>`;
}

// Zeitabhängige Begrüßung
function timeGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Gute Nacht 🌙";
  if (h < 11) return "Guten Morgen ☀️";
  if (h < 14) return "Guten Mittag 🌤️";
  if (h < 18) return "Schönen Nachmittag 🪂";
  if (h < 22) return "Guten Abend 🌆";
  return "Gute Nacht 🌙";
}
// Abend/Nacht: heute wird's kaum noch was -> auf morgen früh schubsen
function isEvening() { const h = new Date().getHours(); return h >= 20 || h < 5; }

function updateGreeting() {
  const g = document.getElementById("heroGreet");
  if (g) {
    const t = timeGreeting(), vorname = (profil.name || "").trim().split(/\s+/)[0], i = t.lastIndexOf(" ");
    g.textContent = vorname ? `${t.slice(0, i)}, ${vorname}${t.slice(i)}` : t;
  }
  const hint = document.getElementById("eveningHint");
  if (!hint) return;
  if (isEvening() && searchDay === 0 && sessionStorage.getItem("eveDismissed") !== "1") {
    hint.innerHTML =
      `<span class="eve-txt">🌙 Heute wird's kaum noch was – wie sieht's morgen früh aus?</span>` +
      `<button type="button" id="eveToMorgen" class="eve-btn">Morgen ansehen →</button>` +
      `<button type="button" id="eveClose" class="eve-x" title="Ausblenden" aria-label="Ausblenden">✕</button>`;
    hint.hidden = false;
    document.getElementById("eveToMorgen").addEventListener("click", () => {
      const b = document.querySelector('#dayToggle [data-day="1"]');
      if (b) b.click();               // schaltet auf „Morgen" + rechnet neu
      hint.hidden = true;
    });
    document.getElementById("eveClose").addEventListener("click", () => {
      sessionStorage.setItem("eveDismissed", "1"); hint.hidden = true;
    });
  } else {
    hint.hidden = true;
  }
}

// "Nur Favoriten" + Zustieg sind reine Anzeige-Filter auf den schon geholten Ergebnissen -
// von Liste UND Karte gemeinsam genutzt, damit beide Ansichten immer dieselben Plaetze zeigen.
function displayRowsFor(rows) {
  let displayRows = favOnlyFilter ? rows.filter(r => isFav(r.spot.id)) : rows;
  if (accFilter !== "all") displayRows = displayRows.filter(r => accMatch(r.spot, accFilter));
  if (minHoehendiff > 0) displayRows = displayRows.filter(r => hdMatch(r.spot, minHoehendiff));
  return displayRows;
}
// Eine Ergebnis-/Favoriten-Zeile (Foto-Szene, Name, Meta, Navi, Stern, Zeitfenster) - gemeinsam
// genutzt von der Fliegen-Liste UND den Favoriten, damit beide gleich aussehen und sich gleich verhalten.
function spotRowHtml(spot, ts, subInfo) {
  const s = spot, fav = isFav(s.id);
  const timeSlot = ts.status === "nein"
    ? `<span class="sc-nore">${ts.reasonText}</span>`
    : ts.past
      ? `<span class="sc-time ${ts.status}">War früh fliegbar</span>`
      : `<span class="sc-time ${ts.status}">${winTimeShort(ts.win)}</span>`;
  const windSlot = ts.status === "nein" ? "" : `<div class="sc-wind">${ts.status === "gut" && ts.type ? ts.type.label : ts.reasonLabel}</div>`;
  const scene = spotScene(s, ts.status);
  return `
    <div class="spot-card ${ts.status} sc-${scene.cat}" data-spot="${s.id}">
      <div class="sc-scene" style="background-image:url(${scene.img})"></div>
      <span class="sc-dot"></span>
      <div class="sc-main">
        <div class="sc-name">${s.name}</div>
        <div class="sc-meta">${subInfo || ""}</div>
        ${(() => { const w = diffWarn(s); return w ? `<div class="sc-warn d${w.d}">⚠️ ${w.text}</div>` : ""; })()}
      </div>
      <div class="sc-right">
        <div class="sc-actions">
          <a class="sc-nav" href="${mapsUrl(s)}" target="_blank" rel="noopener" title="Navigation starten" aria-label="Navigation">${NAV_ICON}</a>
          <button class="ic0 star ${fav?"on":""}" data-fav="${s.id}" title="${fav?"Favorit":"Zu Favoriten"}">${fav?"★":"☆"}</button>
        </div>
        ${timeSlot}
        ${windSlot}
      </div>
    </div>`;
}
function renderFlyResults(rows, headline, truncated) {
  const flyableAll = rows.filter(r => r.ts.status !== "nein").length;
  updateHero(flyableAll);
  const favCount = rows.filter(r => isFav(r.spot.id)).length;
  const displayRows = displayRowsFor(rows);
  const flyable = (favOnlyFilter || accFilter !== "all") ? displayRows.filter(r => r.ts.status !== "nein").length : flyableAll;
  const scope = truncated ? `<b>${flyable}</b> fliegbar (nächste ${rows.length} Plätze)` : `<b>${flyable}</b> von ${rows.length} fliegbar`;
  const favBtn = favCount
    ? `<button type="button" class="fav-only-btn${favOnlyFilter ? " on" : ""}" id="favOnlyBtn">⭐ Nur Favoriten${favOnlyFilter ? "" : ` (${favCount})`}</button>`
    : "";
  const nFilter = [favOnlyFilter, accFilter !== "all", minHoehendiff > 0].filter(Boolean).length;
  const filterBtn = `<button type="button" class="liste-filter-btn" data-listefilter>`
    + `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.5 4.5h17a1 1 0 0 1 .78 1.63L14.5 14.6V20a1 1 0 0 1-1.45.9l-2.5-1.25a1 1 0 0 1-.55-.9V14.6L2.72 6.13A1 1 0 0 1 3.5 4.5z"/></svg>`
    + `Filter${nFilter ? ` <span class="lf-cnt">${nFilter}</span>` : ""}</button>`;
  const head = `<div class="fly-head-row"><div class="fly-head">${headline} · ${scope}</div>${filterBtn}</div>${favBtn}`;
  if (!displayRows.length) {
    const reasons = [];
    if (accFilter !== "all") reasons.push(`„${accLabel(accFilter)}"`);
    if (minHoehendiff > 0) reasons.push(`Höhendifferenz ≥ ${minHoehendiff} m`);
    const msg = reasons.length
      ? `Kein Startplatz mit ${reasons.join(" und ")} unter den nächsten ${rows.length} Plätzen. Filter anpassen oder Umkreis vergrößern.`
      : "Keine Favoriten in dieser Suche.";
    document.getElementById("flyResults").innerHTML = head + `<p class="empty">${msg}</p>`;
    return;
  }
  const list = displayRows.map(r => spotRowHtml(r.spot, r.ts, r.subInfo)).join("");
  const listHtml = displayRows.length ? `<div class="sc-list">${list}</div>` : `<p class="empty">Keine Favoriten in dieser Suche.</p>`;
  document.getElementById("flyResults").innerHTML = head + listHtml;
}

// ---------------- Detail-Fenster: 7-Tage-Vorhersage ----------------
let currentDetailSpot = null;
let detailHistoryPushed = false; // Handy-/TWA-Zurück soll das Detail-Fenster schliessen statt die App zu verlassen
// Kleine Ladeanzeige (derselbe Ring mit Gleitschirm wie beim Oeffnen eines Startplatzes)
// fuer Liste/Suche auf der Startseite und den Wetter-Verlauf. text ist bereits HTML-sicher.
function ladeHtml(text) {
  return `<div class="detail-loader klein" role="status" aria-live="polite">
      <div class="dl-ring"><span class="dl-spin"></span><img src="icons/logo-glider.png" alt=""></div>
      <div class="dl-sub">${text}</div>
    </div>`;
}
// Die Ladeansicht (Ring mit Gleitschirm) bleibt mindestens so lange stehen - Marks Wunsch,
// auch wenn die Vorhersage aus dem Zwischenspeicher sofort da ist.
const DETAIL_LADE_MIN_MS = 2000;
async function openDetail(id) {
  const spot = getSpot(id); if (!spot) return;
  const ladeStart = Date.now();
  // Erst nach der Mindestzeit fuellen - und nur, wenn noch derselbe Platz offen ist
  // (inzwischen geschlossen oder anderen Platz geoeffnet -> nichts ueberschreiben).
  const nachMindestzeit = async () => {
    const rest = DETAIL_LADE_MIN_MS - (Date.now() - ladeStart);
    if (rest > 0) await new Promise(r => setTimeout(r, rest));
    return currentDetailSpot === spot && !document.getElementById("detailModal").hidden;
  };
  currentDetailSpot = spot;
  const modal = document.getElementById("detailModal"), body = document.getElementById("detailBody");
  modal.hidden = false;
  if (!detailHistoryPushed) {
    history.pushState({ detailOpen: true }, "", location.href);
    detailHistoryPushed = true;
  }
  // Ladeansicht: drehender Ring in der App-Farbe, darin unser Gleitschirm
  body.innerHTML = `<div class="detail-loader" role="status" aria-live="polite">
      <div class="dl-ring"><span class="dl-spin"></span><img src="icons/logo-glider.png" alt=""></div>
      <div class="dl-name">${escHtml(spot.name)}</div>
      <div class="dl-sub">Vorhersage wird geladen …</div>
    </div>`;
  try {
    const [data, stations] = await Promise.all([fetchForecast(spot), fetchPiou()]);
    const live = liveWind(spot, stations);
    let driveSec = null;
    if (lastOrigin) {
      try { const d = await fetchDriveTimes(lastOrigin, [spot]); if (d[0] != null) driveSec = d[0]; } catch {}
    }
    if (!(await nachMindestzeit())) return;
    body.innerHTML = renderCard(spot, analyse(spot, data), { dayIdx: searchDay, live, driveSec });
  } catch (e) {
    if (!(await nachMindestzeit())) return;
    body.innerHTML = `<div class="card">Fehler: ${escHtml(e.message)}</div>`;
  }
}
// Das Profil oeffnet ausschliesslich durch Antippen einer Stunde - und laedt auch erst
// dann. Wer nur die Ampel sehen will, loest keine Abfrage aus. Immer nur ein Diagramm
// offen, sonst waere die Tagesliste nicht mehr ueberschaubar.
let wpDaten = null, wpSpot = null, wpLaeuft = null;
function wpSchliesseAndere(behalten) {
  document.querySelectorAll(".wp-inline").forEach(el => {
    if (el !== behalten) { el.hidden = true; el.innerHTML = ""; }
  });
}
function wpZeichne(dayEl, iso, label) {
  const box = dayEl && dayEl.querySelector(".wp-inline");
  if (!box || !wpDaten || !wpSpot) return;
  const prof = windProfilStunde(wpDaten, iso);
  // Vergangene Tage (Wetter-Verlauf) stehen nicht in der Vorhersage - dann gar nichts zeigen
  if (!prof) { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  box.innerHTML = windProfilSvg(wpSpot, prof, label);
}
async function wpAntippen(dayEl, iso, label) {
  const spot = currentDetailSpot;
  const box = dayEl && dayEl.querySelector(".wp-inline");
  if (!spot || !box) return;
  wpSchliesseAndere(box);
  if (wpSpot !== spot) { wpDaten = null; wpLaeuft = null; wpSpot = spot; }
  if (!wpDaten) {
    box.hidden = false;
    box.innerHTML = `<p class="wp-note">Lade Höhenwinde …</p>`;
    try {
      // Mehrfaches Antippen waehrend des Ladens soll nicht mehrfach abfragen
      wpLaeuft = wpLaeuft || fetchWindProfil(spot);
      const daten = await wpLaeuft;
      if (currentDetailSpot !== spot) return;   // inzwischen geschlossen oder gewechselt
      wpDaten = daten;
    } catch (e) {
      wpLaeuft = null;
      box.innerHTML = `<p class="wp-note">Höhenwinde nicht abrufbar (${escHtml(e.message)}).</p>`;
      return;
    }
  }
  wpZeichne(dayEl, iso, label);
}
function closeDetail(fromPopstate = false) {
  document.getElementById("detailModal").hidden = true;
  document.getElementById("detailBody").innerHTML = "";
  restoreMapView();
  currentDetailSpot = null;
  if (detailHistoryPushed) {
    detailHistoryPushed = false;
    if (!fromPopstate) history.back(); // legt den gepushten Eintrag wieder ab, damit "Zurück" danach nicht ins Leere laeuft
  }
}
document.getElementById("detailModal").addEventListener("click", e => { if (e.target.id === "detailModal") closeDetail(); });

// ---------------- Feedback ----------------
const FB_MAIL = "goflytoday.app@gmail.com";
const fbModal = document.getElementById("feedbackModal");
let fbHistoryPushed = false; // Handy-/TWA-Zurück soll das Fenster schliessen statt die App zu verlassen
function fbOpen() {
  fbModal.hidden = false;
  document.getElementById("fbText").focus();
  if (!fbHistoryPushed) { history.pushState({ fbOpen: true }, "", location.href); fbHistoryPushed = true; }
}
function fbClose(fromPopstate = false) {
  fbModal.hidden = true;
  if (fbHistoryPushed) { fbHistoryPushed = false; if (!fromPopstate) history.back(); }
}
document.getElementById("feedbackBtn").addEventListener("click", fbOpen);
document.getElementById("feedbackClose").addEventListener("click", () => fbClose());
document.getElementById("fbCancel").addEventListener("click", () => fbClose());
fbModal.addEventListener("click", e => { if (e.target === fbModal) fbClose(); });
document.querySelectorAll(".fb-cat").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".fb-cat").forEach(x => x.classList.toggle("on", x === b));
}));
document.getElementById("fbSend").addEventListener("click", () => {
  const cat = document.querySelector(".fb-cat.on")?.dataset.cat || "Feedback";
  const ta = document.getElementById("fbText");
  const text = ta.value.trim();
  if (!text) { ta.focus(); return; }
  const subject = `GoFlyToday Feedback: ${cat}`;
  const body = `${text}\n\n—\nGesendet aus GoFlyToday`;
  window.location.href = `mailto:${FB_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  ta.value = ""; fbClose();
});

// ---------------- Einstellungen ----------------
const settingsModal = document.getElementById("settingsModal");
let settingsHistoryPushed = false; // Handy-/TWA-Zurück soll das Fenster schliessen statt die App zu verlassen
function openSettings() {
  const v = document.querySelector(".build")?.textContent.match(/Version\s+(\S+)/);
  document.getElementById("settingsVersion").textContent = v ? v[1] : "";
  settingsModal.hidden = false;
  if (!settingsHistoryPushed) { history.pushState({ settingsOpen: true }, "", location.href); settingsHistoryPushed = true; }
}
function closeSettings(fromPopstate = false) {
  settingsModal.hidden = true;
  if (settingsHistoryPushed) { settingsHistoryPushed = false; if (!fromPopstate) history.back(); }
}
document.getElementById("settingsClose").addEventListener("click", () => closeSettings());
settingsModal.addEventListener("click", e => { if (e.target === settingsModal) closeSettings(); });

// ---------------- Mein Profil ----------------
// Alles nur auf diesem Geraet (localStorage). Das Level stellt die Ampel ein (STUFEN), der Rest
// gibt persoenliche Hinweise (profilHinweise), ein Heimatgebiet fuer den Start und den Namen
// in der Begruessung. Reiter: Profil (Ausruestung), Erinnerungen.
const profileModal = document.getElementById("profileModal");
let profileHistoryPushed = false, profilStufeBeimOeffnen = null;
const lsGet = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; } catch { return fb; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const REM_KEY = "flugwetter_erinnerungen", REM_EIGENE_KEY = "flugwetter_rem_eigene", DOK_KEY = "flugwetter_dokumente";
let remData = lsGet(REM_KEY, {});       // { schluessel: { datum, monate } }
let remEigene = lsGet(REM_EIGENE_KEY, []);   // eigene Erinnerungen [{ k, t, monate }] (Datum in remData)
const heuteIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const fmtDatum = iso => iso ? iso.split("-").reverse().join(".") : "";

function speichereProfil() {
  try { localStorage.setItem(PROFIL_KEY, JSON.stringify(profil)); } catch {}
  profilUi();
  updateGreeting();
}
function profilLeer() {
  const sc = profil.schirm || {};
  return !profil.name && !profil.level && !profil.schein && !profil.stunden && !profil.seit && !profil.home
    && !(profil.arten && profil.arten.length) && !(sc.hersteller || sc.modell || sc.en || sc.gewicht || sc.baujahr);
}

// --- kleine Illustrationen (statt Fotos, solange keins gewaehlt ist) ---
const ILL = {
  schirm: `<img src="img/gear/schirm.webp" alt="">`,
  gurt: `<img src="img/gear/gurt.webp" alt="">`,
  retter: `<img src="img/gear/retter.webp" alt="">`,
  karabiner: `<img src="img/gear/karabiner.webp" alt="">`,
  schild: `<svg viewBox="0 0 64 64"><path d="M32 8 12 16v14c0 14 8 22 20 26 12-4 20-12 20-26V16z" fill="#22c55e"/><path d="m22 32 7 7 14-15" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  dhv: `<svg viewBox="0 0 64 64"><defs><linearGradient id="gD" x1="0" x2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs><rect x="8" y="14" width="48" height="36" rx="6" fill="#0f1b2a" stroke="url(#gD)" stroke-width="3"/><path d="M16 32c3-9 17-9 20 0-7-3-13-3-20 0z" fill="url(#gD)"/><path d="M18 33l9 8M34 33l-7 8" stroke="#cbd5e1" stroke-width="1"/><path d="M40 24h10M40 31h10M40 38h7" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  glocke: `<svg viewBox="0 0 64 64"><path d="M32 10c-10 0-16 8-16 18 0 10-4 12-6 16h44c-2-4-6-6-6-16 0-10-6-18-16-18z" fill="#f59e0b"/><circle cx="32" cy="52" r="5" fill="#fbbf24"/></svg>`,
};

// --- Ausruestung: Schirm, Gurtzeug, Retter ---
const GEAR = [
  { k: "schirm", t: "Mein Schirm", leer: "Schirm eintragen", ill: "schirm", felder: [["hersteller", "Hersteller", "text", "z. B. Ozone"], ["modell", "Modell", "text", "z. B. Rush 5"], ["gewicht", "Startgewicht (kg)", "number", "inkl. Ausrüstung"], ["baujahr", "Baujahr", "number", "Jahr"]], en: true },
  { k: "gurt", t: "Mein Gurtzeug", leer: "Gurtzeug eintragen", ill: "gurt", felder: [["modell", "Modell", "text", "z. B. Wani Light 3"], ["typ", "Art", "text", "z. B. Wendegurtzeug"], ["groesse", "Größe", "text", "z. B. M"], ["baujahr", "Baujahr", "number", "Jahr"]] },
  { k: "retter", t: "Mein Retter", leer: "Retter eintragen", ill: "retter", felder: [["modell", "Modell", "text", "z. B. Beamer 3"], ["groesse", "Größe / Gewichtsbereich", "text", "z. B. 85–105 kg"], ["baujahr", "Baujahr", "number", "Jahr"]] },
];
let gearOffen = new Set();
function gearZeilen(g) {
  const d = profil[g.k] || {};
  if (g.k === "schirm") return { titel: [d.hersteller, d.modell].filter(Boolean).join(" "), l1: [d.en ? `EN ${d.en}` : "", d.gewicht ? `${d.gewicht} kg` : ""].filter(Boolean).join(" · "), l2: d.baujahr ? `Baujahr ${d.baujahr}` : "" };
  if (g.k === "gurt") return { titel: d.modell || "", l1: [d.typ, d.groesse ? `Größe ${d.groesse}` : ""].filter(Boolean).join(" · "), l2: d.baujahr ? `Baujahr ${d.baujahr}` : "" };
  const gepackt = remData.rettung && remData.rettung.datum ? `Zuletzt gepackt ${fmtDatum(remData.rettung.datum)}` : "";
  return { titel: d.modell || "", l1: d.groesse || "", l2: [d.baujahr ? `Baujahr ${d.baujahr}` : "", gepackt].filter(Boolean).join(" · ") };
}
function gearFoto(g) { const f = (profil.fotos || {})[g.k]; return f ? `<img src="${f}" alt="">` : ILL[g.ill]; }
function gearTexte(g) {
  const card = document.querySelector(`[data-gear="${g.k}"]`); if (!card) return;
  const z = gearZeilen(g);
  card.querySelector(".gear-title").textContent = z.titel || g.leer;
  card.querySelector(".gear-title").classList.toggle("leer", !z.titel);
  card.querySelector(".gear-l1").textContent = z.l1; card.querySelector(".gear-l2").textContent = z.l2;
}
function gearRender() {
  document.getElementById("pfGear").innerHTML = GEAR.map(g => {
    const d = profil[g.k] || {}, z = gearZeilen(g), offen = gearOffen.has(g.k);
    return `<div class="gear-card${offen ? " editing" : ""}" data-gear="${g.k}">
      <div class="gear-head"><span class="gear-t">${g.t}</span><button type="button" class="pf-outline" data-gearedit="${g.k}">${offen ? "Fertig" : "Bearbeiten"}</button></div>
      <div class="gear-body">
        <button type="button" class="gear-pic" data-pffoto="${g.k}" aria-label="Foto ändern">${gearFoto(g)}</button>
        <div class="gear-txt"><div class="gear-title${z.titel ? "" : " leer"}">${escHtml(z.titel || g.leer)}</div><div class="gear-l1">${escHtml(z.l1)}</div><div class="gear-l2">${escHtml(z.l2)}</div></div>
      </div>
      <div class="gear-edit"${offen ? "" : " hidden"}>
        <div class="pf-row">${g.felder.map(([f, l, typ, ph]) => `<label class="pf-field pf-wide">${l}<input class="pf-input" type="${typ}" ${typ === "number" ? 'inputmode="numeric"' : 'maxlength="30"'} placeholder="${ph}" data-pfg="${g.k}.${f}" value="${escHtml(d[f] == null ? "" : d[f])}"></label>`).join("")}</div>
        ${g.en ? `<div class="pf-label">EN-Klasse</div><div class="acc-seg" role="group" aria-label="EN-Klasse">${["A", "B", "C", "D", "CCC"].map(e => `<button type="button" class="apill${d.en === e ? " on" : ""}" data-pfen="${e}">${e}</button>`).join("")}</div><div class="pf-warn" id="pfEnWarn" hidden></div>` : ""}
        <button type="button" class="pf-btn pf-btn-ghost" data-pffoto="${g.k}">📷 Foto wählen</button>
      </div>
    </div>`;
  }).join("");
  pfEnWarnen();
}
function pfEnWarnen() {
  const w = document.getElementById("pfEnWarn"); if (!w) return;
  const en = (profil.schirm || {}).en, hoch = en === "C" || en === "D" || en === "CCC";
  w.hidden = !(hoch && profil.level === "einsteiger");
  w.textContent = hoch && profil.level === "einsteiger" ? `EN ${en} ist für Einsteiger ungewöhnlich anspruchsvoll – besprich die Schirmwahl mit deinem Fluglehrer.` : "";
}
// Foto: auf 256 px (Quadrat) verkleinern, damit es in localStorage passt
function fotoKlein(file, max = 256) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement("canvas");
      c.width = c.height = Math.min(max, s);
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(); };
    img.src = url;
  });
}
const fotoInput = document.createElement("input");
fotoInput.type = "file"; fotoInput.accept = "image/*"; fotoInput.hidden = true;
profileModal.appendChild(fotoInput);
let fotoArt = "";
fotoInput.addEventListener("change", async () => {
  const f = fotoInput.files[0]; fotoInput.value = "";
  if (!f || !fotoArt) return;
  try { profil.fotos = { ...(profil.fotos || {}), [fotoArt]: await fotoKlein(f) }; speichereProfil(); gearRender(); } catch {}
});

// --- Anzeige ---
function profilUi() {
  const LV = { einsteiger: "Einsteiger", fortgeschritten: "Fortgeschritten", erfahren: "Erfahren" };
  const name = (profil.name || "").trim();
  const av = document.getElementById("pfAvatar"), foto = (profil.fotos || {}).avatar;
  av.innerHTML = foto ? `<img src="${foto}" alt="">` : escHtml(name ? name[0].toUpperCase() : "?");
  const nm = document.getElementById("pfMeName"); nm.textContent = name || "Dein Name"; nm.classList.toggle("leer", !name);
  document.getElementById("pfSub").textContent = LV[profil.level] || "Level noch offen";
  document.getElementById("pfSeitTxt").textContent = profil.seit ? `Fliegt seit ${profil.seit}` : "";
  const chip = document.getElementById("pfScheinChip");
  chip.hidden = !profil.schein; chip.textContent = profil.schein ? (profil.schein.length === 1 ? `${profil.schein}-Schein` : profil.schein) : "";
  document.querySelectorAll("#pfLevel .apill").forEach(b => b.classList.toggle("on", b.dataset.pflevel === profil.level));
  document.querySelectorAll("#pfArten .apill").forEach(b => b.classList.toggle("on", (profil.arten || []).includes(b.dataset.pfart)));
  const st = STUFEN[aktuelleStufe()];
  document.getElementById("pfAmpel").innerHTML = `Deine Ampel: <b>${st.label}</b> – grün bei Wind bis ca. ${Math.round(st.windMax * st.gruen)} km/h und Böen bis ca. ${Math.round(st.gustMax * st.gruen)} km/h.`
    + (profil.level ? "" : " Wähle dein Level, dann passt sich die Ampel an.") + (proMode ? " <b>Eigene Grenzwerte</b> (Sicherheitsprofil unten) sind aktiv." : "");
  document.getElementById("pfHomeAnzeige").innerHTML = profil.home ? `📍 ${escHtml(profil.home.name)}` : `<span class="pf-home-leer">Noch nicht gesetzt</span>`;
  pfEnWarnen();
  GEAR.forEach(gearTexte);
  // Punkt am Knopf: Profil noch leer, oder eine Erinnerung ist bald/ueberfaellig (rot)
  const alarm = remAlarm();
  const dot = document.getElementById("profileDot");
  dot.hidden = !(profilLeer() || alarm.length);
  dot.classList.toggle("rot", alarm.some(x => x.r.st === "rot"));
}
function profilFuellen() {
  const set = (id, v) => { document.getElementById(id).value = v == null ? "" : v; };
  set("pfName", profil.name); set("pfSchein", profil.schein); set("pfStunden", profil.stunden); set("pfSeit", profil.seit);
  set("pfHomeSuche", "");
  gearRender();
  profilUi();
}
function profilOeffnen(tab = "profil") {
  profilFuellen();
  pfTab(tab);
  document.getElementById("pfEditMeBox").hidden = !profilLeer();   // leeres Profil: gleich zum Ausfuellen
  profilStufeBeimOeffnen = aktuelleStufe() + "|" + proMode;
  profileModal.hidden = false;
  profileModal.querySelector(".pf-root").scrollTop = 0;
  if (!profileHistoryPushed) { history.pushState({ profileOpen: true }, "", location.href); profileHistoryPushed = true; }
}
function profilSchliessen(fromPopstate = false) {
  profileModal.hidden = true;
  if (profileHistoryPushed) { profileHistoryPushed = false; if (!fromPopstate) history.back(); }
  // Level geaendert -> Ampel arbeitet mit anderen Grenzen, Ergebnisse neu bewerten
  if (profilStufeBeimOeffnen !== null && profilStufeBeimOeffnen !== aktuelleStufe() + "|" + proMode && rerunSearch) rerunSearch();
  profilStufeBeimOeffnen = null;
}
document.getElementById("profileBtn").addEventListener("click", () => profilOeffnen());
document.getElementById("profileClose").addEventListener("click", () => profilSchliessen());
document.getElementById("pfEditMe").addEventListener("click", () => {
  const box = document.getElementById("pfEditMeBox"); box.hidden = !box.hidden;
  pfTab("profil");
  if (!box.hidden) box.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("pfEditMeOk").addEventListener("click", () => { document.getElementById("pfEditMeBox").hidden = true; });
// Textfelder: beim Tippen speichern
const pfFeld = (id, fn) => document.getElementById(id).addEventListener("input", e => { fn(e.target.value.trim()); speichereProfil(); });
const pfZahl = v => (v === "" || isNaN(+v) ? "" : +v);
pfFeld("pfName", v => { profil.name = v; });
pfFeld("pfSchein", v => { profil.schein = v; });
pfFeld("pfStunden", v => { profil.stunden = pfZahl(v); });
pfFeld("pfSeit", v => { profil.seit = pfZahl(v); });
document.getElementById("pfSchein").addEventListener("change", e => { profil.schein = e.target.value; speichereProfil(); });
profileModal.addEventListener("input", e => {
  const f = e.target.closest("[data-pfg]"); if (!f) return;
  const [k, feld] = f.dataset.pfg.split(".");
  profil[k] = { ...(profil[k] || {}), [feld]: f.type === "number" ? pfZahl(f.value) : f.value.trim() };
  speichereProfil();
});
profileModal.addEventListener("click", e => {
  const lv = e.target.closest("[data-pflevel]");
  if (lv) { profil.level = profil.level === lv.dataset.pflevel ? "" : lv.dataset.pflevel; speichereProfil(); return; }
  const en = e.target.closest("[data-pfen]");
  if (en) { const neu = (profil.schirm || {}).en === en.dataset.pfen ? "" : en.dataset.pfen; profil.schirm = { ...(profil.schirm || {}), en: neu };
    en.parentElement.querySelectorAll(".apill").forEach(b => b.classList.toggle("on", b.dataset.pfen === neu)); speichereProfil(); return; }
  const art = e.target.closest("[data-pfart]");
  if (art) { const a = new Set(profil.arten || []); a.has(art.dataset.pfart) ? a.delete(art.dataset.pfart) : a.add(art.dataset.pfart); profil.arten = [...a]; speichereProfil(); return; }
  const ge = e.target.closest("[data-gearedit]");
  if (ge) { gearOffen.has(ge.dataset.gearedit) ? gearOffen.delete(ge.dataset.gearedit) : gearOffen.add(ge.dataset.gearedit); gearRender(); return; }
  const fo = e.target.closest("[data-pffoto]");
  if (fo) { fotoArt = fo.dataset.pffoto; fotoInput.click(); return; }
});
// Heimatgebiet: dieselbe Suche wie oben (Startplaetze, Orte, PLZ) mit Vorschlaegen, oder aktueller Standort
let pfHomeTimer = null, pfHomeSeq = 0, pfHomeTreffer = [];
function pfHomeSetzen(o) {
  profil.home = { name: o.name, lat: +(+o.lat).toFixed(4), lon: +(+o.lon).toFixed(4) };
  if (o.spotId) profil.home.spotId = o.spotId;
  speichereProfil(); homeMarkerErneuern();
  document.getElementById("pfHomeSuche").value = "";
  document.getElementById("pfHomeSug").hidden = true;
}
function pfHomeZeigen() {
  const sug = document.getElementById("pfHomeSug");
  sug.innerHTML = pfHomeTreffer.map((o, i) => `<button type="button" data-pfhome="${i}">${escHtml(o.name)}<span>${escHtml(o.sub || "")}</span></button>`).join("");
  sug.hidden = !pfHomeTreffer.length;
}
document.getElementById("pfHomeSuche").addEventListener("input", e => {
  const raw = e.target.value.trim(), q = foldText(raw), seq = ++pfHomeSeq;
  clearTimeout(pfHomeTimer);
  if (q.length < 2) { pfHomeTreffer = []; pfHomeZeigen(); return; }
  pfHomeTreffer = allKnownSpots().filter(sp => foldText(sp.name).includes(q) || foldText(sp.region || "").includes(q)).slice(0, 4)
    .map(sp => ({ name: sp.name, lat: sp.lat, lon: sp.lon, spotId: sp.id, sub: "Startplatz · " + (sp.region || "") }));
  pfHomeZeigen();
  pfHomeTimer = setTimeout(async () => {
    let ortsliste = [];
    try {
      if (/^\d{5}$/.test(raw)) { const o = await geocodePlz(raw); ortsliste = [{ name: o.label || `PLZ ${raw}`, lat: o.lat, lon: o.lon, sub: "PLZ" }]; }
      else ortsliste = (await fetchPlaces(raw)).map(o => ({ name: o.name, lat: o.lat, lon: o.lon, sub: [o.kind, o.where].filter(Boolean).join(" · ") }));
    } catch { return; }
    if (seq !== pfHomeSeq) return;
    pfHomeTreffer = [...pfHomeTreffer, ...ortsliste];
    pfHomeZeigen();
  }, 300);
});
profileModal.addEventListener("click", e => {
  const b = e.target.closest("[data-pfhome]");
  if (b) { pfHomeSetzen(pfHomeTreffer[+b.dataset.pfhome]); return; }
  if (!e.target.closest("#pfHomeSug, #pfHomeSuche")) document.getElementById("pfHomeSug").hidden = true;
});
document.getElementById("pfHomeSetzen").addEventListener("click", async () => {
  const q = document.getElementById("pfHomeSuche").value.trim();
  if (q.length < 2) return;
  if (!pfHomeTreffer.length) {
    try { const o = (await fetchPlaces(q))[0]; if (o) pfHomeTreffer = [{ name: o.name, lat: o.lat, lon: o.lon }]; } catch {}
  }
  if (pfHomeTreffer.length) pfHomeSetzen(pfHomeTreffer[0]);
  else document.getElementById("pfHomeAnzeige").innerHTML = `<span class="pf-home-leer">Nichts gefunden – anderer Name?</span>`;
});
document.getElementById("pfHomeSuche").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("pfHomeSetzen").click(); });
document.getElementById("pfHomeGps").addEventListener("click", () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    profil.home = { name: "Mein Standort", lat: +pos.coords.latitude.toFixed(4), lon: +pos.coords.longitude.toFixed(4) };
    speichereProfil(); homeMarkerErneuern();
  }, () => { document.getElementById("pfHomeAnzeige").innerHTML = `<span class="pf-home-leer">Standort nicht verfügbar (Berechtigung?)</span>`; });
});
document.getElementById("pfSave").addEventListener("click", () => {
  speichereProfil();
  const b = document.getElementById("pfSave");
  b.textContent = "✓ Gespeichert";
  setTimeout(() => { b.textContent = "Speichern"; profilSchliessen(); }, 700);
});
document.getElementById("pfLoeschen").addEventListener("click", () => {
  if (!confirm("Profil wirklich löschen? Name, Fotos, Ausrüstung, Level und Heimatgebiet gehen verloren.")) return;
  profil = {}; try { localStorage.removeItem(PROFIL_KEY); } catch {}
  gearOffen.clear(); profilFuellen(); updateGreeting(); homeMarkerErneuern();
  document.getElementById("pfEditMeBox").hidden = false;
});

// --- Reiter ---
function pfTab(tab) {
  profileModal.dataset.tab = tab;
  document.querySelectorAll("#profileModal [data-pftab]").forEach(b => b.classList.toggle("on", b.dataset.pftab === tab));
  document.querySelectorAll(".pf-pane").forEach(p => { p.hidden = p.dataset.pfpane !== tab; });
  if (tab === "rem") remRender();
}
profileModal.addEventListener("click", e => { const b = e.target.closest("[data-pftab]"); if (b) { pfTab(b.dataset.pftab); profileModal.querySelector(".pf-root").scrollTop = 0; } });

// Backup (Profil inkl. Fotos, Erinnerungen, Dokumente)
document.getElementById("bkExport").addEventListener("click", () => {
  const daten = { app: "GoFlyToday", v: 2, stand: heuteIso(), profil, erinnerungen: remData, eigene: remEigene, dokumente: dokData };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(daten)], { type: "application/json" }));
  a.download = `goflytoday-backup-${heuteIso()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
});
document.getElementById("bkImport").addEventListener("change", async e => {
  const f = e.target.files[0]; e.target.value = "";
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (d.app !== "GoFlyToday") throw new Error("falsche Datei");
    if (!confirm("Backup laden? Profil und Erinnerungen auf diesem Gerät werden ersetzt.")) return;
    profil = d.profil || {}; remData = d.erinnerungen || {}; remEigene = d.eigene || []; dokData = d.dokumente || {};
    lsSet(PROFIL_KEY, profil); lsSet(REM_KEY, remData); lsSet(REM_EIGENE_KEY, remEigene); lsSet(DOK_KEY, dokData);
    profilFuellen(); remRender(); updateGreeting(); remBannerZeigen();
  } catch { alert("Das ist keine gültige GoFlyToday-Backup-Datei."); }
});

// --- Erinnerungen: Ausruestung (zuletzt gemacht + Monate = faellig) und Dokumente (Haken) ---
const REM_TYPEN = [
  { k: "rettung", t: "Rettungsschirm packen", monate: 12, ill: "retter" },
  { k: "nachpruefung", t: "Schirm-Nachprüfung", monate: 24, ill: "schirm" },
  { k: "gurtzeug", t: "Gurtzeug-Check", monate: 12, ill: "gurt" },
  { k: "karabiner", t: "Karabiner prüfen", monate: 12, ill: "karabiner" },
];
// Versicherung & Dokumente: nur ein Haken ("vorhanden"), optional Name/Nummer und "gueltig bis"
const DOK_TYPEN = [
  { k: "haftpflicht", t: "Haftpflichtversicherung", ill: "schild", ph: "Versicherer / Vertragsnummer" },
  { k: "dhv", t: "DHV-Mitgliedschaft", ill: "dhv", ph: "Mitgliedsnummer" },
];
let dokData = lsGet(DOK_KEY, {});      // { haftpflicht: { ok, text, bis } }
const alleRem = () => [...REM_TYPEN, ...remEigene.map(x => ({ ...x, ill: "glocke", eigen: true }))];
const REM_BALD_TAGE = 45;
function addMonate(iso, m) { const d = new Date(iso + "T12:00:00"); d.setMonth(d.getMonth() + m); return d; }
function remMonate(t) { return +((remData[t.k] || {}).monate) || t.monate; }
function remFaellig(t) { const x = remData[t.k]; return x && x.datum ? addMonate(x.datum, remMonate(t)) : null; }
function tageBis(d) { return Math.ceil((d - new Date()) / 86400000); }
function stufeVon(tage) { return tage < 0 ? "rot" : tage <= REM_BALD_TAGE ? "gelb" : "ok"; }
function remStatus(t) {
  const d = remFaellig(t); if (!d) return { st: "offen", tage: null, d: null };
  const tage = tageBis(d);
  return { st: stufeVon(tage), tage, d };
}
// Dokument: Haken gesetzt = in Ordnung; mit "gueltig bis" zaehlt zusaetzlich die Frist
function dokStatus(t) {
  const x = dokData[t.k] || {};
  const d = x.bis ? new Date(x.bis + "T12:00:00") : null, tage = d ? tageBis(d) : null;
  if (d && tage < 0) return { st: "rot", tage, d, ok: !!x.ok };
  if (d && tage <= REM_BALD_TAGE) return { st: "gelb", tage, d, ok: !!x.ok };
  return { st: x.ok ? "ok" : "offen", tage, d, ok: !!x.ok };
}
function remTageText(r) {
  if (r.st === "offen") return "Noch nicht eingetragen";
  const wann = r.d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  if (r.tage < 0) return `Überfällig seit ${-r.tage} ${-r.tage === 1 ? "Tag" : "Tagen"} (${wann})`;
  if (r.tage === 0) return `Heute fällig (${wann})`;
  return `Fällig in ${r.tage} ${r.tage === 1 ? "Tag" : "Tagen"} (${wann})`;
}
const IC_KAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`;
const IC_DOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>`;
const IC_HAKEN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
let remOffen = new Set();
const CHIP = { ok: "in Ordnung", gelb: "bald fällig", rot: "überfällig", offen: "offen" };
function remRender() {
  const offenFuer = (k, r) => remOffen.has(k) || r.st === "offen";
  // Ausruestung
  const ausr = alleRem().map(t => {
    const x = remData[t.k] || {}, r = remStatus(t), edit = offenFuer(t.k, r);
    return `<div class="rem2 rem-${r.st}${edit ? " offen" : ""}" data-rem="${t.k}">
      <button type="button" class="rem2-row" data-remrow="${t.k}">
        <span class="rem2-pic">${ILL[t.ill]}</span>
        <span class="rem2-txt"><b>${escHtml(t.t)}</b><span class="rem2-sub">${IC_KAL}${r.st === "offen" ? "Datum eintragen" : r.tage < 0 ? `Überfällig seit ${-r.tage} ${-r.tage === 1 ? "Tag" : "Tagen"}` : `Fällig am ${r.d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`}</span></span>
        <span class="rem-chip">${CHIP[r.st]}</span><span class="rem2-chev">›</span>
      </button>
      <div class="rem-edit"${edit ? "" : " hidden"}>
        <div class="pf-row">
          <label class="pf-field">Zuletzt gemacht<input type="date" class="pf-input" data-remdatum="${t.k}" value="${x.datum || ""}"></label>
          <label class="pf-field rem-monate">Alle … Monate<input type="number" class="pf-input" min="1" max="120" inputmode="numeric" data-remmonate="${t.k}" value="${remMonate(t)}"></label>
        </div>
        <div class="pf-row rem-acts">
          <button type="button" class="pf-btn" data-remsave="${t.k}">Speichern</button>
          ${r.d ? `<button type="button" class="pf-btn pf-btn-ghost" data-remics="${t.k}">📅 Kalender</button>` : ""}
          ${t.eigen ? `<button type="button" class="pf-btn pf-btn-ghost rem-del" data-remdel="${t.k}">Löschen</button>` : ""}
        </div>
      </div>
    </div>`;
  }).join("");
  // Versicherung & Dokumente: Haken
  const dok = DOK_TYPEN.map(t => {
    const x = dokData[t.k] || {}, r = dokStatus(t), edit = remOffen.has("dok:" + t.k);
    const sub = r.d ? (r.tage < 0 ? `Abgelaufen am ${r.d.toLocaleDateString("de-DE")}` : `Gültig bis ${r.d.toLocaleDateString("de-DE")}`)
      : x.text ? escHtml(x.text) : r.ok ? "Vorhanden" : "Datum prüfen";
    return `<div class="rem2 rem-${r.st}${edit ? " offen" : ""}" data-dok="${t.k}">
      <div class="rem2-row">
        <span class="rem2-pic">${ILL[t.ill]}</span>
        <button type="button" class="rem2-txt rem2-open" data-dokrow="${t.k}"><b>${t.t}</b><span class="rem2-sub">${IC_DOK}${sub}</span></button>
        <button type="button" class="rem-haken${r.ok ? " an" : ""}" data-dokhaken="${t.k}" aria-label="${t.t}: ${r.ok ? "vorhanden" : "nicht eingetragen"}" aria-pressed="${r.ok}">${IC_HAKEN}</button>
        <button type="button" class="rem2-chev rem2-open" data-dokrow="${t.k}" aria-label="Bearbeiten">›</button>
      </div>
      <div class="rem-edit"${edit ? "" : " hidden"}>
        <label class="pf-field">${t.ph}<input type="text" class="pf-input" maxlength="40" data-doktext="${t.k}" value="${escHtml(x.text || "")}" placeholder="optional"></label>
        <div class="pf-row">
          <label class="pf-field">Gültig bis (optional)<input type="date" class="pf-input" data-dokbis="${t.k}" value="${x.bis || ""}"></label>
        </div>
        <div class="pf-row rem-acts"><button type="button" class="pf-btn" data-doksave="${t.k}">Speichern</button></div>
      </div>
    </div>`;
  }).join("");
  document.getElementById("remListe").innerHTML = `
    ${remZusammenfassung()}
    <h3 class="rem-h">Ausrüstung</h3>${ausr}
    <h3 class="rem-h">Versicherung &amp; Dokumente</h3>${dok}`;
  remAnzeigen();
}
// Karte oben: wie viele Termine, wie viele ueberfaellig, wann der naechste kommt
function remZusammenfassung() {
  const alle = [...alleRem().map(t => remStatus(t)), ...DOK_TYPEN.map(t => dokStatus(t))].filter(r => r.st !== "offen" || r.ok);
  const ueber = alle.filter(r => r.st === "rot").length;
  const naechste = alle.filter(r => r.d && r.tage >= 0).sort((a, b) => a.tage - b.tage)[0];
  return `<div class="rem-sum">
    <div class="rem-sum-i"><span class="rem-sum-ic">${IC_KAL}</span><div><b>${alle.length}</b><span>Termine</span></div></div>
    <div class="rem-sum-i${ueber ? " rot" : ""}"><span class="rem-sum-ic warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/></svg></span><div><b>${ueber}</b><span>überfällig</span></div></div>
    <div class="rem-sum-i"><span class="rem-sum-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><b>${naechste ? `${naechste.tage} <small>${naechste.tage === 1 ? "Tag" : "Tage"}</small>` : "–"}</b><span>nächster Termin</span></div></div>
  </div>`;
}
function remAlarm() {
  const l = [
    ...alleRem().map(t => ({ t, r: remStatus(t) })),
    ...DOK_TYPEN.map(t => ({ t, r: dokStatus(t) })),
  ].filter(x => x.r.st === "rot" || x.r.st === "gelb");
  l.sort((a, b) => a.r.tage - b.r.tage);
  return l;
}
function remAnzeigen() {
  const al = remAlarm();
  document.querySelectorAll("[data-pfremdot]").forEach(dot => { dot.hidden = !al.length; dot.classList.toggle("rot", al.some(x => x.r.st === "rot")); });
  profilUi();
  remBannerZeigen();
}
function remBannerZeigen() {
  const box = document.getElementById("remBanner"); if (!box) return;
  const al = remAlarm();
  let gesehen = ""; try { gesehen = sessionStorage.getItem("remBannerZu") || ""; } catch {}
  if (!al.length || gesehen === heuteIso()) { box.hidden = true; return; }
  const x = al[0];
  box.innerHTML = `<span class="eve-txt">⏰ <b>${escHtml(x.t.t)}</b>: ${remTageText(x.r)}${al.length > 1 ? ` · +${al.length - 1} weitere` : ""}</span>
    <button type="button" class="eve-btn" id="remBannerGo">Ansehen</button>
    <button type="button" class="eve-x" id="remBannerX" aria-label="Ausblenden">✕</button>`;
  box.hidden = false;
}
document.getElementById("remBanner").addEventListener("click", e => {
  if (e.target.closest("#remBannerGo")) profilOeffnen("rem");
  if (e.target.closest("#remBannerX")) { try { sessionStorage.setItem("remBannerZu", heuteIso()); } catch {} document.getElementById("remBanner").hidden = true; }
});
document.getElementById("remNeu").addEventListener("click", () => {
  const box = document.getElementById("remNeuBox"); box.hidden = !box.hidden;
  document.getElementById("remNeuDatum").value = heuteIso();
  if (!box.hidden) box.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("remNeuOk").addEventListener("click", () => {
  const name = document.getElementById("remNeuName").value.trim();
  if (!name) { document.getElementById("remNeuName").focus(); return; }
  const k = "e" + Date.now().toString(36), monate = Math.max(1, +document.getElementById("remNeuMonate").value || 12);
  remEigene.push({ k, t: name, monate }); lsSet(REM_EIGENE_KEY, remEigene);
  remData[k] = { datum: document.getElementById("remNeuDatum").value || heuteIso(), monate }; lsSet(REM_KEY, remData);
  document.getElementById("remNeuName").value = ""; document.getElementById("remNeuBox").hidden = true;
  remRender();
});
// Zeile antippen = aufklappen; Eingaben gelten erst mit "Speichern"
profileModal.addEventListener("click", e => {
  const row = e.target.closest("[data-remrow]");
  if (row) { const k = row.dataset.remrow; remOffen.has(k) ? remOffen.delete(k) : remOffen.add(k); remRender(); return; }
  const dr = e.target.closest("[data-dokrow]");
  if (dr) { const k = "dok:" + dr.dataset.dokrow; remOffen.has(k) ? remOffen.delete(k) : remOffen.add(k); remRender(); return; }
  const hk = e.target.closest("[data-dokhaken]");
  if (hk) { const k = hk.dataset.dokhaken; dokData[k] = { ...(dokData[k] || {}), ok: !(dokData[k] || {}).ok }; lsSet(DOK_KEY, dokData); remRender(); return; }
  const sv = e.target.closest("[data-remsave]");
  if (sv) {
    const k = sv.dataset.remsave, t = alleRem().find(x => x.k === k), box = sv.closest(".rem2");
    const datum = box.querySelector("[data-remdatum]").value, monate = Math.max(1, +box.querySelector("[data-remmonate]").value || t.monate);
    remData[k] = { datum, monate }; lsSet(REM_KEY, remData);
    remOffen.delete(k); remRender();
    if (k === "rettung") GEAR.forEach(gearTexte);
    return;
  }
  const ds = e.target.closest("[data-doksave]");
  if (ds) {
    const k = ds.dataset.doksave, box = ds.closest(".rem2");
    const text = box.querySelector("[data-doktext]").value.trim(), bis = box.querySelector("[data-dokbis]").value;
    // Etwas eingetragen -> gilt als vorhanden (Haken), sonst bleibt der Haken wie er war
    dokData[k] = { ...(dokData[k] || {}), text, bis, ok: (text || bis) ? true : !!(dokData[k] || {}).ok };
    lsSet(DOK_KEY, dokData); remOffen.delete("dok:" + k); remRender();
    return;
  }
  const del = e.target.closest("[data-remdel]");
  if (del) { if (!confirm("Erinnerung löschen?")) return; remEigene = remEigene.filter(x => x.k !== del.dataset.remdel); delete remData[del.dataset.remdel]; lsSet(REM_EIGENE_KEY, remEigene); lsSet(REM_KEY, remData); remRender(); return; }
  // Kalender-Datei (.ics): ganztaegig am Faelligkeitstag, Erinnerung 14 Tage vorher
  const b = e.target.closest("[data-remics]"); if (!b) return;
  const t = alleRem().find(x => x.k === b.dataset.remics), d = remFaellig(t); if (!d) return;
  const ymd = x => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, "0")}${String(x.getDate()).padStart(2, "0")}`;
  const ende = new Date(d.getTime() + 86400000);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GoFlyToday//DE", "BEGIN:VEVENT", `UID:${t.k}-${ymd(d)}@goflytoday.de`,
    `DTSTAMP:${ymd(new Date())}T000000Z`, `DTSTART;VALUE=DATE:${ymd(d)}`, `DTEND;VALUE=DATE:${ymd(ende)}`, `SUMMARY:${t.t} (GoFlyToday)`,
    "BEGIN:VALARM", "TRIGGER:-P14D", "ACTION:DISPLAY", `DESCRIPTION:${t.t} in 14 Tagen fällig`, "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = `${t.k}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
});
// Persoenliche Hinweise im Briefing (Schritt Startplatz) - warnen, aber nie freigeben
function profilHinweise(spot) {
  const out = [];
  const d = spot.diff || 0;
  if (profil.level === "einsteiger" && d >= 1) out.push({ typ: "warn", text: `Für dein Level (Einsteiger): ${d === 2 ? "sehr anspruchsvolles" : "anspruchsvolles"} Gelände – hol dir vor Ort Rat bei Fluglehrer oder Verein.` });
  else if (profil.level === "fortgeschritten" && d === 2) out.push({ typ: "warn", text: "Sehr anspruchsvolles Gelände – nur mit viel Erfahrung auf diesem Platz, sonst vorher mit Ortskundigen sprechen." });
  if (profil.level === "einsteiger" && /(nicht|kein)[^.]{0,30}anf[äa]nger|anf[äa]nger[^.]{0,25}nicht/i.test(spot.bemerkung || "")) out.push({ typ: "warn", text: "Laut DHV-Bemerkung für Anfänger nicht geeignet." });
  return out;
}
// Werkzeug-Seite aus den Einstellungen heraus oeffnen. Kein closeSettings() + location.hash:
// dessen history.back() feuert async und macht die Navigation sofort wieder rueckgaengig
// (gleiche Falle wie bei Einstellungen -> Feedback). Stattdessen den gepushten Eintrag
// durch die Zielseite ERSETZEN und route() selbst anstossen (replaceState loest kein
// hashchange aus).
document.getElementById("settingsVolteBtn").addEventListener("click", () => {
  settingsModal.hidden = true;
  settingsHistoryPushed = false;
  history.replaceState({}, "", "#/volte");
  route();
});
document.getElementById("volteSearch").addEventListener("input", e => renderVolteSearch(e.target.value));
document.getElementById("volteModes").addEventListener("click", e => {
  const b = e.target.closest("[data-vmode]"); if (!b) return;
  volteMode = b.dataset.vmode;
  document.querySelectorAll("#volteModes .apill").forEach(x => x.classList.toggle("on", x === b));
  document.getElementById("volteHint").innerHTML = volteMode === "volte"
    ? `Tippe die Punkte der <b>Landevolte</b> in Flugrichtung nacheinander an: Gegenanflug → Queranflug → Endanflug.`
    : `Tippe die <b>Ecken des Landefelds</b> im Uhrzeigersinn an – die Fläche schließt sich automatisch.`;
});
document.getElementById("volteStyleToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-vstyle]"); if (!b) return;
  volteStyleMode = b.dataset.vstyle;
  document.querySelectorAll("#volteStyleToggle .mini-style-btn").forEach(x => x.classList.toggle("on", x === b));
  // Ebenen/Geometrie stellt der idle-Handler nach dem Stilwechsel selbst wieder her.
  if (volteMapInstance) volteMapInstance.setStyle(MINI_MAP_STYLES[volteStyleMode]);
  document.getElementById("volteAttrib").textContent = attribTextFor(volteStyleMode);
});
document.getElementById("volteUndo").addEventListener("click", () => { voltePoints[volteMode].pop(); volteRedraw(); });
document.getElementById("volteClear").addEventListener("click", () => {
  if (!confirm("Alle gesetzten Punkte verwerfen?")) return;
  voltePoints = { volte: [], feld: [] }; volteRedraw();
});
document.getElementById("volteCopy").addEventListener("click", async () => {
  const btn = document.getElementById("volteCopy"), txt = document.getElementById("volteOut").value;
  try { await navigator.clipboard.writeText(txt); }
  catch { const t = document.getElementById("volteOut"); t.select(); document.execCommand("copy"); }
  const alt = btn.textContent; btn.textContent = "Kopiert ✓";
  setTimeout(() => { btn.textContent = alt; }, 1600);
});

document.getElementById("settingsFeedbackBtn").addEventListener("click", () => {
  // Direkter Wechsel Einstellungen -> Feedback: den gepushten Verlaufseintrag ERSETZEN statt
  // history.back() + pushState() im selben Tick zu mischen (back() wirkt async, das würde sich
  // mit dem sofortigen pushState() der Feedback-Historie in die Quere kommen).
  settingsModal.hidden = true;
  settingsHistoryPushed = false;
  fbModal.hidden = false;
  document.getElementById("fbText").focus();
  fbHistoryPushed = true;
  history.replaceState({ fbOpen: true }, "", location.href);
});
document.getElementById("infoChangelogBtn").addEventListener("click", () => {
  showChangelog();
  changelogHistoryPushed = true;
  history.pushState({ changelogOpen: true }, "", location.href);
});
document.getElementById("settingsVersionBtn").addEventListener("click", () => {
  // Gleiches Prinzip wie Einstellungen -> Feedback: History-Eintrag ersetzen statt stapeln.
  settingsModal.hidden = true;
  settingsHistoryPushed = false;
  showChangelog();
  changelogHistoryPushed = true;
  history.replaceState({ changelogOpen: true }, "", location.href);
});

// ---------------- Changelog ("Was ist neu?") ----------------
// Sehr kurze, laienverstaendliche Ein-Zeiler pro Version - keine Commit-Messages 1:1 uebernehmen.
const CHANGELOG = [
  { v: 177, date: "29.10.", text: "Detailfenster: Stern, ☰ und ✕ sitzen sauber in einer Zeile oben rechts; Favorit nur noch über den Stern" },
  { v: 176, date: "29.10.", text: "Detailmenü: „Umgebung auf der Karte“ entfernt" },
  { v: 175, date: "29.10.", text: "Hauptkarte: Legende, Knöpfe und Zoom liegen jetzt immer über den Markern (Favoriten- und Heimat-Marker überdeckten sie)" },
  { v: 174, date: "29.10.", text: "Info & Recht komplett überarbeitet: neue Optik, aktuelle Funktionen, Datenquellen und Datenschutz in Kürze, aufklappbare Rechtstexte" },
  { v: 173, date: "29.10.", text: "Hauptkarte: deine Favoriten sind immer markiert – goldener Stern am Marker, und Favoriten außerhalb der Treffer stehen als Stern-Marker auf der Karte" },
  { v: 172, date: "29.10.", text: "Runterziehen zum Neuladen: die App bleibt auf dem Bildschirm, auf dem du gerade bist (Seite, Suche, Karte, geöffnetes Detail oder Profil, Scrollstelle)" },
  { v: 171, date: "29.10.", text: "Sicherheitsprofil (eigene Grenzwerte) ist von den Einstellungen ins Profil umgezogen" },
  { v: 170, date: "29.10.", text: "Flugbuch komplett entfernt (inkl. Statistik, Abzeichen und „Geflogen / Will ich fliegen“). Backup und Profil bleiben" },
  { v: 169, date: "29.10.", text: "Erinnerungen neu gestaltet: Zusammenfassung oben, Ausrüstung als Zeilen, Haftpflicht und DHV-Mitgliedschaft nur mit Haken, Eingaben gelten mit „Speichern“" },
  { v: 168, date: "29.10.", text: "Briefing: Block „Wichtige Hinweise“ entfernt (der Haftungstext bleibt)" },
  { v: 167, date: "29.10.", text: "Briefing „Anreise & Start“: Navigation, Parkplatz-Liste und Umgebungs-Kachel entfernt – das steht auf der Hauptkarte" },
  { v: 166, date: "28.10.", text: "Briefing „Heute im Überblick“: grüner Haken bei Windrichtung, Wind und Böen, wenn sie zu deinem Startplatz und deiner Ampel passen" },
  { v: 165, date: "28.10.", text: "Detailfenster: der Reiter „Details“ ist ins Briefing gewandert und logisch geordnet (Urteil, Hinweise, Überblick, Flug-Check, Hinweise, Notizen). Doppelte Angaben entfernt: Ort, Höhen, Schwierigkeit, Bemerkung, Zulassung, Bergbahn, Beste Zeit" },
  { v: 164, date: "28.10.", text: "Heimat-Startplatz pulsiert als lila Herz statt als Kreis" },
  { v: 163, date: "28.10.", text: "Heimat-Startplatz aus dem Profil pulsiert auf der Karte lila (liegt er außerhalb der Treffer oder ist es ein Ort: lila Punkt)" },
  { v: 162, date: "28.10.", text: "Profil: neue Bilder für Schirm, Gurtzeug, Retter und Karabiner" },
  { v: 161, date: "28.10.", text: "Profil im neuen Design: Hero-Banner, Profilkarte mit Foto, Statistik, Schirm-, Gurtzeug- und Retter-Karten, Flugbuch-Liste mit Strecke, Erinnerungs-Karten mit eigenen Terminen" },
  { v: 160, date: "27.10.", text: "Profil: Speichern-Knopf, Heimatgebiet mit Suchvorschlägen wie die Hauptsuche. Flugbuch (Flüge eintragen, Statistik, Lieblingsplatz, Abzeichen), „Geflogen / Will ich fliegen“ für Plätze (Detailfenster ☰, Haken auf der Karte), Erinnerungen für Rettungsschirm, Nachprüfung, Gurtzeug, Versicherung mit Kalender-Datei, Backup als Datei" },
  { v: 159, date: "27.10.", text: "Neu: Mein Profil (Name, Level, Schirm, Flugarten, Heimatgebiet – nur auf deinem Gerät). Das Level stellt die Ampel ein. Außerdem deutlich mehr grüne Tage: ein guter Kern von 3 Stunden reicht, gelbe Randstunden machen das Fenster nicht mehr gelb" },
  { v: 158, date: "24.10.", text: "Tipp auf einen Startplatz in der Hauptkarte zoomt hinein (Umgebung erscheint), unten eine kurze Karte mit Bedingungen und „Details“. Zweiter Tipp öffnet die Details" },
  { v: 157, date: "23.10.", text: "Zwei Filter auf der Karte: „Startplätze“ (Trichter) und „Umgebung“ (Pin). Parken, Seilbahn, Camping usw. erscheinen automatisch, sobald du näher heranzoomst – ohne Umweg über das Briefing" },
  { v: 156, date: "23.10.", text: "Briefing-Karte ist weg: „Umgebung auf der Karte“ zeigt Parken, Seilbahn, Camping usw. direkt auf der Hauptkarte. Neues Filter-Feld mit Haken, Zähler, Zurücksetzen und „Filter anwenden“" },
  { v: 155, date: "23.10.", text: "Teilen: Der Link führt jetzt direkt zum geteilten Fluggebiet (statt nur zur App). Seilbahn: Berg-/Talstation nach Höhe, nicht mehr nach Abstand geraten" },
  { v: 154, date: "23.10.", text: "Seilbahn auf der Briefing-Karte: bei mehreren Bahnen zum Start gewinnt die mit der Talstation nahe am Landeplatz" },
  { v: 153, date: "22.10.", text: "Route Stufe 2: Abfahrtszeit eingeben – jeder Startplatz wird zur Ankunftszeit bewertet" },
  { v: 152, date: "22.10.", text: "Länder- und Regions-Auswahl entfernt – gesucht wird über Suchfeld, Standort, Route oder Karte" },
  { v: 151, date: "22.10.", text: "Hauptkarte: Ebenen- und Filter-Knopf wie im Briefing; Umkreis, Favoriten, Zustieg und Höhendifferenz jetzt im Filter auf der Karte" },
  { v: 150, date: "22.10.", text: "Tippen auf die Karte startet keine neue Suche mehr – dafür „Startplätze hier suchen“" },
  { v: 148, date: "22.10.", text: "„Startplätze entlang der Route“ als eigener Knopf über Karte/Liste" },
  { v: 147, date: "22.10.", text: "Neu: Startplätze entlang einer Route – Von/Nach eingeben, Umweg 10/20/30 km, Ergebnis in Fahrtrichtung" },
  { v: 146, date: "22.10.", text: "Startseite: Ladeanzeige mit Gleitschirm-Ring statt Textzeile (Standort, Suche, Prüfen)" },
  { v: 145, date: "22.10.", text: "Briefing: Liste „Übernachten in der Nähe“ entfernt (steht über den Filter auf der Karte); Karte schaut beim Scrollen nicht mehr neben der Kopfzeile hervor" },
  { v: 144, date: "22.10.", text: "Briefing-Karte: neue Filter ÖPNV (Bus, Bahn, Tram) und Tankstelle" },
  { v: 143, date: "22.10.", text: "Live-Wetter, Live-Cam und Windy als große, farbige Knöpfe im Wetter-Tab; Knopf „Satellitenbild“ in den Kartenfenstern entfernt" },
  { v: 142, date: "22.10.", text: "Knopf heißt jetzt „In Google Maps öffnen“" },
  { v: 141, date: "22.10.", text: "Landeplatz: „Höhendifferenz“ statt „Höhenabstand“" },
  { v: 140, date: "22.10.", text: "Landeplätze auf der Briefing-Karte zeigen immer die nötige Gleitzahl" },
  { v: 139, date: "22.10.", text: "Seilbahn-Stationen: Knopf zur Website der Bahn bzw. Suche nach Preisen" },
  { v: 138, date: "22.10.", text: "Briefing-Karte: Gondel-Symbol an Tal- und Bergstation jeder Bahn; Infofenster liegt jetzt über allen Symbolen" },
  { v: 137, date: "22.10.", text: "Briefing-Karte: Knopf „Bewertungen auf Google“ bei Hotels, Campingplätzen, Restaurants und Supermärkten; Seilbahn-Filter zeigt nur noch die Bahn zum Startplatz" },
  { v: 136, date: "22.10.", text: "Briefing-Karte: Parken, Seilbahn, Camping, Hotel, Essen, Supermarkt und Toilette für alle Startplätze – blitzschnell vom eigenen Server, doppelte Einträge herausgefiltert" },
  { v: 135, date: "22.10.", text: "Kein leerer Platz mehr unter den Notizen – jeder Tab ist nur so lang wie sein Inhalt" },
  { v: 134, date: "22.10.", text: "Kurzüberblick (Wind, Böen, Temperatur, beste Zeit) steht jetzt oben im Details-Tab" },
  { v: 133, date: "22.10.", text: "Ladeansicht beim Öffnen eines Startplatzes steht mindestens 2 Sekunden" },
  { v: 131, date: "22.10.", text: "Neue Ladeansicht beim Öffnen eines Startplatzes" },
  { v: 130, date: "22.10.", text: "Briefing-Karte lädt die Umgebung jetzt vom eigenen Server – schnell und ohne den überlasteten Overpass-Dienst. Wichtige Hinweise und Notizen stehen jetzt unter Details" },
  { v: 129, date: "22.10.", text: "Briefing-Karte: neue Filter Supermarkt und Toilette" },
  { v: 128, date: "22.10.", text: "Briefing-Karte: ganze Umgebung in einer Abfrage, Ersatzserver springt nach 4 Sekunden ein – kein Dauer-Laden mehr" },
  { v: 127, date: "22.10.", text: "Briefing-Karte lädt Parken, Seilbahn, Hotel und Essen zuverlässiger (Ersatzserver, keine Überlast mehr) und zeigt an, wenn etwas nicht lädt" },
  { v: 126, date: "22.10.", text: "Gesuchter Ort pulsiert als grüner Punkt auf der Karte, ein gesuchter Startplatz pulsiert selbst" },
  { v: 126, date: "22.10.", text: "Briefing neu: große Karte mit Filtern für Parken, Seilbahn, Camping, Stellplatz, Hotel und Essen – Flug-Check darunter zum Aufklappen" },
  { v: 125, date: "22.10.", text: "Startplätze in den Suchvorschlägen mit Gleitschirm-Symbol" },
  { v: 124, date: "22.10.", text: "Suchvorschläge auch für Orte, Seen und Berge – Antippen zeigt die Startplätze im Umkreis auf der Karte" },
  { v: 123, date: "22.10.", text: "Vorschläge beim Tippen ins Suchfeld" },
  { v: 122, date: "22.10.", text: "Bestätigen-Knopf im Suchfeld" },
  { v: 121, date: "22.10.", text: "Startplatz-Fenster über den ganzen Bildschirm" },
  { v: 120, date: "26.08.", text: "Windprofil jetzt in gleichmäßigen 500-m-Stufen statt krummer Modellhöhen" },
  { v: 119, date: "26.08.", text: "Windprofil: Balkenfarbe zeigt jetzt die Windstärke, die Richtung wird nur am Startplatz bewertet" },
  { v: 118, date: "26.08.", text: "Details-Tab war ohne Formatierung – behoben, Datentabelle mit Überschrift" },
  { v: 117, date: "26.08.", text: "Windprofil neu gestaltet: klare Zeilen mit Balken, Richtung als Kürzel, Hinweis auf Drehung mit der Höhe" },
  { v: 116, date: "26.08.", text: "Neu: Windprofil unter jedem Tag – Wind und Richtung in verschiedenen Höhen, Stunde antippen" },
  { v: 115, date: "26.08.", text: "Briefing folgt der Auswahl „Morgen“, Info-Knopf an den Kartenmarkern, doppelte Kacheln entfernt" },
  { v: 114, date: "26.08.", text: "Karte: lange drücken legt hier einen eigenen Platz an, Doppeltipp entfernt" },
  { v: 113, date: "26.08.", text: "Parken steht wieder unter der Navigation" },
  { v: 112, date: "26.08.", text: "Briefing neu aufgebaut: vier Schritte, Landeplatz-Reiter, Kurzüberblick und Notizfeld" },
  { v: 111, date: "21.08.", text: "Flugarten als Kacheln mit Symbolen, Hinweistext korrigiert" },
  { v: 110, date: "21.08.", text: "Mögliche Flugarten je Platz, Parkplätze auch am Startplatz, Karte bleibt beim Suchen stehen" },
  { v: 109, date: "21.08.", text: "Parkplätze wurden auf der Karte als Unterkunft angezeigt – behoben" },
  { v: 108, date: "21.08.", text: "Karte: „Startplätze hier suchen“ beim Verschieben, Marker mit Infofenster" },
  { v: 107, date: "21.08.", text: "Briefing verfeinert: Parkplätze mit Zielangabe, DHV-Infos, kompaktere Tage" },
  { v: 106, date: "20.08.", text: "Neuer Briefing-Tab mit Flug-Check, Parkplätzen, Übernachten und Schild-Icons" },
  { v: 105, date: "04.08.", text: "Wetter-Tab startet mit den aktuellen Bedingungen, doppelte Bewertung entfernt" },
  { v: 104, date: "04.08.", text: "Aktuelle Bedingungen stehen jetzt auch oben im Wetter-Tab" },
  { v: 103, date: "04.08.", text: "Live-Tab aufgeräumt, Zeitfenster stehen jetzt nur noch bei den Tagen" },
  { v: 102, date: "04.08.", text: "Campingplätze und Wohnmobilstellplätze im Live-Tab" },
  { v: 101, date: "04.08.", text: "Werkzeug zum Einzeichnen der Landevolte (in den Einstellungen)" },
  { v: 100, date: "04.08.", text: "Neuer Briefing-Tab mit Platzregeln und Notrufnummern (erster Platz: Gerlitzen)" },
  { v: 99, date: "04.08.", text: "Updates kommen jetzt zuverlässig an (Cache-Problem behoben)" },
  { v: 98, date: "04.08.", text: "Eigene Plätze im Neu-Tab bearbeiten und löschen" },
  { v: 97, date: "04.08.", text: "Karte zeigt jetzt immer auch den eigenen Standort" },
  { v: 96, date: "04.08.", text: "Eigener Standort als blauer Punkt auf allen Karten" },
  { v: 95, date: "04.08.", text: "Neue Icons für die Menüleiste unten" },
  { v: 94, date: "04.08.", text: "Neues Icon und Datum bei den Versionshinweisen" },
  { v: 93, date: "04.08.", text: "Favoriten-Seite überarbeitet, Zustieg-Icons neu, Versionshinweise" },
  { v: 92, date: "03.08.", text: "Glocke zeigt jetzt einen echten Hinweis-Dialog" },
  { v: 91, date: "03.08.", text: "Pfeile und Fadenkreuz exakt ausgerichtet" },
  { v: 90, date: "03.08.", text: "Karten-Beschriftungen verbessert, Favoriten-Filter, einheitliche Icons" },
  { v: 89, date: "03.08.", text: "Einstellungen: neue Icons, Regler, Texte" },
  { v: 88, date: "03.08.", text: "Zurück-Taste schließt Fenster statt die App zu verlassen" },
  { v: 87, date: "03.08.", text: "Abstand im Kopfbereich korrigiert" },
  { v: 86, date: "03.08.", text: "Profi-Modus mit eigenen Grenzwerten" },
  { v: 85, date: "03.08.", text: "Neues Kopfleisten-Design, echte Einstellungsseite" },
  { v: 84, date: "02.08.", text: "Landeplatz-Name auf der Karte" },
  { v: 83, date: "02.08.", text: "Karte als Standardansicht, Freitextsuche, Höhendifferenz-Filter" },
];
const changelogModal = document.getElementById("changelogModal");
let changelogHistoryPushed = false;
function showChangelog() {
  document.getElementById("changelogList").innerHTML = CHANGELOG.map(c =>
    `<div class="changelog-item"><div class="changelog-meta"><span class="changelog-v">v${c.v}</span><span class="changelog-date">${c.date}</span></div><span class="changelog-text">${c.text}</span></div>`
  ).join("");
  changelogModal.hidden = false;
  void changelogModal.offsetWidth; // Reflow erzwingen, damit die Enter-Transition greift
  changelogModal.classList.add("show");
}
function closeChangelog(fromPopstate = false) {
  changelogModal.classList.remove("show");
  setTimeout(() => { changelogModal.hidden = true; }, 320);
  if (changelogHistoryPushed) { changelogHistoryPushed = false; if (!fromPopstate) history.back(); }
}
document.getElementById("changelogClose").addEventListener("click", () => closeChangelog());
changelogModal.addEventListener("click", e => { if (e.target === changelogModal) closeChangelog(); });

// ---------------- Benachrichtigungen (Glocke) ----------------
// Wertiger Dialog statt kleiner Popover-Karte: zeigt beim ersten Mal den Sicherheitshinweis mit
// "Als gelesen markieren", danach dauerhaft einen ruhigen "Alles klar"-Zustand.
const ICON_WARN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>`;
const notifModal = document.getElementById("notifModal");
let notifHistoryPushed = false;
function renderNotifBody() {
  const body = document.getElementById("notifBody");
  if (localStorage.getItem(BELL_SEEN_KEY) !== "1") {
    body.innerHTML = `
      <div class="notif-icon warn">${ICON_WARN}</div>
      <h3 class="notif-title">Wichtiger Hinweis</h3>
      <p class="notif-text">GoFlyToday liefert ausschließlich eine Orientierungshilfe. Die Entscheidung, ob ein Flug sicher durchgeführt werden kann, liegt immer beim Piloten. Wetterdaten können fehlerhaft oder unvollständig sein. Vor jedem Flug müssen die Bedingungen eigenständig geprüft werden.</p>
      <button type="button" class="btn-primary notif-ack" id="notifAckBtn">Als gelesen markieren</button>`;
  } else {
    body.innerHTML = `
      <div class="notif-icon ok">${ICON_CHECK}</div>
      <h3 class="notif-title">Alles klar</h3>
      <p class="notif-text">Aktuell keine weiteren Benachrichtigungen. Neue Hinweise erscheinen hier automatisch.</p>
      <button type="button" class="btn-primary notif-ack" id="notifOkBtn">Schließen</button>`;
  }
}
function openNotif() {
  renderNotifBody();
  notifModal.hidden = false;
  void notifModal.offsetWidth; // Reflow erzwingen, damit die Enter-Transition ab dem Ausgangszustand greift
  notifModal.classList.add("show");
  if (!notifHistoryPushed) { history.pushState({ notifOpen: true }, "", location.href); notifHistoryPushed = true; }
}
function closeNotif(fromPopstate = false) {
  notifModal.classList.remove("show");
  setTimeout(() => { notifModal.hidden = true; }, 320); // an die laengere CSS-Transition (Transform) angepasst
  if (notifHistoryPushed) { notifHistoryPushed = false; if (!fromPopstate) history.back(); }
}
document.getElementById("notifClose").addEventListener("click", () => closeNotif());
notifModal.addEventListener("click", e => { if (e.target === notifModal) closeNotif(); });
document.getElementById("notifBody").addEventListener("click", e => {
  if (e.target.closest("#notifAckBtn")) { markBellSeen(); renderNotifBody(); return; }
  if (e.target.closest("#notifOkBtn")) { closeNotif(); return; }
});

// Zurück-Taste (Handy/TWA): schliesst das oberste offene Fenster statt die Seite/App zu verlassen.
window.addEventListener("popstate", () => {
  if (!profileModal.hidden) { profilSchliessen(true); return; }
  if (!settingsModal.hidden) { closeSettings(true); return; }
  if (!fbModal.hidden) { fbClose(true); return; }
  if (!notifModal.hidden) { closeNotif(true); return; }
  if (!changelogModal.hidden) { closeChangelog(true); return; }
  if (!document.getElementById("detailModal").hidden) closeDetail(true);
});

// ---------------- Neu: Datenbank-Suche + eigener Platz ----------------
function renderDbSearch(query = "", wrapId = "dbResults") {
  const wrap = document.getElementById(wrapId);
  const q = query.trim().toLowerCase();
  if (!q) {
    wrap.innerHTML = `<p class="db-hint">🔎 Tippe einen Namen oder Ort (z. B. „Tegelberg", „Alb"), um in ${SPOT_DB.length} Startplätzen zu suchen.</p>`;
    return;
  }
  const list = SPOT_DB.concat(loadUserSpots())
    .filter(s => (s.name + " " + (s.region||"")).toLowerCase().includes(q))
    .slice(0, 6);
  wrap.innerHTML = list.map(s => {
    const fav = isFav(s.id);
    return `<div class="db-row" data-spot="${s.id}">
      <div><div class="fr-name">${s.name} <span class="fr-go">›</span></div><div class="fr-sub">${s.region||""} · ${s.sectorLabel}</div></div>
      <button class="ic0 star ${fav?"on":""}" data-fav="${s.id}">${fav?"★":"☆"}</button>
    </div>`;
  }).join("") || `<p class="empty">Nichts gefunden.</p>`;
}

// ---------------- Eigene Plätze verwalten (Neu-Seite, unter dem Formular) ----------------
const IC_PENCIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`;
const IC_TRASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`;
function escHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function renderUserSpots() {
  const wrap = document.getElementById("userSpotList");
  if (!wrap) return;
  const list = loadUserSpots();
  if (!list.length) {
    wrap.innerHTML = `<p class="db-hint">Hier erscheinen die Plätze, die du oben selbst anlegst – zum Bearbeiten oder Löschen.</p>`;
    return;
  }
  wrap.innerHTML = list.map(s => {
    const sub = [s.region, s.sectorLabel, s.elevation != null ? s.elevation + " m" : null].filter(Boolean).join(" · ");
    return `<div class="us-row">
      <div class="us-main">
        <div class="us-name">${escHtml(s.name)}</div>
        <div class="us-sub">${escHtml(sub)}</div>
      </div>
      <button class="us-btn" data-edit="${s.id}" title="Bearbeiten" aria-label="Bearbeiten">${IC_PENCIL}</button>
      <button class="us-btn us-del" data-del="${s.id}" title="Löschen" aria-label="Löschen">${IC_TRASH}</button>
    </div>`;
  }).join("");
}

// ---------------- Werkzeug: Landevolte auf der Karte abgreifen ----------------
// Erfasst Koordinaten durch Antippen der Satellitenkarte und gibt sie als fertigen
// Textblock fuer briefings.js aus. Bewusst KEIN Raten aus Foto-Vorlagen - eine
// Landevolte muss aus echten Koordinaten kommen.
let volteSpot = null;
let volteMode = "volte";
let voltePoints = { volte: [], feld: [] };
let volteMapInstance = null;
let volteStyleMode = "sat";
let volteMarkers = [];
const VOLTE_SRC = "volte-src", VOLTE_FELD_SRC = "volte-feld-src";

function renderVolteSearch(query = "") {
  const wrap = document.getElementById("volteResults");
  const q = query.trim().toLowerCase();
  if (!q) { wrap.innerHTML = `<p class="db-hint">Tippe einen Namen oder Ort, um den Startplatz zu finden.</p>`; return; }
  const list = allKnownSpots().filter(s => (s.name + " " + (s.region || "")).toLowerCase().includes(q)).slice(0, 6);
  wrap.innerHTML = list.map(s => `<div class="db-row" data-volte-spot="${s.id}">
      <div><div class="fr-name">${escHtml(s.name)} <span class="fr-go">›</span></div><div class="fr-sub">${escHtml(s.region || "")}</div></div>
    </div>`).join("") || `<p class="empty">Nichts gefunden.</p>`;
}

function volteAddLayers() {
  const m = volteMapInstance;
  // Bei schnellem Stilwechsel kann idle feuern, bevor der neue Stil fertig ist -
  // addSource/addLayer wirft dann "Style is not done loading".
  if (!m || !m.isStyleLoaded()) return;
  if (!m.getSource(VOLTE_FELD_SRC)) {
    m.addSource(VOLTE_FELD_SRC, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    m.addLayer({ id: "volte-feld-fill", type: "fill", source: VOLTE_FELD_SRC, paint: { "fill-color": "#22c55e", "fill-opacity": .3 } });
    m.addLayer({ id: "volte-feld-line", type: "line", source: VOLTE_FELD_SRC, paint: { "line-color": "#22c55e", "line-width": 2 } });
  }
  if (!m.getSource(VOLTE_SRC)) {
    m.addSource(VOLTE_SRC, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    m.addLayer({ id: "volte-line", type: "line", source: VOLTE_SRC,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#38bdf8", "line-width": 3 } });
  }
}
// Geometrie in die Quellen schreiben. Laeuft auch bei jedem idle mit, damit ein
// Stilwechsel (der alle Quellen leert) die gesetzten Punkte nicht verschluckt.
function volteSyncData() {
  if (!volteMapInstance) return;
  const line = volteMapInstance.getSource(VOLTE_SRC);
  if (line) line.setData(voltePoints.volte.length > 1
    ? { type: "Feature", geometry: { type: "LineString", coordinates: voltePoints.volte } }
    : { type: "FeatureCollection", features: [] });
  const feld = volteMapInstance.getSource(VOLTE_FELD_SRC);
  if (feld) feld.setData(voltePoints.feld.length > 2
    ? { type: "Feature", geometry: { type: "Polygon", coordinates: [[...voltePoints.feld, voltePoints.feld[0]]] } }
    : { type: "FeatureCollection", features: [] });
}
function volteRedraw() {
  if (!volteMapInstance) return;
  volteAddLayers();
  volteSyncData();
  volteMarkers.forEach(mk => mk.remove());
  volteMarkers = [];
  ["volte", "feld"].forEach(key => voltePoints[key].forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "volte-pt" + (key === "feld" ? " volte-pt-feld" : "");
    el.textContent = i + 1;
    volteMarkers.push(new maplibregl.Marker({ element: el }).setLngLat(c).addTo(volteMapInstance));
  }));
  volteUpdateOutput();
}
function volteUpdateOutput() {
  const st = document.getElementById("volteStatus");
  const n = voltePoints.volte.length, f = voltePoints.feld.length;
  st.textContent = `Volte: ${n} Punkt${n === 1 ? "" : "e"} · Landefeld: ${f} Punkt${f === 1 ? "" : "e"}`;
  const card = document.getElementById("volteOutCard");
  if (!n && !f) { card.hidden = true; return; }
  card.hidden = false;
  const fmt = arr => arr.map(c => `      [${c[0].toFixed(6)}, ${c[1].toFixed(6)}]`).join(",\n");
  const parts = [];
  if (n) parts.push(`    volte: [\n${fmt(voltePoints.volte)}\n    ]`);
  if (f) parts.push(`    feld: [\n${fmt(voltePoints.feld)}\n    ]`);
  document.getElementById("volteOut").value =
    `// ${volteSpot ? volteSpot.name : "?"} – ${volteSpot ? volteSpot.id : "?"}\n  pattern: {\n${parts.join(",\n")}\n  },`;
}
async function volteOpenSpot(id) {
  const s = getSpot(id);
  if (!s) return;
  volteSpot = s;
  voltePoints = { volte: [], feld: [] };
  document.getElementById("volteSpotName").textContent = `2. Punkte antippen – ${s.name}`;
  document.getElementById("volteMapCard").hidden = false;
  // Auf den Landeplatz zentrieren, dort wird die Volte geflogen
  const lat = s.landeLat != null ? s.landeLat : s.lat;
  const lon = s.landeLon != null ? s.landeLon : s.lon;
  try { await loadMapLibre(); } catch (e) { document.getElementById("volteMap").innerHTML = `<p class="empty">${e.message}</p>`; return; }
  if (volteMapInstance) { volteMapInstance.remove(); volteMapInstance = null; volteMarkers = []; }
  volteMapInstance = new maplibregl.Map({
    container: "volteMap", style: MINI_MAP_STYLES[volteStyleMode],
    center: [lon, lat], zoom: 16, attributionControl: false,
  });
  volteMapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  document.getElementById("volteAttrib").textContent = attribTextFor(volteStyleMode);
  // Ebenen UND Geometrie nach jedem Stilwechsel neu aufbauen (setStyle wirft beides weg).
  // Marker bleiben aussen vor - die sind DOM und ueberleben den Stilwechsel ohnehin.
  volteMapInstance.on("idle", () => { volteAddLayers(); volteSyncData(); });
  volteMapInstance.on("click", e => {
    voltePoints[volteMode].push([e.lngLat.lng, e.lngLat.lat]);
    volteRedraw();
  });
  volteRedraw();
  document.getElementById("volteMapCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------------- Router ----------------
const PAGES = {
  home:      { title: "GoFlyToday", sub: "Wetter. Startplätze. Entscheidung." },
  favorites: { title: "Favoriten", sub: "Deine Plätze · 5-Tage-Ansicht" },
  add:       { title: "Fluggebiet hinzufügen", sub: "Aus Datenbank oder eigenen Platz" },
  volte:     { title: "Landevolte zeichnen", sub: "Punkte antippen, Text schicken" },
  info:      { title: "Info & Recht", sub: "Wie die App funktioniert" },
};
function route() {
  let id = location.hash.replace("#/", "") || "home";
  if (typeof profileModal !== "undefined" && !profileModal.hidden) { profileModal.hidden = true; profileHistoryPushed = false; }   // Tab gewechselt: Profil-Seite zu
  if (!PAGES[id]) id = "home";
  document.querySelectorAll(".page").forEach(p => p.hidden = p.id !== "page-" + id);
  document.body.classList.toggle("route-home", id === "home");   // Startseite: Header transparent über dem Bild
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === id));
  document.getElementById("pageTitle").textContent = PAGES[id].title;
  document.getElementById("pageSub").textContent = PAGES[id].sub;
  window.scrollTo(0, 0);
  if (id === "favorites") { renderFavorites(); renderDbSearch(document.getElementById("favDbSearch").value, "favDbResults"); }
  if (id === "add") { renderDbSearch(); renderUserSpots(); }
  if (id === "volte") {
    renderVolteSearch(document.getElementById("volteSearch").value);
    if (volteMapInstance) setTimeout(() => volteMapInstance.resize(), 60);
  }
  if (id === "home") {
    updateGreeting();
    // Karte ist die Standardansicht - Marker/Overlay muessen auch ohne Klick auf "Karte" bereitstehen.
    if (!document.getElementById("mapView").hidden) {
      ensureMap().then(() => {
        mapInstance.resize();
        updateMapMarkers(displayRowsFor(lastRows), { flyTo: false });
      }).catch(e => { document.getElementById("mapEl").innerHTML = `<p class="empty">${e.message}</p>`; });
    }
    // Nordstern: beim Öffnen sofort die Antwort zeigen.
    const out = document.getElementById("flyResults");
    if (localStorage.getItem("flugwetter_geo_ok") === "1" && !lastOrigin) {
      startGpsSearch();                                  // GPS schon erlaubt -> Umkreis-Liste
    } else if (!lastOrigin && profil.home && !out.innerHTML.trim()) {
      runFlySearch(profil.home.lat, profil.home.lon, profil.home.name);   // Heimatgebiet aus dem Profil
    } else if (!lastOrigin && !out.innerHTML.trim()) {
      // Die Regionsauswahl ist weg - also auch keine "letzte Region" mehr beim Start
      try { localStorage.removeItem("flugwetter_lastregion"); } catch {}
      renderFirstRun();                                  // erster Start: klarer Einstieg
      renderFirstRunMap();                               // ...und dasselbe als Overlay auf der Karte
    }
  }
}
window.addEventListener("hashchange", route);

// ---------------- Beim Neuladen dort bleiben, wo man war ----------------
// Runterziehen laedt die Seite neu. Der Stand (Seite, Suche, Karte, offene Fenster, Scrollstelle)
// wird beim Verlassen in sessionStorage gesichert und beim Start wiederhergestellt - nur im selben
// Tab und hoechstens 3 Stunden alt (sonst startet die App normal).
const ZUSTAND_KEY = "flugwetter_zustand", ZUSTAND_MAX_MS = 3 * 3600 * 1000;
function zustandSpeichern() {
  try {
    const dtab = document.querySelector("#detailBody .dtab.on");
    const z = {
      t: Date.now(), hash: location.hash, y: Math.round(window.scrollY),
      view: document.getElementById("mapView").hidden ? "list" : "map",
      day: searchDay, origin: lastOrigin ? { lat: lastOrigin.lat, lon: lastOrigin.lon, label: lastOrigin.label } : null,
      karte: mapInstance ? { center: [mapInstance.getCenter().lng, mapInstance.getCenter().lat], zoom: mapInstance.getZoom() } : null,
      detail: currentDetailSpot && !document.getElementById("detailModal").hidden ? { id: currentDetailSpot.id, tab: dtab ? dtab.dataset.tab : "wetter" } : null,
      profil: typeof profileModal !== "undefined" && !profileModal.hidden ? { tab: profileModal.dataset.tab || "profil" } : null,
      settings: typeof settingsModal !== "undefined" && !settingsModal.hidden,
    };
    sessionStorage.setItem(ZUSTAND_KEY, JSON.stringify(z));
  } catch {}
}
window.addEventListener("pagehide", zustandSpeichern);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") zustandSpeichern(); });
function zustandLaden() {
  try {
    const z = JSON.parse(sessionStorage.getItem(ZUSTAND_KEY));
    if (!z || Date.now() - z.t > ZUSTAND_MAX_MS || z.hash !== location.hash) return null;
    // Nur beim Neuladen (nicht beim ersten Start in einem neuen Tab)
    const nav = performance.getEntriesByType("navigation")[0];
    return nav && nav.type !== "reload" && nav.type !== "back_forward" ? null : z;
  } catch { return null; }
}
async function zustandAnwenden(z) {
  try {
    const home = !z.hash || z.hash === "#/home" || z.hash === "#/";
    if (home && z.origin) {
      searchDay = z.day === 1 ? 1 : 0;
      document.querySelectorAll("#dayToggle .rpill").forEach(x => x.classList.toggle("on", parseInt(x.dataset.day, 10) === searchDay));
      updateGreeting();
      await runFlySearch(z.origin.lat, z.origin.lon, z.origin.label, { keepView: true });
      if (z.view === "list") document.querySelector('#viewToggle [data-view="list"]').click();
      else if (z.karte) { await ensureMap(); mapInstance.jumpTo({ center: z.karte.center, zoom: z.karte.zoom }); }
    }
    if (z.detail) {
      await openDetail(z.detail.id);
      if (z.detail.tab && z.detail.tab !== "wetter") { const tb = document.querySelector(`#detailBody .dtab[data-tab="${z.detail.tab}"]`); if (tb) tb.click(); }
    }
    if (z.profil) profilOeffnen(z.profil.tab);
    if (z.settings) openSettings();
    if (z.y) setTimeout(() => window.scrollTo(0, z.y), 150);
  } catch {}
}

// ---------------- Events ----------------
// (Der „Wo kann ich fliegen?"-Button und die PLZ-Suche sind oben registriert.)

// Favoriten-Stern & Löschen (Event-Delegation über die ganze Seite)
document.body.addEventListener("click", e => {
  if (e.target.closest("a")) return;   // echte Links (Navigation/Deep-Links) normal öffnen lassen

  // Filter-Feld / Ebenen-Menue der Briefing-Karte schliessen, wenn daneben getippt
  // Offenes ☰-Menü schließen, wenn außerhalb geklickt
  if (!e.target.closest(".dt-menu-wrap")) {
    document.querySelectorAll(".dt-menu:not([hidden])").forEach(m => {
      m.hidden = true; m.parentElement.querySelector(".dt-menu-btn")?.setAttribute("aria-expanded", "false");
    });
  }
  // Detailfenster schließen (X)
  if (e.target.closest("[data-detailclose]")) { closeDetail(); return; }
  // Kopfleiste: Zahnrad öffnet die echte Einstellungsseite, Glocke den Hinweis-Dialog
  if (e.target.closest("#settingsBtn")) { openSettings(); return; }
  if (e.target.closest("#notifBtn")) { openNotif(); return; }
  // ☰-Menü auf/zu
  const mBtn = e.target.closest(".dt-menu-btn");
  if (mBtn) {
    const menu = mBtn.parentElement.querySelector(".dt-menu");
    const open = menu.hidden; menu.hidden = !open; mBtn.setAttribute("aria-expanded", String(open));
    return;
  }
  // Menü: Teilen
  const shBtn = e.target.closest("[data-share]");
  if (shBtn) {
    const s = getSpot(shBtn.dataset.share);
    const txt = `Schau dir „${s ? s.name : "diesen Startplatz"}" auf GoFlyToday an – in 5 Sek. sehen, ob's heute passt:`;
    // Eigener Link je Startplatz (?spot=db_123): oeffnet beim Empfaenger direkt dieses Gebiet.
    // Eigene Plaetze gibt es nur auf dem eigenen Geraet - die bleiben beim App-Link.
    const url = s && s.id.startsWith("db_") ? "https://goflytoday.de/?spot=" + encodeURIComponent(s.id) : "https://goflytoday.de";
    if (navigator.share) navigator.share({ title: "GoFlyToday", text: txt, url }).catch(() => {});
    else if (navigator.clipboard) { navigator.clipboard.writeText(txt + " " + url); shBtn.textContent = "✓ Kopiert"; }
    const menu = shBtn.closest(".dt-menu"); if (menu && navigator.share) menu.hidden = true;
    return;
  }

  // Detailfenster: Tab Wetter <-> Live <-> Details umschalten
  const tab = e.target.closest(".dtab");
  if (tab) {
    const wrap = tab.closest("#detailBody"); if (!wrap) return;
    wrap.querySelectorAll(".dtab").forEach(t => t.classList.toggle("on", t === tab));
    wrap.querySelectorAll(".dtab-panel").forEach(p => { p.hidden = p.id !== "dtab-" + tab.dataset.tab; });
    return;
  }
  // Karte vergroessern/verkleinern - MapLibre muss die neue Groesse mitbekommen
  // Karte verschoben -> hier neu suchen
  const hierBtn = e.target.closest("#mapHierBtn");
  if (hierBtn) {
    hierBtn.hidden = true;
    const c = mapInstance.getCenter();
    (async () => {
      const ort = await reverseGeocode(c.lat, c.lng);
      // keepView: der Nutzer hat den Ausschnitt bewusst gewaehlt - nicht wegzoomen
      await runFlySearch(c.lat, c.lng, ort || `${c.lat.toFixed(3)}, ${c.lng.toFixed(3)}`, { keepView: true });
    })();
    return;
  }
  // Karte unten (nach Tipp auf einen Startplatz): Details oeffnen / schliessen
  const ucGo = e.target.closest("[data-ucgo]");
  if (ucGo) { openDetail(ucGo.dataset.ucgo); return; }
  if (e.target.closest("[data-ucx]")) { umgKarteZu(); return; }
  // Filter-Feld, Umgebung: Zeile an-/abhaken (gilt erst mit "Filter anwenden")
  const fsRow = e.target.closest("[data-fscat]");
  if (fsRow) {
    const cat = fsRow.dataset.fscat;
    fsPending[cat] = !fsPending[cat];
    fsRow.classList.toggle("on", !!fsPending[cat]);
    fsRow.setAttribute("aria-checked", fsPending[cat] ? "true" : "false");
    fsUpdateCount();
    return;
  }

  // Marker-Kasten: zwischen Aktionen und der vollen Datenliste umschalten
  const poiInfoBtn = e.target.closest("[data-poi-info], [data-poi-back]");
  if (poiInfoBtn) {
    const pop = poiInfoBtn.closest(".poi-pop");
    const zeigen = poiInfoBtn.hasAttribute("data-poi-info");
    pop.querySelector(".poi-pop-acts").hidden = zeigen;
    pop.querySelector(".poi-pop-detail").hidden = !zeigen;
    return;
  }

  // Langer Druck auf die Karte -> Formular unter "Neu" mit den Koordinaten öffnen
  const npBtn = e.target.closest("[data-neuerplatz]");
  if (npBtn) {
    const [lat, lon] = npBtn.dataset.neuerplatz.split(",").map(Number);
    const ort = npBtn.dataset.ort, hoehe = npBtn.dataset.hoehe;
    lpAufraeumen();
    neuerPlatzAus(lat, lon, ort, hoehe);
    return;
  }

  // Briefing, Schritt Landeplatz: zwischen mehreren Landeplätzen umschalten
  const lpTab = e.target.closest(".lp-tab");
  if (lpTab) {
    const box = lpTab.closest(".lp-box");
    box.querySelectorAll(".lp-tab").forEach(t => t.classList.toggle("on", t === lpTab));
    box.querySelectorAll(".lp-panel").forEach(p => { p.hidden = p.dataset.lppanel !== lpTab.dataset.lptab; });
    return;
  }

  // DHV-Bemerkung im Details-Tab: Kurzfassung <-> Volltext umschalten
  const remarkBtn = e.target.closest("[data-remark-toggle]");
  if (remarkBtn) {
    const box = remarkBtn.closest(".dhv-remark");
    const short = box.querySelector(".dhv-remark-short");
    const full = box.querySelector(".dhv-remark-full");
    const showFull = full.hidden;
    full.hidden = !showFull; short.hidden = showFull;
    remarkBtn.textContent = showFull ? "weniger" : "mehr";
    return;
  }

  // Kartenstil umschalten (Karte/Satellit/Gelände)
  const styleBtn = e.target.closest(".mini-style-btn");
  if (styleBtn) {
    const mode = styleBtn.dataset.ministyle;
    styleBtn.parentElement.querySelectorAll(".mini-style-btn").forEach(b => b.classList.toggle("on", b === styleBtn));
    mapStyleMode = mode;
    if (mapInstance) mapInstance.setStyle(MINI_MAP_STYLES[mode]);
    const at = document.getElementById("mapAttrib"); if (at) at.textContent = attribTextFor(mode);
    return;
  }


  // Tap auf eine Stunde -> Kompass des jeweiligen Tages färbt sich ein, Info-Leiste darunter zeigt Details
  const hcell = e.target.closest(".h[data-info]");
  if (hcell) {
    const card = hcell.closest(".card");
    if (card) card.querySelectorAll(".h.sel").forEach(x => x.classList.remove("sel"));
    hcell.classList.add("sel");
    const dayEl = hcell.closest(".day");
    const scpWrap = dayEl && dayEl.querySelector(".scp-day-wrap");
    const spotForCompass = card && getSpot(card.dataset.spot);
    if (scpWrap && spotForCompass && hcell.dataset.wd) {
      scpWrap.innerHTML = spotCompassSvg(spotForCompass, +hcell.dataset.wd, { compact: true, needle: true, rating: hcell.dataset.rating });
    }
    const hd = dayEl && dayEl.querySelector(".hour-detail");
    if (hd) {
      const rea = hcell.dataset.reason, rating = hcell.dataset.rating;
      hd.innerHTML = hcell.dataset.info + (rea ? ` · <span class="hd-reason ${rating}">${rea}</span>` : "");
      hd.hidden = false;
    }
    // Dasselbe Antippen öffnet/aktualisiert das Windprofil direkt unter diesem Tag
    if (hcell.dataset.iso && dayEl) wpAntippen(dayEl, hcell.dataset.iso, hcell.dataset.hourlabel || "");
    return;
  }

  // "Nur Favoriten"-Filter in der Ergebnisliste
  if (e.target.closest("#favOnlyBtn")) {
    favOnlyFilter = !favOnlyFilter;
    applyFavSegUI();
    renderFlyResults(lastRows, lastHeadline, lastTruncated);
    updateMapMarkers(displayRowsFor(lastRows), { flyTo: false });
    return;
  }

  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) {
    toggleFav(favBtn.dataset.fav);
    if (!document.getElementById("page-favorites").hidden) {
      renderFavorites();
      renderDbSearch(document.getElementById("favDbSearch").value, "favDbResults");
    }
    if (!document.getElementById("page-add").hidden) renderDbSearch(document.getElementById("dbSearch").value);
    // Bei aktivem "Nur Favoriten"-Filter muss die Karte bei Entfernen aus der Liste verschwinden -> neu rendern.
    if (favOnlyFilter && favBtn.closest("#flyResults")) { renderFlyResults(lastRows, lastHeadline, lastTruncated); return; }
    // Fly-Ergebnisse-Stern sofort umschalten
    const s = favBtn.classList.toggle("on"); favBtn.textContent = favBtn.classList.contains("on") ? "★" : "☆";
    return;
  }
  const volteRow = e.target.closest("[data-volte-spot]");
  if (volteRow) { volteOpenSpot(volteRow.dataset.volteSpot); return; }
  const edit = e.target.closest("[data-edit]");
  if (edit) { startEditSpot(edit.dataset.edit); return; }
  const del = e.target.closest("[data-del]");
  if (del) {
    const id = del.dataset.del;
    const spot = loadUserSpots().find(s => s.id === id);
    if (confirm(`„${spot ? spot.name : "Dieser Platz"}“ wirklich löschen (auch aus den Favoriten)?`)) {
      saveUserSpots(loadUserSpots().filter(s => s.id !== id));
      saveFavs(loadFavs().filter(f => f !== id));
      if (editingSpotId === id) resetForm();   // gerade in Bearbeitung -> Formular freigeben
      renderUserSpots();
      renderFavorites();
    }
    return;
  }
  // Navi-Icon: eigener Link (Maps), nicht das Detail öffnen
  if (e.target.closest(".sc-nav")) return;
  // Klick auf eine Ergebnis-/Suchzeile -> 7-Tage-Detail (nicht erneut auslösen, wenn man schon
  // im offenen Detail-Fenster irgendwo danebenklickt - der ganze Kartenwrapper traegt data-spot).
  const row = e.target.closest("[data-spot]");
  if (row && !row.closest("#detailModal")) openDetail(row.dataset.spot);
});

// Wetter-Verlauf: Datum waehlen -> genau diesen Tag laden und als dieselbe Tages-Karte anzeigen.
// Eigene Notiz zum Platz - direkt beim Tippen sichern, damit nichts verloren geht,
// wenn das Detailfenster geschlossen wird. Leere Notiz raeumt den Eintrag wieder weg.
document.body.addEventListener("input", e => {
  const note = e.target.closest("[data-note]");
  if (!note) return;
  const key = "flugwetter_note_" + note.dataset.note;
  if (note.value.trim()) localStorage.setItem(key, note.value);
  else localStorage.removeItem(key);
});

document.body.addEventListener("change", e => {
  const dateEl = e.target.closest(".hist-date");
  if (!dateEl) return;
  const body = dateEl.nextElementSibling;
  const spot = getSpot(dateEl.dataset.hist);
  if (!dateEl.value) { body.innerHTML = ""; return; }
  body.innerHTML = ladeHtml(`Lade ${escHtml(dateEl.value)} …`);
  fetchHistoryDay(spot, dateEl.value).then(data => {
    const days = analyse(spot, data);
    body.innerHTML = days.length ? dayCardHtml(spot, days, 0) : `<p class="empty">Keine Daten für dieses Datum.</p>`;
  }).catch(err => { body.innerHTML = `<p class="empty">${err.message}</p>`; });
});

// DB-Suche
document.getElementById("dbSearch").addEventListener("input", e => renderDbSearch(e.target.value));
document.getElementById("favDbSearch").addEventListener("input", e => renderDbSearch(e.target.value, "favDbResults"));

// --- Formular „eigener Platz" ---
const COMPASS_16 = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const form = document.getElementById("spotForm");
const compassEl = document.getElementById("compass");
const selectedDirs = new Set();
COMPASS_16.forEach((label, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "cdir"; b.textContent = label;
  b.addEventListener("click", () => {
    if (selectedDirs.has(i)) { selectedDirs.delete(i); b.classList.remove("on"); }
    else { selectedDirs.add(i); b.classList.add("on"); }
  });
  compassEl.appendChild(b);
});
// Bearbeiten-Modus: dasselbe Formular, nur wird beim Speichern der bestehende
// Eintrag ueberschrieben statt ein neuer angelegt.
let editingSpotId = null;
function applyEditUI() {
  const editing = !!editingSpotId;
  document.getElementById("addFormTitle").textContent = editing ? "2. Eigenen Platz bearbeiten" : "2. Eigenen Platz anlegen";
  document.getElementById("saveSpotBtn").textContent = editing ? "Änderungen speichern" : "Speichern & favorisieren";
  document.getElementById("resetBtn").textContent = editing ? "Abbrechen" : "Leeren";
}
function startEditSpot(id) {
  const s = loadUserSpots().find(x => x.id === id);
  if (!s) return;
  editingSpotId = id;
  form.name.value = s.name || "";
  form.region.value = s.region || "";
  form.lat.value = s.lat; form.lon.value = s.lon;
  form.elevation.value = s.elevation != null ? s.elevation : "";
  form.windMin.value = s.windMin != null ? s.windMin : 3;
  form.windMax.value = s.windMax != null ? s.windMax : 26;
  form.gustMax.value = s.gustMax != null ? s.gustMax : 30;
  // Kompass-Auswahl aus dem gespeicherten sectorLabel zurueckholen (dort stehen genau
  // die COMPASS_16-Kuerzel, mit denen das Label beim Anlegen gebaut wurde).
  selectedDirs.clear();
  compassEl.querySelectorAll(".on").forEach(b => b.classList.remove("on"));
  (s.sectorLabel || "").split(",").forEach(part => {
    const i = COMPASS_16.indexOf(part.trim());
    if (i >= 0) { selectedDirs.add(i); compassEl.children[i].classList.add("on"); }
  });
  document.getElementById("formErr").hidden = true;
  applyEditUI();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}
function resetForm() {
  form.reset(); selectedDirs.clear();
  compassEl.querySelectorAll(".on").forEach(b => b.classList.remove("on"));
  document.getElementById("formErr").hidden = true;
  editingSpotId = null;
  applyEditUI();
}
document.getElementById("resetBtn").addEventListener("click", resetForm);
function coords() { return { lat: parseFloat(form.lat.value.replace(",", ".")), lon: parseFloat(form.lon.value.replace(",", ".")) }; }
document.getElementById("geoBtn").addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Standort nicht unterstützt.");
  navigator.geolocation.getCurrentPosition(async pos => {
    setUserPos(pos.coords.latitude, pos.coords.longitude);
    form.lat.value = pos.coords.latitude.toFixed(5); form.lon.value = pos.coords.longitude.toFixed(5); tryElevation();
  }, () => alert("Standort nicht verfügbar (Berechtigung?)."));
});
document.getElementById("elevBtn").addEventListener("click", tryElevation);
async function tryElevation() {
  const { lat, lon } = coords();
  if (isNaN(lat) || isNaN(lon)) return alert("Bitte zuerst gültige Koordinaten eingeben.");
  form.elevation.value = "…";
  try { form.elevation.value = await fetchElevation(lat, lon); } catch { form.elevation.value = ""; alert("Höhe konnte nicht ermittelt werden."); }
}
function dirsToSectors(idx) {
  return [...idx].sort((a, b) => a - b).map(i => { const c = i * 22.5; return [(c-11.25+360)%360, (c+11.25)%360]; });
}
function showErr(m) { const el = document.getElementById("formErr"); el.textContent = m; el.hidden = false; }
form.addEventListener("submit", async e => {
  e.preventDefault();
  const { lat, lon } = coords();
  if (!form.name.value.trim()) return showErr("Bitte einen Namen eingeben.");
  if (isNaN(lat) || lat < -90 || lat > 90) return showErr("Breitengrad ungültig (z. B. 47.5446).");
  if (isNaN(lon) || lon < -180 || lon > 180) return showErr("Längengrad ungültig (z. B. 10.0528).");
  if (selectedDirs.size === 0) return showErr("Bitte mindestens eine Windrichtung wählen.");
  let elevation = parseInt(form.elevation.value, 10);
  if (isNaN(elevation)) { try { elevation = await fetchElevation(lat, lon); } catch { elevation = null; } }
  const dirs = [...selectedDirs].sort((a, b) => a - b);
  const data = {
    name: form.name.value.trim(), region: form.region.value.trim(),
    lat, lon, elevation, sectors: dirsToSectors(selectedDirs),
    sectorLabel: dirs.map(i => COMPASS_16[i]).join(", "),
    windMin: parseFloat(form.windMin.value) || 0,
    windMax: parseFloat(form.windMax.value) || 30,
    gustMax: parseFloat(form.gustMax.value) || 35,
  };
  const list = loadUserSpots();
  if (editingSpotId) {
    const i = list.findIndex(s => s.id === editingSpotId);
    if (i >= 0) { list[i] = { ...list[i], ...data }; saveUserSpots(list); }
    resetForm();
    renderUserSpots();
    document.getElementById("userSpotList").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const spot = { id: "user_" + Date.now(), ...data };
  list.push(spot); saveUserSpots(list);
  const f = loadFavs(); f.push(spot.id); saveFavs(f);   // eigener Platz ist automatisch Favorit
  resetForm();
  renderUserSpots();
  location.hash = "#/home";
});

// ---------------- Start ----------------
// Glocke: grüner Punkt fällt erst weg, sobald der Sicherheitshinweis einmal geöffnet wurde.
const BELL_SEEN_KEY = "flugwetter_bell_seen";
function markBellSeen() {
  if (localStorage.getItem(BELL_SEEN_KEY) === "1") return;
  localStorage.setItem(BELL_SEEN_KEY, "1");
  document.querySelector("#notifBtn .hi-dot").hidden = true;
}

// Hinweis-Banner ausblendbar (Zustand merken)
const HINT_KEY = "flugwetter_hint_dismissed";
document.getElementById("hintClose").addEventListener("click", () => {
  document.getElementById("hintBanner").style.display = "none";
  localStorage.setItem(HINT_KEY, "1");
});

(function init() {
  // Migration: bestehende eigene Plätze (aus älterer Version) automatisch favorisieren.
  if (localStorage.getItem(FAV_KEY) === null) {
    const ids = loadUserSpots().map(s => s.id);
    saveFavs(ids);
  }
  if (localStorage.getItem(HINT_KEY) === "1") document.getElementById("hintBanner").style.display = "none";
  if (localStorage.getItem(BELL_SEEN_KEY) === "1") document.querySelector("#notifBtn .hi-dot").hidden = true;
  const r = localStorage.getItem("flugwetter_radius");
  if (r && document.querySelector(`#radiusPills .rpill[data-km="${r}"]`)) {
    document.querySelectorAll("#radiusPills .rpill").forEach(x => x.classList.toggle("on", x.dataset.km === r));
  }
  applyAccUI();
  applyHdUI();
  applyProUI();
  applyFavSegUI();
  profilUi();   // Punkt am Profil-Knopf, solange das Profil leer ist
  remBannerZeigen();
  // Neuladen (Runterziehen): dort weitermachen, wo man war - s. zustandSpeichern
  const zs = zustandLaden();
  if (zs && zs.origin && /^#?\/?(home)?$|^#\/home$/.test(location.hash)) lastOrigin = zs.origin;   // verhindert den Standard-Start (GPS / Heimat / Einstieg)
  route();
  // Geteilter Link: goflytoday.de/?spot=db_123 -> Detailfenster dieses Platzes direkt oeffnen
  let teilLink = false;
  try {
    const q = new URLSearchParams(location.search).get("spot");
    if (q) {
      history.replaceState(history.state, "", location.pathname + location.hash);   // Parameter weg, sonst bleibt er in der Leiste
      if (getSpot(q)) { teilLink = true; openDetail(q); }
    }
  } catch {}
  if (zs && !teilLink) zustandAnwenden(zs);
})();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
