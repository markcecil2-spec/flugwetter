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
function sectorWedgePath(cx, cy, rInner, rOuter, from, to) {
  let a1 = to; if (a1 <= from) a1 += 360;
  const large = (a1 - from) > 180 ? 1 : 0;
  const p0o = polarPt(cx, cy, rOuter, from), p1o = polarPt(cx, cy, rOuter, a1);
  const p0i = polarPt(cx, cy, rInner, from), p1i = polarPt(cx, cy, rInner, a1);
  return `M ${p0o.x.toFixed(1)} ${p0o.y.toFixed(1)} A ${rOuter} ${rOuter} 0 ${large} 1 ${p1o.x.toFixed(1)} ${p1o.y.toFixed(1)} L ${p1i.x.toFixed(1)} ${p1i.y.toFixed(1)} A ${rInner} ${rInner} 0 ${large} 0 ${p0i.x.toFixed(1)} ${p0i.y.toFixed(1)} Z`;
}
// opts.neutral -> grau/inaktiv (Standardzustand, bevor eine Stunde angetippt wurde)
// opts.compact -> kleine Variante ohne N/O/S/W-Beschriftung (für die Zeile neben den Stunden-Pillen)
// opts.rating -> "gut"/"grenz"/"nein" der angetippten Stunde: grün/gelb/rot (nicht nur Richtung, ganze Ampel)
function spotCompassSvg(spot, wd, opts = {}) {
  const cx = 50, cy = 50, rInner = 28, rOuter = 46;
  const wedgeColor = opts.neutral ? "rgba(148,163,184,.35)" : "var(--green)";
  const wedges = (spot.sectors || []).map(([f, t]) => `<path d="${sectorWedgePath(cx, cy, rInner, rOuter, f, t)}" fill="${wedgeColor}"/>`).join("");
  const labels = opts.compact ? "" : [["N", 0], ["O", 90], ["S", 180], ["W", 270]].map(([label, deg]) => {
    const p = polarPt(cx, cy, rOuter + 10, deg);
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="scp-dir">${label}</text>`;
  }).join("");
  const needleTip = polarPt(cx, cy, rOuter - 3, wd);
  const ratingColor = { gut: "var(--green-d)", grenz: "var(--amber)", nein: "var(--red)" }[opts.rating];
  const fits = inSectors(wd, spot.sectors, activeProfile().dirTol);
  const needleColor = opts.neutral ? "var(--muted)" : (ratingColor || (fits ? "var(--green-d)" : "var(--red)"));
  const viewBox = opts.compact ? "10 10 80 80" : "0 0 100 100";
  return `<svg viewBox="${viewBox}" class="scp${opts.neutral ? " idle" : ""}${opts.compact ? " scp-sm" : ""}" aria-hidden="true">
    <circle cx="${cx}" cy="${cy}" r="${(rInner + rOuter) / 2}" fill="none" stroke="rgba(148,163,184,.22)" stroke-width="${rOuter - rInner}"/>
    ${wedges}
    ${labels}
    <line x1="${cx}" y1="${cy}" x2="${needleTip.x.toFixed(1)}" y2="${needleTip.y.toFixed(1)}" stroke="${needleColor}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="${needleColor}"/>
  </svg>`;
}
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLon/2)**2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
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
function havFine(a, b, c, d) { const R = 6371, r = Math.PI / 180; const x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); }
// Nächste Station ≤ 2 km mit frischer Messung (≤ 60 Min) – sonst null (nicht faken)
function liveWind(spot, stations) {
  if (!stations || !stations.length) return null;
  const now = Date.now(); let best = null, bestD = 2.01;
  for (const st of stations) {
    const m = st.measurements; if (!m || !m.date) continue;
    if (now - new Date(m.date).getTime() > 3600000) continue;
    const dd = havFine(spot.lat, spot.lon, st.location.latitude, st.location.longitude);
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
// „06:00 – 13:00" fürs Statuskarten-Badge
function winTimeFull(w) { return `${String(w.from.getHours()).padStart(2, "0")}:00 – ${String(w.to.getHours()).padStart(2, "0")}:00`; }
// 5-Segment-Balken (z.B. für die Flugart-Einschätzung in der Statuskarte)
function barSegments(n, cls) {
  let s = "";
  for (let i = 0; i < 5; i++) s += `<span class="bar-seg ${i < n ? "on " + cls : ""}"></span>`;
  return `<span class="bar-segs">${s}</span>`;
}
// Große Status-Karte oben im Wetter-Tab: Icon, Bewertung, Sterne, Flugart-Tendenz, beste Zeit
function statusCardHtml(day, rt, ts, dayW) {
  const cls = ts.status === "nein" ? "nein" : ts.status;
  const statusWord = ts.status === "nein" ? "Nicht fliegbar" : rt.stars >= 5 ? "Sehr gut" : rt.stars >= 4 ? "Gut" : "Grenzwertig";
  const icon = day && day.wx && day.wx.code != null ? weatherEmoji(day.wx.code) : "🪂";
  const typeRow = rt.type ? `<div class="sc-type-row"><span>${rt.type.label}</span>${barSegments(rt.stars, cls)}</div>` : "";
  const best = ts.status !== "nein" ? `<div class="sc-best"><span class="sc-best-label">${ts.past ? "War fliegbar" : "Beste Zeit"}</span><b>${winTimeFull(ts.win)}</b></div>` : "";
  return `<div class="status-card ${cls}">
    <div class="sc-icon">${icon}</div>
    <div class="sc-mid">
      <div class="sc-title">${dayW === "morgen" ? "Morgen: " : ""}${statusWord}</div>
      <div class="sc-stars">${starStr(rt.stars)}</div>
      ${typeRow}
    </div>
    ${best}
  </div>`;
}

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

// Zustiegs-/Flugart-Karten fürs neue Detail-Layout (größer als die alten Chips, mit Sub-Info je Karte)
function iconCardsHtml(spot, thStart, driveSec) {
  const a = spot.acc || "";
  const driveTxt = driveSec != null ? `<span class="dv-dot gut"></span>${formatDur(driveSec)}` : NA;
  const vorhanden = `<span class="dv-dot gut"></span>vorhanden`;
  const cards = [];
  if (a.includes("f")) cards.push({ img: "icons/ic-hikefly.png", label: "Hike & Fly", sub: vorhanden });
  if (a.includes("a")) cards.push({ img: "icons/ic-auto.png", label: "Mit dem Auto", sub: driveTxt });
  if (a.includes("b")) cards.push({ img: "icons/ic-bahn.png", label: "Bergbahn", sub: vorhanden });
  if (spot.hoehendiff && spot.hoehendiff >= THERMIK_HOEHENDIFF_MIN) {
    const sub = thStart != null ? `<span class="dv-dot gut"></span>gut · ab ${thStart} Uhr` : `<span class="dv-dot gut"></span>möglich`;
    cards.push({ img: "icons/ic-thermik.png", label: "Thermik", sub });
  }
  cards.push({ img: null, ic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M4 13h16"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/><path d="M7 5v3M17 5v3"/></svg>`, label: "ÖPNV", sub: `<span class="dv-dot nein"></span>nicht verfügbar` });
  return `<div class="dv-cards">${cards.map(c => { const tag = c.href ? "a" : "div";
    const attrs = c.href ? ` href="${c.href}" target="_blank" rel="noopener"` : "";
    return `<${tag} class="dv-card"${attrs}>
      ${c.img ? `<img src="${c.img}" alt="">` : `<div class="dv-card-ic">${c.ic}</div>`}
      <div class="dv-card-label">${c.label}</div>
      <div class="dv-card-sub">${c.sub}</div>
    </${tag}>`; }).join("")}</div>`;
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
    ["Windbereich", `${spot.windMin}–${spot.windMax} km/h`],
    ["Böen", `max. ${spot.gustMax} km/h`],
    ["Gelände", null],
    ["Schwierigkeit", diffL.text],
    ["Gleitschirm", spot.gleitschirm || null],
  ];
  return `<div class="dv-table">${rows.map(([label, val]) => `
    <div class="dv-row"><span class="dv-row-label">${label}</span><span class="dv-row-val">${val != null ? val : NA}</span></div>`).join("")}</div>`;
}
// "Live"-Tab: Live-Wetterstation + Live-Cam, jeweils nur falls fürs Gelände hinterlegt,
// plus Übersichtskarte mit Start- und Landeplatz + Link auf ein Satellitenbild des Landeplatzes.
function liveCardsHtml(spot) {
  const cards = [];
  if (spot.livewetter) cards.push({ ic: "📡", label: "Live-Wetter", sub: "Station live ansehen", href: spot.livewetter });
  if (spot.webcam) cards.push({ ic: "📷", label: "Live-Cam", sub: "Live-Bild ansehen", href: spot.webcam });
  const cardsHtml = cards.length ? `<div class="dv-cards">${cards.map(c => `
    <a class="dv-card" href="${c.href}" target="_blank" rel="noopener">
      <div class="dv-card-ic">${c.ic}</div>
      <div class="dv-card-label">${c.label}</div>
      <div class="dv-card-sub"><span class="dv-dot gut"></span>${c.sub}</div>
    </a>`).join("")}</div>` : `<p class="empty">Für dieses Gelände sind noch keine Live-Daten hinterlegt.</p>`;
  const satCards = [];
  if (spot.lat != null && spot.lon != null) satCards.push({ ic: "icons/marker-start.png", label: spot.name, href: mapsUrl(spot) });
  const landePlaetzeNav = [];
  if (spot.landeLat != null && spot.landeLon != null) landePlaetzeNav.push({ name: spot.landeName || "Landeplatz", lat: spot.landeLat, lon: spot.landeLon });
  if (Array.isArray(spot.landeExtra)) landePlaetzeNav.push(...spot.landeExtra);
  landePlaetzeNav.forEach(l => satCards.push({ ic: "icons/marker-lande.png", label: l.name, href: mapsUrl({ lat: l.lat, lon: l.lon }) }));
  const satHtml = satCards.length ? `
    <h3 class="dv-h3">🚗 Navigieren zu Start- und Landeplätzen</h3>
    <div class="dv-cards">${satCards.map(c => `
    <a class="dv-card" href="${c.href}" target="_blank" rel="noopener">
      <img class="dv-card-ic-img" src="${c.ic}" alt="">
      <div class="dv-card-label">${c.label}</div>
    </a>`).join("")}</div>` : "";
  return `${cardsHtml}
    <h3 class="dv-h3">Start &amp; Landeplatz</h3>
    <div class="mini-map-wrap">
      <div id="miniMap" class="mini-map"></div>
      <div class="mini-style-toggle" role="group" aria-label="Kartenstil">
        <button type="button" class="mini-style-btn on" data-ministyle="street">Karte</button>
        <button type="button" class="mini-style-btn" data-ministyle="sat">Satellit</button>
        <button type="button" class="mini-style-btn" data-ministyle="terrain">Gelände</button>
      </div>
      <div class="mini-map-legend"><img src="icons/marker-start.png" alt=""><span>Startplatz</span><img src="icons/marker-lande.png" alt=""><span>Landeplatz</span></div>
      <div class="map-attrib" id="miniMapAttrib">${attribTextFor(miniMapStyleMode)}</div>
    </div>
    ${satHtml}`;
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
    return `<span class="${cls}"${style} title="${info} · ${rtxt}" data-info="${info}" data-reason="${rtxt}" data-rating="${x.rating}" data-ws="${x.ws}" data-wd="${x.wd}" data-wg="${x.wg}" data-hourlabel="${hourLabel}"><span class="h-num">${x.t.getHours()}</span>${hwx}${htemp}</span>`;
  }).join("");
  const winTxt = day.windows.length ? day.windows.map(windowLabel).join(" · ") : "";
  const rating = `<div class="drating ${rv.cls}"><span class="dstars">${starStr(rv.stars)}</span><span class="dverdict">${rv.text}</span>${winTxt ? `<span class="dwin"> · ${winTxt}</span>` : ""}</div>`;
  return `
    <div class="day ${day.windows.length ? "hasgreen" : ""}">
      <div class="dlabel-wd">${wd} ${day.date.getDate()}.${day.date.getMonth()+1}.</div>
      <div class="dright"><div class="hours">
        <div class="scp-day-wrap">${spotCompassSvg(spot, 0, { neutral: true, compact: true })}</div>
        ${hoursHtml}
      </div><div class="hour-detail" hidden></div><div class="dbottom">${rating}</div></div>
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
  const nowBar = cur ? `
    <div class="nowbar">
      <span class="wind-ind"><svg viewBox="0 0 24 24" style="transform:rotate(${Math.round((cur.wd + 180) % 360)}deg)"><path d="M12 2 L19 21 L12 16.5 L5 21 Z"/></svg></span>
      <span class="wind-txt">jetzt <b>${Math.round(cur.ws)}</b> km/h aus <b>${degToCompass(cur.wd)}</b> · Böen ${Math.round(cur.wg)}</span>
      ${nowFit}
      ${sun ? `<span class="sun-txt">🌅 ${fmtTime(sun.sunrise)} · 🌇 ${fmtTime(sun.sunset)}</span>` : ""}
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
      <span class="wind-ind"><svg viewBox="0 0 24 24" style="transform:rotate(${(L.dir + 180) % 360}deg)"><path d="M12 2 L19 21 L12 16.5 L5 21 Z"/></svg></span>
      <span class="lw-txt"><b>Live ${L.avg}</b> km/h aus <b>${degToCompass(L.dir)}</b> · Böen ${L.max}</span>
      ${fit}
      <span class="lw-src">${L.name} · ${L.dist.toFixed(1)} km · vor ${L.ago} Min · gemessen</span>
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
  const actList = [
    { icon: IC_WIND, label: "Windy", href: `https://www.windy.com/?${spot.lat},${spot.lon},12` },
  ];
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
  const ftHint = rt.type ? `<div class="ft-hint">Flugart nur grobe Schätzung – kein Thermik-Forecast</div>` : "";
  const statusCard = statusCardHtml(days[dayIdx], rt, ts, dayW);

  // Kompakt (Favoriten): nur Name/Region + Ampel-Badge in der Kopfzeile - der Rest der Karte
  // ist leer, die ganze Kachel oeffnet per Klick das volle Detailfenster (s. data-spot-Handler).
  const body = opts.collapsible
    ? ``
    // Detailfenster: Wetter-Tab unverändert; Details-Tab neu nach Mockup (Zustiegs-/Flugart-Karten,
    // Startplatz-Datentabelle, Start-/Landeplatz-Karten mit Bild+Navigation, Aktionen).
    : `
      <div class="dtabs" role="tablist">
        <button type="button" class="dtab on" data-tab="wetter" role="tab">Wetter</button>
        <button type="button" class="dtab" data-tab="live" role="tab">Live</button>
        <button type="button" class="dtab" data-tab="details" role="tab">Details</button>
      </div>
      <div class="dtab-panels">
        <div class="dtab-panel" id="dtab-wetter">${statusCard}${ftHint}<div class="days">${daysHtml}</div>
          <div class="hist-section">
            <h3 class="dv-h3">📅 Wetter-Verlauf</h3>
            <input type="date" class="hist-date" data-hist="${spot.id}" max="${histMaxDate()}">
            <div class="hist-body"></div>
          </div>
        </div>
        <div class="dtab-panel" id="dtab-live" hidden>${liveHtml}${nowBar}${liveCardsHtml(spot)}</div>
        <div class="dtab-panel" id="dtab-details" hidden>${(() => {
          const diffL = diffLabelFull(spot);
          const thStart = thermikStartHour(days[dayIdx], ts.win);
          return `
            ${diffHtml}
            ${iconCardsHtml(spot, thStart, opts.driveSec)}
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
async function renderSearch(candidates, origin, headline) {
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
    updateMapMarkers(displayRowsFor(rows));
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
function rowsBounds(rows) {
  if (!rows.length) return null;
  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
  rows.forEach(r => {
    minLat = Math.min(minLat, r.spot.lat); maxLat = Math.max(maxLat, r.spot.lat);
    minLon = Math.min(minLon, r.spot.lon); maxLon = Math.max(maxLon, r.spot.lon);
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
  startEl.className = "mini-marker mini-start"; startEl.innerHTML = `<img src="icons/marker-start.png" alt="Startplatz">`; startEl.title = spot.name;
  startEl.addEventListener("click", () => window.open(satMapsUrl(spot.lat, spot.lon), "_blank"));
  new maplibregl.Marker({ element: startEl }).setLngLat([spot.lon, spot.lat]).addTo(miniMapInstance);
  landePlaetze.forEach(l => {
    const landeEl = document.createElement("div");
    landeEl.className = "mini-marker mini-lande"; landeEl.innerHTML = `<img src="icons/marker-lande.png" alt="Landeplatz">`; landeEl.title = l.name;
    landeEl.addEventListener("click", () => window.open(satMapsUrl(l.lat, l.lon), "_blank"));
    new maplibregl.Marker({ element: landeEl }).setLngLat([l.lon, l.lat]).addTo(miniMapInstance);
  });
  if (points.length > 1) {
    const lons = points.map(p => p[0]), lats = points.map(p => p[1]);
    miniMapInstance.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]], { padding: 50, animate: false, maxZoom: 15 });
  }
  syncUserDot();
  refreshUserPos();
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
  });
  mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  mapInstance.on("zoom", updateMapLabelVisibility);
  mapInstance.on("moveend", () => { lastMapView = { center: mapInstance.getCenter(), zoom: mapInstance.getZoom() }; });
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
  mapInstance.on("click", async e => {
    if (mapInstance.queryRenderedFeatures(e.point, { layers: ["extra-points-layer"] }).length) return;
    const { lat, lng } = e.lngLat;
    const tempEl = document.createElement("div");
    tempEl.className = "map-marker map-marker-temp";
    tempEl.innerHTML = `<img src="icons/marker-start.png" alt="">`;
    const tempMarker = new maplibregl.Marker({ element: tempEl }).setLngLat([lng, lat]).addTo(mapInstance);
    mapMarkers.push(tempMarker);
    const place = await reverseGeocode(lat, lng);
    await runFlySearch(lat, lng, place || `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
  });
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
async function runFlySearch(lat, lon, label) {
  lastOrigin = { lat, lon, label };
  rerunSearch = () => runFlySearch(lat, lon, label);
  const radius = getRadius();
  updateRadiusCircle(lat, lon, radius);
  const candidates = allKnownSpots()
    .map(s => { const d = haversine(lat, lon, s.lat, s.lon); return { ...s, dist: d, sortKey: d }; })
    .filter(s => s.dist <= radius)
    .sort((a, b) => a.sortKey - b.sortKey);
  const headline = `${dayWord()} im Umkreis ${radius} km${label ? " um <b>" + label + "</b>" : ""}`;
  await renderSearch(candidates, { lat, lon }, headline);
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

// ---------------- Router ----------------
const PAGES = {
  home:      { title: "GoFlyToday", sub: "Wetter. Startplätze. Entscheidung." },
  favorites: { title: "Favoriten", sub: "Deine Plätze · 5-Tage-Ansicht" },
  add:       { title: "Fluggebiet hinzufügen", sub: "Aus Datenbank oder eigenen Platz" },
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
  if (id === "add") renderDbSearch();
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
    if (tab.dataset.tab === "live" && currentDetailSpot) ensureMiniMap(currentDetailSpot);
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
      scpWrap.innerHTML = spotCompassSvg(spotForCompass, +hcell.dataset.wd, { compact: true, rating: hcell.dataset.rating });
    }
    const hd = dayEl && dayEl.querySelector(".hour-detail");
    if (hd) {
      const rea = hcell.dataset.reason, rating = hcell.dataset.rating;
      hd.innerHTML = hcell.dataset.info + (rea ? ` · <span class="hd-reason ${rating}">${rea}</span>` : "");
      hd.hidden = false;
    }
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
  const del = e.target.closest("[data-del]");
  if (del) {
    if (confirm("Diesen eigenen Platz löschen (und aus Favoriten entfernen)?")) {
      saveUserSpots(loadUserSpots().filter(s => s.id !== del.dataset.del));
      const f = loadFavs().filter(id => id !== del.dataset.del); saveFavs(f);
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
function resetForm() {
  form.reset(); selectedDirs.clear();
  compassEl.querySelectorAll(".on").forEach(b => b.classList.remove("on"));
  document.getElementById("formErr").hidden = true;
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
  const spot = {
    id: "user_" + Date.now(), name: form.name.value.trim(), region: form.region.value.trim(),
    lat, lon, elevation, sectors: dirsToSectors(selectedDirs),
    sectorLabel: dirs.map(i => COMPASS_16[i]).join(", "),
    windMin: parseFloat(form.windMin.value) || 0,
    windMax: parseFloat(form.windMax.value) || 30,
    gustMax: parseFloat(form.gustMax.value) || 35,
  };
  const list = loadUserSpots(); list.push(spot); saveUserSpots(list);
  const f = loadFavs(); f.push(spot.id); saveFavs(f);   // eigener Platz ist automatisch Favorit
  resetForm();
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
