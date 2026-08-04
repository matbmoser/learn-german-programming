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
//  HIGHLIGHT — turns German prose into IDE-style tokens.
//
//  Two layers stack in the editor overlay:
//    1. keyword tokens — closed-class words (articles, prepositions,
//       connectors, modal verbs, pronouns, particles) get a colour, exactly
//       like keywords in a programming language.
//    2. error ranges — once Claude has corrected the text, the exact passages
//       it flagged are wrapped as errors (red, wavy) right over the words.
// ============================================================================

import {
  DEF, PREP_AKK, PREP_DAT, PREP_GEN, PREP_WECHSEL, CONNECTORS, MODALS,
  MODALPARTIKELN, PERSONAL, REFLEX_AKK, REFLEX_DAT, VERBS,
} from "../data/lexicon.js";

const lc = (w) => w.toLowerCase();

// --- closed-class dictionaries ---------------------------------------------

const ARTICLES = new Set([
  ...Object.values(DEF).flatMap((g) => Object.values(g)),
  "ein", "eine", "einen", "einem", "einer", "eines",
  "kein", "keine", "keinen", "keinem", "keiner", "keines",
  "dieser", "diese", "dieses", "diesen", "diesem",
  "jeder", "jede", "jedes", "jeden", "jedem",
  "welcher", "welche", "welches", "welchen", "welchem",
  "mancher", "manche", "manches", "manchen", "manchem",
  "mein", "meine", "meinen", "meinem", "meiner", "meines",
  "dein", "deine", "deinen", "deinem", "deiner", "deines",
  "sein", "seine", "seinen", "seinem", "seiner", "seines",
  "ihr", "ihre", "ihren", "ihrem", "ihrer", "ihres",
  "unser", "unsere", "unseren", "unserem", "unserer", "unseres",
  "euer", "eure", "euren", "eurem", "eurer", "eures",
].map(lc));

const PREPS = new Set(
  [...PREP_AKK, ...PREP_DAT, ...PREP_GEN, ...PREP_WECHSEL].map(lc)
);

const CONN = new Set(
  CONNECTORS.map((c) => lc(c.w)).filter((w) => !w.includes(" "))
);

const MODAL_FORMS = new Set(
  MODALS.flatMap((m) => [m.inf, ...m.pres, ...m.prat, ...m.k2]).map(lc)
);

const PARTICLES = new Set(
  MODALPARTIKELN.flatMap((p) => lc(p.w).split(" / ")).map((w) => w.trim())
);

const PRONOUNS = new Set([
  ...PERSONAL.nom, ...PERSONAL.akk, ...PERSONAL.dat,
  ...REFLEX_AKK, ...REFLEX_DAT,
  "sie", "es", "man", "wir", "ihr",
].map(lc));

// sein / haben / werden — the auxiliaries that build every compound tense
const AUX = new Set([
  "sein", "bin", "bist", "ist", "sind", "seid", "war", "warst", "waren", "wart",
  "gewesen", "sei", "wäre", "wären", "wärst",
  "haben", "habe", "hast", "hat", "habt", "hatte", "hattest", "hatten", "hattet",
  "gehabt", "hätte", "hätten", "hättest",
  "werden", "werde", "wirst", "wird", "werdet", "wurde", "wurdest", "wurden",
  "wurdet", "geworden", "worden", "würde", "würden", "würdest",
].map(lc));

// every plain verb form we can derive from the lexicon
const VERB_FORMS = new Set(
  VERBS.flatMap((v) => [v.inf, v.pii, ...(v.pres || []), ...(v.prat || [])]).map(lc)
);

/** Grammatical class of a single word, or null if it is ordinary content. */
function classify(word) {
  const w = lc(word);
  if (MODAL_FORMS.has(w)) return "modal";
  if (AUX.has(w)) return "aux";
  if (CONN.has(w)) return "conn";
  if (PREPS.has(w)) return "prep";
  if (ARTICLES.has(w)) return "art";
  if (PRONOUNS.has(w)) return "pron";
  if (PARTICLES.has(w)) return "part";
  if (VERB_FORMS.has(w)) return "verb";
  return null;
}

const WORD_RE = /[A-Za-zÀ-ÿ]+/g;

/** Split a plain string into keyword/plain segments for the overlay. */
function tokenize(text) {
  const out = [];
  let last = 0;
  let m;
  WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), cls: null });
    const cls = classify(m[0]);
    out.push({ text: m[0], cls: cls ? "tok-" + cls : null });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), cls: null });
  return out;
}

/**
 * Locate each correction's `original` passage inside the text.
 * Returns non-overlapping ranges sorted by position.
 */
export function buildErrorRanges(text, corrections = []) {
  const ranges = [];
  const used = [];
  corrections.forEach((c, index) => {
    const needle = (c.original || "").trim();
    if (!needle) return;
    let at = text.indexOf(needle);
    if (at === -1) at = text.toLowerCase().indexOf(needle.toLowerCase());
    if (at === -1) return;
    const end = at + needle.length;
    if (used.some((u) => at < u.end && end > u.start)) return; // skip overlaps
    used.push({ start: at, end });
    ranges.push({ start: at, end, index, severity: c.severity || "mittel" });
  });
  return ranges.sort((a, b) => a.start - b.start);
}

// --- pseudocode blocks (Regeln / Regelwerk `code` and `rule` fields) -------

const CODE_TOKEN_RE = /(\/\/[^\n]*)|\b(NOM|AKK|DAT|GEN)\b|\b(function|if|else|return|const)\b/g;

/**
 * Split a rule/curriculum pseudocode string into IDE-style segments:
 * comments dim, case labels (NOM/AKK/DAT/GEN) in their case colour and bold,
 * pseudocode keywords (function/if/else/return/const) in the keyword colour.
 */
export function tokenizeCode(text) {
  const out = [];
  let last = 0;
  let m;
  CODE_TOKEN_RE.lastIndex = 0;
  while ((m = CODE_TOKEN_RE.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), cls: null });
    if (m[1]) out.push({ text: m[1], cls: "cm" });
    else if (m[2]) out.push({ text: m[2], cls: "c-" + m[2].toLowerCase(), bold: true });
    else out.push({ text: m[3], cls: "kw" });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), cls: null });
  return out;
}

/**
 * Build the overlay segments for the whole text: plain regions are tokenised
 * for keyword colour, error regions are wrapped as a single error span that
 * still carries its inner keyword colouring.
 */
export function buildSegments(text, errorRanges = [], activeIndex = null) {
  if (!text) return [];
  const segs = [];
  let cursor = 0;
  for (const r of errorRanges) {
    if (r.start > cursor) segs.push(...tokenize(text.slice(cursor, r.start)));
    const inner = tokenize(text.slice(r.start, r.end));
    segs.push({
      error: true,
      index: r.index,
      severity: r.severity,
      active: r.index === activeIndex,
      children: inner,
    });
    cursor = r.end;
  }
  if (cursor < text.length) segs.push(...tokenize(text.slice(cursor)));
  return segs;
}
