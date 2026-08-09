// SPDX-License-Identifier: GPL-3.0-or-later

import { LEVELS, MODULES } from "../data/curriculum.js";

export const CHECKPOINT_WINDOW = 4;
export const CHECKPOINT_CORRECT = 3;

// A few reference chapters do not have their own generator yet. These related
// rules keep every chapter verifiable without pretending that merely opening a
// page proves understanding.
const CHECKPOINT_FALLBACKS = {
  reflexiv: ["kasus"],
  komparativ: ["adjektiv"],
  genitiv: ["kasus"],
  "infinitiv-zu": ["ordnung", "modal"],
  temporal: ["konnektor", "zeiten"],
  futur: ["zeiten"],
  "modal-subjektiv": ["modal"],
  textkohaesion: ["paired", "konnektor"],
  "erweitertes-attribut": ["partizipattr"],
  "schreiben-c1": ["fvg", "konnektor"],
};

export function emptyLearningPath() {
  return { currentModuleId: MODULES[0].id, completed: {}, checkpoints: {} };
}

export function normalizeLearningPath(value) {
  const base = emptyLearningPath();
  const path = value && typeof value === "object" ? value : {};
  return {
    ...base,
    ...path,
    currentModuleId: MODULES.some((m) => m.id === path.currentModuleId)
      ? path.currentModuleId
      : base.currentModuleId,
    completed: path.completed && typeof path.completed === "object" ? path.completed : {},
    checkpoints: path.checkpoints && typeof path.checkpoints === "object" ? path.checkpoints : {},
  };
}

export function checkpointRules(module) {
  return module?.drills?.length ? module.drills : (CHECKPOINT_FALLBACKS[module?.id] || []);
}

export function checkpointPassed(checkpoint) {
  if (checkpoint?.passed) return true;
  const recent = Array.isArray(checkpoint?.recent) ? checkpoint.recent.slice(-CHECKPOINT_WINDOW) : [];
  return recent.length === CHECKPOINT_WINDOW && recent.filter(Boolean).length >= CHECKPOINT_CORRECT;
}

export function recordCheckpoint(pathValue, moduleId, correct) {
  const path = normalizeLearningPath(pathValue);
  const previous = path.checkpoints[moduleId] || { answered: 0, correct: 0, recent: [], passed: false };
  const recent = [...(previous.recent || []), Boolean(correct)].slice(-CHECKPOINT_WINDOW);
  const checkpoint = {
    answered: (previous.answered || 0) + 1,
    correct: (previous.correct || 0) + (correct ? 1 : 0),
    recent,
    passed: previous.passed || (recent.length === CHECKPOINT_WINDOW && recent.filter(Boolean).length >= CHECKPOINT_CORRECT),
  };
  return {
    ...path,
    checkpoints: { ...path.checkpoints, [moduleId]: checkpoint },
    completed: checkpoint.passed
      ? { ...path.completed, [moduleId]: path.completed[moduleId] || Date.now() }
      : path.completed,
  };
}

export function advanceLearningPath(pathValue) {
  const path = normalizeLearningPath(pathValue);
  const index = Math.max(0, MODULES.findIndex((m) => m.id === path.currentModuleId));
  const next = MODULES[Math.min(index + 1, MODULES.length - 1)];
  return { ...path, currentModuleId: next.id };
}

export function jumpToLevel(pathValue, level) {
  const path = normalizeLearningPath(pathValue);
  const target = MODULES.find((m) => m.level === level);
  return target ? { ...path, currentModuleId: target.id } : path;
}

export function learningPathStats(pathValue) {
  const path = normalizeLearningPath(pathValue);
  const currentIndex = Math.max(0, MODULES.findIndex((m) => m.id === path.currentModuleId));
  const current = MODULES[currentIndex];
  const completedCount = MODULES.filter((m) => Boolean(path.completed[m.id])).length;
  const levelModules = MODULES.filter((m) => m.level === current.level);
  const levelCompleted = levelModules.filter((m) => Boolean(path.completed[m.id])).length;
  return {
    current,
    currentIndex,
    completedCount,
    total: MODULES.length,
    percent: Math.round((completedCount / MODULES.length) * 100),
    levelCompleted,
    levelTotal: levelModules.length,
    levelPercent: Math.round((levelCompleted / levelModules.length) * 100),
    isLast: currentIndex === MODULES.length - 1,
    levels: LEVELS,
  };
}

