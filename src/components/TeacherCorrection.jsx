// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

import React from "react";

export default function TeacherCorrection({ correction }) {
  const score = Math.min(100, Math.max(0, Number(correction.score_percent) || 0));
  const items = Array.isArray(correction.items) ? correction.items : [];
  const fromAnswerKey = correction.kind === "answer_key";

  return (
    <section className="tc-correction" aria-label={correction.title || "Correction results"}>
      <header className="tc-correction-head">
        <div>
          <span className="tc-correction-kicker">{fromAnswerKey ? "Saved answer key" : "Correction results"}</span>
          <h3>{correction.title || "Your results"}</h3>
        </div>
        <div className="tc-score-ring" style={{ "--tc-score": `${score * 3.6}deg` }} aria-label={`${score} percent`}>
          <span>{score}%</span>
        </div>
      </header>

      <div className="tc-correction-stats" aria-label="Correction statistics">
        <div><strong>{correction.correct_items}</strong><span>{fromAnswerKey ? "Matches" : "Correct"}</span></div>
        <div><strong>{Math.max(0, correction.total_items - correction.correct_items)}</strong><span>{fromAnswerKey ? "To compare" : "To review"}</span></div>
        <div><strong>{correction.total_items}</strong><span>Total</span></div>
      </div>

      {correction.summary && <p className="tc-correction-summary">{correction.summary}</p>}

      <div className="tc-correction-items">
        {items.map((item, index) => (
          <article key={`${item.label}-${index}`} className={"tc-correction-item " + (item.is_correct ? "is-correct" : "is-wrong")}>
            <div className="tc-correction-item-head">
              <span className="tc-correction-number">{index + 1}</span>
              <strong>{item.label}</strong>
              <span className="tc-correction-status">{fromAnswerKey ? (item.is_correct ? "Matches" : "Compare") : (item.is_correct ? "Correct" : "Needs work")}</span>
            </div>
            <div className="tc-answer-compare">
              <div className="tc-answer-given">
                <span>Your answer</span>
                <p>{item.student_answer || "—"}</p>
              </div>
              <div className="tc-answer-right">
                <span>{fromAnswerKey ? "Saved answer" : item.is_correct ? "Confirmed answer" : "Correct answer"}</span>
                <p>{item.correct_answer || "—"}</p>
              </div>
            </div>
            {item.why && (
              <div className="tc-correction-why">
                <span>Why</span>
                <p>{item.why}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {(correction.strengths?.length > 0 || correction.next_step) && (
        <footer className="tc-correction-foot">
          {correction.strengths?.length > 0 && (
            <div><span>What went well</span><ul>{correction.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul></div>
          )}
          {correction.next_step && <div><span>Next step</span><p>{correction.next_step}</p></div>}
        </footer>
      )}
    </section>
  );
}
