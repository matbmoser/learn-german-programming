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

import React from "react";
import { SecHead } from "./ui.jsx";

// ---------------------------------------------------------------------------
//  §2 Genus — der / die / das as something you look up rather than guess.
//  Three click-to-compare tools, all driving the same out-phrase + trace shape
//  the other Spezifikation tools use:
//    1. Genus-Signale     — every ending and meaning class, side by side
//    2. Kompositum-Kette  — the last noun wins, watch the article flip
//    3. Doppelgänger      — one spelling, two genders, two meanings
// ---------------------------------------------------------------------------

const GEN = {
  m: { art: "der", label: "Maskulin", cls: "g-m" },
  f: { art: "die", label: "Feminin", cls: "g-f" },
  n: { art: "das", label: "Neutrum", cls: "g-n" },
};
const ORDER = ["m", "f", "n"];

// sure: 3 = no exceptions worth the name · 2 = a handful · 1 = a tendency only
const SURE = { 3: "ohne Ausnahme", 2: "fast immer", 1: "Tendenz — mitlernen" };

// kind: "end" = the word's ending decides · "sem" = its meaning class decides
const SIGNALS = [
  // ---------------------------------------------------------------- der ---
  { id: "ling", g: "m", kind: "end", label: "-ling", sure: 3,
    why: "Ableitungen auf -ling sind ausnahmslos maskulin.",
    ex: [["Frühling", "spring"], ["Lehrling", "apprentice"], ["Schmetterling", "butterfly"]] },
  { id: "ismus", g: "m", kind: "end", label: "-ismus", sure: 3,
    why: "Jedes -ismus-Wort ist maskulin — auch die neu erfundenen.",
    ex: [["Kapitalismus", "capitalism"], ["Tourismus", "tourism"], ["Realismus", "realism"]] },
  { id: "ist", g: "m", kind: "end", label: "-ist", sure: 3,
    why: "Personenbezeichnungen auf -ist. Die weibliche Form nimmt -in: die Polizistin.",
    ex: [["Polizist", "police officer"], ["Journalist", "journalist"], ["Tourist", "tourist"]] },
  { id: "ant", g: "m", kind: "end", label: "-ant · -ent", sure: 2,
    why: "Wenn das Wort eine Person meint, ist es maskulin.",
    ex: [["Praktikant", "intern"], ["Student", "student"], ["Präsident", "president"]],
    warn: "Nicht-Personen kippen ins Neutrum: das Restaurant, das Prozent, das Talent." },
  { id: "or", g: "m", kind: "end", label: "-or", sure: 2,
    why: "Lateinische -or-Wörter: Geräte und Personen.",
    ex: [["Motor", "engine"], ["Doktor", "doctor"], ["Reaktor", "reactor"]],
    warn: "Ausnahme: das Labor." },
  { id: "er", g: "m", kind: "end", label: "-er", sure: 2,
    why: "Wer etwas tut oder womit man etwas tut — vom Verb abgeleitet: lehren → der Lehrer.",
    ex: [["Lehrer", "teacher"], ["Computer", "computer"], ["Fehler", "mistake"]],
    warn: "die Mutter, die Tochter, die Schwester, die Butter · das Fenster, das Wasser, das Messer, das Zimmer." },
  { id: "igich", g: "m", kind: "end", label: "-ig · -ich", sure: 2,
    why: "Kleine, alte Gruppe — aber sie hält.",
    ex: [["Honig", "honey"], ["König", "king"], ["Teppich", "carpet"]] },
  { id: "tage", g: "m", kind: "sem", label: "Tage · Monate · Jahreszeiten", sure: 3,
    why: "Der ganze Kalender ist maskulin. Ein Merksatz deckt drei Gruppen ab.",
    ex: [["Montag", "Monday"], ["Mai", "May"], ["Sommer", "summer"]],
    warn: "das Frühjahr — Kompositum, das Jahr gewinnt." },
  { id: "wetter", g: "m", kind: "sem", label: "Wetter · Himmelsrichtungen", sure: 2,
    why: "Niederschlag, Wind und die vier Richtungen.",
    ex: [["Regen", "rain"], ["Wind", "wind"], ["Norden", "north"]],
    warn: "das Eis, das Gewitter · die Sonne, die Wolke." },
  { id: "mann", g: "m", kind: "sem", label: "Männliche Personen & Tiere", sure: 3,
    why: "Natürliches Geschlecht schlägt hier durch — solange kein -chen im Weg steht.",
    ex: [["Vater", "father"], ["Onkel", "uncle"], ["Hengst", "stallion"]] },
  { id: "alk", g: "m", kind: "sem", label: "Alkohol", sure: 2,
    why: "Alle Spirituosen und Weine.",
    ex: [["Wein", "wine"], ["Whisky", "whisky"], ["Schnaps", "schnapps"]],
    warn: "das Bier — die eine Ausnahme, die zählt." },
  { id: "auto", g: "m", kind: "sem", label: "Automarken", sure: 2,
    why: "Weil der Wagen dahintersteht: der BMW, der Golf.",
    ex: [["BMW", "the BMW (car)"], ["Golf", "the Golf"], ["Ferrari", "the Ferrari"]],
    warn: "Motorräder sind weiblich — die Maschine: die BMW, die Harley." },
  { id: "stein", g: "m", kind: "sem", label: "Gesteine & Mineralien", sure: 2,
    why: "Steine und Kristalle.",
    ex: [["Granit", "granite"], ["Marmor", "marble"], ["Diamant", "diamond"]] },

  // ---------------------------------------------------------------- die ---
  { id: "ung", g: "f", kind: "end", label: "-ung", sure: 3,
    why: "Verb → Nomen: wohnen → die Wohnung. Die produktivste Endung im Deutschen.",
    ex: [["Wohnung", "flat"], ["Zeitung", "newspaper"], ["Übung", "exercise"]],
    warn: "Nur die Ableitung zählt, nicht die Buchstaben: der Sprung, der Schwung." },
  { id: "heit", g: "f", kind: "end", label: "-heit · -keit", sure: 3,
    why: "Adjektiv → Abstraktum: frei → die Freiheit.",
    ex: [["Freiheit", "freedom"], ["Möglichkeit", "possibility"], ["Krankheit", "illness"]] },
  { id: "schaft", g: "f", kind: "end", label: "-schaft", sure: 3,
    why: "Zustand oder Gruppe: der Freund → die Freundschaft.",
    ex: [["Freundschaft", "friendship"], ["Wissenschaft", "science"], ["Mannschaft", "team"]] },
  { id: "tion", g: "f", kind: "end", label: "-tion · -sion", sure: 3,
    why: "Internationaler Wortschatz — meist identisch zum Englischen, nur weiblich.",
    ex: [["Nation", "nation"], ["Diskussion", "discussion"], ["Situation", "situation"]] },
  { id: "taet", g: "f", kind: "end", label: "-tät · -ität", sure: 3,
    why: "Entspricht dem englischen -ty: quality → die Qualität.",
    ex: [["Universität", "university"], ["Qualität", "quality"], ["Realität", "reality"]] },
  { id: "anz", g: "f", kind: "end", label: "-anz · -enz", sure: 3,
    why: "Entspricht dem englischen -ance / -ence.",
    ex: [["Distanz", "distance"], ["Konferenz", "conference"], ["Toleranz", "tolerance"]] },
  { id: "ik", g: "f", kind: "end", label: "-ik", sure: 2,
    why: "Fachgebiete und Disziplinen.",
    ex: [["Musik", "music"], ["Politik", "politics"], ["Grammatik", "grammar"]] },
  { id: "ur", g: "f", kind: "end", label: "-ur", sure: 2,
    why: "Aus dem Lateinischen entlehnt.",
    ex: [["Natur", "nature"], ["Kultur", "culture"], ["Figur", "figure"]],
    warn: "das Abitur, das Futur." },
  { id: "ie", g: "f", kind: "end", label: "-ie", sure: 2,
    why: "Wissenschaften und Sammelbegriffe.",
    ex: [["Familie", "family"], ["Energie", "energy"], ["Chemie", "chemistry"]],
    warn: "das Genie." },
  { id: "ei", g: "f", kind: "end", label: "-ei", sure: 2,
    why: "Orte des Handwerks: backen → die Bäckerei.",
    ex: [["Bäckerei", "bakery"], ["Polizei", "police"], ["Türkei", "Turkey"]],
    warn: "das Ei ist keine -ei-Ableitung, sondern das ganze Wort." },
  { id: "in", g: "f", kind: "end", label: "-in", sure: 3,
    why: "Die weibliche Form jeder Personenbezeichnung: der Arzt → die Ärztin.",
    ex: [["Lehrerin", "teacher (f.)"], ["Ärztin", "doctor (f.)"], ["Freundin", "friend (f.)"]] },
  { id: "eend", g: "f", kind: "end", label: "-e (zweisilbig)", sure: 1,
    why: "Rund drei Viertel der zweisilbigen -e-Wörter sind weiblich. Nützlich zum Raten, nicht zum Verlassen.",
    ex: [["Lampe", "lamp"], ["Blume", "flower"], ["Karte", "card"]],
    warn: "der Name, der Junge, der Käse · das Auge, das Ende, das Erbe." },
  { id: "frau", g: "f", kind: "sem", label: "Weibliche Personen", sure: 2,
    why: "Natürliches Geschlecht — aber nur, wenn keine Endung dazwischenfunkt.",
    ex: [["Frau", "woman"], ["Mutter", "mother"], ["Ärztin", "doctor (f.)"]],
    warn: "das Mädchen, das Fräulein — -chen schlägt die Bedeutung." },
  { id: "zahl", g: "f", kind: "sem", label: "Zahlen als Nomen", sure: 3,
    why: "Die Zahl steht dahinter, also weiblich.",
    ex: [["Eins", "the one"], ["Null", "the zero"], ["Million", "million"]] },
  { id: "baum", g: "f", kind: "sem", label: "Bäume & Blumen", sure: 2,
    why: "Fast die ganze Botanik ist weiblich.",
    ex: [["Eiche", "oak"], ["Rose", "rose"], ["Tulpe", "tulip"]],
    warn: "der Ahorn, der Holunder · das Veilchen (-chen gewinnt)." },
  { id: "obst", g: "f", kind: "sem", label: "Früchte & Beeren", sure: 2,
    why: "Obst folgt der Botanik.",
    ex: [["Banane", "banana"], ["Birne", "pear"], ["Erdbeere", "strawberry"]],
    warn: "der Apfel, der Pfirsich." },
  { id: "schiff", g: "f", kind: "sem", label: "Schiffe · Flugzeuge · Motorräder", sure: 2,
    why: "Fahrzeuge, die man traditionell weiblich behandelt.",
    ex: [["Titanic", "the Titanic"], ["Boeing", "the Boeing"], ["Harley", "the Harley"]],
    warn: "Autos bleiben maskulin: der BMW." },

  // ---------------------------------------------------------------- das ---
  { id: "chen", g: "n", kind: "end", label: "-chen · -lein", sure: 3,
    why: "Die Verkleinerung überschreibt alles — auch das natürliche Geschlecht.",
    ex: [["Mädchen", "girl"], ["Brötchen", "bread roll"], ["Fräulein", "young lady"]],
    warn: "Genau deshalb: das Mädchen, obwohl es eine Person weiblichen Geschlechts ist." },
  { id: "um", g: "n", kind: "end", label: "-um", sure: 2,
    why: "Lateinische Neutra. Plural oft auf -en: das Museum → die Museen.",
    ex: [["Museum", "museum"], ["Datum", "date"], ["Zentrum", "centre"]],
    warn: "der Konsum, der Reichtum, der Irrtum — die -tum-Wörter sind sonst neutral (das Eigentum), diese beiden nicht." },
  { id: "ment", g: "n", kind: "end", label: "-ment", sure: 2,
    why: "Entspricht dem englischen -ment.",
    ex: [["Dokument", "document"], ["Instrument", "instrument"], ["Argument", "argument"]],
    warn: "der Moment (Augenblick), der Zement." },
  { id: "zeug", g: "n", kind: "end", label: "-zeug · -tel", sure: 3,
    why: "-zeug erbt von das Zeug, -tel bildet Bruchteile.",
    ex: [["Werkzeug", "tool"], ["Flugzeug", "aeroplane"], ["Viertel", "quarter"]] },
  { id: "nis", g: "n", kind: "end", label: "-nis", sure: 1,
    why: "Mehrheitlich neutral, aber mit einer festen Gruppe weiblicher Ausnahmen.",
    ex: [["Ergebnis", "result"], ["Verhältnis", "ratio"], ["Zeugnis", "report"]],
    warn: "die Erlaubnis, die Kenntnis, die Erkenntnis, die Wildnis, die Finsternis." },
  { id: "ge", g: "n", kind: "end", label: "Ge-", sure: 2,
    why: "Das Präfix Ge- bündelt viele Einzeldinge zu einem Sammelbegriff.",
    ex: [["Gebäude", "building"], ["Gemüse", "vegetables"], ["Gebirge", "mountain range"]],
    warn: "der Gedanke, der Gewinn, der Geschmack · die Geschichte, die Gefahr." },
  { id: "inf", g: "n", kind: "end", label: "Infinitiv als Nomen", sure: 3,
    why: "Jedes Verb wird großgeschrieben zum Neutrum: essen → das Essen.",
    ex: [["Essen", "eating / food"], ["Lernen", "learning"], ["Schwimmen", "swimming"]] },
  { id: "adj", g: "n", kind: "end", label: "Adjektiv als Nomen", sure: 3,
    why: "Solange keine Person gemeint ist: das Gute, aber der Alte.",
    ex: [["Gute", "the good"], ["Neue", "the new"], ["Beste", "the best"]] },
  { id: "jung", g: "n", kind: "sem", label: "Junge Lebewesen", sure: 2,
    why: "Junge Lebewesen sind meist sächlich, solange sie keinen eigenen Namen bekommen.",
    ex: [["Kind", "child"], ["Baby", "baby"], ["Kalb", "calf"]],
    warn: "der Welpe, der Säugling, der Junge — Wortbildung schlägt die Bedeutungsgruppe." },
  { id: "metall", g: "n", kind: "sem", label: "Metalle", sure: 2,
    why: "Reine Metalle sind fast durchgehend sächlich.",
    ex: [["Gold", "gold"], ["Eisen", "iron"], ["Kupfer", "copper"]],
    warn: "Nichtmetalle folgen der Regel NICHT: der Sauerstoff, der Stickstoff, der Kohlenstoff, der Schwefel, der Phosphor. Legierungen ebenfalls nicht: der Stahl, die Bronze." },
  { id: "farbe", g: "n", kind: "sem", label: "Farben · Sprachen · Buchstaben", sure: 3,
    why: "Alles, was als abstrakte Bezeichnung gebraucht wird.",
    ex: [["Blau", "the blue"], ["Deutsch", "German"], ["A", "the letter A"]] },
  { id: "land", g: "n", kind: "sem", label: "Länder · Städte · Kontinente", sure: 2,
    why: "Sichtbar erst mit Adjektiv, weil der Artikel sonst wegfällt: das moderne Berlin.",
    ex: [["moderne Berlin", "modern Berlin"], ["schöne Italien", "beautiful Italy"], ["ganze Europa", "all of Europe"]],
    warn: "Mit festem Artikel: die Schweiz, die Türkei, der Iran, die USA (Plural)." },
  { id: "hotel", g: "n", kind: "sem", label: "Hotels · Cafés · Kinos", sure: 2,
    why: "Häuser, in die man geht.",
    ex: [["Hilton", "the Hilton"], ["Kino", "cinema"], ["Café", "café"]] },
];

