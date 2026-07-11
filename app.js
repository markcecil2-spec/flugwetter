// Flugwetter-App – Logik: Datenbank + Favoriten, Umkreissuche, Ampel, 3h-Fenster.

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MIN_WINDOW = 3;          // Fenster erst ab so vielen zusammenhängenden Stunden
const DEFAULT_RADIUS = 100;    // km
const MAX_CANDIDATES = 100;    // max. Plätze pro Suche (Performance bei großer DB)
const NAV_ICON = `<svg class="nav-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 L4.5 20.29 L5.21 21 L12 18 L18.79 21 L19.5 20.29 Z"/></svg>`;

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
function inSectors(dir, sectors) {
  return sectors.some(([f, t]) => (f <= t ? dir >= f && dir <= t : dir >= f || dir <= t));
}
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLon/2)**2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

// Bewertung einer Stunde: 'gut' | 'grenz' | 'nein' + Grund (bei nein/grenz).
function rateHour(spot, ws, wd, wg, rain, isDay) {
  if (!isDay) return { rating: "nein", reason: "Nacht" };
  if (rain > 0) return { rating: "nein", reason: "Regen" };
  if (!inSectors(wd, spot.sectors)) return { rating: "nein", reason: "Richtung" };
  if (ws > spot.windMax) return { rating: "nein", reason: "zu stark" };
  if (wg > spot.gustMax) return { rating: "nein", reason: "Böen" };
  if (ws < spot.windMin) return { rating: "grenz", reason: "schwach" };
  if (wg >= spot.gustMax * 0.85) return { rating: "grenz", reason: "böig" };
  if (ws >= spot.windMax * 0.85) return { rating: "grenz", reason: "recht stark" };
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
  return `${w.color === "gut" ? "🟢" : "🟡"} ${fmtHour(w.from)}–${fmtHourPlus(w.to)}`;
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
    const { rating, reason } = rateHour(spot, ws, wd, wg, rain, isDay);
    if (!days[key]) days[key] = { key, date: t, wx: dl, hours: [] };
    days[key].hours.push({ t, ws, wd, wg, rain, rating, reason, isDay });
  }
  return Object.values(days).map(day => {
    const dayHours = day.hours.filter(x => x.isDay);
    const windows = findWindows(dayHours);
    return { ...day, dayHours, windows };
  });
}

// Kurz-Label für den Grund (Anzeige rechts neben dem Ergebnis)
function grenzLabel(r) {
  return r === "böig" ? "💨 Böig" : r === "schwach" ? "🍃 Wenig Wind" : r === "recht stark" ? "💨 Recht stark" : "Grenzwertig";
}
function neinLabel(r) {
  const m = { "Regen": "🌧️ Regen", "Richtung": "🧭 Windrichtung", "zu stark": "💨 Zu viel Wind", "Böen": "💨 Böig", "Nacht": "🌙 Nachts" };
  return m[r] || r;
}
function neinText(r) {
  const m = { "Regen": "Regen", "Richtung": "falsche Windrichtung", "zu stark": "zu viel Wind", "Böen": "zu böig", "Nacht": "nachts" };
  return m[r] || r;
}
// Klartext-Grund pro Stunde (für das Uhrzeit-Detail)
function hourReason(rating, reason) {
  if (rating === "gut") return "passt ✓";
  const grenz = { "schwach": "grenzwertig – wenig Wind", "böig": "grenzwertig – böig", "recht stark": "grenzwertig – recht stark" };
  const nein = { "Richtung": "falsche Windrichtung", "Regen": "Regen", "zu stark": "zu viel Wind", "Böen": "zu böig", "Nacht": "nachts", "schwach": "zu wenig Wind" };
  return rating === "grenz" ? (grenz[reason] || "grenzwertig") : (nein[reason] || reason);
}
function dominantReason(hours, rating) {
  const c = {};
  hours.forEach(x => { if (x.rating === rating) c[x.reason] = (c[x.reason] || 0) + 1; });
  const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : "";
}

