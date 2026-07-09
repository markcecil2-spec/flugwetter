# Flugwetter · Gleitschirm

Einfache Web-App (PWA), die für Gleitschirm-Startplätze anzeigt, ob in den nächsten
7 Tagen die **Grundbedingungen** passen (Windrichtung, Windstärke, Böen, Regen, Tageslicht).

Gedacht als schnelle Übersicht für **Fluganfänger** und Gelegenheitsflieger – kein
Thermik-/Streckenflug-Tool.

## Funktionen
- 7-Tage-Vorhersage je Startplatz mit „grünen Fenstern"
- Eigene Startplätze hinzufügen (lokal im Browser gespeichert)
- Installierbar als PWA (Handy-Startbildschirm)
- Wetterdaten: [Open-Meteo](https://open-meteo.com) (DWD-ICON-Modell)

## Lokal starten
```
node server.js
```
Dann `http://localhost:3000` öffnen.

## ⚠️ Hinweis
Unverbindliche Orientierungshilfe, **keine amtliche Flugwetterberatung**. Nutzung auf
eigene Gefahr. Die Beurteilung der Flugtauglichkeit und die Startentscheidung liegen
allein beim verantwortlichen Piloten. Details siehe „Rechtliche Einordnung" in der App.
