// Flugwetter-App – Logik: Datenbank + Favoriten, Umkreissuche, Ampel, 3h-Fenster.

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MIN_WINDOW = 3;          // Fenster erst ab so vielen zusammenhängenden Stunden

// Toleranz-Profil für die Ampel-Bewertung (früher wählbar per Liga/Können - jetzt fest auf die
// sicherste/Anfänger-Stufe, Einordnung läuft stattdessen fein über den Farbverlauf, s. rateHour).
const PROFILE = { windMax: 18, gustMax: 26, dirTol: 16, buffer: true };
// Profi-Modus: erfahrene Piloten können eigene Wind-/Böen-/Richtungs-Grenzwerte hinterlegen statt
// der festen sicheren PROFILE-Werte (Opt-in in den Einstellungen, Standard: aus für alle).
let proMode = localStorage.getItem("flugwetter_promode") === "1";
let proWindMax = parseInt(localStorage.getItem("flugwetter_pro_windmax"), 10) || PROFILE.windMax;
let proGustMax = parseInt(localStorage.getItem("flugwetter_pro_gustmax"), 10) || PROFILE.gustMax;
let proDirTol = parseInt(localStorage.getItem("flugwetter_pro_dirtol"), 10) || PROFILE.dirTol;
function activeProfile() {
  return proMode ? { windMax: proWindMax, gustMax: proGustMax, dirTol: proDirTol, buffer: true } : PROFILE;
}
// Böendifferenz (Böen - Mittelwind, km/h): ab wann Turbulenz-Warnung (grenz) bzw. K.o. (nein).
const GUSTDIFF_WARN = 20, GUSTDIFF_BAD = 30;
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
  if (ws > windMax * 0.85) {
    return { rating: "grenz", reason: ws > windMax ? "sehr stark" : "recht stark", severity: clamp01((ws - windMax * 0.85) / (windMaxBuf - windMax * 0.85)) };
  }
  if (wg > gustMax * 0.85) {
    return { rating: "grenz", reason: wg > gustMax ? "sehr böig" : "böig", severity: clamp01((wg - gustMax * 0.85) / (gustMaxBuf - gustMax * 0.85)) };
  }
  return { rating: "gut", reason: "" };
}

function fmtHour(d) { return d.getHours().toString().padStart(2, "0") + ":00"; }
function fmtHourPlus(d) { return ((d.getHours() + 1) % 24).toString().padStart(2, "0") + ":00"; }

