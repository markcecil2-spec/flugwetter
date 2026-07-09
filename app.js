// Flugwetter-App – Kernlogik: Vorhersage holen, Regeln prüfen, grüne Fenster anzeigen.

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

// Grad -> Himmelsrichtung (Kürzel)
function degToCompass(deg) {
  const dirs = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

// WMO-Wettercode -> Emoji
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
  return "❓";
}

// Liegt eine Windrichtung in einem der erlaubten Sektoren? (mit Wrap über 360°)
function inSectors(dir, sectors) {
  return sectors.some(([from, to]) => {
    if (from <= to) return dir >= from && dir <= to;
    return dir >= from || dir <= to;
  });
}

function checkHour(spot, ws, wd, wg, rain, isDay) {
  const reasons = [];
  if (!isDay) reasons.push("Nacht");
  if (!inSectors(wd, spot.sectors)) reasons.push("Richtung");
  if (ws < spot.windMin) reasons.push("zu schwach");
  if (ws > spot.windMax) reasons.push("zu stark");
  if (wg > spot.gustMax) reasons.push("Böen");
  if (rain > 0) reasons.push("Regen");
  return { ok: reasons.length === 0, reasons };
}

function buildDaylight(daily) {
  const map = {};
  daily.time.forEach((d, i) => {
    map[d] = {
      sunrise: new Date(daily.sunrise[i]),
      sunset: new Date(daily.sunset[i]),
      code: daily.weather_code[i],
      tmax: Math.round(daily.temperature_2m_max[i]),
      tmin: Math.round(daily.temperature_2m_min[i]),
    };
  });
  return map;
}

async function fetchForecast(spot) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation` +
    `&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Europe%2FBerlin&forecast_days=7&wind_speed_unit=kmh`;
  if (spot.elevation != null && !isNaN(spot.elevation)) url += `&elevation=${spot.elevation}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo Fehler " + res.status);
  return res.json();
}

// Ermittelt die Geländehöhe (m ü. NN) für Koordinaten via Open-Meteo.
async function fetchElevation(lat, lon) {
  const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
  if (!res.ok) throw new Error("Höhe konnte nicht ermittelt werden");
  const j = await res.json();
  return Math.round(j.elevation[0]);
}

function analyse(spot, data) {
  const h = data.hourly;
  const daylight = buildDaylight(data.daily);
  const days = {};

  for (let i = 0; i < h.time.length; i++) {
    const t = new Date(h.time[i]);
    const dayKey = h.time[i].slice(0, 10);
    const dl = daylight[dayKey];
    const isDay = dl ? (t >= dl.sunrise && t <= dl.sunset) : (t.getHours() >= 8 && t.getHours() <= 20);

    const ws = h.wind_speed_10m[i];
    const wd = h.wind_direction_10m[i];
    const wg = h.wind_gusts_10m[i];
    const rain = h.precipitation[i];
    const { ok, reasons } = checkHour(spot, ws, wd, wg, rain, isDay);

    if (!days[dayKey]) days[dayKey] = { key: dayKey, date: t, wx: dl, hours: [] };
    days[dayKey].hours.push({ t, ws, wd, wg, rain, ok, reasons, isDay });
  }

  return Object.values(days).map(day => {
    const dayHours = day.hours.filter(x => x.isDay);
    const greenHours = dayHours.filter(x => x.ok);
    return { ...day, dayHours, greenCount: greenHours.length, greenHours };
  });
}

function fmtHour(d) { return d.getHours().toString().padStart(2, "0") + ":00"; }

function greenWindows(dayHours) {
  const windows = [];
  let start = null, prev = null;
  for (const x of dayHours) {
    if (x.ok) { if (start === null) start = x.t; prev = x.t; }
    else if (start !== null) { windows.push([start, prev]); start = null; }
  }
  if (start !== null) windows.push([start, prev]);
  return windows.map(([a, b]) =>
    a.getTime() === b.getTime()
      ? `${fmtHour(a)}`
      : `${fmtHour(a)}–${(b.getHours() + 1).toString().padStart(2, "0")}:00`
  );
}

function renderSpot(spot, days) {
  const totalGreen = days.reduce((s, d) => s + d.greenCount, 0);
  const statusClass = totalGreen > 0 ? "green" : "red";

  const daysHtml = days.slice(0, 7).map(day => {
    const wins = greenWindows(day.dayHours);
    const hoursHtml = day.dayHours.map(x => {
      const cls = x.ok ? "h ok" : "h";
      const title = x.ok
        ? `${Math.round(x.ws)} km/h aus ${degToCompass(x.wd)} · Böen ${Math.round(x.wg)}`
        : x.reasons.join(", ");
      return `<span class="${cls}" title="${title}">${x.t.getHours()}</span>`;
    }).join("");
    const wx = day.wx
      ? `<div class="wx">${weatherEmoji(day.wx.code)} <span class="tmax">${day.wx.tmax}°</span> / <span class="tmin">${day.wx.tmin}°</span></div>`
      : "";
    return `
      <div class="day ${wins.length ? "hasgreen" : ""}">
        <div class="dlabel">${WEEKDAYS[day.date.getDay()]}<br>${day.date.getDate()}.${day.date.getMonth() + 1}.</div>
        <div class="dright">
          <div class="hours">${hoursHtml}</div>
          ${wx}
          <div class="wins">${wins.length ? "🟢 " + wins.join(", ") : "—"}</div>
        </div>
      </div>`;
  }).join("");

  const del = spot.custom
    ? `<button class="del" data-del="${spot.id}" title="Fluggebiet löschen">🗑</button>`
    : "";

  return `
    <div class="card">
      <div class="card-head">
        <div>
          <div class="spot-name">${spot.name} ${spot.custom ? '<span class="mine">eigenes</span>' : ""}</div>
          <div class="spot-region">${spot.region || ""}</div>
        </div>
        <div class="head-right">
          <div class="badge ${statusClass}">${totalGreen > 0 ? totalGreen + "h grün" : "kein Fenster"}</div>
          ${del}
        </div>
      </div>
      <div class="spot-meta">Erlaubt: <b>${spot.sectorLabel}</b> · Wind ${spot.windMin}–${spot.windMax} km/h · Böen ≤ ${spot.gustMax}${spot.elevation != null ? " · " + spot.elevation + " m" : ""}</div>
      <div class="days">${daysHtml}</div>
    </div>`;
}

