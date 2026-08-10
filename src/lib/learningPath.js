// SPDX-License-Identifier: GPL-3.0-or-later

import {
  LEARNING_BLOCK_BY_MODULE,
  LEARNING_BLOCKS,
  LEVELS,
  MODULES,
} from "../data/curriculum.js";
import { WRITING_TASKS } from "../data/writing.js";

export const CHECKPOINT_WINDOW = 4;
export const CHECKPOINT_CORRECT = 3;
export const LEVEL_EXAM_PASS_RATE = 0.8;

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
    levelExams: {},
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
    levelExams: path.levelExams && typeof path.levelExams === "object" ? path.levelExams : {},
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

export function learningBlockForModule(moduleOrId) {
  const moduleId = typeof moduleOrId === "string" ? moduleOrId : moduleOrId?.id;
  return LEARNING_BLOCK_BY_MODULE[moduleId] || {
    id: moduleOrId?.level || "Kurs",
    title: moduleOrId?.title || "Lernblock",
    moduleIds: moduleId ? [moduleId] : [],
    moduleIndex: 0,
    isEnd: true,
  };
}

export function moduleRequiresApplication(moduleOrId) {
  return learningBlockForModule(moduleOrId).isEnd;
}

export function moduleRequiresLevelExam(moduleOrId) {
  const moduleId = typeof moduleOrId === "string" ? moduleOrId : moduleOrId?.id;
  const index = MODULES.findIndex((module) => module.id === moduleId);
  if (index < 0 || index === MODULES.length - 1) return false;
  return MODULES[index + 1].level !== MODULES[index].level;
}

export function levelExamModules(level) {
  return MODULES.filter((module) => module.level === level);
}

export function levelExamRequiredCorrect(level) {
  return Math.ceil(levelExamModules(level).length * LEVEL_EXAM_PASS_RATE);
}

export function levelExamPassed(pathValue, level) {
  return Boolean(normalizeLearningPath(pathValue).levelExams[level]?.passed);
}

export function recordLevelExam(pathValue, level, results) {
  const path = normalizeLearningPath(pathValue);
  const expectedIds = new Set(levelExamModules(level).map((module) => module.id));
  const validResults = Array.isArray(results)
    ? results.filter((result) => expectedIds.has(result?.moduleId)).slice(0, expectedIds.size)
    : [];
  const uniqueResults = [...new Map(validResults.map((result) => [result.moduleId, {
    moduleId: result.moduleId,
    correct: Boolean(result.correct),
  }])).values()];
  if (uniqueResults.length !== expectedIds.size) return path;
  const correct = uniqueResults.filter((result) => result.correct).length;
  const passed = correct >= levelExamRequiredCorrect(level);
  const previous = path.levelExams[level] || { attempts: [], passed: false };
  const attempt = {
    at: Date.now(),
    correct,
    total: uniqueResults.length,
    passed,
    results: uniqueResults,
  };
  return {
    ...path,
    levelExams: {
      ...path.levelExams,
      [level]: {
        passed: previous.passed || passed,
        passedAt: previous.passedAt || (passed ? attempt.at : undefined),
        attempts: [...(previous.attempts || []), attempt].slice(-20),
      },
    },
  };
}

