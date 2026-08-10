// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// This file was generated with AI assistance (Claude Code, Anthropic).

// ============================================================================
//  SPICKZETTEL — the exam cheat sheet.
//
//  Two datasets:
//    EXERCISE_TYPES     — every task format that actually shows up in a German
//                         exam, with the mechanical trick that solves it.
//    LEVEL_EXPECTATIONS — what each CEFR level demands, and what is NEW at that
//                         level compared to the one below it.
//
//  Timings and point counts are approximations ("ca."). Goethe, telc and ÖSD
//  each cut the same skills slightly differently and revise their formats;
//  always confirm against the Modellsatz of the exam you booked.
// ============================================================================

/** The five blocks every German exam is built from. */
export const EXAM_PARTS = [
  { id: "bausteine", label: "Sprachbausteine", en: "Grammar in context",
    blurb: "Gap fills and transformations. Pure grammar, mechanically scorable — the part you can farm to 100 %." },
  { id: "lesen", label: "Leseverstehen", en: "Reading",
    blurb: "Matching, multiple choice, true/false, text reconstruction. Never a vocabulary test — always a paraphrase test." },
  { id: "hoeren", label: "Hörverstehen", en: "Listening",
    blurb: "The only part played on a clock you do not control. Everything is won before the audio starts." },
  { id: "schreiben", label: "Schreiben", en: "Writing",
    blurb: "Marked against a rubric, not against a native speaker. Content points first, then structure, then grammar." },
  { id: "sprechen", label: "Sprechen", en: "Speaking",
    blurb: "Graded on fluency and interaction, not on being right. Silence costs more marks than a wrong ending." },
];

// ---------------------------------------------------------------------------
//  Exercise types
//
//  shape:
//    id       — unique slug
//    part     — key from EXAM_PARTS
//    title/en — German name / English name
//    levels   — CEFR levels where this format appears
//    where    — which exam and which part it usually is
//    time     — the pacing budget you should hold yourself to
//    signal   — how to recognise the format in two seconds
//    sample   — { task, body, options? } a miniature of the real thing
//    trick    — { name, steps[] } the mechanical procedure that solves it
//    focus    — what earns the marks
//    traps    — how the format is designed to make you lose them
//    compare  — { task, wrong, right, why } one side-by-side, wrong vs right
//    rules    — rulebook IDs (R-NNN)
//    modules  — curriculum module IDs
//    byLevel  — what changes about this exact format at each level
// ---------------------------------------------------------------------------

