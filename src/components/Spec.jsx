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
import GenusSection from "./SpecGenus.jsx";
import CompareSection from "./SpecCompare.jsx";

// ---------------------------------------------------------------------------
//  Spezifikation — the visual "language spec" ported from deutsch-spec.html.
//  Static graphics + two interactive toggles (Satzklammer, Wechselpräposition).
//  The drill lives in its own §2 view, so it is not repeated here.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
//  Table markers. Both carry a screen-reader label so the meaning never lives
//  in the background colour alone.
// ---------------------------------------------------------------------------

/** Reason a highlighted cell is highlighted. Goes inside a `.hot` cell. */
function Mark({ note }) {
  return <span className="sr-only"> — {note}</span>;
}

/** An ending that belongs to the noun rather than to the article word. */
function Suf({ children }) {
  return (
    <b className="nsuf">
      {children}
      <span className="sr-only"> (Endung am Nomen)</span>
    </b>
  );
}

const KLAMMER = {
  main: {
    seg: "Hauptsatz",
    pre: ["Er"],
    frame: [
      { t: "hat", fin: true, tag: "Pos. 2 · finit" },
      { t: "gestern" },
      { t: "einen Brief" },
      { t: "geschrieben", inf: true, tag: "Ende · infinit" },
    ],
    label: "Satzklammer",
    note: "The finite verb is nailed to position 2; every other verb part waits at the very end. Everything in between — time, objects, place — lives inside the bracket.",
  },
  sub: {
    seg: "Nebensatz",
    pre: ["…,"],
    frame: [
      { t: "weil", kw: true, tag: "Konj. · linke Klammer" },
      { t: "er" },
      { t: "gestern" },
      { t: "einen Brief" },
      { t: "geschrieben", inf: true, tag: "infinit" },
      { t: "hat", fin: true, tag: "Ende · finit" },
    ],
    label: "Verb ans Ende",
    note: "A subordinating conjunction occupies the opening slot of the bracket — the slot the finite verb held in the main clause. With that slot taken, the finite verb is pushed all the way to the back, behind even the participle it normally carries.",
  },
};

// Only the article is tinted: between the two states exactly one token changes
// (die → der), and colouring the whole noun phrase buries it.
const WECHSEL = {
  wohin: {
    phrase: [
      { t: "Ich hänge das Bild " },
      { t: "an", c: "akk" },
      { t: " " },
      { t: "die", c: "akk", flip: true },
      { t: " Wand." },
    ],
    trace: [
      ["Präposition", "an — Wechselpräposition"],
      ["Frage", "wohin? → Bewegung über die Grenze"],
      ["Kasus", "Akkusativ"],
      ["Ergebnis", "an die Wand"],
    ],
  },
  wo: {
    phrase: [
      { t: "Das Bild hängt " },
      { t: "an", c: "dat" },
      { t: " " },
      { t: "der", c: "dat", flip: true },
      { t: " Wand." },
    ],
    trace: [
      ["Präposition", "an — Wechselpräposition"],
      ["Frage", "wo? → Position, keine Grenze"],
      ["Kasus", "Dativ"],
      ["Ergebnis", "an der Wand"],
    ],
  },
};

// ---------------------------------------------------------------------------
//  Declension engine — ported from deutsch-spec.html so the Deklinations-
//  Explorer can build any noun phrase and show the rule trace behind it.
// ---------------------------------------------------------------------------
const CASES = [
  { k: "nom", short: "NOM", q: "wer? was?" },
  { k: "akk", short: "AKK", q: "wen? was?" },
  { k: "dat", short: "DAT", q: "wem?" },
  { k: "gen", short: "GEN", q: "wessen?" },
];
const GENDER_LABEL = { m: "Maskulin", n: "Neutrum", f: "Feminin", p: "Plural" };
const DEF = {
  m: { nom: "der", akk: "den", dat: "dem", gen: "des" },
  n: { nom: "das", akk: "das", dat: "dem", gen: "des" },
  f: { nom: "die", akk: "die", dat: "der", gen: "der" },
  p: { nom: "die", akk: "die", dat: "den", gen: "der" },
};
const EIN_END = {
  m: { nom: "", akk: "en", dat: "em", gen: "es" },
  n: { nom: "", akk: "", dat: "em", gen: "es" },
  f: { nom: "e", akk: "e", dat: "er", gen: "er" },
  p: { nom: "e", akk: "e", dat: "en", gen: "er" },
};
const WEAK = {
  m: { nom: "e", akk: "en", dat: "en", gen: "en" },
  n: { nom: "e", akk: "e", dat: "en", gen: "en" },
  f: { nom: "e", akk: "e", dat: "en", gen: "en" },
  p: { nom: "en", akk: "en", dat: "en", gen: "en" },
};
const STRONG = {
  m: { nom: "er", akk: "en", dat: "em", gen: "en" },
  n: { nom: "es", akk: "es", dat: "em", gen: "en" },
  f: { nom: "e", akk: "e", dat: "er", gen: "er" },
  p: { nom: "e", akk: "e", dat: "en", gen: "er" },
};
const NOUNS = [
  { w: "Mann", g: "m", pl: "Männer", gs: "Mannes", en: "man" },
  { w: "Hund", g: "m", pl: "Hunde", gs: "Hundes", en: "dog" },
  { w: "Tisch", g: "m", pl: "Tische", gs: "Tisches", en: "table" },
  { w: "Schlüssel", g: "m", pl: "Schlüssel", gs: "Schlüssels", en: "key" },
  { w: "Freund", g: "m", pl: "Freunde", gs: "Freundes", en: "friend" },
  { w: "Apfel", g: "m", pl: "Äpfel", gs: "Apfels", en: "apple" },
  { w: "Kind", g: "n", pl: "Kinder", gs: "Kindes", en: "child" },
  { w: "Buch", g: "n", pl: "Bücher", gs: "Buches", en: "book" },
  { w: "Haus", g: "n", pl: "Häuser", gs: "Hauses", en: "house" },
  { w: "Auto", g: "n", pl: "Autos", gs: "Autos", en: "car" },
  { w: "Fenster", g: "n", pl: "Fenster", gs: "Fensters", en: "window" },
  { w: "Frau", g: "f", pl: "Frauen", gs: "Frau", en: "woman" },
  { w: "Katze", g: "f", pl: "Katzen", gs: "Katze", en: "cat" },
  { w: "Stadt", g: "f", pl: "Städte", gs: "Stadt", en: "city" },
  { w: "Tür", g: "f", pl: "Türen", gs: "Tür", en: "door" },
  { w: "Lampe", g: "f", pl: "Lampen", gs: "Lampe", en: "lamp" },
  { w: "Schwester", g: "f", pl: "Schwestern", gs: "Schwester", en: "sister" },
];
const ADJ = ["alt", "neu", "klein", "groß", "rot", "jung", "schön", "kalt", "warm", "schnell"];
const ART_TYPES = [
  { v: "def", label: "der/die/das" },
  { v: "ein", label: "ein–" },
  { v: "kein", label: "kein–" },
  { v: "none", label: "∅" },
];

