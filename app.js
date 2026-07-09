// Flugwetter-App – Kernlogik: Vorhersage holen, Regeln prüfen, grüne Fenster anzeigen.

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

// Grad -> Himmelsrichtung (Kürzel)
function degToCompass(deg) {
  const dirs = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Liegt eine Windrichtung in einem der erlaubten Sektoren? (mit Wrap über 360°)
function inSectors(dir, sectors) {
  return sectors.some(([from, to]) => {
    if (from <= to) return dir >= from && dir <= to;
    return dir >= from || dir <= to; // wrap, z.B. [340,20]
  });
}

// Prüft eine einzelne Stunde gegen die Startplatz-Regeln.
// Gibt { ok, reasons[] } zurück – reasons erklärt, warum es NICHT passt.
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

// Baut ein "isDay"-Lookup pro Stunde aus sunrise/sunset.
function buildDaylight(daily) {
  const map = {}; // "YYYY-MM-DD" -> {sunrise, sunset} als Date
  daily.time.forEach((d, i) => {
    map[d] = { sunrise: new Date(daily.sunrise[i]), sunset: new Date(daily.sunset[i]) };
  });
  return map;
}

async function fetchForecast(spot) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation` +
    `&daily=sunrise,sunset&timezone=Europe%2FBerlin&forecast_days=7&wind_speed_unit=kmh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo Fehler " + res.status);
  return res.json();
}

// Wertet die Vorhersage aus und gruppiert Stunden pro Tag inkl. Status.
function analyse(spot, data) {
  const h = data.hourly;
  const daylight = buildDaylight(data.daily);
  const days = {}; // "YYYY-MM-DD" -> { date, hours: [...] }

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

    if (!days[dayKey]) days[dayKey] = { key: dayKey, date: t, hours: [] };
    days[dayKey].hours.push({ t, ws, wd, wg, rain, ok, reasons, isDay });
  }

  // Nur Tag-Stunden fürs Anzeigen behalten, grüne Fenster zusammenfassen
  const result = Object.values(days).map(day => {
    const dayHours = day.hours.filter(x => x.isDay);
    const greenHours = dayHours.filter(x => x.ok);
    return { ...day, dayHours, greenCount: greenHours.length, greenHours };
  });
  return result;
}

function fmtHour(d) {
  return d.getHours().toString().padStart(2, "0") + ":00";
}

// Fasst aufeinanderfolgende grüne Stunden zu Fenstern zusammen ("11–14 Uhr").
function greenWindows(dayHours) {
  const windows = [];
  let start = null, prev = null;
  for (const x of dayHours) {
    if (x.ok) {
      if (start === null) start = x.t;
      prev = x.t;
    } else if (start !== null) {
      windows.push([start, prev]);
      start = null;
    }
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
    const label = `${WEEKDAYS[day.date.getDay()]} ${day.date.getDate()}.${day.date.getMonth() + 1}.`;
    const wins = greenWindows(day.dayHours);
    const hoursHtml = day.dayHours.map(x => {
      const cls = x.ok ? "h ok" : "h";
      const title = x.ok
        ? `${Math.round(x.ws)} km/h aus ${degToCompass(x.wd)} · Böen ${Math.round(x.wg)}`
        : x.reasons.join(", ");
      return `<span class="${cls}" title="${title}">${x.t.getHours()}</span>`;
    }).join("");
    return `
      <div class="day ${wins.length ? "hasgreen" : ""}">
        <div class="dlabel">${label}</div>
        <div class="hours">${hoursHtml}</div>
        <div class="wins">${wins.length ? "🟢 " + wins.join(", ") : "—"}</div>
      </div>`;
  }).join("");

  const del = spot.custom
    ? `<button class="del" data-del="${spot.id}" title="Startplatz löschen">🗑</button>`
    : "";

  return `
    <div class="card">
      <div class="card-head">
        <div>
          <div class="spot-name">${spot.name} ${spot.custom ? '<span class="mine">eigener</span>' : ""}</div>
          <div class="spot-region">${spot.region || ""}</div>
        </div>
        <div class="head-right">
          <div class="badge ${statusClass}">${totalGreen > 0 ? totalGreen + "h grün" : "kein Fenster"}</div>
          ${del}
        </div>
      </div>
      <div class="spot-meta">Erlaubt: <b>${spot.sectorLabel}</b> · Wind ${spot.windMin}–${spot.windMax} km/h · Böen ≤ ${spot.gustMax}${spot.elevation ? " · " + spot.elevation + " m" : ""}</div>
      <div class="days">${daysHtml}</div>
    </div>`;
}

