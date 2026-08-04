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
import { RULES, RULE_IDS, generate, pickRule } from "../engine/drills.js";
import { answersMatch } from "../engine/grammar.js";
import { LEVELS } from "../data/curriculum.js";
import { weakRules } from "../lib/storage.js";
import { explainMistake, generateChallenges, manualChallengePrompt, extractJson } from "../lib/claude.js";
import { Prompt, Trace, LevelTag, MasteryRow, Stat, Callout, Spinner, CopyButton } from "./ui.jsx";
import { IconCancel, IconCheckCircle } from "./icons.jsx";

const LEVEL_ORDER = { A2: 0, B1: 1, B2: 2, C1: 3 };

export default function Drill({ progress, onAnswer, apiKey, model, mode, initialTopic }) {
  // Remounted via `key` when a topic is pushed from elsewhere, so deriving the
  // initial state from the prop is the whole story.
  const seeded = initialTopic && RULE_IDS.includes(initialTopic) ? initialTopic : null;
  const [levelFilter, setLevelFilter] = React.useState(
    seeded ? RULES.find((r) => r.id === seeded).level : "alle"
  );
  const [topic, setTopic] = React.useState(seeded || "alle");
  const [q, setQ] = React.useState(null);
  const [answered, setAnswered] = React.useState(false);
  const [given, setGiven] = React.useState("");
  const [correct, setCorrect] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const inputRef = React.useRef(null);

  // Claude extras
  const [explaining, setExplaining] = React.useState(false);
  const [explanation, setExplanation] = React.useState(null);
  const [explainErr, setExplainErr] = React.useState("");
  const [queue, setQueue] = React.useState([]);
  const [genState, setGenState] = React.useState({ busy: false, error: "", info: "" });
  const [manualOpen, setManualOpen] = React.useState(false);
  const [manualPaste, setManualPaste] = React.useState("");

  const pool = React.useMemo(() => {
    let ids = RULE_IDS;
    if (levelFilter !== "alle") {
      ids = RULES.filter((r) => LEVEL_ORDER[r.level] <= LEVEL_ORDER[levelFilter]).map((r) => r.id);
      const own = RULES.filter((r) => r.level === levelFilter).map((r) => r.id);
      ids = own.length ? own : ids;
    }
    if (topic !== "alle") ids = ids.filter((id) => id === topic);
    return ids.length ? ids : RULE_IDS;
  }, [levelFilter, topic]);

  // The queue and the mastery map are read, not depended on: keeping them in
  // refs means `next` only changes when the question pool changes, so the mount
  // effect below fires exactly once per pool instead of fighting itself.
  const queueRef = React.useRef([]);
  const masteryRef = React.useRef(progress.mastery);
  React.useEffect(() => { masteryRef.current = progress.mastery; }, [progress.mastery]);

  const next = React.useCallback(() => {
    setAnswered(false); setGiven(""); setTyped("");
    setExplanation(null); setExplainErr("");
    if (queueRef.current.length) {
      const [head, ...rest] = queueRef.current;
      queueRef.current = rest;
      setQueue(rest);
      setQ(head);
    } else {
      setQ(generate(pickRule(pool, masteryRef.current)));
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [pool]);

  // Fires on mount and whenever the level/topic filter changes the pool.
  React.useEffect(() => { next(); }, [next]);

  function judge(value) {
    if (answered || !q) return;
    const ok = q.type === "choice"
      ? value === q.answer
      : answersMatch(value, q.accept || [q.answer]);
    setAnswered(true);
    setGiven(value);
    setCorrect(ok);
    onAnswer(q.rule, ok);
  }

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      const el = document.activeElement;
      if (el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && el.type !== "text"))) return;
      if (answered) { e.preventDefault(); next(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [answered, next]);

  async function doExplain() {
    if (!apiKey || !q) return;
    setExplaining(true); setExplainErr(""); setExplanation(null);
    try {
      setExplanation(await explainMistake({ apiKey, model, question: q, given }));
    } catch (e) {
      setExplainErr(e.message);
    } finally {
      setExplaining(false);
    }
  }

  const weak = weakRules(progress, 4).map((w) => ({
    ...w,
    name: RULES.find((r) => r.id === w.id)?.name || w.id,
  }));
  const targetLevel = levelFilter === "alle" ? "B2" : levelFilter;

  function ingest(data) {
    const items = (data?.items || []).filter((i) => i?.prompt && i?.answer && Array.isArray(i.options));
    if (!items.length) throw new Error("Keine verwertbaren Aufgaben in der Antwort.");
    const mapped = items.map((i) => ({
      rule: RULE_IDS.includes(i.rule) ? i.rule : "kasus",
      ruleName: RULES.find((r) => r.id === i.rule)?.name || i.kind || "Claude-Aufgabe",
      kind: i.kind || "Claude-Aufgabe",
      level: LEVELS.includes(i.level) ? i.level : targetLevel,
      type: "choice",
      longOpts: i.options.some((o) => String(o).length > 22),
      prompt: i.prompt.includes("___") ? i.prompt : i.prompt + " ___",
      hint: data.focus || "",
      options: i.options.includes(i.answer) ? i.options : [i.answer, ...i.options].slice(0, 4),
      answer: i.answer,
      fromClaude: true,
      trace: [["Quelle", "von Claude erzeugt", data.title || ""], ["Regel", i.why || "—", ""], ["Richtig", i.answer, ""]],
    }));
    queueRef.current = mapped;
    setQueue(mapped);
    next();
    setGenState({ busy: false, error: "", info: `${mapped.length} neue Aufgaben geladen.` });
  }

  async function doGenerate() {
    setGenState({ busy: true, error: "", info: "" });
    try {
      const data = await generateChallenges({ apiKey, model, weakList: weak, level: targetLevel, count: 8 });
      ingest(data);
    } catch (e) {
      setGenState({ busy: false, error: e.message, info: "" });
    }
  }

  function acceptManual() {
    try {
      ingest(extractJson(manualPaste));
      setManualPaste(""); setManualOpen(false);
    } catch (e) {
      setGenState({ busy: false, error: e.message, info: "" });
    }
  }

  if (!q) return <div className="card"><div className="card-body">Lade …</div></div>;

  const { totals } = progress;
  const rate = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : null;

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">§ Übung</span>
        <h1>Drill</h1>
        <p>
          Aufgaben werden bei jedem Aufruf neu erzeugt und nach deinen schwächsten Regeln gewichtet.
          Jede Antwort — richtig oder falsch — zeigt die Herleitung, die zu ihr geführt hat.
        </p>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="stats">
            <Stat label="Serie" value={totals.streak} />
            <Stat label="Beste Serie" value={totals.best} />
            <Stat label="Richtig" value={rate === null ? "—" : rate + "%"} />
            <Stat label="Fragen" value={totals.answered} />
          </div>
          <div style={{ display: "flex", gap: ".5em", flexWrap: "wrap" }}>
            <div className="seg" role="group" aria-label="Niveau">
              {["alle", ...LEVELS].map((l) => (
                <button key={l} type="button" aria-pressed={levelFilter === l} onClick={() => setLevelFilter(l)}>
                  {l === "alle" ? "Alle" : l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="chips" style={{ marginBottom: "var(--s4)" }}>
            <button type="button" className="chip" aria-pressed={topic === "alle"} onClick={() => setTopic("alle")}>
              alle Themen
            </button>
            {RULES.filter((r) => levelFilter === "alle" || r.level === levelFilter).map((r) => (
              <button key={r.id} type="button" className="chip" aria-pressed={topic === r.id} onClick={() => setTopic(r.id)}>
                {r.name}
              </button>
            ))}
          </div>

          <span className="q-kind">
            {q.kind} {q.fromClaude ? "· von Claude" : ""}
          </span>
          <div className="q-prompt">
            <LevelTag level={q.level} /> <Prompt text={q.prompt} />
          </div>
          {q.hint && <p className="q-hint">{q.hint}</p>}

          {q.type === "choice" ? (
            <div className="opts">
              {q.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={
                    "opt" + (q.longOpts ? " long" : "") +
                    (answered && o === q.answer ? " is-ok" : "") +
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
              onSubmit={(e) => { e.preventDefault(); answered ? next() : judge(typed); }}
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
                {correct ? (
                  <><span className="mark"><IconCheckCircle /> richtig</span><span>{q.answer}</span></>
                ) : (
                  <>
                    <span className="mark"><IconCancel /></span>
                    <span>Du: <b>{given || "—"}</b> · Richtig: <b>{q.answer}</b></span>
                  </>
                )}
              </div>
              <Trace rows={q.trace} />

              {apiKey && !correct && (
                <div style={{ marginTop: "var(--s3)" }}>
                  {!explanation && (
                    <button className="btn btn-ghost btn-sm" type="button" onClick={doExplain} disabled={explaining}>
                      {explaining ? <><Spinner /> Claude erklärt …</> : "Claude soll das erklären"}
                    </button>
                  )}
                  {explainErr && <Callout kind="bad">{explainErr}</Callout>}
                  {explanation && (
                    <Callout kind="info">
                      <p><b>{explanation.short}</b></p>
                      <p style={{ marginTop: ".4em" }}><span className="mono dim">Regel: </span>{explanation.rule}</p>
                      <p style={{ marginTop: ".4em" }}>{explanation.why_wrong}</p>
                      <p style={{ marginTop: ".4em" }}><span className="mono dim">Minimalpaar: </span>{explanation.contrast}</p>
                      <p style={{ marginTop: ".4em" }}><span className="mono dim">Merke: </span>{explanation.remember}</p>
                    </Callout>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="actions">
            <button className="btn" type="button" onClick={next}>Weiter</button>
            {!answered && (
              <button className="btn btn-ghost" type="button" onClick={() => judge(q.type === "choice" ? "" : typed)}>
                Aufgeben
              </button>
            )}
            <span className="kbd">Enter</span>
            {queue.length > 0 && <span className="dim mono" style={{ fontSize: ".74rem" }}>{queue.length} Claude-Aufgaben in der Warteschlange</span>}
          </div>
        </div>

        <div className="card-body" style={{ borderTop: "1px solid var(--rule)" }}>
          <span className="eyebrow">Beherrschung nach Regel</span>
          <div className="m-list" style={{ marginTop: "var(--s2)" }}>
            {RULES.map((r) => {
              const m = progress.mastery[r.id] || { r: 0, t: 0 };
              return <MasteryRow key={r.id} name={r.name} level={r.level} r={m.r} t={m.t} />;
            })}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------- Claude challenges -- */}
      <div className="card" style={{ marginTop: "var(--s4)" }}>
        <div className="card-head">
          <span className="eyebrow">Neue Aufgaben von Claude</span>
          <span className="dim" style={{ fontSize: ".8rem" }}>Niveau {targetLevel}</span>
        </div>
        <div className="card-body">
          <p className="muted" style={{ fontSize: ".92rem" }}>
            Claude erzeugt frische Aufgaben, die gezielt deine schwächsten Regeln treffen — der Generator hier
            im Browser hat feste Muster, Claude nicht.
          </p>
          {weak.length > 0 && (
            <p className="q-hint" style={{ marginTop: "var(--s2)" }}>
              Fokus: {weak.map((w) => `${w.name} (${Math.round(w.acc * 100)}%)`).join(" · ")}
            </p>
          )}

          <div className="actions">
            {mode === "api" ? (
              <button className="btn" type="button" onClick={doGenerate} disabled={!apiKey || genState.busy}>
                {genState.busy ? <><Spinner /> Erzeuge …</> : "8 Aufgaben erzeugen"}
              </button>
            ) : (
              <button className="btn" type="button" onClick={() => setManualOpen((v) => !v)}>
                {manualOpen ? "Schließen" : "Prompt zum Kopieren"}
              </button>
            )}
            {mode === "api" && !apiKey && <span className="dim" style={{ fontSize: ".85rem" }}>Kein API-Key hinterlegt — siehe Einstellungen.</span>}
          </div>

          {genState.error && <Callout kind="bad">{genState.error}</Callout>}
          {genState.info && <Callout>{genState.info}</Callout>}

          {(manualOpen || mode === "manual") && (
            <div style={{ marginTop: "var(--s3)", display: "grid", gap: "var(--s2)" }}>
              <div style={{ display: "flex", gap: ".5em", alignItems: "center", flexWrap: "wrap" }}>
                <span className="eyebrow">1 · Diesen Prompt in claude.ai einfügen</span>
                <CopyButton text={manualChallengePrompt({ weakList: weak, level: targetLevel, count: 8 })} />
              </div>
              <textarea
                className="copybox"
                readOnly
                value={manualChallengePrompt({ weakList: weak, level: targetLevel, count: 8 })}
                onFocus={(e) => e.target.select()}
              />
              <span className="eyebrow">2 · Claudes JSON-Antwort hier einfügen</span>
              <textarea
                className="copybox"
                placeholder='{"title": "...", "focus": "...", "items": [ ... ]}'
                value={manualPaste}
                onChange={(e) => setManualPaste(e.target.value)}
              />
              <div>
                <button className="btn" type="button" onClick={acceptManual} disabled={!manualPaste.trim()}>
                  Aufgaben übernehmen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