export const EXERCISE_TYPES = [
  // ==================================================== SPRACHBAUSTEINE =====
  {
    id: "lueckentext-auswahl",
    part: "bausteine",
    title: "Lückentext mit Auswahl",
    en: "Multiple-choice gap fill",
    levels: ["A2", "B1", "B2", "C1"],
    where: "telc B1/B2 «Sprachbausteine, Teil 1» (Aufgaben 21–30, 10 Lücken à 3 Optionen, je 1,5 Punkte) · telc C1 Hochschule «Sprachbausteine» (22 Vierfachwahl-Aufgaben in 22 Min.)",
    time: "ca. 45 Sek. pro Lücke",
    signal: "Ein kurzer Brief oder Text mit nummerierten Lücken, darunter für jede Lücke drei bis vier Optionen.",
    sample: {
      task: "Wählen Sie für jede Lücke das richtige Wort.",
      body: "Wir bedanken uns ___ (1) Ihre schnelle Antwort und freuen uns ___ (2) das Treffen.",
      options: ["(1) a) für   b) über   c) auf", "(2) a) für   b) über   c) auf"],
    },
    trick: {
      name: "Nie die Lücke lesen — den Auslöser links davon lesen",
      steps: [
        "Decke die Optionen ab. Lies nur den Satz.",
        "Suche den Auslöser: Verb, Präposition, Konnektor oder Artikelwort. Er steht fast immer VOR der Lücke.",
        "Sag dir die Regel laut: «sich freuen auf + AKK». Jetzt erst die Optionen aufdecken.",
        "Streiche, was die Regel verbietet. Meist bleibt genau eine Option übrig — ohne dass du raten musst.",
        "Passt keine Option, ist dein Auslöser falsch. Suche einen zweiten (oft ein Nebensatz-Konnektor).",
      ],
    },
    focus: [
      "Verben mit fester Präposition — sie sind der häufigste Lückentyp überhaupt.",
      "Konnektoren: entscheidet die Lücke über Verbstellung, ist die Verbposition rechts davon der Beweis.",
      "Artikelwörter: der Kasus wird immer links zugewiesen, nie durch das Nomen selbst.",
    ],
    traps: [
      "Zwei Optionen sind grammatisch korrekt, aber nur eine passt zur Bedeutung. Übersetze beide und vergleiche.",
      "Eine Option klingt wie im Englischen (warten für ↔ wait for). Genau die ist der Köder.",
      "Nie eine Lücke leer lassen: es gibt keinen Punktabzug für Falsches, nur für Fehlendes.",
    ],
    compare: {
      task: "Ich freue mich ___ das Treffen.",
      wrong: "Ich freue mich für das Treffen.",
      right: "Ich freue mich auf das Treffen.",
      why: "«sich freuen» trägt die Präposition fest bei sich: auf + AKK (Zukunft), über + AKK (Vergangenheit). Die Bedeutung des Nomens ändert daran nichts.",
    },
    rules: ["R-085", "R-081", "R-068"],
    modules: ["verbpraep", "praep"],
    byLevel: {
      A2: "Präpositionen, Modalverben, Perfekt-Hilfsverb. Die Optionen sind formal weit auseinander (in / auf / mit).",
      B1: "Konnektoren und Nebensätze kommen dazu. Oft entscheidet die Verbstellung im Rest des Satzes, welche Option gilt.",
      B2: "Die Optionen unterscheiden sich nur noch stilistisch: obwohl / trotzdem / trotz — gleiche Bedeutung, drei verschiedene Satzbaupläne.",
      C1: "Funktionsverbgefüge und formelle Konnektoren. Alle Optionen sind korrektes Deutsch; nur eine hat das richtige Register.",
    },
  },

  {
    id: "lueckentext-frei",
    part: "bausteine",
    title: "Lückentext ohne Vorgaben",
    en: "Open gap fill",
    levels: ["B1", "B2", "C1"],
    where: "telc B2 «Sprachbausteine, Teil 2» (Aufgaben 31–40: 10 Lücken, aber 15 Wörter zur Auswahl) · Goethe C1 «Lesen» (Wortschatzteil)",
    time: "ca. 60 Sek. pro Lücke",
    signal: "Text mit Lücken, aber ohne Auswahlliste — oder mit einer langen Wortliste, aus der mehr Wörter angeboten werden als Lücken vorhanden sind.",
    sample: {
      task: "Ergänzen Sie das fehlende Wort. Pro Lücke nur ein Wort.",
      body: "Der Antrag konnte nicht bearbeitet werden, ___ die Unterlagen unvollständig waren.",
      options: ["Nur EIN Wort pro Lücke — hier entscheidet die Verbstellung am Satzende."],
    },
    trick: {
      name: "Erst die Wortart bestimmen, dann das Wort suchen",
      steps: [
        "Frag nicht «welches Wort?», sondern «welche Wortart?». Das schließt 90 % der Kandidaten aus.",
        "Steht das Verb am Satzende? → subordinierender Konnektor (weil, da, obwohl, damit).",
        "Steht das Verb direkt nach der Lücke? → Adverbialkonnektor (deshalb, trotzdem, dennoch).",
        "Fehlt ein Artikel oder eine Endung? → Kasus vom Auslöser links ableiten.",
        "Setze dein Wort ein und lies den ganzen Satz noch einmal. Klingt der Rhythmus falsch, ist es falsch.",
      ],
    },
    focus: [
      "Die Verbposition rechts von der Lücke ist die verlässlichste Information im ganzen Satz.",
      "Bei Wortlisten: erst alle sicheren Lücken füllen, die Reste bleiben für die unsicheren übrig.",
      "Ein-Wort-Regel ernst nehmen — «weil dass» oder «trotzdem aber» kostet den Punkt.",
    ],
    traps: [
      "Distraktoren in der Wortliste: es gibt immer mehr Wörter als Lücken. Übrig bleiben heißt nicht falsch geraten.",
      "«weil» und «denn» sind bedeutungsgleich, aber syntaktisch verschieden. Die Verbstellung entscheidet.",
      "Bei Kasusendungen zählt das Genus des Nomens, nicht seine Bedeutung.",
    ],
    compare: {
      task: "___ es regnete, gingen wir spazieren.",
      wrong: "Trotzdem es regnete, gingen wir spazieren.",
      right: "Obwohl es regnete, gingen wir spazieren.",
      why: "«regnete» steht am Ende des Teilsatzes → es muss ein subordinierender Konnektor sein. «trotzdem» ist ein Adverb und verlangt Verb an Position 2: «Es regnete, trotzdem gingen wir spazieren.»",
    },
    rules: ["R-070", "R-069", "R-062"],
    modules: ["nebensatz", "konnektoren-b2"],
    byLevel: {
      B1: "Konnektoren, Präpositionen, Reflexivpronomen. Die Lücken sind über den Text verteilt und voneinander unabhängig.",
      B2: "Zweiteilige Konnektoren (nicht nur … sondern auch, zwar … aber). Die zweite Lücke hängt von der ersten ab.",
      C1: "Präpositionen in nominalen Wendungen, Partikeln, Funktionsverben. Der Text ist ein Fachartikel, kein Brief.",
    },
  },

  {
    id: "wortbildung",
    part: "bausteine",
    title: "Wortbildung",
    en: "Word formation",
    levels: ["B1", "B2", "C1"],
    where: "telc · ÖSD · Grammatikteil vieler Einstufungstests",
    time: "ca. 40 Sek. pro Lücke",
    signal: "Hinter der Lücke steht ein Wort in Klammern — meist ein Verb oder Adjektiv, das umgeformt werden muss.",
    sample: {
      task: "Bilden Sie aus dem Wort in Klammern die passende Form.",
      body: "Die ___ (entscheiden) des Gerichts wurde gestern veröffentlicht.",
      options: ["→ Entscheidung (Nomen, feminin, weil -ung)"],
    },
    trick: {
      name: "Die Lücke sagt dir die Wortart, das Suffix sagt dir das Genus",
      steps: [
        "Steht ein Artikel vor der Lücke? → Nomen. Steht ein Nomen dahinter? → Adjektiv. Steht sonst nichts? → Verb.",
        "Nomen: -ung, -heit, -keit, -schaft, -ion sind IMMER feminin. -er, -ismus, -ling immer maskulin. -chen, -lein, -um immer neutrum.",
        "Adjektiv: Endung aus dem Artikelwort links ableiten — nicht aus dem Nomen rechts.",
        "Negation prüfen: verlangt der Satz un-, in- oder -los?",
        "Zum Schluss den Umlaut prüfen: Kraft → kräftig, Angst → ängstlich.",
      ],
    },
    focus: [
      "Suffix → Genus ist eine 100-%-Regel. Sie ist geschenkt, wenn du die Liste kannst.",
      "Nominalisierte Verben: Infinitiv als Neutrum (das Lesen) vs. -ung als Prozessnomen (die Lesung).",
      "Adjektiv aus Nomen: -lich, -ig, -isch, -bar, -haft — jedes mit eigener Bedeutungsnuance.",
    ],
    traps: [
      "Das Wort in Klammern steht im Infinitiv. Wer es unverändert abschreibt, verliert den Punkt garantiert.",
      "Nach der Umformung braucht das neue Wort oft noch eine Kasusendung. Zwei Schritte, nicht einer.",
      "arbeiten → der Arbeiter (Person), die Arbeit (Sache), die Bearbeitung (Prozess). Der Satz entscheidet.",
    ],
    compare: {
      task: "Die ___ (entscheiden) war richtig.",
      wrong: "Die Entscheiden war richtig.",
      right: "Die Entscheidung war richtig.",
      why: "«die» verlangt ein feminines Nomen. Der nominalisierte Infinitiv «das Entscheiden» ist neutrum und passt nicht zum Artikel — das Suffix -ung liefert die feminine Form.",
    },
    rules: ["R-001", "R-099", "R-020"],
    modules: ["nominalisierung", "adjektiv"],
    byLevel: {
      B1: "Nomen aus Verben (-ung), Adjektive aus Nomen (-ig, -lich). Die Grundwörter sind Alltagswortschatz.",
      B2: "Negationspräfixe und Bedeutungsunterschiede: unverständlich vs. missverständlich vs. unverständig.",
      C1: "Ableitungen im Nominalstil, oft mit Fugenelement: Verwaltung + s + Vorschrift. Fehlendes Fugen-s kostet den Punkt.",
    },
  },

  {
    id: "umformung",
    part: "bausteine",
    title: "Satzumformung",
    en: "Sentence transformation",
    levels: ["B1", "B2", "C1"],
    where: "Goethe · telc · ÖSD — der klassische Grammatikteil im schriftlichen Ausdruck",
    time: "ca. 90 Sek. pro Satz",
    signal: "«Formen Sie um», «Schreiben Sie den Satz mit …», «Drücken Sie anders aus» — der Inhalt bleibt, die Struktur wechselt.",
    sample: {
      task: "Formen Sie ins Passiv um.",
      body: "Der Techniker repariert das Gerät.",
      options: ["→ Das Gerät wird (von dem Techniker) repariert."],
    },
    trick: {
      name: "Vier Schritte, immer dieselben — Rollen, Rahmen, Rest, Rückprobe",
      steps: [
        "ROLLEN: Wer tut? Wem passiert es? Markiere Subjekt und Objekt im Original.",
        "RAHMEN: Schreibe zuerst nur das Gerüst der Zielstruktur hin (wird … + Partizip II / hätte … + Partizip II + können).",
        "REST: Setze die Rollen in den Rahmen. Akkusativobjekt wird Nominativ-Subjekt, das alte Subjekt wird «von + DAT».",
        "RÜCKPROBE: Zeitform vergleichen. Präsens bleibt Präsens, Perfekt bleibt Vergangenheit — die Umformung darf die Zeit nicht verschieben.",
      ],
    },
    focus: [
      "Die Zeitform ist die Nummer-1-Fehlerquelle. Sie wandert in das Hilfsverb, nicht ins Partizip.",
      "Modalverb im Original? Dann bleibt es im Passiv erhalten: «muss repariert werden».",
      "Dativobjekte werden im Passiv NICHT zum Subjekt: «Mir wurde geholfen», nie «Ich wurde geholfen».",
    ],
    traps: [
      "Verben ohne Akkusativobjekt haben kein persönliches Passiv (helfen, gratulieren, folgen).",
      "Bei Nominalisierung geht der Handelnde oft verloren. Wenn er zur Aussage gehört, muss er als «durch/seitens» zurück.",
      "Konjunktiv-II-Vergangenheit: immer «hätte/wäre + Partizip II», nie «würde + Partizip II».",
    ],
    compare: {
      task: "Man hat das Gerät repariert. → Passiv",
      wrong: "Das Gerät wird repariert worden.",
      right: "Das Gerät ist repariert worden.",
      why: "Perfekt Passiv = sein + Partizip II + worden. «wird» wäre Präsens und würde die Zeitform des Originals verändern.",
    },
    rules: ["R-092", "R-095", "R-089", "R-099"],
    modules: ["passiv", "passiv-b2", "konjunktiv2-vergangenheit", "nominalisierung"],
    byLevel: {
      B1: "Aktiv ↔ Passiv im Präsens und Präteritum. Konjunktiv II der Höflichkeit. Hauptsatz ↔ Nebensatz mit weil/obwohl.",
      B2: "Passiv mit Modalverben, indirekte Rede im Konjunktiv I, Nominalisierung ↔ Verbalisierung von Nebensätzen.",
      C1: "Passiversatzformen (sein + zu, lassen + sich, -bar), erweiterte Partizipialattribute ↔ Relativsatz, Funktionsverbgefüge.",
    },
  },

  {
    id: "konnektoren-einsetzen",
    part: "bausteine",
    title: "Konnektoren einsetzen",
    en: "Connector placement",
    levels: ["B1", "B2", "C1"],
    where: "Sprachbausteine · Schreiben (Bewertungskriterium Kohärenz)",
    time: "ca. 45 Sek. pro Lücke",
    signal: "Zwei Aussagen sollen verbunden werden — oder eine Lücke steht genau zwischen zwei Teilsätzen.",
    sample: {
      task: "Verbinden Sie die Sätze mit dem vorgegebenen Konnektor.",
      body: "Das Projekt wurde teurer. Der Zeitplan hielt. (zwar … aber)",
      options: ["→ Das Projekt wurde zwar teurer, aber der Zeitplan hielt."],
    },
    trick: {
      name: "Konnektoren nach Verbposition sortieren, nicht nach Bedeutung",
      steps: [
        "Klasse 0 — und, aber, denn, oder, sondern: ändern gar nichts. Verb bleibt an Position 2.",
        "Klasse 1 — deshalb, trotzdem, dennoch, außerdem: besetzen selbst Position 1, Verb rutscht direkt dahinter.",
        "Klasse END — weil, obwohl, damit, da, während: Verb ganz ans Ende des Teilsatzes.",
        "Klasse PRÄP — wegen, trotz, während (+ Nomen): kein Teilsatz, sondern Kasus. Kein Verb dahinter.",
        "Wähle die Bedeutung, prüfe dann die Klasse und baue den Satz von der Verbposition her.",
      ],
    },
    focus: [
      "Jedes Bedeutungspaar hat vier Formen: weil / deshalb / wegen / denn. Wer alle vier kann, hat den Punkt immer.",
      "Im Schreiben zählt Vielfalt: dreimal «und» hintereinander kostet Punkte bei Kohärenz.",
      "Komma vor jedem Nebensatz — auch vor «dass» und vor Infinitivgruppen mit «um … zu».",
    ],
    traps: [
      "«trotzdem» ist Adverb, «obwohl» ist Konjunktion. Die beiden werden am häufigsten vertauscht.",
      "«während» ist beides: mit Nebensatz temporal/adversativ, mit Genitiv präpositional.",
      "«denn» leitet keinen Nebensatz ein — das Verb bleibt an Position 2.",
    ],
    compare: {
      task: "Er kam zu spät. Er hatte den Termin notiert.",
      wrong: "Obwohl er hatte den Termin notiert, kam er zu spät.",
      right: "Obwohl er den Termin notiert hatte, kam er zu spät.",
      why: "«obwohl» gehört zur Klasse END: das finite Verb «hatte» muss ans Ende des Nebensatzes wandern, hinter das Partizip.",
    },
    rules: ["R-068", "R-069", "R-070", "R-104", "R-103"],
    modules: ["nebensatz", "konnektoren-b2", "konnektoren-c1"],
    byLevel: {
      B1: "weil, obwohl, damit, wenn, deshalb, trotzdem. Ein Konnektor pro Satz, klare Bedeutung.",
      B2: "Zweiteilige Konnektoren und Präpositionalvarianten: nicht nur … sondern auch, je … desto, anstatt … zu.",
      C1: "Formelles Register: infolgedessen, gleichwohl, sofern, zumal, insofern als. Bedeutung fein, Register formal.",
    },
  },

  {
    id: "adjektivendungen",
    part: "bausteine",
    title: "Adjektivendungen ergänzen",
    en: "Adjective endings",
    levels: ["A2", "B1", "B2", "C1"],
    where: "Sprachbausteine · fast jede Grammatikprüfung, auf jedem Niveau",
    time: "ca. 20 Sek. pro Endung",
    signal: "Adjektive stehen ohne Endung im Text, meist mit einem Unterstrich: «ein neu___ Auto».",
    sample: {
      task: "Ergänzen Sie die Endungen.",
      body: "Wir suchen einen zuverlässig___ Mitarbeiter mit gut___ Deutschkenntnissen.",
      options: ["→ zuverlässigen (ein-Wort, AKK mask.) · guten (ohne Artikel, DAT Pl.)"],
    },
    trick: {
      name: "Erst den Artikel anschauen, nie das Adjektiv",
      steps: [
        "Frage 1: Zeigt das Artikelwort schon Kasus und Genus? (der, die, das, diesen, dem …)",
        "JA → schwach: -e im Nominativ Sg. und Akkusativ Sg. neutrum/feminin, überall sonst -en.",
        "NEIN, weil ein-Wort ohne Endung (ein, ein, mein) → das Adjektiv übernimmt: -er (mask. NOM), -es (neutr. NOM/AKK).",
        "GAR KEIN Artikel → stark: das Adjektiv trägt die volle Artikelendung (gutem Wein, guter Wein, gute Weine).",
        "Merksatz für die Faulen: Wenn -en möglich ist, ist -en fast immer richtig. Über 70 % aller Endungen sind -en.",
      ],
    },
    focus: [
      "Nur fünf Zellen im ganzen System sind nicht -en. Lerne die fünf, rate den Rest.",
      "Bei mehreren Adjektiven hintereinander bekommen alle dieselbe Endung.",
      "Nach «viele, einige, mehrere, wenige» steht die starke Endung — nicht die schwache.",
    ],
    traps: [
      "«ein» ohne Endung ist die Falle: dort muss das Adjektiv die Arbeit machen (ein neuer Wagen, nicht ein neue Wagen).",
      "Dativ Plural: das Nomen bekommt zusätzlich ein -n (mit guten Freunden).",
      "Nach «alle» steht schwach (alle guten), nach «viele» stark (viele gute). Der Klassiker.",
    ],
    compare: {
      task: "Das ist ___ (neu) Wagen.",
      wrong: "Das ist ein neue Wagen.",
      right: "Das ist ein neuer Wagen.",
      why: "«ein» trägt bei maskulinem Nominativ keine Endung. Die Information «maskulin + Nominativ» muss also das Adjektiv liefern: -er.",
    },
    rules: ["R-020", "R-021", "R-022", "R-005"],
    modules: ["adjektiv", "kasus"],
    byLevel: {
      A2: "Nominativ und Akkusativ, bestimmter und unbestimmter Artikel. Ein Adjektiv pro Nomen.",
      B1: "Alle vier Kasus inkl. Genitiv, dazu Possessivartikel und «kein».",
      B2: "Nullartikel im Plural, Mengenwörter, Adjektive nach Partizipien, komparative Formen mit Endung.",
      C1: "Erweiterte Attribute: «der seit Wochen unbearbeitet gebliebene Antrag» — Endung am Ende einer langen Kette.",
    },
  },

  {
    id: "praeposition-kasus",
    part: "bausteine",
    title: "Präposition und Kasus",
    en: "Prepositions & case",
    levels: ["A2", "B1", "B2", "C1"],
    where: "Sprachbausteine · Lückentexte auf allen Niveaus",
    time: "ca. 25 Sek. pro Lücke",
    signal: "Eine Präposition steht schon da und die Artikelendung fehlt — oder umgekehrt.",
    sample: {
      task: "Ergänzen Sie Artikel und Endung.",
      body: "Ich hänge das Bild an ___ Wand. — Das Bild hängt an ___ Wand.",
      options: ["→ an die Wand (wohin? AKK) · an der Wand (wo? DAT)"],
    },
    trick: {
      name: "Wechselpräpositionen: Wohin heißt Akkusativ, Wo heißt Dativ",
      steps: [
        "Feste Akkusativpräpositionen auswendig: durch, für, gegen, ohne, um, bis, entlang.",
        "Feste Dativpräpositionen auswendig: aus, bei, mit, nach, seit, von, zu, gegenüber.",
        "Die neun Wechselpräpositionen (an, auf, hinter, in, neben, über, unter, vor, zwischen) fragst du ab: Wohin? → AKK. Wo? → DAT.",
        "Testtrick: Steht ein Bewegungsverb mit Richtung (legen, stellen, hängen, gehen)? → Akkusativ. Steht ein Zustandsverb (liegen, stehen, hängen, sein)? → Dativ.",
        "Genitivpräpositionen (wegen, trotz, während, aufgrund) gehören ins formelle Register, nicht in die E-Mail an Freunde.",
      ],
    },
    focus: [
      "Die festen Listen sind reine Auswendigarbeit und liefern die sichersten Punkte der ganzen Prüfung.",
      "Verschmelzungen erkennen: im = in dem (DAT), ins = in das (AKK). Die Verschmelzung verrät den Kasus.",
      "Bei Präpositionalverben zählt nicht die Bedeutung der Präposition, sondern das Verb (warten auf, denken an).",
    ],
    traps: [
      "«nach» ist Dativ, aber «nach Hause» ist Richtung — die Liste sticht die Logik.",
      "«in» + Land: in die Schweiz (AKK, Richtung), in der Schweiz (DAT, Ort). Bei Städten kein Artikel.",
      "Englisch-Interferenz: warten auf (nicht für), denken an (nicht über), sich interessieren für (nicht in).",
    ],
    compare: {
      task: "Ich stelle die Flasche ___ Tisch.",
      wrong: "Ich stelle die Flasche auf dem Tisch.",
      right: "Ich stelle die Flasche auf den Tisch.",
      why: "«stellen» ist ein Richtungsverb: Wohin stelle ich sie? → Akkusativ. Nur «Die Flasche steht auf dem Tisch» (Wo?) nimmt Dativ.",
    },
    rules: ["R-081", "R-082", "R-083", "R-084", "R-085"],
    modules: ["praep", "verbpraep", "genitiv"],
    byLevel: {
      A2: "Feste Listen und Wechselpräpositionen mit konkreten Orten. Verschmelzungen im, ins, am, zum.",
      B1: "Präpositionalverben und da-/wo-Komposita: Ich warte darauf, dass … · Worauf wartest du?",
      B2: "Genitivpräpositionen, präpositionale Nominalisierungen (im Hinblick auf, in Bezug auf).",
      C1: "Präpositionen in festen Funktionsverbgefügen: in Anspruch nehmen, zur Verfügung stellen, unter Beweis stellen.",
    },
  },

  {
    id: "zeitformen",
    part: "bausteine",
    title: "Zeitformen einsetzen",
    en: "Tense selection",
    levels: ["A2", "B1", "B2", "C1"],
    where: "Sprachbausteine · Schreiben (Erzählung, Bericht)",
    time: "ca. 40 Sek. pro Lücke",
    signal: "Ein Verb steht im Infinitiv in Klammern und muss konjugiert werden — oder ein Text springt zwischen Zeitebenen.",
    sample: {
      task: "Setzen Sie das Verb in die passende Zeitform.",
      body: "Nachdem er den Vertrag ___ (unterschreiben), verließ er das Büro.",
      options: ["→ unterschrieben hatte (Plusquamperfekt — Vorzeitigkeit zu «verließ»)"],
    },
    trick: {
      name: "Das Zeitwort im Satz sucht die Zeitform aus, nicht dein Gefühl",
      steps: [
        "Suche das Signalwort: nachdem → Plusquamperfekt, bevor → gleiche Zeit, seit → Präsens, in zwei Jahren → Futur I.",
        "Kein Signalwort? Dann bestimmt die Zeitform des Nachbarsatzes, wohin du musst.",
        "Perfekt bauen: haben oder sein? Bewegung mit Ortswechsel und Zustandsänderung nehmen sein, alles andere haben.",
        "Partizip II prüfen: trennbares Verb → -ge- in die Mitte (abgeholt). Untrennbar oder auf -ieren → gar kein ge- (besucht, studiert).",
        "In Erzähltexten: Präteritum ist die Erzählzeit, Plusquamperfekt der Rückblick. Nicht mischen.",
      ],
    },
    focus: [
      "«nachdem» + Plusquamperfekt ist die häufigste Zeitformenaufgabe ab B1 überhaupt.",
      "Gesprochene Vergangenheit = Perfekt, geschriebene Vergangenheit = Präteritum. Bei sein/haben/Modalverben immer Präteritum.",
      "Futur I wird im Deutschen selten für Zukunft benutzt — meist reicht Präsens + Zeitangabe.",
    ],
    traps: [
      "«Ich bin nach Berlin gefahren» (sein, Ortswechsel) vs. «Ich habe das Auto gefahren» (haben, mit Objekt).",
      "Bei Modalverben im Perfekt steht der doppelte Infinitiv: «Ich habe arbeiten müssen», nicht «gemusst».",
      "Futur II drückt Vermutung über Vergangenes aus: «Er wird es vergessen haben» heißt nicht Zukunft.",
    ],
    compare: {
      task: "Nachdem sie gegessen ___, ging sie los.",
      wrong: "Nachdem sie gegessen hat, ging sie los.",
      right: "Nachdem sie gegessen hatte, ging sie los.",
      why: "«nachdem» erzwingt Vorzeitigkeit. Der Hauptsatz steht im Präteritum, also muss der Nebensatz eine Stufe zurück: Plusquamperfekt.",
    },
    rules: ["R-050", "R-051", "R-052", "R-053", "R-054"],
    modules: ["zeiten", "temporal", "futur"],
    byLevel: {
      A2: "Präsens, Perfekt, Präteritum von sein/haben/Modalverben. Trennbare Verben im Partizip.",
      B1: "Plusquamperfekt mit nachdem, Futur I, Zeitenfolge über mehrere Sätze.",
      B2: "Futur II, Zeitverschiebung in der indirekten Rede, konsequentes Präteritum im Bericht.",
      C1: "Zeitstufen im Nominalstil: «nach Abschluss der Prüfung» statt «nachdem die Prüfung abgeschlossen worden war».",
    },
  },

  // ========================================================== LESEVERSTEHEN =
  {
    id: "zuordnung",
    part: "lesen",
    title: "Zuordnung — Anzeigen und Situationen",
    en: "Matching ads to situations",
    levels: ["A2", "B1", "B2"],
    where: "Goethe A2 «Lesen, Teil 4» (6 Anzeigen, 5 Situationen, «X» wenn keine passt) · Goethe B1 «Lesen, Teil 3» (10 Anzeigen, 7 Situationen) · telc «Leseverstehen, Teil 2»",
    time: "ca. 12 Min. für 5–7 Situationen · zuerst Situationen, dann Anzeigen",
    signal: "Links Personen mit Wünschen, rechts Anzeigen mit Buchstaben. Es gibt mehr Anzeigen als Personen — bei Goethe A2 ist «X» (keine passt) eine gültige Antwort.",
    sample: {
      task: "Welche Anzeige passt zu welcher Person? Eine Anzeige passt zu keiner Person.",
      body: "Person 3: sucht einen Sprachkurs am Abend, höchstens zweimal pro Woche, in der Nähe der Innenstadt.",
      options: ["Anzeige D: Intensivkurs, Mo–Fr 9–13 Uhr, Stadtrand → passt NICHT (Zeit + Ort falsch)"],
    },
    trick: {
      name: "Aus jeder Situation zwei bis drei harte Kriterien machen, bevor du eine Anzeige liest",
      steps: [
        "Lies nur die Personen. Unterstreiche pro Person 2–3 harte Kriterien: Zeit, Ort, Preis, Zielgruppe.",
        "Schreibe die Kriterien als Stichworte an den Rand: «abends · 2×/Woche · Zentrum».",
        "Jetzt erst die Anzeigen überfliegen und gegen die Kriterien prüfen — nicht lesen, prüfen.",
        "Eine Anzeige scheidet aus, sobald EIN hartes Kriterium verletzt ist. Nicht weiterlesen, weiterblättern.",
        "Zum Schluss die eindeutigen Treffer eintragen, dann die restlichen Personen mit den restlichen Anzeigen abgleichen.",
      ],
    },
    focus: [
      "Zahlen, Uhrzeiten und Ortsangaben sind die Entscheider. Adjektive und Werbesprache sind Füllmaterial.",
      "Ausschluss ist schneller als Bestätigung: Ein Widerspruch reicht, ein Treffer braucht Beweise.",
      "Die überzählige Anzeige ist immer die, die auf den ersten Blick zu allen passt.",
    ],
    traps: [
      "Die Anzeige wiederholt ein Wort aus der Situation wörtlich — genau die ist meist die Falle.",
      "«ab 18 Uhr» erfüllt «am Abend», «bis 18 Uhr» nicht. Präpositionen entscheiden.",
      "Zeit reicht nicht für alle Anzeigen. Wer alles liest, verliert die letzten zwei Aufgaben.",
    ],
    compare: {
      task: "Person sucht einen Kurs «am Wochenende».",
      wrong: "Anzeige B: «Sprachkurs — flexible Termine, auch freitags.»",
      right: "Anzeige F: «Kompaktkurs, samstags 10–16 Uhr.»",
      why: "Freitag ist kein Wochenende. «Flexibel» klingt passend, ist aber keine Zusage — die konkrete Angabe schlägt die vage.",
    },
    rules: [],
    modules: [],
    byLevel: {
      A2: "Kurze Anzeigen aus dem Alltag: Wohnung, Kurs, Ausflug. Kriterien stehen wörtlich im Text.",
      B1: "Längere Texte, Kriterien sind umschrieben statt genannt. Zwei Anzeigen passen fast.",
      B2: "Meinungen und Stellenprofile statt Kleinanzeigen. Die Unterscheidung läuft über Nuancen im Register.",
    },
  },

  {
    id: "lesen-mc",
    part: "lesen",
    title: "Multiple Choice zum Text",
    en: "Reading comprehension MC",
    levels: ["A2", "B1", "B2", "C1"],
    where: "Goethe A2 «Lesen, Teil 1/3» (je 5 Fragen) · Goethe B1 «Lesen, Teil 2» (2 Presseartikel, 6 Fragen) und «Teil 5» (Hausordnung, 4 Fragen) · Goethe B2 «Lesen, Teil 3» (Zeitungsartikel, 6 Fragen, ca. 12 Min.)",
    time: "ca. 2 Min. pro Frage, inkl. Textstelle suchen",
    signal: "Ein längerer Text, danach Fragen mit je drei Antwortoptionen a/b/c.",
    sample: {
      task: "Was sagt der Autor über die Vier-Tage-Woche?",
      body: "«Die Produktivität sank nicht, obwohl die Arbeitszeit um 20 % reduziert wurde.»",
      options: ["a) Die Produktivität stieg deutlich.", "b) Die Produktivität blieb ungefähr gleich. ✓", "c) Die Produktivität sank leicht."],
    },
    trick: {
      name: "Fragen vor dem Text lesen — und im Text nach der Paraphrase suchen, nicht nach dem Wort",
      steps: [
        "Fragen zuerst lesen, Antwortoptionen NICHT. Sonst suchst du unbewusst nach den falschen.",
        "Die Fragen folgen der Textreihenfolge. Frage 3 liegt zwischen den Stellen zu Frage 2 und 4.",
        "Im Text die Stelle finden, die Frage beantwortet, und sie unterstreichen.",
        "Jetzt erst die Optionen lesen und jede gegen die unterstrichene Stelle halten.",
        "Die richtige Option ist eine Umformulierung deiner Textstelle — nie eine wörtliche Kopie.",
      ],
    },
    focus: [
      "Jede richtige Antwort hat einen konkreten Beleg im Text. Findest du keinen, ist es die falsche Option.",
      "Wörter wie «immer, nie, alle, ausschließlich» in einer Option sind fast immer zu stark.",
      "Bei Meinungsfragen: Wessen Meinung? Der Autor, der Zitierte und der Kritiker sagen Verschiedenes.",
    ],
    traps: [
      "Wortwiederholung als Köder: die Option, die die meisten Wörter aus dem Text übernimmt, ist meist falsch.",
      "Halbwahrheit: die Option stimmt inhaltlich, steht aber so nicht im Text. Ohne Beleg keine Antwort.",
      "Weltwissen abschalten. Gefragt ist nicht, was stimmt, sondern was im Text steht.",
    ],
    compare: {
      task: "Text: «Viele Betriebe erwägen das Modell, eingeführt haben es bisher wenige.»",
      wrong: "b) Die meisten Betriebe haben das Modell eingeführt.",
      right: "c) Das Modell wird diskutiert, aber selten umgesetzt.",
      why: "«erwägen» ≠ «eingeführt haben». Die falsche Option nutzt dieselben Wörter, verschiebt aber den Zustand von Absicht zu Tatsache.",
    },
    rules: [],
    modules: ["textkohaesion"],
    byLevel: {
      A2: "Kurze Alltagstexte, Fragen zu konkreten Details. Antwort steht nah am Wortlaut.",
      B1: "Zeitungsartikel und Blogs. Die Antwort ist umschrieben, aber die Textstelle bleibt eindeutig.",
      B2: "Kommentare und Fachtexte. Es geht um Haltung und Absicht des Autors, nicht um Fakten.",
      C1: "Wissenschaftliche und essayistische Texte. Ironie, Einschränkung und implizite Wertung müssen erkannt werden.",
    },
  },

  {
    id: "richtig-falsch",
    part: "lesen",
    title: "Richtig / Falsch / Steht nicht im Text",
    en: "True / False / Not given",
    levels: ["A2", "B1", "B2"],
    where: "Goethe B1 «Lesen, Teil 1» (Blogtext, 6 Aussagen) und «Hören, Teil 3» (7 Aussagen) · telc C1 Hochschule «Leseverstehen, Teil 3» (11 Aufgaben richtig/falsch/nicht im Text, 22 Punkte)",
    time: "ca. 90 Sek. pro Aussage",
    signal: "Aussagen zum Text, dazu zwei oder drei Kästchen zum Ankreuzen.",
    sample: {
      task: "Richtig oder falsch?",
      body: "Text: «Das Museum öffnet dienstags bis sonntags.» — Aussage: «Das Museum ist montags geschlossen.»",
      options: ["→ Richtig (logische Folge aus der Öffnungsliste)"],
    },
    trick: {
      name: "Drei Fragen in fester Reihenfolge — steht es da? sagt es dasselbe? sagt es das Gegenteil?",
      steps: [
        "Finde die Textstelle zur Aussage. Keine Stelle gefunden → «steht nicht im Text», falls es diese Option gibt.",
        "Stelle gefunden: Sagt der Text dasselbe mit anderen Worten? → richtig.",
        "Sagt der Text das Gegenteil oder eine andere Zahl, Zeit oder Person? → falsch.",
        "Achte auf Verneinung und Einschränkung: «nur», «kaum», «nicht mehr» drehen die Aussage.",
        "Bei zwei Optionen (richtig/falsch) gibt es kein «weiß nicht» — im Zweifel nach dem stärkeren Beleg entscheiden.",
      ],
    },
    focus: [
      "Zahlen, Namen, Zeiten und Mengenangaben sind die häufigsten Kippstellen.",
      "«steht nicht im Text» heißt: plausibel, aber unbelegt. Es heißt nicht «falsch».",
      "Quantoren vergleichen: einige ≠ viele ≠ alle. Der Unterschied ist die ganze Aufgabe.",
    ],
    traps: [
      "Der Text sagt «kann», die Aussage sagt «muss». Modalität ist der beliebteste Dreh.",
      "Die Aussage stimmt in der Welt, steht aber nicht im Text — trotzdem nicht «richtig».",
      "Zeitliche Verschiebung: der Text spricht über Pläne, die Aussage über Erledigtes.",
    ],
    compare: {
      task: "Text: «Der Kurs kann online besucht werden.» — Aussage: «Der Kurs findet online statt.»",
      wrong: "Richtig",
      right: "Falsch",
      why: "«kann besucht werden» ist eine Möglichkeit, «findet statt» eine Tatsache. Das Modalverb ist der ganze Unterschied.",
    },
    rules: ["R-034", "R-066"],
    modules: ["modalverben"],
    byLevel: {
      A2: "Kurze Texte, Aussagen fast wörtlich. Meist nur richtig/falsch ohne dritte Option.",
      B1: "Die dritte Option «steht nicht im Text» kommt dazu und ist die häufigste Fehlerquelle.",
      B2: "Aussagen paraphrasieren die Textstelle vollständig; entschieden wird über Modalität und Quantoren.",
    },
  },

  {
    id: "textrekonstruktion",
    part: "lesen",
    title: "Textrekonstruktion — Sätze einsetzen",
    en: "Text reconstruction",
    levels: ["B2", "C1"],
    where: "Goethe B2 «Lesen, Teil 2» (Magazinartikel, 6 Satzlücken, ca. 12 Min.) · telc C1 Hochschule «Leseverstehen, Teil 1» (Textrekonstruktion, 6 Zuordnungen, 12 Punkte)",
    time: "ca. 12–15 Min. · Kohäsionssignale statt Inhalt lesen",
    signal: "Aus einem Text wurden Sätze oder Absätze entfernt; sie stehen ungeordnet daneben, meist einer zu viel.",
    sample: {
      task: "Welcher Satz gehört in Lücke 2?",
      body: "… Die Kosten stiegen um ein Drittel. ___ Deshalb wurde das Projekt verschoben.",
      options: ["→ Ein Satz, der die Kosten aufgreift UND zur Folge im nächsten Satz überleitet."],
    },
    trick: {
      name: "Nicht den Inhalt lesen, sondern die Brücken links und rechts der Lücke",
      steps: [
        "Lies den Satz VOR der Lücke und den Satz NACH der Lücke. Nur diese zwei.",
        "Suche Rückverweise im Kandidatensatz: dieser, jener, dabei, dadurch, solche — sie zeigen nach links.",
        "Suche Vorverweise: folgende, dazu, deshalb, damit — sie zeigen nach rechts.",
        "Prüfe die thematische Kette: Ein neues Thema wird zuerst mit unbestimmtem Artikel eingeführt, danach mit bestimmtem wieder aufgenommen.",
        "Setze deinen Kandidaten ein und lies die drei Sätze am Stück. Stolpert es, ist es der falsche.",
      ],
    },
    focus: [
      "Pronomen und Artikel sind die stärksten Beweise: «das Verfahren» setzt voraus, dass ein Verfahren schon genannt wurde.",
      "Numerus und Genus von Pronomen müssen zum Bezugswort links passen — reine Formprüfung, kein Verständnis nötig.",
      "Eine Lücke sicher zu haben, halbiert die Kandidaten für alle anderen.",
    ],
    traps: [
      "Der überzählige Satz passt thematisch perfekt, hat aber keinen Anschluss nach links oder rechts.",
      "Zwei Kandidaten passen inhaltlich; nur einer hat das richtige Rückverweis-Pronomen.",
      "Reihenfolge der Zeitangaben beachten: «zunächst … später … schließlich» ist eine Kette, keine Auswahl.",
    ],
    compare: {
      task: "Vorher: «Zwei Studien wurden veröffentlicht.» Lücke: ___",
      wrong: "«Diese Studie belegt den Zusammenhang.»",
      right: "«Beide Studien belegen den Zusammenhang.»",
      why: "Links stehen zwei Studien im Plural. Ein Singular-Rückverweis («diese Studie») hat kein passendes Bezugswort — reine Formprüfung entscheidet.",
    },
    rules: ["R-008", "R-071", "R-103"],
    modules: ["textkohaesion", "relativsatz", "konnektoren-c1"],
    byLevel: {
      B2: "Einzelne Sätze in einem journalistischen Text. Kohäsionssignale sind deutlich markiert.",
      C1: "Ganze Absätze in einem Fachtext. Die Verbindung läuft über Argumentationsschritte, nicht über Pronomen allein.",
    },
  },

  {
    id: "meinungen-zuordnen",
    part: "lesen",
    title: "Meinungen zuordnen",
    en: "Who says what",
    levels: ["B1", "B2", "C1"],
    where: "Goethe B2 «Lesen, Teil 1» (Forum mit 4 Sprechern, 9 Zuordnungen, ca. 18 Min.) und «Teil 4» (8 Meinungen zu Überschriften) · Goethe B1 «Lesen, Teil 4» (7 Leserkommentare, ja/nein) · Goethe B1/B2 «Hören, Teil 4» (Wer sagt was)",
    time: "ca. 12–18 Min. für 4 Personen",
    signal: "Mehrere kurze Statements von Personen A–D, dazu Aussagen, die zugeordnet werden müssen.",
    sample: {
      task: "Wer sagt was?",
      body: "Aussage: «Homeoffice schadet der Teamarbeit.»",
      options: ["Person B: «Seit wir verteilt arbeiten, entstehen Ideen seltener spontan.» ✓"],
    },
    trick: {
      name: "Jede Person auf eine Haltung in drei Wörtern reduzieren",
      steps: [
        "Lies alle Statements einmal und schreibe neben jede Person drei Wörter: «pro, aber teuer».",
        "Markiere die Bewertung: positiv, negativ oder eingeschränkt. Mehr brauchst du nicht.",
        "Jetzt die Aussagen: Welche Haltung wird beschrieben? Ordne über die Haltung zu, nicht über das Thema.",
        "Alle Personen sprechen über dasselbe Thema — nur die Bewertung unterscheidet sie.",
        "Bleiben zwei Kandidaten, entscheidet die Einschränkung: Wer sagt «grundsätzlich ja, aber …»?",
      ],
    },
    focus: [
      "Bewertende Adjektive und Modalpartikeln tragen die Haltung, nicht die Fakten.",
      "Einschränkungen (allerdings, freilich, zwar … aber) unterscheiden die zwei ähnlichen Personen.",
      "Eine Person darf für mehrere Aussagen zuständig sein, wenn die Anweisung es nicht ausschließt — Anweisung lesen.",
    ],
    traps: [
      "Zwei Personen sind derselben Meinung und unterscheiden sich nur in der Begründung.",
      "Eine Aussage klingt wie ein wörtliches Zitat aus dem Statement — meistens die falsche Fährte.",
      "Ironie: «Ein wunderbarer Fortschritt — für alle, die kein Team brauchen.» ist Kritik, keine Zustimmung.",
    ],
    compare: {
      task: "Aussage: «X hält Homeoffice grundsätzlich für sinnvoll.»",
      wrong: "Person C: «Homeoffice ist sicher praktisch, löst aber kein einziges Problem.»",
      right: "Person A: «Im Kern ist es richtig, nur die Umsetzung hakt.»",
      why: "«praktisch, aber löst nichts» ist Ablehnung mit Höflichkeitsfloskel. «Im Kern richtig» ist Zustimmung mit Einschränkung — genau das meint «grundsätzlich».",
    },
    rules: ["R-102", "R-104"],
    modules: ["modalpartikeln", "textkohaesion"],
    byLevel: {
      B1: "Vier klare Positionen, deutlich pro oder contra formuliert.",
      B2: "Positionen mit Einschränkungen; die Unterscheidung läuft über «zwar … aber».",
      C1: "Ironie, Understatement und implizite Kritik. Die Haltung steht selten explizit im Text.",
    },
  },

  // ========================================================== HÖRVERSTEHEN ==
  {
    id: "hoeren-ansagen",
    part: "hoeren",
    title: "Kurze Ansagen und Dialoge",
    en: "Short announcements",
    levels: ["A2", "B1", "B2"],
    where: "Goethe B1 «Hören, Teil 1» (5 kurze Texte, 10 Aufgaben, ZWEIMAL) · Goethe B2 «Hören, Teil 1» (5 Gespräche, 10 Aufgaben, nur EINMAL) · telc «Hörverstehen, Teil 1»",
    time: "Pausen zwischen den Items nutzen: Frage n+1 vorlesen, nicht über n grübeln",
    signal: "Fünf unabhängige kurze Aufnahmen: Durchsagen, Anrufbeantworter, kurze Gespräche.",
    sample: {
      task: "Wann fährt der Zug ab?",
      body: "«Der ICE nach Hamburg, planmäßige Abfahrt 14:20 Uhr, fährt heute etwa zehn Minuten später ab.»",
      options: ["a) 14:10   b) 14:20   c) 14:30 ✓"],
    },
    trick: {
      name: "Die Korrektur abwarten — die erste Zahl ist fast nie die Antwort",
      steps: [
        "In der Vorbereitungszeit alle Fragen lesen und das Fragewort markieren: WANN, WO, WIE VIEL, WARUM.",
        "Beim Hören nur auf die eine markierte Information warten. Alles andere ignorieren.",
        "Höre auf Korrektursignale: «eigentlich», «aber heute», «statt», «leider», «doch nicht». Danach kommt die richtige Zahl.",
        "Notiere die Antwort sofort in Stichworten, kreuze in der Pause an.",
        "Verpasst? Sofort abhaken und zur nächsten Frage springen. Ein verlorenes Item darf nicht zwei kosten.",
      ],
    },
    focus: [
      "Zahlen, Uhrzeiten, Gleisnummern und Preise sind der Kern dieses Teils.",
      "Die Ablenkeroptionen werden alle laut ausgesprochen — Hören allein reicht nicht, die Struktur entscheidet.",
      "Der letzte Satz einer Durchsage enthält meistens die gültige Information.",
    ],
    traps: [
      "Alle drei Optionen kommen im Text vor. Nur eine steht nach dem Korrektursignal.",
      "Zahlen im Deutschen sind verdreht: «einundzwanzig» beginnt mit der Eins. Notiere ziffernweise mit.",
      "Wer die letzte Frage in der Pause nicht vorliest, hört den nächsten Text ohne Suchauftrag.",
    ],
    compare: {
      task: "«Wir treffen uns um acht — nein, sagen wir lieber halb neun.»",
      wrong: "8:00",
      right: "8:30",
      why: "«nein, sagen wir lieber» ist das Korrektursignal. Die zuerst genannte Zeit ist als Ablenker gesetzt.",
    },
    rules: [],
    modules: [],
    byLevel: {
      A2: "Sehr kurze Alltagsdurchsagen, langsam gesprochen. Die Information wird oft wiederholt.",
      B1: "Normales Sprechtempo, ein Korrektursignal pro Text, Nebengeräusche.",
      B2: "Mehrere Sprecher, Umgangssprache, Information nur einmal und beiläufig genannt.",
    },
  },

  {
    id: "hoeren-notizen",
    part: "hoeren",
    title: "Notizen ergänzen",
    en: "Note completion",
    levels: ["A2", "B1", "B2"],
    where: "telc C1 Hochschule «Hörverstehen, Teil 3» (Informationstransfer, 10 Lücken, 20 Punkte) · telc B1/B2 · ÖSD · DSH",
    time: "Vorbereitungszeit vollständig für die Wortartenanalyse nutzen",
    signal: "Ein Formular, eine Tabelle oder ein Notizzettel mit Lücken, die beim Hören gefüllt werden.",
    sample: {
      task: "Ergänzen Sie die Notizen.",
      body: "Kursbeginn: ___ · Preis: ___ € · Anmeldung bis: ___",
      options: ["→ Erwartet werden ein Datum, eine Zahl und ein Datum — nicht mehr."],
    },
    trick: {
      name: "Vor dem Hören eintragen, WELCHE ART Information kommt",
      steps: [
        "Schreibe neben jede Lücke, was dort stehen muss: Zahl, Datum, Name, Ort, Substantiv.",
        "So filterst du beim Hören nach Form, nicht nach Bedeutung — das ist viel schneller.",
        "Notiere beim Hören abgekürzt und roh. Rechtschreibung wird nach dem Hören korrigiert.",
        "Namen und Straßen werden buchstabiert. Schreibe die Buchstaben mit, nicht das vermutete Wort.",
        "Nach dem Hören: Groß-/Kleinschreibung und Endungen glätten, solange die Zeit läuft.",
      ],
    },
    focus: [
      "Meist ist nur ein Wort oder eine Zahl gefragt. Ganze Sätze kosten Zeit, keine Punkte.",
      "Die Reihenfolge der Lücken folgt exakt der Reihenfolge im Hörtext.",
      "Bei Datumsangaben auf Wochentag und Datum achten — oft wird nur eins von beiden gefragt.",
    ],
    traps: [
      "Buchstabierte Namen: «V wie Viktor» — der Buchstabe zählt, nicht das Wort.",
      "Preise mit Zusatz: «49 Euro, für Mitglieder 39». Welche Person ist gemeint?",
      "Wer nach dem Hören nichts mehr korrigiert, verschenkt Punkte an der Rechtschreibung.",
    ],
    compare: {
      task: "«Der Kurs kostet 120 Euro, mit Ermäßigung nur 90.» — Gefragt: Preis für Studierende.",
      wrong: "120",
      right: "90",
      why: "Die Lücke fragt nach der ermäßigten Gruppe. Die erste Zahl ist der Normalpreis und dient als Ablenker.",
    },
    rules: [],
    modules: [],
    byLevel: {
      A2: "Formulare mit Name, Uhrzeit, Telefonnummer. Alles wird deutlich buchstabiert.",
      B1: "Kursinformationen, Termine, Bedingungen. Ablenkerzahlen kommen dazu.",
      B2: "Fachliche Notizen aus Vorträgen; die Lücke verlangt oft ein Nomen aus dem Fachwortschatz.",
    },
  },

  {
    id: "hoeren-interview",
    part: "hoeren",
    title: "Interview und Diskussion",
    en: "Interview / discussion",
    levels: ["B1", "B2", "C1"],
    where: "Goethe B2 «Hören, Teil 2» (Radiointerview, 6 Aufgaben, ZWEIMAL) und «Teil 4» (Kurzvortrag, 8 Aufgaben, ZWEIMAL) · Goethe B1 «Hören, Teil 4» (Radiodiskussion, ZWEIMAL) · telc C1 «Hörverstehen, Teil 2»",
    time: "Erster Durchgang: verstehen. Zweiter Durchgang: nur die offenen Items prüfen",
    signal: "Ein langes Gespräch mit zwei bis drei Sprechern, dazu Aussagen oder Multiple Choice in Textreihenfolge.",
    sample: {
      task: "Was sagt die Expertin über den Zeitplan?",
      body: "«Machbar wäre er schon — vorausgesetzt, die Finanzierung stünde rechtzeitig.»",
      options: ["→ Sie hält ihn für möglich, aber nur unter einer Bedingung."],
    },
    trick: {
      name: "Zwei Durchgänge mit verschiedenen Aufgaben — nie zweimal dasselbe tun",
      steps: [
        "Vorbereitungszeit: Fragen lesen, Schlüsselwörter markieren, Sprecher den Rollen zuordnen.",
        "Erster Durchgang: nur ankreuzen, was sicher ist. Unsichere Items mit einem Punkt am Rand markieren.",
        "Zwischen den Durchgängen: markierte Items noch einmal lesen und den Suchauftrag schärfen.",
        "Zweiter Durchgang: gezielt auf die markierten Stellen hören, den Rest ignorieren.",
        "Am Ende jede Zeile ausfüllen. Leer bleiben ist immer null Punkte, Raten ist niemals null.",
      ],
    },
    focus: [
      "Der Gesprächsverlauf folgt der Aufgabenreihenfolge. Wer die Stelle verpasst, weiß trotzdem, wo er ist.",
      "Achte auf Einschränkungen: «eigentlich», «grundsätzlich», «vorausgesetzt» drehen die Aussage ins Bedingte.",
      "Widerspruch zwischen den Sprechern ist der häufigste Prüfinhalt: Wer sagt was?",
    ],
    traps: [
      "Der Interviewer formuliert eine These, die der Gast anschließend ablehnt. Zugeordnet wird oft dem Falschen.",
      "Konjunktiv II im Hörtext: «wäre machbar» ist keine Zusage, sondern eine Bedingung.",
      "Ein Sprecher zitiert eine fremde Meinung, um sie zu widerlegen.",
    ],
    compare: {
      task: "«Ich würde das nicht ausschließen wollen.»",
      wrong: "Sie lehnt es ab.",
      right: "Sie hält es für möglich.",
      why: "Doppelte Abschwächung: «nicht ausschließen» ist Zustimmung in vorsichtiger Form. Der Konjunktiv macht sie höflich, nicht negativ.",
    },
    rules: ["R-088", "R-102"],
    modules: ["konjunktiv2", "modalpartikeln"],
    byLevel: {
      B1: "Alltagsinterview, klare Positionen, deutliche Sprecherwechsel.",
      B2: "Fachdiskussion mit Einschränkungen und Zwischenfragen; Register wechselt.",
      C1: "Wissenschaftlicher Vortrag oder Streitgespräch, hohes Tempo, implizite Wertungen und Ironie.",
    },
  },

  // ============================================================= SCHREIBEN ==
  {
    id: "schreiben-informell",
    part: "schreiben",
    title: "Informelle E-Mail",
    en: "Informal email",
    levels: ["A2", "B1"],
    where: "Goethe A2 «Schreiben, Teil 1» · Goethe B1 «Schreiben, Aufgabe 1» (E-Mail an eine Freundin, ca. 80 Wörter, 20 Min.)",
    time: "ca. 20 Min. · 5 planen, 12 schreiben, 3 prüfen",
    signal: "Drei bis vier Stichpunkte, die «behandelt» werden sollen, plus ein Anlass (Einladung, Absage, Bericht).",
    sample: {
      task: "Schreiben Sie an Ihre Freundin. Schreiben Sie: warum Sie schreiben, was passiert ist, ein Vorschlag.",
      body: "Liebe Lena, … Viele Grüße, dein …",
      options: ["→ Ein Absatz pro Stichpunkt. Drei Stichpunkte = drei Absätze."],
    },
    trick: {
      name: "Ein Absatz pro Stichpunkt — die Punkte werden gezählt, nicht die Schönheit",
      steps: [
        "Stichpunkte nummerieren und in dieser Reihenfolge abarbeiten. Jeden Punkt mit 2–3 Sätzen füllen.",
        "Anrede und Gruß gehören zur Bewertung. «Liebe/Lieber …» und «Viele Grüße» sind je ein Punkt.",
        "Nach dem Schreiben: Stichpunkte durchgehen und abhaken. Ein vergessener Punkt kostet mehr als zehn Grammatikfehler.",
        "Wortzahl grob prüfen: deutlich zu kurz kostet Punkte, deutlich zu lang kostet Zeit.",
        "Letzte Kontrolle: Verb an Position 2, Verb am Ende im Nebensatz, Großschreibung der Nomen.",
      ],
    },
    focus: [
      "Aufgabenerfüllung ist das schwerste Bewertungskriterium und das einfachste zu erfüllen: alle Stichpunkte behandeln.",
      "«du» konsequent klein, «Sie» konsequent groß — Register nicht mischen.",
      "Verbinde die Sätze: weil, deshalb, dann, danach. Kohärenz ist ein eigenes Kriterium.",
    ],
    traps: [
      "Ein Stichpunkt wird nur erwähnt statt behandelt. «Ich komme nicht» ohne Grund ist kein behandelter Punkt.",
      "Auswendiggelernte Textbausteine, die nicht zur Aufgabe passen, bringen null Punkte und kosten Zeit.",
      "Formelle Floskeln in der Freundes-Mail: «Sehr geehrte Damen und Herren» an Lena ist ein Registerfehler.",
    ],
    compare: {
      task: "Stichpunkt: «Schlagen Sie einen neuen Termin vor.»",
      wrong: "Leider kann ich nicht kommen. Schade!",
      right: "Leider kann ich am Samstag nicht. Hättest du am nächsten Wochenende Zeit, zum Beispiel Sonntagnachmittag?",
      why: "Der Stichpunkt verlangt einen Vorschlag. Ohne konkreten Alternativtermin gilt der Punkt als nicht behandelt — unabhängig davon, wie korrekt der Satz ist.",
    },
    rules: ["R-052", "R-060", "R-070"],
    modules: ["zeiten", "wortstellung", "nebensatz"],
    byLevel: {
      A2: "ca. 30–60 Wörter. Perfekt, einfache Nebensätze mit weil, feste Anrede- und Grußformeln.",
      B1: "ca. 80–150 Wörter. Konjunktiv II für Vorschläge und Bitten, mehr Konnektoren, klarer Absatzbau.",
    },
  },

  {
    id: "schreiben-formell",
    part: "schreiben",
    title: "Formeller Brief · Beschwerde",
    en: "Formal letter",
    levels: ["B1", "B2", "C1"],
    where: "Goethe A2 «Schreiben, Teil 2» (halbformelle Mitteilung) · Goethe B1 «Schreiben, Aufgabe 3» (halbformelle E-Mail, ca. 40 Wörter, 15 Min.) · Goethe B2 «Schreiben, Aufgabe 2» · telc «Schriftlicher Ausdruck»",
    time: "ca. 30 Min. · 6 planen, 20 schreiben, 4 prüfen",
    signal: "Ein Anliegen gegenüber einer Institution: Beschwerde, Antrag, Anfrage, Kündigung.",
    sample: {
      task: "Beschweren Sie sich über eine verspätete Lieferung und fordern Sie eine Lösung.",
      body: "Sehr geehrte Damen und Herren, … Mit freundlichen Grüßen",
      options: ["→ Anlass · Sachverhalt · Forderung mit Frist · Grußformel"],
    },
    trick: {
      name: "Vier feste Blöcke — Anlass, Sachverhalt, Forderung, Frist",
      steps: [
        "ANLASS: Beziehe dich auf etwas Konkretes. «Bezugnehmend auf meine Bestellung vom 3. Mai …»",
        "SACHVERHALT: Was ist passiert, in Vergangenheitsform und sachlich. Keine Emotionen, keine Ausrufezeichen.",
        "FORDERUNG: Eine konkrete Handlung verlangen, im Konjunktiv II der Höflichkeit: «Ich möchte Sie bitten, …»",
        "FRIST: Nenne einen Termin. «bis zum 20. Mai» macht die Forderung überprüfbar und wirkt formell.",
        "Register prüfen: durchgehend «Sie», keine Umgangssprache, Passiv statt «man».",
      ],
    },
    focus: [
      "Konjunktiv II ist das Register-Signal des formellen Briefs: könnten, würde, wäre, hätte.",
      "Passiv und Nominalisierung heben das Register: «Die Lieferung erfolgte verspätet.»",
      "Anrede ohne Namen → «Sehr geehrte Damen und Herren,» mit Komma, danach klein weiter.",
    ],
    traps: [
      "Zu emotional werden. «Das ist eine Frechheit!» kostet im Kriterium Register mehr als jeder Grammatikfehler.",
      "Forderung ohne Handlung: «Ich hoffe auf eine Lösung» ist keine Forderung.",
      "Grußformel vergessen oder informell («Liebe Grüße» an eine Behörde).",
    ],
    compare: {
      task: "Forderung formulieren",
      wrong: "Bitte schicken Sie mir das Geld zurück, sonst bin ich sauer.",
      right: "Ich möchte Sie bitten, mir den Kaufbetrag bis zum 20. Mai zu erstatten.",
      why: "Konjunktiv II («möchte bitten»), Fachwort («Kaufbetrag erstatten») und eine Frist. Dieselbe Forderung, formelles Register — und das Register ist ein eigenes Bewertungskriterium.",
    },
    rules: ["R-088", "R-092", "R-099", "R-100"],
    modules: ["konjunktiv2", "passiv", "nominalisierung", "nominalstil"],
    byLevel: {
      B1: "ca. 120–150 Wörter. Anrede, Sachverhalt, höfliche Bitte, Gruß. Konjunktiv II für Höflichkeit.",
      B2: "ca. 180–220 Wörter. Argumentation mit Begründung, Passiv, klar gegliederte Absätze.",
      C1: "ca. 250–300 Wörter. Nominalstil, Funktionsverbgefüge, formelle Konnektoren, präzise Fristen und Bedingungen.",
    },
  },

  {
    id: "schreiben-eroerterung",
    part: "schreiben",
    title: "Erörterung · Stellungnahme",
    en: "Argumentative essay",
    levels: ["B2", "C1"],
    where: "Goethe B1 «Schreiben, Aufgabe 2» (Diskussionsbeitrag im Forum, ca. 80 Wörter, 25 Min.) · Goethe B2 «Schreiben, Aufgabe 1» (Forumsbeitrag, ca. 150 Wörter, 50 Min.) · Goethe C1 «Schreiben» · telc C1 Hochschule «Schriftlicher Ausdruck» (48 Punkte, 70 Min.)",
    time: "ca. 45–50 Min. · 10 planen, 30 schreiben, 8 prüfen",
    signal: "Eine strittige These plus die Aufforderung, Stellung zu nehmen — oft mit Leserbrief- oder Forumsrahmen.",
    sample: {
      task: "Nehmen Sie Stellung: Sollten Handys in Schulen verboten werden?",
      body: "Einleitung · Pro · Contra · eigene Position · Schluss",
      options: ["→ Position steht am Ende, nicht am Anfang. Erst wägen, dann entscheiden."],
    },
    trick: {
      name: "Fünf Absätze, jeder mit einer festen Aufgabe",
      steps: [
        "EINLEITUNG: Thema nennen, Relevanz in einem Satz, Frage aufwerfen. Keine eigene Meinung.",
        "PRO: zwei Argumente, jedes nach dem Schema Behauptung → Begründung → Beispiel.",
        "CONTRA: zwei Argumente im selben Schema. Fair formulieren, nicht als Strohmann.",
        "POSITION: Jetzt deine Meinung, ausdrücklich markiert: «Meiner Ansicht nach überwiegt …»",
        "SCHLUSS: Konsequenz oder Ausblick, ein bis zwei Sätze. Keine neuen Argumente.",
      ],
    },
    focus: [
      "Jedes Argument braucht ein Beispiel. Behauptung ohne Beleg zählt in der Bewertung als halbes Argument.",
      "Konnektorenvielfalt ist ein Kriterium: einerseits/andererseits, zwar/aber, hinzu kommt, dem steht entgegen.",
      "Konjunktiv II und Passiv heben das Register: «Man könnte einwenden, dass …»",
    ],
    traps: [
      "Nur Pro-Argumente sammeln. Die Aufgabe verlangt Abwägen, nicht Überzeugen.",
      "Ich-Erzählung statt Argumentation: «Ich finde, ich finde, ich finde» kostet im Kriterium Wortschatz.",
      "Der Schluss wiederholt die Einleitung wörtlich — sichtbar als Füllmaterial und ohne Punktwert.",
    ],
    compare: {
      task: "Ein Pro-Argument formulieren",
      wrong: "Handys sind schlecht für die Konzentration, das ist klar.",
      right: "Handys stören die Konzentration. Eine Studie der Universität Bonn zeigt, dass Schüler nach einer Unterbrechung mehrere Minuten brauchen, um wieder in den Stoff zu finden. Wer alle zehn Minuten auf das Display schaut, arbeitet also dauerhaft im Anlauf.",
      why: "Behauptung → Begründung → Beispiel. Die falsche Variante bleibt bei der Behauptung stehen und wird als ein Satz gewertet, nicht als Argument.",
    },
    rules: ["R-103", "R-104", "R-099", "R-088"],
    modules: ["konnektoren-c1", "konnektoren-b2", "nominalstil", "schreiben-c1"],
    byLevel: {
      B2: "ca. 180–220 Wörter. Vier bis fünf Argumente, klare Gliederung, Standard-Konnektoren.",
      C1: "ca. 280–350 Wörter. Gegenargument vorwegnehmen und entkräften, Nominalstil, formelle Konnektoren, differenzierte Position.",
    },
  },

  {
    id: "schreiben-grafik",
    part: "schreiben",
    title: "Grafikbeschreibung",
    en: "Describing a chart",
    levels: ["B1", "B2"],
    where: "telc B1/B2 «Schriftlicher Ausdruck» · ÖSD · TestDaF «Schriftlicher Ausdruck» (Grafik beschreiben, dann Position begründen, 60 Min.) · DSH",
    time: "ca. 20 Min. · 5 lesen und planen, 12 schreiben, 3 prüfen",
    signal: "Ein Diagramm mit Titel, Quelle, Jahren und Prozentangaben plus die Aufforderung, es zu beschreiben.",
    sample: {
      task: "Beschreiben Sie die Grafik.",
      body: "«Mediennutzung Jugendlicher 2010–2024», Quelle: Statistisches Bundesamt",
      options: ["→ Einleitung mit Titel + Quelle + Zeitraum, dann Auffälligstes zuerst."],
    },
    trick: {
      name: "Titel, Quelle, Zeitraum — dann das Auffälligste, dann Zahlen als Beleg",
      steps: [
        "Einleitungssatz aus den Metadaten bauen: «Die Grafik mit dem Titel … aus dem Jahr …, herausgegeben von …, zeigt …»",
        "Nenne den größten Kontrast zuerst: höchster Wert, niedrigster Wert, stärkste Veränderung.",
        "Belege jede Aussage mit einer Zahl: «stieg von 34 % im Jahr 2010 auf 61 % im Jahr 2024».",
        "Verwende die Sprache der Entwicklung: stieg an, sank, blieb konstant, verdoppelte sich, erreichte den Höchststand.",
        "Ein Schlusssatz mit der Gesamttendenz. Erst wenn die Aufgabe es verlangt: Deutung oder Meinung.",
      ],
    },
    focus: [
      "Feste Formulierungen sind hier bares Geld — sie lassen sich vorher auswendig lernen und passen immer.",
      "Prozentangaben brauchen immer einen Bezug: Anteil woran, in welchem Jahr.",
      "Nur beschreiben, was die Grafik zeigt. Ursachen sind Interpretation und gehören in den letzten Absatz, falls gefragt.",
    ],
    traps: [
      "Alle Zahlen der Reihe nach vorlesen — das ist eine Tabelle, keine Beschreibung, und kostet im Kriterium Kohärenz.",
      "Prozentpunkte und Prozent verwechseln: von 30 % auf 40 % sind 10 Prozentpunkte, aber ein Drittel Zuwachs.",
      "Quelle und Zeitraum vergessen — beides ist in der Regel ein fester Bewertungspunkt.",
    ],
    compare: {
      task: "Entwicklung beschreiben",
      wrong: "2010 waren es 34 %. 2015 waren es 45 %. 2020 waren es 55 %. 2024 waren es 61 %.",
      right: "Der Anteil stieg über den gesamten Zeitraum kontinuierlich an, von 34 % im Jahr 2010 auf 61 % im Jahr 2024 — also um fast das Doppelte.",
      why: "Die richtige Version benennt zuerst die Tendenz und belegt sie dann mit Eckwerten. Die falsche listet auf und zeigt weder Wortschatz noch Kohärenz.",
    },
    rules: ["R-023", "R-024", "R-099"],
    modules: ["komparativ", "nominalisierung"],
    byLevel: {
      B1: "Einfache Balken- oder Kreisdiagramme. Beschreiben reicht, keine Interpretation.",
      B2: "Mehrere Datenreihen und Zeitverläufe. Vergleiche, Tendenzen und ein kurzer Deutungsteil.",
    },
  },

  {
    id: "schreiben-zusammenfassung",
    part: "schreiben",
    title: "Zusammenfassung · Textwiedergabe",
    en: "Summary",
    levels: ["B2", "C1"],
    where: "Goethe C1 · DSH · TestDaF · Studienkollegs",
    time: "ca. 30 Min. · 10 lesen und markieren, 15 schreiben, 5 prüfen",
    signal: "Ein Ausgangstext und die Aufforderung, ihn in eigenen Worten und auf einen Bruchteil der Länge zu bringen.",
    sample: {
      task: "Fassen Sie den Text in ca. 150 Wörtern zusammen.",
      body: "In dem Artikel «…» von … aus der Zeitschrift … geht es um …",
      options: ["→ Einleitungssatz mit Titel, Autor, Quelle, Thema. Dann nur Hauptaussagen."],
    },
    trick: {
      name: "Erst die Hauptaussage jedes Absatzes in einem Satz, dann diese Sätze verbinden",
      steps: [
        "Text absatzweise lesen und pro Absatz EINEN Satz an den Rand schreiben. Beispiele überspringen.",
        "Einleitungssatz nach Schema: Textsorte + Titel + Autor + Quelle + Jahr + Thema.",
        "Deine Randsätze in eine logische Reihenfolge bringen und mit Konnektoren verbinden.",
        "Alles in die Wiedergabe-Perspektive setzen: «Der Autor argumentiert, dass …», Konjunktiv I wo möglich.",
        "Streichen, was Beispiel, Zitat oder Wiederholung ist. Die Zusammenfassung enthält keine eigene Meinung.",
      ],
    },
    focus: [
      "Redemittel der Wiedergabe: Der Autor stellt dar / weist darauf hin / kommt zu dem Schluss.",
      "Konjunktiv I signalisiert fremde Rede und ist auf C1 ein Bewertungsmerkmal.",
      "Eigene Formulierungen sind Pflicht. Übernommene Sätze zählen nicht mit.",
    ],
    traps: [
      "Abschreiben statt umformulieren — der häufigste Grund für Punktabzug in diesem Format.",
      "Eigene Meinung einbauen. Sie ist erst gefragt, wenn die Aufgabe ausdrücklich danach fragt.",
      "Beispiele mitnehmen und dadurch die Wortgrenze sprengen. Beispiele sind das Erste, was gestrichen wird.",
    ],
    compare: {
      task: "Fremde Aussage wiedergeben",
      wrong: "Die Digitalisierung verändert die Arbeitswelt grundlegend.",
      right: "Der Autor vertritt die Auffassung, die Digitalisierung verändere die Arbeitswelt grundlegend.",
      why: "Ohne Redeeinleitung liest sich die Aussage als deine eigene These. Konjunktiv I («verändere») markiert sie eindeutig als fremde Position.",
    },
    rules: ["R-090", "R-091", "R-099"],
    modules: ["konjunktiv1", "nominalisierung", "textkohaesion"],
    byLevel: {
      B2: "Journalistischer Ausgangstext, Wiedergabe im Indikativ mit Redeeinleitungen.",
      C1: "Fachtext, Wiedergabe im Konjunktiv I, Nominalstil, klare Trennung von Position und Argument.",
    },
  },

  // ============================================================== SPRECHEN ==
  {
    id: "sprechen-vorstellung",
    part: "sprechen",
    title: "Vorstellung und Kontaktaufnahme",
    en: "Introduction",
    levels: ["A2", "B1"],
    where: "Goethe «Sprechen, Teil 1» · telc — der Einstieg, oft mit Stichwortkarten",
    time: "ca. 2–3 Min. pro Person",
    signal: "Karten mit Stichworten (Name, Wohnort, Beruf, Hobbys) oder Fragen an den Partner.",
    sample: {
      task: "Stellen Sie sich vor und stellen Sie Ihrem Partner Fragen.",
      body: "Karte: «Freizeit»",
      options: ["→ Antwort + Beispiel + Rückfrage. Drei Bausteine, immer dieselben."],
    },
    trick: {
      name: "Antwort, Beispiel, Rückfrage — nie nur antworten",
      steps: [
        "Antworte in einem vollen Satz, nicht mit einem Wort.",
        "Füge sofort ein Beispiel oder einen Grund an: «… weil ich dabei abschalten kann».",
        "Gib den Ball zurück: «Und wie ist das bei dir?» Interaktion ist ein eigenes Bewertungskriterium.",
        "Übe fünf Bausteine vorher: Name, Wohnort, Arbeit, Freizeit, Warum Deutsch. Sie kommen immer.",
        "Bei Blackout: umschreiben statt schweigen. «Wie sagt man …?» ist erlaubt und zeigt Sprachkompetenz.",
      ],
    },
    focus: [
      "Flüssigkeit zählt mehr als Korrektheit. Weiterreden schlägt Selbstkorrektur.",
      "Rückfragen an den Partner sind Pflichtpunkte, keine Höflichkeit.",
      "Klare Aussprache und Blickkontakt sind Teil der Bewertung.",
    ],
    traps: [
      "Auswendiggelernten Monolog abspulen — die Prüfenden erkennen ihn und fragen quer.",
      "Nur mit dem Prüfer sprechen statt mit dem Partner. In Partnerprüfungen ist das ein Abzug.",
      "Ein-Wort-Antworten. Sie geben der Bewertung nichts, woran sie Punkte festmachen kann.",
    ],
    compare: {
      task: "«Was machen Sie in Ihrer Freizeit?»",
      wrong: "Sport.",
      right: "Ich laufe dreimal die Woche, meistens am Morgen, weil ich danach klarer denken kann. Machen Sie auch Sport?",
      why: "Voller Satz + Grund + Rückfrage. Dieselbe Information, aber jetzt kann die Bewertung Wortschatz, Struktur und Interaktion sehen.",
    },
    rules: ["R-060", "R-070"],
    modules: ["wortstellung", "nebensatz"],
    byLevel: {
      A2: "Persönliche Angaben, Vorlieben, Alltag. Kurze Sätze reichen, aber immer mit Verb.",
      B1: "Erfahrungen erzählen und begründen, Nachfragen stellen, auf Antworten reagieren.",
    },
  },

  {
    id: "sprechen-praesentation",
    part: "sprechen",
    title: "Präsentation und Bildbeschreibung",
    en: "Presentation",
    levels: ["B1", "B2", "C1"],
    where: "Goethe «Sprechen, Teil 1» ab B1 · telc — meist mit Vorbereitungszeit",
    time: "ca. 3–4 Min. Vortrag nach 15–20 Min. Vorbereitung",
    signal: "Ein Thema oder ein Foto plus Folienstichpunkte, dazu Vorbereitungszeit mit Notizzettel.",
    sample: {
      task: "Präsentieren Sie das Thema «Ehrenamt» in vier Schritten.",
      body: "Einstieg · Situation im Heimatland · Vor- und Nachteile · eigene Meinung und Abschluss",
      options: ["→ Die Struktur ist vorgegeben. Sie ist die halbe Note."],
    },
    trick: {
      name: "Die vorgegebene Gliederung laut mitsprechen",
      steps: [
        "Sag die Struktur an: «Ich möchte zuerst … dann … und zum Schluss …». Das zeigt Textkompetenz sofort.",
        "Notiere in der Vorbereitung nur Stichworte, niemals ganze Sätze — sonst liest du ab.",
        "Pro Punkt ein Beispiel aus dem eigenen Leben. Es ist immer verfügbar und immer flüssig erzählbar.",
        "Signalwörter zwischen den Teilen: «Kommen wir zum zweiten Punkt …», «Zusammenfassend …»",
        "Zum Schluss ausdrücklich abschließen und das Wort zurückgeben: «Damit komme ich zum Ende. Gibt es Fragen?»",
      ],
    },
    focus: [
      "Struktur ist sichtbar zu machen — die Bewertenden haken Gliederungssignale ab.",
      "Ein einziges gutes Beispiel trägt einen ganzen Abschnitt.",
      "Zeit im Blick behalten: deutlich zu kurz kostet Punkte, weit über der Zeit wird abgebrochen.",
    ],
    traps: [
      "Notizen ablesen. Vorlesen wird als niedrigere Sprachkompetenz bewertet als stockendes freies Sprechen.",
      "Bei Bildbeschreibung nur aufzählen, was zu sehen ist, statt zu deuten und zu verbinden.",
      "Den Schlussteil weglassen, weil die Zeit knapp wird — er ist ein eigener Bewertungspunkt.",
    ],
    compare: {
      task: "Übergang zum zweiten Punkt",
      wrong: "Ähm … und dann, ja, in meinem Land ist das auch so.",
      right: "Soweit zur allgemeinen Lage. Kommen wir nun zur Situation in meinem Heimatland.",
      why: "Explizite Gliederungssignale sind ein eigenes Bewertungsmerkmal. Sie kosten zwei Sekunden und lassen sich vorher auswendig lernen.",
    },
    rules: ["R-103", "R-069"],
    modules: ["textkohaesion", "konnektoren-c1"],
    byLevel: {
      B1: "Kurzvortrag über ein Alltagsthema mit vorgegebenen Folien. Erzählen und begründen.",
      B2: "Thema mit Pro und Contra, Nachfragen der Prüfenden werden beantwortet.",
      C1: "Freier Vortrag mit differenzierter Position, Umgang mit Einwänden, formelles Register.",
    },
  },

  {
    id: "sprechen-diskussion",
    part: "sprechen",
    title: "Diskussion und gemeinsames Planen",
    en: "Discussion / joint planning",
    levels: ["A2", "B1", "B2", "C1"],
    where: "Goethe «Sprechen, Teil 2/3» · telc — Partnerprüfung",
    time: "ca. 4–5 Min. zu zweit",
    signal: "Eine gemeinsame Aufgabe: etwas planen, sich einigen, eine Entscheidung aushandeln.",
    sample: {
      task: "Planen Sie gemeinsam ein Abschiedsfest für eine Kollegin.",
      body: "Ort · Termin · Essen · Geschenk",
      options: ["→ Vorschlag machen, auf den Partner reagieren, sich einigen."],
    },
    trick: {
      name: "Vorschlagen, reagieren, einigen — jeder Beitrag muss den Partner aufgreifen",
      steps: [
        "Mache einen konkreten Vorschlag mit Begründung: «Wir könnten … , weil …»",
        "Reagiere immer zuerst auf den Partner, bevor du Neues bringst: «Das ist ein guter Punkt, allerdings …»",
        "Bei Uneinigkeit: höflich widersprechen und eine Alternative anbieten. Widerspruch ist erwünscht, nicht riskant.",
        "Achte auf Balance: Wer den Partner nicht zu Wort kommen lässt, verliert Punkte bei Interaktion.",
        "Zum Schluss zusammenfassen: «Dann halten wir fest: …» Die Einigung muss ausgesprochen werden.",
      ],
    },
    focus: [
      "Interaktion ist ein eigenes Kriterium: aufgreifen, nachfragen, zustimmen, widersprechen.",
      "Konjunktiv II ist die Sprache des Vorschlags: könnten, wäre, sollten wir nicht …",
      "Am Ende muss ein Ergebnis stehen. Ohne Einigung fehlt ein Aufgabenpunkt.",
    ],
    traps: [
      "Zu allem Ja sagen. Ohne Aushandeln gibt es nichts zu bewerten.",
      "Parallel monologisieren, ohne die Beiträge des Partners aufzugreifen.",
      "Alle Punkte der Aufgabe besprechen wollen und dabei die Einigung vergessen.",
    ],
    compare: {
      task: "Auf einen Vorschlag reagieren",
      wrong: "Nein. Ich will lieber ins Restaurant.",
      right: "Im Park wäre schön, allerdings ist das Wetter unsicher. Sollten wir nicht lieber ins Restaurant gehen und den Park als Plan B behalten?",
      why: "Aufgreifen, einwenden, Alternative anbieten — drei Interaktionshandlungen in einem Beitrag statt einer blanken Ablehnung.",
    },
    rules: ["R-088", "R-087"],
    modules: ["konjunktiv2", "modalverben"],
    byLevel: {
      A2: "Etwas zu zweit verabreden: Zeit, Ort, Mitbringsel. Kurze Vorschläge und Zustimmung.",
      B1: "Planen mit Begründung, höfliches Widersprechen, gemeinsame Entscheidung.",
      B2: "Standpunkte aushandeln, Einwände entkräften, Kompromiss formulieren.",
      C1: "Moderieren, Positionen abwägen, Einwände vorwegnehmen, formelles Register halten.",
    },
  },
];

