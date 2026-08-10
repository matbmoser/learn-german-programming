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
import { WRITING_TASKS, WRITING_CRITERIA, TASK_BY_ID, WRITING_TOPICS, TOPICS_BY_CATEGORY, TOPIC_CATEGORIES } from "../data/writing.js";
import { REDEMITTEL } from "../data/lexicon.js";
import { LEVELS } from "../data/curriculum.js";
import { correctWriting, manualCorrectionPrompt, patternExercisePrompt, extractJson, scopeCorrectionToLevel } from "../lib/claude.js";
import { buildErrorRanges, buildSegments } from "../lib/highlight.js";
import { exportWritingPdf } from "../lib/pdf.js";
import { computeWritingStats, donutSvg, barsSvg, PALETTE } from "../lib/charts.js";
import { suggestWords } from "../lib/dictionary.js";
import { LevelTag, Callout, Spinner, CopyButton, countWords, Prompt } from "./ui.jsx";
import {
  IconArrowRight, IconBack, IconCancel, IconCheck, IconCheckCircle, IconClose,
  IconDice, IconDownload, IconFullscreen, IconFullscreenExit, IconGallery,
  IconIdea, IconRun, IconSparkle, IconTeacher, IconUndo, IconWarning,
} from "./icons.jsx";


const CRIT = Object.fromEntries(WRITING_CRITERIA.map((c) => [c.id, c]));

const TABS = [
  { id: "overview", label: "Überblick" },
  { id: "errors", label: "Fehler" },
  { id: "patterns", label: "Muster" },
  { id: "target", label: "Zielniveau" },
  { id: "practice", label: "Üben" },
];

