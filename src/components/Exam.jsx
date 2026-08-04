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

import React from "react";
import { nextExamItem, nextLevel, estimateLevel, adviceFor, EXAM_LENGTH } from "../engine/exam.js";
import { answersMatch } from "../engine/grammar.js";
import { LEVELS } from "../data/curriculum.js";
import { Prompt, Trace, LevelTag, Bar, accColor, Stat, Callout } from "./ui.jsx";
import { IconCancel, IconCheckCircle } from "./icons.jsx";

const START_LEVEL = "B1";

export default function Exam({ progress, onAnswer, onFinish }) {
  const [phase, setPhase] = React.useState("intro"); // intro | running | done
  const [level, setLevel] = React.useState(START_LEVEL);
  const [item, setItem] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [answered, setAnswered] = React.useState(false);
  const [given, setGiven] = React.useState("");
  const [correct, setCorrect] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [result, setResult] = React.useState(null);
  const usedRef = React.useRef(new Set());
  const inputRef = React.useRef(null);

  const lastExam = progress.exams?.[progress.exams.length - 1] || null;

  function start() {
    usedRef.current = new Set();
    setAnswers([]);
    setLevel(START_LEVEL);
    setResult(null);
    setPhase("running");
    setAnswered(false);
    setTyped("");
    setItem(nextExamItem(START_LEVEL, usedRef.current));
  }

  function judge(value) {
    if (answered || !item) return;
    const ok = item.type === "choice"
      ? value === item.answer
      : answersMatch(value, item.accept || [item.answer]);
    setAnswered(true);
    setGiven(value);
    setCorrect(ok);
    onAnswer(item.rule, ok);
    setAnswers((prev) => [...prev, {
      level: item.level, rule: item.rule, kind: item.kind, correct: ok,
      prompt: item.prompt, answer: item.answer, given: value,
    }]);
  }

  function advance() {
    const all = answers;
    if (all.length >= EXAM_LENGTH) {
      const est = estimateLevel(all);
      setResult(est);
      setPhase("done");
      onFinish(est);
      return;
    }
    const atLevel = all.filter((a) => a.level === level).map((a) => a.correct);
    const nl = nextLevel(level, atLevel);
    setLevel(nl);
    setAnswered(false);
    setGiven("");
    setTyped("");
    setItem(nextExamItem(nl, usedRef.current));
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" || phase !== "running") return;
      const el = document.activeElement;
      if (el && el.tagName === "TEXTAREA") return;
      if (answered) { e.preventDefault(); advance(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // ------------------------------------------------------------- intro ----
  if (phase === "intro") {
    return (
      <>
        <div className="page-head">
          <span className="eyebrow">§ Einstufung</span>
          <h1>Wo stehst du gerade?</h1>
          <p>
            {EXAM_LENGTH} Aufgaben, adaptiv: nach drei richtigen Antworten steigt das Niveau, nach zwei
            falschen sinkt es. Am Ende bekommst du eine GER-Einschätzung, die Lücke bis C1 und die
            Themen, die dich am meisten kosten.
          </p>
        </div>

        {lastExam && (
          <div className="card" style={{ marginBottom: "var(--s4)" }}>
            <div className="card-head">
              <span className="eyebrow">Letzte Einstufung</span>
              <span className="dim mono" style={{ fontSize: ".78rem" }}>
                {new Date(lastExam.at).toLocaleDateString("de-DE")}
              </span>
            </div>
            <div className="card-body">
              <div className="stats">
                <Stat label="Niveau" value={lastExam.level} />
                <Stat label="Richtig" value={Math.round(lastExam.accuracy * 100) + "%"} />
                <Stat label="Stufen bis C1" value={lastExam.gapToC1} />
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <p className="muted">
              Antworte ehrlich und ohne nachzuschlagen — eine geschönte Einstufung schickt dich in die
              falschen Übungen. Der Test dauert etwa 10 Minuten.
            </p>
            <div className="actions">
              <button className="btn" type="button" onClick={start}>Einstufungstest starten</button>
            </div>
          </div>
        </div>

        {progress.exams?.length > 1 && (
          <div className="card" style={{ marginTop: "var(--s4)" }}>
            <div className="card-head"><span className="eyebrow">Verlauf</span></div>
            <div className="card-body">
              <div className="m-list">
                {progress.exams.slice().reverse().map((e, i) => (
                  <div className="m-row" key={i}>
                    <span className="name">{new Date(e.at).toLocaleDateString("de-DE")} — {e.level}</span>
                    <span className="val">{Math.round(e.accuracy * 100)}% · {e.correct}/{e.total}</span>
                    <Bar value={e.accuracy} color={accColor(e.accuracy, true)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // -------------------------------------------------------------- done ----
  if (phase === "done" && result) {
    const advice = adviceFor(result);
    return (
      <>
        <div className="page-head">
          <span className="eyebrow">§ Ergebnis</span>
          <h1>Einschätzung: {result.level}</h1>
          <p>
            {result.correct} von {result.total} richtig. {result.gapToC1 === 0
              ? "C1 ist nach diesem Test erreicht."
              : `Bis C1 fehlen ${result.gapToC1} Stufe${result.gapToC1 > 1 ? "n" : ""}.`}
          </p>
        </div>

        <div className="grid g2">
          <div className="card">
            <div className="card-head"><span className="eyebrow">Nach Niveau</span></div>
            <div className="card-body">
              <div className="m-list" style={{ gridTemplateColumns: "1fr" }}>
                {LEVELS.map((l) => {
                  const b = result.byLevel[l];
                  if (!b) return null;
                  const acc = b.r / b.t;
                  return (
                    <div className="m-row" key={l}>
                      <span className="name"><LevelTag level={l} /> {b.r}/{b.t} richtig</span>
                      <span className="val">{Math.round(acc * 100)}%</span>
                      <Bar value={acc} color={accColor(acc, b.t >= 3)} />
                    </div>
                  );
                })}
              </div>
              <p className="q-hint" style={{ marginTop: "var(--s3)" }}>
                Ein Niveau gilt als erreicht ab 75 % richtig über mindestens 3 Aufgaben — und nur, wenn alle
                Niveaus darunter ebenfalls erreicht sind.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><span className="eyebrow">Nächste Schritte</span></div>
            <div className="card-body">
              <ul className="pit">
                {advice.map((a, i) => <li key={i} style={{ borderLeftColor: "var(--nom)" }}>{a}</li>)}
              </ul>
              {result.weakest.length > 0 && (
                <>
                  <span className="eyebrow" style={{ display: "block", marginTop: "var(--s4)" }}>Schwächste Themen</span>
                  <div className="m-list" style={{ gridTemplateColumns: "1fr", marginTop: "var(--s2)" }}>
                    {result.weakest.map((w) => (
                      <div className="m-row" key={w.id}>
                        <span className="name">{w.name}</span>
                        <span className="val">{Math.round(w.acc * 100)}% · {w.r}/{w.t}</span>
                        <Bar value={w.acc} color={accColor(w.acc, true)} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--s4)" }}>
          <div className="card-head"><span className="eyebrow">Alle Antworten</span></div>
          <div className="card-body">
            <div className="corr">
              {answers.map((a, i) => (
                <div className={"corr-item " + (a.correct ? "niedrig" : "hoch")} key={i}>
                  <div className="corr-head">
                    <LevelTag level={a.level} />
                    <span className="corr-type">{a.kind}</span>
                    <span className={a.correct ? "fixed" : "strike"} style={{ fontFamily: "var(--f-mono)", fontSize: ".78rem" }}>
                      {a.correct ? "richtig" : "falsch"}
                    </span>
                  </div>
                  <div className="corr-body">
                    <span><Prompt text={a.prompt} /></span>
                    {!a.correct && (
                      <span>
                        <span className="strike">{a.given || "—"}</span>{" → "}<span className="fixed">{a.answer}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="btn" type="button" onClick={start}>Noch einmal</button>
          <button className="btn btn-ghost" type="button" onClick={() => setPhase("intro")}>Zurück</button>
        </div>
      </>
    );
  }

  // ----------------------------------------------------------- running ----
  const n = answers.length;
  const pct = n / EXAM_LENGTH;
  return (
    <>
      <div className="page-head">
        <span className="eyebrow">§ Einstufung läuft</span>
        <h1>Frage {Math.min(n + 1, EXAM_LENGTH)} von {EXAM_LENGTH}</h1>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="stats">
            <Stat label="Aktuelles Niveau" value={level} />
            <Stat label="Richtig" value={`${answers.filter((a) => a.correct).length}/${n}`} />
          </div>
          <div style={{ flex: "1 1 160px", minWidth: 140 }}>
            <Bar value={pct} color="var(--nom)" />
          </div>
        </div>

        <div className="card-body">
          <span className="q-kind">{item?.kind}</span>
          <div className="q-prompt">
            <LevelTag level={item?.level} /> <Prompt text={item?.prompt} />
          </div>
          {item?.hint && <p className="q-hint">{item.hint}</p>}

          {item?.type === "choice" ? (
            <div className="opts">
              {item.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={
                    "opt" + (item.longOpts ? " long" : "") +
                    (answered && o === item.answer ? " is-ok" : "") +
                    (answered && o === given && !correct ? " is-no" : "")
                  }
                  disabled={answered}
                  onClick={() => judge(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          ) : (
            <form
              className="type-row"
              autoComplete="off"
              onSubmit={(e) => { e.preventDefault(); answered ? advance() : judge(typed); }}
            >
              <input
                ref={inputRef}
                className="type-in"
                type="text"
                value={typed}
                spellCheck="false"
                placeholder="Antwort tippen …"
                aria-label="Antwort"
                disabled={answered}
                onChange={(e) => setTyped(e.target.value)}
              />
              <button className="btn" type="submit" disabled={answered}>Prüfen</button>
            </form>
          )}

          {answered && (
            <div className={"verdict " + (correct ? "v-ok" : "v-no")}>
              <div className="verdict-line">
                {correct
                  ? <><span className="mark"><IconCheckCircle /> richtig</span><span>{item.answer}</span></>
                  : <><span className="mark"><IconCancel /></span><span>Du: <b>{given || "—"}</b> · Richtig: <b>{item.answer}</b></span></>}
              </div>
              <Trace rows={item.trace} />
            </div>
          )}

          <div className="actions">
            <button className="btn" type="button" onClick={advance} disabled={!answered}>
              {n + 1 >= EXAM_LENGTH ? "Auswerten" : "Weiter"}
            </button>
            {!answered && (
              <button className="btn btn-ghost" type="button" onClick={() => judge("")}>Überspringen</button>
            )}
            <span className="kbd">Enter</span>
            <button className="btn btn-ghost btn-sm" type="button" style={{ marginLeft: "auto" }} onClick={() => setPhase("intro")}>
              Abbrechen
            </button>
          </div>
        </div>
      </div>

      <Callout kind="info">
        Das Niveau passt sich live an. Ein Absturz nach oben ist normal — der Test sucht deine Grenze,
        nicht deine Komfortzone.
      </Callout>
    </>
  );
}
