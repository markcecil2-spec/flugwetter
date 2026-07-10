// Startplatz-Datenbank (Grundstock Bayern / Baden-Württemberg / Nordalpen).
// Wächst schrittweise. Quelle der Windrichtungen/Koordinaten: DHV-Geländedatenbank.
// sectors: erlaubte Sektoren [von, bis] in Grad (0=N, 90=O, 180=S, 270=W), dürfen über 360° wrappen.
// dhv: DHV-Gelände-ID (für Deep-Link). webcam: optionale Webcam-/Live-URL.
// Grenzwerte (Gleitschirm, Bodenwind km/h) sind sinnvolle Defaults und pro Platz anpassbar.

const DEF = { windMin: 3, windMax: 27, gustMax: 32 };

const SPOT_DB = [
  // --- Allgäu / Nordalpen ---
  { id: "db_huendle", name: "Hündle", region: "Oberstaufen · Allgäu",
    lat: 47.5446, lon: 10.0528, elevation: 1035, dhv: 4584,
    sectors: [[285, 340]], sectorLabel: "WNW–NNW", ...DEF },

  { id: "db_hochgrat", name: "Hochgrat", region: "Steibis · Allgäu",
    lat: 47.4942, lon: 10.0729, elevation: 1820, dhv: 382,
    sectors: [[292, 340], [157, 203]], sectorLabel: "NW & S", ...DEF },

  { id: "db_nebelhorn", name: "Nebelhorn", region: "Oberstdorf · Allgäu (nur Erfahrene)",
    lat: 47.4207, lon: 10.3424, elevation: 2150, dhv: 395,
    sectors: [[135, 270]], sectorLabel: "SO–W", ...DEF },

  { id: "db_tegelberg", name: "Tegelberg", region: "Schwangau · Ostallgäu",
    lat: 47.5599, lon: 10.7799, elevation: 1707, dhv: 1101,
    sectors: [[285, 70], [200, 290]], sectorLabel: "NW–NO & SW–W", ...DEF },

  { id: "db_buchenberg", name: "Buchenberg", region: "Buching · Allgäu (anfängerfreundlich)",
    lat: 47.6065, lon: 10.8104, elevation: 1137, dhv: 408,
    sectors: [[290, 70]], sectorLabel: "NW–NO", ...DEF },

  { id: "db_mittag", name: "Mittag", region: "Immenstadt · Allgäu",
    lat: 47.5376, lon: 10.2187, elevation: 1381, dhv: 386,
    sectors: [[280, 70], [157, 203]], sectorLabel: "NW–NO & S", ...DEF },

  { id: "db_koessen", name: "Kössen / Unterberghorn", region: "Kaiserwinkl · Tirol",
    lat: 47.6312, lon: 12.4311, elevation: 1497, dhv: 1311,
    sectors: [[225, 290], [350, 70]], sectorLabel: "SW–W & N–NO", ...DEF },

  // --- Oberbayern / Werdenfels / Ammergau ---
  { id: "db_wank", name: "Wank", region: "Garmisch-Partenkirchen · Werdenfels",
    lat: 47.5068, lon: 11.1473, elevation: 1730, dhv: 320,
    sectors: [[45, 290]], sectorLabel: "NO–S–W", ...DEF },

  { id: "db_laber", name: "Laber", region: "Oberammergau (anspruchsvoll)",
    lat: 47.5863, lon: 11.1036, elevation: 1682, dhv: 616,
    sectors: [[340, 20], [160, 200]], sectorLabel: "N & S", ...DEF },

  // --- Isarwinkel / Tegernsee ---
  { id: "db_brauneck", name: "Brauneck", region: "Lenggries · Isarwinkel",
    lat: 47.6641, lon: 11.5245, elevation: 1555, dhv: 612,
    sectors: [[340, 20], [65, 115], [157, 203]], sectorLabel: "N · O · S", ...DEF },

  { id: "db_blomberg", name: "Blomberg", region: "Bad Tölz · Isarwinkel",
    lat: 47.7345, lon: 11.5072, elevation: 1215, dhv: 352,
    sectors: [[292, 115]], sectorLabel: "NW–O", ...DEF },

  { id: "db_wallberg", name: "Wallberg", region: "Rottach-Egern · Tegernsee",
    lat: 47.6659, lon: 11.7967, elevation: 1720, dhv: 953,
    sectors: [[200, 30]], sectorLabel: "SW–N (über W)", ...DEF },

  // --- Chiemgau / Inntal ---
  { id: "db_hochries", name: "Hochries", region: "Samerberg · Chiemgau",
    lat: 47.7473, lon: 12.2483, elevation: 1560, dhv: 613,
    sectors: [[290, 340]], sectorLabel: "WNW–NNW", ...DEF },

  { id: "db_heuberg", name: "Heuberg", region: "Nußdorf am Inn · Chiemgau",
    lat: 47.7259, lon: 12.1839, elevation: 1338, dhv: 329,
    sectors: [[225, 315]], sectorLabel: "SW–NW", ...DEF },

  { id: "db_hochplatte_chiemgau", name: "Hochplatte (Chiemgau)", region: "Marquartstein · Chiemgau",
    lat: 47.7674, lon: 12.4210, elevation: 1020, dhv: 347,
    sectors: [[25, 70]], sectorLabel: "NO", ...DEF },

  // --- Schwäbische Alb / Remstal ---
  { id: "db_hohenneuffen", name: "Hohenneuffen", region: "Neuffen · Schwäbische Alb",
    lat: 48.5495, lon: 9.4045, elevation: 712, dhv: 679,
    sectors: [[250, 290], [340, 20]], sectorLabel: "W & N", windMin: 3, windMax: 26, gustMax: 30 },

  { id: "db_schnaithalde", name: "Schnaithalde", region: "Hausen · Killertal · Zollernalb",
    lat: 48.2965, lon: 9.0576, elevation: 820, dhv: 157,
    sectors: [[315, 45]], sectorLabel: "NW–NO", windMin: 3, windMax: 26, gustMax: 30 },

  { id: "db_kleinheppach", name: "Kleinheppacher Kopf", region: "Korb · Remstal",
    lat: 48.8332, lon: 9.3781, elevation: 400, dhv: 615,
    sectors: [[135, 270]], sectorLabel: "SO–W", windMin: 3, windMax: 26, gustMax: 30 },
];