// Fenster (≥ MIN_WINDOW zusammenhängende flugbare Stunden). Farbe: gut=alle gut, sonst grenz.
function findWindows(hours) {
  const wins = []; let run = [];
  const flush = () => {
    if (run.length >= MIN_WINDOW) {
      const anyGrenz = run.some(h => h.rating === "grenz");
      wins.push({ from: run[0].t, to: run[run.length - 1].t, color: anyGrenz ? "grenz" : "gut", hours: run.length });
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
const WP_LEVELS = [1000, 975, 950, 925, 900, 850, 800, 700, 600];
const WP_BODEN = [10, 80, 120, 180];
async function fetchWindProfil(spot) {
  const key = wxKey("wp1", spot.lat, spot.lon);
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
  // Bis 2500 m ueber Grund zeichnen - darueber fliegt hier niemand, und eine Achse bis
  // 6000 m quetscht genau den Teil zusammen, auf den es beim Starten ankommt.
  const deckel = grund + 2500;
  const sichtbar = schichten.filter(s => s.hoehe <= deckel);
  const darueber = schichten.filter(s => s.hoehe > deckel);
  const liste = sichtbar.length >= 2 ? sichtbar : schichten.slice(0, 5);
  const yTop = Math.max(...liste.map(s => s.hoehe));
  const spanne = Math.max(yTop - grund, 300);
  const yUnten = grund - spanne * 0.07;           // schmales Band fuers Gelaende
  const xMax = Math.max(20, Math.ceil(Math.max(...liste.map(s => s.ws)) * 1.3 / 10) * 10);

  const W = 300, H = 196, mL = 44, mR = 74, mT = 10, mB = 24, band = 10;
  const px = ws => mL + (ws / xMax) * (W - mL - mR);
  // Wurzel-Achse statt linear: die vier Bodenwerte liegen innerhalb von 180 m, die
  // Modellflaechen ueber 1000 m auseinander. Linear waere genau der Startbereich - der
  // wichtigste - ein Pixelklumpen. Die beschrifteten Hilfslinien zeigen die Stauchung.
  const wurzel = h => Math.sqrt(Math.max(0, h - grund));
  const wMax = wurzel(yTop) || 1;
  const yNull = H - mB - band;
  const py = h => yNull - (wurzel(h) / wMax) * (yNull - mT);

  // Wenige, weit auseinanderliegende Hilfslinien - in der Tageszeile ist kein Platz fuer mehr
  const linien = [];
  [0, 250, 1000, 2500].filter(o => o <= yTop - grund).forEach(o => {
    const h = grund + o, y = py(h);
    linien.push(`<line x1="${mL}" y1="${y.toFixed(1)}" x2="${W - mR}" y2="${y.toFixed(1)}" class="wp-grid"/>
      <text x="${mL - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" class="wp-ax">${wpZahl(Math.round(h / 10) * 10)}</text>`);
  });
  const xTicks = [];
  for (let v = 0; v <= xMax; v += xMax > 40 ? 20 : 10) {
    xTicks.push(`<line x1="${px(v).toFixed(1)}" y1="${mT}" x2="${px(v).toFixed(1)}" y2="${yNull.toFixed(1)}" class="wp-grid"/>
      <text x="${px(v).toFixed(1)}" y="${H - mB + 13}" text-anchor="middle" class="wp-ax">${v}</text>`);
  }
  const gelaende = `<rect x="${mL}" y="${yNull.toFixed(1)}" width="${W - mL - mR}" height="${band}" class="wp-boden"/>`;
  // Startplatzhoehe laut DHV - weicht meist leicht von der Modell-Gelaendehoehe ab
  const sp = spot.elevation != null && spot.elevation > grund && spot.elevation <= yTop
    ? `<line x1="${mL}" y1="${py(spot.elevation).toFixed(1)}" x2="${W - mR}" y2="${py(spot.elevation).toFixed(1)}" class="wp-start"/>` : "";

  const pfad = liste.map((s, i) => `${i ? "L" : "M"}${px(s.ws).toFixed(1)} ${py(s.hoehe).toFixed(1)}`).join(" ");
  // Zwei Punkte koennen nur wenige Meter auseinanderliegen (180 m ueber Grund und die
  // erste Modellflaeche). Dann nur einen Wert beschriften, sonst ueberdrucken sie sich.
  let letzteY = Infinity;
  const punkte = liste.map(s => {
    const x = px(s.ws), y = py(s.hoehe);
    const farbe = s.quelle === "boden" ? "var(--green)" : "var(--wp-oben)";
    const passt = inSectors(s.wd, spot.sectors, activeProfile().dirTol);
    const platz = Math.abs(y - letzteY) >= 11;
    if (platz) letzteY = y;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${farbe}"/>` + (platz
      ? `${wpPfeil(x + 11, y, s.wd, passt ? "var(--green)" : "var(--muted)")}
         <text x="${(x + 18).toFixed(1)}" y="${(y + 3).toFixed(1)}" class="wp-val">${s.ws.toFixed(1).replace(".", ",")}<tspan class="wp-dir"> ${degToCompass(s.wd)}</tspan></text>` : "");
  }).join("");

  const oben = darueber.length
    ? `<div class="wp-oben">↑ ${darueber.map(s => `${wpZahl(s.hoehe)} m: ${Math.round(s.ws)} ${degToCompass(s.wd)}`).join(" · ")}</div>` : "";
  return `<div class="wp-kopf"><span class="wp-stunde">Windprofil · ${escHtml(stundeLabel)}</span>
      <span class="wp-legende"><i class="wp-pt gruen"></i>über Grund<i class="wp-pt blau"></i>Modell</span></div>
    <svg class="wp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Windprofil">
      <text x="0" y="8" class="wp-ax">m ü. NN</text>
      <text x="${W - mR}" y="${H - 4}" text-anchor="end" class="wp-ax">km/h</text>
      ${xTicks.join("")}${linien.join("")}${gelaende}${sp}
      <path d="${pfad}" class="wp-linie"/>
      ${punkte}
    </svg>
    ${oben}
    <p class="wp-note">Pfeil = Herkunft, grün = passt zur Startrichtung. Modell ~2 km, kein Talwind, keine Thermik.</p>`;
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
function saveFavs(l) { localStorage.setItem(FAV_KEY, JSON.stringify(l)); }
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
let lastCampList = [];   // damit die Marker auch ankommen, wenn die Karte spaeter fertig wird
let lastParkList = [];

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

async function fetchNearbyPois(lat, lon, sLat, sLon) {
  // poi4 = zusaetzlich Telefon/Adresse/Oeffnungszeiten fuers Marker-Fenster
  const key = `poi4_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) { const c = JSON.parse(raw); if (Date.now() - c.t < CAMP_TTL) return c.v; }
  } catch {}
  const uebernacht = `^(camp_site|caravan_site)$`;
  const teil = (kind, filter, r, la, lo) => `${kind}${filter}(around:${r},${la},${lo});`;
  const q = `[out:json][timeout:25];(`
    + teil("node", `["tourism"~"${uebernacht}"]`, CAMP_RADIUS_M, lat, lon)
    + teil("way", `["tourism"~"${uebernacht}"]`, CAMP_RADIUS_M, lat, lon)
    + teil("node", `["amenity"="parking"]`, PARK_RADIUS_M, lat, lon)
    + teil("way", `["amenity"="parking"]`, PARK_RADIUS_M, lat, lon)
    + (sLat != null ? teil("node", `["amenity"="parking"]`, PARK_RADIUS_M, sLat, sLon)
                    + teil("way", `["amenity"="parking"]`, PARK_RADIUS_M, sLat, sLon) : "")
    + `);out center 400;`;
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST", signal: ctrl.signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(q),
    });
    if (!res.ok) throw new Error("Overpass " + res.status);
    const data = await res.json();
    const list = (data.elements || []).map(e => {
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
    }).filter(Boolean);
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: list })); } catch {}
    return list;
  } catch { return null; }
  finally { clearTimeout(to); }
}
function campRowHtml(c, i) {
  const km = c.dist < 1 ? Math.round(c.dist * 1000) + " m" : c.dist.toFixed(1).replace(".", ",") + " km";
  // Ausstattung: hoechstens vier, sonst wird die Zeile unruhig
  const aus = (c.aus || []).slice(0, 4).map(k => {
    const a = CAMP_AUS[k]; if (!a) return "";
    return `<span class="camp-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${a.ic}</svg>${a.label}</span>`;
  }).join("");
  const zusatz = c.parken && c.gratis === true ? " · kostenlos" : c.parken && c.gratis === false ? " · gebührenpflichtig" : "";
  return `<div class="camp-row">
    <img class="camp-pin" src="${campPin(c.type)}" alt="">
    <div class="camp-main">
      <div class="camp-name">${escHtml(c.name)}</div>
      <div class="camp-sub">${km}<span data-camp-dur="${i}"></span> · ${campTypeLabel(c.type)}${zusatz}</div>
      ${aus ? `<div class="camp-tags">${aus}</div>` : ""}
    </div>
    <a class="camp-act" href="${mapsUrl(c)}" target="_blank" rel="noopener" aria-label="Navigation">${NAV_ICON}</a>
    ${c.web ? `<a class="camp-act" href="${escHtml(c.web)}" target="_blank" rel="noopener" aria-label="Website">${IC_GLOBE}</a>` : ""}
  </div>`;
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
function infosLande(spot, l) {
  const rows = [["Höhe", l.hoehe != null ? l.hoehe + " m ü. NN" : ""]];
  if (l.lat != null && spot.lat != null) {
    const km = haversineExact(spot.lat, spot.lon, l.lat, l.lon);
    rows.push(["Entfernung zum Start", distTxt(km)]);
    if (l.hoehe != null && spot.elevation != null && spot.elevation > l.hoehe) {
      const dh = spot.elevation - l.hoehe;
      rows.push(["Höhenabstand", `${dh} m tiefer`]);
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

function poiPopupHtml(c, titel, pin, untertitel, infos) {
  const zeilen = [];
  if (c.adresse) zeilen.push(c.adresse);
  if (c.plaetze) zeilen.push(`${escHtml(c.plaetze)} Stellplätze`);
  if (c.saison) zeilen.push(`Geöffnet: ${escHtml(c.saison)}`);
  if (c.aus && c.aus.length) zeilen.push(c.aus.map(k => (CAMP_AUS[k] || {}).label).filter(Boolean).join(" · "));
  const akt = [];
  akt.push(`<a class="poi-act primary" href="${mapsUrl(c)}" target="_blank" rel="noopener">${IC_CAR}Hierhin navigieren</a>`);
  if (c.web) akt.push(`<a class="poi-act" href="${escHtml(c.web)}" target="_blank" rel="noopener">${IC_GLOBE}Website</a>`);
  if (c.tel) akt.push(`<a class="poi-act" href="tel:${escHtml(c.tel.replace(/\s/g, ""))}">${IC_PHONE}Anrufen</a>`);
  // Satellitenbild: war vorher der einzige Marker-Klick, bleibt als Option erhalten
  akt.push(`<a class="poi-act" href="${satMapsUrl(c.lat, c.lon)}" target="_blank" rel="noopener">${IC_SAT}Satellitenbild</a>`);
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
let lpKlickSperre = false, lpSperreZeit = 0;   // der Klick nach dem langen Druck darf nicht suchen
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
  lpKlickSperre = true; lpSperreZeit = Date.now();
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
function campAddMarkers(list) {
  campMarkers.forEach(m => m.remove());
  campMarkers = [];
  if (!miniMapInstance || typeof maplibregl === "undefined") return;
  list.forEach(c => {
    const el = document.createElement("div");
    el.className = "camp-marker";
    el.title = `${c.name} · ${campTypeLabel(c.type)}`;
    el.innerHTML = `<img src="${campPin(c.type)}" alt="">`;
    const km = c.dist == null ? "" : c.dist < 1 ? `${Math.round(c.dist * 1000)} m` : `${c.dist.toFixed(1).replace(".", ",")} km`;
    const sub = [campTypeLabel(c.type), km, c.gratis === true ? "kostenlos" : c.gratis === false ? "gebührenpflichtig" : ""].filter(Boolean).join(" · ");
    campMarkers.push(new maplibregl.Marker({ element: el })
      .setLngLat([c.lon, c.lat])
      .setPopup(poiPopup(poiPopupHtml(c, c.name, campPin(c.type), sub)))
      .addTo(miniMapInstance));
  });
}
async function loadCampsites(spot) {
  const sec = document.getElementById("campSection");
  if (!sec) return;
  lastCampList = []; lastParkList = [];   // Treffer des zuvor geoeffneten Platzes verwerfen
  const lat = spot.landeLat != null ? spot.landeLat : spot.lat;
  const lon = spot.landeLon != null ? spot.landeLon : spot.lon;
  sec.innerHTML = `<p class="loading-line">Umgebung wird gesucht …</p>`;
  const raw = await fetchNearbyPois(lat, lon, spot.lat, spot.lon);
  const wrap = document.getElementById("campSection");
  if (!wrap) return;                       // Tab inzwischen verlassen
  if (!raw || !raw.length) { wrap.innerHTML = ""; return; }
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
      const d = haversineExact(z.lat, z.lon, c.lat, c.lon);
      if (d < bestD) { bestD = d; best = z; }
    }
    return { ...c, dist: bestD, zielName: best.name };
  });
  const sortiert = arr => arr.sort((a, b) => (a.name === "Ohne Namen") - (b.name === "Ohne Namen") || a.dist - b.dist);
  const list = sortiert(mitDist.filter(c => !c.parken)).slice(0, CAMP_MAX);
  // Getrennt deckeln: die Parkplaetze am Landeplatz liegen meist naeher, sonst waeren
  // die am Startplatz nach reiner Entfernungssortierung nie dabei.
  const parken = mitDist.filter(c => c.parken);
  lastParkList = [
    ...sortiert(parken.filter(c => c.zielName === "Startplatz")).slice(0, PARK_MAX),
    ...sortiert(parken.filter(c => c.zielName !== "Startplatz")).slice(0, PARK_MAX),
  ];
  lastCampList = list;
  wrap.innerHTML = list.length ? campSectionHtml(list) : "";
  renderParkplaetze();
  campAddMarkers([...list, ...lastParkList]);

  // Fahrzeiten nachladen (OSRM) und die Zeilen ergaenzen. Bewusst NACH dem ersten
  // Rendern: die Liste steht sofort, die Zeiten kommen nach - faellt OSRM aus,
  // bleibt einfach die Entfernung stehen.
  try {
    const secs = await fetchDriveTimes({ lat, lon }, list);
    if (!document.getElementById("campSection")) return;   // Tab inzwischen verlassen
    secs.forEach((s, i) => {
      if (s == null) return;
      const el = document.querySelector(`[data-camp-dur="${i}"]`);
      if (el) el.textContent = " · " + formatDur(s);
    });
  } catch {}
}
const CAMP_AUS = {
  zelt:      { label: "Zelt",       ic: `<path d="M12 4 3 20h18z"/><path d="M12 4v16"/>` },
  wohnwagen: { label: "Wohnwagen",  ic: `<path d="M3 16V9a2 2 0 0 1 2-2h11a4 4 0 0 1 4 4v5"/><path d="M3 16h3M11 16h9"/><circle cx="8.5" cy="16" r="2"/>` },
  dusche:    { label: "Dusche",     ic: `<path d="M4 20V8a4 4 0 0 1 8 0"/><path d="M9 8h9"/><path d="M15 12v.01M18 12v.01M15 16v.01M18 16v.01M12 14v.01"/>` },
  strom:     { label: "Strom",      ic: `<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>` },
  wc:        { label: "WC",         ic: `<circle cx="8" cy="4" r="2"/><path d="M6 22v-6H4l2.5-7h3L12 16h-2v6z"/><circle cx="17" cy="4" r="2"/><path d="M14.5 22 17 9l2.5 13"/>` },
  wasser:    { label: "Trinkwasser",ic: `<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/>` },
};
// Parkplätze gehören in Schritt 1 (Anreise), kommen aber erst mit der Overpass-Antwort.
// Deshalb rendert loadCampsites sie nachträglich in den Platzhalter dort.
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
function renderParkplaetze() {
  const box = document.getElementById("parkSection");
  if (!box) return;
  if (!lastParkList.length) { box.innerHTML = ""; return; }
  const amStart = lastParkList.filter(p => p.zielName === "Startplatz");
  const amLande = lastParkList.filter(p => p.zielName !== "Startplatz");
  const teile = [];
  if (amStart.length) teile.push(`${amStart.length} am Startplatz`);
  if (amLande.length) teile.push(`${amLande.length} am Landeplatz`);
  const zeile = p => {
    const km = p.dist < 1 ? Math.round(p.dist * 1000) + " m" : p.dist.toFixed(1).replace(".", ",") + " km";
    const geb = p.gratis === true ? " · kostenlos" : p.gratis === false ? " · gebührenpflichtig" : "";
    return `<div class="camp-row">
      <img class="camp-pin" src="${PIN.parkplatz}" alt="">
      <div class="camp-main">
        <div class="camp-name">${escHtml(p.name)}</div>
        <div class="camp-sub">${km} zu ${escHtml(p.zielName || "Landeplatz")}${geb}</div>
      </div>
      <a class="camp-act" href="${mapsUrl(p)}" target="_blank" rel="noopener" aria-label="Navigation">${NAV_ICON}</a>
    </div>`;
  };
  const gruppe = (titel, arr) => arr.length
    ? `<div class="park-gruppe">${titel}</div><div class="camp-list">${arr.map(zeile).join("")}</div>` : "";
  box.innerHTML = `<details class="camp-box park-box">
    <summary>
      <img class="camp-head-pin" src="${PIN.parkplatz}" alt="">
      <span class="camp-head-txt">Parken<span class="camp-sum">${escHtml(teile.join(" · "))}</span></span>
    </summary>
    <div class="park-inhalt">
      ${gruppe("Am Startplatz", amStart)}
      ${gruppe("Am Landeplatz", amLande)}
    </div>
  </details>`;
}
function campSummary(list) {
  const camps = list.filter(c => campKat(c.type) === "camp_site").length;
  const vans = list.filter(c => campKat(c.type) === "caravan_site").length;
  const teile = [];
  if (camps) teile.push(`${camps} ${camps === 1 ? "Campingplatz" : "Campingplätze"}`);
  if (vans) teile.push(`${vans} ${vans === 1 ? "Stellplatz" : "Stellplätze"}`);
  const naechster = list[0] ? list.reduce((m, c) => Math.min(m, c.dist), Infinity) : null;
  if (naechster != null) {
    teile.push(naechster < 1 ? `ab ${Math.round(naechster * 1000)} m` : `ab ${naechster.toFixed(naechster < 10 ? 1 : 0).replace(".", ",")} km`);
  }
  return teile.join(" · ");
}
function campSectionHtml(list) {
  return `<details class="camp-box">
    <summary>
      <img class="camp-head-pin" src="${PIN.camp_site}" alt="">
      <span class="camp-head-txt">Übernachten in der Nähe<span class="camp-sum">${campSummary(list)}</span></span>
    </summary>
    <div class="camp-list">${list.map(campRowHtml).join("")}</div>
    <p class="camp-attrib">Daten © OpenStreetMap-Mitwirkende · Entfernung und Fahrzeit ab Landeplatz. Ausstattung nur, soweit dort hinterlegt.</p>
  </details>`;
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
      <div class="anr-txt"><div class="anr-titel">${escHtml(i.titel)}</div><div class="anr-sub">${escHtml(i.sub)}</div></div>
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
  return `<div class="lp-rows">${rows.map(([ic, label, val]) => `
    <div class="lp-row">${lpSvg(ic)}<span class="lp-label">${escHtml(label)}</span><span class="lp-val">${escHtml(val)}</span></div>`).join("")}</div>`;
}
// Landeplätze als Reiter (nur ab zwei Plätzen). Gezeigt wird ausschliesslich, was in den
// Daten steht: Höhe, Entfernung zum Start, Höhenabstand und die dafür nötige Gleitzahl.
function landeplatzHtml(spot, landeAlle) {
  if (!landeAlle.length) return "";
  const panels = landeAlle.map(l => {
    const rows = [];
    if (l.hoehe != null) rows.push(["hoehe", "Höhe", `${l.hoehe} m ü. NN`]);
    if (l.lat != null && spot.lat != null) {
      rows.push(["dist", "Entfernung", distTxt(haversineExact(spot.lat, spot.lon, l.lat, l.lon))]);
    }
    // Höhenabstand und benötigte Gleitzahl: sagt einem Anfänger, ob der Platz
    // überhaupt erreichbar ist. Beides nur rechnen, wenn die Daten wirklich da sind.
    if (l.hoehe != null && spot.elevation != null && spot.elevation > l.hoehe && l.lat != null) {
      const dh = spot.elevation - l.hoehe;
      const weite = haversineExact(spot.lat, spot.lon, l.lat, l.lon) * 1000;
      rows.push(["abstand", "Höhenabstand", `${dh} m tiefer`]);
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
  if (!richtHrs.length) rows.push(["richtung", "Windrichtung", "wechselnd (kaum Wind)"]);
  else {
    const richt = [];
    richtHrs.forEach(h => { const c = degToCompass(h.wd); if (richt[richt.length - 1] !== c) richt.push(c); });
    const uniq = [...new Set(richt)];
    const a = richt[0], b = richt[richt.length - 1];
    rows.push(["richtung", "Windrichtung", uniq.length === 1 ? uniq[0] : a === b ? uniq.slice(0, 3).join(" / ") : `${a}–${b}`]);
  }
  const ws = hrs.map(h => Math.round(h.ws));
  rows.push(["wind", "Wind", `${Math.min(...ws)} – ${Math.max(...ws)} km/h`]);
  const wg = hrs.map(h => Math.round(h.wg));
  rows.push(["boe", "Böen", `bis ${Math.max(...wg)} km/h`]);
  if (day.wx && day.wx.tmin != null && day.wx.tmax != null) rows.push(["temp", "Temperatur", `${day.wx.tmin} – ${day.wx.tmax} °C`]);
  const th = thermikStartHour(day, ts.win);
  if (th != null) rows.push(["sonne", "Thermik", `ab ca. ${th} Uhr`]);
  if (ts.win) rows.push(["uhr", "Beste Zeit", windowLabel(ts.win) + " Uhr"]);
  return `<h3 class="dv-h3">Kurzüberblick</h3><div class="lp-box">${lpRows(rows)}
    <p class="lp-note">${fenster.length ? "Werte aus dem fliegbaren Fenster" : `Werte über den ganzen Tag – ${(tagW || "Heute").toLowerCase()} kein fliegbares Fenster`}</p></div>`;
}
// Gilt an jedem Platz gleich - deshalb fest hinterlegt und nicht pro Gelände gepflegt.
const ALLG_HINWEISE_HTML = `<h3 class="dv-h3">Wichtige Hinweise</h3>
  <ul class="fc-notes allg-notes">
    <li class="fc-info">${FC_INFO}<span>Starte nur bei passenden Bedingungen und eigenem Können.</span></li>
    <li class="fc-info">${FC_INFO}<span>Halte Abstand zu anderen Piloten.</span></li>
    <li class="fc-info">${FC_INFO}<span>Respektiere Wildtiere, Weidetiere, Grundstücke und Sperrgebiete.</span></li>
    <li class="fc-info">${FC_INFO}<span>Melde Unfälle oder Beinaheunfälle.</span></li>
  </ul>`;
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
  if (a.includes("b")) zustieg.push({ ic: "bahn", titel: "Bergbahn", sub: "vorhanden" });
  if (a.includes("f")) zustieg.push({ ic: "fuss", titel: "Zu Fuß erreichbar", sub: "(Hike & Fly)" });
  const navKarten = [];
  // Ist der Startplatz nicht mit dem Auto erreichbar (reines Hike & Fly oder nur per
  // Bergbahn), waere eine Autoroute dorthin irrefuehrend - dann lieber das Satellitenbild.
  const startMitAuto = a.includes("a");
  // In der schmalen Spalte wird der Gebietsname vor jedem Ziel zu lang - er steht ohnehin
  // in der Kopfzeile des Fensters. Also "Startplatz" bzw. "Landeplatz 1" statt "Gerlitzen …".
  if (spot.lat != null) navKarten.push({
    ic: "icons/pin-startplatz.png", label: "Startplatz",
    href: startMitAuto ? mapsUrl(spot) : satMapsUrl(spot.lat, spot.lon),
    sat: !startMitAuto,
  });
  const landeAlle = [];
  if (spot.landeLat != null && spot.landeLon != null) landeAlle.push({ name: spot.landeName || "Landeplatz", lat: spot.landeLat, lon: spot.landeLon, hoehe: spot.landeHoehe });
  if (Array.isArray(spot.landeExtra)) landeAlle.push(...spot.landeExtra);
  // Der DHV liefert Haupt- und Zusatzlandeplaetze in beliebiger Reihenfolge ("Landeplatz 2"
  // vor "Landeplatz 1") - natuerlich sortieren, damit die Reiter in der erwarteten Folge stehen.
  landeAlle.sort((a, b) => (a.name || "").localeCompare(b.name || "", "de", { numeric: true }));
  landeAlle.forEach(l => { l.kurz = kurzOrt(l.name, spot.name); });
  landeAlle.forEach(l => navKarten.push({ ic: "icons/pin-landeplatz.png", label: l.kurz, href: mapsUrl({ lat: l.lat, lon: l.lon }) }));
  const schritt1 = `
    <h4 class="fc-h4">Anreise</h4>
    ${anreiseHtml(zustieg)}
    ${(S.vorStart || []).length ? fcList(S.vorStart) : ""}
    ${navKarten.length ? `<h4 class="fc-h4">Navigation</h4><div class="fc-navlist">${navKarten.map(c => `
      <div class="fc-nav-row">
        <img class="fc-nav-pin" src="${c.ic}" alt="">
        <span class="fc-nav-name">${escHtml(c.label)}</span>
        <a class="fc-nav-btn" href="${c.href}" target="_blank" rel="noopener" aria-label="${c.sat ? "Satellitenbild von" : "Navigation zu"} ${escHtml(c.label)}">${c.sat ? IC_SAT : IC_CAR}</a>
      </div>`).join("")}</div>` : ""}
    <div id="parkSection" class="park-sec"></div>`;

  // --- Schritt 2: Startplatz ---
  const check2 = [];
  if (spot.sectorLabel) check2.push(`Windrichtung ${spot.sectorLabel} liegt optimal an`);
  if (spot.elevation != null) check2.push(`Start auf ${spot.elevation} m ü. NN`);
  if (spot.gleitschirm) check2.push(`Zugelassen: ${spot.gleitschirm}`);
  if (spot.gemeinde) check2.push(`Gemeinde ${spot.gemeinde}`);
  check2.push(...(S.startplatz || []));
  // Kein "Bedingungen"-Block mehr: Wind stand dort mit den DHV-Werten des Platzes
  // (bewertet wird aber nach den Einstellungen), und Thermik steht schon in den
  // Flugart-Kacheln darueber.
  const warn = diffWarn(spot);
  const hinweise2 = [];
  if (warn) hinweise2.push({ typ: "warn", text: warn.text });
  // DHV-Bemerkung im Original (nur bei 21 % der Plätze hinterlegt)
  if (spot.bemerkung) hinweise2.push({ typ: "info", text: spot.bemerkung });
  const schritt2 = `
    ${check2.length ? `<h4 class="fc-h4">Checkliste Startplatz</h4>${fcList(check2)}` : ""}
    ${flugartenHtml(spot)}
    ${hinweise2.length ? `<h4 class="fc-h4">Hinweise</h4><ul class="fc-notes">${hinweise2.map(h =>
      `<li class="fc-${h.typ}">${h.typ === "warn" ? FC_WARN : FC_INFO}<span>${escHtml(h.text)}</span></li>`).join("")}</ul>` : ""}`;

  // --- Schritt 3: Landeplatz ---
  // Mehrere Landeplätze bekommen je einen Reiter. Größe, Untergrund und bevorzugte
  // Landerichtung stehen bewusst NICHT drin - dazu gibt es in den DHV-Daten nichts.
  const schritt3 = `
    ${landeplatzHtml(spot, landeAlle)}
    ${(S.landeplatz || []).length ? fcList(S.landeplatz) : ""}
    ${(S.verboten || []).length ? `<h4 class="fc-h4">Wichtig</h4><ul class="fc-notes">${S.verboten.map(t =>
      `<li class="fc-warn">${FC_WARN}<span>${escHtml(t)}</span></li>`).join("")}</ul>` : ""}`;

  // --- Schritt 4: Kontakte & Notruf ---
  const schritt4 = kontakteHtml(spot, { imBriefing: true });

  const schritte = [
    ["Anreise &amp; Start", schritt1],
    ["Startplatz", schritt2],
    ["Landeplatz", schritt3],
    ["Kontakte &amp; Notruf", schritt4],
  ].filter(([, inhalt]) => inhalt.trim());

  return `${kopf}
    <h3 class="fc-head">Flug-Check</h3>
    <p class="fc-head-sub">Deine Vorbereitung in ${schritte.length} Schritten</p>
    ${schritte.map(([titel, inhalt], i) => fcStep(i + 1, titel, inhalt, false)).join("")}
    ${kurzueberblickHtml(spot, day, ts, tagW)}
    <h3 class="dv-h3">Übersicht Start &amp; Landeplatz</h3>
    <div class="mini-map-wrap">
      <div id="miniMap" class="mini-map"></div>
      <div class="mini-style-toggle" role="group" aria-label="Kartenstil">
        <button type="button" class="mini-style-btn on" data-ministyle="street">Karte</button>
        <button type="button" class="mini-style-btn" data-ministyle="sat">Satellit</button>
        <button type="button" class="mini-style-btn" data-ministyle="terrain">Gelände</button>
      </div>
      <button type="button" class="mini-map-big" id="miniMapBig" aria-label="Karte vergrößern">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
      </button>
      <div class="mini-map-legend"><img src="icons/pin-startplatz.png" alt=""><span>Startplatz</span><img src="icons/pin-landeplatz.png" alt=""><span>Landeplatz</span></div>
      <div class="map-attrib" id="miniMapAttrib">${attribTextFor(miniMapStyleMode)}</div>
    </div>
    <div id="campSection" class="camp-sec"></div>
    ${ALLG_HINWEISE_HTML}
    ${notizenHtml(spot)}
    <p class="bf-src bf-warn-note">Alle Angaben ohne Gewähr. Informiere dich vor dem Flug über die aktuellen
      Bedingungen und respektiere andere Piloten und die Natur.
      ${b ? `<span class="bf-src-quelle">Quelle: ${escHtml(b.source)}${b.updated ? ` · Stand ${escHtml(b.updated)}` : ""}</span>` : ""}</p>`;
}


// Startplatz-Datentabelle (links im neuen Layout) – zeigt "nicht verfügbar" statt erfundener Werte
function startplatzTableHtml(spot, diffL) {
  const ort = [spot.gemeinde, spot.bundesland].filter(Boolean).join(", ");
  const rows = [
    ["Ort", ort || null],
    ["Startrichtung", spot.sectorLabel || null],
    ["Höhe Startplatz", spot.elevation != null ? spot.elevation + " m ü. NN" : null],
    ["Höhe Landeplatz", spot.landeHoehe != null ? spot.landeHoehe + " m ü. NN" : null],
    ["Höhendifferenz", spot.hoehendiff ? spot.hoehendiff + " m" : null],
    // Windbereich/Böen standen hier mit den DHV-Werten des Platzes - bewertet wird aber
    // nach den Grenzwerten aus den Einstellungen. "Gelände" war immer leer.
    ["Schwierigkeit", diffL.text],
    ["Gleitschirm", spot.gleitschirm || null],
  ];
  return `<div class="dv-table">${rows.map(([label, val]) => `
    <div class="dv-row"><span class="dv-row-label">${label}</span><span class="dv-row-val">${val != null ? val : NA}</span></div>`).join("")}</div>`;
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
    chips.push({ ic: IC_STATION, label: gleicheQuelle ? "Live-Wetter & Cam" : "Live-Wetter", href: spot.livewetter });
  }
  if (spot.webcam && !gleicheQuelle) chips.push({ ic: IC_CAM, label: "Live-Cam", href: spot.webcam });
  // Windy: punktgenaue Wetterkarte, gehoert zu den Wetter-Quellen (frueher im Details-Tab)
  if (spot.lat != null && spot.lon != null) {
    chips.push({ ic: IC_WIND, label: "Windy", href: `https://www.windy.com/?${spot.lat},${spot.lon},12` });
  }
  if (!chips.length) return "";
  return `<div class="lc-chips">${chips.map(c => `
    <a class="lc-chip" href="${c.href}" target="_blank" rel="noopener">${c.ic}<span>${c.label}</span></a>`).join("")}</div>`;
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

  // Aktionsleiste: Einstiegspunkte für den Flugtag (als Objekte -> zwei Anzeigeformen: Pillen & Badges)
  // Windy steht als Chip oben im Wetter-Tab (bei den anderen Wetter-Quellen), nicht hier
  const actList = [];
  if (spot.acc && spot.acc.includes("b")) {
    const base = (spot.name || "").replace(/\s*\([^)]*\)\s*$/, "").trim();  // Richtungs-Suffix „(N)" weg
    const q = encodeURIComponent(`${base} ${spot.region || ""} Bergbahn Seilbahn`.replace(/\s+/g, " ").trim());
    actList.push({ icon: IC_CABLECAR, label: "Bergbahn", href: `https://www.google.com/search?q=${q}` });
  }
  if (spot.landeLat != null && spot.landeLon != null) {
    actList.push({ icon: IC_PIN, label: "Landeplatz", href: mapsUrl({ lat: spot.landeLat, lon: spot.landeLon }) });
  }
  if (spot.dhv) actList.push({ icon: IC_CLIPBOARD, label: "DHV Info", href: `https://service.dhv.de/db2/details.php?qi=glp_details&item=${spot.dhv}` });
  if (spot.vereinUrl) actList.push({ icon: IC_GLOBE, label: "Verein", href: spot.vereinUrl });
  // Landeplatz hat im Details-Tab schon einen eigenen Navigations-Button an der Karte -> hier redundant
  const actionsBadges = `<div class="dv-actions">${actList.filter(a => a.label !== "Landeplatz").map(a => `<a class="dv-act" href="${a.href}" target="_blank" rel="noopener"><span class="dv-act-ic">${a.icon}</span><span>${a.label}</span></a>`).join("")}</div>`;

  const diffHtml = (() => { const w = diffWarn(spot); return w ? `<div class="spot-warn d${w.d}">⚠️ ${w.text}</div>` : ""; })();

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
        <button type="button" class="dtab" data-tab="details" role="tab">Details</button>
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
        <div class="dtab-panel" id="dtab-details" hidden>${(() => {
          const diffL = diffLabelFull(spot);
          // Die Zustiegs-/Thermik-Kacheln standen hier doppelt - dieselben Angaben
          // stehen im Briefing unter "Anreise" bzw. bei "Grundsätzlich möglich".
          return `
            ${diffHtml}
            <h3 class="dv-h3">Aktionen &amp; Tools</h3>
            ${actionsBadges}
            ${startplatzTableHtml(spot, diffL)}
            ${dhvExtra(spot, { skipLande: true, skipHoehendiff: true, skipOrt: true, skipGleitschirm: true })}`;
        })()}</div>
      </div>`;

  const favOn = isFav(spot.id);
  const head = opts.collapsible
    ? `<div class="card-head">
        <div><div class="spot-name">${spot.name}</div><div class="spot-region">${spot.region || ""}</div></div>
        <div class="head-right">${badge}<button class="ic0 star on" data-fav="${spot.id}" title="Aus Favoriten entfernen">★</button>${del}</div>
      </div>`
    : `<div class="detail-topbar">
        <div class="dt-left">
          <div class="spot-name-row"><div class="spot-name">${spot.name}</div><button type="button" class="ic0 dt-star${favOn ? " on" : ""}" data-fav="${spot.id}" title="${favOn ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}">${favOn ? "★" : "☆"}</button></div>
          <div class="spot-region">📍 ${[spot.gemeinde, spot.bundesland].filter(Boolean).join(", ") || spot.region || ""}</div>
        </div>
        <div class="dt-right">
          <button type="button" class="ic0 dt-x" data-detailclose title="Schließen">✕</button>
          <div class="dt-menu-wrap">
            <button type="button" class="ic0 dt-menu-btn" aria-haspopup="true" aria-expanded="false" title="Mehr">☰</button>
            <div class="dt-menu" hidden>
              <button type="button" class="dt-mi disabled" disabled>🔔 Flugwetter-Alarm<span class="dt-soon">bald</span></button>
              <button type="button" class="dt-mi" data-share="${spot.id}">📤 Teilen</button>
            </div>
          </div>
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
  if (lastOrigin) runFlySearch(lastOrigin.lat, lastOrigin.lon, lastOrigin.label);
});

// Regionen (Zentrum + Radius km) für die Regions-Suche
const REGIONS = {
  allgaeu:         { name: "Allgäu",               country: "de", lat: 47.55,   lon: 10.25,   r: 45 },
  alb:             { name: "Schwäbische Alb",      country: "de", lat: 48.45,   lon: 9.35,    r: 60 },
  schwarzwald:     { name: "Schwarzwald",          country: "de", lat: 48.15,   lon: 8.15,    r: 85 },
  werdenfels:      { name: "Werdenfelser Land",    country: "de", lat: 47.52,   lon: 11.10,   r: 28 },
  voralpen:        { name: "Bayerische Voralpen",  country: "de", lat: 47.65,   lon: 11.50,   r: 40 },
  chiemgau:        { name: "Chiemgau",             country: "de", lat: 47.75,   lon: 12.50,   r: 40 },
  berchtesgaden:   { name: "Berchtesgadener Land", country: "de", lat: 47.63,   lon: 12.99,   r: 28 },
  rheinlandpfalz:  { name: "Rheinland-Pfalz",      country: "de", lat: 49.9040, lon: 7.4628,  r: 110 },
  hessen:          { name: "Hessen",               country: "de", lat: 50.4453, lon: 8.8423,  r: 130 },
  nrw:             { name: "Nordrhein-Westfalen",  country: "de", lat: 51.2689, lon: 8.1517,  r: 140 },
  thueringen:      { name: "Thüringen",            country: "de", lat: 50.8381, lon: 11.0289, r: 100 },
  sachsen:         { name: "Sachsen",              country: "de", lat: 50.8241, lon: 13.5145, r: 90 },
  deutschland:     { name: "Deutschland (alle)",   country: "de", lat: 49.4477, lon: 9.6313,  r: 580 },
  tirol:           { name: "Tirol",                country: "at", lat: 47.1777, lon: 11.4725, r: 110 },
  steiermark:      { name: "Steiermark",           country: "at", lat: 47.3339, lon: 14.5904, r: 100 },
  oberoesterreich: { name: "Oberösterreich",       country: "at", lat: 48.1353, lon: 13.9855, r: 80 },
  kaernten:        { name: "Kärnten",              country: "at", lat: 46.7719, lon: 13.8763, r: 85 },
  salzburg_at:     { name: "Salzburg",             country: "at", lat: 47.4645, lon: 13.2025, r: 75 },
  vorarlberg:      { name: "Vorarlberg",           country: "at", lat: 47.2126, lon: 9.9555,  r: 38 },
  oesterreich:     { name: "Österreich (alle)",    country: "at", lat: 47.3464, lon: 12.9527, r: 320 },
  bern:            { name: "Bern",                 country: "ch", lat: 46.6993, lon: 7.6290,  r: 70 },
  wallis:          { name: "Wallis",                country: "ch", lat: 46.2432, lon: 7.4828,  r: 72 },
  graubuenden:     { name: "Graubünden",            country: "ch", lat: 46.6820, lon: 9.5928,  r: 65 },
  schwyz:          { name: "Schwyz",                country: "ch", lat: 47.0531, lon: 8.7208,  r: 25 },
  waadt:           { name: "Waadt",                 country: "ch", lat: 46.4752, lon: 6.8354,  r: 60 },
  uri:             { name: "Uri",                   country: "ch", lat: 46.8105, lon: 8.6529,  r: 30 },
  tessin:          { name: "Tessin",                country: "ch", lat: 46.1835, lon: 8.9583,  r: 40 },
  stgallen:        { name: "St. Gallen",            country: "ch", lat: 47.1610, lon: 9.3128,  r: 38 },
  obwalden:        { name: "Obwalden",              country: "ch", lat: 46.8506, lon: 8.3245,  r: 22 },
  luzern:          { name: "Luzern",                country: "ch", lat: 46.9611, lon: 8.2367,  r: 32 },
  schweiz:         { name: "Schweiz (alle)",        country: "ch", lat: 46.7255, lon: 8.2455,  r: 170 },
  rhonealpes_fr:   { name: "Rhône-Alpes",           country: "fr", lat: 45.4655, lon: 5.9135,  r: 180 },
  hautesavoie_fr:  { name: "Haute-Savoie",          country: "fr", lat: 45.9752, lon: 6.6043,  r: 55 },
  provence_fr:     { name: "Provence",              country: "fr", lat: 44.1226, lon: 6.2527,  r: 120 },
  savoie_fr:       { name: "Savoie",                country: "fr", lat: 45.5704, lon: 6.4906,  r: 65 },
  isere_fr:        { name: "Isère",                 country: "fr", lat: 45.1346, lon: 5.7896,  r: 50 },
  puydedome_fr:    { name: "Puy-de-Dôme",           country: "fr", lat: 45.5807, lon: 3.1024,  r: 60 },
  hautepyrenees_fr:{ name: "Hautes-Pyrénées",       country: "fr", lat: 42.8864, lon: 0.1470,  r: 40 },
  hautesalpes_fr:  { name: "Hautes-Alpes",          country: "fr", lat: 44.6802, lon: 6.2126,  r: 55 },
  ain_fr:          { name: "Ain",                   country: "fr", lat: 46.0977, lon: 5.6472,  r: 65 },
  drome_fr:        { name: "Drôme",                 country: "fr", lat: 44.5035, lon: 5.3674,  r: 65 },
  doubs_fr:        { name: "Doubs",                 country: "fr", lat: 47.1077, lon: 6.3193,  r: 110 },
  saoneetloire_fr: { name: "Saône-et-Loire",        country: "fr", lat: 46.5919, lon: 4.5514,  r: 50 },
  jura_fr:         { name: "Jura (FR)",             country: "fr", lat: 46.6691, lon: 5.8667,  r: 45 },
  corse_fr:        { name: "Korsika",               country: "fr", lat: 42.4367, lon: 9.1534,  r: 65 },
  vosges_fr:       { name: "Vogesen",               country: "fr", lat: 48.0367, lon: 6.8159,  r: 65 },
  ariege_fr:       { name: "Ariège",                country: "fr", lat: 42.8281, lon: 1.4871,  r: 50 },
  cantal_fr:       { name: "Cantal",                country: "fr", lat: 45.0887, lon: 2.7187,  r: 25 },
  cotesdarmor_fr:  { name: "Côtes-d'Armor",         country: "fr", lat: 48.6753, lon: -3.0817, r: 50 },
  hautegaronne_fr: { name: "Haute-Garonne",         country: "fr", lat: 42.9436, lon: 0.7780,  r: 50 },
  ardeche_fr:      { name: "Ardèche",               country: "fr", lat: 44.7947, lon: 4.3568,  r: 70 },
  var_fr:          { name: "Var",                   country: "fr", lat: 43.4442, lon: 6.2191,  r: 60 },
  frankreich:      { name: "Frankreich (alle)",     country: "fr", lat: 45.8432, lon: 4.2100,  r: 710 },
  sudtirol_it:     { name: "Südtirol",              country: "it", lat: 46.5726, lon: 11.5399, r: 160 },
  lombardei_it:    { name: "Lombardei",             country: "it", lat: 46.0038, lon: 9.7884,  r: 155 },
  piemont_it:      { name: "Piemont",               country: "it", lat: 45.2564, lon: 7.7534,  r: 235 },
  venetien_it:     { name: "Venetien",              country: "it", lat: 45.8959, lon: 11.4492, r: 95 },
  ligurien_it:     { name: "Ligurien",              country: "it", lat: 44.1268, lon: 8.3967,  r: 120 },
  friaul_it:       { name: "Friaul",                country: "it", lat: 46.2988, lon: 13.0226, r: 110 },
  italien:         { name: "Italien (alle)",        country: "it", lat: 43.4161, lon: 11.6762, r: 790 },
};

// Gemeinsame Auswertung + Anzeige für eine Kandidatenliste.
// candidates: mit .dist (Anzeige-km oder null) und .sortKey (Zahl). origin: {lat,lon} oder null (für Fahrzeit).
async function renderSearch(candidates, origin, headline, opts = {}) {
  // Zustiegs-Filter wird NICHT mehr vor dem Kappen angewendet (sonst holt ein enger Filter
  // andere/weiter entfernte Plaetze als "Egal", weil er ueber den ganzen Umkreis statt nur die
  // ohnehin schon gezeigten naechsten 50 filtert). Er wirkt jetzt rein auf der Anzeige, s. renderFlyResults.
  const out = document.getElementById("flyResults");
  const mapFirstRun = document.getElementById("mapFirstRun");
  if (mapFirstRun) mapFirstRun.hidden = true;
  const truncated = candidates.length > MAX_CANDIDATES;
  candidates = candidates.slice(0, MAX_CANDIDATES);
  if (!candidates.length) {
    out.innerHTML = `<p class="empty">Kein Startplatz gefunden. (Die Datenbank wächst noch.)</p>`;
    return;
  }
  out.innerHTML = `<p class="loading-line">🔎 Prüfe ${candidates.length} Plätze …</p>`;
  try {
    const results = await fetchBulkToday(candidates);
    let drive = [];
    if (origin) { try { drive = await fetchDriveTimes(origin, candidates); } catch { drive = []; } }
    const rows = candidates.map((s, i) => {
      const drv = drive[i];
      const subInfo = (drv != null ? IC_CAR + " " + formatDur(drv) + " · " : "") +
        (s.dist != null ? IC_PIN + " " + s.dist + " km" : (s.region || ""));
      const days = analyse(s, results[i]);
      const ts = dayStatus(days, searchDay);
      ts.type = flightType(days[searchDay], ts.win);
      return { spot: s, ts, drive: drv, subInfo };
    });
    const rank = { gut: 0, grenz: 1, nein: 2 };
    rows.sort((a, b) =>
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
let miniMapStyleMode = "street";
let mapStyleMode = "street";
let lastRows = [];
let lastHeadline = "", lastTruncated = false;
let favOnlyFilter = false; // "Nur Favoriten"-Filter in der Ergebnisliste
let mapInstance = null;
let mapMarkers = [];
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
let miniUserMarker = null;  // Mini-Karte im Detailfenster
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
  if (miniMapInstance) {
    if (miniUserMarker) miniUserMarker.setLngLat(at);
    else miniUserMarker = new maplibregl.Marker({ element: userDotEl() }).setLngLat(at).addTo(miniMapInstance);
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

// ---------------- Mini-Karte im "Live"-Tab: Start- + Landeplatz auf einen Blick ----------------
let miniMapInstance = null;
function removeMiniMap() {
  if (miniMapInstance) { miniMapInstance.remove(); miniMapInstance = null; }
  miniUserMarker = null; // Marker gehörte zur entfernten Karte
  campMarkers = [];
}
async function ensureMiniMap(spot) {
  if (!document.getElementById("miniMap")) return; // Tab evtl. schon wieder verlassen
  await loadMapLibre();
  if (!document.getElementById("miniMap")) return; // erneut prüfen (async Ladezeit)
  removeMiniMap();
  const hasLande = spot.landeLat != null && spot.landeLon != null;
  const landePlaetze = [];
  if (hasLande) landePlaetze.push({ name: spot.landeName || "Landeplatz", lat: spot.landeLat, lon: spot.landeLon });
  if (Array.isArray(spot.landeExtra)) landePlaetze.push(...spot.landeExtra);
  const points = [[spot.lon, spot.lat], ...landePlaetze.map(l => [l.lon, l.lat])];
  miniMapInstance = new maplibregl.Map({
    container: "miniMap", style: MINI_MAP_STYLES[miniMapStyleMode],
    center: [spot.lon, spot.lat], zoom: 12, attributionControl: false, interactive: true,
  });
  miniMapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  const startEl = document.createElement("div");
  startEl.className = "mini-marker mini-start"; startEl.innerHTML = `<img src="icons/pin-startplatz.png" alt="Startplatz">`; startEl.title = spot.name;
  new maplibregl.Marker({ element: startEl }).setLngLat([spot.lon, spot.lat])
    .setPopup(poiPopup(poiPopupHtml(
      { lat: spot.lat, lon: spot.lon, web: spot.vereinUrl || "" },
      spot.name, "icons/pin-startplatz.png",
      ["Startplatz", spot.elevation != null ? spot.elevation + " m ü. NN" : "", spot.sectorLabel || ""].filter(Boolean).join(" · "),
      infosStart(spot))))
    .addTo(miniMapInstance);
  landePlaetze.forEach(l => {
    const landeEl = document.createElement("div");
    landeEl.className = "mini-marker mini-lande"; landeEl.innerHTML = `<img src="icons/pin-landeplatz.png" alt="Landeplatz">`; landeEl.title = l.name;
    new maplibregl.Marker({ element: landeEl }).setLngLat([l.lon, l.lat])
      .setPopup(poiPopup(poiPopupHtml(
        { lat: l.lat, lon: l.lon },
        l.name, "icons/pin-landeplatz.png",
        ["Landeplatz", l.hoehe != null ? l.hoehe + " m ü. NN" : ""].filter(Boolean).join(" · "),
        infosLande(spot, l))))
      .addTo(miniMapInstance);
  });
  if (points.length > 1) {
    const lons = points.map(p => p[0]), lats = points.map(p => p[1]);
    miniMapInstance.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]], { padding: 50, animate: false, maxZoom: 15 });
  }
  syncUserDot();
  refreshUserPos();
  campAddMarkers(lastCampList);   // falls die Campingdaten schon vor der Karte da waren
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
      if (id) openDetail(id);
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
  if (lastOrigin) {
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
  mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  mapInstance.on("zoom", updateMapLabelVisibility);
  mapInstance.on("moveend", () => {
    lastMapView = { center: mapInstance.getCenter(), zoom: mapInstance.getZoom() };
    updateHierBtn();
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
  });
  // Klick auf freie Kartenfläche (nicht auf einen Marker/Bedienelement/Punkt) -> dort suchen.
  // Ein Doppeltipp loest zwei click-Events aus - ohne die Sperre liefen zwei Suchen
  // gleichzeitig los (zwei Ortsabfragen, zwei Ergebnislisten).
  let letzterKartenklick = 0;
  mapInstance.on("click", async e => {
    if (mapInstance.queryRenderedFeatures(e.point, { layers: ["extra-points-layer"] }).length) return;
    // Nach einem langen Druck kommt noch ein Klick hinterher - der darf keine Suche starten.
    // Die Zeitgrenze verhindert, dass eine liegengebliebene Sperre einen viel spaeteren
    // Klick schluckt (z.B. wenn der Nutzer direkt im Kasten weitergetippt hat).
    if (lpKlickSperre) { lpKlickSperre = false; if (Date.now() - lpSperreZeit < 2000) return; }
    const jetzt = Date.now();
    if (jetzt - letzterKartenklick < 400) return;
    letzterKartenklick = jetzt;
    const { lat, lng } = e.lngLat;
    const tempEl = document.createElement("div");
    tempEl.className = "map-marker map-marker-temp";
    tempEl.innerHTML = `<img src="icons/marker-start.png" alt="">`;
    const tempMarker = new maplibregl.Marker({ element: tempEl }).setLngLat([lng, lat]).addTo(mapInstance);
    mapMarkers.push(tempMarker);
    const place = await reverseGeocode(lat, lng);
    await runFlySearch(lat, lng, place || `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
  });
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
    el.className = "map-marker";
    el.title = r.spot.name;
    el.innerHTML = `<img src="${START_ICON_BY_STATUS[r.ts.status] || START_ICON_BY_STATUS.nein}" alt=""><span class="map-marker-label ml-${r.ts.status}">${r.spot.name}</span>`;
    // stopPropagation: sonst bubbelt der Klick zum generischen Karten-Click-Handler durch (der
    // Klicks auf leere Kartenflächen als neue Ortssuche interpretiert) und startet ungewollt eine
    // zweite Suche samt Zoom-Animation im Hintergrund, während das Detailfenster schon offen ist.
    el.addEventListener("click", e => { e.stopPropagation(); openDetail(r.spot.id); });
    const marker = new maplibregl.Marker({ element: el }).setLngLat([r.spot.lon, r.spot.lat]).addTo(mapInstance);
    mapMarkers.push(marker);

    const landePlaetze = [];
    if (r.spot.landeLat != null && r.spot.landeLon != null) landePlaetze.push({ name: r.spot.landeName || "Landeplatz", lat: r.spot.landeLat, lon: r.spot.landeLon });
    if (Array.isArray(r.spot.landeExtra)) landePlaetze.push(...r.spot.landeExtra);
    landePlaetze.forEach(l => {
      const lEl = document.createElement("div");
      lEl.className = "map-lande-marker"; lEl.title = l.name;
      lEl.innerHTML = `<img src="icons/marker-lande-black.png" alt=""><span class="map-marker-label">${l.name}</span>`;
      lEl.addEventListener("click", e => { e.stopPropagation(); openDetail(r.spot.id); });
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
  if (opts.flyTo === false) return;
  const bounds = rowsBounds(rows);
  if (bounds) mapInstance.fitBounds(bounds, { padding: 50, duration: 600, maxZoom: 13 });
  else if (lastOrigin) mapInstance.flyTo({ center: [lastOrigin.lon, lastOrigin.lat], zoom: 8, duration: 600 });
  updateMapLabelVisibility();
}
// Aktiv auf Kartenansicht wechseln - vom Toggle-Button UND vom Freitext-Ortssuche-Fallback genutzt.
async function switchToMapView() {
  document.querySelectorAll("#viewToggle .vpill").forEach(x => x.classList.toggle("on", x.dataset.view === "map"));
  document.getElementById("flyResults").hidden = true;
  document.getElementById("mapView").hidden = false;
  try { await ensureMap(); mapInstance.resize(); restoreMapView(); }
  catch (e) { document.getElementById("mapEl").innerHTML = `<p class="empty">${e.message}</p>`; }
}
document.getElementById("viewToggle").addEventListener("click", async e => {
  const b = e.target.closest(".vpill"); if (!b) return;
  if (b.dataset.view === "map") { await switchToMapView(); return; }
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
  lastOrigin = { lat, lon, label };
  rerunSearch = () => runFlySearch(lat, lon, label);
  const radius = getRadius();
  updateRadiusCircle(lat, lon, radius);
  const candidates = allKnownSpots()
    .map(s => { const d = haversine(lat, lon, s.lat, s.lon); return { ...s, dist: d, sortKey: d }; })
    .filter(s => s.dist <= radius)
    .sort((a, b) => a.sortKey - b.sortKey);
  const headline = `${dayWord()} im Umkreis ${radius} km${label ? " um <b>" + label + "</b>" : ""}`;
  await renderSearch(candidates, { lat, lon }, headline, opts);
}

// Regions-Suche (nach Gebiet statt Umkreis); Fahrzeit nur falls Standort schon bekannt
async function runRegionSearch(key) {
  const R = REGIONS[key]; if (!R) return;
  localStorage.setItem("flugwetter_lastregion", key);   // Nordstern: beim nächsten Öffnen sofort zeigen
  rerunSearch = () => runRegionSearch(key);
  const origin = lastOrigin;
  const candidates = allKnownSpots()
    .map(s => {
      const toCenter = haversine(R.lat, R.lon, s.lat, s.lon);
      return { ...s, _c: toCenter,
        dist: origin ? haversine(origin.lat, origin.lon, s.lat, s.lon) : null,
        sortKey: origin ? haversine(origin.lat, origin.lon, s.lat, s.lon) : toCenter };
    })
    .filter(s => s._c <= R.r && (!s.country || s.country === R.country))
    .sort((a, b) => a.sortKey - b.sortKey);
  await renderSearch(candidates, origin, `${dayWord()} · Region <b>${R.name}</b>`);
}

// Heute/Morgen-Umschalter
document.getElementById("dayToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  searchDay = parseInt(b.dataset.day, 10);
  document.querySelectorAll("#dayToggle .rpill").forEach(x => x.classList.toggle("on", x === b));
  updateGreeting();
  if (rerunSearch) rerunSearch();
});

// Zusammenfassung am Filter-Knopf: aktive Zustieg-/Höhendifferenz-Filter (wenn nicht Egal)
function updateFilterSummary() {
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
// Filter-Bereich auf-/zuklappen
document.getElementById("filterToggle").addEventListener("click", () => {
  const panel = document.getElementById("filterPanel"), btn = document.getElementById("filterToggle");
  const open = panel.hidden;
  panel.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
  btn.classList.toggle("open", open);
});

// Land-Umschalter – filtert, welche Regionen im Dropdown zur Auswahl stehen
function renderRegionOptions(country) {
  const sel = document.getElementById("regionSelect");
  const opts = ['<option value="">Region / Filter …</option>'];
  Object.entries(REGIONS).forEach(([key, r]) => { if (r.country === country) opts.push(`<option value="${key}">${r.name}</option>`); });
  sel.innerHTML = opts.join("");
}
// Länderflaggen als kleine SVG (plattformübergreifend, statt Emoji)
const FLAGS = {
  de: `<svg viewBox="0 0 5 3" preserveAspectRatio="none"><rect width="5" height="1" y="0" fill="#000"/><rect width="5" height="1" y="1" fill="#DD0000"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`,
  at: `<svg viewBox="0 0 5 3" preserveAspectRatio="none"><rect width="5" height="1" y="0" fill="#ED2939"/><rect width="5" height="1" y="1" fill="#fff"/><rect width="5" height="1" y="2" fill="#ED2939"/></svg>`,
  ch: `<svg viewBox="0 0 5 5" preserveAspectRatio="none"><rect width="5" height="5" fill="#D52B1E"/><rect x="2" y="1" width="1" height="3" fill="#fff"/><rect x="1" y="2" width="3" height="1" fill="#fff"/></svg>`,
  fr: `<svg viewBox="0 0 3 2" preserveAspectRatio="none"><rect width="1" height="2" x="0" fill="#0055A4"/><rect width="1" height="2" x="1" fill="#fff"/><rect width="1" height="2" x="2" fill="#EF4135"/></svg>`,
  it: `<svg viewBox="0 0 3 2" preserveAspectRatio="none"><rect width="1" height="2" x="0" fill="#008C45"/><rect width="1" height="2" x="1" fill="#fff"/><rect width="1" height="2" x="2" fill="#CD212A"/></svg>`,
};
// Eigenes Land-Dropdown (kein natives <select> → wird von Chrome nicht als Adressfeld autofill-gefärbt)
const COUNTRIES = [["de", "Deutschland"], ["at", "Österreich"], ["ch", "Schweiz"], ["fr", "Frankreich"], ["it", "Italien"]];
let setCountryUI = null;   // wird in initCountryDD gesetzt (fürs Wiederherstellen der letzten Region)
(function initCountryDD() {
  const dd = document.getElementById("countryDD");
  const btn = document.getElementById("countryBtn");
  const menu = document.getElementById("countryMenu");
  menu.innerHTML = COUNTRIES.map(([v, n]) =>
    `<button type="button" class="dd-opt" role="option" data-country="${v}"><span class="dd-flag">${FLAGS[v]}</span>${n}</button>`).join("");
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  const setCountry = v => {
    const c = COUNTRIES.find(x => x[0] === v) || COUNTRIES[0];
    document.getElementById("countryFlag").innerHTML = FLAGS[v] || "";
    document.getElementById("countryLabel").textContent = c[1];
    renderRegionOptions(v);
  };
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const open = menu.hidden; menu.hidden = !open; btn.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", e => {
    const o = e.target.closest("[data-country]"); if (!o) return;
    setCountry(o.dataset.country); close();
  });
  document.addEventListener("click", e => { if (!dd.contains(e.target)) close(); });
  setCountryUI = setCountry;
  setCountry("de");
})();
updateHero(null);
document.getElementById("regionSelect").addEventListener("change", e => {
  const v = e.target.value;
  if (v) runRegionSearch(v);
});

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
      <div class="fr-or">oder oben eine <b>Region</b> wählen</div>
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
      <div class="fr-or">oder oben eine <b>Region</b> wählen</div>
    </div>`;
  const b = document.getElementById("frGpsMap");
  if (b) b.addEventListener("click", startGpsSearch);
}

// Standort per GPS (Button + Auto-Start)
function startGpsSearch() {
  const out = document.getElementById("flyResults"), btn = document.getElementById("gpsBtn");
  if (!navigator.geolocation) { out.innerHTML = `<p class="empty">Standort nicht unterstützt – nutze die Suche.</p>`; return; }
  if (btn) btn.classList.add("busy"); out.innerHTML = `<p class="loading-line">📍 Standort wird ermittelt …</p>`;
  navigator.geolocation.getCurrentPosition(async pos => {
    localStorage.setItem("flugwetter_geo_ok", "1");   // ab jetzt beim Öffnen automatisch
    setUserPos(pos.coords.latitude, pos.coords.longitude);
    await runFlySearch(pos.coords.latitude, pos.coords.longitude, null);
    if (btn) btn.classList.remove("busy");
  }, () => {
    if (btn) btn.classList.remove("busy");
    out.innerHTML = `<p class="empty">Standort nicht verfügbar (Berechtigung?). Nutze die Suche oder eine Region.</p>`;
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
  out.innerHTML = `<p class="loading-line">🔎 Suche PLZ ${plz} …</p>`;
  try { const o = await geocodePlz(plz); await runFlySearch(o.lat, o.lon, o.label); }
  catch { clearSearchResults(`PLZ ${plz} nicht gefunden.`); }
}

// Startplatz-Namenssuche (wenn Text statt PLZ eingegeben wird). opts.allowGeocode: wenn kein
// eigener Startplatz passt, zusätzlich einen allgemeinen Ort/See/Berg per Nominatim versuchen
// (nur bei Enter/Blur gesetzt, nie beim Tippen - s. handleSearchInput weiter unten).
async function runNameSearch(q, opts = {}) {
  const ql = q.trim().toLowerCase();
  if (ql.length < 2) return;
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
  document.getElementById("flyResults").innerHTML = `<p class="loading-line">🔎 Suche Ort „${q}“ …</p>`;
  const hit = await forwardGeocode(q);
  if (!hit) { clearSearchResults(`Kein Startplatz und kein Ort „${q}“ gefunden.`); return; }
  await switchToMapView();
  await runFlySearch(hit.lat, hit.lon, q);
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
document.getElementById("plzInput").addEventListener("input", e => handleSearchInput(e.target.value));
document.getElementById("plzInput").addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const v = e.target.value.trim();
  clearTimeout(nameSearchTimer);
  if (/^\d{5}$/.test(v)) plzSearch(); else if (v.length >= 2) runNameSearch(v, { allowGeocode: true });
});
document.getElementById("plzInput").addEventListener("blur", () => {
  const v = document.getElementById("plzInput").value.trim();
  if (v.length >= 2 && !/^\d{5}$/.test(v) && !/^\d+$/.test(v)) runNameSearch(v, { allowGeocode: true });
});

function mapsUrl(s) {
  return `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=driving`;
}
function satMapsUrl(lat, lon) {
  return `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lon}&zoom=18&basemap=satellite`;
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
  if (g) g.textContent = timeGreeting();
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
  const head = `<div class="fly-head">${headline} · ${scope}</div>${favBtn}`;
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
async function openDetail(id) {
  const spot = getSpot(id); if (!spot) return;
  removeMiniMap();
  currentDetailSpot = spot;
  const modal = document.getElementById("detailModal"), body = document.getElementById("detailBody");
  modal.hidden = false;
  if (!detailHistoryPushed) {
    history.pushState({ detailOpen: true }, "", location.href);
    detailHistoryPushed = true;
  }
  body.innerHTML = `<div class="card loading">Lade 5-Tage-Vorhersage für ${spot.name} …</div>`;
  try {
    const [data, stations] = await Promise.all([fetchForecast(spot), fetchPiou()]);
    const live = liveWind(spot, stations);
    let driveSec = null;
    if (lastOrigin) {
      try { const d = await fetchDriveTimes(lastOrigin, [spot]); if (d[0] != null) driveSec = d[0]; } catch {}
    }
    body.innerHTML = renderCard(spot, analyse(spot, data), { dayIdx: searchDay, live, driveSec });
  } catch (e) { body.innerHTML = `<div class="card">Fehler: ${e.message}</div>`; }
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
  removeMiniMap();
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
    } else if (!lastOrigin && !out.innerHTML.trim()) {
      const lr = localStorage.getItem("flugwetter_lastregion");
      if (lr && REGIONS[lr]) {                            // sonst: letzte Region direkt zeigen
        if (setCountryUI) setCountryUI(REGIONS[lr].country);
        document.getElementById("regionSelect").value = lr;
        runRegionSearch(lr);
      } else {
        renderFirstRun();                                // erster Start: klarer Einstieg
        renderFirstRunMap();                              // ...und dasselbe als Overlay auf der Karte
      }
    }
  }
}
window.addEventListener("hashchange", route);

// ---------------- Events ----------------
// (Der „Wo kann ich fliegen?"-Button und die PLZ-Suche sind oben registriert.)

// Favoriten-Stern & Löschen (Event-Delegation über die ganze Seite)
document.body.addEventListener("click", e => {
  if (e.target.closest("a")) return;   // echte Links (Navigation/Deep-Links) normal öffnen lassen

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
    const url = "https://goflytoday.de";
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
    if (tab.dataset.tab === "briefing" && currentDetailSpot) { ensureMiniMap(currentDetailSpot); loadCampsites(currentDetailSpot); }
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
  const bigBtn = e.target.closest("#miniMapBig");
  if (bigBtn) {
    const wrap = bigBtn.closest(".mini-map-wrap");
    const gross = wrap.classList.toggle("big");
    bigBtn.setAttribute("aria-label", gross ? "Karte verkleinern" : "Karte vergrößern");
    if (miniMapInstance) setTimeout(() => miniMapInstance.resize(), 220);
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

  // Kartenstil umschalten (Karte/Satellit/Gelände) - Hauptkarte (#mapView) und Mini-Karte (Live-Tab)
  // teilen sich dieselbe Button-Klasse, aber je ihre eigene Karteninstanz + ihren eigenen Modus.
  const styleBtn = e.target.closest(".mini-style-btn");
  if (styleBtn) {
    const mode = styleBtn.dataset.ministyle;
    styleBtn.parentElement.querySelectorAll(".mini-style-btn").forEach(b => b.classList.toggle("on", b === styleBtn));
    if (styleBtn.closest("#mapView")) {
      mapStyleMode = mode;
      if (mapInstance) mapInstance.setStyle(MINI_MAP_STYLES[mode]);
      const at = document.getElementById("mapAttrib"); if (at) at.textContent = attribTextFor(mode);
    } else {
      miniMapStyleMode = mode;
      if (miniMapInstance) miniMapInstance.setStyle(MINI_MAP_STYLES[mode]);
      const at = document.getElementById("miniMapAttrib"); if (at) at.textContent = attribTextFor(mode);
    }
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
  body.innerHTML = `<p class="loading-line">Lade ${dateEl.value} …</p>`;
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
  route();
})();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
