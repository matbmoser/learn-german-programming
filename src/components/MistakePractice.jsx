// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

import React from "react";
import { answersMatch } from "../engine/grammar.js";
import { buildMistakeArchive, buildMistakeExercises, mistakeRuleStats } from "../lib/mistakeHistory.js";
import { RULE_TABLE } from "../lib/teacherAgent.js";
import { Bar, LevelTag, Prompt, Stat } from "./ui.jsx";
import { IconArrowRight, IconCancel, IconCheckCircle, IconHistory, IconTeacher } from "./icons.jsx";

const RULE_LABELS = Object.fromEntries(RULE_TABLE.map((rule) => [rule.id, rule.label]));

export default function MistakePractice({ progress, onAttempt, onAskTeacher }) {
  const archive = React.useMemo(() => buildMistakeArchive(progress.writings), [progress.writings]);
  const exercises = React.useMemo(() => buildMistakeExercises(progress.writings), [progress.writings]);
  const attempts = progress.mistakeAttempts || [];
  const stats = React.useMemo(() => mistakeRuleStats(archive, attempts), [archive, attempts]);
  const [rule, setRule] = React.useState("all");
  const [exerciseIndex, setExerciseIndex] = React.useState(0);
  const [given, setGiven] = React.useState("");
  const [answered, setAnswered] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);

  const pool = React.useMemo(
    () => exercises.filter((exercise) => rule === "all" || exercise.rule === rule),
    [exercises, rule]
  );
  const current = pool.length ? pool[exerciseIndex % pool.length] : null;
  const totalErrors = archive.reduce((sum, writing) => sum + writing.errors.length, 0);
  const correctAttempts = attempts.filter((attempt) => attempt.correct).length;
  const demonstrated = stats.filter((row) => row.demonstrated).length;

  function chooseRule(nextRule) {
    setRule(nextRule);
    setExerciseIndex(0);
    setGiven("");
    setAnswered(false);
  }

  function judge(value) {
    if (!current || answered || !String(value).trim()) return;
    const ok = answersMatch(value, current.answer);
    setGiven(value);
    setCorrect(ok);
    setAnswered(true);
    onAttempt?.({
      exerciseId: current.id,
      writingId: current.writingId,
      ruleId: current.rule,
      correct: ok,
      given: String(value),
      answer: current.answer,
    });
  }

  function next() {
    if (!pool.length) return;
    setExerciseIndex((index) => (index + 1) % pool.length);
    setGiven("");
    setAnswered(false);
    setCorrect(false);
  }

  function askForFreshExercise() {
    onAskTeacher?.(
      "Create a new short interactive exercise from my saved correction history. Prioritize recurring errors that I have not yet demonstrated as learned, and use examples related to my earlier wording.",
      { autoSend: true }
    );
  }

  if (!archive.length) {
    return (
      <>
        <div className="page-head">
          <span className="eyebrow">§ Persönlicher Rückblick</span>
          <h1>Fehlertraining</h1>
          <p>Hier bleiben deine früheren Schreibkorrekturen erhalten und werden später zu persönlichen Übungen.</p>
        </div>
        <div className="card"><div className="card-body mistake-empty">
          <IconHistory />
          <h2>Noch keine Korrekturen gespeichert</h2>
          <p className="muted">Reiche im Schreibtrainer einen Text zur Korrektur ein. Danach erscheinen seine Fehler und Übungen dauerhaft hier.</p>
        </div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-head mistake-page-head">
        <div>
          <span className="eyebrow">§ Persönlicher Rückblick</span>
          <h1>Fehlertraining</h1>
          <p>Übe mit deinen eigenen früheren Fehlern und zeige durch drei richtige Antworten in Folge, dass ein Muster sitzt.</p>
        </div>
        <button className="btn" type="button" onClick={askForFreshExercise}>
          <IconTeacher /> Neue persönliche Übung
        </button>
      </div>

      <div className="stats mistake-stats">
        <Stat label="Gespeicherte Texte" value={archive.length} />
        <Stat label="Alte Fehler" value={totalErrors} />
        <Stat label="Übungen beantwortet" value={attempts.length} />
        <Stat label="Nachgewiesen" value={`${demonstrated}/${stats.length}`} />
      </div>

      <div className="mistake-layout">
        <section className="card mistake-patterns">
          <div className="card-head">
            <span className="eyebrow">Deine Fehlermuster</span>
            <span className="dim mono">3× richtig = gelernt</span>
          </div>
          <div className="card-body mistake-rule-list">
            <button type="button" className={rule === "all" ? "is-on" : ""} onClick={() => chooseRule("all")}>
              <span>Alle persönlichen Übungen</span><b>{exercises.length}</b>
            </button>
            {stats.map((row) => {
              const accuracy = row.attempts ? row.correct / row.attempts : 0;
              return (
                <button key={row.rule} type="button" className={rule === row.rule ? "is-on" : ""} onClick={() => chooseRule(row.rule)}>
                  <span>
                    <strong>{RULE_LABELS[row.rule] || row.rule}</strong>
                    <small>{row.errors}× in deinen Texten · {row.attempts ? `${Math.round(accuracy * 100)}% beim Üben` : "noch nicht geübt"}</small>
                    <Bar value={accuracy} color={row.demonstrated ? "var(--ok)" : row.attempts ? "var(--warn)" : "var(--ink-3)"} />
                  </span>
                  <b className={row.demonstrated ? "is-learned" : ""}>{row.demonstrated ? <IconCheckCircle /> : row.errors}</b>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card mistake-practice">
          <div className="card-head">
            <span className="eyebrow">Aus deinen Korrekturen</span>
            {current && <span className="dim mono">{exerciseIndex % pool.length + 1}/{pool.length}</span>}
          </div>
          <div className="card-body">
            {!current ? <p className="muted">Für dieses Muster ist noch keine Übung gespeichert.</p> : (
              <>
                <div className="mistake-source">
                  <LevelTag level={current.level} />
                  <span>{current.kind}</span>
                  <small>aus „{current.writingTitle}“</small>
                </div>
                <div className="q-prompt"><Prompt text={current.prompt} /></div>

                {current.options.length ? (
                  <div className="opts">
                    {current.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={"opt long" + (answered && option === current.answer ? " is-ok" : "") + (answered && option === given && !correct ? " is-no" : "")}
                        disabled={answered}
                        onClick={() => judge(option)}
                      >{option}</button>
                    ))}
                  </div>
                ) : (
                  <form className="type-row" onSubmit={(event) => { event.preventDefault(); judge(given); }}>
                    <input className="type-in" value={given} onChange={(event) => setGiven(event.target.value)} disabled={answered} placeholder="Korrektur eingeben …" autoComplete="off" />
                    <button className="btn" type="submit" disabled={answered || !given.trim()}>Prüfen</button>
                  </form>
                )}

                {answered && (
                  <div className={"verdict " + (correct ? "v-ok" : "v-no")}>
                    <div className="verdict-line">
                      {correct ? <><span className="mark"><IconCheckCircle /> gelernt</span><span>{current.answer}</span></> : <><span className="mark"><IconCancel /></span><span>Richtig: <b>{current.answer}</b></span></>}
                    </div>
                    <p>{current.why}</p>
                  </div>
                )}

                <div className="actions">
                  <button className="btn" type="button" onClick={next}>Nächste Übung <IconArrowRight /></button>
                  <span className="dim mono">{correctAttempts}/{attempts.length || 0} bisher richtig</span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <section className="card mistake-archive">
        <div className="card-head">
          <span className="eyebrow">Gespeicherte Korrekturen</span>
          <span className="dim">Dein Originaltext und jede frühere Korrektur bleiben erhalten.</span>
        </div>
        <div className="card-body">
          {archive.map((writing) => (
            <details key={writing.writingId}>
              <summary>
                <span><LevelTag level={writing.level} /> <strong>{writing.title}</strong></span>
                <span className="dim mono">{new Date(writing.at).toLocaleDateString("de-DE")} · {writing.errors.length} Fehler · {writing.cefrEstimate || "—"}</span>
              </summary>
              <div className="mistake-original"><span className="eyebrow">Gespeicherter Originaltext</span><p>{writing.text}</p></div>
              <div className="mistake-corrections">
                {writing.errors.map((error) => (
                  <article key={error.id}>
                    <header><span>{error.type}</span><small>{RULE_LABELS[error.rule] || error.rule}</small></header>
                    <div><del>{error.original}</del><IconArrowRight /><ins>{error.corrected}</ins></div>
                    <p>{error.why}</p>
                  </article>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
