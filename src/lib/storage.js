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
//  own key and is NEVER part of an export, so backups cannot expose it.
// ============================================================================

import { RULE_IDS } from "../engine/drills.js";
import { emptyLearningPath, normalizeLearningPath } from "./learningPath.js";

const PROGRESS_KEY = "dc1:progress";
const API_KEY = "dc1:apikey";
const WELCOME_TUTORIAL_KEY = "dc1:welcome-tutorial:v1";
const SCHEMA_VERSION = 3;
const BACKUP_FORMAT = "deutsch-c1-progress-backup";
const BACKUP_VERSION = 1;

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
    mistakeAttempts: [],// attempts on exercises derived from saved writing corrections
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
  merged.mastery = { ...base.mastery, ...(isObject(p.mastery) ? p.mastery : {}) };
  merged.totals = { ...base.totals, ...(isObject(p.totals) ? p.totals : {}) };
  merged.settings = { ...base.settings, ...(isObject(p.settings) ? p.settings : {}) };
  if (merged.settings.model === "claude-opus-5") merged.settings.model = base.settings.model;
  merged.days = isObject(p.days) ? p.days : {};
  merged.exams = Array.isArray(p.exams) ? p.exams : [];
  merged.writings = Array.isArray(p.writings) ? p.writings : [];
  merged.mistakeAttempts = Array.isArray(p.mistakeAttempts) ? p.mistakeAttempts : [];
  merged.challenges = Array.isArray(p.challenges) ? p.challenges : [];
  merged.chatSessions = Array.isArray(p.chatSessions) ? p.chatSessions : [];
  merged.read = isObject(p.read) ? p.read : {};
  merged.learningPath = normalizeLearningPath(p.learningPath);
  merged.v = SCHEMA_VERSION;
  return merged;
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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
  return JSON.stringify({
    format: BACKUP_FORMAT,
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progressSchemaVersion: SCHEMA_VERSION,
    // The complete learning state, including settings, corrections, mistake
    // attempts, exams, chat history, and learning-path data. Secrets such as
    // the API key deliberately live under another localStorage key.
    progress: migrate(p),
  }, null, 2);
}

/** Parse and validate a backup without changing the current browser state. */
export function inspectProgressBackup(json) {
  const parsed = JSON.parse(json);
  if (!isObject(parsed)) throw new Error("Kein gültiges Fortschritts-Objekt.");

  let source;
  let exportedAt = null;
  let legacy = false;

  if (parsed.format === BACKUP_FORMAT) {
    if (parsed.backupVersion !== BACKUP_VERSION) {
      throw new Error("Diese Backup-Version wird von der App nicht unterstützt.");
    }
    if (!isObject(parsed.progress)) throw new Error("Das Backup enthält keinen Fortschritt.");
    source = parsed.progress;
    exportedAt = typeof parsed.exportedAt === "string" ? parsed.exportedAt : null;
  } else {
    // Backups made by earlier versions stored the progress at the top level.
    if (!isObject(parsed.mastery) && !isObject(parsed.totals)) {
      throw new Error("Die Datei ist kein Deutsch-Lernstand-Backup.");
    }
    source = parsed;
    exportedAt = typeof parsed.exportedAt === "string" ? parsed.exportedAt : null;
    legacy = true;
  }

  if (Number(source.v) > SCHEMA_VERSION) {
    throw new Error("Dieses Backup stammt aus einer neueren App-Version. Bitte aktualisiere zuerst die App.");
  }

  const objectFields = ["mastery", "totals", "days", "read", "settings", "learningPath"];
  const arrayFields = ["exams", "writings", "mistakeAttempts", "challenges", "chatSessions"];
  for (const field of objectFields) {
    if (source[field] != null && !isObject(source[field])) {
      throw new Error(`Ungültiger Inhalt im Feld „${field}“.`);
    }
  }
  for (const field of arrayFields) {
    if (source[field] != null && !Array.isArray(source[field])) {
      throw new Error(`Ungültiger Inhalt im Feld „${field}“.`);
    }
  }

  return { progress: migrate(source), exportedAt, legacy };
}

export function importProgress(json) {
  return inspectProgressBackup(json).progress;
}

export function downloadProgress(p) {
  const blob = new Blob([exportProgress(p)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `deutsch-lernstand-backup-${new Date().toISOString().slice(0, 10)}.json`;
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

/** Record proof that a learner revisited an error from one of their texts. */
export function recordMistakeAttempt(p, attempt) {
  const withMastery = recordAnswer(p, attempt.ruleId, attempt.correct);
  return {
    ...withMastery,
    mistakeAttempts: [
      ...(p.mistakeAttempts || []),
      { ...attempt, at: attempt.at || Date.now() },
    ].slice(-1000),
  };
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
