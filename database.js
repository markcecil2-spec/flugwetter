// Startplatz-Datenbank – automatisch aus der offiziellen DHV-Geländedatenbank generiert.
// Quelle: service.dhv.de (Startrichtung = erlaubte Windrichtung). Gelände mit mehreren
// Startplätzen unterschiedlicher Ausrichtung sind pro Himmelsrichtung getrennt gelistet
// (z. B. "Jöchelspitze (SO)", "(S)", "(SW)") – wie in der burnair-Karte.
// sectors: erlaubte Sektoren [von,bis] in Grad (0=N,90=O,180=S,270=W), Wrap über 360°.
// dhv: DHV-Gelände-ID (Deep-Link). Grenzwerte = sinnvolle Defaults.

const DEF = { windMin: 3, windMax: 27, gustMax: 32 };

const SPOT_DB = [
  { id: "db_5772", name: "Aasrücken", region: "Göppingen",
    lat: 48.7512, lon: 9.7305, elevation: 521, dhv: 5772,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_573", name: "Adelberg", region: "Annweiler",
    lat: 49.2165, lon: 7.9602, elevation: 540, dhv: 573,
    sectors: [[56.25, 168.75]], sectorLabel: "ONO-SSO", ...DEF },

  { id: "db_188", name: "Adolzfurt", region: "Bretzfeld",
    lat: 49.1606, lon: 9.4713, elevation: 365, dhv: 188,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_257", name: "Adorf / Wirmighausen", region: "Diemelsee",
    lat: 51.3508, lon: 8.8305, elevation: 465, dhv: 257,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_723", name: "Aitern", region: "Aitern",
    lat: 47.8114, lon: 7.8982, elevation: 894, dhv: 723,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_381_N", name: "Alpspitze (N)", region: "Nesselwang",
    lat: 47.6007, lon: 10.4997, elevation: 1520, dhv: 381,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_381_NO", name: "Alpspitze (NO)", region: "Nesselwang",
    lat: 47.5973, lon: 10.4993, elevation: 1520, dhv: 381,
    sectors: [[56.25, 78.75]], sectorLabel: "ONO", ...DEF },

  { id: "db_5731", name: "Altenberg", region: "Aura",
    lat: 50.1677, lon: 10.0156, elevation: 252, dhv: 5731,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_876", name: "Altenbeuthen - Stausee", region: "Altenbeuthen",
    lat: 50.5935, lon: 11.594, elevation: 538, dhv: 876,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_655", name: "Alter Steinbruch", region: "Lindenfels",
    lat: 49.6952, lon: 8.776, elevation: 520, dhv: 655,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_314", name: "Altglashütten / Kapellenhof", region: "Feldberg",
    lat: 47.8489, lon: 8.1036, elevation: 1150, dhv: 314,
    sectors: [[303.75, 101.25]], sectorLabel: "NW-O", ...DEF },

  { id: "db_671_N", name: "Althof (alte HG-Rampe) (N)", region: "Bad Herrenalb",
    lat: 48.8233, lon: 8.4025, elevation: 690, dhv: 671,
    sectors: [[258.75, 56.25], [258.75, 101.25]], sectorLabel: "W-NO · W-O", ...DEF },

  { id: "db_671_W", name: "Althof (alte HG-Rampe) (W)", region: "Bad Herrenalb",
    lat: 48.8221, lon: 8.4031, elevation: 690, dhv: 671,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_636", name: "Am Geisberg", region: "Lindenfels",
    lat: 49.6912, lon: 8.77, elevation: 362, dhv: 636,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_957", name: "Am Göbbelsberge", region: "Albertshausen",
    lat: 51.1208, lon: 9.0539, elevation: 355, dhv: 957,
    sectors: [[11.25, 56.25]], sectorLabel: "NNO-NO", ...DEF },

  { id: "db_1018", name: "Am Hoppern", region: "Willingen",
    lat: 51.2951, lon: 8.5909, elevation: 685, dhv: 1018,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_397", name: "Am Jordanbad", region: "Ummendorf Kr. Biberach",
    lat: 48.0792, lon: 9.8325, elevation: 580, dhv: 397,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_818", name: "Am Kirschberg Übungshang", region: "Döbeln",
    lat: 51.1354, lon: 13.0818, elevation: 240, dhv: 818,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1093", name: "Am kleinen Holze", region: "Willingen",
    lat: 51.2878, lon: 8.597, elevation: 650, dhv: 1093,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1096", name: "Am Knippe Übungsgelände", region: "Willingen",
    lat: 51.2994, lon: 8.6011, elevation: 660, dhv: 1096,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2281", name: "Am Lüsebrinke Übungshang", region: "Diemelsee",
    lat: 51.3303, lon: 8.7121, elevation: 540, dhv: 2281,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_618_NW", name: "Am Rammelsberg Nordwest-Startplatz (NW)", region: "Goslar",
    lat: 51.8897, lon: 10.4309, elevation: 610, dhv: 618,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_618_SW", name: "Am Rammelsberg Nordwest-Startplatz (SW)", region: "Goslar",
    lat: 51.8885, lon: 10.4281, elevation: 610, dhv: 618,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_898", name: "Am Saalenweg", region: "Mandern",
    lat: 51.1181, lon: 9.1917, elevation: 290, dhv: 898,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_226", name: "Am Schützenkreuz Übungshang", region: "Birkenau",
    lat: 49.5458, lon: 8.7431, elevation: 380, dhv: 226,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1026", name: "Amihang Übungshang", region: "Garmisch-Partenkirchen",
    lat: 47.4806, lon: 11.0931, elevation: 730, dhv: 1026,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1019", name: "An der Schieferkuhle Übungshang", region: "Willingen (Upland)",
    lat: 51.3181, lon: 8.6511, elevation: 570, dhv: 1019,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_859", name: "Armutswiesen Übungshang", region: "Alfdorf",
    lat: 48.8554, lon: 9.6997, elevation: 400, dhv: 859,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1898", name: "Arnoldshain", region: "Schmitten",
    lat: 50.2545, lon: 8.4473, elevation: 560, dhv: 1898,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_263", name: "Arnsberg", region: "Bischofsheim",
    lat: 50.3985, lon: 9.9566, elevation: 750, dhv: 263,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_46", name: "Ascheloh Übungshang", region: "Halle",
    lat: 52.0475, lon: 8.4066, elevation: 168, dhv: 46,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1045", name: "Ascheloh-Hermannsweg", region: "Halle",
    lat: 52.0508, lon: 8.4098, elevation: 290, dhv: 1045,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_536", name: "Auen-Eckweiler", region: "Sobernheim",
    lat: 49.8392, lon: 7.6049, elevation: 380, dhv: 536,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_5734", name: "Auenheim Schutzwall", region: "Auenheim",
    lat: 48.5998, lon: 7.8263, elevation: 160, dhv: 5734,
    sectors: [[56.25, 101.25]], sectorLabel: "ONO-O", ...DEF },

  { id: "db_5816", name: "Auergang", region: "Schmallenberg",
    lat: 51.1486, lon: 8.1855, elevation: 695, dhv: 5816,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_438", name: "Auf dem Bichel / Auf der Höhe", region: "Nesselwang",
    lat: 47.621, lon: 10.5197, elevation: 921, dhv: 438,
    sectors: [[236.25, 303.75]], sectorLabel: "WSW-WNW", ...DEF },

  { id: "db_239", name: "Auf dem Harsberg", region: "Lauterbach-Mihla",
    lat: 51.0745, lon: 10.3726, elevation: 465, dhv: 239,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_605", name: "Auf dem unteren Mergesfeld", region: "St. Katharinen",
    lat: 49.8719, lon: 7.7872, elevation: 246, dhv: 605,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_1092", name: "Auf dem Wakenfelde", region: "Willingen",
    lat: 51.2892, lon: 8.6247, elevation: 650, dhv: 1092,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2404", name: "Auf der Ecke", region: "Hesselbach",
    lat: 50.8906, lon: 8.3686, elevation: 560, dhv: 2404,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1080", name: "Aussichtswiese", region: "Neckargerach",
    lat: 49.3922, lon: 9.0832, elevation: 290, dhv: 1080,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1050", name: "Bad Salzig", region: "Boppard",
    lat: 50.1939, lon: 7.6152, elevation: 385, dhv: 1050,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_285", name: "Balgheim", region: "Balgheim",
    lat: 48.0661, lon: 8.782, elevation: 750, dhv: 285,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_782", name: "Balsberg", region: "Unterwössen",
    lat: 47.7237, lon: 12.4462, elevation: 750, dhv: 782,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_617", name: "Bannholz - Kleingartach", region: "Kleingartach",
    lat: 49.0989, lon: 8.9876, elevation: 285, dhv: 617,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5721", name: "Bärngschwendt 600 Skiabfahrt Unternberg", region: "Ruhpolding",
    lat: 47.7275, lon: 12.6267, elevation: 1310, dhv: 5721,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_561", name: "Bastenberg", region: "Höxter-Ottbergen",
    lat: 51.7028, lon: 9.3238, elevation: 198, dhv: 561,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1049", name: "Bausenberg", region: "Niederzissen",
    lat: 50.4648, lon: 7.2224, elevation: 317, dhv: 1049,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2403", name: "Beedenkirchen", region: "Lautertal",
    lat: 49.7292, lon: 8.7311, elevation: 366, dhv: 2403,
    sectors: [[281.25, 33.75]], sectorLabel: "WNW-NNO", ...DEF },

  { id: "db_1090", name: "Bergehalde Ensdorf", region: "Ensdorf",
    lat: 49.317, lon: 6.7854, elevation: 320, dhv: 1090,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_326", name: "Berghalde Übungshang", region: "Penzberg",
    lat: 47.7567, lon: 11.3865, elevation: 600, dhv: 326,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_429", name: "Berleberg", region: "Kraftisried",
    lat: 47.7534, lon: 10.4692, elevation: 869, dhv: 429,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_317", name: "Bernau - Innerlehen", region: "Bernau",
    lat: 47.7985, lon: 8.0255, elevation: 1140, dhv: 317,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_441", name: "Bertoldshofen", region: "Bertoldshofen",
    lat: 47.788, lon: 10.6655, elevation: 770, dhv: 441,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_955_N", name: "Beutnitz Übungshang 1 (N)", region: "Golmsdorf",
    lat: 50.959, lon: 11.6747, elevation: 170, dhv: 955,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_955_NO", name: "Beutnitz Übungshang 1 (NO)", region: "Golmsdorf",
    lat: 50.9644, lon: 11.6646, elevation: 245, dhv: 955,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_955_W", name: "Beutnitz Übungshang 1 (W)", region: "Golmsdorf",
    lat: 50.9646, lon: 11.6768, elevation: 240, dhv: 955,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5604_N", name: "Bierbach (N)", region: "Fränkisch-Crumbach",
    lat: 49.761, lon: 8.8504, elevation: 253, dhv: 5604,
    sectors: [[303.75, 101.25]], sectorLabel: "NW-O", ...DEF },

  { id: "db_5604_W", name: "Bierbach (W)", region: "Fränkisch-Crumbach",
    lat: 49.7601, lon: 8.8608, elevation: 239, dhv: 5604,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1122", name: "Blankenhain Übungshang", region: "Rottdorf",
    lat: 50.8463, lon: 11.3475, elevation: 446, dhv: 1122,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1067", name: "Blättersberg", region: "Weyher",
    lat: 49.266, lon: 8.0701, elevation: 550, dhv: 1067,
    sectors: [[101.25, 213.75]], sectorLabel: "OSO-SSW", ...DEF },

  { id: "db_352_N", name: "Blomberg (N)", region: "Wackersberg",
    lat: 47.7345, lon: 11.5072, elevation: 1215, dhv: 352,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_352_O", name: "Blomberg (O)", region: "Wackersberg",
    lat: 47.7309, lon: 11.5127, elevation: 1194, dhv: 352,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_370", name: "Böhming", region: "Kipfenberg",
    lat: 48.9446, lon: 11.3501, elevation: 478, dhv: 370,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_101", name: "Bohnstein", region: "Hesselbach",
    lat: 50.8837, lon: 8.3507, elevation: 450, dhv: 101,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_759", name: "Boos / Staudernheim", region: "Staudernheim",
    lat: 49.7864, lon: 7.7148, elevation: 211, dhv: 759,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_66", name: "Börry am Hellberg", region: "Börry",
    lat: 52.0467, lon: 9.4582, elevation: 200, dhv: 66,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1106", name: "Brandleiten Übungshang", region: "Penzberg",
    lat: 47.7935, lon: 11.3894, elevation: 640, dhv: 1106,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_612_N", name: "Brauneck (N)", region: "Lenggries",
    lat: 47.6641, lon: 11.5245, elevation: 1555, dhv: 612,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_612_O", name: "Brauneck (O)", region: "Lenggries",
    lat: 47.6673, lon: 11.5385, elevation: 1550, dhv: 612,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_612_S", name: "Brauneck (S)", region: "Lenggries",
    lat: 47.6635, lon: 11.5237, elevation: 1545, dhv: 612,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_175", name: "Braunenberg", region: "Oberalfingen / Aalen",
    lat: 48.8599, lon: 10.1346, elevation: 661, dhv: 175,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_952_NO", name: "Breitenberg (NO)", region: "Pfronten-Ried",
    lat: 47.5469, lon: 10.559, elevation: 1688, dhv: 952,
    sectors: [[348.75, 146.25], [348.75, 101.25], [33.75, 56.25]], sectorLabel: "N-SO · N-O · NO", ...DEF },

  { id: "db_952_O", name: "Breitenberg (O)", region: "Pfronten-Ried",
    lat: 47.5477, lon: 10.5566, elevation: 1752, dhv: 952,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_309", name: "Breitmoos Übungshang", region: "Wieden",
    lat: 47.8383, lon: 7.861, elevation: 1185, dhv: 309,
    sectors: [[348.75, 146.25]], sectorLabel: "N-SO", ...DEF },

  { id: "db_288_N", name: "Breitnau (N)", region: "Münstertal",
    lat: 47.8698, lon: 7.8337, elevation: 980, dhv: 288,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_288_SW", name: "Breitnau (SW)", region: "Münstertal",
    lat: 47.8561, lon: 7.8364, elevation: 1111, dhv: 288,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1771", name: "Brotdorf", region: "Merzig-Brotdorf",
    lat: 49.4701, lon: 6.6576, elevation: 320, dhv: 1771,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1110_SW", name: "Bruchhauser Steine (SW)", region: "Bruchhausen",
    lat: 51.3182, lon: 8.545, elevation: 710, dhv: 1110,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1110_W", name: "Bruchhauser Steine (W)", region: "Bruchhausen",
    lat: 51.3161, lon: 8.5481, elevation: 700, dhv: 1110,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5811", name: "Bruchhauser Steine West", region: "Bruchhausen",
    lat: 51.32, lon: 8.5386, elevation: 629, dhv: 5811,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_82", name: "Brunsberg", region: "Godelheim",
    lat: 51.7474, lon: 9.3499, elevation: 290, dhv: 82,
    sectors: [[78.75, 123.75]], sectorLabel: "O-OSO", ...DEF },

  { id: "db_466", name: "Buchberg", region: "Schnaittenbach",
    lat: 49.5147, lon: 12.0298, elevation: 620, dhv: 466,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_984", name: "Buchberg Übungshang", region: "Gmund",
    lat: 47.7334, lon: 11.7439, elevation: 750, dhv: 984,
    sectors: [[326.25, 33.75]], sectorLabel: "NNW-NNO", ...DEF },

  { id: "db_505", name: "Büchelstein", region: "Grattersdorf",
    lat: 48.8082, lon: 13.1756, elevation: 830, dhv: 505,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_408_N", name: "Buchenberg (N)", region: "Buching",
    lat: 47.6067, lon: 10.8111, elevation: 1134, dhv: 408,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_408_NW", name: "Buchenberg (NW)", region: "Buching",
    lat: 47.6065, lon: 10.8104, elevation: 1137, dhv: 408,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_358", name: "Bucherhang", region: "Bad Wiessee",
    lat: 47.6934, lon: 11.7208, elevation: 900, dhv: 358,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_844", name: "Bühl Übungshang", region: "Amberg",
    lat: 49.454, lon: 11.9734, elevation: 415, dhv: 844,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3781", name: "Burg Lichtenberg", region: "Oberstenfeld",
    lat: 49.0131, lon: 9.3178, elevation: 367, dhv: 3781,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_450", name: "Burgberg Kreuz", region: "Kallmünz",
    lat: 49.1676, lon: 11.9551, elevation: 434, dhv: 450,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_796_NO", name: "Burgen Hauptstartplatz (NO)", region: "Burgen",
    lat: 49.8776, lon: 7.0277, elevation: 252, dhv: 796,
    sectors: [[33.75, 101.25], [33.75, 56.25]], sectorLabel: "NO-O · NO", ...DEF },

  { id: "db_796_NW", name: "Burgen Hauptstartplatz (NW)", region: "Burgen",
    lat: 49.8764, lon: 7.0172, elevation: 450, dhv: 796,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_796_SO", name: "Burgen Hauptstartplatz (SO)", region: "Burgen",
    lat: 49.8874, lon: 7.0113, elevation: 244, dhv: 796,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_133", name: "Bürgstadt / Wannenberg", region: "Bürgstadt",
    lat: 49.7212, lon: 9.2885, elevation: 385, dhv: 133,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_943", name: "Calmont", region: "Bremm",
    lat: 50.1068, lon: 7.1149, elevation: 355, dhv: 943,
    sectors: [[146.25, 213.75]], sectorLabel: "SSO-SSW", ...DEF },

  { id: "db_5701", name: "Criesbach", region: "Ingelfingen",
    lat: 49.31, lon: 9.6289, elevation: 350, dhv: 5701,
    sectors: [[146.25, 213.75], [168.75, 213.75]], sectorLabel: "SSO-SSW · S-SSW", ...DEF },

  { id: "db_863", name: "Dachstein", region: "Kaltennordheim",
    lat: 50.6355, lon: 10.1765, elevation: 600, dhv: 863,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_211", name: "Dackstal Übungshang", region: "Sondershausen",
    lat: 51.3607, lon: 10.9245, elevation: 240, dhv: 211,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5711", name: "Datenberg", region: "Bad Tabarz",
    lat: 50.8708, lon: 10.5031, elevation: 570, dhv: 5711,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5726", name: "Der Riedberg", region: "Groß Bieberau",
    lat: 49.7814, lon: 8.8014, elevation: 233, dhv: 5726,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5732_N", name: "Dernbach Nord Übungshang (N)", region: "Dernbach",
    lat: 49.2461, lon: 8.0148, elevation: 288, dhv: 5732,
    sectors: [[281.25, 33.75]], sectorLabel: "WNW-NNO", ...DEF },

  { id: "db_5732_S", name: "Dernbach Nord Übungshang (S)", region: "Dernbach",
    lat: 49.2488, lon: 8.0138, elevation: 278, dhv: 5732,
    sectors: [[146.25, 213.75]], sectorLabel: "SSO-SSW", ...DEF },

  { id: "db_1224", name: "Dertingen", region: "Dertingen",
    lat: 49.7722, lon: 9.6162, elevation: 263, dhv: 1224,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1196", name: "Dieberg", region: "Furth im Wald",
    lat: 49.3287, lon: 12.8674, elevation: 620, dhv: 1196,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_80", name: "Dielmissen - Ith", region: "Dielmissen",
    lat: 51.9812, lon: 9.6262, elevation: 285, dhv: 80,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_693", name: "Donnersberg", region: "Dannenfels",
    lat: 49.6344, lon: 7.9312, elevation: 559, dhv: 693,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_258", name: "Drehkopf", region: "Feldberg",
    lat: 47.8602, lon: 8.093, elevation: 1135, dhv: 258,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_292", name: "Drei-Kreis-Eck", region: "Elzach-Oberprechtal",
    lat: 48.184, lon: 8.1796, elevation: 992, dhv: 292,
    sectors: [[213.75, 11.25]], sectorLabel: "SW-N", ...DEF },

  { id: "db_284", name: "Dreifaltigkeitsberg", region: "Spaichingen",
    lat: 48.0839, lon: 8.7601, elevation: 965, dhv: 284,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_170", name: "Duchroth Nord", region: "Duchroth",
    lat: 49.7755, lon: 7.7224, elevation: 290, dhv: 170,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_180", name: "Eberfirst", region: "Eberstadt",
    lat: 49.1879, lon: 9.3229, elevation: 300, dhv: 180,
    sectors: [[191.25, 258.75], [213.75, 236.25]], sectorLabel: "SSW-WSW · SW", ...DEF },

  { id: "db_303_O", name: "Eck (O)", region: "Gersbach",
    lat: 47.6843, lon: 7.9325, elevation: 925, dhv: 303,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_303_W", name: "Eck (W)", region: "Gersbach",
    lat: 47.6882, lon: 7.9183, elevation: 933, dhv: 303,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_494", name: "Edelweiß", region: "Karlstadt-Gambach",
    lat: 49.9945, lon: 9.7571, elevation: 301, dhv: 494,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_725", name: "Egg/Happareute", region: "Röthenbach",
    lat: 47.6264, lon: 9.955, elevation: 691, dhv: 725,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_304", name: "Ehrsberg", region: "Häg-Ehrsberg",
    lat: 47.7508, lon: 7.9079, elevation: 850, dhv: 304,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_283", name: "Eichberg/Stutz", region: "Blumberg",
    lat: 47.8482, lon: 8.5143, elevation: 912, dhv: 283,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_182_SW", name: "Einkorn (SW)", region: "Michelbach",
    lat: 49.0898, lon: 9.776, elevation: 451, dhv: 182,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_182_W", name: "Einkorn (W)", region: "Michelbach",
    lat: 49.0901, lon: 9.7756, elevation: 451, dhv: 182,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_59", name: "Eisenberg Westhang", region: "Battenberg",
    lat: 51.0158, lon: 8.6199, elevation: 450, dhv: 59,
    sectors: [[258.75, 303.75]], sectorLabel: "W-WNW", ...DEF },

  { id: "db_2622", name: "Elpe Übungshang (Unterhang)", region: "Olsberg",
    lat: 51.2713, lon: 8.4386, elevation: 560, dhv: 2622,
    sectors: [[33.75, 123.75]], sectorLabel: "NO-OSO", ...DEF },

  { id: "db_130", name: "Elpe-Steinmarkskopf", region: "Olsberg",
    lat: 51.2694, lon: 8.4321, elevation: 670, dhv: 130,
    sectors: [[33.75, 123.75]], sectorLabel: "NO-OSO", ...DEF },

  { id: "db_5741", name: "Elpersheim Süd", region: "Elpersheim",
    lat: 49.4756, lon: 9.8594, elevation: 292, dhv: 5741,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_6", name: "Engerda", region: "Engerda",
    lat: 50.7924, lon: 11.4245, elevation: 474, dhv: 6,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_547", name: "Engleshof", region: "Pirk",
    lat: 49.5956, lon: 12.2115, elevation: 440, dhv: 547,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_742", name: "Entenberg", region: "Bad Laasphe",
    lat: 50.918, lon: 8.4342, elevation: 534, dhv: 742,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_2175", name: "Eppenhain", region: "Eppenhain",
    lat: 50.1728, lon: 8.3839, elevation: 422, dhv: 2175,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1159", name: "Erbach-Erlenbach", region: "Erbach",
    lat: 49.645, lon: 9.0197, elevation: 381, dhv: 1159,
    sectors: [[258.75, 281.25], [281.25, 303.75]], sectorLabel: "W · WNW", ...DEF },

  { id: "db_728", name: "Erden", region: "Erden",
    lat: 49.9849, lon: 7.018, elevation: 290, dhv: 728,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_134", name: "Erlau Ost-SP", region: "Fränkisch Crumbach",
    lat: 49.7428, lon: 8.822, elevation: 383, dhv: 134,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5826", name: "Erlau SW-Startplatz GS", region: "Fränkisch Crumbach",
    lat: 49.7447, lon: 8.8342, elevation: 260, dhv: 5826,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2450", name: "Eschbach", region: "Usingen/Eschbach",
    lat: 50.354, lon: 8.5237, elevation: 380, dhv: 2450,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_590", name: "Eschlkam", region: "Eschlkam",
    lat: 49.2924, lon: 12.9286, elevation: 509, dhv: 590,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5727", name: "Ettenberg", region: "Marktschellenberg",
    lat: 47.6794, lon: 13.0297, elevation: 860, dhv: 5727,
    sectors: [[146.25, 191.25]], sectorLabel: "SSO-S", ...DEF },

  { id: "db_5485", name: "Feilbingert", region: "Feilbingert",
    lat: 49.7706, lon: 7.8176, elevation: 307, dhv: 5485,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_880_N", name: "Feldberg-Skischanze (N)", region: "Feldberg",
    lat: 47.8558, lon: 8.0215, elevation: 1250, dhv: 880,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_880_W", name: "Feldberg-Skischanze (W)", region: "Feldberg",
    lat: 47.8567, lon: 8.0247, elevation: 1250, dhv: 880,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_218", name: "Feuerkuppe", region: "Straußberg",
    lat: 51.3954, lon: 10.749, elevation: 430, dhv: 218,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1025", name: "Fichtelberg", region: "Oberwiesenthal",
    lat: 50.4231, lon: 12.9524, elevation: 1190, dhv: 1025,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_210", name: "Filzberg Übungsgelände", region: "Berka",
    lat: 51.3415, lon: 10.9424, elevation: 210, dhv: 210,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_675", name: "Finkenberg", region: "Rossbach / Wied",
    lat: 50.5826, lon: 7.4113, elevation: 320, dhv: 675,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_527", name: "Finkenhof", region: "Obrigheim / Neckar",
    lat: 49.3347, lon: 9.0922, elevation: 300, dhv: 527,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3260", name: "Finkennest Übungshang", region: "Stiefenhofen",
    lat: 47.5831, lon: 10.017, elevation: 825, dhv: 3260,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_761", name: "Fischbek Übungshang", region: "Neugraben-Fischbek",
    lat: 53.4641, lon: 9.8451, elevation: 66, dhv: 761,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1076", name: "Fluggebiet Todtnau", region: "Todtnau",
    lat: 47.8381, lon: 7.9932, elevation: 1296, dhv: 1076,
    sectors: [[213.75, 281.25], [191.25, 281.25]], sectorLabel: "SW-W · SSW-W", ...DEF },

  { id: "db_711", name: "Förlenberg", region: "Annweiler",
    lat: 49.1919, lon: 8.0045, elevation: 530, dhv: 711,
    sectors: [[11.25, 78.75]], sectorLabel: "NNO-ONO", ...DEF },

  { id: "db_783", name: "Frahelser Buckl Übungshang", region: "Lam",
    lat: 49.199, lon: 13.0345, elevation: 540, dhv: 783,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_584_N", name: "Frauenberg (N)", region: "Sondershausen",
    lat: 51.3774, lon: 10.8344, elevation: 407, dhv: 584,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_584_O", name: "Frauenberg (O)", region: "Sondershausen",
    lat: 51.3769, lon: 10.8339, elevation: 388, dhv: 584,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_648", name: "Fridingen (Bergsteig/Riesen)", region: "Fridingen",
    lat: 48.0181, lon: 8.9137, elevation: 720, dhv: 648,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_308_O", name: "Fröhnd Ittenschwander Horn (O)", region: "Fröhnd",
    lat: 47.7633, lon: 7.8592, elevation: 1000, dhv: 308,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_308_S", name: "Fröhnd Ittenschwander Horn (S)", region: "Fröhnd",
    lat: 47.7709, lon: 7.9097, elevation: 1000, dhv: 308,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_333", name: "Froschsee", region: "Ruhpolding",
    lat: 47.7572, lon: 12.6937, elevation: 890, dhv: 333,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_542", name: "Fürmannalm / Irlberg Anger", region: "Anger",
    lat: 47.7931, lon: 12.8404, elevation: 860, dhv: 542,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_286", name: "Fürstenberg", region: "Hüfingen",
    lat: 47.8893, lon: 8.5627, elevation: 900, dhv: 286,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_809", name: "Fürstenberg Nordost", region: "Hüfingen",
    lat: 47.8911, lon: 8.5654, elevation: 856, dhv: 809,
    sectors: [[303.75, 56.25], [348.75, 11.25]], sectorLabel: "NW-NO · N", ...DEF },

  { id: "db_1186", name: "Gadern-Höhenweg", region: "Wald-Michelbach",
    lat: 49.5821, lon: 8.8047, elevation: 490, dhv: 1186,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_240", name: "Galgenberg", region: "Munzingen",
    lat: 47.971, lon: 7.6788, elevation: 280, dhv: 240,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_797", name: "Galgenberg", region: "Losheim",
    lat: 49.5005, lon: 6.7401, elevation: 395, dhv: 797,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_695", name: "Gangelsberg", region: "Duchroth",
    lat: 49.7924, lon: 7.7406, elevation: 300, dhv: 695,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1037", name: "Gänsberg", region: "Urbach",
    lat: 48.8187, lon: 9.5874, elevation: 390, dhv: 1037,
    sectors: [[236.25, 281.25]], sectorLabel: "WSW-W", ...DEF },

  { id: "db_3461_S", name: "Gänsberg West-Startplatz (S)", region: "Ramsthal",
    lat: 50.1411, lon: 10.0567, elevation: 309, dhv: 3461,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3461_W", name: "Gänsberg West-Startplatz (W)", region: "Ramsthal",
    lat: 50.1422, lon: 10.0572, elevation: 340, dhv: 3461,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1002", name: "Geba - Seeba Süd", region: "Seeba",
    lat: 50.5782, lon: 10.2947, elevation: 535, dhv: 1002,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_832", name: "Geba Südwest", region: "Helmershausen",
    lat: 50.5692, lon: 10.255, elevation: 560, dhv: 832,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_186", name: "Geddelsbacher Hang", region: "Geddelsbach",
    lat: 49.1518, lon: 9.4954, elevation: 397, dhv: 186,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_800", name: "Gedeonseck", region: "Boppard",
    lat: 50.2437, lon: 7.5728, elevation: 280, dhv: 800,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_388_SW", name: "Gehwinde (SW)", region: "Schöllang",
    lat: 47.4705, lon: 10.3024, elevation: 1460, dhv: 388,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_388_W", name: "Gehwinde (W)", region: "Schöllang",
    lat: 47.4706, lon: 10.3326, elevation: 1460, dhv: 388,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_613_N", name: "Gipfelstation Nordwest (N)", region: "Grainbach",
    lat: 47.7484, lon: 12.2504, elevation: 1520, dhv: 613,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_613_W", name: "Gipfelstation Nordwest (W)", region: "Grainbach",
    lat: 47.7473, lon: 12.2482, elevation: 1560, dhv: 613,
    sectors: [[281.25, 303.75]], sectorLabel: "WNW", ...DEF },

  { id: "db_28", name: "Glauchberg", region: "Bärenstein",
    lat: 50.7986, lon: 13.7815, elevation: 545, dhv: 28,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_923", name: "Golan Höhe - Denklingen", region: "Denklingen",
    lat: 47.9039, lon: 10.8667, elevation: 730, dhv: 923,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_503", name: "Görauer Anger", region: "Kasendorf",
    lat: 50.0537, lon: 11.317, elevation: 538, dhv: 503,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_140_NO", name: "Gösberg Übungshang (NO)", region: "Schmelz",
    lat: 49.4457, lon: 6.8162, elevation: 340, dhv: 140,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_140_S", name: "Gösberg Übungshang (S)", region: "Schmelz",
    lat: 49.4514, lon: 6.8093, elevation: 307, dhv: 140,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_719", name: "Graach", region: "Graach",
    lat: 49.9443, lon: 7.0591, elevation: 320, dhv: 719,
    sectors: [[236.25, 258.75]], sectorLabel: "WSW", ...DEF },

  { id: "db_553", name: "Gräfenthal", region: "Gräfenthal",
    lat: 50.5225, lon: 11.3322, elevation: 620, dhv: 553,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1055", name: "Großer Kopf / Römerturm", region: "Arzbach",
    lat: 50.3699, lon: 7.7565, elevation: 430, dhv: 1055,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_132", name: "Großheubach / Busigberg", region: "Großheubach",
    lat: 49.734, lon: 9.2072, elevation: 296, dhv: 132,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_495", name: "Großneundorf", region: "Großneundorf",
    lat: 50.5374, lon: 11.2935, elevation: 568, dhv: 495,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_498_N", name: "Grün (N)", region: "Weißenbrunn",
    lat: 50.178, lon: 11.3613, elevation: 440, dhv: 498,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_498_NO", name: "Grün (NO)", region: "Weißenbrunn",
    lat: 50.1809, lon: 11.3507, elevation: 440, dhv: 498,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_400", name: "Grüner Weg", region: "Fischen",
    lat: 47.4562, lon: 10.2585, elevation: 870, dhv: 400,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_387", name: "Grünten", region: "Rettenberg",
    lat: 47.5656, lon: 10.3088, elevation: 1200, dhv: 387,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_289", name: "Gschasi", region: "Elzach-Prechtal",
    lat: 48.1862, lon: 8.1287, elevation: 990, dhv: 289,
    sectors: [[213.75, 303.75]], sectorLabel: "SW-WNW", ...DEF },

  { id: "db_5677", name: "Guckinsdorf", region: "Oppenau",
    lat: 48.4687, lon: 8.15, elevation: 370, dhv: 5677,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5827_O", name: "Güttersbach (O)", region: "Fränkisch Crumbach",
    lat: 49.7509, lon: 8.8353, elevation: 260, dhv: 5827,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5827_S", name: "Güttersbach (S)", region: "Fränkisch Crumbach",
    lat: 49.7494, lon: 8.8309, elevation: 260, dhv: 5827,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_919", name: "Haardskopf", region: "Breitscheid",
    lat: 50.5586, lon: 7.4349, elevation: 310, dhv: 919,
    sectors: [[236.25, 303.75]], sectorLabel: "WSW-WNW", ...DEF },

  { id: "db_692", name: "Habach", region: "Habach",
    lat: 47.7198, lon: 11.2794, elevation: 740, dhv: 692,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_966", name: "Hahnberg", region: "Bad Wildungen",
    lat: 51.1039, lon: 9.0623, elevation: 510, dhv: 966,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_502", name: "Hainberg", region: "Stadtsteinach",
    lat: 50.1626, lon: 11.5258, elevation: 524, dhv: 502,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5739", name: "Hainberg", region: "Meschede-Niederberge",
    lat: 51.3457, lon: 8.154, elevation: 405, dhv: 5739,
    sectors: [[146.25, 168.75]], sectorLabel: "SSO", ...DEF },

  { id: "db_3347", name: "Halbeswig", region: "Bestwig",
    lat: 51.3299, lon: 8.39, elevation: 630, dhv: 3347,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5737", name: "Halde Hoheward", region: "Herten",
    lat: 51.5683, lon: 7.1612, elevation: 151, dhv: 5737,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_5473_NO", name: "Halde Menteroda NW-Start (NO)", region: "Menteroda",
    lat: 51.3231, lon: 10.5727, elevation: 460, dhv: 5473,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5473_NW", name: "Halde Menteroda NW-Start (NW)", region: "Menteroda",
    lat: 51.3227, lon: 10.5644, elevation: 482, dhv: 5473,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5473_SO", name: "Halde Menteroda NW-Start (SO)", region: "Menteroda",
    lat: 51.3205, lon: 10.5688, elevation: 467, dhv: 5473,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5473_SW", name: "Halde Menteroda NW-Start (SW)", region: "Menteroda",
    lat: 51.3205, lon: 10.5651, elevation: 477, dhv: 5473,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3682", name: "Hallgarten", region: "Hallgarten",
    lat: 50.0386, lon: 8.0329, elevation: 295, dhv: 3682,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5715", name: "Hänschberg", region: "Eibau",
    lat: 51.0014, lon: 14.6589, elevation: 500, dhv: 5715,
    sectors: [[168.75, 213.75]], sectorLabel: "S-SSW", ...DEF },

  { id: "db_733", name: "Harbatshofen", region: "Harbatshofen",
    lat: 47.6054, lon: 9.9928, elevation: 880, dhv: 733,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_2502", name: "Hauchenberg", region: "Weitnau",
    lat: 47.6205, lon: 10.157, elevation: 1240, dhv: 2502,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_316", name: "Hausberg", region: "Garmisch-Partenkirchen",
    lat: 47.465, lon: 11.0962, elevation: 1250, dhv: 316,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_509", name: "Hausstein", region: "Lallmig",
    lat: 48.871, lon: 13.0733, elevation: 880, dhv: 509,
    sectors: [[101.25, 123.75]], sectorLabel: "OSO", ...DEF },

  { id: "db_486_O", name: "Heckenkopf - Rauschen / Faulbach (O)", region: "Hasloch",
    lat: 49.7823, lon: 9.4661, elevation: 305, dhv: 486,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_486_SW", name: "Heckenkopf - Rauschen / Faulbach (SW)", region: "Hasloch",
    lat: 49.7909, lon: 9.5064, elevation: 220, dhv: 486,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_788", name: "Heckerbugl", region: "Affecking",
    lat: 48.892, lon: 11.8934, elevation: 410, dhv: 788,
    sectors: [[236.25, 281.25]], sectorLabel: "WSW-W", ...DEF },

  { id: "db_268", name: "Heidelsheimer Weg", region: "Münzesheim / Kraichtal",
    lat: 49.1123, lon: 8.6943, elevation: 163, dhv: 268,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_545", name: "Heimatturm Colditz Übungshang", region: "Colditz/Hausdorf",
    lat: 51.1164, lon: 12.8177, elevation: 170, dhv: 545,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1098", name: "Heimborn-Knabenberg Übungshang", region: "Hachenburg",
    lat: 50.7143, lon: 7.7722, elevation: 310, dhv: 1098,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_998", name: "Heinsheim", region: "Bad Rappenau",
    lat: 49.2531, lon: 9.1492, elevation: 213, dhv: 998,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5768", name: "Heisterberg", region: "Kirchhundem",
    lat: 51.0947, lon: 8.1733, elevation: 600, dhv: 5768,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1066", name: "Henneberg", region: "Henneberg",
    lat: 50.4861, lon: 10.3404, elevation: 500, dhv: 1066,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2278", name: "Herchen", region: "Windeck",
    lat: 50.7794, lon: 7.5036, elevation: 190, dhv: 2278,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_700", name: "Herzerberg", region: "Pfeffelbach",
    lat: 49.5495, lon: 7.3082, elevation: 586, dhv: 700,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_439_N", name: "Hesselberg Nordhang (N)", region: "91726 Gerolfingen",
    lat: 49.0671, lon: 10.5358, elevation: 689, dhv: 439,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_439_S", name: "Hesselberg Nordhang (S)", region: "91726 Gerolfingen",
    lat: 49.0666, lon: 10.5317, elevation: 689, dhv: 439,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_610", name: "Heubach Übungshang", region: "Kalbach-Heubach",
    lat: 50.3829, lon: 9.6942, elevation: 590, dhv: 610,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_329", name: "Heuberg", region: "Nußdorf",
    lat: 47.7259, lon: 12.1839, elevation: 1338, dhv: 329,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_717", name: "Heuberg", region: "Frammersbach",
    lat: 50.068, lon: 9.4589, elevation: 360, dhv: 717,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_581", name: "Heue / Bergalingen", region: "Rickenbach",
    lat: 47.6196, lon: 7.9391, elevation: 850, dhv: 581,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5590", name: "HG-Übungsgelände Auf Hostert", region: "Betteldorf",
    lat: 50.2456, lon: 6.745, elevation: 557, dhv: 5590,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_702", name: "Hintereck", region: "Gütenbach",
    lat: 48.0492, lon: 8.1244, elevation: 990, dhv: 702,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_366", name: "Hinterholzhausen", region: "Langenpreising",
    lat: 48.4191, lon: 12.0085, elevation: 506, dhv: 366,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_633", name: "Hittenkirchen Übungshang", region: "Bernau-Hittenkirchen",
    lat: 47.8249, lon: 12.3423, elevation: 650, dhv: 633,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_301_N", name: "Hochblauen Nord (N)", region: "Badenweiler",
    lat: 47.7785, lon: 7.7, elevation: 1166, dhv: 301,
    sectors: [[348.75, 33.75]], sectorLabel: "N-NNO", ...DEF },

  { id: "db_301_O", name: "Hochblauen Nord (O)", region: "Badenweiler",
    lat: 47.7767, lon: 7.7, elevation: 1153, dhv: 301,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_301_S", name: "Hochblauen Nord (S)", region: "Badenweiler",
    lat: 47.7766, lon: 7.7, elevation: 1152, dhv: 301,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_346_N", name: "Hochfelln Nordstart (N)", region: "Bergen",
    lat: 47.7628, lon: 12.5602, elevation: 1665, dhv: 346,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_346_O", name: "Hochfelln Nordstart (O)", region: "Bergen",
    lat: 47.7617, lon: 12.5596, elevation: 1665, dhv: 346,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1160", name: "Hochfelln Oststart", region: "Bergen",
    lat: 47.7617, lon: 12.5596, elevation: 1665, dhv: 1160,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_310", name: "Hochfirst", region: "Titisee-Neustadt",
    lat: 47.9014, lon: 8.1835, elevation: 1185, dhv: 310,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_382", name: "Hochgrat", region: "Oberstaufen",
    lat: 47.4942, lon: 10.0729, elevation: 1820, dhv: 382,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_347", name: "Hochplatte", region: "Marquartstein",
    lat: 47.7674, lon: 12.421, elevation: 1020, dhv: 347,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1939", name: "Hochzellberg", region: "Bodenmais",
    lat: 49.0755, lon: 13.1302, elevation: 1140, dhv: 1939,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1129", name: "Hockenberg", region: "Hardheim",
    lat: 49.6068, lon: 9.4882, elevation: 380, dhv: 1129,
    sectors: [[258.75, 101.25]], sectorLabel: "W-O", ...DEF },

  { id: "db_691", name: "Hockeroda", region: "Hockeroda",
    lat: 50.5987, lon: 11.4525, elevation: 542, dhv: 691,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_802", name: "Hoferer Höhe", region: "Bad Birnbach",
    lat: 48.4636, lon: 13.0775, elevation: 450, dhv: 802,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1079", name: "Hohe Hardt", region: "Morsbach",
    lat: 50.8608, lon: 7.7233, elevation: 335, dhv: 1079,
    sectors: [[348.75, 33.75]], sectorLabel: "N-NNO", ...DEF },

  { id: "db_71", name: "Hohe Nordosthang", region: "Hehlen",
    lat: 51.9552, lon: 9.4578, elevation: 235, dhv: 71,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_194", name: "Hohenberg", region: "Annweiler / Triftels",
    lat: 49.2011, lon: 8.0019, elevation: 530, dhv: 194,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_922", name: "Höhenberg", region: "Neumarkt i. d. Oberpfalz",
    lat: 49.2689, lon: 11.4869, elevation: 550, dhv: 922,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2648", name: "Hohenberg NW", region: "Queichhambach",
    lat: 49.2026, lon: 8.0045, elevation: 547, dhv: 2648,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_834", name: "Hohenkarpfen", region: "Hausen",
    lat: 48.0429, lon: 8.718, elevation: 857, dhv: 834,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1091", name: "Hohenneuffen - Nord", region: "Neuffen",
    lat: 48.5567, lon: 9.4047, elevation: 725, dhv: 1091,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_679", name: "Hohenneuffen West", region: "Neuffen",
    lat: 48.5495, lon: 9.4045, elevation: 712, dhv: 679,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2467", name: "Hohenöllen", region: "Hohenöllen",
    lat: 49.6247, lon: 7.6214, elevation: 290, dhv: 2467,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4570", name: "Hohensolms Skilifthang", region: "Hohenahr",
    lat: 50.6558, lon: 8.5169, elevation: 414, dhv: 4570,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_737", name: "Hoher Bogen - Eschlkam Übungshang", region: "Neukirchen Hl. Blut",
    lat: 49.267, lon: 12.9526, elevation: 470, dhv: 737,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_469_N", name: "Hoher Bogen (N)", region: "Neukirchen b. Hl. Blut",
    lat: 49.235, lon: 12.9419, elevation: 1033, dhv: 469,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_469_NO", name: "Hoher Bogen (NO)", region: "Neukirchen b. Hl. Blut",
    lat: 49.2363, lon: 12.9426, elevation: 990, dhv: 469,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_50", name: "Hoher Meissner Uengsterode", region: "Großalmerode",
    lat: 51.2456, lon: 9.8463, elevation: 537, dhv: 50,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_51", name: "Hoher Meissner Vockerode", region: "Meissner/Vockerode",
    lat: 51.2097, lon: 9.8739, elevation: 600, dhv: 51,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5773", name: "Hohrein", region: "Göppingen",
    lat: 48.7412, lon: 9.6947, elevation: 510, dhv: 5773,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_976", name: "Höllenberg", region: "Spirkelbach",
    lat: 49.1883, lon: 7.888, elevation: 450, dhv: 976,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5790", name: "Holzau", region: "Rechenberg-Bienenmühle",
    lat: 50.7294, lon: 13.5758, elevation: 718, dhv: 5790,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5710", name: "Hömberg", region: "Meschede",
    lat: 51.3179, lon: 8.2101, elevation: 514, dhv: 5710,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5794_NW", name: "Homberg (NW)", region: "Bad Berleburg",
    lat: 51.0211, lon: 8.4886, elevation: 550, dhv: 5794,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5794_S", name: "Homberg (S)", region: "Bad Berleburg",
    lat: 51.0204, lon: 8.4873, elevation: 550, dhv: 5794,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5794_SO", name: "Homberg (SO)", region: "Bad Berleburg",
    lat: 51.0213, lon: 8.4893, elevation: 561, dhv: 5794,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_127", name: "Homberg-Züschen", region: "Winterberg",
    lat: 51.1346, lon: 8.5412, elevation: 710, dhv: 127,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_492", name: "Homburg", region: "Gössenheim",
    lat: 50.0261, lon: 9.7977, elevation: 304, dhv: 492,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_909_O", name: "Hönningen (O)", region: "Hönningen/Ahr",
    lat: 50.4704, lon: 6.9417, elevation: 350, dhv: 909,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_909_S", name: "Hönningen (S)", region: "Hönningen/Ahr",
    lat: 50.4787, lon: 6.9479, elevation: 380, dhv: 909,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_282", name: "Hornisgrinde - Katzenkopf", region: "Seebach",
    lat: 48.5969, lon: 8.1962, elevation: 1123, dhv: 282,
    sectors: [[236.25, 281.25]], sectorLabel: "WSW-W", ...DEF },

  { id: "db_1042", name: "Hörnle", region: "Bad Kohlgrub",
    lat: 47.6451, lon: 11.0539, elevation: 1450, dhv: 1042,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5478", name: "Hörnle", region: "Brackenheim",
    lat: 49.1007, lon: 9.0724, elevation: 319, dhv: 5478,
    sectors: [[146.25, 168.75]], sectorLabel: "SSO", ...DEF },

  { id: "db_1147", name: "Hörnle / Jagsthausen", region: "Jagsthausen",
    lat: 49.3137, lon: 9.437, elevation: 290, dhv: 1147,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2382", name: "Hörnle Baurer Wiese Übungshang", region: "Bad Kohlgrub",
    lat: 47.6562, lon: 11.0363, elevation: 957, dhv: 2382,
    sectors: [[281.25, 303.75]], sectorLabel: "WNW", ...DEF },

  { id: "db_294_N", name: "Hörnleberg Süd-Startplatz (N)", region: "Gutach-Bleibach",
    lat: 48.1293, lon: 8.0387, elevation: 760, dhv: 294,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_294_SW", name: "Hörnleberg Süd-Startplatz (SW)", region: "Gutach-Bleibach",
    lat: 48.1274, lon: 8.0444, elevation: 870, dhv: 294,
    sectors: [[168.75, 258.75]], sectorLabel: "S-WSW", ...DEF },

  { id: "db_997", name: "Hubertushütte Geisingen", region: "Stadt Geisingen",
    lat: 47.9439, lon: 8.6328, elevation: 886, dhv: 997,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_867", name: "Humberg", region: "Odernheim",
    lat: 49.7685, lon: 7.7112, elevation: 275, dhv: 867,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4584", name: "Hündle", region: "Oberstaufen",
    lat: 47.5446, lon: 10.0528, elevation: 1035, dhv: 4584,
    sectors: [[281.25, 348.75]], sectorLabel: "WNW-NNW", ...DEF },

  { id: "db_1083", name: "Hundsbach", region: "Hundsbach",
    lat: 50.0188, lon: 9.8714, elevation: 282, dhv: 1083,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_592", name: "Hundsberg", region: "Obersulm",
    lat: 49.1271, lon: 9.4101, elevation: 370, dhv: 592,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1058", name: "Im Borngrund Übungshang", region: "Eschbach",
    lat: 50.2154, lon: 7.7242, elevation: 360, dhv: 1058,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2399", name: "Im Eldern - Übungshang", region: "Hopferau",
    lat: 47.6236, lon: 10.6468, elevation: 841, dhv: 2399,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_825", name: "Im Theiswieschen - In der Heckwies", region: "Mayen",
    lat: 50.2857, lon: 7.1887, elevation: 320, dhv: 825,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_265", name: "Imberger Horn", region: "Hindelang",
    lat: 47.4891, lon: 10.3634, elevation: 1350, dhv: 265,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_176", name: "Ipf", region: "Bopfingen",
    lat: 48.8705, lon: 10.3571, elevation: 688, dhv: 176,
    sectors: [[213.75, 56.25]], sectorLabel: "SW-NO", ...DEF },

  { id: "db_1064", name: "Irgersdorf", region: "Irgersdorf",
    lat: 51.1167, lon: 14.3844, elevation: 435, dhv: 1064,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_264", name: "Iseler", region: "Hindelang",
    lat: 47.5024, lon: 10.4122, elevation: 1442, dhv: 264,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_471", name: "Jachenhausen", region: "Riedenburg",
    lat: 48.9874, lon: 11.6996, elevation: 538, dhv: 471,
    sectors: [[191.25, 281.25]], sectorLabel: "SSW-W", ...DEF },

  { id: "db_574", name: "Jägerberg", region: "Jena",
    lat: 50.9698, lon: 11.6197, elevation: 298, dhv: 574,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_690", name: "Jägerkamp/Nagelspitz", region: "Schliersee",
    lat: 47.6792, lon: 11.904, elevation: 1490, dhv: 690,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_521_N", name: "Jenner (N)", region: "Schönau am Königssee",
    lat: 47.5766, lon: 13.0247, elevation: 1790, dhv: 521,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_521_O", name: "Jenner (O)", region: "Schönau am Königssee",
    lat: 47.5798, lon: 13.0252, elevation: 1695, dhv: 521,
    sectors: [[78.75, 146.25], [78.75, 101.25]], sectorLabel: "O-SO · O", ...DEF },

  { id: "db_521_W", name: "Jenner (W)", region: "Schönau am Königssee",
    lat: 47.5765, lon: 13.0345, elevation: 1770, dhv: 521,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_657_NW", name: "Jenzig (NW)", region: "Jena",
    lat: 50.9401, lon: 11.6243, elevation: 385, dhv: 657,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_657_S", name: "Jenzig (S)", region: "Jena",
    lat: 50.9388, lon: 11.6331, elevation: 385, dhv: 657,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1130", name: "Kahle Pön", region: "Referinghausen",
    lat: 51.2618, lon: 8.6721, elevation: 740, dhv: 1130,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_344", name: "Kampenwand", region: "Aschau",
    lat: 47.7533, lon: 12.3528, elevation: 1450, dhv: 344,
    sectors: [[303.75, 11.25], [348.75, 11.25]], sectorLabel: "NW-N · N", ...DEF },

  { id: "db_1023_N", name: "Kandahar-Express - Kreuzjoch (N)", region: "Garmisch-Partenkirchen",
    lat: 47.4528, lon: 11.0799, elevation: 1690, dhv: 1023,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_1023_NO", name: "Kandahar-Express - Kreuzjoch (NO)", region: "Garmisch-Partenkirchen",
    lat: 47.4525, lon: 11.0683, elevation: 1640, dhv: 1023,
    sectors: [[56.25, 78.75]], sectorLabel: "ONO", ...DEF },

  { id: "db_739", name: "Kapf/Paradies", region: "Oberstaufen",
    lat: 47.5484, lon: 10.0014, elevation: 997, dhv: 739,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_4", name: "Kaulsdorf", region: "Kaulsdorf",
    lat: 50.6316, lon: 11.4155, elevation: 395, dhv: 4,
    sectors: [[168.75, 213.75]], sectorLabel: "S-SSW", ...DEF },

  { id: "db_1100", name: "Kausen Übungshang", region: "Verbandsgemeinde Gebhardshain",
    lat: 50.7383, lon: 7.8692, elevation: 420, dhv: 1100,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_843", name: "Kella-Berg", region: "Kella",
    lat: 51.2431, lon: 10.0798, elevation: 510, dhv: 843,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_927", name: "Kirgel", region: "Gaildorf",
    lat: 48.9941, lon: 9.7585, elevation: 458, dhv: 927,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5771", name: "Kleff", region: "Plettenberg",
    lat: 51.2149, lon: 7.9322, elevation: 505, dhv: 5771,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_615", name: "Kleinheppacher Kopf", region: "Korb",
    lat: 48.8332, lon: 9.3781, elevation: 400, dhv: 615,
    sectors: [[123.75, 281.25]], sectorLabel: "SO-W", ...DEF },

  { id: "db_2613", name: "Klippeneck Schlepp", region: "Denkingen",
    lat: 48.1134, lon: 8.7723, elevation: 698, dhv: 2613,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_821", name: "Klosterreichenbach", region: "Klosterreichenbach",
    lat: 48.5221, lon: 8.4032, elevation: 620, dhv: 821,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_149", name: "Klüsserath", region: "Klüsserath",
    lat: 49.8477, lon: 6.8712, elevation: 300, dhv: 149,
    sectors: [[168.75, 236.25], [168.75, 191.25]], sectorLabel: "S-SW · S", ...DEF },

  { id: "db_5", name: "Knobelsdorf", region: "Knobelsdorf",
    lat: 50.6069, lon: 11.3712, elevation: 482, dhv: 5,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_468", name: "Kohlberg Übungshang", region: "Kohlberg",
    lat: 49.5939, lon: 12.0317, elevation: 480, dhv: 468,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_280", name: "Kohleckle Berghaupten", region: "Berghaupten",
    lat: 48.4136, lon: 7.9664, elevation: 422, dhv: 280,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5674", name: "Kolbingen", region: "Kolbingen",
    lat: 48.0442, lon: 8.8944, elevation: 785, dhv: 5674,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1056", name: "Königsheide", region: "Warmensteinach",
    lat: 49.9981, lon: 11.7702, elevation: 745, dhv: 1056,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1084", name: "Königstuhl", region: "Heidelberg",
    lat: 49.4039, lon: 8.7268, elevation: 540, dhv: 1084,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_72", name: "Königszinne", region: "Bodenwerder",
    lat: 51.978, lon: 9.5259, elevation: 255, dhv: 72,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5594", name: "Korbach", region: "Korbach",
    lat: 51.2587, lon: 8.8286, elevation: 460, dhv: 5594,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5792_N", name: "Kötzhelle (N)", region: "Meinerzhagen",
    lat: 51.1081, lon: 7.7949, elevation: 405, dhv: 5792,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_5792_NW", name: "Kötzhelle (NW)", region: "Meinerzhagen",
    lat: 51.1082, lon: 7.7972, elevation: 400, dhv: 5792,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1125", name: "Krautheim", region: "Krautheim",
    lat: 49.3952, lon: 9.6492, elevation: 310, dhv: 1125,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_262", name: "Kreuzberg Familienabfahrt", region: "Bischofsheim",
    lat: 50.3804, lon: 9.9925, elevation: 750, dhv: 262,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1770", name: "Kreuzberg Südost", region: "Bischofsheim",
    lat: 50.3646, lon: 9.9811, elevation: 882, dhv: 1770,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3255", name: "Kronenberg", region: "Hargesheim",
    lat: 49.8556, lon: 7.8309, elevation: 207, dhv: 3255,
    sectors: [[258.75, 303.75]], sectorLabel: "W-WNW", ...DEF },

  { id: "db_1209", name: "Krunkelbachhütte / Spießhorn", region: "Bernau",
    lat: 47.8269, lon: 8.0338, elevation: 1315, dhv: 1209,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5749", name: "Kuhhelle", region: "Lennestadt-Meggen",
    lat: 51.1272, lon: 8.0919, elevation: 580, dhv: 5749,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_795", name: "Küppchen - Lasserg", region: "Münstermaifeld-Lasserg",
    lat: 50.2168, lon: 7.3845, elevation: 260, dhv: 795,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_841", name: "Laasan / Kunitz Übungshang", region: "Golmsdorf",
    lat: 50.9503, lon: 11.6668, elevation: 320, dhv: 841,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_616", name: "Laber", region: "Oberammergau",
    lat: 47.5863, lon: 11.1036, elevation: 1682, dhv: 616,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_98", name: "Langer Berg", region: "Odernheim",
    lat: 49.7638, lon: 7.7137, elevation: 309, dhv: 98,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1157", name: "Laucha Westhang", region: "Laucha",
    lat: 51.2473, lon: 11.6868, elevation: 230, dhv: 1157,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_281", name: "Lauf", region: "Lauf",
    lat: 48.6251, lon: 8.1626, elevation: 790, dhv: 281,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_920", name: "Lautersheim", region: "Göllheim",
    lat: 49.584, lon: 8.1069, elevation: 330, dhv: 920,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5747", name: "Lehens", region: "Ilsfeld",
    lat: 49.0636, lon: 9.3084, elevation: 349, dhv: 5747,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_689", name: "Leuchtenburg", region: "Seitenroda",
    lat: 50.8008, lon: 11.6105, elevation: 390, dhv: 689,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2354", name: "Lindenberg", region: "Buchenbach",
    lat: 47.9985, lon: 8.0072, elevation: 683, dhv: 2354,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5767", name: "Lindewerrablick", region: "Lindewerra",
    lat: 51.3261, lon: 9.9475, elevation: 238, dhv: 5767,
    sectors: [[146.25, 191.25]], sectorLabel: "SSO-S", ...DEF },

  { id: "db_765", name: "Lisberg", region: "Lisberg",
    lat: 49.885, lon: 10.7355, elevation: 325, dhv: 765,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_191_NW", name: "Loffenau Weststart Teufelsmühle (NW)", region: "Loffenau",
    lat: 48.7583, lon: 8.406, elevation: 834, dhv: 191,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_191_W", name: "Loffenau Weststart Teufelsmühle (W)", region: "Loffenau",
    lat: 48.7567, lon: 8.4072, elevation: 890, dhv: 191,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5469", name: "Lombach", region: "Loßburg",
    lat: 48.4283, lon: 8.4608, elevation: 660, dhv: 5469,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_150", name: "Longuich", region: "Schweich",
    lat: 49.8119, lon: 6.7808, elevation: 300, dhv: 150,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_85_S", name: "Maring-Noviand (S)", region: "Maring-Noviand",
    lat: 49.9459, lon: 7.0036, elevation: 275, dhv: 85,
    sectors: [[146.25, 236.25]], sectorLabel: "SSO-SW", ...DEF },

  { id: "db_85_SO", name: "Maring-Noviand (SO)", region: "Maring-Noviand",
    lat: 49.9439, lon: 6.9903, elevation: 290, dhv: 85,
    sectors: [[146.25, 168.75]], sectorLabel: "SSO", ...DEF },

  { id: "db_5728", name: "Marktschellenberg", region: "Marktschellenberg",
    lat: 47.6733, lon: 13.0331, elevation: 560, dhv: 5728,
    sectors: [[101.25, 168.75]], sectorLabel: "OSO-SSO", ...DEF },

  { id: "db_2398", name: "Martinsthal", region: "Eltville",
    lat: 50.0544, lon: 8.1348, elevation: 249, dhv: 2398,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_658", name: "Mäusberg", region: "Karlburg",
    lat: 49.9906, lon: 9.7217, elevation: 300, dhv: 658,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_540", name: "Meddersheim", region: "Meddersheim",
    lat: 49.7789, lon: 7.5836, elevation: 292, dhv: 540,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_602_O", name: "Meerfelder Maar (O)", region: "Meerfeld",
    lat: 50.0934, lon: 6.7467, elevation: 520, dhv: 602,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_602_S", name: "Meerfelder Maar (S)", region: "Meerfeld",
    lat: 50.1061, lon: 6.756, elevation: 520, dhv: 602,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_83", name: "Mehring", region: "Saarburg-Trier",
    lat: 49.7813, lon: 6.8376, elevation: 400, dhv: 83,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_869", name: "Meistern -  Kienhalde", region: "Bad Wildbad",
    lat: 48.7356, lon: 8.552, elevation: 690, dhv: 869,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_267", name: "Melibokus", region: "Alsbach",
    lat: 49.7253, lon: 8.6357, elevation: 500, dhv: 267,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_79", name: "Mellbeck", region: "Sprockhövel",
    lat: 51.3117, lon: 7.1864, elevation: 315, dhv: 79,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_987_NO", name: "Merkur (NO)", region: "Gernsbach",
    lat: 48.7647, lon: 8.2816, elevation: 653, dhv: 987,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_987_W", name: "Merkur (W)", region: "Gernsbach",
    lat: 48.7647, lon: 8.2794, elevation: 651, dhv: 987,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2174", name: "Messbacher Höhenweg", region: "Fischbachtal",
    lat: 49.7484, lon: 8.8133, elevation: 360, dhv: 2174,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_167", name: "Messelberg", region: "Donzdorf",
    lat: 48.6795, lon: 9.8389, elevation: 700, dhv: 167,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1007", name: "Michelsberg", region: "Münnerstadt",
    lat: 50.2516, lon: 10.1606, elevation: 380, dhv: 1007,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_386_N", name: "Mittag (N)", region: "Immenstadt",
    lat: 47.5376, lon: 10.2187, elevation: 1381, dhv: 386,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_386_S", name: "Mittag (S)", region: "Immenstadt",
    lat: 47.5358, lon: 10.2157, elevation: 1443, dhv: 386,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_386_W", name: "Mittag (W)", region: "Immenstadt",
    lat: 47.5377, lon: 10.2165, elevation: 1391, dhv: 386,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_343", name: "Mittelstaufen", region: "Bad Reichenhall",
    lat: 47.7554, lon: 12.8331, elevation: 1657, dhv: 343,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5714", name: "Moarbichl Hochgern", region: "Unterwössen",
    lat: 47.7497, lon: 12.5064, elevation: 1597, dhv: 5714,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1167", name: "Moltkefelsen", region: "Dannenfels",
    lat: 49.6206, lon: 7.9414, elevation: 540, dhv: 1167,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_137", name: "Momart Übungshang", region: "Bad König",
    lat: 49.7265, lon: 9.0387, elevation: 362, dhv: 137,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_643", name: "Moos", region: "Oberkirch",
    lat: 48.4628, lon: 8.1136, elevation: 825, dhv: 643,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_579", name: "Möslehang", region: "St. Blasien / Menzenschwand",
    lat: 47.8308, lon: 8.0589, elevation: 1030, dhv: 579,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3640", name: "Mühlberg Übungshang", region: "Drei Gleichen OT Mühlberg",
    lat: 50.861, lon: 10.8484, elevation: 337, dhv: 3640,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_4651", name: "Mühlenberg NW-Startplatz", region: "Weinstadt",
    lat: 48.8001, lon: 9.4036, elevation: 373, dhv: 4651,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1004", name: "Mühlenfeld Landeplatz (Birkenbeul)", region: "Birkenbeul",
    lat: 50.7442, lon: 7.6098, elevation: 282, dhv: 1004,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_197", name: "Mulfingen", region: "Mulfingen",
    lat: 49.3342, lon: 9.8123, elevation: 406, dhv: 197,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1085", name: "Nassauer Berg", region: "Nassau",
    lat: 50.3058, lon: 7.8037, elevation: 268, dhv: 1085,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5722", name: "Naunheim", region: "Wetzlar-Naunheim",
    lat: 50.5922, lon: 8.5272, elevation: 215, dhv: 5722,
    sectors: [[101.25, 123.75]], sectorLabel: "OSO", ...DEF },

  { id: "db_395_NW", name: "Nebelhorn Gipfel Terassen-SP 1 (südl. Gipfelstation) (NW)", region: "Oberstdorf",
    lat: 47.4115, lon: 10.349, elevation: 1910, dhv: 395,
    sectors: [[236.25, 11.25]], sectorLabel: "WSW-N", ...DEF },

  { id: "db_395_S", name: "Nebelhorn Gipfel Terassen-SP 1 (südl. Gipfelstation) (S)", region: "Oberstdorf",
    lat: 47.4212, lon: 10.3422, elevation: 2170, dhv: 395,
    sectors: [[123.75, 213.75], [191.25, 213.75]], sectorLabel: "SO-SSW · SSW", ...DEF },

  { id: "db_395_SW", name: "Nebelhorn Gipfel Terassen-SP 1 (südl. Gipfelstation) (SW)", region: "Oberstdorf",
    lat: 47.4207, lon: 10.3424, elevation: 2150, dhv: 395,
    sectors: [[168.75, 281.25], [213.75, 281.25]], sectorLabel: "S-W · SW-W", ...DEF },

  { id: "db_951", name: "Neidlingen", region: "Neidlingen",
    lat: 48.5775, lon: 9.5932, elevation: 770, dhv: 951,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_614", name: "Netphen", region: "Netphen",
    lat: 50.9203, lon: 8.078, elevation: 360, dhv: 614,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_964", name: "Neuberg", region: "Odernheim",
    lat: 49.7669, lon: 7.6918, elevation: 270, dhv: 964,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_248_N", name: "Neubürg (N)", region: "Mistelgau",
    lat: 49.8905, lon: 11.4017, elevation: 578, dhv: 248,
    sectors: [[168.75, 168.75]], sectorLabel: "S-SSO", ...DEF },

  { id: "db_248_NO", name: "Neubürg (NO)", region: "Mistelgau",
    lat: 49.8919, lon: 11.4026, elevation: 578, dhv: 248,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_248_NW", name: "Neubürg (NW)", region: "Mistelgau",
    lat: 49.892, lon: 11.4017, elevation: 578, dhv: 248,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_248_SW", name: "Neubürg (SW)", region: "Mistelgau",
    lat: 49.8905, lon: 11.4008, elevation: 578, dhv: 248,
    sectors: [[191.25, 258.75]], sectorLabel: "SSW-WSW", ...DEF },

  { id: "db_248_W", name: "Neubürg (W)", region: "Mistelgau",
    lat: 49.8915, lon: 11.4013, elevation: 578, dhv: 248,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_589", name: "Neukenroth", region: "Stockheim",
    lat: 50.3258, lon: 11.2698, elevation: 481, dhv: 589,
    sectors: [[56.25, 123.75]], sectorLabel: "ONO-OSO", ...DEF },

  { id: "db_87", name: "Neumagen-Dhron", region: "NeumagenDhron",
    lat: 49.8774, lon: 6.8877, elevation: 385, dhv: 87,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1009", name: "Neuwied-Rodenbach", region: "Neuwied-Rodenbach",
    lat: 50.4606, lon: 7.4384, elevation: 170, dhv: 1009,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_147", name: "Nieder-Liebersbach Übungshang", region: "Birkenau",
    lat: 49.5956, lon: 8.7106, elevation: 245, dhv: 147,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_961", name: "Niederlibbach", region: "Taunusstein",
    lat: 50.2016, lon: 8.1673, elevation: 365, dhv: 961,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_637_O", name: "Niederrheinkogel - Halde Norddeutschland SW-Start (O)", region: "Neukirchen-Vluyn",
    lat: 51.4714, lon: 6.5683, elevation: 105, dhv: 637,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_637_SW", name: "Niederrheinkogel - Halde Norddeutschland SW-Start (SW)", region: "Neukirchen-Vluyn",
    lat: 51.4693, lon: 6.5664, elevation: 105, dhv: 637,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2953", name: "Nonrod NO Übungshang", region: "Fischbachtal",
    lat: 49.7492, lon: 8.8207, elevation: 384, dhv: 2953,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2173", name: "Nonroder Höhe", region: "Fischbachtal",
    lat: 49.7549, lon: 8.8256, elevation: 351, dhv: 2173,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_5615", name: "Nonroder Höhe Hangstart", region: "Fischbachtal",
    lat: 49.7549, lon: 8.8258, elevation: 351, dhv: 5615,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_117", name: "Nordhelle", region: "Herscheid",
    lat: 51.1502, lon: 7.7548, elevation: 637, dhv: 117,
    sectors: [[326.25, 33.75]], sectorLabel: "NNW-NNO", ...DEF },

  { id: "db_120", name: "Nordhelle Skihang Ebbefeld", region: "Herscheid",
    lat: 51.1512, lon: 7.7551, elevation: 610, dhv: 120,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3983", name: "Nordhelle Werdohl", region: "Werdohl",
    lat: 51.2467, lon: 7.7493, elevation: 405, dhv: 3983,
    sectors: [[326.25, 56.25]], sectorLabel: "NNW-NO", ...DEF },

  { id: "db_551", name: "Nordwesthang Sassenroth", region: "Stadtverwaltung Herdorf",
    lat: 50.7698, lon: 7.9291, elevation: 370, dhv: 551,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5766", name: "Ober-Ostern", region: "Reichelsheim",
    lat: 49.6821, lon: 8.8432, elevation: 352, dhv: 5766,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_858", name: "Oberaltenbernheim Übungshang", region: "Obernzenn",
    lat: 49.4624, lon: 10.5083, elevation: 380, dhv: 858,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_644", name: "Obere Kalle", region: "Immenstadt",
    lat: 47.551, lon: 10.1465, elevation: 1210, dhv: 644,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1134", name: "Obere Rieth", region: "Oberderdingen",
    lat: 49.0452, lon: 8.8027, elevation: 310, dhv: 1134,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_746", name: "Obere Tonhalde", region: "Münsingen-Buttenhausen",
    lat: 48.3603, lon: 9.4841, elevation: 800, dhv: 746,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_446_S", name: "Obereichstätt (S)", region: "Dollnstein",
    lat: 48.8967, lon: 11.1351, elevation: 520, dhv: 446,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_446_SW", name: "Obereichstätt (SW)", region: "Dollnstein",
    lat: 48.8929, lon: 11.1406, elevation: 520, dhv: 446,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_371", name: "Oberemmendorf", region: "Kipfenberg",
    lat: 48.9895, lon: 11.4436, elevation: 520, dhv: 371,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_497", name: "Oberer Gemeindeberg/Unterer Gemeindeberg", region: "Gschwend",
    lat: 48.925, lon: 9.7383, elevation: 568, dhv: 497,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5797", name: "Oberes Griet", region: "Pfedelbach",
    lat: 49.1578, lon: 9.5174, elevation: 390, dhv: 5797,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_443", name: "Obergrainet", region: "Obergrainet",
    lat: 48.8013, lon: 13.6717, elevation: 940, dhv: 443,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1195", name: "Oberkochen", region: "Oberkochen",
    lat: 48.7808, lon: 10.0908, elevation: 688, dhv: 1195,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_697", name: "Obermarsberg", region: "Marsberg",
    lat: 51.441, lon: 8.851, elevation: 353, dhv: 697,
    sectors: [[326.25, 11.25]], sectorLabel: "NNW-N", ...DEF },

  { id: "db_1176", name: "Obermaubach", region: "Obermaubach",
    lat: 50.714, lon: 6.4504, elevation: 250, dhv: 1176,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_649", name: "Obermelbecke-Kerschlade", region: "Lennestadt / ST Obermelbecke",
    lat: 51.1674, lon: 8.0448, elevation: 400, dhv: 649,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_198", name: "Oberried", region: "Oberried",
    lat: 47.9203, lon: 7.9544, elevation: 880, dhv: 198,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1001", name: "Oberweiler", region: "Odernheim/Glan",
    lat: 49.7705, lon: 7.7192, elevation: 300, dhv: 1001,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_701", name: "Ockfen/Bockstein", region: "Ockfen",
    lat: 49.6241, lon: 6.5951, elevation: 370, dhv: 701,
    sectors: [[191.25, 236.25]], sectorLabel: "SSW-SW", ...DEF },

  { id: "db_2603", name: "Ödberg", region: "Gmund am Tegernsee",
    lat: 47.7391, lon: 11.7758, elevation: 960, dhv: 2603,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_483", name: "Ofenthaler Berg", region: "Hammelburg",
    lat: 50.1254, lon: 9.91, elevation: 312, dhv: 483,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1097", name: "Omerskopf", region: "Bühl",
    lat: 48.6407, lon: 8.1715, elevation: 790, dhv: 1097,
    sectors: [[236.25, 258.75]], sectorLabel: "WSW", ...DEF },

  { id: "db_1193", name: "Oppenau Nordost / Ibacher Holzplatz", region: "Oppenau",
    lat: 48.4476, lon: 8.1471, elevation: 740, dhv: 1193,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5716", name: "Oppenauer Köpfle", region: "Oppenau",
    lat: 48.4769, lon: 8.1828, elevation: 415, dhv: 5716,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_277", name: "Orensberg", region: "Frankweiler",
    lat: 49.2405, lon: 8.0263, elevation: 547, dhv: 277,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_452", name: "Osser", region: "Lam/Lohberg",
    lat: 49.204, lon: 13.0991, elevation: 1175, dhv: 452,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_672", name: "Ostalb - Skipiste Langert", region: "Aalen",
    lat: 48.8148, lon: 10.0782, elevation: 664, dhv: 672,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1163", name: "Osterbuchberg Übungshang", region: "Grabenstätt",
    lat: 47.8044, lon: 12.5208, elevation: 610, dhv: 1163,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_321_N", name: "Osterfelder Ost-Startplatz (Hauptstartplatz) (N)", region: "Garmisch-Partenkirchen",
    lat: 47.4393, lon: 11.0519, elevation: 2010, dhv: 321,
    sectors: [[348.75, 56.25], [303.75, 56.25]], sectorLabel: "N-NO · NW-NO", ...DEF },

  { id: "db_321_SO", name: "Osterfelder Ost-Startplatz (Hauptstartplatz) (SO)", region: "Garmisch-Partenkirchen",
    lat: 47.4382, lon: 11.05, elevation: 2038, dhv: 321,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_74", name: "Pegestorf", region: "Pegestorf",
    lat: 51.9401, lon: 9.4913, elevation: 225, dhv: 74,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_247", name: "Pensenwiesen", region: "Bayreuth",
    lat: 49.9376, lon: 11.6599, elevation: 458, dhv: 247,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_207", name: "Pfulb", region: "Schopfloch",
    lat: 48.5283, lon: 9.5385, elevation: 756, dhv: 207,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_591", name: "Pig Mountain", region: "Wörth an der Donau",
    lat: 49.0128, lon: 12.4012, elevation: 430, dhv: 591,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1081", name: "Pig Mountain Übungshang", region: "Wörth",
    lat: 49.0139, lon: 12.3991, elevation: 418, dhv: 1081,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5461", name: "Pöhlbergalm", region: "Annaberg-Buchholz",
    lat: 50.57, lon: 13.0302, elevation: 755, dhv: 5461,
    sectors: [[101.25, 191.25]], sectorLabel: "OSO-S", ...DEF },

  { id: "db_341_N", name: "Predigtstuhl (N)", region: "Bad Reichenhall",
    lat: 47.6889, lon: 12.8897, elevation: 1720, dhv: 341,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_341_NO", name: "Predigtstuhl (NO)", region: "Bad Reichenhall",
    lat: 47.6954, lon: 12.8822, elevation: 1610, dhv: 341,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_341_W", name: "Predigtstuhl (W)", region: "Bad Reichenhall",
    lat: 47.692, lon: 12.8826, elevation: 1688, dhv: 341,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_459", name: "Premberg", region: "Teublitz",
    lat: 49.2348, lon: 12.0732, elevation: 420, dhv: 459,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_475", name: "Pröller", region: "St. Engelmar",
    lat: 49.0223, lon: 12.8215, elevation: 1018, dhv: 475,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_603", name: "Pröllerfeld / Tremmelhauserhöhe Übungshang", region: "Lappersdorf",
    lat: 49.0517, lon: 12.0529, elevation: 430, dhv: 603,
    sectors: [[303.75, 146.25]], sectorLabel: "NW-SO", ...DEF },

  { id: "db_96", name: "Pünderich", region: "Pünderich",
    lat: 50.0471, lon: 7.1265, elevation: 210, dhv: 96,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_173", name: "Rabenfelsen", region: "Geislingen",
    lat: 48.6138, lon: 9.7963, elevation: 680, dhv: 173,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_500", name: "Radspitze", region: "Seibelsdorf",
    lat: 50.2354, lon: 11.434, elevation: 668, dhv: 500,
    sectors: [[191.25, 258.75]], sectorLabel: "SSW-WSW", ...DEF },

  { id: "db_340", name: "Rampoldplatte", region: "Brannenburg",
    lat: 47.7256, lon: 12.0417, elevation: 1450, dhv: 340,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1216", name: "Rank / Modellflieger", region: "Bernau",
    lat: 47.8173, lon: 8.035, elevation: 1140, dhv: 1216,
    sectors: [[123.75, 281.25]], sectorLabel: "SO-W", ...DEF },

  { id: "db_2644", name: "Ratholz", region: "Immenstadt",
    lat: 47.573, lon: 10.1335, elevation: 983, dhv: 2644,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_682_SO", name: "Rauenstein (SO)", region: "Rauenstein",
    lat: 50.4247, lon: 11.0427, elevation: 720, dhv: 682,
    sectors: [[146.25, 168.75]], sectorLabel: "SSO", ...DEF },

  { id: "db_682_SW", name: "Rauenstein (SW)", region: "Rauenstein",
    lat: 50.4218, lon: 11.0436, elevation: 720, dhv: 682,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_242", name: "Raumbach", region: "Raumbach",
    lat: 49.7268, lon: 7.6584, elevation: 300, dhv: 242,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_335", name: "Rauschberg", region: "Ruhpolding",
    lat: 47.7331, lon: 12.6856, elevation: 1650, dhv: 335,
    sectors: [[281.25, 11.25]], sectorLabel: "WNW-N", ...DEF },

  { id: "db_1128", name: "Rebberg", region: "Radolfzell",
    lat: 47.7678, lon: 8.9682, elevation: 490, dhv: 1128,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_432", name: "Rehlehalde / Schöner Berg", region: "Friesenried",
    lat: 47.8659, lon: 10.5802, elevation: 788, dhv: 432,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1078", name: "Reichenbach", region: "Waldems",
    lat: 50.2778, lon: 8.3747, elevation: 470, dhv: 1078,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_854", name: "Reichenhausen", region: "Reichenhausen",
    lat: 50.5887, lon: 10.1268, elevation: 550, dhv: 854,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1150", name: "Reichental", region: "Gernsbach / Reichental",
    lat: 48.7274, lon: 8.4237, elevation: 860, dhv: 1150,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_933", name: "Renhardsweiler", region: "Ebersbach-Musbach",
    lat: 47.9981, lon: 9.571, elevation: 670, dhv: 933,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3250", name: "Rinsenberg", region: "Lennestadt",
    lat: 51.1303, lon: 8.1636, elevation: 604, dhv: 3250,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_941", name: "Riol", region: "Riol",
    lat: 49.7813, lon: 6.8006, elevation: 407, dhv: 941,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_642", name: "Rivenich", region: "Rivenich",
    lat: 49.8694, lon: 6.8578, elevation: 280, dhv: 642,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_440", name: "Röhrenhalde Übungshang", region: "Görisried",
    lat: 47.6858, lon: 10.4981, elevation: 900, dhv: 440,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_741_N", name: "Ronneburg die Hell (Übungshang Süd) (N)", region: "Ronneburg",
    lat: 50.2369, lon: 9.0608, elevation: 230, dhv: 741,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_741_S", name: "Ronneburg die Hell (Übungshang Süd) (S)", region: "Ronneburg",
    lat: 50.2371, lon: 9.0609, elevation: 230, dhv: 741,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1038", name: "Roschlaub/Obstgarten", region: "Scheßlitz",
    lat: 50.0144, lon: 11.0302, elevation: 445, dhv: 1038,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_974_S", name: "Rossbühl (S)", region: "Oppenau",
    lat: 48.4965, lon: 8.2328, elevation: 930, dhv: 974,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_974_SW", name: "Rossbühl (SW)", region: "Oppenau",
    lat: 48.487, lon: 8.2391, elevation: 930, dhv: 974,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5468", name: "Rossnacken", region: "Lennestadt",
    lat: 51.1181, lon: 8.1856, elevation: 580, dhv: 5468,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_904", name: "Roter Berg - Werneburg", region: "Kaulsdorf",
    lat: 50.6359, lon: 11.4383, elevation: 425, dhv: 904,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_965", name: "Rothenberg", region: "Schnaittach",
    lat: 49.557, lon: 11.3559, elevation: 480, dhv: 965,
    sectors: [[281.25, 303.75]], sectorLabel: "WNW", ...DEF },

  { id: "db_3256", name: "Rotstein", region: "Oberkochen",
    lat: 48.7799, lon: 10.1149, elevation: 686, dhv: 3256,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_668", name: "Saal-Rönkhausen", region: "Rönkhausen",
    lat: 51.2394, lon: 7.957, elevation: 526, dhv: 668,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_528", name: "Saalhausen - Dolberg", region: "Lennestadt",
    lat: 51.1079, lon: 8.1609, elevation: 560, dhv: 528,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_740", name: "Salmaser Höhe/Salmas", region: "Thalkirchdorf",
    lat: 47.5699, lon: 10.0889, elevation: 1254, dhv: 740,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1152", name: "Sandkopf", region: "Oppenau",
    lat: 48.4965, lon: 8.2328, elevation: 930, dhv: 1152,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_626", name: "Sasbachwalden-Schloßberg", region: "Sasbachwalden",
    lat: 48.6096, lon: 8.1523, elevation: 798, dhv: 626,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1046", name: "Schäfersfeld", region: "Oppenau",
    lat: 48.4357, lon: 8.152, elevation: 770, dhv: 1046,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_27", name: "Schauhübel", region: "Geising",
    lat: 50.7481, lon: 13.807, elevation: 690, dhv: 27,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_575", name: "Schauinsland", region: "Freiburg",
    lat: 47.9097, lon: 7.8896, elevation: 1180, dhv: 575,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_978", name: "Scheffau", region: "Scheffau",
    lat: 47.6744, lon: 13.0638, elevation: 720, dhv: 978,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_10", name: "Scheibentalberg Übungshang", region: "Ahlendorf / Trebnitz",
    lat: 50.9916, lon: 11.9749, elevation: 245, dhv: 10,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_428", name: "Scheiber / Tiroler Stadl", region: "Pfronten",
    lat: 47.5569, lon: 10.5533, elevation: 1265, dhv: 428,
    sectors: [[11.25, 56.25]], sectorLabel: "NNO-NO", ...DEF },

  { id: "db_3254", name: "Schienerberg", region: "Singen-Bohlingen",
    lat: 47.7078, lon: 8.9002, elevation: 480, dhv: 3254,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_548", name: "Schillenberg", region: "Marktoberdorf",
    lat: 47.761, lon: 10.6195, elevation: 772, dhv: 548,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_588", name: "Schloß Banz", region: "Staffelstein",
    lat: 50.1346, lon: 10.9984, elevation: 405, dhv: 588,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_661", name: "Schmalzlalm", region: "Rettenbach",
    lat: 49.0435, lon: 12.4531, elevation: 645, dhv: 661,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2413", name: "Schmecker", region: "Weikersheim",
    lat: 49.4875, lon: 9.893, elevation: 325, dhv: 2413,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5669", name: "Schmirchauer Höhe", region: "Ronneburg",
    lat: 50.8472, lon: 12.1708, elevation: 372, dhv: 5669,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_157", name: "Schnaithalde", region: "Burladingen",
    lat: 48.2965, lon: 9.0576, elevation: 820, dhv: 157,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_985", name: "Schoden", region: "Schoden",
    lat: 49.6418, lon: 6.5933, elevation: 279, dhv: 985,
    sectors: [[236.25, 258.75]], sectorLabel: "WSW", ...DEF },

  { id: "db_853", name: "Schrattenbach", region: "Dietmannsried",
    lat: 47.8484, lon: 10.2977, elevation: 800, dhv: 853,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_193", name: "Schreckhof", region: "Mosbach-Diedesheim",
    lat: 49.3605, lon: 9.1075, elevation: 255, dhv: 193,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_192", name: "Schreckhof (Westhang)", region: "Mosbach - Diedesheim",
    lat: 49.3625, lon: 9.1047, elevation: 270, dhv: 192,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_144", name: "Schriesheim", region: "Schriesheim",
    lat: 49.4645, lon: 8.6788, elevation: 380, dhv: 144,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3555", name: "Schulungsgelände Gländfeld", region: "Bischofsmais",
    lat: 48.9031, lon: 13.0886, elevation: 685, dhv: 3555,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1108", name: "Schulungsgelände Heuberger-Kreuz", region: "Bubsheim",
    lat: 48.1191, lon: 8.8009, elevation: 919, dhv: 1108,
    sectors: [[56.25, 101.25]], sectorLabel: "ONO-O", ...DEF },

  { id: "db_817", name: "Schulungsgelände Tegernsee, Schafstatt,", region: "Gmund a Teg.",
    lat: 47.7617, lon: 11.7588, elevation: 790, dhv: 817,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2585", name: "Schulungshang Niederwinden", region: "Winden",
    lat: 48.135, lon: 8.0258, elevation: 450, dhv: 2585,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5663", name: "Schwanden Übungshang", region: "Stifenhofen",
    lat: 47.5876, lon: 10.0297, elevation: 930, dhv: 5663,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1935", name: "Schwaney-Hoppenberg", region: "Altenbeken",
    lat: 51.7158, lon: 8.9017, elevation: 325, dhv: 1935,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_539_N", name: "Schwartenberg (N)", region: "Neuhausen",
    lat: 50.6596, lon: 13.4657, elevation: 770, dhv: 539,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_539_W", name: "Schwartenberg (W)", region: "Neuhausen",
    lat: 50.6594, lon: 13.4648, elevation: 770, dhv: 539,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3076", name: "Schwärzenbach Übungshang", region: "Titisee-Neustadt",
    lat: 47.9464, lon: 8.2194, elevation: 935, dhv: 3076,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2971", name: "Sehlem", region: "Sehlem",
    lat: 49.8945, lon: 6.827, elevation: 205, dhv: 2971,
    sectors: [[258.75, 348.75]], sectorLabel: "W-NNW", ...DEF },

  { id: "db_5719", name: "Sengenberg", region: "Bestwig",
    lat: 51.3783, lon: 8.4154, elevation: 499, dhv: 5719,
    sectors: [[11.25, 56.25]], sectorLabel: "NNO-NO", ...DEF },

  { id: "db_86", name: "Serrig und Hamm", region: "Trier-Saarburg",
    lat: 49.569, lon: 6.6156, elevation: 320, dhv: 86,
    sectors: [[236.25, 281.25]], sectorLabel: "WSW-W", ...DEF },

  { id: "db_5770", name: "Sieseler Alm -", region: "Plettenberg",
    lat: 51.2151, lon: 7.9021, elevation: 442, dhv: 5770,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_142", name: "Sinnhöll", region: "Offenbach-Hundheim",
    lat: 49.6224, lon: 7.5416, elevation: 270, dhv: 142,
    sectors: [[213.75, 258.75]], sectorLabel: "SW-WSW", ...DEF },

  { id: "db_390", name: "Sinswang", region: "Stiefenhofen",
    lat: 47.5673, lon: 9.9967, elevation: 940, dhv: 390,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_889", name: "Skihang Hartenrod", region: "Hartenrod",
    lat: 50.7483, lon: 8.454, elevation: 495, dhv: 889,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_996", name: "Skihang Wirtsberg", region: "Bartholomä",
    lat: 48.7468, lon: 9.9934, elevation: 690, dhv: 996,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_313", name: "Skilift Stierhütte Übungshang", region: "Feldberg",
    lat: 47.8668, lon: 8.1335, elevation: 990, dhv: 313,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_164", name: "Skiliftgelände Hausen a.d.L.", region: "Hausen/Trochtelfingen",
    lat: 48.2989, lon: 9.188, elevation: 827, dhv: 164,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_473", name: "Sommerberg", region: "Haibach",
    lat: 49.0367, lon: 12.7471, elevation: 800, dhv: 473,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_727", name: "Sommerberg", region: "Bad Wildbad",
    lat: 48.7404, lon: 8.5347, elevation: 730, dhv: 727,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2385", name: "Sommerberg", region: "Deggingen",
    lat: 48.6125, lon: 9.7243, elevation: 670, dhv: 2385,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5519", name: "Sonnen Übungshang", region: "Bad Kohlgrub",
    lat: 47.6559, lon: 11.0454, elevation: 995, dhv: 5519,
    sectors: [[303.75, 101.25]], sectorLabel: "NW-O", ...DEF },

  { id: "db_1179", name: "Sonnenhang", region: "Willingen",
    lat: 51.2919, lon: 8.5814, elevation: 760, dhv: 1179,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2200", name: "Spielberg", region: "Hümpfershausen",
    lat: 50.6597, lon: 10.2238, elevation: 531, dhv: 2200,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_266_S", name: "Spieser (S)", region: "Hindelang",
    lat: 47.5272, lon: 10.3894, elevation: 1641, dhv: 266,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_266_W", name: "Spieser (W)", region: "Hindelang",
    lat: 47.518, lon: 10.3768, elevation: 1470, dhv: 266,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_278", name: "Spitzfelsen", region: "Hausach",
    lat: 48.293, lon: 8.2022, elevation: 570, dhv: 278,
    sectors: [[303.75, 236.25]], sectorLabel: "NW-SW", ...DEF },

  { id: "db_971", name: "Sponsheimer Berg", region: "Laubenheim",
    lat: 49.9297, lon: 7.8911, elevation: 200, dhv: 971,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_95", name: "Stachelhardt", region: "Bülgenauel / Hennef",
    lat: 50.7809, lon: 7.3767, elevation: 210, dhv: 95,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1169_S", name: "Startplatz Kandel (Kandel-West und Rampe) (S)", region: "Waldkirch",
    lat: 48.0568, lon: 8.0131, elevation: 1150, dhv: 1169,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1169_W", name: "Startplatz Kandel (Kandel-West und Rampe) (W)", region: "Waldkirch",
    lat: 48.0652, lon: 8.0152, elevation: 1200, dhv: 1169,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_146_O", name: "Stauf (O)", region: "Eisenberg",
    lat: 49.5495, lon: 8.0275, elevation: 260, dhv: 146,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_146_SW", name: "Stauf (SW)", region: "Eisenberg",
    lat: 49.5495, lon: 8.0264, elevation: 260, dhv: 146,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_868", name: "Steinbruch Achenbach", region: "Breidenbach",
    lat: 50.8684, lon: 8.4105, elevation: 540, dhv: 868,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_480", name: "Steinbühler Gesenke", region: "Kötzting",
    lat: 49.1731, lon: 12.9513, elevation: 1044, dhv: 480,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_202", name: "Steingrubenberg Südwestseite Übungshang", region: "St. Peter",
    lat: 48.025, lon: 8.0396, elevation: 899, dhv: 202,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_660", name: "Stettberg", region: "Giengen",
    lat: 48.5875, lon: 10.2246, elevation: 502, dhv: 660,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_823", name: "Stettelberg", region: "Bodman-Ludwigshafen",
    lat: 47.8135, lon: 9.0756, elevation: 590, dhv: 823,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_398", name: "Steurer", region: "Balderschwang",
    lat: 47.4745, lon: 10.1082, elevation: 1480, dhv: 398,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_566_N", name: "Stöckerkopf (N)", region: "Baiersbronn",
    lat: 48.4989, lon: 8.3676, elevation: 655, dhv: 566,
    sectors: [[326.25, 11.25]], sectorLabel: "NNW-N", ...DEF },

  { id: "db_566_NO", name: "Stöckerkopf (NO)", region: "Baiersbronn",
    lat: 48.4956, lon: 8.3683, elevation: 740, dhv: 566,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_1184", name: "Stohl", region: "Schwedeneck",
    lat: 54.4772, lon: 10.1504, elevation: 20, dhv: 1184,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_604", name: "Stormbruch - Hinterm Hagen Übungshang", region: "Diemelsee",
    lat: 51.3518, lon: 8.712, elevation: 475, dhv: 604,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2303", name: "Strüther Wald", region: "Hochstetten-Dhaun",
    lat: 49.7928, lon: 7.5123, elevation: 280, dhv: 2303,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_595_NO", name: "Stüppel (NO)", region: "Bestwig",
    lat: 51.3143, lon: 8.4295, elevation: 716, dhv: 595,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_595_NW", name: "Stüppel (NW)", region: "Bestwig",
    lat: 51.314, lon: 8.4291, elevation: 730, dhv: 595,
    sectors: [[258.75, 348.75]], sectorLabel: "W-NNW", ...DEF },

  { id: "db_565_N", name: "Südhang Wasserkuppe (N)", region: "Gersfeld",
    lat: 50.5032, lon: 9.9391, elevation: 905, dhv: 565,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_565_NW", name: "Südhang Wasserkuppe (NW)", region: "Gersfeld",
    lat: 50.4909, lon: 9.9205, elevation: 875, dhv: 565,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_565_S", name: "Südhang Wasserkuppe (S)", region: "Gersfeld",
    lat: 50.4974, lon: 9.9372, elevation: 914, dhv: 565,
    sectors: [[168.75, 213.75]], sectorLabel: "S-SSW", ...DEF },

  { id: "db_565_W", name: "Südhang Wasserkuppe (W)", region: "Gersfeld",
    lat: 50.4968, lon: 9.9312, elevation: 900, dhv: 565,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_328", name: "Sulzberg", region: "Brannenburg",
    lat: 47.7451, lon: 12.0625, elevation: 1050, dhv: 328,
    sectors: [[11.25, 56.25]], sectorLabel: "NNO-NO", ...DEF },

  { id: "db_300", name: "Tafelbühl", region: "Simonswald",
    lat: 48.1278, lon: 8.0838, elevation: 1070, dhv: 300,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2859", name: "Tafelbühl West", region: "Winden",
    lat: 48.1289, lon: 8.0808, elevation: 1020, dhv: 2859,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2381", name: "Tannbankerl Übungshang", region: "Bad Kohlgrub",
    lat: 47.6535, lon: 11.0499, elevation: 1060, dhv: 2381,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1052", name: "Tannschach", region: "Gaggenau",
    lat: 48.8218, lon: 8.4044, elevation: 700, dhv: 1052,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_652", name: "Tauchersreuth", region: "Beerbach",
    lat: 49.5472, lon: 11.2125, elevation: 433, dhv: 652,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1101_NW", name: "Tegelberg (NW)", region: "Schwangau",
    lat: 47.5599, lon: 10.7799, elevation: 1707, dhv: 1101,
    sectors: [[303.75, 326.25], [281.25, 11.25]], sectorLabel: "NW · WNW-N", ...DEF },

  { id: "db_1101_SW", name: "Tegelberg (SW)", region: "Schwangau",
    lat: 47.5681, lon: 10.7803, elevation: 1308, dhv: 1101,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_205", name: "Teufelsberg", region: "Sachsenheim-Hohenhaslach",
    lat: 49.003, lon: 9.0438, elevation: 380, dhv: 205,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_560", name: "Teufelsberg", region: "Berlin-Grunewald",
    lat: 52.5022, lon: 13.247, elevation: 99, dhv: 560,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_238", name: "Thalhäusl Übungshang", region: "Fischbachau",
    lat: 47.7591, lon: 11.9802, elevation: 835, dhv: 238,
    sectors: [[326.25, 11.25]], sectorLabel: "NNW-N", ...DEF },

  { id: "db_774", name: "Tiefenbach Übungshang", region: "Passau",
    lat: 48.6202, lon: 13.381, elevation: 590, dhv: 774,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1033", name: "Tiertalberg", region: "Zellingen-Retzbach",
    lat: 49.8943, lon: 9.8379, elevation: 277, dhv: 1033,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_102", name: "Treisberg", region: "Treisberg",
    lat: 50.2936, lon: 8.4306, elevation: 561, dhv: 102,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5666", name: "Trimburg", region: "Elfershausen",
    lat: 50.1361, lon: 9.9819, elevation: 287, dhv: 5666,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_4571_NO", name: "Tringenstein Übungshang NO (NO)", region: "Siegbach",
    lat: 50.7582, lon: 8.4143, elevation: 496, dhv: 4571,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4571_SW", name: "Tringenstein Übungshang NO (SW)", region: "Siegbach",
    lat: 50.7573, lon: 8.4159, elevation: 484, dhv: 4571,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_206", name: "Türkheim", region: "Geislingen-Türkheim",
    lat: 48.5905, lon: 9.8055, elevation: 676, dhv: 206,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2549", name: "Übungshang Dobel", region: "Dobel",
    lat: 48.7942, lon: 8.5008, elevation: 685, dhv: 2549,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5617", name: "Übungshang Großgstatter", region: "Ruhpolding",
    lat: 47.7466, lon: 12.6388, elevation: 710, dhv: 5617,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1214", name: "Übungshang Hartenstein", region: "Thierfeld",
    lat: 50.678, lon: 12.6797, elevation: 447, dhv: 1214,
    sectors: [[101.25, 191.25]], sectorLabel: "OSO-S", ...DEF },

  { id: "db_2394", name: "Übungshang Ketteläcker", region: "Vöhl",
    lat: 51.221, lon: 8.9278, elevation: 378, dhv: 2394,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_710", name: "Ummerstadt", region: "Bad Colberg",
    lat: 50.2672, lon: 10.7945, elevation: 340, dhv: 710,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_330", name: "Unternberg Bärngschwendt Übungshang", region: "Ruhpolding",
    lat: 47.7433, lon: 12.6303, elevation: 880, dhv: 330,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_336_N", name: "Unternberg Nord (N)", region: "Ruhpolding",
    lat: 47.7283, lon: 12.6383, elevation: 1381, dhv: 336,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_336_S", name: "Unternberg Nord (S)", region: "Ruhpolding",
    lat: 47.7267, lon: 12.6353, elevation: 1369, dhv: 336,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_582", name: "Unterschwarzach", region: "Creußen",
    lat: 49.8616, lon: 11.7139, elevation: 520, dhv: 582,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_392", name: "Urenschwang", region: "Schelklingen-Hütten",
    lat: 48.3678, lon: 9.6368, elevation: 720, dhv: 392,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1223", name: "Urphar", region: "Urphar",
    lat: 49.7414, lon: 9.5646, elevation: 270, dhv: 1223,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5560", name: "V-Tal", region: "Donzdorf",
    lat: 48.7005, lon: 9.8082, elevation: 479, dhv: 5560,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_836", name: "Valwiger Berg (Jeiersberg)", region: "Ernst",
    lat: 50.1491, lon: 7.2265, elevation: 300, dhv: 836,
    sectors: [[168.75, 213.75]], sectorLabel: "S-SSW", ...DEF },

  { id: "db_1218", name: "Veitsberg", region: "Ebensfeld",
    lat: 50.0633, lon: 11.0005, elevation: 458, dhv: 1218,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1198_O", name: "Vogelsang Ost-Startplatz (O)", region: "Bayerischzell",
    lat: 47.6633, lon: 12.0346, elevation: 1558, dhv: 1198,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1198_W", name: "Vogelsang Ost-Startplatz (W)", region: "Bayerischzell",
    lat: 47.6653, lon: 12.0354, elevation: 1558, dhv: 1198,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_973", name: "Vogtmaiers Kanzel", region: "Bad Peterstal-Griesbach",
    lat: 48.4569, lon: 8.2608, elevation: 900, dhv: 973,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_449", name: "Voithenberg", region: "Furth i. Wald",
    lat: 49.3347, lon: 12.7924, elevation: 850, dhv: 449,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3118", name: "Volkspark Lübars", region: "Berlin",
    lat: 52.6106, lon: 13.3685, elevation: 67, dhv: 3118,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1000", name: "Vor der Wesenbach", region: "Odernheim/Glan",
    lat: 49.752, lon: 7.7076, elevation: 240, dhv: 1000,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_786", name: "Voxbrunn Übungshang", region: "Teugn",
    lat: 48.8888, lon: 12.0479, elevation: 410, dhv: 786,
    sectors: [[56.25, 123.75]], sectorLabel: "ONO-OSO", ...DEF },

  { id: "db_26", name: "Wache", region: "Geising",
    lat: 50.7551, lon: 13.7856, elevation: 700, dhv: 26,
    sectors: [[11.25, 78.75]], sectorLabel: "NNO-ONO", ...DEF },

  { id: "db_231", name: "Wachtelberg", region: "Freital",
    lat: 50.9812, lon: 13.6673, elevation: 360, dhv: 231,
    sectors: [[11.25, 78.75]], sectorLabel: "NNO-ONO", ...DEF },

  { id: "db_437", name: "Walberla", region: "Kirchehrenbach",
    lat: 49.7197, lon: 11.1519, elevation: 513, dhv: 437,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2588", name: "Waldems-Esch", region: "Waldems-Esch",
    lat: 50.2472, lon: 8.3246, elevation: 305, dhv: 2588,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_749", name: "Waldstetten/Skihütte", region: "Waldstetten",
    lat: 48.7518, lon: 9.815, elevation: 523, dhv: 749,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_953_N", name: "Wallberg (N)", region: "Rottach-Egern",
    lat: 47.661, lon: 11.7906, elevation: 1604, dhv: 953,
    sectors: [[348.75, 33.75]], sectorLabel: "N-NNO", ...DEF },

  { id: "db_953_NW", name: "Wallberg (NW)", region: "Rottach-Egern",
    lat: 47.6659, lon: 11.7967, elevation: 1720, dhv: 953,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_953_W", name: "Wallberg (W)", region: "Rottach-Egern",
    lat: 47.6638, lon: 11.7949, elevation: 1646, dhv: 953,
    sectors: [[213.75, 11.25]], sectorLabel: "SW-N", ...DEF },

  { id: "db_888", name: "Wanfried - Aue", region: "Wanfried",
    lat: 51.1722, lon: 10.1301, elevation: 345, dhv: 888,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_320_NO", name: "Wank Ost und Nordost-Startplatz (NO)", region: "Garmisch-Partenkirchen",
    lat: 47.5083, lon: 11.1437, elevation: 1780, dhv: 320,
    sectors: [[33.75, 101.25], [33.75, 56.25], [11.25, 101.25]], sectorLabel: "NO-O · NO · NNO-O", ...DEF },

  { id: "db_320_S", name: "Wank Ost und Nordost-Startplatz (S)", region: "Garmisch-Partenkirchen",
    lat: 47.5068, lon: 11.1473, elevation: 1730, dhv: 320,
    sectors: [[78.75, 258.75]], sectorLabel: "O-WSW", ...DEF },

  { id: "db_320_W", name: "Wank Ost und Nordost-Startplatz (W)", region: "Garmisch-Partenkirchen",
    lat: 47.5076, lon: 11.143, elevation: 1760, dhv: 320,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_160", name: "Wanne", region: "Pfullingen",
    lat: 48.4461, lon: 9.2275, elevation: 695, dhv: 160,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3259", name: "Wehingen", region: "Wehingen",
    lat: 49.4555, lon: 6.5034, elevation: 399, dhv: 3259,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_290", name: "Weiherkopf", region: "Münstertal",
    lat: 47.8035, lon: 7.7784, elevation: 1143, dhv: 290,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_396", name: "Weiherkopf / Hörnerbahn", region: "Bolsterlang",
    lat: 47.4652, lon: 10.2013, elevation: 1660, dhv: 396,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_629", name: "Weiherkuppe", region: "Poppenhausen",
    lat: 50.5112, lon: 9.9138, elevation: 720, dhv: 629,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1086", name: "Weikersheim", region: "Weikersheim",
    lat: 49.4832, lon: 9.8884, elevation: 350, dhv: 1086,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_758", name: "Weiler", region: "Weiler",
    lat: 49.8054, lon: 7.567, elevation: 265, dhv: 758,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5738", name: "Weingarten (Unternberg)", region: "Ruhpolding",
    lat: 47.7415, lon: 12.6387, elevation: 127, dhv: 5738,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1158", name: "Weingartshälden", region: "Widdern",
    lat: 49.3242, lon: 9.3996, elevation: 288, dhv: 1158,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1124", name: "Weinkopf", region: "Borken",
    lat: 51.0247, lon: 9.2922, elevation: 298, dhv: 1124,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_4655_SW", name: "Weiskirchen (SW)", region: "Weiskirchen",
    lat: 49.5471, lon: 6.8229, elevation: 362, dhv: 4655,
    sectors: [[168.75, 303.75]], sectorLabel: "S-WNW", ...DEF },

  { id: "db_4655_W", name: "Weiskirchen (W)", region: "Weiskirchen",
    lat: 49.5436, lon: 6.8259, elevation: 360, dhv: 4655,
    sectors: [[236.25, 281.25]], sectorLabel: "WSW-W", ...DEF },

  { id: "db_5828", name: "Weiten Gesäß", region: "Michelstadt",
    lat: 49.693, lon: 9.0439, elevation: 360, dhv: 5828,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_958", name: "Wellen - Auf dem Schleifstein", region: "Edertal",
    lat: 51.1551, lon: 9.1712, elevation: 300, dhv: 958,
    sectors: [[236.25, 258.75]], sectorLabel: "WSW", ...DEF },

  { id: "db_596", name: "Wenholthausen", region: "Eslohe",
    lat: 51.3028, lon: 8.1897, elevation: 571, dhv: 596,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3941", name: "Weyhers - Nordhang", region: "Weyhers",
    lat: 50.4739, lon: 9.7944, elevation: 420, dhv: 3941,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1955", name: "Wichmar Übungshang", region: "Wichmar",
    lat: 51.0423, lon: 11.6913, elevation: 160, dhv: 1955,
    sectors: [[146.25, 258.75]], sectorLabel: "SSO-WSW", ...DEF },

  { id: "db_293", name: "Wieden-Warbach", region: "Wieden",
    lat: 47.8339, lon: 7.8754, elevation: 1000, dhv: 293,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_174", name: "Wiesensteig", region: "Wiesensteig",
    lat: 48.5705, lon: 9.6164, elevation: 590, dhv: 174,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_835", name: "Wildhang Übungshang", region: "Horn - Bad Meinberg",
    lat: 51.875, lon: 8.8958, elevation: 335, dhv: 835,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_227", name: "Willingen-Ettelsberg", region: "Willingen",
    lat: 51.2822, lon: 8.6001, elevation: 798, dhv: 227,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_704", name: "Wilnsdorf-Nord", region: "Wilnsdorf",
    lat: 50.8599, lon: 8.0972, elevation: 355, dhv: 704,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_250", name: "Windberg Übungshang", region: "Bogen",
    lat: 48.9414, lon: 12.7427, elevation: 385, dhv: 250,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_870", name: "Wingertsberg", region: "Bockenau",
    lat: 49.8402, lon: 7.6743, elevation: 380, dhv: 870,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2405", name: "Winterkasten", region: "Lindenfels",
    lat: 49.7019, lon: 8.7963, elevation: 444, dhv: 2405,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_479", name: "Winzerer Höhen", region: "Regensburg- Winzer",
    lat: 49.0354, lon: 12.0565, elevation: 420, dhv: 479,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1011", name: "Winzingen Übungshang", region: "Winzingen",
    lat: 48.7192, lon: 9.8197, elevation: 510, dhv: 1011,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5675", name: "Wirtsberg", region: "Bartholomä",
    lat: 48.7479, lon: 9.9893, elevation: 685, dhv: 5675,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1059", name: "Wittekindsburg", region: "Porta Westfalica",
    lat: 52.2469, lon: 8.8839, elevation: 235, dhv: 1059,
    sectors: [[191.25, 213.75]], sectorLabel: "SSW", ...DEF },

  { id: "db_1003", name: "Wittelsbacher Turm", region: "Bad Kissingen",
    lat: 50.1631, lon: 10.0756, elevation: 385, dhv: 1003,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_295", name: "Wittental", region: "Stegen",
    lat: 47.9903, lon: 7.9577, elevation: 471, dhv: 295,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_116_SO", name: "Wixberg (SO)", region: "Iserlohn",
    lat: 51.3186, lon: 7.6667, elevation: 420, dhv: 116,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_116_W", name: "Wixberg (W)", region: "Iserlohn",
    lat: 51.3267, lon: 7.6634, elevation: 420, dhv: 116,
    sectors: [[236.25, 303.75]], sectorLabel: "WSW-WNW", ...DEF },

  { id: "db_845", name: "Wolfsschlucht Übungshang", region: "Amberg",
    lat: 49.4635, lon: 11.8663, elevation: 430, dhv: 845,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1227", name: "Wolfsteinberg", region: "Neumarkt",
    lat: 49.2908, lon: 11.4916, elevation: 560, dhv: 1227,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_784", name: "Wöllmannsbach Übungshang", region: "Schwandorf",
    lat: 49.2772, lon: 12.0522, elevation: 620, dhv: 784,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_97", name: "Zeltingen-Rachtig", region: "Zeltingen-Rachtig",
    lat: 49.9615, lon: 6.9931, elevation: 260, dhv: 97,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_558", name: "Zopten", region: "Gräfenthal",
    lat: 50.5178, lon: 11.3294, elevation: 640, dhv: 558,
    sectors: [[11.25, 78.75]], sectorLabel: "NNO-ONO", ...DEF },

  { id: "db_879", name: "Zundelberg", region: "Spaichingen",
    lat: 48.0546, lon: 8.7492, elevation: 930, dhv: 879,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  // --- Österreich ---
  { id: "db_1438", name: "Adamsberg", region: "Galtür",
    lat: 46.987, lon: 10.1996, elevation: 2315, dhv: 1438,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1382", name: "Aineck", region: "Sankt Michael im Lungau",
    lat: 47.057, lon: 13.6371, elevation: 2167, dhv: 1382,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1303", name: "Alkus", region: "Ainet",
    lat: 46.8754, lon: 12.7022, elevation: 1309, dhv: 1303,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1383", name: "Almkopf", region: "Bichlbach",
    lat: 47.4155, lon: 10.7659, elevation: 1770, dhv: 1383,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1930", name: "Bella Nova", region: "St. Gallenkirch",
    lat: 46.9855, lon: 9.9647, elevation: 2120, dhv: 1930,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5165", name: "Bergkastel", region: "Nauders",
    lat: 46.853, lon: 10.5442, elevation: 2427, dhv: 5165,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1391_O", name: "Bischling (O)", region: "Werfenweng",
    lat: 47.4641, lon: 13.2991, elevation: 1818, dhv: 1391,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1391_S", name: "Bischling (S)", region: "Werfenweng",
    lat: 47.462, lon: 13.2982, elevation: 1818, dhv: 1391,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1391_SW", name: "Bischling (SW)", region: "Werfenweng",
    lat: 47.4623, lon: 13.2975, elevation: 1817, dhv: 1391,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1943", name: "Buchberg", region: "Mattsee",
    lat: 47.9551, lon: 13.1169, elevation: 689, dhv: 1943,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1371", name: "Bürgeralm", region: "Aflenz",
    lat: 47.5777, lon: 15.2245, elevation: 1742, dhv: 1371,
    sectors: [[168.75, 191.25], [191.25, 213.75]], sectorLabel: "S · SSW", ...DEF },

  { id: "db_1208_N", name: "Choralpe (N)", region: "Westendorf",
    lat: 47.4214, lon: 12.2453, elevation: 1734, dhv: 1208,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1208_NW", name: "Choralpe (NW)", region: "Westendorf",
    lat: 47.4219, lon: 12.2204, elevation: 1036, dhv: 1208,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1208_O", name: "Choralpe (O)", region: "Westendorf",
    lat: 47.4209, lon: 12.2454, elevation: 1742, dhv: 1208,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1208_SW", name: "Choralpe (SW)", region: "Westendorf",
    lat: 47.4188, lon: 12.244, elevation: 1797, dhv: 1208,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1457", name: "Christlum", region: "Achenkirch",
    lat: 47.5041, lon: 11.6617, elevation: 1725, dhv: 1457,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1419", name: "Dachstein", region: "Ramsau",
    lat: 47.4673, lon: 13.6275, elevation: 2593, dhv: 1419,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1219", name: "Diedamskopf", region: "Schoppernau",
    lat: 47.3462, lon: 10.0259, elevation: 2077, dhv: 1219,
    sectors: [[78.75, 281.25], [168.75, 191.25]], sectorLabel: "O-W · S", ...DEF },

  { id: "db_5619", name: "Döbriach", region: "Döbriach",
    lat: 46.7635, lon: 13.6644, elevation: 1050, dhv: 5619,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1393", name: "Einberg", region: "Pichl",
    lat: 47.6174, lon: 13.3607, elevation: 1635, dhv: 1393,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5153", name: "Eitzenberg", region: "Eitzenberg",
    lat: 48.3518, lon: 13.7992, elevation: 448, dhv: 5153,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2117", name: "Elbigenalp Übungshang", region: "Elbigenalp",
    lat: 47.2961, lon: 10.4396, elevation: 1079, dhv: 2117,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1304", name: "Elfer", region: "Neustift",
    lat: 47.0976, lon: 11.3236, elevation: 1827, dhv: 1304,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1305_S", name: "Emberger Alm (S)", region: "Greifenburg",
    lat: 46.7723, lon: 13.1499, elevation: 1735, dhv: 1305,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1305_SO", name: "Emberger Alm (SO)", region: "Greifenburg",
    lat: 46.7769, lon: 13.1496, elevation: 1889, dhv: 1305,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1267", name: "Entscharn", region: "Bramberg",
    lat: 47.2806, lon: 12.3424, elevation: 1137, dhv: 1267,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1415_N", name: "Feuerkogel (N)", region: "Ebensee",
    lat: 47.8165, lon: 13.7194, elevation: 1595, dhv: 1415,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1415_O", name: "Feuerkogel (O)", region: "Ebensee",
    lat: 47.8143, lon: 13.7213, elevation: 1580, dhv: 1415,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1302_SO", name: "Finkenberg (SO)", region: "Finkenberg",
    lat: 47.168, lon: 11.8043, elevation: 2029, dhv: 1302,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1302_SW", name: "Finkenberg (SW)", region: "Finkenberg",
    lat: 47.169, lon: 11.799, elevation: 2074, dhv: 1302,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1944", name: "Fohnsdorf", region: "Fohnsdorf",
    lat: 47.2319, lon: 14.6898, elevation: 1310, dhv: 1944,
    sectors: [[168.75, 236.25], [123.75, 236.25]], sectorLabel: "S-SW · SO-SW", ...DEF },

  { id: "db_1307_O", name: "Fulseck (O)", region: "Dorfgastein",
    lat: 47.2343, lon: 13.148, elevation: 2015, dhv: 1307,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1307_W", name: "Fulseck (W)", region: "Dorfgastein",
    lat: 47.2354, lon: 13.1474, elevation: 1998, dhv: 1307,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1298_N", name: "Gaisberg (N)", region: "Salzburg",
    lat: 47.8049, lon: 13.1139, elevation: 1263, dhv: 1298,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1298_SW", name: "Gaisberg (SW)", region: "Salzburg",
    lat: 47.8032, lon: 13.1097, elevation: 1257, dhv: 1298,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1298_W", name: "Gaisberg (W)", region: "Salzburg",
    lat: 47.8045, lon: 13.1103, elevation: 1256, dhv: 1298,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1334", name: "Gaislachkogel", region: "Sölden",
    lat: 46.9542, lon: 10.9815, elevation: 2306, dhv: 1334,
    sectors: [[33.75, 101.25], [33.75, 56.25]], sectorLabel: "NO-O · NO", ...DEF },

  { id: "db_1912", name: "Gaschurn", region: "St. Gallenkirch",
    lat: 46.9806, lon: 9.9935, elevation: 1971, dhv: 1912,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1512", name: "Gebrenzen", region: "Sankt Lambrecht",
    lat: 47.0388, lon: 14.3315, elevation: 1859, dhv: 1512,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1362", name: "Gelderkogel", region: "Fladnitz",
    lat: 47.3039, lon: 15.4789, elevation: 1130, dhv: 1362,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1372_O", name: "Gemeindealpe (O)", region: "Mitterbach",
    lat: 47.8118, lon: 15.2487, elevation: 1598, dhv: 1372,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1372_S", name: "Gemeindealpe (S)", region: "Mitterbach",
    lat: 47.8108, lon: 15.2472, elevation: 1598, dhv: 1372,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1372_W", name: "Gemeindealpe (W)", region: "Mitterbach",
    lat: 47.812, lon: 15.248, elevation: 1598, dhv: 1372,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1251_S", name: "Gerlitzen (S)", region: "Annenheim",
    lat: 46.6924, lon: 13.9139, elevation: 1897, dhv: 1251,
    sectors: [[123.75, 236.25], [168.75, 236.25]], sectorLabel: "SO-SW · S-SW", ...DEF },

  { id: "db_1251_SO", name: "Gerlitzen (SO)", region: "Annenheim",
    lat: 46.6693, lon: 13.9047, elevation: 1043, dhv: 1251,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1451", name: "Giggijoch", region: "Sölden",
    lat: 46.9792, lon: 10.9755, elevation: 2291, dhv: 1451,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_2112", name: "Goding", region: "Goding",
    lat: 46.7785, lon: 14.921, elevation: 1193, dhv: 2112,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1250_S", name: "Goldeck (S)", region: "Spittal an der Drau",
    lat: 46.7589, lon: 13.4583, elevation: 2132, dhv: 1250,
    sectors: [[146.25, 191.25]], sectorLabel: "SSO-S", ...DEF },

  { id: "db_1250_W", name: "Goldeck (W)", region: "Spittal an der Drau",
    lat: 46.7583, lon: 13.456, elevation: 2106, dhv: 1250,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1462", name: "Golm", region: "Tschagguns",
    lat: 47.0626, lon: 9.8375, elevation: 2068, dhv: 1462,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1444_SO", name: "Golzentipp (SO)", region: "Obertilliach",
    lat: 46.7194, lon: 12.6249, elevation: 2002, dhv: 1444,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1444_SW", name: "Golzentipp (SW)", region: "Obertilliach",
    lat: 46.7253, lon: 12.6226, elevation: 2150, dhv: 1444,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1308", name: "Göriach", region: "Göriach",
    lat: 46.8615, lon: 13.3997, elevation: 1323, dhv: 1308,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2286", name: "Göriach", region: "Göriach",
    lat: 47.207, lon: 13.7813, elevation: 2233, dhv: 2286,
    sectors: [[78.75, 281.25]], sectorLabel: "O-W", ...DEF },

  { id: "db_1306", name: "Greifenburg", region: "Greifenburg",
    lat: 46.7612, lon: 13.2016, elevation: 1068, dhv: 1306,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1513", name: "Greim", region: "St. Peter am Kammersberg",
    lat: 47.2255, lon: 14.1615, elevation: 1741, dhv: 1513,
    sectors: [[78.75, 236.25]], sectorLabel: "O-SW", ...DEF },

  { id: "db_1452", name: "Greit", region: "Pfunds",
    lat: 46.9673, lon: 10.5611, elevation: 1505, dhv: 1452,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1945", name: "Grießenkar", region: "Wagrain",
    lat: 47.3296, lon: 13.3482, elevation: 1808, dhv: 1945,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1366", name: "Große Scheibe", region: "Mürzzuschlag",
    lat: 47.6349, lon: 15.6896, elevation: 1449, dhv: 1366,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1514", name: "Großstübing", region: "Großstübing",
    lat: 47.2082, lon: 15.2259, elevation: 978, dhv: 1514,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1323", name: "Gruberleiten Übungshang", region: "Ramsau am Dachstein",
    lat: 47.4254, lon: 13.667, elevation: 1162, dhv: 1323,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1517_O", name: "Grubigstein (O)", region: "Lermoos",
    lat: 47.3819, lon: 10.8471, elevation: 2038, dhv: 1517,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1517_SO", name: "Grubigstein (SO)", region: "Lermoos",
    lat: 47.3857, lon: 10.8478, elevation: 2060, dhv: 1517,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1414", name: "Grünberg", region: "Gmunden",
    lat: 47.8982, lon: 13.8177, elevation: 957, dhv: 1414,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1332", name: "Gschwandtkopf", region: "Seefeld",
    lat: 47.3154, lon: 11.1786, elevation: 1412, dhv: 1332,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2270", name: "Gugglberg", region: "Zell am Ziller",
    lat: 47.2285, lon: 11.8486, elevation: 1196, dhv: 2270,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2113", name: "Haas", region: "Wolfsberg",
    lat: 46.8398, lon: 14.8852, elevation: 1030, dhv: 2113,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1244_SO", name: "Hahnenkamm (SO)", region: "Reutte",
    lat: 47.4766, lon: 10.6424, elevation: 1850, dhv: 1244,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1244_W", name: "Hahnenkamm (W)", region: "Reutte",
    lat: 47.4764, lon: 10.6408, elevation: 1869, dhv: 1244,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1425_N", name: "Hahnenkamm Kitzbühel (N)", region: "Kitzbühel",
    lat: 47.4266, lon: 12.3709, elevation: 1625, dhv: 1425,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1425_SO", name: "Hahnenkamm Kitzbühel (SO)", region: "Kitzbühel",
    lat: 47.4248, lon: 12.3703, elevation: 1650, dhv: 1425,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5817", name: "Haimburgerberg", region: "",
    lat: 46.7189, lon: 14.6719, elevation: 1060, dhv: 5817,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1331_SO", name: "Härmelekopf (SO)", region: "Seefeld",
    lat: 47.3402, lon: 11.2398, elevation: 2011, dhv: 1331,
    sectors: [[33.75, 236.25]], sectorLabel: "NO-SW", ...DEF },

  { id: "db_1331_W", name: "Härmelekopf (W)", region: "Seefeld",
    lat: 47.3289, lon: 11.2272, elevation: 2011, dhv: 1331,
    sectors: [[213.75, 303.75]], sectorLabel: "SW-WNW", ...DEF },

  { id: "db_2359_O", name: "Harschbichl (O)", region: "St. Johann in Tirol",
    lat: 47.4845, lon: 12.4285, elevation: 1584, dhv: 2359,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2359_W", name: "Harschbichl (W)", region: "St. Johann in Tirol",
    lat: 47.482, lon: 12.4276, elevation: 1580, dhv: 2359,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1324_NO", name: "Hauser Kaibling (NO)", region: "Haus im Ennstal",
    lat: 47.3792, lon: 13.7671, elevation: 1796, dhv: 1324,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1324_W", name: "Hauser Kaibling (W)", region: "Haus im Ennstal",
    lat: 47.3744, lon: 13.7788, elevation: 1982, dhv: 1324,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1375", name: "Herndleck", region: "Ternberg",
    lat: 47.9283, lon: 14.3284, elevation: 1026, dhv: 1375,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_2550", name: "Himmelreich", region: "Sankt Marein im Mürztal",
    lat: 47.5074, lon: 15.3392, elevation: 1169, dhv: 2550,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1460_S", name: "Hinterhornalm (S)", region: "Gnadenwald",
    lat: 47.3345, lon: 11.5651, elevation: 1550, dhv: 1460,
    sectors: [[78.75, 281.25]], sectorLabel: "O-W", ...DEF },

  { id: "db_1460_SO", name: "Hinterhornalm (SO)", region: "Gnadenwald",
    lat: 47.3335, lon: 11.5652, elevation: 1511, dhv: 1460,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1377", name: "Hirschwaldstein", region: "Micheldorf",
    lat: 47.8865, lon: 14.1635, elevation: 939, dhv: 1377,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1949", name: "Hochalm Kirche", region: "Seckau",
    lat: 47.3222, lon: 14.8027, elevation: 1836, dhv: 1949,
    sectors: [[78.75, 281.25], [123.75, 236.25]], sectorLabel: "O-W · SO-SW", ...DEF },

  { id: "db_1458", name: "Hochficht", region: "Schwarzenberg",
    lat: 48.7364, lon: 13.9189, elevation: 1313, dhv: 1458,
    sectors: [[168.75, 326.25]], sectorLabel: "S-NW", ...DEF },

  { id: "db_1456", name: "Hochimst", region: "Hochimst",
    lat: 47.256, lon: 10.6772, elevation: 2021, dhv: 1456,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1461_NW", name: "Hochjoch (NW)", region: "Schruns",
    lat: 47.069, lon: 9.9733, elevation: 2241, dhv: 1461,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1461_SW", name: "Hochjoch (SW)", region: "Schruns",
    lat: 47.0679, lon: 9.973, elevation: 2249, dhv: 1461,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1461_W", name: "Hochjoch (W)", region: "Schruns",
    lat: 47.064, lon: 9.9742, elevation: 2292, dhv: 1461,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2110_N", name: "Hochkar (N)", region: "Göstling",
    lat: 47.7121, lon: 14.9043, elevation: 1753, dhv: 2110,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2110_S", name: "Hochkar (S)", region: "Göstling",
    lat: 47.7102, lon: 14.9095, elevation: 1740, dhv: 2110,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1392", name: "Hochstall", region: "Pichl",
    lat: 47.6113, lon: 13.3839, elevation: 1235, dhv: 1392,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1326", name: "Hochstein", region: "Lienz",
    lat: 46.8184, lon: 12.708, elevation: 1963, dhv: 1326,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1330_N", name: "Hochwurzen (N)", region: "Pichl",
    lat: 47.36, lon: 13.639, elevation: 1812, dhv: 1330,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1330_O", name: "Hochwurzen (O)", region: "Pichl",
    lat: 47.3603, lon: 13.6402, elevation: 1808, dhv: 1330,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1330_W", name: "Hochwurzen (W)", region: "Pichl",
    lat: 47.3588, lon: 13.6395, elevation: 1812, dhv: 1330,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1450_NW", name: "Hochzeiger (NW)", region: "Jerzens",
    lat: 47.1617, lon: 10.786, elevation: 2353, dhv: 1450,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1450_O", name: "Hochzeiger (O)", region: "Jerzens",
    lat: 47.1488, lon: 10.7948, elevation: 2434, dhv: 1450,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1910", name: "Hohe Munde", region: "Telfs",
    lat: 47.345, lon: 11.1049, elevation: 1539, dhv: 1910,
    sectors: [[78.75, 191.25], [123.75, 191.25]], sectorLabel: "O-S · SO-S", ...DEF },

  { id: "db_1309_SO", name: "Hohe Salve (SO)", region: "Söll",
    lat: 47.4642, lon: 12.2025, elevation: 1815, dhv: 1309,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1309_W", name: "Hohe Salve (W)", region: "Söll",
    lat: 47.4653, lon: 12.2031, elevation: 1815, dhv: 1309,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1365_O", name: "Hohe Wand (O)", region: "Maiersdorf",
    lat: 47.8294, lon: 16.0416, elevation: 912, dhv: 1365,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1365_S", name: "Hohe Wand (S)", region: "Maiersdorf",
    lat: 47.8302, lon: 16.0462, elevation: 863, dhv: 1365,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1268", name: "Hollersbach", region: "Hollersbach",
    lat: 47.2652, lon: 12.4274, elevation: 1145, dhv: 1268,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1503_S", name: "Hundsheimer Berg (S)", region: "Hundsheim",
    lat: 48.1225, lon: 16.9363, elevation: 341, dhv: 1503,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1503_SO", name: "Hundsheimer Berg (SO)", region: "Hundsheim",
    lat: 48.1239, lon: 16.9396, elevation: 370, dhv: 1503,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1503_W", name: "Hundsheimer Berg (W)", region: "Hundsheim",
    lat: 48.1234, lon: 16.9351, elevation: 361, dhv: 1503,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1379_N", name: "Hutterer Höß (N)", region: "Hinterstoder",
    lat: 47.6691, lon: 14.1764, elevation: 1792, dhv: 1379,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1379_SW", name: "Hutterer Höß (SW)", region: "Hinterstoder",
    lat: 47.6664, lon: 14.1665, elevation: 1716, dhv: 1379,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1379_W", name: "Hutterer Höß (W)", region: "Hinterstoder",
    lat: 47.665, lon: 14.1702, elevation: 1807, dhv: 1379,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2390", name: "Jocham", region: "Sankt Michael im Lungau",
    lat: 47.1053, lon: 13.6635, elevation: 1324, dhv: 2390,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1435_S", name: "Jöchelspitze (S)", region: "Bach",
    lat: 47.2766, lon: 10.3671, elevation: 1809, dhv: 1435,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1435_SO", name: "Jöchelspitze (SO)", region: "Bach",
    lat: 47.2782, lon: 10.3701, elevation: 1884, dhv: 1435,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1435_SW", name: "Jöchelspitze (SW)", region: "Bach",
    lat: 47.2751, lon: 10.364, elevation: 1763, dhv: 1435,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5166", name: "Kaiserburg", region: "Bad Kleinkirchheim",
    lat: 46.7838, lon: 13.8261, elevation: 2017, dhv: 5166,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1421", name: "Kalmberg", region: "Gosau",
    lat: 47.6124, lon: 13.5675, elevation: 1833, dhv: 1421,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1384", name: "Kapall", region: "St. Anton",
    lat: 47.1483, lon: 10.2482, elevation: 2307, dhv: 1384,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1390", name: "Karkogel", region: "Abtenau",
    lat: 47.5451, lon: 13.3599, elevation: 1189, dhv: 1390,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5151", name: "Kirchschlag", region: "Kirchschlag",
    lat: 48.4071, lon: 14.2813, elevation: 841, dhv: 5151,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1427", name: "Kitzeck", region: "Kitzeck",
    lat: 46.7753, lon: 15.4672, elevation: 471, dhv: 1427,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1380_O", name: "Kleinerberg (O)", region: "Rosenau",
    lat: 47.7337, lon: 14.3671, elevation: 1245, dhv: 1380,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1380_S", name: "Kleinerberg (S)", region: "Rosenau",
    lat: 47.7336, lon: 14.3666, elevation: 1245, dhv: 1380,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1380_W", name: "Kleinerberg (W)", region: "Rosenau",
    lat: 47.7341, lon: 14.3661, elevation: 1245, dhv: 1380,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1453", name: "Kobl", region: "Pfunds",
    lat: 46.972, lon: 10.4956, elevation: 2121, dhv: 1453,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2114", name: "Koralpe", region: "Wolfsberg",
    lat: 46.7933, lon: 14.9516, elevation: 1906, dhv: 2114,
    sectors: [[213.75, 236.25], [213.75, 281.25]], sectorLabel: "SW · SW-W", ...DEF },

  { id: "db_2548", name: "Kramakogel", region: "St. Georgen ob Murau",
    lat: 47.1143, lon: 14.1002, elevation: 1251, dhv: 2548,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5156", name: "Kranzhorn", region: "Erl",
    lat: 47.7002, lon: 12.1859, elevation: 1320, dhv: 5156,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1436_O", name: "Kreuzjoch - Schlick 2000 (O)", region: "Fulpmes",
    lat: 47.1447, lon: 11.3072, elevation: 2098, dhv: 1436,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1436_SO", name: "Kreuzjoch - Schlick 2000 (SO)", region: "Fulpmes",
    lat: 47.1451, lon: 11.3076, elevation: 2098, dhv: 1436,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1385", name: "Kriegerhorn", region: "Lech am Arlberg",
    lat: 47.2141, lon: 10.1158, elevation: 2142, dhv: 1385,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1422", name: "Krippenstein", region: "Obertraun",
    lat: 47.5285, lon: 13.692, elevation: 1976, dhv: 1422,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5155", name: "Kronbauer", region: "Ottsdorf",
    lat: 47.8993, lon: 14.0766, elevation: 870, dhv: 5155,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1364", name: "Kulm", region: "Stubenberg am See",
    lat: 47.2282, lon: 15.7621, elevation: 925, dhv: 1364,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1426", name: "Lärchfilzkogel", region: "Fieberbrunn",
    lat: 47.4431, lon: 12.549, elevation: 1641, dhv: 1426,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1441", name: "Lattenkopf", region: "Ischgl",
    lat: 47.0179, lon: 10.2686, elevation: 2272, dhv: 1441,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1329", name: "Liezen", region: "Liezen",
    lat: 47.582, lon: 14.2321, elevation: 1069, dhv: 1329,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5167", name: "Lippekogel", region: "Brückl",
    lat: 46.7301, lon: 14.4997, elevation: 1001, dhv: 5167,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1416_S", name: "Loser (S)", region: "Altausee",
    lat: 47.6629, lon: 13.7888, elevation: 1700, dhv: 1416,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1416_SO", name: "Loser (SO)", region: "Altausee",
    lat: 47.663, lon: 13.7778, elevation: 1837, dhv: 1416,
    sectors: [[78.75, 191.25], [123.75, 191.25]], sectorLabel: "O-S · SO-S", ...DEF },

  { id: "db_4559", name: "Ludescherberg", region: "Ludesch",
    lat: 47.1971, lon: 9.799, elevation: 896, dhv: 4559,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1313", name: "Markbachjoch", region: "Niederau",
    lat: 47.4258, lon: 12.0704, elevation: 1704, dhv: 1313,
    sectors: [[348.75, 56.25], [348.75, 11.25], [303.75, 11.25]], sectorLabel: "N-NO · N · NW-N", ...DEF },

  { id: "db_1506", name: "Marsbach", region: "Marsbach",
    lat: 48.4629, lon: 13.8173, elevation: 537, dhv: 1506,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1357", name: "Martele", region: "Lainach",
    lat: 46.8803, lon: 12.9422, elevation: 1838, dhv: 1357,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5163", name: "Matrei", region: "Matrei",
    lat: 46.9931, lon: 12.5955, elevation: 2381, dhv: 5163,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1300_O", name: "Melchboden (O)", region: "Schwendau",
    lat: 47.2192, lon: 11.8245, elevation: 2015, dhv: 1300,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1300_S", name: "Melchboden (S)", region: "Schwendau",
    lat: 47.2194, lon: 11.8231, elevation: 2041, dhv: 1300,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1300_SO", name: "Melchboden (SO)", region: "Schwendau",
    lat: 47.2195, lon: 11.8241, elevation: 2037, dhv: 1300,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1369_NW", name: "Messnerin (NW)", region: "Oberort",
    lat: 47.5587, lon: 15.0829, elevation: 1798, dhv: 1369,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1369_S", name: "Messnerin (S)", region: "Oberort",
    lat: 47.5558, lon: 15.0853, elevation: 1695, dhv: 1369,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1314", name: "Michaelerberg", region: "Michaelerberg",
    lat: 47.4114, lon: 13.8937, elevation: 1106, dhv: 1314,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5150", name: "Mitterfeld", region: "Mitterfeld",
    lat: 48.4604, lon: 14.2034, elevation: 763, dhv: 5150,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1909", name: "Mösern", region: "Telfs",
    lat: 47.3139, lon: 11.1402, elevation: 1233, dhv: 1909,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1374_NO", name: "Muckenkogel (NO)", region: "Lilienfeld",
    lat: 47.9865, lon: 15.5994, elevation: 1042, dhv: 1374,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1374_NW", name: "Muckenkogel (NW)", region: "Lilienfeld",
    lat: 47.9852, lon: 15.601, elevation: 1090, dhv: 1374,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1374_S", name: "Muckenkogel (S)", region: "Lilienfeld",
    lat: 47.9713, lon: 15.6101, elevation: 1284, dhv: 1374,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1374_W", name: "Muckenkogel (W)", region: "Lilienfeld",
    lat: 47.9771, lon: 15.6083, elevation: 1220, dhv: 1374,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1440", name: "Mutmanör", region: "Ischgl",
    lat: 47.0304, lon: 10.2778, elevation: 2286, dhv: 1440,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1946", name: "Mutta", region: "Galtür",
    lat: 46.9933, lon: 10.2131, elevation: 2174, dhv: 1946,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2474", name: "Muttenkopf", region: "Gereit",
    lat: 47.0174, lon: 11.3703, elevation: 2607, dhv: 2474,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4444", name: "Nassereith", region: "Nassereith",
    lat: 47.3021, lon: 10.8541, elevation: 902, dhv: 4444,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5164", name: "Nauders", region: "Nauders",
    lat: 46.8853, lon: 10.53, elevation: 2020, dhv: 5164,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1243_O", name: "Neunerköpfle (O)", region: "Tannheim",
    lat: 47.4852, lon: 10.5449, elevation: 1756, dhv: 1243,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1243_W", name: "Neunerköpfle (W)", region: "Tannheim",
    lat: 47.4825, lon: 10.5419, elevation: 1824, dhv: 1243,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1220", name: "Niedere - Andelsbuch", region: "Andelsbuch",
    lat: 47.4035, lon: 9.9385, elevation: 1552, dhv: 1220,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1459", name: "Nordkette", region: "Innsbruck",
    lat: 47.3127, lon: 11.3844, elevation: 2268, dhv: 1459,
    sectors: [[168.75, 191.25], [146.25, 213.75]], sectorLabel: "S · SSO-SSW", ...DEF },

  { id: "db_5152", name: "Oed in Bergen", region: "Oed in Bergen",
    lat: 48.3922, lon: 13.9724, elevation: 505, dhv: 5152,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5145", name: "Oedt", region: "Oedt",
    lat: 48.6043, lon: 14.0482, elevation: 676, dhv: 5145,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1449_SW", name: "Oetz (SW)", region: "Oetz",
    lat: 47.2086, lon: 10.9178, elevation: 1460, dhv: 1449,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1449_W", name: "Oetz (W)", region: "Oetz",
    lat: 47.2087, lon: 10.9352, elevation: 2136, dhv: 1449,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1504", name: "Ötscher", region: "Lackenhof",
    lat: 47.8563, lon: 15.181, elevation: 1440, dhv: 1504,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2361", name: "Patscherkofel", region: "Patsch",
    lat: 47.2087, lon: 11.4607, elevation: 2236, dhv: 2361,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1301", name: "Penken", region: "Mayrhofen",
    lat: 47.1762, lon: 11.8167, elevation: 1975, dhv: 1301,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1299", name: "Perler", region: "Schwendau",
    lat: 47.2003, lon: 11.846, elevation: 1124, dhv: 1299,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1389", name: "Pernegg", region: "Pichl",
    lat: 47.607, lon: 13.3565, elevation: 1038, dhv: 1389,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1509", name: "Petersberg", region: "Sillian",
    lat: 46.7558, lon: 12.4278, elevation: 1327, dhv: 1509,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1500", name: "Petzen", region: "St. Michael ob Bleiburg",
    lat: 46.5188, lon: 14.772, elevation: 1653, dhv: 1500,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5149", name: "Pfarrkirchen", region: "Pfarrkirchen",
    lat: 48.5089, lon: 13.82, elevation: 803, dhv: 5149,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1315_N", name: "Planai (N)", region: "Schladming",
    lat: 47.3814, lon: 13.705, elevation: 1335, dhv: 1315,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1315_NO", name: "Planai (NO)", region: "Schladming",
    lat: 47.3727, lon: 13.7246, elevation: 1821, dhv: 1315,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1315_NW", name: "Planai (NW)", region: "Schladming",
    lat: 47.3718, lon: 13.7241, elevation: 1848, dhv: 1315,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1370_N", name: "Polster (N)", region: "Präbichl",
    lat: 47.5324, lon: 14.961, elevation: 1874, dhv: 1370,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1370_SO", name: "Polster (SO)", region: "Präbichl",
    lat: 47.5323, lon: 14.9616, elevation: 1798, dhv: 1370,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1370_SW", name: "Polster (SW)", region: "Präbichl",
    lat: 47.5324, lon: 14.961, elevation: 1816, dhv: 1370,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1428", name: "Pongratzen", region: "Pongratzen",
    lat: 46.6534, lon: 15.3005, elevation: 876, dhv: 1428,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1507", name: "Prägraten", region: "Prägraten",
    lat: 47.038, lon: 12.3544, elevation: 2554, dhv: 1507,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1437_N", name: "Predigberg (N)", region: "Galtür",
    lat: 46.9648, lon: 10.2161, elevation: 2295, dhv: 1437,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1437_O", name: "Predigberg (O)", region: "Galtür",
    lat: 46.9634, lon: 10.2201, elevation: 2383, dhv: 1437,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1437_SW", name: "Predigberg (SW)", region: "Galtür",
    lat: 46.9632, lon: 10.207, elevation: 2212, dhv: 1437,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1252", name: "Radsberg", region: "Rottenstein",
    lat: 46.5726, lon: 14.4024, elevation: 815, dhv: 1252,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5146", name: "Rampetzreit", region: "Rampetzreit",
    lat: 48.5931, lon: 13.9034, elevation: 654, dhv: 5146,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_2115", name: "Rauchbauer", region: "Wolfsberg",
    lat: 46.8252, lon: 14.9209, elevation: 1318, dhv: 2115,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1367", name: "Rax", region: "Hirschwang an der Rax",
    lat: 47.7134, lon: 15.7624, elevation: 1642, dhv: 1367,
    sectors: [[78.75, 101.25], [78.75, 146.25]], sectorLabel: "O · O-SO", ...DEF },

  { id: "db_5144", name: "Reischlberg", region: "Ulrichsberg",
    lat: 48.7488, lon: 13.9044, elevation: 1260, dhv: 5144,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1940", name: "Reißeck", region: "Reißeck",
    lat: 46.904, lon: 13.3343, elevation: 2260, dhv: 1940,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1948", name: "Reiter Gupf", region: "Nussdorf am Attersee",
    lat: 47.8691, lon: 13.5088, elevation: 820, dhv: 1948,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1418", name: "Reiteralm", region: "Pichl",
    lat: 47.353, lon: 13.5921, elevation: 1965, dhv: 1418,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1319", name: "Riesner Alm", region: "Donnersbachwald",
    lat: 47.3683, lon: 14.0918, elevation: 1788, dhv: 1319,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1417", name: "Rittisberg", region: "Ramsau",
    lat: 47.4195, lon: 13.6142, elevation: 1482, dhv: 1417,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1442", name: "Rofan", region: "Maurach",
    lat: 47.4439, lon: 11.7635, elevation: 1838, dhv: 1442,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2358", name: "Roßkogel", region: "Kramsach",
    lat: 47.4631, lon: 11.8292, elevation: 1759, dhv: 2358,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1358", name: "Rottenstein", region: "Rottenstein",
    lat: 46.7681, lon: 13.2306, elevation: 1291, dhv: 1358,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1821", name: "Sattel", region: "Sillian",
    lat: 46.7215, lon: 12.4079, elevation: 2100, dhv: 1821,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1423", name: "Schafberg", region: "Sankt Gilgen",
    lat: 47.7764, lon: 13.4318, elevation: 1712, dhv: 1423,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1499", name: "Schareck", region: "Heiligenblut",
    lat: 47.0648, lon: 12.8572, elevation: 2533, dhv: 1499,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5154", name: "Schaumberg", region: "Schaumberg",
    lat: 48.3443, lon: 13.9733, elevation: 454, dhv: 5154,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5148", name: "Scheiblberg", region: "Scheiblberg",
    lat: 48.5589, lon: 13.9843, elevation: 627, dhv: 5148,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2111", name: "Schießling", region: "Turnau",
    lat: 47.5704, lon: 15.2895, elevation: 1465, dhv: 2111,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1269_N", name: "Schmittenhöhe (N)", region: "Zell am See",
    lat: 47.3292, lon: 12.7365, elevation: 1942, dhv: 1269,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1269_SO", name: "Schmittenhöhe (SO)", region: "Zell am See",
    lat: 47.3285, lon: 12.7372, elevation: 1942, dhv: 1269,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1378", name: "Schnabelberg", region: "Waidhofen an der Ybbs",
    lat: 47.9388, lon: 14.7381, elevation: 920, dhv: 1378,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1386", name: "Schnifis", region: "Schnifis",
    lat: 47.2283, lon: 9.7395, elevation: 1310, dhv: 1386,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1376", name: "Schoberstein", region: "Ternberg",
    lat: 47.905, lon: 14.3224, elevation: 1215, dhv: 1376,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1361_NW", name: "Schöckel (NW)", region: "St. Radegund",
    lat: 47.1983, lon: 15.46, elevation: 1419, dhv: 1361,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1361_SO", name: "Schöckel (SO)", region: "St. Radegund",
    lat: 47.2011, lon: 15.4756, elevation: 1398, dhv: 1361,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1455_N", name: "Schönjoch (N)", region: "Fiss",
    lat: 47.0784, lon: 10.5985, elevation: 2471, dhv: 1455,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1455_S", name: "Schönjoch (S)", region: "Fiss",
    lat: 47.076, lon: 10.5943, elevation: 2471, dhv: 1455,
    sectors: [[123.75, 236.25], [168.75, 191.25], [146.25, 236.25]], sectorLabel: "SO-SW · S · SSO-SW", ...DEF },

  { id: "db_1497", name: "Schwarzenbach", region: "Schwarzenbach",
    lat: 47.6446, lon: 16.3347, elevation: 464, dhv: 1497,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1447", name: "Seefelder Joch", region: "Seefeld",
    lat: 47.3398, lon: 11.2396, elevation: 2059, dhv: 1447,
    sectors: [[213.75, 56.25]], sectorLabel: "SW-NO", ...DEF },

  { id: "db_1950", name: "Seeleiten", region: "Weyregg am Attersee",
    lat: 47.8627, lon: 13.5726, elevation: 857, dhv: 1950,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1501", name: "Semslach", region: "Semslach",
    lat: 46.9497, lon: 13.1696, elevation: 1315, dhv: 1501,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2287", name: "Singerberg", region: "Ferlach",
    lat: 46.5016, lon: 14.238, elevation: 1426, dhv: 2287,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1368_N", name: "Sonnwendstein (N)", region: "Maria-Schutz",
    lat: 47.6321, lon: 15.8688, elevation: 1246, dhv: 1368,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1368_O", name: "Sonnwendstein (O)", region: "Maria-Schutz",
    lat: 47.6225, lon: 15.8581, elevation: 1482, dhv: 1368,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1368_S", name: "Sonnwendstein (S)", region: "Maria-Schutz",
    lat: 47.6286, lon: 15.8569, elevation: 1474, dhv: 1368,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1381", name: "Speiereck", region: "Sankt Michael im Lungau",
    lat: 47.1273, lon: 13.6247, elevation: 2380, dhv: 1381,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1335_NO", name: "Spieljoch (NO)", region: "Fügen",
    lat: 47.3315, lon: 11.7965, elevation: 1852, dhv: 1335,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1335_SO", name: "Spieljoch (SO)", region: "Fügen",
    lat: 47.3246, lon: 11.7914, elevation: 2047, dhv: 1335,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1498", name: "Spitzerberg Übungshang", region: "Hundsheim",
    lat: 48.1004, lon: 16.9395, elevation: 217, dhv: 1498,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1508", name: "Stalpe", region: "Sillian",
    lat: 46.7574, lon: 12.4172, elevation: 1541, dhv: 1508,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1221_N", name: "Startplatz Bezau Süd (N)", region: "Bezau",
    lat: 47.3996, lon: 9.937, elevation: 1640, dhv: 1221,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1221_S", name: "Startplatz Bezau Süd (S)", region: "Bezau",
    lat: 47.3988, lon: 9.9443, elevation: 1672, dhv: 1221,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1445", name: "Startplatz Ebnerfeld", region: "Lienz",
    lat: 46.8528, lon: 12.7947, elevation: 1397, dhv: 1445,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5800", name: "Startplatz Hochödenbauer", region: "Scheifling",
    lat: 47.1687, lon: 14.3783, elevation: 1240, dhv: 5800,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2362", name: "Startplatz Übungshang Medraz", region: "Fulpmes",
    lat: 47.1478, lon: 11.3416, elevation: 963, dhv: 2362,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1316_N", name: "Stoderzinken (N)", region: "Gröbming",
    lat: 47.4594, lon: 13.8282, elevation: 2028, dhv: 1316,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1316_S", name: "Stoderzinken (S)", region: "Gröbming",
    lat: 47.4575, lon: 13.819, elevation: 1881, dhv: 1316,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1316_SO", name: "Stoderzinken (SO)", region: "Gröbming",
    lat: 47.4588, lon: 13.8277, elevation: 2028, dhv: 1316,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1316_W", name: "Stoderzinken (W)", region: "Gröbming",
    lat: 47.4587, lon: 13.8239, elevation: 1966, dhv: 1316,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1523", name: "Stöfflerberg", region: "Kirchbach",
    lat: 46.6511, lon: 13.1934, elevation: 1131, dhv: 1523,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1317_N", name: "Stubnerkogel (N)", region: "Bad Gastein",
    lat: 47.114, lon: 13.0989, elevation: 2209, dhv: 1317,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1317_O", name: "Stubnerkogel (O)", region: "Bad Gastein",
    lat: 47.1138, lon: 13.0997, elevation: 2242, dhv: 1317,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2355", name: "Sulzberg", region: "Langen bei Bregenz",
    lat: 47.5226, lon: 9.8854, elevation: 804, dhv: 2355,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1363", name: "Teichalm", region: "Teichalm",
    lat: 47.3581, lon: 15.4814, elevation: 1453, dhv: 1363,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1822", name: "Tessenberg", region: "Sillian",
    lat: 46.7647, lon: 12.453, elevation: 1821, dhv: 1822,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1260_S", name: "Thurntaler (S)", region: "Sillian",
    lat: 46.772, lon: 12.3888, elevation: 2333, dhv: 1260,
    sectors: [[78.75, 281.25], [123.75, 236.25]], sectorLabel: "O-W · SO-SW", ...DEF },

  { id: "db_1260_SW", name: "Thurntaler (SW)", region: "Sillian",
    lat: 46.7676, lon: 12.3986, elevation: 2171, dhv: 1260,
    sectors: [[123.75, 326.25]], sectorLabel: "SO-NW", ...DEF },

  { id: "db_1388_S", name: "Trattberg (S)", region: "Golling",
    lat: 47.6375, lon: 13.2689, elevation: 1623, dhv: 1388,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1388_W", name: "Trattberg (W)", region: "Golling",
    lat: 47.6371, lon: 13.2629, elevation: 1519, dhv: 1388,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1249", name: "Tschiernock", region: "Treffling",
    lat: 46.8585, lon: 13.5522, elevation: 1669, dhv: 1249,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1311_N", name: "Unterberghorn (N)", region: "Kössen",
    lat: 47.6263, lon: 12.4359, elevation: 1642, dhv: 1311,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1311_SW", name: "Unterberghorn (SW)", region: "Kössen",
    lat: 47.6312, lon: 12.4311, elevation: 1497, dhv: 1311,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1322_NW", name: "Untersberg (NW)", region: "Fürstenbrunn",
    lat: 47.7221, lon: 13.0076, elevation: 1728, dhv: 1322,
    sectors: [[303.75, 348.75]], sectorLabel: "NW-NNW", ...DEF },

  { id: "db_1322_W", name: "Untersberg (W)", region: "Fürstenbrunn",
    lat: 47.7221, lon: 13.0076, elevation: 1751, dhv: 1322,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2473", name: "Upsspitze", region: "Lermoos",
    lat: 47.431, lon: 10.8726, elevation: 2249, dhv: 2473,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1454_N", name: "Venet (N)", region: "Zams",
    lat: 47.1464, lon: 10.6268, elevation: 2190, dhv: 1454,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1454_NO", name: "Venet (NO)", region: "Zams",
    lat: 47.1468, lon: 10.63, elevation: 2163, dhv: 1454,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_1454_S", name: "Venet (S)", region: "Zams",
    lat: 47.1461, lon: 10.6297, elevation: 2178, dhv: 1454,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1454_W", name: "Venet (W)", region: "Zams",
    lat: 47.1455, lon: 10.625, elevation: 2190, dhv: 1454,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1511", name: "Virgen", region: "Virgen",
    lat: 47.0247, lon: 12.4264, elevation: 2098, dhv: 1511,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1429", name: "Wechtisch", region: "Kohlberg",
    lat: 46.6546, lon: 15.3563, elevation: 704, dhv: 1429,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1952", name: "Weißenbach", region: "Haus im Ennstal",
    lat: 47.4225, lon: 13.7759, elevation: 773, dhv: 1952,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2357_N", name: "Wiedersberger Horn (N)", region: "Alpbach",
    lat: 47.3733, lon: 11.929, elevation: 1797, dhv: 2357,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2357_NO", name: "Wiedersberger Horn (NO)", region: "Alpbach",
    lat: 47.3703, lon: 11.9304, elevation: 1849, dhv: 2357,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2357_NW", name: "Wiedersberger Horn (NW)", region: "Alpbach",
    lat: 47.3693, lon: 11.9289, elevation: 1832, dhv: 2357,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2357_O", name: "Wiedersberger Horn (O)", region: "Alpbach",
    lat: 47.3686, lon: 11.9307, elevation: 1871, dhv: 2357,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1266_S", name: "Wildkogel (S)", region: "Neukirchen",
    lat: 47.2812, lon: 12.2871, elevation: 2117, dhv: 1266,
    sectors: [[168.75, 191.25], [168.75, 236.25]], sectorLabel: "S · S-SW", ...DEF },

  { id: "db_1266_SO", name: "Wildkogel (SO)", region: "Neukirchen",
    lat: 47.2821, lon: 12.2922, elevation: 2091, dhv: 1266,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1266_W", name: "Wildkogel (W)", region: "Neukirchen",
    lat: 47.2802, lon: 12.2798, elevation: 2049, dhv: 1266,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1328", name: "Zettersfeld", region: "Lienz",
    lat: 46.8748, lon: 12.7881, elevation: 2186, dhv: 1328,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1420", name: "Zwieselalm", region: "Gosau",
    lat: 47.5388, lon: 13.477, elevation: 1568, dhv: 1420,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1424", name: "Zwölferhorn", region: "St. Gilgen",
    lat: 47.7427, lon: 13.3518, elevation: 1505, dhv: 1424,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1443_N", name: "Zwölferkopf (N)", region: "Pertisau",
    lat: 47.4275, lon: 11.6964, elevation: 1466, dhv: 1443,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1443_SW", name: "Zwölferkopf (SW)", region: "Pertisau",
    lat: 47.4263, lon: 11.6984, elevation: 1458, dhv: 1443,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1443_W", name: "Zwölferkopf (W)", region: "Pertisau",
    lat: 47.4276, lon: 11.6945, elevation: 1450, dhv: 1443,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  // --- Schweiz ---
  { id: "db_1619", name: "Abendberg", region: "Erlenbach",
    lat: 46.6226, lon: 7.5224, elevation: 1823, dhv: 1619,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1683", name: "Aiguille de Champeys", region: "Vald-D&#039;Illiez",
    lat: 46.2041, lon: 6.8474, elevation: 2016, dhv: 1683,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1616", name: "Albristhubel", region: "Sankt Stephan",
    lat: 46.5117, lon: 7.463, elevation: 2126, dhv: 1616,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1594", name: "Allmenalp", region: "Kandersteg",
    lat: 46.495, lon: 7.6501, elevation: 1812, dhv: 1594,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1620", name: "Alp da la Creusch", region: "Alvaneu",
    lat: 46.706, lon: 9.6421, elevation: 2219, dhv: 1620,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1687", name: "Alp Darlux", region: "Bergün",
    lat: 46.6242, lon: 9.7799, elevation: 2283, dhv: 1687,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5368", name: "Alp Grüm", region: "San Carlo",
    lat: 46.376, lon: 10.0329, elevation: 2185, dhv: 5368,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5362", name: "Alp Grüm Sot", region: "Brusio",
    lat: 46.2575, lon: 10.1518, elevation: 1894, dhv: 5362,
    sectors: [[213.75, 281.25], [213.75, 236.25]], sectorLabel: "SW-W · SW", ...DEF },

  { id: "db_2065", name: "Alp Languard", region: "Pontresina",
    lat: 46.4881, lon: 9.9222, elevation: 2410, dhv: 2065,
    sectors: [[213.75, 236.25], [213.75, 281.25]], sectorLabel: "SW · SW-W", ...DEF },

  { id: "db_2109", name: "Alp Scheidegg", region: "Gibswil-Ried",
    lat: 47.3047, lon: 8.944, elevation: 1209, dhv: 2109,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1621", name: "Alp Stätz", region: "Lenzerheide",
    lat: 46.7563, lon: 9.5164, elevation: 2382, dhv: 1621,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1622", name: "Alpe del Caviano", region: "Mendrisio",
    lat: 45.8778, lon: 9.0079, elevation: 972, dhv: 1622,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2089", name: "Altwisstock", region: "Schänis",
    lat: 47.2108, lon: 9.0684, elevation: 1055, dhv: 2089,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5356", name: "Aminona", region: "Siders",
    lat: 46.3411, lon: 7.5362, elevation: 1809, dhv: 5356,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1582_S", name: "Amisbühl (S)", region: "Interlaken",
    lat: 46.701, lon: 7.8196, elevation: 1316, dhv: 1582,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1582_SO", name: "Amisbühl (SO)", region: "Interlaken",
    lat: 46.7138, lon: 7.8241, elevation: 1572, dhv: 1582,
    sectors: [[123.75, 191.25], [123.75, 146.25]], sectorLabel: "SO-S · SO", ...DEF },

  { id: "db_1400", name: "Arvialp", region: "Kerns",
    lat: 46.8921, lon: 8.3302, elevation: 1794, dhv: 1400,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5367", name: "Aurafreida", region: "San Carlo",
    lat: 46.3729, lon: 10.0924, elevation: 2135, dhv: 5367,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1576", name: "Axalp Skiberg", region: "Brienz",
    lat: 46.7164, lon: 8.0354, elevation: 1593, dhv: 1576,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1623", name: "Bächigalen", region: "Reckingen",
    lat: 46.4877, lon: 8.2274, elevation: 2455, dhv: 1623,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2060", name: "Bärensolspitz", region: "Näfels",
    lat: 47.1002, lon: 8.9964, elevation: 1812, dhv: 2060,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5208", name: "Bärgli", region: "St. Antönien",
    lat: 46.9845, lon: 9.8184, elevation: 2130, dhv: 5208,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2154", name: "Bassa di Nara", region: "Leontica",
    lat: 46.4751, lon: 8.8689, elevation: 2107, dhv: 2154,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5379", name: "Bedöll", region: "Capolago",
    lat: 45.9067, lon: 9.0044, elevation: 1148, dhv: 5379,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1580_NW", name: "Beichlen (NW)", region: "Marbach",
    lat: 46.895, lon: 7.9695, elevation: 1714, dhv: 1580,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1580_SO", name: "Beichlen (SO)", region: "Marbach",
    lat: 46.8972, lon: 7.973, elevation: 1751, dhv: 1580,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5703", name: "Belalp", region: "Naters",
    lat: 46.4029, lon: 7.9653, elevation: 3021, dhv: 5703,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1624", name: "Bellalui", region: "Crans-Montana",
    lat: 46.3443, lon: 7.4859, elevation: 2505, dhv: 1624,
    sectors: [[33.75, 281.25]], sectorLabel: "NO-W", ...DEF },

  { id: "db_1625_NO", name: "Bendolla (NO)", region: "Grimentz",
    lat: 46.1778, lon: 7.5554, elevation: 2226, dhv: 1625,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1625_SO", name: "Bendolla (SO)", region: "Grimentz",
    lat: 46.1845, lon: 7.5591, elevation: 2201, dhv: 1625,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1613", name: "Betelberg", region: "Lenk",
    lat: 46.4344, lon: 7.4138, elevation: 1921, dhv: 1613,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1709", name: "Blauherd", region: "Zermatt",
    lat: 46.0171, lon: 7.7852, elevation: 2554, dhv: 1709,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2052", name: "Blümlisalp", region: "Kandersteg",
    lat: 46.4701, lon: 7.6893, elevation: 2713, dhv: 2052,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2059", name: "Bodenberg", region: "Luchsingen",
    lat: 46.9735, lon: 9.0242, elevation: 1226, dhv: 2059,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5191", name: "Boecourt", region: "Boecourt",
    lat: 47.363, lon: 7.2063, elevation: 913, dhv: 5191,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1614", name: "Bölchen", region: "Eptingen",
    lat: 47.3658, lon: 7.8023, elevation: 989, dhv: 1614,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1397", name: "Bonistock", region: "Melchsee-Frutt",
    lat: 46.7781, lon: 8.2904, elevation: 2158, dhv: 1397,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1632_SO", name: "Bözigenberg (SO)", region: "Biel",
    lat: 47.1745, lon: 7.2938, elevation: 929, dhv: 1632,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1632_SW", name: "Bözigenberg (SW)", region: "Biel",
    lat: 47.17, lon: 7.2753, elevation: 906, dhv: 1632,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5194", name: "Brandberg", region: "Herbetswil",
    lat: 47.2982, lon: 7.5684, elevation: 1018, dhv: 5194,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1280_NW", name: "Brändlen (NW)", region: "Wolfenschießen",
    lat: 46.9049, lon: 8.4097, elevation: 1247, dhv: 1280,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1280_S", name: "Brändlen (S)", region: "Wolfenschießen",
    lat: 46.9026, lon: 8.4099, elevation: 1219, dhv: 1280,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1477_S", name: "Braunwald (S)", region: "Braunwald",
    lat: 46.9596, lon: 8.9874, elevation: 2040, dhv: 1477,
    sectors: [[123.75, 236.25], [146.25, 236.25]], sectorLabel: "SO-SW · SSO-SW", ...DEF },

  { id: "db_1477_SO", name: "Braunwald (SO)", region: "Braunwald",
    lat: 46.9382, lon: 8.998, elevation: 1234, dhv: 1477,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1575", name: "Brienzer Rothorn", region: "Brienz",
    lat: 46.7872, lon: 8.043, elevation: 2268, dhv: 1575,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1673", name: "Bruniswald", region: "Grafenort",
    lat: 46.8643, lon: 8.3965, elevation: 1562, dhv: 1673,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1281_S", name: "Brunni (S)", region: "Engelberg",
    lat: 46.841, lon: 8.415, elevation: 1979, dhv: 1281,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1281_SW", name: "Brunni (SW)", region: "Engelberg",
    lat: 46.8427, lon: 8.4101, elevation: 1857, dhv: 1281,
    sectors: [[213.75, 281.25], [213.75, 236.25]], sectorLabel: "SW-W · SW", ...DEF },

  { id: "db_1568_NO", name: "Brüsti (NO)", region: "Attighausen",
    lat: 46.8438, lon: 8.6062, elevation: 1540, dhv: 1568,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1568_SO", name: "Brüsti (SO)", region: "Attighausen",
    lat: 46.8435, lon: 8.6012, elevation: 1592, dhv: 1568,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1288", name: "Büelen", region: "Grafenort",
    lat: 46.881, lon: 8.3656, elevation: 1095, dhv: 1288,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5751", name: "Bündner Rigi", region: "Ilanz",
    lat: 46.7478, lon: 9.1754, elevation: 1593, dhv: 5751,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1674", name: "Buochser Horn", region: "Dallenwil",
    lat: 46.945, lon: 8.4287, elevation: 1793, dhv: 1674,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1469", name: "Burst", region: "Unterwasser",
    lat: 47.2087, lon: 9.3021, elevation: 1235, dhv: 1469,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1675", name: "Caischavedra", region: "Disentis",
    lat: 46.7077, lon: 8.8094, elevation: 1997, dhv: 1675,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1676", name: "Calandasiten", region: "Chur",
    lat: 46.8928, lon: 9.469, elevation: 2663, dhv: 1676,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2156", name: "Cari", region: "Faido",
    lat: 46.5091, lon: 8.8176, elevation: 2145, dhv: 2156,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1491", name: "Cassons", region: "Flims",
    lat: 46.8789, lon: 9.2661, elevation: 2649, dhv: 1491,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5363", name: "Cavaione", region: "Brusio",
    lat: 46.2506, lon: 10.1135, elevation: 1564, dhv: 5363,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5352", name: "Chalavonaire", region: "Bouveret",
    lat: 46.3662, lon: 6.8554, elevation: 1108, dhv: 5352,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1468_NO", name: "Chäserugg (NO)", region: "Unterwasser",
    lat: 47.155, lon: 9.3136, elevation: 2255, dhv: 1468,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1468_O", name: "Chäserugg (O)", region: "Unterwasser",
    lat: 47.1468, lon: 9.3237, elevation: 2193, dhv: 1468,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1468_W", name: "Chäserugg (W)", region: "Unterwasser",
    lat: 47.1535, lon: 9.3047, elevation: 2304, dhv: 1468,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1628", name: "Chasseral Nord", region: "Villeret",
    lat: 47.1285, lon: 7.0468, elevation: 1550, dhv: 1628,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1627", name: "Chasseral Süd", region: "Nods",
    lat: 47.1266, lon: 7.0472, elevation: 1518, dhv: 1627,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1677", name: "Chaumont", region: "Savagnier",
    lat: 47.0534, lon: 6.9781, elevation: 1123, dhv: 1677,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2087", name: "Chli Amsel", region: "Einsideln",
    lat: 47.0974, lon: 8.743, elevation: 1397, dhv: 2087,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5503", name: "Chli Aubrig", region: "Euthal",
    lat: 47.1071, lon: 8.8605, elevation: 1588, dhv: 5503,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1678", name: "Chou ou Tsou", region: "Saillon",
    lat: 46.1919, lon: 7.161, elevation: 1444, dhv: 1678,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1679", name: "Chulm", region: "Emmetten",
    lat: 46.9457, lon: 8.5509, elevation: 1838, dhv: 1679,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1750", name: "Chutz", region: "Niederbipp",
    lat: 47.2877, lon: 7.6711, elevation: 1106, dhv: 1750,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1742", name: "Cima di Medeglia", region: "Rivera",
    lat: 46.1166, lon: 8.9444, elevation: 841, dhv: 1742,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1680", name: "Cimetta", region: "Locarno",
    lat: 46.1998, lon: 8.7879, elevation: 1616, dhv: 1680,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1681_O", name: "Col de Sorebois (O)", region: "Zinal",
    lat: 46.1481, lon: 7.5869, elevation: 2820, dhv: 1681,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1681_SW", name: "Col de Sorebois (SW)", region: "Zinal",
    lat: 46.1506, lon: 7.5862, elevation: 2882, dhv: 1681,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1629", name: "Corgémont", region: "Corgémont",
    lat: 47.1735, lon: 7.137, elevation: 1103, dhv: 1629,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2068", name: "Corvatsch", region: "Silvaplana",
    lat: 46.4181, lon: 9.8216, elevation: 3289, dhv: 2068,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1490_NO", name: "Crap Sogn Gion (NO)", region: "Flims",
    lat: 46.8347, lon: 9.217, elevation: 2208, dhv: 1490,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1490_SW", name: "Crap Sogn Gion (SW)", region: "Flims",
    lat: 46.8342, lon: 9.2154, elevation: 2203, dhv: 1490,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1684_S", name: "Croix de Coeur (S)", region: "Verbier",
    lat: 46.1216, lon: 7.233, elevation: 2194, dhv: 1684,
    sectors: [[168.75, 191.25], [123.75, 236.25]], sectorLabel: "S · SO-SW", ...DEF },

  { id: "db_1684_SO", name: "Croix de Coeur (SO)", region: "Verbier",
    lat: 46.1208, lon: 7.2286, elevation: 2165, dhv: 1684,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1686", name: "Croix de L'Aiguille", region: "Verbier",
    lat: 46.1963, lon: 6.8607, elevation: 1825, dhv: 1686,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1905", name: "Cry d'Er", region: "Crans-Montana",
    lat: 46.334, lon: 7.4783, elevation: 2230, dhv: 1905,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2077_S", name: "Cugieri (S)", region: "Sedrun",
    lat: 46.6897, lon: 8.7795, elevation: 1824, dhv: 2077,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2077_SW", name: "Cugieri (SW)", region: "Sedrun",
    lat: 46.6934, lon: 8.7825, elevation: 1992, dhv: 2077,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1610", name: "Danielsweid", region: "Zweisimmen",
    lat: 46.5581, lon: 7.4008, elevation: 1345, dhv: 1610,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2269", name: "Dent de Vaulion", region: "Vallorbe",
    lat: 46.6842, lon: 6.3508, elevation: 1480, dhv: 2269,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2070_NW", name: "Diavolezza (NW)", region: "Pontresina",
    lat: 46.4127, lon: 9.9649, elevation: 2995, dhv: 2070,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_2070_W", name: "Diavolezza (W)", region: "Pontresina",
    lat: 46.4127, lon: 9.9649, elevation: 2974, dhv: 2070,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5506_NO", name: "Dossen (NO)", region: "Vitznau",
    lat: 47.0271, lon: 8.4986, elevation: 1681, dhv: 5506,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5506_SW", name: "Dossen (SW)", region: "Vitznau",
    lat: 47.0254, lon: 8.4997, elevation: 1665, dhv: 5506,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2072", name: "Dreibündenstein", region: "Chur",
    lat: 46.8048, lon: 9.4953, elevation: 2169, dhv: 2072,
    sectors: [[168.75, 326.25]], sectorLabel: "S-NW", ...DEF },

  { id: "db_2090", name: "Durschlegi", region: "Amden",
    lat: 47.1461, lon: 9.1192, elevation: 1118, dhv: 2090,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1246_N", name: "Ebenalp (N)", region: "Schwende",
    lat: 47.2849, lon: 9.4116, elevation: 1594, dhv: 1246,
    sectors: [[303.75, 56.25], [303.75, 11.25]], sectorLabel: "NW-NO · NW-N", ...DEF },

  { id: "db_1246_O", name: "Ebenalp (O)", region: "Schwende",
    lat: 47.2833, lon: 9.413, elevation: 1603, dhv: 1246,
    sectors: [[33.75, 191.25]], sectorLabel: "NO-S", ...DEF },

  { id: "db_1410", name: "Egelstock", region: "Seewen",
    lat: 47.0576, lon: 8.6451, elevation: 1297, dhv: 1410,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1282_NW", name: "Eggbergen (NW)", region: "Flüelen",
    lat: 46.9037, lon: 8.6518, elevation: 1592, dhv: 1282,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1282_W", name: "Eggbergen (W)", region: "Flüelen",
    lat: 46.9042, lon: 8.6437, elevation: 1428, dhv: 1282,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1617", name: "Eggli", region: "Gstaad",
    lat: 46.4632, lon: 7.2664, elevation: 1545, dhv: 1617,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2081", name: "Einsiedeln", region: "Euthal",
    lat: 47.0936, lon: 8.823, elevation: 977, dhv: 2081,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1290_S", name: "Elm (S)", region: "Elm",
    lat: 46.9328, lon: 9.1308, elevation: 2083, dhv: 1290,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1290_SO", name: "Elm (SO)", region: "Elm",
    lat: 46.9334, lon: 9.1331, elevation: 2097, dhv: 1290,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5360", name: "En Curnaux", region: "Villars-sur-Ollon",
    lat: 46.2964, lon: 7.023, elevation: 1123, dhv: 5360,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1599_NW", name: "Engstligenalp (NW)", region: "Adelboden",
    lat: 46.4488, lon: 7.5644, elevation: 1962, dhv: 1599,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1599_W", name: "Engstligenalp (W)", region: "Adelboden",
    lat: 46.4476, lon: 7.5756, elevation: 2194, dhv: 1599,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5376", name: "Evolene", region: "Evolene",
    lat: 46.1224, lon: 7.5158, elevation: 2419, dhv: 5376,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1690", name: "Falera", region: "Falera",
    lat: 46.7987, lon: 9.2305, elevation: 1171, dhv: 1690,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2050", name: "Falkenflue", region: "Brenzikhofen",
    lat: 46.8241, lon: 7.6367, elevation: 1002, dhv: 2050,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1292_SO", name: "Fanas (SO)", region: "Grüsch",
    lat: 47.0004, lon: 9.6841, elevation: 1793, dhv: 1292,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1292_SW", name: "Fanas (SW)", region: "Grüsch",
    lat: 47.0118, lon: 9.6977, elevation: 2294, dhv: 1292,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1691_N", name: "Farneren (N)", region: "Schüpfheim",
    lat: 46.935, lon: 8.0434, elevation: 1544, dhv: 1691,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1691_S", name: "Farneren (S)", region: "Schüpfheim",
    lat: 46.9292, lon: 8.0333, elevation: 1510, dhv: 1691,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1489_S", name: "Feldis (S)", region: "Feldis",
    lat: 46.7963, lon: 9.4558, elevation: 1965, dhv: 1489,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1489_SW", name: "Feldis (SW)", region: "Feldis",
    lat: 46.795, lon: 9.4288, elevation: 1441, dhv: 1489,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5702", name: "Fiescheralp", region: "Fiesch",
    lat: 46.4157, lon: 8.1059, elevation: 2238, dhv: 5702,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1585", name: "First", region: "Grindelwald",
    lat: 46.6574, lon: 8.0551, elevation: 2123, dhv: 1585,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5209", name: "Fisetenpass", region: "Spiringen",
    lat: 46.8858, lon: 8.9349, elevation: 2051, dhv: 5209,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1692", name: "Flöschhorn", region: "Lenk",
    lat: 46.4633, lon: 7.406, elevation: 2069, dhv: 1692,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_5707", name: "Forstberg", region: "Hoch-Ybrig",
    lat: 47.0016, lon: 8.8224, elevation: 2168, dhv: 5707,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5355", name: "Frassette", region: "Vionnaz",
    lat: 46.3207, lon: 6.8678, elevation: 1301, dhv: 5355,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1476", name: "Fronalp", region: "Mollis",
    lat: 47.0724, lon: 9.0912, elevation: 1343, dhv: 1476,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1406_NO", name: "Fronalpstock (NO)", region: "Brunnen",
    lat: 46.9689, lon: 8.6375, elevation: 1907, dhv: 1406,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1406_NW", name: "Fronalpstock (NW)", region: "Brunnen",
    lat: 46.9728, lon: 8.637, elevation: 1907, dhv: 1406,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1406_SO", name: "Fronalpstock (SO)", region: "Brunnen",
    lat: 46.9649, lon: 8.6396, elevation: 1907, dhv: 1406,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1283", name: "Fürenalp", region: "Engelberg",
    lat: 46.8057, lon: 8.4657, elevation: 1923, dhv: 1283,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1696", name: "Galfera", region: "Fiesch",
    lat: 46.4046, lon: 8.0952, elevation: 2172, dhv: 1696,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1700", name: "Galm", region: "Schwenden",
    lat: 46.5447, lon: 7.5189, elevation: 2006, dhv: 1700,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1701", name: "Garmil", region: "Wangs",
    lat: 47.0079, lon: 9.4007, elevation: 1857, dhv: 1701,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1702", name: "Gemsstock", region: "Andermatt",
    lat: 46.6043, lon: 8.612, elevation: 2853, dhv: 1702,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1564", name: "Gitschenberg", region: "Seedorf",
    lat: 46.8774, lon: 8.5904, elevation: 1364, dhv: 1564,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2475", name: "Gitschenen", region: "Isenthal - St. Jakob",
    lat: 46.9024, lon: 8.5045, elevation: 1580, dhv: 2475,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2155", name: "Gorda", region: "Dangio-Torre",
    lat: 46.4977, lon: 8.9109, elevation: 1799, dhv: 2155,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1916", name: "Göschenenalpsee", region: "Göschenen",
    lat: 46.6474, lon: 8.498, elevation: 1795, dhv: 1916,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1483_N", name: "Gotschnagrat (N)", region: "Klosters",
    lat: 46.8587, lon: 9.8455, elevation: 2278, dhv: 1483,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1483_SO", name: "Gotschnagrat (SO)", region: "Klosters",
    lat: 46.8563, lon: 9.8496, elevation: 2238, dhv: 1483,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1703", name: "Gotterli", region: "Lauerz",
    lat: 47.0122, lon: 8.578, elevation: 1361, dhv: 1703,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2106", name: "Gottschalkenberg", region: "Hütten",
    lat: 47.1575, lon: 8.6485, elevation: 1162, dhv: 2106,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2079", name: "Graitery", region: "Moutier",
    lat: 47.2567, lon: 7.3751, elevation: 1193, dhv: 2079,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1704", name: "Greicheralp", region: "Mörel",
    lat: 46.3771, lon: 8.0305, elevation: 1905, dhv: 1704,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1633", name: "Grenchenberg Bützen", region: "Bettlach",
    lat: 47.2226, lon: 7.3917, elevation: 1260, dhv: 1633,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1634", name: "Grenchenberg Nord", region: "Court",
    lat: 47.2298, lon: 7.38, elevation: 1329, dhv: 1634,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1597", name: "Grimer", region: "Frutigen",
    lat: 46.5537, lon: 7.6824, elevation: 1617, dhv: 1597,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1473", name: "Gschwänd", region: "Galgenen",
    lat: 47.1558, lon: 8.8718, elevation: 1064, dhv: 1473,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1718", name: "Gündlischwand-Iselten", region: "Gündlischwand",
    lat: 46.6561, lon: 7.9224, elevation: 1828, dhv: 1718,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1711", name: "Gürgaletsch", region: "Prapan",
    lat: 46.7952, lon: 9.5823, elevation: 2410, dhv: 1711,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2056", name: "Gurli", region: "Plaffeien",
    lat: 46.7135, lon: 7.2828, elevation: 1415, dhv: 2056,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1712", name: "Gurschenalp", region: "Andermatt",
    lat: 46.617, lon: 8.5969, elevation: 2278, dhv: 1712,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1713", name: "Gütsch", region: "Andermatt",
    lat: 46.6481, lon: 8.6102, elevation: 2086, dhv: 1713,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1409", name: "Haggenegg", region: "Seewen",
    lat: 47.0547, lon: 8.6823, elevation: 1479, dhv: 1409,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1578", name: "Hagleren", region: "Sörenberg",
    lat: 46.8362, lon: 8.0426, elevation: 1936, dhv: 1578,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1296", name: "Haldi", region: "Schattdorf",
    lat: 46.8614, lon: 8.6765, elevation: 1152, dhv: 1296,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1403", name: "Haldigrat", region: "Wolfenschießen",
    lat: 46.9024, lon: 8.4406, elevation: 1968, dhv: 1403,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2084", name: "Halsegg", region: "Sattel",
    lat: 47.0912, lon: 8.6071, elevation: 1332, dhv: 2084,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1749", name: "Hamenberg - Rudolfingen", region: "Rudolfingen",
    lat: 47.6436, lon: 8.671, elevation: 485, dhv: 1749,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1635", name: "Hasenmatt", region: "Oberdorf",
    lat: 47.2421, lon: 7.4515, elevation: 1434, dhv: 1635,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1714", name: "Haute-Nendaz", region: "Nendaz",
    lat: 46.162, lon: 7.2837, elevation: 2183, dhv: 1714,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1697", name: "Heimat", region: "Fiesch",
    lat: 46.4146, lon: 8.1085, elevation: 2142, dhv: 1697,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1404", name: "Herlisberg", region: "Beromünster",
    lat: 47.1982, lon: 8.2327, elevation: 714, dhv: 1404,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2061", name: "Hirzli", region: "Biederurnen",
    lat: 47.1342, lon: 9.0076, elevation: 1611, dhv: 2061,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1493", name: "Hitzeggen", region: "Mundaun-Obersaxen",
    lat: 46.736, lon: 9.1436, elevation: 2108, dhv: 1493,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1560", name: "Hoch-Ybrig", region: "Hoch-Ybrig",
    lat: 46.9996, lon: 8.8011, elevation: 1864, dhv: 1560,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5509", name: "Hochflue", region: "Gersau",
    lat: 47.0111, lon: 8.5576, elevation: 1541, dhv: 5509,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5492", name: "Hochhamm", region: "Schönengrund",
    lat: 47.3171, lon: 9.2451, elevation: 1271, dhv: 5492,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2051", name: "Hochstollen", region: "Meiringen",
    lat: 46.7733, lon: 8.2383, elevation: 2464, dhv: 2051,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1408", name: "Hochstuckli", region: "Seewen",
    lat: 47.0576, lon: 8.6697, elevation: 1556, dhv: 1408,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1717", name: "Hockenhorngrat", region: "Wiler",
    lat: 46.4267, lon: 7.748, elevation: 3038, dhv: 1717,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1574", name: "Hofstetter Gummen", region: "Brienz",
    lat: 46.7791, lon: 8.0713, elevation: 1569, dhv: 1574,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1247_O", name: "Hoher Kasten (O)", region: "Brüslisau",
    lat: 47.2878, lon: 9.488, elevation: 1717, dhv: 1247,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1247_W", name: "Hoher Kasten (W)", region: "Brüslisau",
    lat: 47.2857, lon: 9.4861, elevation: 1686, dhv: 1247,
    sectors: [[258.75, 303.75]], sectorLabel: "W-WNW", ...DEF },

  { id: "db_5239_N", name: "Hohmattli (N)", region: "Schwarzsee",
    lat: 46.6693, lon: 7.3181, elevation: 1773, dhv: 5239,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5239_W", name: "Hohmattli (W)", region: "Schwarzsee",
    lat: 46.6609, lon: 7.3162, elevation: 1696, dhv: 5239,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2370", name: "Hohwacht", region: "Reigoldswil",
    lat: 47.3764, lon: 7.6736, elevation: 1041, dhv: 2370,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1606", name: "Horneggli", region: "Gstaad",
    lat: 46.4876, lon: 7.3114, elevation: 1804, dhv: 1606,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1608", name: "Hügeligrat", region: "Gstaad",
    lat: 46.5197, lon: 7.2665, elevation: 1886, dhv: 1608,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2082", name: "Hummel", region: "Gross",
    lat: 47.0983, lon: 8.7724, elevation: 1333, dhv: 2082,
    sectors: [[348.75, 11.25], [348.75, 56.25]], sectorLabel: "N · N-NO", ...DEF },

  { id: "db_1615", name: "Hundwiler Höhi", region: "Jakobsbad",
    lat: 47.3407, lon: 9.3332, elevation: 1297, dhv: 1615,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1471", name: "Hüsli Berneck", region: "Berneck",
    lat: 47.4297, lon: 9.5962, elevation: 749, dhv: 1471,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1474", name: "Hüsliberg", region: "Schänis",
    lat: 47.1897, lon: 9.0746, elevation: 1005, dhv: 1474,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1395", name: "Hüttstett", region: "Lungern",
    lat: 46.7879, lon: 8.1945, elevation: 1662, dhv: 1395,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1601", name: "Huus", region: "Erlenbach",
    lat: 46.6771, lon: 7.5362, elevation: 1546, dhv: 1601,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5348", name: "Isenau", region: "Les Diablerets",
    lat: 46.3765, lon: 7.1945, elevation: 2100, dhv: 5348,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1481_N", name: "Jakobshorn (N)", region: "Davos",
    lat: 46.7811, lon: 9.8488, elevation: 2467, dhv: 1481,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1481_SW", name: "Jakobshorn (SW)", region: "Davos",
    lat: 46.7662, lon: 9.8511, elevation: 2499, dhv: 1481,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1481_W", name: "Jakobshorn (W)", region: "Davos",
    lat: 46.7728, lon: 9.8461, elevation: 2525, dhv: 1481,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1766", name: "Jaman", region: "Villeneuve",
    lat: 46.4417, lon: 6.9762, elevation: 1751, dhv: 1766,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2104", name: "Jeizinen", region: "Gampel",
    lat: 46.3307, lon: 7.7299, elevation: 1637, dhv: 2104,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1719", name: "Jungfraujoch", region: "Lauterbrunnen",
    lat: 46.5473, lon: 7.9781, elevation: 3485, dhv: 1719,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1720", name: "Käserstatt", region: "Meiringen",
    lat: 46.7571, lon: 8.2182, elevation: 1820, dhv: 1720,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1475", name: "Kerenzerberg", region: "Mollis",
    lat: 47.1099, lon: 9.0846, elevation: 664, dhv: 1475,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5198", name: "Kistleralp", region: "Buttikon",
    lat: 47.1554, lon: 8.9589, elevation: 1075, dhv: 5198,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1721", name: "Klein Sternen", region: "Unteriberg",
    lat: 46.9989, lon: 8.7969, elevation: 1826, dhv: 1721,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1707", name: "Kleines Matterhorn", region: "Zermatt",
    lat: 45.9367, lon: 7.7294, elevation: 3806, dhv: 1707,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1405", name: "Klewenalp", region: "Beckenried",
    lat: 46.9402, lon: 8.476, elevation: 1594, dhv: 1405,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_2083", name: "Klingenstock", region: "Stoos",
    lat: 46.9571, lon: 8.6765, elevation: 1918, dhv: 2083,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1248_N", name: "Kronberg (N)", region: "Jakobsbad",
    lat: 47.2915, lon: 9.3285, elevation: 1639, dhv: 1248,
    sectors: [[303.75, 56.25], [303.75, 11.25]], sectorLabel: "NW-NO · NW-N", ...DEF },

  { id: "db_1248_S", name: "Kronberg (S)", region: "Jakobsbad",
    lat: 47.2912, lon: 9.3288, elevation: 1649, dhv: 1248,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1248_W", name: "Kronberg (W)", region: "Jakobsbad",
    lat: 47.2915, lon: 9.3268, elevation: 1635, dhv: 1248,
    sectors: [[258.75, 303.75]], sectorLabel: "W-WNW", ...DEF },

  { id: "db_1722", name: "Kühboden", region: "Fiesch",
    lat: 46.4113, lon: 8.1028, elevation: 2187, dhv: 1722,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5310", name: "Kuonisbergli", region: "Adelboden",
    lat: 46.4731, lon: 7.5472, elevation: 1719, dhv: 5310,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5345", name: "La Barilette", region: "La Rippe",
    lat: 46.4295, lon: 6.1321, elevation: 1420, dhv: 5345,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1626", name: "La Berneuse", region: "Leysin",
    lat: 46.3592, lon: 7.0025, elevation: 2036, dhv: 1626,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5377", name: "La Breya", region: "Orsieres",
    lat: 46.0203, lon: 7.1018, elevation: 2198, dhv: 5377,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5374", name: "La Caux Anteme", region: "Champery",
    lat: 46.1654, lon: 6.8861, elevation: 1744, dhv: 5374,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1723", name: "La Cotelette", region: "Baulmes",
    lat: 46.7798, lon: 6.4858, elevation: 1266, dhv: 1723,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5346", name: "La Dole", region: "Gingins",
    lat: 46.4274, lon: 6.1016, elevation: 1659, dhv: 5346,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1724", name: "La Jorette", region: "Vionnaz",
    lat: 46.3046, lon: 6.8572, elevation: 1601, dhv: 1724,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1736", name: "La Loutze", region: "Leytron",
    lat: 46.213, lon: 7.1646, elevation: 1784, dhv: 1736,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2053", name: "La Montagnette", region: "Chateau-d&#039;Oex",
    lat: 46.447, lon: 7.1471, elevation: 1666, dhv: 2053,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2067", name: "La Punt", region: "La Punt-Chamues-ch",
    lat: 46.5902, lon: 9.9098, elevation: 2409, dhv: 2067,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1725", name: "La Robella", region: "Buttes",
    lat: 46.8729, lon: 6.5494, elevation: 1358, dhv: 1725,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1726", name: "La Roche", region: "St-Aubin-Sauges",
    lat: 46.927, lon: 6.7472, elevation: 1384, dhv: 1726,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1695_S", name: "La Tournelle (S)", region: "Verbier",
    lat: 46.1197, lon: 7.2099, elevation: 2360, dhv: 1695,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1695_SO", name: "La Tournelle (SO)", region: "Verbier",
    lat: 46.1217, lon: 7.2122, elevation: 2357, dhv: 1695,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5361", name: "La Truche", region: "Villars-sur-Ollon",
    lat: 46.3069, lon: 7.0313, elevation: 1415, dhv: 5361,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1604_O", name: "La Videmanette (O)", region: "Rougemont",
    lat: 46.4598, lon: 7.2052, elevation: 2147, dhv: 1604,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1604_SW", name: "La Videmanette (SW)", region: "Rougemont",
    lat: 46.4548, lon: 7.1991, elevation: 2131, dhv: 1604,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2054", name: "La Vudalla", region: "Moleson",
    lat: 46.5509, lon: 7.0455, elevation: 1609, dhv: 2054,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2073", name: "Ladir", region: "Falera",
    lat: 46.7927, lon: 9.2102, elevation: 1271, dhv: 2073,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1565_S", name: "Lai Alv (S)", region: "Disentis",
    lat: 46.7114, lon: 8.789, elevation: 2469, dhv: 1565,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1565_W", name: "Lai Alv (W)", region: "Disentis",
    lat: 46.7095, lon: 8.7881, elevation: 2480, dhv: 1565,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1964", name: "Laucheralp", region: "Wiler",
    lat: 46.4107, lon: 7.7711, elevation: 1981, dhv: 1964,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2367", name: "Laupersdörfer Stierenberg", region: "Laupersdorf",
    lat: 47.332, lon: 7.6449, elevation: 1051, dhv: 2367,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1730", name: "Le Chamossaire", region: "Villars Sur Ollon",
    lat: 46.3257, lon: 7.0623, elevation: 2062, dhv: 1730,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1735", name: "Le Levanchy", region: "Grandvillard",
    lat: 46.5455, lon: 7.113, elevation: 1358, dhv: 1735,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1732", name: "Le Suchet", region: "Baulmes",
    lat: 46.7724, lon: 6.4665, elevation: 1583, dhv: 1732,
    sectors: [[11.25, 11.25]], sectorLabel: "NNO-N", ...DEF },

  { id: "db_5358", name: "Leiggern", region: "Baltschieder",
    lat: 46.3269, lon: 7.8377, elevation: 1634, dhv: 5358,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1694", name: "Les Attelas", region: "Verbier",
    lat: 46.1003, lon: 7.2669, elevation: 2672, dhv: 1694,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5372_SO", name: "Les Crosets (SO)", region: "Champery",
    lat: 46.1908, lon: 6.8279, elevation: 2025, dhv: 5372,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5372_W", name: "Les Crosets (W)", region: "Champery",
    lat: 46.191, lon: 6.8158, elevation: 2266, dhv: 5372,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1733", name: "Les Diablerets", region: "Les Diablerets",
    lat: 46.325, lon: 7.2073, elevation: 2872, dhv: 1733,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1727_S", name: "Les Pleiades (S)", region: "Blonay",
    lat: 46.4788, lon: 6.9106, elevation: 1268, dhv: 1727,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1727_W", name: "Les Pleiades (W)", region: "Blonay",
    lat: 46.4831, lon: 6.9072, elevation: 1358, dhv: 1727,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1734", name: "Les Rodoments", region: "Rougemont",
    lat: 46.5057, lon: 7.2215, elevation: 1792, dhv: 1734,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5375", name: "Les Vernays", region: "Bex",
    lat: 46.247, lon: 7.0468, elevation: 1178, dhv: 5375,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2058", name: "Leuggelstock", region: "Luchsingen",
    lat: 46.985, lon: 9.0282, elevation: 1646, dhv: 2058,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1398", name: "Linderenalp", region: "Sarnen",
    lat: 46.8705, lon: 8.2971, elevation: 1541, dhv: 1398,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1583", name: "Luegibrüggli", region: "Interlaken",
    lat: 46.6912, lon: 7.816, elevation: 1064, dhv: 1583,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2655", name: "Lutersee", region: "Wolfenschießen",
    lat: 46.856, lon: 8.3441, elevation: 1382, dhv: 2655,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1596", name: "Mäggisseren", region: "Frutigen",
    lat: 46.5881, lon: 7.6093, elevation: 1738, dhv: 1596,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5347", name: "Malvaglia", region: "Malvaglia",
    lat: 46.4258, lon: 8.9969, elevation: 1519, dhv: 5347,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1589", name: "Männlichen", region: "Lauterbrunn",
    lat: 46.6164, lon: 7.9388, elevation: 2283, dhv: 1589,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1579_NW", name: "Marbachegg (NW)", region: "Marbach",
    lat: 46.8347, lon: 7.9047, elevation: 1479, dhv: 1579,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1579_SO", name: "Marbachegg (SO)", region: "Marbach",
    lat: 46.8325, lon: 7.9029, elevation: 1461, dhv: 1579,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5349", name: "Marnex", region: "Les Diablerets",
    lat: 46.3679, lon: 7.1544, elevation: 1738, dhv: 5349,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1562", name: "Maschgenkamm", region: "Flums",
    lat: 47.0695, lon: 9.2521, elevation: 1991, dhv: 1562,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2103", name: "Mauborget", region: "Fontaines-sur-Grandson",
    lat: 46.854, lon: 6.612, elevation: 1176, dhv: 2103,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5353", name: "Mayen", region: "Vionnaz",
    lat: 46.3143, lon: 6.8836, elevation: 890, dhv: 5353,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5350", name: "Meilleret", region: "Les Diablerets",
    lat: 46.3345, lon: 7.1205, elevation: 1945, dhv: 5350,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1396", name: "Melchsee-Frutt", region: "Melchsee-Frutt",
    lat: 46.7786, lon: 8.2688, elevation: 1900, dhv: 1396,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1602", name: "Mentschelenalp", region: "Pohlern",
    lat: 46.7155, lon: 7.51, elevation: 1394, dhv: 1602,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1612", name: "Metsch", region: "Lenk",
    lat: 46.4435, lon: 7.4966, elevation: 2094, dhv: 1612,
    sectors: [[213.75, 236.25], [168.75, 326.25]], sectorLabel: "SW · S-NW", ...DEF },

  { id: "db_2097", name: "Mettenen", region: "Unterschächen",
    lat: 46.8802, lon: 8.7814, elevation: 1815, dhv: 2097,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2268", name: "Mont des Cerfs", region: "Auberson",
    lat: 46.8124, lon: 6.477, elevation: 1227, dhv: 2268,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2055", name: "Mont Moleson", region: "Moleson",
    lat: 46.5488, lon: 7.017, elevation: 1994, dhv: 2055,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_5192", name: "Mont Raimeux Nord", region: "Rebevellier",
    lat: 47.3076, lon: 7.4263, elevation: 1275, dhv: 5192,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5193", name: "Mont Raimeux Süd", region: "Rbeuvellier",
    lat: 47.2993, lon: 7.425, elevation: 1232, dhv: 5193,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1740", name: "Montagne de Sorvillier", region: "Court",
    lat: 47.2241, lon: 7.315, elevation: 1198, dhv: 1740,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2074", name: "Montalin", region: "Chur",
    lat: 46.8635, lon: 9.5903, elevation: 2256, dhv: 2074,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1737", name: "Monte Bisbino", region: "Morbio",
    lat: 45.8731, lon: 9.0659, elevation: 1317, dhv: 1737,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1738", name: "Monte Generoso", region: "Capolago",
    lat: 45.929, lon: 9.0217, elevation: 1640, dhv: 1738,
    sectors: [[168.75, 191.25], [168.75, 236.25]], sectorLabel: "S · S-SW", ...DEF },

  { id: "db_1739", name: "Monte Lema", region: "Miglieglia",
    lat: 46.039, lon: 8.831, elevation: 1577, dhv: 1739,
    sectors: [[78.75, 236.25]], sectorLabel: "O-SW", ...DEF },

  { id: "db_1741", name: "Monte Tamaro", region: "Rivera",
    lat: 46.1165, lon: 8.8938, elevation: 1516, dhv: 1741,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2094", name: "Monti di Gana", region: "Riazzino",
    lat: 46.197, lon: 8.908, elevation: 1272, dhv: 2094,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1472", name: "Montlinger Schwamm", region: "Oberriet",
    lat: 47.311, lon: 9.5101, elevation: 1131, dhv: 1472,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1631", name: "Montoz Nord", region: "Tavannes",
    lat: 47.2082, lon: 7.2163, elevation: 1234, dhv: 1631,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1630", name: "Montoz Süd", region: "La Heutte",
    lat: 47.2064, lon: 7.2156, elevation: 1259, dhv: 1630,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5371", name: "Moosalp", region: "St. Niklaus",
    lat: 46.2449, lon: 7.8208, elevation: 2320, dhv: 5371,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2095", name: "Mornera", region: "Bellinzona",
    lat: 46.2058, lon: 8.9858, elevation: 1382, dhv: 2095,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1561", name: "Motta Naluns", region: "Scuol",
    lat: 46.8129, lon: 10.2732, elevation: 2168, dhv: 1561,
    sectors: [[78.75, 191.25], [123.75, 146.25]], sectorLabel: "O-S · SO", ...DEF },

  { id: "db_2066", name: "Muottas Muragl", region: "Pontresina",
    lat: 46.5212, lon: 9.9024, elevation: 2240, dhv: 2066,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1402", name: "Musenalp", region: "Dallenwil",
    lat: 46.929, lon: 8.4426, elevation: 1751, dhv: 1402,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1699", name: "Mutti", region: "Fiesch",
    lat: 46.438, lon: 8.1553, elevation: 1785, dhv: 1699,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1745", name: "Nätschen", region: "Andermatt",
    lat: 46.6444, lon: 8.6075, elevation: 1869, dhv: 1745,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1284", name: "Niederbauen", region: "Emmetten",
    lat: 46.9468, lon: 8.5364, elevation: 1590, dhv: 1284,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1581_S", name: "Niederhorn (S)", region: "Interlaken",
    lat: 46.7115, lon: 7.7768, elevation: 1956, dhv: 1581,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1581_W", name: "Niederhorn (W)", region: "Interlaken",
    lat: 46.7101, lon: 7.7733, elevation: 1930, dhv: 1581,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1595", name: "Niesen", region: "Mülenen",
    lat: 46.6444, lon: 7.6492, elevation: 2279, dhv: 1595,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1747", name: "Ob Lucken", region: "Beggingen",
    lat: 47.763, lon: 8.5558, elevation: 888, dhv: 1747,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2116", name: "Ober Büelen", region: "Sachseln",
    lat: 46.8541, lon: 8.2704, elevation: 1524, dhv: 2116,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2085", name: "Ober Schrot", region: "Studen",
    lat: 47.0598, lon: 8.8409, elevation: 1393, dhv: 2085,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1751", name: "Obere Wengi", region: "Matzendorf",
    lat: 47.3259, lon: 7.6273, elevation: 951, dhv: 1751,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2107", name: "Oberrieden", region: "Oberrieden",
    lat: 47.2672, lon: 8.5751, elevation: 576, dhv: 2107,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1593", name: "Oeschinen", region: "Kandersteg",
    lat: 46.5034, lon: 7.6965, elevation: 1739, dhv: 1593,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1748", name: "Opfertshofen", region: "Opfertshofen",
    lat: 47.7731, lon: 8.6551, elevation: 651, dhv: 1748,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5378", name: "Orsieres", region: "Orsieres",
    lat: 46.0188, lon: 7.1212, elevation: 1297, dhv: 5378,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1466_S", name: "Palfries (S)", region: "Sarganz",
    lat: 47.0747, lon: 9.422, elevation: 1858, dhv: 1466,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1466_W", name: "Palfries (W)", region: "Sarganz",
    lat: 47.0886, lon: 9.422, elevation: 1745, dhv: 1466,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1485", name: "Parpaner Rothorn", region: "Lenzerheide",
    lat: 46.7423, lon: 9.6021, elevation: 2841, dhv: 1485,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1482_N", name: "Parsenn (N)", region: "Davos",
    lat: 46.8378, lon: 9.7946, elevation: 2804, dhv: 1482,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1482_SO", name: "Parsenn (SO)", region: "Davos",
    lat: 46.8316, lon: 9.8053, elevation: 2639, dhv: 1482,
    sectors: [[123.75, 146.25], [78.75, 191.25]], sectorLabel: "SO · O-S", ...DEF },

  { id: "db_1743", name: "Parusciana", region: "Lumino",
    lat: 46.2418, lon: 9.0541, elevation: 1250, dhv: 1743,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2092", name: "Parusciana", region: "Lumino",
    lat: 46.2417, lon: 9.0542, elevation: 1249, dhv: 2092,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1754_SO", name: "Pas de Maimbre (SO)", region: "Anzere",
    lat: 46.3124, lon: 7.3867, elevation: 2336, dhv: 1754,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1754_W", name: "Pas de Maimbre (W)", region: "Anzere",
    lat: 46.3124, lon: 7.3854, elevation: 2353, dhv: 1754,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2369", name: "Passwang", region: "Ramiswil",
    lat: 47.3576, lon: 7.6504, elevation: 980, dhv: 2369,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1965", name: "Petit Mont Bonvin", region: "Aminona",
    lat: 46.3528, lon: 7.521, elevation: 2393, dhv: 1965,
    sectors: [[168.75, 236.25], [168.75, 191.25]], sectorLabel: "S-SW · S", ...DEF },

  { id: "db_1755", name: "Pfaff", region: "Bisisthal",
    lat: 46.9234, lon: 8.8677, elevation: 2098, dhv: 1755,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2057", name: "Pfeiffe", region: "Plaffeien",
    lat: 46.7411, lon: 7.3718, elevation: 1663, dhv: 2057,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1587", name: "Pfingstegg", region: "Grindelwald",
    lat: 46.6161, lon: 8.0561, elevation: 1398, dhv: 1587,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5238", name: "Phyffe", region: "Platteien",
    lat: 46.7312, lon: 7.3294, elevation: 1406, dhv: 5238,
    sectors: [[258.75, 56.25]], sectorLabel: "W-NO", ...DEF },

  { id: "db_1293_SW", name: "Pilatus (SW)", region: "Alpnach",
    lat: 46.9794, lon: 8.2552, elevation: 2059, dhv: 1293,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1293_W", name: "Pilatus (W)", region: "Alpnach",
    lat: 46.9822, lon: 8.2507, elevation: 1864, dhv: 1293,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1566", name: "Piz Ault", region: "Disentis",
    lat: 46.727, lon: 8.7829, elevation: 2902, dhv: 1566,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2069", name: "Piz Lagalp", region: "Pontrseina",
    lat: 46.4294, lon: 10.0209, elevation: 2895, dhv: 2069,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2075_N", name: "Piz Martegnas (N)", region: "Savognin",
    lat: 46.5817, lon: 9.5318, elevation: 2583, dhv: 2075,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_2075_NO", name: "Piz Martegnas (NO)", region: "Savognin",
    lat: 46.577, lon: 9.5304, elevation: 2654, dhv: 2075,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2075_W", name: "Piz Martegnas (W)", region: "Savognin",
    lat: 46.5782, lon: 9.5302, elevation: 2638, dhv: 2075,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1494", name: "Piz Mundaun", region: "Mundaun-Obersaxen",
    lat: 46.7423, lon: 9.1582, elevation: 2053, dhv: 1494,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5309", name: "Piz Nair", region: "St. Moritz",
    lat: 46.5058, lon: 9.7891, elevation: 2979, dhv: 5309,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1297_N", name: "Pizol (N)", region: "Wangs",
    lat: 46.9793, lon: 9.4175, elevation: 2223, dhv: 1297,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1297_NO", name: "Pizol (NO)", region: "Wangs",
    lat: 47.0052, lon: 9.4221, elevation: 1473, dhv: 1297,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1297_O", name: "Pizol (O)", region: "Wangs",
    lat: 46.9798, lon: 9.4368, elevation: 2224, dhv: 1297,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5351", name: "Plaine Morte", region: "Crans Montana",
    lat: 46.3704, lon: 7.4872, elevation: 2907, dhv: 5351,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1685_N", name: "Planachaux (N)", region: "Chambery",
    lat: 46.1758, lon: 6.8445, elevation: 1925, dhv: 1685,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1685_NO", name: "Planachaux (NO)", region: "Chambery",
    lat: 46.1774, lon: 6.8405, elevation: 1934, dhv: 1685,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1685_SW", name: "Planachaux (SW)", region: "Chambery",
    lat: 46.1767, lon: 6.8403, elevation: 1929, dhv: 1685,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1572_O", name: "Planplatten (O)", region: "Meiringen",
    lat: 46.736, lon: 8.2548, elevation: 2234, dhv: 1572,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1572_W", name: "Planplatten (W)", region: "Meiringen",
    lat: 46.7367, lon: 8.2548, elevation: 2239, dhv: 1572,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1567", name: "Plaun Tir", region: "Disentis",
    lat: 46.7063, lon: 8.7968, elevation: 2172, dhv: 1567,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5369", name: "Pointe de Bellevue", region: "Monthey",
    lat: 46.2491, lon: 6.9047, elevation: 1667, dhv: 5369,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1756", name: "Portes D'Onne", region: "Vionnaz",
    lat: 46.2843, lon: 6.8651, elevation: 1918, dhv: 1756,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1487", name: "Präzer Alp", region: "Cazis",
    lat: 46.7393, lon: 9.3739, elevation: 2112, dhv: 1487,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1757", name: "Prodkamm", region: "Flums",
    lat: 47.0744, lon: 9.2684, elevation: 1920, dhv: 1757,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1758", name: "Ramenegg", region: "Morgarten",
    lat: 47.1019, lon: 8.6148, elevation: 1124, dhv: 1758,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1759", name: "Ramslauen", region: "Kiental",
    lat: 46.5795, lon: 7.7065, elevation: 1476, dhv: 1759,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1570", name: "Ratzi", region: "Spiringen",
    lat: 46.8884, lon: 8.7289, elevation: 1606, dhv: 1570,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1605", name: "Rellerligrat", region: "Schönried",
    lat: 46.5086, lon: 7.2624, elevation: 1809, dhv: 1605,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1573", name: "Reuti", region: "Meiringen",
    lat: 46.7378, lon: 8.2056, elevation: 1160, dhv: 1573,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5357", name: "Ried", region: "Ried",
    lat: 46.3278, lon: 8.0406, elevation: 1488, dhv: 5357,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1705", name: "Riffelberg", region: "Zermatt",
    lat: 45.9933, lon: 7.7525, elevation: 2552, dhv: 1705,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1760", name: "Riggisalp", region: "Schwarzsee",
    lat: 46.6592, lon: 7.2936, elevation: 1475, dhv: 1760,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5207_NO", name: "Rigi Kulm (NO)", region: "Goldau",
    lat: 47.0531, lon: 8.4913, elevation: 1652, dhv: 5207,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5207_O", name: "Rigi Kulm (O)", region: "Goldau",
    lat: 47.0557, lon: 8.4864, elevation: 1772, dhv: 5207,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5207_S", name: "Rigi Kulm (S)", region: "Goldau",
    lat: 47.0548, lon: 8.4862, elevation: 1750, dhv: 5207,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1411_NO", name: "Rigi-Scheidegg (NO)", region: "Goldau",
    lat: 47.0279, lon: 8.5199, elevation: 1652, dhv: 1411,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1411_SO", name: "Rigi-Scheidegg (SO)", region: "Goldau",
    lat: 47.0268, lon: 8.5206, elevation: 1652, dhv: 1411,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1761", name: "Rigi-Seebodenalp", region: "Küssnacht",
    lat: 47.0634, lon: 8.4585, elevation: 1032, dhv: 1761,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1689", name: "Rigi-Staffelhöhe", region: "Weggis",
    lat: 47.0475, lon: 8.4607, elevation: 1567, dhv: 1689,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1609_NO", name: "Rinderberg (NO)", region: "Gstaad",
    lat: 46.5099, lon: 7.3617, elevation: 1909, dhv: 1609,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1609_NW", name: "Rinderberg (NW)", region: "Gstaad",
    lat: 46.5055, lon: 7.3567, elevation: 2070, dhv: 1609,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1762", name: "Rinderhütte", region: "Leukerbad",
    lat: 46.3695, lon: 7.6485, elevation: 2309, dhv: 1762,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1763", name: "Roc D'Orsival", region: "Grimetz",
    lat: 46.1948, lon: 7.5341, elevation: 2809, dhv: 1763,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5359", name: "Roc Orsay", region: "Villars-sur-Ollon",
    lat: 46.3215, lon: 7.0683, elevation: 1881, dhv: 5359,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1764_O", name: "Rochers de Naye (O)", region: "Villeneuve",
    lat: 46.432, lon: 6.9766, elevation: 2023, dhv: 1764,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1764_S", name: "Rochers de Naye (S)", region: "Villeneuve",
    lat: 46.4316, lon: 6.9779, elevation: 1977, dhv: 1764,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2101", name: "Rophaien", region: "Flüelen",
    lat: 46.9281, lon: 8.6466, elevation: 2063, dhv: 2101,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_2091", name: "Rorschacherberg", region: "Rorschach",
    lat: 47.4536, lon: 9.5007, elevation: 937, dhv: 2091,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1767", name: "Rotenfluespitz", region: "Marbach",
    lat: 46.8778, lon: 7.9424, elevation: 1519, dhv: 1767,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1413_N", name: "Rotenfluh (N)", region: "Rickenbach",
    lat: 47.0216, lon: 8.7044, elevation: 1550, dhv: 1413,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1413_S", name: "Rotenfluh (S)", region: "Rickenbach",
    lat: 47.0182, lon: 8.7017, elevation: 1551, dhv: 1413,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1413_W", name: "Rotenfluh (W)", region: "Rickenbach",
    lat: 47.0189, lon: 8.7017, elevation: 1557, dhv: 1413,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2368", name: "Röti", region: "Welschenrohr",
    lat: 47.2579, lon: 7.5278, elevation: 1393, dhv: 2368,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1399", name: "Ruedlen", region: "Kerns",
    lat: 46.8984, lon: 8.3173, elevation: 1277, dhv: 1399,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1768", name: "Ruelen", region: "Sarnen",
    lat: 46.8984, lon: 8.3174, elevation: 1269, dhv: 1768,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1693", name: "Ruinettes", region: "Verbier",
    lat: 46.09, lon: 7.2515, elevation: 2167, dhv: 1693,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1569", name: "Ruogig", region: "Bürglen",
    lat: 46.906, lon: 8.6905, elevation: 1859, dhv: 1569,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1245", name: "Säntis", region: "Unterwasser",
    lat: 47.2459, lon: 9.3476, elevation: 2375, dhv: 1245,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5518", name: "Sarreyer", region: "Sarreyer",
    lat: 46.0716, lon: 7.2631, elevation: 1945, dhv: 5518,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5364", name: "Sassiglion", region: "Poschiavo",
    lat: 46.3186, lon: 10.0948, elevation: 2069, dhv: 5364,
    sectors: [[213.75, 236.25], [213.75, 281.25]], sectorLabel: "SW · SW-W", ...DEF },

  { id: "db_5504", name: "Sattelhöpfli", region: "Euthal",
    lat: 47.1076, lon: 8.8118, elevation: 1298, dhv: 5504,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1486_O", name: "Scalottas (O)", region: "Lenzerheide",
    lat: 46.7213, lon: 9.5102, elevation: 2317, dhv: 1486,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1486_S", name: "Scalottas (S)", region: "Lenzerheide",
    lat: 46.7198, lon: 9.5106, elevation: 2295, dhv: 1486,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2476_NO", name: "Schartihöreli (NO)", region: "Isenthal",
    lat: 46.8963, lon: 8.568, elevation: 1583, dhv: 2476,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_2476_O", name: "Schartihöreli (O)", region: "Isenthal",
    lat: 46.8915, lon: 8.5667, elevation: 1565, dhv: 2476,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1611", name: "Schatthorn", region: "Lenk",
    lat: 46.4717, lon: 7.4811, elevation: 2030, dhv: 1611,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1484", name: "Schatzalp", region: "Davos",
    lat: 46.8052, lon: 9.8171, elevation: 1973, dhv: 1484,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1591", name: "Schiltgrat", region: "Stechelberg",
    lat: 46.557, lon: 7.8724, elevation: 2105, dhv: 1591,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1590", name: "Schilthorn", region: "Stechelberg",
    lat: 46.5581, lon: 7.833, elevation: 2939, dhv: 1590,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2080", name: "Schimbrig", region: "Finsterwald",
    lat: 46.9398, lon: 8.1142, elevation: 1807, dhv: 2080,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2078", name: "Schlans", region: "Trun",
    lat: 46.7679, lon: 8.9967, elevation: 1928, dhv: 2078,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2102", name: "Schön Chulm", region: "Bürglen",
    lat: 46.917, lon: 8.6728, elevation: 2031, dhv: 2102,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1394", name: "Schönbüel", region: "Lungern",
    lat: 46.7873, lon: 8.0989, elevation: 2011, dhv: 1394,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1291", name: "Schönhalden", region: "Flums",
    lat: 47.0605, lon: 9.3346, elevation: 1509, dhv: 1291,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5505", name: "Schrähöchi", region: "Euthal",
    lat: 47.0817, lon: 8.7879, elevation: 1474, dhv: 5505,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1706", name: "Schwarzsee", region: "Zermatt",
    lat: 45.9919, lon: 7.7092, elevation: 2584, dhv: 1706,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1752", name: "Schwengimatt", region: "Laupersdorf",
    lat: 47.291, lon: 7.6774, elevation: 1057, dhv: 1752,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1962", name: "Schwyberg", region: "Schwarzsee",
    lat: 46.677, lon: 7.2611, elevation: 1613, dhv: 1962,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1584_NW", name: "Schynige Platte (NW)", region: "Interlaken",
    lat: 46.6582, lon: 7.9029, elevation: 1750, dhv: 1584,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1584_W", name: "Schynige Platte (W)", region: "Interlaken",
    lat: 46.6626, lon: 7.9011, elevation: 1574, dhv: 1584,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1772", name: "Seetalhorn", region: "Grächen",
    lat: 46.176, lon: 7.8588, elevation: 2861, dhv: 1772,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1966_N", name: "Seetalhorn (N)", region: "Grächen",
    lat: 46.1777, lon: 7.8597, elevation: 2839, dhv: 1966,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1966_W", name: "Seetalhorn (W)", region: "Grächen",
    lat: 46.176, lon: 7.8586, elevation: 2861, dhv: 1966,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2100", name: "Sittlisalp", region: "Unterschächen",
    lat: 46.8547, lon: 8.757, elevation: 1813, dhv: 2100,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5373", name: "Soi d'en Haut", region: "Champery",
    lat: 46.1868, lon: 6.9165, elevation: 2051, dhv: 5373,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5365", name: "Somdoss", region: "Poschiavo",
    lat: 46.3358, lon: 10.0201, elevation: 2185, dhv: 5365,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2076", name: "Somtgant", region: "Savognin",
    lat: 46.5875, lon: 9.5471, elevation: 2258, dhv: 2076,
    sectors: [[33.75, 101.25], [33.75, 56.25]], sectorLabel: "NO-O · NO", ...DEF },

  { id: "db_1765", name: "Sonchaux", region: "Villeneuve",
    lat: 46.4179, lon: 6.9511, elevation: 1394, dhv: 1765,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1773", name: "Spierberg", region: "Flühli",
    lat: 46.886, lon: 7.9921, elevation: 1512, dhv: 1773,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1774", name: "Spirstock", region: "Hoch-Ybrig",
    lat: 47.001, lon: 8.7719, elevation: 1761, dhv: 1774,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2049", name: "St. Anton", region: "St. Anton",
    lat: 47.4111, lon: 9.5425, elevation: 1088, dhv: 2049,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3145", name: "St. Cergue", region: "Givrins",
    lat: 46.445, lon: 6.1757, elevation: 1009, dhv: 3145,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1744", name: "St. Maria", region: "Grono",
    lat: 46.2674, lon: 9.1379, elevation: 1214, dhv: 1744,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1401_N", name: "Stanserhorn (N)", region: "Stans",
    lat: 46.9298, lon: 8.3412, elevation: 1818, dhv: 1401,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1401_S", name: "Stanserhorn (S)", region: "Stans",
    lat: 46.931, lon: 8.3439, elevation: 1818, dhv: 1401,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1407", name: "Startplatz Mostelegg", region: "Seewen",
    lat: 47.0555, lon: 8.659, elevation: 1266, dhv: 1407,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1698", name: "Steibenkreuz", region: "Fiesch",
    lat: 46.448, lon: 8.1623, elevation: 2389, dhv: 1698,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1492", name: "Stein", region: "Obersaxen",
    lat: 46.7258, lon: 9.1263, elevation: 2167, dhv: 1492,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1286", name: "Stelserberg", region: "Schiers",
    lat: 46.962, lon: 9.7241, elevation: 1480, dhv: 1286,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1746", name: "Stierenberg", region: "Günsberg",
    lat: 47.2703, lon: 7.5609, elevation: 1173, dhv: 1746,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1470", name: "Stockberg", region: "Nesslau",
    lat: 47.2242, lon: 9.2377, elevation: 1517, dhv: 1470,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1600", name: "Stockhorn", region: "Erlenbach",
    lat: 46.6933, lon: 7.5376, elevation: 2105, dhv: 1600,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1467", name: "Studnerberg", region: "Grabs",
    lat: 47.1658, lon: 9.4246, elevation: 1076, dhv: 1467,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_1708", name: "Sunnega", region: "Zermatt",
    lat: 46.018, lon: 7.771, elevation: 2311, dhv: 1708,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1753", name: "Tannmatt", region: "Herbertswil",
    lat: 47.3077, lon: 7.5646, elevation: 1126, dhv: 1753,
    sectors: [[78.75, 236.25]], sectorLabel: "O-SW", ...DEF },

  { id: "db_1775", name: "Tätsch", region: "Realp",
    lat: 46.5992, lon: 8.4803, elevation: 2296, dhv: 1775,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5513", name: "Terza", region: "Santa Maria im Münstertal",
    lat: 46.6252, lon: 10.4161, elevation: 2156, dhv: 5513,
    sectors: [[123.75, 191.25], [123.75, 146.25]], sectorLabel: "SO-S · SO", ...DEF },

  { id: "db_1776", name: "Tete de Ran", region: "Fontainemelon",
    lat: 47.0537, lon: 6.8534, elevation: 1413, dhv: 1776,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1571", name: "Titlis", region: "Engelberg",
    lat: 46.7734, lon: 8.4342, elevation: 3163, dhv: 1571,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1488", name: "Trans", region: "Cazis",
    lat: 46.7637, lon: 9.4604, elevation: 1454, dhv: 1488,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1563", name: "Triesen", region: "Triesen",
    lat: 47.1315, lon: 9.5515, elevation: 1439, dhv: 1563,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1598_S", name: "Tschentenalp (S)", region: "Adelboden",
    lat: 46.4971, lon: 7.5416, elevation: 2024, dhv: 1598,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1598_SO", name: "Tschentenalp (SO)", region: "Adelboden",
    lat: 46.4992, lon: 7.5475, elevation: 1920, dhv: 1598,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5265", name: "Tschuggen", region: "Lauterbrunnen",
    lat: 46.6064, lon: 7.945, elevation: 2245, dhv: 5265,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1783", name: "Uetliberg", region: "Zürich",
    lat: 47.3225, lon: 8.5007, elevation: 735, dhv: 1783,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2086", name: "Ufem Tritt", region: "Einsideln",
    lat: 47.1017, lon: 8.7418, elevation: 1309, dhv: 2086,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1963", name: "Ulrichen", region: "Ulrichen",
    lat: 46.5173, lon: 8.2912, elevation: 2122, dhv: 1963,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1710", name: "Unterrothorn", region: "Zermatt",
    lat: 46.0213, lon: 7.7984, elevation: 3095, dhv: 1710,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1289", name: "Urmiberg", region: "Brunnen",
    lat: 47.0119, lon: 8.5901, elevation: 1116, dhv: 1289,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5366", name: "Varuna", region: "San Carlo",
    lat: 46.3485, lon: 10.0364, elevation: 1928, dhv: 5366,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1777_N", name: "Vercorin (N)", region: "Vercorin",
    lat: 46.229, lon: 7.5299, elevation: 2329, dhv: 1777,
    sectors: [[213.75, 101.25], [348.75, 56.25], [303.75, 11.25]], sectorLabel: "SW-O · N-NO · NW-N", ...DEF },

  { id: "db_1777_W", name: "Vercorin (W)", region: "Vercorin",
    lat: 46.2294, lon: 7.5279, elevation: 2322, dhv: 1777,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2105", name: "Veysonnaz", region: "Veysonnaz",
    lat: 46.1875, lon: 7.346, elevation: 1619, dhv: 2105,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1778", name: "Vilan", region: "Malans",
    lat: 47.0117, lon: 9.5904, elevation: 1794, dhv: 1778,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5354", name: "Virage", region: "Vionnaz",
    lat: 46.3197, lon: 6.8799, elevation: 1011, dhv: 5354,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1715", name: "Vitznau-Hinterbergen", region: "Vitznau",
    lat: 47.0127, lon: 8.4981, elevation: 1021, dhv: 1715,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2062", name: "Vorder Glärnisch", region: "Glarus",
    lat: 47.0228, lon: 9.0387, elevation: 2220, dhv: 2062,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1779", name: "Vounetse", region: "Charmey",
    lat: 46.6253, lon: 7.2059, elevation: 1600, dhv: 1779,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1586", name: "Waldspitz", region: "Grindelwald",
    lat: 46.6525, lon: 8.0419, elevation: 1990, dhv: 1586,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1780", name: "Walenmatt", region: "Cremines",
    lat: 47.2846, lon: 7.4858, elevation: 1229, dhv: 1780,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2099", name: "Wängihorn", region: "Bürglen",
    lat: 46.8584, lon: 8.7132, elevation: 1923, dhv: 2099,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2098", name: "Wannelen", region: "Unterschächen",
    lat: 46.8571, lon: 8.7889, elevation: 1628, dhv: 2098,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2371", name: "Wasserfallen", region: "Reigoldswil",
    lat: 47.3743, lon: 7.7047, elevation: 1017, dhv: 2371,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1607_NW", name: "Wasserngrat (NW)", region: "Gstaad",
    lat: 46.4594, lon: 7.3224, elevation: 1818, dhv: 1607,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1607_W", name: "Wasserngrat (W)", region: "Gstaad",
    lat: 46.4557, lon: 7.3253, elevation: 2015, dhv: 1607,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1781", name: "Wasserscheide", region: "Blumenstein",
    lat: 46.7218, lon: 7.446, elevation: 1604, dhv: 1781,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1911", name: "Weissenberg", region: "Lenk",
    lat: 46.4893, lon: 7.447, elevation: 1694, dhv: 1911,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1636", name: "Weissenstein", region: "Oberdorf",
    lat: 47.2507, lon: 7.5101, elevation: 1241, dhv: 1636,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2071_NO", name: "Weisshorn (NO)", region: "Arosa",
    lat: 46.7895, lon: 9.6387, elevation: 2649, dhv: 2071,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2071_SW", name: "Weisshorn (SW)", region: "Arosa",
    lat: 46.789, lon: 9.6378, elevation: 2637, dhv: 2071,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1782", name: "Weisshorn Winter", region: "Arosa",
    lat: 46.7891, lon: 9.6392, elevation: 2618, dhv: 1782,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2088", name: "Wildspitz", region: "Steinenberg",
    lat: 47.0837, lon: 8.5777, elevation: 1550, dhv: 2088,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1577", name: "Windeck", region: "Brienz",
    lat: 46.7116, lon: 8.0367, elevation: 1823, dhv: 1577,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1287_N", name: "Wirzweli (N)", region: "Dallenwil",
    lat: 46.9017, lon: 8.3617, elevation: 1567, dhv: 1287,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1287_NO", name: "Wirzweli (NO)", region: "Dallenwil",
    lat: 46.914, lon: 8.3669, elevation: 1228, dhv: 1287,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1287_SO", name: "Wirzweli (SO)", region: "Dallenwil",
    lat: 46.9024, lon: 8.3654, elevation: 1599, dhv: 1287,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1287_W", name: "Wirzweli (W)", region: "Dallenwil",
    lat: 46.9092, lon: 8.3753, elevation: 1474, dhv: 1287,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1603_N", name: "Wispile (N)", region: "Gstaad",
    lat: 46.4401, lon: 7.2929, elevation: 1895, dhv: 1603,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1603_O", name: "Wispile (O)", region: "Gstaad",
    lat: 46.4368, lon: 7.2934, elevation: 1924, dhv: 1603,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1603_W", name: "Wispile (W)", region: "Gstaad",
    lat: 46.44, lon: 7.2921, elevation: 1894, dhv: 1603,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1294", name: "Wissenberg", region: "Matt",
    lat: 46.9681, lon: 9.1777, elevation: 1360, dhv: 1294,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1592", name: "Wurmegg", region: "Stechelberg",
    lat: 46.5562, lon: 7.8877, elevation: 1707, dhv: 1592,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1412", name: "Zugerberg", region: "Zug",
    lat: 47.1479, lon: 8.5358, elevation: 945, dhv: 1412,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  // --- Frankreich ---
  { id: "db_5464", name: "A Punta", region: "Tox",
    lat: 42.2409, lon: 9.4416, elevation: 500, dhv: 5464,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3320_SW", name: "Accous (SW)", region: "Accous",
    lat: 42.9752, lon: 0.5614, elevation: 1199, dhv: 3320,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4995_SW", name: "Accous (SW)", region: "Accous",
    lat: 42.9758, lon: -0.5631, elevation: 1181, dhv: 4995,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3320_W", name: "Accous (W)", region: "Accous",
    lat: 42.9797, lon: 0.572, elevation: 1204, dhv: 3320,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_4995_W", name: "Accous (W)", region: "Accous",
    lat: 42.977, lon: -0.5469, elevation: 1592, dhv: 4995,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2152", name: "Agnis", region: "Signes",
    lat: 43.3023, lon: 5.8732, elevation: 696, dhv: 2152,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1807", name: "Agy", region: "Cluses",
    lat: 46.0801, lon: 6.619, elevation: 1256, dhv: 1807,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_4182_N", name: "Aiguille du Midi (N)", region: "Chamonix",
    lat: 45.8811, lon: 6.8972, elevation: 3587, dhv: 4182,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_4182_S", name: "Aiguille du Midi (S)", region: "Chamonix",
    lat: 45.8644, lon: 6.8967, elevation: 3473, dhv: 4182,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2141", name: "Aiguines", region: "Aiguines",
    lat: 43.7796, lon: 6.2562, elevation: 1001, dhv: 2141,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5054", name: "Algrange", region: "Algrange",
    lat: 49.3574, lon: 6.0564, elevation: 369, dhv: 5054,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3004", name: "Alprech", region: "Le Portel",
    lat: 50.6942, lon: 1.5637, elevation: 35, dhv: 3004,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4911", name: "Amfreville-sous-les-Monts", region: "Amfreville-sous-les-Monts",
    lat: 49.3019, lon: 1.2644, elevation: 105, dhv: 4911,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4888", name: "Amigny", region: "Sancerre",
    lat: 47.3304, lon: 2.7937, elevation: 342, dhv: 4888,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1891", name: "Andey", region: "Faucigny",
    lat: 46.0541, lon: 6.4079, elevation: 1061, dhv: 1891,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3321", name: "Arbas", region: "Arbas",
    lat: 42.9701, lon: 0.8861, elevation: 1076, dhv: 3321,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3101", name: "Arcy sur Cure", region: "Arcy-sur-Cure",
    lat: 47.6006, lon: 3.7776, elevation: 219, dhv: 3101,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2289", name: "Arfuyen", region: "Malaucene",
    lat: 44.1926, lon: 5.1018, elevation: 569, dhv: 2289,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3308", name: "Argeliers", region: "Ageliers",
    lat: 43.3154, lon: 2.8843, elevation: 206, dhv: 3308,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4976", name: "Arros", region: "Le Verdon-sur-Mer",
    lat: 45.5461, lon: -1.0978, elevation: 17, dhv: 4976,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3327_S", name: "Arrouyes (S)", region: "Bareges",
    lat: 42.915, lon: 0.1014, elevation: 2117, dhv: 3327,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3327_SO", name: "Arrouyes (SO)", region: "Bareges",
    lat: 42.9114, lon: 0.1088, elevation: 1857, dhv: 3327,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4892", name: "Athie", region: "Athie",
    lat: 47.5734, lon: 4.2724, elevation: 374, dhv: 4892,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3198", name: "Aubas", region: "Condat-sur-Vezere",
    lat: 45.0886, lon: 1.2152, elevation: 189, dhv: 3198,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_4883", name: "Auberville", region: "Villers-sur-Mer",
    lat: 49.3184, lon: -0.0189, elevation: 63, dhv: 4883,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_4996", name: "Aucun", region: "Aucun",
    lat: 42.9902, lon: -0.1964, elevation: 1370, dhv: 4996,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3046", name: "Aunay", region: "Saint-Georges-D&#039;Annay",
    lat: 49.0019, lon: -0.655, elevation: 265, dhv: 3046,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2140", name: "Auron", region: "St. Etienne de Tinee",
    lat: 44.2363, lon: 6.9045, elevation: 2231, dhv: 2140,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1876", name: "Aussois", region: "Aussois",
    lat: 45.2622, lon: 6.7379, elevation: 2576, dhv: 1876,
    sectors: [[123.75, 146.25], [78.75, 191.25]], sectorLabel: "SO · O-S", ...DEF },

  { id: "db_4936", name: "Auteuil", region: "Auteuil",
    lat: 49.3307, lon: 2.0911, elevation: 196, dhv: 4936,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2305", name: "Avoriaz", region: "Avoriaz",
    lat: 46.1944, lon: 6.7678, elevation: 1797, dhv: 2305,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3245", name: "Ayet", region: "Ayet",
    lat: 44.3399, lon: 0.3334, elevation: 152, dhv: 3245,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3098_NO", name: "Ballon D'Alsace (NO)", region: "Saint-Maurice-sur-Moselle",
    lat: 47.8243, lon: 6.8447, elevation: 1230, dhv: 3098,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3098_NW", name: "Ballon D'Alsace (NW)", region: "Saint-Maurice-sur-Moselle",
    lat: 47.8251, lon: 6.8413, elevation: 1232, dhv: 3098,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3098_SO", name: "Ballon D'Alsace (SO)", region: "Saint-Maurice-sur-Moselle",
    lat: 47.8227, lon: 6.846, elevation: 1235, dhv: 3098,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1892", name: "Ban Rouge", region: "Notro Dame de Bellecombes",
    lat: 45.8032, lon: 6.5826, elevation: 1958, dhv: 1892,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3037", name: "Banc des Deux Amants", region: "Pitres",
    lat: 49.3191, lon: 1.2462, elevation: 107, dhv: 3037,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5015", name: "Barcelonnette", region: "Barcelonnette",
    lat: 44.4019, lon: 6.6672, elevation: 1601, dhv: 5015,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2142", name: "Bargemon", region: "Bargemon",
    lat: 43.6388, lon: 6.5616, elevation: 1015, dhv: 2142,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3228", name: "Barjac", region: "Barjac",
    lat: 44.5021, lon: 3.4186, elevation: 972, dhv: 3228,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3032", name: "Barneville-sur-Seine", region: "Barneville-sur-Seine",
    lat: 49.3881, lon: 0.8487, elevation: 127, dhv: 3032,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5088", name: "Basse des Feignes", region: "La Bresse",
    lat: 48.0035, lon: 6.8431, elevation: 1011, dhv: 5088,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5004", name: "Batere", region: "Corsavy",
    lat: 42.504, lon: 2.5478, elevation: 1588, dhv: 5004,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4991_NO", name: "Bauigura (NO)", region: "Helette",
    lat: 43.2947, lon: -1.2888, elevation: 840, dhv: 4991,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4991_W", name: "Bauigura (W)", region: "Helette",
    lat: 43.2907, lon: -1.2936, elevation: 870, dhv: 4991,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_4893", name: "Baulme la Roche", region: "Baulme la Roche",
    lat: 47.3489, lon: 4.8017, elevation: 567, dhv: 4893,
    sectors: [[213.75, 236.25], [213.75, 281.25]], sectorLabel: "SW · SW-W", ...DEF },

  { id: "db_3107", name: "Baume les Dames", region: "Baume-les Dames",
    lat: 47.3489, lon: 6.3808, elevation: 465, dhv: 3107,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5044", name: "Baumes-de-Venise", region: "Baumes-de-Venise",
    lat: 44.1259, lon: 5.0172, elevation: 240, dhv: 5044,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4919", name: "Beaulieu-sur-Layon", region: "Beaulieu-sur-Layon",
    lat: 47.3097, lon: -0.5997, elevation: 68, dhv: 4919,
    sectors: [[213.75, 281.25], [213.75, 236.25]], sectorLabel: "SW-W · SW", ...DEF },

  { id: "db_1815", name: "Beausses", region: "Rustrel",
    lat: 43.9419, lon: 5.4762, elevation: 936, dhv: 1815,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4899", name: "Beg Leguer", region: "Lannion",
    lat: 48.7505, lon: -3.5493, elevation: 73, dhv: 4899,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4962", name: "Belesta", region: "Belesta",
    lat: 42.9, lon: 1.9639, elevation: 908, dhv: 4962,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5063", name: "Belfahy", region: "Plancher-les-Mines",
    lat: 47.7751, lon: 6.7378, elevation: 811, dhv: 5063,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5055", name: "Belmont", region: "Belmont",
    lat: 48.4192, lon: 7.2389, elevation: 927, dhv: 5055,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3143", name: "Belvedere", region: "Lezat",
    lat: 46.5034, lon: 5.9368, elevation: 907, dhv: 3143,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2208", name: "Belvedere Serre-Poncon", region: "La Batie Neuve",
    lat: 44.584, lon: 6.2355, elevation: 1569, dhv: 2208,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3093", name: "Benevise", region: "Rupt-sur-Moselle",
    lat: 47.9229, lon: 6.6856, elevation: 800, dhv: 3093,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3147", name: "Berce la Ville", region: "Berze-la-Ville",
    lat: 46.3678, lon: 4.7046, elevation: 431, dhv: 3147,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1272_NW", name: "Bergies (NW)", region: "Sederon",
    lat: 44.2039, lon: 5.5106, elevation: 1332, dhv: 1272,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1272_SO", name: "Bergies (SO)", region: "Sederon",
    lat: 44.2031, lon: 5.5103, elevation: 1334, dhv: 1272,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3052", name: "Berjou", region: "Berjou",
    lat: 48.8552, lon: -0.4858, elevation: 224, dhv: 3052,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_4949", name: "Beynes", region: "Beynes",
    lat: 48.8538, lon: 1.89, elevation: 115, dhv: 4949,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3216", name: "Bigaroque", region: "Coux-en-Bigaroque",
    lat: 44.8523, lon: 0.9373, elevation: 133, dhv: 3216,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3332", name: "Birout' Ale", region: "Barrettali",
    lat: 42.8828, lon: 9.3502, elevation: 573, dhv: 3332,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1871", name: "Bisanne", region: "Villard sur Doron",
    lat: 45.747, lon: 6.5073, elevation: 1925, dhv: 1871,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3121", name: "Bligny sur Ouche", region: "Bligny sur Ouche",
    lat: 47.1145, lon: 4.6757, elevation: 511, dhv: 3121,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3102", name: "Bois de Breuleux", region: "Echenoz-la-Meline",
    lat: 47.6006, lon: 6.1282, elevation: 366, dhv: 3102,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3326", name: "Bonida", region: "Bareges",
    lat: 42.9186, lon: 0.1269, elevation: 2300, dhv: 3326,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3206", name: "Bordas", region: "Grun-Bordas",
    lat: 45.0478, lon: 0.6675, elevation: 195, dhv: 3206,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3186", name: "Bort les Orgues", region: "Bort les Orgues",
    lat: 45.3958, lon: 2.4835, elevation: 753, dhv: 3186,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3041", name: "Bosville", region: "Bosville",
    lat: 49.1184, lon: 1.1195, elevation: 113, dhv: 3041,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2316", name: "Bouc Blanc", region: "Bozel",
    lat: 45.4107, lon: 6.6146, elevation: 2195, dhv: 2316,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2315", name: "Bozel", region: "Bozel",
    lat: 45.4559, lon: 6.6571, elevation: 1461, dhv: 2315,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4876", name: "Brasles", region: "Brasles",
    lat: 49.0549, lon: 3.4388, elevation: 189, dhv: 4876,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3062_SO", name: "Breitenbach (SO)", region: "Breitenbach",
    lat: 48.3835, lon: 7.2828, elevation: 938, dhv: 3062,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3062_SW", name: "Breitenbach (SW)", region: "Breitenbach",
    lat: 48.3833, lon: 7.2804, elevation: 932, dhv: 3062,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_4969_SW", name: "Brezons (SW)", region: "Brezons",
    lat: 45.0066, lon: 2.8144, elevation: 1291, dhv: 4969,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4969_W", name: "Brezons (W)", region: "Brezons",
    lat: 45.0022, lon: 2.8198, elevation: 1158, dhv: 4969,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_4990", name: "Brionnet", region: "Saurier",
    lat: 45.5288, lon: 3.0586, elevation: 883, dhv: 4990,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_3202", name: "Bros", region: "Bros",
    lat: 45.0665, lon: 1.8996, elevation: 455, dhv: 3202,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4970", name: "Bruget", region: "Vic-sur-Cere",
    lat: 44.9844, lon: 2.6579, elevation: 1079, dhv: 4970,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3293", name: "Brunas", region: "Creissels",
    lat: 44.0733, lon: 3.0641, elevation: 708, dhv: 3293,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1273_NW", name: "Buc (NW)", region: "Mévouillon",
    lat: 44.2072, lon: 5.4775, elevation: 1427, dhv: 1273,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1273_SW", name: "Buc (SW)", region: "Mévouillon",
    lat: 44.2255, lon: 5.4723, elevation: 1023, dhv: 1273,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2211", name: "Butte de L'Aigle", region: "Aurel",
    lat: 44.7026, lon: 5.3187, elevation: 930, dhv: 2211,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2146", name: "Cagnorina", region: "Tende",
    lat: 44.0974, lon: 7.5967, elevation: 1076, dhv: 2146,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1793", name: "Cairn", region: "Orciers",
    lat: 44.6977, lon: 6.3047, elevation: 2052, dhv: 1793,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3044", name: "Cambolle", region: "Evreux",
    lat: 49.028, lon: 1.1273, elevation: 122, dhv: 3044,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5006", name: "Camelas", region: "Thuir",
    lat: 42.6248, lon: 2.6811, elevation: 492, dhv: 5006,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4913", name: "Cameros", region: "Saint-Nic",
    lat: 48.2024, lon: -4.3152, elevation: 22, dhv: 4913,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3100_N", name: "Camps de Cesar (N)", region: "Vaivre-et-Montoille",
    lat: 47.6268, lon: 6.0893, elevation: 354, dhv: 3100,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3100_SW", name: "Camps de Cesar (SW)", region: "Vaivre-et-Montoille",
    lat: 47.6222, lon: 6.0897, elevation: 364, dhv: 3100,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3330", name: "Caoubere", region: "Bareges",
    lat: 42.9019, lon: 0.1134, elevation: 1822, dhv: 3330,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3342", name: "Cap de Pales", region: "Germ",
    lat: 42.7724, lon: 0.4548, elevation: 2186, dhv: 3342,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_4579", name: "Capu di Manganu", region: "Calacuccia",
    lat: 42.3524, lon: 8.9636, elevation: 1629, dhv: 4579,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3054_NW", name: "Carolles (NW)", region: "Carolles",
    lat: 48.756, lon: -1.5728, elevation: 43, dhv: 3054,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3054_W", name: "Carolles (W)", region: "Carolles",
    lat: 48.7542, lon: -1.5726, elevation: 55, dhv: 3054,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4927_S", name: "Carteret (S)", region: "Barneville-Carteret",
    lat: 49.3736, lon: -1.8054, elevation: 57, dhv: 4927,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4927_W", name: "Carteret (W)", region: "Barneville-Carteret",
    lat: 49.3737, lon: -1.8074, elevation: 51, dhv: 4927,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3297", name: "Carvel", region: "Courris",
    lat: 43.956, lon: 2.419, elevation: 429, dhv: 3297,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3231", name: "Castelfranc", region: "Anglars-Juillard",
    lat: 44.5024, lon: 1.2119, elevation: 220, dhv: 3231,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3153", name: "Catray", region: "Villes",
    lat: 46.1105, lon: 5.7568, elevation: 1068, dhv: 3153,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3289", name: "Cazals", region: "Cazals",
    lat: 44.1167, lon: 1.7313, elevation: 307, dhv: 3289,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3316", name: "Cazavet", region: "Cazeaux",
    lat: 42.9835, lon: 1.0357, elevation: 906, dhv: 3316,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2290", name: "Ceillac", region: "Ceillac",
    lat: 44.6666, lon: 6.7853, elevation: 1810, dhv: 2290,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5008_NO", name: "Cerbere (NO)", region: "Cerbere",
    lat: 42.4513, lon: 3.1497, elevation: 296, dhv: 5008,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5008_O", name: "Cerbere (O)", region: "Cerbere",
    lat: 42.4531, lon: 3.1357, elevation: 451, dhv: 5008,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3348", name: "Ceret", region: "Ceret",
    lat: 42.4591, lon: 2.7675, elevation: 819, dhv: 3348,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3350", name: "Cervione", region: "Cervione",
    lat: 42.3292, lon: 9.4745, elevation: 743, dhv: 3350,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_3295", name: "Cezas", region: "Laroque",
    lat: 43.9675, lon: 3.7826, elevation: 678, dhv: 3295,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1800", name: "Chabanon", region: "Selonnet",
    lat: 44.3352, lon: 6.2921, elevation: 1969, dhv: 1800,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3190", name: "Chabraire", region: "Cheylade",
    lat: 45.1561, lon: 2.7333, elevation: 1531, dhv: 3190,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_1338_N", name: "Chabre (N)", region: "Laragne",
    lat: 44.3031, lon: 5.7766, elevation: 1264, dhv: 1338,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1338_S", name: "Chabre (S)", region: "Laragne",
    lat: 44.2983, lon: 5.7658, elevation: 1314, dhv: 1338,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1846", name: "Chalais", region: "Voreppe",
    lat: 45.2932, lon: 5.661, elevation: 1033, dhv: 1846,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3040", name: "Chamery", region: "Chamery",
    lat: 49.1649, lon: 3.9532, elevation: 255, dhv: 3040,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1278", name: "Chamoux", region: "Chamoux-sur-Gelon",
    lat: 45.5294, lon: 6.2527, elevation: 1251, dhv: 1278,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3055", name: "Champeaux", region: "Saint Jean le Thomas",
    lat: 48.7325, lon: -1.5365, elevation: 63, dhv: 3055,
    sectors: [[168.75, 191.25], [168.75, 236.25]], sectorLabel: "S · S-SW", ...DEF },

  { id: "db_2158", name: "Champfromier", region: "Champfromier",
    lat: 46.2148, lon: 5.8144, elevation: 1187, dhv: 2158,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3085", name: "Champis", region: "La Bresse",
    lat: 48.033, lon: 6.9465, elevation: 1173, dhv: 3085,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1880", name: "Champlaurent", region: "Chamoux",
    lat: 45.5149, lon: 6.2155, elevation: 1263, dhv: 1880,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_4891", name: "Champtin", region: "Champtin",
    lat: 47.3079, lon: 2.7805, elevation: 327, dhv: 4891,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4993", name: "Chapelle de la Madeleine", region: "Trois-Villes",
    lat: 43.147, lon: -0.845, elevation: 770, dhv: 4993,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3324", name: "Char de Moulis", region: "Moulis",
    lat: 42.9521, lon: 1.101, elevation: 824, dhv: 3324,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5053", name: "Charezier", region: "Charezier",
    lat: 46.6204, lon: 5.7314, elevation: 566, dhv: 5053,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3092", name: "Charmoilles", region: "Rolampont",
    lat: 47.9374, lon: 5.3588, elevation: 442, dhv: 3092,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3196_N", name: "Chassaure (N)", region: "Lavoute-sur-Loire",
    lat: 45.1124, lon: 3.9169, elevation: 873, dhv: 3196,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3196_NO", name: "Chassaure (NO)", region: "Lavoute-sur-Loire",
    lat: 45.1034, lon: 3.9301, elevation: 920, dhv: 3196,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1803", name: "Chastelard", region: "Banon",
    lat: 44.0513, lon: 5.6835, elevation: 902, dhv: 1803,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3333", name: "Chateau de Peyrepertuse", region: "Duilhac-sous-Peyrepertuse",
    lat: 42.8696, lon: 2.5598, elevation: 659, dhv: 3333,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5079", name: "Chatel", region: "Chatel",
    lat: 46.2767, lon: 6.8577, elevation: 1978, dhv: 5079,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4918", name: "Chaudefonds-sur-Layon", region: "Chaudefonds-sur-Layon",
    lat: 47.3227, lon: -0.7175, elevation: 54, dhv: 4918,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3210", name: "Chaudeyrolles", region: "Chaudeyrolles",
    lat: 44.9352, lon: 4.1912, elevation: 1390, dhv: 3210,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_4887", name: "Chavignol", region: "Sancerre",
    lat: 47.3419, lon: 2.7916, elevation: 324, dhv: 4887,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2313", name: "Cherier", region: "Arcon",
    lat: 45.9844, lon: 3.9202, elevation: 848, dhv: 2313,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_3082", name: "Chevre Roche", region: "Vagny",
    lat: 48.0387, lon: 6.7084, elevation: 812, dhv: 3082,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2160", name: "Cheynet", region: "Rochessauve",
    lat: 44.6825, lon: 4.6145, elevation: 629, dhv: 2160,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5058", name: "Chiroubles", region: "Chiroubles",
    lat: 46.1905, lon: 4.631, elevation: 689, dhv: 5058,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5023", name: "Chorges", region: "Chorges",
    lat: 44.5817, lon: 6.281, elevation: 1599, dhv: 5023,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1864", name: "Clamontard", region: "Luc en Diois",
    lat: 44.6032, lon: 5.4414, elevation: 1065, dhv: 1864,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3300", name: "Claret", region: "Claret",
    lat: 43.8757, lon: 3.8867, elevation: 355, dhv: 3300,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3105", name: "Clerval", region: "Clerval",
    lat: 47.3911, lon: 6.5075, elevation: 501, dhv: 3105,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2212", name: "Clot du Ciel", region: "Aurel",
    lat: 44.6712, lon: 5.3212, elevation: 1091, dhv: 2212,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3130", name: "Clucy", region: "Salins-les-Bains",
    lat: 46.9464, lon: 5.895, elevation: 700, dhv: 3130,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2206", name: "Col Bas", region: "Seynes les Alpes",
    lat: 44.3846, lon: 6.3961, elevation: 2155, dhv: 2206,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4967", name: "Col d'Aulac", region: "Le Vaulmier",
    lat: 45.1941, lon: 2.5822, elevation: 1202, dhv: 4967,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2210", name: "Col D'Ey", region: "Sainte Jalle",
    lat: 44.311, lon: 5.2819, elevation: 797, dhv: 2210,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_4578_NW", name: "Col de Bataille (NW)", region: "Speloncato",
    lat: 42.5485, lon: 8.9983, elevation: 1115, dhv: 4578,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4578_W", name: "Col de Bataille (W)", region: "Speloncato",
    lat: 42.5505, lon: 9.0084, elevation: 1153, dhv: 4578,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5075", name: "Col de Chaussy", region: "Sainte-Marie-de-Cuines",
    lat: 45.3469, lon: 6.3448, elevation: 1674, dhv: 5075,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5264", name: "Col de Couraduque", region: "Aucun",
    lat: 42.9966, lon: -0.1886, elevation: 1451, dhv: 5264,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1264_NW", name: "Col de Forclaz (NW)", region: "Doussard",
    lat: 45.8084, lon: 6.2443, elevation: 1153, dhv: 1264,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1264_SW", name: "Col de Forclaz (SW)", region: "Doussard",
    lat: 45.8116, lon: 6.2445, elevation: 1189, dhv: 1264,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1264_W", name: "Col de Forclaz (W)", region: "Doussard",
    lat: 45.8141, lon: 6.247, elevation: 1288, dhv: 1264,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_3334", name: "Col de la Core", region: "Bethmale",
    lat: 42.8616, lon: 1.1084, elevation: 1452, dhv: 3334,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3315", name: "Col de la Courade", region: "Campan",
    lat: 42.9981, lon: 0.1681, elevation: 1257, dhv: 3315,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_2318", name: "Col de la Loze", region: "Bozel",
    lat: 45.4081, lon: 6.6027, elevation: 2294, dhv: 2318,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2199", name: "Col de Meyrand", region: "Valgorge",
    lat: 44.6068, lon: 4.0761, elevation: 1376, dhv: 2199,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4961", name: "Col de Pailheres", region: "Mijanes",
    lat: 42.7343, lon: 2.0063, elevation: 1923, dhv: 4961,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3345", name: "Col de Salvi", region: "Montegrosso",
    lat: 42.5524, lon: 8.8631, elevation: 497, dhv: 3345,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3195", name: "Col de Serre", region: "Dienne",
    lat: 45.1333, lon: 2.789, elevation: 1443, dhv: 3195,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2298", name: "Col de Vassieux", region: "Die",
    lat: 44.8288, lon: 5.358, elevation: 1336, dhv: 2298,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2302", name: "Col de Volent", region: "Joncheres",
    lat: 44.5588, lon: 5.3827, elevation: 1486, dhv: 2302,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3156", name: "Col des Fretes", region: "Talloires",
    lat: 45.8565, lon: 6.2465, elevation: 1619, dhv: 3156,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1883", name: "Col du Banchet", region: "Verel",
    lat: 45.5668, lon: 5.7315, elevation: 560, dhv: 1883,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1866", name: "Col du Deves", region: "Roynac",
    lat: 44.6593, lon: 4.9357, elevation: 434, dhv: 1866,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5019", name: "Col du Granon", region: "Saint-Chaffrey",
    lat: 44.9641, lon: 6.6028, elevation: 2395, dhv: 5019,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2143", name: "Col du Lachens Nord", region: "La Roque Esclapon",
    lat: 43.745, lon: 6.653, elevation: 1657, dhv: 2143,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2144", name: "Col du Lachens Süd", region: "La Roque Esclapon",
    lat: 43.7445, lon: 6.657, elevation: 1616, dhv: 2144,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2145", name: "Col du Lachens West", region: "La Roque Esclapon",
    lat: 43.7391, lon: 6.641, elevation: 1427, dhv: 2145,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5027", name: "Col du Noyer", region: "Le Noyer",
    lat: 44.6913, lon: 5.986, elevation: 1655, dhv: 5027,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2299", name: "Col du Russet", region: "Die",
    lat: 44.8322, lon: 5.4126, elevation: 1511, dhv: 2299,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1275", name: "Col du Sapenay", region: "Chindrieux",
    lat: 45.811, lon: 5.8643, elevation: 867, dhv: 1275,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1856", name: "Col du Serpaton", region: "Gresse en Vercors",
    lat: 44.91, lon: 5.5905, elevation: 1578, dhv: 1856,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1865", name: "Col du Trallu", region: "Peyrus",
    lat: 44.8901, lon: 5.1413, elevation: 994, dhv: 1865,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3282", name: "Colle di Tende", region: "Tende",
    lat: 44.1503, lon: 7.5673, elevation: 1883, dhv: 3282,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1961", name: "Colombiers", region: "Entraigues",
    lat: 44.8687, lon: 5.9311, elevation: 1693, dhv: 1961,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3020", name: "Combe", region: "Osmoy-Saint-Valery",
    lat: 49.7877, lon: 1.2941, elevation: 142, dhv: 3020,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5068", name: "Combottier", region: "Bourg St. Maurice",
    lat: 45.6524, lon: 6.8143, elevation: 2027, dhv: 5068,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4880", name: "Commes", region: "Commes",
    lat: 49.3464, lon: -0.7259, elevation: 47, dhv: 4880,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3243", name: "Compolibat", region: "Compolibat",
    lat: 44.3632, lon: 2.2064, elevation: 601, dhv: 3243,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1844", name: "Connex", region: "Notre Dame de Vaux",
    lat: 44.9964, lon: 5.7307, elevation: 1598, dhv: 1844,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2147", name: "Contras", region: "L&#039;Hospitalet",
    lat: 44.1164, lon: 5.7239, elevation: 1613, dhv: 2147,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5036", name: "Corbara", region: "Corbara",
    lat: 42.6166, lon: 8.9035, elevation: 290, dhv: 5036,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3323", name: "Cornudere", region: "Arbas",
    lat: 42.9581, lon: 0.8907, elevation: 1528, dhv: 3323,
    sectors: [[348.75, 191.25]], sectorLabel: "N-S", ...DEF },

  { id: "db_1795", name: "Costias", region: "Les Orres",
    lat: 44.5232, lon: 6.5558, elevation: 1729, dhv: 1795,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1847", name: "Cote 2000", region: "Villard de Lans",
    lat: 45.03, lon: 5.568, elevation: 1694, dhv: 1847,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5050", name: "Cote de Bienne", region: "Saint-Claude",
    lat: 46.4392, lon: 5.8813, elevation: 870, dhv: 5050,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3208", name: "Cote de Jor", region: "Saint-Leon-sur-Vezere",
    lat: 45.0171, lon: 1.0709, elevation: 219, dhv: 3208,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2157", name: "Cote du Baron", region: "Privas",
    lat: 44.7123, lon: 4.6031, elevation: 499, dhv: 2157,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3109", name: "Cote du Bois des Grands Cantons", region: "Vieilley",
    lat: 47.3253, lon: 6.0902, elevation: 571, dhv: 3109,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5060", name: "Cote Rouge", region: "Colombier",
    lat: 47.6703, lon: 6.2542, elevation: 332, dhv: 5060,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5022", name: "Couchon d'Ancelle", region: "Saint-Leger-Les-Meleres",
    lat: 44.6357, lon: 6.2238, elevation: 1967, dhv: 5022,
    sectors: [[213.75, 236.25], [213.75, 281.25]], sectorLabel: "SW · SW-W", ...DEF },

  { id: "db_5071", name: "Courchevel", region: "Saint-Bon-Tarentaise",
    lat: 45.417, lon: 6.6353, elevation: 1727, dhv: 5071,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1802", name: "Courchon", region: "Moustiers St. Marie",
    lat: 43.843, lon: 6.2302, elevation: 907, dhv: 1802,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_4920_S", name: "Courousse (S)", region: "La Chapelle-Saint-Florent",
    lat: 47.3221, lon: -1.0411, elevation: 52, dhv: 4920,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4920_SO", name: "Courousse (SO)", region: "La Chapelle-Saint-Florent",
    lat: 47.3199, lon: -1.0442, elevation: 53, dhv: 4920,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1851", name: "Courtet", region: "St. Baudille",
    lat: 44.7701, lon: 5.7984, elevation: 1355, dhv: 1851,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3001", name: "Cran Aux Oeufs", region: "Audighen",
    lat: 50.847, lon: 1.5845, elevation: 29, dhv: 3001,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3230", name: "Crayssac", region: "Parnac",
    lat: 44.503, lon: 1.3206, elevation: 241, dhv: 3230,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4916_O", name: "Cret de L'Oeillon (O)", region: "Doizieux",
    lat: 45.3937, lon: 4.613, elevation: 1321, dhv: 4916,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_4916_S", name: "Cret de L'Oeillon (S)", region: "Doizieux",
    lat: 45.3887, lon: 4.6044, elevation: 1373, dhv: 4916,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2204", name: "Crete de Charmy", region: "Confort",
    lat: 46.1609, lon: 5.8358, elevation: 976, dhv: 2204,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1810", name: "Crete du Merle", region: "La Clusaz",
    lat: 45.8967, lon: 6.4406, elevation: 1476, dhv: 1810,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2182", name: "Croix de Boutieres", region: "Boree",
    lat: 44.8989, lon: 4.1863, elevation: 1498, dhv: 2182,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2297", name: "Croix de Justin", region: "Die",
    lat: 44.7433, lon: 5.3497, elevation: 934, dhv: 2297,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3164", name: "Croix de St Sandoux", region: "Saint Sandoux",
    lat: 45.6321, lon: 3.1162, elevation: 766, dhv: 3164,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2314", name: "Croix Rampau", region: "Polemieux",
    lat: 45.8676, lon: 4.8012, elevation: 447, dhv: 2314,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3288", name: "Cucuyon", region: "Archail",
    lat: 44.1068, lon: 6.362, elevation: 1755, dhv: 3288,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2209", name: "Cuges les Pins", region: "Cuges les Pins",
    lat: 43.2806, lon: 5.6698, elevation: 464, dhv: 2209,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4997", name: "Cuyerosse", region: "Aucun",
    lat: 42.9813, lon: -0.1925, elevation: 1181, dhv: 4997,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4938", name: "Dannes", region: "Dannes",
    lat: 50.5799, lon: 1.6319, elevation: 153, dhv: 4938,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1797", name: "Dauban", region: "Banon",
    lat: 44.0105, lon: 5.6545, elevation: 851, dhv: 1797,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3313", name: "Daüsse", region: "Soueich",
    lat: 43.0478, lon: 0.7918, elevation: 549, dhv: 3313,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3026", name: "Deliette", region: "Flamanville",
    lat: 49.5577, lon: 1.8505, elevation: 39, dhv: 3026,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1861", name: "Dent de Crolles", region: "Saint Hilaire",
    lat: 45.3087, lon: 5.8549, elevation: 2032, dhv: 1861,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1858_NW", name: "Dent Percee (NW)", region: "Lans en Versors",
    lat: 45.1043, lon: 5.6189, elevation: 1779, dhv: 1858,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1858_W", name: "Dent Percee (W)", region: "Lans en Versors",
    lat: 45.0993, lon: 5.5952, elevation: 1396, dhv: 1858,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3144_NW", name: "Des Gros Gres (NW)", region: "Blanot",
    lat: 46.5042, lon: 4.7574, elevation: 449, dhv: 3144,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3144_W", name: "Des Gros Gres (W)", region: "Blanot",
    lat: 46.4962, lon: 4.7508, elevation: 520, dhv: 3144,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4939", name: "Dezize-les-Maranges", region: "Dezize-les-Maranges",
    lat: 46.9129, lon: 4.6639, elevation: 421, dhv: 4939,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4925", name: "Dielette", region: "Siouville-Hague",
    lat: 49.5577, lon: -1.8507, elevation: 36, dhv: 4925,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5087", name: "Domes di Miage", region: "Les Contamines",
    lat: 45.8149, lon: 6.7961, elevation: 3558, dhv: 5087,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5017_NW", name: "Dormillouse (NW)", region: "Montclar",
    lat: 44.4081, lon: 6.3856, elevation: 2459, dhv: 5017,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5017_W", name: "Dormillouse (W)", region: "Montclar",
    lat: 44.4032, lon: 6.3703, elevation: 1868, dhv: 5017,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3238", name: "Douelle", region: "Douelle",
    lat: 44.4637, lon: 1.3722, elevation: 285, dhv: 3238,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5009_N", name: "Dourgne (N)", region: "Dourgne",
    lat: 43.4794, lon: 2.1638, elevation: 547, dhv: 5009,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5009_NW", name: "Dourgne (NW)", region: "Dourgne",
    lat: 43.4777, lon: 2.1553, elevation: 523, dhv: 5009,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3236", name: "Dreuilh", region: "Larnagol",
    lat: 44.4805, lon: 1.7948, elevation: 297, dhv: 3236,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3064", name: "Du Coucou", region: "Bassemberg",
    lat: 48.3001, lon: 7.3089, elevation: 760, dhv: 3064,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1863", name: "Du Fort", region: "Mevouillon",
    lat: 44.2382, lon: 5.4822, elevation: 1081, dhv: 1863,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3221", name: "Dune de Pyla", region: "La Teste-de-Buch",
    lat: 44.586, lon: -1.2149, elevation: 56, dhv: 3221,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3023", name: "Ecalgrain", region: "Laye",
    lat: 49.6941, lon: 1.9331, elevation: 98, dhv: 3023,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_4921", name: "Ecalgrain", region: "Auderuille",
    lat: 49.694, lon: -1.9331, elevation: 98, dhv: 4921,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3122", name: "Echevannes les Doues", region: "Enchevannes",
    lat: 47.0672, lon: 6.2342, elevation: 691, dhv: 3122,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3339", name: "Ens", region: "Ens",
    lat: 42.8058, lon: 0.3326, elevation: 1323, dhv: 3339,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1825", name: "Entrevernes", region: "Lathuile",
    lat: 45.7889, lon: 6.1938, elevation: 824, dhv: 1825,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2417", name: "Etretat 1", region: "Etretat",
    lat: 49.7114, lon: 0.2056, elevation: 53, dhv: 2417,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2418", name: "Etretat 2", region: "Etretat",
    lat: 49.6977, lon: 0.1822, elevation: 50, dhv: 2418,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2164", name: "Evosges", region: "Evosges",
    lat: 45.9513, lon: 5.4863, elevation: 718, dhv: 2164,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2412", name: "Fecamp", region: "Fecamp",
    lat: 49.7511, lon: 0.3508, elevation: 72, dhv: 2412,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1812", name: "Flegere", region: "Chamonix",
    lat: 45.9686, lon: 6.8756, elevation: 2364, dhv: 1812,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_3349", name: "Fontfrede", region: "Ceret",
    lat: 42.4502, lon: 2.7643, elevation: 1008, dhv: 3349,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5005", name: "Forca Real", region: "Montner",
    lat: 42.7266, lon: 2.7015, elevation: 448, dhv: 5005,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3112", name: "Fort de la Dame Blanche", region: "Bonnay",
    lat: 47.3186, lon: 6.0604, elevation: 595, dhv: 3112,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5064", name: "Fort de la Plate", region: "Bourg St. Maurice",
    lat: 45.5875, lon: 6.7436, elevation: 1960, dhv: 5064,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3116_NO", name: "Fort de Planoise (NO)", region: "Beure",
    lat: 47.2084, lon: 5.9837, elevation: 443, dhv: 3116,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3116_SW", name: "Fort de Planoise (SW)", region: "Beure",
    lat: 47.2045, lon: 5.9776, elevation: 467, dhv: 3116,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3115", name: "Fort de Rosemont", region: "Besancon",
    lat: 47.2216, lon: 5.9994, elevation: 432, dhv: 3115,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1884", name: "Fort du Truc", region: "Bourg St. Maurice",
    lat: 45.633, lon: 6.75, elevation: 1745, dhv: 1884,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3008", name: "Frencq", region: "Frencq",
    lat: 50.5592, lon: 1.6679, elevation: 132, dhv: 3008,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5047", name: "Frenelots", region: "Les Fins",
    lat: 47.0603, lon: 6.6393, elevation: 948, dhv: 5047,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2546", name: "Fumay", region: "Fumay",
    lat: 49.9873, lon: 4.7209, elevation: 364, dhv: 2546,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3222", name: "Gap Charance", region: "Gap",
    lat: 44.5673, lon: 6.0183, elevation: 1545, dhv: 3222,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2188", name: "Garde-Grosse", region: "Nyons",
    lat: 44.3367, lon: 5.1543, elevation: 924, dhv: 2188,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3207", name: "Gaudissont", region: "Saint-Jean-en-Royans",
    lat: 45.0068, lon: 5.3174, elevation: 843, dhv: 3207,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3310", name: "Gensac", region: "Gensac-sur-Garonne",
    lat: 43.2126, lon: 1.1313, elevation: 304, dhv: 3310,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4965", name: "Ginoles", region: "Ginoles",
    lat: 42.8747, lon: 2.1513, elevation: 671, dhv: 4965,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2291", name: "Gippieres", region: "Malaucene",
    lat: 44.168, lon: 5.1015, elevation: 512, dhv: 2291,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2300", name: "Glandasse", region: "Chatillon en Diois",
    lat: 44.7255, lon: 5.4864, elevation: 1756, dhv: 2300,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2165", name: "Glandieu", region: "St. Benoit",
    lat: 45.6716, lon: 5.6152, elevation: 453, dhv: 2165,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4875", name: "Glennes", region: "Revillon",
    lat: 49.366, lon: 3.7071, elevation: 111, dhv: 4875,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1787", name: "Gourdon", region: "Gourdon",
    lat: 43.7231, lon: 6.9439, elevation: 1124, dhv: 1787,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5014", name: "Grand Berard", region: "Barcelonnette",
    lat: 44.4192, lon: 6.6511, elevation: 2174, dhv: 5014,
    sectors: [[78.75, 281.25]], sectorLabel: "O-W", ...DEF },

  { id: "db_3126", name: "Grand Bois Bannal", region: "Arc sous Cicon",
    lat: 47.0372, lon: 6.3862, elevation: 931, dhv: 3126,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4944", name: "Grand Chassaigne", region: "Verze",
    lat: 46.3948, lon: 4.7282, elevation: 466, dhv: 4944,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2213", name: "Grand Cret", region: "Quincie",
    lat: 46.1262, lon: 4.5822, elevation: 676, dhv: 2213,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3019", name: "Grand Terne", region: "Joigny-sur-Meuse",
    lat: 49.8416, lon: 4.7633, elevation: 236, dhv: 3019,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3188", name: "Grand Togny", region: "Vanosc",
    lat: 45.2484, lon: 4.5363, elevation: 1130, dhv: 3188,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4929", name: "Granville", region: "Granville",
    lat: 48.835, lon: -1.6117, elevation: 34, dhv: 4929,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3048", name: "Grauves", region: "Grauves",
    lat: 48.9825, lon: 3.9637, elevation: 228, dhv: 3048,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1789", name: "Greolieres", region: "Greolieres",
    lat: 43.8097, lon: 6.9592, elevation: 1495, dhv: 1789,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3141", name: "Grusse", region: "Grusse",
    lat: 46.5895, lon: 5.5091, elevation: 452, dhv: 3141,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3150", name: "Gueret", region: "Gueret",
    lat: 46.1702, lon: 1.8301, elevation: 581, dhv: 3150,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1341", name: "Gustiberg", region: "Urbes",
    lat: 47.8937, lon: 6.9344, elevation: 1007, dhv: 1341,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5078", name: "Habere-Poche", region: "Habere-Poche",
    lat: 46.2383, lon: 6.4944, elevation: 1493, dhv: 5078,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1999", name: "Haselbourg", region: "Haselbourg",
    lat: 48.684, lon: 7.1995, elevation: 369, dhv: 1999,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1995", name: "Hatrize", region: "Hatrize",
    lat: 49.1868, lon: 5.8937, elevation: 205, dhv: 1995,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2539", name: "Haulme", region: "Haulme",
    lat: 49.8628, lon: 4.7787, elevation: 303, dhv: 2539,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3090", name: "Haut de Comte", region: "Saulxures-sur-Moselotte",
    lat: 47.9606, lon: 6.799, elevation: 841, dhv: 3090,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4998", name: "Hautacam", region: "Prechac",
    lat: 42.9823, lon: -0.0328, elevation: 1197, dhv: 4998,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1991", name: "Haute-Kontz", region: "Contz",
    lat: 49.4554, lon: 6.3302, elevation: 228, dhv: 1991,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4946", name: "Henouville", region: "Henouville",
    lat: 49.4798, lon: 0.9405, elevation: 81, dhv: 4946,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4930", name: "Hermonville", region: "Hermonville",
    lat: 49.3405, lon: 3.8938, elevation: 184, dhv: 4930,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3080", name: "Hohrodberg", region: "Hohrod",
    lat: 48.0693, lon: 7.1308, elevation: 920, dhv: 3080,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1998", name: "Hommert", region: "Hommert",
    lat: 48.6804, lon: 7.189, elevation: 429, dhv: 1998,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2166", name: "Innimond Ost", region: "Innimond",
    lat: 45.7848, lon: 5.5918, elevation: 1022, dhv: 2166,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2167", name: "Innimond West", region: "Innimond",
    lat: 45.7974, lon: 5.5794, elevation: 1077, dhv: 2167,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1845", name: "Jas d'Oris", region: "Oris-en-Rattier",
    lat: 44.9283, lon: 5.8868, elevation: 1721, dhv: 1845,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3043", name: "Jeufosse", region: "Jeufosse",
    lat: 49.036, lon: 1.5393, elevation: 125, dhv: 3043,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3053", name: "Joselle", region: "Geville",
    lat: 48.7842, lon: 5.6806, elevation: 352, dhv: 3053,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1990_NO", name: "Kanfen (NO)", region: "Kanfen",
    lat: 49.4469, lon: 6.0997, elevation: 416, dhv: 1990,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1990_SO", name: "Kanfen (SO)", region: "Kanfen",
    lat: 49.4441, lon: 6.0968, elevation: 410, dhv: 1990,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3069", name: "Kemberg", region: "Saulcy-Sur-Meurthe",
    lat: 48.2567, lon: 6.932, elevation: 723, dhv: 3069,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1792", name: "Kennedy", region: "Bar sur Loup",
    lat: 43.7041, lon: 6.9807, elevation: 591, dhv: 1792,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_4915", name: "Kervel", region: "Kervel",
    lat: 48.1251, lon: -4.2719, elevation: 32, dhv: 4915,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3078", name: "Kervigen", region: "Plomodiern",
    lat: 48.157, lon: -4.2782, elevation: 42, dhv: 3078,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1857", name: "L'Aigle", region: "Lans en Vercors",
    lat: 45.1184, lon: 5.5972, elevation: 1280, dhv: 1857,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1959", name: "L'Aiguille", region: "Chamrousse",
    lat: 45.1301, lon: 5.8833, elevation: 1804, dhv: 1959,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1853", name: "L'Alevoux", region: "St. Pierre",
    lat: 45.1224, lon: 5.3789, elevation: 794, dhv: 1853,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1798_O", name: "L'Andran (O)", region: "Digne les Bains",
    lat: 44.1157, lon: 6.2137, elevation: 1195, dhv: 1798,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1798_SW", name: "L'Andran (SW)", region: "Digne les Bains",
    lat: 44.1138, lon: 6.2148, elevation: 1177, dhv: 1798,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3152", name: "L'Angleton", region: "Le Poizat",
    lat: 46.1423, lon: 5.7056, elevation: 1145, dhv: 3152,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2317", name: "L'Arclusaz", region: "St. Pierre D&#039;Albigny",
    lat: 45.5916, lon: 6.1752, elevation: 1438, dhv: 2317,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1868", name: "L'Ebaudia", region: "Albertville",
    lat: 45.6076, lon: 6.3812, elevation: 1665, dhv: 1868,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5039", name: "L'Eclose", region: "Alpe d Huez",
    lat: 45.0875, lon: 6.0646, elevation: 1761, dhv: 5039,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5043", name: "L'Escalet", region: "Ramatuelle",
    lat: 43.1845, lon: 6.6378, elevation: 139, dhv: 5043,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_4975_NW", name: "L'Etang (NW)", region: "Saint-Beat",
    lat: 42.9023, lon: 0.7672, elevation: 1793, dhv: 4975,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4975_W", name: "L'Etang (W)", region: "Saint-Beat",
    lat: 42.8983, lon: 0.7551, elevation: 1705, dhv: 4975,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3028", name: "L'Otan", region: "Octeville-sur-Mer",
    lat: 49.5474, lon: 0.0861, elevation: 94, dhv: 3028,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3319", name: "La Bergerie", region: "Prechac",
    lat: 42.9823, lon: 0.0329, elevation: 1195, dhv: 3319,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3283", name: "La Bicyclette", region: "Saint-Antonin",
    lat: 44.1435, lon: 1.7722, elevation: 353, dhv: 3283,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3097", name: "La Bouloie", region: "Bussang",
    lat: 47.8701, lon: 6.8668, elevation: 1054, dhv: 3097,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1834", name: "La Bourgeoise", region: "Samoen",
    lat: 46.1151, lon: 6.7203, elevation: 1741, dhv: 1834,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1878", name: "La Cachette", region: "Bourg St. Maurice",
    lat: 45.584, lon: 6.804, elevation: 2129, dhv: 1878,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5041", name: "La Cadiere D'Azur", region: "La Cardiere D&#039;Azur",
    lat: 43.1971, lon: 5.7366, elevation: 219, dhv: 5041,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1850", name: "La Chapelle", region: "Allevard",
    lat: 45.3852, lon: 6.0387, elevation: 996, dhv: 1850,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1832", name: "La Chapelle des Hermones", region: "Ocier",
    lat: 46.3069, lon: 6.5181, elevation: 1303, dhv: 1832,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1826", name: "La Charmante", region: "Bellegrade",
    lat: 46.1382, lon: 5.856, elevation: 1340, dhv: 1826,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3075", name: "La Closerie", region: "Le Bonhomme",
    lat: 48.1872, lon: 7.0958, elevation: 1066, dhv: 3075,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3782_NO", name: "La Clusaz (NO)", region: "La Clusaz",
    lat: 45.901, lon: 6.4602, elevation: 1451, dhv: 3782,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3782_NW", name: "La Clusaz (NW)", region: "La Clusaz",
    lat: 45.8912, lon: 6.4515, elevation: 1829, dhv: 3782,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4890", name: "La Cochette", region: "Bue",
    lat: 47.3152, lon: 2.7804, elevation: 364, dhv: 4890,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3010", name: "La Comte", region: "La Comte",
    lat: 50.4164, lon: 2.5132, elevation: 163, dhv: 3010,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3128", name: "La Cote des Sapenetes", region: "Amathay-Vesigneux",
    lat: 47.0178, lon: 6.2155, elevation: 859, dhv: 3128,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1994", name: "La Cote Saint Germain", region: "Lion-Devent-Dun",
    lat: 49.4105, lon: 5.2525, elevation: 322, dhv: 1994,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1796", name: "La Croix", region: "Banon",
    lat: 44.0497, lon: 5.6351, elevation: 1041, dhv: 1796,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1960", name: "La Croix", region: "Chamrousse",
    lat: 45.1252, lon: 5.899, elevation: 2160, dhv: 1960,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3204", name: "La Denise", region: "Le Puy-en-Velay",
    lat: 45.0582, lon: 3.8541, elevation: 876, dhv: 3204,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3005", name: "La Falaise", region: "Equihen-Plage",
    lat: 50.6796, lon: 1.5671, elevation: 25, dhv: 3005,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1872", name: "La Fenetre 7", region: "La Bathie",
    lat: 45.6504, lon: 6.4675, elevation: 1411, dhv: 1872,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3182", name: "La Fournaise", region: "Chaumeil",
    lat: 45.4685, lon: 1.8499, elevation: 871, dhv: 3182,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5020", name: "La Grave", region: "La Grave",
    lat: 45.0099, lon: 6.2636, elevation: 3196, dhv: 5020,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3056", name: "La Guimorais", region: "Saint-Coulomb",
    lat: 48.694, lon: -1.9372, elevation: 29, dhv: 3056,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3224", name: "La Haute-Beaume", region: "La Haute-Beaume",
    lat: 44.5629, lon: 5.6458, elevation: 1442, dhv: 3224,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3029", name: "La Heve", region: "Sainte-Adresse",
    lat: 49.5111, lon: 0.0681, elevation: 77, dhv: 3029,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3187", name: "La Jasserie", region: "La Valla-en-Gier",
    lat: 45.3852, lon: 4.5678, elevation: 1366, dhv: 3187,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4951", name: "La Jonchere", region: "La Jonchere",
    lat: 46.0061, lon: 1.4448, elevation: 665, dhv: 4951,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1843", name: "La Lia", region: "Cognin les Georges",
    lat: 45.1754, lon: 5.4372, elevation: 688, dhv: 1843,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2170", name: "La Liouffe", region: "Ancy",
    lat: 45.8384, lon: 4.495, elevation: 702, dhv: 2170,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1336_S", name: "La Longeagne (S)", region: "Aspres",
    lat: 44.5408, lon: 5.7129, elevation: 1517, dhv: 1336,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1336_SW", name: "La Longeagne (SW)", region: "Aspres",
    lat: 44.5505, lon: 5.7019, elevation: 1529, dhv: 1336,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3284", name: "La Marche", region: "Saint-Antonin",
    lat: 44.145, lon: 1.7799, elevation: 316, dhv: 3284,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2321", name: "La Masse", region: "Les Menuires",
    lat: 45.2967, lon: 6.5092, elevation: 2753, dhv: 2321,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3103", name: "La Mine D'or", region: "Penestin",
    lat: 47.4831, lon: -2.4959, elevation: 12, dhv: 3103,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3111", name: "La Montagne", region: "Grenois",
    lat: 47.3251, lon: 3.538, elevation: 358, dhv: 3111,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2176", name: "La Montagnes du Puy", region: "Lesches-en-Diois",
    lat: 44.6091, lon: 5.5459, elevation: 1450, dhv: 2176,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3191", name: "La Paille", region: "Satillieu",
    lat: 45.1439, lon: 4.6251, elevation: 773, dhv: 3191,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3215", name: "La Palombiere", region: "Saint-Cyprien",
    lat: 44.8598, lon: 1.0203, elevation: 198, dhv: 3215,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2419", name: "La Place", region: "Cap D&#039;Antifer",
    lat: 49.6899, lon: 0.1706, elevation: 82, dhv: 2419,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4979", name: "La Plogne", region: "Cajarc",
    lat: 44.4822, lon: 1.8351, elevation: 282, dhv: 4979,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2171", name: "La Poletta", region: "La Rosiere",
    lat: 45.6366, lon: 6.8583, elevation: 2119, dhv: 2171,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3181", name: "La Roche Nite", region: "Compains",
    lat: 45.4675, lon: 2.9972, elevation: 1156, dhv: 3181,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2163", name: "La Roche Parstire", region: "Areches",
    lat: 45.6811, lon: 6.6009, elevation: 1944, dhv: 2163,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3066_NO", name: "La Roche St. Martin (NO)", region: "Saint-Die-Des Vosges",
    lat: 48.2786, lon: 6.9326, elevation: 573, dhv: 3066,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3066_NW", name: "La Roche St. Martin (NW)", region: "Saint-Die-Des Vosges",
    lat: 48.2722, lon: 6.9309, elevation: 649, dhv: 3066,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5067", name: "La Rosiere", region: "Bourg St. Maurice",
    lat: 45.6253, lon: 6.8493, elevation: 1785, dhv: 5067,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1848_S", name: "La Scia (S)", region: "St. Pierre",
    lat: 45.3451, lon: 5.8482, elevation: 1684, dhv: 1848,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1848_W", name: "La Scia (W)", region: "St. Pierre",
    lat: 45.3454, lon: 5.8459, elevation: 1650, dhv: 1848,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3301_S", name: "La Seranne (S)", region: "Les Prats",
    lat: 43.8678, lon: 3.6391, elevation: 878, dhv: 3301,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3301_SO", name: "La Seranne (SO)", region: "Les Prats",
    lat: 43.8691, lon: 3.6406, elevation: 896, dhv: 3301,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3301_SW", name: "La Seranne (SW)", region: "Les Prats",
    lat: 43.8679, lon: 3.6367, elevation: 896, dhv: 3301,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3301_W", name: "La Seranne (W)", region: "Les Prats",
    lat: 43.8706, lon: 3.6404, elevation: 920, dhv: 3301,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2172", name: "La Sevoliere", region: "La Rosiere",
    lat: 45.6401, lon: 6.8519, elevation: 2096, dhv: 2172,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3081", name: "La Sotiere", region: "Sapois",
    lat: 48.0395, lon: 6.782, elevation: 913, dhv: 3081,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3183", name: "La Table D'Orientation", region: "Chaumeil",
    lat: 45.4713, lon: 1.8425, elevation: 895, dhv: 3183,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1816", name: "La Tour", region: "Sault",
    lat: 44.0413, lon: 5.4034, elevation: 993, dhv: 1816,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2195", name: "La Trappe", region: "Mevouillon",
    lat: 44.2358, lon: 5.5119, elevation: 1083, dhv: 2195,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5038", name: "La Trappe", region: "Mevouillon",
    lat: 44.2531, lon: 5.5059, elevation: 1129, dhv: 5038,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2191", name: "La Vesanciere", region: "Vesancy",
    lat: 46.3678, lon: 6.0802, elevation: 1269, dhv: 2191,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4943", name: "La Vierge", region: "Cortambert",
    lat: 46.4603, lon: 4.7173, elevation: 461, dhv: 4943,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2292", name: "La Viste", region: "Marseille",
    lat: 43.3608, lon: 5.3556, elevation: 133, dhv: 2292,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3340_NO", name: "Lac de Oo (NO)", region: "Oo",
    lat: 42.7907, lon: 0.4923, elevation: 1370, dhv: 3340,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3340_O", name: "Lac de Oo (O)", region: "Oo",
    lat: 42.7858, lon: 0.4912, elevation: 1560, dhv: 3340,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_3340_SO", name: "Lac de Oo (SO)", region: "Oo",
    lat: 42.7991, lon: 0.4892, elevation: 1482, dhv: 3340,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5021", name: "Lac du Pontet", region: "La Grave",
    lat: 45.0502, lon: 6.3546, elevation: 2013, dhv: 5021,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3110", name: "Lac Kyr", region: "Plombieres-les-Dijon",
    lat: 47.3262, lon: 4.9862, elevation: 323, dhv: 3110,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_2544", name: "Laifour", region: "Laifour",
    lat: 49.9171, lon: 4.7046, elevation: 336, dhv: 2544,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3089", name: "Lambert", region: "Saulxures-sur-Moselotte",
    lat: 47.9643, lon: 6.8039, elevation: 915, dhv: 3089,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4923", name: "Landemer", region: "Urville-Nacqueville",
    lat: 49.6787, lon: -1.7744, elevation: 77, dhv: 4923,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5072", name: "Lanslevillard", region: "Lanslevillard",
    lat: 45.2736, lon: 6.936, elevation: 2316, dhv: 5072,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3241", name: "Laparade", region: "Laparade",
    lat: 44.3835, lon: 0.4427, elevation: 167, dhv: 3241,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4980", name: "Laparade 2", region: "Laparade",
    lat: 44.3909, lon: 0.4559, elevation: 166, dhv: 4980,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3302", name: "Lauret", region: "Sauteyrargues",
    lat: 43.8393, lon: 3.8984, elevation: 273, dhv: 3302,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1790", name: "Lavina", region: "Sospel",
    lat: 43.8669, lon: 7.4135, elevation: 1092, dhv: 1790,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3163", name: "Le Bien", region: "Job",
    lat: 45.6236, lon: 3.7605, elevation: 976, dhv: 3163,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4885", name: "Le Billot", region: "L&#039;Oudon",
    lat: 48.9652, lon: 0.0712, elevation: 173, dhv: 4885,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1265", name: "Le Brèvent", region: "Chamonix",
    lat: 45.9366, lon: 6.8512, elevation: 2045, dhv: 1265,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1805_SO", name: "Le Chalvet (SO)", region: "Saint Andre les Alpes",
    lat: 43.9766, lon: 6.4914, elevation: 1515, dhv: 1805,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1805_W", name: "Le Chalvet (W)", region: "Saint Andre les Alpes",
    lat: 43.9784, lon: 6.4798, elevation: 1568, dhv: 1805,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2203", name: "Le Chanay", region: "Tenay",
    lat: 45.9437, lon: 5.5124, elevation: 947, dhv: 2203,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5040", name: "Le Chatel", region: "Mens",
    lat: 44.8168, lon: 5.8108, elevation: 1862, dhv: 5040,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2162", name: "Le Cormet de Roseland", region: "Beaufort sur Doron",
    lat: 45.6881, lon: 6.6942, elevation: 2030, dhv: 2162,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3162", name: "Le Cornillon", region: "Job",
    lat: 45.638, lon: 3.753, elevation: 1114, dhv: 3162,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2149", name: "Le Cousson", region: "Digne les Bains",
    lat: 44.0536, lon: 6.2392, elevation: 1479, dhv: 2149,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1830", name: "Le Couteau", region: "Ocier",
    lat: 46.2933, lon: 6.4992, elevation: 1314, dhv: 1830,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1852", name: "Le Cret", region: "Meaudre",
    lat: 45.1168, lon: 5.5164, elevation: 1320, dhv: 1852,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1359", name: "Le Drumont", region: "Urbes",
    lat: 47.8985, lon: 6.9191, elevation: 1174, dhv: 1359,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_5029", name: "Le Garlaban", region: "Aubagne",
    lat: 43.3309, lon: 5.5547, elevation: 585, dhv: 5029,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2161_SW", name: "Le Grand Colombier (SW)", region: "Culoz",
    lat: 45.8816, lon: 5.7574, elevation: 1424, dhv: 2161,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2161_W", name: "Le Grand Colombier (W)", region: "Culoz",
    lat: 45.9057, lon: 5.7614, elevation: 1512, dhv: 2161,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3030", name: "Le Grand Larris", region: "Ons-en-Bray",
    lat: 49.405, lon: 1.8984, elevation: 204, dhv: 3030,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1854", name: "Le Grand Ratz", region: "La Buisse",
    lat: 45.3275, lon: 5.6359, elevation: 810, dhv: 1854,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3171", name: "Le Grande Cascade", region: "Le Mont-Dore",
    lat: 45.5675, lon: 2.821, elevation: 1360, dhv: 3171,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3077", name: "Le Grande Roche", region: "Lapoutroie",
    lat: 48.1777, lon: 7.1594, elevation: 1015, dhv: 3077,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1890", name: "Le Grande Sure", region: "Alpe d&#039;Huez",
    lat: 45.0996, lon: 6.0602, elevation: 2090, dhv: 1890,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1835", name: "Le Hucel", region: "Lugrin",
    lat: 46.3991, lon: 6.7043, elevation: 944, dhv: 1835,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3170", name: "Le Mareuilh", region: "Le Mont-Dore",
    lat: 45.5692, lon: 2.8296, elevation: 1551, dhv: 3170,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3149", name: "Le Maupuy", region: "Gueret",
    lat: 46.1637, lon: 1.8377, elevation: 603, dhv: 3149,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3015", name: "Le Mont Clairon", region: "Neuville les Bray",
    lat: 49.9194, lon: 2.7294, elevation: 76, dhv: 3015,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3132", name: "Le Mont des 3 Croix", region: "Santenay",
    lat: 46.9196, lon: 4.6698, elevation: 503, dhv: 3132,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3298", name: "Le Piardel", region: "Plaisance",
    lat: 43.9266, lon: 2.5204, elevation: 588, dhv: 3298,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2138", name: "Le Pic", region: "Valdeblore",
    lat: 44.0582, lon: 7.2174, elevation: 1749, dhv: 2138,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_4977", name: "Le Pin Sec", region: "Naujac-sur-Mer",
    lat: 45.2651, lon: -1.1649, elevation: 15, dhv: 4977,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1869", name: "Le Plan de Languot", region: "Albertville",
    lat: 45.6818, lon: 6.322, elevation: 1157, dhv: 1869,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5056", name: "Le Plat du Mont", region: "Saint-Forgeux",
    lat: 45.8468, lon: 4.4711, elevation: 596, dhv: 5056,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2293", name: "Le Plateau", region: "La Seyne-sur-mer",
    lat: 43.0552, lon: 5.8586, elevation: 168, dhv: 2293,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5077", name: "Le Pleney", region: "Morzine",
    lat: 46.1696, lon: 6.693, elevation: 1486, dhv: 5077,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5081", name: "Le Prarion", region: "Saint-Gervais-les-Bains",
    lat: 45.8856, lon: 6.7518, elevation: 1846, dhv: 5081,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3167", name: "Le Puy Gros", region: "La Bourboule",
    lat: 45.5993, lon: 2.7897, elevation: 1469, dhv: 3167,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_4974", name: "Le Relais", region: "Arbas",
    lat: 43.0073, lon: 0.9188, elevation: 800, dhv: 4974,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1276_NW", name: "Le Revard (NW)", region: "Mery",
    lat: 45.6725, lon: 5.9732, elevation: 1417, dhv: 1276,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1276_SW", name: "Le Revard (SW)", region: "Mery",
    lat: 45.6832, lon: 5.9756, elevation: 1516, dhv: 1276,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3214", name: "Le Roc", region: "Souillac",
    lat: 44.8735, lon: 1.4506, elevation: 266, dhv: 3214,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4926", name: "Le Rozel", region: "Le Rozel",
    lat: 49.475, lon: -1.8436, elevation: 47, dhv: 4926,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1263", name: "Le Saix", region: "Samoen",
    lat: 46.0537, lon: 6.6976, elevation: 1630, dhv: 1263,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5000", name: "Le Serre", region: "Vignet",
    lat: 42.8342, lon: 0.2747, elevation: 1901, dhv: 5000,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5083", name: "Le Signal", region: "Les Contamines",
    lat: 45.7862, lon: 6.6954, elevation: 1863, dhv: 5083,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3244", name: "Le Single", region: "Ispagnac",
    lat: 44.3579, lon: 3.5404, elevation: 1024, dhv: 3244,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1874", name: "Le Sire", region: "Les Deserts",
    lat: 45.6314, lon: 5.9651, elevation: 1485, dhv: 1874,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3318", name: "Le Soc", region: "Aucun",
    lat: 42.9902, lon: 0.1964, elevation: 1369, dhv: 3318,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3205", name: "Le Temple", region: "Le Temple",
    lat: 45.0496, lon: 1.9262, elevation: 457, dhv: 3205,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1222_SO", name: "Le Treh (SO)", region: "Fellering",
    lat: 47.9263, lon: 7.0149, elevation: 1245, dhv: 1222,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1222_SW", name: "Le Treh (SW)", region: "Fellering",
    lat: 47.9256, lon: 7.0115, elevation: 1227, dhv: 1222,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2407", name: "Le Treport", region: "Treport",
    lat: 50.0594, lon: 1.3662, elevation: 66, dhv: 2407,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1907", name: "Le Trochet", region: "Saint Chaffrey",
    lat: 44.9521, lon: 6.5933, elevation: 1954, dhv: 1907,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_4877", name: "Le Vernet", region: "Le Vernet",
    lat: 46.1032, lon: 3.4541, elevation: 418, dhv: 4877,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3237", name: "Le Villard", region: "Les Salelles",
    lat: 44.4683, lon: 3.2715, elevation: 915, dhv: 3237,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3212", name: "Leoncel", region: "Leoncel",
    lat: 44.9048, lon: 5.2077, elevation: 1224, dhv: 3212,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5002", name: "Les Angles", region: "Les Angles",
    lat: 42.5729, lon: 2.0536, elevation: 2105, dhv: 5002,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5066", name: "Les Arcs", region: "Bourg St. Maurice",
    lat: 45.5738, lon: 6.8119, elevation: 2386, dhv: 5066,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2379", name: "Les Bouchaux", region: "La Bresse",
    lat: 47.9946, lon: 6.8893, elevation: 1004, dhv: 2379,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1811", name: "Les Carroz", region: "Les Carroz",
    lat: 46.0308, lon: 6.6704, elevation: 1805, dhv: 1811,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5065", name: "Les Chapelles", region: "Bourg St. Maurice",
    lat: 45.5949, lon: 6.7347, elevation: 1295, dhv: 5065,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4948", name: "Les Cheminets", region: "Equiqueville",
    lat: 49.808, lon: 1.2598, elevation: 145, dhv: 4948,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5049", name: "Les Cheneviers", region: "Saint-Claude",
    lat: 46.4243, lon: 5.8729, elevation: 869, dhv: 5049,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2319", name: "Les Deux Lacs", region: "Val Thorens",
    lat: 45.2915, lon: 6.5725, elevation: 2381, dhv: 2319,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5700", name: "Les deux Potes", region: "Crozet",
    lat: 46.2986, lon: 5.9833, elevation: 1514, dhv: 5700,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1860_SW", name: "Les Deux-Alpes (SW)", region: "Les Deux-Alpes",
    lat: 44.9967, lon: 6.1471, elevation: 2363, dhv: 1860,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1860_W", name: "Les Deux-Alpes (W)", region: "Les Deux-Alpes",
    lat: 44.9996, lon: 6.1285, elevation: 1665, dhv: 1860,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5032", name: "Les Goudes", region: "Marseille",
    lat: 43.2135, lon: 5.3486, elevation: 37, dhv: 5032,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1813", name: "Les Grand Montets", region: "Chamonix",
    lat: 45.9478, lon: 6.96, elevation: 3236, dhv: 1813,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3117", name: "Les Grands Pres", region: "Beure",
    lat: 47.195, lon: 5.9914, elevation: 464, dhv: 3117,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5001", name: "Les Granges", region: "Vignet",
    lat: 42.8414, lon: 0.0254, elevation: 1627, dhv: 5001,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5084", name: "Les Houches", region: "Passy",
    lat: 45.8855, lon: 6.7527, elevation: 1842, dhv: 5084,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3173", name: "Les Lanchettes", region: "Bourg-Saint-Maurice",
    lat: 45.5704, lon: 6.8435, elevation: 2489, dhv: 3173,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5057", name: "Les Martinieres", region: "Saint-Forgeux",
    lat: 45.8438, lon: 4.4846, elevation: 634, dhv: 5057,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3012", name: "Les Mouettes", region: "Criel-sur-mer",
    lat: 50.0285, lon: 1.3008, elevation: 82, dhv: 3012,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5024", name: "Les Orres", region: "Les Orres",
    lat: 44.4687, lon: 6.5731, elevation: 2540, dhv: 5024,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2309", name: "Les Plagnes", region: "Allevard",
    lat: 45.3876, lon: 6.1475, elevation: 2071, dhv: 2309,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2150", name: "Les Richards", region: "Saint Jean Saint Nicolas",
    lat: 44.6807, lon: 6.2317, elevation: 1519, dhv: 2150,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4928", name: "Les Roches de Ham", region: "Troisgots",
    lat: 49.0267, lon: -1.0413, elevation: 79, dhv: 4928,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3059", name: "Les Rousseaux", region: "Pagny-la-Blanche-Cote",
    lat: 48.534, lon: 5.7412, elevation: 377, dhv: 3059,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5074", name: "Les Trois Croix", region: "St.-Jean-de-Maurienne",
    lat: 45.2591, lon: 6.2965, elevation: 1517, dhv: 5074,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3002", name: "Licques", region: "Licques",
    lat: 50.7993, lon: 1.9473, elevation: 152, dhv: 3002,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3018", name: "Londinieres", region: "Londinieres",
    lat: 49.8499, lon: 1.4102, elevation: 172, dhv: 3018,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3123", name: "Longeville", region: "Enchevannes",
    lat: 47.0563, lon: 6.2154, elevation: 704, dhv: 3123,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3135", name: "Longvilles", region: "Metabief",
    lat: 46.7504, lon: 6.3439, elevation: 1294, dhv: 3135,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1993", name: "Lorry Mardigny", region: "Mardigny",
    lat: 48.9676, lon: 6.0784, elevation: 370, dhv: 1993,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3232", name: "Luzech", region: "Luzech",
    lat: 44.4925, lon: 1.2868, elevation: 258, dhv: 3232,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1849_NW", name: "Malatrait (NW)", region: "Allevard",
    lat: 45.3937, lon: 6.1067, elevation: 1398, dhv: 1849,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1849_S", name: "Malatrait (S)", region: "Allevard",
    lat: 45.3912, lon: 6.1066, elevation: 1366, dhv: 1849,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4952", name: "Malay-le-Grand", region: "Malay-le-Grand",
    lat: 48.165, lon: 3.3499, elevation: 132, dhv: 4952,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2311", name: "Malleval", region: "Malleval en Vercors",
    lat: 45.1308, lon: 5.4445, elevation: 1381, dhv: 2311,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4909", name: "Malval", region: "Malval",
    lat: 46.3538, lon: 1.8815, elevation: 302, dhv: 4909,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3142", name: "Mancey", region: "Mancey",
    lat: 46.5814, lon: 4.8181, elevation: 477, dhv: 3142,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3203_NW", name: "Mandailles (NW)", region: "Mandailles",
    lat: 45.0511, lon: 2.664, elevation: 1541, dhv: 3203,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3203_SW", name: "Mandailles (SW)", region: "Mandailles",
    lat: 45.0645, lon: 2.6737, elevation: 1349, dhv: 3203,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4910", name: "Marais-Vernier", region: "Marais-Vernier",
    lat: 49.4024, lon: 0.4672, elevation: 105, dhv: 4910,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1842", name: "Marlens", region: "Marlens",
    lat: 45.7775, lon: 6.3395, elevation: 951, dhv: 1842,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3291", name: "Marnaves", region: "Marnaves",
    lat: 44.1063, lon: 1.8853, elevation: 363, dhv: 3291,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3104", name: "Mathay", region: "Mathay",
    lat: 47.4314, lon: 6.7958, elevation: 489, dhv: 3104,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3346", name: "Mauroux", region: "Targassonne",
    lat: 42.5104, lon: 1.9887, elevation: 2073, dhv: 3346,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3125", name: "Meix Musy", region: "Villers-le-Lac",
    lat: 47.0334, lon: 6.6718, elevation: 1280, dhv: 3125,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3127_O", name: "Meloisey (O)", region: "Meloisey",
    lat: 47.0385, lon: 4.7229, elevation: 552, dhv: 3127,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3127_SO", name: "Meloisey (SO)", region: "Meloisey",
    lat: 47.0362, lon: 4.7137, elevation: 535, dhv: 3127,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3227", name: "Mende Nord", region: "Mende",
    lat: 44.5078, lon: 3.478, elevation: 1046, dhv: 3227,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3226", name: "Mende Ost", region: "Mende",
    lat: 44.5191, lon: 3.4562, elevation: 1052, dhv: 3226,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3233", name: "Mende Süd", region: "Mende",
    lat: 44.4901, lon: 3.5103, elevation: 1021, dhv: 3233,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3072", name: "Menez-Hom", region: "Saint-Nic",
    lat: 48.2198, lon: -4.2351, elevation: 326, dhv: 3072,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3248", name: "Merigot", region: "Saint-Antoinin-Noble-Val",
    lat: 44.1589, lon: 1.7729, elevation: 320, dhv: 3248,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3133", name: "Mesvres", region: "Broye",
    lat: 46.8531, lon: 4.2816, elevation: 594, dhv: 3133,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5048", name: "Metabief", region: "Metabief",
    lat: 46.7606, lon: 6.3571, elevation: 1225, dhv: 5048,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2304", name: "Mevouillon", region: "Mevouillon",
    lat: 44.2356, lon: 5.4821, elevation: 1024, dhv: 2304,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1262_SW", name: "Mieussy (SW)", region: "Mieussy",
    lat: 46.1418, lon: 6.546, elevation: 1632, dhv: 1262,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1262_W", name: "Mieussy (W)", region: "Mieussy",
    lat: 46.1452, lon: 6.5477, elevation: 1652, dhv: 1262,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2190", name: "Mijoux", region: "Mijoux",
    lat: 46.3663, lon: 6.0107, elevation: 1323, dhv: 2190,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3290_NW", name: "Millau (NW)", region: "Millau",
    lat: 44.1109, lon: 3.1023, elevation: 824, dhv: 3290,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3290_S", name: "Millau (S)", region: "Millau",
    lat: 44.11, lon: 3.1032, elevation: 818, dhv: 3290,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3290_W", name: "Millau (W)", region: "Millau",
    lat: 44.1103, lon: 3.1011, elevation: 807, dhv: 3290,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2139", name: "Millefonts", region: "Valdeblore",
    lat: 44.0963, lon: 7.1919, elevation: 2074, dhv: 2139,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3220", name: "Mirabel", region: "Mirabel",
    lat: 44.6071, lon: 4.5014, elevation: 532, dhv: 3220,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1274", name: "Mison", region: "Mison",
    lat: 44.2781, lon: 5.8371, elevation: 663, dhv: 1274,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3016", name: "Monchy", region: "Pierrecourt",
    lat: 49.891, lon: 1.6775, elevation: 170, dhv: 3016,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4945", name: "Monsard", region: "Bussieres",
    lat: 46.3439, lon: 4.7075, elevation: 376, dhv: 4945,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1889", name: "Mont Bisanne West", region: "Villard sur Doron",
    lat: 45.7465, lon: 6.5046, elevation: 1916, dhv: 1889,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5086", name: "Mont Blanc", region: "Chamonix",
    lat: 45.8328, lon: 6.8643, elevation: 4780, dhv: 5086,
    sectors: [[213.75, 56.25]], sectorLabel: "SW-NO", ...DEF },

  { id: "db_5085", name: "Mont Blanc du Tacul", region: "Chamonix",
    lat: 45.8578, lon: 6.886, elevation: 4180, dhv: 5085,
    sectors: [[213.75, 56.25]], sectorLabel: "SW-NO", ...DEF },

  { id: "db_3286", name: "Mont Bouquet", region: "Seynes",
    lat: 44.1318, lon: 4.2856, elevation: 605, dhv: 3286,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3287_S", name: "Mont Bouquet Süd (S)", region: "Seynes",
    lat: 44.1216, lon: 4.2758, elevation: 479, dhv: 3287,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3287_SO", name: "Mont Bouquet Süd (SO)", region: "Seynes",
    lat: 44.122, lon: 4.2786, elevation: 497, dhv: 3287,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5046", name: "Mont Chateleu", region: "Les Gras",
    lat: 46.9897, lon: 6.5732, elevation: 1273, dhv: 5046,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1827", name: "Mont Chery", region: "Les Gets",
    lat: 46.1681, lon: 6.6468, elevation: 1793, dhv: 1827,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3165_SO", name: "Mont Chouve (SO)", region: "Job",
    lat: 45.6304, lon: 3.7822, elevation: 1424, dhv: 3165,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3165_SW", name: "Mont Chouve (SW)", region: "Job",
    lat: 45.6314, lon: 3.7822, elevation: 1442, dhv: 3165,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3184", name: "Mont Chuyer", region: "Chuyer",
    lat: 45.469, lon: 4.6932, elevation: 753, dhv: 3184,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1271", name: "Mont Colombis", region: "Espinasses",
    lat: 44.4925, lon: 6.2161, elevation: 1717, dhv: 1271,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2180", name: "Mont D'Alambre", region: "Les Estables",
    lat: 44.917, lon: 4.1533, elevation: 1687, dhv: 2180,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5082", name: "Mont D'Arbois", region: "Saint-Gervais-les-Bains",
    lat: 45.8548, lon: 6.669, elevation: 1812, dhv: 5082,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3136", name: "Mont D'Or", region: "Jougne",
    lat: 46.7333, lon: 6.3567, elevation: 1447, dhv: 3136,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3138_NW", name: "Mont Dardon (NW)", region: "Issy-L&#039;Eveque",
    lat: 46.6774, lon: 4.0362, elevation: 485, dhv: 3138,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3138_S", name: "Mont Dardon (S)", region: "Issy-L&#039;Eveque",
    lat: 46.6758, lon: 4.0357, elevation: 475, dhv: 3138,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2179", name: "Mont de la Chambre", region: "Les Menuires",
    lat: 45.3179, lon: 6.5783, elevation: 2811, dhv: 2179,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3099", name: "Mont de Vannes", region: "Belonchamp",
    lat: 47.7586, lon: 6.6208, elevation: 579, dhv: 3099,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1801", name: "Mont Denier", region: "Moustiers St. Marie",
    lat: 43.854, lon: 6.2672, elevation: 1397, dhv: 1801,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2000", name: "Mont Donon", region: "Grandfontaine",
    lat: 48.5121, lon: 7.1633, elevation: 970, dhv: 2000,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2202", name: "Mont du Balvay", region: "Balvay",
    lat: 46.1828, lon: 5.4666, elevation: 592, dhv: 2202,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1888", name: "Mont du Chat", region: "Yenne",
    lat: 45.6627, lon: 5.8212, elevation: 1468, dhv: 1888,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1831", name: "Mont Forchat", region: "Ocier",
    lat: 46.2738, lon: 6.4881, elevation: 1507, dhv: 1831,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3027", name: "Mont Fort", region: "Letanne",
    lat: 49.5571, lon: 5.0608, elevation: 243, dhv: 3027,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3353", name: "Mont Gozzi", region: "Afa",
    lat: 42.0115, lon: 8.7813, elevation: 628, dhv: 3353,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1784_S", name: "Mont Gros (S)", region: "Roquebrune Cap Martin",
    lat: 43.7654, lon: 7.4427, elevation: 658, dhv: 1784,
    sectors: [[78.75, 281.25]], sectorLabel: "O-W", ...DEF },

  { id: "db_1784_SO", name: "Mont Gros (SO)", region: "Roquebrune Cap Martin",
    lat: 43.7559, lon: 7.4107, elevation: 694, dhv: 1784,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1794", name: "Mont Guillaume", region: "Embrun",
    lat: 44.5685, lon: 6.4324, elevation: 1586, dhv: 1794,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2320", name: "Mont Jovet", region: "Bozel",
    lat: 45.4857, lon: 6.6393, elevation: 2277, dhv: 2320,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1828_NO", name: "Mont Lachat (NO)", region: "Les Grand-Bornand",
    lat: 45.9605, lon: 6.476, elevation: 2012, dhv: 1828,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1828_SW", name: "Mont Lachat (SW)", region: "Les Grand-Bornand",
    lat: 45.9582, lon: 6.4768, elevation: 2020, dhv: 1828,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3211", name: "Mont Mercou", region: "Creysse",
    lat: 44.9116, lon: 1.5824, elevation: 306, dhv: 3211,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2181", name: "Mont Mezenc", region: "Boree",
    lat: 44.9103, lon: 4.1938, elevation: 1686, dhv: 2181,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_5059", name: "Mont Moiran", region: "Oricourt",
    lat: 47.6225, lon: 6.349, elevation: 378, dhv: 5059,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2186", name: "Mont Myon", region: "Pressiant",
    lat: 46.3306, lon: 5.3973, elevation: 628, dhv: 2186,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1838", name: "Mont Paccard", region: "Saint Gervais",
    lat: 45.8954, lon: 6.7279, elevation: 1259, dhv: 1838,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3140", name: "Mont Pejus", region: "Burnand",
    lat: 46.5957, lon: 4.6391, elevation: 345, dhv: 3140,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3129_N", name: "Mont Poupet (N)", region: "Saint-Thiebaud",
    lat: 46.9716, lon: 5.8775, elevation: 789, dhv: 3129,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3129_NW", name: "Mont Poupet (NW)", region: "Saint-Thiebaud",
    lat: 46.9703, lon: 5.8742, elevation: 779, dhv: 3129,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3129_S", name: "Mont Poupet (S)", region: "Saint-Thiebaud",
    lat: 46.9692, lon: 5.8762, elevation: 812, dhv: 3129,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3129_SO", name: "Mont Poupet (SO)", region: "Saint-Thiebaud",
    lat: 46.9693, lon: 5.8747, elevation: 799, dhv: 3129,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5033", name: "Mont Pugget", region: "Marseille",
    lat: 43.2221, lon: 5.4587, elevation: 560, dhv: 5033,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5031", name: "Mont Rose", region: "Marseille",
    lat: 43.2299, lon: 5.3503, elevation: 49, dhv: 5031,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2187", name: "Mont Semiol", region: "Chatelneuf",
    lat: 45.6334, lon: 3.9688, elevation: 1007, dhv: 2187,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1817_N", name: "Mont Ventoux (N)", region: "Ventoux",
    lat: 44.1749, lon: 5.2787, elevation: 1849, dhv: 1817,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1817_S", name: "Mont Ventoux (S)", region: "Ventoux",
    lat: 44.1739, lon: 5.2649, elevation: 1813, dhv: 1817,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5045", name: "Mont Vouillot", region: "Morteau",
    lat: 47.0728, lon: 6.604, elevation: 1096, dhv: 5045,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4874", name: "Mont-Saint-Pere", region: "Mont-Saint-Pere",
    lat: 49.0714, lon: 3.475, elevation: 164, dhv: 4874,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2205", name: "Montagne de Gache", region: "Sisteron",
    lat: 44.2305, lon: 5.9838, elevation: 1170, dhv: 2205,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4985", name: "Montagne de la Plate", region: "Chambon-sur-Lac",
    lat: 45.5335, lon: 2.8679, elevation: 1510, dhv: 4985,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_2189", name: "Montagne de Parves", region: "Parves",
    lat: 45.7392, lon: 5.7281, elevation: 527, dhv: 2189,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_3225", name: "Montagne de Ruy", region: "Vesc",
    lat: 44.5079, lon: 5.1575, elevation: 925, dhv: 3225,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_4912", name: "Montagne St-Michel", region: "Saint-Rivoal",
    lat: 48.3501, lon: -3.9454, elevation: 369, dhv: 4912,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1855", name: "Montaud", region: "Montaud",
    lat: 45.2447, lon: 5.5748, elevation: 1312, dhv: 1855,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3229", name: "Montbrun", region: "Montbrun",
    lat: 44.5091, lon: 1.8939, elevation: 295, dhv: 3229,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3148", name: "Montcusel", region: "Dortan",
    lat: 46.3392, lon: 5.659, elevation: 647, dhv: 3148,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1791", name: "Monte Grosso", region: "Sospel",
    lat: 43.9124, lon: 7.4648, elevation: 1197, dhv: 1791,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3114", name: "Montfaucon", region: "Montfaucon",
    lat: 47.2407, lon: 6.0819, elevation: 576, dhv: 3114,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_4879", name: "Montherme", region: "Montherme",
    lat: 49.8892, lon: 4.7254, elevation: 358, dhv: 4879,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3305", name: "Montjoux", region: "Dio-Et-Valquieres",
    lat: 43.6727, lon: 3.1957, elevation: 570, dhv: 3305,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1277", name: "Montlambert", region: "Montlambert",
    lat: 45.5531, lon: 6.1046, elevation: 889, dhv: 1277,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4940", name: "Moroges", region: "Moroges",
    lat: 46.7374, lon: 4.6664, elevation: 447, dhv: 4940,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1808_S", name: "Morzine (S)", region: "Morzine",
    lat: 46.1904, lon: 6.7281, elevation: 1550, dhv: 1808,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1808_SW", name: "Morzine (SW)", region: "Morzine",
    lat: 46.1917, lon: 6.7217, elevation: 1532, dhv: 1808,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2376", name: "Moutiers des Fees", region: "La Bresse",
    lat: 48.0191, lon: 6.8751, elevation: 1019, dhv: 2376,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2377", name: "Moyenmont", region: "La Bresse",
    lat: 48.0025, lon: 6.845, elevation: 952, dhv: 2377,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2375_S", name: "Moyenmont (S)", region: "La Bresse",
    lat: 48.0088, lon: 6.9034, elevation: 933, dhv: 2375,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2375_SW", name: "Moyenmont (SW)", region: "La Bresse",
    lat: 48.0089, lon: 6.8975, elevation: 926, dhv: 2375,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3058", name: "Mundolsheim", region: "Mundolsheim",
    lat: 48.6331, lon: 7.6985, elevation: 174, dhv: 3058,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3031", name: "Murvaux", region: "Lion-devant-Dun",
    lat: 49.4018, lon: 5.2472, elevation: 310, dhv: 3031,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3209", name: "Musan", region: "Oriol-en-Royans",
    lat: 44.9898, lon: 5.2357, elevation: 1076, dhv: 3209,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2217", name: "Naves", region: "Naves",
    lat: 45.553, lon: 6.5496, elevation: 1988, dhv: 2217,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5052", name: "Ney", region: "Ney",
    lat: 46.732, lon: 5.8936, elevation: 696, dhv: 5052,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2538", name: "Nohan", region: "Thilay",
    lat: 49.8731, lon: 4.8311, elevation: 310, dhv: 2538,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5051_NW", name: "Noirmont (NW)", region: "Rousses",
    lat: 46.4872, lon: 6.1071, elevation: 1394, dhv: 5051,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5051_W", name: "Noirmont (W)", region: "Rousses",
    lat: 46.4804, lon: 6.1047, elevation: 1420, dhv: 5051,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4895", name: "Nolay", region: "Nolay",
    lat: 46.9626, lon: 4.6237, elevation: 495, dhv: 4895,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3247", name: "Novis", region: "Novis",
    lat: 44.2574, lon: 3.118, elevation: 867, dhv: 3247,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4954", name: "Noyers", region: "Noyers",
    lat: 47.7071, lon: 3.9886, elevation: 220, dhv: 4954,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3009", name: "Olhain", region: "Olhain",
    lat: 50.4335, lon: 2.5858, elevation: 169, dhv: 3009,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4937", name: "Ommeel", region: "Ommeel",
    lat: 48.8111, lon: 0.1601, elevation: 223, dhv: 4937,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3022", name: "Omonville", region: "Omonville-sur-Rogue",
    lat: 49.7007, lon: 1.8351, elevation: 72, dhv: 3022,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_4922", name: "Omonville-la-Rogue", region: "Omonville-la-Rogue",
    lat: 49.6952, lon: -1.8321, elevation: 78, dhv: 4922,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_4935", name: "Ons-en-Bray", region: "Ons-en-Bray",
    lat: 49.4084, lon: 1.891, elevation: 194, dhv: 4935,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1820", name: "Opies", region: "Aureille",
    lat: 43.7021, lon: 4.9854, elevation: 236, dhv: 1820,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3065", name: "Ormont", region: "Saint-Die-Des-Vosges",
    lat: 48.3025, lon: 6.9925, elevation: 793, dhv: 3065,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4957", name: "Orus", region: "Vicdessos",
    lat: 42.7888, lon: 1.5056, elevation: 1406, dhv: 4957,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5003", name: "Osseja", region: "Osseja",
    lat: 42.4018, lon: 2.05, elevation: 2220, dhv: 5003,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3045", name: "Ouffieres", region: "Ouffieres",
    lat: 49.0149, lon: -0.4747, elevation: 81, dhv: 3045,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1992", name: "Pagny-La-Blanche-Cote", region: "Pagny-La-Blanche-Cote",
    lat: 48.5435, lon: 5.7085, elevation: 324, dhv: 1992,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3038", name: "Panorama d'Anfreville", region: "Pitres",
    lat: 49.3161, lon: 1.244, elevation: 102, dhv: 3038,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3242", name: "Paros", region: "Ispagnac",
    lat: 44.3766, lon: 3.5106, elevation: 932, dhv: 3242,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1873", name: "Pas de la Fosse", region: "St. Baldolph",
    lat: 45.5154, lon: 5.9261, elevation: 847, dhv: 1873,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3335", name: "Pech", region: "Roquefeuil",
    lat: 42.8214, lon: 1.9874, elevation: 1134, dhv: 3335,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3246", name: "Pech de Berre", region: "Nicole",
    lat: 44.3245, lon: 0.3467, elevation: 138, dhv: 3246,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3331", name: "Pech des Fayettes", region: "Tuchan",
    lat: 42.8914, lon: 2.6908, elevation: 664, dhv: 3331,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2178", name: "Pelvoux", region: "Pelvoux",
    lat: 44.8576, lon: 6.4587, elevation: 2233, dhv: 2178,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_3240", name: "Penne D'Agenais", region: "Penne D&#039;Agenais",
    lat: 44.3904, lon: 0.8234, elevation: 208, dhv: 3240,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_4901", name: "Perros-Guirec", region: "Perres-Guirec",
    lat: 48.8209, lon: -3.4647, elevation: 43, dhv: 4901,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3084_S", name: "Petit Hohneck (S)", region: "Muhlbach-sur-Munster",
    lat: 48.029, lon: 7.0606, elevation: 885, dhv: 3084,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3084_SO", name: "Petit Hohneck (SO)", region: "Muhlbach-sur-Munster",
    lat: 48.0352, lon: 7.0338, elevation: 1280, dhv: 3084,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2192", name: "Petit Mont Rond", region: "Vesancy",
    lat: 46.3585, lon: 6.0181, elevation: 1517, dhv: 2192,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4955", name: "Peyre Mensongere", region: "Uston",
    lat: 42.7978, lon: 1.2267, elevation: 1691, dhv: 4955,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_4999", name: "Pic Ayre", region: "Bareges",
    lat: 42.8768, lon: 0.0709, elevation: 2240, dhv: 4999,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1957", name: "Pic Blanc", region: "Alpe d&#039;Huez",
    lat: 45.1247, lon: 6.1278, elevation: 3265, dhv: 1957,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3285", name: "Pic D'Andan", region: "Millau",
    lat: 44.1358, lon: 3.0628, elevation: 818, dhv: 3285,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4994", name: "Pic D'Anie", region: "Lescun",
    lat: 42.9437, lon: -0.7205, elevation: 2434, dhv: 4994,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4956", name: "Pic de Arreche", region: "Uston",
    lat: 42.7713, lon: 1.3021, elevation: 1718, dhv: 4956,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3314", name: "Pic de Brau", region: "Magrie",
    lat: 43.012, lon: 2.2258, elevation: 595, dhv: 3314,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_4992", name: "Pic de Jara", region: "Saint-Martin-D&#039;Arrossa",
    lat: 43.1997, lon: -1.2936, elevation: 789, dhv: 4992,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3139", name: "Pic De L'Aigle", region: "La Chaux-Du-Dombief",
    lat: 46.615, lon: 5.9023, elevation: 971, dhv: 3139,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3306", name: "Pic de Vissou", region: "Cabrieres",
    lat: 43.5971, lon: 3.3511, elevation: 345, dhv: 3306,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1818", name: "Pic des Mouchers", region: "Puyloubier",
    lat: 43.5389, lon: 5.6448, elevation: 974, dhv: 1818,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_4963", name: "Pic du Midi", region: "Roquefeuil",
    lat: 42.8118, lon: 1.9936, elevation: 1112, dhv: 4963,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_4960", name: "Pic Galinat", region: "Montferrier",
    lat: 42.826, lon: 1.7428, elevation: 2089, dhv: 4960,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3178", name: "Pic St. Piere", region: "Saint-Diery",
    lat: 45.5347, lon: 2.989, elevation: 976, dhv: 3178,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3312", name: "Picon", region: "Roquefort-sur-Garonne",
    lat: 43.1596, lon: 0.9903, elevation: 493, dhv: 3312,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5025", name: "Pierre Arnoux", region: "Savines-le-Lac",
    lat: 44.5125, lon: 6.3991, elevation: 1281, dhv: 5025,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3189", name: "Pierres de Labro", region: "Dienne",
    lat: 45.1686, lon: 2.7898, elevation: 1323, dhv: 3189,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3024", name: "Pierres Pouquellees", region: "Vauville",
    lat: 49.6499, lon: 1.8559, elevation: 121, dhv: 3024,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5035", name: "Pigno", region: "Olmeto",
    lat: 42.6944, lon: 9.3982, elevation: 936, dhv: 5035,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3322", name: "Piscatelle", region: "Arbas",
    lat: 42.9665, lon: 0.9302, elevation: 1360, dhv: 3322,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_3336", name: "Pla de Adet", region: "Vignec",
    lat: 42.8136, lon: 0.2981, elevation: 1624, dhv: 3336,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4904", name: "Plage Bonaparte", region: "Plouha",
    lat: 48.7058, lon: -2.9225, elevation: 47, dhv: 4904,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1261", name: "Plaine-Joux", region: "Passy",
    lat: 45.9496, lon: 6.7395, elevation: 1357, dhv: 1261,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3154", name: "Plan De L'Aiguille", region: "Chamonix",
    lat: 45.9023, lon: 6.8838, elevation: 2270, dhv: 3154,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1879", name: "Plan de l'Ours", region: "Bourg St. Maurice",
    lat: 45.5526, lon: 6.7716, elevation: 1821, dhv: 1879,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5062", name: "Planche des Belles Filles", region: "Plancher-les-Mines",
    lat: 47.7674, lon: 6.7739, elevation: 1136, dhv: 5062,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1824", name: "Planfait", region: "Talloires",
    lat: 45.8532, lon: 6.223, elevation: 950, dhv: 1824,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3086", name: "Planois", region: "Basse-sur-le-Rupt",
    lat: 47.9814, lon: 6.7655, elevation: 850, dhv: 3086,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5487", name: "Plateau de Cavillore", region: "Gourdon",
    lat: 43.7291, lon: 6.975, elevation: 1024, dhv: 5487,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3087", name: "Plateau de Chauffourt", region: "Chauffourt",
    lat: 47.9772, lon: 5.4228, elevation: 466, dhv: 3087,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1862_N", name: "Plateau de St. Ange (N)", region: "Varces",
    lat: 45.0961, lon: 5.6467, elevation: 998, dhv: 1862,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1862_O", name: "Plateau de St. Ange (O)", region: "Varces",
    lat: 45.0817, lon: 5.6328, elevation: 1236, dhv: 1862,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3174", name: "Plateaux de Laschaux", region: "Saurier",
    lat: 45.554, lon: 3.0624, elevation: 836, dhv: 3174,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3199_N", name: "Plomb du Cantal (N)", region: "Lioran",
    lat: 45.064, lon: 2.7619, elevation: 1783, dhv: 3199,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3199_W", name: "Plomb du Cantal (W)", region: "Lioran",
    lat: 45.0626, lon: 2.7604, elevation: 1797, dhv: 3199,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4902", name: "Plouezec", region: "Plouezec",
    lat: 48.7616, lon: -2.9859, elevation: 57, dhv: 4902,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3083", name: "Poele Sauvage", region: "Saint Etienne les Remiremont",
    lat: 48.0364, lon: 6.6158, elevation: 771, dhv: 3083,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4900", name: "Pointe de Bihit", region: "Trebeurden",
    lat: 48.761, lon: -3.5772, elevation: 60, dhv: 4900,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_4903", name: "Pointe de Bilfot", region: "Plouezec",
    lat: 48.7656, lon: -2.9544, elevation: 47, dhv: 4903,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3341", name: "Pointe de Solaru", region: "Nonza",
    lat: 42.7973, lon: 9.3547, elevation: 266, dhv: 3341,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4905", name: "Pointe de Tournemine", region: "Plerin",
    lat: 48.5763, lon: -2.7756, elevation: 62, dhv: 4905,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_4906", name: "Pointe des Tablettes", region: "Plerin",
    lat: 48.5593, lon: -2.7392, elevation: 64, dhv: 4906,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4907_NW", name: "Pointe du Rosellier (NW)", region: "Plerin",
    lat: 48.5547, lon: -2.7153, elevation: 51, dhv: 4907,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4907_SO", name: "Pointe du Rosellier (SO)", region: "Plerin",
    lat: 48.5536, lon: -2.7152, elevation: 56, dhv: 4907,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5030", name: "Pointe Piazza", region: "Marseille",
    lat: 43.22, lon: 5.3544, elevation: 163, dhv: 5030,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3299", name: "Pompignan", region: "Pompignan",
    lat: 43.8768, lon: 3.8577, elevation: 348, dhv: 3299,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2201", name: "Port", region: "Champfromier",
    lat: 46.1587, lon: 5.5735, elevation: 690, dhv: 2201,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4932", name: "Port a Binson", region: "Mareuil-le-Port",
    lat: 49.0726, lon: 3.7626, elevation: 204, dhv: 4932,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3337", name: "Port de Lers", region: "Port",
    lat: 42.8125, lon: 1.3932, elevation: 1371, dhv: 3337,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1887", name: "Pra Plan", region: "Macot la Plagne",
    lat: 45.5774, lon: 6.6235, elevation: 2088, dhv: 1887,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5016", name: "Pra-Loup", region: "Uvernet-Fours",
    lat: 44.3555, lon: 6.5951, elevation: 2045, dhv: 5016,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1875", name: "Pragondran", region: "Pragondran",
    lat: 45.6269, lon: 5.9463, elevation: 902, dhv: 1875,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5070", name: "Pralognan", region: "Pralognan-la-Vanoise",
    lat: 45.387, lon: 6.7337, elevation: 1980, dhv: 5070,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1823", name: "Prarion", region: "Passy",
    lat: 45.8961, lon: 6.7499, elevation: 1934, dhv: 1823,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3325", name: "Prat d'Albis", region: "Ganac",
    lat: 42.9219, lon: 1.5815, elevation: 1182, dhv: 3325,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1837", name: "Pre Richard", region: "Bernex",
    lat: 46.3467, lon: 6.6962, elevation: 1336, dhv: 1837,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3185", name: "Pre Rond", region: "Chapelle-du Bard",
    lat: 45.4066, lon: 6.1285, elevation: 1558, dhv: 3185,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3131", name: "Pretin", region: "Pretin",
    lat: 46.9423, lon: 5.8438, elevation: 570, dhv: 3131,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1882", name: "Provinces", region: "Nances",
    lat: 45.6019, lon: 5.8073, elevation: 1126, dhv: 1882,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_4964", name: "Puivert", region: "Puivert",
    lat: 42.892, lon: 2.0674, elevation: 806, dhv: 4964,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4968", name: "Puy Brunet", region: "Saint-Jacques-des-Blats",
    lat: 45.0571, lon: 2.7456, elevation: 1681, dhv: 4968,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4972_SO", name: "Puy de Bort (SO)", region: "Bort-les-Orgues",
    lat: 45.3956, lon: 2.4622, elevation: 797, dhv: 4972,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4972_SW", name: "Puy de Bort (SW)", region: "Bort-les-Orgues",
    lat: 45.3963, lon: 2.4562, elevation: 797, dhv: 4972,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4988", name: "Puy de Chambourguet", region: "Besse-et-Saint-Anastaise",
    lat: 45.5119, lon: 2.8657, elevation: 1491, dhv: 4988,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3160", name: "Puy de Corent", region: "Veyre-Monton",
    lat: 45.6607, lon: 3.1775, elevation: 598, dhv: 3160,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4981", name: "Puy de Dome", region: "Saint-Genes-Champanelle",
    lat: 45.7721, lon: 2.9655, elevation: 1425, dhv: 4981,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3172", name: "Puy de L'Angle", region: "Le Mont-Dore",
    lat: 45.5727, lon: 2.8395, elevation: 1715, dhv: 3172,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4983", name: "Puy de L'Ouire", region: "Rochefort-Montagne",
    lat: 45.6285, lon: 2.8313, elevation: 1482, dhv: 4983,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_4971", name: "Puy de la Monediere", region: "Veix",
    lat: 45.4862, lon: 1.8393, elevation: 896, dhv: 4971,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4986", name: "Puy de la Perdix", region: "Besse-et-Saint-Anastaise",
    lat: 45.5214, lon: 2.8296, elevation: 1786, dhv: 4986,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3169", name: "Puy de la Tache", region: "Le Mont-Dore",
    lat: 45.5921, lon: 2.845, elevation: 1604, dhv: 3169,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4989", name: "Puy de Paillarent", region: "Besse-et-Saint-Anastaise",
    lat: 45.5095, lon: 2.8253, elevation: 1712, dhv: 4989,
    sectors: [[123.75, 326.25]], sectorLabel: "SO-NW", ...DEF },

  { id: "db_3177", name: "Puy de Roche Cobiere", region: "Saurier",
    lat: 45.5457, lon: 3.0395, elevation: 848, dhv: 3177,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3200", name: "Puy de Rocher", region: "Albeperre",
    lat: 45.0703, lon: 2.7692, elevation: 1796, dhv: 3200,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4984_N", name: "Puy de Sancy (N)", region: "Le Mont-Dore",
    lat: 45.5287, lon: 2.8138, elevation: 1839, dhv: 4984,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_4984_S", name: "Puy de Sancy (S)", region: "Le Mont-Dore",
    lat: 45.5279, lon: 2.814, elevation: 1842, dhv: 4984,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3157", name: "Puy de St. Romain", region: "Mirefleurs",
    lat: 45.6799, lon: 3.2424, elevation: 752, dhv: 3157,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3201", name: "Puy du Tour", region: "Le Chambon",
    lat: 45.0815, lon: 1.9211, elevation: 377, dhv: 3201,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_4987", name: "Puy Ferrand", region: "Besse-et-Saint-Anastaise",
    lat: 45.5246, lon: 2.8261, elevation: 1838, dhv: 4987,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3193_NO", name: "Puy Mary (NO)", region: "Le Cluax",
    lat: 45.1242, lon: 2.6736, elevation: 1671, dhv: 3193,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3193_W", name: "Puy Mary (W)", region: "Le Cluax",
    lat: 45.1217, lon: 2.6714, elevation: 1663, dhv: 3193,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1956", name: "Puy-Aillaud", region: "Vallouise",
    lat: 44.8503, lon: 6.4782, elevation: 1662, dhv: 1956,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2193", name: "Quincie", region: "Quincie",
    lat: 46.1073, lon: 4.6181, elevation: 434, dhv: 2193,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5026", name: "Rabou", region: "Rabou",
    lat: 44.5937, lon: 6.0315, elevation: 1613, dhv: 5026,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3197_S", name: "Redondet (S)", region: "Mandailles-Saint-Julien",
    lat: 45.1043, lon: 2.6613, elevation: 1526, dhv: 3197,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3197_SO", name: "Redondet (SO)", region: "Mandailles-Saint-Julien",
    lat: 45.1069, lon: 2.6717, elevation: 1580, dhv: 3197,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3057", name: "Reinhartsmunster", region: "Reinhartsmunster",
    lat: 48.6774, lon: 7.3121, elevation: 515, dhv: 3057,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_4878_SO", name: "Revin (SO)", region: "Revin",
    lat: 49.9484, lon: 4.6245, elevation: 354, dhv: 4878,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4878_SW", name: "Revin (SW)", region: "Revin",
    lat: 49.9386, lon: 4.6537, elevation: 357, dhv: 4878,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3095_NO", name: "Revolles (NO)", region: "Bussang",
    lat: 47.8948, lon: 6.847, elevation: 947, dhv: 3095,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3095_SO", name: "Revolles (SO)", region: "Bussang",
    lat: 47.8922, lon: 6.8456, elevation: 938, dhv: 3095,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4953", name: "Rigny-le-Ferron", region: "Rigny-le-Ferron",
    lat: 48.1941, lon: 3.6379, elevation: 184, dhv: 4953,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4958_N", name: "Risoul (N)", region: "Vicdessos",
    lat: 42.7636, lon: 1.5082, elevation: 1327, dhv: 4958,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_4958_NO", name: "Risoul (NO)", region: "Vicdessos",
    lat: 42.7435, lon: 1.5198, elevation: 1707, dhv: 4958,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4958_W", name: "Risoul (W)", region: "Vicdessos",
    lat: 42.759, lon: 1.5121, elevation: 1391, dhv: 4958,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3307", name: "Roc de Albine", region: "Sauveterre",
    lat: 43.4432, lon: 2.5349, elevation: 806, dhv: 3307,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4982", name: "Roche de la Pause", region: "Job",
    lat: 45.6312, lon: 3.8036, elevation: 1517, dhv: 4982,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2378", name: "Roche de Minuit", region: "La Bresse",
    lat: 47.9889, lon: 6.8613, elevation: 926, dhv: 2378,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1886", name: "Roche de Mio", region: "Macot la Plagne",
    lat: 45.4933, lon: 6.7343, elevation: 2696, dhv: 1886,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3106", name: "Roche les Clerval", region: "Roche-les-Clerval",
    lat: 47.3576, lon: 6.481, elevation: 558, dhv: 3106,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1806", name: "Rochebrune", region: "Megeve",
    lat: 45.8332, lon: 6.6128, elevation: 1731, dhv: 1806,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3192", name: "Rocher de Laqueuille", region: "Dienne",
    lat: 45.1484, lon: 2.7939, elevation: 1273, dhv: 3192,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3137", name: "Roches Aigues", region: "Pannessieres",
    lat: 46.7053, lon: 5.6034, elevation: 508, dhv: 3137,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2183", name: "Roches des Cuzets", region: "Boree",
    lat: 44.8921, lon: 4.1851, elevation: 1546, dhv: 2183,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3074_S", name: "Roocourt la Cote le Denot (S)", region: "Bologne",
    lat: 48.214, lon: 5.1526, elevation: 340, dhv: 3074,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3074_SW", name: "Roocourt la Cote le Denot (SW)", region: "Bologne",
    lat: 48.2191, lon: 5.1496, elevation: 337, dhv: 3074,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3068", name: "Rosnoen", region: "Rosenoen",
    lat: 48.2629, lon: -4.2141, elevation: 127, dhv: 3068,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2380", name: "Rothenbachkopf/Batteriekopf", region: "Wildenstein",
    lat: 48.0044, lon: 6.9802, elevation: 1206, dhv: 2380,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2294", name: "Saint Amand", region: "Suzette",
    lat: 44.1863, lon: 5.0684, elevation: 657, dhv: 2294,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3249", name: "Saint Antonin Noble Val", region: "Saint-Antoinin-Noble-Val",
    lat: 44.1593, lon: 1.768, elevation: 300, dhv: 3249,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3303", name: "Saint Come", region: "Saint Come",
    lat: 43.835, lon: 4.1976, elevation: 173, dhv: 3303,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3344", name: "Saint Florent", region: "Saint Florent",
    lat: 42.6697, lon: 9.2944, elevation: 113, dhv: 3344,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2295", name: "Saint Hippolyte le Graveyron", region: "Saint Hippolyte le Graveyron",
    lat: 44.1324, lon: 5.0765, elevation: 389, dhv: 2295,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3120_NW", name: "Saint Michel Chef (NW)", region: "Saint-Michel-Chef",
    lat: 47.1884, lon: -2.1602, elevation: 15, dhv: 3120,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3120_W", name: "Saint Michel Chef (W)", region: "Saint-Michel-Chef",
    lat: 47.1909, lon: -2.1607, elevation: 15, dhv: 3120,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4908", name: "Saint Pabu", region: "La ville Berneuf",
    lat: 48.6025, lon: -2.5092, elevation: 57, dhv: 4908,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1804", name: "Saint Pancrace", region: "Oraison",
    lat: 43.8997, lon: 5.921, elevation: 528, dhv: 1804,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4894", name: "Saint Romain", region: "Saint Romain",
    lat: 46.9986, lon: 4.697, elevation: 523, dhv: 4894,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2169_S", name: "Saint Sorlin (S)", region: "Saint Sorlin",
    lat: 45.8806, lon: 5.4101, elevation: 745, dhv: 2169,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2169_SW", name: "Saint Sorlin (SW)", region: "Saint Sorlin",
    lat: 45.8801, lon: 5.3987, elevation: 643, dhv: 2169,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3239", name: "Saint Vincent Rive D'Olt", region: "Saint Vincent Rive D&#039;Olt",
    lat: 44.4597, lon: 1.2943, elevation: 236, dhv: 3239,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5042", name: "Saint-Baume", region: "Plan-D&#039;Aups-Saint-Baume",
    lat: 43.3209, lon: 5.7403, elevation: 969, dhv: 5042,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1270_S", name: "Saint-Geniez (S)", region: "Saint-Geniez",
    lat: 44.2492, lon: 6.0665, elevation: 1346, dhv: 1270,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1270_SW", name: "Saint-Geniez (SW)", region: "Saint-Geniez",
    lat: 44.2531, lon: 6.0701, elevation: 1631, dhv: 1270,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3096", name: "Saint-Martin-sur-Armancon", region: "Saint-Martin-sur-Armancon",
    lat: 47.8738, lon: 4.0569, elevation: 236, dhv: 3096,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4950", name: "Saint-Sulpice-Lauriere", region: "Saint-Sulpice-Lauriere",
    lat: 46.0482, lon: 1.4487, elevation: 643, dhv: 4950,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_4934", name: "Saint-Urbain-Maconcourt", region: "Saint-Urbain-Maconcourt",
    lat: 48.4057, lon: 5.1774, elevation: 315, dhv: 4934,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5486", name: "Saint-Vallier-de Thiey", region: "Saint-Vallier-de Thiey",
    lat: 43.71, lon: 6.8283, elevation: 1004, dhv: 5486,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1340", name: "Saint-Vincent-Les-Forts (St. Vincent)", region: "St. Vincent les forts",
    lat: 44.4433, lon: 6.3716, elevation: 1257, dhv: 1340,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2153", name: "Sainte Anastasie", region: "Sainte Anastasie sur Issole",
    lat: 43.3543, lon: 6.1201, elevation: 435, dhv: 2153,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3079", name: "Sainte Colombe", region: "Eaux-Puiseaux",
    lat: 48.1214, lon: 3.9049, elevation: 265, dhv: 3079,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3073", name: "Sainte Germaine", region: "Bar Sur Aube",
    lat: 48.2191, lon: 4.6989, elevation: 309, dhv: 3073,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2214", name: "Sainte Marie", region: "St. Etienne la Varenne",
    lat: 46.0842, lon: 4.6081, elevation: 579, dhv: 2214,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1819_SW", name: "Sainte Victoire (SW)", region: "Puyloubier",
    lat: 43.5323, lon: 5.5733, elevation: 714, dhv: 1819,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1819_W", name: "Sainte Victoire (W)", region: "Puyloubier",
    lat: 43.5316, lon: 5.5667, elevation: 500, dhv: 1819,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5061", name: "Sainte-Marie-en-Chanois", region: "Amage",
    lat: 47.8378, lon: 6.528, elevation: 456, dhv: 5061,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1769_N", name: "Saleve (N)", region: "Veyrier",
    lat: 46.1487, lon: 6.1891, elevation: 1183, dhv: 1769,
    sectors: [[303.75, 11.25], [348.75, 11.25]], sectorLabel: "NW-N · N", ...DEF },

  { id: "db_1769_SW", name: "Saleve (SW)", region: "Veyrier",
    lat: 46.1301, lon: 6.1726, elevation: 1268, dhv: 1769,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1833_N", name: "Sambuy (N)", region: "Seythenex",
    lat: 45.6985, lon: 6.2721, elevation: 1818, dhv: 1833,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1833_W", name: "Sambuy (W)", region: "Seythenex",
    lat: 45.6953, lon: 6.2643, elevation: 2066, dhv: 1833,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3352", name: "San Bastiano 1", region: "Calcatoggio",
    lat: 42.0248, lon: 8.7315, elevation: 439, dhv: 3352,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5037", name: "San Bastiano 2", region: "Calcatoggio",
    lat: 42.0212, lon: 8.7549, elevation: 653, dhv: 5037,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4886", name: "Sancerre", region: "Sancerre",
    lat: 47.3298, lon: 2.8284, elevation: 232, dhv: 4886,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3000", name: "Sangatte", region: "Sangatte",
    lat: 50.9412, lon: 1.7378, elevation: 10, dhv: 3000,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4896", name: "Santenay", region: "Le Haut Santenay",
    lat: 46.9235, lon: 4.678, elevation: 465, dhv: 4896,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1881", name: "Sapenay", region: "Cessens",
    lat: 45.7998, lon: 5.8679, elevation: 774, dhv: 1881,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3234", name: "Saujac", region: "Saujac",
    lat: 44.4876, lon: 1.8912, elevation: 295, dhv: 3234,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3017_N", name: "Saussemare (N)", region: "Saint-Aubin-sur-Mer",
    lat: 49.8926, lon: 0.8633, elevation: 10, dhv: 3017,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3017_NW", name: "Saussemare (NW)", region: "Saint-Aubin-sur-Mer",
    lat: 49.8947, lon: 0.8765, elevation: 7, dhv: 3017,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3235", name: "Saut de la Mounine", region: "Ambeyrac",
    lat: 44.4855, lon: 1.9197, elevation: 307, dhv: 3235,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3108", name: "Savigny", region: "Savigny-sous-Malain",
    lat: 47.3395, lon: 4.7513, elevation: 573, dhv: 3108,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2384", name: "Schnepfenriedkopf", region: "Mittlach",
    lat: 47.9792, lon: 7.0428, elevation: 1229, dhv: 2384,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3060", name: "Schwarzenbach", region: "Russ",
    lat: 48.4984, lon: 7.2825, elevation: 485, dhv: 3060,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3328", name: "Semaphore", region: "Leucate Plage",
    lat: 42.9158, lon: 3.0586, elevation: 38, dhv: 3328,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1809", name: "Semnoz", region: "Gruffy",
    lat: 45.7972, lon: 6.1048, elevation: 1685, dhv: 1809,
    sectors: [[258.75, 326.25], [258.75, 281.25]], sectorLabel: "W-NW · W", ...DEF },

  { id: "db_3021", name: "Seneville sur Fecamp", region: "Seneville sur Fecamp",
    lat: 49.7795, lon: 0.4137, elevation: 93, dhv: 3021,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3146", name: "Septmoncel", region: "Septmoncel",
    lat: 46.371, lon: 5.8986, elevation: 1027, dhv: 3146,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2196_NO", name: "Serre de Barre (NO)", region: "Gravieres",
    lat: 44.402, lon: 4.0757, elevation: 829, dhv: 2196,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2196_SW", name: "Serre de Barre (SW)", region: "Gravieres",
    lat: 44.3969, lon: 4.0833, elevation: 882, dhv: 2196,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2185", name: "Serre en Don", region: "Accons",
    lat: 44.871, lon: 4.3951, elevation: 1188, dhv: 2185,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2406", name: "Siebach", region: "Fellering",
    lat: 47.9039, lon: 6.9922, elevation: 662, dhv: 2406,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1996", name: "Sion", region: "Vaudemont",
    lat: 48.4087, lon: 6.0693, elevation: 520, dhv: 1996,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2296", name: "Siou Blanc", region: "Signes",
    lat: 43.2687, lon: 5.8935, elevation: 727, dhv: 2296,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3061", name: "Socourt", region: "Socourt",
    lat: 48.3882, lon: 6.2494, elevation: 338, dhv: 3061,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2306", name: "Solaison", region: "Bonneville",
    lat: 46.0424, lon: 6.4254, elevation: 1666, dhv: 2306,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2301", name: "Solaure", region: "Die",
    lat: 44.6912, lon: 5.354, elevation: 1224, dhv: 2301,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5018", name: "Sommet du Prorel", region: "Briacon",
    lat: 44.9052, lon: 6.5812, elevation: 2541, dhv: 5018,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3070", name: "Soncourt", region: "Soncourt-Sur-Marne",
    lat: 48.2559, lon: 5.1022, elevation: 320, dhv: 3070,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5007", name: "Sorede", region: "Sorede",
    lat: 42.5148, lon: 2.9732, elevation: 505, dhv: 5007,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5010", name: "Soreze", region: "Soreze",
    lat: 43.4419, lon: 2.0739, elevation: 523, dhv: 5010,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1785", name: "Sospel", region: "Sospel",
    lat: 43.8869, lon: 7.4546, elevation: 731, dhv: 1785,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2194", name: "Soubeyrand", region: "Le Poet Sigilat",
    lat: 44.3755, lon: 5.3331, elevation: 1196, dhv: 2194,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3213", name: "Soult", region: "Floirac",
    lat: 44.8981, lon: 1.6543, elevation: 242, dhv: 3213,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3039", name: "St. Clair sur Epte", region: "Buchet",
    lat: 49.2003, lon: 1.704, elevation: 101, dhv: 3039,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2184", name: "St. Clement", region: "Saint-Clement",
    lat: 44.9514, lon: 4.2613, elevation: 1151, dhv: 2184,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2197", name: "St. Desirat", region: "St. Desirat",
    lat: 45.2538, lon: 4.7968, elevation: 283, dhv: 2197,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3304", name: "St. Dionizy", region: "St. Dionizy",
    lat: 43.7989, lon: 4.2237, elevation: 168, dhv: 3304,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1279_O", name: "St. Hilaire (O)", region: "Lumbin",
    lat: 45.314, lon: 5.8723, elevation: 1313, dhv: 1279,
    sectors: [[78.75, 101.25], [78.75, 146.25]], sectorLabel: "O · O-SO", ...DEF },

  { id: "db_1279_S", name: "St. Hilaire (S)", region: "Lumbin",
    lat: 45.3083, lon: 5.8833, elevation: 912, dhv: 1279,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1279_SO", name: "St. Hilaire (SO)", region: "Lumbin",
    lat: 45.3105, lon: 5.8903, elevation: 945, dhv: 1279,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3051", name: "St. Marc D'Ouilly", region: "Cossesseville",
    lat: 48.8826, lon: -0.445, elevation: 175, dhv: 3051,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3294_N", name: "St. Marcel De Campes (N)", region: "Cordes",
    lat: 44.0636, lon: 1.9701, elevation: 289, dhv: 3294,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3294_NW", name: "St. Marcel De Campes (NW)", region: "Cordes",
    lat: 44.0643, lon: 1.9757, elevation: 286, dhv: 3294,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1859", name: "St. Martin", region: "St. Martin en Vercors",
    lat: 45.0228, lon: 5.4651, elevation: 1248, dhv: 1859,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3047", name: "St. Martin de Sallen", region: "Curcy-sur-Orne",
    lat: 48.9933, lon: -0.4986, elevation: 105, dhv: 3047,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_4897", name: "St. Michel en Greve", region: "St. Michel en Greve",
    lat: 48.672, lon: -3.5739, elevation: 75, dhv: 4897,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3049_SW", name: "St. Omer (SW)", region: "Clecy",
    lat: 48.9296, lon: -0.47, elevation: 186, dhv: 3049,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3049_W", name: "St. Omer (W)", region: "Clecy",
    lat: 48.926, lon: -0.4665, elevation: 206, dhv: 3049,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2215", name: "St. Quinis", region: "St. Quinis",
    lat: 43.3543, lon: 6.1201, elevation: 434, dhv: 2215,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2198", name: "St. Sebastien", region: "St. Paul le Jeune",
    lat: 44.3137, lon: 4.1451, elevation: 418, dhv: 2198,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5073", name: "St.-Jean-de-Maurienne", region: "St.-Jean-de-Maurienne",
    lat: 45.2876, lon: 6.32, elevation: 1272, dhv: 5073,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4947", name: "Ste-Marguerite-sur-Mer", region: "Quiberville",
    lat: 49.9089, lon: 0.9371, elevation: 8, dhv: 4947,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1997", name: "Stonne", region: "Stonne",
    lat: 49.5503, lon: 4.9292, elevation: 318, dhv: 1997,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_4966", name: "Suc d'Armont", region: "Plaisance",
    lat: 43.9128, lon: 2.5738, elevation: 632, dhv: 4966,
    sectors: [[168.75, 11.25]], sectorLabel: "S-N", ...DEF },

  { id: "db_5028", name: "Suc de Vent", region: "Villevocance",
    lat: 45.1877, lon: 4.582, elevation: 1140, dhv: 5028,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3292", name: "Sueille", region: "Saint-Jean-Du-Gard",
    lat: 44.1064, lon: 3.9032, elevation: 447, dhv: 3292,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4942", name: "Suin", region: "Suin",
    lat: 46.4339, lon: 4.4755, elevation: 582, dhv: 4942,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3343", name: "Superbagneres", region: "Bagneres de Luchon",
    lat: 42.7682, lon: 0.58, elevation: 1760, dhv: 3343,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5034", name: "Teghime", region: "Olmeto",
    lat: 42.6747, lon: 9.3775, elevation: 614, dhv: 5034,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1836", name: "Telecabine des Memises", region: "Thollon",
    lat: 46.3812, lon: 6.728, elevation: 1623, dhv: 1836,
    sectors: [[348.75, 56.25], [348.75, 11.25]], sectorLabel: "N-NO · N", ...DEF },

  { id: "db_3179", name: "Telepherique", region: "Mont Dore",
    lat: 45.5326, lon: 2.814, elevation: 1742, dhv: 3179,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3071_N", name: "Tertre de la Fille Morte (N)", region: "Sainte-Marie-Aux-Mines",
    lat: 48.2169, lon: 7.1993, elevation: 1080, dhv: 3071,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3071_W", name: "Tertre de la Fille Morte (W)", region: "Sainte-Marie-Aux-Mines",
    lat: 48.2187, lon: 7.193, elevation: 1037, dhv: 3071,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1885", name: "Tete de Solaise", region: "Val d&#039;Isere",
    lat: 45.4344, lon: 6.9916, elevation: 2515, dhv: 1885,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3094", name: "Tete des Renards", region: "Le Menil",
    lat: 47.9029, lon: 6.8044, elevation: 850, dhv: 3094,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_5080", name: "Tete du Mottey", region: "Saint-Gervais-les-Bains",
    lat: 45.843, lon: 6.7008, elevation: 1878, dhv: 5080,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3091", name: "Theatre Graviers", region: "Saulxures-sur-Moselotte",
    lat: 47.9536, lon: 6.7227, elevation: 763, dhv: 3091,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4933", name: "Thonnance-les-Joinville", region: "Thonnance-les-Joinville",
    lat: 48.4522, lon: 5.1754, elevation: 287, dhv: 4933,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5069_NW", name: "Tignes (NW)", region: "Tignes",
    lat: 45.4562, lon: 6.9196, elevation: 2675, dhv: 5069,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5069_SW", name: "Tignes (SW)", region: "Tignes",
    lat: 45.455, lon: 6.9206, elevation: 2671, dhv: 5069,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5629", name: "Tolla", region: "Tolla",
    lat: 41.9974, lon: 8.967, elevation: 1419, dhv: 5629,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2168", name: "Torcieu", region: "Torcieu",
    lat: 45.911, lon: 5.3973, elevation: 559, dhv: 2168,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_3329", name: "Tourmalet", region: "Bareges",
    lat: 42.911, lon: 0.1434, elevation: 2206, dhv: 3329,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_4882", name: "Tracy", region: "Tracy-sur-Mer",
    lat: 49.343, lon: -0.6358, elevation: 28, dhv: 4882,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4898", name: "Tredrez-Locquemeau", region: "Tredrez-Locquemeau",
    lat: 48.6952, lon: -3.5793, elevation: 54, dhv: 4898,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4914", name: "Trefeuntec", region: "Trefeuntec",
    lat: 48.1312, lon: -4.2763, elevation: 21, dhv: 4914,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_4973", name: "Tremolat", region: "Tremolat",
    lat: 44.8878, lon: 0.8188, elevation: 150, dhv: 4973,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1829", name: "Tres le Mont", region: "Ocier",
    lat: 46.2856, lon: 6.4892, elevation: 1350, dhv: 1829,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3180", name: "Trossagne", region: "Ourciere",
    lat: 45.5189, lon: 2.9836, elevation: 1103, dhv: 3180,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3063", name: "Tuchenn Kador", region: "Botmeur",
    lat: 48.3741, lon: -3.9519, elevation: 370, dhv: 3063,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3088", name: "Tumulus", region: "Vecoux",
    lat: 47.9661, lon: 6.6511, elevation: 780, dhv: 3088,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3134", name: "Uchon", region: "Uchon",
    lat: 46.8069, lon: 4.2534, elevation: 636, dhv: 3134,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3338_NO", name: "Val Louron (NO)", region: "Genos",
    lat: 42.7768, lon: 0.3784, elevation: 1997, dhv: 3338,
    sectors: [[33.75, 101.25], [33.75, 56.25]], sectorLabel: "NO-O · NO", ...DEF },

  { id: "db_3338_O", name: "Val Louron (O)", region: "Genos",
    lat: 42.8078, lon: 0.3775, elevation: 1657, dhv: 3338,
    sectors: [[78.75, 101.25], [33.75, 146.25]], sectorLabel: "O · NO-SO", ...DEF },

  { id: "db_3338_W", name: "Val Louron (W)", region: "Genos",
    lat: 42.8055, lon: 0.4297, elevation: 1441, dhv: 3338,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1870_SW", name: "Val Pelouse (SW)", region: "Arvillard",
    lat: 45.4193, lon: 6.1688, elevation: 1715, dhv: 1870,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1870_W", name: "Val Pelouse (W)", region: "Arvillard",
    lat: 45.4209, lon: 6.174, elevation: 1863, dhv: 1870,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3219", name: "Valgorge", region: "Valgorge",
    lat: 44.6101, lon: 4.1017, elevation: 1402, dhv: 3219,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1877", name: "Vallandry", region: "Bourg St. Maurice",
    lat: 45.5603, lon: 6.7653, elevation: 1590, dhv: 1877,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3217", name: "Vallon de la Saume", region: "Noyer",
    lat: 44.7015, lon: 5.9932, elevation: 1767, dhv: 3217,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2307", name: "Varan", region: "Sallanches",
    lat: 45.9432, lon: 6.6828, elevation: 1515, dhv: 2307,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2312", name: "Varces", region: "Varces",
    lat: 45.0966, lon: 5.6462, elevation: 982, dhv: 2312,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2308", name: "Vaugelaz", region: "Bourg St. Maurice",
    lat: 45.6038, lon: 6.7146, elevation: 1901, dhv: 2308,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1958", name: "Vaujany", region: "Vaujany",
    lat: 45.1632, lon: 6.0587, elevation: 1822, dhv: 1958,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4924", name: "Vauville", region: "Vauville",
    lat: 49.6498, lon: -1.8558, elevation: 121, dhv: 4924,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4941", name: "Vaux-en-Pre", region: "Vaux-en-Pre",
    lat: 46.6292, lon: 4.5867, elevation: 387, dhv: 4941,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3113_O", name: "Velars (O)", region: "Velars-sur-Ouche",
    lat: 47.3016, lon: 4.9005, elevation: 540, dhv: 3113,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3113_W", name: "Velars (W)", region: "Velars-sur-Ouche",
    lat: 47.3022, lon: 4.9, elevation: 540, dhv: 3113,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4889", name: "Venoize", region: "Sancerre",
    lat: 47.3218, lon: 2.7986, elevation: 342, dhv: 4889,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4959", name: "Verdun", region: "Verdun",
    lat: 42.7905, lon: 1.7057, elevation: 1025, dhv: 4959,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3351", name: "Vero", region: "Vero",
    lat: 42.0722, lon: 8.9073, elevation: 874, dhv: 3351,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4978", name: "Vesoles", region: "Saint-Etienne-D&#039;Albgnan",
    lat: 43.5612, lon: 2.8264, elevation: 1095, dhv: 4978,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4881", name: "Vierville-sur-Mer", region: "Vierville-sur-Mer",
    lat: 49.3823, lon: -0.9094, elevation: 19, dhv: 4881,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4884", name: "Villerville", region: "Villerville",
    lat: 49.3911, lon: 0.1075, elevation: 18, dhv: 4884,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1799", name: "Villevieille", region: "Digne les Bains",
    lat: 44.0763, lon: 6.2413, elevation: 1003, dhv: 1799,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4931", name: "Vincelles", region: "Vincelles",
    lat: 49.0999, lon: 3.6533, elevation: 178, dhv: 4931,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2310", name: "Vizille", region: "Vizille",
    lat: 45.0369, lon: 5.7858, elevation: 981, dhv: 2310,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5630", name: "Vizzavona", region: "Vivario",
    lat: 42.1033, lon: 9.1066, elevation: 1108, dhv: 5630,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3067", name: "Vouecourt", region: "Vouecourt",
    lat: 48.265, lon: 5.1439, elevation: 324, dhv: 3067,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3003_NW", name: "Wimereux (NW)", region: "Wimereux",
    lat: 50.7515, lon: 1.5979, elevation: 37, dhv: 3003,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3003_SW", name: "Wimereux (SW)", region: "Wimereux",
    lat: 50.7501, lon: 1.5959, elevation: 25, dhv: 3003,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  // --- Italien ---
  { id: "db_3851", name: "Agira", region: "Agira",
    lat: 37.6555, lon: 14.5298, elevation: 786, dhv: 3851,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1232", name: "Ahornach", region: "Sand in Taufers",
    lat: 46.926, lon: 11.9677, elevation: 1425, dhv: 1232,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2002", name: "Albino", region: "Albino",
    lat: 45.7834, lon: 9.7996, elevation: 1082, dhv: 2002,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3803", name: "Alghero", region: "Alghero",
    lat: 40.5075, lon: 8.3834, elevation: 345, dhv: 3803,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1969", name: "Alpe Bil", region: "Macugnagna",
    lat: 45.9757, lon: 7.9676, elevation: 1686, dhv: 1969,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1932", name: "Alpe Cavalotti", region: "Unchio",
    lat: 45.9862, lon: 8.52, elevation: 1179, dhv: 1932,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1554", name: "Alpe Cermis", region: "Cavalese",
    lat: 46.244, lon: 11.5036, elevation: 2197, dhv: 1554,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_2022", name: "Alpe Giumello", region: "Taceno",
    lat: 46.0452, lon: 9.3564, elevation: 1545, dhv: 2022,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5452", name: "Alpe Lusentino", region: "Domodossola",
    lat: 46.1026, lon: 8.2541, elevation: 1124, dhv: 5452,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2020_S", name: "Alpe Mara (S)", region: "Sondrio",
    lat: 46.1886, lon: 9.8856, elevation: 1210, dhv: 2020,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2020_SW", name: "Alpe Mara (SW)", region: "Sondrio",
    lat: 46.2069, lon: 9.9214, elevation: 1793, dhv: 2020,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5444", name: "Alpe Mera", region: "Scopello",
    lat: 45.7388, lon: 8.0869, elevation: 1738, dhv: 5444,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2048", name: "Alpe Motta", region: "Campodolciono",
    lat: 46.4174, lon: 9.3619, elevation: 1919, dhv: 2048,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3700", name: "Alpe Quaggione", region: "Verbania",
    lat: 45.9137, lon: 8.382, elevation: 1313, dhv: 3700,
    sectors: [[33.75, 191.25]], sectorLabel: "NO-S", ...DEF },

  { id: "db_3703", name: "Alpo di Storo", region: "Bondone",
    lat: 45.8099, lon: 10.5739, elevation: 1491, dhv: 3703,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1550", name: "Antenna Castalunga", region: "Bassano del Grappa",
    lat: 45.8117, lon: 11.7451, elevation: 741, dhv: 1550,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_3801", name: "Argentiera", region: "La Lacuna",
    lat: 40.7584, lon: 8.1613, elevation: 21, dhv: 3801,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3855", name: "Assoro", region: "Assoro",
    lat: 37.6259, lon: 14.427, elevation: 872, dhv: 3855,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5339", name: "Atena Lucana", region: "Polla",
    lat: 40.5075, lon: 15.5405, elevation: 891, dhv: 5339,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5328", name: "Atrigna", region: "Atrigna",
    lat: 39.8622, lon: 15.7964, elevation: 104, dhv: 5328,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5381", name: "Avellino", region: "Avellino",
    lat: 40.8835, lon: 14.8797, elevation: 845, dhv: 5381,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1917_S", name: "Aviano (S)", region: "Aviano",
    lat: 46.0873, lon: 12.53, elevation: 1087, dhv: 1917,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1917_SO", name: "Aviano (SO)", region: "Aviano",
    lat: 46.0811, lon: 12.5408, elevation: 779, dhv: 1917,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3871", name: "Avola", region: "Avola",
    lat: 36.9515, lon: 15.1507, elevation: 264, dhv: 3871,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3832", name: "Bagaladi", region: "Bagaladi",
    lat: 38.0364, lon: 15.8085, elevation: 966, dhv: 3832,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3823", name: "Bagnara", region: "Bagnara",
    lat: 38.2818, lon: 15.818, elevation: 534, dhv: 3823,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2121", name: "Baita", region: "Concei",
    lat: 45.9242, lon: 10.76, elevation: 1481, dhv: 2121,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1551_S", name: "Bassano (S)", region: "Borso del Grappa",
    lat: 45.8615, lon: 11.8039, elevation: 1558, dhv: 1551,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1551_SO", name: "Bassano (SO)", region: "Borso del Grappa",
    lat: 45.8244, lon: 11.7712, elevation: 858, dhv: 1551,
    sectors: [[123.75, 146.25], [123.75, 191.25]], sectorLabel: "SO · SO-S", ...DEF },

  { id: "db_1551_W", name: "Bassano (W)", region: "Borso del Grappa",
    lat: 45.8283, lon: 11.768, elevation: 980, dhv: 1551,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5331", name: "Baunei", region: "Baunei",
    lat: 40.0344, lon: 9.665, elevation: 650, dhv: 5331,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5443", name: "Bellon", region: "Saint Maurice",
    lat: 45.7293, lon: 7.2303, elevation: 1517, dhv: 5443,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1242_SW", name: "Belvedere (SW)", region: "Canazei",
    lat: 46.4742, lon: 11.8019, elevation: 2348, dhv: 1242,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1242_W", name: "Belvedere (W)", region: "Canazei",
    lat: 46.4828, lon: 11.7946, elevation: 2076, dhv: 1242,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2032", name: "Bergeggi", region: "Bergeggi",
    lat: 44.2515, lon: 8.4402, elevation: 275, dhv: 2032,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1927", name: "Bernadia", region: "Torlano di Sopra",
    lat: 46.2252, lon: 13.2636, elevation: 699, dhv: 1927,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5447", name: "Betulle", region: "Carreggiata",
    lat: 46.0228, lon: 9.4128, elevation: 1767, dhv: 5447,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2272", name: "Bevera", region: "Ventimiglia",
    lat: 43.8315, lon: 7.5671, elevation: 425, dhv: 2272,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3707", name: "Bielli", region: "Bielli",
    lat: 45.7857, lon: 11.6349, elevation: 802, dhv: 3707,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5438", name: "Bielmonte", region: "Sagliano Micca",
    lat: 45.6605, lon: 8.0744, elevation: 1452, dhv: 5438,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3794", name: "Bocca della Selva", region: "Cusano Mutri",
    lat: 41.3687, lon: 14.5225, elevation: 1185, dhv: 3794,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2125_NO", name: "Boe (NO)", region: "Corvara",
    lat: 46.5265, lon: 11.8616, elevation: 2199, dhv: 2125,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_2125_O", name: "Boe (O)", region: "Corvara",
    lat: 46.5217, lon: 11.8505, elevation: 2485, dhv: 2125,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3841", name: "Bolognetta", region: "Bolognetta",
    lat: 37.9487, lon: 13.4512, elevation: 770, dhv: 3841,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2034", name: "Borgio Verezzi", region: "Borgio Verezzi",
    lat: 44.1649, lon: 8.3192, elevation: 273, dhv: 2034,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2013", name: "Bormio", region: "Bormio",
    lat: 46.4205, lon: 10.4116, elevation: 2973, dhv: 2013,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3808", name: "Bortigali", region: "Bortigali",
    lat: 40.2968, lon: 8.8409, elevation: 1019, dhv: 3808,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3809_NW", name: "Bosa (NW)", region: "Bosa",
    lat: 40.2814, lon: 8.4862, elevation: 93, dhv: 3809,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3809_W", name: "Bosa (W)", region: "Bosa",
    lat: 40.281, lon: 8.4885, elevation: 157, dhv: 3809,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3717", name: "Boves", region: "Boves",
    lat: 44.2988, lon: 7.5532, elevation: 1058, dhv: 3717,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5391", name: "Boville Ernica", region: "Boville Ernica",
    lat: 41.6405, lon: 13.4719, elevation: 437, dhv: 5391,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5424", name: "Bric Rond", region: "Malzat",
    lat: 44.8692, lon: 7.0699, elevation: 2466, dhv: 5424,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3816", name: "Buggerru", region: "Buggerru",
    lat: 39.4109, lon: 8.4254, elevation: 498, dhv: 3816,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5488", name: "Bulga", region: "Bosa",
    lat: 40.3012, lon: 8.5095, elevation: 141, dhv: 5488,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3712_SW", name: "Ca' del Monte (SW)", region: "Cecima",
    lat: 44.8163, lon: 9.0733, elevation: 674, dhv: 3712,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3712_W", name: "Ca' del Monte (W)", region: "Cecima",
    lat: 44.8183, lon: 9.0712, elevation: 677, dhv: 3712,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3713", name: "Cabella Ligure", region: "Cabella Ligure",
    lat: 44.6962, lon: 9.1412, elevation: 1501, dhv: 3713,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5382", name: "Cairano", region: "Cairano",
    lat: 40.896, lon: 15.3655, elevation: 778, dhv: 5382,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5335", name: "Cala Gonone", region: "Cala Gonone",
    lat: 40.2754, lon: 9.5944, elevation: 568, dhv: 5335,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3766", name: "Calascio", region: "Volpe",
    lat: 42.3254, lon: 13.7092, elevation: 1323, dhv: 3766,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5334", name: "Calda Terme", region: "Latronico",
    lat: 40.1052, lon: 15.9756, elevation: 1451, dhv: 5334,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5445", name: "Caltrano", region: "Chiuppano",
    lat: 45.7795, lon: 11.5023, elevation: 736, dhv: 5445,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3796", name: "Calvisi", region: "Calvisi",
    lat: 41.332, lon: 14.4542, elevation: 1020, dhv: 3796,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5388", name: "Campitello Matese", region: "Campitello Matese",
    lat: 41.4551, lon: 14.4243, elevation: 1690, dhv: 5388,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3723", name: "Campo Cecina", region: "Carrara",
    lat: 44.1147, lon: 10.1151, elevation: 1103, dhv: 3723,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3725", name: "Campo Cucco", region: "Gaggio Montano",
    lat: 44.2126, lon: 10.9394, elevation: 897, dhv: 3725,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5392", name: "Campocatino", region: "Guarcino",
    lat: 41.8288, lon: 13.3297, elevation: 1771, dhv: 5392,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3792", name: "Campochiaro", region: "Campochiaro",
    lat: 41.4371, lon: 14.4985, elevation: 1067, dhv: 3792,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2275", name: "Campogrosso", region: "Recoaro Terme",
    lat: 45.7288, lon: 11.1795, elevation: 1459, dhv: 2275,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2323", name: "Campogrosso", region: "Recoaro Terme Vicence",
    lat: 45.7295, lon: 11.1785, elevation: 1457, dhv: 2323,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3813", name: "Campotenese", region: "Campotenese",
    lat: 39.8479, lon: 16.0902, elevation: 1300, dhv: 3813,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5397", name: "Cannatina", region: "Brittoli",
    lat: 42.3087, lon: 13.8261, elevation: 1360, dhv: 5397,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3699", name: "Capanna Bruno", region: "San Fedele",
    lat: 45.9435, lon: 9.0657, elevation: 1093, dhv: 3699,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2028", name: "Capo Mele", region: "Laigueglia",
    lat: 43.9651, lon: 8.1606, elevation: 200, dhv: 2028,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3825", name: "Capo Milazzo", region: "Milazzo",
    lat: 38.2635, lon: 15.2382, elevation: 44, dhv: 3825,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3863", name: "Capo Rossello", region: "Lido Rossello",
    lat: 37.2965, lon: 13.4532, elevation: 59, dhv: 3863,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5460", name: "Carosello 3000", region: "Livigno",
    lat: 46.517, lon: 10.0875, elevation: 2772, dhv: 5460,
    sectors: [[348.75, 191.25]], sectorLabel: "N-S", ...DEF },

  { id: "db_3790_S", name: "Cassino (S)", region: "Caira",
    lat: 41.551, lon: 13.8004, elevation: 783, dhv: 3790,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3790_SO", name: "Cassino (SO)", region: "Caira",
    lat: 41.5472, lon: 13.8122, elevation: 702, dhv: 3790,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3800", name: "Castel San Giorgio", region: "Lanzara",
    lat: 40.778, lon: 14.6574, elevation: 284, dhv: 3800,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5409", name: "Casteldimezzo", region: "Casteldimezzo",
    lat: 43.9613, lon: 12.7986, elevation: 163, dhv: 5409,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2019", name: "Castionetto", region: "Chiuro",
    lat: 46.1907, lon: 10.0163, elevation: 1604, dhv: 2019,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3870", name: "Cavalli", region: "Chiaramonte Gulfi",
    lat: 36.9823, lon: 14.6928, elevation: 749, dhv: 3870,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5312", name: "Cefalu", region: "Cefalu",
    lat: 38.0184, lon: 14.0094, elevation: 477, dhv: 5312,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1976", name: "Celle", region: "Caprie",
    lat: 45.1315, lon: 7.36, elevation: 1017, dhv: 1976,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1558", name: "Ceresana", region: "Cogollo",
    lat: 45.804, lon: 11.4381, elevation: 1227, dhv: 1558,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3807", name: "Certosa di Padula", region: "Padula Salerno",
    lat: 40.3253, lon: 15.6958, elevation: 1372, dhv: 3807,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3772", name: "Cervara di Roma", region: "Cervara di Roma",
    lat: 41.9845, lon: 13.0743, elevation: 1171, dhv: 3772,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1978", name: "Chiamberlando", region: "Susa",
    lat: 45.1474, lon: 7.087, elevation: 1021, dhv: 1978,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5433", name: "Chianoco", region: "Bruzolo",
    lat: 45.1543, lon: 7.1809, elevation: 830, dhv: 5433,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3704", name: "Chiesa S. Antonio", region: "Zogno",
    lat: 45.8064, lon: 9.6339, elevation: 970, dhv: 3704,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2124_NW", name: "Ciampinoi (NW)", region: "Selva di Val Gardena",
    lat: 46.5393, lon: 11.7529, elevation: 2225, dhv: 2124,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2124_SO", name: "Ciampinoi (SO)", region: "Selva di Val Gardena",
    lat: 46.5383, lon: 11.7521, elevation: 2221, dhv: 2124,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3710", name: "Ciavanis", region: "Chialamberto",
    lat: 45.3784, lon: 7.3568, elevation: 1739, dhv: 3710,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3760", name: "Cima Alta", region: "Isola del Gran Sasso",
    lat: 42.4976, lon: 13.582, elevation: 1678, dhv: 3760,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1974", name: "Cima Bossola", region: "Rueglio",
    lat: 45.4835, lon: 7.7364, elevation: 1221, dhv: 1974,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1343", name: "Col Alto", region: "Corvara",
    lat: 46.5523, lon: 11.8867, elevation: 1959, dhv: 1343,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1239_N", name: "Col Rodella (N)", region: "Canazei",
    lat: 46.4973, lon: 11.7524, elevation: 2380, dhv: 1239,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1239_SO", name: "Col Rodella (SO)", region: "Canazei",
    lat: 46.497, lon: 11.7534, elevation: 2371, dhv: 1239,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1239_SW", name: "Col Rodella (SW)", region: "Canazei",
    lat: 46.4949, lon: 11.7501, elevation: 2383, dhv: 1239,
    sectors: [[213.75, 236.25], [168.75, 281.25]], sectorLabel: "SW · S-W", ...DEF },

  { id: "db_2387", name: "Col Visentin", region: "Revine Lago",
    lat: 46.0537, lon: 12.2821, elevation: 1706, dhv: 2387,
    sectors: [[78.75, 281.25]], sectorLabel: "O-W", ...DEF },

  { id: "db_2127", name: "Colalta", region: "Baselga di Pine",
    lat: 46.1324, lon: 11.2896, elevation: 1940, dhv: 2127,
    sectors: [[348.75, 11.25]], sectorLabel: "N-N", ...DEF },

  { id: "db_5426", name: "Colle Azara", region: "Villar Perosa",
    lat: 44.9234, lon: 7.1816, elevation: 1575, dhv: 5426,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3702", name: "Colle Campeggia", region: "Villaggio del Sole",
    lat: 45.8368, lon: 11.7483, elevation: 1080, dhv: 3702,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3770", name: "Colle Delle Vacches", region: "Fonte D&#039;Amore",
    lat: 42.1192, lon: 13.925, elevation: 1095, dhv: 3770,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1985", name: "Colli Berici", region: "San Germano",
    lat: 45.4072, lon: 11.4719, elevation: 260, dhv: 1985,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3708", name: "Colli di S. Fermo", region: "Grone",
    lat: 45.7431, lon: 9.9369, elevation: 1229, dhv: 3708,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2324", name: "Colonei", region: "Caprino Varonese",
    lat: 45.6516, lon: 10.8144, elevation: 1364, dhv: 2324,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3872", name: "Comiso", region: "Comiso",
    lat: 36.9279, lon: 14.6064, elevation: 480, dhv: 3872,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2015", name: "Confinale", region: "S. Antonio",
    lat: 46.4596, lon: 10.4575, elevation: 2203, dhv: 2015,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2130", name: "Corno Nero", region: "Cavalese",
    lat: 46.3343, lon: 11.4553, elevation: 2399, dhv: 2130,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2274", name: "Corteno Golgi", region: "Edolo",
    lat: 46.1789, lon: 10.2543, elevation: 1483, dhv: 2274,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2425", name: "Cratere", region: "Porto di Lavente",
    lat: 38.4033, lon: 14.9656, elevation: 371, dhv: 2425,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2039", name: "Creto", region: "Genova",
    lat: 44.4779, lon: 9.0048, elevation: 624, dhv: 2039,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1925", name: "Cuarnan", region: "Gemona del Friuli",
    lat: 46.2735, lon: 13.175, elevation: 1134, dhv: 1925,
    sectors: [[168.75, 191.25], [168.75, 236.25]], sectorLabel: "S · S-SW", ...DEF },

  { id: "db_5456", name: "Cucal", region: "Cavalese",
    lat: 46.3103, lon: 11.4823, elevation: 1551, dhv: 5456,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3726", name: "Cusercoli", region: "Cusercoli",
    lat: 44.0496, lon: 11.9904, elevation: 464, dhv: 3726,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5801", name: "Da Moni", region: "Romano d‘ Ezzelino",
    lat: 45.8033, lon: 11.7444, elevation: 550, dhv: 5801,
    sectors: [[146.25, 168.75]], sectorLabel: "SSO", ...DEF },

  { id: "db_2126", name: "Dantercepies", region: "Selva di Val Gardena",
    lat: 46.5538, lon: 11.7991, elevation: 2265, dhv: 2126,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3728", name: "Diecimo", region: "Diecimo",
    lat: 43.9821, lon: 10.5, elevation: 736, dhv: 3728,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2011", name: "Dos del Curu", region: "Cevo",
    lat: 46.1028, lon: 10.388, elevation: 2017, dhv: 2011,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1908", name: "Dosso del Sabion", region: "Pinzolo",
    lat: 46.1668, lon: 10.8065, elevation: 2071, dhv: 1908,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2133", name: "Duca D'Aosta", region: "Cortina D&#039;Ampezzo",
    lat: 46.536, lon: 12.0866, elevation: 2032, dhv: 2133,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5512", name: "Egghof", region: "Taufers i. M.",
    lat: 46.6594, lon: 10.4658, elevation: 1710, dhv: 5512,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3858_O", name: "Enna (O)", region: "Enna",
    lat: 37.5675, lon: 14.2895, elevation: 964, dhv: 3858,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3858_SW", name: "Enna (SW)", region: "Enna",
    lat: 37.5583, lon: 14.2759, elevation: 958, dhv: 3858,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5315", name: "Erice", region: "Erice",
    lat: 38.0338, lon: 12.5765, elevation: 617, dhv: 5315,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3810", name: "Falapato", region: "Castelsaraceno",
    lat: 40.1492, lon: 15.9568, elevation: 1216, dhv: 3810,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2325", name: "Faraoro", region: "Chiuppano",
    lat: 45.7893, lon: 11.4841, elevation: 1295, dhv: 2325,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5672", name: "Faserno", region: "Storo",
    lat: 45.8688, lon: 10.5466, elevation: 1457, dhv: 5672,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2030", name: "Finale Ligure", region: "Finale Ligure",
    lat: 44.1841, lon: 8.373, elevation: 269, dhv: 2030,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5410", name: "Folgorito", region: "Querceta",
    lat: 44.016, lon: 10.1939, elevation: 698, dhv: 5410,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3750_NO", name: "Fontanile (NO)", region: "Castelluccio",
    lat: 42.8184, lon: 13.1784, elevation: 1835, dhv: 3750,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3750_SO", name: "Fontanile (SO)", region: "Castelluccio",
    lat: 42.8103, lon: 13.1817, elevation: 1658, dhv: 3750,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3750_SW", name: "Fontanile (SW)", region: "Castelluccio",
    lat: 42.81, lon: 13.1754, elevation: 1701, dhv: 3750,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3750_W", name: "Fontanile (W)", region: "Castelluccio",
    lat: 42.8132, lon: 13.1765, elevation: 1819, dhv: 3750,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3753", name: "Forca di Presta", region: "Castelluccio",
    lat: 42.7852, lon: 13.2517, elevation: 1613, dhv: 3753,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5311", name: "Fraginesi", region: "Trapani",
    lat: 38.0126, lon: 12.8251, elevation: 453, dhv: 5311,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5327", name: "Frascineto", region: "Frascineto",
    lat: 39.849, lon: 16.2635, elevation: 924, dhv: 5327,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5389", name: "Frosolone", region: "Frosolone",
    lat: 41.5997, lon: 14.3981, elevation: 1342, dhv: 5389,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3761", name: "Funivia Assergi", region: "Forte Cerreto",
    lat: 42.4418, lon: 13.5583, elevation: 2112, dhv: 3761,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3771_O", name: "Gagliano Atero (O)", region: "Gagliano Atero",
    lat: 42.108, lon: 13.6988, elevation: 941, dhv: 3771,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3771_SO", name: "Gagliano Atero (SO)", region: "Gagliano Atero",
    lat: 42.11, lon: 13.6945, elevation: 1030, dhv: 3771,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5442", name: "Gaiane", region: "Adrara",
    lat: 45.7136, lon: 9.9379, elevation: 956, dhv: 5442,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1233", name: "Gais", region: "Gais",
    lat: 46.8496, lon: 11.9741, elevation: 1620, dhv: 1233,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_3843", name: "Galladoro", region: "Letojanni Messina",
    lat: 37.8964, lon: 15.308, elevation: 456, dhv: 3843,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_3793", name: "Gallinola", region: "San Gregorio Matese",
    lat: 41.4254, lon: 14.4323, elevation: 1620, dhv: 3793,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5510", name: "Gamassen", region: "Mals",
    lat: 46.6943, lon: 10.5786, elevation: 1662, dhv: 5510,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3683", name: "Gampielalm", region: "Pfunders",
    lat: 46.9148, lon: 11.7053, elevation: 2006, dhv: 3683,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3787", name: "Genzano di Roma", region: "Genzano di Roma",
    lat: 41.6991, lon: 12.6726, elevation: 342, dhv: 3787,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3861_NW", name: "Gerace (NW)", region: "Enna",
    lat: 37.4701, lon: 14.2341, elevation: 693, dhv: 3861,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3861_W", name: "Gerace (W)", region: "Enna",
    lat: 37.4615, lon: 14.2316, elevation: 642, dhv: 3861,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2024", name: "Germasino", region: "Dongo",
    lat: 46.1422, lon: 9.2217, elevation: 1330, dhv: 2024,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_4576", name: "Gesturi", region: "Gesturi",
    lat: 39.7357, lon: 8.9994, elevation: 570, dhv: 4576,
    sectors: [[123.75, 146.25], [123.75, 191.25]], sectorLabel: "SO · SO-S", ...DEF },

  { id: "db_5476", name: "Gewingesalm", region: "Ridnaun",
    lat: 46.9093, lon: 11.2684, elevation: 2055, dhv: 5476,
    sectors: [[303.75, 101.25]], sectorLabel: "NW-O", ...DEF },

  { id: "db_2042", name: "Ginestre", region: "Sestri Lavente",
    lat: 44.2614, lon: 9.4121, elevation: 217, dhv: 2042,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3773", name: "Gioia dei Marsi", region: "Gioia dei Marsi",
    lat: 41.9501, lon: 13.7175, elevation: 1319, dhv: 3773,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1236_O", name: "Gitschberg (O)", region: "Meransen",
    lat: 46.8544, lon: 11.6886, elevation: 2281, dhv: 1236,
    sectors: [[78.75, 146.25], [78.75, 101.25], [33.75, 146.25], [101.25, 123.75]], sectorLabel: "O-SO · O · NO-SO · OSO", ...DEF },

  { id: "db_1236_SO", name: "Gitschberg (SO)", region: "Meransen",
    lat: 46.8242, lon: 11.6789, elevation: 1497, dhv: 1236,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1236_SW", name: "Gitschberg (SW)", region: "Meransen",
    lat: 46.8475, lon: 11.6841, elevation: 2137, dhv: 1236,
    sectors: [[213.75, 281.25], [213.75, 236.25]], sectorLabel: "SW-W · SW", ...DEF },

  { id: "db_1253", name: "Glaiten", region: "St. Leonhard",
    lat: 46.826, lon: 11.2426, elevation: 1305, dhv: 1253,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5441", name: "Gole", region: "Sale Marasino",
    lat: 45.6899, lon: 10.1341, elevation: 1025, dhv: 5441,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3815", name: "Gonnesfaradiga", region: "Gonnesfaradiga",
    lat: 39.4838, lon: 8.681, elevation: 617, dhv: 3815,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2365", name: "Gran Monte", region: "Pradielis",
    lat: 46.2828, lon: 13.2912, elevation: 964, dhv: 2365,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5398", name: "Gran Sasso", region: "Prati di Tivo",
    lat: 42.4897, lon: 13.5694, elevation: 1965, dhv: 5398,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5307", name: "Gratteri", region: "Gratteri",
    lat: 37.9606, lon: 13.9816, elevation: 932, dhv: 5307,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3685", name: "Grente", region: "Antholz",
    lat: 46.8477, lon: 12.0629, elevation: 2195, dhv: 3685,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5405", name: "Gualdo Tadino", region: "Gualdo Tadino",
    lat: 43.2417, lon: 12.8121, elevation: 1280, dhv: 5405,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5324", name: "Guasila", region: "Guasila",
    lat: 39.6065, lon: 9.0418, elevation: 368, dhv: 5324,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3739", name: "Gubbio", region: "Gubbio",
    lat: 43.3646, lon: 12.5738, elevation: 945, dhv: 3739,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3818", name: "Guroneddu", region: "Seruci",
    lat: 39.2487, lon: 8.3996, elevation: 96, dhv: 3818,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1238_NO", name: "Helm (NO)", region: "Sexten",
    lat: 46.716, lon: 12.3742, elevation: 2215, dhv: 1238,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1238_S", name: "Helm (S)", region: "Sexten",
    lat: 46.7153, lon: 12.3734, elevation: 2191, dhv: 1238,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1238_SW", name: "Helm (SW)", region: "Sexten",
    lat: 46.7151, lon: 12.3702, elevation: 2166, dhv: 1238,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1254", name: "Hirzer", region: "Saltaus",
    lat: 46.7354, lon: 11.2522, elevation: 2087, dhv: 1254,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2471", name: "Hoch Joch", region: "Ultimo Bolzano",
    lat: 46.5728, lon: 10.9969, elevation: 2331, dhv: 2471,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1255", name: "Hochmut", region: "Dorf Tirol",
    lat: 46.7017, lon: 11.1312, elevation: 1400, dhv: 1255,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2044", name: "I Casoni", region: "I Casoni",
    lat: 44.2973, lon: 9.7837, elevation: 1003, dhv: 2044,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5428", name: "Il Podio", region: "Dubbione",
    lat: 44.9476, lon: 7.2362, elevation: 903, dhv: 5428,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3757", name: "Ionella", region: "Ionella",
    lat: 42.6776, lon: 13.6209, elevation: 1063, dhv: 3757,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5308", name: "Isnello", region: "Isnello",
    lat: 37.9674, lon: 14.0049, elevation: 855, dhv: 5308,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5408", name: "Isolabona", region: "Isolabona",
    lat: 43.8881, lon: 7.6219, elevation: 702, dhv: 5408,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1559", name: "Kanzel", region: "Sulden",
    lat: 46.5228, lon: 10.607, elevation: 2329, dhv: 1559,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1235_N", name: "Kronplatz (N)", region: "Bruneck",
    lat: 46.7395, lon: 11.9596, elevation: 2265, dhv: 1235,
    sectors: [[348.75, 11.25], [348.75, 56.25]], sectorLabel: "N · N-NO", ...DEF },

  { id: "db_1235_O", name: "Kronplatz (O)", region: "Bruneck",
    lat: 46.7388, lon: 11.9666, elevation: 2249, dhv: 1235,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1235_SO", name: "Kronplatz (SO)", region: "Bruneck",
    lat: 46.7381, lon: 11.9591, elevation: 2261, dhv: 1235,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1235_SW", name: "Kronplatz (SW)", region: "Bruneck",
    lat: 46.7389, lon: 11.9569, elevation: 2263, dhv: 1235,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1235_W", name: "Kronplatz (W)", region: "Bruneck",
    lat: 46.7374, lon: 11.9548, elevation: 2249, dhv: 1235,
    sectors: [[258.75, 326.25], [258.75, 281.25]], sectorLabel: "W-NW · W", ...DEF },

  { id: "db_5457", name: "Kurtatsch", region: "Kurtatsch",
    lat: 46.3295, lon: 11.21, elevation: 1157, dhv: 5457,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3767", name: "L'Aquila", region: "Contrada D&#039;Appolloni",
    lat: 42.3185, lon: 13.2516, elevation: 1306, dhv: 3767,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3748", name: "La Banditella", region: "Cupi",
    lat: 42.9876, lon: 13.1412, elevation: 1509, dhv: 3748,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2277", name: "La Guardia", region: "Recoaro Terme",
    lat: 45.7192, lon: 11.1817, elevation: 1125, dhv: 2277,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1240", name: "La Lokomotiva", region: "Canazei",
    lat: 46.5078, lon: 11.7718, elevation: 2312, dhv: 1240,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1903", name: "La Magdeleine", region: "Antey-Saint-Andre",
    lat: 45.8175, lon: 7.6125, elevation: 1858, dhv: 1903,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2046", name: "La Penna", region: "Mendatica",
    lat: 44.0484, lon: 7.7725, elevation: 1882, dhv: 2046,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1977_S", name: "La Riposa (S)", region: "Susa",
    lat: 45.1784, lon: 7.0815, elevation: 2169, dhv: 1977,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1977_SW", name: "La Riposa (SW)", region: "Susa",
    lat: 45.1658, lon: 7.0821, elevation: 1816, dhv: 1977,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3743", name: "La Rocca", region: "Morichella",
    lat: 43.0661, lon: 13.2537, elevation: 821, dhv: 3743,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3752", name: "La Rotonda", region: "Castelluccio",
    lat: 42.8004, lon: 13.2178, elevation: 1392, dhv: 3752,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3785", name: "Lago Albano", region: "Marino Roma",
    lat: 41.7602, lon: 12.6752, elevation: 463, dhv: 3785,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5404", name: "Lago di Caccamo", region: "Pievefavera",
    lat: 43.1247, lon: 13.1924, elevation: 789, dhv: 5404,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5511", name: "Langenstein", region: "Sulden",
    lat: 46.519, lon: 10.5771, elevation: 2313, dhv: 5511,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3692", name: "Lavinaspitz", region: "Kaltern",
    lat: 46.3889, lon: 11.2104, elevation: 1646, dhv: 3692,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2426", name: "Lentia", region: "Lentia",
    lat: 38.4094, lon: 14.9417, elevation: 126, dhv: 2426,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3798", name: "Littigheddu", region: "San Giovanni",
    lat: 40.8808, lon: 8.7858, elevation: 391, dhv: 3798,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3799", name: "Loggia di Pilato", region: "Impalata",
    lat: 40.8759, lon: 17.2861, elevation: 339, dhv: 3799,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1538", name: "Lüsen", region: "Lüsen",
    lat: 46.7629, lon: 11.7544, elevation: 1603, dhv: 1538,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3846", name: "Madonna dell' Alto", region: "Calcarelli",
    lat: 37.8315, lon: 14.0498, elevation: 1783, dhv: 3846,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5395", name: "Maiella", region: "Bocca di Valle",
    lat: 42.1598, lon: 14.133, elevation: 1900, dhv: 5395,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2134", name: "Malga Losch", region: "Voltago Agordino",
    lat: 46.2601, lon: 11.9617, elevation: 1708, dhv: 2134,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5437", name: "Malga Rialto", region: "Pozza",
    lat: 45.6515, lon: 11.2369, elevation: 1077, dhv: 5437,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3693", name: "Malgola", region: "Predazzo",
    lat: 46.3051, lon: 11.6109, elevation: 1410, dhv: 3693,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1918", name: "Maniago", region: "Maniago",
    lat: 46.177, lon: 12.6765, elevation: 836, dhv: 1918,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5330", name: "Maratea", region: "Acquafredda",
    lat: 40.0302, lon: 15.7069, elevation: 931, dhv: 5330,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5449", name: "Margone", region: "Sarche",
    lat: 46.0742, lon: 10.9694, elevation: 947, dhv: 5449,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3806", name: "Marsicovetere", region: "Masicovetere",
    lat: 40.377, lon: 15.8333, elevation: 1162, dhv: 3806,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3735", name: "Massanera", region: "Regello",
    lat: 43.7015, lon: 11.556, elevation: 1055, dhv: 3735,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5299", name: "Mellini 1", region: "Mellini",
    lat: 37.172, lon: 15.1403, elevation: 270, dhv: 5299,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5300", name: "Mellini 2", region: "Mellini",
    lat: 37.183, lon: 15.1137, elevation: 325, dhv: 5300,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2041", name: "Mendatica", region: "Mendatica",
    lat: 44.0898, lon: 7.7927, elevation: 1221, dhv: 2041,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2472", name: "Meran 2000", region: "Meran",
    lat: 46.6769, lon: 11.2541, elevation: 1876, dhv: 2472,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5390", name: "Miranda", region: "Miranda",
    lat: 41.6387, lon: 14.2678, elevation: 1160, dhv: 5390,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1348", name: "Misurina", region: "Misurina",
    lat: 46.6124, lon: 12.2918, elevation: 2301, dhv: 1348,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3715_NO", name: "Mofestino (NO)", region: "Mofestino",
    lat: 44.4278, lon: 10.8259, elevation: 757, dhv: 3715,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3715_O", name: "Mofestino (O)", region: "Mofestino",
    lat: 44.4256, lon: 10.8254, elevation: 753, dhv: 3715,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1896", name: "Molveno", region: "Molveno",
    lat: 46.1543, lon: 10.9556, elevation: 1485, dhv: 1896,
    sectors: [[123.75, 236.25], [168.75, 191.25]], sectorLabel: "SO-SW · S", ...DEF },

  { id: "db_2260_N", name: "Mombarcaro (N)", region: "Mombarcaro",
    lat: 44.4692, lon: 8.0843, elevation: 868, dhv: 2260,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2260_SO", name: "Mombarcaro (SO)", region: "Mombarcaro",
    lat: 44.4658, lon: 8.0916, elevation: 842, dhv: 2260,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_5451", name: "Moncucco", region: "Domodossola",
    lat: 46.0915, lon: 8.2268, elevation: 1815, dhv: 5451,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1979", name: "Mont San Giorgio", region: "Piossasco",
    lat: 44.9969, lon: 7.448, elevation: 809, dhv: 1979,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3842", name: "Montagna Grande", region: "Contrada Castello",
    lat: 37.8998, lon: 12.7702, elevation: 656, dhv: 3842,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3844", name: "Montagna Grande Süd", region: "Contrada Castello",
    lat: 37.8913, lon: 12.7486, elevation: 682, dhv: 3844,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5429", name: "Montalto Pavese", region: "Pezzolo",
    lat: 44.9677, lon: 9.2285, elevation: 430, dhv: 5429,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2393", name: "Monte Acuto", region: "Cagli",
    lat: 43.4954, lon: 12.6637, elevation: 1185, dhv: 2393,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5333", name: "Monte Alpi", region: "Case Baroni",
    lat: 40.0986, lon: 15.9695, elevation: 1270, dhv: 5333,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3727", name: "Monte Altuzzo", region: "Ponzalla",
    lat: 44.0416, lon: 11.3904, elevation: 896, dhv: 3727,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3795", name: "Monte Ariola", region: "San Potito",
    lat: 41.3603, lon: 14.4174, elevation: 1133, dhv: 3795,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1342", name: "Monte Avena", region: "Feltre",
    lat: 46.0297, lon: 11.8264, elevation: 1394, dhv: 1342,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1895", name: "Monte Baldo", region: "Malcesine",
    lat: 45.7775, lon: 10.8628, elevation: 1742, dhv: 1895,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2038", name: "Monte Banca", region: "Montoggio",
    lat: 44.5363, lon: 9.0437, elevation: 901, dhv: 2038,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3719_NW", name: "Monte Battaglia (NW)", region: "San Ruffillo",
    lat: 44.2219, lon: 11.5825, elevation: 658, dhv: 3719,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3719_SO", name: "Monte Battaglia (SO)", region: "San Ruffillo",
    lat: 44.2227, lon: 11.5844, elevation: 643, dhv: 3719,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2135", name: "Monte Belpo", region: "Costermano",
    lat: 45.6164, lon: 10.7614, elevation: 864, dhv: 2135,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2023_SO", name: "Monte Berlinghera (SO)", region: "Gera Lario",
    lat: 46.1908, lon: 9.3905, elevation: 1080, dhv: 2023,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2023_SW", name: "Monte Berlinghera (SW)", region: "Gera Lario",
    lat: 46.2103, lon: 9.3888, elevation: 1881, dhv: 2023,
    sectors: [[213.75, 281.25], [213.75, 236.25]], sectorLabel: "SW-W · SW", ...DEF },

  { id: "db_2003", name: "Monte Blum", region: "Rovetta",
    lat: 45.9108, lon: 9.9803, elevation: 1296, dhv: 2003,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5421", name: "Monte Boglelio", region: "Bastardini",
    lat: 44.7482, lon: 9.2133, elevation: 1459, dhv: 5421,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1986_NO", name: "Monte Bondone (NO)", region: "Lasino",
    lat: 46.0411, lon: 11.0264, elevation: 1535, dhv: 1986,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1986_SW", name: "Monte Bondone (SW)", region: "Lasino",
    lat: 45.9972, lon: 11.0252, elevation: 1739, dhv: 1986,
    sectors: [[213.75, 236.25], [213.75, 281.25]], sectorLabel: "SW · SW-W", ...DEF },

  { id: "db_1986_W", name: "Monte Bondone (W)", region: "Lasino",
    lat: 46.0426, lon: 11.0132, elevation: 1313, dhv: 1986,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3709", name: "Monte Bronzone", region: "Sarnico",
    lat: 45.6928, lon: 9.9953, elevation: 939, dhv: 3709,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_5414_N", name: "Monte Caio (N)", region: "Schia",
    lat: 44.4649, lon: 10.1619, elevation: 1452, dhv: 5414,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5414_S", name: "Monte Caio (S)", region: "Schia",
    lat: 44.4641, lon: 10.1604, elevation: 1469, dhv: 5414,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3733", name: "Monte Capanne", region: "San Giuliano Terme",
    lat: 43.7784, lon: 10.4404, elevation: 334, dhv: 3733,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_4573", name: "Monte Capanne", region: "Marcianna",
    lat: 42.7725, lon: 10.1693, elevation: 951, dhv: 4573,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3764", name: "Monte Cappucciata", region: "Villa Santa Lucia",
    lat: 42.3447, lon: 13.7849, elevation: 1503, dhv: 3764,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5338", name: "Monte Carmelo", region: "Sant Arsenio",
    lat: 40.4771, lon: 15.4592, elevation: 1118, dhv: 5338,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3732", name: "Monte Carpegna", region: "Carpegna",
    lat: 43.8015, lon: 12.3349, elevation: 1316, dhv: 3732,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1929", name: "Monte Carso", region: "Dorligo della Valle",
    lat: 45.607, lon: 13.8695, elevation: 423, dhv: 1929,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5480", name: "Monte Carza", region: "Cannero Riviera",
    lat: 46.0421, lon: 8.6736, elevation: 1080, dhv: 5480,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1972_S", name: "Monte Cavallaria, Cima Cavallaria, (S)", region: "Borgofranco D&#039;Ivrea",
    lat: 45.5206, lon: 7.8072, elevation: 1436, dhv: 1972,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1972_SO", name: "Monte Cavallaria, Cima Cavallaria, (SO)", region: "Borgofranco D&#039;Ivrea",
    lat: 45.5072, lon: 7.8099, elevation: 975, dhv: 1972,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1972_SW", name: "Monte Cavallaria, Cima Cavallaria, (SW)", region: "Borgofranco D&#039;Ivrea",
    lat: 45.5134, lon: 7.7969, elevation: 1374, dhv: 1972,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1549", name: "Monte Cesen", region: "Valdobbiadene",
    lat: 45.9309, lon: 12.0205, elevation: 1390, dhv: 1549,
    sectors: [[78.75, 281.25], [168.75, 191.25]], sectorLabel: "O-W · S", ...DEF },

  { id: "db_5417", name: "Monte Chiappo", region: "Aie Cosola",
    lat: 44.6827, lon: 9.1984, elevation: 1668, dhv: 5417,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1897", name: "Monte Chiaro", region: "Belluna",
    lat: 46.0475, lon: 9.3483, elevation: 1527, dhv: 1897,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5332", name: "Monte Coccovello", region: "Acquafredda",
    lat: 40.0483, lon: 15.6987, elevation: 1130, dhv: 5332,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3831", name: "Monte Cofano", region: "San Vito lo Capo",
    lat: 38.0999, lon: 12.6841, elevation: 286, dhv: 3831,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1899", name: "Monte Cornizzolo", region: "Cesana Brianza",
    lat: 45.8332, lon: 9.3021, elevation: 1035, dhv: 1899,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3705", name: "Monte Corno", region: "Chiuppano",
    lat: 45.8, lon: 11.5444, elevation: 1189, dhv: 3705,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3763", name: "Monte Cosce", region: "Rocchette",
    lat: 42.4062, lon: 12.6327, elevation: 1093, dhv: 3763,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5802", name: "Monte Crapene", region: "Livigno",
    lat: 46.5467, lon: 10.1692, elevation: 2420, dhv: 5802,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_3762_NW", name: "Monte Cristo (NW)", region: "Forte Correto",
    lat: 42.3968, lon: 13.5671, elevation: 1627, dhv: 3762,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3762_SW", name: "Monte Cristo (SW)", region: "Forte Correto",
    lat: 42.4129, lon: 13.5752, elevation: 1896, dhv: 3762,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5431", name: "Monte Cuccetto", region: "Castelnuovo",
    lat: 44.9768, lon: 7.2344, elevation: 1605, dhv: 5431,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3740_NO", name: "Monte Cucco (NO)", region: "Sigillo",
    lat: 43.3565, lon: 12.7714, elevation: 1120, dhv: 3740,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3740_SW", name: "Monte Cucco (SW)", region: "Sigillo",
    lat: 43.3571, lon: 12.7498, elevation: 1188, dhv: 3740,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_4572", name: "Monte di Capaccio Vecchio", region: "Capaccio",
    lat: 40.4493, lon: 15.0495, elevation: 207, dhv: 4572,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2021", name: "Monte Farno", region: "Gandino",
    lat: 45.8319, lon: 9.9075, elevation: 1286, dhv: 2021,
    sectors: [[123.75, 236.25], [78.75, 281.25], [168.75, 191.25]], sectorLabel: "SO-SW · O-W · S", ...DEF },

  { id: "db_5430", name: "Monte Freidur", region: "Roletto",
    lat: 44.9731, lon: 7.3031, elevation: 1452, dhv: 5430,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_3729", name: "Monte Gabberi", region: "Camaiore",
    lat: 43.9668, lon: 10.2953, elevation: 1081, dhv: 3729,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3698", name: "Monte Galbiga", region: "Porlezza",
    lat: 46.0107, lon: 9.1598, elevation: 1672, dhv: 3698,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5304", name: "Monte Gallo", region: "Poggioreale",
    lat: 37.7882, lon: 13.0699, elevation: 538, dhv: 5304,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5450", name: "Monte Gazza", region: "Sarche",
    lat: 46.081, lon: 10.9591, elevation: 1558, dhv: 5450,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3741", name: "Monte Gemmo", region: "Esanatoglia",
    lat: 43.2187, lon: 12.9544, elevation: 1156, dhv: 3741,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5394", name: "Monte Gennaro", region: "Marcellina",
    lat: 42.035, lon: 12.8251, elevation: 757, dhv: 5394,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5412", name: "Monte Gianni", region: "Popolano",
    lat: 44.0806, lon: 11.6335, elevation: 581, dhv: 5412,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3695", name: "Monte Gnino", region: "Porlezza",
    lat: 46.0539, lon: 9.1301, elevation: 898, dhv: 3695,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5316", name: "Monte Griffone", region: "Croceverde",
    lat: 38.0577, lon: 13.4085, elevation: 500, dhv: 5316,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2423", name: "Monte Guardia", region: "Lipari",
    lat: 38.4549, lon: 14.9438, elevation: 344, dhv: 2423,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2007", name: "Monte Guglielmo", region: "Sale Marasino",
    lat: 45.7251, lon: 10.1463, elevation: 1132, dhv: 2007,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3835", name: "Monte Icini", region: "Castellamare del Golfo",
    lat: 38.0012, lon: 12.8592, elevation: 1061, dhv: 3835,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_5313", name: "Monte Lascari", region: "Cocuzzola",
    lat: 38.0207, lon: 13.9606, elevation: 276, dhv: 5313,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_5418", name: "Monte Lesima", region: "Lama",
    lat: 44.6848, lon: 9.2546, elevation: 1635, dhv: 5418,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2009", name: "Monte Linzone", region: "Palazago",
    lat: 45.7766, lon: 9.5318, elevation: 1372, dhv: 2009,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2258", name: "Monte Liretta", region: "Villar san Constanzo",
    lat: 44.499, lon: 7.382, elevation: 1071, dhv: 2258,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3868", name: "Monte Lungo", region: "Femmina Morta",
    lat: 37.0881, lon: 14.1828, elevation: 52, dhv: 3868,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3690", name: "Monte Lussari", region: "Camporosso",
    lat: 46.4827, lon: 13.5206, elevation: 1731, dhv: 3690,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4577", name: "Monte Maccione", region: "Oliena",
    lat: 40.2577, lon: 9.424, elevation: null, dhv: 4577,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2006_O", name: "Monte Maddalena (O)", region: "Brescia",
    lat: 45.5491, lon: 10.2848, elevation: 841, dhv: 2006,
    sectors: [[78.75, 101.25], [78.75, 146.25]], sectorLabel: "O · O-SO", ...DEF },

  { id: "db_2006_SW", name: "Monte Maddalena (SW)", region: "Brescia",
    lat: 45.5371, lon: 10.2707, elevation: 624, dhv: 2006,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3711", name: "Monte Madonna", region: "Ghetto",
    lat: 45.3565, lon: 11.6544, elevation: 461, dhv: 3711,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3839", name: "Monte Maganoce Nord", region: "Santa Christina Gela",
    lat: 37.9607, lon: 13.2989, elevation: 871, dhv: 3839,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3840", name: "Monte Maganoce Süd", region: "Santa Christina Gela",
    lat: 37.9582, lon: 13.2883, elevation: 824, dhv: 3840,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2037", name: "Monte Maggio", region: "Casella",
    lat: 44.5559, lon: 9.0077, elevation: 946, dhv: 2037,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2261_NO", name: "Monte Malanotte (NO)", region: "Frabosa",
    lat: 44.2592, lon: 7.7945, elevation: 1715, dhv: 2261,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_2261_W", name: "Monte Malanotte (W)", region: "Frabosa",
    lat: 44.2596, lon: 7.7938, elevation: 1712, dhv: 2261,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1970", name: "Monte Moro", region: "Macugnagna",
    lat: 45.9966, lon: 7.9778, elevation: 2797, dhv: 1970,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3738", name: "Monte Murano", region: "Serra san Quirico",
    lat: 43.4386, lon: 13.0009, elevation: 804, dhv: 3738,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_2391_O", name: "Monte Nerone (O)", region: "Apecchio Pesaro",
    lat: 43.5552, lon: 12.5235, elevation: 1372, dhv: 2391,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2391_W", name: "Monte Nerone (W)", region: "Apecchio Pesaro",
    lat: 43.5538, lon: 12.5055, elevation: 1417, dhv: 2391,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1557", name: "Monte Novegno", region: "Schio",
    lat: 45.763, lon: 11.3089, elevation: 1517, dhv: 1557,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_2122", name: "Monte Nozzolo", region: "Concei",
    lat: 45.9339, lon: 10.6887, elevation: 2049, dhv: 2122,
    sectors: [[168.75, 281.25]], sectorLabel: "S-W", ...DEF },

  { id: "db_1901", name: "Monte Nudo", region: "Cittiglio",
    lat: 45.9221, lon: 8.674, elevation: 1063, dhv: 1901,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_4575", name: "Monte Ortobene", region: "Nuoro",
    lat: 40.3235, lon: 9.3765, elevation: 878, dhv: 4575,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2018", name: "Monte Padrio", region: "Corteno Golgi",
    lat: 46.1863, lon: 10.227, elevation: 2121, dhv: 2018,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1555", name: "Monte Panarotta", region: "Levico Terme",
    lat: 46.0418, lon: 11.3171, elevation: 1481, dhv: 1555,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5342", name: "Monte Parratiello", region: "Muro Lucano",
    lat: 40.7261, lon: 15.4717, elevation: 909, dhv: 5342,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5415", name: "Monte Pelpi", region: "Isola",
    lat: 44.5434, lon: 9.6528, elevation: 1478, dhv: 5415,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5420", name: "Monte Penice", region: "Bobbio",
    lat: 44.7884, lon: 9.3209, elevation: 1371, dhv: 5420,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1915", name: "Monte Piana", region: "Misurina",
    lat: 46.6117, lon: 12.2521, elevation: 2237, dhv: 1915,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5631", name: "Monte Pic", region: "St. Ulrich",
    lat: 46.5803, lon: 11.7247, elevation: 2364, dhv: 5631,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2416", name: "Monte Piccaro", region: "Ceriale",
    lat: 44.1058, lon: 8.2309, elevation: 253, dhv: 2416,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3724", name: "Monte Piella", region: "Porretta Therme",
    lat: 44.1334, lon: 10.9361, elevation: 1174, dhv: 3724,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_2029", name: "Monte Pisciavino", region: "Alassio",
    lat: 44.0278, lon: 8.1628, elevation: 577, dhv: 2029,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3722", name: "Monte Pizzo", region: "Lizzano in Belvedere",
    lat: 44.1544, lon: 10.8851, elevation: 1169, dhv: 3722,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2386_S", name: "Monte Pizzoc (S)", region: "Fregona",
    lat: 46.043, lon: 12.3384, elevation: 1537, dhv: 2386,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2386_SW", name: "Monte Pizzoc (SW)", region: "Fregona",
    lat: 46.0387, lon: 12.3502, elevation: 1545, dhv: 2386,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2001_S", name: "Monte Pizzocolo (S)", region: "Gardone",
    lat: 45.6653, lon: 10.5611, elevation: 1152, dhv: 2001,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2001_W", name: "Monte Pizzocolo (W)", region: "Gardone",
    lat: 45.6679, lon: 10.5612, elevation: 1216, dhv: 2001,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3836", name: "Monte Pizzuta", region: "Piana Degli Albanesi",
    lat: 37.9961, lon: 13.2539, elevation: 1180, dhv: 3836,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5343", name: "Monte Pizzuto", region: "Caranna",
    lat: 40.7779, lon: 17.4207, elevation: 360, dhv: 5343,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_2364", name: "Monte Postoucicco", region: "Pradielis",
    lat: 46.2849, lon: 13.2443, elevation: 769, dhv: 2364,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2366", name: "Monte Purgessimo", region: "Purgessimo",
    lat: 46.1046, lon: 13.4866, elevation: 425, dhv: 2366,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2005", name: "Monte Rambasi", region: "Valbondione",
    lat: 46.0263, lon: 10.0153, elevation: 1345, dhv: 2005,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3774_NO", name: "Monte Ripoli (NO)", region: "Tivoli",
    lat: 41.9426, lon: 12.8083, elevation: 511, dhv: 3774,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3774_SW", name: "Monte Ripoli (SW)", region: "Tivoli",
    lat: 41.9416, lon: 12.8069, elevation: 505, dhv: 3774,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2424", name: "Monte Rosa", region: "Canneto",
    lat: 38.483, lon: 14.9765, elevation: 220, dhv: 2424,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_2422_S", name: "Monte San Angelo (S)", region: "Lipari",
    lat: 38.4851, lon: 14.9326, elevation: 503, dhv: 2422,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2422_SO", name: "Monte San Angelo (SO)", region: "Lipari",
    lat: 38.4873, lon: 14.9363, elevation: 535, dhv: 2422,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5329", name: "Monte San Biagio", region: "Maratea",
    lat: 39.9851, lon: 15.7244, elevation: 459, dhv: 5329,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2263", name: "Monte San Giorgio", region: "Piossasco",
    lat: 44.9963, lon: 7.4474, elevation: 804, dhv: 2263,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5406", name: "Monte San Vicino", region: "Matelica",
    lat: 43.3172, lon: 13.0577, elevation: 1193, dhv: 5406,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3864", name: "Monte Scala", region: "Cotomino",
    lat: 37.2515, lon: 14.4233, elevation: 776, dhv: 3864,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3859_N", name: "Monte Scalpello (N)", region: "Catenanuova",
    lat: 37.5504, lon: 14.6525, elevation: 495, dhv: 3859,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_3859_NW", name: "Monte Scalpello (NW)", region: "Catenanuova",
    lat: 37.5482, lon: 14.652, elevation: 581, dhv: 3859,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3859_SO", name: "Monte Scalpello (SO)", region: "Catenanuova",
    lat: 37.5488, lon: 14.6548, elevation: 579, dhv: 3859,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2004", name: "Monte Scanapa", region: "Castione della Presolana",
    lat: 45.9199, lon: 10.0884, elevation: 1619, dhv: 2004,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1983", name: "Monte Sertore", region: "Pigra",
    lat: 45.9777, lon: 9.121, elevation: 1397, dhv: 1983,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2131", name: "Monte Seura", region: "Santa Cristina",
    lat: 46.5391, lon: 11.7269, elevation: 2024, dhv: 2131,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3696", name: "Monte Sighignola", region: "Arogno",
    lat: 45.9675, lon: 8.9936, elevation: 1293, dhv: 3696,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2264", name: "Monte Soglio", region: "Corio",
    lat: 45.3383, lon: 7.5431, elevation: 1325, dhv: 2264,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5320_O", name: "Monte Stella (O)", region: "Stilo",
    lat: 38.4782, lon: 16.4592, elevation: 670, dhv: 5320,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5320_SO", name: "Monte Stella (SO)", region: "Stilo",
    lat: 38.4653, lon: 16.4409, elevation: 803, dhv: 5320,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3742_N", name: "Monte Subasio (N)", region: "Assisi",
    lat: 43.0707, lon: 12.6692, elevation: 1203, dhv: 3742,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3742_O", name: "Monte Subasio (O)", region: "Assisi",
    lat: 43.0642, lon: 12.6747, elevation: 1253, dhv: 3742,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3742_S", name: "Monte Subasio (S)", region: "Assisi",
    lat: 43.0459, lon: 12.6769, elevation: 1243, dhv: 3742,
    sectors: [[168.75, 236.25], [168.75, 191.25]], sectorLabel: "S-SW · S", ...DEF },

  { id: "db_3742_W", name: "Monte Subasio (W)", region: "Assisi",
    lat: 43.0566, lon: 12.6678, elevation: 1255, dhv: 3742,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1556", name: "Monte Summano", region: "Schio",
    lat: 45.7564, lon: 11.3902, elevation: 1132, dhv: 1556,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2027", name: "Monte Tenchia", region: "Cercivento",
    lat: 46.5504, lon: 12.9767, elevation: 1590, dhv: 2027,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2265", name: "Monte Tovo", region: "Doccio",
    lat: 45.7528, lon: 8.2212, elevation: 1238, dhv: 2265,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2123_O", name: "Monte Tremalzo (O)", region: "Tremalzo",
    lat: 45.8364, lon: 10.6905, elevation: 1685, dhv: 2123,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_2123_SO", name: "Monte Tremalzo (SO)", region: "Tremalzo",
    lat: 45.8375, lon: 10.705, elevation: 1824, dhv: 2123,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1982", name: "Monte Tremezzo", region: "Tremezzo",
    lat: 46.0013, lon: 9.1867, elevation: 1656, dhv: 1982,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_5341", name: "Monte Tubenna", region: "San Mango Piemonte",
    lat: 40.7072, lon: 14.8451, elevation: 643, dhv: 5341,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3854", name: "Monte Vaccaro", region: "La Rosamarina",
    lat: 37.6254, lon: 14.6515, elevation: 544, dhv: 3854,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1893", name: "Monte Valinis", region: "Meduno",
    lat: 46.2307, lon: 12.8064, elevation: 975, dhv: 1893,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5423", name: "Monte Vandalino", region: "Bobbio Pellice",
    lat: 44.8363, lon: 7.1683, elevation: 2031, dhv: 5423,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3845", name: "Monte Veneretta", region: "Taormina",
    lat: 37.8694, lon: 15.2676, elevation: 785, dhv: 3845,
    sectors: [[78.75, 236.25]], sectorLabel: "O-SW", ...DEF },

  { id: "db_5337", name: "Monte Volturino", region: "Marsicovetere",
    lat: 40.4043, lon: 15.8175, elevation: 1587, dhv: 5337,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5383", name: "Monte Vulture", region: "Foggianello",
    lat: 40.9547, lon: 15.6263, elevation: 1219, dhv: 5383,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_5459", name: "Monte Zoncolan", region: "Paluzza",
    lat: 46.5065, lon: 12.9325, elevation: 1696, dhv: 5459,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5439", name: "Montefalcone", region: "Valdagno",
    lat: 45.6648, lon: 11.2102, elevation: 1537, dhv: 5439,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3776_NO", name: "Montefalcone (NO)", region: "Montefalcone nel Sannio",
    lat: 41.8512, lon: 14.6688, elevation: 912, dhv: 3776,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3776_SW", name: "Montefalcone (SW)", region: "Montefalcone nel Sannio",
    lat: 41.8582, lon: 14.6464, elevation: 842, dhv: 3776,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3758", name: "Montefiascone", region: "Montefiascone",
    lat: 42.5523, lon: 12.02, elevation: 535, dhv: 3758,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2259_O", name: "Montemale (O)", region: "San Giorgio",
    lat: 44.4316, lon: 7.3629, elevation: 1097, dhv: 2259,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2259_SO", name: "Montemale (SO)", region: "San Giorgio",
    lat: 44.4321, lon: 7.3571, elevation: 1130, dhv: 2259,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2026", name: "Montemezzo", region: "Gera Lario",
    lat: 46.2067, lon: 9.3569, elevation: 1753, dhv: 2026,
    sectors: [[123.75, 281.25], [123.75, 236.25]], sectorLabel: "SO-W · SO-SW", ...DEF },

  { id: "db_2262_O", name: "Montemoro (O)", region: "Frabosa",
    lat: 44.2686, lon: 7.7928, elevation: 1655, dhv: 2262,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2262_W", name: "Montemoro (W)", region: "Frabosa",
    lat: 44.2693, lon: 7.7926, elevation: 1631, dhv: 2262,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_2047", name: "Monterosso", region: "Monterosso al Mare",
    lat: 44.1527, lon: 9.6696, elevation: 508, dhv: 2047,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3718", name: "Montevenere", region: "San Benedetto",
    lat: 44.236, lon: 11.2576, elevation: 866, dhv: 3718,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1981", name: "Montoso Monumento", region: "Bagnolo",
    lat: 44.7637, lon: 7.2503, elevation: 1249, dhv: 1981,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3736", name: "Montrago", region: "Pian di Sco",
    lat: 43.6539, lon: 11.6038, elevation: 1254, dhv: 3736,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3701", name: "Mottarone", region: "Omegna",
    lat: 45.8803, lon: 8.4482, elevation: 1406, dhv: 3701,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2017", name: "Mottolino", region: "Livigno",
    lat: 46.5284, lon: 10.1609, elevation: 2363, dhv: 2017,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_2266", name: "Muanda", region: "Sordevolo",
    lat: 45.591, lon: 7.9714, elevation: 1140, dhv: 2266,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1926", name: "Musi", region: "Musi",
    lat: 46.3222, lon: 13.2646, elevation: 1108, dhv: 1926,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2469", name: "Muteck", region: "Ultimo Bolzano",
    lat: 46.5387, lon: 10.9071, elevation: 2508, dhv: 2469,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3817", name: "Nebida", region: "Gonnesa",
    lat: 39.2946, lon: 8.4396, elevation: 126, dhv: 3817,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5298", name: "Niscemi 1", region: "Niscemi",
    lat: 37.1134, lon: 14.3734, elevation: 217, dhv: 5298,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3866", name: "Niscemi 2", region: "Niscemi",
    lat: 37.1432, lon: 14.3811, elevation: 284, dhv: 3866,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3865", name: "Niscemi 3", region: "Niscemi",
    lat: 37.1608, lon: 14.4131, elevation: 358, dhv: 3865,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2033", name: "Noli", region: "Noli",
    lat: 44.1961, lon: 8.411, elevation: 271, dhv: 2033,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1987", name: "Nomesino", region: "Mori",
    lat: 45.8701, lon: 10.9556, elevation: 923, dhv: 1987,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_3789", name: "Norma", region: "Norma",
    lat: 41.5911, lon: 12.9571, elevation: 420, dhv: 3789,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_3755_S", name: "Norsi (S)", region: "Capoliveri Livorno",
    lat: 42.7649, lon: 10.3395, elevation: 45, dhv: 3755,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3755_SW", name: "Norsi (SW)", region: "Capoliveri Livorno",
    lat: 42.7669, lon: 10.3354, elevation: 142, dhv: 3755,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5305", name: "Nuova Gibellina", region: "Nuova Gibellina",
    lat: 37.8028, lon: 12.9141, elevation: 608, dhv: 5305,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3857", name: "Oliveto del Principe", region: "Centuripe",
    lat: 37.5982, lon: 14.7314, elevation: 481, dhv: 3857,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5407", name: "Onferno", region: "Castelo di Onferno",
    lat: 43.8648, lon: 12.5472, elevation: 521, dhv: 5407,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5434", name: "Orgiano", region: "Orgiano",
    lat: 45.3678, lon: 11.4644, elevation: 117, dhv: 5434,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2012", name: "Ortise", region: "Pellizzano",
    lat: 46.3275, lon: 10.7782, elevation: 1597, dhv: 2012,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3765", name: "Ortona", region: "San Donato-moro",
    lat: 42.3319, lon: 14.4216, elevation: 63, dhv: 3765,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1786_O", name: "Ospedaletti (O)", region: "Ospedaletti",
    lat: 43.8338, lon: 7.7159, elevation: 891, dhv: 1786,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1786_SO", name: "Ospedaletti (SO)", region: "Ospedaletti",
    lat: 43.8078, lon: 7.6891, elevation: 529, dhv: 1786,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1786_SW", name: "Ospedaletti (SW)", region: "Ospedaletti",
    lat: 43.8285, lon: 7.7142, elevation: 759, dhv: 1786,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5416", name: "Paesana", region: "Paesana",
    lat: 44.6577, lon: 7.26, elevation: 1380, dhv: 5416,
    sectors: [[101.25, 191.25]], sectorLabel: "OSO-S", ...DEF },

  { id: "db_5393", name: "Palmoli", region: "Palmoli",
    lat: 41.9382, lon: 14.5792, elevation: 718, dhv: 5393,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5340", name: "Palomonte", region: "Palomonte",
    lat: 40.6902, lon: 15.324, elevation: 1086, dhv: 5340,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5385", name: "Panni", region: "Panni",
    lat: 41.2275, lon: 15.2682, elevation: 767, dhv: 5385,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5399", name: "Pantani", region: "San Pellegrino",
    lat: 42.7409, lon: 13.1775, elevation: 1696, dhv: 5399,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5322", name: "Paola", region: "Paola",
    lat: 39.343, lon: 16.0622, elevation: 639, dhv: 5322,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3684", name: "Partinges", region: "Freienfeld",
    lat: 46.8783, lon: 11.5005, elevation: 1404, dhv: 3684,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3860", name: "Passo Funnuto", region: "Campofranco",
    lat: 37.473, lon: 13.6804, elevation: 421, dhv: 3860,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5303", name: "Paterno", region: "Paterno",
    lat: 37.5617, lon: 14.8935, elevation: 260, dhv: 5303,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1923", name: "Paularo", region: "Paularo",
    lat: 46.5531, lon: 13.0871, elevation: 1584, dhv: 1923,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5325", name: "Pauli Arbarei", region: "Pauli Arbarei",
    lat: 39.6837, lon: 8.9392, elevation: 255, dhv: 5325,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3848", name: "Petralia", region: "Petralia Soprana",
    lat: 37.8031, lon: 14.0978, elevation: 1077, dhv: 3848,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1234", name: "Pfalzen", region: "Pfalzen",
    lat: 46.8309, lon: 11.8726, elevation: 1621, dhv: 1234,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5448", name: "Pian Bello", region: "Cannero Riviera",
    lat: 46.0434, lon: 8.6564, elevation: 1254, dhv: 5448,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5499", name: "Pian dell'Alpe", region: "Pourierres",
    lat: 45.0623, lon: 7.0262, elevation: 1943, dhv: 5499,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2137", name: "Piana da Bobbio", region: "Barzio",
    lat: 45.9563, lon: 9.4826, elevation: 1559, dhv: 2137,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3838_NO", name: "Piana degli Albanesi (NO)", region: "San Cipirello",
    lat: 37.969, lon: 13.2572, elevation: 1153, dhv: 3838,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3838_SW", name: "Piana degli Albanesi (SW)", region: "San Cipirello",
    lat: 37.9696, lon: 13.2506, elevation: 1088, dhv: 3838,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2267", name: "Piana di Vigezzo", region: "Santa Maria Maggiore",
    lat: 46.1733, lon: 8.496, elevation: 2011, dhv: 2267,
    sectors: [[123.75, 236.25], [168.75, 236.25]], sectorLabel: "SO-SW · S-SW", ...DEF },

  { id: "db_3744_NO", name: "Piani di Montioli (NO)", region: "San Cassiono",
    lat: 43.0406, lon: 13.2338, elevation: 1269, dhv: 3744,
    sectors: [[33.75, 101.25], [33.75, 56.25]], sectorLabel: "NO-O · NO", ...DEF },

  { id: "db_3744_O", name: "Piani di Montioli (O)", region: "San Cassiono",
    lat: 43.0394, lon: 13.2411, elevation: 1171, dhv: 3744,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3730", name: "Piano dei Massi", region: "Schignano",
    lat: 43.9617, lon: 11.0881, elevation: 844, dhv: 3730,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5301", name: "Piano Palmatico", region: "Catania",
    lat: 37.2067, lon: 14.4881, elevation: 488, dhv: 5301,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3686", name: "Pichlberg", region: "Sarnthein",
    lat: 46.7001, lon: 11.4552, elevation: 2415, dhv: 3686,
    sectors: [[213.75, 281.25], [213.75, 236.25]], sectorLabel: "SW-W · SW", ...DEF },

  { id: "db_3779", name: "Piglio", region: "Piglio",
    lat: 41.818, lon: 13.1448, elevation: 750, dhv: 3779,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3802", name: "Pignola Potenza", region: "Pignola Potenza",
    lat: 40.5573, lon: 15.7822, elevation: 999, dhv: 3802,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3697", name: "Pigra", region: "Pigra",
    lat: 45.9584, lon: 9.1209, elevation: 1045, dhv: 3697,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3827", name: "Pilone", region: "Villa san Giovanni",
    lat: 38.24, lon: 15.6855, elevation: 299, dhv: 3827,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5319", name: "Piraino", region: "Zappardino",
    lat: 38.1545, lon: 14.8841, elevation: 604, dhv: 5319,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_2132", name: "Piz la Villa", region: "Badia",
    lat: 46.5884, lon: 11.8872, elevation: 1764, dhv: 2132,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3688", name: "Piz la Villa", region: "Corvara",
    lat: 46.566, lon: 11.9062, elevation: 2037, dhv: 3688,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3828", name: "Pizzi Calori", region: "Gioiosa Marea",
    lat: 38.1799, lon: 14.9199, elevation: 439, dhv: 3828,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3820_N", name: "Pizzo Calabro (N)", region: "Vibo Marina",
    lat: 38.7335, lon: 16.1794, elevation: 351, dhv: 3820,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_3820_NW", name: "Pizzo Calabro (NW)", region: "Vibo Marina",
    lat: 38.7208, lon: 16.1599, elevation: 357, dhv: 3820,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3746", name: "Pizzo di Meta", region: "Brilli",
    lat: 43.0175, lon: 13.2393, elevation: 1534, dhv: 3746,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3852", name: "Pizzo Guarino", region: "Regalbuto",
    lat: 37.6375, lon: 14.5934, elevation: 496, dhv: 3852,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5597", name: "Pizzo Stagnataro", region: "Santo Stefano Quisquina",
    lat: 37.6631, lon: 13.5108, elevation: 1306, dhv: 5597,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3731", name: "Pizzorne", region: "Marlia",
    lat: 43.934, lon: 10.5844, elevation: 929, dhv: 3731,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_2016", name: "Plator", region: "Valdidentro",
    lat: 46.5004, lon: 10.3025, elevation: 1942, dhv: 2016,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3689", name: "Plattkofel", region: "Canazei",
    lat: 46.5056, lon: 11.7363, elevation: 2521, dhv: 3689,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1537", name: "Plose", region: "Brixen",
    lat: 46.6876, lon: 11.7122, elevation: 2054, dhv: 1537,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3759_SW", name: "Poggio Bustone (SW)", region: "Poggio Bustone",
    lat: 42.5149, lon: 12.8834, elevation: 1248, dhv: 3759,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3759_W", name: "Poggio Bustone (W)", region: "Poggio Bustone",
    lat: 42.494, lon: 12.8976, elevation: 1010, dhv: 3759,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_3834", name: "Poggio Maria", region: "Cocuzzola",
    lat: 38.01, lon: 13.9492, elevation: 300, dhv: 3834,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_5419", name: "Poggiolo", region: "Poggiolo",
    lat: 44.7515, lon: 9.4088, elevation: 713, dhv: 5419,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3833", name: "Pollina", region: "Pollina",
    lat: 38.0137, lon: 14.1389, elevation: 313, dhv: 3833,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3737", name: "Portonovo", region: "Poggio",
    lat: 43.5651, lon: 13.5774, elevation: 114, dhv: 3737,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1928", name: "Porzus", region: "Attimis",
    lat: 46.184, lon: 13.3326, elevation: 676, dhv: 1928,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5673_SO", name: "Possagno (SO)", region: "Possagno",
    lat: 45.8834, lon: 11.8502, elevation: 1414, dhv: 5673,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5673_SW", name: "Possagno (SW)", region: "Possagno",
    lat: 45.8817, lon: 11.8412, elevation: 1473, dhv: 5673,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3812", name: "Praia a Mare", region: "Praia a Mare",
    lat: 39.8918, lon: 15.8047, elevation: 564, dhv: 3812,
    sectors: [[213.75, 326.25]], sectorLabel: "SW-NW", ...DEF },

  { id: "db_3745_NW", name: "Prati di Ragnolo (NW)", region: "Brilli",
    lat: 43.0156, lon: 13.2146, elevation: 1497, dhv: 3745,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3745_O", name: "Prati di Ragnolo (O)", region: "Brilli",
    lat: 43.0278, lon: 13.2173, elevation: 1408, dhv: 3745,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2008", name: "Pratino", region: "Palazago",
    lat: 45.7684, lon: 9.5493, elevation: 1041, dhv: 2008,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5425", name: "Prato delle Grange", region: "Villar Perosa",
    lat: 44.9216, lon: 7.2074, elevation: 1462, dhv: 5425,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5411", name: "Prato Fiorito", region: "San Cassiano",
    lat: 44.0546, lon: 10.6198, elevation: 1200, dhv: 5411,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5453", name: "Prato Valentino", region: "Chiuro",
    lat: 46.2039, lon: 10.0437, elevation: 2091, dhv: 5453,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3837", name: "Pratoni Kumeta", region: "Traversa",
    lat: 37.9744, lon: 13.229, elevation: 797, dhv: 3837,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_5455", name: "Predazzo", region: "Predazzo",
    lat: 46.2818, lon: 11.6243, elevation: 1810, dhv: 5455,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5477", name: "Prischer Alm", region: "Ridnaun",
    lat: 46.9321, lon: 11.3062, elevation: 2185, dhv: 5477,
    sectors: [[123.75, 281.25]], sectorLabel: "SO-W", ...DEF },

  { id: "db_1968", name: "Provaccio", region: "Vanzone",
    lat: 45.975, lon: 8.1333, elevation: 1133, dhv: 1968,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2031", name: "Puerta del Sol", region: "Alassio",
    lat: 43.9921, lon: 8.1589, elevation: 188, dhv: 2031,
    sectors: [[33.75, 56.25], [33.75, 101.25]], sectorLabel: "NO · NO-O", ...DEF },

  { id: "db_3769", name: "Punta Aderci", region: "Vasto Chieti",
    lat: 42.1723, lon: 14.7031, elevation: 18, dhv: 3769,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3714", name: "Quinzano", region: "Quinzano",
    lat: 44.585, lon: 10.2215, elevation: 756, dhv: 3714,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3849", name: "Raffo", region: "Borgo Pala",
    lat: 37.7807, lon: 14.1454, elevation: 987, dhv: 3849,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5306", name: "Randazzo", region: "Randazzo",
    lat: 37.9111, lon: 14.9554, elevation: 1253, dhv: 5306,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_3721", name: "Raticosa", region: "Poggio",
    lat: 44.1636, lon: 11.3674, elevation: 931, dhv: 3721,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2397", name: "Refugio Posa Puner", region: "Miane",
    lat: 45.9468, lon: 12.0612, elevation: 1097, dhv: 2397,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2014", name: "Reit", region: "Bormio",
    lat: 46.4715, lon: 10.3824, elevation: 1408, dhv: 2014,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2043", name: "Rena", region: "Sestri Lavente",
    lat: 44.2533, lon: 9.4359, elevation: 135, dhv: 2043,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1914", name: "Revine Lago", region: "Revine Lago",
    lat: 46.0024, lon: 12.2082, elevation: 1101, dhv: 1914,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1894", name: "Rifugio Dolada", region: "Pieve d&#039;Alpago",
    lat: 46.1917, lon: 12.3524, elevation: 1484, dhv: 1894,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5402_S", name: "Rifugio Perugia (S)", region: "San Pellegrino",
    lat: 42.7652, lon: 13.1779, elevation: 1469, dhv: 5402,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5402_SW", name: "Rifugio Perugia (SW)", region: "San Pellegrino",
    lat: 42.767, lon: 13.1779, elevation: 1501, dhv: 5402,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3691", name: "Rifugio Scotter", region: "San Vito",
    lat: 46.4714, lon: 12.2364, elevation: 1568, dhv: 3691,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3788", name: "Rignano Garganico", region: "Rignano Garganico",
    lat: 41.6767, lon: 15.5813, elevation: 568, dhv: 3788,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3869", name: "Rigolizia", region: "Rigolizia",
    lat: 36.9921, lon: 14.9067, elevation: 610, dhv: 3869,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_5403", name: "Ripetitori Fiastra", region: "San Lorenzo al Lago",
    lat: 43.0209, lon: 13.1492, elevation: 1290, dhv: 5403,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5462", name: "Rittner Horn", region: "Collalbo",
    lat: 46.5952, lon: 11.4519, elevation: 2051, dhv: 5462,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5435", name: "Rivotti", region: "Migliere",
    lat: 45.3807, lon: 7.2724, elevation: 1658, dhv: 5435,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3791", name: "Roccasecca", region: "Priverno",
    lat: 41.4597, lon: 13.2295, elevation: 642, dhv: 3791,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3775", name: "Roccaspinalveti", region: "Fraine",
    lat: 41.902, lon: 14.4536, elevation: 1307, dhv: 3775,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1237", name: "Rodeneck", region: "Rodeneck",
    lat: 46.7896, lon: 11.7186, elevation: 1494, dhv: 1237,
    sectors: [[101.25, 258.75]], sectorLabel: "OSO-WSW", ...DEF },

  { id: "db_1971", name: "Roffelstaffel", region: "Macugnagna",
    lat: 45.9731, lon: 7.9234, elevation: 1944, dhv: 1971,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3756", name: "Roiano", region: "Battaglia",
    lat: 42.6953, lon: 13.6226, elevation: 1082, dhv: 3756,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5427", name: "Roletto", region: "Roletto",
    lat: 44.9333, lon: 7.3111, elevation: 852, dhv: 5427,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2271", name: "Rollo", region: "Andora",
    lat: 43.946, lon: 8.125, elevation: 351, dhv: 2271,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_5314", name: "Romitello", region: "Borgetto",
    lat: 38.0306, lon: 13.1662, elevation: 844, dhv: 5314,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3694", name: "Roncegno", region: "Roncegno",
    lat: 46.08, lon: 11.3959, elevation: 1682, dhv: 3694,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_4443", name: "Rosbella", region: "Boves",
    lat: 44.2989, lon: 7.5517, elevation: 1060, dhv: 4443,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_1345", name: "Rosengarten", region: "Karersee",
    lat: 46.4153, lon: 11.6153, elevation: 2147, dhv: 1345,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1953", name: "Rosengartenhütte", region: "Welschnofen",
    lat: 46.4428, lon: 11.6117, elevation: 2316, dhv: 1953,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1975", name: "Rosselli", region: "Val della Torre",
    lat: 45.1619, lon: 7.4637, elevation: 976, dhv: 1975,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3706", name: "Rubbio", region: "Brombe",
    lat: 45.7937, lon: 11.6636, elevation: 869, dhv: 3706,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1980", name: "Rucas", region: "Bagnolo",
    lat: 44.7447, lon: 7.2303, elevation: 1568, dhv: 1980,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_2025", name: "Samolaco", region: "Samolaco",
    lat: 46.2314, lon: 9.3808, elevation: 958, dhv: 2025,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3786_SO", name: "San Donato (SO)", region: "Santa Maria del Campo",
    lat: 41.7268, lon: 13.7494, elevation: 937, dhv: 3786,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3786_SW", name: "San Donato (SW)", region: "Santa Maria del Campo",
    lat: 41.7259, lon: 13.7885, elevation: 1161, dhv: 3786,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1973", name: "San Giacomo", region: "Andrate",
    lat: 45.5461, lon: 7.8751, elevation: 1236, dhv: 1973,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3829", name: "San Giorgio", region: "Gioiosa Marea",
    lat: 38.1558, lon: 14.9305, elevation: 728, dhv: 3829,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_4574_S", name: "San Marcello Pistoiese (S)", region: "Lizzano Pistoiese",
    lat: 44.0876, lon: 10.801, elevation: 1192, dhv: 4574,
    sectors: [[168.75, 191.25], [168.75, 236.25]], sectorLabel: "S · S-SW", ...DEF },

  { id: "db_4574_SW", name: "San Marcello Pistoiese (SW)", region: "Lizzano Pistoiese",
    lat: 44.1294, lon: 10.7802, elevation: 1697, dhv: 4574,
    sectors: [[168.75, 281.25], [213.75, 236.25]], sectorLabel: "S-W · SW", ...DEF },

  { id: "db_3797", name: "San Michele", region: "Frasso Telesino",
    lat: 41.1661, lon: 14.5401, elevation: 980, dhv: 3797,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3754", name: "San Pellegrino", region: "Castelluccio",
    lat: 42.7644, lon: 13.1643, elevation: 1296, dhv: 3754,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5387", name: "San Potito Sannitico", region: "San Potito Sannitico",
    lat: 41.3471, lon: 14.4337, elevation: 1199, dhv: 5387,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1924", name: "San Simeone", region: "Bordano",
    lat: 46.33, lon: 13.1019, elevation: 1144, dhv: 1924,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5317", name: "San Vito Lo Capo", region: "San Vito Lo Capo",
    lat: 38.1327, lon: 12.7602, elevation: 643, dhv: 5317,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_5302", name: "Santa Caterina", region: "Villasmundo",
    lat: 37.2104, lon: 15.1006, elevation: 290, dhv: 5302,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_3862", name: "Santa Croce", region: "Mirabella",
    lat: 37.3464, lon: 14.4734, elevation: 562, dhv: 3862,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_2322", name: "Santa Elisabetta", region: "Cuorgne",
    lat: 45.4369, lon: 7.6428, elevation: 1383, dhv: 2322,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3830", name: "Santa Lucia del Mela", region: "Santa Lucia del Mela",
    lat: 38.1255, lon: 15.2892, elevation: 652, dhv: 3830,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_5596", name: "Santa Rosalia", region: "Santa Stefano Quisquina",
    lat: 37.6215, lon: 13.5155, elevation: 1093, dhv: 5596,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3687", name: "Sarnthein", region: "Sarnthein",
    lat: 46.644, lon: 11.3819, elevation: 1519, dhv: 3687,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1900", name: "Sasso del Ferro", region: "Cittiglio",
    lat: 45.9115, lon: 8.6432, elevation: 1044, dhv: 1900,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3747", name: "Sassotetto", region: "Brilli",
    lat: 43.005, lon: 13.2339, elevation: 1541, dhv: 3747,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1919", name: "Sauris", region: "Sauris",
    lat: 46.4773, lon: 12.6868, elevation: 1852, dhv: 1919,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5380", name: "Scalera", region: "Scalera",
    lat: 40.8638, lon: 15.7107, elevation: 697, dhv: 5380,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5454", name: "Scermendone", region: "Piani",
    lat: 46.2173, lon: 9.6998, elevation: 2128, dhv: 5454,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_3778", name: "Schiavi di Abruzzo", region: "Schiavi di Abruzzo",
    lat: 41.8307, lon: 14.4842, elevation: 1169, dhv: 3778,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1352", name: "Schluderns", region: "Schlunders",
    lat: 46.6857, lon: 10.5856, elevation: 1586, dhv: 1352,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2468", name: "Schwemmalm", region: "Ultimo Bolzano",
    lat: 46.5349, lon: 10.9231, elevation: 2147, dhv: 2468,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3826", name: "Scilla", region: "Scilla",
    lat: 38.243, lon: 15.698, elevation: 505, dhv: 3826,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_3814", name: "Scivu", region: "Arbus",
    lat: 39.4955, lon: 8.413, elevation: 22, dhv: 3814,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_2120", name: "Seaoi", region: "Concei",
    lat: 45.9181, lon: 10.765, elevation: 1683, dhv: 2120,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3734", name: "Secchieta", region: "San Donato Fronzano",
    lat: 43.7205, lon: 11.5657, elevation: 1304, dhv: 3734,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1548_S", name: "Seceda (S)", region: "St. Ulrich",
    lat: 46.5969, lon: 11.7245, elevation: 2441, dhv: 1548,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1548_SW", name: "Seceda (SW)", region: "St. Ulrich",
    lat: 46.5938, lon: 11.7225, elevation: 2364, dhv: 1548,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1241", name: "Sellapass", region: "Canazei",
    lat: 46.5096, lon: 11.7681, elevation: 2259, dhv: 1241,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_5384", name: "Senarico", region: "Senarico",
    lat: 40.9763, lon: 16.222, elevation: 639, dhv: 5384,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3856", name: "Serra della Moneta", region: "Santo Stefano Quisquina",
    lat: 37.6093, lon: 13.5116, elevation: 1159, dhv: 3856,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5422_S", name: "Serre Sarsena (S)", region: "Bobbio Pellice",
    lat: 44.8203, lon: 7.1142, elevation: 1402, dhv: 5422,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5422_SW", name: "Serre Sarsena (SW)", region: "Bobbio Pellice",
    lat: 44.8267, lon: 7.1086, elevation: 1770, dhv: 5422,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3777_O", name: "Serrone (O)", region: "La Forma",
    lat: 41.8472, lon: 13.1094, elevation: 1288, dhv: 3777,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_3777_SO", name: "Serrone (SO)", region: "La Forma",
    lat: 41.848, lon: 13.1128, elevation: 1364, dhv: 3777,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3777_SW", name: "Serrone (SW)", region: "La Forma",
    lat: 41.8467, lon: 13.1066, elevation: 1236, dhv: 3777,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3720", name: "Sestola", region: "Sestola",
    lat: 44.2167, lon: 10.7602, elevation: 1495, dhv: 3720,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5326", name: "Setzu", region: "Setzu",
    lat: 39.7359, lon: 8.9524, elevation: 533, dhv: 5326,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3716", name: "Soglio", region: "Calvari",
    lat: 44.4018, lon: 9.2851, elevation: 567, dhv: 3716,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3819", name: "Solanas", region: "Solanas",
    lat: 39.1308, lon: 9.4354, elevation: 58, dhv: 3819,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1988_O", name: "Somator (O)", region: "Mori",
    lat: 45.8763, lon: 10.9728, elevation: 1252, dhv: 1988,
    sectors: [[78.75, 146.25]], sectorLabel: "O-SO", ...DEF },

  { id: "db_1988_S", name: "Somator (S)", region: "Mori",
    lat: 45.8763, lon: 10.9709, elevation: 1266, dhv: 1988,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1349", name: "Sonnenberg", region: "Naturns",
    lat: 46.6587, lon: 10.9841, elevation: 1243, dhv: 1349,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1231_S", name: "Speikboden (S)", region: "Sand in Taufers",
    lat: 46.915, lon: 11.898, elevation: 2318, dhv: 1231,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1231_SO", name: "Speikboden (SO)", region: "Sand in Taufers",
    lat: 46.9152, lon: 11.9033, elevation: 2387, dhv: 1231,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5386", name: "Sperlonga", region: "Sperlonga",
    lat: 41.2497, lon: 13.4619, elevation: 188, dhv: 5386,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3824", name: "Sperone", region: "Campo Inglese",
    lat: 38.2718, lon: 15.5929, elevation: 143, dhv: 3824,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1353", name: "Spitzbühl", region: "St. Ulrich",
    lat: 46.5295, lon: 11.5996, elevation: 1935, dhv: 1353,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_2040_S", name: "Spotorno (S)", region: "Spotorno",
    lat: 44.2435, lon: 8.4203, elevation: 409, dhv: 2040,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2040_SO", name: "Spotorno (SO)", region: "Spotorno",
    lat: 44.235, lon: 8.4245, elevation: 157, dhv: 2040,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1344", name: "St. Martin", region: "Coldrano",
    lat: 46.6384, lon: 10.8537, elevation: 1723, dhv: 1344,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_2497", name: "Startplatz Pfurnernock", region: "Terenten",
    lat: 46.8553, lon: 11.7623, elevation: 2142, dhv: 2497,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5401", name: "Tabellone", region: "San Pellegrino",
    lat: 42.7811, lon: 13.1603, elevation: 1610, dhv: 5401,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2273", name: "Taggia", region: "Taggia",
    lat: 43.8709, lon: 7.8676, elevation: 451, dhv: 2273,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1256", name: "Taser Alm", region: "Schenna",
    lat: 46.7064, lon: 11.2222, elevation: 1454, dhv: 1256,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_1921", name: "Tenchia", region: "Cercivento",
    lat: 46.5539, lon: 12.9785, elevation: 1618, dhv: 1921,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_3853", name: "Timpa di Acireale", region: "Santa Tecla",
    lat: 37.6318, lon: 15.1676, elevation: 194, dhv: 3853,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_3811", name: "Tiro a Piattello", region: "Maratea",
    lat: 39.9744, lon: 15.7399, elevation: 478, dhv: 3811,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_3768", name: "Tocco da Casauria", region: "Localita Villa",
    lat: 42.1928, lon: 13.9079, elevation: 604, dhv: 3768,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_2036", name: "Toirano", region: "Toirano",
    lat: 44.132, lon: 8.1873, elevation: 471, dhv: 2036,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3867", name: "Torre di Gaffe", region: "Gaffe",
    lat: 37.1409, lon: 13.8308, elevation: 11, dhv: 3867,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5344", name: "Torre Moscia", region: "Selva di Fasano",
    lat: 40.8262, lon: 17.2994, elevation: 405, dhv: 5344,
    sectors: [[168.75, 191.25], [168.75, 236.25]], sectorLabel: "S · S-SW", ...DEF },

  { id: "db_1920", name: "Trava", region: "Trava",
    lat: 46.4463, lon: 12.9011, elevation: 1072, dhv: 1920,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5396", name: "Trevignano Romano", region: "Trevignano Romano",
    lat: 42.1665, lon: 12.2635, elevation: 350, dhv: 5396,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_5432", name: "Tuccetti", region: "Bertassi",
    lat: 45.0763, lon: 7.3475, elevation: 978, dhv: 5432,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_3784", name: "Tuscola", region: "Grottaferrata",
    lat: 41.7981, lon: 12.7068, elevation: 617, dhv: 3784,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2128", name: "Uwaldalm", region: "Valle di Casies",
    lat: 46.8555, lon: 12.2673, elevation: 2218, dhv: 2128,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2010", name: "Valcava", region: "Palazago",
    lat: 45.7809, lon: 9.5124, elevation: 1245, dhv: 2010,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5440_S", name: "Vallene (S)", region: "Vallene",
    lat: 45.6617, lon: 10.9781, elevation: 1302, dhv: 5440,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_5440_SW", name: "Vallene (SW)", region: "Vallene",
    lat: 45.6689, lon: 10.9722, elevation: 1401, dhv: 5440,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1922", name: "Valsecca", region: "Ravascletto",
    lat: 46.5478, lon: 12.9298, elevation: 1906, dhv: 1922,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_2035", name: "Varazze", region: "Varazze",
    lat: 44.3725, lon: 8.5952, elevation: 384, dhv: 2035,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5458", name: "Varmost", region: "Forni di Sopra",
    lat: 46.4499, lon: 12.3991, elevation: 1754, dhv: 5458,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_5413", name: "Vedegheto", region: "Vedegheto",
    lat: 44.331, lon: 11.1022, elevation: 766, dhv: 5413,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_3749", name: "Veletta", region: "Castelluccio",
    lat: 42.8273, lon: 13.1951, elevation: 1599, dhv: 3749,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_5400", name: "Vetosole", region: "San Pellegrino",
    lat: 42.7742, lon: 13.17, elevation: 1667, dhv: 5400,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_3751", name: "Vettoretto", region: "Castelluccio",
    lat: 42.7999, lon: 13.2482, elevation: 1510, dhv: 3751,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_3821", name: "Vibo Marina", region: "Vibo Marina",
    lat: 38.7064, lon: 16.1387, elevation: 425, dhv: 3821,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_5809", name: "Vibo Valentina", region: "Vibo Valentia",
    lat: 38.6792, lon: 15.9562, elevation: 443, dhv: 5809,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_3847", name: "Vicari", region: "Vicari",
    lat: 37.8211, lon: 13.5759, elevation: 712, dhv: 3847,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_1257", name: "Vigiljoch", region: "Lana",
    lat: 46.6244, lon: 11.1179, elevation: 1486, dhv: 1257,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5323", name: "Villacidro", region: "Villacidro",
    lat: 39.4385, lon: 8.7244, elevation: 484, dhv: 5323,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_5463", name: "Vöran", region: "Burgstall",
    lat: 46.6002, lon: 11.2244, elevation: 1163, dhv: 5463,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1228", name: "Watles", region: "Malles",
    lat: 46.719, lon: 10.4851, elevation: 2482, dhv: 1228,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3850", name: "Zafferana", region: "Zafferana",
    lat: 37.683, lon: 15.0862, elevation: 944, dhv: 3850,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_3822", name: "Zambrone", region: "Zambrone",
    lat: 38.6967, lon: 15.9685, elevation: 227, dhv: 3822,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

];
