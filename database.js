// Startplatz-Datenbank (Grundstock Bayern / Baden-Württemberg / Nordalpen).
// Wächst schrittweise. Quelle der Windrichtungen/Koordinaten: DHV-Geländedatenbank.
// sectors: erlaubte Sektoren [von, bis] in Grad (0=N, 90=O, 180=S, 270=W), dürfen über 360° wrappen.
// Grenzwerte (Gleitschirm, Bodenwind km/h) sind sinnvolle Defaults und pro Platz anpassbar.

const DEF = { windMin: 3, windMax: 27, gustMax: 32 };

const SPOT_DB = [
  // --- Allgäu / Nordalpen ---
  { id: "db_huendle", name: "Hündle", region: "Oberstaufen · Allgäu",
    lat: 47.5446, lon: 10.0528, elevation: 1035,
    sectors: [[285, 340]], sectorLabel: "WNW–NNW", ...DEF },

  { id: "db_hochgrat", name: "Hochgrat", region: "Steibis · Allgäu",
    lat: 47.4942, lon: 10.0729, elevation: 1820,
    sectors: [[292, 340], [157, 203]], sectorLabel: "NW & S", ...DEF },

  { id: "db_nebelhorn", name: "Nebelhorn", region: "Oberstdorf · Allgäu (nur Erfahrene)",
    lat: 47.4207, lon: 10.3424, elevation: 2150,
    sectors: [[135, 270]], sectorLabel: "SO–W", ...DEF },

  { id: "db_tegelberg", name: "Tegelberg", region: "Schwangau · Ostallgäu",
    lat: 47.5599, lon: 10.7799, elevation: 1707,
    sectors: [[285, 70], [200, 290]], sectorLabel: "NW–NO & SW–W", ...DEF },

  { id: "db_buchenberg", name: "Buchenberg", region: "Buching · Allgäu (anfängerfreundlich)",
    lat: 47.6065, lon: 10.8104, elevation: 1137,
    sectors: [[290, 70]], sectorLabel: "NW–NO", ...DEF },

  { id: "db_koessen", name: "Kössen / Unterberghorn", region: "Kaiserwinkl · Tirol",
    lat: 47.6312, lon: 12.4311, elevation: 1497,
    sectors: [[225, 290], [350, 70]], sectorLabel: "SW–W & N–NO", ...DEF },

  // --- Schwäbische Alb / Remstal ---
  { id: "db_hohenneuffen", name: "Hohenneuffen", region: "Neuffen · Schwäbische Alb",
    lat: 48.5495, lon: 9.4045, elevation: 712,
    sectors: [[250, 290], [340, 20]], sectorLabel: "W & N", windMin: 3, windMax: 26, gustMax: 30 },

  { id: "db_schnaithalde", name: "Schnaithalde", region: "Hausen · Killertal · Zollernalb",
    lat: 48.2965, lon: 9.0576, elevation: 820,
    sectors: [[315, 45]], sectorLabel: "NW–NO", windMin: 3, windMax: 26, gustMax: 30 },

  { id: "db_kleinheppach", name: "Kleinheppacher Kopf", region: "Korb · Remstal",
    lat: 48.8332, lon: 9.3781, elevation: 400,
    sectors: [[135, 270]], sectorLabel: "SO–W", windMin: 3, windMax: 26, gustMax: 30 },
];
