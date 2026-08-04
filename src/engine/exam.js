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
//  PLACEMENT EXAM — adaptive item selection + CEFR level estimation.
//  Grammar items come from the generators; the fixed bank below adds the
//  register, vocabulary and reading judgement that generators can't produce.
// ============================================================================

import { RULES, generate } from "./drills.js";
import { LEVELS } from "../data/curriculum.js";

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

// ---------------------------------------------------------------------------
//  Fixed bank — register, idiom, reading judgement
// ---------------------------------------------------------------------------
export const EXAM_BANK = [
  // ---- A2
  { level: "A2", rule: "wortschatz", kind: "Wortschatz",
    prompt: "Ich ___ mich auf das Wochenende.",
    options: ["freue", "freut", "gefreut", "freuen"], answer: "freue",
    why: "sich freuen auf + AKK, 1. Person Singular: ich freue mich." },
  { level: "A2", rule: "kasus", kind: "Kasus",
    prompt: "Kannst du ___ helfen?",
    options: ["mir", "mich", "ich", "meiner"], answer: "mir",
    why: "helfen verlangt Dativ — mir, nicht mich." },
  { level: "A2", rule: "zeiten", kind: "Zeitform",
    prompt: "Gestern ___ ich ins Kino gegangen.",
    options: ["bin", "habe", "war", "wurde"], answer: "bin",
    why: "gehen ist ein Bewegungsverb → Perfekt mit sein." },
  { level: "A2", rule: "modal", kind: "Modalverb",
    prompt: "Du ___ nicht kommen — es ist keine Pflicht.",
    options: ["musst", "darfst", "kannst", "sollst"], answer: "musst",
    why: "nicht müssen = keine Notwendigkeit. nicht dürfen wäre ein Verbot." },
  { level: "A2", rule: "ordnung", kind: "Wortstellung",
    prompt: "Wähle den korrekten Satz.",
    options: ["Am Montag habe ich einen Termin.", "Am Montag ich habe einen Termin.", "Am Montag einen Termin ich habe.", "Habe am Montag ich einen Termin."],
    answer: "Am Montag habe ich einen Termin.",
    why: "Position 1 ist besetzt → finites Verb Position 2, Subjekt dahinter." },

  // ---- B1
  { level: "B1", rule: "konnektor", kind: "Konnektor",
    prompt: "Er kam zu spät, ___ er den Bus verpasst hatte.",
    options: ["weil", "denn", "deshalb", "trotzdem"], answer: "weil",
    why: "Das Verb steht am Ende (»verpasst hatte«) → subordinierender Konnektor." },
  { level: "B1", rule: "relativ", kind: "Relativsatz",
    prompt: "Das ist der Kollege, ___ ich den Bericht geschickt habe.",
    options: ["dem", "den", "der", "dessen"], answer: "dem",
    why: "schicken + Dativobjekt (jemandem etwas schicken) → dem." },
  { level: "B1", rule: "konj2", kind: "Konjunktiv II",
    prompt: "Wenn ich mehr Zeit ___, würde ich Spanisch lernen.",
    options: ["hätte", "habe", "hatte", "haben würde"], answer: "hätte",
    why: "haben hat eine echte Konjunktiv-II-Form — würde haben wäre stilistisch schlecht." },
  { level: "B1", rule: "passiv", kind: "Passiv",
    prompt: "Das Formular ___ gestern unterschrieben.",
    options: ["wurde", "wurde worden", "ist worden", "hat"], answer: "wurde",
    why: "Vorgangspassiv Präteritum = wurde + Partizip II." },
  { level: "B1", rule: "verbprep", kind: "Verb + Präposition",
    prompt: "Ich erinnere mich nicht ___ seinen Namen.",
    options: ["an", "auf", "über", "für"], answer: "an",
    why: "sich erinnern AN + Akkusativ — feste Verbindung." },
  { level: "B1", rule: "genitiv", kind: "Genitiv",
    prompt: "Während ___ Sitzung wurde nichts entschieden.",
    options: ["der", "die", "dem", "den"], answer: "der",
    why: "während + Genitiv; Sitzung ist feminin → der." },
  { level: "B1", rule: "infinitiv", kind: "Infinitiv mit zu",
    prompt: "Er ging weg, ohne sich ___.",
    options: ["zu verabschieden", "verabschieden", "verabschiedet", "zu verabschiedet"],
    answer: "zu verabschieden",
    why: "ohne … zu + Infinitiv; das reflexive Pronomen steht davor." },

  // ---- B2
  { level: "B2", rule: "konj1", kind: "Indirekte Rede",
    prompt: "Der Sprecher erklärte, die Zahlen ___ korrekt.",
    options: ["seien", "sind", "wären gewesen", "sei"], answer: "seien",
    why: "Indirekte Rede, Plural von sein im Konjunktiv I: seien." },
  { level: "B2", rule: "ndekl", kind: "n-Deklination",
    prompt: "Wir haben mit dem ___ gesprochen.",
    options: ["Kunden", "Kunde", "Kundes", "Kunden s"], answer: "Kunden",
    why: "der Kunde ist n-Deklination → alle Kasus außer Nominativ mit -n." },
  { level: "B2", rule: "partizipattr", kind: "Partizipialattribut",
    prompt: "»die zu prüfenden Unterlagen« bedeutet:",
    options: ["die Unterlagen, die geprüft werden müssen", "die Unterlagen, die geprüft wurden", "die Unterlagen, die prüfen", "die Unterlagen, die sich prüfen"],
    answer: "die Unterlagen, die geprüft werden müssen",
    why: "zu + Partizip I = passive Notwendigkeit oder Möglichkeit." },
  { level: "B2", rule: "nominal", kind: "Nominalstil",
    prompt: "»Obwohl er krank war, arbeitete er weiter.« — im Nominalstil:",
    options: ["Trotz seiner Krankheit arbeitete er weiter.", "Wegen seiner Krankheit arbeitete er weiter.", "Bei seiner Krankheit arbeitete er weiter.", "Nach seiner Krankheit arbeitete er weiter."],
    answer: "Trotz seiner Krankheit arbeitete er weiter.",
    why: "obwohl (Einräumung) ⇄ trotz + Genitiv." },
  { level: "B2", rule: "paired", kind: "Zweiteiliger Konnektor",
    prompt: "Er hat ___ Zeit noch Interesse.",
    options: ["weder", "sowohl", "entweder", "nicht nur"], answer: "weder",
    why: "weder … noch — die Konstruktion ist bereits verneint." },
  { level: "B2", rule: "modal-subjektiv", kind: "Subjektive Modalverben",
    prompt: "»Er soll sehr reich sein.« bedeutet:",
    options: ["Andere behaupten, dass er reich ist.", "Er behauptet, reich zu sein.", "Er muss reich werden.", "Er ist sicher reich."],
    answer: "Andere behaupten, dass er reich ist.",
    why: "sollen im subjektiven Gebrauch = Hörensagen. wollen wäre die Selbstbehauptung." },
  { level: "B2", rule: "konnektor", kind: "Konnektor",
    prompt: "Die Maßnahme wirkt, ___ sie die Nachfrage senkt.",
    options: ["indem", "während", "obwohl", "nachdem"], answer: "indem",
    why: "indem gibt das Mittel an — Antwort auf »wie?«." },

  // ---- C1
  { level: "C1", rule: "passiversatz", kind: "Passiversatz",
    prompt: "»Die Frist ist einzuhalten.« bedeutet:",
    options: ["Die Frist muss eingehalten werden.", "Die Frist wurde eingehalten.", "Die Frist hält sich ein.", "Man hält die Frist ein, wenn möglich."],
    answer: "Die Frist muss eingehalten werden.",
    why: "sein + zu + Infinitiv trägt hier Passiv + Notwendigkeit." },
  { level: "C1", rule: "fvg", kind: "Funktionsverbgefüge",
    prompt: "»etwas bezweifeln« im gehobenen Register:",
    options: ["etwas in Frage stellen", "etwas in Kauf nehmen", "etwas zur Verfügung stellen", "etwas unter Beweis stellen"],
    answer: "etwas in Frage stellen",
    why: "in Frage stellen = bezweifeln. in Kauf nehmen = hinnehmen." },
  { level: "C1", rule: "konnektor", kind: "Formeller Konnektor",
    prompt: "Der Antrag ist abzulehnen, ___ er erhebliche Kosten verursacht.",
    options: ["zumal", "indem", "sofern", "damit"], answer: "zumal",
    why: "zumal verstärkt einen bereits genannten Grund." },
  { level: "C1", rule: "konj2past", kind: "Konjunktiv II Vergangenheit",
    prompt: "Wenn er sich rechtzeitig beworben ___, hätte er die Stelle bekommen.",
    options: ["hätte", "wäre", "hat", "würde haben"], answer: "hätte",
    why: "sich bewerben bildet das Perfekt mit haben → hätte + Partizip II." },
  { level: "C1", rule: "erweitertes-attribut", kind: "Erweitertes Attribut",
    prompt: "»der von der Kommission im Juni vorgelegte Bericht« =",
    options: ["der Bericht, den die Kommission im Juni vorgelegt hat", "der Bericht, der die Kommission im Juni vorgelegt hat", "der Bericht, den die Kommission im Juni vorlegen wird", "der Bericht, der der Kommission im Juni vorlag"],
    answer: "der Bericht, den die Kommission im Juni vorgelegt hat",
    why: "Partizip II + von-Phrase → Passiv, aufgelöst als Aktivsatz mit der Kommission als Subjekt." },
  { level: "C1", rule: "register", kind: "Register",
    prompt: "Welche Formulierung gehört in einen C1-Aufsatz?",
    options: ["Meines Erachtens überwiegen die Vorteile.", "Ich find das echt gut.", "Das ist halt so.", "Man kann da nix machen."],
    answer: "Meines Erachtens überwiegen die Vorteile.",
    why: "Modalpartikeln (halt), Umgangssprache (nix, echt) gehören nicht in den schriftlichen Aufsatz." },
  { level: "C1", rule: "partikel", kind: "Modalpartikel",
    prompt: "»Das hast du doch gewusst!« — welche Funktion hat »doch«?",
    options: ["Widerspruch / Erinnerung an Bekanntes", "höfliche Bitte", "Vermutung", "Zeitangabe"],
    answer: "Widerspruch / Erinnerung an Bekanntes",
    why: "doch erinnert an etwas, das der Hörer eigentlich schon weiß." },
  { level: "C1", rule: "nominal", kind: "Nominalstil",
    prompt: "»aufgrund der geänderten Rechtslage« als Nebensatz:",
    options: ["weil sich die Rechtslage geändert hat", "obwohl sich die Rechtslage geändert hat", "wenn sich die Rechtslage ändert", "nachdem sich die Rechtslage ändert"],
    answer: "weil sich die Rechtslage geändert hat",
    why: "aufgrund + Genitiv ist kausal → weil." },
];

