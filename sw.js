// Minimaler Service Worker – macht die App installierbar und cached die Hülle.
const CACHE = "flugwetter-v42";
const ASSETS = ["./", "index.html", "style.css", "database.js", "app.js", "manifest.webmanifest",
  "datenschutz.html", "img/hero.jpg", "icons/favicon-32.png", "icons/favicon-48.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

// Wetterdaten immer live. App-Dateien: erst Netz (frische Updates), Cache nur als
// Offline-Fallback. Erfolgreiche Antworten werden für offline nachgelegt.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes("open-meteo.com")) return; // Vorhersage nie cachen
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