export default function Write({ progress, apiKey, model, mode, targetLevel, settings, onSettings, onSaveWriting, onWriteContext, onLookupWord, onAskTeacher }) {
  const [levelFilter, setLevelFilter] = React.useState(
    LEVELS.includes(targetLevel) ? targetLevel : "C1"
  );
  const [taskId, setTaskId] = React.useState(
    (WRITING_TASKS.find((t) => t.level === (LEVELS.includes(targetLevel) ? targetLevel : "C1")) || WRITING_TASKS[0]).id
  );
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [feedback, setFeedback] = React.useState(null);
  const [acceptedSet, setAcceptedSet] = React.useState(new Set());
  const [manualOpen, setManualOpen] = React.useState(false);
  const [paste, setPaste] = React.useState("");

  const [taskOpen, setTaskOpen] = React.useState(true);
  const [resultsFull, setResultsFull] = React.useState(false);
  const [resultsWidth, setResultsWidth] = React.useState(420);
  const [mobilePane, setMobilePane] = React.useState("editor");
  const [tab, setTab] = React.useState("overview");
  const [activeError, setActiveError] = React.useState(null);
  const [showPhrases, setShowPhrases] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [showGallery, setShowGallery] = React.useState(false);
  const [freeTopicId, setFreeTopicId] = React.useState(null);
  const [galleryCat, setGalleryCat] = React.useState(TOPIC_CATEGORIES[0]);
  const [customOpen, setCustomOpen] = React.useState(false);
  const [customTitle, setCustomTitle] = React.useState("");
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [customMinWords, setCustomMinWords] = React.useState(
    ({ A2: 60, B1: 120, B2: 180, C1: 250 })[targetLevel] || 120
  );
  const [customTopic, setCustomTopic] = React.useState(null);

  const suggestionsOn = settings?.suggestions !== false;
  function toggleSuggestions() {
    onSettings?.({ suggestions: !suggestionsOn });
  }

  const galleryTopic = freeTopicId ? WRITING_TOPICS.find((t) => t.id === freeTopicId) : null;
  const freeTopic = customTopic || galleryTopic;
  // Memoised: a fresh object here would re-fire the onWriteContext effect below
  // on every render, and that effect writes state in the parent — an endless loop.
  const task = React.useMemo(
    () => (freeTopic
      ? { id: `gallery-${freeTopic.id}`, level: "—", type: freeTopic.category, minWords: freeTopic.minWords,
          title: freeTopic.title, prompt: freeTopic.prompt,
          targets: ["Freies Schreiben"], checklist: ["Klarer Aufbau", "Eigene Meinung ausgedrückt"] }
      : (TASK_BY_ID[taskId] || WRITING_TASKS[0])),
    [freeTopic, taskId]
  );

  // Keep Frau Müller informed about both the text and the correction the
  // student is currently looking at. Only the useful learning evidence is
  // exposed here; display-only chart data stays local to the writing view.
  React.useEffect(() => {
    const correction = feedback ? {
      cefrEstimate: feedback.cefr_estimate,
      taskMet: feedback.task_met,
      approvalReason: feedback.approval_reason,
      corrections: (feedback.corrections || []).map(({ original, corrected, type, rule, why, severity }) => (
        { original, corrected, type, rule, why, severity }
      )),
      errorPatterns: feedback.error_patterns || [],
      nextSteps: feedback.next_steps || [],
      activeError: activeError == null ? null : feedback.corrections?.[activeError] || null,
    } : null;
    onWriteContext?.({
      text,
      task,
      phase: busy ? "correction in progress" : feedback ? "reviewing correction" : text.trim() ? "writing draft" : "choosing a task",
      activePanel: feedback ? tab : "editor",
      wordCount: countWords(text),
      correction,
    });
  }, [text, task, feedback, activeError, tab, busy, onWriteContext]);
  const words = countWords(text);
  const enough = words >= task.minWords;

  const tasksForLevel = React.useMemo(
    () => WRITING_TASKS.filter((t) => t.level === levelFilter),
    [levelFilter]
  );
  React.useEffect(() => {
    if (!tasksForLevel.find((t) => t.id === taskId) && tasksForLevel[0]) setTaskId(tasksForLevel[0].id);
  }, [levelFilter, taskId, tasksForLevel]);

  const errorRanges = React.useMemo(
    () => (feedback ? buildErrorRanges(text, feedback.corrections || []) : []),
    [text, feedback]
  );

  const manualActive = manualOpen && text.trim();

  function accept(data) {
    if (!data || !Array.isArray(data.corrections)) throw new Error("Die Antwort enthält keine Korrekturen.");
    const leveledFeedback = scopeCorrectionToLevel(data, targetLevel || task.level || "C1");
    setFeedback(leveledFeedback);
    setError("");
    setTab("overview");
    setActiveError(null);
    setManualOpen(false);
    setAcceptedSet(new Set());
    setMobilePane("results");
    onSaveWriting({
      id: "w" + Date.now(),
      taskId: task.id,
      level: task.level,
      title: task.title,
      text,
      words,
      at: Date.now(),
      feedback: leveledFeedback,
    });
  }

  async function submit() {
    setBusy(true); setError(""); setFeedback(null);
    try {
      accept(await correctWriting({ apiKey, model, task, text, targetLevel: targetLevel || "C1" }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function acceptManual() {
    try {
      accept(extractJson(paste));
      setPaste("");
    } catch (e) {
      setError(e.message);
    }
  }

  function selectFreeTopic(topicId) {
    setFreeTopicId(topicId);
    setCustomTopic(null);
    setCustomOpen(false);
    setShowGallery(false);
    setMobilePane("editor");
    clearAll();
  }

  function selectCustomTopic(event) {
    event.preventDefault();
    const title = customTitle.trim();
    if (!title) return;
    const prompt = customPrompt.trim() || `Schreiben Sie einen Text über „${title}“. Entwickeln Sie Ihre Gedanken anhand konkreter Beispiele und begründen Sie Ihre Meinung.`;
    setCustomTopic({
      id: "personalized",
      category: "Eigenes Thema",
      minWords: Math.max(20, Number(customMinWords) || 120),
      title,
      prompt,
    });
    setFreeTopicId(null);
    setCustomOpen(false);
    setShowGallery(false);
    setMobilePane("editor");
    clearAll();
  }

  function askTeacherForTopic() {
    onAskTeacher?.(`Schlagen Sie mir bitte drei persönliche Schreibthemen auf Deutsch für mein Niveau ${targetLevel || "C1"} vor. Berücksichtigen Sie, was Sie bereits über meine Interessen wissen. Falls Sie noch nichts darüber wissen, fragen Sie mich zuerst kurz nach meinen Interessen.`);
  }

  function pickRandomTopic() {
    const idx = Math.floor(Math.random() * WRITING_TOPICS.length);
    selectFreeTopic(WRITING_TOPICS[idx].id);
  }

  function backToTasks() {
    setFreeTopicId(null);
    setCustomTopic(null);
    clearAll();
  }

  function clearAll() {
    setText(""); setFeedback(null); setError(""); setActiveError(null); setResultsFull(false); setAcceptedSet(new Set());
  }

  function exportPdf() {
    try {
      exportWritingPdf({ task, text, words, feedback, targetLevel: targetLevel || "C1" });
    } catch (e) {
      setError(e.message);
    }
  }

  function jumpToError(i) {
    setActiveError(i);
    setResultsFull(false);
    setMobilePane("editor");
  }

  function startResultsResize(event) {
    if (resultsFull || window.matchMedia("(max-width: 980px)").matches) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = resultsWidth;
    const move = (e) => {
      const max = Math.max(360, Math.min(760, window.innerWidth * 0.62));
      setResultsWidth(Math.round(Math.max(340, Math.min(max, startWidth + startX - e.clientX))));
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      document.body.classList.remove("is-resizing-results");
    };
    document.body.classList.add("is-resizing-results");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  }

  function requestPersonalizedExercise() {
    onAskTeacher?.(
      "Please create a short interactive exercise personalized from the mistakes in my current writing correction. Use my exact error patterns and wording where helpful, focus on the two most important weaknesses, and do not ask me to paste my text again.",
      { autoSend: true }
    );
  }

  // Replace one error's original text with the corrected version.
  function acceptCorrection(index) {
    if (!feedback) return;
    const corr = feedback.corrections[index];
    if (!corr) return;
    const idx = text.indexOf(corr.original);
    if (idx === -1) return;
    setText((t) => t.slice(0, idx) + corr.corrected + t.slice(idx + corr.original.length));
    setAcceptedSet((s) => new Set(s).add(index));
  }

  function revertCorrection(index) {
    if (!feedback) return;
    const corr = feedback.corrections[index];
    if (!corr) return;
    const idx = text.indexOf(corr.corrected);
    if (idx === -1) return;
    setText((t) => t.slice(0, idx) + corr.original + t.slice(idx + corr.corrected.length));
    setAcceptedSet((s) => { const next = new Set(s); next.delete(index); return next; });
  }

  function showPerfect() {
    if (feedback?.improved_version) setText(feedback.improved_version);
  }

  function loadWriting(w) {
    setText(w.text); setTaskId(w.taskId); setLevelFilter(w.level);
    setFeedback(w.feedback); setTab("overview"); setActiveError(null); setShowHistory(false);
    setMobilePane("results");
  }

  const promptText = manualCorrectionPrompt({ task, text, targetLevel: targetLevel || "C1" });

  const cls = ["ide", `mobile-${mobilePane}`];
  if (!taskOpen) cls.push("task-collapsed");
  if (resultsFull) cls.push("results-full");

  return (
    <div className={cls.join(" ")} style={{ "--ide-results-width": `${resultsWidth}px` }}>
      <div className="ide-mobile-nav" role="tablist" aria-label="Bereiche des Schreibtrainers">
        <button
          type="button"
          role="tab"
          aria-selected={mobilePane === "task"}
          onClick={() => { setTaskOpen(true); setMobilePane("task"); }}
        >
          Aufgabe
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobilePane === "editor"}
          onClick={() => setMobilePane("editor")}
        >
          Schreiben
          <span>{words}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobilePane === "results"}
          onClick={() => setMobilePane("results")}
        >
          Feedback
          {feedback && <span className="has-feedback">{feedback.corrections?.length ?? 0}</span>}
        </button>
      </div>
      {/* ============================================================ task === */}
      <aside className="ide-task">
        {taskOpen ? (
          <>
            <div className="ide-panel-head">
              <span className="eyebrow">Aufgabe</span>
              <button className="ide-icon" type="button" title="Aufgabe einklappen" onClick={() => setTaskOpen(false)}>⟨</button>
            </div>
            <div className="ide-task-body">
              {/* gallery toggle row */}
              <div style={{ display: "flex", gap: "var(--s1)", marginBottom: "var(--s2)" }}>
                <button
                  className={"btn btn-sm" + (showGallery ? " is-on" : "")}
                  type="button"
                  style={{ flex: 1 }}
                  onClick={() => { setShowGallery((v) => !v); setCustomOpen(false); }}
                >
                  {showGallery ? <><IconClose /> Galerie schließen</> : <><IconGallery /> Themen-Galerie</>}
                </button>
                <button
                  className="btn btn-sm"
                  type="button"
                  title="Zufälliges Thema aus der Galerie"
                  onClick={pickRandomTopic}
                >
                  <IconDice /> Zufall
                </button>
              </div>

              <div className="ide-topic-actions">
                <button
                  className={"btn btn-ghost btn-sm" + (customOpen ? " is-on" : "")}
                  type="button"
                  aria-expanded={customOpen}
                  onClick={() => { setCustomOpen((v) => !v); setShowGallery(false); }}
                >
                  <span aria-hidden="true">＋</span> Eigenes Thema
                </button>
                <button className="btn btn-ghost btn-sm" type="button" onClick={askTeacherForTopic}>
                  <IconTeacher /> Lehrerin fragen
                </button>
              </div>

              {customOpen && (
                <form className="ide-custom-topic" onSubmit={selectCustomTopic}>
                  <label>
                    <span>Worüber möchten Sie schreiben?</span>
                    <input
                      className="input"
                      value={customTitle}
                      onChange={(event) => setCustomTitle(event.target.value)}
                      placeholder="z. B. Mein Umzug nach Berlin"
                      autoFocus
                    />
                  </label>
                  <label>
                    <span>Schreibauftrag <small>(optional)</small></span>
                    <textarea
                      className="input"
                      value={customPrompt}
                      onChange={(event) => setCustomPrompt(event.target.value)}
                      placeholder="Bestimmte Fragen, Perspektive oder Textart …"
                      rows={3}
                    />
                  </label>
                  <label className="ide-custom-words">
                    <span>Mindestlänge</span>
                    <input
                      className="input"
                      type="number"
                      min="20"
                      step="10"
                      value={customMinWords}
                      onChange={(event) => setCustomMinWords(event.target.value)}
                    />
                    <span>Wörter</span>
                  </label>
                  <button className="btn btn-sm" type="submit" disabled={!customTitle.trim()}>
                    Thema verwenden <IconArrowRight />
                  </button>
                </form>
              )}

              {freeTopic && !showGallery && !customOpen && (
                <div className="ide-free-topic-banner">
                  <span className="eyebrow">{freeTopic.category}</span>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={backToTasks} style={{ marginLeft: "auto" }}>
                    <IconBack /> Aufgaben
                  </button>
                </div>
              )}

              {showGallery ? (
                <div className="ide-gallery">
                  <div className="seg seg-sm ide-gallery-cats" role="group" aria-label="Kategorie">
                    {TOPIC_CATEGORIES.map((cat) => (
                      <button key={cat} type="button" aria-pressed={galleryCat === cat} onClick={() => setGalleryCat(cat)}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="ide-gallery-grid">
                    {(TOPICS_BY_CATEGORY[galleryCat] || []).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={"ide-gallery-card" + (freeTopicId === t.id ? " is-on" : "")}
                        onClick={() => selectFreeTopic(t.id)}
                      >
                        <span className="ide-gallery-title">{t.title}</span>
                        <span className="ide-gallery-hint">{t.minWords}+ Wörter</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : !customOpen && (
                <>
                  {!freeTopic && (
                    <>
                      <div className="seg seg-sm" role="group" aria-label="Niveau">
                        {LEVELS.map((l) => (
                          <button key={l} type="button" aria-pressed={levelFilter === l} onClick={() => setLevelFilter(l)}>{l}</button>
                        ))}
                      </div>
                      <div className="ide-tasklist">
                        {tasksForLevel.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className={"ide-taskitem" + (t.id === taskId ? " is-on" : "")}
                            onClick={() => { setTaskId(t.id); setMobilePane("editor"); }}
                          >
                            <span className="mono dim">{t.type}</span>
                            <span>{t.title}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="ide-task-detail">
                    <div className="ide-task-title">
                      <LevelTag level={task.level} />
                      <h3>{task.title}</h3>
                    </div>
                    <p className="muted" style={{ whiteSpace: "pre-wrap", fontSize: ".92rem" }}>{task.prompt}</p>
                    {!freeTopic && (
                      <p className="q-hint">
                        <span className="mono dim">Geforderte Strukturen: </span>{task.targets.join(" · ")}
                      </p>
                    )}
                    <span className="eyebrow" style={{ display: "block", marginTop: "var(--s3)" }}>Checkliste</span>
                    <ul className="pit" style={{ marginTop: "var(--s2)" }}>
                      {task.checklist.map((c, i) => (
                        <li key={i} style={{ borderLeftColor: "var(--nom)" }}>{c}</li>
                      ))}
                    </ul>

                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowPhrases((v) => !v)} style={{ marginTop: "var(--s3)" }}>
                      {showPhrases ? "Redemittel schließen" : "Redemittel"}
                    </button>
                    {showPhrases && (
                      <div className="ide-phrases">
                        {REDEMITTEL.map((g) => (
                          <div key={g.fn} style={{ marginBottom: "var(--s2)" }}>
                            <span className="eyebrow" style={{ display: "block" }}>{g.fn}</span>
                            <ul className="pit" style={{ marginTop: "var(--s1)" }}>
                              {g.items.map((it, i) => (
                                <li key={i} style={{ borderLeftColor: "var(--dat)", fontFamily: "var(--f-display)", fontSize: ".85rem" }}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {progress.writings?.length > 0 && (
                      <>
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowHistory((v) => !v)} style={{ marginTop: "var(--s3)" }}>
                          {showHistory ? "Verlauf schließen" : `Verlauf (${progress.writings.length})`}
                        </button>
                        {showHistory && (
                          <div className="ide-history">
                            {progress.writings.slice().reverse().map((w) => (
                              <button key={w.id} type="button" className="ide-histitem" onClick={() => loadWriting(w)}>
                                <span className="mono dim">{new Date(w.at).toLocaleDateString("de-DE")} · {w.words} W · {w.feedback?.cefr_estimate || "—"}</span>
                                <span>{w.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <button className="ide-rail" type="button" title="Aufgabe zeigen" onClick={() => setTaskOpen(true)}>
            <span className="ide-rail-icon">⟩</span>
            <span className="ide-rail-text">Aufgabe · {task.title}</span>
          </button>
        )}
      </aside>

      {/* ========================================================== editor === */}
      <section className="ide-editor">
        <div className="ide-toolbar">
          <span className="ide-file mono"><span className="ide-ext">§</span>{task.id}.de</span>
          <span className={"ide-wc " + (enough ? "ok" : words ? "short" : "")}>
            <b>{words}</b> / {task.minWords} Wörter
          </span>
          <span className="ide-spacer" />
          {mode === "api" ? (
            <button className="btn btn-sm" type="button" onClick={submit} disabled={busy || !text.trim() || !apiKey}>
              {busy ? <><Spinner /> korrigiert …</> : <><IconRun /> Korrigieren</>}
            </button>
          ) : (
            <button className="btn btn-sm" type="button" onClick={() => setManualOpen((v) => !v)} disabled={!text.trim()}>
              {manualOpen ? "Prompt schließen" : "Prompt erzeugen"}
            </button>
          )}
          <button className="btn btn-ghost btn-sm" type="button" onClick={exportPdf} disabled={!feedback} title="Alle Ergebnisse als PDF exportieren">
            <IconDownload /> PDF
          </button>
          {feedback && (
            <button className="btn btn-ghost btn-sm" type="button" onClick={showPerfect} title="Zeigt die KI-perfekte Version">
              <IconSparkle /> Perfekte Version
            </button>
          )}
          <button
            className={"btn btn-ghost btn-sm" + (suggestionsOn ? " is-on" : "")}
            type="button"
            onClick={toggleSuggestions}
            title={suggestionsOn ? "Wortvorschläge abschalten" : "Wortvorschläge anschalten"}
            aria-pressed={suggestionsOn}
          >
            <IconIdea /> Vorschläge {suggestionsOn ? "an" : "aus"}
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={clearAll} disabled={!text}>Leeren</button>
        </div>

        <HighlightedEditor
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSetValue={setText}
          task={task}
          words={words}
          enough={enough}
          errorRanges={errorRanges}
          activeError={activeError}
          corrections={feedback?.corrections || []}
          acceptedSet={acceptedSet}
          onAcceptCorrection={acceptCorrection}
          onRevertCorrection={revertCorrection}
          onHoverError={setActiveError}
          suggestionsOn={suggestionsOn}
          onLookupWord={onLookupWord}
        />

        {mode === "api" && !apiKey && (
          <div className="ide-note">
            <Callout kind="bad">
              Kein API-Key hinterlegt. Trag ihn in den Einstellungen ein — oder wechsle in den manuellen Modus.
            </Callout>
          </div>
        )}
        {error && <div className="ide-note"><Callout kind="bad">{error}</Callout></div>}
      </section>

      {/* ========================================================= results === */}
      <aside className="ide-results">
        <div
          className="ide-results-resizer"
          role="separator"
          aria-label="Breite der Korrektur-Seitenleiste ändern"
          aria-orientation="vertical"
          aria-valuenow={resultsWidth}
          tabIndex={-1}
          onPointerDown={startResultsResize}
        />
        <div className="ide-panel-head ide-results-head">
          <div className="ide-tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? "is-on" : ""}
                onClick={() => setTab(t.id)}
                disabled={!feedback && !manualActive}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="ide-results-tools">
            <button className="ide-icon" type="button" title="Als PDF exportieren" onClick={exportPdf} disabled={!feedback}><IconDownload /></button>
            <button className="ide-icon" type="button" title={resultsFull ? "Verkleinern" : "Vollbild"} onClick={() => setResultsFull((v) => !v)}>
              {resultsFull ? <IconFullscreenExit /> : <IconFullscreen />}
            </button>
          </div>
        </div>

        <div className="ide-results-body">
          {manualActive && (
            <ManualBox promptText={promptText} paste={paste} setPaste={setPaste} onAccept={acceptManual} />
          )}

          {!feedback && !manualActive && (
            <div className="ide-empty">
              <p className="muted">
                Schreib links deinen Text und lass ihn korrigieren. Hier erscheinen dann — in Tabs — die
                Niveau-Einschätzung, jeder Fehler direkt im Text markiert, die Fehlermuster dahinter, dein
                Text auf Zielniveau und Übungen. Alles lässt sich als PDF exportieren.
              </p>
              <p className="muted" style={{ marginTop: "var(--s2)" }}>
                Tipp: Das <b>Wörterbuch</b> oben rechts im Kopf ist immer offen — dort kannst du Wörter
                nachschlagen, auch auf Englisch. Doppelklick auf ein Wort im Text schlägt es direkt nach.
              </p>
            </div>
          )}

          {feedback && !manualActive && (
            <Results
              fb={feedback}
              tab={tab}
              targetLevel={targetLevel || "C1"}
              activeError={activeError}
              acceptedSet={acceptedSet}
              onJumpError={jumpToError}
              onAcceptCorrection={acceptCorrection}
              onRevertCorrection={revertCorrection}
            />
          )}
        </div>
        {feedback && !manualActive && (
          <div className="ide-practice-cta">
            <div>
              <strong>Aus deinen Fehlern lernen</strong>
              <span>Frau Müller erstellt eine kurze persönliche Übung aus diesem Text.</span>
            </div>
            <button className="btn btn-sm" type="button" onClick={requestPersonalizedExercise} disabled={!apiKey}>
              <IconTeacher /> Persönliche Übung
            </button>
          </div>
        )}
      </aside>

    </div>
  );
}

// ---------------------------------------------------------------------------
//  Editor with syntax + error overlay
// ---------------------------------------------------------------------------

function ErrorTooltip({ correction, accepted, onAccept, onRevert, onMouseEnter, onMouseLeave }) {
  if (!correction) return null;
  return (
    <div className="err-tip" role="tooltip" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="err-tip-row">
        <span className="err-tip-sev" data-sev={correction.severity}>{correction.severity}</span>
        <span className="err-tip-type">{correction.type}</span>
        {!accepted ? (
          <button className="err-tip-accept" type="button" onClick={onAccept}><IconCheck /> Übernehmen</button>
        ) : (
          <>
            <span className="err-tip-done"><IconCheckCircle /> Übernommen</span>
            <button className="err-tip-revert" type="button" onClick={onRevert}><IconUndo /> Rückgängig</button>
          </>
        )}
      </div>
      <div className="err-tip-diff">
        <span className="err-tip-bad">{correction.original}</span>
        <span className="err-tip-arrow"><IconArrowRight /></span>
        <span className="err-tip-good">{correction.corrected}</span>
      </div>
      <p className="err-tip-why">{correction.why}</p>
    </div>
  );
}

// Mirror-div technique: compute the pixel position of the caret inside a
// textarea so the autocomplete dropdown can be anchored under the current word.
const MIRROR_PROPS = [
  "boxSizing", "fontFamily", "fontSize", "fontWeight", "fontStyle",
  "letterSpacing", "textTransform", "wordSpacing", "lineHeight", "textIndent",
  "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
  "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
  "tabSize", "whiteSpace",
];

function caretCoords(ta, pos) {
  const style = window.getComputedStyle(ta);
  const div = document.createElement("div");
  for (const p of MIRROR_PROPS) div.style[p] = style[p];
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.left = "-9999px";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.overflowWrap = "break-word";
  // The mirror has to wrap at exactly the textarea's content width — taking
  // `style.width` while box-sizing is border-box makes it narrower than the
  // real thing, so every coordinate below drifts on wrapped lines.
  div.style.boxSizing = "content-box";
  const padL = parseFloat(style.paddingLeft) || 0;
  const padR = parseFloat(style.paddingRight) || 0;
  div.style.width = Math.max(0, ta.clientWidth - padL - padR) + "px";
  div.textContent = ta.value.slice(0, pos);
  const span = document.createElement("span");
  span.textContent = ta.value.slice(pos) || ".";
  div.appendChild(span);
  document.body.appendChild(div);
  const top = span.offsetTop - ta.scrollTop;
  const left = span.offsetLeft - ta.scrollLeft;
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4;
  document.body.removeChild(div);
  return { top, left, lineHeight };
}

const WORD_RE = /[A-Za-zÀ-ÿ]+$/;
const LETTER_RE = /[A-Za-zÀ-ÿ]/;

/** The word being typed immediately left of `pos`, read from live text. */
function wordBefore(text, pos) {
  const m = text.slice(0, pos).match(WORD_RE);
  const word = m ? m[0] : "";
  return { word, start: pos - word.length, end: pos };
}

// How long the error tooltip stays alive after the pointer leaves the marked
// word — without this you can never reach the “Übernehmen” button, because the
// gap between word and tooltip already counts as “not hovering”.
const TIP_GRACE_MS = 260;

function HighlightedEditor({ value, onChange, onSetValue, task, words, enough, errorRanges, activeError, corrections, acceptedSet, onAcceptCorrection, onRevertCorrection, onHoverError, suggestionsOn, onLookupWord }) {
  const taRef = React.useRef(null);
  const hlRef = React.useRef(null);
  const gutterRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const [caret, setCaret] = React.useState({ line: 1, col: 1 });
  const [hoveredError, setHoveredError] = React.useState(null); // {index, top, left, above}
  const [suggest, setSuggest] = React.useState(null); // {items, top, left, active, word}
  const [lineHeights, setLineHeights] = React.useState([]);
  const debounceRef = React.useRef(0);
  const abortRef = React.useRef(null);
  const pendingCaret = React.useRef(null);
  const tipCloseRef = React.useRef(0);

  const segments = React.useMemo(
    () => buildSegments(value, errorRanges, activeError),
    [value, errorRanges, activeError]
  );
  const lines = React.useMemo(() => segmentsToLines(segments), [segments]);
  const numbers = Array.from({ length: lines.length }, (_, n) => n + 1);

  // The gutter has to follow the *visual* height of each logical line, or the
  // numbers drift down the page as soon as a paragraph wraps.
  React.useLayoutEffect(() => {
    const pre = hlRef.current;
    if (!pre) return undefined;
    const measure = () => {
      const hs = Array.from(pre.querySelectorAll(".hl-line")).map((el) => el.offsetHeight);
      setLineHeights((prev) =>
        prev.length === hs.length && prev.every((h, i) => h === hs[i]) ? prev : hs
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(pre);
    return () => ro.disconnect();
  }, [lines]);

  function syncScroll() {
    const ta = taRef.current;
    if (!ta) return;
    if (hlRef.current) {
      hlRef.current.scrollTop = ta.scrollTop;
      hlRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
    hideTip();
    setSuggest(null);
  }
  function updateCaret() {
    const el = taRef.current;
    if (!el) return;
    const pos = el.selectionStart || 0;
    const before = el.value.slice(0, pos); // live value — the prop lags a keystroke
    setCaret({ line: before.split("\n").length, col: pos - before.lastIndexOf("\n") });
  }

  // ---- error tooltip -----------------------------------------------------
  function hideTip() {
    window.clearTimeout(tipCloseRef.current);
    setHoveredError(null);
    onHoverError?.(null);
  }
  function keepTip() {
    window.clearTimeout(tipCloseRef.current);
  }
  function scheduleHideTip() {
    window.clearTimeout(tipCloseRef.current);
    tipCloseRef.current = window.setTimeout(() => {
      setHoveredError(null);
      onHoverError?.(null);
    }, TIP_GRACE_MS);
  }
  React.useEffect(() => () => {
    window.clearTimeout(tipCloseRef.current);
    window.clearTimeout(debounceRef.current);
  }, []);

  // ---- autocomplete ------------------------------------------------------
  function closeSuggest() {
    window.clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setSuggest(null);
  }

  // After a programmatic value change (accepting a suggestion) restore the
  // caret. The pending position is tied to the exact text it was computed for:
  // if that text never arrives the request is dropped instead of firing later
  // on an unrelated edit and yanking the caret backwards.
  React.useLayoutEffect(() => {
    const pending = pendingCaret.current;
    if (!pending || !taRef.current) return;
    pendingCaret.current = null;
    const ta = taRef.current;
    if (ta.value !== pending.text) return;
    ta.focus();
    ta.setSelectionRange(pending.pos, pending.pos);
    updateCaret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  React.useEffect(() => {
    if (!suggestionsOn) closeSuggest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionsOn]);

  function maybeSuggest() {
    const ta = taRef.current;
    if (!ta || !suggestionsOn) { closeSuggest(); return; }
    const live = ta.value; // live value — the `value` prop lags one keystroke
    const pos = ta.selectionStart || 0;
    // Only suggest at the end of a word (next char is not a letter).
    if (LETTER_RE.test(live[pos] || "")) { closeSuggest(); return; }
    const { word, start } = wordBefore(live, pos);
    if (word.length < 2) { closeSuggest(); return; }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const items = await suggestWords(word, { signal: ctrl.signal });
        if (ctrl.signal.aborted) return;
        // The fetch takes time; if the typed word moved on in the meantime the
        // answer is stale and inserting it would splice text at a dead offset.
        const el = taRef.current;
        if (!el || el.value !== live || (el.selectionStart || 0) !== pos) return;
        if (!items.length) { setSuggest(null); return; }
        const coords = caretCoords(el, start);
        setSuggest({ items: items.slice(0, 8), active: -1, word, ...menuBox(coords, items.length) });
      } catch {
        /* network/abort — silently ignore */
      }
    }, 180);
  }

  // Position the dropdown under the word, kept inside the editor box.
  function menuBox(coords, count) {
    const main = mainRef.current;
    const w = main ? main.clientWidth : 0;
    const h = main ? main.clientHeight : 0;
    const height = Math.min(count, 8) * 28 + 10;
    const below = coords.top + coords.lineHeight + 2;
    const above = coords.top - height - 2;
    return {
      top: h && below + height > h && above > 0 ? above : below,
      left: w ? Math.max(0, Math.min(coords.left, w - 190)) : coords.left,
    };
  }

  function acceptSuggestion(item) {
    const ta = taRef.current;
    if (!ta || !item) return;
    // Re-read the word under the caret instead of trusting the offsets the
    // suggestion was requested with — those are one network round-trip old.
    const base = ta.value;
    const pos = ta.selectionStart || 0;
    const { start, end } = wordBefore(base, pos);
    if (start === end) { closeSuggest(); return; }
    const next = base.slice(0, start) + item + base.slice(end);
    pendingCaret.current = { pos: start + item.length, text: next };
    closeSuggest();
    onSetValue?.(next);
  }

  function handleInput(e) {
    onChange?.(e);
    // value prop updates next render; compute suggestion from the live textarea.
    maybeSuggest();
  }

  function handleKeyDown(e) {
    if (!suggest) return;
    const n = suggest.items.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggest((s) => ({ ...s, active: (s.active + 1) % n }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggest((s) => ({ ...s, active: (s.active <= 0 ? n : s.active) - 1 }));
    } else if (e.key === "Tab") {
      e.preventDefault();
      acceptSuggestion(suggest.items[Math.max(0, suggest.active)]);
    } else if (e.key === "Enter") {
      // Enter only accepts something you actually picked — otherwise it stays
      // a paragraph break, which is what it means while writing.
      if (suggest.active < 0) { closeSuggest(); return; }
      e.preventDefault();
      acceptSuggestion(suggest.items[suggest.active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSuggest();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
      closeSuggest(); // the caret leaves the word the list belongs to
    }
  }

  // Double-click a word in the editor to look it up in the dictionary.
  function handleDoubleClick() {
    const ta = taRef.current;
    if (!ta) return;
    const sel = value.slice(ta.selectionStart, ta.selectionEnd).trim();
    const word = sel.match(/[A-Za-zÀ-ÿ]+/)?.[0];
    if (word) onLookupWord?.(word);
  }

  function showErrorTip(mark, index) {
    if (!mark || !mainRef.current) return;
    const r = mark.getBoundingClientRect();
    const container = mainRef.current.getBoundingClientRect();
    const flip = r.bottom - container.top + 190 > container.height && r.top - container.top > 190;
    keepTip();
    setHoveredError({
      index,
      top: (flip ? r.top : r.bottom) - container.top,
      left: Math.max(0, Math.min(r.left - container.left, container.width - 340)),
      above: flip,
    });
    onHoverError?.(index);
  }

  // Find which error mark (if any) is under the mouse by comparing coordinates
  // to the bounding rects of marks in the (non-interactive) pre overlay.
  function handleMouseMove(e) {
    if (e.target.closest?.(".err-tip-anchor")) { keepTip(); return; }
    if (!hlRef.current || !mainRef.current) return;
    const marks = hlRef.current.querySelectorAll(".hl-err");
    const container = mainRef.current.getBoundingClientRect();
    let found = null;
    let foundMark = null;
    for (const mark of marks) {
      const r = mark.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        // data-index is set on each mark via renderSegments
        const idx = Number(mark.dataset.idx);
        // Flip above the word when there is no room below, and keep the box
        // inside the editor so it never hangs off the right edge.
        const flip = r.bottom - container.top + 190 > container.height && r.top - container.top > 190;
        found = {
          index: idx,
          top: (flip ? r.top : r.bottom) - container.top,
          left: Math.max(0, Math.min(r.left - container.left, container.width - 340)),
          above: flip,
        };
        foundMark = mark;
        break;
      }
    }
    if (found) {
      showErrorTip(foundMark, found.index);
    } else {
      scheduleHideTip();
    }
  }

  function handleClick(e) {
    if (!hlRef.current) return;
    const marks = hlRef.current.querySelectorAll(".hl-err");
    for (const mark of marks) {
      const r = mark.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        onHoverError?.(Number(mark.dataset.idx));
        return;
      }
    }
  }

  const hoveredCorr = hoveredError != null ? corrections[hoveredError.index] : null;

  const missing = task.minWords - words;
  const missing1 = missing === 1;
  const lengthLabel = enough
    ? <><IconCheck /> Länge erfüllt</>
    : <><IconWarning /> {missing} {missing1 ? "Wort" : "Wörter"} fehlen</>;

  return (
    <>
      <div className="ide-code">
        <div className="ide-gutter mono" ref={gutterRef} aria-hidden="true">
          {numbers.map((n) => (
            <span key={n} style={lineHeights[n - 1] ? { height: lineHeights[n - 1] } : undefined}>{n}</span>
          ))}
        </div>
        <div className="ide-code-main" ref={mainRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={scheduleHideTip}
          onClick={handleClick}
        >
          <pre className="ide-highlight" ref={hlRef} aria-hidden="false">
            {lines.map((segs, i) => (
              <div className="hl-line" key={i}>
                {segs.length ? renderSegments(
                  segs,
                  (event, index) => showErrorTip(event.currentTarget, index),
                  scheduleHideTip
                ) : "​"}
              </div>
            ))}
          </pre>
          <textarea
            ref={taRef}
            className="ide-input"
            value={value}
            onChange={handleInput}
            onScroll={syncScroll}
            onKeyUp={updateCaret}
            onKeyDown={handleKeyDown}
            onClick={() => { updateCaret(); closeSuggest(); }}
            onSelect={updateCaret}
            onDoubleClick={handleDoubleClick}
            onBlur={() => window.setTimeout(closeSuggest, 120)}
            placeholder="// Schreib deinen Text hier … bekannte Wörter werden wie Schlüsselwörter eingefärbt."
            spellCheck="false"
            aria-label="Dein Text"
          />
          {suggest && (
            <ul className="ac-menu" style={{ top: suggest.top, left: suggest.left }} role="listbox">
              {suggest.items.map((it, i) => (
                <li key={it}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === suggest.active}
                    className={"ac-item" + (i === suggest.active ? " is-active" : "")}
                    onMouseDown={(e) => { e.preventDefault(); acceptSuggestion(it); }}
                    onMouseEnter={() => setSuggest((s) => (s ? { ...s, active: i } : s))}
                  >
                    {it}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {hoveredError != null && hoveredCorr && (
            <div
              className={"err-tip-anchor" + (hoveredError.above ? " is-above" : "")}
              style={{ top: hoveredError.top, left: hoveredError.left }}
              onMouseEnter={keepTip}
              onMouseMove={keepTip}
              onMouseLeave={scheduleHideTip}
            >
              <ErrorTooltip
                correction={hoveredCorr}
                accepted={acceptedSet?.has(hoveredError.index)}
                onAccept={() => { onAcceptCorrection?.(hoveredError.index); hideTip(); }}
                onRevert={() => { onRevertCorrection?.(hoveredError.index); }}
                onMouseEnter={keepTip}
                onMouseLeave={scheduleHideTip}
              />
            </div>
          )}
        </div>
      </div>
      <div className="ide-statusbar mono">
        <span className="ide-run"><IconRun /> deutsch:{task.level}</span>
        <span>Zeile {caret.line}, Spalte {caret.col}</span>
        <span className="ide-spacer" />
        <span className={enough ? "ide-ok" : "ide-warn"}>{lengthLabel}</span>
        <span>{words} Wörter · UTF-8</span>
      </div>
    </>
  );
}

/**
 * Group the flat segment list into one array per logical line. Each line is
 * rendered as its own block so the gutter can be measured against the real,
 * wrapped height of that line — and so a correction spanning a line break
 * still gets a mark on both halves.
 */
function segmentsToLines(segs) {
  const lines = [[]];
  const put = (seg) => lines[lines.length - 1].push(seg);
  const breakLine = () => lines.push([]);

  for (const s of segs) {
    if (!s.error) {
      s.text.split("\n").forEach((part, i) => {
        if (i > 0) breakLine();
        if (part) put({ ...s, text: part });
      });
      continue;
    }
    let chunk = [];
    const flush = () => { if (chunk.length) put({ ...s, children: chunk }); chunk = []; };
    for (const c of s.children) {
      c.text.split("\n").forEach((part, i) => {
        if (i > 0) { flush(); breakLine(); }
        if (part) chunk.push({ ...c, text: part });
      });
    }
    flush();
  }
  return lines;
}

function renderSegments(segs, onErrorEnter, onErrorLeave) {
  return segs.map((s, i) => {
    if (s.error) {
      return (
        <mark
          key={i}
          className={"hl-err sev-" + s.severity + (s.active ? " is-active" : "")}
          data-idx={s.index}
          onPointerEnter={(event) => onErrorEnter?.(event, s.index)}
          onPointerLeave={onErrorLeave}
        >
          {s.children.map((c, j) =>
            c.cls ? <span key={j} className={c.cls}>{c.text}</span> : <React.Fragment key={j}>{c.text}</React.Fragment>
          )}
        </mark>
      );
    }
    return s.cls ? <span key={i} className={s.cls}>{s.text}</span> : <React.Fragment key={i}>{s.text}</React.Fragment>;
  });
}

// ---------------------------------------------------------------------------
//  Manual mode (no API key)
// ---------------------------------------------------------------------------

function ManualBox({ promptText, paste, setPaste, onAccept }) {
  return (
    <div className="ide-manual">
      <div style={{ display: "flex", gap: ".5em", alignItems: "center", flexWrap: "wrap" }}>
        <span className="eyebrow">1 · Prompt in claude.ai einfügen</span>
        <CopyButton text={promptText} />
      </div>
      <textarea className="copybox" readOnly value={promptText} onFocus={(e) => e.target.select()} />
      <span className="eyebrow">2 · Claudes JSON-Antwort hier einfügen</span>
      <textarea
        className="copybox"
        placeholder='{"cefr_estimate": "B2", "corrections": [ ... ]}'
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
      />
      <div>
        <button className="btn" type="button" onClick={onAccept} disabled={!paste.trim()}>
          Korrektur übernehmen
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Results — tabbed
// ---------------------------------------------------------------------------

function Results({ fb, tab, targetLevel, activeError, acceptedSet, onJumpError, onAcceptCorrection, onRevertCorrection }) {
  if (tab === "overview") return <TabOverview fb={fb} />;
  if (tab === "errors") return <TabErrors fb={fb} activeError={activeError} acceptedSet={acceptedSet} onJumpError={onJumpError} onAcceptCorrection={onAcceptCorrection} onRevertCorrection={onRevertCorrection} />;
  if (tab === "patterns") return <TabPatterns fb={fb} targetLevel={targetLevel} />;
  if (tab === "target") return <TabTarget fb={fb} />;
  if (tab === "practice") return <TabPractice fb={fb} />;
  return null;
}

function Svg({ markup, className }) {
  // Charts are generated from numbers + escaped labels in charts.js.
  return <div className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}

function ReportCharts({ fb }) {
  const stats = React.useMemo(() => computeWritingStats(fb), [fb]);
  if (!stats.totalErrors && !stats.patterns.length) return null;
  return (
    <div className="report-charts">
      {stats.totalErrors > 0 && (
        <figure className="report-chart">
          <figcaption className="eyebrow">Fehler nach Schwere</figcaption>
          <Svg className="report-svg" markup={donutSvg({ segments: stats.severity, centerTop: String(stats.totalErrors), centerSub: "Fehler" })} />
          <div className="report-legend">
            {stats.severity.map((s) => (
              <span key={s.key}><i style={{ background: s.color }} />{s.label} · {s.count}</span>
            ))}
          </div>
        </figure>
      )}
      {stats.types.length > 0 && (
        <figure className="report-chart">
          <figcaption className="eyebrow">Fehlerarten</figcaption>
          <Svg className="report-svg" markup={barsSvg({ items: stats.types.slice(0, 6), width: 320 })} />
        </figure>
      )}
      {stats.patterns.length > 0 && (
        <figure className="report-chart">
          <figcaption className="eyebrow">Fehlermuster</figcaption>
          <Svg className="report-svg" markup={barsSvg({ items: stats.patterns.slice(0, 5).map((p) => ({ ...p, color: PALETTE.akk })), width: 320 })} />
        </figure>
      )}
    </div>
  );
}

function TabOverview({ fb }) {
  return (
    <div className="ide-tabpane">
      <div className="stats">
        <div className="stat">
          <span className="eyebrow">Niveau des Textes</span>
          <div className="v">{fb.cefr_estimate}</div>
        </div>
        <div className="stat">
          <span className="eyebrow">Bewertet auf</span>
          <div className="v">{fb.target_level || "—"}</div>
        </div>
        <div className="stat">
          <span className="eyebrow">Wörter</span>
          <div className="v">{fb.word_count}</div>
        </div>
        <div className="stat">
          <span className="eyebrow">Aufgabe erfüllt</span>
          <div className="v" style={{ color: fb.task_met ? "var(--ok)" : "var(--no)" }}>
            {fb.task_met ? "ja" : "nein"}
          </div>
        </div>
      </div>
      {fb.cefr_reasoning && <p className="muted" style={{ marginTop: "var(--s3)" }}>{fb.cefr_reasoning}</p>}

      <ReportCharts fb={fb} />

      {fb.scores?.length > 0 && (
        <div style={{ marginTop: "var(--s4)", display: "grid", gap: "var(--s3)" }}>
          {fb.scores.map((s) => (
            <div className="score-row" key={s.criterion}>
              <span className="name" style={{ fontFamily: "var(--f-display)", fontSize: ".9rem" }}>
                {CRIT[s.criterion]?.name || s.criterion}
              </span>
              <span className="val mono tnum" style={{ fontSize: ".8rem", color: "var(--ink-3)" }}>{s.score}/5</span>
              <span className="score-bar"><i style={{ width: (s.score / 5) * 100 + "%" }} /></span>
              <span className="corr-why" style={{ gridColumn: "1 / -1", marginTop: 0 }}>{s.comment}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid g2" style={{ marginTop: "var(--s4)" }}>
        {fb.strengths?.length > 0 && (
          <div>
            <span className="eyebrow">Das sitzt schon</span>
            <ul className="pit" style={{ marginTop: "var(--s2)" }}>
              {fb.strengths.map((s, i) => <li key={i} style={{ borderLeftColor: "var(--ok)" }}>{s}</li>)}
            </ul>
          </div>
        )}
        {fb.next_steps?.length > 0 && (
          <div>
            <span className="eyebrow">Nächste Schritte</span>
            <ul className="pit" style={{ marginTop: "var(--s2)" }}>
              {fb.next_steps.map((s, i) => <li key={i} style={{ borderLeftColor: "var(--nom)" }}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function TabErrors({ fb, activeError, acceptedSet, onJumpError, onAcceptCorrection, onRevertCorrection }) {
  const bySeverity = { hoch: 0, mittel: 1, niedrig: 2 };
  const list = (fb.corrections || [])
    .map((c, i) => ({ ...c, _i: i }))
    .sort((a, b) => (bySeverity[a.severity] ?? 3) - (bySeverity[b.severity] ?? 3));

  if (!list.length) return <div className="ide-tabpane"><p className="muted">Keine Einzelfehler markiert.</p></div>;
  const remaining = list.filter((c) => !acceptedSet?.has(c._i)).length;

  return (
    <div className="ide-tabpane">
      <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)", marginBottom: "var(--s2)" }}>
        <p className="q-hint" style={{ margin: 0, flex: 1 }}>Hover / click a mistake to highlight it. <IconCheck /> to apply the fix.</p>
        {remaining > 0 && (
          <button className="btn btn-sm" type="button"
            onClick={() => list.forEach((c) => !acceptedSet?.has(c._i) && onAcceptCorrection(c._i))}>
            <IconCheck /> Alle übernehmen
          </button>
        )}
      </div>
      <div className="corr">
        {list.map((c) => {
          const accepted = acceptedSet?.has(c._i);
          return (
            <div
              key={c._i}
              className={"corr-item " + (c.severity || "mittel") + (activeError === c._i ? " is-active" : "") + (accepted ? " is-accepted" : "")}
            >
              <div className="corr-head">
                <button type="button" className="corr-jump" onClick={() => onJumpError(c._i)} title="Im Text markieren">
                  <span className="corr-type">{c.type}</span>
                  <span className="dim mono" style={{ fontSize: ".68rem" }}>{c.severity}</span>
                </button>
                {!accepted ? (
                  <button className="btn btn-sm corr-accept-btn" type="button" onClick={() => onAcceptCorrection(c._i)} title="Übernehmen"><IconCheck /></button>
                ) : (
                  <button className="btn btn-sm corr-accept-btn" type="button" onClick={() => onRevertCorrection?.(c._i)} title="Rückgängig"><IconUndo /></button>
                )}
              </div>
              <div className="corr-body">
                <span className="strike">{c.original}</span>
                <span className="fixed">{c.corrected}</span>
              </div>
              <p className="corr-why">{c.why}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabPatterns({ fb, targetLevel }) {
  const [promptKey, setPromptKey] = React.useState(null);
  const patterns = fb.error_patterns || [];
  const plan = fb.study_plan || [];

  return (
    <div className="ide-tabpane">
      {patterns.length > 0 ? (
        <>
          <span className="eyebrow">Fehlermuster ({patterns.length})</span>
          <p className="muted" style={{ fontSize: ".9rem", marginTop: "var(--s1)" }}>
            Die systematischen Schwächen hinter den Einzelfehlern — sortiert nach Häufigkeit.
          </p>
          <div className="corr" style={{ marginTop: "var(--s3)" }}>
            {patterns.map((p, i) => {
              const key = "p" + i;
              const open = promptKey === key;
              const prompt = p.rule
                ? patternExercisePrompt({ rule: p.rule, label: p.label, description: p.pattern, evidence: p.evidence, level: targetLevel })
                : "";
              return (
                <div className={"corr-item " + (i === 0 ? "hoch" : "mittel")} key={key}>
                  <div className="corr-head">
                    <span className="corr-type">{p.label}</span>
                    <span className="dim mono" style={{ fontSize: ".68rem" }}>{p.frequency}×</span>
                  </div>
                  <p className="corr-why">{p.pattern}</p>
                  {p.evidence?.length > 0 && (
                    <ul className="pit" style={{ marginTop: "var(--s2)" }}>
                      {p.evidence.map((e, j) => (
                        <li key={j} style={{ borderLeftColor: "var(--no)", fontFamily: "var(--f-display)" }}>{e}</li>
                      ))}
                    </ul>
                  )}
                  {p.rule && (
                    <div style={{ marginTop: "var(--s2)" }}>
                      <div style={{ display: "flex", gap: ".5em", alignItems: "center", flexWrap: "wrap" }}>
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setPromptKey(open ? null : key)}>
                          {open ? "Prompt schließen" : "Übungs-Prompt für Claude"}
                        </button>
                        {open && <CopyButton text={prompt} />}
                      </div>
                      {open && (
                        <textarea className="copybox" readOnly value={prompt} onFocus={(e) => e.target.select()} style={{ marginTop: "var(--s2)" }} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="muted">Keine systematischen Muster erkannt.</p>
      )}

      {plan.length > 0 && (
        <div style={{ marginTop: "var(--s4)" }}>
          <span className="eyebrow">Dein Lernweg</span>
          <ol className="study-plan" style={{ marginTop: "var(--s2)" }}>
            {plan.map((s, i) => {
              const key = "s" + i;
              const open = promptKey === key;
              const prompt = s.rule
                ? patternExercisePrompt({ rule: s.rule, label: s.focus, description: s.action, level: targetLevel })
                : "";
              return (
                <li key={key} className="study-step">
                  <div className="study-step-head">
                    <span className="study-step-n mono">{i + 1}</span>
                    <span style={{ fontFamily: "var(--f-display)", fontSize: ".95rem" }}>{s.focus}</span>
                    {s.rule && (
                      <button className="btn btn-ghost btn-sm" type="button" onClick={() => setPromptKey(open ? null : key)}>
                        {open ? "Prompt schließen" : "Übungs-Prompt"}
                      </button>
                    )}
                  </div>
                  <p className="corr-why" style={{ marginTop: 0 }}>{s.action}</p>
                  {open && (
                    <div style={{ marginTop: "var(--s2)" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <CopyButton text={prompt} />
                      </div>
                      <textarea className="copybox" readOnly value={prompt} onFocus={(e) => e.target.select()} style={{ marginTop: "var(--s2)" }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

function TabTarget({ fb }) {
  return (
    <div className="ide-tabpane">
      {fb.upgrades?.length > 0 && (
        <>
          <span className="eyebrow">Korrekt, aber unter Niveau</span>
          <div className="corr" style={{ marginTop: "var(--s2)" }}>
            {fb.upgrades.map((u, i) => (
              <div className="corr-item niedrig" key={i} style={{ borderLeftColor: "var(--dat)" }}>
                <div className="corr-body">
                  <span className="dim">{u.original}</span>
                  <span style={{ color: "var(--dat)" }}>{u.upgraded}</span>
                </div>
                <p className="corr-why">{u.why}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {fb.improved_version && (
        <div style={{ marginTop: "var(--s4)" }}>
          <div style={{ display: "flex", gap: ".5em", alignItems: "center" }}>
            <span className="eyebrow">Auf Zielniveau umgeschrieben</span>
            <CopyButton text={fb.improved_version} />
          </div>
          <div className="prose" style={{ whiteSpace: "pre-wrap", marginTop: "var(--s2)" }}>{fb.improved_version}</div>
        </div>
      )}
      {!fb.upgrades?.length && !fb.improved_version && <p className="muted">Keine Umformulierungen vorhanden.</p>}
    </div>
  );
}

function TabPractice({ fb }) {
  return (
    <div className="ide-tabpane">
      {fb.exercises?.length > 0 ? (
        <PracticeDeck items={fb.exercises} />
      ) : (
        <p className="muted">Keine Übungen erzeugt.</p>
      )}
      {fb.exercise_prompt && (
        <div style={{ marginTop: "var(--s4)" }}>
          <div style={{ display: "flex", gap: ".5em", alignItems: "center", flexWrap: "wrap" }}>
            <span className="eyebrow">Mehr Übungen erzeugen</span>
            <CopyButton text={fb.exercise_prompt} />
          </div>
          <p className="muted" style={{ fontSize: ".9rem", marginTop: "var(--s1)" }}>
            Auf deine Fehlermuster zugeschnitten — nutze ihn im Drill oder in claude.ai.
          </p>
          <textarea className="copybox" readOnly value={fb.exercise_prompt} onFocus={(e) => e.target.select()} style={{ marginTop: "var(--s2)" }} />
        </div>
      )}
    </div>
  );
}

function PracticeDeck({ items }) {
  const deck = React.useMemo(
    () => items.filter((q) => q?.prompt && q?.answer && Array.isArray(q.options) && q.options.length),
    [items]
  );
  const [i, setI] = React.useState(0);
  const [given, setGiven] = React.useState(null);
  const [done, setDone] = React.useState(0);

  if (!deck.length) return null;
  const q = deck[Math.min(i, deck.length - 1)];
  const answered = given !== null;
  const correct = answered && given === q.answer;
  const last = i >= deck.length - 1;
  const opts = q.options.includes(q.answer) ? q.options : [q.answer, ...q.options].slice(0, 4);

  function pick(o) {
    if (answered) return;
    setGiven(o);
    if (o === q.answer) setDone((n) => n + 1);
  }
  function next() {
    setGiven(null);
    setI((n) => Math.min(n + 1, deck.length - 1));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eyebrow">Direkt üben</span>
        <span className="dim mono" style={{ fontSize: ".74rem" }}>{i + 1} / {deck.length} · {done} richtig</span>
      </div>
      <span className="q-kind" style={{ marginTop: "var(--s3)" }}>{q.kind}</span>
      <div className="q-prompt">
        <LevelTag level={q.level} /> <Prompt text={q.prompt} />
      </div>
      <div className="opts">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            className={
              "opt" +
              (opts.some((x) => String(x).length > 22) ? " long" : "") +
              (answered && o === q.answer ? " is-ok" : "") +
              (answered && o === given && !correct ? " is-no" : "")
            }
            disabled={answered}
            onClick={() => pick(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {answered && (
        <div className={"verdict " + (correct ? "v-ok" : "v-no")}>
          <div className="verdict-line">
            {correct ? (
              <><span className="mark"><IconCheckCircle /> richtig</span><span>{q.answer}</span></>
            ) : (
              <><span className="mark"><IconCancel /></span><span>Du: <b>{given}</b> · Richtig: <b>{q.answer}</b></span></>
            )}
          </div>
          <p className="corr-why">{q.why}</p>
          <div className="actions">
            {!last ? (
              <button className="btn" type="button" onClick={next}>Weiter</button>
            ) : (
              <span className="q-hint" style={{ margin: 0 }}>Alle {deck.length} Aufgaben durch — {done} richtig.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
