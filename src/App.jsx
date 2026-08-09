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
import Dashboard from "./components/Dashboard.jsx";
import Learn from "./components/Learn.jsx";
import Drill from "./components/Drill.jsx";
import Exam from "./components/Exam.jsx";
import Write from "./components/Write.jsx";
import Spec from "./components/Spec.jsx";
import Settings from "./components/Settings.jsx";
import TeacherChat from "./components/TeacherChat.jsx";
import Dictionary from "./components/Dictionary.jsx";
import { IconBook, IconClose, IconGitHub, IconTeacher } from "./components/icons.jsx";
import Rulebook from "./components/Rulebook.jsx";
import {
  loadProgress, saveProgress, resetProgress, recordAnswer,
  loadApiKey, saveApiKey, saveChatSession,
} from "./lib/storage.js";
import { MODEL } from "./lib/claude.js";

const VIEWS = [
  { id: "home", num: "§0", label: "Übersicht" },
  { id: "learn", num: "§1", label: "Regeln" },
  { id: "rulebook", num: "§2", label: "Regelwerk" },
  { id: "drill", num: "§3", label: "Drill" },
  { id: "exam", num: "§4", label: "Einstufung" },
  { id: "write", num: "§5", label: "Schreiben" },
  { id: "spec", num: "§6", label: "Spezifikation" },
  { id: "settings", num: "§7", label: "Einstellungen" },
];