export const TYPE_BY_ID = Object.fromEntries(EXERCISE_TYPES.map((t) => [t.id, t]));

export const TYPES_BY_PART = EXAM_PARTS.map((part) => ({
  ...part,
  types: EXERCISE_TYPES.filter((t) => t.part === part.id),
}));

// ---------------------------------------------------------------------------
//  Level expectations
//
//  What an examiner is actually looking for at each level — and, more usefully,
//  what is NEW compared to the level below. `newHere` is the delta: everything
//  that was optional one level down and is required here.
// ---------------------------------------------------------------------------

export const LEVEL_EXPECTATIONS = {
  A2: {
    level: "A2",
    name: "A2 — Grundlagen",
    claim: "Du verstehst Sätze und häufige Ausdrücke zu Themen von unmittelbarer Bedeutung und kannst dich in einfachen Routinesituationen verständigen.",
    exams: "Goethe-Zertifikat A2 · telc Deutsch A2 · ÖSD Zertifikat A2",
    pass: "in der Regel 60 % — bei modularen Prüfungen pro Modul",
    skills: [
      { id: "lesen", label: "Lesen", time: "ca. 30 Min.", expect: "Kurze Alltagstexte: Anzeigen, Schilder, E-Mails, Fahrpläne. Informationen werden gefunden, nicht erschlossen." },
      { id: "hoeren", label: "Hören", time: "ca. 30 Min.", expect: "Langsame, deutliche Alltagsgespräche und Durchsagen. Wichtiges wird meist wiederholt." },
      { id: "schreiben", label: "Schreiben", time: "ca. 30 Min.", expect: "Kurze Mitteilungen und persönliche E-Mails, ca. 30–60 Wörter, drei Stichpunkte." },
      { id: "sprechen", label: "Sprechen", time: "ca. 15 Min.", expect: "Sich vorstellen, Fragen zur Person stellen und beantworten, etwas zu zweit verabreden." },
    ],
    mustHave: [
      "Vier Kasus erkennen und die Artikeltabelle sicher anwenden",
      "Präsens, Perfekt, Präteritum von sein/haben/Modalverben",
      "Satzklammer: Verb an Position 2, zweiter Verbteil ans Ende",
      "Wechselpräpositionen: Wohin → Akkusativ, Wo → Dativ",
      "Nebensätze mit weil, dass, wenn — Verb am Ende",
      "Adjektivendungen nach bestimmtem und unbestimmtem Artikel",
    ],
    killers: [
      "Verb an Position 3 nach einer Zeitangabe: «Gestern ich bin …» statt «Gestern bin ich …»",
      "Perfekt mit dem falschen Hilfsverb: «Ich habe nach Hause gegangen»",
      "Kein Komma und kein Verb am Ende im weil-Satz",
    ],
    newHere: "Gegenüber A1: die Vergangenheit (Perfekt) wird verlangt, Nebensätze mit weil/dass kommen dazu, und die Satzklammer muss konsequent stimmen.",
    modules: ["kasus", "adjektiv", "praep", "wortstellung", "zeiten", "modalverben", "reflexiv", "komparativ"],
    formats: ["goethe-a2"],
  },

  B1: {
    level: "B1",
    name: "B1 — Struktur",
    claim: "Du kannst zusammenhängend über vertraute Themen sprechen, Erfahrungen schildern, Meinungen begründen und mit den meisten Situationen auf Reisen umgehen.",
    exams: "Goethe-Zertifikat B1 · telc Deutsch B1 · ÖSD Zertifikat B1 · DTZ",
    pass: "60 % pro Modul — Module können einzeln wiederholt werden",
    skills: [
      { id: "lesen", label: "Lesen", time: "ca. 65 Min.", expect: "Zeitungsartikel, Blogs, Anzeigen, formelle Briefe. Hauptaussagen und Details, auch umschrieben." },
      { id: "hoeren", label: "Hören", time: "ca. 40 Min.", expect: "Alltagsgespräche, Radiobeiträge, Ansagen — teils nur einmal. Standardsprache in normalem Tempo." },
      { id: "schreiben", label: "Schreiben", time: "ca. 60 Min.", expect: "Drei Aufgaben: informelle E-Mail, formeller Brief oder Forumsbeitrag, ca. 80–150 Wörter je Aufgabe." },
      { id: "sprechen", label: "Sprechen", time: "ca. 15 Min.", expect: "Gemeinsam planen, kurze Präsentation halten, auf Rückfragen reagieren." },
    ],
    mustHave: [
      "Konjunktiv II für Höflichkeit und Irreales (könnte, wäre, hätte, würde)",
      "Passiv im Präsens und Präteritum, auch mit Modalverben",
      "Relativsätze in allen Kasus, inkl. Präposition + Relativpronomen",
      "Plusquamperfekt und die Zeitenfolge mit nachdem",
      "Genitiv und Genitivpräpositionen (wegen, trotz, während)",
      "Verben mit fester Präposition, da-/wo-Komposita",
      "Infinitiv mit zu und um … zu",
    ],
    killers: [
      "«würde» statt Konjunktiv II bei sein, haben, Modalverben: «würde sein» statt «wäre»",
      "Passiv ohne «worden» im Perfekt: «ist repariert geworden»",
      "Relativpronomen im falschen Kasus, weil der Kasus des Bezugsworts kopiert wird",
      "Registerbruch: Umgangssprache im formellen Brief",
    ],
    newHere: "Gegenüber A2: Sätze werden verschachtelt. Relativsätze, Konjunktiv II und Passiv sind ab hier Pflicht, und im Schreiben wird zwischen informellem und formellem Register unterschieden.",
    modules: ["genitiv", "nebensatz", "relativsatz", "konjunktiv2", "passiv", "infinitiv-zu", "temporal", "futur", "verbpraep"],
    formats: ["goethe-b1"],
  },

  B2: {
    level: "B2",
    name: "B2 — Register",
    claim: "Du verstehst komplexe Texte zu konkreten und abstrakten Themen, argumentierst zu Fachfragen im eigenen Gebiet und sprichst so spontan, dass ein Gespräch mit Muttersprachlern mühelos möglich ist.",
    exams: "Goethe-Zertifikat B2 · telc Deutsch B2 · ÖSD Zertifikat B2 · TestDaF (TDN 3–4)",
    pass: "60 % pro Modul — bei Goethe 60 von 100 Punkten je Modul",
    skills: [
      { id: "lesen", label: "Lesen", time: "ca. 65 Min.", expect: "Kommentare, Reportagen, Fachtexte. Haltung und Absicht des Autors erkennen, nicht nur Fakten." },
      { id: "hoeren", label: "Hören", time: "ca. 40 Min.", expect: "Diskussionen, Interviews, Vorträge mit mehreren Sprechern; Umgangssprache und regionale Färbung." },
      { id: "schreiben", label: "Schreiben", time: "ca. 75 Min.", expect: "Zwei Aufgaben: Forumsbeitrag oder Erörterung (ca. 150–220 Wörter) plus formelle Nachricht." },
      { id: "sprechen", label: "Sprechen", time: "ca. 15 Min.", expect: "Kurzvortrag mit eigener Position, anschließend Diskussion und Umgang mit Einwänden." },
    ],
    mustHave: [
      "Konjunktiv I für indirekte Rede",
      "Alle Passivformen inkl. unpersönliches Passiv und Passiv mit Modalverben",
      "Partizipialattribute verstehen und in Relativsätze auflösen",
      "Nominalisierung ↔ Verbalisierung als bewusste Stilentscheidung",
      "Zweiteilige Konnektoren: nicht nur … sondern auch, je … desto, weder … noch",
      "n-Deklination sicher",
      "Subjektive Modalverben: «Er soll krank sein» ≠ «Er muss krank sein»",
    ],
    killers: [
      "Konjunktiv I und Indikativ vermischen in der indirekten Rede",
      "Erweiterte Attribute falsch aufgelöst — Bezug des Partizips verwechselt",
      "Zweiteilige Konnektoren halb gebaut: «nicht nur … aber auch»",
      "Argument ohne Beleg im Schreiben: Behauptungen ohne Beispiel zählen als halbes Argument",
    ],
    newHere: "Gegenüber B1: Register wird bewertet, nicht nur Korrektheit. Indirekte Rede, Partizipialattribute und Nominalstil kommen dazu; im Schreiben wird abgewogen statt erzählt.",
    modules: ["konjunktiv1", "n-deklination", "partizipialattribut", "nominalisierung", "konnektoren-b2", "modal-subjektiv", "passiv-b2", "textkohaesion"],
    formats: ["goethe-b2", "telc-b2", "testdaf"],
  },

  C1: {
    level: "C1",
    name: "C1 — Präzision",
    claim: "Du verstehst anspruchsvolle, längere Texte und implizite Bedeutungen, drückst dich spontan und fließend aus und verwendest die Sprache im Beruf und Studium wirksam und flexibel.",
    exams: "Goethe-Zertifikat C1 · telc Deutsch C1 Hochschule · ÖSD C1 · DSH-2/3 · TestDaF (TDN 5)",
    pass: "60 % — bei telc C1 Hochschule zusätzlich Mindestleistung pro Prüfungsteil",
    skills: [
      { id: "lesen", label: "Lesen", time: "ca. 70 Min.", expect: "Wissenschaftliche und essayistische Texte; Ironie, Implikation und Argumentationsstruktur erkennen." },
      { id: "hoeren", label: "Hören", time: "ca. 40 Min.", expect: "Vorlesungen, Streitgespräche, schnelles Sprechen; Mitschrift und implizite Wertungen." },
      { id: "schreiben", label: "Schreiben", time: "ca. 80 Min.", expect: "Erörterung oder Textwiedergabe, ca. 250–350 Wörter, mit differenzierter Position und Nominalstil." },
      { id: "sprechen", label: "Sprechen", time: "ca. 15 Min.", expect: "Vortrag mit Gliederung, Diskussion, Einwände vorwegnehmen und entkräften." },
    ],
    mustHave: [
      "Nominalstil und Funktionsverbgefüge: in Anspruch nehmen, zur Verfügung stellen",
      "Passiversatzformen: sein + zu-Infinitiv, lassen + sich, -bar-Adjektive",
      "Konjunktiv II der Vergangenheit, inkl. Modalverben (hätte kommen können)",
      "Erweiterte Partizipialattribute aktiv bilden, nicht nur verstehen",
      "Formelle Konnektoren: infolgedessen, gleichwohl, sofern, zumal, insofern als",
      "Modalpartikeln bewusst einsetzen (doch, ja, mal, eben, wohl)",
      "Textkohäsion über Absätze hinweg: Thema-Rhema, Verweisketten",
    ],
    killers: [
      "Register kippt mitten im Text — formeller Einstieg, umgangssprachlicher Schluss",
      "Nominalstil übertrieben: der Satz wird unlesbar und verliert im Kriterium Kohärenz",
      "«würde» in der Vergangenheit statt «hätte/wäre + Partizip II»",
      "Erweitertes Attribut ohne passende Endung am Schluss der Kette",
    ],
    newHere: "Gegenüber B2: Es geht nicht mehr um Korrektheit, sondern um Wirkung. Erwartet werden Nominalstil, Passiversatz, feine Konnektoren und ein Register, das über den ganzen Text hält.",
    modules: ["nominalstil", "passiversatz", "konjunktiv2-vergangenheit", "erweitertes-attribut", "konnektoren-c1", "modalpartikeln", "schreiben-c1"],
    formats: ["goethe-c1", "telc-c1-hochschule", "dsh"],
  },
};

