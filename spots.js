// Startplatz-Konfiguration für die Flugwetter-App
// Windrichtung = Richtung, AUS DER der Wind kommt (meteorologisch), passend zur Hangausrichtung.
// sectors: Liste erlaubter Sektoren [von, bis] in Grad (0=N, 90=O, 180=S, 270=W).
//          Sektoren dürfen über 360° "wrappen", z.B. [340, 20] = NNW über N bis NNO.
// Grenzwerte gelten für Gleitschirm (Bodenwind in km/h).

const SPOTS = [
  {
    id: "huendle",
    name: "Hündle",
    region: "Oberstaufen · Allgäu",
    lat: 47.5446,
    lon: 10.0528,
    elevation: 1035,
    sectors: [[285, 340]], // WNW–NNW (DHV)
    sectorLabel: "WNW–NNW",
    windMin: 3,
    windMax: 28,
    gustMax: 32,
  },
  {
    id: "koessen",
    name: "Kössen / Unterberghorn",
    region: "Kaiserwinkl · Tirol",
    lat: 47.6312,
    lon: 12.4311,
    elevation: 1497,
    sectors: [[225, 290], [350, 70]], // SW–W und N–NO (DHV)
    sectorLabel: "SW–W & N–NO",
    windMin: 3,
    windMax: 28,
    gustMax: 32,
  },
  {
    id: "kleinheppach",
    name: "Kleinheppacher Kopf",
    region: "Korb · Remstal",
    lat: 48.8332,
    lon: 9.3781,
    elevation: 400,
    sectors: [[135, 270]], // SO–W (DHV)
    sectorLabel: "SO–W",
    windMin: 3,
    windMax: 26,
    gustMax: 30,
  },
  {
    id: "hohenneuffen",
    name: "Hohenneuffen",
    region: "Neuffen · Schwäbische Alb",
    lat: 48.5495,
    lon: 9.4045,
    elevation: 712,
    sectors: [[250, 290], [340, 20]], // West-Start: W; Nord-Start: N (DHV)
    sectorLabel: "W (West-Start) · N (Nord-Start)",
    windMin: 3,
    windMax: 26,
    gustMax: 30,
  },
  {
    id: "schnaithalde",
    name: "Schnaithalde",
    region: "Hausen · Killertal · Zollernalb",
    lat: 48.2965,
    lon: 9.0576,
    elevation: 820,
    sectors: [[315, 45]], // NW–NO über Nord (DHV) – kein Ostwind!
    sectorLabel: "NW–NO",
    windMin: 3,
    windMax: 26,
    gustMax: 30,
  },
];