function readRoute() {
  const [rawView, ...rawSection] = window.location.hash.replace(/^#/, "").split("/");
  const view = VIEWS.some((item) => item.id === rawView) ? rawView : "home";
  let section = null;
  if (rawSection.length) {
    try { section = decodeURIComponent(rawSection.join("/")); }
    catch { section = rawSection.join("/"); }
  }
  return { view, section };
}

export default function App() {
  const [progress, setProgress] = React.useState(loadProgress);
  const [apiKey, setApiKey] = React.useState(loadApiKey);
  const [route, setRoute] = React.useState(readRoute);
  const [drillTopic, setDrillTopic] = React.useState(null);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [teacherDraft, setTeacherDraft] = React.useState(null);
  const [writeContext, setWriteContext] = React.useState({ text: "", task: null });
  const [dictOpen, setDictOpen] = React.useState(false);
  const [dictQuery, setDictQuery] = React.useState("");
  const [dictTrigger, setDictTrigger] = React.useState(0);
  const navRef = React.useRef(null);
  const { view, section: routeSection } = route;

  const openDict = React.useCallback((word) => {
    if (word) {
      setDictQuery(word);
      setDictTrigger((n) => n + 1);
    }
    setDictOpen(true);
  }, []);

  const askTeacher = React.useCallback((text) => {
    setTeacherDraft({ id: Date.now(), text });
    setChatOpen(true);
  }, []);

  React.useEffect(() => { saveProgress(progress); }, [progress]);

  const onAnswer = React.useCallback((ruleId, correct) => {
    setProgress((p) => recordAnswer(p, ruleId, correct));
  }, []);

  const onRead = React.useCallback((moduleId) => {
    setProgress((p) => (p.read?.[moduleId] ? p : { ...p, read: { ...p.read, [moduleId]: true } }));
  }, []);

  const onFinishExam = React.useCallback((est) => {
    setProgress((p) => ({ ...p, exams: [...p.exams, est].slice(-30) }));
  }, []);

  const onSaveWriting = React.useCallback((w) => {
    setProgress((p) => ({ ...p, writings: [...p.writings, w].slice(-40) }));
  }, []);

  const onSaveChatSession = React.useCallback((session) => {
    setProgress((p) => saveChatSession(p, session));
  }, []);

  const onSettings = React.useCallback((patch) => {
    setProgress((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  }, []);

  const onApiKey = React.useCallback((k) => { saveApiKey(k); setApiKey(k); }, []);

  const goto = React.useCallback((v, section = null) => {
    const suffix = section ? `/${encodeURIComponent(section)}` : "";
    const nextHash = `#${v}${suffix}`;
    if (window.location.hash !== nextHash) window.history.pushState(null, "", nextHash);
    setRoute({ view: v, section });
  }, []);

  React.useEffect(() => {
    const syncRoute = () => setRoute(readRoute());
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = routeSection && document.getElementById(`doc-${routeSection}`);
      if (target) target.scrollIntoView({ block: "start" });
      else window.scrollTo?.(0, 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view, routeSection]);

  React.useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [view]);

  const drillOn = React.useCallback((ruleId) => {
    setDrillTopic(ruleId);
    goto("drill");
  }, [goto]);

  const lastExam = progress.exams?.[progress.exams.length - 1] || null;
  const targetLevel = lastExam?.reached
    ? ({ A2: "B1", B1: "B2", B2: "C1", C1: "C1" }[lastExam.reached])
    : "C1";
  const mode = progress.settings.mode || "api";
  const model = progress.settings.model || MODEL;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand">
            <b>Deutsch</b> A2 → C1
            <small>Sprachspezifikation</small>
          </div>
          <nav ref={navRef} className="nav" aria-label="Bereiche">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-current={view === v.id}
                onClick={() => goto(v.id)}
              >
                <span className="num">{v.num}</span>{v.label}
              </button>
            ))}
          </nav>
          <div className="topbar-right">
            <a
              className="topbar-icon"
              href="https://github.com/matbmoser/learn-german-programming"
              target="_blank"
              rel="noopener noreferrer"
              title="Auf GitHub ansehen"
              aria-label="Auf GitHub ansehen"
            >
              <IconGitHub />
            </a>
            <button
              className={"topbar-icon" + (dictOpen ? " is-on" : "")}
              type="button"
              title="Wörterbuch"
              aria-label="Wörterbuch"
              aria-pressed={dictOpen}
              onClick={() => setDictOpen((v) => !v)}
            >
              <IconBook />
            </button>
            <span className="level-chip" title="Letzte Einstufung">
              {lastExam ? lastExam.level : "kein Test"}
            </span>
          </div>
        </div>
      </header>

      <main className={view === "write" ? "main-full" : ""}>
        {view === "write" ? (
          <Write
            progress={progress}
            apiKey={apiKey}
            model={model}
            mode={mode}
            targetLevel={targetLevel}
            settings={progress.settings}
            onSettings={onSettings}
            onSaveWriting={onSaveWriting}
            onWriteContext={setWriteContext}
            onLookupWord={openDict}
            onAskTeacher={askTeacher}
          />
        ) : (
          <div className="shell">
            {view === "home" && (
              <Dashboard progress={progress} onGo={goto} onDrillTopic={drillOn} />
            )}
            {view === "learn" && (
              <Learn
                progress={progress}
                onRead={onRead}
                onDrillTopic={drillOn}
                section={routeSection}
                onSectionChange={(id) => goto("learn", id)}
              />
            )}
            {view === "rulebook" && (
              <Rulebook
                section={routeSection}
                onSectionChange={(id) => goto("rulebook", id)}
              />
            )}
            {view === "drill" && (
              <Drill
                key={drillTopic || "all"}
                progress={progress}
                onAnswer={onAnswer}
                apiKey={apiKey}
                model={model}
                mode={mode}
                initialTopic={drillTopic}
              />
            )}
            {view === "exam" && (
              <Exam progress={progress} onAnswer={onAnswer} onFinish={onFinishExam} />
            )}
            {view === "spec" && <Spec />}
            {view === "settings" && (
              <Settings
                progress={progress}
                apiKey={apiKey}
                onApiKey={onApiKey}
                onSettings={onSettings}
                onReset={() => setProgress(resetProgress())}
                onImport={(p) => setProgress(p)}
              />
            )}
          </div>
        )}
      </main>

      <footer className="foot">
        <div className="shell" style={{ display: "flex", flexWrap: "wrap", gap: "var(--s3)", justifyContent: "space-between", width: "100%" }}>
          <span>Deutsch A2 → C1 · Grammatik als Typsystem</span>
          <span className="mono">Fortschritt bleibt lokal in diesem Browser.</span>
        </div>
      </footer>

      {/* ================================================= global teacher FAB === */}
      <button
        className={"tc-fab" + (chatOpen ? " is-open" : "")}
        type="button"
        title="Frau Müller — German teacher"
        onClick={() => setChatOpen((v) => !v)}
        aria-label="Open teacher chat"
      >
        {chatOpen ? <IconClose /> : <IconTeacher />}
      </button>

      <ChatDrawer open={chatOpen}>
        <TeacherChat
          apiKey={apiKey}
          model={model}
          mode={mode}
          currentText={writeContext.text}
          task={writeContext.task}
          targetLevel={targetLevel}
          sessions={progress.chatSessions || []}
          draftRequest={teacherDraft}
          onSaveSession={onSaveChatSession}
          onClose={() => setChatOpen(false)}
        />
      </ChatDrawer>

      <Dictionary
        open={dictOpen}
        onClose={() => setDictOpen(false)}
        query={dictQuery}
        setQuery={setDictQuery}
        trigger={dictTrigger}
      />
    </div>
  );
}

/* ------------------------------------------------ resizable chat drawer --- */

const CHAT_W_KEY = "dc.chatWidth";
const CHAT_W_MIN = 340;
const CHAT_W_MAX = 820;
const CHAT_W_DEF = 480;

function ChatDrawer({ open, children }) {
  const [width, setWidth] = React.useState(() => {
    const n = Number(localStorage.getItem(CHAT_W_KEY));
    return n >= CHAT_W_MIN && n <= CHAT_W_MAX ? n : CHAT_W_DEF;
  });
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--chat-w", width + "px");
  }, [width]);

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e) =>
      setWidth(Math.min(CHAT_W_MAX, Math.max(CHAT_W_MIN, window.innerWidth - e.clientX)));
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      localStorage.setItem(CHAT_W_KEY, String(width));
    };
  }, [dragging, width]);

  return (
    <div
      className={"tc-drawer" + (open ? " is-open" : "") + (dragging ? " is-dragging" : "")}
      style={{ width }}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className="tc-resize"
        role="separator"
        aria-orientation="vertical"
        aria-label="Breite ändern"
        title="Ziehen, um die Breite zu ändern"
        onPointerDown={(e) => { e.preventDefault(); setDragging(true); }}
        onDoubleClick={() => setWidth(CHAT_W_DEF)}
      />
      {children}
    </div>
  );
}