// Status für einen Tag (idx 0=heute, 1=morgen): {status, win?, reason?, reasonLabel}
function dayStatus(days, idx = 0) {
  const day = days[idx];
  if (!day) return { status: "nein", reason: "—", reasonLabel: "—" };
  const green = day.windows.filter(w => w.color === "gut");
  const yellow = day.windows.filter(w => w.color === "grenz");
  if (green.length) return { status: "gut", win: green[0], reasonLabel: "💨 Wind passt" };
  if (yellow.length) return { status: "grenz", win: yellow[0], reasonLabel: grenzLabel(dominantReason(day.dayHours, "grenz")) };
  const r = dominantReason(day.dayHours, "nein") || "—";
  return { status: "nein", reason: r, reasonLabel: neinLabel(r), reasonText: neinText(r) };
}
function todayStatus(days) { return dayStatus(days, 0); }

// Sterne-Bewertung für den gewählten Tag (emotional schnell erfassbar)
function todayRating(days, idx = 0) {
  const ts = dayStatus(days, idx);
  const day = days[idx];
  const w = idx === 1 ? "Morgen" : "Heute";
  const green = day ? day.dayHours.filter(h => h.rating === "gut").length : 0;
  const grenz = day ? day.dayHours.filter(h => h.rating === "grenz").length : 0;
  if (ts.status === "gut") {
    const stars = green >= 5 ? 5 : 4;
    return { stars, label: stars === 5 ? `${w} sehr gut geeignet` : `${w} gut geeignet`, cls: "gut" };
  }
  if (ts.status === "grenz") {
    const stars = grenz >= 4 ? 3 : 2;
    return { stars, label: "Grenzwertig", cls: "grenz" };
  }
  return { stars: 1, label: `${w} nicht geeignet`, cls: "nein" };
}

