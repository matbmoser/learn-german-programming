// SPDX-License-Identifier: GPL-3.0-or-later

import { LEVELS, MODULES } from "../data/curriculum.js";
import { WRITING_TASKS } from "../data/writing.js";

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
  return {
    currentModuleId: MODULES[0].id,
    completed: {},
    checkpoints: {},
    steps: {},
    applications: {},
    aiSupport: {},
  };
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
    steps: path.steps && typeof path.steps === "object" ? path.steps : {},
    applications: path.applications && typeof path.applications === "object" ? path.applications : {},
    aiSupport: path.aiSupport && typeof path.aiSupport === "object" ? path.aiSupport : {},
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
  };
}

export function setLearningStep(pathValue, moduleId, step) {
  const path = normalizeLearningPath(pathValue);
  const allowed = ["intro", "learn", "practice", "apply"];
  return allowed.includes(step)
    ? { ...path, steps: { ...path.steps, [moduleId]: step } }
    : path;
}

export function saveLearningApplication(pathValue, moduleId, text) {
  const path = normalizeLearningPath(pathValue);
  const previous = path.applications[moduleId] || {};
  return {
    ...path,
    applications: {
      ...path.applications,
      [moduleId]: { ...previous, text, updatedAt: Date.now() },
    },
  };
}

export function completeLearningModule(pathValue, moduleId) {
  const path = normalizeLearningPath(pathValue);
  const application = path.applications[moduleId] || {};
  return {
    ...path,
    completed: { ...path.completed, [moduleId]: path.completed[moduleId] || Date.now() },
    applications: {
      ...path.applications,
      [moduleId]: { ...application, completedAt: application.completedAt || Date.now() },
    },
  };
}

export function saveLearningAISupport(pathValue, moduleId, support) {
  const path = normalizeLearningPath(pathValue);
  return {
    ...path,
    aiSupport: {
      ...path.aiSupport,
      [moduleId]: support ? { ...support, generatedAt: Date.now() } : undefined,
    },
  };
}

export function learningProfile(progress, module) {
  const rules = checkpointRules(module);
  const mastery = rules.map((rule) => {
    const score = progress.mastery?.[rule] || { r: 0, t: 0 };
    return {
      rule,
      answered: score.t,
      correct: score.r,
      accuracy: score.t ? Math.round((score.r / score.t) * 100) : null,
    };
  });
  const checkpoint = progress.learningPath?.checkpoints?.[module.id] || {};
  const latestExam = progress.exams?.[progress.exams.length - 1];
  const latestWriting = progress.writings?.[progress.writings.length - 1];
  const patterns = (latestWriting?.feedback?.error_patterns || []).slice(0, 5).map((pattern) => ({
    rule: pattern.rule,
    label: pattern.label,
    frequency: pattern.frequency,
  }));
  const weakestRules = Object.entries(progress.mastery || {})
    .map(([rule, score]) => ({
      rule,
      answered: score?.t || 0,
      accuracy: score?.t ? Math.round(((score.r || 0) / score.t) * 100) : null,
    }))
    .filter((item) => item.answered >= 3)
    .sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered)
    .slice(0, 8);
  const recentChapterResults = Object.entries(progress.learningPath?.checkpoints || {})
    .filter(([, result]) => result?.answered)
    .slice(-6)
    .map(([moduleId, result]) => ({
      moduleId,
      answered: result.answered,
      accuracy: Math.round(((result.correct || 0) / result.answered) * 100),
      recent: (result.recent || []).slice(-CHECKPOINT_WINDOW),
    }));
  const recentApplications = Object.entries(progress.learningPath?.applications || {})
    .filter(([, application]) => application?.text)
    .slice(-4)
    .map(([moduleId, application]) => ({
      moduleId,
      wordCount: application.text.trim().split(/\s+/).length,
      completed: Boolean(application.completedAt),
    }));
  return {
    currentLevel: module.level,
    currentModule: module.id,
    moduleMastery: mastery,
    recentCheckpoint: Array.isArray(checkpoint.recent) ? checkpoint.recent.slice(-CHECKPOINT_WINDOW) : [],
    totalAnswers: progress.totals?.answered || 0,
    overallAccuracy: progress.totals?.answered
      ? Math.round((progress.totals.correct / progress.totals.answered) * 100)
      : null,
    completedChapters: Object.keys(progress.learningPath?.completed || {}).length,
    latestPlacement: latestExam?.reached || latestExam?.level || null,
    recentErrorPatterns: patterns,
    weakestRules,
    recentChapterResults,
    recentApplications,
  };
}

export function learningStep(pathValue, moduleId) {
  const path = normalizeLearningPath(pathValue);
  if (path.completed[moduleId]) return "complete";
  const stored = path.steps[moduleId];
  if (checkpointPassed(path.checkpoints[moduleId]) && !stored) return "apply";
  return stored || "intro";
}

export function applicationTask(module) {
  const levelTasks = WRITING_TASKS.filter((task) => task.level === module.level);
  const moduleIndex = MODULES.filter((item) => item.level === module.level).findIndex((item) => item.id === module.id);
  const source = levelTasks[Math.max(0, moduleIndex) % levelTasks.length];
  const baseMinimum = { A2: 25, B1: 40, B2: 55, C1: 70 }[module.level] || 35;
  const isWritingCapstone = module.id.startsWith("schreiben-");
  return {
    id: `${module.id}:${source?.id || "application"}`,
    title: isWritingCapstone ? source?.title || module.title : `Mini-Anwendung: ${source?.title || module.title}`,
    prompt: source?.prompt || `Schreibe einen kurzen Text und verwende dabei ${module.title}.`,
    instruction: isWritingCapstone
      ? `Verfasse eine konzentrierte Prüfungsfassung und setze die Regeln aus „${module.title}“ sichtbar ein.`
      : `Antworte in einem kurzen Text. Konzentriere dich dabei bewusst auf „${module.title}“; es geht noch nicht um einen perfekten Prüfungstext.`,
    minWords: isWritingCapstone ? Math.min(source?.minWords || 150, 180) : baseMinimum,
    targets: [module.title, ...(source?.targets || []).slice(0, 2)],
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

export function jumpToModule(pathValue, moduleId) {
  const path = normalizeLearningPath(pathValue);
  return MODULES.some((module) => module.id === moduleId)
    ? { ...path, currentModuleId: moduleId }
    : path;
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