/** Cross-level strategy that applies to every exam, regardless of level. */
export const EXAM_STRATEGY = [
  { id: "zeit", title: "Zeit vor Perfektion",
    body: "Rechne vor der Prüfung aus, wie viele Minuten eine Aufgabe wert ist, und halte dich daran. Eine ungelöste Aufgabe kostet immer mehr als eine unperfekt gelöste." },
  { id: "raten", title: "Nie eine Lücke leer lassen",
    body: "In keiner deutschen Sprachprüfung gibt es Minuspunkte für falsche Antworten. Eine leere Zeile ist garantiert null, eine geratene ist es nicht." },
  { id: "aufgabe", title: "Die Aufgabenstellung ist die Checkliste",
    body: "Im Schreiben und Sprechen wird Aufgabenerfüllung zuerst bewertet. Alle Stichpunkte zu behandeln bringt mehr als fehlerfreie Grammatik in der Hälfte der Punkte." },
  { id: "paraphrase", title: "Die richtige Antwort ist nie die wörtliche",
    body: "In Lesen und Hören wird die richtige Option umformuliert und die falsche mit Originalwörtern gebaut. Wortgleichheit ist ein Warnsignal, kein Beweis." },
  { id: "korrektur", title: "Fünf Minuten Endkontrolle, immer dieselbe Reihenfolge",
    body: "1) Verbposition im Haupt- und Nebensatz · 2) Endungen nach Artikeln · 3) Groß- und Kleinschreibung der Nomen · 4) Anrede, Gruß, Vollständigkeit." },
  { id: "signal", title: "Signalwörter schlagen Vokabular",
    body: "nachdem, obwohl, vorausgesetzt, eigentlich, allerdings — diese Wörter entscheiden mehr Aufgaben als jeder Fachbegriff. Lerne sie als Steuerbefehle, nicht als Vokabeln." },
];

