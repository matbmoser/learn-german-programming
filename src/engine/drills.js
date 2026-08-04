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
//  DRILL GENERATORS — every question is generated fresh, and every answer
//  comes back with the derivation that produced it.
//  Question shape: { rule, kind, level, type, prompt (contains "___"),
//                    hint, options?, answer, accept?, trace }
// ============================================================================

import {
  NOUNS, N_NOUNS, ADJECTIVES, VERBS, MODALS, DEF, EIN_END,
  GENDER_LABEL, CASES, PREP_WECHSEL, VERB_PREP, CONNECTORS, PAIRED,
  FVG, MODALPARTIKELN, PREP_AKK, PREP_DAT, PREP_GEN,
} from "../data/lexicon.js";
import {
  decline, conjugate, conjugateModal, konjunktiv1, TENSES, TENSE_LABEL,
  PASSIVE_FORMS, PASSIVE_LABEL, verbByInf,
} from "./grammar.js";

const PRON_SHORT = ["ich", "du", "er", "wir", "ihr", "sie"];
const PRON_FULL = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const rndInt = (n) => Math.floor(Math.random() * n);
function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Build a 4-option list that always contains the answer exactly once. */
function options4(answer, pool) {
  const set = [answer];
  for (const c of shuffle(pool)) {
    if (set.length >= 4) break;
    if (!set.includes(c)) set.push(c);
  }
  return shuffle(set);
}

// ---------------------------------------------------------------------------
//  Case-assigning frames
// ---------------------------------------------------------------------------
const FRAMES = [
  { k: "nom", pre: "Hier ist ", post: ".", why: "»sein« verlangt Nominativ" },
  { k: "nom", pre: "Das ist ", post: ".", why: "Gleichsetzung mit »sein« → Nominativ" },
  { k: "akk", pre: "Ich sehe ", post: ".", why: "»sehen« nimmt ein direktes Objekt" },
  { k: "akk", pre: "Er kauft ", post: ".", why: "»kaufen« nimmt ein direktes Objekt" },
  { k: "akk", pre: "Wir brauchen ", post: ".", why: "»brauchen« nimmt ein direktes Objekt" },
  { k: "akk", pre: "Das ist für ", post: ".", why: "»für« ist feste Akkusativ-Präposition" },
  { k: "akk", pre: "Sie geht ohne ", post: ".", why: "»ohne« ist feste Akkusativ-Präposition" },
  { k: "akk", pre: "Wir kämpfen gegen ", post: ".", why: "»gegen« ist feste Akkusativ-Präposition" },
  { k: "dat", pre: "Ich helfe ", post: ".", why: "»helfen« verlangt Dativ (Ausnahmeverb)" },
  { k: "dat", pre: "Wir danken ", post: ".", why: "»danken« verlangt Dativ (Ausnahmeverb)" },
  { k: "dat", pre: "Das gehört ", post: ".", why: "»gehören« verlangt Dativ" },
  { k: "dat", pre: "Er fährt mit ", post: ".", why: "»mit« ist feste Dativ-Präposition" },
  { k: "dat", pre: "Sie kommt aus ", post: ".", why: "»aus« ist feste Dativ-Präposition" },
  { k: "dat", pre: "Ich spreche von ", post: ".", why: "»von« ist feste Dativ-Präposition" },
  { k: "dat", pre: "Seit ", post: " ist alles anders.", why: "»seit« ist feste Dativ-Präposition" },
  { k: "gen", pre: "die Farbe ", post: "", why: "Besitz / Zugehörigkeit → Genitiv" },
  { k: "gen", pre: "wegen ", post: " bleibe ich hier.", why: "»wegen« ist Genitiv-Präposition" },
  { k: "gen", pre: "trotz ", post: " ging es weiter.", why: "»trotz« ist Genitiv-Präposition" },
  { k: "gen", pre: "während ", post: " war es ruhig.", why: "»während« ist Genitiv-Präposition" },
];

