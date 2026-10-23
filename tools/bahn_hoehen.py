#!/usr/bin/env python3
"""Hoehe an beiden Enden jeder Bergbahn in umgebung/<id>.json eintragen ("h": [Anfang, Ende]).

Warum: Ohne Hoehe musste app.js raten, welches Ende Berg- und welches Talstation ist
(das naeher am Startplatz = oben). Das ging schief, wo der Start unten an einer Bahn
liegt oder eine Kette auf einen anderen Hang weiterlief (Falera, Verbier -> Bruson).
Mit Hoehe ist oben einfach oben.

Hoehen aus dem Copernicus-Gelaendemodell (90 m) ueber die Open-Meteo Elevation API,
100 Punkte je Abfrage. Open-Meteo zaehlt jeden Punkt als Aufruf (Grenze ~600 je Minute),
daher ~12 s Pause zwischen den Abfragen - 73 Abfragen dauern ~15 min. Laeuft nach tools/umgebung_bauen.py im Workflow umgebung.yml.
Bleibt eine Abfrage trotz Wiederholung erfolglos, fehlt "h" nur bei diesen Bahnen - app.js kommt damit weiter zurecht.
"""
import glob, json, os, sys, time, urllib.request

ordner = sys.argv[1] if len(sys.argv) > 1 else "umgebung"
dateien = sorted(glob.glob(os.path.join(ordner, "*.json")))


def ende(c):
    return (round(c[1], 4), round(c[0], 4))   # lat, lon auf ~10 m - Gelaendemodell hat 90 m


punkte = set()
for f in dateien:
    with open(f, encoding="utf-8") as fh:
        for l in json.load(fh).get("linien", []):
            punkte.add(ende(l["coords"][0]))
            punkte.add(ende(l["coords"][-1]))
punkte = sorted(punkte)
print(f"{len(punkte)} Bahn-Enden in {len(dateien)} Dateien")

hoehe = {}
for i in range(0, len(punkte), 100):
    teil = punkte[i:i + 100]
    url = ("https://api.open-meteo.com/v1/elevation?latitude=" + ",".join(str(p[0]) for p in teil)
           + "&longitude=" + ",".join(str(p[1]) for p in teil))
    werte = []
    for versuch in range(6):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                werte = json.load(r)["elevation"]
            break
        except Exception as e:
            print(f"  Abfrage {i // 100 + 1}: {e}, neuer Versuch", flush=True)
            time.sleep(30 * (versuch + 1))
    for p, h in zip(teil, werte):
        if h is not None and h == h:        # NaN = kein Wert
            hoehe[p] = round(h)
    time.sleep(12)
if not hoehe:
    sys.exit("Open-Meteo Elevation nicht erreichbar - keine Hoehen eingetragen")

geaendert = 0
for f in dateien:
    with open(f, encoding="utf-8") as fh:
        v = json.load(fh)
    neu = False
    for l in v.get("linien", []):
        a, b = hoehe.get(ende(l["coords"][0])), hoehe.get(ende(l["coords"][-1]))
        if a is not None and b is not None and l.get("h") != [a, b]:
            l["h"] = [a, b]
            neu = True
    if neu:
        geaendert += 1
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(json.dumps(v, ensure_ascii=False, separators=(",", ":")))
print(f"{len(hoehe)} Hoehen, {geaendert} Dateien aktualisiert")
