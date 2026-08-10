// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import { LEVEL_INFO, MODULES } from "../data/curriculum.js";
import { generate } from "../engine/drills.js";
import { answersMatch } from "../engine/grammar.js";
import {
  CHECKPOINT_CORRECT,
  CHECKPOINT_WINDOW,
  applicationFallbackTasks,
  applicationTask,
  checkpointPassed,
  checkpointRules,
  learningProfile,
  learningPathStats,
  learningStep,
  moduleRequiresApplication,
} from "../lib/learningPath.js";
import {
  correctWriting,
  extractJson,
  generateLearningSupport,
  manualCorrectionPrompt,
  manualLearningSupportPrompt,
  normalizeLearningSupport,
  scopeCorrectionToLevel,
} from "../lib/claude.js";
import { buildErrorRanges, buildSegments } from "../lib/highlight.js";
import { ModuleContent } from "./Learn.jsx";
import { Bar, Callout, CopyButton, LevelTag, Prompt, Spinner, Trace } from "./ui.jsx";
import {
  IconArrowRight,
  IconCancel,
  IconCheckCircle,
  IconClose,
  IconFullscreen,
  IconFullscreenExit,
  IconWarning,
} from "./icons.jsx";

const MODULE_STEPS = [
  { id: "intro", label: "Einführung" },
  { id: "learn", label: "Verstehen" },
  { id: "practice", label: "Üben" },
  { id: "apply", label: "Anwenden" },
];

function buildLearningPathCorrectionHistory(path) {
  return Object.entries(path.applications || {}).flatMap(([moduleId, application]) => {
    const module = MODULES.find((item) => item.id === moduleId);
    const shared = {
      moduleId,
      moduleTitle: module?.title || moduleId,
      level: module?.level || "—",
    };
    const entries = (application.attempts || []).flatMap((attempt, index) => attempt.review ? [{
      ...shared,
      id: `${moduleId}:attempt:${attempt.savedAt || index}`,
      kind: "attempt",
      taskTitle: attempt.task?.title || module?.title || "Schreibanwendung",
      text: attempt.text || "",
      review: attempt.review,
      at: attempt.savedAt || 0,
    }] : []);
    if (application.review) {
      entries.push({
        ...shared,
        id: `${moduleId}:current:${application.reviewedAt || "saved"}`,
        kind: "current",
        taskTitle: application.task?.title || module?.title || "Schreibanwendung",
        text: application.reviewedText || application.text || "",
        review: application.review,
        at: application.reviewedAt || application.updatedAt || 0,
      });
    }
    return entries;
  }).sort((left, right) => right.at - left.at);
}

