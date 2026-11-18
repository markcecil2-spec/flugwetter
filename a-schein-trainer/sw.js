// Einfacher Offline-Cache. Bei Änderungen an Dateien VERSION erhöhen.
const VERSION = "ast-v15";
const FILES = [
  "./", "index.html", "styles.css", "app.js", "questions.js", "manifest.webmanifest",
  "questions-recht.js", "questions-aero.js", "questions-geraet.js", "questions-praxis.js",
  "datenschutz.html", "icons/logo-glider.png", "icons/hero.jpg", "icons/icon-192.png", "icons/icon-512.png",
  "icons/icon-512-maskable.png", "icons/favicon-32.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});

// Tipp auf eine Erinnerung öffnet die App
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});
