(function () {
  "use strict";

  var TOPICS = window.TOPICS;
  var QUESTIONS = window.QUESTIONS;
  var BY_ID = {};
  QUESTIONS.forEach(function (q) { BY_ID[q.id] = q; });

  var TEST_SIZE = 10;       // Test pro Thema
  var ALL_TEST_SIZE = 30;   // Prüfungssimulation
  var UNIT_SIZE = 10;       // Lerneinheit (ca. 5 Minuten)
  var SAFE_DAYS = 2;        // "Sicher": richtige Antworten an so vielen verschiedenen Tagen, ohne Fehler dazwischen
  var FLIGHTS_GOAL = 40;
  var GELAENDE_GOAL = 2, GELAENDE_FLIGHTS = 5;
  var STORE_KEY = "ast_v1";
  var LETTERS = ["A", "B", "C", "D", "E"];
  var RING_LEN = 113.1;     // Umfang des Fortschrittsrings (2 * pi * 18)
  var root = document.getElementById("app");

  var UNIT_TITLES = {
    meteo: "Wind & Wetter verstehen",
    recht: "Ausweichregeln & Luftraum",
    aero: "Wie ein Schirm fliegt",
    geraet: "Ausrüstung im Griff",
    praxis: "Sicher starten & landen"
  };
  var START_MODES = [
    { id: "hang", label: "Hangstart", goal: 18000 },
    { id: "kombi", label: "Kombinierte Ausbildung", goal: 18000 },
    { id: "winde", label: "Reine Windenschleppausbildung", goal: 10000 }
  ];

  // ---------- Speicher (localStorage, mit Fallback im Arbeitsspeicher) ----------
  var memStore = null;
  function normalize(s) {
    s = s || {};
    s.q = s.q || {};
    s.days = s.days || {};
    s.flights = s.flights || [];
    s.profile = s.profile || {};
    s.todo = s.todo || {};
    if (typeof s.bestAll !== "number") s.bestAll = null;
    return s;
  }
  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) { /* ignorieren */ }
    return normalize(memStore);
  }
  function saveStore(s) {
    memStore = s;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* ignorieren */ }
  }
  function dayKey(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - (daysAgo || 0));
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function recordAnswer(qid, ok) {
    var s = loadStore();
    var e = s.q[qid] || { seen: 0, ok: 0 };
    e.seen += 1;
    if (ok) e.ok += 1;
    e.last = ok;
    e.days = e.days || [];
    if (ok) { if (e.days.indexOf(dayKey()) === -1) e.days.push(dayKey()); } else { e.days = []; }
    s.q[qid] = e;
    s.days[dayKey()] = (s.days[dayKey()] || 0) + 1;
    s.lastTopic = BY_ID[qid].topic;
    saveStore(s);
  }
  function markedIds() {
    var m = loadStore().marked || {};
    return Object.keys(m).filter(function (id) { return m[id] && BY_ID[id]; });
  }
  function toggleMark(id) {
    var s = loadStore();
    s.marked = s.marked || {};
    if (s.marked[id]) delete s.marked[id]; else s.marked[id] = true;
    saveStore(s);
  }
  function resetStore() { saveStore(normalize({})); }

  // Realistischer Beispiel-Lernstand für Vorführungen (ersetzt den echten Stand)
  function loadSample() {
    var spec = { meteo: { s: 15, p: 3, w: 2 }, recht: { s: 8, p: 4, w: 2 }, aero: { s: 4, p: 3, w: 1 }, geraet: { s: 0, p: 2, w: 1 }, praxis: { s: 0, p: 0, w: 0 } };
    var st = normalize({});
    TOPICS.forEach(function (t) {
      var sp = spec[t.id] || { s: 0, p: 0, w: 0 };
      var ids = QUESTIONS.filter(function (q) { return q.topic === t.id; }).map(function (q) { return q.id; });
      var i = 0, a, b, c;
      for (a = 0; a < sp.s; a++, i++) st.q[ids[i]] = { seen: 3 + (a % 2), ok: 3, last: true, days: [dayKey(6 - (a % 3)), dayKey(2 - (a % 2))] };
      for (b = 0; b < sp.p; b++, i++) st.q[ids[i]] = { seen: 1, ok: 1, last: true, days: [dayKey(b % 2)] };
      for (c = 0; c < sp.w; c++, i++) st.q[ids[i]] = { seen: 2, ok: 1, last: false, days: [] };
    });
    [[6, 12], [5, 9], [4, 14], [3, 0], [2, 11], [1, 8], [0, 7]].forEach(function (d) { st.days[dayKey(d[0])] = d[1]; });
    st.bestAll = 73;
    st.lastTopic = "aero";
    st.todo = { grund: true, theorie: true, termin: true };
    for (var f = 0; f < 28; f++) {
      st.flights.push({ g: f < 17 ? "Wasserkuppe" : "Brauneck", hm: f < 4 ? 450 : 443, d: dayKey(20 - Math.floor(f / 2)) });
    }
    st.profile = { name: "Mark", mode: "hang" };
    saveStore(st);
  }

  // ---------- Tagesziel und Erinnerung ----------
  var GOAL_OPTIONS = [5, 10, 20];
  function dailyGoal() {
    var g = parseInt(loadStore().profile.goal, 10);
    return GOAL_OPTIONS.indexOf(g) !== -1 ? g : 10;
  }
  function todayCount() { return loadStore().days[dayKey()] || 0; }
  function streakDays() {
    var s = loadStore(), n = 0, i = todayCount() > 0 ? 0 : 1;
    while ((s.days[dayKey(i)] || 0) > 0) { n += 1; i += 1; }
    return n;
  }
  function remindTime(p) { return /^\d{2}:\d{2}$/.test(p.remindTime || "") ? p.remindTime : "18:00"; }
  function notifySupported() { return "Notification" in window; }
  function showReminder() {
    var left = Math.max(0, dailyGoal() - todayCount());
    var body = "Heute noch " + left + (left === 1 ? " Frage" : " Fragen") + " bis zu deinem Tagesziel.";
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function (reg) { return reg.showNotification("A-Schein Trainer", { body: body, icon: "icons/icon-192.png", tag: "ast-daily" }); })
        .catch(function () { try { new Notification("A-Schein Trainer", { body: body, icon: "icons/icon-192.png" }); } catch (e) { /* ignorieren */ } });
    } else {
      try { new Notification("A-Schein Trainer", { body: body, icon: "icons/icon-192.png" }); } catch (e) { /* ignorieren */ }
    }
  }
  // Läuft nur, solange die App offen ist (echte Hintergrund-Push-Nachrichten brauchen einen Server)
  function checkReminder() {
    var s = loadStore(), p = s.profile;
    if (!p.remind || !notifySupported() || Notification.permission !== "granted") return;
    if (p.lastNotified === dayKey() || todayCount() >= dailyGoal()) return;
    var t = remindTime(p).split(":"), now = new Date();
    if (now.getHours() * 60 + now.getMinutes() < parseInt(t[0], 10) * 60 + parseInt(t[1], 10)) return;
    p.lastNotified = dayKey();
    saveStore(s);
    showReminder();
  }
  function downloadIcs() {
    var p = loadStore().profile, t = remindTime(p).replace(":", ""), d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    var url = location.href.split("#")[0].replace(/[?].*$/, "");
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//A-Schein Trainer//DE", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:ast-daily-" + stamp + "@a-schein-trainer", "DTSTAMP:" + stamp + "T000000Z", "DTSTART:" + stamp + "T" + t + "00", "DURATION:PT10M",
      "RRULE:FREQ=DAILY", "SUMMARY:A-Schein Trainer: Tagesziel " + dailyGoal() + " Fragen", "DESCRIPTION:Heute noch " + dailyGoal() + " Fragen üben. " + url,
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Heute noch " + dailyGoal() + " Fragen üben", "TRIGGER:PT0M", "END:VALARM", "END:VEVENT", "END:VCALENDAR"];
    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "a-schein-trainer-erinnerung.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  // ---------- Statistik ----------
  function stats() {
    var s = loadStore();
    var out = { total: QUESTIONS.length, mastered: 0, progress: 0, wrong: [], unseen: [], answers: 0, okAnswers: 0, topics: {}, bestAll: s.bestAll, lastTopic: s.lastTopic || null };
    TOPICS.forEach(function (t) { out.topics[t.id] = { total: 0, mastered: 0, progress: 0, wrong: [], unseen: [] }; });
    QUESTIONS.forEach(function (q) {
      var e = s.q[q.id], t = out.topics[q.topic];
      t.total += 1;
      if (!e) { t.unseen.push(q.id); out.unseen.push(q.id); return; }
      out.answers += e.seen;
      out.okAnswers += e.ok;
      if (e.last === false) { t.wrong.push(q.id); out.wrong.push(q.id); }
      if (e.last === true && (e.days || []).length >= SAFE_DAYS) { t.mastered += 1; out.mastered += 1; }
      else { t.progress += 1; out.progress += 1; }
    });
    out.pct = out.total ? Math.round((out.mastered / out.total) * 100) : 0;
    return out;
  }

  // ---------- Ausbildungsstand ----------
  function fmt(n) { return Number(n).toLocaleString("de-DE"); }
  function startMode(s) {
    var id = (s.profile || {}).mode || "hang";
    for (var i = 0; i < START_MODES.length; i++) if (START_MODES[i].id === id) return START_MODES[i];
    return START_MODES[0];
  }
  function trainingState() {
    var s = loadStore();
    var hm = 0, perG = {};
    s.flights.forEach(function (f) { hm += f.hm || 0; perG[f.g] = (perG[f.g] || 0) + 1; });
    var gelaende = Object.keys(perG).filter(function (g) { return perG[g] >= GELAENDE_FLIGHTS; }).length;
    var mode = startMode(s);
    var auto = {
      fluege: s.flights.length >= FLIGHTS_GOAL,
      gelaende: gelaende >= GELAENDE_GOAL,
      hoehenmeter: hm >= mode.goal
    };
    var defs = [
      { id: "grund", title: "Grundausbildung", sub: "Abgeschlossen und Höhenflugreife durch die Flugschule bestätigt" },
      { id: "theorie", title: "Theorieunterricht", sub: "20 Unterrichtseinheiten à 45 Minuten für die A-Lizenz" },
      { id: "fluege", title: "Höhenflüge", sub: "Mindestens 40 Starts und 40 vollständige Landeeinteilungen mit Landung" },
      { id: "gelaende", title: "Verschiedene Gelände", sub: "Mindestens 2 Fluggelände, auf beiden jeweils mindestens 5 Flüge" },
      { id: "hoehenmeter", title: "Höhenmeter", sub: "Insgesamt 18.000 m bei Hangstart oder kombinierter Ausbildung; 10.000 m bei reiner Windenschleppausbildung" },
      { id: "termin", title: "Prüfungstermin mit der Flugschule vereinbaren", sub: "" },
      { id: "portal", title: "Im DHV-Serviceportal registrieren und DHV-Exam freischalten", sub: "Eine DHV-Mitgliedschaft ist für die Registrierung nicht erforderlich" },
      { id: "unterlagen", title: "Personalausweis, Ausbildungsnachweis und Prüfgebühr bereithalten", sub: "" },
      { id: "geraet", title: "Laptop oder Tablet zur Theorieprüfung mitbringen", sub: "Sofern kein Gerät gestellt wird" }
    ];
    var done = 0;
    defs.forEach(function (d) { d.done = !!s.todo[d.id] || !!auto[d.id]; if (d.done) done += 1; });
    return { flights: s.flights.length, hm: hm, gelaende: gelaende, perG: perG, goal: mode.goal, mode: mode, steps: defs, done: done, last: s.flights[s.flights.length - 1] || null };
  }

  // ---------- Helfer ----------
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function topicName(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i].name;
    return "Alle Themen";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function greeting() {
    var h = new Date().getHours();
    return h < 11 ? "Guten Morgen" : h < 18 ? "Guten Tag" : "Guten Abend";
  }
  function seg(filled, total) {
    var h = '<div class="seg" aria-hidden="true">';
    for (var i = 0; i < total; i++) h += '<i' + (i < filled ? ' class="on"' : '') + '></i>';
    return h + '</div>';
  }
  function layers(sicher, prog, total) {
    var a = total ? Math.round(((sicher + prog) / total) * 100) : 0, b = total ? Math.round((sicher / total) * 100) : 0;
    return '<span class="ip" style="width:' + a + '%"></span><span style="width:' + b + '%"></span>';
  }
  function bar(sicher, prog, total) {
    var pct = total ? Math.round((sicher / total) * 100) : 0;
    return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '">' + layers(sicher, prog, total) + '</div>';
  }
  function plainBar(pct) {
    return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>';
  }

  // ---------- Zustand ----------
  var S = null;       // Quiz-Session
  var tab = "start";  // start | lernen | ausbildung | profil
  var showFlightForm = false;

  function poolFor(topic) {
    return QUESTIONS.filter(function (q) { return topic === "all" || q.topic === topic; }).map(function (q) { return q.id; });
  }
  function prioritized(ids) {
    var st = loadStore(), wrong = [], unseen = [], rest = [];
    ids.forEach(function (id) {
      var e = st.q[id];
      if (!e) unseen.push(id);
      else if (e.last === false) wrong.push(id);
      else rest.push(id);
    });
    return shuffle(wrong).concat(shuffle(unseen), shuffle(rest));
  }

  function startSession(mode, topic) {
    var pool = poolFor(topic), ids;
    if (mode === "review") {
      var st = stats();
      ids = shuffle(topic === "all" ? st.wrong : st.topics[topic].wrong);
    } else if (mode === "marked") {
      ids = shuffle(markedIds());
    } else if (mode === "test") {
      ids = shuffle(pool).slice(0, topic === "all" ? ALL_TEST_SIZE : TEST_SIZE);
    } else if (mode === "unit") {
      ids = prioritized(pool).slice(0, UNIT_SIZE);
    } else {
      ids = prioritized(pool);
    }
    if (!ids.length) { renderTab(); return; }
    S = { mode: mode, topic: topic, ids: ids, idx: 0, answers: [], answered: false, back: tab, saved: false };
    prepareQuestion();
    renderQuiz();
  }
  function prepareQuestion() {
    var q = BY_ID[S.ids[S.idx]];
    S.order = shuffle(q.a.map(function (_, i) { return i; })); // Anzeige-Position -> Originalindex
    S.chosen = null;
    S.answered = false;
  }
  function backLabel() {
    if (S.mode === "review") return "Wiederholungen";
    if (S.mode === "marked") return "Markierte Fragen";
    if (S.mode === "test" && S.topic === "all") return "Prüfungssimulation";
    if (S.mode === "unit") return "Lerneinheit";
    return topicName(S.topic);
  }

  // ---------- Kopfzeile und Tab-Leiste ----------
  function updateHeader(st) {
    var num = document.getElementById("ringNum");
    var ring = document.getElementById("ringP");
    if (num) num.textContent = st.pct + "%";
    if (ring) ring.style.strokeDashoffset = String(RING_LEN * (1 - st.pct / 100));
    var btn = document.getElementById("hpct");
    if (btn) btn.setAttribute("aria-label", "Lernstand " + st.pct + " Prozent, " + st.mastered + " von " + st.total + " Fragen sicher");
    var name = (loadStore().profile.name || "").trim();
    var av = document.getElementById("avatar");
    if (av) av.textContent = name ? name.charAt(0).toUpperCase() : "G";
  }
  function updateNav() {
    var active = S && !S.done ? S.back : tab;
    var tabs = document.querySelectorAll(".tabbar .tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].getAttribute("data-tab") === active);
    }
    document.body.classList.toggle("in-quiz", !!(S && !S.done));
  }

  // ---------- Views ----------
  function startBtn(label, cls, mode, topic) {
    return '<button class="btn ' + cls + '" data-act="start" data-mode="' + mode + '" data-topic="' + topic + '">' + label + '</button>';
  }

  var ICONS = {
    meteo: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    recht: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    aero: '<path d="M3 11c0-4 4-7 9-7s9 3 9 7c-3-1.5-6-1.5-9 0-3-1.5-6-1.5-9 0Z"/><path d="M5 12l7 7M12 11v8M19 12l-7 7"/><circle cx="12" cy="21" r="1"/>',
    geraet: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/>',
    praxis: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3Z"/>'
  };
  function icon(id) {
    return '<span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[id] || ICONS.meteo) + '</svg></span>';
  }

  function heroSvg() {
    return '<img class="hero" src="icons/hero.jpg" alt="Gleitschirm über Alpenkämmen im Morgenlicht" width="1200" height="400">';
  }

  // Empfehlung für "Heute empfohlen": Thema mit den meisten Fehlern bzw. angefangenen Fragen
  function recommended(st) {
    var best = null, score = -1;
    TOPICS.forEach(function (t) {
      var ts = st.topics[t.id];
      var sc = ts.wrong.length * 3 + ts.progress + (ts.unseen.length ? 0.2 : 0);
      if (ts.mastered === ts.total) sc = -0.5;
      if (sc > score) { score = sc; best = t.id; }
    });
    return best || TOPICS[0].id;
  }

  function viewStart(st) {
    var s = loadStore();
    var name = (s.profile.name || "").trim();
    var rec = recommended(st);
    var filled = st.mastered ? Math.max(1, Math.round((st.mastered / st.total) * 12)) : 0;
    var html = '<p class="greet">' + greeting() + (name ? ', ' + esc(name) : '') + '</p><h1 class="view-title big">Dein nächster Schritt.</h1>';
    html += heroSvg();
    html += '<div class="eyebrow">Heute empfohlen</div><h2 class="rec-title">' + esc(UNIT_TITLES[rec] || topicName(rec)) + '</h2>' +
      '<p class="sub">' + esc(topicName(rec)) + ' · ca. 5 Minuten</p>' +
      startBtn("Lerneinheit starten →", "block", "unit", rec);
    var goal = dailyGoal(), today = todayCount(), left = Math.max(0, goal - today), sk = streakDays();
    html += '<div class="goalbox"><div class="goalhead"><b>' + (left ? 'Heute noch ' + left + (left === 1 ? ' Frage' : ' Fragen') : 'Tagesziel erreicht ✓') + '</b>' +
      '<span>' + Math.min(today, goal) + ' von ' + goal + (sk > 1 ? ' · ' + sk + ' Tage in Folge' : '') + '</span></div>' + plainBar(Math.min(100, Math.round(today / goal * 100))) + '</div>';
    if (st.lastTopic && st.topics[st.lastTopic]) {
      html += '<div class="lastline"><span><small>Zuletzt gelernt</small><b>' + esc(topicName(st.lastTopic)) + '</b></span>' +
        startBtn("Weiterlernen →", "sm outline", "practice", st.lastTopic) + '</div>';
    }
    html += '<div class="divider"></div><div class="rowhead"><h2>Dein Lernstand</h2><button class="textlink" data-tab="profil">Details ↗</button></div>' +
      '<div class="big-num">' + st.mastered + ' von ' + st.total + '</div><p class="sub">Fragen sicher beantwortet · ' + st.progress + ' in Arbeit · ' + st.unseen.length + ' neu</p>' + seg(filled, 12);
    if (st.wrong.length) {
      html += '<button class="warnlink" data-act="start" data-mode="review" data-topic="all"><i></i>' + st.wrong.length + (st.wrong.length === 1 ? ' Frage' : ' Fragen') + ' zur Wiederholung →</button>';
    } else if (!st.answers) {
      html += '<button class="warnlink calm" data-act="sample"><i></i>Beispiel-Lernstand laden →</button>';
    }
    html += '<div class="divider"></div><h2 class="rowtitle">Deine Themen</h2><div class="list">';
    TOPICS.forEach(function (t) {
      var ts = st.topics[t.id];
      html += '<button class="trow" data-act="start" data-mode="practice" data-topic="' + t.id + '">' + icon(t.id) +
        '<span class="tname">' + esc(t.name) + '<small class="block">' + ts.mastered + ' sicher · ' + ts.progress + ' in Arbeit · ' + ts.unseen.length + ' neu</small></span>' +
        '<span class="tprog"><small>' + ts.mastered + ' von ' + ts.total + '</small>' + bar(ts.mastered, ts.progress, ts.total) + '</span><span class="chev" aria-hidden="true">›</span></button>';
    });
    html += '</div><p class="demoline"><b>Demo</b> · Beispielfragen, keine offiziellen DHV-Prüfungsfragen. Inhalte noch nicht fachlich abgenommen. <a href="datenschutz.html#impressum">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></p>';
    return html;
  }

  function viewLernen(st) {
    var marked = markedIds().length;
    var best = st.bestAll;
    var html = '<h1 class="view-title">Lernen</h1><p class="sub">Wähle, wie du lernen möchtest.</p>';
    html += '<div class="block-card"><h2>Wiederholungen</h2>' + (st.wrong.length
      ? '<p class="sub">' + st.wrong.length + ' Fragen, die du zuletzt falsch beantwortet hast.</p>' + startBtn("Wiederholen", "", "review", "all")
      : '<p class="sub">' + (st.answers ? 'Keine offenen Fehler. Gut gemacht!' : 'Hier findest du später deine Wiederholungen.') + '</p>') + '</div>';
    html += '<div class="block-card"><h2>Prüfungssimulation</h2><p class="sub">' + ALL_TEST_SIZE + ' Fragen aus allen Themen, Auswertung am Ende' + (best !== null ? ' · Bestes Ergebnis: ' + best + ' %' : '') + '.</p>' +
      startBtn("Prüfung starten", "secondary", "test", "all") + '</div>';
    html += '<div class="eyebrow pad">Training nach Themen</div><div class="list">';
    TOPICS.forEach(function (t) {
      var ts = st.topics[t.id];
      html += '<div class="trow static">' + icon(t.id) + '<span class="tname">' + esc(t.name) + '<small class="block">' + ts.total + ' Fragen</small></span>' +
        '<span class="row nowrap">' + startBtn("Üben", "sm", "practice", t.id) + startBtn("Test", "sm secondary", "test", t.id) + '</span></div>';
    });
    html += '</div>';
    html += '<div class="eyebrow pad">Markierte Fragen</div><div class="block-card">' + (marked
      ? '<p class="sub">' + marked + (marked === 1 ? ' Frage' : ' Fragen') + ' von dir markiert.</p>' + startBtn("Markierte üben", "", "marked", "all")
      : '<p class="sub">Noch nichts markiert. Tippe beim Üben auf den Stern, um eine Frage für später zu merken.</p>') + '</div>';
    return html;
  }

  function viewAusbildung() {
    var t = trainingState();
    var html = '<h1 class="view-title big">Dein Ausbildungsstand</h1><p class="sub">Alles für deinen Weg zur A-Lizenz.</p>';
    html += '<select class="select" id="modeSel" aria-label="Ausbildungsform">' + START_MODES.map(function (m) {
      return '<option value="' + m.id + '"' + (m.id === t.mode.id ? ' selected' : '') + '>' + m.label + '</option>';
    }).join("") + '</select>';
    html += '<p class="steps-line">' + t.done + ' von ' + t.steps.length + ' Schritten erledigt</p>' + seg(t.done, t.steps.length);

    html += '<div class="eyebrow pad">Praktische Ausbildung</div>';
    function metric(label, val, goal, unit, sub, pct) {
      return '<div class="metric"><div class="mhead"><b>' + label + '</b><span>' + val + ' / ' + goal + (unit || '') + '</span></div>' +
        (sub ? '<small>' + sub + '</small>' : '') + plainBar(Math.min(100, pct)) + '</div>';
    }
    html += metric("Höhenflüge", fmt(t.flights), fmt(FLIGHTS_GOAL), "", "", Math.round(t.flights / FLIGHTS_GOAL * 100));
    html += metric("Höhenmeter", fmt(t.hm), fmt(t.goal), " m", "", Math.round(t.hm / t.goal * 100));
    var gl = Object.keys(t.perG).map(function (g) { return esc(g) + ': ' + t.perG[g] + (t.perG[g] === 1 ? ' Flug' : ' Flüge'); }).join(' · ');
    html += metric("Fluggelände", t.gelaende, GELAENDE_GOAL, "", gl || ('Mindestens ' + GELAENDE_FLIGHTS + ' Flüge je Gelände'), Math.round(t.gelaende / GELAENDE_GOAL * 100));

    if (showFlightForm) {
      var names = Object.keys(t.perG).map(function (g) { return '<option value="' + esc(g) + '">'; }).join("");
      html += '<div class="flightform"><label>Fluggelände<input id="ffG" type="text" list="gl" placeholder="z. B. Wasserkuppe" autocomplete="off"></label><datalist id="gl">' + names + '</datalist>' +
        '<label>Höhenmeter<input id="ffH" type="number" inputmode="numeric" min="0" max="3000" placeholder="z. B. 450"></label>' +
        '<div class="row"><button class="btn" data-act="saveflight">Speichern</button><button class="btn ghost" data-act="flightform">Abbrechen</button></div></div>';
    } else {
      html += '<button class="btn outline block" data-act="flightform">+ Flug eintragen</button>';
    }
    if (t.last) {
      html += '<p class="lastflight">Letzter Flug: ' + esc(t.last.g) + ' · ' + fmt(t.last.hm) + ' m <button class="textlink" data-act="undoflight">Rückgängig</button></p>';
    }

    var open = t.steps.filter(function (d) { return !d.done; });
    var done = t.steps.filter(function (d) { return d.done; });
    function step(d) {
      return '<button class="step' + (d.done ? ' is-done' : '') + '" data-act="step" data-id="' + d.id + '" aria-pressed="' + d.done + '">' +
        '<span class="check">' + (d.done ? '✓' : '') + '</span><span class="stt"><b>' + esc(d.title) + '</b>' + (d.sub ? '<small>' + esc(d.sub) + '</small>' : '') + '</span></button>';
    }
    html += '<div class="eyebrow pad">Deine nächsten Schritte</div>';
    html += open.length ? '<div class="steps">' + open.map(step).join("") + '</div>' : '<p class="sub">Alles erledigt. Stark!</p>';
    if (done.length) html += '<details class="doneBox"><summary>Erledigt (' + done.length + ')</summary><div class="steps">' + done.map(step).join("") + '</div></details>';
    html += '<p class="note">Selbst erfasster Fortschritt. Bestätigungen erfolgen durch die Flugschule. Angaben ohne Gewähr, verbindlich sind die Vorgaben von DHV und Flugschule.</p>';
    html += '<p class="note strong">Anbindung an den digitalen Ausbildungsnachweis: Konzept, noch nicht umgesetzt.</p>';
    return html;
  }

  function viewProfil(st) {
    var s = loadStore();
    var rate = st.answers ? Math.round((st.okAnswers / st.answers) * 100) : 0;
    var html = '<h1 class="view-title big">Profil</h1><p class="sub">Alles bleibt auf deinem Gerät.</p>';
    html += '<label class="field">Dein Name (optional)<input id="nameIn" type="text" value="' + esc(s.profile.name || "") + '" maxlength="30" placeholder="Wie sollen wir dich nennen?" autocomplete="off"></label>';
    html += '<div class="eyebrow pad">Dein Fortschritt</div><div class="stats">' +
      '<div><b>' + st.pct + ' %</b><span>sicher</span></div>' +
      '<div><b>' + st.mastered + '/' + st.total + '</b><span>Fragen sicher</span></div>' +
      '<div><b>' + st.progress + '</b><span>in Arbeit</span></div>' +
      '<div><b>' + st.unseen.length + '</b><span>neu</span></div>' +
      '<div><b>' + st.answers + '</b><span>Antworten gesamt</span></div>' +
      '<div><b>' + (st.answers ? rate + ' %' : '–') + '</b><span>Trefferquote</span></div></div>';
    var pr = s.profile, perm = notifySupported() ? Notification.permission : "unsupported";
    html += '<div class="eyebrow pad">Tagesziel und Erinnerung</div><div class="block-card">' +
      '<label class="field">Tagesziel<select id="goalSel" class="select slim">' + GOAL_OPTIONS.map(function (g) { return '<option value="' + g + '"' + (g === dailyGoal() ? ' selected' : '') + '>' + g + ' Fragen pro Tag</option>'; }).join("") + '</select></label>' +
      '<label class="switch"><input type="checkbox" id="remindChk"' + (pr.remind && perm === "granted" ? ' checked' : '') + (perm === "unsupported" ? ' disabled' : '') + '><span>Erinnerung auf diesem Gerät</span></label>' +
      '<label class="field">Uhrzeit<input id="remindTime" type="time" value="' + remindTime(pr) + '"></label>' +
      (perm === "denied" ? '<p class="note">Benachrichtigungen sind im Browser blockiert. Du kannst sie in den Seiteneinstellungen wieder erlauben.</p>' : '') +
      (perm === "unsupported" ? '<p class="note">Dieser Browser unterstützt keine Benachrichtigungen.</p>' : '') +
      '<p class="sub small">Die Erinnerung erscheint, solange die App geöffnet oder im Hintergrund aktiv ist. Für eine zuverlässige tägliche Erinnerung kannst du einen wiederkehrenden Termin im Kalender anlegen.</p>' +
      '<button class="btn secondary" data-act="ics">Täglich im Kalender erinnern</button></div>';
    html += '<div class="block-card"><h2>So zählt dein Lernstand</h2><ul class="rules">' +
      '<li><b>Neu:</b> Du hast die Frage noch nie beantwortet.</li>' +
      '<li><b>In Arbeit:</b> Du hast sie schon beantwortet, aber noch nicht sicher genug. Das gilt auch nach jeder falschen Antwort.</li>' +
      '<li><b>Sicher:</b> Du hast sie an mindestens ' + SAFE_DAYS + ' verschiedenen Tagen richtig beantwortet, ohne dass dazwischen ein Fehler passiert ist.</li></ul>' +
      '<p class="sub">Eine falsche Antwort setzt die Frage zurück auf „In Arbeit“. So zeigt der Prozentwert, was wirklich sitzt, und nicht nur, was du gerade zufällig richtig hattest. „Sicher“ ist eine Lernhilfe und keine Garantie für die Prüfung.</p></div>';
    html += '<div class="block-card"><h2>Hinweise zur Demo</h2><p class="sub">Die Fragen sind eigene Beispielfragen und keine offiziellen DHV-Prüfungsfragen. Die Inhalte sind noch nicht von einem Fluglehrer oder dem DHV abgenommen. Verlass dich für die Prüfung nicht allein auf diese App.</p></div>';
    html += '<div class="block-card"><h2>Datenschutz</h2><p class="sub">Kein Konto, keine Anmeldung. Lernstand, Name und Flugeinträge bleiben nur auf diesem Gerät gespeichert und werden nicht übertragen.</p></div>';
    html += '<div class="block-card"><h2>Geplant</h2><p class="sub">B-Lizenz und weitere Lizenzen, mehr Fragen, Lernstatistik pro Thema, Anbindung an den digitalen Ausbildungsnachweis. Noch nicht umgesetzt.</p></div>';
    html += '<div class="block-card"><h2>Für die Vorstellung</h2><p class="sub">Lädt einen realistischen Beispiel-Lernstand mit Verlauf über mehrere Tage und Flugeinträgen. Dein bisheriger Stand wird dabei ersetzt.</p>' +
      '<button class="btn secondary" data-act="sample">Beispiel-Lernstand laden</button></div>';
    html += '<div class="row"><button class="btn ghost" data-act="reset">Alles zurücksetzen</button></div><p class="foot"><a href="datenschutz.html#impressum">Impressum</a> · <a href="datenschutz.html">Datenschutz</a><br>A-Schein Trainer · Demo 0.5</p>';
    return html;
  }

  function renderTab() {
    S = null;
    var st = stats();
    updateHeader(st);
    updateNav();
    var html = tab === "lernen" ? viewLernen(st) : tab === "ausbildung" ? viewAusbildung() : tab === "profil" ? viewProfil(st) : viewStart(st);
    root.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function renderQuiz() {
    updateHeader(stats());
    updateNav();
    var q = BY_ID[S.ids[S.idx]];
    var total = S.ids.length;
    var practice = S.mode !== "test";
    var isMarked = markedIds().indexOf(q.id) !== -1;
    var filled = S.idx + (S.answered && practice ? 1 : 0);

    var html = '<div class="quiz-top"><button class="back" data-act="back">← ' + esc(backLabel()) + '</button>' +
      '<button class="star' + (isMarked ? ' on' : '') + '" data-act="mark" aria-pressed="' + isMarked + '" aria-label="Frage markieren">' + (isMarked ? '★' : '☆') + ' <span>' + (isMarked ? 'Markiert' : 'Markieren') + '</span></button></div>' +
      '<p class="qcount">Frage ' + (S.idx + 1) + ' von ' + total + (S.mode === "test" ? ' · Test' : '') + '</p>' + seg(filled, total) +
      '<div class="eyebrow pad">' + esc(topicName(q.topic)) + '</div>' +
      '<h1 class="q-text">' + esc(q.q) + '</h1><p class="sub">' + (S.answered && practice ? '&nbsp;' : 'Wähle eine Antwort.') + '</p><div class="opts" role="group" aria-label="Antworten">';

    S.order.forEach(function (orig, pos) {
      var cls = "opt", disabled = "", mk = "";
      if (S.answered && practice) {
        disabled = " disabled";
        if (orig === q.correct) { cls += " correct"; mk = '<span class="mk ok">✓</span>'; }
        else if (orig === S.chosen) { cls += " wrong"; mk = '<span class="mk bad">✕</span>'; }
      } else if (S.chosen === orig) {
        cls += " selected"; mk = '<span class="mk ok">✓</span>';
      }
      html += '<button class="' + cls + '" data-act="pick" data-pos="' + pos + '"' + disabled + '>' +
        '<span class="letter">' + LETTERS[pos] + '</span><span class="otxt">' + esc(q.a[orig]) + '</span>' + mk + '</button>';
    });
    html += '</div>';

    if (S.answered && practice) {
      var ok = S.chosen === q.correct;
      html += '<div class="fb ' + (ok ? 'good' : 'bad') + '"><div class="eyebrow">' + (ok ? 'Richtig' : 'Nicht ganz') + '</div><p>' + esc(q.expl) + '</p></div>';
    }

    var last = S.idx === total - 1;
    if (practice) {
      html += S.answered ? '<button class="btn block next" data-act="next">' + (last ? 'Ergebnis anzeigen' : 'Nächste Frage') + ' →</button>' : '';
    } else {
      html += '<button class="btn block next" data-act="confirm"' + (S.chosen === null ? ' disabled' : '') + '>' + (last ? 'Test abschließen' : 'Antwort bestätigen') + ' →</button>';
    }
    html += '<p class="qfoot">Beispielfrage · fachliche Prüfung ausstehend</p>';
    root.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function renderResult() {
    S.done = true;
    var total = S.answers.length;
    var right = S.answers.filter(function (a) { return a.ok; }).length;
    var pct = total ? Math.round((right / total) * 100) : 0;

    if (S.mode === "test" && S.topic === "all" && !S.saved) {
      S.saved = true;
      var store = loadStore();
      if (store.bestAll === null || pct > store.bestAll) { store.bestAll = pct; saveStore(store); }
    }
    updateHeader(stats());
    updateNav();

    var msg = pct >= 90 ? "Sehr stark!" : pct >= 75 ? "Gut – noch ein bisschen Feinschliff." : pct >= 50 ? "Solide Basis, die Fehler lohnen sich zu wiederholen." : "Noch Luft nach oben – Erklärungen durchgehen und nochmal üben.";

    var html = '<div class="score"><div class="eyebrow">Ergebnis</div><div class="big-num xl">' + right + ' / ' + total + '</div>' +
      '<p class="sub">' + pct + ' % richtig · ' + msg + '</p></div>';

    var wrong = S.answers.filter(function (a) { return !a.ok; });
    if (wrong.length) {
      html += '<div class="eyebrow pad">Das solltest du dir nochmal ansehen (' + wrong.length + ')</div><div class="review">';
      wrong.forEach(function (a) {
        var q = BY_ID[a.qid];
        html += '<div class="item"><b>' + esc(q.q) + '</b>' +
          '<div class="yours">Deine Antwort: ' + esc(q.a[a.chosen]) + '</div>' +
          '<div class="right">Richtig: ' + esc(q.a[q.correct]) + '</div>' +
          '<div class="why">' + esc(q.expl) + '</div></div>';
      });
      html += '</div>';
    }
    html += '<div class="row" style="margin-top:18px"><button class="btn" data-act="back">Weiter</button><button class="btn outline" data-act="again">Nochmal</button></div>';
    root.innerHTML = html;
    window.scrollTo(0, 0);
  }

  // ---------- Aktionen ----------
  function pick(pos) {
    if (!S || S.done || (S.answered && S.mode !== "test")) return;
    var orig = S.order[pos];
    S.chosen = orig;
    if (S.mode === "test") {
      renderQuiz();
    } else {
      var q = BY_ID[S.ids[S.idx]];
      var ok = orig === q.correct;
      S.answered = true;
      S.answers.push({ qid: q.id, chosen: orig, ok: ok });
      recordAnswer(q.id, ok);
      renderQuiz();
      var n = root.querySelector('[data-act="next"]');
      if (n) n.focus();
    }
  }
  function confirmTest() {
    if (!S || S.done || S.chosen === null) return;
    var q = BY_ID[S.ids[S.idx]];
    var ok = S.chosen === q.correct;
    S.answers.push({ qid: q.id, chosen: S.chosen, ok: ok });
    recordAnswer(q.id, ok);
    advance();
  }
  function advance() {
    if (S.idx >= S.ids.length - 1) { renderResult(); return; }
    S.idx += 1;
    prepareQuestion();
    renderQuiz();
  }
  function goTab(name) { tab = name; showFlightForm = false; renderTab(); }

  function saveFlight() {
    var g = (document.getElementById("ffG").value || "").trim();
    var hm = parseInt(document.getElementById("ffH").value, 10);
    if (!g) { document.getElementById("ffG").focus(); return; }
    if (isNaN(hm) || hm < 0) { document.getElementById("ffH").focus(); return; }
    var s = loadStore();
    s.flights.push({ g: g, hm: hm, d: dayKey() });
    saveStore(s);
    showFlightForm = false;
    renderTab();
  }

  root.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]");
    if (!el || el.disabled) return;
    var act = el.getAttribute("data-act");
    if (act === "start") startSession(el.getAttribute("data-mode"), el.getAttribute("data-topic"));
    else if (act === "pick") pick(parseInt(el.getAttribute("data-pos"), 10));
    else if (act === "next") advance();
    else if (act === "confirm") confirmTest();
    else if (act === "mark") { toggleMark(S.ids[S.idx]); renderQuiz(); }
    else if (act === "back") { if (S) tab = S.back; renderTab(); }
    else if (act === "again") startSession(S.mode === "review" ? "practice" : S.mode, S.topic);
    else if (act === "flightform") { showFlightForm = !showFlightForm; renderTab(); }
    else if (act === "saveflight") saveFlight();
    else if (act === "undoflight") { var s = loadStore(); s.flights.pop(); saveStore(s); renderTab(); }
    else if (act === "step") {
      var st2 = loadStore(), id = el.getAttribute("data-id");
      if (st2.todo[id]) delete st2.todo[id]; else st2.todo[id] = true;
      saveStore(st2); renderTab();
    }
    else if (act === "sample") {
      if (!stats().answers || window.confirm("Beispiel-Lernstand laden? Dein bisheriger Stand wird ersetzt.")) { loadSample(); renderTab(); }
    }
    else if (act === "ics") downloadIcs();
    else if (act === "reset") {
      if (window.confirm("Alles zurücksetzen (Lernstand, Flugeinträge, Name)?")) { resetStore(); renderTab(); }
    }
  });

  root.addEventListener("change", function (ev) {
    if (ev.target.id === "modeSel") {
      var s = loadStore(); s.profile.mode = ev.target.value; saveStore(s); renderTab();
    } else if (ev.target.id === "goalSel") {
      var s3 = loadStore(); s3.profile.goal = parseInt(ev.target.value, 10); saveStore(s3); renderTab();
    } else if (ev.target.id === "remindTime") {
      var s4 = loadStore(); s4.profile.remindTime = ev.target.value || "18:00"; saveStore(s4);
    } else if (ev.target.id === "remindChk") {
      var chk = ev.target;
      if (chk.checked) {
        Notification.requestPermission().then(function (perm) {
          var s5 = loadStore(); s5.profile.remind = perm === "granted"; saveStore(s5); renderTab(); if (perm === "granted") checkReminder();
        });
      } else {
        var s6 = loadStore(); s6.profile.remind = false; saveStore(s6);
      }
    } else if (ev.target.id === "nameIn") {
      var s2 = loadStore(); s2.profile.name = ev.target.value.trim(); saveStore(s2); updateHeader(stats());
    }
  });

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-tab]");
    if (el) goTab(el.getAttribute("data-tab"));
  });

  // Tastatur: 1–4 wählt Antwort, Enter = weiter/bestätigen
  document.addEventListener("keydown", function (ev) {
    if (!S || S.done || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.target && /^(INPUT|SELECT|TEXTAREA)$/.test(ev.target.tagName)) return;
    var n = parseInt(ev.key, 10);
    if (n >= 1 && n <= S.order.length) { pick(n - 1); return; }
    if (ev.key === "Enter") {
      if (S.mode === "test" && S.chosen !== null) confirmTest();
      else if (S.mode !== "test" && S.answered) advance();
    }
  });

  // ---------- Start ----------
  renderTab();
  checkReminder();
  setInterval(checkReminder, 60000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) checkReminder(); });

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* Offline-Cache optional */ });
  }
})();
