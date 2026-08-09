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
//  GRAMMAR ENGINE — derives every form from the tables, and returns the
//  rule trace that produced it. Nothing here is memorised output.
// ============================================================================

import {
  DEF, EIN_END, WEAK, STRONG, GENDER_LABEL, CASES, VERBS, MODALS,
} from "../data/lexicon.js";

const V = Object.fromEntries(VERBS.map((v) => [v.inf, v]));
const M = Object.fromEntries(MODALS.map((v) => [v.inf, v]));

export const verbByInf = (inf) => V[inf] || M[inf];

// ---------------------------------------------------------------- nouns ----

export function nounForm(noun, kasus, plural) {
  if (noun.obl) {
    // n-Deklination
    if (plural) return { w: noun.pl, note: "n-Deklination — Plural immer -(e)n" };
    if (kasus === "nom") return { w: noun.w, note: "" };
    if (kasus === "gen")
      return { w: noun.gs, note: noun.mixed ? "gemischt: -n + Genitiv-s" : "n-Deklination — alle Kasus außer NOM" };
    return { w: noun.obl, note: "n-Deklination — alle Kasus außer NOM" };
  }
  if (plural) {
    const p = noun.pl;
    if (kasus === "dat" && !/[ns]$/.test(p)) return { w: p + "n", note: "Dativ Plural → Nomen + -n" };
    return { w: p, note: "" };
  }
  if (kasus === "gen" && (noun.g === "m" || noun.g === "n"))
    return { w: noun.gs, note: "Genitiv Mask/Neut → Nomen + -(e)s" };
  return { w: noun.w, note: "" };
}

/**
 * Build a noun phrase and explain every step.
 * artType: "def" | "ein" | "kein" | "none"
 */
export function decline(noun, kasus, artType, adj, plural) {
  const g = plural ? "p" : noun.g;
  const trace = [];
  let article = "";
  let articleCarriesSignal = false;

  if (artType === "def") {
    article = DEF[g][kasus];
    articleCarriesSignal = true;
    trace.push([
      GENDER_LABEL[g] + " + " + kasus.toUpperCase(),
      "der-Tabelle → " + article,
      kasus === "akk" && g === "m" ? "einzige Zelle, die sich von NOM unterscheidet" : "",
    ]);
  } else if (artType === "ein" || artType === "kein") {
    const stem = artType === "ein" ? "ein" : "kein";
    if (artType === "ein" && plural) {
      article = "";
      trace.push(["ein + Plural", "existiert nicht → kein Artikel", "Adjektiv übernimmt das Signal"]);
    } else {
      const e = EIN_END[g][kasus];
      article = stem + e;
      articleCarriesSignal = e !== "";
      trace.push([
        GENDER_LABEL[g] + " + " + kasus.toUpperCase(),
        stem + ' + "' + (e || "∅") + '" → ' + article,
        e === "" ? "nackte Zelle — kein Signal" : "",
      ]);
    }
  } else {
    trace.push(["kein Artikelwort", "Signal fehlt komplett", "Adjektiv muss es tragen"]);
  }

  let ending = "";
  let table = "";
  if (adj) {
    if (articleCarriesSignal) {
      table = "SCHWACH";
      ending = WEAK[g][kasus];
      trace.push(["Artikel trägt Signal", "→ schwache Endung", "-e in der Ecke oben links, sonst -en"]);
    } else if (artType === "none" || (artType === "ein" && plural)) {
      table = "STARK";
      ending = STRONG[g][kasus];
      trace.push(["kein Signal vorhanden", "→ starke Endung", "= die der-Endung"]);
    } else {
      table = "GEMISCHT";
      ending = STRONG[g][kasus];
      trace.push(["Artikel ist nackt", "→ gemischt = hier starke Endung", "borgt -er/-es von der-Tabelle"]);
    }
    trace.push([`${table}[${GENDER_LABEL[g].slice(0, 4)}][${kasus.toUpperCase()}]`, "→ -" + ending, ""]);
  }

  const nf = nounForm(noun, kasus, plural);
  if (nf.note) trace.push(["Nomen", "→ " + nf.w, nf.note]);

  const parts = [];
  if (article) parts.push(article);
  if (adj) parts.push(adj + ending);
  parts.push(nf.w);

  return {
    article, adjEnding: ending, adjTable: table, noun: nf.w,
    gender: g, kasus, text: parts.join(" "), trace,
  };
}