// ---------------------------------------------------------------------------
//  A2 — Kasus & Artikel
// ---------------------------------------------------------------------------
function qKasus() {
  const f = rnd(FRAMES);
  const noun = rnd(NOUNS);
  const plural = Math.random() < 0.18;
  const artType = plural ? rnd(["def", "kein", "def"]) : rnd(["def", "def", "ein", "kein"]);
  const r = decline(noun, f.k, artType, "", plural);
  if (!r.article) return qKasus();
  const g = plural ? "p" : noun.g;

  const pool = [];
  CASES.forEach((c) => {
    const x = decline(noun, c.k, artType, "", plural);
    if (x.article) pool.push(x.article);
  });
  ["m", "n", "f", "p"].forEach((gg) =>
    CASES.forEach((c) =>
      pool.push(artType === "def" ? DEF[gg][c.k] : (artType === "ein" ? "ein" : "kein") + EIN_END[gg][c.k])
    )
  );

  return {
    rule: "kasus", kind: "Kasus & Artikel", level: "A2", type: "choice",
    prompt: `${f.pre}___ ${r.noun}${f.post}`,
    hint: `${plural ? "Plural" : GENDER_LABEL[noun.g]} · ${noun.w} (${noun.en})`,
    options: options4(r.article, pool), answer: r.article,
    trace: [
      ["Auslöser", f.pre.trim() || "—", f.why],
      ["Kasus", f.k.toUpperCase(), CASES.find((c) => c.k === f.k).q],
      ["Genus", GENDER_LABEL[g], plural ? "Plural überschreibt das Genus" : ""],
      [`${artType === "def" ? "der" : artType}-Tabelle[${GENDER_LABEL[g].slice(0, 4)}][${f.k.toUpperCase()}]`, "→ " + r.article, ""],
      ["Ergebnis", f.pre + r.text + f.post, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2 — Adjektivendungen
// ---------------------------------------------------------------------------
function qAdjektiv() {
  const f = rnd(FRAMES);
  const noun = rnd(NOUNS);
  const plural = Math.random() < 0.2;
  const artType = plural ? rnd(["def", "kein", "none"]) : rnd(["def", "def", "ein", "kein", "none"]);
  const adj = rnd(ADJECTIVES);
  const r = decline(noun, f.k, artType, adj, plural);
  const g = plural ? "p" : noun.g;

  const answer = "-" + r.adjEnding;
  const options = options4(answer, ["-e", "-en", "-er", "-es", "-em"]);

  return {
    rule: "adjektiv", kind: "Adjektivendung", level: "A2", type: "choice",
    prompt: `${f.pre}${r.article ? r.article + " " : ""}${adj}___ ${r.noun}${f.post}`,
    hint: `${plural ? "Plural" : GENDER_LABEL[noun.g]} · ${
      artType === "none" ? "kein Artikelwort" : artType === "def" ? "der-Wort" : artType + "-Wort"
    }`,
    options, answer,
    trace: [
      ["Auslöser", f.pre.trim() || "—", f.why],
      ["Kasus + Genus", `${f.k.toUpperCase()} · ${GENDER_LABEL[g]}`, ""],
      ["Artikelwort", r.article || "∅", r.article ? "" : "kein Signal vorhanden"],
      ["→ Tabelle", r.adjTable,
        r.adjTable === "SCHWACH" ? "-e in der Ecke oben links, sonst -en"
          : r.adjTable === "STARK" ? "Adjektiv übernimmt die der-Endung"
          : "gemischt: stark nur da, wo ein- nackt ist"],
      [`${r.adjTable}[${GENDER_LABEL[g].slice(0, 4)}][${f.k.toUpperCase()}]`, "→ -" + r.adjEnding, ""],
      ["Ergebnis", f.pre + r.text + f.post, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2 — Wechselpräpositionen
// ---------------------------------------------------------------------------
function qPraep() {
  const noun = rnd(NOUNS.filter((n) => n.g !== "p"));
  const prep = rnd(PREP_WECHSEL);
  const motion = Math.random() < 0.5;
  const kasus = motion ? "akk" : "dat";
  const lead = rnd(
    motion
      ? ["Ich stelle es ", "Wir gehen ", "Er legt das Buch ", "Sie fährt ", "Häng das Bild "]
      : ["Es steht ", "Wir sind ", "Das Buch liegt ", "Sie wartet ", "Das Bild hängt "]
  );
  const art = DEF[noun.g][kasus];
  const pool = CASES.map((c) => DEF[noun.g][c.k]);

  return {
    rule: "praep", kind: "Wechselpräposition", level: "A2", type: "choice",
    prompt: `${lead}${prep} ___ ${noun.w}.`,
    hint: `${motion ? "Bewegung ins Ziel — wohin?" : "Position, kein Grenzübertritt — wo?"} · ${GENDER_LABEL[noun.g]}`,
    options: options4(art, pool), answer: art,
    trace: [
      ["Präposition", prep, "Wechselpräposition — Kasus hängt von der Frage ab"],
      ["Frage", motion ? "wohin?" : "wo?", motion ? "Grenzüberschreitung ins Ziel" : "Aufenthalt an einem Ort"],
      [`WECHSEL(${prep}, ${motion})`, "→ " + kasus.toUpperCase(), ""],
      [`der-Tabelle[${GENDER_LABEL[noun.g].slice(0, 4)}][${kasus.toUpperCase()}]`, "→ " + art, ""],
      ["Ergebnis", `${lead}${prep} ${art} ${noun.w}.`, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2 — feste Präpositionen (Kasus-Konstanten)
// ---------------------------------------------------------------------------
function qPrepFix() {
  const set = rnd([
    { list: PREP_AKK, k: "akk", name: "Akkusativ-Präposition" },
    { list: PREP_DAT, k: "dat", name: "Dativ-Präposition" },
    { list: PREP_GEN.slice(0, 6), k: "gen", name: "Genitiv-Präposition" },
  ]);
  const prep = rnd(set.list);
  return {
    rule: "praep", kind: "Präposition + Kasus", level: "A2", type: "choice",
    prompt: `»${prep}« + ___ ?`,
    hint: "feste Präposition — der Kasus ist konstant",
    options: ["Akkusativ", "Dativ", "Genitiv"],
    answer: { akk: "Akkusativ", dat: "Dativ", gen: "Genitiv" }[set.k],
    trace: [
      ["Präposition", prep, set.name],
      ["Kasus", set.k.toUpperCase(), "hart kodiert — keine Entscheidung nötig"],
      ["Liste", set.list.join(", "), ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2/B1/C1 — Zeitformen
// ---------------------------------------------------------------------------
function qZeiten(levelFilter) {
  const pool = levelFilter ? TENSES.filter((t) => levelFilter.includes(t.level)) : TENSES;
  const t = rnd(pool.length ? pool : TENSES);
  const v = rnd(VERBS);
  const i = rndInt(6);
  const r = conjugate(v, i, t.k);
  return {
    rule: t.k === "konj2" ? "konj2" : t.k === "konj2past" ? "konj2past" : t.k === "konj1" ? "konj1" : "zeiten",
    kind: "Zeitform bilden", level: t.level, type: "type",
    prompt: `${PRON_SHORT[i]} ___`,
    hint: `${v.inf} (${v.en}) · ${t.label} · nur den Verbteil tippen`,
    answer: r.text, accept: [r.text, `${PRON_SHORT[i]} ${r.text}`],
    trace: [
      ["Verb", v.inf, r.note || (v.aux === "sein" ? "Hilfsverb sein" : "Hilfsverb haben")],
      ["Zeit", t.label, r.formula],
      ["Person", `${PRON_FULL[i]} (${i + 1})`, ""],
      ["Bausteine", r.parts.map((p) => p.t).join("  +  "), ""],
      ["Ergebnis", `${PRON_SHORT[i]} ${r.text}`, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2 — Partizip II / Hilfsverb
// ---------------------------------------------------------------------------
function qPartizip() {
  const v = rnd(VERBS);
  if (Math.random() < 0.45) {
    return {
      rule: "partizip", kind: "Hilfsverb wählen", level: "A2", type: "choice",
      prompt: `${v.inf} → Perfekt mit ___ ?`,
      hint: `${v.en} · haben oder sein?`,
      options: ["haben", "sein"], answer: v.aux,
      trace: [
        ["Verb", v.inf, v.en],
        ["Test", v.aux === "sein"
          ? "kein Akkusativobjekt + Ortsveränderung oder Zustandswechsel"
          : "hat ein direktes Objekt / keine Ortsveränderung",
          v.aux === "sein" ? "auch: sein, bleiben, werden" : "≈95% aller Verben"],
        ["Hilfsverb", v.aux, ""],
        ["Perfekt", "ich " + conjugate(v, 0, "perfekt").text, ""],
      ],
    };
  }
  return {
    rule: "partizip", kind: "Partizip II", level: "A2", type: "type",
    prompt: `${v.inf} → ___`,
    hint: `${v.en} · Partizip II tippen`,
    answer: v.pii, accept: [v.pii],
    trace: [
      ["Verb", v.inf, v.en],
      ["Regel", v.note || (v.type === "strong" ? "stark: ge- + Ablautstamm + -en"
        : v.type === "mixed" ? "gemischt: ge- + veränderter Stamm + -t"
        : "schwach: ge- + Stamm + -t"), ""],
      ["Partizip II", v.pii, ""],
      ["Perfekt", "ich " + conjugate(v, 0, "perfekt").text, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2 — Modalverben
// ---------------------------------------------------------------------------
function qModal() {
  const m = rnd(MODALS);
  const i = rndInt(6);
  const v = rnd(VERBS.filter((x) => !x.sep));
  const tense = rnd(["praesens", "praesens", "praeteritum", "perfekt", "konj2"]);
  const r = conjugateModal(m, i, tense, v.inf);
  const label = { praesens: "Präsens", praeteritum: "Präteritum", perfekt: "Perfekt", konj2: "Konjunktiv II" }[tense];
  return {
    rule: "modal", kind: "Modalverb", level: "A2", type: "type",
    prompt: `${PRON_SHORT[i]} ___`,
    hint: `${m.inf} + ${v.inf} · ${label} · den ganzen Verbteil tippen`,
    answer: r.text, accept: [r.text, `${PRON_SHORT[i]} ${r.text}`],
    trace: [
      ["Modalverb", `${m.inf} (${m.en})`, ""],
      ["Zeit", label, r.formula],
      ["Person", PRON_FULL[i], ""],
      ["Ergebnis", `${PRON_SHORT[i]} ${r.text}`, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  A2/B1 — Wortstellung
// ---------------------------------------------------------------------------
const ORDER_QS = [
  { level: "A2", stem: "Ich bleibe zu Hause, …", ok: "weil ich krank bin.",
    bad: ["weil ich bin krank.", "weil bin ich krank."],
    why: "Nebensatz mit »weil« → das finite Verb rutscht ganz ans Ende." },
  { level: "A2", stem: "Sie sagt, …", ok: "dass sie morgen kommt.",
    bad: ["dass sie kommt morgen.", "dass kommt sie morgen."],
    why: "»dass« ist Konjunktion → Verbletztstellung." },
  { level: "A2", stem: "Vollständiger Satz:", ok: "Heute fahre ich nach Köln.",
    bad: ["Heute ich fahre nach Köln.", "Heute nach Köln ich fahre."],
    why: "Position 1 ist ein freier Slot, das finite Verb bleibt Position 2 — das Subjekt rutscht dahinter." },
  { level: "A2", stem: "Vollständiger Satz:", ok: "Ich habe gestern einen Film gesehen.",
    bad: ["Ich habe gesehen gestern einen Film.", "Ich gestern einen Film gesehen habe."],
    why: "Satzklammer: »habe« auf Position 2, »gesehen« ganz am Ende." },
  { level: "A2", stem: "Vollständiger Satz:", ok: "Ich gebe dem Kind das Buch.",
    bad: ["Ich gebe das Buch dem Kind das.", "Ich das Buch dem Kind gebe."],
    why: "Zwei volle Nomen-Objekte: Dativ vor Akkusativ." },
  { level: "B1", stem: "Vollständiger Satz:", ok: "Er fährt heute wegen der Arbeit mit dem Zug nach Köln.",
    bad: ["Er fährt nach Köln mit dem Zug heute wegen der Arbeit.", "Er fährt mit dem Zug heute nach Köln wegen der Arbeit."],
    why: "TE-KA-MO-LO: temporal → kausal → modal → lokal." },
  { level: "A2", stem: "Vollständiger Satz:", ok: "Ich weiß nicht, ob er heute kommt.",
    bad: ["Ich weiß nicht, ob kommt er heute.", "Ich weiß nicht, ob er kommt heute."],
    why: "»ob« leitet einen Nebensatz ein → Verb ans Ende." },
  { level: "A2", stem: "Vollständiger Satz:", ok: "Morgen muss ich früh aufstehen.",
    bad: ["Morgen ich muss früh aufstehen.", "Morgen muss aufstehen ich früh."],
    why: "Modalverb auf Position 2, Infinitiv am Ende — wieder die Klammer." },
  { level: "B1", stem: "Vollständiger Satz:", ok: "Ich bin krank. Deshalb bleibe ich zu Hause.",
    bad: ["Ich bin krank. Deshalb ich bleibe zu Hause.", "Ich bin krank. Deshalb ich zu Hause bleibe."],
    why: "»deshalb« besetzt Position 1 → Inversion, das Subjekt steht hinter dem Verb." },
  { level: "B1", stem: "Vollständiger Satz:", ok: "Ich gebe es dem Kind.",
    bad: ["Ich gebe dem Kind es.", "Ich es dem Kind gebe."],
    why: "Ein Akkusativpronomen überholt das Dativobjekt." },
  { level: "C1", stem: "Nebensatz mit doppeltem Infinitiv:", ok: "…, wenn ich hätte kommen können.",
    bad: ["…, wenn ich kommen können hätte.", "…, wenn ich kommen gekonnt hätte."],
    why: "Beim doppelten Infinitiv steht »hätte« VOR den beiden Infinitiven — die einzige Stelle, an der das finite Verb im Nebensatz nicht letzt steht." },
  { level: "B2", stem: "Vollständiger Satz:", ok: "Je mehr ich lerne, desto sicherer werde ich.",
    bad: ["Je mehr lerne ich, desto sicherer ich werde.", "Je mehr ich lerne, desto sicherer ich werde."],
    why: "je-Satz ist Nebensatz (Verb letzt), desto-Satz hat das Verb an Position 2." },
];
function qOrdnung() {
  const q = rnd(ORDER_QS);
  return {
    rule: "ordnung", kind: "Wortstellung", level: q.level, type: "choice", longOpts: true,
    prompt: q.stem, hint: "Welche Reihenfolge stimmt?",
    options: shuffle([q.ok, ...q.bad]), answer: q.ok,
    trace: [["Regel", "Satzklammer / Verbstellung", q.why], ["Richtig", q.ok, ""]],
  };
}

// ---------------------------------------------------------------------------
//  B1 — Konnektoren-Klassen
// ---------------------------------------------------------------------------
const CLAUSE_PAIRS = [
  { a: { s: "ich", v: "bleibe", r: "zu Hause" }, b: { s: "ich", v: "bin", r: "krank" } },
  { a: { s: "wir", v: "nehmen", r: "den Zug" }, b: { s: "das Auto", v: "ist", r: "kaputt" } },
  { a: { s: "sie", v: "lernt", r: "jeden Tag" }, b: { s: "die Prüfung", v: "ist", r: "schwierig" } },
  { a: { s: "er", v: "kommt", r: "später" }, b: { s: "der Bus", v: "hat", r: "Verspätung" } },
];
function qKonnektor() {
  const p = rnd(CLAUSE_PAIRS);
  const c = rnd(CONNECTORS.filter((x) => ["weil", "denn", "deshalb", "obwohl", "trotzdem", "da", "dennoch", "folglich", "zumal", "sodass"].includes(x.w) || Math.random() < 0.25));
  const A = `${cap(p.a.s)} ${p.a.v} ${p.a.r}`;
  const B_main = `${cap(p.b.s)} ${p.b.v} ${p.b.r}`;

  const asEnd = `${A}, ${c.w} ${p.b.s} ${p.b.r} ${p.b.v}.`;
  const asCoord = `${A}, ${c.w} ${p.b.s} ${p.b.v} ${p.b.r}.`;
  const asPos1 = `${B_main}, ${c.w} ${p.a.v} ${p.a.s} ${p.a.r}.`;

  const answer = c.pos === "end" ? asEnd : c.pos === 0 ? asCoord : asPos1;
  const bad = [asEnd, asCoord, asPos1].filter((x) => x !== answer);

  return {
    rule: "konnektor", kind: "Konnektor-Klasse", level: c.level, type: "choice", longOpts: true,
    prompt: `Welcher Satz ist mit »${c.w}« korrekt?`,
    hint: `${c.w} — ${c.en}`,
    options: shuffle([answer, ...bad]), answer,
    trace: [
      ["Konnektor", c.w, c.en],
      ["Klasse", c.pos === "end" ? "subordinierend" : c.pos === 0 ? "koordinierend" : "Position-1-Adverb",
        c.pos === "end" ? "finites Verb ans Ende"
          : c.pos === 0 ? "kein Einfluss auf die Wortstellung"
          : "Verb bleibt Position 2, Subjekt rutscht dahinter"],
      ...(c.note ? [["Achtung", c.note, ""]] : []),
      ["Richtig", answer, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B1 — Relativsätze
// ---------------------------------------------------------------------------
const REL = {
  m: { nom: "der", akk: "den", dat: "dem", gen: "dessen" },
  n: { nom: "das", akk: "das", dat: "dem", gen: "dessen" },
  f: { nom: "die", akk: "die", dat: "der", gen: "deren" },
  p: { nom: "die", akk: "die", dat: "denen", gen: "deren" },
};
const REL_FRAMES = [
  { k: "nom", mid: "dort steht", why: "Das Bezugswort ist Subjekt im Relativsatz" },
  { k: "nom", mid: "mir gefällt", why: "Subjekt im Relativsatz (»gefallen« hat hier das Bezugswort als Subjekt)" },
  { k: "akk", mid: "ich kenne", why: "»kennen« nimmt ein Akkusativobjekt" },
  { k: "akk", mid: "wir gesucht haben", why: "»suchen« nimmt ein Akkusativobjekt" },
  { k: "dat", mid: "ich helfe", why: "»helfen« verlangt Dativ" },
  { k: "dat", mid: "ich vertraue", why: "»vertrauen« verlangt Dativ" },
  { k: "gen", mid: "Auto dort steht", why: "Besitzverhältnis → Genitiv, danach KEIN Artikel" },
];
function qRelativ() {
  const noun = rnd(NOUNS);
  const plural = Math.random() < 0.2;
  const g = plural ? "p" : noun.g;
  const f = rnd(REL_FRAMES);
  const head = plural ? `${DEF[g].nom} ${noun.pl}` : `${DEF[g].nom} ${noun.w}`;
  const answer = REL[g][f.k];
  const pool = [];
  ["m", "n", "f", "p"].forEach((gg) => CASES.forEach((c) => pool.push(REL[gg][c.k])));

  return {
    rule: "relativ", kind: "Relativpronomen", level: "B1", type: "choice",
    prompt: `${cap(head)}, ___ ${f.mid}, …`,
    hint: `Bezugswort: ${plural ? "Plural" : GENDER_LABEL[noun.g]} · ${noun.en}`,
    options: options4(answer, pool), answer,
    trace: [
      ["Bezugswort", head, "liefert Genus + Numerus"],
      ["Genus/Numerus", plural ? "Plural" : GENDER_LABEL[noun.g], "von AUSSEN"],
      ["Rolle im Nebensatz", f.k.toUpperCase(), f.why + " — von INNEN"],
      [`REL[${GENDER_LABEL[g].slice(0, 4)}][${f.k.toUpperCase()}]`, "→ " + answer, ""],
      ["Ergebnis", `${cap(head)}, ${answer} ${f.mid}, …`, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B1 — Konjunktiv II
// ---------------------------------------------------------------------------
function qKonj2() {
  const useModal = Math.random() < 0.35;
  const i = rndInt(6);
  if (useModal) {
    const m = rnd(MODALS);
    const v = rnd(VERBS.filter((x) => !x.sep));
    const r = conjugateModal(m, i, "konj2", v.inf);
    return {
      rule: "konj2", kind: "Konjunktiv II", level: "B1", type: "type",
      prompt: `${PRON_SHORT[i]} ___`,
      hint: `${m.inf} + ${v.inf} · Konjunktiv II (Gegenwart)`,
      answer: r.text, accept: [r.text, `${PRON_SHORT[i]} ${r.text}`],
      trace: [
        ["Modalverb", m.inf, "hat eine echte Konjunktiv-II-Form"],
        ["Bildung", r.formula, ""],
        ["Ergebnis", `${PRON_SHORT[i]} ${r.text}`, ""],
      ],
    };
  }
  const v = rnd(VERBS);
  const r = conjugate(v, i, "konj2");
  const real = !v.k2[i].includes(" ");
  return {
    rule: "konj2", kind: "Konjunktiv II", level: "B1", type: "type",
    prompt: `${PRON_SHORT[i]} ___`,
    hint: `${v.inf} (${v.en}) · Konjunktiv II (Gegenwart)`,
    answer: r.text,
    accept: real ? [r.text, `würde ${v.inf}`.replace("würde", ["würde","würdest","würde","würden","würdet","würden"][i])] : [r.text],
    trace: [
      ["Verb", `${v.inf} · ${v.type === "strong" ? "stark" : v.type === "mixed" ? "gemischt" : "schwach"}`, ""],
      ["Bildung", r.formula, real ? "echte Form vorhanden" : "schwaches Verb → Ersatzform würde"],
      ["Ergebnis", `${PRON_SHORT[i]} ${r.text}`, real ? "würde-Form ist hier auch akzeptabel, aber die echte Form ist besser" : ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  C1 — Konjunktiv II der Vergangenheit
// ---------------------------------------------------------------------------
function qKonj2Past() {
  const i = rndInt(6);
  if (Math.random() < 0.4) {
    const m = rnd(MODALS);
    const v = rnd(VERBS.filter((x) => !x.sep));
    const r = conjugateModal(m, i, "konj2past", v.inf);
    return {
      rule: "konj2past", kind: "Konjunktiv II Vergangenheit", level: "C1", type: "type",
      prompt: `${PRON_SHORT[i]} ___`,
      hint: `${m.inf} + ${v.inf} · Vergangenheit — »ich hätte … können«`,
      answer: r.text, accept: [r.text, `${PRON_SHORT[i]} ${r.text}`],
      trace: [
        ["Konstruktion", "hätte + Infinitiv + Modalinfinitiv", "doppelter Infinitiv, kein Partizip"],
        ["Wortstellung", "Im Nebensatz: »wenn ich hätte kommen können«", "hätte VOR den Infinitiven"],
        ["Ergebnis", `${PRON_SHORT[i]} ${r.text}`, ""],
      ],
    };
  }
  const v = rnd(VERBS);
  const r = conjugate(v, i, "konj2past");
  return {
    rule: "konj2past", kind: "Konjunktiv II Vergangenheit", level: "C1", type: "type",
    prompt: `${PRON_SHORT[i]} ___`,
    hint: `${v.inf} (${v.en}) · Konjunktiv II der Vergangenheit`,
    answer: r.text, accept: [r.text, `${PRON_SHORT[i]} ${r.text}`],
    trace: [
      ["Hilfsverb", v.aux === "sein" ? "wäre" : "hätte", `${v.inf} bildet das Perfekt mit ${v.aux}`],
      ["Bildung", r.formula, "eine Form für Perfekt, Präteritum und Plusquamperfekt"],
      ["Ergebnis", `${PRON_SHORT[i]} ${r.text}`, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B2 — Konjunktiv I (indirekte Rede)
// ---------------------------------------------------------------------------
function qKonj1() {
  const v = rnd(VERBS.concat(MODALS.map((m) => ({ ...m, en: m.en, aux: "haben", type: "modal" }))));
  const i = rnd([2, 2, 2, 1, 4, 5, 3]); // 3rd sg is the workhorse
  const k = konjunktiv1(v, i);
  return {
    rule: "konj1", kind: "Konjunktiv I", level: "B2", type: "type",
    prompt: `Er sagte, ${PRON_SHORT[i] === "er" ? "er" : PRON_SHORT[i]} ___ …`,
    hint: `${v.inf} · Konjunktiv I, ${PRON_FULL[i]}`,
    answer: k.form, accept: [k.form],
    trace: [
      ["Verb", v.inf, ""],
      ["Konjunktiv I", `Stamm »${v.inf.replace(/e?n$/, "")}« + Endung`, "kein Vokalwechsel, anders als im Indikativ"],
      ["Indikativ zum Vergleich", v.pres[i], k.fellBack ? "identisch → Ersatzform nötig" : "unterscheidet sich → Konjunktiv I ist eindeutig"],
      ["Ergebnis", k.form, k.fellBack ? "Ersatzform Konjunktiv II" : "echter Konjunktiv I"],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B1/B2 — Passiv
// ---------------------------------------------------------------------------
function qPassiv() {
  const v = rnd(VERBS.filter((x) => x.trans && !x.sep));
  const f = rnd(PASSIVE_FORMS);
  const i = rnd([2, 2, 5, 0]);
  const r = conjugate(v, i, f.k);
  const subj = i === 5 ? "Die Berichte" : i === 2 ? "Der Bericht" : "Ich";
  return {
    rule: "passiv", kind: "Passiv bilden", level: f.k === "p_modal" || f.k === "p_perfekt" ? "B2" : "B1", type: "type",
    prompt: `${subj} ___`,
    hint: `${v.inf} (${v.en}) · ${f.label} · nur den Verbteil tippen`,
    answer: r.text, accept: [r.text],
    trace: [
      ["Verb", v.inf, "transitiv → persönliches Passiv möglich"],
      ["Form", f.label, r.formula],
      ["Bausteine", r.parts.map((p) => p.t).join("  +  "), ""],
      ["Ergebnis", `${subj} ${r.text}`, f.k === "p_perfekt" ? "»worden«, nicht »geworden«" : ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B1 — Verben mit Präposition
// ---------------------------------------------------------------------------
function qVerbPrep() {
  const item = rnd(VERB_PREP);
  if (Math.random() < 0.5) {
    const pool = ["auf", "an", "über", "für", "um", "mit", "von", "zu", "aus", "unter", "nach", "in"];
    return {
      rule: "verbprep", kind: "Verb + Präposition", level: "B1", type: "choice",
      prompt: `${item.v} ___ …`,
      hint: `${item.en} · welche Präposition?`,
      options: options4(item.p, pool), answer: item.p,
      trace: [
        ["Verb", item.v, item.en],
        ["Präposition", item.p, "fest — gehört zur Bedeutung des Verbs"],
        ["Kasus", item.c.toUpperCase(), "von der Präposition fixiert, nicht von der Bewegung"],
        ["Beispiel", item.ex, ""],
      ],
    };
  }
  return {
    rule: "verbprep", kind: "Verb + Präposition: Kasus", level: "B1", type: "choice",
    prompt: `${item.v} ${item.p} + ___ ?`,
    hint: item.en,
    options: ["Akkusativ", "Dativ"],
    answer: item.c === "akk" ? "Akkusativ" : "Dativ",
    trace: [
      ["Verb + Präposition", `${item.v} ${item.p}`, item.en],
      ["Kasus", item.c.toUpperCase(), "hier fest — die Wechselpräposition-Regel gilt NICHT"],
      ["Beispiel", item.ex, ""],
      ["da-Kompositum", `da${/^[aeiou]/.test(item.p) ? "r" : ""}${item.p}`, "für Sachen; für Personen: Präposition + Pronomen"],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B2 — n-Deklination
// ---------------------------------------------------------------------------
function qNDekl() {
  const noun = rnd(N_NOUNS);
  const f = rnd(FRAMES.filter((x) => x.k !== "nom"));
  const r = decline(noun, f.k, "def", "", false);
  const answer = r.noun;
  const pool = [noun.w, noun.obl, noun.gs, noun.w + "s", noun.w + "en"];
  return {
    rule: "ndekl", kind: "n-Deklination", level: "B2", type: "choice",
    prompt: `${f.pre}${r.article} ___${f.post}`,
    hint: `${noun.w} (${noun.en}) · ${f.k.toUpperCase()}`,
    options: options4(answer, pool), answer,
    trace: [
      ["Nomen", `der ${noun.w}`, "gehört zur n-Deklination"],
      ["Kasus", f.k.toUpperCase(), f.why],
      ["Regel", "maskulin + nicht Nominativ → + -(e)n", noun.mixed ? "gemischt: Genitiv zusätzlich mit -s" : ""],
      ["Ergebnis", `${f.pre}${r.article} ${answer}${f.post}`, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B2 — Partizipialattribute
// ---------------------------------------------------------------------------
const PART_ATTR = [
  { attr: "die steigenden Kosten", rel: "die Kosten, die steigen", type: "P I", why: "Partizip I = aktiv und gleichzeitig" },
  { attr: "der schlafende Hund", rel: "der Hund, der schläft", type: "P I", why: "Partizip I = aktiv und gleichzeitig" },
  { attr: "der reparierte Wagen", rel: "der Wagen, der repariert wurde", type: "P II", why: "Partizip II bei transitivem Verb = passiv und abgeschlossen" },
  { attr: "die beschlossenen Maßnahmen", rel: "die Maßnahmen, die beschlossen wurden", type: "P II", why: "Partizip II = passiv, abgeschlossen" },
  { attr: "der angekommene Zug", rel: "der Zug, der angekommen ist", type: "P II", why: "Partizip II eines sein-Verbs ist AKTIV, nicht passiv" },
  { attr: "die zu lösende Aufgabe", rel: "die Aufgabe, die gelöst werden muss", type: "zu + P I", why: "zu + Partizip I = passive Notwendigkeit" },
  { attr: "die zu erwartenden Folgen", rel: "die Folgen, die erwartet werden können", type: "zu + P I", why: "zu + Partizip I = passive Möglichkeit/Notwendigkeit" },
  { attr: "das diskutierte Problem", rel: "das Problem, das diskutiert wird", type: "P II", why: "Partizip II = passiv" },
];
function qPartizipAttr() {
  const item = rnd(PART_ATTR);
  const bad = shuffle(PART_ATTR.filter((x) => x !== item)).slice(0, 2).map((x) => x.rel);
  return {
    rule: "partizipattr", kind: "Partizipialattribut auflösen", level: "B2", type: "choice", longOpts: true,
    prompt: `»${item.attr}« — welcher Relativsatz entspricht dem?`,
    hint: item.type,
    options: shuffle([item.rel, ...bad]), answer: item.rel,
    trace: [
      ["Attribut", item.attr, item.type],
      ["Regel", item.why, ""],
      ["Relativsatz", item.rel, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B2 — Nominalisierung
// ---------------------------------------------------------------------------
const NOMINAL = [
  { clause: "Weil das Wetter schlecht war, blieben wir zu Hause.", nom: "Wegen des schlechten Wetters blieben wir zu Hause.", pair: "weil ⇄ wegen + GEN" },
  { clause: "Obwohl die Kosten hoch waren, wurde das Projekt fortgesetzt.", nom: "Trotz der hohen Kosten wurde das Projekt fortgesetzt.", pair: "obwohl ⇄ trotz + GEN" },
  { clause: "Wenn es regnet, findet die Veranstaltung drinnen statt.", nom: "Bei Regen findet die Veranstaltung drinnen statt.", pair: "wenn ⇄ bei + DAT" },
  { clause: "Nachdem die Sitzung beendet war, gingen alle nach Hause.", nom: "Nach dem Ende der Sitzung gingen alle nach Hause.", pair: "nachdem ⇄ nach + DAT" },
  { clause: "Während die Bauarbeiten liefen, war die Straße gesperrt.", nom: "Während der Bauarbeiten war die Straße gesperrt.", pair: "während ⇄ während + GEN" },
  { clause: "Bevor die Prüfung begann, waren alle nervös.", nom: "Vor Beginn der Prüfung waren alle nervös.", pair: "bevor ⇄ vor + DAT" },
  { clause: "Er ging, ohne dass er sich verabschiedete.", nom: "Er ging ohne Verabschiedung.", pair: "ohne dass ⇄ ohne + AKK" },
];
function qNominal() {
  const item = rnd(NOMINAL);
  const toNominal = Math.random() < 0.6;
  const bad = shuffle(NOMINAL.filter((x) => x !== item)).slice(0, 2).map((x) => (toNominal ? x.nom : x.clause));
  const answer = toNominal ? item.nom : item.clause;
  return {
    rule: "nominal", kind: toNominal ? "Nominalisierung" : "Verbalisierung", level: "B2", type: "choice", longOpts: true,
    prompt: `»${toNominal ? item.clause : item.nom}« — ${toNominal ? "im Nominalstil" : "als Nebensatz"}?`,
    hint: item.pair,
    options: shuffle([answer, ...bad]), answer,
    trace: [
      ["Ausgangsform", toNominal ? item.clause : item.nom, ""],
      ["Umformung", item.pair, "Nebensatz ⇄ Präpositionalphrase"],
      ["Ergebnis", answer, ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  B2 — zweiteilige Konnektoren
// ---------------------------------------------------------------------------
const PAIRED_QS = [
  { s: "Ich habe ___ Zeit noch Geld.", a: "weder", why: "weder … noch — schon verneint, kein »kein« dazu", full: "weder … noch" },
  { s: "___ er als auch sie kommen zur Sitzung.", a: "sowohl", why: "sowohl … als auch — zwei Subjekte, Verb im Plural", full: "sowohl … als auch" },
  { s: "Wir fahren ___ mit dem Zug oder mit dem Auto.", a: "entweder", why: "entweder … oder — Alternative", full: "entweder … oder" },
  { s: "Er hat ___ nur den Bericht gelesen, sondern auch kommentiert.", a: "nicht", why: "nicht nur … sondern auch — Steigerung", full: "nicht nur … sondern auch" },
  { s: "Das Projekt ist ___ teuer, aber notwendig.", a: "zwar", why: "zwar … aber — Einräumung", full: "zwar … aber" },
  { s: "___ mehr ich lerne, desto sicherer werde ich.", a: "Je", why: "je + Komparativ + Verbletzt, desto + Komparativ + Verb an Position 2", full: "je … desto" },
];
function qPaired() {
  const item = rnd(PAIRED_QS);
  const pool = ["weder", "sowohl", "entweder", "nicht", "zwar", "Je", "einerseits", "teils"];
  return {
    rule: "paired", kind: "Zweiteiliger Konnektor", level: "B2", type: "choice",
    prompt: item.s.replace("___", "___"),
    hint: "Welches erste Teil passt?",
    options: options4(item.a, pool), answer: item.a,
    trace: [
      ["Konnektor", item.full, ""],
      ["Regel", item.why, ""],
      ["Ergebnis", item.s.replace("___", item.a), ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  C1 — Funktionsverbgefüge
// ---------------------------------------------------------------------------
function qFVG() {
  const item = rnd(FVG);
  const toFVG = Math.random() < 0.6;
  const pool = FVG.filter((x) => x !== item).map((x) => (toFVG ? x.w : x.plain));
  const answer = toFVG ? item.w : item.plain;
  return {
    rule: "fvg", kind: "Funktionsverbgefüge", level: "C1", type: "choice", longOpts: true,
    prompt: toFVG ? `»${item.plain}« im Nominalstil: ___` : `»${item.w}« als einfaches Verb: ___`,
    hint: item.en,
    options: options4(answer, pool), answer,
    trace: [
      ["einfaches Verb", item.plain, item.en],
      ["Funktionsverbgefüge", item.w, "Funktionsverb + Nomen — Register der Fach- und Amtssprache"],
      ["Hinweis", "Der Artikel gehört zur festen Wendung", "»in Frage stellen« ohne Artikel, »zur Verfügung stellen« mit zur"],
    ],
  };
}

// ---------------------------------------------------------------------------
//  C1 — Passiversatzformen
// ---------------------------------------------------------------------------
const PASSIV_ERSATZ = [
  { base: "Der Antrag kann online gestellt werden.",
    forms: { "sein + zu": "Der Antrag ist online zu stellen.", "sich lassen": "Der Antrag lässt sich online stellen.", "-bar": "Der Antrag ist online stellbar.", "man": "Man kann den Antrag online stellen." } },
  { base: "Das Problem kann gelöst werden.",
    forms: { "sein + zu": "Das Problem ist zu lösen.", "sich lassen": "Das Problem lässt sich lösen.", "-bar": "Das Problem ist lösbar.", "man": "Man kann das Problem lösen." } },
  { base: "Die Rechnung muss bis Freitag bezahlt werden.",
    forms: { "sein + zu": "Die Rechnung ist bis Freitag zu bezahlen.", "man": "Man muss die Rechnung bis Freitag bezahlen." } },
  { base: "Der Text kann leicht verstanden werden.",
    forms: { "sein + zu": "Der Text ist leicht zu verstehen.", "sich lassen": "Der Text lässt sich leicht verstehen.", "-bar": "Der Text ist leicht verständlich.", "man": "Man kann den Text leicht verstehen." } },
];
function qPassivErsatz() {
  const item = rnd(PASSIV_ERSATZ);
  const keys = Object.keys(item.forms);
  const key = rnd(keys);
  const answer = item.forms[key];
  const pool = [];
  PASSIV_ERSATZ.forEach((x) => { if (x !== item) Object.values(x.forms).forEach((v) => pool.push(v)); });
  return {
    rule: "passiversatz", kind: "Passiversatzform", level: "C1", type: "choice", longOpts: true,
    prompt: `»${item.base}« — als »${key}«?`,
    hint: "Gleiche Bedeutung, anderes Register",
    options: options4(answer, pool), answer,
    trace: [
      ["Passiv", item.base, ""],
      ["Ersatzform", key, "trägt Passivbedeutung ohne »werden«"],
      ["Ergebnis", answer, ""],
      ["Alle Varianten", keys.map((k) => `${k}: ${item.forms[k]}`).join("  ·  "), ""],
    ],
  };
}

// ---------------------------------------------------------------------------
//  C1 — Modalpartikeln
// ---------------------------------------------------------------------------
function qPartikel() {
  const item = rnd(MODALPARTIKELN);
  const pool = MODALPARTIKELN.filter((x) => x !== item).map((x) => x.w.split(" / ")[0]);
  const answer = item.w.split(" / ")[0];
  return {
    rule: "partikel", kind: "Modalpartikel", level: "C1", type: "choice",
    prompt: `Welche Partikel drückt »${item.fn}« aus? ___`,
    hint: `${item.en} — z.B.: ${item.ex.replace(new RegExp(answer, "i"), "…")}`,
    options: options4(answer, pool), answer,
    trace: [
      ["Partikel", item.w, item.en],
      ["Funktion", item.fn, ""],
      ["Beispiel", item.ex, ""],
      ["Stellung", "unbetont im Mittelfeld, meist direkt nach Subjekt und Pronomen", "nicht im formellen Aufsatz verwenden"],
    ],
  };
}

// ---------------------------------------------------------------------------
//  Registry
// ---------------------------------------------------------------------------
export const RULES = [
  { id: "kasus", name: "Kasus & Artikel", level: "A2", gen: qKasus },
  { id: "adjektiv", name: "Adjektivendungen", level: "A2", gen: qAdjektiv },
  { id: "praep", name: "Präpositionen", level: "A2", gen: () => (Math.random() < 0.65 ? qPraep() : qPrepFix()) },
  { id: "ordnung", name: "Wortstellung", level: "A2", gen: qOrdnung },
  { id: "zeiten", name: "Zeitformen", level: "A2", gen: () => qZeiten(["A2", "B1"]) },
  { id: "partizip", name: "Partizip II & Hilfsverb", level: "A2", gen: qPartizip },
  { id: "modal", name: "Modalverben", level: "A2", gen: qModal },
  { id: "konnektor", name: "Konnektoren", level: "B1", gen: qKonnektor },
  { id: "relativ", name: "Relativsätze", level: "B1", gen: qRelativ },
  { id: "konj2", name: "Konjunktiv II", level: "B1", gen: qKonj2 },
  { id: "passiv", name: "Passiv", level: "B1", gen: qPassiv },
  { id: "verbprep", name: "Verben mit Präposition", level: "B1", gen: qVerbPrep },
  { id: "konj1", name: "Konjunktiv I", level: "B2", gen: qKonj1 },
  { id: "ndekl", name: "n-Deklination", level: "B2", gen: qNDekl },
  { id: "partizipattr", name: "Partizipialattribute", level: "B2", gen: qPartizipAttr },
  { id: "nominal", name: "Nominalisierung", level: "B2", gen: qNominal },
  { id: "paired", name: "Zweiteilige Konnektoren", level: "B2", gen: qPaired },
  { id: "fvg", name: "Funktionsverbgefüge", level: "C1", gen: qFVG },
  { id: "passiversatz", name: "Passiversatzformen", level: "C1", gen: qPassivErsatz },
  { id: "konj2past", name: "Konjunktiv II Vergangenheit", level: "C1", gen: qKonj2Past },
  { id: "partikel", name: "Modalpartikeln", level: "C1", gen: qPartikel },
];

export const RULE_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]));
export const RULE_IDS = RULES.map((r) => r.id);

/** Generate one question for a rule id, with a guard against malformed output. */
export function generate(ruleId) {
  const rule = RULE_BY_ID[ruleId] || rnd(RULES);
  for (let attempt = 0; attempt < 5; attempt++) {
    const q = rule.gen();
    if (!q) continue;
    if (q.type === "choice") {
      if (!q.options || q.options.length < 2) continue;
      if (!q.options.includes(q.answer)) continue;
      if (new Set(q.options).size !== q.options.length) continue;
    }
    if (!q.answer) continue;
    return { ...q, rule: rule.id, ruleName: rule.name };
  }
  return { ...qKasus(), rule: "kasus", ruleName: "Kasus & Artikel" };
}

/**
 * Pick the next rule: unseen rules first, then weighted toward low mastery.
 * `pool` is a list of rule ids the caller has already filtered by level/topic.
 */
export function pickRule(pool, mastery) {
  const ids = pool && pool.length ? pool : RULE_IDS;
  const weights = ids.map((id) => {
    const m = mastery?.[id] || { r: 0, t: 0 };
    if (m.t < 3) return 4;
    return 1 + (1 - m.r / m.t) * 5;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  let x = Math.random() * sum;
  for (let i = 0; i < ids.length; i++) {
    x -= weights[i];
    if (x <= 0) return ids[i];
  }
  return ids[ids.length - 1];
}