// ---------------------------------------------------------------------------
//  Item selection
// ---------------------------------------------------------------------------
const RULES_BY_LEVEL = Object.fromEntries(
  LEVELS.map((lvl) => [lvl, RULES.filter((r) => r.level === lvl).map((r) => r.id)])
);

function bankItem(level, usedIds) {
  const pool = EXAM_BANK.filter((q, i) => q.level === level && !usedIds.has("bank" + i));
  if (!pool.length) return null;
  const idx = EXAM_BANK.indexOf(rnd(pool));
  usedIds.add("bank" + idx);
  const q = EXAM_BANK[idx];
  return {
    id: "bank" + idx, source: "bank", level: q.level, rule: q.rule, kind: q.kind,
    type: "choice", longOpts: q.options.some((o) => o.length > 22),
    prompt: q.prompt, hint: "", options: shuffle(q.options), answer: q.answer,
    trace: [["Niveau", q.level, ""], ["Regel", q.kind, q.why], ["Richtig", q.answer, ""]],
  };
}

/** Next exam item at the requested level: half from the bank, half generated. */
export function nextExamItem(level, usedIds) {
  const wantBank = Math.random() < 0.5;
  if (wantBank) {
    const b = bankItem(level, usedIds);
    if (b) return b;
  }
  const pool = RULES_BY_LEVEL[level];
  if (!pool || !pool.length) return bankItem(level, usedIds) || bankItem("B1", usedIds);
  const q = generate(rnd(pool));
  return { ...q, id: "gen" + Math.random().toString(36).slice(2), source: "gen", level };
}