const KOMPOSITA = [
  { id: "handschuh", word: "Handschuh", en: "glove", pl: "die Handschuhe",
    parts: [{ g: "f", w: "Hand" }, { g: "m", w: "Schuh" }] },
  { id: "haustuer", word: "Haustür", en: "front door", pl: "die Haustüren",
    parts: [{ g: "n", w: "Haus" }, { g: "f", w: "Tür" }] },
  { id: "weinglas", word: "Weinglas", en: "wine glass", pl: "die Weingläser",
    parts: [{ g: "m", w: "Wein" }, { g: "n", w: "Glas" }] },
  { id: "autobahn", word: "Autobahn", en: "motorway", pl: "die Autobahnen",
    parts: [{ g: "n", w: "Auto" }, { g: "f", w: "Bahn" }] },
  { id: "bahnhof", word: "Bahnhof", en: "railway station", pl: "die Bahnhöfe",
    parts: [{ g: "f", w: "Bahn" }, { g: "m", w: "Hof" }] },
  { id: "sonnenschein", word: "Sonnenschein", en: "sunshine", pl: "—",
    parts: [{ g: "f", w: "Sonne" }, { g: "m", w: "Schein" }],
    fuge: "Fugen-n: Sonne + n + Schein" },
  { id: "jahreszeit", word: "Jahreszeit", en: "season", pl: "die Jahreszeiten",
    parts: [{ g: "n", w: "Jahr" }, { g: "f", w: "Zeit" }],
    fuge: "Fugen-es: Jahr + es + Zeit" },
  { id: "arbeitsplatz", word: "Arbeitsplatz", en: "workplace", pl: "die Arbeitsplätze",
    parts: [{ g: "f", w: "Arbeit" }, { g: "m", w: "Platz" }],
    fuge: "Fugen-s: Arbeit + s + Platz" },
  { id: "kindergarten", word: "Kindergarten", en: "kindergarten", pl: "die Kindergärten",
    parts: [{ g: "n", w: "Kind" }, { g: "m", w: "Garten" }],
    fuge: "Fugen-er: Kind + er + Garten" },
  { id: "haustuerschluessel", word: "Haustürschlüssel", en: "front-door key", pl: "die Haustürschlüssel",
    parts: [{ g: "n", w: "Haus" }, { g: "f", w: "Tür" }, { g: "m", w: "Schlüssel" }] },
];

