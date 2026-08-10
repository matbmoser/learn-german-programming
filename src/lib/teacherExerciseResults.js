// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

function asStrings(value) {
  return Array.isArray(value) ? value.map(String) : [];
}

function comparable(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("de-DE");
}

function sameAnswer(given, saved) {
  return comparable(given) === comparable(saved);
}

function sameSet(given, saved) {
  const left = asStrings(given).map(comparable).sort();
  const right = asStrings(saved).map(comparable).sort();
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function answerItem(label, studentAnswer, savedAnswer, isCorrect) {
  return {
    label: String(label || "Answer"),
    student_answer: String(studentAnswer || "—"),
    correct_answer: String(savedAnswer || "—"),
    is_correct: isCorrect,
    why: "",
  };
}

/**
 * Builds a deterministic comparison from the answer key that was created with
 * the exercise. It deliberately does not ask the language model to re-grade.
 * Open forms and writing tasks return null because they have no single answer.
 */
export function buildTeacherExerciseResult(exercise, submittedAnswers) {
  const type = String(exercise?.type || "short_answer");
  const answerKey = asStrings(exercise?.answer_key).filter((answer) => answer.trim());
  if (!answerKey.length || type === "form" || type === "writing") return null;

  let items = [];
  if (type === "multiple_choice") {
    const given = String(submittedAnswers || "");
    items = [answerItem(exercise.prompt || exercise.title, given, answerKey[0], sameAnswer(given, answerKey[0]))];
  } else if (type === "multiple_select") {
    const given = asStrings(submittedAnswers);
    items = [answerItem(
      exercise.prompt || exercise.title,
      given.join("; "),
      answerKey.join("; "),
      sameSet(given, answerKey),
    )];
  } else if (type === "fill_blanks") {
    const fields = Array.isArray(exercise.fields) ? exercise.fields : [];
    const given = asStrings(submittedAnswers);
    if (!fields.length || answerKey.length < fields.length || given.length < fields.length) return null;
    items = fields.map((field, index) => answerItem(
      field.label || `Blank ${index + 1}`,
      given[index],
      answerKey[index],
      sameAnswer(given[index], answerKey[index]),
    ));
  } else if (type === "matching") {
    const matches = Array.isArray(exercise.matches) ? exercise.matches : [];
    const given = asStrings(submittedAnswers);
    if (!matches.length || answerKey.length < matches.length || given.length < matches.length) return null;
    items = matches.map((row, index) => answerItem(
      row.prompt || `Match ${index + 1}`,
      given[index],
      answerKey[index],
      sameAnswer(given[index], answerKey[index]),
    ));
  } else if (type === "reorder") {
    const given = asStrings(submittedAnswers);
    items = [answerItem(
      exercise.prompt || exercise.title,
      given.join(" "),
      answerKey.join(" "),
      given.length === answerKey.length && given.every((part, index) => sameAnswer(part, answerKey[index])),
    )];
  } else {
    const given = String(submittedAnswers || "");
    items = [answerItem(
      exercise.prompt || exercise.title,
      given,
      answerKey.join(" / "),
      answerKey.some((saved) => sameAnswer(given, saved)),
    )];
  }

  const correctItems = items.filter((item) => item.is_correct).length;
  return {
    kind: "answer_key",
    id: `answer-key-${exercise.id || Date.now()}`,
    title: `${exercise.title || "Exercise"} — Answers`,
    summary: "This comparison uses the answer key saved when the exercise was created.",
    score_percent: items.length ? Math.round((correctItems / items.length) * 100) : 0,
    total_items: items.length,
    correct_items: correctItems,
    items,
    strengths: correctItems === items.length ? ["Your response matches the saved answer key."] : [],
    next_step: "Ask Frau Müller if you would like help understanding any of these answers.",
  };
}