// ---------------- Fetching ----------------
async function fetchForecast(spot) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation` +
    `&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Europe%2FBerlin&forecast_days=7&wind_speed_unit=kmh`;
  if (spot.elevation != null && !isNaN(spot.elevation)) url += `&elevation=${spot.elevation}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo " + res.status);
  return res.json();
}
// Mehrere Plätze in EINEM Aufruf (heute + morgen) – für die Umkreis-/Regionssuche.
async function fetchBulkToday(spots) {
  const lats = spots.map(s => s.lat).join(","), lons = spots.map(s => s.lon).join(",");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation` +
    `&daily=sunrise,sunset&timezone=Europe%2FBerlin&forecast_days=2&wind_speed_unit=kmh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo " + res.status);
  const j = await res.json();
  return Array.isArray(j) ? j : [j];
}
async function fetchElevation(lat, lon) {
  const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
  if (!res.ok) throw new Error("Höhe?");
  return Math.round((await res.json()).elevation[0]);
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
function winTimeShort(w) { return `${w.from.getHours()}–${(w.to.getHours() + 1) % 24} Uhr`; }

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
  return status === "gut" ? "🟢" : status === "grenz" ? "🟡" : "🔴";
}
function fmtTime(d) { return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0"); }

function renderCard(spot, days, opts = {}) {
  const dayIdx = opts.dayIdx || 0;
  const dayW = dayIdx === 1 ? "morgen" : "heute";
  const ts = dayStatus(days, dayIdx);
  const now = new Date();
  const flat = days.flatMap(d => d.hours);
  const cur = flat.find(h => h.t.getHours() === now.getHours() && h.t.getDate() === now.getDate() && h.t.getMonth() === now.getMonth()) || flat[Math.min(12, flat.length - 1)];
  const sun = days[0] && days[0].wx;
  const nowBar = cur ? `
    <div class="nowbar">
      <span class="wind-ind"><svg viewBox="0 0 24 24" style="transform:rotate(${Math.round((cur.wd + 180) % 360)}deg)"><path d="M12 2 L19 21 L12 16.5 L5 21 Z"/></svg></span>
      <span class="wind-txt">jetzt <b>${Math.round(cur.ws)}</b> km/h aus <b>${degToCompass(cur.wd)}</b> · Böen ${Math.round(cur.wg)}</span>
      ${sun ? `<span class="sun-txt">🌅 ${fmtTime(sun.sunrise)} · 🌇 ${fmtTime(sun.sunset)}</span>` : ""}
    </div>` : "";
  const badge = ts.status === "nein"
    ? `<span class="badge red">🔴 ${dayW}: ${ts.reasonText}</span>`
    : `<span class="badge ${ts.status === "gut" ? "green" : "amber"}">${statusDot(ts.status)} ${dayW} ${windowLabel(ts.win).replace(/^🟢 |^🟡 /, "")}</span>`;

  const daysHtml = days.slice(0, 7).map(day => {
    const wd = WEEKDAYS[day.date.getDay()];
    const hoursHtml = day.dayHours.map(x => {
      const cls = x.rating === "gut" ? "h gut" : x.rating === "grenz" ? "h grenz" : "h";
      const info = `${wd} ${x.t.getHours()} Uhr · ${Math.round(x.ws)} km/h aus ${degToCompass(x.wd)} · Böen ${Math.round(x.wg)}`;
      const rtxt = hourReason(x.rating, x.reason);
      return `<span class="${cls}" title="${info} · ${rtxt}" data-info="${info}" data-reason="${rtxt}" data-rating="${x.rating}">${x.t.getHours()}</span>`;
    }).join("");
    const wx = day.wx && day.wx.code != null
      ? `<div class="wx">${weatherEmoji(day.wx.code)} <span class="tmax">${day.wx.tmax}°</span> / <span class="tmin">${day.wx.tmin}°</span></div>` : "";
    const winTxt = day.windows.length ? day.windows.map(windowLabel).join(" · ") : "—";
    return `
      <div class="day ${day.windows.length ? "hasgreen" : ""}">
        <div class="dlabel">${wd}<br>${day.date.getDate()}.${day.date.getMonth()+1}.</div>
        <div class="dright"><div class="hours">${hoursHtml}</div>${wx}<div class="wins">${winTxt}</div><div class="hour-detail" hidden></div></div>
      </div>`;
  }).join("");

  const del = spot.id.startsWith("user_")
    ? `<button class="ic0" data-del="${spot.id}" title="Eigenen Platz löschen">🗑</button>` : "";

  // Aktionsleiste: Einstiegspunkte für den Flugtag
  const acts = [
    `<a class="act nav" href="${mapsUrl(spot)}" target="_blank" rel="noopener">${NAV_ICON} Navigation</a>`,
    `<a class="act" href="https://www.windy.com/?${spot.lat},${spot.lon},12" target="_blank" rel="noopener">🌬️ Windy</a>`,
  ];
  if (spot.webcam) acts.push(`<a class="act" href="${spot.webcam}" target="_blank" rel="noopener">📷 Webcam</a>`);
  if (spot.dhv) acts.push(`<a class="act" href="https://service.dhv.de/db2/details.php?qi=glp_details&item=${spot.dhv}" target="_blank" rel="noopener">📋 DHV</a>`);
  const actions = `<div class="actions">${acts.join("")}</div>`;

  const metaHtml = `<div class="spot-meta">Erlaubt: <b>${spot.sectorLabel}</b> · Wind ${spot.windMin}–${spot.windMax} km/h · Böen ≤ ${spot.gustMax}${spot.elevation!=null?" · "+spot.elevation+" m":""}</div>`;

  const rt = todayRating(days, dayIdx);
  const ratingBlock = `<div class="rating ${rt.cls}"><span class="stars">${"★".repeat(rt.stars)}<span class="star-off">${"★".repeat(5 - rt.stars)}</span></span><span class="rating-label">${rt.label}</span></div>`;

  // Kompakt (Favoriten): nur Kopf + Aktionen sichtbar, Rest im Aufklapp-Menü.
  const body = opts.collapsible
    ? `${actions}
      <button class="days-toggle" aria-expanded="false"><span class="dt-arrow">▾</span> Details &amp; Wochenübersicht</button>
      <div class="fav-more collapsed">${ratingBlock}${metaHtml}${nowBar}<div class="days">${daysHtml}</div></div>`
    : `${ratingBlock}${metaHtml}${actions}${nowBar}<div class="days">${daysHtml}</div>`;

  return `
    <div class="card">
      <div class="card-head">
        <div>
          <div class="spot-name">${spot.name}</div>
          <div class="spot-region">${spot.region || ""}</div>
        </div>
        <div class="head-right">
          ${badge}
          <button class="ic0 star on" data-fav="${spot.id}" title="Aus Favoriten entfernen">★</button>
          ${del}
        </div>
      </div>
      ${body}
    </div>`;
}

async function renderFavorites() {
  const list = document.getElementById("favList");
  const empty = document.getElementById("favEmpty");
  const favs = favoriteSpots();
  empty.hidden = favs.length > 0;
  if (!favs.length) { list.innerHTML = ""; return; }
  list.innerHTML = favs.map(s => `<div class="card loading">Lade ${s.name} …</div>`).join("");
  const cards = await Promise.all(favs.map(async s => {
    try { return renderCard(s, analyse(s, await fetchForecast(s)), { collapsible: true }); }
    catch (e) { return `<div class="card"><div class="spot-name">${s.name}</div><div class="spot-region">Fehler: ${e.message}</div></div>`; }
  }));
  list.innerHTML = cards.join("");
}

// ---------------- „Wo kann ich heute fliegen?" ----------------
// PLZ (Deutschland) -> Koordinaten via zippopotam.us (kostenlos, ohne Schlüssel).
async function geocodePlz(plz) {
  const res = await fetch(`https://api.zippopotam.us/de/${plz}`);
  if (!res.ok) throw new Error("PLZ nicht gefunden");
  const j = await res.json();
  const p = j.places[0];
  return { lat: parseFloat(p.latitude), lon: parseFloat(p.longitude), label: `${plz} ${p["place name"]}` };
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
};

// Gemeinsame Auswertung + Anzeige für eine Kandidatenliste.
// candidates: mit .dist (Anzeige-km oder null) und .sortKey (Zahl). origin: {lat,lon} oder null (für Fahrzeit).
async function renderSearch(candidates, origin, headline) {
  const out = document.getElementById("flyResults");
  const truncated = candidates.length > MAX_CANDIDATES;
  candidates = candidates.slice(0, MAX_CANDIDATES);
  if (!candidates.length) { out.innerHTML = `<p class="empty">Kein Startplatz gefunden. (Die Datenbank wächst noch.)</p>`; return; }
  out.innerHTML = `<p class="loading-line">🔎 Prüfe ${candidates.length} Plätze …</p>`;
  try {
    const results = await fetchBulkToday(candidates);
    let drive = [];
    if (origin) { try { drive = await fetchDriveTimes(origin, candidates); } catch { drive = []; } }
    const rows = candidates.map((s, i) => {
      const drv = drive[i];
      const subInfo = (drv != null ? "🚗 " + formatDur(drv) + " · " : "") +
        (s.dist != null ? s.dist + " km" : (s.region || ""));
      return { spot: s, ts: dayStatus(analyse(s, results[i]), searchDay), drive: drv, subInfo };
    });
    const rank = { gut: 0, grenz: 1, nein: 2 };
    rows.sort((a, b) =>
      rank[a.ts.status] - rank[b.ts.status] ||
      ((a.drive ?? a.spot.sortKey ?? Infinity) - (b.drive ?? b.spot.sortKey ?? Infinity)));
    renderFlyResults(rows, headline, truncated);
  } catch (e) {
    out.innerHTML = `<p class="empty">Fehler beim Abruf: ${e.message}</p>`;
  }
}

// Umkreissuche ab einem Punkt (GPS oder PLZ)
async function runFlySearch(lat, lon, label) {
  lastOrigin = { lat, lon, label };
  rerunSearch = () => runFlySearch(lat, lon, label);
  const radius = getRadius();
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
  rerunSearch = () => runRegionSearch(key);
  const origin = lastOrigin;
  const candidates = allKnownSpots()
    .map(s => {
      const toCenter = haversine(R.lat, R.lon, s.lat, s.lon);
      return { ...s, _c: toCenter,
        dist: origin ? haversine(origin.lat, origin.lon, s.lat, s.lon) : null,
        sortKey: origin ? haversine(origin.lat, origin.lon, s.lat, s.lon) : toCenter };
    })
    .filter(s => s._c <= R.r)
    .sort((a, b) => a.sortKey - b.sortKey);
  await renderSearch(candidates, origin, `${dayWord()} · Region <b>${R.name}</b>`);
}

// Filter: nur eigene Favoriten prüfen
async function runFavSearch() {
  rerunSearch = () => runFavSearch();
  const origin = lastOrigin;
  const favs = favoriteSpots();
  if (!favs.length) {
    document.getElementById("flyResults").innerHTML = `<p class="empty">Noch keine Favoriten. Über „＋ Neu" hinzufügen.</p>`;
    return;
  }
  const candidates = favs.map(s => {
    const d = origin ? haversine(origin.lat, origin.lon, s.lat, s.lon) : null;
    return { ...s, dist: d, sortKey: d ?? 0 };
  });
  await renderSearch(candidates, origin, `${dayWord()} · ⭐ Favoriten`);
}

// Heute/Morgen-Umschalter
document.getElementById("dayToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  searchDay = parseInt(b.dataset.day, 10);
  document.querySelectorAll("#dayToggle .rpill").forEach(x => x.classList.toggle("on", x === b));
  if (rerunSearch) rerunSearch();
});

