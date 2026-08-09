// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

import React from "react";

const TYPE_LABELS = {
  multiple_choice: "Choose one",
  multiple_select: "Choose all",
  fill_blanks: "Fill the blanks",
  matching: "Match",
  reorder: "Build the sentence",
  short_answer: "Your answer",
  form: "Answer form",
  writing: "Writing task",
};

function words(text) {
  return String(text).trim() ? String(text).trim().split(/\s+/).length : 0;
}

function asStrings(value) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

export default function TeacherExercise({ exercise, onSubmit, disabled = false, wasSubmitted = false }) {
  const type = TYPE_LABELS[exercise.type] ? exercise.type : "short_answer";
  const options = asStrings(exercise.options);
  const fields = Array.isArray(exercise.fields) ? exercise.fields : [];
  const matches = Array.isArray(exercise.matches) ? exercise.matches : [];
  const items = asStrings(exercise.items).map((label, index) => ({ id: `${index}-${label}`, label }));

  const [choice, setChoice] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [fieldValues, setFieldValues] = React.useState({});
  const [matchValues, setMatchValues] = React.useState({});
  const [order, setOrder] = React.useState([]);
  const [answer, setAnswer] = React.useState("");
  const [locallySubmitted, setLocallySubmitted] = React.useState(false);

  const minWords = Math.max(10, Number(exercise.minimum_words) || 80);
  const wordCount = words(answer);
  const submitted = wasSubmitted || locallySubmitted;
  const inactive = disabled || submitted;

  let complete = false;
  if (type === "multiple_choice") complete = Boolean(choice);
  if (type === "multiple_select") complete = selected.length > 0;
  if (type === "fill_blanks") complete = fields.length > 0 && fields.every((field) => String(fieldValues[field.id] || "").trim());
  if (type === "form") complete = fields.length > 0 && fields.every((field) => String(fieldValues[field.id] || "").trim());
  if (type === "matching") complete = matches.length > 0 && matches.every((_, index) => matchValues[index]);
  if (type === "reorder") complete = items.length > 0 && order.length === items.length;
  if (type === "short_answer") complete = Boolean(answer.trim());
  if (type === "writing") complete = wordCount >= minWords;

  function toggleOption(option) {
    setSelected((current) => current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option]);
  }

  function addOrderItem(item) {
    if (!order.some((entry) => entry.id === item.id)) setOrder((current) => [...current, item]);
  }

  function removeOrderItem(item) {
    setOrder((current) => current.filter((entry) => entry.id !== item.id));
  }

  function submissionText() {
    const heading = `I completed the exercise “${exercise.title}”.`;
    if (type === "multiple_choice") return `${heading}\n\nMy answer: ${choice}`;
    if (type === "multiple_select") return `${heading}\n\nMy selected answers: ${selected.join("; ")}`;
    if (type === "fill_blanks" || type === "form") {
      const values = fields.map((field) => `${field.label}: ${fieldValues[field.id]}`).join("\n");
      return `${heading}\n\nMy answers:\n${values}`;
    }
    if (type === "matching") {
      const values = matches.map((row, index) => `${row.prompt} → ${matchValues[index]}`).join("\n");
      return `${heading}\n\nMy matches:\n${values}`;
    }
    if (type === "reorder") return `${heading}\n\nMy sentence: ${order.map((item) => item.label).join(" ")}`;
    if (type === "writing") return `${heading}\nTopic: ${exercise.topic || exercise.prompt || exercise.title}\n\nMy text:\n${answer.trim()}`;
    return `${heading}\n\nMy answer: ${answer.trim()}`;
  }

  function submit() {
    if (!complete || inactive) return;
    setLocallySubmitted(true);
    onSubmit(submissionText());
  }

  return (
    <section className={"tc-exercise" + (submitted ? " is-submitted" : "")} aria-label={exercise.title}>
      <header className="tc-exercise-head">
        <div>
          <span className="tc-exercise-kicker">Interactive exercise</span>
          <h3>{exercise.title || "Quick practice"}</h3>
        </div>
        <span className="tc-exercise-type">{TYPE_LABELS[type]}</span>
      </header>

      <div className="tc-exercise-body">
        {exercise.instructions && <p className="tc-exercise-instructions">{exercise.instructions}</p>}
        {exercise.prompt && <p className="tc-exercise-prompt">{exercise.prompt}</p>}

        {type === "multiple_choice" && (
          <div className="tc-exercise-options" role="radiogroup" aria-label="Choose one answer">
            {options.map((option) => (
              <button key={option} type="button" role="radio" aria-checked={choice === option}
                className="tc-exercise-option" disabled={inactive} onClick={() => setChoice(option)}>
                <span className="tc-option-mark" />{option}
              </button>
            ))}
          </div>
        )}

        {type === "multiple_select" && (
          <div className="tc-exercise-options" aria-label="Choose all correct answers">
            {options.map((option) => (
              <button key={option} type="button" aria-pressed={selected.includes(option)}
                className="tc-exercise-option is-checkbox" disabled={inactive} onClick={() => toggleOption(option)}>
                <span className="tc-option-mark" />{option}
              </button>
            ))}
          </div>
        )}

        {(type === "fill_blanks" || type === "form") && (
          <div className="tc-exercise-fields">
            {fields.map((field, index) => (
              <label key={field.id || index}>
                <span>{field.label || `Blank ${index + 1}`}</span>
                <input value={fieldValues[field.id] || ""} disabled={inactive}
                  placeholder={field.placeholder || "Type your answer"}
                  onChange={(event) => setFieldValues((current) => ({ ...current, [field.id]: event.target.value }))} />
              </label>
            ))}
          </div>
        )}

        {type === "matching" && (
          <div className="tc-exercise-matches">
            {matches.map((row, index) => (
              <label key={`${row.prompt}-${index}`}>
                <span>{row.prompt}</span>
                <select value={matchValues[index] || ""} disabled={inactive}
                  onChange={(event) => setMatchValues((current) => ({ ...current, [index]: event.target.value }))}>
                  <option value="">Choose…</option>
                  {asStrings(row.options).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}
          </div>
        )}

        {type === "reorder" && (
          <div className="tc-exercise-reorder">
            <div className="tc-order-answer" aria-label="Your sentence">
              {order.length === 0 && <span className="tc-order-placeholder">Tap the parts in the correct order</span>}
              {order.map((item) => <button key={item.id} type="button" disabled={inactive} onClick={() => removeOrderItem(item)}>{item.label}</button>)}
            </div>
            <div className="tc-order-bank">
              {items.filter((item) => !order.some((entry) => entry.id === item.id)).map((item) => (
                <button key={item.id} type="button" disabled={inactive} onClick={() => addOrderItem(item)}>{item.label}</button>
              ))}
            </div>
          </div>
        )}

        {type === "short_answer" && (
          <textarea className="tc-exercise-textarea" value={answer} disabled={inactive} rows={3}
            placeholder="Write your answer here…" onChange={(event) => setAnswer(event.target.value)} />
        )}

        {type === "writing" && (
          <div className="tc-writing-exercise">
            <div className="tc-writing-topic">
              <span>Topic</span>
              <strong>{exercise.topic || exercise.prompt || exercise.title}</strong>
            </div>
            {asStrings(exercise.requirements).length > 0 && (
              <ul>{asStrings(exercise.requirements).map((item) => <li key={item}>{item}</li>)}</ul>
            )}
            <textarea className="tc-exercise-textarea" value={answer} disabled={inactive} rows={8}
              placeholder="Write your German text here…" onChange={(event) => setAnswer(event.target.value)} />
            <div className={"tc-writing-count" + (wordCount >= minWords ? " is-ready" : "")}>{wordCount} / {minWords} words</div>
          </div>
        )}
      </div>

      <footer className="tc-exercise-foot">
        <span>{submitted ? "Sent to Frau Müller for feedback" : complete ? "Ready to send" : "Complete the exercise to send it"}</span>
        <button type="button" className="tc-exercise-submit" disabled={!complete || inactive} onClick={submit}>
          {submitted ? "Submitted" : "Send answer"}
        </button>
      </footer>
    </section>
  );
}