// ---- Eigene Startplätze (lokal im Browser gespeichert) ----
const USER_KEY = "flugwetter_user_spots";
function loadUserSpots() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || []; }
  catch { return []; }
}
function saveUserSpots(list) {
  localStorage.setItem(USER_KEY, JSON.stringify(list));
}
function allSpots() {
  return SPOTS.concat(loadUserSpots());
}
function deleteUserSpot(id) {
  saveUserSpots(loadUserSpots().filter(s => s.id !== id));
  load();
}

async function load() {
  const container = document.getElementById("spots");
  const updated = document.getElementById("updated");
  const spots = allSpots();
  container.innerHTML = spots.map(s => `<div class="card loading">Lade ${s.name} …</div>`).join("");

  const cards = await Promise.all(spots.map(async spot => {
    try {
      const data = await fetchForecast(spot);
      const days = analyse(spot, data);
      return renderSpot(spot, days);
    } catch (e) {
      return `<div class="card"><div class="spot-name">${spot.name}</div><div class="spot-region">Fehler: ${e.message}</div></div>`;
    }
  }));

  container.innerHTML = cards.join("");
  updated.textContent = "Aktualisiert: " + new Date().toLocaleString("de-DE");
}

// Löschen eigener Plätze (Event-Delegation)
document.getElementById("spots").addEventListener("click", e => {
  const btn = e.target.closest("[data-del]");
  if (btn && confirm("Diesen Startplatz löschen?")) deleteUserSpot(btn.dataset.del);
});

document.getElementById("refresh").addEventListener("click", load);
load();

// ---- Formular: Startplatz hinzufügen ----
const COMPASS_16 = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const modal = document.getElementById("modal");
const form = document.getElementById("spotForm");
const compassEl = document.getElementById("compass");
const selectedDirs = new Set();

// Kompass-Buttons aufbauen
COMPASS_16.forEach((label, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "cdir";
  b.textContent = label;
  b.addEventListener("click", () => {
    if (selectedDirs.has(i)) { selectedDirs.delete(i); b.classList.remove("on"); }
    else { selectedDirs.add(i); b.classList.add("on"); }
  });
  compassEl.appendChild(b);
});

function openModal() { modal.hidden = false; }
function closeModal() {
  modal.hidden = true;
  form.reset();
  selectedDirs.clear();
  compassEl.querySelectorAll(".on").forEach(b => b.classList.remove("on"));
  document.getElementById("formErr").hidden = true;
}

document.getElementById("addBtn").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// Standort per Geolocation vorbefüllen
document.getElementById("geoBtn").addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Standort wird von diesem Browser nicht unterstützt.");
  navigator.geolocation.getCurrentPosition(
    pos => {
      form.lat.value = pos.coords.latitude.toFixed(5);
      form.lon.value = pos.coords.longitude.toFixed(5);
    },
    () => alert("Standort konnte nicht ermittelt werden (Berechtigung?).")
  );
});

// Ausgewählte Kompass-Punkte -> Sektoren [von,bis] (jeder Punkt ±11,25°)
function dirsToSectors(indices) {
  return [...indices].sort((a, b) => a - b).map(i => {
    const c = i * 22.5;
    return [ (c - 11.25 + 360) % 360, (c + 11.25) % 360 ];
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const err = document.getElementById("formErr");
  const lat = parseFloat(form.lat.value.replace(",", "."));
  const lon = parseFloat(form.lon.value.replace(",", "."));

  if (!form.name.value.trim()) return showErr(err, "Bitte einen Namen eingeben.");
  if (isNaN(lat) || lat < -90 || lat > 90) return showErr(err, "Breitengrad ungültig (z. B. 47.5446).");
  if (isNaN(lon) || lon < -180 || lon > 180) return showErr(err, "Längengrad ungültig (z. B. 10.0528).");
  if (selectedDirs.size === 0) return showErr(err, "Bitte mindestens eine Windrichtung wählen.");

  const dirs = [...selectedDirs].sort((a, b) => a - b);
  const spot = {
    id: "user_" + Date.now(),
    custom: true,
    name: form.name.value.trim(),
    region: form.region.value.trim(),
    lat, lon,
    elevation: null,
    sectors: dirsToSectors(selectedDirs),
    sectorLabel: dirs.map(i => COMPASS_16[i]).join(", "),
    windMin: parseFloat(form.windMin.value) || 0,
    windMax: parseFloat(form.windMax.value) || 30,
    gustMax: parseFloat(form.gustMax.value) || 35,
  };

  const list = loadUserSpots();
  list.push(spot);
  saveUserSpots(list);
  closeModal();
  load();
});

function showErr(el, msg) { el.textContent = msg; el.hidden = false; }

// Service Worker für PWA / Installierbarkeit
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
