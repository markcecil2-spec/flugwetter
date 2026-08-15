// Platz-Briefings: Regeln, Fotos, Kontakte und (spaeter) Landevolten pro Fluggebiet.
//
// BEWUSST eine eigene Datei: database.js wird automatisch aus der DHV-KML erzeugt und
// bei jedem Datenbank-Update ueberschrieben - hier gepflegte Inhalte waeren dann weg.
//
// Ein Eintrag gilt fuer ein ganzes Fluggebiet und wird ueber "spots" mit allen
// zugehoerigen Startplatz-IDs verknuepft (die DHV-Daten trennen Startplaetze nach
// Himmelsrichtung, die Platzregeln gelten aber fuer alle gemeinsam).
//
// Rechtlicher Hinweis zum Pflegen: Regeln von Infotafeln immer SINNGEMAESS in eigenen
// Worten zusammenfassen und die Quelle nennen - Tafel-Fotos selbst sind urheberrechtlich
// geschuetzt und duerfen nicht eingebunden werden. Fotos nur mit Erlaubnis des Fotografen,
// Urheber in "credit" eintragen.
//
// Aufbau eines Eintrags:
//   spots:    ["db_..."]                      Startplatz-IDs, fuer die das Briefing gilt
//   source:   "..."                           Quellenangabe (Pflicht)
//   updated:  "MM.JJJJ"                       Stand der Infos
//   photos:   [{ src, caption, credit }]      optional, leer = kein Fotobalken
//   sections: { vorStart, startplatz, landeplatz, verboten }   je ein Array aus Saetzen
//   contacts: [{ name, phone, note }]         optional
//   pattern:  { ... }                         optional, Landevolte (folgt separat)

const BRIEFINGS = {
  gerlitzen: {
    spots: ["db_1251_S", "db_1251_SO"],
    source: "Infotafel „Pilots’ Information Gerlitzen“ (Kärntner Flugschule / Region Villach Tourismus), sinngemäß zusammengefasst",
    updated: "08.2026",
    photos: [],
    sections: {
      vorStart: [
        "Flycard beim offiziellen Landeplatz (Kärntner Flugschule) lösen – dort gibt es auch alle weiteren Infos zum Fluggebiet.",
        "Bei Westwind am Landeplatz nicht starten.",
      ],
      startplatz: [
        "Am Gipfel kannst du je nach Windrichtung zwischen drei Startrichtungen wählen: Ost, Süd oder West.",
        "Ist ein Start vom Gipfel wetterbedingt nicht möglich, steht der alternative „1000er“-Startplatz nahe der Kanzelbahn zur Verfügung.",
      ],
      landeplatz: [
        "Offiziellen Landeplatz benutzen und in jeder Richtung mindestens 50 m Abstand zu Straßen halten.",
        "Rücksicht auf den Flugschulbetrieb: Flugschüler sind an ihren gelben Helmen zu erkennen und haben immer Vorrang.",
        "Position und Landevolte anderer Piloten unter 300 m über Grund nicht durchkreuzen.",
        "Tandemlandungen nur mit Erlaubnis der Flugschule.",
        "Schirm und Ausrüstung am westlichen Ende des Landeplatzes packen.",
      ],
      verboten: [
        "Campingplatz und Häuser westlich des Landeplatzes nicht unter 300 m über Grund überfliegen.",
        "Pferdekoppel nicht unter 150 m über Grund überfliegen – Rücksicht auf den Reitbetrieb.",
        "Autobahn und Hochspannungsleitung im Landeanflug beachten.",
      ],
    },
    // phone = was gewaehlt wird, display = wie es angezeigt wird (lesbar gruppiert)
    contacts: [
      { name: "Kärntner Flugschule", phone: "+436763400340", display: "+43 676 3400340" },
      { name: "FLIEGER-BASE (Sicherheitstraining)", phone: "+436503809549", display: "+43 650 3809549" },
      { name: "Bergrettung", phone: "140" },
      { name: "Rettung", phone: "144" },
      { name: "Euronotruf", phone: "112" },
    ],
  },
};

// Schneller Zugriff: Startplatz-ID -> Briefing
const BRIEFING_BY_SPOT = (() => {
  const map = {};
  Object.values(BRIEFINGS).forEach(b => (b.spots || []).forEach(id => { map[id] = b; }));
  return map;
})();