// Land-Umschalter – filtert, welche Regionen im Dropdown zur Auswahl stehen
function renderRegionOptions(country) {
  const sel = document.getElementById("regionSelect");
  const opts = ['<option value="">Region / Filter …</option>', '<option value="__fav__">⭐ Meine Favoriten</option>'];
  Object.entries(REGIONS).forEach(([key, r]) => { if (r.country === country) opts.push(`<option value="${key}">${r.name}</option>`); });
  sel.innerHTML = opts.join("");
}
document.getElementById("countryToggle").addEventListener("click", e => {
  const b = e.target.closest("[data-country]"); if (!b) return;
  document.querySelectorAll("#countryToggle .rpill").forEach(x => x.classList.toggle("on", x === b));
  renderRegionOptions(b.dataset.country);
});
document.getElementById("regionSelect").addEventListener("change", e => {
  const v = e.target.value;
  if (v === "__fav__") runFavSearch();
  else if (v) runRegionSearch(v);
});

// Standort per GPS (Button + Auto-Start)
function startGpsSearch() {
  const out = document.getElementById("flyResults"), btn = document.getElementById("flyBtn");
  if (!navigator.geolocation) { out.innerHTML = `<p class="empty">Standort nicht unterstützt – nutze die PLZ-Suche.</p>`; return; }
  btn.classList.add("busy"); out.innerHTML = `<p class="loading-line">📍 Standort wird ermittelt …</p>`;
  navigator.geolocation.getCurrentPosition(async pos => {
    localStorage.setItem("flugwetter_geo_ok", "1");   // ab jetzt beim Öffnen automatisch
    await runFlySearch(pos.coords.latitude, pos.coords.longitude, null);
    btn.classList.remove("busy");
  }, () => {
    btn.classList.remove("busy");
    out.innerHTML = `<p class="empty">Standort nicht verfügbar (Berechtigung?). Nutze die PLZ-Suche unten.</p>`;
  });
}
document.getElementById("flyBtn").addEventListener("click", startGpsSearch);