// ---- Eigene Fluggebiete (lokal im Browser gespeichert) ----
const USER_KEY = "flugwetter_user_spots";
function loadUserSpots() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || []; } catch { return []; }
}
function saveUserSpots(list) { localStorage.setItem(USER_KEY, JSON.stringify(list)); }
function allSpots() { return SPOTS.concat(loadUserSpots()); }
function deleteUserSpot(id) { saveUserSpots(loadUserSpots().filter(s => s.id !== id)); load(); }

async function load() {
  const container = document.getElementById("spots");
  const updated = document.getElementById("updated");
  const spots = allSpots();
  container.innerHTML = spots.map(s => `<div class="card loading">Lade ${s.name} …</div>`).join("");

  const cards = await Promise.all(spots.map(async spot => {
    try {
      const data = await fetchForecast(spot);
      return renderSpot(spot, analyse(spot, data));
    } catch (e) {
      return `<div class="card"><div class="spot-name">${spot.name}</div><div class="spot-region">Fehler: ${e.message}</div></div>`;
    }
  }));

  container.innerHTML = cards.join("");
  updated.textContent = "Aktualisiert: " + new Date().toLocaleString("de-DE");
}

document.getElementById("spots").addEventListener("click", e => {
  const btn = e.target.closest("[data-del]");
  if (btn && confirm("Dieses Fluggebiet löschen?")) deleteUserSpot(btn.dataset.del);
});
document.getElementById("refresh").addEventListener("click", load);

// ---- Seiten-Router (Tab-Navigation) ----
const PAGES = {
  spots: { title: "Fluggebiete", sub: "Passt das Wetter? · nächste 7 Tage" },
  add:   { title: "Neues Fluggebiet", sub: "Startplatz anlegen" },
  info:  { title: "Info", sub: "Wie die App funktioniert" },
  legal: { title: "Recht", sub: "Rechtliche Einordnung" },
};
function route() {
  let id = location.hash.replace("#/", "") || "spots";
  if (!PAGES[id]) id = "spots";
  document.querySelectorAll(".page").forEach(p => p.hidden = p.id !== "page-" + id);
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === id));
  document.getElementById("pageTitle").textContent = PAGES[id].title;
  document.getElementById("pageSub").textContent = PAGES[id].sub;
  document.getElementById("refresh").style.visibility = id === "spots" ? "visible" : "hidden";
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

// ---- Formular: Fluggebiet anlegen ----
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
  form.reset();
  selectedDirs.clear();
  compassEl.querySelectorAll(".on").forEach(b => b.classList.remove("on"));
  document.getElementById("formErr").hidden = true;
}
document.getElementById("resetBtn").addEventListener("click", resetForm);

function coords() {
  return {
    lat: parseFloat(form.lat.value.replace(",", ".")),
    lon: parseFloat(form.lon.value.replace(",", ".")),
  };
}

document.getElementById("geoBtn").addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Standort wird von diesem Browser nicht unterstützt.");
  navigator.geolocation.getCurrentPosition(async pos => {
    form.lat.value = pos.coords.latitude.toFixed(5);
    form.lon.value = pos.coords.longitude.toFixed(5);
    tryElevation();
  }, () => alert("Standort konnte nicht ermittelt werden (Berechtigung?)."));
});

document.getElementById("elevBtn").addEventListener("click", tryElevation);
async function tryElevation() {
  const { lat, lon } = coords();
  if (isNaN(lat) || isNaN(lon)) return alert("Bitte zuerst gültige Koordinaten eingeben.");
  form.elevation.value = "…";
  try { form.elevation.value = await fetchElevation(lat, lon); }
  catch { form.elevation.value = ""; alert("Höhe konnte nicht ermittelt werden."); }
}

function dirsToSectors(indices) {
  return [...indices].sort((a, b) => a - b).map(i => {
    const c = i * 22.5;
    return [(c - 11.25 + 360) % 360, (c + 11.25) % 360];
  });
}
function showErr(msg) { const el = document.getElementById("formErr"); el.textContent = msg; el.hidden = false; }

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
    id: "user_" + Date.now(), custom: true,
    name: form.name.value.trim(), region: form.region.value.trim(),
    lat, lon, elevation,
    sectors: dirsToSectors(selectedDirs),
    sectorLabel: dirs.map(i => COMPASS_16[i]).join(", "),
    windMin: parseFloat(form.windMin.value) || 0,
    windMax: parseFloat(form.windMax.value) || 30,
    gustMax: parseFloat(form.gustMax.value) || 35,
  };
  const list = loadUserSpots(); list.push(spot); saveUserSpots(list);
  resetForm();
  location.hash = "#/spots";
  load();
});

// Start
route();
load();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
