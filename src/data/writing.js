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
//  WRITING — tasks, the structures each one is meant to force, and the
//  criteria a CEFR examiner actually marks against.
// ============================================================================

export const WRITING_CRITERIA = [
  { id: "aufgabe", name: "Aufgabenerfüllung", en: "Task achievement",
    what: "Are all parts of the prompt addressed, at the required length, with a clear position?" },
  { id: "kohaerenz", name: "Kohärenz & Aufbau", en: "Coherence & structure",
    what: "Paragraphing, connector variety, visible logical progression, no orphaned sentences." },
  { id: "wortschatz", name: "Wortschatz", en: "Vocabulary range",
    what: "Precision and range; collocations; avoidance of repetition and of vague filler." },
  { id: "grammatik", name: "Grammatik", en: "Grammatical accuracy",
    what: "Case, adjective endings, verb position, tense/mood — and the range of structures attempted." },
  { id: "register", name: "Register", en: "Register",
    what: "Consistency with the text type: no speech particles in an essay, correct salutation in a letter." },
];

export const WRITING_TASKS = [
  // ---------------------------------------------------------------- A2
  { id: "a2-email-freund", level: "A2", type: "Informelle E-Mail", minWords: 60,
    title: "E-Mail an eine Freundin",
    prompt:
      "Schreiben Sie eine E-Mail an Ihre Freundin Lena. Sie waren letztes Wochenende in Berlin. Schreiben Sie: was Sie gemacht haben, wie das Wetter war, und was Ihnen am besten gefallen hat.",
    targets: ["Perfekt", "Präteritum von sein/haben", "Wechselpräpositionen", "weil / und / aber"],
    checklist: ["Anrede und Gruß", "mindestens 3 Perfektformen", "mindestens 1 Nebensatz mit weil"] },

  { id: "a2-tagesablauf", level: "A2", type: "Beschreibung", minWords: 60,
    title: "Mein typischer Tag",
    prompt:
      "Beschreiben Sie Ihren typischen Arbeitstag: wann Sie aufstehen, was Sie tun, wen Sie treffen und wann Sie Feierabend machen.",
    targets: ["Trennbare Verben", "Zeitangaben", "Wortstellung TE-KA-MO-LO", "Modalverben"],
    checklist: ["mindestens 3 trennbare Verben", "Zeitangabe auf Position 1 mit Inversion"] },

  // ---------------------------------------------------------------- B1
  { id: "b1-beschwerde", level: "B1", type: "Formeller Brief", minWords: 120,
    title: "Beschwerde über eine Lieferung",
    prompt:
      "Sie haben online einen Schreibtisch bestellt. Die Lieferung kam zwei Wochen zu spät und ein Teil war beschädigt. Schreiben Sie an den Kundenservice: schildern Sie den Sachverhalt, nennen Sie Ihre Bestellnummer, und formulieren Sie eine konkrete Forderung mit Frist.",
    targets: ["Formelle Anrede und Grußformel", "Perfekt und Präteritum", "Konjunktiv II der Höflichkeit", "Passiv"],
    checklist: ["Sehr geehrte Damen und Herren", "konkrete Frist genannt", "1 Konjunktiv-II-Bitte", "Mit freundlichen Grüßen"] },

  { id: "b1-forum", level: "B1", type: "Forumsbeitrag", minWords: 120,
    title: "Homeoffice — Ihre Meinung",
    prompt:
      "In einem Forum wird diskutiert, ob Homeoffice die Arbeit besser macht. Schreiben Sie einen Beitrag: nennen Sie Ihre Meinung, zwei Gründe und ein Beispiel aus Ihrer Erfahrung.",
    targets: ["Meinung äußern", "weil / deshalb / obwohl", "Komparativ", "Konjunktiv II für Vorschläge"],
    checklist: ["klare Position im ersten Satz", "2 unterschiedliche Konnektorklassen", "1 persönliches Beispiel"] },

  { id: "b1-erzaehlung", level: "B1", type: "Erzählung", minWords: 130,
    title: "Ein Tag, der anders lief als geplant",
    prompt:
      "Erzählen Sie von einem Tag, an dem alles anders kam als geplant. Was war der Plan, was ist passiert, und wie ging es aus?",
    targets: ["Perfekt vs. Präteritum", "Plusquamperfekt mit nachdem", "als / wenn", "Temporalsätze"],
    checklist: ["mindestens 1 Plusquamperfekt", "korrekte als/wenn-Verwendung", "chronologisch geordnet"] },

  // ---------------------------------------------------------------- B2
  { id: "b2-eroerterung", level: "B2", type: "Erörterung", minWords: 200,
    title: "Kostenloser Nahverkehr",
    prompt:
      "Mehrere Städte diskutieren, den öffentlichen Nahverkehr kostenlos zu machen. Verfassen Sie einen argumentativen Text: führen Sie das Thema ein, nennen Sie zwei Argumente dafür, gehen Sie auf einen Gegeneinwand ein und formulieren Sie ein begründetes Fazit.",
    targets: ["Nominalisierung", "Passiv", "Konjunktiv II", "zweiteilige Konnektoren", "Einräumung (zwar … aber)"],
    checklist: ["Einleitung / Hauptteil / Schluss erkennbar", "1 Gegenargument ernsthaft behandelt", "mindestens 4 verschiedene Konnektoren", "kein »ich finde« als einziges Meinungssignal"] },

  { id: "b2-grafik", level: "B2", type: "Grafikbeschreibung", minWords: 180,
    title: "Grafik: Anteil Homeoffice 2015–2024",
    prompt:
      "Eine Grafik zeigt den Anteil der Beschäftigten im Homeoffice in Deutschland: 2015: 12 %, 2019: 14 %, 2021: 38 %, 2024: 24 %. Beschreiben Sie die Entwicklung, nennen Sie den auffälligsten Wert, und geben Sie zwei mögliche Erklärungen.",
    targets: ["Grafik-Redemittel", "Komparativ / Superlativ", "Prozentangaben", "Vermutungen mit dürfte / könnte"],
    checklist: ["Quelle und Zeitraum genannt", "Höchst- und Tiefstwert benannt", "mindestens 2 Vergleichsformulierungen", "Erklärungen als Vermutung markiert"] },

  { id: "b2-stellungnahme", level: "B2", type: "Stellungnahme", minWords: 200,
    title: "Handyverbot an Schulen",
    prompt:
      "An vielen Schulen sind Handys inzwischen verboten. Nehmen Sie Stellung: Wie bewerten Sie das Verbot? Berücksichtigen Sie mindestens einen Vorteil und einen Nachteil und schließen Sie mit einer eigenen Position.",
    targets: ["Einräumung", "Passiversatz", "Nominalstil", "Modalverben subjektiv"],
    checklist: ["Vorteil und Nachteil beide ausgeführt", "eigene Position begründet", "keine Umgangssprache"] },

  // ---------------------------------------------------------------- C1
  { id: "c1-eroerterung", level: "C1", type: "Erörterung", minWords: 300,
    title: "Künstliche Intelligenz am Arbeitsplatz",
    prompt:
      "Verfassen Sie eine argumentative Erörterung zu der Frage, inwiefern der Einsatz künstlicher Intelligenz am Arbeitsplatz reguliert werden sollte. Führen Sie das Thema ein, entwickeln Sie zwei tragende Argumente mit Beleg, entkräften Sie einen ernstzunehmenden Gegeneinwand und kommen Sie zu einem begründeten Fazit.",
    targets: ["Nominalstil und Funktionsverbgefüge", "Passiversatzformen", "formelle Konnektoren (zumal, insofern, gleichwohl)", "Konjunktiv II der Vergangenheit", "erweiterte Attribute"],
    checklist: ["klar erkennbare Gliederung in 5 Abschnitte", "mindestens 2 Funktionsverbgefüge", "mindestens 1 Passiversatzform", "mindestens 3 verschiedene subordinierende Konnektoren", "keine Modalpartikeln", "Position 1 variiert"] },

  { id: "c1-brief-behoerde", level: "C1", type: "Formeller Brief", minWords: 250,
    title: "Widerspruch gegen einen Bescheid",
    prompt:
      "Sie haben von einer Behörde einen Bescheid erhalten, mit dem Ihr Antrag auf Kostenübernahme abgelehnt wurde. Verfassen Sie einen sachlichen Widerspruch: nehmen Sie Bezug auf den Bescheid, legen Sie Ihre Begründung dar, verweisen Sie auf die Unterlagen und formulieren Sie Ihr Anliegen.",
    targets: ["Amtssprache-Register", "Genitivpräpositionen", "Passiv und sein + zu", "Funktionsverbgefüge", "indirekte Rede"],
    checklist: ["Bezugnahme mit Datum und Aktenzeichen", "sachlicher Ton durchgehend", "mindestens 2 Genitivpräpositionen", "konkrete Forderung am Ende"] },

  { id: "c1-zusammenfassung", level: "C1", type: "Zusammenfassung", minWords: 200,
    title: "Zusammenfassung eines Standpunkts",
    prompt:
      "Fassen Sie den folgenden Standpunkt in eigenen Worten zusammen und ordnen Sie ihn ein.\n\n»Wer fordert, dass Städte autofrei werden, denkt zu kurz. Nicht das Auto ist das Problem, sondern die Art, wie wir Städte gebaut haben: Wohnen hier, Arbeiten dort, Einkaufen am Stadtrand. Solange diese Trennung besteht, verlagert ein Fahrverbot den Verkehr nur, statt ihn zu vermeiden. Wer den Verkehr wirklich reduzieren will, muss die Wege verkürzen — alles andere ist Symptombehandlung.«",
    targets: ["indirekte Rede mit Konjunktiv I", "Nominalisierung", "distanzierende Redemittel", "eigene Einordnung"],
    checklist: ["Kernthese in einem Satz benannt", "mindestens 3 Konjunktiv-I-Formen", "keine wörtliche Übernahme ganzer Sätze", "eigene Einordnung klar abgegrenzt"] },

  { id: "c1-mail-team", level: "C1", type: "Berufliche E-Mail", minWords: 200,
    title: "Projektverzug dem Kunden erklären",
    prompt:
      "Ein Projekt verzögert sich um sechs Wochen. Schreiben Sie eine E-Mail an den Kunden: erläutern Sie die Ursache sachlich, benennen Sie die Auswirkungen, schlagen Sie zwei Optionen vor und bitten Sie um eine Entscheidung bis zu einem konkreten Termin.",
    targets: ["diplomatisches Register", "Konjunktiv II", "Passiv", "Nominalstil", "Modalverben subjektiv"],
    checklist: ["Ursache ohne Schuldzuweisung", "zwei Optionen klar getrennt", "konkreter Entscheidungstermin", "höflich, aber nicht unterwürfig"] },
];