// PLZ-Suche
async function plzSearch() {
  const inp = document.getElementById("plzInput"), out = document.getElementById("flyResults");
  const plz = inp.value.trim();
  if (!/^\d{5}$/.test(plz)) { out.innerHTML = `<p class="empty">Bitte eine 5-stellige Postleitzahl eingeben.</p>`; return; }
  out.innerHTML = `<p class="loading-line">🔎 Suche PLZ ${plz} …</p>`;
  try { const o = await geocodePlz(plz); await runFlySearch(o.lat, o.lon, o.label); }
  catch { out.innerHTML = `<p class="empty">PLZ ${plz} nicht gefunden.</p>`; }
}
document.getElementById("plzInput").addEventListener("keydown", e => { if (e.key === "Enter") plzSearch(); });
document.getElementById("plzInput").addEventListener("input", e => { if (/^\d{5}$/.test(e.target.value.trim())) plzSearch(); });

function mapsUrl(s) {
  return `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=driving`;
}
function renderFlyResults(rows, headline, truncated) {
  const flyable = rows.filter(r => r.ts.status !== "nein").length;
  const scope = truncated ? `<b>${flyable}</b> fliegbar (nächste ${rows.length} Plätze)` : `<b>${flyable}</b> von ${rows.length} fliegbar`;
  const head = `<div class="fly-head">${headline} · ${scope}</div>`;
  const list = rows.map(r => {
    const s = r.spot, ts = r.ts;
    const fav = isFav(s.id);
    const right = ts.status === "nein"
      ? `<span class="fr-nore">${ts.reasonText}</span>`
      : `<div class="fr-right"><div class="fr-line1">${winTimeShort(ts.win)}</div><div class="fr-line2">${ts.reasonLabel}</div></div>`;
    return `
      <div class="fr ${ts.status}" data-spot="${s.id}">
        <span class="fr-dot">${statusDot(ts.status)}</span>
        <div class="fr-mid">
          <div class="fr-name">${s.name} <span class="fr-go">›</span></div>
          <div class="fr-sub">${r.subInfo}</div>
        </div>
        ${right}
        <a class="fr-nav" href="${mapsUrl(s)}" target="_blank" rel="noopener" title="Navigation starten" aria-label="Navigation">${NAV_ICON}</a>
        <button class="ic0 star ${fav?"on":""}" data-fav="${s.id}" title="${fav?"Favorit":"Zu Favoriten"}">${fav?"★":"☆"}</button>
      </div>`;
  }).join("");
  document.getElementById("flyResults").innerHTML = head + `<div class="fr-list">${list}</div>`;
}