/**
 * Adaptive ladder. Climbs after a run of correct answers at the current level,
 * drops after a run of wrong ones. Keeps the exam inside the useful band.
 */
export function nextLevel(current, recentAtLevel) {
  const idx = LEVELS.indexOf(current);
  const last3 = recentAtLevel.slice(-3);
  if (last3.length >= 3 && last3.every(Boolean) && idx < LEVELS.length - 1) return LEVELS[idx + 1];
  if (last3.length >= 3 && last3.filter(Boolean).length <= 1 && idx > 0) return LEVELS[idx - 1];
  if (recentAtLevel.length >= 2 && recentAtLevel.slice(-2).every((x) => x === false) && idx > 0)
    return LEVELS[idx - 1];
  return current;
}

export const EXAM_LENGTH = 30;

// ---------------------------------------------------------------------------
//  Level estimation
// ---------------------------------------------------------------------------
const SECURE = 0.75;
const PARTIAL = 0.5;
const MIN_ITEMS = 3;

/**
 * Estimate the CEFR level from the answered items.
 * A level counts as reached when accuracy at that level is ≥ 75% over ≥ 3 items
 * AND every level below it is also reached.
 */
export function estimateLevel(answers) {
  const byLevel = {};
  const byRule = {};
  for (const a of answers) {
    const L = (byLevel[a.level] ||= { r: 0, t: 0 });
    L.t++; if (a.correct) L.r++;
    const R = (byRule[a.rule] ||= { r: 0, t: 0, name: a.kind || a.rule });
    R.t++; if (a.correct) R.r++;
  }

  const acc = (lvl) => (byLevel[lvl]?.t >= MIN_ITEMS ? byLevel[lvl].r / byLevel[lvl].t : null);

  // Climb from A2 upward. A level with NO items was skipped by the adaptive
  // ladder — which only happens when the learner was succeeding above it — so
  // it must not stop the climb. Only a demonstrated failure stops it.
  let reached = null;
  for (const lvl of LEVELS) {
    const b = byLevel[lvl];
    if (!b || b.t === 0) continue;              // never tested at this level
    const a = b.r / b.t;
    if (b.t < MIN_ITEMS) {
      if (a < PARTIAL) break;                   // thin but clearly failing
      continue;                                 // thin and inconclusive
    }
    if (a >= SECURE) reached = lvl;
    else break;
  }

  // "+" when the next level is already half-solid
  let plus = false;
  if (reached) {
    const next = LEVELS[LEVELS.indexOf(reached) + 1];
    const a = next ? acc(next) : null;
    if (a !== null && a >= PARTIAL) plus = true;
  } else {
    const a2 = acc("A2");
    if (a2 !== null && a2 >= PARTIAL) plus = true; // approaching A2
  }

  const label = reached ? reached + (plus ? "+" : "") : plus ? "A2 (in Arbeit)" : "unter A2";
  const target = "C1";
  const gapFrom = reached || "A2";
  const gap = Math.max(0, LEVELS.indexOf(target) - LEVELS.indexOf(gapFrom));

  const weakest = Object.entries(byRule)
    .filter(([, v]) => v.t >= 2)
    .map(([id, v]) => ({ id, name: v.name, acc: v.r / v.t, ...v }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 6);

  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;

  return {
    level: label,
    reached,
    plus,
    gapToC1: gap,
    byLevel,
    byRule,
    weakest,
    total,
    correct,
    accuracy: total ? correct / total : 0,
    at: Date.now(),
  };
}

/** Human-readable next-step advice derived from the estimate. */
export function adviceFor(est) {
  const out = [];
  if (!est.reached) {
    out.push("Baue zuerst A2 aus: Kasus, Perfekt, Wechselpräpositionen, Satzklammer.");
  } else if (est.reached === "A2") {
    out.push("Nächster Schritt B1: Relativsätze, Konjunktiv II, Passiv, Verben mit Präposition.");
  } else if (est.reached === "B1") {
    out.push("Nächster Schritt B2: Konjunktiv I, n-Deklination, Partizipialattribute, Nominalisierung.");
  } else if (est.reached === "B2") {
    out.push("Nächster Schritt C1: Passiversatzformen, Funktionsverbgefüge, formelle Konnektoren, Konjunktiv II der Vergangenheit.");
  } else {
    out.push("C1 ist erreicht. Halte es mit Schreiben und gemischten Drills stabil.");
  }
  if (est.weakest.length) {
    const names = est.weakest.filter((w) => w.acc < 0.7).map((w) => w.name);
    if (names.length) out.push("Schwächste Bereiche in diesem Test: " + names.join(", ") + ".");
  }
  return out;
}