function modulesInLearningBlock(moduleOrId) {
  return learningBlockForModule(moduleOrId).moduleIds
    .map((moduleId) => MODULES.find((module) => module.id === moduleId))
    .filter(Boolean);
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
  const allowed = ["intro", "learn", "practice", "apply", "exam"];
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

export function saveLearningApplicationReview(pathValue, moduleId, text, review) {
  const path = normalizeLearningPath(pathValue);
  const previous = path.applications[moduleId] || {};
  const attempts = previous.review
    ? [...(previous.attempts || []), {
        task: previous.task || null,
        text: previous.reviewedText || previous.text || "",
        review: previous.review,
        reviewedText: previous.reviewedText || "",
        savedAt: previous.reviewedAt || Date.now(),
      }].slice(-50)
    : (previous.attempts || []);
  return {
    ...path,
    applications: {
      ...path.applications,
      [moduleId]: {
        ...previous,
        attempts,
        text,
        review,
        reviewedText: text,
        reviewedAt: Date.now(),
        updatedAt: Date.now(),
      },
    },
  };
}

export function saveLearningApplicationTask(pathValue, moduleId, task, previousTask = null) {
  const path = normalizeLearningPath(pathValue);
  const previous = path.applications[moduleId] || {};
  const hasAttempt = Boolean(previous.text?.trim() || previous.review);
  const attempts = hasAttempt
    ? [...(previous.attempts || []), {
        task: previousTask || previous.task || null,
        text: previous.text || "",
        review: previous.review || null,
        reviewedText: previous.reviewedText || "",
        savedAt: Date.now(),
      }].slice(-10)
    : (previous.attempts || []);
  return {
    ...path,
    applications: {
      ...path.applications,
      [moduleId]: {
        ...previous,
        task,
        text: "",
        review: null,
        reviewedText: "",
        attempts,
        updatedAt: Date.now(),
      },
    },
  };
}

export function completeLearningModule(pathValue, moduleId) {
  const path = normalizeLearningPath(pathValue);
  if (!checkpointPassed(path.checkpoints[moduleId])) return path;
  const application = path.applications[moduleId] || {};
  if (moduleRequiresApplication(moduleId)
      && (application.review?.approved !== true || application.reviewedText !== application.text)) return path;
  const module = MODULES.find((item) => item.id === moduleId);
  if (moduleRequiresLevelExam(moduleId) && !levelExamPassed(path, module?.level)) return path;
  return {
    ...path,
    completed: { ...path.completed, [moduleId]: path.completed[moduleId] || Date.now() },
    applications: moduleRequiresApplication(moduleId) ? {
      ...path.applications,
      [moduleId]: { ...application, completedAt: application.completedAt || Date.now() },
    } : path.applications,
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
  if (!moduleRequiresApplication(moduleId) && stored === "apply") return "practice";
  const module = MODULES.find((item) => item.id === moduleId);
  const application = path.applications[moduleId] || {};
  if (moduleRequiresLevelExam(moduleId)
      && application.review?.approved === true
      && application.reviewedText === application.text
      && !levelExamPassed(path, module?.level)
      && !stored) return "exam";
  if (checkpointPassed(path.checkpoints[moduleId]) && !stored) {
    return moduleRequiresApplication(moduleId) ? "apply" : "practice";
  }
  return stored || "intro";
}

export function applicationTask(module) {
  const block = learningBlockForModule(module);
  const blockModules = modulesInLearningBlock(module);
  const levelTasks = WRITING_TASKS.filter((task) => task.level === module.level);
  const blockIndex = LEARNING_BLOCKS.filter((item) => item.id.startsWith(module.level))
    .findIndex((item) => item.id === block.id);
  const source = levelTasks[Math.max(0, blockIndex) % levelTasks.length];
  const baseMinimum = { A2: 25, B1: 40, B2: 55, C1: 70 }[module.level] || 35;
  const isWritingCapstone = module.id.startsWith("schreiben-");
  const learnedTargets = blockModules.map((item) => item.title);
  return {
    id: `${module.id}:${source?.id || "application"}`,
    title: isWritingCapstone ? source?.title || block.title : `Block-Anwendung: ${source?.title || block.title}`,
    prompt: source?.prompt || `Schreibe einen kurzen Text und verbinde dabei die Regeln aus ${block.id}.`,
    instruction: isWritingCapstone
      ? `Verfasse eine konzentrierte Prüfungsfassung und setze die Regeln aus ${block.id} „${block.title}“ sichtbar ein.`
      : `Wende jetzt die zusammengehörenden Regeln aus ${block.id} „${block.title}“ in einem kurzen Text an.`,
    minWords: isWritingCapstone ? Math.min(source?.minWords || 150, 180) : baseMinimum,
    targets: [...learnedTargets, ...(source?.targets || []).slice(0, 2)],
  };
}

const APPLICATION_FALLBACKS = {
  A2: [
    {
      id: "einladung-absagen",
      title: "Eine Einladung absagen",
      prompt: "Ihre Freundin Mia hat Sie zu einer Geburtstagsfeier eingeladen. Schreiben Sie ihr: Warum können Sie nicht kommen? Was haben Sie an diesem Tag vor? Schlagen Sie ein anderes Treffen vor.",
      targets: ["eine Begründung mit weil", "eine Zeitangabe", "ein konkreter Gegenvorschlag"],
    },
    {
      id: "lieblingsort",
      title: "Mein Lieblingsort",
      prompt: "Beschreiben Sie einen Ort, an dem Sie gern Zeit verbringen. Wo ist er? Was machen Sie dort? Warum gefällt er Ihnen besonders?",
      targets: ["Ortsangaben", "mindestens drei passende Adjektive", "eine Begründung mit weil"],
    },
    {
      id: "alltagsproblem",
      title: "Ein Problem im Alltag",
      prompt: "Schreiben Sie eine kurze Nachricht an Ihren Nachbarn. Erklären Sie ein Problem im Haus, beschreiben Sie, was passiert ist, und bitten Sie um Hilfe.",
      targets: ["Perfekt", "eine höfliche Bitte", "Akkusativ- und Dativobjekte"],
    },
  ],
  B1: [
    {
      id: "kurswechsel",
      title: "Bitte um einen Kurswechsel",
      prompt: "Sie besuchen einen Sprachkurs, aber die Kurszeit passt nicht mehr. Schreiben Sie an die Sprachschule: Erklären Sie Ihre Situation, nennen Sie eine passende Alternative und bitten Sie um eine schnelle Antwort.",
      targets: ["formelle Anrede und Grußformel", "eine höfliche Bitte", "eine Begründung und ein Lösungsvorschlag"],
    },
    {
      id: "stadt-land",
      title: "Lieber in der Stadt oder auf dem Land?",
      prompt: "Schreiben Sie einen Forumsbeitrag über das Leben in der Stadt und auf dem Land. Nennen Sie je einen Vorteil, geben Sie ein persönliches Beispiel und formulieren Sie Ihre Meinung.",
      targets: ["klare eigene Position", "zwei unterschiedliche Konnektoren", "ein persönliches Beispiel"],
    },
    {
      id: "missverstaendnis",
      title: "Ein Missverständnis",
      prompt: "Erzählen Sie von einem Missverständnis im Alltag. Wie ist es entstanden, wie haben die Beteiligten reagiert und wie wurde es gelöst?",
      targets: ["chronologische Reihenfolge", "Perfekt und Präteritum", "ein Nebensatz mit als oder nachdem"],
    },
  ],
  B2: [
    {
      id: "digitale-termine",
      title: "Nur noch digitale Behördentermine?",
      prompt: "Viele Behörden bieten Dienstleistungen zunehmend nur online an. Erörtern Sie Vorteile und Nachteile, gehen Sie auf Menschen mit wenig digitaler Erfahrung ein und formulieren Sie einen Lösungsvorschlag.",
      targets: ["ein ernsthaft behandelter Einwand", "mindestens vier verschiedene Konnektoren", "ein begründeter Lösungsvorschlag"],
    },
    {
      id: "weiterbildung",
      title: "Weiterbildung während der Arbeitszeit",
      prompt: "Sollten Beschäftigte einen festen Teil ihrer Arbeitszeit für Weiterbildung nutzen dürfen? Nehmen Sie Stellung, begründen Sie Ihre Position und berücksichtigen Sie die Perspektive der Unternehmen.",
      targets: ["klarer argumentativer Aufbau", "Vorteil und möglicher Nachteil", "formelles Register"],
    },
    {
      id: "bibliothek",
      title: "Die Bibliothek der Zukunft",
      prompt: "Ihre Stadt plant eine neue Bibliothek. Schreiben Sie eine Stellungnahme: Welche Aufgaben sollte sie übernehmen, welche Angebote sind besonders wichtig und wie sollte sie finanziert werden?",
      targets: ["konkrete Vorschläge", "Passiv oder Passiversatz", "ein begründetes Fazit"],
    },
  ],
  C1: [
    {
      id: "recht-auf-reparatur",
      title: "Ein verpflichtendes Recht auf Reparatur",
      prompt: "Erörtern Sie, ob Hersteller gesetzlich verpflichtet werden sollten, Produkte länger reparierbar zu machen. Berücksichtigen Sie ökologische und wirtschaftliche Folgen und entkräften Sie einen ernstzunehmenden Einwand.",
      targets: ["differenzierte These", "ein entkräfteter Gegeneinwand", "formelle Konnektoren und Nominalstil"],
    },
    {
      id: "arbeitszeit-modelle",
      title: "Flexible Arbeitszeit als neuer Standard",
      prompt: "Nehmen Sie dazu Stellung, ob Beschäftigte ihre Arbeitszeit grundsätzlich frei einteilen sollten. Analysieren Sie Folgen für Produktivität, Zusammenarbeit und soziale Gerechtigkeit und formulieren Sie ein abgewogenes Fazit.",
      targets: ["klar gegliederte Argumentation", "mehrere Perspektiven", "präzises formelles Register"],
    },
    {
      id: "kulturfoerderung",
      title: "Öffentliche Förderung für Kultur",
      prompt: "Verfassen Sie eine Erörterung zur Frage, nach welchen Kriterien öffentliche Kulturförderung vergeben werden sollte. Entwickeln Sie zwei Kriterien, prüfen Sie einen möglichen Zielkonflikt und begründen Sie Ihre Position.",
      targets: ["zwei tragende Kriterien", "ein analysierter Zielkonflikt", "Funktionsverbgefüge oder Passiversatz"],
    },
  ],
};

export function applicationFallbackTasks(module, currentTask = null, count = 2) {
  const block = learningBlockForModule(module);
  const learnedTargets = modulesInLearningBlock(module).map((item) => item.title);
  const minWords = { A2: 25, B1: 40, B2: 55, C1: 70 }[module?.level] || 35;
  return (APPLICATION_FALLBACKS[module?.level] || APPLICATION_FALLBACKS.B1)
    .filter((item) => item.id !== currentTask?.fallbackId && item.title !== currentTask?.title)
    .slice(0, Math.max(2, count))
    .map((item) => ({
      id: `${module.id}:fallback:${item.id}`,
      fallbackId: item.id,
      source: "fallback",
      title: item.title,
      prompt: item.prompt,
      instruction: `Bearbeite ein neues Thema und verbinde dabei die Regeln aus ${block.id} „${block.title}“.`,
      minWords,
      targets: [...learnedTargets, ...item.targets],
    }));
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
  const block = learningBlockForModule(current);
  const blockCompleted = block.moduleIds.filter((moduleId) => Boolean(path.completed[moduleId])).length;
  return {
    current,
    currentIndex,
    completedCount,
    total: MODULES.length,
    percent: Math.round((completedCount / MODULES.length) * 100),
    levelCompleted,
    levelTotal: levelModules.length,
    levelPercent: Math.round((levelCompleted / levelModules.length) * 100),
    block,
    blockCompleted,
    blockTotal: block.moduleIds.length,
    isBlockEnd: block.isEnd,
    isLevelEnd: moduleRequiresLevelExam(current),
    levelExam: path.levelExams[current.level] || null,
    isLast: currentIndex === MODULES.length - 1,
    levels: LEVELS,
  };
}