// -------------------------------------------------------------- tenses -----

export const TENSES = [
  { k: "praesens", label: "Präsens", level: "A2" },
  { k: "perfekt", label: "Perfekt", level: "A2" },
  { k: "praeteritum", label: "Präteritum", level: "A2" },
  { k: "plusquam", label: "Plusquamperfekt", level: "B1" },
  { k: "futur1", label: "Futur I", level: "B1" },
  { k: "futur2", label: "Futur II", level: "B1" },
  { k: "konj2", label: "Konjunktiv II", level: "B1" },
  { k: "konj2past", label: "Konjunktiv II (Vergangenheit)", level: "C1" },
  { k: "konj1", label: "Konjunktiv I", level: "B2" },
];
export const TENSE_LABEL = Object.fromEntries(TENSES.map((t) => [t.k, t.label]));

export const PASSIVE_FORMS = [
  { k: "p_praesens", label: "Passiv Präsens" },
  { k: "p_praeteritum", label: "Passiv Präteritum" },
  { k: "p_perfekt", label: "Passiv Perfekt" },
  { k: "p_futur1", label: "Passiv Futur I" },
  { k: "p_modal", label: "Passiv mit Modalverb" },
];
export const PASSIVE_LABEL = Object.fromEntries(PASSIVE_FORMS.map((t) => [t.k, t.label]));

const stemOf = (inf) => (inf.endsWith("en") ? inf.slice(0, -2) : inf.slice(0, -1));
const K1_ENDINGS = ["e", "est", "e", "en", "et", "en"];

/** Konjunktiv I with the real fallback rule: identical to Indikativ → use K II. */
export function konjunktiv1(verb, i) {
  const v = typeof verb === "string" ? verbByInf(verb) : verb;
  if (v.inf === "sein") {
    return { form: ["sei", "seist", "sei", "seien", "seiet", "seien"][i], fellBack: false };
  }
  // A separable prefix is not part of the stem: aufstehen → stehe … auf,
  // never *aufstehe. Strip it before building the form; conjugate() re-appends
  // it at the clause end like every other tense.
  const base = v.sep && v.inf.startsWith(v.sep) ? v.inf.slice(v.sep.length) : v.inf;
  const candidate = stemOf(base) + K1_ENDINGS[i];
  if (candidate === v.pres[i]) return { form: v.k2[i], fellBack: true };
  return { form: candidate, fellBack: false };
}

/**
 * Conjugate into any tense. Returns coloured parts + the composition formula.
 * parts[].c: "plain" | "aux" | "part" | "inf"
 */