const DOPPEL = [
  { w: "See", forms: {
    m: { mean: "Binnengewässer", en: "lake", ex: "Wir schwimmen im See." },
    f: { mean: "Meer, offenes Wasser", en: "sea", ex: "Das Schiff sticht in See." } } },
  { w: "Band", forms: {
    m: { mean: "Buch einer Reihe", en: "volume", ex: "Der zweite Band ist besser." },
    f: { mean: "Musikgruppe (aus dem Englischen)", en: "band", ex: "Die Band spielt heute." },
    n: { mean: "Schleife, Klebeband", en: "ribbon, tape", ex: "Das Band um das Geschenk ist rot." } } },
  { w: "Teil", forms: {
    m: { mean: "Anteil an einem Ganzen", en: "part, share", ex: "Der erste Teil des Films war besser." },
    n: { mean: "einzelnes Stück, Bauteil", en: "component, item", ex: "Das Teil kostet 20 Euro." } } },
  { w: "Steuer", forms: {
    f: { mean: "Abgabe an den Staat", en: "tax", ex: "Ich zahle jedes Jahr Steuern." },
    n: { mean: "Lenkrad", en: "steering wheel", ex: "Er sitzt am Steuer." } } },
  { w: "Leiter", forms: {
    m: { mean: "Person, die etwas leitet", en: "manager, conductor", ex: "Der Leiter der Abteilung heißt Klein." },
    f: { mean: "Gerät zum Steigen", en: "ladder", ex: "Die Leiter steht an der Wand." } } },
  { w: "Kiefer", forms: {
    m: { mean: "Knochen im Gesicht", en: "jaw", ex: "Mein Kiefer tut weh." },
    f: { mean: "Nadelbaum", en: "pine tree", ex: "Die Kiefer wächst auf Sand." } } },
  { w: "Schild", forms: {
    m: { mean: "Schutzwaffe", en: "shield", ex: "Der Ritter hebt den Schild." },
    n: { mean: "Hinweistafel", en: "sign", ex: "Das Schild zeigt nach links." } } },
  { w: "Gehalt", forms: {
    m: { mean: "inhaltlicher Anteil", en: "content, substance", ex: "Der Gehalt an Vitamin C ist hoch." },
    n: { mean: "Lohn, Bezahlung", en: "salary", ex: "Mein Gehalt kommt am Ersten." } } },
  { w: "Moment", forms: {
    m: { mean: "Augenblick", en: "moment", ex: "Einen Moment, bitte!" },
    n: { mean: "ausschlaggebender Faktor", en: "factor", ex: "Das entscheidende Moment war der Zeitdruck." } } },
  { w: "Erbe", forms: {
    m: { mean: "Person, die erbt", en: "heir", ex: "Der Erbe verkauft das Haus." },
    n: { mean: "das Vererbte", en: "inheritance, heritage", ex: "Das Erbe wurde geteilt." } } },
];

