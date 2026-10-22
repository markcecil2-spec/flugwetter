#!/usr/bin/env python3
"""Umgebung je Startplatz vorab berechnen (laeuft monatlich auf GitHub Actions).

Warum: Die Briefing-Karte hat Parken, Camping, Hotel usw. bisher live bei Overpass
abgefragt. Overpass ist ehrenamtlich und chronisch ueberlastet ("server is currently
at capacity") - die Karte blieb leer. Jetzt kommen die Daten aus den offiziellen
OpenStreetMap-Laenderdateien (Geofabrik), werden hier einmal im Monat ausgewertet und
als kleine JSON-Datei je Startplatz unter umgebung/<id>.json ausgeliefert.

Eingabe:  spots.json (aus database.js) und eine oder mehrere GeoJSON-Seq-Dateien
          (osmium export, je Zeile ein Feature mit allen OSM-Tags).
Ausgabe:  umgebung/<id>.json - dasselbe Format wie fetchUmgebung() in app.js:
          {cp, hotel, essen, supermarkt, toilette, linien, stationen}

Radien und Kategorien entsprechen exakt der bisherigen Live-Abfrage.
"""
import json, math, os, sys
from collections import defaultdict

CAMP_R, PARK_R = 15.0, 3.0           # km, wie CAMP_RADIUS_M / PARK_RADIUS_M in app.js
HOTEL_R, ESSEN_R, HUETTE_R = 10.0, 4.0, 8.0
MARKT_R, WC_R, BAHN_R = 5.0, 3.0, 7.0
MAX_R = max(CAMP_R, HOTEL_R, HUETTE_R, BAHN_R)

# Obergrenzen je Platz (etwas ueber dem, was app.js anzeigt)
CAP = {"park": 8, "camp": 30, "hotel": 30, "essen": 40, "supermarkt": 15, "toilette": 20, "stationen": 20, "linien": 30}

HOTEL_ART = {"hotel": "Hotel", "guest_house": "Pension", "hostel": "Hostel", "motel": "Motel"}
ESSEN_ART = {"restaurant": "Restaurant", "cafe": "Café", "biergarten": "Biergarten", "alpine_hut": "Berghütte"}
BAHN_ART = {"cable_car": "Seilbahn", "gondola": "Gondelbahn", "chair_lift": "Sessellift", "mixed_lift": "Kombibahn", "funicular": "Standseilbahn"}


def km(lat1, lon1, lat2, lon2):
    r = math.pi / 180
    a = math.sin((lat2 - lat1) * r / 2) ** 2 + math.cos(lat1 * r) * math.cos(lat2 * r) * math.sin((lon2 - lon1) * r / 2) ** 2
    return 12742 * math.asin(math.sqrt(min(1.0, a)))


def punkt(geom):
    """Repraesentativer Punkt: Punkt selbst, Linien-/Flaechenmittel (Mittel der Stuetzpunkte)."""
    t, c = geom["type"], geom["coordinates"]
    if t == "Point":
        return c[1], c[0]
    if t == "LineString":
        pts = c
    elif t == "Polygon":
        pts = c[0]
    elif t == "MultiPolygon":
        pts = c[0][0]
    else:
        return None
    if not pts:
        return None
    return sum(p[1] for p in pts) / len(pts), sum(p[0] for p in pts) / len(pts)


def r5(x):
    return round(x, 5)


def ohne_leere(d):
    # False bleibt drin: gratis=False heisst "gebuehrenpflichtig", parken=False "kein Parkplatz"
    return {k: v for k, v in d.items() if v is False or v not in ("", None, [])}


def basis(t, lat, lon, fallback):
    strasse = " ".join(x for x in [t.get("addr:street"), t.get("addr:housenumber")] if x)
    ort = " ".join(x for x in [t.get("addr:postcode"), t.get("addr:city")] if x)
    return {
        "name": t.get("name") or fallback, "lat": r5(lat), "lon": r5(lon),
        "web": t.get("website") or t.get("contact:website") or "",
        "tel": t.get("phone") or t.get("contact:phone") or "",
        "adresse": ", ".join(x for x in [strasse, ort] if x),
        "saison": t.get("opening_hours") or "",
    }