// ---------------- Detail-Fenster: 7-Tage-Vorhersage ----------------
async function openDetail(id) {
  const spot = getSpot(id); if (!spot) return;
  const modal = document.getElementById("detailModal"), body = document.getElementById("detailBody");
  modal.hidden = false;
  body.innerHTML = `<div class="card loading">Lade 7-Tage-Vorhersage für ${spot.name} …</div>`;
  try { body.innerHTML = renderCard(spot, analyse(spot, await fetchForecast(spot)), { dayIdx: searchDay }); }
  catch (e) { body.innerHTML = `<div class="card">Fehler: ${e.message}</div>`; }
}
function closeDetail() {
  document.getElementById("detailModal").hidden = true;
  document.getElementById("detailBody").innerHTML = "";
}
document.getElementById("detailClose").addEventListener("click", closeDetail);
document.getElementById("detailModal").addEventListener("click", e => { if (e.target.id === "detailModal") closeDetail(); });

// ---------------- Feedback ----------------
const FB_MAIL = "markcecil2@gmail.com";
const fbModal = document.getElementById("feedbackModal");
function fbClose() { fbModal.hidden = true; }
document.getElementById("feedbackBtn").addEventListener("click", () => { fbModal.hidden = false; document.getElementById("fbText").focus(); });
document.getElementById("feedbackClose").addEventListener("click", fbClose);
document.getElementById("fbCancel").addEventListener("click", fbClose);
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

