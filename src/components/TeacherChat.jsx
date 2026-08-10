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
import { chatWithTeacher } from "../lib/claude.js";
import { AGENT } from "../lib/teacherAgent.js";
import { buildTeacherExerciseResult } from "../lib/teacherExerciseResults.js";
import { Spinner } from "./ui.jsx";
import TeacherExercise from "./TeacherExercise.jsx";
import TeacherCorrection from "./TeacherCorrection.jsx";
import {
  IconArrowDown, IconArrowUp, IconClose, IconFullscreen, IconFullscreenExit,
  IconHistory, IconInfo, IconTeacher,
} from "./icons.jsx";

const GREETING = "Hallo! Ich bin Frau Müller. Ask me anything — grammar, vocabulary, how to say something — or paste your text and I will give you feedback. I can also make an interactive exercise just for you!";

function sessionTitle(messages) {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New session";
  return first.content.slice(0, 52) + (first.content.length > 52 ? "…" : "");
}

function fmtTokens(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

export default function TeacherChat({ apiKey, model, mode, currentText, task, viewContext, targetLevel, sessions = [], draftRequest, onSaveSession, onClose }) {
  const sessionId        = React.useRef("cs_" + Date.now());
  const sessionStartedAt = React.useRef(Date.now());

  const [messages,   setMessages]   = React.useState([{ role: "assistant", content: GREETING }]);
  const [input,      setInput]      = React.useState("");
  const [busy,       setBusy]       = React.useState(false);
  const [error,      setError]      = React.useState("");
  const [fullscreen, setFullscreen] = React.useState(false);
  const [panel,      setPanel]      = React.useState("chat");
  const [tokens,     setTokens]     = React.useState({ in: 0, out: 0 });

  const bottomRef = React.useRef(null);
  const inputRef  = React.useRef(null);
  const handledDraftRef = React.useRef(null);

  React.useEffect(() => {
    if (!draftRequest?.text || handledDraftRef.current === draftRequest.id) return;
    handledDraftRef.current = draftRequest.id;
    setPanel("chat");
    if (draftRequest.autoSend) {
      send(draftRequest.text);
    } else {
      setInput(draftRequest.text);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [draftRequest]);

  React.useEffect(() => {
    if (!messages.some((m) => m.role === "user") || !onSaveSession) return;
    onSaveSession({
      id: sessionId.current,
      startedAt: sessionStartedAt.current,
      title: sessionTitle(messages),
      task: task?.title || null,
      targetLevel,
      messages,
      tokens,
    });
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (messages.length <= 1 && !busy) return; // the drawer stays mounted while closed
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(userMessage, baseMessages = messages, metadata = {}) {
    if (!userMessage.trim()) return;
    const userMsg      = { role: "user", content: userMessage.trim(), ...metadata };
    const nextMessages = [...baseMessages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError("");
    setPanel("chat");

    const history = nextMessages.filter((m) => !(m.role === "assistant" && m.content === GREETING));
    try {
      const { reply, exercises = [], corrections = [], usage } = await chatWithTeacher({ apiKey, model, messages: history, currentText, task, viewContext, targetLevel });
      setMessages((prev) => [...prev, { role: "assistant", content: reply, exercises, corrections }]);
      if (usage) setTokens((t) => ({ in: t.in + (usage.input_tokens || 0), out: t.out + (usage.output_tokens || 0) }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function submitExercise(submission, exercise, messageIndex, exerciseIndex) {
    const withSubmitted = messages.map((message, index) => index === messageIndex
      ? { ...message, submittedExercises: [...(message.submittedExercises || []), exerciseIndex] }
      : message);
    const result = buildTeacherExerciseResult(exercise, submission.answers);
    const isOpenExercise = exercise.type === "form" || exercise.type === "writing";
    const teacherText = result
      ? result.correct_items === result.total_items
        ? "Here are the saved answers. Everything matches — wunderbar!"
        : "Here are the saved answers so you can compare them with yours. Ask me whenever you want help with one of them."
      : isOpenExercise
        ? "Your answer is saved. This is an open-ended exercise, so there is no single answer key. Ask me for feedback whenever you want it."
        : "Your answer is saved, but this exercise has no saved answer key. Ask me to review it if you would like feedback.";

    setMessages([
      ...withSubmitted,
      { role: "user", content: submission.text, exerciseSubmission: false },
      { role: "assistant", content: teacherText, corrections: result ? [result] : [], exercises: [] },
    ]);
    setError("");
    setPanel("chat");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  function loadSession(s) {
    sessionId.current        = s.id;
    sessionStartedAt.current = s.startedAt;
    setMessages(s.messages);
    setTokens(s.tokens || { in: 0, out: 0 });
    setPanel("chat");
  }

  function newSession() {
    sessionId.current        = "cs_" + Date.now();
    sessionStartedAt.current = Date.now();
    setMessages([{ role: "assistant", content: GREETING }]);
    setTokens({ in: 0, out: 0 });
    setPanel("chat");
  }

  const hasText  = currentText.trim().length > 0;
  const noKey    = mode === "api" && !apiKey;
  const totalTok = tokens.in + tokens.out;
  const startTime = React.useMemo(
    () => new Date(sessionStartedAt.current).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={"tc-panel" + (fullscreen ? " tc-fullscreen" : "")}>

      <div className="tc-head">
        <div className="tc-avatar-wrap" aria-hidden="true"><IconTeacher /></div>
        <div className="tc-head-info">
          <span className="tc-name">{AGENT.name}</span>
          <span className="tc-meta">
            {targetLevel}
            {totalTok > 0 && <> · <span className="tc-tok">{fmtTokens(totalTok)} tok</span></>}
          </span>
        </div>
        <div className="tc-head-actions">
          <button className={"tc-hbtn" + (panel === "info"    ? " is-sel" : "")} type="button" title="Session info"    onClick={() => setPanel((p) => p === "info"    ? "chat" : "info")}><IconInfo /></button>
          <button className={"tc-hbtn" + (panel === "history" ? " is-sel" : "")} type="button" title="Past sessions"  onClick={() => setPanel((p) => p === "history" ? "chat" : "history")}><IconHistory /></button>
          <button className="tc-hbtn" type="button" title={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={() => setFullscreen((v) => !v)}>{fullscreen ? <IconFullscreenExit /> : <IconFullscreen />}</button>
          <button className="tc-hbtn tc-hbtn-close" type="button" title="Close" onClick={onClose}><IconClose /></button>
        </div>
      </div>

      {panel === "info" && (
        <div className="tc-info">
          <div className="tc-info-grid">
            <span>Model</span>   <span className="mono">{model || "default"}</span>
            <span>Level</span>   <span>Target <strong>{targetLevel}</strong></span>
            {task && <><span>Task</span> <span>{task.title}</span></>}
            <span>Current view</span> <span>{viewContext?.viewLabel || viewContext?.view || "—"}{viewContext?.section ? ` · ${viewContext.section}` : ""}</span>
            <span>Context</span> <span>{hasText ? currentText.trim().split(/\s+/).length + " words" : viewContext?.phase || "—"}</span>
            {viewContext?.correction && <><span>Correction</span><span>{viewContext.correction.corrections?.length || 0} errors · {viewContext.correction.cefrEstimate || "—"}</span></>}
            <span>Started</span> <span>{startTime}</span>
            {totalTok > 0 && (
              <><span>Tokens</span>
              <span><span className="tc-tok-in"><IconArrowUp />{fmtTokens(tokens.in)}</span> · <span className="tc-tok-out"><IconArrowDown />{fmtTokens(tokens.out)}</span></span></>
            )}
          </div>
        </div>
      )}

      {panel === "history" && (
        <div className="tc-history">
          <div className="tc-history-list">
            {sessions.length === 0
              ? <p className="tc-history-empty">No past sessions yet.</p>
              : [...sessions].reverse().map((s) => (
                <button key={s.id} className={"tc-history-item" + (s.id === sessionId.current ? " is-current" : "")} type="button" onClick={() => loadSession(s)}>
                  <span className="tc-history-meta">
                    {new Date(s.startedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    {" · "}{s.messages.filter((m) => m.role === "user").length} msgs
                    {s.tokens ? " · " + fmtTokens((s.tokens.in||0)+(s.tokens.out||0)) + " tok" : ""}
                  </span>
                  <span className="tc-history-title">{s.title}</span>
                </button>
              ))}
          </div>
          <div className="tc-history-foot">
            <button className="btn btn-ghost btn-sm" type="button" onClick={newSession}>+ New session</button>
          </div>
        </div>
      )}

      {panel !== "history" && (
        <div className="tc-messages">
          {messages.map((m, i) => (
            <div key={i} className={"tc-msg " + (m.role === "user" ? "tc-user" : "tc-teacher")}>
              {m.role === "assistant" && <span className="tc-msg-avatar" aria-hidden="true"><IconTeacher /></span>}
              <div className="tc-msg-content">
                <div className="tc-bubble"><MessageText text={m.role === "assistant" ? visibleTeacherText(m) : m.content} /></div>
                {m.role === "assistant" && m.corrections?.map((correction, correctionIndex) => (
                  <TeacherCorrection
                    key={`${correctionIndex}-${correction.id || "correction"}`}
                    correction={correction}
                  />
                ))}
                {m.role === "assistant" && m.exercises?.map((exercise, exerciseIndex) => (
                  <TeacherExercise
                    key={`${exerciseIndex}-${exercise.id || "exercise"}`}
                    exercise={exercise}
                    disabled={busy}
                    wasSubmitted={m.submittedExercises?.includes(exerciseIndex)}
                    onSubmit={(submission) => submitExercise(submission, exercise, i, exerciseIndex)}
                  />
                ))}
              </div>
            </div>
          ))}
          {busy && (
            <div className="tc-msg tc-teacher">
              <span className="tc-msg-avatar" aria-hidden="true"><IconTeacher /></span>
              <div className="tc-bubble tc-typing"><span /><span /><span /></div>
            </div>
          )}
          {error && (
            <div className="tc-msg tc-teacher">
              <span className="tc-msg-avatar" aria-hidden="true"><IconTeacher /></span>
              <div className="tc-bubble tc-error">{error}</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {panel === "chat" && !busy && !noKey && (
        <div className="tc-quick">
          <button className="tc-chip tc-chip-practice" type="button" onClick={() => { setInput("Give me a short interactive exercise about "); inputRef.current?.focus(); }}>Interactive exercise</button>
          {hasText && <>
            <button className="tc-chip" type="button" onClick={() => { setInput("Quick feedback on my text?"); inputRef.current?.focus(); }}>Review text</button>
            <button className="tc-chip" type="button" onClick={() => { setInput("What are my main grammar mistakes?"); inputRef.current?.focus(); }}>Grammar</button>
            <button className="tc-chip" type="button" onClick={() => { setInput("How can I improve my vocabulary?"); inputRef.current?.focus(); }}>Vocabulary</button>
          </>}
        </div>
      )}

      <div className="tc-input-row">
        {noKey
          ? <p className="tc-no-key">Add your API key in <strong>Settings</strong> to chat.</p>
          : <>
              <textarea ref={inputRef} className="tc-input" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey} placeholder="Ask Frau Müller anything…  Enter sends" rows={1} disabled={busy} />
              <button className="tc-send" type="button" onClick={() => send(input)} disabled={busy || !input.trim()} aria-label="Send">
                {busy ? <Spinner /> : <IconArrowUp />}
              </button>
            </>
        }
      </div>
    </div>
  );
}

function MessageText({ text }) {
  const lines = String(text).split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { body.push(lines[i]); i++; }
      out.push(<pre key={out.length} className="tc-md-pre"><code>{body.join("\n")}</code></pre>);
      i++; continue;
    }
    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const head  = splitRow(line);
      const align = splitRow(lines[i + 1]).map(cellAlign);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      out.push(
        <div key={out.length} className="tc-md-table-wrap">
          <table className="tc-md-table">
            <thead><tr>{head.map((c, c_) => <th key={c_} style={{ textAlign: align[c_] }}>{inlineSpans(c)}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, r_) => (
                <tr key={r_}>{head.map((_, c_) => <td key={c_} style={{ textAlign: align[c_] }}>{inlineSpans(r[c_] ?? "")}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (/^[-*_]{3,}$/.test(line.trim())) { out.push(<hr key={out.length} className="tc-md-hr" />); i++; continue; }
    const hm = line.match(/^(#{1,4})\s+(.+)/);
    if (hm) { const Tag = `h${Math.min(hm[1].length + 2, 6)}`; out.push(<Tag key={out.length} className="tc-md-h">{inlineSpans(hm[2])}</Tag>); i++; continue; }
    if (/^[*\-+]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[*\-+]\s/.test(lines[i])) { items.push(<li key={items.length}>{inlineSpans(lines[i].replace(/^[*\-+]\s/, ""))}</li>); i++; }
      out.push(<ul key={out.length} className="tc-md-ul">{items}</ul>); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(<li key={items.length}>{inlineSpans(lines[i].replace(/^\d+\.\s/, ""))}</li>); i++; }
      out.push(<ol key={out.length} className="tc-md-ol">{items}</ol>); continue;
    }
    if (line.startsWith("> ")) {
      const qlines = [];
      while (i < lines.length && lines[i].startsWith("> ")) { qlines.push(lines[i].slice(2)); i++; }
      out.push(<blockquote key={out.length} className="tc-md-bq">{inlineSpans(qlines.join(" "))}</blockquote>); continue;
    }
    if (line.trim() === "") { i++; continue; }
    out.push(<p key={out.length} className="tc-md-p">{inlineSpans(line)}</p>);
    i++;
  }
  return <>{out}</>;
}

function withoutInternalContext(text) {
  return String(text || "")
    .replace(/\n*\[(?:Exercises shown to the student|Correction results shown to the student)\][\s\S]*$/i, "")
    .trim();
}

function visibleTeacherText(message) {
  const text = withoutInternalContext(message.content);
  if (text) return text;
  if (message.corrections?.length && message.exercises?.length) {
    return "Let’s look at your results. I also made a short follow-up exercise for you below.";
  }
  if (message.corrections?.length) return "Let’s look at your results.";
  if (message.exercises?.length) return "Here is a little exercise for you.";
  return "I’m here whenever you’re ready.";
}

function isTableRow(line) {
  return line.trim().includes("|") && /^\s*\|?.*\|.*$/.test(line.trim());
}

function isTableDivider(line) {
  return line.includes("|") && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
}

function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function cellAlign(sep) {
  const l = sep.startsWith(":"), r = sep.endsWith(":");
  return l && r ? "center" : r ? "right" : "left";
}

function inlineSpans(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*")  && p.endsWith("*"))  return <em key={i}>{p.slice(1, -1)}</em>;
    if (p.startsWith("`")  && p.endsWith("`"))  return <code key={i}>{p.slice(1, -1)}</code>;
    const lm = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noopener noreferrer">{lm[1]}</a>;
    return p;
  });
}