function Meter({ level }) {
  return (
    <span className="sure-meter" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= level ? "on" : ""} />
      ))}
    </span>
  );
}

// --- Tool 1: every signal, three columns, one shared readout ---------------
function Signale() {
  const [id, setId] = React.useState("ung");
  const [hide, setHide] = React.useState(false);
  const [shown, setShown] = React.useState({});

  const s = SIGNALS.find((x) => x.id === id);
  const gen = GEN[s.g];
  // true while the answer for the current signal is still covered
  const masked = hide && !shown[s.ex[0][0]];

  const choose = (next) => {
    setId(next);
    setShown({});
  };

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Genus-Signale · click any signal, compare across the three columns</span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          aria-pressed={hide}
          onClick={() => { setHide((h) => !h); setShown({}); }}
        >
          {hide ? "Artikel zeigen" : "Artikel verstecken"}
        </button>
      </div>
      <div className="tool-body">
        <div className="genus-cols">
          {ORDER.map((g) => (
            <div key={g} className={"genus-col " + GEN[g].cls}>
              <div className="genus-col-head">
                <span className={"genus-art " + GEN[g].cls}>{GEN[g].art}</span>
                <span className="genus-lab">{GEN[g].label}</span>
              </div>
              {[["end", "Endung entscheidet"], ["sem", "Bedeutung entscheidet"]].map(([kind, lbl]) => (
                <div key={kind} className="genus-group">
                  <span className="eyebrow">{lbl}</span>
                  <div className="chips" role="group" aria-label={GEN[g].art + " — " + lbl}>
                    {SIGNALS.filter((x) => x.g === g && x.kind === kind).map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        className={"chip " + GEN[g].cls}
                        aria-pressed={id === x.id}
                        onClick={() => choose(x.id)}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="out" style={{ marginTop: "var(--s4)" }}>
          <div className="out-phrase">
            {/* the readout must respect "Artikel verstecken" too — otherwise it
                prints the answer directly above the blanked-out examples */}
            {masked
              ? <span className="blank">___ </span>
              : <span className={gen.cls}>{gen.art} </span>}
            <span>{s.ex[0][0]}</span>
            <span className="out-en"> · {s.ex[0][1]}</span>
          </div>
          <div className="trace">
            <span className="step">
              <span className="lbl">Signal</span>
              <span className="arrow">→ </span>
              {s.label} {s.kind === "end" ? "(Endung)" : "(Bedeutungsgruppe)"}
            </span>
            <span className="step">
              <span className="lbl">Genus</span>
              <span className="arrow">→ </span>
              {masked
                ? <span className="blank">___</span>
                : <><b className={gen.cls}>{gen.art}</b> · {gen.label}</>}
            </span>
            {/* the meter takes its colour from currentColor, so tinting this row
                by gender would leak the answer through the swatch alone */}
            <span className={"step " + (masked ? "" : gen.cls)}>
              <span className="lbl" style={{ color: "var(--ink-3)" }}>Sicherheit</span>
              <span className="arrow">→ </span>
              <Meter level={s.sure} />{" "}
              <span style={{ color: "var(--ink-2)" }}>{SURE[s.sure]}</span>
            </span>
            {/* Warum/Ausnahmen quote real noun phrases ("wohnen → die Wohnung"),
                so they are the explanation you read *after* guessing. */}
            {masked ? (
              <span className="step" style={{ color: "var(--ink-3)" }}>
                <span className="lbl">Warum</span>
                <span className="arrow">→ </span>
                <span className="why">verdeckt — erst raten, dann aufdecken</span>
              </span>
            ) : (
              <>
                <span className="step">
                  <span className="lbl">Warum</span>
                  <span className="arrow">→ </span>
                  <span className="why">{s.why}</span>
                </span>
                {s.warn && (
                  <span className="step">
                    <span className="lbl">Ausnahmen</span>
                    <span className="arrow">→ </span>
                    <span className="genus-warn">{s.warn}</span>
                  </span>
                )}
              </>
            )}
          </div>
          <div className="genus-ex">
            {s.ex.map(([w, en]) => {
              const open = !hide || shown[w];
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setShown((p) => ({ ...p, [w]: true }))}
                  aria-label={open ? gen.art + " " + w : "Artikel aufdecken: " + w}
                >
                  {open ? <span className={gen.cls}>{gen.art}</span> : <span className="blank">___</span>}
                  <span>{w}</span>
                  <span className="en">{en}</span>
                </button>
              );
            })}
            {hide && <span className="genus-ex-hint">Tippen zum Aufdecken</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tool 2: compounds — watch the article follow the last noun ------------
function Kompositum() {
  const [id, setId] = React.useState("handschuh");
  const k = KOMPOSITA.find((x) => x.id === id);
  const last = k.parts[k.parts.length - 1];
  const gen = GEN[last.g];

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Kompositum-Kette · the last noun wins, always</span>
      </div>
      <div className="tool-body">
        <div className="chips" role="group" aria-label="Kompositum">
          {KOMPOSITA.map((x) => (
            <button
              key={x.id}
              type="button"
              className="chip"
              aria-pressed={id === x.id}
              onClick={() => setId(x.id)}
            >
              {x.word}
            </button>
          ))}
        </div>

        <div className="out" style={{ marginTop: "var(--s4)" }}>
          <div className="komp-eq">
            {k.parts.map((p, i) => {
              const win = i === k.parts.length - 1;
              return (
                <React.Fragment key={p.w}>
                  {i > 0 && <span className="komp-op">+</span>}
                  <span className={"komp-part " + (win ? "is-win " + GEN[p.g].cls : "is-lose")}>
                    <span className="komp-art">{GEN[p.g].art}</span>
                    <span className="komp-w">{p.w}</span>
                    {win && <span className="komp-tag">bestimmt das Genus</span>}
                  </span>
                </React.Fragment>
              );
            })}
            <span className="komp-op">=</span>
            <span className="komp-res">
              <span className={gen.cls}>{gen.art} </span>
              {k.word}
            </span>
          </div>
          <div className="trace">
            <span className="step">
              <span className="lbl">Bestandteile</span>
              <span className="arrow">→ </span>
              {k.parts.map((p) => GEN[p.g].art + " " + p.w).join("  +  ")}
            </span>
            <span className="step">
              <span className="lbl">Regel</span>
              <span className="arrow">→ </span>
              <span className="why">Genus[Kompositum] = Genus[letztes Nomen]. Alles davor ist nur Beschreibung.</span>
            </span>
            <span className="step">
              <span className="lbl">Ergebnis</span>
              <span className="arrow">→ </span>
              <b className={gen.cls}>{gen.art} {k.word}</b> · {k.en}
            </span>
            <span className="step">
              <span className="lbl">Plural</span>
              <span className="arrow">→ </span>
              {k.pl}
            </span>
            {k.fuge && (
              <span className="step">
                <span className="lbl">Fugenelement</span>
                <span className="arrow">→ </span>
                <span className="why">{k.fuge} — verbindet nur, ändert das Genus nicht.</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tool 3: same spelling, different gender, different meaning ------------
function Doppel() {
  const [wi, setWi] = React.useState(0);
  const entry = DOPPEL[wi];
  const available = ORDER.filter((g) => entry.forms[g]);
  const [g, setG] = React.useState(available[0]);

  const active = entry.forms[g] ? g : available[0];
  const f = entry.forms[active];
  const gen = GEN[active];

  const choose = (i) => {
    setWi(i);
    const av = ORDER.filter((x) => DOPPEL[i].forms[x]);
    setG(av[0]);
  };

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Doppelgänger · same spelling, the article carries the meaning</span>
      </div>
      <div className="tool-body">
        <div className="ctrls" style={{ gridTemplateColumns: "1fr" }}>
          <div className="ctrl">
            <span className="eyebrow">Wort</span>
            <div className="chips" role="group" aria-label="Wort">
              {DOPPEL.map((d, i) => (
                <button key={d.w} type="button" className="chip" aria-pressed={wi === i} onClick={() => choose(i)}>
                  {d.w}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="ctrls" style={{ gridTemplateColumns: "1fr", marginTop: "1rem" }}>
          <div className="ctrl">
            <span className="eyebrow">Artikel — ausgegraut = gibt es nicht</span>
            <div className="chips" role="group" aria-label="Artikel">
              {ORDER.map((x) => (
                <button
                  key={x}
                  type="button"
                  className={"chip " + GEN[x].cls}
                  aria-pressed={active === x}
                  disabled={!entry.forms[x]}
                  onClick={() => setG(x)}
                >
                  {GEN[x].art} {entry.w}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="out" style={{ marginTop: "var(--s4)" }}>
          <div className="out-phrase">
            <span className={gen.cls}>{gen.art} </span>
            <span>{entry.w}</span>
            <span className="out-en"> · {f.en}</span>
          </div>
          <div className="trace">
            <span className="step">
              <span className="lbl">Bedeutung</span>
              <span className="arrow">→ </span>
              {f.mean}
            </span>
            <span className="step">
              <span className="lbl">Beispiel</span>
              <span className="arrow">→ </span>
              {f.ex}
            </span>
            <span className="step">
              <span className="lbl">Gegenprobe</span>
              <span className="arrow">→ </span>
              <span className="why">
                {available.filter((x) => x !== active)
                  .map((x) => GEN[x].art + " " + entry.w + " = " + entry.forms[x].mean)
                  .join("   ·   ")}
              </span>
            </span>
          </div>
        </div>
        <p className="body-copy">
          These are the words where guessing the article does not cost you style marks — it costs you the
          sentence. <span className="mono">Der Gehalt</span> is what is <em>in</em> something;{" "}
          <span className="mono">das Gehalt</span> is what lands in your account.
        </p>
      </div>
    </div>
  );
}

export default function GenusSection() {
  return (
    <section className="sec">
      <SecHead
        anchor="genus"
        num="§2"
        title="Gender is a lookup, not a coin flip"
        sub="der/die/das looks arbitrary because learners meet nouns one at a time. Sorted by ending, by meaning class, and by final compound part, most of the vocabulary you will ever need falls into place — and the residue is small enough to learn by heart."
      />

      <pre className="code" aria-label="Gender resolution order">
        <span className="kw">function</span> genus(nomen) {"{\n\n"}
        {"  "}<span className="cm">{"// 1. Kompositum?  nur der letzte Teil zählt — die Hand + der Schuh → der Handschuh"}</span>{"\n"}
        {"  "}<span className="kw">if</span> (istKompositum(nomen)){"     "}<span className="kw">return</span> genus(letzterTeil);{"\n\n"}
        {"  "}<span className="cm">{"// 2. Endung bekannt?  -ung → die · -chen → das · -ling → der"}</span>{"\n"}
        {"  "}<span className="kw">if</span> (SUFFIX[endung(nomen)]){"    "}<span className="kw">return</span> <b>SUFFIX</b>[endung(nomen)];{"\n\n"}
        {"  "}<span className="cm">{"// 3. Bedeutungsgruppe?  Wochentag → der · Metall → das · Blume → die"}</span>{"\n"}
        {"  "}<span className="kw">if</span> (GRUPPE[bedeutung(nomen)]) <span className="kw">return</span> <b>GRUPPE</b>[bedeutung(nomen)];{"\n\n"}
        {"  "}<span className="cm">{"// 4. Rest — mit Artikel auswendig lernen, es gibt keine Regel mehr"}</span>{"\n"}
        {"  "}<span className="kw">return</span> <b>auswendig</b>(nomen);{"\n"}
        {"}"}
      </pre>
      <p className="body-copy">
        <strong>Work down the list, stop at the first hit.</strong> The order matters: the compound check runs
        first because it overrides everything, and the ending beats the meaning — that is why{" "}
        <span className="mono">das Mädchen</span> is neuter despite naming a girl. Every chip below is one line
        of those lookup tables. Click across the three columns and watch what changes.
      </p>

      <Signale />

      <div className="law">
        <span className="eyebrow">Regel 2.1 — a noun without its article is only half-learned</span>
        <p>
          Store <span className="mono">die Karte · die Karten</span>, never <span className="mono">Karte</span>.
          The article and the plural are two more facts about the word, and no rule recovers them later. Say the
          article out loud with every new noun and the cost stays at zero.
        </p>
      </div>

      <Kompositum />

      <div className="law">
        <span className="eyebrow">Regel 2.2 — the plural erases gender</span>
        <p>
          <b className="g-m">der</b> Mann · <b className="g-f">die</b> Frau · <b className="g-n">das</b> Kind →{" "}
          <b className="g-p">die</b> Männer, <b className="g-p">die</b> Frauen, <b className="g-p">die</b> Kinder.
          One form for all three, in every case except the Dativ (<span className="mono">den Kinder<b className="nsuf">n</b></span>).
          Gender is a singular-only problem — which is why the plural <b className="g-p">die</b> above is
          colourless: it is not the feminine <b className="g-f">die</b>, it is the absence of gender.
        </p>
      </div>

      <Doppel />

      <div className="law">
        <span className="eyebrow">Regel 2.3 — form beats meaning</span>
        <p>
          When an ending and a meaning class disagree, the ending wins:{" "}
          <span className="mono">das Mädchen</span>, <span className="mono">das Veilchen</span>,{" "}
          <span className="mono">das Frühjahr</span>. Check the shape of the word before you reason about what
          it means.
        </p>
      </div>
    </section>
  );
}
