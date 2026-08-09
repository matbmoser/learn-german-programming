// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import { MODULES, LEVEL_INFO } from "../data/curriculum.js";
import { generate } from "../engine/drills.js";
import { answersMatch } from "../engine/grammar.js";
import {
  CHECKPOINT_CORRECT,
  CHECKPOINT_WINDOW,
  checkpointPassed,
  checkpointRules,
  learningPathStats,
} from "../lib/learningPath.js";
import { ModuleContent } from "./Learn.jsx";
import { Bar, Callout, LevelTag, Prompt, Trace } from "./ui.jsx";
import { IconCancel, IconCheckCircle } from "./icons.jsx";

export default function LearningPath({ progress, onRead, onCheckpointAnswer, onAdvance, onOpenSettings }) {
  const path = progress.learningPath;
  const stats = learningPathStats(path);
  const mod = stats.current;
  const checkpoint = path.checkpoints?.[mod.id] || { recent: [] };
  const passed = Boolean(path.completed?.[mod.id]) || checkpointPassed(checkpoint);

  React.useEffect(() => { onRead(mod.id); }, [mod.id, onRead]);

  return (
    <div className="path-view">
      <div className="path-hero">
        <div>
          <span className="eyebrow">Lernmodus · Kapitel {stats.currentIndex + 1} von {stats.total}</span>
          <h1><LevelTag level={mod.level} /> {mod.title}</h1>
          <p>{LEVEL_INFO[mod.level].blurb}</p>
        </div>
        <div className="path-level-progress" aria-label={`${stats.levelPercent}% von ${mod.level} abgeschlossen`}>
          <span className="mono">{stats.levelCompleted}/{stats.levelTotal} Kapitel</span>
          <Bar value={stats.levelPercent / 100} color={`var(--${mod.level.toLowerCase()})`} />
        </div>
      </div>

      <div className="path-focus-note">
        <span className="path-step is-done">1</span>
        <span className="path-step">2</span>
        <div>
          <b>Erst verstehen, dann beweisen.</b>
          <span>Lies dieses eine Kapitel und bestehe danach den kurzen Checkpoint.</span>
        </div>
      </div>

      <article className="detail path-lesson" id={`doc-${mod.id}`}>
        <ModuleContent module={mod} anchorView="path" showDrills={false} />
      </article>

      <PathCheckpoint
        key={mod.id}
        module={mod}
        checkpoint={checkpoint}
        passed={passed}
        isLast={stats.isLast}
        onAnswer={(ruleId, correct) => onCheckpointAnswer(mod.id, ruleId, correct)}
        onAdvance={onAdvance}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}

function PathCheckpoint({ module, checkpoint, passed, isLast, onAnswer, onAdvance, onOpenSettings }) {
  const rules = checkpointRules(module);
  const [q, setQ] = React.useState(() => generate(rules[0]));
  const [answered, setAnswered] = React.useState(false);
  const [given, setGiven] = React.useState("");
  const [correct, setCorrect] = React.useState(false);
  const [typed, setTyped] = React.useState("");

  function next() {
    const ruleId = rules[Math.floor(Math.random() * rules.length)] || rules[0];
    setQ(generate(ruleId));
    setAnswered(false);
    setGiven("");
    setCorrect(false);
    setTyped("");
  }

  function judge(value) {
    if (answered || passed) return;
    const ok = q.type === "choice" ? value === q.answer : answersMatch(value, q.accept || [q.answer]);
    setAnswered(true);
    setGiven(value);
    setCorrect(ok);
    onAnswer(q.rule, ok);
  }

  const recent = checkpoint.recent || [];
  const recentCorrect = recent.filter(Boolean).length;

  return (
    <section className="card path-checkpoint" aria-labelledby="checkpoint-title">
      <div className="card-head">
        <div>
          <span className="eyebrow">Schritt 2 · Checkpoint</span>
          <h2 id="checkpoint-title">Zeig, dass die Regel sitzt</h2>
        </div>
        {!passed && (
          <span className="mono dim">{recentCorrect}/{CHECKPOINT_CORRECT} richtig · Fenster {recent.length}/{CHECKPOINT_WINDOW}</span>
        )}
      </div>
      <div className="card-body">
        {passed ? (
          <Callout kind="info">
            <p><b>Kapitel abgeschlossen.</b> Dein Fortschritt wurde in diesem Browser gespeichert.</p>
            <div className="actions">
              {!isLast ? (
                <button className="btn" type="button" onClick={onAdvance}>Nächstes Kapitel</button>
              ) : (
                <span><LevelTag level="C1" /> Du hast den gesamten Lernpfad erreicht.</span>
              )}
              <button className="btn btn-ghost" type="button" onClick={onOpenSettings}>Niveau wechseln</button>
            </div>
          </Callout>
        ) : (
          <>
            <p className="muted path-checkpoint-intro">
              Bestehe {CHECKPOINT_CORRECT} von {CHECKPOINT_WINDOW} aufeinanderfolgenden Aufgaben. Fehler sind Teil des Lernens:
              Das Fenster bewegt sich weiter, bis du bereit bist.
            </p>
            <span className="q-kind">{q.kind}</span>
            <div className="q-prompt"><LevelTag level={module.level} /> <Prompt text={q.prompt} /></div>
            {q.hint && <p className="q-hint">{q.hint}</p>}

            {q.type === "choice" ? (
              <div className="opts">
                {q.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={(answered && option === q.answer ? "opt is-ok" : "opt") + (answered && option === given && !correct ? " is-no" : "")}
                    disabled={answered}
                    onClick={() => judge(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <form className="type-row" autoComplete="off" onSubmit={(event) => { event.preventDefault(); judge(typed); }}>
                <input className="type-in" value={typed} disabled={answered} spellCheck="false" onChange={(event) => setTyped(event.target.value)} placeholder="Antwort tippen …" aria-label="Antwort" />
                <button className="btn" type="submit" disabled={answered || !typed.trim()}>Prüfen</button>
              </form>
            )}

            {answered && (
              <div className={"verdict " + (correct ? "v-ok" : "v-no")}>
                <div className="verdict-line">
                  {correct ? <><span className="mark"><IconCheckCircle /> richtig</span><span>{q.answer}</span></> : <><span className="mark"><IconCancel /></span><span>Du: <b>{given || "—"}</b> · Richtig: <b>{q.answer}</b></span></>}
                </div>
                <Trace rows={q.trace} />
              </div>
            )}
            <div className="actions">
              {answered ? (
                <button className="btn" type="button" onClick={next}>Nächste Aufgabe</button>
              ) : (
                <button className="btn btn-ghost" type="button" onClick={() => judge("")}>Aufgeben</button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

