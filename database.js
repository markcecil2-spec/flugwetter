// Startplatz-Datenbank – automatisch aus der offiziellen DHV-Deutschland-KML generiert.
// Quelle: service.dhv.de Geländedatenbank (Startrichtung = erlaubte Windrichtung).
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

  { id: "db_381", name: "Alpspitze", region: "Nesselwang",
    lat: 47.6007, lon: 10.4997, elevation: 1520, dhv: 381,
    sectors: [[348.75, 11.25], [56.25, 78.75]], sectorLabel: "N · ONO", ...DEF },

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

  { id: "db_671", name: "Althof (alte HG-Rampe)", region: "Bad Herrenalb",
    lat: 48.8233, lon: 8.4025, elevation: 690, dhv: 671,
    sectors: [[258.75, 56.25], [258.75, 326.25], [258.75, 101.25]], sectorLabel: "W-NO · W-NW · W-O", ...DEF },

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

  { id: "db_618", name: "Am Rammelsberg Nordwest-Startplatz", region: "Goslar",
    lat: 51.8897, lon: 10.4309, elevation: 610, dhv: 618,
    sectors: [[258.75, 11.25], [213.75, 236.25]], sectorLabel: "W-N · SW", ...DEF },

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

  { id: "db_955", name: "Beutnitz Übungshang 1", region: "Golmsdorf",
    lat: 50.9644, lon: 11.6646, elevation: 245, dhv: 955,
    sectors: [[33.75, 101.25], [258.75, 326.25], [348.75, 11.25]], sectorLabel: "NO-O · W-NW · N", ...DEF },

  { id: "db_5604", name: "Bierbach", region: "Fränkisch-Crumbach",
    lat: 49.761, lon: 8.8504, elevation: 253, dhv: 5604,
    sectors: [[303.75, 101.25], [258.75, 326.25]], sectorLabel: "NW-O · W-NW", ...DEF },

  { id: "db_1122", name: "Blankenhain Übungshang", region: "Rottdorf",
    lat: 50.8463, lon: 11.3475, elevation: 446, dhv: 1122,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_1067", name: "Blättersberg", region: "Weyher",
    lat: 49.266, lon: 8.0701, elevation: 550, dhv: 1067,
    sectors: [[101.25, 213.75]], sectorLabel: "OSO-SSW", ...DEF },

  { id: "db_352", name: "Blomberg", region: "Wackersberg",
    lat: 47.7345, lon: 11.5072, elevation: 1215, dhv: 352,
    sectors: [[303.75, 56.25], [78.75, 101.25]], sectorLabel: "NW-NO · O", ...DEF },

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

  { id: "db_612", name: "Brauneck", region: "Lenggries",
    lat: 47.6641, lon: 11.5245, elevation: 1555, dhv: 612,
    sectors: [[348.75, 11.25], [78.75, 101.25], [168.75, 191.25]], sectorLabel: "N · O · S", ...DEF },

  { id: "db_175", name: "Braunenberg", region: "Oberalfingen / Aalen",
    lat: 48.8599, lon: 10.1346, elevation: 661, dhv: 175,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_952", name: "Breitenberg", region: "Pfronten-Ried",
    lat: 47.5477, lon: 10.5566, elevation: 1752, dhv: 952,
    sectors: [[78.75, 101.25], [348.75, 146.25], [348.75, 101.25], [33.75, 56.25]], sectorLabel: "O · N-SO · N-O · NO", ...DEF },

  { id: "db_309", name: "Breitmoos Übungshang", region: "Wieden",
    lat: 47.8383, lon: 7.861, elevation: 1185, dhv: 309,
    sectors: [[348.75, 146.25]], sectorLabel: "N-SO", ...DEF },

  { id: "db_288", name: "Breitnau", region: "Münstertal",
    lat: 47.8561, lon: 7.8364, elevation: 1111, dhv: 288,
    sectors: [[213.75, 236.25], [348.75, 11.25]], sectorLabel: "SW · N", ...DEF },

  { id: "db_1771", name: "Brotdorf", region: "Merzig-Brotdorf",
    lat: 49.4701, lon: 6.6576, elevation: 320, dhv: 1771,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1110", name: "Bruchhauser Steine", region: "Bruchhausen",
    lat: 51.3182, lon: 8.545, elevation: 710, dhv: 1110,
    sectors: [[213.75, 236.25], [258.75, 281.25]], sectorLabel: "SW · W", ...DEF },

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

  { id: "db_408", name: "Buchenberg", region: "Buching",
    lat: 47.6065, lon: 10.8104, elevation: 1137, dhv: 408,
    sectors: [[303.75, 326.25], [348.75, 56.25]], sectorLabel: "NW · N-NO", ...DEF },

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

  { id: "db_796", name: "Burgen Hauptstartplatz", region: "Burgen",
    lat: 49.8764, lon: 7.0172, elevation: 450, dhv: 796,
    sectors: [[303.75, 326.25], [33.75, 101.25], [123.75, 146.25], [33.75, 56.25]], sectorLabel: "NW · NO-O · SO · NO", ...DEF },

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

  { id: "db_5732", name: "Dernbach Nord Übungshang", region: "Dernbach",
    lat: 49.2461, lon: 8.0148, elevation: 288, dhv: 5732,
    sectors: [[281.25, 33.75], [146.25, 213.75]], sectorLabel: "WNW-NNO · SSO-SSW", ...DEF },

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

  { id: "db_303", name: "Eck", region: "Gersbach",
    lat: 47.6882, lon: 7.9183, elevation: 933, dhv: 303,
    sectors: [[258.75, 281.25], [78.75, 101.25]], sectorLabel: "W · O", ...DEF },

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

  { id: "db_182", name: "Einkorn", region: "Michelbach",
    lat: 49.0898, lon: 9.776, elevation: 451, dhv: 182,
    sectors: [[213.75, 236.25], [258.75, 281.25]], sectorLabel: "SW · W", ...DEF },

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

  { id: "db_880", name: "Feldberg-Skischanze", region: "Feldberg",
    lat: 47.8558, lon: 8.0215, elevation: 1250, dhv: 880,
    sectors: [[348.75, 11.25], [258.75, 281.25]], sectorLabel: "N · W", ...DEF },

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

  { id: "db_584", name: "Frauenberg", region: "Sondershausen",
    lat: 51.3774, lon: 10.8344, elevation: 407, dhv: 584,
    sectors: [[348.75, 56.25], [78.75, 101.25]], sectorLabel: "N-NO · O", ...DEF },

  { id: "db_648", name: "Fridingen (Bergsteig/Riesen)", region: "Fridingen",
    lat: 48.0181, lon: 8.9137, elevation: 720, dhv: 648,
    sectors: [[33.75, 101.25]], sectorLabel: "NO-O", ...DEF },

  { id: "db_308", name: "Fröhnd Ittenschwander Horn", region: "Fröhnd",
    lat: 47.7633, lon: 7.8592, elevation: 1000, dhv: 308,
    sectors: [[33.75, 146.25], [168.75, 191.25]], sectorLabel: "NO-SO · S", ...DEF },

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

  { id: "db_3461", name: "Gänsberg West-Startplatz", region: "Ramsthal",
    lat: 50.1422, lon: 10.0572, elevation: 340, dhv: 3461,
    sectors: [[258.75, 281.25], [168.75, 236.25]], sectorLabel: "W · S-SW", ...DEF },

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

  { id: "db_388", name: "Gehwinde", region: "Schöllang",
    lat: 47.4706, lon: 10.3326, elevation: 1460, dhv: 388,
    sectors: [[258.75, 281.25], [168.75, 281.25]], sectorLabel: "W · S-W", ...DEF },

  { id: "db_613", name: "Gipfelstation Nordwest", region: "Grainbach",
    lat: 47.7473, lon: 12.2482, elevation: 1560, dhv: 613,
    sectors: [[281.25, 303.75], [326.25, 348.75]], sectorLabel: "WNW · NNW", ...DEF },

  { id: "db_28", name: "Glauchberg", region: "Bärenstein",
    lat: 50.7986, lon: 13.7815, elevation: 545, dhv: 28,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_923", name: "Golan Höhe - Denklingen", region: "Denklingen",
    lat: 47.9039, lon: 10.8667, elevation: 730, dhv: 923,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_503", name: "Görauer Anger", region: "Kasendorf",
    lat: 50.0537, lon: 11.317, elevation: 538, dhv: 503,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_140", name: "Gösberg Übungshang", region: "Schmelz",
    lat: 49.4457, lon: 6.8162, elevation: 340, dhv: 140,
    sectors: [[33.75, 101.25], [168.75, 236.25]], sectorLabel: "NO-O · S-SW", ...DEF },

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

  { id: "db_498", name: "Grün", region: "Weißenbrunn",
    lat: 50.178, lon: 11.3613, elevation: 440, dhv: 498,
    sectors: [[303.75, 11.25], [33.75, 101.25]], sectorLabel: "NW-N · NO-O", ...DEF },

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

  { id: "db_5827", name: "Güttersbach", region: "Fränkisch Crumbach",
    lat: 49.7494, lon: 8.8309, elevation: 260, dhv: 5827,
    sectors: [[168.75, 191.25], [78.75, 101.25]], sectorLabel: "S · O", ...DEF },

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

  { id: "db_5473", name: "Halde Menteroda NW-Start", region: "Menteroda",
    lat: 51.3227, lon: 10.5644, elevation: 482, dhv: 5473,
    sectors: [[303.75, 326.25], [213.75, 236.25], [123.75, 146.25], [33.75, 56.25]], sectorLabel: "NW · SW · SO · NO", ...DEF },

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

  { id: "db_486", name: "Heckenkopf - Rauschen / Faulbach", region: "Hasloch",
    lat: 49.7823, lon: 9.4661, elevation: 305, dhv: 486,
    sectors: [[78.75, 146.25], [213.75, 236.25]], sectorLabel: "O-SO · SW", ...DEF },

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

  { id: "db_439", name: "Hesselberg Nordhang", region: "91726 Gerolfingen",
    lat: 49.0671, lon: 10.5358, elevation: 689, dhv: 439,
    sectors: [[348.75, 11.25], [168.75, 191.25]], sectorLabel: "N · S", ...DEF },

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

  { id: "db_301", name: "Hochblauen Nord", region: "Badenweiler",
    lat: 47.7785, lon: 7.7, elevation: 1166, dhv: 301,
    sectors: [[348.75, 33.75], [78.75, 101.25], [191.25, 213.75]], sectorLabel: "N-NNO · O · SSW", ...DEF },

  { id: "db_346", name: "Hochfelln Nordstart", region: "Bergen",
    lat: 47.7628, lon: 12.5602, elevation: 1665, dhv: 346,
    sectors: [[303.75, 11.25], [78.75, 101.25]], sectorLabel: "NW-N · O", ...DEF },

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

  { id: "db_469", name: "Hoher Bogen", region: "Neukirchen b. Hl. Blut",
    lat: 49.235, lon: 12.9419, elevation: 1033, dhv: 469,
    sectors: [[348.75, 56.25], [33.75, 101.25]], sectorLabel: "N-NO · NO-O", ...DEF },

  { id: "db_737", name: "Hoher Bogen - Eschlkam Übungshang", region: "Neukirchen Hl. Blut",
    lat: 49.267, lon: 12.9526, elevation: 470, dhv: 737,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

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

  { id: "db_5794", name: "Homberg", region: "Bad Berleburg",
    lat: 51.0213, lon: 8.4893, elevation: 561, dhv: 5794,
    sectors: [[123.75, 146.25], [303.75, 326.25], [168.75, 191.25]], sectorLabel: "SO · NW · S", ...DEF },

  { id: "db_5710", name: "Hömberg", region: "Meschede",
    lat: 51.3179, lon: 8.2101, elevation: 514, dhv: 5710,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_127", name: "Homberg-Züschen", region: "Winterberg",
    lat: 51.1346, lon: 8.5412, elevation: 710, dhv: 127,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_492", name: "Homburg", region: "Gössenheim",
    lat: 50.0261, lon: 9.7977, elevation: 304, dhv: 492,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_909", name: "Hönningen", region: "Hönningen/Ahr",
    lat: 50.4787, lon: 6.9479, elevation: 380, dhv: 909,
    sectors: [[168.75, 191.25], [78.75, 101.25]], sectorLabel: "S · O", ...DEF },

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

  { id: "db_294", name: "Hörnleberg Süd-Startplatz", region: "Gutach-Bleibach",
    lat: 48.1274, lon: 8.0444, elevation: 870, dhv: 294,
    sectors: [[168.75, 258.75], [348.75, 56.25]], sectorLabel: "S-WSW · N-NO", ...DEF },

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

  { id: "db_521", name: "Jenner", region: "Schönau am Königssee",
    lat: 47.5766, lon: 13.0247, elevation: 1790, dhv: 521,
    sectors: [[348.75, 11.25], [258.75, 281.25], [78.75, 146.25], [78.75, 101.25]], sectorLabel: "N · W · O-SO · O", ...DEF },

  { id: "db_657", name: "Jenzig", region: "Jena",
    lat: 50.9401, lon: 11.6243, elevation: 385, dhv: 657,
    sectors: [[303.75, 326.25], [168.75, 191.25]], sectorLabel: "NW · S", ...DEF },

  { id: "db_1130", name: "Kahle Pön", region: "Referinghausen",
    lat: 51.2618, lon: 8.6721, elevation: 740, dhv: 1130,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_344", name: "Kampenwand", region: "Aschau",
    lat: 47.7533, lon: 12.3528, elevation: 1450, dhv: 344,
    sectors: [[303.75, 11.25], [348.75, 11.25]], sectorLabel: "NW-N · N", ...DEF },

  { id: "db_1023", name: "Kandahar-Express - Kreuzjoch", region: "Garmisch-Partenkirchen",
    lat: 47.4528, lon: 11.0799, elevation: 1690, dhv: 1023,
    sectors: [[326.25, 348.75], [56.25, 78.75]], sectorLabel: "NNW · ONO", ...DEF },

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

  { id: "db_5792", name: "Kötzhelle", region: "Meinerzhagen",
    lat: 51.1081, lon: 7.7949, elevation: 405, dhv: 5792,
    sectors: [[326.25, 348.75], [303.75, 326.25]], sectorLabel: "NNW · NW", ...DEF },

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

  { id: "db_191", name: "Loffenau Weststart Teufelsmühle", region: "Loffenau",
    lat: 48.7567, lon: 8.4072, elevation: 890, dhv: 191,
    sectors: [[258.75, 281.25], [303.75, 326.25]], sectorLabel: "W · NW", ...DEF },

  { id: "db_5469", name: "Lombach", region: "Loßburg",
    lat: 48.4283, lon: 8.4608, elevation: 660, dhv: 5469,
    sectors: [[326.25, 348.75]], sectorLabel: "NNW", ...DEF },

  { id: "db_150", name: "Longuich", region: "Schweich",
    lat: 49.8119, lon: 6.7808, elevation: 300, dhv: 150,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_85", name: "Maring-Noviand", region: "Maring-Noviand",
    lat: 49.9439, lon: 6.9903, elevation: 290, dhv: 85,
    sectors: [[146.25, 168.75], [146.25, 236.25]], sectorLabel: "SSO · SSO-SW", ...DEF },

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

  { id: "db_602", name: "Meerfelder Maar", region: "Meerfeld",
    lat: 50.0934, lon: 6.7467, elevation: 520, dhv: 602,
    sectors: [[78.75, 101.25], [168.75, 191.25]], sectorLabel: "O · S", ...DEF },

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

  { id: "db_987", name: "Merkur", region: "Gernsbach",
    lat: 48.7647, lon: 8.2816, elevation: 653, dhv: 987,
    sectors: [[33.75, 56.25], [258.75, 281.25]], sectorLabel: "NO · W", ...DEF },

  { id: "db_2174", name: "Messbacher Höhenweg", region: "Fischbachtal",
    lat: 49.7484, lon: 8.8133, elevation: 360, dhv: 2174,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_167", name: "Messelberg", region: "Donzdorf",
    lat: 48.6795, lon: 9.8389, elevation: 700, dhv: 167,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1007", name: "Michelsberg", region: "Münnerstadt",
    lat: 50.2516, lon: 10.1606, elevation: 380, dhv: 1007,
    sectors: [[213.75, 281.25]], sectorLabel: "SW-W", ...DEF },

  { id: "db_386", name: "Mittag", region: "Immenstadt",
    lat: 47.5358, lon: 10.2157, elevation: 1443, dhv: 386,
    sectors: [[168.75, 191.25], [258.75, 326.25], [348.75, 56.25]], sectorLabel: "S · W-NW · N-NO", ...DEF },

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

  { id: "db_395", name: "Nebelhorn Gipfel Terassen-SP 1 (südl. Gipfelstation)", region: "Oberstdorf",
    lat: 47.4212, lon: 10.3422, elevation: 2170, dhv: 395,
    sectors: [[123.75, 213.75], [168.75, 281.25], [191.25, 213.75], [236.25, 11.25], [213.75, 281.25]], sectorLabel: "SO-SSW · S-W · SSW · WSW-N · SW-W", ...DEF },

  { id: "db_951", name: "Neidlingen", region: "Neidlingen",
    lat: 48.5775, lon: 9.5932, elevation: 770, dhv: 951,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_614", name: "Netphen", region: "Netphen",
    lat: 50.9203, lon: 8.078, elevation: 360, dhv: 614,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_964", name: "Neuberg", region: "Odernheim",
    lat: 49.7669, lon: 7.6918, elevation: 270, dhv: 964,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_248", name: "Neubürg", region: "Mistelgau",
    lat: 49.8919, lon: 11.4026, elevation: 578, dhv: 248,
    sectors: [[33.75, 56.25], [303.75, 326.25], [168.75, 168.75], [191.25, 258.75], [258.75, 281.25]], sectorLabel: "NO · NW · S-SSO · SSW-WSW · W", ...DEF },

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

  { id: "db_637", name: "Niederrheinkogel - Halde Norddeutschland SW-Start", region: "Neukirchen-Vluyn",
    lat: 51.4693, lon: 6.5664, elevation: 105, dhv: 637,
    sectors: [[213.75, 236.25], [78.75, 101.25]], sectorLabel: "SW · O", ...DEF },

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

  { id: "db_446", name: "Obereichstätt", region: "Dollnstein",
    lat: 48.8967, lon: 11.1351, elevation: 520, dhv: 446,
    sectors: [[168.75, 236.25], [213.75, 281.25]], sectorLabel: "S-SW · SW-W", ...DEF },

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

  { id: "db_321", name: "Osterfelder Ost-Startplatz (Hauptstartplatz)", region: "Garmisch-Partenkirchen",
    lat: 47.4382, lon: 11.05, elevation: 2038, dhv: 321,
    sectors: [[78.75, 191.25], [348.75, 56.25], [303.75, 56.25]], sectorLabel: "O-S · N-NO · NW-NO", ...DEF },

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

  { id: "db_341", name: "Predigtstuhl", region: "Bad Reichenhall",
    lat: 47.6889, lon: 12.8897, elevation: 1720, dhv: 341,
    sectors: [[348.75, 11.25], [258.75, 281.25], [33.75, 56.25]], sectorLabel: "N · W · NO", ...DEF },

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

  { id: "db_682", name: "Rauenstein", region: "Rauenstein",
    lat: 50.4247, lon: 11.0427, elevation: 720, dhv: 682,
    sectors: [[146.25, 168.75], [213.75, 236.25]], sectorLabel: "SSO · SW", ...DEF },

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

  { id: "db_741", name: "Ronneburg die Hell (Übungshang Süd)", region: "Ronneburg",
    lat: 50.2371, lon: 9.0609, elevation: 230, dhv: 741,
    sectors: [[168.75, 191.25], [348.75, 11.25]], sectorLabel: "S · N", ...DEF },

  { id: "db_1038", name: "Roschlaub/Obstgarten", region: "Scheßlitz",
    lat: 50.0144, lon: 11.0302, elevation: 445, dhv: 1038,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_974", name: "Rossbühl", region: "Oppenau",
    lat: 48.487, lon: 8.2391, elevation: 930, dhv: 974,
    sectors: [[213.75, 281.25], [168.75, 191.25]], sectorLabel: "SW-W · S", ...DEF },

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

  { id: "db_539", name: "Schwartenberg", region: "Neuhausen",
    lat: 50.6596, lon: 13.4657, elevation: 770, dhv: 539,
    sectors: [[303.75, 56.25], [258.75, 281.25]], sectorLabel: "NW-NO · W", ...DEF },

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

  { id: "db_266", name: "Spieser", region: "Hindelang",
    lat: 47.5272, lon: 10.3894, elevation: 1641, dhv: 266,
    sectors: [[123.75, 236.25], [258.75, 281.25]], sectorLabel: "SO-SW · W", ...DEF },

  { id: "db_278", name: "Spitzfelsen", region: "Hausach",
    lat: 48.293, lon: 8.2022, elevation: 570, dhv: 278,
    sectors: [[303.75, 236.25]], sectorLabel: "NW-SW", ...DEF },

  { id: "db_971", name: "Sponsheimer Berg", region: "Laubenheim",
    lat: 49.9297, lon: 7.8911, elevation: 200, dhv: 971,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_95", name: "Stachelhardt", region: "Bülgenauel / Hennef",
    lat: 50.7809, lon: 7.3767, elevation: 210, dhv: 95,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1169", name: "Startplatz Kandel (Kandel-West und Rampe)", region: "Waldkirch",
    lat: 48.0652, lon: 8.0152, elevation: 1200, dhv: 1169,
    sectors: [[213.75, 326.25], [168.75, 236.25]], sectorLabel: "SW-NW · S-SW", ...DEF },

  { id: "db_146", name: "Stauf", region: "Eisenberg",
    lat: 49.5495, lon: 8.0275, elevation: 260, dhv: 146,
    sectors: [[78.75, 101.25], [213.75, 236.25]], sectorLabel: "O · SW", ...DEF },

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

  { id: "db_566", name: "Stöckerkopf", region: "Baiersbronn",
    lat: 48.4956, lon: 8.3683, elevation: 740, dhv: 566,
    sectors: [[348.75, 101.25], [326.25, 11.25]], sectorLabel: "N-O · NNW-N", ...DEF },

  { id: "db_1184", name: "Stohl", region: "Schwedeneck",
    lat: 54.4772, lon: 10.1504, elevation: 20, dhv: 1184,
    sectors: [[33.75, 56.25]], sectorLabel: "NO", ...DEF },

  { id: "db_604", name: "Stormbruch - Hinterm Hagen Übungshang", region: "Diemelsee",
    lat: 51.3518, lon: 8.712, elevation: 475, dhv: 604,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_2303", name: "Strüther Wald", region: "Hochstetten-Dhaun",
    lat: 49.7928, lon: 7.5123, elevation: 280, dhv: 2303,
    sectors: [[348.75, 11.25]], sectorLabel: "N", ...DEF },

  { id: "db_595", name: "Stüppel", region: "Bestwig",
    lat: 51.314, lon: 8.4291, elevation: 730, dhv: 595,
    sectors: [[258.75, 348.75], [33.75, 56.25]], sectorLabel: "W-NNW · NO", ...DEF },

  { id: "db_565", name: "Südhang Wasserkuppe", region: "Gersfeld",
    lat: 50.4974, lon: 9.9372, elevation: 914, dhv: 565,
    sectors: [[168.75, 213.75], [348.75, 56.25], [258.75, 281.25], [303.75, 326.25]], sectorLabel: "S-SSW · N-NO · W · NW", ...DEF },

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

  { id: "db_1101", name: "Tegelberg", region: "Schwangau",
    lat: 47.5599, lon: 10.7799, elevation: 1707, dhv: 1101,
    sectors: [[303.75, 326.25], [281.25, 11.25], [213.75, 281.25]], sectorLabel: "NW · WNW-N · SW-W", ...DEF },

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

  { id: "db_4571", name: "Tringenstein Übungshang NO", region: "Siegbach",
    lat: 50.7582, lon: 8.4143, elevation: 496, dhv: 4571,
    sectors: [[33.75, 56.25], [213.75, 236.25]], sectorLabel: "NO · SW", ...DEF },

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

  { id: "db_336", name: "Unternberg Nord", region: "Ruhpolding",
    lat: 47.7283, lon: 12.6383, elevation: 1381, dhv: 336,
    sectors: [[326.25, 348.75], [168.75, 191.25]], sectorLabel: "NNW · S", ...DEF },

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

  { id: "db_1198", name: "Vogelsang Ost-Startplatz", region: "Bayerischzell",
    lat: 47.6633, lon: 12.0346, elevation: 1558, dhv: 1198,
    sectors: [[78.75, 101.25], [258.75, 281.25]], sectorLabel: "O · W", ...DEF },

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

  { id: "db_953", name: "Wallberg", region: "Rottach-Egern",
    lat: 47.6659, lon: 11.7967, elevation: 1720, dhv: 953,
    sectors: [[303.75, 326.25], [213.75, 11.25], [348.75, 33.75]], sectorLabel: "NW · SW-N · N-NNO", ...DEF },

  { id: "db_888", name: "Wanfried - Aue", region: "Wanfried",
    lat: 51.1722, lon: 10.1301, elevation: 345, dhv: 888,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_320", name: "Wank Ost und Nordost-Startplatz", region: "Garmisch-Partenkirchen",
    lat: 47.5083, lon: 11.1437, elevation: 1780, dhv: 320,
    sectors: [[33.75, 101.25], [258.75, 281.25], [33.75, 56.25], [78.75, 258.75], [11.25, 101.25]], sectorLabel: "NO-O · W · NO · O-WSW · NNO-O", ...DEF },

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

  { id: "db_4655", name: "Weiskirchen", region: "Weiskirchen",
    lat: 49.5471, lon: 6.8229, elevation: 362, dhv: 4655,
    sectors: [[168.75, 303.75], [236.25, 281.25]], sectorLabel: "S-WNW · WSW-W", ...DEF },

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

  { id: "db_116", name: "Wixberg", region: "Iserlohn",
    lat: 51.3186, lon: 7.6667, elevation: 420, dhv: 116,
    sectors: [[123.75, 191.25], [236.25, 303.75]], sectorLabel: "SO-S · WSW-WNW", ...DEF },

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

  { id: "db_1391", name: "Bischling", region: "Werfenweng",
    lat: 47.4641, lon: 13.2991, elevation: 1818, dhv: 1391,
    sectors: [[78.75, 101.25], [168.75, 191.25], [213.75, 236.25]], sectorLabel: "O · S · SW", ...DEF },

  { id: "db_1943", name: "Buchberg", region: "Mattsee",
    lat: 47.9551, lon: 13.1169, elevation: 689, dhv: 1943,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_1371", name: "Bürgeralm", region: "Aflenz",
    lat: 47.5777, lon: 15.2245, elevation: 1742, dhv: 1371,
    sectors: [[168.75, 191.25], [191.25, 213.75]], sectorLabel: "S · SSW", ...DEF },

  { id: "db_1208", name: "Choralpe", region: "Westendorf",
    lat: 47.4188, lon: 12.244, elevation: 1797, dhv: 1208,
    sectors: [[213.75, 281.25], [33.75, 146.25], [348.75, 56.25], [303.75, 326.25]], sectorLabel: "SW-W · NO-SO · N-NO · NW", ...DEF },

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

  { id: "db_1305", name: "Emberger Alm", region: "Greifenburg",
    lat: 46.7769, lon: 13.1496, elevation: 1889, dhv: 1305,
    sectors: [[123.75, 191.25], [168.75, 236.25]], sectorLabel: "SO-S · S-SW", ...DEF },

  { id: "db_1267", name: "Entscharn", region: "Bramberg",
    lat: 47.2806, lon: 12.3424, elevation: 1137, dhv: 1267,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1415", name: "Feuerkogel", region: "Ebensee",
    lat: 47.8165, lon: 13.7194, elevation: 1595, dhv: 1415,
    sectors: [[348.75, 11.25], [78.75, 146.25]], sectorLabel: "N · O-SO", ...DEF },

  { id: "db_1302", name: "Finkenberg", region: "Finkenberg",
    lat: 47.169, lon: 11.799, elevation: 2074, dhv: 1302,
    sectors: [[213.75, 281.25], [123.75, 146.25]], sectorLabel: "SW-W · SO", ...DEF },

  { id: "db_1944", name: "Fohnsdorf", region: "Fohnsdorf",
    lat: 47.2319, lon: 14.6898, elevation: 1310, dhv: 1944,
    sectors: [[168.75, 236.25], [123.75, 236.25]], sectorLabel: "S-SW · SO-SW", ...DEF },

  { id: "db_1307", name: "Fulseck", region: "Dorfgastein",
    lat: 47.2343, lon: 13.148, elevation: 2015, dhv: 1307,
    sectors: [[78.75, 101.25], [258.75, 326.25]], sectorLabel: "O · W-NW", ...DEF },

  { id: "db_1298", name: "Gaisberg", region: "Salzburg",
    lat: 47.8049, lon: 13.1139, elevation: 1263, dhv: 1298,
    sectors: [[348.75, 56.25], [213.75, 281.25], [258.75, 326.25]], sectorLabel: "N-NO · SW-W · W-NW", ...DEF },

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

  { id: "db_1372", name: "Gemeindealpe", region: "Mitterbach",
    lat: 47.8118, lon: 15.2487, elevation: 1598, dhv: 1372,
    sectors: [[78.75, 146.25], [168.75, 236.25], [258.75, 326.25]], sectorLabel: "O-SO · S-SW · W-NW", ...DEF },

  { id: "db_1251", name: "Gerlitzen", region: "Annenheim",
    lat: 46.6924, lon: 13.9139, elevation: 1897, dhv: 1251,
    sectors: [[123.75, 236.25], [168.75, 236.25], [123.75, 191.25]], sectorLabel: "SO-SW · S-SW · SO-S", ...DEF },

  { id: "db_1451", name: "Giggijoch", region: "Sölden",
    lat: 46.9792, lon: 10.9755, elevation: 2291, dhv: 1451,
    sectors: [[33.75, 146.25]], sectorLabel: "NO-SO", ...DEF },

  { id: "db_2112", name: "Goding", region: "Goding",
    lat: 46.7785, lon: 14.921, elevation: 1193, dhv: 2112,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1250", name: "Goldeck", region: "Spittal an der Drau",
    lat: 46.7589, lon: 13.4583, elevation: 2132, dhv: 1250,
    sectors: [[146.25, 191.25], [258.75, 281.25]], sectorLabel: "SSO-S · W", ...DEF },

  { id: "db_1462", name: "Golm", region: "Tschagguns",
    lat: 47.0626, lon: 9.8375, elevation: 2068, dhv: 1462,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1444", name: "Golzentipp", region: "Obertilliach",
    lat: 46.7253, lon: 12.6226, elevation: 2150, dhv: 1444,
    sectors: [[213.75, 281.25], [123.75, 191.25]], sectorLabel: "SW-W · SO-S", ...DEF },

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

  { id: "db_1517", name: "Grubigstein", region: "Lermoos",
    lat: 47.3857, lon: 10.8478, elevation: 2060, dhv: 1517,
    sectors: [[123.75, 191.25], [78.75, 101.25]], sectorLabel: "SO-S · O", ...DEF },

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

  { id: "db_1244", name: "Hahnenkamm", region: "Reutte",
    lat: 47.4764, lon: 10.6408, elevation: 1869, dhv: 1244,
    sectors: [[258.75, 281.25], [123.75, 146.25]], sectorLabel: "W · SO", ...DEF },

  { id: "db_1425", name: "Hahnenkamm Kitzbühel", region: "Kitzbühel",
    lat: 47.4248, lon: 12.3703, elevation: 1650, dhv: 1425,
    sectors: [[123.75, 146.25], [348.75, 11.25]], sectorLabel: "SO · N", ...DEF },

  { id: "db_5817", name: "Haimburgerberg", region: "",
    lat: 46.7189, lon: 14.6719, elevation: 1060, dhv: 5817,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1331", name: "Härmelekopf", region: "Seefeld",
    lat: 47.3289, lon: 11.2272, elevation: 2011, dhv: 1331,
    sectors: [[213.75, 303.75], [33.75, 236.25]], sectorLabel: "SW-WNW · NO-SW", ...DEF },

  { id: "db_2359", name: "Harschbichl", region: "St. Johann in Tirol",
    lat: 47.4845, lon: 12.4285, elevation: 1584, dhv: 2359,
    sectors: [[78.75, 101.25], [258.75, 281.25]], sectorLabel: "O · W", ...DEF },

  { id: "db_1324", name: "Hauser Kaibling", region: "Haus im Ennstal",
    lat: 47.3744, lon: 13.7788, elevation: 1982, dhv: 1324,
    sectors: [[213.75, 326.25], [33.75, 56.25]], sectorLabel: "SW-NW · NO", ...DEF },

  { id: "db_1375", name: "Herndleck", region: "Ternberg",
    lat: 47.9283, lon: 14.3284, elevation: 1026, dhv: 1375,
    sectors: [[348.75, 101.25]], sectorLabel: "N-O", ...DEF },

  { id: "db_2550", name: "Himmelreich", region: "Sankt Marein im Mürztal",
    lat: 47.5074, lon: 15.3392, elevation: 1169, dhv: 2550,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1460", name: "Hinterhornalm", region: "Gnadenwald",
    lat: 47.3345, lon: 11.5651, elevation: 1550, dhv: 1460,
    sectors: [[78.75, 281.25], [123.75, 146.25]], sectorLabel: "O-W · SO", ...DEF },

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

  { id: "db_1461", name: "Hochjoch", region: "Schruns",
    lat: 47.064, lon: 9.9742, elevation: 2292, dhv: 1461,
    sectors: [[213.75, 326.25], [213.75, 281.25], [303.75, 326.25]], sectorLabel: "SW-NW · SW-W · NW", ...DEF },

  { id: "db_2110", name: "Hochkar", region: "Göstling",
    lat: 47.7121, lon: 14.9043, elevation: 1753, dhv: 2110,
    sectors: [[303.75, 11.25], [168.75, 191.25]], sectorLabel: "NW-N · S", ...DEF },

  { id: "db_1392", name: "Hochstall", region: "Pichl",
    lat: 47.6113, lon: 13.3839, elevation: 1235, dhv: 1392,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1326", name: "Hochstein", region: "Lienz",
    lat: 46.8184, lon: 12.708, elevation: 1963, dhv: 1326,
    sectors: [[78.75, 101.25]], sectorLabel: "O", ...DEF },

  { id: "db_1330", name: "Hochwurzen", region: "Pichl",
    lat: 47.36, lon: 13.639, elevation: 1812, dhv: 1330,
    sectors: [[303.75, 11.25], [258.75, 281.25], [78.75, 101.25]], sectorLabel: "NW-N · W · O", ...DEF },

  { id: "db_1450", name: "Hochzeiger", region: "Jerzens",
    lat: 47.1488, lon: 10.7948, elevation: 2434, dhv: 1450,
    sectors: [[78.75, 146.25], [258.75, 11.25]], sectorLabel: "O-SO · W-N", ...DEF },

  { id: "db_1910", name: "Hohe Munde", region: "Telfs",
    lat: 47.345, lon: 11.1049, elevation: 1539, dhv: 1910,
    sectors: [[78.75, 191.25], [123.75, 191.25]], sectorLabel: "O-S · SO-S", ...DEF },

  { id: "db_1309", name: "Hohe Salve", region: "Söll",
    lat: 47.4642, lon: 12.2025, elevation: 1815, dhv: 1309,
    sectors: [[123.75, 191.25], [258.75, 326.25]], sectorLabel: "SO-S · W-NW", ...DEF },

  { id: "db_1365", name: "Hohe Wand", region: "Maiersdorf",
    lat: 47.8294, lon: 16.0416, elevation: 912, dhv: 1365,
    sectors: [[78.75, 146.25], [168.75, 191.25]], sectorLabel: "O-SO · S", ...DEF },

  { id: "db_1268", name: "Hollersbach", region: "Hollersbach",
    lat: 47.2652, lon: 12.4274, elevation: 1145, dhv: 1268,
    sectors: [[303.75, 11.25]], sectorLabel: "NW-N", ...DEF },

  { id: "db_1503", name: "Hundsheimer Berg", region: "Hundsheim",
    lat: 48.1239, lon: 16.9396, elevation: 370, dhv: 1503,
    sectors: [[123.75, 146.25], [258.75, 281.25], [168.75, 191.25]], sectorLabel: "SO · W · S", ...DEF },

  { id: "db_1379", name: "Hutterer Höß", region: "Hinterstoder",
    lat: 47.665, lon: 14.1702, elevation: 1807, dhv: 1379,
    sectors: [[258.75, 281.25], [348.75, 56.25], [213.75, 236.25]], sectorLabel: "W · N-NO · SW", ...DEF },

  { id: "db_2390", name: "Jocham", region: "Sankt Michael im Lungau",
    lat: 47.1053, lon: 13.6635, elevation: 1324, dhv: 2390,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1435", name: "Jöchelspitze", region: "Bach",
    lat: 47.2782, lon: 10.3701, elevation: 1884, dhv: 1435,
    sectors: [[78.75, 191.25], [123.75, 236.25], [213.75, 281.25]], sectorLabel: "O-S · SO-SW · SW-W", ...DEF },

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

  { id: "db_1380", name: "Kleinerberg", region: "Rosenau",
    lat: 47.7341, lon: 14.3661, elevation: 1245, dhv: 1380,
    sectors: [[258.75, 326.25], [168.75, 236.25], [78.75, 146.25]], sectorLabel: "W-NW · S-SW · O-SO", ...DEF },

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

  { id: "db_1436", name: "Kreuzjoch - Schlick 2000", region: "Fulpmes",
    lat: 47.1447, lon: 11.3072, elevation: 2098, dhv: 1436,
    sectors: [[78.75, 146.25], [78.75, 191.25]], sectorLabel: "O-SO · O-S", ...DEF },

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

  { id: "db_1416", name: "Loser", region: "Altausee",
    lat: 47.663, lon: 13.7778, elevation: 1837, dhv: 1416,
    sectors: [[78.75, 191.25], [123.75, 191.25], [123.75, 236.25]], sectorLabel: "O-S · SO-S · SO-SW", ...DEF },

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

  { id: "db_1300", name: "Melchboden", region: "Schwendau",
    lat: 47.2194, lon: 11.8231, elevation: 2041, dhv: 1300,
    sectors: [[168.75, 191.25], [123.75, 146.25], [33.75, 146.25]], sectorLabel: "S · SO · NO-SO", ...DEF },

  { id: "db_1369", name: "Messnerin", region: "Oberort",
    lat: 47.5587, lon: 15.0829, elevation: 1798, dhv: 1369,
    sectors: [[303.75, 326.25], [123.75, 236.25]], sectorLabel: "NW · SO-SW", ...DEF },

  { id: "db_1314", name: "Michaelerberg", region: "Michaelerberg",
    lat: 47.4114, lon: 13.8937, elevation: 1106, dhv: 1314,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_5150", name: "Mitterfeld", region: "Mitterfeld",
    lat: 48.4604, lon: 14.2034, elevation: 763, dhv: 5150,
    sectors: [[258.75, 281.25]], sectorLabel: "W", ...DEF },

  { id: "db_1909", name: "Mösern", region: "Telfs",
    lat: 47.3139, lon: 11.1402, elevation: 1233, dhv: 1909,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1374", name: "Muckenkogel", region: "Lilienfeld",
    lat: 47.9713, lon: 15.6101, elevation: 1284, dhv: 1374,
    sectors: [[168.75, 191.25], [258.75, 281.25], [303.75, 326.25], [33.75, 56.25]], sectorLabel: "S · W · NW · NO", ...DEF },

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

  { id: "db_1243", name: "Neunerköpfle", region: "Tannheim",
    lat: 47.4825, lon: 10.5419, elevation: 1824, dhv: 1243,
    sectors: [[258.75, 326.25], [33.75, 146.25]], sectorLabel: "W-NW · NO-SO", ...DEF },

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

  { id: "db_1449", name: "Oetz", region: "Oetz",
    lat: 47.2087, lon: 10.9352, elevation: 2136, dhv: 1449,
    sectors: [[258.75, 281.25], [213.75, 236.25]], sectorLabel: "W · SW", ...DEF },

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

  { id: "db_1315", name: "Planai", region: "Schladming",
    lat: 47.3718, lon: 13.7241, elevation: 1848, dhv: 1315,
    sectors: [[303.75, 326.25], [33.75, 56.25], [303.75, 56.25]], sectorLabel: "NW · NO · NW-NO", ...DEF },

  { id: "db_1370", name: "Polster", region: "Präbichl",
    lat: 47.5324, lon: 14.961, elevation: 1874, dhv: 1370,
    sectors: [[348.75, 11.25], [168.75, 281.25], [123.75, 191.25]], sectorLabel: "N · S-W · SO-S", ...DEF },

  { id: "db_1428", name: "Pongratzen", region: "Pongratzen",
    lat: 46.6534, lon: 15.3005, elevation: 876, dhv: 1428,
    sectors: [[348.75, 56.25]], sectorLabel: "N-NO", ...DEF },

  { id: "db_1507", name: "Prägraten", region: "Prägraten",
    lat: 47.038, lon: 12.3544, elevation: 2554, dhv: 1507,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_1437", name: "Predigberg", region: "Galtür",
    lat: 46.9634, lon: 10.2201, elevation: 2383, dhv: 1437,
    sectors: [[78.75, 101.25], [348.75, 11.25], [213.75, 236.25]], sectorLabel: "O · N · SW", ...DEF },

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

  { id: "db_1269", name: "Schmittenhöhe", region: "Zell am See",
    lat: 47.3285, lon: 12.7372, elevation: 1942, dhv: 1269,
    sectors: [[123.75, 191.25], [303.75, 11.25]], sectorLabel: "SO-S · NW-N", ...DEF },

  { id: "db_1378", name: "Schnabelberg", region: "Waidhofen an der Ybbs",
    lat: 47.9388, lon: 14.7381, elevation: 920, dhv: 1378,
    sectors: [[258.75, 326.25]], sectorLabel: "W-NW", ...DEF },

  { id: "db_1386", name: "Schnifis", region: "Schnifis",
    lat: 47.2283, lon: 9.7395, elevation: 1310, dhv: 1386,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1376", name: "Schoberstein", region: "Ternberg",
    lat: 47.905, lon: 14.3224, elevation: 1215, dhv: 1376,
    sectors: [[123.75, 146.25]], sectorLabel: "SO", ...DEF },

  { id: "db_1361", name: "Schöckel", region: "St. Radegund",
    lat: 47.1983, lon: 15.46, elevation: 1419, dhv: 1361,
    sectors: [[303.75, 326.25], [123.75, 146.25]], sectorLabel: "NW · SO", ...DEF },

  { id: "db_1455", name: "Schönjoch", region: "Fiss",
    lat: 47.0784, lon: 10.5985, elevation: 2471, dhv: 1455,
    sectors: [[348.75, 11.25], [123.75, 236.25], [168.75, 191.25], [146.25, 236.25]], sectorLabel: "N · SO-SW · S · SSO-SW", ...DEF },

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

  { id: "db_1368", name: "Sonnwendstein", region: "Maria-Schutz",
    lat: 47.6225, lon: 15.8581, elevation: 1482, dhv: 1368,
    sectors: [[78.75, 101.25], [168.75, 236.25], [348.75, 11.25]], sectorLabel: "O · S-SW · N", ...DEF },

  { id: "db_1381", name: "Speiereck", region: "Sankt Michael im Lungau",
    lat: 47.1273, lon: 13.6247, elevation: 2380, dhv: 1381,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1335", name: "Spieljoch", region: "Fügen",
    lat: 47.3246, lon: 11.7914, elevation: 2047, dhv: 1335,
    sectors: [[123.75, 146.25], [33.75, 56.25]], sectorLabel: "SO · NO", ...DEF },

  { id: "db_1498", name: "Spitzerberg Übungshang", region: "Hundsheim",
    lat: 48.1004, lon: 16.9395, elevation: 217, dhv: 1498,
    sectors: [[258.75, 11.25]], sectorLabel: "W-N", ...DEF },

  { id: "db_1508", name: "Stalpe", region: "Sillian",
    lat: 46.7574, lon: 12.4172, elevation: 1541, dhv: 1508,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1221", name: "Startplatz Bezau Süd", region: "Bezau",
    lat: 47.3988, lon: 9.9443, elevation: 1672, dhv: 1221,
    sectors: [[168.75, 191.25], [348.75, 56.25]], sectorLabel: "S · N-NO", ...DEF },

  { id: "db_1445", name: "Startplatz Ebnerfeld", region: "Lienz",
    lat: 46.8528, lon: 12.7947, elevation: 1397, dhv: 1445,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_5800", name: "Startplatz Hochödenbauer", region: "Scheifling",
    lat: 47.1687, lon: 14.3783, elevation: 1240, dhv: 5800,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_2362", name: "Startplatz Übungshang Medraz", region: "Fulpmes",
    lat: 47.1478, lon: 11.3416, elevation: 963, dhv: 2362,
    sectors: [[123.75, 191.25]], sectorLabel: "SO-S", ...DEF },

  { id: "db_1316", name: "Stoderzinken", region: "Gröbming",
    lat: 47.4588, lon: 13.8277, elevation: 2028, dhv: 1316,
    sectors: [[123.75, 146.25], [348.75, 11.25], [258.75, 281.25], [168.75, 191.25]], sectorLabel: "SO · N · W · S", ...DEF },

  { id: "db_1523", name: "Stöfflerberg", region: "Kirchbach",
    lat: 46.6511, lon: 13.1934, elevation: 1131, dhv: 1523,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1317", name: "Stubnerkogel", region: "Bad Gastein",
    lat: 47.1138, lon: 13.0997, elevation: 2242, dhv: 1317,
    sectors: [[78.75, 146.25], [303.75, 11.25]], sectorLabel: "O-SO · NW-N", ...DEF },

  { id: "db_2355", name: "Sulzberg", region: "Langen bei Bregenz",
    lat: 47.5226, lon: 9.8854, elevation: 804, dhv: 2355,
    sectors: [[303.75, 326.25]], sectorLabel: "NW", ...DEF },

  { id: "db_1363", name: "Teichalm", region: "Teichalm",
    lat: 47.3581, lon: 15.4814, elevation: 1453, dhv: 1363,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1822", name: "Tessenberg", region: "Sillian",
    lat: 46.7647, lon: 12.453, elevation: 1821, dhv: 1822,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1260", name: "Thurntaler", region: "Sillian",
    lat: 46.772, lon: 12.3888, elevation: 2333, dhv: 1260,
    sectors: [[78.75, 281.25], [123.75, 236.25], [123.75, 326.25]], sectorLabel: "O-W · SO-SW · SO-NW", ...DEF },

  { id: "db_1388", name: "Trattberg", region: "Golling",
    lat: 47.6375, lon: 13.2689, elevation: 1623, dhv: 1388,
    sectors: [[168.75, 191.25], [258.75, 326.25]], sectorLabel: "S · W-NW", ...DEF },

  { id: "db_1249", name: "Tschiernock", region: "Treffling",
    lat: 46.8585, lon: 13.5522, elevation: 1669, dhv: 1249,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1311", name: "Unterberghorn", region: "Kössen",
    lat: 47.6263, lon: 12.4359, elevation: 1642, dhv: 1311,
    sectors: [[348.75, 56.25], [213.75, 281.25]], sectorLabel: "N-NO · SW-W", ...DEF },

  { id: "db_1322", name: "Untersberg", region: "Fürstenbrunn",
    lat: 47.7221, lon: 13.0076, elevation: 1751, dhv: 1322,
    sectors: [[258.75, 281.25], [303.75, 348.75]], sectorLabel: "W · NW-NNW", ...DEF },

  { id: "db_2473", name: "Upsspitze", region: "Lermoos",
    lat: 47.431, lon: 10.8726, elevation: 2249, dhv: 2473,
    sectors: [[168.75, 236.25]], sectorLabel: "S-SW", ...DEF },

  { id: "db_1454", name: "Venet", region: "Zams",
    lat: 47.1455, lon: 10.625, elevation: 2190, dhv: 1454,
    sectors: [[258.75, 281.25], [303.75, 11.25], [168.75, 191.25], [348.75, 101.25]], sectorLabel: "W · NW-N · S · N-O", ...DEF },

  { id: "db_1511", name: "Virgen", region: "Virgen",
    lat: 47.0247, lon: 12.4264, elevation: 2098, dhv: 1511,
    sectors: [[78.75, 191.25]], sectorLabel: "O-S", ...DEF },

  { id: "db_1429", name: "Wechtisch", region: "Kohlberg",
    lat: 46.6546, lon: 15.3563, elevation: 704, dhv: 1429,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1952", name: "Weißenbach", region: "Haus im Ennstal",
    lat: 47.4225, lon: 13.7759, elevation: 773, dhv: 1952,
    sectors: [[123.75, 236.25]], sectorLabel: "SO-SW", ...DEF },

  { id: "db_2357", name: "Wiedersberger Horn", region: "Alpbach",
    lat: 47.3686, lon: 11.9307, elevation: 1871, dhv: 2357,
    sectors: [[78.75, 101.25], [33.75, 56.25], [303.75, 326.25], [348.75, 11.25]], sectorLabel: "O · NO · NW · N", ...DEF },

  { id: "db_1266", name: "Wildkogel", region: "Neukirchen",
    lat: 47.2812, lon: 12.2871, elevation: 2117, dhv: 1266,
    sectors: [[168.75, 191.25], [123.75, 191.25], [168.75, 236.25], [258.75, 281.25]], sectorLabel: "S · SO-S · S-SW · W", ...DEF },

  { id: "db_1328", name: "Zettersfeld", region: "Lienz",
    lat: 46.8748, lon: 12.7881, elevation: 2186, dhv: 1328,
    sectors: [[213.75, 236.25]], sectorLabel: "SW", ...DEF },

  { id: "db_1420", name: "Zwieselalm", region: "Gosau",
    lat: 47.5388, lon: 13.477, elevation: 1568, dhv: 1420,
    sectors: [[168.75, 191.25]], sectorLabel: "S", ...DEF },

  { id: "db_1424", name: "Zwölferhorn", region: "St. Gilgen",
    lat: 47.7427, lon: 13.3518, elevation: 1505, dhv: 1424,
    sectors: [[303.75, 56.25]], sectorLabel: "NW-NO", ...DEF },

  { id: "db_1443", name: "Zwölferkopf", region: "Pertisau",
    lat: 47.4275, lon: 11.6964, elevation: 1466, dhv: 1443,
    sectors: [[348.75, 11.25], [213.75, 236.25], [258.75, 281.25]], sectorLabel: "N · SW · W", ...DEF },
];