// ---------------------------------------------------------------------------
//  Exam blueprints
//
//  The actual architecture of the exams people sit, part by part, taken from
//  the providers' own Modellsätze and Durchführungsbestimmungen (see
//  data/sources.js for the links). `typeId` wires each Teil to the exercise
//  type above, so a blueprint row is clickable straight into the trick.
//
//  Formats get revised. Always cross-check the current Modellsatz of the exam
//  you booked — this is a map, not a guarantee.
// ---------------------------------------------------------------------------

export const EXAM_FORMATS = [
  {
    id: "goethe-a2",
    name: "Goethe-Zertifikat A2",
    provider: "Goethe-Institut",
    level: "A2",
    scope: "Allgemeinsprachlich · modular ablegbar",
    pass: "Schriftlich mind. 45 von 75 Punkten, Sprechen mind. 15 von 25 Punkten",
    url: "https://www.goethe.de/pro/relaunch/prf/materialien/A2/A2_Modellsatz_Erwachsene.pdf",
    parts: [
      { label: "Lesen", time: "30 Min.", items: "20 Aufgaben in 4 Teilen", teile: [
        { n: "Teil 1", text: "Zeitungsartikel", format: "Multiple Choice a/b/c", items: "5", typeId: "lesen-mc" },
        { n: "Teil 2", text: "Wegweiser / Informationstafel", format: "Zuordnung: Wo finde ich was?", items: "5", typeId: "zuordnung" },
        { n: "Teil 3", text: "Private E-Mail", format: "Multiple Choice a/b/c", items: "5", typeId: "lesen-mc" },
        { n: "Teil 4", text: "6 Internet-Anzeigen", format: "Zuordnung, «X» wenn keine passt", items: "5", typeId: "zuordnung" },
      ] },
      { label: "Hören", time: "30 Min.", items: "4 Teile", teile: [
        { n: "Teil 1–4", text: "Radiosendungen, Gespräche, Anrufbeantworter, Durchsagen", format: "Multiple Choice und richtig/falsch", items: "—", typeId: "hoeren-ansagen" },
      ] },
      { label: "Schreiben", time: "30 Min.", items: "2 Aufgaben", teile: [
        { n: "Aufgabe 1", text: "Persönliche Mitteilung (Kontakt halten)", format: "Freies Schreiben", items: "—", typeId: "schreiben-informell" },
        { n: "Aufgabe 2", text: "Halboffizielle Mitteilung (Handeln regeln)", format: "Freies Schreiben", items: "—", typeId: "schreiben-formell" },
      ] },
      { label: "Sprechen", time: "ca. 15 Min. zu zweit", items: "3 Teile", teile: [
        { n: "Teil 1", text: "Sich vorstellen, Fragen zur Person", format: "Dialog mit Prüfenden", items: "—", typeId: "sprechen-vorstellung" },
        { n: "Teil 2–3", text: "Über Karten sprechen, gemeinsam etwas planen", format: "Partnerdialog", items: "—", typeId: "sprechen-diskussion" },
      ] },
    ],
  },

  {
    id: "goethe-b1",
    name: "Goethe-Zertifikat B1",
    provider: "Goethe-Institut",
    level: "B1",
    scope: "Allgemeinsprachlich · modular, jedes Modul einzeln wiederholbar",
    pass: "60 von 100 Punkten pro Modul",
    url: "https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf",
    parts: [
      { label: "Lesen", time: "65 Min.", items: "30 Aufgaben in 5 Teilen", teile: [
        { n: "Teil 1", text: "Blogeintrag", format: "richtig / falsch", items: "6 · ca. 10 Min.", typeId: "richtig-falsch" },
        { n: "Teil 2", text: "Zwei Presseartikel", format: "Multiple Choice a/b/c", items: "6 · ca. 20 Min.", typeId: "lesen-mc" },
        { n: "Teil 3", text: "Zehn Anzeigen", format: "Situationen zuordnen", items: "7", typeId: "zuordnung" },
        { n: "Teil 4", text: "Leserkommentare", format: "Position bestimmen: dafür / dagegen", items: "7 · ca. 15 Min.", typeId: "meinungen-zuordnen" },
        { n: "Teil 5", text: "Hausordnung / Regeltext", format: "Multiple Choice a/b/c", items: "4 · ca. 10 Min.", typeId: "lesen-mc" },
      ] },
      { label: "Hören", time: "40 Min.", items: "30 Aufgaben in 4 Teilen", teile: [
        { n: "Teil 1", text: "Fünf kurze Texte", format: "richtig/falsch + Multiple Choice · ZWEIMAL", items: "10", typeId: "hoeren-ansagen" },
        { n: "Teil 2", text: "Museumsführung (Monolog)", format: "Multiple Choice · nur EINMAL", items: "5", typeId: "hoeren-interview" },
        { n: "Teil 3", text: "Gespräch an der Bushaltestelle", format: "richtig / falsch · nur EINMAL", items: "7", typeId: "richtig-falsch" },
        { n: "Teil 4", text: "Radiodiskussion", format: "Wer sagt was? · ZWEIMAL", items: "8", typeId: "meinungen-zuordnen" },
      ] },
      { label: "Schreiben", time: "60 Min.", items: "3 Aufgaben", teile: [
        { n: "Aufgabe 1", text: "E-Mail an eine Freundin", format: "ca. 80 Wörter · ca. 20 Min.", items: "—", typeId: "schreiben-informell" },
        { n: "Aufgabe 2", text: "Diskussionsbeitrag im Forum", format: "ca. 80 Wörter · ca. 25 Min.", items: "—", typeId: "schreiben-eroerterung" },
        { n: "Aufgabe 3", text: "Halbformelle E-Mail (Absage, Entschuldigung)", format: "ca. 40 Wörter · ca. 15 Min.", items: "—", typeId: "schreiben-formell" },
      ] },
      { label: "Sprechen", time: "ca. 15 Min. zu zweit", items: "3 Teile", teile: [
        { n: "Teil 1", text: "Gemeinsam etwas planen", format: "Partnerdialog", items: "—", typeId: "sprechen-diskussion" },
        { n: "Teil 2", text: "Präsentation zu einem Thema", format: "Kurzvortrag mit Folienstichpunkten", items: "—", typeId: "sprechen-praesentation" },
        { n: "Teil 3", text: "Rückmeldung und Fragen zur Präsentation", format: "Dialog", items: "—", typeId: "sprechen-praesentation" },
      ] },
    ],
  },

  {
    id: "goethe-b2",
    name: "Goethe-Zertifikat B2",
    provider: "Goethe-Institut",
    level: "B2",
    scope: "Allgemeinsprachlich · modular · Fassung seit 2019",
    pass: "60 von 100 Punkten pro Modul",
    url: "https://www.goethe.de/pro/relaunch/prf/materialien/B2/b2_modellsatz_erwachsene.pdf",
    parts: [
      { label: "Lesen", time: "65 Min.", items: "30 Aufgaben in 5 Teilen", teile: [
        { n: "Teil 1", text: "Forumsbeiträge von vier Personen", format: "Aussagen den Personen zuordnen", items: "9 · ca. 18 Min.", typeId: "meinungen-zuordnen" },
        { n: "Teil 2", text: "Zeitschriftenartikel", format: "Sätze in Lücken einsetzen", items: "6 · ca. 12 Min.", typeId: "textrekonstruktion" },
        { n: "Teil 3", text: "Zeitungsartikel", format: "Multiple Choice a/b/c", items: "6 · ca. 12 Min.", typeId: "lesen-mc" },
        { n: "Teil 4", text: "Acht Meinungsäußerungen", format: "Überschriften zuordnen", items: "6 · ca. 12 Min.", typeId: "meinungen-zuordnen" },
        { n: "Teil 5", text: "Studien- oder Prüfungsordnung", format: "Abschnitte zuordnen", items: "3 · ca. 6 Min.", typeId: "zuordnung" },
      ] },
      { label: "Hören", time: "40 Min.", items: "30 Aufgaben in 4 Teilen", teile: [
        { n: "Teil 1", text: "Fünf kurze Gespräche und Äußerungen", format: "richtig/falsch + Multiple Choice · nur EINMAL", items: "10", typeId: "hoeren-ansagen" },
        { n: "Teil 2", text: "Radiointerview mit einer Fachperson", format: "Multiple Choice a/b/c · ZWEIMAL", items: "6", typeId: "hoeren-interview" },
        { n: "Teil 3", text: "Radiogespräch mit mehreren Personen", format: "Wer sagt was? (3 Optionen) · nur EINMAL", items: "6", typeId: "meinungen-zuordnen" },
        { n: "Teil 4", text: "Kurzvortrag", format: "Multiple Choice a/b/c · ZWEIMAL", items: "8", typeId: "hoeren-interview" },
      ] },
      { label: "Schreiben", time: "75 Min.", items: "2 Aufgaben", teile: [
        { n: "Aufgabe 1", text: "Forumsbeitrag: Meinung begründen", format: "ca. 150 Wörter · ca. 50 Min.", items: "—", typeId: "schreiben-eroerterung" },
        { n: "Aufgabe 2", text: "Formelle Nachricht an eine Institution", format: "ca. 100 Wörter · ca. 25 Min.", items: "—", typeId: "schreiben-formell" },
      ] },
      { label: "Sprechen", time: "ca. 15 Min. zu zweit", items: "2 Teile", teile: [
        { n: "Teil 1", text: "Vortrag zu einem Thema, dann Nachfragen", format: "Kurzvortrag + Diskussion", items: "—", typeId: "sprechen-praesentation" },
        { n: "Teil 2", text: "Diskussion mit dem Partner", format: "Standpunkte aushandeln", items: "—", typeId: "sprechen-diskussion" },
      ] },
    ],
  },

  {
    id: "goethe-c1",
    name: "Goethe-Zertifikat C1",
    provider: "Goethe-Institut",
    level: "C1",
    scope: "Allgemeinsprachlich · modular ablegbar",
    pass: "60 von 100 Punkten pro Modul",
    url: "https://www.goethe.de/de/spr/prf/ueb/pc1.html",
    parts: [
      { label: "Lesen", time: "ca. 70 Min.", items: "30 Aufgaben in 4 Teilen", teile: [
        { n: "Teil 1", text: "Längerer Sachtext", format: "Lückenergänzung / Zuordnung", items: "—", typeId: "textrekonstruktion" },
        { n: "Teil 2", text: "Essayistischer oder wissenschaftlicher Text", format: "Multiple Choice", items: "—", typeId: "lesen-mc" },
        { n: "Teil 3", text: "Wortschatzteil im Kontext", format: "Lücken ohne Vorgabe / Auswahl", items: "—", typeId: "lueckentext-frei" },
        { n: "Teil 4", text: "Meinungen und Standpunkte", format: "Zuordnung", items: "—", typeId: "meinungen-zuordnen" },
      ] },
      { label: "Hören", time: "ca. 40 Min.", items: "2 Hörtexte", teile: [
        { n: "Teil 1", text: "Informelles Gespräch", format: "Notizen ergänzen · nur EINMAL", items: "—", typeId: "hoeren-notizen" },
        { n: "Teil 2", text: "Interview oder Diskussion aus dem Radio", format: "Multiple Choice · ZWEIMAL", items: "—", typeId: "hoeren-interview" },
      ] },
      { label: "Schreiben", time: "ca. 80 Min.", items: "2 Aufgaben", teile: [
        { n: "Aufgabe 1", text: "Erörterung, oft mit Grafik als Einstieg", format: "Zusammenhängender Text, ca. 230–350 Wörter", items: "—", typeId: "schreiben-eroerterung" },
        { n: "Aufgabe 2", text: "Text umformen / Lücken im formellen Brief", format: "Umformung und Register", items: "—", typeId: "umformung" },
      ] },
      { label: "Sprechen", time: "ca. 15 Min. zu zweit", items: "2 Teile", teile: [
        { n: "Teil 1", text: "Kurzvortrag auf Basis von Notizen", format: "Monolog mit Gliederung", items: "—", typeId: "sprechen-praesentation" },
        { n: "Teil 2", text: "Diskussion, gemeinsame Entscheidung", format: "Partnerdialog", items: "—", typeId: "sprechen-diskussion" },
      ] },
    ],
    note: "Das C1-Format wurde modularisiert. Prüfe die Teile immer gegen den aktuellen Modellsatz deines Prüfungszentrums.",
  },

  {
    id: "telc-b2",
    name: "telc Deutsch B2",
    provider: "telc gGmbH",
    level: "B2",
    scope: "Allgemeinsprachlich · schriftlicher Teil 2 Std. 20 Min. am Stück",
    pass: "60 % der Gesamtpunkte (300 Punkte insgesamt)",
    url: "https://www.telc.net",
    parts: [
      { label: "Leseverstehen", time: "Block mit Sprachbausteinen: 90 Min.", items: "max. 75 Punkte", teile: [
        { n: "Teil 1", text: "Überschriften zu Textabschnitten", format: "Zuordnung", items: "—", typeId: "zuordnung" },
        { n: "Teil 2", text: "Längerer Artikel", format: "Multiple Choice", items: "—", typeId: "lesen-mc" },
        { n: "Teil 3", text: "Anzeigen und Situationen", format: "Zuordnung, mit Distraktoren", items: "—", typeId: "zuordnung" },
      ] },
      { label: "Sprachbausteine", time: "im 90-Min.-Block enthalten", items: "20 Aufgaben · max. 30 Punkte (je 1,5)", teile: [
        { n: "Teil 1", text: "Zusammenhängender Text (ca. 250 Wörter), Grammatik", format: "10 Lücken mit je 3 Optionen", items: "Aufgaben 21–30", typeId: "lueckentext-auswahl" },
        { n: "Teil 2", text: "Zweiter Text, Wortschatz", format: "10 Lücken, 15 Wörter zur Auswahl", items: "Aufgaben 31–40", typeId: "lueckentext-frei" },
      ] },
      { label: "Hörverstehen", time: "ca. 20 Min.", items: "max. 75 Punkte in 3 Teilen", teile: [
        { n: "Teil 1", text: "Globalverstehen: kurze Beiträge", format: "richtig / falsch", items: "—", typeId: "hoeren-ansagen" },
        { n: "Teil 2", text: "Detailverstehen: Interview", format: "richtig / falsch", items: "—", typeId: "hoeren-interview" },
        { n: "Teil 3", text: "Selektives Verstehen: kurze Ansagen", format: "richtig / falsch", items: "—", typeId: "hoeren-ansagen" },
      ] },
      { label: "Schriftlicher Ausdruck", time: "30 Min.", items: "max. 45 Punkte", teile: [
        { n: "Aufgabe", text: "Brief oder Beitrag zu einem von zwei Themen", format: "Freier Text mit Leitpunkten", items: "—", typeId: "schreiben-formell" },
      ] },
      { label: "Mündlicher Ausdruck", time: "ca. 15 Min. zu zweit", items: "max. 75 Punkte", teile: [
        { n: "Teil 1", text: "Präsentation", format: "Kurzvortrag", items: "—", typeId: "sprechen-praesentation" },
        { n: "Teil 2–3", text: "Diskussion und gemeinsame Aufgabe", format: "Partnerdialog", items: "—", typeId: "sprechen-diskussion" },
      ] },
    ],
  },

  {
    id: "telc-c1-hochschule",
    name: "telc Deutsch C1 Hochschule",
    provider: "telc gGmbH",
    level: "C1",
    scope: "Hochschulzugang · Punkte pro Prüfungsteil exakt festgelegt",
    pass: "mind. 60 % der Gesamtpunkte",
    url: "https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_c1_hochschule_Handbuch.pdf",
    parts: [
      { label: "Leseverstehen", time: "90 Min. (mit Sprachbausteinen)", items: "48 Punkte in 4 Teilen", teile: [
        { n: "Teil 1", text: "Textrekonstruktion", format: "6 Zuordnungsaufgaben", items: "12 Punkte", typeId: "textrekonstruktion" },
        { n: "Teil 2", text: "Selektives Verstehen", format: "6 Zuordnungsaufgaben", items: "12 Punkte", typeId: "zuordnung" },
        { n: "Teil 3", text: "Detailverstehen", format: "11 × richtig / falsch / nicht im Text", items: "22 Punkte", typeId: "richtig-falsch" },
        { n: "Teil 4", text: "Globalverstehen", format: "1 Makroaufgabe", items: "2 Punkte", typeId: "lesen-mc" },
      ] },
      { label: "Sprachbausteine", time: "22 Min.", items: "22 Aufgaben · 22 Punkte", teile: [
        { n: "Sprachbausteine", text: "Grammatik und Lexik im Text", format: "22 Vierfachwahl-Aufgaben", items: "1 Punkt je Aufgabe", typeId: "lueckentext-auswahl" },
      ] },
      { label: "Hörverstehen", time: "ca. 40 Min.", items: "48 Punkte in 3 Teilen", teile: [
        { n: "Teil 1", text: "Globalverstehen", format: "8 Zuordnungsaufgaben", items: "8 Punkte", typeId: "hoeren-ansagen" },
        { n: "Teil 2", text: "Detailverstehen", format: "10 × Multiple Choice (3 Optionen)", items: "20 Punkte", typeId: "hoeren-interview" },
        { n: "Teil 3", text: "Informationstransfer", format: "10 Informationen ergänzen", items: "20 Punkte", typeId: "hoeren-notizen" },
      ] },
      { label: "Schriftlicher Ausdruck", time: "70 Min.", items: "48 Punkte", teile: [
        { n: "Aufgabe", text: "Erörterung / Stellungnahme", format: "Zusammenhängender Text", items: "—", typeId: "schreiben-eroerterung" },
      ] },
      { label: "Mündlicher Ausdruck", time: "ca. 16 Min. (mit Vorbereitung)", items: "—", teile: [
        { n: "Teil 1", text: "Präsentation", format: "Monolog", items: "—", typeId: "sprechen-praesentation" },
        { n: "Teil 2–3", text: "Diskussion und Aushandeln", format: "Dialog", items: "—", typeId: "sprechen-diskussion" },
      ] },
    ],
  },

  {
    id: "testdaf",
    name: "TestDaF",
    provider: "g.a.s.t. / TestDaF-Institut",
    level: "B2",
    scope: "Hochschulzugang · Ergebnis in Niveaustufen TDN 3, 4, 5 statt bestanden/nicht bestanden",
    pass: "TDN 4 in allen vier Teilen wird von den meisten Studiengängen verlangt",
    url: "https://www.testdaf.de/de/teilnehmende/der-papierbasierte-testdaf/aufbau-des-papierbasierten-testdaf/",
    parts: [
      { label: "Leseverstehen", time: "50 Min. + 10 Min. Übertragen", items: "3 Texte mit steigender Schwierigkeit", teile: [
        { n: "Text 1", text: "Kurztexte zum Studienalltag", format: "Zuordnung", items: "—", typeId: "zuordnung" },
        { n: "Text 2", text: "Zeitungsartikel zum Hochschulkontext", format: "Multiple Choice", items: "—", typeId: "lesen-mc" },
        { n: "Text 3", text: "Wissenschaftlicher Text", format: "ja / nein / Text sagt dazu nichts", items: "—", typeId: "richtig-falsch" },
      ] },
      { label: "Hörverstehen", time: "ca. 40 Min.", items: "3 Hörtexte", teile: [
        { n: "Text 1", text: "Gespräch aus dem Studienalltag", format: "Kurzantworten / Notizen", items: "—", typeId: "hoeren-notizen" },
        { n: "Text 2", text: "Interview oder Diskussion", format: "richtig / falsch", items: "—", typeId: "hoeren-interview" },
        { n: "Text 3", text: "Ausschnitt aus einem Vortrag", format: "Kurzantworten", items: "—", typeId: "hoeren-interview" },
      ] },
      { label: "Schriftlicher Ausdruck", time: "60 Min.", items: "1 Aufgabe, zwei Teile", teile: [
        { n: "Teil 1", text: "Grafik oder Tabelle beschreiben", format: "Beschreibung mit Zahlen", items: "—", typeId: "schreiben-grafik" },
        { n: "Teil 2", text: "Position zu einer strittigen Frage", format: "Argumentation mit Abwägung", items: "—", typeId: "schreiben-eroerterung" },
      ] },
      { label: "Mündlicher Ausdruck", time: "ca. 35 Min. am Computer", items: "7 Aufgaben", teile: [
        { n: "Aufgaben 1–7", text: "Studiensituationen: informieren, beraten, Grafik beschreiben, Position beziehen", format: "Antworten werden aufgezeichnet", items: "—", typeId: "sprechen-praesentation" },
      ] },
    ],
    note: "Es gibt neben dem papierbasierten TestDaF auch eine digitale Fassung mit anderem Aufgabenzuschnitt.",
  },

  {
    id: "dsh",
    name: "DSH",
    provider: "Einzelne Hochschulen",
    level: "C1",
    scope: "Hochschulzugang · jede Hochschule erstellt ihre eigene Prüfung nach der Rahmenordnung",
    pass: "DSH-1 / DSH-2 / DSH-3 — die meisten Studiengänge verlangen DSH-2 (mind. 67 %)",
    url: "https://www.llc.uni-hannover.de/de/testen-pruefen/deutschpruefungen/dsh/pruefungsbeispiele",
    parts: [
      { label: "Hörverstehen", time: "ca. 60–90 Min.", items: "Vorlesungsmitschrift", teile: [
        { n: "Hörteil", text: "Vortrag aus dem Studienkontext, zweimal gehört", format: "Notizen, Kurzantworten, Zusammenfassung", items: "—", typeId: "hoeren-notizen" },
      ] },
      { label: "Leseverstehen & wissenschaftssprachliche Strukturen", time: "ca. 90 Min.", items: "Der Teil, der die DSH ausmacht", teile: [
        { n: "Leseverstehen", text: "Wissenschaftlicher Fachtext", format: "Fragen, Zuordnung, Erklärung von Textstellen", items: "—", typeId: "lesen-mc" },
        { n: "Strukturen", text: "Sätze aus dem Text", format: "Umformungen: Passiv, Nominalstil, Partizipialattribut, Passiversatz", items: "—", typeId: "umformung" },
      ] },
      { label: "Textproduktion", time: "ca. 60–70 Min.", items: "1 Aufgabe", teile: [
        { n: "Aufgabe", text: "Grafik beschreiben und Position begründen, oder Erörterung", format: "Zusammenhängender Text", items: "—", typeId: "schreiben-grafik" },
      ] },
      { label: "Mündlicher Ausdruck", time: "ca. 20 Min.", items: "getrennte Teilprüfung", teile: [
        { n: "Prüfungsgespräch", text: "Kurzvortrag zu einem Text, dann Fachgespräch", format: "Monolog + Dialog", items: "—", typeId: "sprechen-praesentation" },
      ] },
    ],
    note: "Die DSH ist nicht zentral standardisiert. Der Teil «wissenschaftssprachliche Strukturen» ist praktisch immer eine Umformungsaufgabe — genau dafür ist der Trick auf dieser Seite gebaut.",
  },
];

export const FORMAT_BY_ID = Object.fromEntries(EXAM_FORMATS.map((f) => [f.id, f]));

