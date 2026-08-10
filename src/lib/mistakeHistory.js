// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

/** Convert immutable writing snapshots into one browsable correction archive. */
export function buildMistakeArchive(writings = []) {
  return writings
    .filter((writing) => writing?.feedback)
    .map((writing) => ({
      writingId: writing.id,
      title: writing.title || "Untitled text",
      level: writing.level,
      at: writing.at,
      text: writing.text || "",
      cefrEstimate: writing.feedback.cefr_estimate,
      errors: (writing.feedback.corrections || []).map((correction, index) => ({
        ...correction,
        id: `${writing.id}:correction:${index}`,
        writingId: writing.id,
        writingTitle: writing.title || "Untitled text",
        writingAt: writing.at,
        rule: correction.rule || "wortschatz",
      })),
    }))
    .reverse();
}

/**
 * Build a reusable practice bank from each correction snapshot. AI-generated
 * items remain multiple-choice; every saved correction also becomes a recall
 * task where the learner must produce the corrected wording themselves.
 */
export function buildMistakeExercises(writings = []) {
  const out = [];
  writings.forEach((writing) => {
    const feedback = writing?.feedback;
    if (!feedback) return;
    (feedback.exercises || []).forEach((exercise, index) => {
      if (!exercise?.prompt || !exercise?.answer) return;
      const options = Array.isArray(exercise.options) && exercise.options.includes(exercise.answer)
        ? exercise.options
        : [];
      out.push({
        id: `${writing.id}:exercise:${index}`,
        writingId: writing.id,
        writingTitle: writing.title || "Untitled text",
        writingAt: writing.at,
        level: exercise.level || writing.level,
        rule: exercise.rule || "wortschatz",
        kind: exercise.kind || "Personalized practice",
        prompt: exercise.prompt,
        options,
        answer: String(exercise.answer),
        why: exercise.why || "This uses the corrected pattern from your earlier text.",
        source: "generated",
      });
    });
    (feedback.corrections || []).forEach((correction, index) => {
      if (!correction?.original || !correction?.corrected) return;
      out.push({
        id: `${writing.id}:recall:${index}`,
        writingId: writing.id,
        writingTitle: writing.title || "Untitled text",
        writingAt: writing.at,
        level: writing.level,
        rule: correction.rule || "wortschatz",
        kind: correction.type || "Correct your earlier error",
        prompt: `Korrigiere deinen früheren Fehler: „${correction.original}“`,
        options: [],
        answer: String(correction.corrected),
        why: correction.why || "This is the corrected wording from your earlier text.",
        source: "recall",
      });
    });
  });
  return out.reverse();
}

export function mistakeRuleStats(archive = [], attempts = []) {
  const map = new Map();
  archive.flatMap((writing) => writing.errors).forEach((error) => {
    const row = map.get(error.rule) || { rule: error.rule, errors: 0, examples: [], attempts: 0, correct: 0, demonstrated: false };
    row.errors += 1;
    if (row.examples.length < 3) row.examples.push({ original: error.original, corrected: error.corrected });
    map.set(error.rule, row);
  });
  attempts.forEach((attempt) => {
    const row = map.get(attempt.ruleId);
    if (!row) return;
    row.attempts += 1;
    if (attempt.correct) row.correct += 1;
  });
  for (const row of map.values()) {
    const recent = attempts.filter((attempt) => attempt.ruleId === row.rule).slice(-3);
    row.demonstrated = recent.length === 3 && recent.every((attempt) => attempt.correct);
  }
  return [...map.values()].sort((a, b) => Number(a.demonstrated) - Number(b.demonstrated) || b.errors - a.errors);
}