export const WRITING_BY_LEVEL = (level) => WRITING_TASKS.filter((t) => t.level === level);
export const TASK_BY_ID = Object.fromEntries(WRITING_TASKS.map((t) => [t.id, t]));

// ============================================================================
//  FREE-WRITING TOPIC GALLERY — prompts for open practice (no CEFR task structure)
// ============================================================================

export const TOPIC_CATEGORIES = [
  "Alltag",
  "Gesellschaft",
  "Persönliches",
  "Beruf & Karriere",
  "Natur & Umwelt",
  "Kultur & Medien",
  "Technologie",
  "Reisen",
];

export const WRITING_TOPICS = [
  // ── Alltag ──────────────────────────────────────────────────────────────
  { id: "alltag-morgenroutine", category: "Alltag", minWords: 80,
    title: "Meine Morgenroutine",
    prompt: "Beschreiben Sie Ihre ideale Morgenroutine. Was ist unverzichtbar? Was würden Sie gern ändern? Wie beeinflusst der Start in den Tag Ihre Stimmung?" },

  { id: "alltag-supermarkt", category: "Alltag", minWords: 80,
    title: "Einkaufen: online oder im Laden?",
    prompt: "Kaufen Sie lieber im Supermarkt ein oder bestellen Sie online? Schildern Sie Ihre Gewohnheiten und Ihre Meinung zu beiden Möglichkeiten." },

  { id: "alltag-kochen", category: "Alltag", minWords: 80,
    title: "Lieblingsrezept",
    prompt: "Beschreiben Sie ein Gericht, das Sie besonders mögen oder gern kochen. Wie lautet das Rezept? Was verbinden Sie damit?" },

  { id: "alltag-wohnen", category: "Alltag", minWords: 100,
    title: "Meine Traumwohnung",
    prompt: "Beschreiben Sie Ihre Traumwohnung oder Ihr Traumhaus. Wo liegt sie, wie sieht sie aus, und was ist Ihnen beim Wohnen besonders wichtig?" },

  { id: "alltag-verkehr", category: "Alltag", minWords: 80,
    title: "Wie kommen Sie zur Arbeit?",
    prompt: "Beschreiben Sie Ihren täglichen Weg zur Arbeit oder Schule. Was sind die Vor- und Nachteile Ihres Transportmittels? Würden Sie etwas ändern, wenn Sie könnten?" },

  // ── Gesellschaft ─────────────────────────────────────────────────────────
  { id: "ges-handy-tisch", category: "Gesellschaft", minWords: 120,
    title: "Handys beim Essen — ja oder nein?",
    prompt: "Viele Menschen benutzen ihr Handy beim gemeinsamen Essen. Was denken Sie darüber? Schildern Sie Ihre Beobachtungen und vertreten Sie eine klare Position." },

  { id: "ges-ehrenamt", category: "Gesellschaft", minWords: 120,
    title: "Ehrenamtliches Engagement",
    prompt: "Sollte Freiwilligenarbeit stärker gefördert oder sogar verpflichtend sein? Diskutieren Sie Pro und Contra und beziehen Sie Stellung." },

  { id: "ges-altersgrenze", category: "Gesellschaft", minWords: 120,
    title: "Wahlalter 16",
    prompt: "In einigen Ländern dürfen 16-Jährige wählen. Was halten Sie davon? Argumentieren Sie für oder gegen die Absenkung des Wahlalters." },

  { id: "ges-migration", category: "Gesellschaft", minWords: 150,
    title: "Migration und Integration",
    prompt: "Was sind die größten Chancen und Herausforderungen bei der Integration von Einwanderern? Stützen Sie Ihre Antwort auf konkrete Beispiele." },

  { id: "ges-gender-sprache", category: "Gesellschaft", minWords: 130,
    title: "Gendergerechte Sprache",
    prompt: "Gendergerechte Sprache ist umstritten. Nehmen Sie Stellung: Warum ist Sprache in dieser Debatte wichtig, und wie stehen Sie dazu?" },

  // ── Persönliches ─────────────────────────────────────────────────────────
  { id: "pers-fehler", category: "Persönliches", minWords: 100,
    title: "Ein Fehler, aus dem ich gelernt habe",
    prompt: "Erzählen Sie von einem Fehler, den Sie gemacht haben, und was Sie daraus gelernt haben. Was würden Sie heute anders machen?" },

  { id: "pers-glück", category: "Persönliches", minWords: 100,
    title: "Was bedeutet Glück für mich?",
    prompt: "Schreiben Sie über Ihre persönliche Definition von Glück. Was macht Sie wirklich glücklich, und hat sich das im Laufe der Zeit verändert?" },

  { id: "pers-vorbild", category: "Persönliches", minWords: 100,
    title: "Mein Vorbild",
    prompt: "Beschreiben Sie eine Person, die Sie bewundern — ob aus Ihrem Leben oder aus der Geschichte. Was machen sie besonders, und was haben Sie von ihnen übernommen?" },

  { id: "pers-freundschaft", category: "Persönliches", minWords: 100,
    title: "Was ist echte Freundschaft?",
    prompt: "Was bedeutet Freundschaft für Sie? Was unterscheidet eine echte Freundschaft von einer Bekanntschaft? Erzählen Sie von einer wichtigen Freundschaft." },

  { id: "pers-muttersprache", category: "Persönliches", minWords: 100,
    title: "Mehrsprachig aufgewachsen",
    prompt: "Erzählen Sie von Ihrer Beziehung zu Sprachen. Mit welchen Sprachen sind Sie aufgewachsen? Welche Rolle spielt das für Ihre Identität?" },

  // ── Beruf & Karriere ─────────────────────────────────────────────────────
  { id: "beruf-traumjob", category: "Beruf & Karriere", minWords: 120,
    title: "Mein Traumjob",
    prompt: "Beschreiben Sie Ihren Traumjob oder Ihren aktuellen Beruf. Was lieben Sie daran, was ist schwierig, und was würden Sie an Ihrem Arbeitsalltag ändern wollen?" },

  { id: "beruf-homeoffice", category: "Beruf & Karriere", minWords: 130,
    title: "Vier-Tage-Woche",
    prompt: "Viele Unternehmen testen die Vier-Tage-Woche. Würde das Ihrer Meinung nach die Produktivität steigern oder senken? Begründen Sie Ihre Meinung." },

  { id: "beruf-bewerbung", category: "Beruf & Karriere", minWords: 120,
    title: "Was macht eine gute Bewerbung aus?",
    prompt: "Was ist Ihrer Meinung nach entscheidend für eine erfolgreiche Bewerbung? Was sollte ein gutes Motivationsschreiben enthalten?" },

  { id: "beruf-ki-jobs", category: "Beruf & Karriere", minWords: 140,
    title: "Werden KI-Systeme Jobs ersetzen?",
    prompt: "Schätzen Sie ein: Welche Jobs könnten durch KI ersetzt werden, welche nicht? Was sollten Menschen lernen, um in der Arbeitswelt von morgen relevant zu bleiben?" },

  // ── Natur & Umwelt ───────────────────────────────────────────────────────
  { id: "umwelt-veganer", category: "Natur & Umwelt", minWords: 130,
    title: "Weniger Fleisch essen",
    prompt: "Sollte der Staat den Fleischkonsum durch Steuern oder Verbote einschränken? Argumentieren Sie klar für oder gegen einen solchen Eingriff." },

  { id: "umwelt-auto", category: "Natur & Umwelt", minWords: 130,
    title: "Autos aus der Innenstadt?",
    prompt: "Viele Städte wollen ihre Innenstädte autofrei machen. Was wären die Vorteile und Nachteile? Stützen Sie Ihr Argument auf konkrete Beispiele." },

  { id: "umwelt-flug", category: "Natur & Umwelt", minWords: 120,
    title: "Fliegen und schlechtes Gewissen",
    prompt: "Fühlen Sie sich schuldig, wenn Sie fliegen? Diskutieren Sie, ob individuelle Entscheidungen oder politische Maßnahmen beim Klimaschutz wichtiger sind." },

  { id: "umwelt-plastik", category: "Natur & Umwelt", minWords: 100,
    title: "Leben ohne Plastik",
    prompt: "Wie viel Plastik verbrauchen Sie täglich? Beschreiben Sie Versuche, den Plastikverbrauch zu reduzieren, und wie realistisch ein plastikfreies Leben ist." },

  // ── Kultur & Medien ──────────────────────────────────────────────────────
  { id: "medien-sozial", category: "Kultur & Medien", minWords: 130,
    title: "Soziale Medien — Fluch oder Segen?",
    prompt: "Welche positiven und negativen Auswirkungen haben soziale Medien auf Ihr Leben und auf die Gesellschaft? Nehmen Sie klar Stellung." },

  { id: "medien-buch-film", category: "Kultur & Medien", minWords: 100,
    title: "Buch oder Film?",
    prompt: "Lesen Sie lieber das Buch oder schauen Sie die Verfilmung? Beschreiben Sie ein Beispiel, das Ihnen bekannt ist, und begründen Sie Ihre Präferenz." },

  { id: "medien-fake-news", category: "Kultur & Medien", minWords: 130,
    title: "Fake News erkennen",
    prompt: "Wie können Menschen lernen, falsche Nachrichten zu erkennen? Schlagen Sie konkrete Maßnahmen vor — für Einzelpersonen und für die Gesellschaft." },

  { id: "medien-musik", category: "Kultur & Medien", minWords: 90,
    title: "Musik und Erinnerungen",
    prompt: "Gibt es ein Lied oder einen Künstler, der Sie an etwas Bestimmtes erinnert? Beschreiben Sie die Verbindung zwischen Musik und persönlichen Erinnerungen." },

  // ── Technologie ──────────────────────────────────────────────────────────
  { id: "tech-datenschutz", category: "Technologie", minWords: 140,
    title: "Datenschutz im digitalen Zeitalter",
    prompt: "Wie viel Privatsphäre geben wir im Internet preis? Ist das ein Problem, und was kann der Einzelne dagegen tun?" },

  { id: "tech-smartphonefreier-tag", category: "Technologie", minWords: 100,
    title: "Ein Tag ohne Smartphone",
    prompt: "Stellen Sie sich vor, Sie verbringen einen ganzen Tag ohne Smartphone. Was würde sich ändern? Was würden Sie vermissen, was würden Sie genießen?" },

  { id: "tech-ki-schule", category: "Technologie", minWords: 130,
    title: "KI im Unterricht",
    prompt: "Sollten Schüler KI-Werkzeuge wie ChatGPT im Unterricht nutzen dürfen? Diskutieren Sie Chancen und Risiken und formulieren Sie eine Empfehlung." },

  { id: "tech-e-health", category: "Technologie", minWords: 120,
    title: "Medizin und Technik",
    prompt: "Würden Sie eine App nutzen, die Ihre Gesundheitsdaten überwacht und analysiert? Was sind die Vorteile, und wo liegen die Grenzen?" },

  // ── Reisen ───────────────────────────────────────────────────────────────
  { id: "reisen-traumreise", category: "Reisen", minWords: 100,
    title: "Meine Traumreise",
    prompt: "Beschreiben Sie eine Reise, die Sie unbedingt machen möchten — oder eine, die Sie unvergesslich fanden. Was hat Sie dort fasziniert?" },

  { id: "reisen-kultschock", category: "Reisen", minWords: 110,
    title: "Kulturschock",
    prompt: "Haben Sie beim Reisen oder Umziehen in ein neues Land einen Kulturschock erlebt? Was war anders als erwartet, und wie haben Sie sich angepasst?" },

  { id: "reisen-massentourismus", category: "Reisen", minWords: 130,
    title: "Massentourismus",
    prompt: "Massentourismus schadet vielen Reisezielen. Wer trägt die Verantwortung: Touristen, Reiseveranstalter oder Regierungen? Nehmen Sie Stellung." },
];

export const TOPICS_BY_CATEGORY = TOPIC_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = WRITING_TOPICS.filter((t) => t.category === cat);
  return acc;
}, {});