// ---------------- Neu: Datenbank-Suche + eigener Platz ----------------
function renderDbSearch(query = "") {
  const wrap = document.getElementById("dbResults");
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
  home:      { title: "GoFlyToday", sub: "In 5 Sek.: Lohnt sich heute die Anfahrt?" },
  favorites: { title: "Favoriten", sub: "Deine Plätze · 7-Tage-Ansicht" },
  add:       { title: "Fluggebiet hinzufügen", sub: "Aus Datenbank oder eigenen Platz" },
  info:      { title: "Info & Recht", sub: "Wie die App funktioniert" },
};
function route() {
  let id = location.hash.replace("#/", "") || "home";
  if (!PAGES[id]) id = "home";
  document.querySelectorAll(".page").forEach(p => p.hidden = p.id !== "page-" + id);
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === id));
  document.getElementById("pageTitle").textContent = PAGES[id].title;
  document.getElementById("pageSub").textContent = PAGES[id].sub;
  window.scrollTo(0, 0);
  if (id === "favorites") renderFavorites();
  if (id === "add") renderDbSearch();
  // Killer-Feature: wenn Standort schon erlaubt, „Heute"-Liste automatisch laden
  if (id === "home" && localStorage.getItem("flugwetter_geo_ok") === "1" && !lastOrigin) startGpsSearch();
}
window.addEventListener("hashchange", route);

// ---------------- Events ----------------
// (Der „Wo kann ich fliegen?"-Button und die PLZ-Suche sind oben registriert.)

// Favoriten-Stern & Löschen (Event-Delegation über die ganze Seite)
document.body.addEventListener("click", e => {
  if (e.target.closest("a")) return;   // echte Links (Navigation/Deep-Links) normal öffnen lassen

  // Wochenübersicht auf-/zuklappen (Favoriten)
  const dtog = e.target.closest(".days-toggle");
  if (dtog) {
    const card = dtog.closest(".card");
    const moreEl = card && card.querySelector(".fav-more");
    if (moreEl) {
      const open = moreEl.classList.toggle("collapsed") === false;
      dtog.setAttribute("aria-expanded", open ? "true" : "false");
      dtog.querySelector(".dt-arrow").textContent = open ? "▴" : "▾";
    }
    return;
  }

  // Tap auf eine Stunde -> Winddetails anzeigen (Handy-tauglich, kein Hover nötig)
  const hcell = e.target.closest(".h[data-info]");
  if (hcell) {
    const card = hcell.closest(".card");
    if (card) {
      card.querySelectorAll(".hour-detail").forEach(x => { x.hidden = true; x.textContent = ""; });
      card.querySelectorAll(".h.sel").forEach(x => x.classList.remove("sel"));
    }
    const hd = hcell.closest(".day")?.querySelector(".hour-detail");
    if (hd) {
      const rea = hcell.dataset.reason, rating = hcell.dataset.rating;
      hd.innerHTML = hcell.dataset.info + (rea ? ` · <span class="hd-reason ${rating}">${rea}</span>` : "");
      hd.hidden = false;
    }
    hcell.classList.add("sel");
    return;
  }

  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) {
    toggleFav(favBtn.dataset.fav);
    if (!document.getElementById("page-favorites").hidden) renderFavorites();
    if (!document.getElementById("page-add").hidden) renderDbSearch(document.getElementById("dbSearch").value);
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
  // Klick auf eine Ergebnis-/Suchzeile -> 7-Tage-Detail
  const row = e.target.closest("[data-spot]");
  if (row) openDetail(row.dataset.spot);
});

// DB-Suche
document.getElementById("dbSearch").addEventListener("input", e => renderDbSearch(e.target.value));

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
  const r = localStorage.getItem("flugwetter_radius");
  if (r && document.querySelector(`#radiusPills .rpill[data-km="${r}"]`)) {
    document.querySelectorAll("#radiusPills .rpill").forEach(x => x.classList.toggle("on", x.dataset.km === r));
  }
  route();
})();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
