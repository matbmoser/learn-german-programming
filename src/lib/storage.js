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

// ============================================================================
//  STORAGE — progress lives in localStorage. The API key is stored under its
//  own key and is NEVER part of an export, so a shared progress file is safe.
// ============================================================================

import { RULE_IDS } from "../engine/drills.js";
import { emptyLearningPath, normalizeLearningPath } from "./learningPath.js";

const PROGRESS_KEY = "dc1:progress";
const API_KEY = "dc1:apikey";
const WELCOME_TUTORIAL_KEY = "dc1:welcome-tutorial:v1";
const SCHEMA_VERSION = 2;

export function hasSeenWelcomeTutorial() {
  try { return localStorage.getItem(WELCOME_TUTORIAL_KEY) === "seen"; }
  catch { return false; }
}

export function markWelcomeTutorialSeen() {
  try { localStorage.setItem(WELCOME_TUTORIAL_KEY, "seen"); }
  catch { /* private mode / blocked storage — keep the current session working */ }
}

export function emptyProgress() {
  return {
    v: SCHEMA_VERSION,
    createdAt: Date.now(),
    mastery: Object.fromEntries(RULE_IDS.map((id) => [id, { r: 0, t: 0 }])),
    totals: { answered: 0, correct: 0, streak: 0, best: 0 },
    days: {},           // "YYYY-MM-DD" -> answered count
    exams: [],          // estimate objects, newest last
    writings: [],       // { id, taskId, level, title, text, words, at, feedback }
    challenges: [],     // Claude-generated question sets
    chatSessions: [],   // { id, startedAt, title, task, targetLevel, messages }
    read: {},           // moduleId -> true
    learningPath: emptyLearningPath(),
    settings: {
      model: "claude-sonnet-5",
      mode: "api",
      focusLevel: "auto",
      suggestions: true,
      experienceMode: "learning",
    },
  };
}

function migrate(p) {
  const base = emptyProgress();
  const merged = { ...base, ...p };
  merged.mastery = { ...base.mastery, ...(p.mastery || {}) };
  merged.totals = { ...base.totals, ...(p.totals || {}) };
  merged.settings = { ...base.settings, ...(p.settings || {}) };
  if (merged.settings.model === "claude-opus-5") merged.settings.model = base.settings.model;
  merged.days = p.days || {};
  merged.exams = p.exams || [];
  merged.writings = p.writings || [];
  merged.challenges = p.challenges || [];
  merged.chatSessions = p.chatSessions || [];
  merged.read = p.read || {};
  merged.learningPath = normalizeLearningPath(p.learningPath);
  merged.v = SCHEMA_VERSION;
  return merged;
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    return true;
  } catch {
    return false; // private mode / quota — the app keeps working in memory
  }
}

export function resetProgress() {
  try { localStorage.removeItem(PROGRESS_KEY); } catch { /* ignore */ }
  return emptyProgress();
}

// --- API key (kept apart from progress on purpose) --------------------------

export function loadApiKey() {
  try { return localStorage.getItem(API_KEY) || ""; } catch { return ""; }
}
export function saveApiKey(k) {
  try { k ? localStorage.setItem(API_KEY, k) : localStorage.removeItem(API_KEY); } catch { /* ignore */ }
}
export function clearApiKey() { saveApiKey(""); }

// --- export / import --------------------------------------------------------

export function exportProgress(p) {
  const { ...clean } = p;
  return JSON.stringify({ ...clean, exportedAt: new Date().toISOString() }, null, 2);
}

export function importProgress(json) {
  const parsed = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Kein gültiges Fortschritts-Objekt.");
  if (!parsed.mastery && !parsed.totals) throw new Error("Die Datei enthält keinen Fortschritt.");
  return migrate(parsed);
}

export function downloadProgress(p) {
  const blob = new Blob([exportProgress(p)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `deutsch-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- derived ----------------------------------------------------------------

export const todayKey = () => new Date().toISOString().slice(0, 10);

export function recordAnswer(p, ruleId, correct) {
  const next = { ...p };
  next.mastery = { ...p.mastery, [ruleId]: { ...(p.mastery[ruleId] || { r: 0, t: 0 }) } };
  const m = next.mastery[ruleId];
  m.t += 1;
  if (correct) m.r += 1;

  const t = { ...p.totals };
  t.answered += 1;
  if (correct) { t.correct += 1; t.streak += 1; t.best = Math.max(t.best, t.streak); }
  else t.streak = 0;
  next.totals = t;

  const k = todayKey();
  next.days = { ...p.days, [k]: (p.days[k] || 0) + 1 };
  return next;
}

export function masteryOf(p, ruleId) {
  const m = p.mastery?.[ruleId];
  if (!m || !m.t) return null;
  return m.r / m.t;
}

// --- chat sessions ----------------------------------------------------------

export function saveChatSession(p, session) {
  const existing = (p.chatSessions || []).filter((s) => s.id !== session.id);
  return { ...p, chatSessions: [...existing, session].slice(-40) };
}

export function overallMastery(p) {
  let r = 0, t = 0;
  for (const id of RULE_IDS) { const m = p.mastery?.[id]; if (m) { r += m.r; t += m.t; } }
  return t ? r / t : 0;
}

export function weakRules(p, n = 5) {
  return RULE_IDS
    .map((id) => ({ id, ...(p.mastery?.[id] || { r: 0, t: 0 }) }))
    .filter((x) => x.t >= 3)
    .map((x) => ({ ...x, acc: x.r / x.t }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, n);
}

export function currentStreakDays(p) {
  let n = 0;
  const d = new Date();
  for (;;) {
    const k = d.toISOString().slice(0, 10);
    if (p.days?.[k]) { n += 1; d.setDate(d.getDate() - 1); } else break;
  }
  return n;
}
