// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import { LEVEL_INFO } from "../data/curriculum.js";
import { generate } from "../engine/drills.js";
import { answersMatch } from "../engine/grammar.js";
import {
  CHECKPOINT_CORRECT,
  CHECKPOINT_WINDOW,
  applicationTask,
  checkpointPassed,
  checkpointRules,
  learningProfile,
  learningPathStats,
  learningStep,
} from "../lib/learningPath.js";
import {
  extractJson,
  generateLearningSupport,
  manualLearningSupportPrompt,
  normalizeLearningSupport,
} from "../lib/claude.js";
import { ModuleContent } from "./Learn.jsx";
import { Bar, Callout, CopyButton, LevelTag, Prompt, Spinner, Trace } from "./ui.jsx";
import { IconCancel, IconCheckCircle } from "./icons.jsx";

const STEPS = [
  { id: "intro", label: "Einführung" },
  { id: "learn", label: "Verstehen" },
  { id: "practice", label: "Üben" },
  { id: "apply", label: "Anwenden" },
];

export default function LearningPath({
  progress,
  apiKey,
  model,
  mode,
  onRead,
  onCheckpointAnswer,
  onStep,
  onSaveApplication,
  onSaveAISupport,
  onComplete,
  onAdvance,
  onOpenSettings,
}) {
  const path = progress.learningPath;
  const stats = learningPathStats(path);
  const mod = stats.current;
  const savedStep = learningStep(path, mod.id);
  const [viewStep, setViewStep] = React.useState(null);
  const step = viewStep || savedStep;
  const checkpoint = path.checkpoints?.[mod.id] || { recent: [] };
  const application = path.applications?.[mod.id] || { text: "" };
  const aiSupport = path.aiSupport?.[mod.id] || null;
  const profile = React.useMemo(() => learningProfile(progress, mod), [progress, mod]);

  React.useEffect(() => {
    if (step === "learn") onRead(mod.id);
  }, [mod.id, onRead, step]);

  React.useEffect(() => { setViewStep(null); }, [mod.id]);

  const savedIndex = savedStep === "complete" ? STEPS.length : STEPS.findIndex((item) => item.id === savedStep);
  const activeIndex = step === "complete" ? STEPS.length : STEPS.findIndex((item) => item.id === step);

  function openReachedStep(nextStep) {
    const nextIndex = STEPS.findIndex((item) => item.id === nextStep);
    if (savedStep === "complete" || nextIndex <= savedIndex) {
      setViewStep(nextStep === savedStep ? null : nextStep);
    }
  }

  function continueTo(nextStep) {
    const nextIndex = STEPS.findIndex((item) => item.id === nextStep);
    if (savedStep === "complete" || nextIndex < savedIndex) setViewStep(nextStep);
    else if (nextIndex === savedIndex) setViewStep(null);
    else {
      setViewStep(null);
      onStep(mod.id, nextStep);
    }
  }

  function finishApplication() {
    if (savedStep === "complete") setViewStep(null);
    else onComplete(mod.id);
  }

  return (
    <section className="card path-window" aria-labelledby="path-window-title">
      <header className="path-window-head">
        <div className="path-window-title">
          <span className="eyebrow">Lernmodus · Kapitel {stats.currentIndex + 1} von {stats.total}</span>
          <h1 id="path-window-title"><LevelTag level={mod.level} /> {mod.title}</h1>
          <span className={aiSupport ? "path-ai-status is-active" : "path-ai-status"}>
            KI-Lernbegleiter {aiSupport ? "· personalisiert" : "· optional"}
          </span>
          <p>{LEVEL_INFO[mod.level].blurb}</p>
        </div>
        <div className="path-window-progress">
          <span className="mono">{stats.levelCompleted}/{stats.levelTotal} auf {mod.level}</span>
          <Bar value={stats.levelPercent / 100} color={`var(--${mod.level.toLowerCase()})`} />
          <button className="path-settings-link" type="button" onClick={onOpenSettings}>Niveau oder Modus ändern</button>
        </div>
      </header>

      <ol className="path-window-steps" aria-label="Ablauf dieses Kapitels">
        {STEPS.map((item, index) => {
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
            onClick={() => openReachedStep(STEPS[activeIndex - 1].id)}
          >
            ← Zurück zu {STEPS[activeIndex - 1].label}
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
            onSaveSupport={(support) => onSaveAISupport(mod.id, support)}
            onOpenSettings={onOpenSettings}
            onContinue={() => continueTo("learn")}
          />
        </div>

        {savedIndex >= 1 && (
          <div hidden={step !== "learn"}>
            <Lesson module={mod} support={aiSupport} onContinue={() => continueTo("practice")} />
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
              onAnswer={(ruleId, correct) => onCheckpointAnswer(mod.id, ruleId, correct)}
              onReview={() => openReachedStep("learn")}
              onContinue={() => continueTo("apply")}
            />
          </div>
        )}

        {savedIndex >= 3 && (
          <div hidden={step !== "apply"}>
            <Application
              module={mod}
              support={aiSupport}
              value={application.text || ""}
              onChange={(text) => onSaveApplication(mod.id, text)}
              onComplete={finishApplication}
            />
          </div>
        )}

        {step === "complete" && (
          <Completion module={mod} isLast={stats.isLast} onAdvance={onAdvance} onOpenSettings={onOpenSettings} />
        )}
      </div>
    </section>
  );
}

function Introduction({
  module, profile, support, apiKey, model, mode, onSaveSupport, onOpenSettings, onContinue,
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
          <li>Du benutzt die Regel in einem kurzen, vorbereiteten Schreibauftrag.</li>
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

function Lesson({ module, support, onContinue }) {
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
        <button className="btn" type="button" onClick={onContinue}>Jetzt üben</button>
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

function PathCheckpoint({ module, checkpoint, passed, support, onAnswer, onReview, onContinue }) {
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

  function next() {
    const nextPersonalIndex = personalIndex + 1;
    if (nextPersonalIndex < personalized.length) {
      setPersonalIndex(nextPersonalIndex);
      setQ(personalized[nextPersonalIndex]);
    } else {
      const ruleId = rules[Math.floor(Math.random() * rules.length)] || rules[0];
      setQ(generate(ruleId));
    }
    setAnswered(false);
    setGiven("");
    setCorrect(false);
    setTyped("");
  }

  function judge(value) {
    if (answered || passed) return;
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

  if (passed) {
    return (
      <div className="path-stage path-stage-success">
        <span className="path-success-mark"><IconCheckCircle /></span>
        <span className="eyebrow">Übung bestanden</span>
        <h2>Die Regel sitzt. Jetzt setzt du sie selbst ein.</h2>
        <p className="muted">Die nächste Aufgabe ist bereits vorbereitet und erscheint hier im selben Lernfenster.</p>
        <div className="actions">
          <button className="btn" type="button" onClick={onContinue}>Zur Schreibaufgabe</button>
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
          {q.fromAI
            ? `KI-Warm-up ${personalIndex + 1}/${personalized.length}`
            : `${recentCorrect}/${CHECKPOINT_CORRECT} richtig · ${recent.length}/${CHECKPOINT_WINDOW}`}
        </span>
      </div>
      <p className="muted path-checkpoint-intro">
        {q.fromAI
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
      </div>
    </div>
  );
}

function Application({ module, support, value, onChange, onComplete }) {
  const baseline = applicationTask(module);
  const task = support?.application ? {
    ...baseline,
    ...support.application,
    minWords: Math.max(baseline.minWords, support.application.min_words),
    targets: [...new Set([module.title, ...(support.application.targets || [])])],
  } : baseline;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const ready = words >= task.minWords;

  return (
    <div className="path-stage path-stage-application">
      <span className="eyebrow">{support ? "KI-personalisierte" : "Vorbereitete"} Schreibaufgabe · {module.level}</span>
      <h2>{task.title}</h2>
      <p className="path-stage-lede">{task.prompt}</p>
      <Callout kind="info">{task.instruction}</Callout>
      <div className="path-targets">
        <span className="eyebrow">Darauf konzentrierst du dich</span>
        <ul>{task.targets.map((target) => <li key={target}>{target}</li>)}</ul>
      </div>
      <label className="path-writing-field">
        <span className="eyebrow">Deine Antwort</span>
        <textarea
          className="input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Schreibe hier auf Deutsch …"
          spellCheck="true"
        />
      </label>
      <div className="path-writing-status">
        <span className={ready ? "is-ready" : ""}>{words} / {task.minWords} Wörter</span>
        <Bar value={words / task.minWords} color={ready ? "var(--ok)" : `var(--${module.level.toLowerCase()})`} />
      </div>
      <div className="actions">
        <button className="btn" type="button" disabled={!ready} onClick={onComplete}>Kapitel abschließen</button>
        {!ready && <span className="dim">Noch {task.minWords - words} Wörter—bleib nur bei dieser Aufgabe.</span>}
      </div>
    </div>
  );
}

function Completion({ module, isLast, onAdvance, onOpenSettings }) {
  return (
    <div className="path-stage path-stage-success">
      <span className="path-success-mark"><IconCheckCircle /></span>
      <span className="eyebrow">Kapitel abgeschlossen</span>
      <h2>{module.title} ist geschafft.</h2>
      <p className="muted">Übung und Anwendung wurden lokal in diesem Browser gespeichert.</p>
      <div className="actions">
        {!isLast ? <button className="btn" type="button" onClick={onAdvance}>Nächste Lektion anzeigen</button> : <span><LevelTag level="C1" /> Du hast den gesamten Lernpfad erreicht.</span>}
        <button className="btn btn-ghost" type="button" onClick={onOpenSettings}>Niveau wechseln</button>
      </div>
    </div>
  );
}