// Returns the noun split into { stem, suf } so the caller can mark the ending
// the trace talks about instead of printing it as an undifferentiated word.
function nounForm(noun, kasus, plural) {
  if (plural) {
    const p = noun.pl;
    if (kasus === "dat" && !/[ns]$/.test(p))
      return { w: p + "n", stem: p, suf: "n", note: "Dativ Plural → Nomen + -n" };
    return { w: p, stem: p, suf: "", note: "" };
  }
  if (kasus === "gen" && (noun.g === "m" || noun.g === "n")) {
    const suf = noun.gs.startsWith(noun.w) ? noun.gs.slice(noun.w.length) : "";
    return {
      w: noun.gs,
      stem: suf ? noun.w : noun.gs,
      suf,
      note: "Genitiv Mask/Neut → Nomen + -(e)s",
    };
  }
  return { w: noun.w, stem: noun.w, suf: "", note: "" };
}

// artType: "def" | "ein" | "kein" | "none"
function decline(noun, kasus, artType, adj, plural) {
  const g = plural ? "p" : noun.g;
  const trace = [];
  let article = "";
  let artClass = "";

  if (artType === "def") {
    article = DEF[g][kasus];
    artClass = "weak";
    trace.push([
      GENDER_LABEL[g] + " + " + kasus.toUpperCase(),
      "der-Tabelle → " + article,
      kasus === "akk" && g === "m" ? "einzige Zelle, die sich von NOM unterscheidet" : "",
    ]);
  } else if (artType === "ein" || artType === "kein") {
    const stem = artType === "ein" ? "ein" : "kein";
    if (artType === "ein" && plural) {
      artClass = "strong";
      trace.push([
        "ein + Plural",
        "existiert nicht → kein Artikel",
        adj ? "Adjektiv übernimmt das Signal" : "ohne Adjektiv bleibt das Signal ungesagt",
      ]);
    } else {
      const e = EIN_END[g][kasus];
      article = stem + e;
      artClass = e === "" ? "strong" : "weak";
      trace.push([
        GENDER_LABEL[g] + " + " + kasus.toUpperCase(),
        stem + ' + "' + (e || "∅") + '" → ' + article,
        e === "" ? "nackte Zelle — kein Signal" : "",
      ]);
    }
  } else {
    artClass = "strong";
    trace.push([
      "kein Artikelwort",
      "Signal fehlt komplett",
      adj ? "Adjektiv muss es tragen" : "ohne Adjektiv bleibt das Signal ungesagt",
    ]);
  }

  let ending = "";
  let table = "";
  if (adj) {
    if (artClass === "weak") {
      ending = WEAK[g][kasus];
      table = "SCHWACH";
      trace.push(["Artikel trägt Signal", "→ schwache Endung", ""]);
    } else if (artType === "none" || (artType === "ein" && plural)) {
      ending = STRONG[g][kasus];
      table = "STARK";
      trace.push(["kein Signal vorhanden", "→ starke Endung", "= die der-Endung"]);
    } else {
      ending = STRONG[g][kasus];
      table = "GEMISCHT";
      trace.push(["Artikel ist nackt", "→ gemischt = starke Endung hier", "borgt -er/-es von der-Tabelle"]);
    }
    trace.push([table + "[" + GENDER_LABEL[g].slice(0, 4) + "][" + kasus.toUpperCase() + "]", "→ -" + ending, ""]);
  }

  const nf = nounForm(noun, kasus, plural);
  if (nf.note) trace.push(["Nomen", "→ " + nf.w, nf.note]);

  const parts = [];
  if (article) parts.push(article);
  if (adj) parts.push(adj + ending);
  parts.push(nf.w);

  return {
    article,
    adjEnding: ending,
    noun: nf.w,
    nounStem: nf.stem,
    nounSuf: nf.suf,
    gender: g,
    kasus,
    text: parts.join(" "),
    trace,
  };
}