export default function LearningPath({
  progress,
  apiKey,
  model,
  mode,
  onRead,
  onCheckpointAnswer,
  onStep,
  onSaveApplication,
  onSaveApplicationReview,
  onSelectApplicationTask,
  onSaveAISupport,
  onComplete,
  onAdvance,
  onOpenSettings,
}) {
  const path = progress.learningPath;
  const stats = learningPathStats(path);
  const mod = stats.current;
  const block = stats.block;
  const requiresApplication = moduleRequiresApplication(mod);
  const steps = requiresApplication ? MODULE_STEPS : MODULE_STEPS.slice(0, 3);
  const savedStep = learningStep(path, mod.id);
  const [viewStep, setViewStep] = React.useState(null);
  const step = viewStep || savedStep;
  const checkpoint = path.checkpoints?.[mod.id] || { recent: [] };
  const application = path.applications?.[mod.id] || { text: "" };
  const aiSupport = path.aiSupport?.[mod.id] || null;
  const profile = React.useMemo(() => learningProfile(progress, mod), [progress, mod]);
  const correctionHistory = React.useMemo(() => buildLearningPathCorrectionHistory(path), [path]);

  React.useEffect(() => {
    if (step === "learn") onRead(mod.id);
  }, [mod.id, onRead, step]);

  React.useEffect(() => { setViewStep(null); }, [mod.id]);

  const savedIndex = savedStep === "complete" ? steps.length : steps.findIndex((item) => item.id === savedStep);
  const activeIndex = step === "complete" ? steps.length : steps.findIndex((item) => item.id === step);

  function openReachedStep(nextStep) {
    const nextIndex = steps.findIndex((item) => item.id === nextStep);
    if (savedStep === "complete" || nextIndex <= savedIndex) {
      setViewStep(nextStep === savedStep ? null : nextStep);
    }
  }

  function continueTo(nextStep) {
    const nextIndex = steps.findIndex((item) => item.id === nextStep);
    if (savedStep === "complete" || nextIndex < savedIndex) setViewStep(nextStep);
    else if (nextIndex === savedIndex) setViewStep(null);
    else {
      setViewStep(null);
      onStep(mod.id, nextStep);
    }
  }

  function finishModule() {
    if (savedStep === "complete") setViewStep(null);
    else onComplete(mod.id);
  }

  return (
    <section className="card path-window" aria-labelledby="path-window-title">
      <header className="path-window-head">
        <div className="path-window-title">
          <span className="eyebrow">Lernblock {block.id} · {block.title} · Kapitel {block.moduleIndex + 1} von {block.moduleIds.length}</span>
          <h1 id="path-window-title"><LevelTag level={mod.level} /> {mod.title}</h1>
          <span className={aiSupport ? "path-ai-status is-active" : "path-ai-status"}>
            KI-Lernbegleiter {aiSupport ? "· personalisiert" : "· optional"}
          </span>
          <p>{LEVEL_INFO[mod.level].blurb}</p>
        </div>
        <div className="path-window-progress">
          <span className="mono">{stats.blockCompleted}/{stats.blockTotal} Kapitel in {block.id}</span>
          <Bar value={stats.blockCompleted / stats.blockTotal} color={`var(--${mod.level.toLowerCase()})`} />
          <button className="path-settings-link" type="button" onClick={onOpenSettings}>Niveau oder Modus ändern</button>
        </div>
      </header>

      <ol
        className="path-window-steps"
        aria-label="Ablauf dieses Kapitels"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((item, index) => {
          const unlocked = savedStep === "complete" || index <= savedIndex;
          const completed = savedStep === "complete" || index < savedIndex;
          const current = index === activeIndex;
          const className = (current ? "is-current" : "")
            + (completed && !current ? " is-done" : "")
            + (index === savedIndex && !current && savedStep !== "complete" ? " is-reached" : "");
          return (
            <li key={item.id} className={className}>
              <button
                type="button"
                disabled={!unlocked}
                aria-current={current ? "step" : undefined}
                title={unlocked && !current ? `Zu „${item.label}“ zurückgehen` : undefined}
                onClick={() => openReachedStep(item.id)}
              >
                <span>{completed ? "✓" : index + 1}</span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="path-window-body">
        {activeIndex > 0 && (
          <button
            className="path-back-button"
            type="button"
            onClick={() => openReachedStep(steps[activeIndex - 1].id)}
          >
            ← Zurück zu {steps[activeIndex - 1].label}
          </button>
        )}

        <div hidden={step !== "intro"}>
          <Introduction
            module={mod}
            profile={profile}
            support={aiSupport}
            apiKey={apiKey}
            model={model}
            mode={mode}
            block={block}
            requiresApplication={requiresApplication}
            onSaveSupport={(support) => onSaveAISupport(mod.id, support)}
            onOpenSettings={onOpenSettings}
            onContinue={() => continueTo("learn")}
          />
        </div>

        {savedIndex >= 1 && (
          <div hidden={step !== "learn"}>
            <Lesson
              module={mod}
              support={aiSupport}
              onBack={() => openReachedStep("intro")}
              onContinue={() => continueTo("practice")}
            />
          </div>
        )}

        {savedIndex >= 2 && (
          <div hidden={step !== "practice"}>
            <PathCheckpoint
              key={mod.id}
              module={mod}
              checkpoint={checkpoint}
              passed={checkpointPassed(checkpoint)}
              support={aiSupport}
              requiresApplication={requiresApplication}
              onAnswer={(ruleId, correct) => onCheckpointAnswer(mod.id, ruleId, correct)}
              onReview={() => openReachedStep("learn")}
              onContinue={() => requiresApplication ? continueTo("apply") : finishModule()}
            />
          </div>
        )}

        {savedIndex >= 3 && (
          <div hidden={step !== "apply"}>
            <Application
              module={mod}
              support={aiSupport}
              value={application.text || ""}
              review={application.review || null}
              reviewedText={application.reviewedText || ""}
              correctionHistory={correctionHistory}
              selectedTask={application.task || null}
              apiKey={apiKey}
              model={model}
              mode={mode}
              onChange={(text) => onSaveApplication(mod.id, text)}
              onReview={(text, review) => onSaveApplicationReview(mod.id, text, review)}
              onSelectTask={(task, previousTask) => onSelectApplicationTask(mod.id, task, previousTask)}
              onComplete={finishModule}
              onOpenSettings={onOpenSettings}
            />
          </div>
        )}

        {step === "complete" && (
          <Completion module={mod} block={block} isLast={stats.isLast} onAdvance={onAdvance} onOpenSettings={onOpenSettings} />
        )}
      </div>
    </section>
  );
}

function Introduction({
  module, block, requiresApplication, profile, support, apiKey, model, mode, onSaveSupport, onOpenSettings, onContinue,
}) {
  return (
    <div className="path-stage path-introduction">
      <span className="eyebrow">Dein einziger Fokus jetzt</span>
      <h2>{module.title} verstehen und selbst benutzen</h2>
      <p className="path-stage-lede">{module.summary}</p>
      <AILearningCoach
        module={module}
        profile={profile}
        support={support}
        apiKey={apiKey}
        model={model}
        mode={mode}
        onSave={onSaveSupport}
        onOpenSettings={onOpenSettings}
      />
      <div className="path-assignment">
        <span className="eyebrow">Was gleich passiert</span>
        <ol>
          <li>Du bekommst die Regel mit wenigen Beispielen erklärt.</li>
          <li>Die App gibt dir passende Aufgaben—du musst keinen Drill auswählen.</li>
          <li>{requiresApplication
            ? `Danach verbindest du alle Regeln aus ${block.id} in einem Schreibauftrag.`
            : `Nach dem Checkpoint geht es im Lernblock ${block.id} mit der nächsten passenden Regel weiter.`}</li>
        </ol>
      </div>
      <div className="actions"><button className="btn" type="button" onClick={onContinue}>Lektion beginnen</button></div>
    </div>
  );
}

function AILearningCoach({ module, profile, support, apiKey, model, mode, onSave, onOpenSettings }) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [manualOpen, setManualOpen] = React.useState(false);
  const [manualPaste, setManualPaste] = React.useState("");
  const allowedRules = checkpointRules(module);
  const baselineTask = applicationTask(module);
  const prompt = manualLearningSupportPrompt({ module, profile, baselineTask, allowedRules });

  async function personalize() {
    setBusy(true);
    setError("");
    try {
      onSave(await generateLearningSupport({ apiKey, model, module, profile, baselineTask, allowedRules }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function acceptManual() {
    try {
      onSave(normalizeLearningSupport(extractJson(manualPaste), allowedRules));
      setManualPaste("");
      setManualOpen(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className={support ? "path-ai-coach is-ready" : "path-ai-coach"} aria-label="KI-Lernbegleiter">
      <div className="path-ai-head">
        <div>
          <span className="path-ai-badge">KI</span>
          <b>Persönlicher Lernbegleiter</b>
        </div>
        <span className="mono">optional</span>
      </div>

      {support ? (
        <div className="path-ai-result">
          <span className="eyebrow">Dein persönlicher Fokus</span>
          <h3>{support.focus}</h3>
          <p>{support.focus_reason}</p>
          {support.coach_note && <p className="path-ai-note">{support.coach_note}</p>}
          {support.goals?.length > 0 && <ul>{support.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>}
          <div className="actions">
            {mode === "api" && apiKey && (
              <button className="btn btn-ghost btn-sm" type="button" disabled={busy} onClick={personalize}>
                {busy ? <><Spinner /> Aktualisiere …</> : "Mit aktuellem Stand aktualisieren"}
              </button>
            )}
            {mode === "manual" && (
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setManualOpen((value) => !value)}>Neuen KI-Prompt erstellen</button>
            )}
          </div>
        </div>
      ) : (
        <div className="path-ai-empty">
          <p>
            Die KI kann deine bisherigen Trefferquoten und Fehlerkategorien nutzen, um Erklärung,
            Beispiele, Übungen und Schreibauftrag dieses Kapitels anzupassen.
          </p>
          <p className="path-ai-privacy">Gesendet werden nur anonyme Lernwerte—kein Name und kein Rohtext aus deinen Schreibaufgaben.</p>
          <div className="actions">
            {mode === "api" && apiKey && (
              <button className="btn btn-sm" type="button" disabled={busy} onClick={personalize}>
                {busy ? <><Spinner /> Personalisiere …</> : "Dieses Kapitel personalisieren"}
              </button>
            )}
            {mode === "api" && !apiKey && (
              <button className="btn btn-ghost btn-sm" type="button" onClick={onOpenSettings}>KI in Einstellungen verbinden</button>
            )}
            {mode === "manual" && (
              <button className="btn btn-sm" type="button" onClick={() => setManualOpen((value) => !value)}>Manuellen KI-Prompt anzeigen</button>
            )}
          </div>
        </div>
      )}

      {manualOpen && (
        <div className="path-ai-manual">
          <div className="path-ai-manual-head"><span className="eyebrow">1 · Prompt kopieren</span><CopyButton text={prompt} /></div>
          <textarea className="copybox" readOnly value={prompt} onFocus={(event) => event.target.select()} />
          <span className="eyebrow">2 · JSON-Antwort einfügen</span>
          <textarea className="copybox" value={manualPaste} onChange={(event) => setManualPaste(event.target.value)} placeholder='{"coach_note":"…","focus":"…"}' />
          <button className="btn btn-sm" type="button" disabled={!manualPaste.trim()} onClick={acceptManual}>Personalisierung übernehmen</button>
        </div>
      )}
      {error && <Callout kind="bad">{error}</Callout>}
    </section>
  );
}

function Lesson({ module, support, onBack, onContinue }) {
  return (
    <div className="path-stage path-stage-lesson">
      {support && (
        <section className="path-ai-lesson">
          <div className="path-ai-head"><div><span className="path-ai-badge">KI</span><b>Erklärung für deinen Lernstand</b></div></div>
          <p>{support.explanation}</p>
          {support.memory_hook && <p className="path-ai-memory"><b>Merke:</b> {support.memory_hook}</p>}
          {support.examples?.length > 0 && (
            <div className="path-ai-examples">
              {support.examples.map((example, index) => (
                <div key={`${example.german}-${index}`}>
                  <b lang="de">{example.german}</b>
                  <span>{example.english}</span>
                  <small>{example.why}</small>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      <article className="detail" id={`doc-${module.id}`}>
        <ModuleContent module={module} anchorView="path" showDrills={false} />
      </article>
      <div className="path-stage-action">
        <p><b>Als Nächstes:</b> Die App prüft genau dieses Thema mit vorbereiteten Aufgaben.</p>
        <div className="actions path-stage-nav-actions">
          <button className="btn btn-ghost" type="button" onClick={onBack}>← Zurück zur Einführung</button>
          <button className="btn" type="button" onClick={onContinue}>Jetzt üben</button>
        </div>
      </div>
    </div>
  );
}

function personalizedQuestion(item, module) {
  return {
    rule: item.rule,
    ruleName: `KI · ${item.rule}`,
    kind: item.kind || "Personalized practice",
    level: module.level,
    type: "choice",
    longOpts: item.options.some((option) => String(option).length > 22),
    prompt: item.prompt,
    options: item.options,
    answer: item.answer,
    hint: "Diese Aufgabe wurde aus deinem bisherigen Lernmuster erzeugt.",
    trace: [["KI-Fokus", item.why, "personalized for this chapter"]],
    fromAI: true,
  };
}

function PathCheckpoint({ module, checkpoint, passed, support, requiresApplication, onAnswer, onReview, onContinue }) {
  const rules = checkpointRules(module);
  const personalized = React.useMemo(
    () => (support?.items || []).map((item) => personalizedQuestion(item, module)),
    [module, support]
  );
  const [personalIndex, setPersonalIndex] = React.useState(0);
  const [q, setQ] = React.useState(() => personalized[0] || generate(rules[0]));
  const [answered, setAnswered] = React.useState(false);
  const [given, setGiven] = React.useState("");
  const [correct, setCorrect] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [repeating, setRepeating] = React.useState(false);

  function freshBuiltInQuestion() {
    const ruleId = rules[Math.floor(Math.random() * rules.length)] || rules[0];
    return generate(ruleId);
  }

  function resetAnswer(nextQuestion) {
    setQ(nextQuestion);
    setAnswered(false);
    setGiven("");
    setCorrect(false);
    setTyped("");
  }

  function next() {
    const nextPersonalIndex = personalIndex + 1;
    if (!repeating && nextPersonalIndex < personalized.length) {
      setPersonalIndex(nextPersonalIndex);
      resetAnswer(personalized[nextPersonalIndex]);
    } else {
      resetAnswer(freshBuiltInQuestion());
    }
  }

  function startRepeat() {
    setRepeating(true);
    setPersonalIndex(personalized.length);
    resetAnswer(freshBuiltInQuestion());
  }

  function continueAfterRepeat() {
    setRepeating(false);
    onContinue();
  }

  function judge(value) {
    if (answered || (passed && !repeating)) return;
    const ok = q.type === "choice" ? value === q.answer : answersMatch(value, q.accept || [q.answer]);
    setAnswered(true);
    setGiven(value);
    setCorrect(ok);
    // AI items are personalized warm-up material. Only the built-in grammar
    // engine is allowed to affect mastery and chapter completion.
    if (!q.fromAI) onAnswer(q.rule, ok);
  }

  const recent = checkpoint.recent || [];
  const recentCorrect = recent.filter(Boolean).length;

  if (passed && !repeating) {
    return (
      <div className="path-stage path-stage-success">
        <span className="path-success-mark"><IconCheckCircle /></span>
        <span className="eyebrow">Übung bestanden</span>
        <h2>{requiresApplication ? "Der Lernblock ist bereit für die Anwendung." : "Die Regel sitzt. Du kannst weiterlernen."}</h2>
        <p className="muted">{requiresApplication
          ? "Jetzt verbindest du die Regeln aus diesem Lernblock in einer gemeinsamen Schreibaufgabe."
          : "Die Schreibaufgabe kommt erst am Ende dieses Lernblocks, wenn die zusammengehörenden Regeln gelernt sind."}</p>
        <div className="actions">
          <button className="btn" type="button" onClick={onContinue}>{requiresApplication ? "Zur Block-Schreibaufgabe" : "Kapitel abschließen"}</button>
          <button className="btn btn-ghost" type="button" onClick={startRepeat}>Übung wiederholen</button>
          <button className="btn btn-ghost" type="button" onClick={onReview}>Regel noch einmal ansehen</button>
        </div>
      </div>
    );
  }

  return (
    <div className="path-stage path-stage-practice">
      <div className="path-stage-heading">
        <div>
          <span className="eyebrow">{q.fromAI ? "KI-personalisierte" : "Vorbereitete"} Aufgabe · {q.ruleName}</span>
          <h2>Wähle oder tippe die richtige Lösung</h2>
        </div>
        <span className="mono dim">
          {repeating
            ? "Freiwillige Wiederholung"
            : q.fromAI
            ? `KI-Warm-up ${personalIndex + 1}/${personalized.length}`
            : `${recentCorrect}/${CHECKPOINT_CORRECT} richtig · ${recent.length}/${CHECKPOINT_WINDOW}`}
        </span>
      </div>
      <p className="muted path-checkpoint-intro">
        {repeating
          ? "Du hast diese Übung bereits bestanden. Weitere Antworten festigen die Regel, ändern aber deinen Kapitel-Fortschritt nicht."
          : q.fromAI
          ? "Diese persönliche Aufwärmaufgabe zählt nicht für das Bestehen. Danach prüft der eingebaute Grammatik-Generator unabhängig von der KI."
          : `Ziel: ${CHECKPOINT_CORRECT} der letzten ${CHECKPOINT_WINDOW} Aufgaben richtig. Diese Bewertung kommt ausschließlich aus dem eingebauten Grammatik-Generator.`}
      </p>
      <button className="path-review-button" type="button" onClick={onReview}>← Verstehen: Regel und Beispiele nachsehen</button>
      <span className="q-kind">{q.kind}</span>
      <div className="q-prompt"><LevelTag level={module.level} /> <Prompt text={q.prompt} /></div>
      {q.hint && <p className="q-hint">{q.hint}</p>}

      {q.type === "choice" ? (
        <div className="opts">
          {q.options.map((option) => (
            <button
              key={option}
              type="button"
              className={(answered && option === q.answer ? "opt is-ok" : "opt") + (answered && option === given && !correct ? " is-no" : "")}
              disabled={answered}
              onClick={() => judge(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form className="type-row" autoComplete="off" onSubmit={(event) => { event.preventDefault(); judge(typed); }}>
          <input className="type-in" value={typed} disabled={answered} spellCheck="false" onChange={(event) => setTyped(event.target.value)} placeholder="Antwort tippen …" aria-label="Antwort" />
          <button className="btn" type="submit" disabled={answered || !typed.trim()}>Prüfen</button>
        </form>
      )}

      {answered && (
        <div className={"verdict " + (correct ? "v-ok" : "v-no")}>
          <div className="verdict-line">
            {correct ? <><span className="mark"><IconCheckCircle /> richtig</span><span>{q.answer}</span></> : <><span className="mark"><IconCancel /></span><span>Du: <b>{given || "—"}</b> · Richtig: <b>{q.answer}</b></span></>}
          </div>
          <Trace rows={q.trace} />
        </div>
      )}
      <div className="actions">
        {answered ? <button className="btn" type="button" onClick={next}>Nächste Aufgabe</button> : <button className="btn btn-ghost" type="button" onClick={() => judge("")}>Aufgeben</button>}
        {repeating && <button className="btn btn-ghost" type="button" onClick={continueAfterRepeat}>Wiederholung beenden</button>}
      </div>
    </div>
  );
}

function Application({
  module, support, value, review, reviewedText, selectedTask, apiKey, model, mode,
  correctionHistory, onChange, onReview, onSelectTask, onComplete, onOpenSettings,
}) {
  const baseline = React.useMemo(() => applicationTask(module), [module]);
  const task = React.useMemo(() => {
    if (selectedTask) return selectedTask;
    return support?.application ? {
      ...baseline,
      ...support.application,
      source: "ai-support",
      minWords: Math.max(baseline.minWords, support.application.min_words),
      targets: [...new Set([...(baseline.targets || []), ...(support.application.targets || [])])],
    } : baseline;
  }, [baseline, module.title, selectedTask, support]);
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const ready = words >= task.minWords;
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [manualOpen, setManualOpen] = React.useState(false);
  const [manualPaste, setManualPaste] = React.useState("");
  const [activeError, setActiveError] = React.useState(null);
  const [reviewOpen, setReviewOpen] = React.useState(Boolean(review));
  const [reviewFullscreen, setReviewFullscreen] = React.useState(false);
  const [reviewWidth, setReviewWidth] = React.useState(460);
  const [reviewPanelView, setReviewPanelView] = React.useState("review");
  const resizeCleanupRef = React.useRef(null);
  const retryRef = React.useRef(null);
  const stale = Boolean(review && reviewedText !== value);
  const approved = Boolean(review?.approved && !stale);
  const failed = Boolean(review && review.approved === false);
  const retryChoices = React.useMemo(
    () => buildRetryChoices({ module, task, review: failed ? review : null }),
    [failed, module, review, task]
  );
  const correctionTask = React.useMemo(() => ({
    ...task,
    type: "Geführte Schreibanwendung",
    level: module.level,
    checklist: task.targets,
  }), [module.level, task]);
  const manualPrompt = manualCorrectionPrompt({ task: correctionTask, text: value, targetLevel: module.level });

  React.useEffect(() => () => resizeCleanupRef.current?.(), []);

  React.useEffect(() => {
    if (!reviewOpen) setReviewFullscreen(false);
  }, [reviewOpen]);

  React.useEffect(() => {
    if (!reviewOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (reviewFullscreen) setReviewFullscreen(false);
      else setReviewOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reviewFullscreen, reviewOpen]);

  function acceptReview(data) {
    if (!data || !Array.isArray(data.corrections) || typeof data.approved !== "boolean") {
      throw new Error("Die KI-Antwort enthält keine vollständige Korrektur oder Freigabe.");
    }
    const leveledReview = scopeCorrectionToLevel(data, module.level);
    onReview(value, leveledReview);
    setActiveError(null);
    setReviewOpen(true);
    setReviewFullscreen(false);
    setReviewPanelView("review");
    setError("");
    setManualOpen(false);
  }

  async function submitForReview() {
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      acceptReview(await correctWriting({
        apiKey,
        model,
        task: correctionTask,
        text: value,
        targetLevel: module.level,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function acceptManualReview() {
    try {
      acceptReview(extractJson(manualPaste));
      setManualPaste("");
    } catch (err) {
      setError(err.message);
    }
  }

  function selectRetryTask(nextTask) {
    onSelectTask(nextTask, task);
    setActiveError(null);
    setReviewOpen(false);
    setError("");
    setManualOpen(false);
    setManualPaste("");
  }

  function startReviewResize(event) {
    if (reviewFullscreen || window.matchMedia("(max-width: 800px)").matches) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = reviewWidth;
    const move = (moveEvent) => {
      const max = Math.max(420, Math.min(820, window.innerWidth * 0.72));
      setReviewWidth(Math.round(Math.max(360, Math.min(max, startWidth + startX - moveEvent.clientX))));
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      document.body.classList.remove("is-resizing-path-review");
      resizeCleanupRef.current = null;
    };
    resizeCleanupRef.current?.();
    resizeCleanupRef.current = stop;
    document.body.classList.add("is-resizing-path-review");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  }

  const taskLabel = task.source === "ai-retry"
    ? "KI-personalisierte Challenge"
    : task.source === "fallback"
      ? "Vorbereitete Challenge"
      : task.source === "ai-support" || support
        ? "KI-personalisierte Schreibaufgabe"
        : "Vorbereitete Schreibaufgabe";

  return (
    <div className="path-stage path-stage-application">
      <span className="eyebrow">{taskLabel} · {module.level}</span>
      <h2>{task.title}</h2>
      <p className="path-stage-lede">{task.prompt}</p>
      <Callout kind="info">{task.instruction}</Callout>
      <p className="muted path-checkpoint-intro">
        Korrekturmaßstab: {module.level}. Höhere CEFR-Regeln werden weder als Fehler gewertet noch für die Freigabe verlangt.
      </p>
      <div className="path-targets">
        <span className="eyebrow">Darauf konzentrierst du dich</span>
        <ul>{task.targets.map((target) => <li key={target}>{target}</li>)}</ul>
      </div>
      <div className="path-writing-field">
        <span className="eyebrow">Deine Antwort</span>
        <ApplicationEditor
          value={value}
          corrections={review?.corrections || []}
          activeError={activeError}
          onSelectError={setActiveError}
          onChange={(nextValue) => { onChange(nextValue); setActiveError(null); }}
        />
      </div>
      <div className="path-writing-status">
        <span className={ready ? "is-ready" : ""}>{words} / {task.minWords} Wörter</span>
        <Bar value={words / task.minWords} color={ready ? "var(--ok)" : `var(--${module.level.toLowerCase()})`} />
      </div>
      {correctionHistory.length > 0 && !reviewOpen && (
        <div className="path-review-launchers">
          {review && (
            <button className="path-review-reopen" type="button" onClick={() => { setReviewPanelView("review"); setReviewOpen(true); }}>
              Korrektur anzeigen · {review.corrections?.length || 0} Fehler · {review.cefr_estimate || "—"}
            </button>
          )}
          <button className="path-review-history-open" type="button" onClick={() => { setReviewPanelView("history"); setReviewOpen(true); }}>
            Korrekturverlauf · {correctionHistory.length}
          </button>
        </div>
      )}
      {correctionHistory.length > 0 && reviewOpen && (
        <ApplicationCorrectionDrawer
          moduleId={module.id}
          review={review}
          history={correctionHistory}
          stale={stale}
          activeError={activeError}
          width={reviewWidth}
          fullscreen={reviewFullscreen}
          view={reviewPanelView}
          onResizeStart={startReviewResize}
          onToggleFullscreen={() => setReviewFullscreen((current) => !current)}
          onClose={() => setReviewOpen(false)}
          onView={setReviewPanelView}
          onSelectError={setActiveError}
        />
      )}
      {failed && !stale && (
        <RetryChallenges
          sectionRef={retryRef}
          choices={retryChoices}
          onSelect={selectRetryTask}
        />
      )}
      {error && <Callout kind="bad">{error}</Callout>}
      {mode === "api" && !apiKey && (
        <Callout kind="bad">
          Verbinde zuerst die KI in den Einstellungen, damit Frau Müller deinen Text prüfen kann.
          <button className="btn btn-ghost btn-sm" type="button" onClick={onOpenSettings}>Einstellungen öffnen</button>
        </Callout>
      )}
      {mode === "api" && !apiKey && !failed && !value.trim() && (
        <RetryChallenges
          choices={applicationFallbackTasks(module, task, 2)}
          onSelect={selectRetryTask}
          offline
        />
      )}
      {mode === "manual" && manualOpen && (
        <div className="path-application-manual">
          <div className="path-ai-manual-head"><span className="eyebrow">1 · Prompt kopieren</span><CopyButton text={manualPrompt} /></div>
          <textarea className="copybox" readOnly value={manualPrompt} onFocus={(event) => event.target.select()} />
          <span className="eyebrow">2 · JSON-Korrektur einfügen</span>
          <textarea className="copybox" value={manualPaste} onChange={(event) => setManualPaste(event.target.value)} placeholder='{"approved":true,"corrections":[]}' />
          <button className="btn btn-sm" type="button" disabled={!manualPaste.trim()} onClick={acceptManualReview}>Korrektur übernehmen</button>
        </div>
      )}
      {!review && <div className="actions">
        {mode === "api" ? (
          <button className="btn" type="button" disabled={!ready || busy || !apiKey} onClick={submitForReview}>
            {busy ? <><Spinner /> Frau Müller korrigiert …</> : "Von Frau Müller prüfen lassen"}
          </button>
        ) : (
          <button className="btn" type="button" disabled={!ready} onClick={() => setManualOpen((open) => !open)}>
            {manualOpen ? "Prompt schließen" : "KI-Korrektur starten"}
          </button>
        )}
        {!ready && <span className="dim">Noch {task.minWords - words} Wörter—bleib nur bei dieser Aufgabe.</span>}
        {ready && <span className="dim">Der Text muss vor dem Abschluss von der KI-Lehrerin freigegeben werden.</span>}
      </div>}
      {review && (
        <ApplicationOutcome
          kind={stale ? "stale" : approved ? "passed" : "failed"}
          review={review}
          busy={busy}
          primaryDisabled={stale && mode === "api" && (!ready || !apiKey)}
          primaryLabel={stale
            ? busy ? "Frau Müller korrigiert …" : mode === "api" ? "Neue Fassung prüfen lassen" : manualOpen ? "Prompt schließen" : "KI-Korrektur starten"
            : approved ? "Lernblock abschließen und weiter" : "Neue Challenge wählen"}
          onPrimary={stale
            ? mode === "api" ? submitForReview : () => setManualOpen((open) => !open)
            : approved ? onComplete : () => retryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          secondaryLabel={stale || failed ? "Korrektur öffnen" : mode === "api" ? "Erneut prüfen" : null}
          onSecondary={stale || failed
            ? () => { setReviewPanelView("review"); setReviewOpen(true); }
            : mode === "api" ? submitForReview : undefined}
        />
      )}
    </div>
  );
}

function normalizeAIRetryTask(item, index, module, currentTask) {
  if (!item?.title || !item?.prompt || !Array.isArray(item.targets) || !item.targets.length) return null;
  const minWords = Math.max(20, Math.min(180, Number(item.min_words) || currentTask.minWords));
  return {
    id: `${module.id}:ai-retry:${Date.now()}:${index}`,
    source: "ai-retry",
    title: String(item.title),
    prompt: String(item.prompt),
    instruction: String(item.instruction || "Bearbeite die neue Challenge und erfülle alle genannten Punkte."),
    minWords,
    targets: [...new Set([...(currentTask.targets || [module.title]), ...item.targets.map(String)])].slice(0, 8),
  };
}

function buildRetryChoices({ module, task, review }) {
  const choices = (review?.retry_tasks || [])
    .map((item, index) => normalizeAIRetryTask(item, index, module, task))
    .filter(Boolean)
    .filter((item, index, all) => item.title !== task.title && all.findIndex((other) => other.title === item.title) === index)
    .slice(0, 2);
  const usedTitles = new Set([task.title, ...choices.map((item) => item.title)]);
  for (const fallback of applicationFallbackTasks(module, task, 3)) {
    if (choices.length >= 2) break;
    if (!usedTitles.has(fallback.title)) {
      choices.push(fallback);
      usedTitles.add(fallback.title);
    }
  }
  return choices.slice(0, 2);
}

function RetryChallenges({ choices, onSelect, offline = false, sectionRef }) {
  if (!choices.length) return null;
  const personalized = choices.some((choice) => choice.source === "ai-retry");
  return (
    <section className="path-retry-challenges" aria-label="Neue Schreib-Challenges" ref={sectionRef}>
      <div className="path-retry-heading">
        <div>
          <span className="eyebrow">{offline ? "Ohne KI verfügbar" : "Nächster Versuch"}</span>
          <h3>{offline ? "Wähle ein vorbereitetes anderes Thema" : "Wähle eine neue Challenge"}</h3>
        </div>
        <span className={personalized ? "path-retry-source is-ai" : "path-retry-source"}>
          {personalized ? "KI-personalisiert" : "vorbereitet"}
        </span>
      </div>
      <p>
        {offline
          ? "Diese Themen funktionieren ohne KI-Verbindung und haben andere Challenge-Punkte."
          : personalized
            ? "Die letzte Korrektur wurde nicht freigegeben. Frau Müller hat daraus zwei neue Themen erstellt, mit denen du die noch offenen Punkte gezielt übst. Dein bisheriger Versuch bleibt gespeichert."
            : "Die letzte Korrektur wurde nicht freigegeben. Die KI hat keine neuen Themen geliefert, deshalb stehen dir zwei vorbereitete Alternativen zum erneuten Üben zur Verfügung. Dein bisheriger Versuch bleibt gespeichert."}
      </p>
      <div className="path-retry-grid">
        {choices.map((choice, index) => (
          <article key={choice.id || `${choice.title}-${index}`} className={choice.source === "ai-retry" ? "is-ai" : ""}>
            <span className="eyebrow">{choice.source === "ai-retry" ? "KI-personalisierte" : "Vorbereitete"} Challenge · Option {index + 1}</span>
            <h4>{choice.title}</h4>
            <p>{choice.prompt}</p>
            <span className="path-retry-expectation">Das wird erwartet</span>
            <ul>{choice.targets.map((target) => <li key={target}>{target}</li>)}</ul>
            <div className="path-retry-footer">
              <span>{choice.minWords}+ Wörter</span>
              <button className="btn btn-sm" type="button" onClick={() => onSelect(choice)}>Diese Challenge starten</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApplicationOutcome({
  kind,
  review,
  busy,
  primaryDisabled,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) {
  const errors = review.corrections?.length || 0;
  const copy = kind === "passed" ? {
    kicker: "Aktueller Stand · bestanden",
    title: "Bestanden! Bereit, den Lernblock abzuschließen?",
    description: "Die Korrektur hat deine gemeinsame Block-Anwendung freigegeben.",
  } : kind === "stale" ? {
    kicker: "Aktueller Stand · Prüfung offen",
    title: "Deine neue Fassung muss noch geprüft werden",
    description: "Du hast den Text nach der letzten Korrektur verändert. Die frühere Bewertung bleibt gespeichert, gilt aber nicht mehr für diese Fassung.",
  } : {
    kicker: "Aktueller Stand · neuer Versuch nötig",
    title: "Noch nicht bestanden",
    description: `Du sollst die Aufgabe wiederholen, weil die letzte Korrektur deinen Text nicht freigegeben hat${errors ? ` und ${errors} zu korrigierende ${errors === 1 ? "Stelle" : "Stellen"} gefunden wurden` : ""}.`,
  };
  const reason = kind !== "stale" && (review.approval_reason || review.cefr_reasoning);

  return (
    <section className={`path-application-outcome is-${kind}`} aria-live="polite">
      <div className="path-outcome-icon">
        {kind === "passed" ? <IconCheckCircle /> : kind === "stale" ? <IconWarning /> : <IconCancel />}
      </div>
      <div className="path-outcome-copy">
        <span className="eyebrow">{copy.kicker}</span>
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
        {reason && <p className="path-outcome-reason"><strong>Warum?</strong> {reason}</p>}
        <div className="path-outcome-meta mono">
          <span>Bewertet auf {review.target_level || "—"}</span>
          <span>Textniveau {review.cefr_estimate || "—"}</span>
          <span>{errors} {errors === 1 ? "Korrektur" : "Korrekturen"}</span>
        </div>
      </div>
      <div className="path-outcome-actions">
        <button className="btn" type="button" disabled={primaryDisabled || busy} onClick={onPrimary}>
          {busy && kind === "stale" && <Spinner />} {primaryLabel}
        </button>
        {secondaryLabel && <button className="btn btn-ghost" type="button" disabled={busy} onClick={onSecondary}>{secondaryLabel}</button>}
      </div>
    </section>
  );
}

const APPLICATION_TIP_GRACE_MS = 260;

function ApplicationErrorTooltip({ correction }) {
  if (!correction) return null;
  return (
    <div className="err-tip path-error-tip" role="tooltip">
      <div className="err-tip-row">
        <span className="err-tip-sev" data-sev={correction.severity}>{correction.severity}</span>
        <span className="err-tip-type">{correction.type}</span>
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

function ApplicationEditor({ value, corrections, activeError, onSelectError, onChange }) {
  const textareaRef = React.useRef(null);
  const highlightRef = React.useRef(null);
  const gutterRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const closeTipRef = React.useRef(0);
  const ranges = React.useMemo(() => buildErrorRanges(value, corrections), [value, corrections]);
  const segments = React.useMemo(() => buildSegments(value, ranges, activeError), [value, ranges, activeError]);
  const lines = React.useMemo(() => applicationSegmentsToLines(segments), [segments]);
  const [lineHeights, setLineHeights] = React.useState([]);
  const [hoveredError, setHoveredError] = React.useState(null);

  React.useLayoutEffect(() => {
    const highlight = highlightRef.current;
    if (!highlight) return undefined;
    const measure = () => {
      const heights = Array.from(highlight.querySelectorAll(".hl-line")).map((line) => line.offsetHeight);
      setLineHeights((previous) => previous.length === heights.length && previous.every((height, index) => height === heights[index])
        ? previous
        : heights);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(highlight);
    return () => observer.disconnect();
  }, [lines]);

  function syncScroll() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = textarea.scrollTop;
    hideTip();
  }

  function keepTip() {
    window.clearTimeout(closeTipRef.current);
  }

  function hideTip() {
    window.clearTimeout(closeTipRef.current);
    setHoveredError(null);
  }

  function scheduleHideTip() {
    window.clearTimeout(closeTipRef.current);
    closeTipRef.current = window.setTimeout(() => setHoveredError(null), APPLICATION_TIP_GRACE_MS);
  }

  function showTip(mark, index) {
    const main = mainRef.current;
    if (!mark || !main) return;
    const rect = mark.getBoundingClientRect();
    const container = main.getBoundingClientRect();
    const flip = rect.bottom - container.top + 180 > container.height && rect.top - container.top > 180;
    keepTip();
    setHoveredError({
      index,
      top: (flip ? rect.top : rect.bottom) - container.top,
      left: Math.max(0, Math.min(rect.left - container.left, container.width - 340)),
      above: flip,
    });
    onSelectError?.(index);
  }

  React.useEffect(() => () => window.clearTimeout(closeTipRef.current), []);

  const hoveredCorrection = hoveredError ? corrections[hoveredError.index] : null;

  return (
    <div className="path-application-editor">
      <div className="path-application-editor-head mono">
        <span><span className="ide-ext">§</span>anwendung.de</span>
        <span>Deutsch · UTF-8</span>
      </div>
      <div className="path-application-code">
        <div className="path-application-gutter mono" ref={gutterRef} aria-hidden="true">
          {lines.map((_, index) => <span key={index} style={lineHeights[index] ? { height: lineHeights[index] } : undefined}>{index + 1}</span>)}
        </div>
        <div className="path-application-code-main" ref={mainRef} onMouseLeave={scheduleHideTip}>
          <pre className="path-application-highlight" ref={highlightRef} aria-hidden="true">
            {lines.map((line, index) => (
              <div className="hl-line" key={index}>
                {line.length ? renderApplicationSegments(
                  line,
                  (event, errorIndex) => showTip(event.currentTarget, errorIndex),
                  scheduleHideTip,
                  (event, errorIndex) => { event.preventDefault(); showTip(event.currentTarget, errorIndex); }
                ) : "​"}
              </div>
            ))}
          </pre>
          <textarea
            ref={textareaRef}
            className="path-application-input"
            value={value}
            onChange={(event) => { hideTip(); onChange(event.target.value); }}
            onScroll={syncScroll}
            placeholder="// Schreibe hier auf Deutsch …"
            spellCheck="false"
            aria-label="Deine Antwort"
          />
          {hoveredError && hoveredCorrection && (
            <div
              className={`err-tip-anchor path-error-tip-anchor${hoveredError.above ? " is-above" : ""}`}
              style={{ top: hoveredError.top, left: hoveredError.left }}
              onMouseEnter={keepTip}
              onMouseLeave={scheduleHideTip}
            >
              <ApplicationErrorTooltip correction={hoveredCorrection} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function applicationSegmentsToLines(segments) {
  const lines = [[]];
  const put = (segment) => lines[lines.length - 1].push(segment);
  const breakLine = () => lines.push([]);
  for (const segment of segments) {
    if (!segment.error) {
      segment.text.split("\n").forEach((part, index) => {
        if (index > 0) breakLine();
        if (part) put({ ...segment, text: part });
      });
      continue;
    }
    let children = [];
    const flush = () => {
      if (children.length) put({ ...segment, children });
      children = [];
    };
    for (const child of segment.children) {
      child.text.split("\n").forEach((part, index) => {
        if (index > 0) { flush(); breakLine(); }
        if (part) children.push({ ...child, text: part });
      });
    }
    flush();
  }
  return lines;
}

function renderApplicationSegments(segments, onErrorEnter, onErrorLeave, onErrorClick) {
  return segments.map((segment, index) => {
    if (segment.error) {
      return (
        <mark
          key={index}
          className={`hl-err sev-${segment.severity}${segment.active ? " is-active" : ""}`}
          onPointerEnter={(event) => onErrorEnter?.(event, segment.index)}
          onPointerLeave={onErrorLeave}
          onClick={(event) => onErrorClick?.(event, segment.index)}
        >
          {segment.children.map((child, childIndex) => child.cls
            ? <span key={childIndex} className={child.cls}>{child.text}</span>
            : <React.Fragment key={childIndex}>{child.text}</React.Fragment>)}
        </mark>
      );
    }
    return segment.cls
      ? <span key={index} className={segment.cls}>{segment.text}</span>
      : <React.Fragment key={index}>{segment.text}</React.Fragment>;
  });
}

const SCORE_LABELS = {
  aufgabe: "Aufgabe",
  kohaerenz: "Aufbau",
  wortschatz: "Wortschatz",
  grammatik: "Grammatik",
  register: "Stil",
};

function ApplicationCorrectionDrawer({
  moduleId,
  review,
  history,
  stale,
  activeError,
  width,
  fullscreen,
  view,
  onResizeStart,
  onToggleFullscreen,
  onClose,
  onView,
  onSelectError,
}) {
  const currentEntry = history.find((entry) => entry.moduleId === moduleId && entry.kind === "current") || null;
  const [selectedEntryId, setSelectedEntryId] = React.useState(currentEntry?.id || history[0]?.id || null);
  const selectedEntry = history.find((entry) => entry.id === selectedEntryId) || currentEntry || history[0] || null;
  const showingCurrent = Boolean(selectedEntry && currentEntry && selectedEntry.id === currentEntry.id);

  React.useEffect(() => {
    if (currentEntry && view === "review") setSelectedEntryId(currentEntry.id);
  }, [currentEntry?.id, view]);

  function showHistoryEntry(entry) {
    setSelectedEntryId(entry.id);
    onView("review");
  }

  return (
    <aside
      className={`path-correction-drawer${fullscreen ? " is-fullscreen" : ""}`}
      style={fullscreen ? undefined : { "--path-review-width": `${width}px` }}
      aria-label="Korrektur deiner Schreibanwendung"
    >
      <div
        className="path-correction-resizer"
        role="separator"
        aria-label="Breite der Korrektur-Seitenleiste ändern"
        aria-orientation="vertical"
        aria-valuenow={width}
        onPointerDown={onResizeStart}
      />
      <header className="path-correction-drawer-head">
        <div>
          <span className="eyebrow">Lernpfad · Schreibkorrektur</span>
          <strong>Deine Auswertung</strong>
        </div>
        <div className="path-correction-drawer-tools">
          <button
            className="ide-icon"
            type="button"
            title={fullscreen ? "Vollbild verlassen" : "Im Vollbild öffnen"}
            aria-label={fullscreen ? "Vollbild verlassen" : "Korrektur im Vollbild öffnen"}
            onClick={onToggleFullscreen}
          >
            {fullscreen ? <IconFullscreenExit /> : <IconFullscreen />}
          </button>
          <button className="ide-icon" type="button" title="Korrektur schließen" aria-label="Korrektur schließen" onClick={onClose}>
            <IconClose />
          </button>
        </div>
      </header>
      <nav className="path-correction-tabs" aria-label="Korrekturbereiche">
        <button
          type="button"
          className={view === "review" ? "is-active" : ""}
          disabled={!selectedEntry}
          onClick={() => {
            if (currentEntry) setSelectedEntryId(currentEntry.id);
            onView("review");
          }}
        >
          {showingCurrent ? "Aktuelle Korrektur" : "Korrektur"}
        </button>
        <button type="button" className={view === "history" ? "is-active" : ""} onClick={() => onView("history")}>
          Verlauf <span>{history.length}</span>
        </button>
      </nav>
      <div className="path-correction-drawer-body">
        {view === "history" ? (
          <CorrectionHistory entries={history} currentEntryId={currentEntry?.id} onSelect={showHistoryEntry} />
        ) : selectedEntry ? (
          <>
            {!showingCurrent && <CorrectionArchiveContext entry={selectedEntry} />}
            <ApplicationReview
              review={showingCurrent ? review : selectedEntry.review}
              stale={showingCurrent ? stale : false}
              activeError={showingCurrent ? activeError : null}
              readOnly={!showingCurrent}
              onSelectError={showingCurrent ? (index) => {
                onSelectError(index);
                if (index != null && fullscreen) onToggleFullscreen();
              } : undefined}
            />
          </>
        ) : (
          <p className="path-correction-history-empty">Noch keine Korrekturen gespeichert.</p>
        )}
      </div>
    </aside>
  );
}

function CorrectionHistory({ entries, currentEntryId, onSelect }) {
  return (
    <section className="path-correction-history" aria-label="Gespeicherte Korrekturen">
      <header>
        <span className="eyebrow">Gespeichert im Lernpfad</span>
        <h3>Deine Korrekturen</h3>
        <p>Aktuelle Korrekturen und frühere Versuche bleiben hier erhalten.</p>
      </header>
      <div className="path-correction-history-list">
        {entries.map((entry) => (
          <button key={entry.id} type="button" onClick={() => onSelect(entry)}>
            <span>
              <LevelTag level={entry.level} />
              <strong>{entry.taskTitle}</strong>
              {entry.id === currentEntryId && <small>Aktuell</small>}
            </span>
            <span>{entry.moduleTitle}</span>
            <span className="mono">
              {entry.at ? new Date(entry.at).toLocaleDateString("de-DE") : "Gespeichert"}
              {` · ${entry.review.corrections?.length || 0} Fehler · ${entry.review.cefr_estimate || "—"}`}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CorrectionArchiveContext({ entry }) {
  return (
    <div className="path-correction-archive-context">
      <span className="eyebrow">Gespeicherte Korrektur</span>
      <strong>{entry.taskTitle}</strong>
      <span>{entry.moduleTitle} · {entry.level}{entry.at ? ` · ${new Date(entry.at).toLocaleDateString("de-DE")}` : ""}</span>
    </div>
  );
}

function ApplicationReview({ review, stale, activeError, readOnly = false, onSelectError }) {
  const corrections = Array.isArray(review.corrections) ? review.corrections : [];
  const effectiveApproval = review.approved && !stale;
  return (
    <section className={`path-application-review ${effectiveApproval ? "is-approved" : "is-revision"}`} aria-label="KI-Korrektur">
      <header>
        <div>
          <span className="eyebrow">Korrektur von Frau Müller</span>
          <h3>{effectiveApproval ? "Bestanden — Lernblock freigegeben" : stale ? "Erneute Prüfung erforderlich" : "Noch einmal überarbeiten"}</h3>
        </div>
        <span className="path-review-level" title={`Bewertet nach ${review.target_level || "dem aktuellen"} Niveau`}>
          Ziel {review.target_level || "—"} · Text {review.cefr_estimate || "—"}
        </span>
      </header>
      {stale && <p className="path-review-stale">Diese Korrektur gehört zur vorherigen Textfassung. Deine Ergebnisse bleiben sichtbar, aber die Freigabe ist pausiert.</p>}
      <p className="path-review-reason">{review.approval_reason || review.cefr_reasoning}</p>
      {review.scores?.length > 0 && (
        <div className="path-review-scores">
          {review.scores.map((score) => (
            <div key={score.criterion} title={score.comment}>
              <span>{SCORE_LABELS[score.criterion] || score.criterion}</span>
              <strong>{score.score}/5</strong>
              <i><b style={{ width: `${Math.max(0, Math.min(5, score.score)) * 20}%` }} /></i>
            </div>
          ))}
        </div>
      )}
      <div className="path-review-columns">
        <div>
          <span className="eyebrow">Das war richtig</span>
          {review.strengths?.length > 0
            ? <ul>{review.strengths.map((strength, index) => <li key={index}>{strength}</li>)}</ul>
            : <p className="muted">Die erfüllten Kriterien siehst du in der Bewertung oben.</p>}
        </div>
        <div>
          <span className="eyebrow">Das solltest du korrigieren · {corrections.length}</span>
          {corrections.length === 0
            ? <p className="path-review-no-errors"><IconCheckCircle /> Keine Einzelfehler markiert.</p>
            : <div className="path-review-corrections">
              {corrections.map((correction, index) => (
                <button
                  key={`${correction.original}-${index}`}
                  type="button"
                  className={(activeError === index ? "is-active" : "") + (readOnly ? " is-archived" : "")}
                  onClick={() => onSelectError?.(activeError === index ? null : index)}
                  disabled={readOnly}
                  title={readOnly ? "Gespeicherte Korrektur" : "Fehler im Text markieren"}
                >
                  <span><b>{correction.type}</b><small>{correction.severity}</small></span>
                  <del>{correction.original}</del>
                  <ins>{correction.corrected}</ins>
                  <em>{correction.why}</em>
                </button>
              ))}
            </div>}
        </div>
      </div>
      {review.next_steps?.length > 0 && (
        <footer><span className="eyebrow">Nächster Schritt</span><p>{review.next_steps[0]}</p></footer>
      )}
    </section>
  );
}

function Completion({ module, block, isLast, onAdvance, onOpenSettings }) {
  const blockFinished = block.isEnd;
  return (
    <div className="path-stage path-stage-success">
      <span className="path-success-mark"><IconCheckCircle /></span>
      <span className="eyebrow">{blockFinished ? `Lernblock ${block.id} abgeschlossen` : "Kapitel abgeschlossen"}</span>
      <h2>{module.title} ist geschafft.</h2>
      <p className="muted">{blockFinished
        ? `Du hast alle Kapitel aus ${block.id} „${block.title}“ gelernt und gemeinsam im Schreiben angewendet.`
        : `Der Checkpoint ist bestanden. Die Schreibanwendung folgt nach Kapitel ${block.moduleIds.length} dieses Lernblocks.`}</p>
      <div className="actions">
        {!isLast ? <button className="btn" type="button" onClick={onAdvance}>Nächste Lektion anzeigen</button> : <span><LevelTag level="C1" /> Du hast den gesamten Lernpfad erreicht.</span>}
        <button className="btn btn-ghost" type="button" onClick={onOpenSettings}>Niveau wechseln</button>
      </div>
    </div>
  );
}
