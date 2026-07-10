// Flugwetter-App – Logik: Datenbank + Favoriten, Umkreissuche, Ampel, 3h-Fenster.

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MIN_WINDOW = 3;          // Fenster erst ab so vielen zusammenhängenden Stunden
const DEFAULT_RADIUS = 100;    // km

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

// Status "heute" für einen Platz (aus Tag-0-Daten): {status:'gut'|'grenz'|'nein', win?, reason?}
function todayStatus(days) {
  const day = days[0];
  if (!day) return { status: "nein", reason: "—" };
  const green = day.windows.filter(w => w.color === "gut");
  const yellow = day.windows.filter(w => w.color === "grenz");
  if (green.length) return { status: "gut", win: green[0] };
  if (yellow.length) return { status: "grenz", win: yellow[0] };
  const reasons = {};
  day.dayHours.forEach(x => { if (x.rating === "nein") reasons[x.reason] = (reasons[x.reason] || 0) + 1; });
  const top = Object.entries(reasons).sort((a, b) => b[1] - a[1])[0];
  return { status: "nein", reason: top ? top[0] : "—" };
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
// Mehrere Plätze in EINEM Aufruf (nur heute) – für die Umkreissuche.
async function fetchBulkToday(spots) {
  const lats = spots.map(s => s.lat).join(","), lons = spots.map(s => s.lon).join(",");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation` +
    `&daily=sunrise,sunset&timezone=Europe%2FBerlin&forecast_days=1&wind_speed_unit=kmh`;
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

function renderCard(spot, days) {
  const ts = todayStatus(days);
  // Aktuelle Stunde (für Live-Windanzeige) + heutige Sonnenzeiten
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
    ? `<span class="badge red">🔴 heute nichts</span>`
    : `<span class="badge ${ts.status === "gut" ? "green" : "amber"}">${statusDot(ts.status)} heute ${windowLabel(ts.win).replace(/^🟢 |^🟡 /, "")}</span>`;

  const daysHtml = days.slice(0, 7).map(day => {
    const hoursHtml = day.dayHours.map(x => {
      const cls = x.rating === "gut" ? "h gut" : x.rating === "grenz" ? "h grenz" : "h";
      const title = x.rating === "nein" ? x.reason
        : `${Math.round(x.ws)} km/h aus ${degToCompass(x.wd)} · Böen ${Math.round(x.wg)}${x.reason ? " · " + x.reason : ""}`;
      return `<span class="${cls}" title="${title}">${x.t.getHours()}</span>`;
    }).join("");
    const wx = day.wx && day.wx.code != null
      ? `<div class="wx">${weatherEmoji(day.wx.code)} <span class="tmax">${day.wx.tmax}°</span> / <span class="tmin">${day.wx.tmin}°</span></div>` : "";
    const winTxt = day.windows.length ? day.windows.map(windowLabel).join(" · ") : "—";
    return `
      <div class="day ${day.windows.length ? "hasgreen" : ""}">
        <div class="dlabel">${WEEKDAYS[day.date.getDay()]}<br>${day.date.getDate()}.${day.date.getMonth()+1}.</div>
        <div class="dright"><div class="hours">${hoursHtml}</div>${wx}<div class="wins">${winTxt}</div></div>
      </div>`;
  }).join("");

  const del = spot.id.startsWith("user_")
    ? `<button class="ic0" data-del="${spot.id}" title="Eigenen Platz löschen">🗑</button>` : "";

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
      <div class="spot-meta">Erlaubt: <b>${spot.sectorLabel}</b> · Wind ${spot.windMin}–${spot.windMax} km/h · Böen ≤ ${spot.gustMax}${spot.elevation!=null?" · "+spot.elevation+" m":""}</div>
      ${nowBar}
      <div class="days">${daysHtml}</div>
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
    try { return renderCard(s, analyse(s, await fetchForecast(s))); }
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

// Kernsuche ab einem Ausgangspunkt (GPS oder PLZ).
async function runFlySearch(lat, lon, label) {
  const out = document.getElementById("flyResults");
  const radius = parseInt(document.getElementById("radius").value, 10);
  const candidates = allKnownSpots()
    .map(s => ({ ...s, dist: haversine(lat, lon, s.lat, s.lon) }))
    .filter(s => s.dist <= radius)
    .sort((a, b) => a.dist - b.dist);

  if (!candidates.length) {
    out.innerHTML = `<p class="empty">Kein Startplatz im Umkreis von ${radius} km${label ? " um " + label : ""}. (Die Datenbank wächst noch.)</p>`;
    return;
  }
  out.innerHTML = `<p class="loading-line">🔎 Prüfe ${candidates.length} Plätze …</p>`;
  try {
    const results = await fetchBulkToday(candidates);
    const rows = candidates.map((s, i) => ({ spot: s, ts: todayStatus(analyse(s, results[i])) }));
    const rank = { gut: 0, grenz: 1, nein: 2 };
    rows.sort((a, b) => rank[a.ts.status] - rank[b.ts.status] || a.spot.dist - b.spot.dist);
    renderFlyResults(rows, radius, label);
  } catch (e) {
    out.innerHTML = `<p class="empty">Fehler beim Abruf: ${e.message}</p>`;
  }
}

// Button: Standort per GPS
document.getElementById("flyBtn").addEventListener("click", () => {
  const out = document.getElementById("flyResults"), btn = document.getElementById("flyBtn");
  if (!navigator.geolocation) { out.innerHTML = `<p class="empty">Standort nicht unterstützt – nutze die PLZ-Suche.</p>`; return; }
  btn.classList.add("busy"); out.innerHTML = `<p class="loading-line">📍 Standort wird ermittelt …</p>`;
  navigator.geolocation.getCurrentPosition(async pos => {
    await runFlySearch(pos.coords.latitude, pos.coords.longitude, null);
    btn.classList.remove("busy");
  }, () => {
    btn.classList.remove("busy");
    out.innerHTML = `<p class="empty">Standort nicht verfügbar (Berechtigung?). Nutze die PLZ-Suche unten.</p>`;
  });
});

// PLZ-Suche
async function plzSearch() {
  const inp = document.getElementById("plzInput"), out = document.getElementById("flyResults");
  const plz = inp.value.trim();
  if (!/^\d{5}$/.test(plz)) { out.innerHTML = `<p class="empty">Bitte eine 5-stellige Postleitzahl eingeben.</p>`; return; }
  out.innerHTML = `<p class="loading-line">🔎 Suche PLZ ${plz} …</p>`;
  try { const o = await geocodePlz(plz); await runFlySearch(o.lat, o.lon, o.label); }
  catch { out.innerHTML = `<p class="empty">PLZ ${plz} nicht gefunden.</p>`; }
}
document.getElementById("plzBtn").addEventListener("click", plzSearch);
document.getElementById("plzInput").addEventListener("keydown", e => { if (e.key === "Enter") plzSearch(); });

function renderFlyResults(rows, radius, label) {
  const flyable = rows.filter(r => r.ts.status !== "nein").length;
  const head = `<div class="fly-head">Heute im Umkreis ${radius} km${label ? " um <b>" + label + "</b>" : ""} · <b>${flyable}</b> von ${rows.length} fliegbar</div>`;
  const list = rows.map(r => {
    const s = r.spot, ts = r.ts;
    const fav = isFav(s.id);
    const right = ts.status === "nein"
      ? `<span class="fr-reason">${ts.reason}</span>`
      : `<span class="fr-win">${windowLabel(ts.win)}</span>`;
    return `
      <div class="fr ${ts.status}" data-spot="${s.id}">
        <span class="fr-dot">${statusDot(ts.status)}</span>
        <div class="fr-mid">
          <div class="fr-name">${s.name} <span class="fr-go">›</span></div>
          <div class="fr-sub">${s.dist} km · ${s.sectorLabel}</div>
        </div>
        ${right}
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
  try { body.innerHTML = renderCard(spot, analyse(spot, await fetchForecast(spot))); }
  catch (e) { body.innerHTML = `<div class="card">Fehler: ${e.message}</div>`; }
}
function closeDetail() {
  document.getElementById("detailModal").hidden = true;
  document.getElementById("detailBody").innerHTML = "";
}
document.getElementById("detailClose").addEventListener("click", closeDetail);
document.getElementById("detailModal").addEventListener("click", e => { if (e.target.id === "detailModal") closeDetail(); });

// ---------------- Neu: Datenbank-Suche + eigener Platz ----------------
function renderDbSearch(query = "") {
  const wrap = document.getElementById("dbResults");
  const q = query.trim().toLowerCase();
  let list = SPOT_DB.concat(loadUserSpots());
  if (q) list = list.filter(s => (s.name + " " + (s.region||"")).toLowerCase().includes(q));
  else list = list.slice(0, 8);
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
  home:      { title: "Wo kann ich fliegen?", sub: "Heute · in deiner Nähe" },
  favorites: { title: "Favoriten", sub: "Deine Plätze · 7-Tage-Ansicht" },
  add:       { title: "Fluggebiet hinzufügen", sub: "Aus Datenbank oder eigenen Platz" },
  info:      { title: "Info", sub: "Wie die App funktioniert" },
  legal:     { title: "Recht", sub: "Rechtliche Einordnung" },
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
}
window.addEventListener("hashchange", route);

// ---------------- Events ----------------
// (Der „Wo kann ich fliegen?"-Button und die PLZ-Suche sind oben registriert.)

// Favoriten-Stern & Löschen (Event-Delegation über die ganze Seite)
document.body.addEventListener("click", e => {
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

// Radius merken
document.getElementById("radius").addEventListener("change", e =>
  localStorage.setItem("flugwetter_radius", e.target.value));

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
  if (r) document.getElementById("radius").value = r;
  route();
})();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