const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ---------------------------------------------------------------------------
//  Tense engine — ported from deutsch-spec.html
// ---------------------------------------------------------------------------
const VERBS = [
  { inf: "machen",    en: "to do/make",    aux: "haben", pii: "gemacht",
    pres: ["mache","machst","macht","machen","macht","machen"],
    prat: ["machte","machtest","machte","machten","machtet","machten"] },
  { inf: "gehen",     en: "to go",         aux: "sein",  pii: "gegangen",
    pres: ["gehe","gehst","geht","gehen","geht","gehen"],
    prat: ["ging","gingst","ging","gingen","gingt","gingen"] },
  { inf: "fahren",    en: "to drive",      aux: "sein",  pii: "gefahren",
    pres: ["fahre","fährst","fährt","fahren","fahrt","fahren"],
    prat: ["fuhr","fuhrst","fuhr","fuhren","fuhrt","fuhren"] },
  { inf: "sehen",     en: "to see",        aux: "haben", pii: "gesehen",
    pres: ["sehe","siehst","sieht","sehen","seht","sehen"],
    prat: ["sah","sahst","sah","sahen","saht","sahen"] },
  { inf: "essen",     en: "to eat",        aux: "haben", pii: "gegessen",
    pres: ["esse","isst","isst","essen","esst","essen"],
    prat: ["aß","aßest","aß","aßen","aßt","aßen"] },
  { inf: "sprechen",  en: "to speak",      aux: "haben", pii: "gesprochen",
    pres: ["spreche","sprichst","spricht","sprechen","sprecht","sprechen"],
    prat: ["sprach","sprachst","sprach","sprachen","spracht","sprachen"] },
  { inf: "lesen",     en: "to read",       aux: "haben", pii: "gelesen",
    pres: ["lese","liest","liest","lesen","lest","lesen"],
    prat: ["las","lasest","las","lasen","last","lasen"] },
  { inf: "haben",     en: "to have",       aux: "haben", pii: "gehabt",
    pres: ["habe","hast","hat","haben","habt","haben"],
    prat: ["hatte","hattest","hatte","hatten","hattet","hatten"] },
  { inf: "sein",      en: "to be",         aux: "sein",  pii: "gewesen",
    pres: ["bin","bist","ist","sind","seid","sind"],
    prat: ["war","warst","war","waren","wart","waren"] },
  { inf: "werden",    en: "to become",     aux: "sein",  pii: "geworden",
    pres: ["werde","wirst","wird","werden","werdet","werden"],
    prat: ["wurde","wurdest","wurde","wurden","wurdet","wurden"] },
  { inf: "arbeiten",  en: "to work",       aux: "haben", pii: "gearbeitet",
    pres: ["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"],
    prat: ["arbeitete","arbeitetest","arbeitete","arbeiteten","arbeitetet","arbeiteten"] },
  { inf: "bleiben",   en: "to stay",       aux: "sein",  pii: "geblieben",
    pres: ["bleibe","bleibst","bleibt","bleiben","bleibt","bleiben"],
    prat: ["blieb","bliebst","blieb","blieben","bliebt","blieben"] },
  { inf: "kommen",    en: "to come",       aux: "sein",  pii: "gekommen",
    pres: ["komme","kommst","kommt","kommen","kommt","kommen"],
    prat: ["kam","kamst","kam","kamen","kamt","kamen"] },
  { inf: "verstehen", en: "to understand", aux: "haben", pii: "verstanden",
    pres: ["verstehe","verstehst","versteht","verstehen","versteht","verstehen"],
    prat: ["verstand","verstandst","verstand","verstanden","verstandet","verstanden"] },
  { inf: "studieren", en: "to study",      aux: "haben", pii: "studiert",
    pres: ["studiere","studierst","studiert","studieren","studiert","studieren"],
    prat: ["studierte","studiertest","studierte","studierten","studiertet","studierten"] },
  { inf: "aufstehen", en: "to get up",     aux: "sein",  pii: "aufgestanden", sep: "auf",
    pres: ["stehe","stehst","steht","stehen","steht","stehen"],
    prat: ["stand","standst","stand","standen","standet","standen"] },
];
const VB = {};
VERBS.forEach((v) => { VB[v.inf] = v; });

const TENSES = [
  { k: "praesens",    label: "Präsens" },
  { k: "perfekt",     label: "Perfekt" },
  { k: "praeteritum", label: "Präteritum" },
  { k: "plusquam",    label: "Plusquamperfekt" },
  { k: "futur1",      label: "Futur I" },
  { k: "futur2",      label: "Futur II" },
];
const PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

// c: "plain" | "aux" (nom) | "part" (akk) | "inf" (dat) | "sep" (neutral — a
// separable prefix is not a verb slot, so it must not borrow a case colour)
function conjugate(verb, personIdx, tense) {
  const v = typeof verb === "string" ? VB[verb] : verb;
  const sep = v.sep || "";
  const out = [];
  let formula = "";
  if (tense === "praesens") {
    out.push({ t: v.pres[personIdx], c: "plain" });
    if (sep) out.push({ t: sep, c: "sep" });
    formula = "Stamm + Personalendung" + (sep ? "   ·   trennbares Präfix wandert ans Ende" : "");
  } else if (tense === "praeteritum") {
    out.push({ t: v.prat[personIdx], c: "plain" });
    if (sep) out.push({ t: sep, c: "sep" });
    formula = "Präteritum-Stamm + Endung" + (sep ? "   ·   Präfix ans Ende" : "");
  } else if (tense === "perfekt") {
    out.push({ t: VB[v.aux].pres[personIdx], c: "aux" });
    out.push({ t: v.pii, c: "part" });
    formula = v.aux + "[Präsens] + Partizip II   ·   " +
      (v.aux === "sein" ? "sein: Bewegung / Zustandswechsel" : "haben: Standardfall");
  } else if (tense === "plusquam") {
    out.push({ t: VB[v.aux].prat[personIdx], c: "aux" });
    out.push({ t: v.pii, c: "part" });
    formula = v.aux + "[Präteritum] + Partizip II";
  } else if (tense === "futur1") {
    out.push({ t: VB["werden"].pres[personIdx], c: "aux" });
    out.push({ t: v.inf, c: "inf" });
    formula = "werden[Präsens] + Infinitiv";
  } else {
    out.push({ t: VB["werden"].pres[personIdx], c: "aux" });
    out.push({ t: v.pii, c: "part" });
    out.push({ t: v.aux, c: "inf" });
    formula = "werden[Präsens] + Partizip II + " + v.aux;
  }
  return { parts: out, formula };
}

const CMP_COLOR = { plain: "", aux: "c-nom", part: "c-akk", inf: "c-dat", sep: "c-sep" };