def camp_park(t, lat, lon):
    """Gleiche Felder wie campParkAus() in app.js."""
    parken = t.get("amenity") == "parking"
    aus = [k for k, tag in [("zelt", "tents"), ("wohnwagen", "caravans"), ("dusche", "shower"),
                             ("strom", "power_supply"), ("wc", "toilets"), ("wasser", "drinking_water")] if t.get(tag) == "yes"]
    d = basis(t, lat, lon, "Parkplatz" if parken else "Ohne Namen")
    fee = t.get("fee")
    d.update({
        "type": "parkplatz" if parken else t.get("tourism"), "parken": parken, "aus": aus,
        "gratis": (True if fee == "no" else False if fee else None) if parken else None,
        "plaetze": t.get("capacity", "") if parken else "",
    })
    return d


STAND = os.environ.get("UMGEBUNG_STAND", "")   # z. B. "2026-10", fuer den Hinweis in der App


def main():
    spots_pfad, ausgabe, *seqs = sys.argv[1:]
    spots = json.load(open(spots_pfad, encoding="utf-8"))
    # Raster 0.2 Grad: jeder Platz wird in alle Zellen eingetragen, die sein groesster Radius beruehrt
    zelle = lambda la, lo: (math.floor(la * 5), math.floor(lo * 5))
    raster = defaultdict(list)
    for i, s in enumerate(spots):
        s["L"] = (s["landeLat"], s["landeLon"]) if s.get("landeLat") is not None else (s["lat"], s["lon"])
        for la, lo in [(s["lat"], s["lon"]), s["L"]]:
            dla = MAX_R / 111.0
            dlo = MAX_R / (111.0 * max(0.2, math.cos(math.radians(la))))
            for zi in range(math.floor((la - dla) * 5), math.floor((la + dla) * 5) + 1):
                for zj in range(math.floor((lo - dlo) * 5), math.floor((lo + dlo) * 5) + 1):
                    if not raster[(zi, zj)] or raster[(zi, zj)][-1] != i:
                        raster[(zi, zj)].append(i)
    treffer = [defaultdict(list) for _ in spots]
    gesehen = set()
    n = 0
    for pfad in seqs:
        with open(pfad, encoding="utf-8") as f:
            for zeile in f:
                zeile = zeile.strip().lstrip("\x1e")
                if not zeile:
                    continue
                feat = json.loads(zeile)
                t = feat.get("properties") or {}
                geom = feat.get("geometry")
                if not geom:
                    continue
                # Laendergrenzen: dasselbe Objekt steckt in zwei Laenderdateien
                oid = (t.get("@type"), t.get("@id"))
                if oid[1] is not None:
                    if oid in gesehen:
                        continue
                    gesehen.add(oid)
                p = punkt(geom)
                if not p:
                    continue
                n += 1
                la, lo = p
                ist_linie = geom["type"] == "LineString" and (t.get("aerialway") in BAHN_ART or t.get("railway") == "funicular")
                for i in set(raster.get(zelle(la, lo), ())):
                    s = spots[i]
                    dS = km(s["lat"], s["lon"], la, lo)
                    dL = km(s["L"][0], s["L"][1], la, lo)
                    dSL = min(dS, dL)
                    am, tour, shop = t.get("amenity"), t.get("tourism"), t.get("shop")
                    tr = treffer[i]
                    if ist_linie:
                        coords = geom["coordinates"]
                        dmin = min(km(s["lat"], s["lon"], c[1], c[0]) for c in coords)
                        if dmin <= BAHN_R:
                            tr["linien"].append((dmin, {"name": t.get("name", ""), "art": BAHN_ART.get(t.get("aerialway")) or BAHN_ART.get(t.get("railway")) or "Bergbahn",
                                                        "coords": [[r5(c[0]), r5(c[1])] for c in coords]}))
                    elif am == "parking":
                        # getrennt nach Start und Landung - sonst verdraengen die vielen
                        # Parkplaetze im Tal die wenigen oben am Start
                        if dSL <= PARK_R:
                            d = camp_park(t, la, lo)
                            if dS <= PARK_R:
                                tr["parkS"].append((dS, d))
                            if dL <= PARK_R:
                                tr["parkL"].append((dL, d))
                    elif tour in ("camp_site", "caravan_site"):
                        if dL <= CAMP_R:
                            tr["camp"].append((dL, camp_park(t, la, lo)))
                    elif tour in HOTEL_ART:
                        if dL <= HOTEL_R:
                            tr["hotel"].append((dL, {**basis(t, la, lo, "Unterkunft"), "art": HOTEL_ART[tour]}))
                    elif am in ("restaurant", "cafe", "biergarten"):
                        if dSL <= ESSEN_R:
                            tr["essen"].append((dSL, {**basis(t, la, lo, "Einkehr"), "art": ESSEN_ART[am]}))
                    elif tour == "alpine_hut":
                        if dS <= HUETTE_R:
                            tr["essen"].append((dS, {**basis(t, la, lo, "Einkehr"), "art": ESSEN_ART["alpine_hut"]}))
                    elif shop == "supermarket":
                        if dSL <= MARKT_R:
                            tr["supermarkt"].append((dSL, {**basis(t, la, lo, "Supermarkt"), "art": "Supermarkt"}))
                    elif am == "toilets":
                        if dSL <= WC_R:
                            fee = t.get("fee")
                            art = "Toilette · kostenlos" if fee == "no" else "Toilette · gebührenpflichtig" if fee == "yes" else "Toilette"
                            tr["toilette"].append((dSL, {**basis(t, la, lo, "Toilette"), "art": art}))
                    elif t.get("aerialway") == "station" and geom["type"] == "Point":
                        if dS <= BAHN_R:
                            tr["stationen"].append((dS, {**basis(t, la, lo, "Bahnstation"), "art": "Bergbahn-Station"}))
    os.makedirs(ausgabe, exist_ok=True)
    GENERISCH = {"Parkplatz", "Toilette", "Bahnstation", "Ohne Namen", "Einkehr", "Unterkunft", "Supermarkt"}

    def nah(arr, k):
        # Lokal oft doppelt in OSM (Gebaeude + Punkt): gleicher Name und < 150 m = dasselbe,
        # namenlose nur bei < 30 m. Gleiche Regel wie ohneDoppelte() in app.js.
        out = []
        for _, d in sorted(arr, key=lambda x: x[0]):
            g = 0.03 if d["name"] in GENERISCH else 0.15
            if "lat" not in d:          # Bahnlinien: keine Einzelkoordinate, nicht zusammenfassen
                out.append(d)
            elif not any(o["name"] == d["name"] and o.get("parken") == d.get("parken") and km(o["lat"], o["lon"], d["lat"], d["lon"]) < g for o in out):
                out.append(d)
            if len(out) >= CAP[k]:
                break
        return out

    def parkplaetze(tr):
        out, ids = [], set()
        for d in nah(tr["parkS"], "park") + nah(tr["parkL"], "park"):
            if id(d) not in ids:
                ids.add(id(d)); out.append(d)
        return out
    groesse = 0
    for s, tr in zip(spots, treffer):
        v = {
            "stand": STAND,
            "cp": [ohne_leere(d) for d in parkplaetze(tr) + nah(tr["camp"], "camp")],
            "hotel": [ohne_leere(d) for d in nah(tr["hotel"], "hotel")],
            "essen": [ohne_leere(d) for d in nah(tr["essen"], "essen")],
            "supermarkt": [ohne_leere(d) for d in nah(tr["supermarkt"], "supermarkt")],
            "toilette": [ohne_leere(d) for d in nah(tr["toilette"], "toilette")],
            "linien": [d for d in nah(tr["linien"], "linien")],
            "stationen": [ohne_leere(d) for d in nah(tr["stationen"], "stationen")],
        }
        txt = json.dumps(v, ensure_ascii=False, separators=(",", ":"))
        groesse += len(txt.encode("utf-8"))
        with open(os.path.join(ausgabe, s["id"] + ".json"), "w", encoding="utf-8") as f:
            f.write(txt)
    print(f"{n} OSM-Objekte gelesen, {len(spots)} Plaetze geschrieben, zusammen {groesse / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