export function conjugate(verb, i, tense) {
  const v = typeof verb === "string" ? verbByInf(verb) : verb;
  const sep = v.sep || "";
  const out = [];
  let formula = "";
  let note = v.note || "";

  const push = (t, c) => out.push({ t, c });

  switch (tense) {
    case "praesens":
      push(v.pres[i], "plain");
      if (sep) push(sep, "part");
      formula = "Stamm + Personalendung" + (sep ? "   ·   trennbares Präfix ans Ende" : "");
      break;
    case "praeteritum":
      push(v.prat[i], "plain");
      if (sep) push(sep, "part");
      formula = "Präteritum-Stamm + Endung" + (sep ? "   ·   Präfix ans Ende" : "");
      break;
    case "perfekt":
      push(V[v.aux].pres[i], "aux");
      push(v.pii, "part");
      formula = `${v.aux}[Präsens] + Partizip II   ·   ${v.aux === "sein" ? "sein: Bewegung / Zustandswechsel" : "haben: Standardfall"}`;
      break;
    case "plusquam":
      push(V[v.aux].prat[i], "aux");
      push(v.pii, "part");
      formula = `${v.aux}[Präteritum] + Partizip II`;
      break;
    case "futur1":
      push(V["werden"].pres[i], "aux");
      push(v.inf, "inf");
      formula = "werden[Präsens] + Infinitiv";
      break;
    case "futur2":
      push(V["werden"].pres[i], "aux");
      push(v.pii, "part");
      push(v.aux, "inf");
      formula = `werden[Präsens] + Partizip II + ${v.aux}`;
      break;
    case "konj2": {
      const f = v.k2[i];
      if (f.includes(" ")) {
        const [a, b] = f.split(" ");
        push(a, "aux"); push(b, "inf");
        formula = "würde + Infinitiv   ·   schwaches Verb: eigene Form = Präteritum, deshalb Ersatzform";
      } else {
        push(f, "plain");
        if (sep) push(sep, "part");
        formula = "Präteritum-Stamm + Umlaut + -e/-est/-e/-en/-et/-en";
      }
      break;
    }
    case "konj2past":
      push(V[v.aux].k2[i], "aux");
      push(v.pii, "part");
      formula = `${v.aux === "sein" ? "wäre" : "hätte"} + Partizip II   ·   eine Form für alle Vergangenheiten`;
      break;
    case "konj1": {
      const k = konjunktiv1(v, i);
      if (k.form.includes(" ")) {
        const [a, b] = k.form.split(" ");
        push(a, "aux"); push(b, "inf");
      } else {
        push(k.form, "plain");
        if (sep) push(sep, "part");
      }
      formula = k.fellBack
        ? "Konjunktiv I wäre identisch mit dem Indikativ → Ersatzform Konjunktiv II"
        : "Infinitivstamm + -e/-est/-e/-en/-et/-en   ·   kein Vokalwechsel";
      if (k.fellBack) note = "Ersatzform: " + v.pres[i] + " (Indikativ) = " + stemOf(v.inf) + K1_ENDINGS[i];
      break;
    }
    // ---- passive -------------------------------------------------------
    case "p_praesens":
      push(V["werden"].pres[i], "aux"); push(v.pii, "part");
      formula = "werden[Präsens] + Partizip II";
      break;
    case "p_praeteritum":
      push(V["werden"].prat[i], "aux"); push(v.pii, "part");
      formula = "werden[Präteritum] + Partizip II";
      break;
    case "p_perfekt":
      push(V["sein"].pres[i], "aux"); push(v.pii, "part"); push("worden", "inf");
      formula = "sein[Präsens] + Partizip II + worden   ·   worden, nicht geworden";
      break;
    case "p_futur1":
      push(V["werden"].pres[i], "aux"); push(v.pii, "part"); push("werden", "inf");
      formula = "werden[Präsens] + Partizip II + werden";
      break;
    case "p_modal":
      push(M["müssen"].pres[i], "aux"); push(v.pii, "part"); push("werden", "inf");
      formula = "Modalverb + Partizip II + werden";
      break;
    default:
      push(v.pres[i], "plain");
  }

  return { parts: out, formula, note, text: out.map((p) => p.t).join(" ") };
}

/** Modal verbs conjugate into their own small set of tenses. */
export function conjugateModal(modal, i, tense, infinitive) {
  const m = typeof modal === "string" ? M[modal] : modal;
  const out = [];
  let formula = "";
  const push = (t, c) => out.push({ t, c });
  switch (tense) {
    case "praesens":
      push(m.pres[i], "aux"); push(infinitive, "inf");
      formula = "Modalverb[Position 2] + Infinitiv[Ende]";
      break;
    case "praeteritum":
      push(m.prat[i], "aux"); push(infinitive, "inf");
      formula = "Modalverb[Präteritum] + Infinitiv[Ende]";
      break;
    case "perfekt":
      push(V["haben"].pres[i], "aux"); push(infinitive, "inf"); push(m.inf, "inf");
      formula = "haben + Infinitiv + Modalinfinitiv   ·   doppelter Infinitiv, kein Partizip";
      break;
    case "konj2":
      push(m.k2[i], "aux"); push(infinitive, "inf");
      formula = "Modalverb[Konjunktiv II] + Infinitiv";
      break;
    case "konj2past":
      push(V["haben"].k2[i], "aux"); push(infinitive, "inf"); push(m.inf, "inf");
      formula = "hätte + Infinitiv + Modalinfinitiv   ·   im Nebensatz steht hätte VOR den Infinitiven";
      break;
    default:
      push(m.pres[i], "aux"); push(infinitive, "inf");
  }
  return { parts: out, formula, text: out.map((p) => p.t).join(" ") };
}

// ------------------------------------------------------ helpers ------------

export const caseInfo = (k) => CASES.find((c) => c.k === k);

/** Forgiving comparison: case, umlaut transliteration, ß/ss, punctuation. */
export function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[.!?,;:]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue");
}

export const answersMatch = (given, accepted) =>
  (Array.isArray(accepted) ? accepted : [accepted]).map(norm).includes(norm(given));