function Composer() {
  const [tense, setTense] = React.useState("perfekt");
  const [person, setPerson] = React.useState(0);
  const [verbInf, setVerbInf] = React.useState("essen");

  const r = conjugate(verbInf, person, tense);

  const zufall = () => {
    setTense(pick(TENSES).k);
    setPerson(Math.floor(Math.random() * 6));
    setVerbInf(pick(VERBS).inf);
  };

  const verb = VB[verbInf];
  const piiNote = verb.sep
    ? `Partizip II: ${verb.pii} · trennbar: ge- in die Mitte · Hilfsverb: ${verb.aux}`
    : `Partizip II: ${verb.pii} · Präteritum: ${verb.prat[0]} · Hilfsverb: ${verb.aux}`;

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Zeiten-Komponist · watch the pieces assemble</span>
        <button type="button" className="btn btn-ghost" onClick={zufall}>Zufall</button>
      </div>
      <div className="tool-body">
        <div className="ctrls" style={{ gridTemplateColumns: "1fr" }}>
          <div className="ctrl">
            <span className="eyebrow">Zeit</span>
            <div className="chips" role="group" aria-label="Zeit">
              {TENSES.map((t) => (
                <button key={t.k} type="button" className="chip" aria-pressed={tense === t.k}
                  onClick={() => setTense(t.k)}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="ctrls" style={{ gridTemplateColumns: "1fr", marginTop: "1rem" }}>
          <div className="ctrl">
            <span className="eyebrow">Person</span>
            <div className="chips" role="group" aria-label="Person">
              {PERSONS.map((p, i) => (
                <button key={p} type="button" className="chip" aria-pressed={person === i}
                  onClick={() => setPerson(i)}>{p}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="ctrls" style={{ marginTop: "1rem" }}>
          <div className="ctrl">
            <label className="eyebrow" htmlFor="cmp-verb">Verb</label>
            <select id="cmp-verb" className="chip" value={verbInf}
              onChange={(e) => setVerbInf(e.target.value)}>
              {VERBS.map((v) => (
                <option key={v.inf} value={v.inf}>{v.inf} — {v.en}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="out">
          <div className="out-phrase compose">
            <span>{PERSONS[person]} </span>
            {r.parts.map((p, i) => (
              <span key={p.t + "-" + i} className={CMP_COLOR[p.c] ? CMP_COLOR[p.c] : ""}>{p.t}</span>
            ))}
          </div>
          <div className="trace">
            <span className="step">
              <span className="lbl">{TENSES.find((t) => t.k === tense).label}</span>
              <span className="arrow"> = </span>
              {r.formula}
            </span>
            <span className="step" style={{ color: "var(--ink-3)" }}>
              {"// " + piiNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Klammer() {
  const [kind, setKind] = React.useState("main");
  const k = KLAMMER[kind];
  return (
    <div className="klammer-card">
      <div className="klammer-head">
        <span className="eyebrow">Die Satzklammer · the sentence bracket</span>
        <div className="seg" role="group" aria-label="Satzart">
          <button type="button" aria-pressed={kind === "main"} onClick={() => setKind("main")}>
            Hauptsatz
          </button>
          <button type="button" aria-pressed={kind === "sub"} onClick={() => setKind("sub")}>
            Nebensatz
          </button>
        </div>
      </div>
      <div className="klammer-wrap">
        <div className="klammer">
          {k.pre.map((w) => (
            <span key={"pre-" + w} className="k-word k-pre">{w}</span>
          ))}
          <span className="k-span" key={kind}>
            {k.frame.map((f, i) => (
              <span
                key={f.t + "-" + i}
                className={
                  "k-word" + (f.fin ? " k-fin" : "") + (f.inf ? " k-inf" : "") + (f.kw ? " k-kw" : "")
                }
              >
                {f.tag && <span className="k-tag">{f.tag}</span>}
                {f.t}
              </span>
            ))}
            <span className="k-label">{k.label}</span>
          </span>
        </div>
      </div>
      <p className="klammer-note">{k.note}</p>
    </div>
  );
}

function Explorer() {
  const [kasus, setKasus] = React.useState("akk");
  const [art, setArt] = React.useState("def");
  const [nounIdx, setNounIdx] = React.useState(0);
  const [adj, setAdj] = React.useState("alt");
  const [plural, setPlural] = React.useState(false);

  const noun = NOUNS[nounIdx];
  const r = decline(noun, kasus, art, adj, plural);
  const cls = "c-" + kasus;

  const zufall = () => {
    setKasus(pick(CASES).k);
    setArt(pick(ART_TYPES).v);
    setNounIdx(Math.floor(Math.random() * NOUNS.length));
    setAdj(pick(ADJ));
    setPlural(Math.random() < 0.25);
  };

  const head = [
    "decline()",
    noun.w + " · " + GENDER_LABEL[r.gender] + " · " + kasus.toUpperCase() + " · " +
      (art === "def" ? "der-Wort" : art === "none" ? "kein Artikel" : art + "-Wort"),
    CASES.find((c) => c.k === kasus).q,
  ];
  const rows = [head, ...r.trace, ["Ergebnis", r.text, ""]];

  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Deklinations-Explorer · build any noun phrase and read its trace</span>
        <button type="button" className="btn btn-ghost" onClick={zufall}>Zufall</button>
      </div>
      <div className="tool-body">
        <div className="ctrls">
          <div className="ctrl">
            <span className="eyebrow">Kasus</span>
            <div className="chips" role="group" aria-label="Kasus">
              {CASES.map((c) => (
                <button
                  key={c.k}
                  type="button"
                  className={"chip k-" + c.k}
                  aria-pressed={kasus === c.k}
                  onClick={() => setKasus(c.k)}
                >
                  {c.short}
                </button>
              ))}
            </div>
          </div>
          <div className="ctrl">
            <span className="eyebrow">Artikelwort</span>
            <div className="chips" role="group" aria-label="Artikelwort">
              {ART_TYPES.map((a) => (
                <button
                  key={a.v}
                  type="button"
                  className="chip"
                  aria-pressed={art === a.v}
                  onClick={() => setArt(a.v)}
                >
                  {a.label}
                </button>
              ))}
              <button type="button" className="chip" aria-pressed={plural} onClick={() => setPlural((p) => !p)}>
                Plural
              </button>
            </div>
          </div>
          <div className="ctrl">
            <label className="eyebrow" htmlFor="exp-noun">Nomen</label>
            <select id="exp-noun" className="chip" value={nounIdx} onChange={(e) => setNounIdx(+e.target.value)}>
              {NOUNS.map((n, i) => (
                <option key={n.w} value={i}>
                  {(n.g === "m" ? "der " : n.g === "n" ? "das " : "die ") + n.w + " — " + n.en}
                </option>
              ))}
            </select>
          </div>
          <div className="ctrl">
            <label className="eyebrow" htmlFor="exp-adj">Adjektiv</label>
            <select id="exp-adj" className="chip" value={adj} onChange={(e) => setAdj(e.target.value)}>
              <option value="">— ohne Adjektiv —</option>
              {ADJ.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="out">
          <div className="out-phrase">
            {r.article && <span className={"art " + cls}>{r.article} </span>}
            {adj && (
              <span>
                {adj}
                <span className={"end " + cls}>{r.adjEnding}</span>{" "}
              </span>
            )}
            <span>
              {r.nounStem}
              {r.nounSuf && <span className={"end " + cls}>{r.nounSuf}</span>}
            </span>
          </div>
          <div className="trace">
            {rows.map((row, i) => (
              <span className="step" key={row[0] + "-" + i}>
                <span className="lbl">{row[0]}</span>
                <span className="arrow"> </span>
                {row[1]}
                {row[2] && <span className="why">{"  // " + row[2]}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Wechsel() {
  const [kind, setKind] = React.useState("wohin");
  const w = WECHSEL[kind];
  return (
    <div className="spec-tool">
      <div className="tool-head">
        <span className="eyebrow">Wechselpräposition · flip the boolean</span>
        <div className="seg" role="group" aria-label="Bewegung">
          <button type="button" aria-pressed={kind === "wohin"} onClick={() => setKind("wohin")}>
            wohin? · Bewegung
          </button>
          <button type="button" aria-pressed={kind === "wo"} onClick={() => setKind("wo")}>
            wo? · Position
          </button>
        </div>
      </div>
      <div className="tool-body">
        <div className="out">
          <div className="out-phrase">
            {w.phrase.map((p, i) => (
              <span key={p.t + "-" + i} className={(p.c ? "c-" + p.c : "") + (p.flip ? " end" : "")}>
                {p.t}
              </span>
            ))}
          </div>
          <div className="trace">
            {w.trace.map(([lbl, why]) => (
              <span className="step" key={lbl}>
                <span className="lbl">{lbl}</span>
                <span className="arrow">→ </span>
                <span className="why">{why}</span>
              </span>
            ))}
          </div>
        </div>
        <p className="body-copy" style={{ marginTop: "1.2rem" }}>
          The test is not "is there movement in the scene" but{" "}
          <strong>does the phrase describe crossing a boundary into the place</strong>.{" "}
          <span className="mono">Ich laufe in dem Park</span> — running around inside it (Dativ).{" "}
          <span className="mono">Ich laufe in den Park</span> — running into it from outside
          (Akkusativ). Both have running.
        </p>
      </div>
    </div>
  );
}

export default function Spec() {
  return (
    <div className="spec">
      {/* ===================================================== hero === */}
      <header className="spec-hero">
        <span className="eyebrow">Sprachspezifikation · Deutsch · A2–C1</span>
        <h1>
          German is a <em>typed</em> language.
        </h1>
        <p className="spec-lede">
          Every noun phrase carries a type signature — <strong>gender, case, number</strong> — and
          the article and adjective endings are just that signature, written down. Every sentence
          opens a bracket and must close it. There are far fewer rules than tables: here are the
          rules, with the trace behind every form.
        </p>
        <Klammer />
      </header>

      {/* ===================================================== §1 kasus === */}
      <section className="sec">
        <SecHead
          anchor="kasus"
          num="§1"
          title="Four cases = four argument slots"
          sub="A German verb is a function, and its arguments are labelled by case rather than by position. That is why word order can move: the labels are glued to the nouns, not to the slots."
        />
        <pre className="code" aria-label="Verb signature example">
          <span className="cm">{"// the verb declares which slots it takes\n"}</span>
          <span className="kw">geben</span>
          {"( "}
          <b className="c-nom">NOM</b> giver, <b className="c-dat">DAT</b> receiver,{" "}
          <b className="c-akk">AKK</b> thing {")\n\n"}
          {"  "}
          <b className="c-nom">Der Mann</b> gibt <b className="c-dat">der Frau</b>{" "}
          <b className="c-akk">den Schlüssel</b>.{"\n"}
          {"  "}
          <b className="c-akk">Den Schlüssel</b> gibt <b className="c-nom">der Mann</b>{" "}
          <b className="c-dat">der Frau</b>. <span className="cm">{"// same meaning"}</span>
          {"\n\n"}
          <span className="cm">{"// in English the slots ARE the positions, so this breaks:\n"}</span>
          <span className="cm">{'//   "The key gives the man the woman."  ✗'}</span>
        </pre>

        <div className="roles">
          <div className="role r-nom">
            <h3>Nominativ</h3>
            <span className="q">wer? was?</span>
            <p>The subject — who performs. Also the complement of <span className="mono">sein / werden / bleiben</span>.</p>
            <p className="ex"><span className="c-nom">Der Hund</span> schläft. · Das ist <span className="c-nom">ein guter Freund</span>.</p>
          </div>
          <div className="role r-akk">
            <h3>Akkusativ</h3>
            <span className="q">wen? was?</span>
            <p>The direct object — what is affected. The default object case, and the case after <span className="mono">durch, für, gegen, ohne, um</span>.</p>
            <p className="ex">Ich sehe <span className="c-akk">den Hund</span>. · für <span className="c-akk">den Freund</span></p>
          </div>
          <div className="role r-dat">
            <h3>Dativ</h3>
            <span className="q">wem?</span>
            <p>The indirect object — recipient or beneficiary. Also forced by <span className="mono">mit, nach, von, zu, bei, aus, seit</span>.</p>
            <p className="ex">Ich helfe <span className="c-dat">dem Hund</span>. · mit <span className="c-dat">dem Auto</span></p>
          </div>
          <div className="role r-gen">
            <h3>Genitiv</h3>
            <span className="q">wessen?</span>
            <p>Possession and belonging. Often replaced by <span className="mono">von&nbsp;+&nbsp;Dativ</span> in speech — learn it to read.</p>
            <p className="ex">die Farbe <span className="c-gen">des Hauses</span> · wegen <span className="c-gen">des Wetters</span></p>
          </div>
        </div>

        <div className="law">
          <span className="eyebrow">Regel 1.1 — case is assigned, never chosen</span>
          <p>Something upstream always assigns the case: the verb, a preposition, or the possessive relation. Find the assigner first, then decline. Never start from the noun.</p>
        </div>
      </section>

      {/* ===================================================== §2 genus === */}
      <GenusSection />

      {/* ===================================================== §3 artikel === */}
      <section className="sec">
        <SecHead
          anchor="artikel"
          num="§3"
          title="The article table is a lookup — and almost all repeats"
          sub="Sixteen cells, but only six distinct forms, and most rows repeat. Learn the exceptions, not the grid."
        />
        <div className="tbl-wrap">
          <table className="grid-tbl">
            <caption>Bestimmter Artikel · der-Wörter (dies-, jed-, welch-, all-)</caption>
            <thead>
              <tr><th scope="col">Kasus</th><th scope="col">Maskulin</th><th scope="col">Neutrum</th><th scope="col">Feminin</th><th scope="col">Plural</th></tr>
            </thead>
            <tbody>
              <tr className="ref-row"><th scope="row" className="c-nom">Nominativ</th><td>der</td><td>das</td><td>die</td><td>die</td></tr>
              <tr><th scope="row" className="c-akk">Akkusativ</th><td className="hot c-akk">den<Mark note="einzige Abweichung von Nominativ" /></td><td>das</td><td>die</td><td>die</td></tr>
              <tr><th scope="row" className="c-dat">Dativ</th><td>dem</td><td>dem</td><td>der</td><td>den + Nomen<Suf>n</Suf></td></tr>
              <tr><th scope="row" className="c-gen">Genitiv</th><td>des + Nomen<Suf>s</Suf></td><td>des + Nomen<Suf>s</Suf></td><td>der</td><td>der</td></tr>
            </tbody>
          </table>
          <p className="tbl-cap"><b>The whole Akkusativ row is free.</b> It is identical to the marked Nominativ row (▸) except one cell: masculine <span className="mono">der → den</span>. Know Nominativ, and you know Akkusativ. The <span className="nsuf">dashed</span> endings are the three places where the <b>noun itself</b> also changes — they belong to the noun, not to the article.</p>
        </div>

        <div className="tbl-wrap">
          <table className="grid-tbl">
            <caption>ein-Wörter · ein, kein, mein/dein/sein/ihr/unser/euer</caption>
            <thead>
              <tr><th scope="col">Kasus</th><th scope="col">Maskulin</th><th scope="col">Neutrum</th><th scope="col">Feminin</th><th scope="col">Plural (kein-)</th></tr>
            </thead>
            <tbody>
              <tr className="ref-row"><th scope="row" className="c-nom">Nominativ</th><td className="hot c-nom">ein <span className="badge">—</span><Mark note="nackte Zelle, keine Endung" /></td><td className="hot c-nom">ein <span className="badge">—</span><Mark note="nackte Zelle, keine Endung" /></td><td>eine</td><td>keine</td></tr>
              <tr><th scope="row" className="c-akk">Akkusativ</th><td>einen</td><td className="hot c-akk">ein <span className="badge">—</span><Mark note="nackte Zelle, keine Endung" /></td><td>eine</td><td>keine</td></tr>
              <tr><th scope="row" className="c-dat">Dativ</th><td>einem</td><td>einem</td><td>einer</td><td>keinen + Nomen<Suf>n</Suf></td></tr>
              <tr><th scope="row" className="c-gen">Genitiv</th><td>eines + Nomen<Suf>s</Suf></td><td>eines + Nomen<Suf>s</Suf></td><td>einer</td><td>keiner</td></tr>
            </tbody>
          </table>
          <p className="tbl-cap">Same endings as the der-table, minus the stem — except <b>three naked cells</b> (highlighted) where <span className="mono">ein</span> carries no ending at all. Those three are the entire reason adjective endings exist. See §4. The noun-side endings (<span className="nsuf">dashed</span>) are unchanged from the der-table: the article word never switches that rule off.</p>
        </div>

        <div className="law">
          <span className="eyebrow">Regel 3.1 — the ending is the type tag</span>
          <p><span className="mono">-r</span> ≈ masc.NOM / fem.DAT+GEN / plural.GEN · <span className="mono">-n</span> ≈ masc.AKK / plural.DAT · <span className="mono">-m</span> ≈ DAT masc+neut · <span className="mono">-s</span> ≈ GEN masc+neut. The same four signals ride on <span className="mono">der-</span>, <span className="mono">ein-</span>, and adjectives alike. (Careful with <span className="mono">das</span>: that <span className="mono">-s</span> is part of the stem, not a Genitiv tag.)</p>
        </div>
      </section>

      {/* ===================================================== §4 adjektive === */}
      <section className="sec">
        <SecHead
          anchor="adjektive"
          num="§4"
          title="Adjective endings: one signal, marked exactly once"
          sub="Learners memorise three 16-cell tables. You only need one conditional and two shapes."
        />
        <pre className="code" aria-label="Adjective ending algorithm">
          <span className="kw">function</span> adjektivEndung(artikel, genus, kasus) {"{\n"}
          {"  "}<span className="cm">{"// does the article already show the case+gender signal?"}</span>{"\n"}
          {"  "}<span className="kw">if</span> (!artikel){"                 "}<span className="kw">return</span> <b className="c-akk">STARK</b>[genus][kasus];{"   "}<span className="cm">{"// nothing there → adjective takes over"}</span>{"\n"}
          {"  "}<span className="kw">if</span> (artikel.endung === <b>&quot;&quot;</b>){"   "}<span className="kw">return</span> <b className="c-akk">STARK</b>[genus][kasus];{"   "}<span className="cm">{'// naked "ein" → adjective covers'}</span>{"\n"}
          {"  "}<span className="kw">return</span>{"                        "}<b className="c-nom">SCHWACH</b>[genus][kasus];{" "}<span className="cm">{"// signal already given → -e / -en"}</span>{"\n"}
          {"}"}
        </pre>
        <p className="body-copy"><strong>That is the whole system.</strong> The case-and-gender signal must appear exactly once in the noun phrase. If <span className="mono">der/dem/den…</span> already carries it, the adjective relaxes into the weak set. If the article is one of the three naked <span className="mono">ein</span> cells, or there is no article at all, the adjective picks up the signal itself.</p>

        <div className="tbl-wrap">
          <table className="grid-tbl">
            <caption>Schwach — after der / die / das / dies- / jed-</caption>
            <thead>
              <tr><th scope="col"></th><th scope="col">Mask</th><th scope="col">Neut</th><th scope="col">Fem</th><th scope="col">Plural</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row" className="c-nom">NOM</th><td className="hot c-nom">-e<Mark note="gehört zum -e-Block" /></td><td className="hot c-nom">-e<Mark note="gehört zum -e-Block" /></td><td className="hot c-nom">-e<Mark note="gehört zum -e-Block" /></td><td>-en</td></tr>
              <tr><th scope="row" className="c-akk">AKK</th><td>-en</td><td className="hot c-akk">-e<Mark note="gehört zum -e-Block" /></td><td className="hot c-akk">-e<Mark note="gehört zum -e-Block" /></td><td>-en</td></tr>
              <tr><th scope="row" className="c-dat">DAT</th><td>-en</td><td>-en</td><td>-en</td><td>-en</td></tr>
              <tr><th scope="row" className="c-gen">GEN</th><td>-en</td><td>-en</td><td>-en</td><td>-en</td></tr>
            </tbody>
          </table>
          <p className="tbl-cap"><b>Five cells are <span className="mono">-e</span>; everything else is <span className="mono">-en</span>.</b> The shape is an L in the top-left corner — the single most valuable thing on this page.</p>
        </div>

        <div className="tbl-wrap">
          <table className="grid-tbl">
            <caption>Gemischt — after ein / kein / mein …</caption>
            <thead>
              <tr><th scope="col"></th><th scope="col">Mask</th><th scope="col">Neut</th><th scope="col">Fem</th><th scope="col">Plural</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row" className="c-nom">NOM</th><td className="hot c-nom">-er<Mark note="weicht von SCHWACH ab" /></td><td className="hot c-nom">-es<Mark note="weicht von SCHWACH ab" /></td><td>-e</td><td>-en</td></tr>
              <tr><th scope="row" className="c-akk">AKK</th><td>-en</td><td className="hot c-akk">-es<Mark note="weicht von SCHWACH ab" /></td><td>-e</td><td>-en</td></tr>
              <tr><th scope="row" className="c-dat">DAT</th><td>-en</td><td>-en</td><td>-en</td><td>-en</td></tr>
              <tr><th scope="row" className="c-gen">GEN</th><td>-en</td><td>-en</td><td>-en</td><td>-en</td></tr>
            </tbody>
          </table>
          <p className="tbl-cap">Identical to the weak table except the <b>three highlighted cells</b> — exactly where <span className="mono">ein</span> was naked. The adjective borrows the missing <span className="mono">-er / -es</span> from the der-table.</p>
        </div>

        <div className="tbl-wrap">
          <table className="grid-tbl">
            <caption>Stark — no article (guter Wein, kaltes Wasser, mit heißem Kaffee)</caption>
            <thead>
              <tr><th scope="col"></th><th scope="col">Mask</th><th scope="col">Neut</th><th scope="col">Fem</th><th scope="col">Plural</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row" className="c-nom">NOM</th><td>-er</td><td>-es</td><td>-e</td><td>-e</td></tr>
              <tr><th scope="row" className="c-akk">AKK</th><td>-en</td><td>-es</td><td>-e</td><td>-e</td></tr>
              <tr><th scope="row" className="c-dat">DAT</th><td>-em</td><td>-em</td><td>-er</td><td>-en</td></tr>
              <tr><th scope="row" className="c-gen">GEN</th><td className="hot c-gen">-en<Mark note="bricht das Muster der der-Tabelle" /></td><td className="hot c-gen">-en<Mark note="bricht das Muster der der-Tabelle" /></td><td>-er</td><td>-er</td></tr>
            </tbody>
          </table>
          <p className="tbl-cap">The der-table with the stems removed: d<b>er</b>→-er, d<b>as</b>→-es, de<b>m</b>→-em. Only Genitiv masc/neut breaks the pattern (<span className="mono">-en</span>) because the noun already carries the <span className="mono">-s</span>.</p>
        </div>

        <Explorer />
      </section>

      {/* ===================================================== §5 präpositionen === */}
      <section className="sec">
        <SecHead
          anchor="praepositionen"
          num="§5"
          title="Prepositions are case constants"
          sub="Most prepositions hard-code their case — no thinking required once memorised. Nine of them take a boolean argument."
        />
        <pre className="code" aria-label="Preposition case table">
          <span className="kw">const</span> <b className="c-akk">AKKUSATIV</b> = [ durch, für, gegen, ohne, um, bis ];{"\n"}
          <span className="cm">{"// mnemonic: DOGFUB — durch ohne gegen für um bis"}</span>{"\n"}
          <b className="c-akk">AKKUSATIV</b>.postposition = [ entlang ];{"  "}<span className="cm">{"// nachgestellt: die Straße entlang"}</span>{"\n\n"}
          <span className="kw">const</span> <b className="c-dat">DATIV</b>{"     "}= [ aus, außer, bei, mit, nach, seit, von, zu, gegenüber ];{"\n"}
          <span className="cm">{"// the nine highest-frequency prepositions — learn these first"}</span>{"\n\n"}
          <span className="kw">const</span> <b className="c-gen">GENITIV</b>{"   "}= [ wegen, während, trotz, statt, innerhalb, außerhalb ];{"\n"}
          <span className="cm">{'// in speech these often take Dativ: "wegen dem Wetter"'}</span>{"\n\n"}
          <span className="cm">{"// an auf hinter in neben über unter vor zwischen — these nine take a case"}</span>{"\n"}
          <span className="cm">{"// argument instead of hard-coding one:"}</span>{"\n"}
          <span className="kw">function</span> kasusVon(<b className="c-dat">wechselprep</b>, bewegung) {"{\n"}
          {"  "}<span className="kw">return</span> bewegung ? <b className="c-akk">AKK</b> : <b className="c-dat">DAT</b>;{"\n"}
          {"}"}
        </pre>

        <Wechsel />

        <div className="law">
          <span className="eyebrow">Regel 5.1 — contractions are not new words</span>
          <p><span className="mono">im = in dem</span> · <span className="mono">ins = in das</span> · <span className="mono">am = an dem</span> · <span className="mono">ans = an das</span> · <span className="mono">zum = zu dem</span> · <span className="mono">zur = zu der</span> · <span className="mono">beim = bei dem</span> · <span className="mono">vom = von dem</span>. Expand them mentally and the case is visible again.</p>
        </div>
      </section>

      {/* ===================================================== §6 zeiten === */}
      <section className="sec">
        <SecHead
          anchor="zeiten"
          num="§6"
          title="Six tenses, two building blocks"
          sub="German barely conjugates for tense. It composes: an auxiliary carries person and time, a fixed non-finite form carries meaning. Learn two forms per verb and all six tenses fall out."
        />
        <pre className="code" aria-label="Tense composition formulas">
          <span className="cm">{"// you only ever memorise these two per verb:"}</span>{"\n"}
          <span className="kw">Partizip II</span>{"   "}essen → <b className="c-akk">gegessen</b>{"      "}<span className="kw">Präteritum-Stamm</span>{"  "}essen → <b>aß</b>{"\n\n"}
          <span className="cm">{"// everything else is composition"}</span>{"\n"}
          {"Präsens          = "}<b>stamm + endung</b>{"\n"}
          {"Präteritum       = "}<b>prät-stamm + endung</b>{"\n"}
          {"Perfekt          = "}<b className="c-nom">haben/sein</b>[Präsens]{"    + "}<b className="c-akk">Partizip II</b>{"\n"}
          {"Plusquamperfekt  = "}<b className="c-nom">haben/sein</b>[Präteritum]{" + "}<b className="c-akk">Partizip II</b>{"\n"}
          {"Futur I          = "}<b className="c-nom">werden</b>[Präsens]{"        + "}<b className="c-dat">Infinitiv</b>{"\n"}
          {"Futur II         = "}<b className="c-nom">werden</b>[Präsens]{"        + "}<b className="c-akk">Partizip II</b>{" + "}<b className="c-dat">haben/sein</b>
        </pre>

        <p className="body-copy"><strong>haben or sein?</strong> Use <span className="mono">sein</span> when the verb has no direct object and describes <em>movement from A to B</em> (gehen, fahren, kommen) or a <em>change of state</em> (aufstehen, einschlafen, sterben) — plus the lexical exceptions <span className="mono">sein, bleiben, werden</span>. Everything else takes <span className="mono">haben</span> (~95% of verbs).</p>

        <ul className="tense-list">
          {[
            ["Präsens", "jetzt · und auch: die Zukunft", <b key="f">Stamm + e/st/t/en/t/en</b>, <>Ich <b>esse</b> einen Apfel. · Morgen <b>fahre</b> ich nach Berlin.</>],
            ["Perfekt", "gesprochene Vergangenheit", <><b className="c-nom">haben/sein</b> + … + <b className="c-akk">Partizip II</b></>, <>Ich <b className="c-nom">habe</b> einen Apfel <b className="c-akk">gegessen</b>.</>],
            ["Präteritum", "geschriebene Vergangenheit", <b key="f">Prät-Stamm + —/st/—/en/t/en</b>, <>Er <b>aß</b> einen Apfel. · Ich <b>war</b> müde.</>],
            ["Plusquamperfekt", "Vergangenheit vor der Vergangenheit", <><b className="c-nom">hatte/war</b> + … + <b className="c-akk">Partizip II</b></>, <>Ich <b className="c-nom">hatte</b> schon <b className="c-akk">gegessen</b>, als du kamst.</>],
            ["Futur I", "Absicht, Vermutung, Versprechen", <><b className="c-nom">werden</b> + … + <b className="c-dat">Infinitiv</b></>, <>Ich <b className="c-nom">werde</b> einen Apfel <b className="c-dat">essen</b>.</>],
            ["Futur II", "fertig bis zu einem Zeitpunkt · selten", <><b className="c-nom">werden</b> + … + <b className="c-akk">Partizip II</b> + <b className="c-dat">haben/sein</b></>, <>Bis acht <b className="c-nom">werde</b> ich <b className="c-akk">gegessen</b> <b className="c-dat">haben</b>.</>],
          ].map(([name, when, form, samp]) => (
            <li className="tense-row" key={name}>
              <div>
                <h4>{name}</h4>
                <div className="when">{when}</div>
              </div>
              <div>
                <div className="form">{form}</div>
                <div className="samp">{samp}</div>
              </div>
            </li>
          ))}
        </ul>

        <Composer />
      </section>

      {/* ===================================================== §7 wortstellung === */}
      <section className="sec">
        <SecHead
          anchor="wortstellung"
          num="§7"
          title="Word order: open a bracket, close a bracket"
          sub="German syntax has one governing shape. Once you see it, sentence-final verbs stop feeling random."
        />
        <pre className="code" aria-label="Bracket shape in main and subordinate clauses">
          <span className="cm">{"// MAIN CLAUSE — the finite verb is locked to position 2"}</span>{"\n"}
          [ any one element ] [ <b className="c-nom">finites Verb</b> ] [ … Mittelfeld … ] [ <b className="c-akk">Rest des Verbs</b> ]{"\n"}
          {"   ↑ subject, time, place, object — your choice, but exactly ONE\n\n"}
          <span className="cm">{"// SUBORDINATE CLAUSE — the conjunction fills the slot the finite verb"}</span>{"\n"}
          <span className="cm">{"// held above, so the verb is pushed out to the far end"}</span>{"\n"}
          [ <span className="kw">weil / dass / ob / wenn / obwohl</span> ] [ … ] [ <b className="c-akk">Rest</b> ] [ <b className="c-nom">finites Verb</b> ]
        </pre>

        {/* Separate block: the four field colours below are NOT case colours, and
            keeping them out of the case examples stops the two from being read
            as one palette. */}
        <pre className="code" aria-label="Mittelfeld ordering">
          <span className="cm">{"// Mittelfeld ordering, when nothing is emphasised:"}</span>{"\n"}
          {"TE-KA-MO-LO  =  "}
          <b className="fld-te">Temporal</b> (wann?) → <b className="fld-ka">Kausal</b> (warum?) →{" "}
          <b className="fld-mo">Modal</b> (wie?) → <b className="fld-lo">Lokal</b> (wo/wohin?){"\n\n"}
          {"Ich fahre "}<b className="fld-te">heute</b>{" "}<b className="fld-ka">wegen der Arbeit</b>{" "}
          <b className="fld-mo">mit dem Zug</b>{" "}<b className="fld-lo">nach Köln</b>.{"\n"}
          <span className="cm">{'// "wegen der Arbeit" is Genitiv here — fem. GEN is also "der". See §5.'}</span>
        </pre>

        <pre className="code" aria-label="Object order">
          <span className="cm">{"// two objects: DATIV before AKKUSATIV — unless the accusative is a pronoun"}</span>{"\n"}
          Ich gebe <b className="c-dat">dem Kind</b> <b className="c-akk">das Buch</b>.{"\n"}
          Ich gebe <b className="c-akk">es</b> <b className="c-dat">dem Kind</b>.{"      "}<span className="cm">{"// pronoun jumps the queue"}</span>
        </pre>

        <div className="law">
          <span className="eyebrow">Regel 7.1 — position 1 is a slot, not a subject</span>
          <p>Put anything you want first, but the finite verb still comes second and the subject slides behind it: <span className="mono">Heute <b className="c-nom">fahre</b> ich…</span>, not <span className="mono">Heute ich fahre…</span>. The verb never moves; everything else does.</p>
        </div>
      </section>

      {/* ===================================================== §8 vergleich === */}
      <CompareSection />
    </div>
  );
}
