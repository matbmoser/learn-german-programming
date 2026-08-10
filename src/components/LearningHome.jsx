// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import { LEVELS, MODULES } from "../data/curriculum.js";
import { RULES } from "../engine/drills.js";
import { currentStreakDays } from "../lib/storage.js";
import { learningPathStats, learningStep } from "../lib/learningPath.js";
import { Bar, LevelTag } from "./ui.jsx";
import { IconArrowRight, IconCheckCircle, IconWarning } from "./icons.jsx";

const STEP_COPY = {
  intro: { label: "Einführung", action: "Lektion starten" },
  learn: { label: "Verstehen", action: "Weiterlernen" },
  practice: { label: "Üben", action: "Übung fortsetzen" },
  apply: { label: "Anwenden", action: "Schreibaufgabe fortsetzen" },
  exam: { label: "Niveauprüfung", action: "Niveauprüfung fortsetzen" },
  complete: { label: "Abgeschlossen", action: "Nächstes Kapitel" },
};

export default function LearningHome({ progress, onContinue }) {
  const stats = learningPathStats(progress.learningPath);
  const step = learningStep(progress.learningPath, stats.current.id);
  const stepCopy = STEP_COPY[step];
  const answered = progress.totals?.answered || 0;
  const correct = progress.totals?.correct || 0;
  const exerciseErrors = Math.max(0, answered - correct);
  const accuracy = answered ? Math.round((correct / answered) * 100) : null;
  const streak = currentStreakDays(progress);
  const completed = progress.learningPath?.completed || {};
  const nextModule = MODULES[stats.currentIndex + 1] || null;
  const courseComplete = step === "complete" && stats.isLast;

  const errorRules = RULES
    .map((rule) => {
      const score = progress.mastery?.[rule.id] || { r: 0, t: 0 };
      return { ...rule, correct: score.r, answered: score.t, errors: Math.max(0, score.t - score.r) };
    })
    .filter((rule) => rule.errors > 0)
    .sort((a, b) => b.errors - a.errors || a.correct / a.answered - b.correct / b.answered)
    .slice(0, 4);

  const latestWriting = progress.writings?.[progress.writings.length - 1] || null;
  const latestWritingDate = latestWriting?.at ? new Date(latestWriting.at) : null;
  const hasWritingDate = latestWritingDate && !Number.isNaN(latestWritingDate.getTime());
  const writingErrors = latestWriting?.feedback?.corrections?.length || 0;
  const writingPatterns = (latestWriting?.feedback?.error_patterns || []).slice(0, 3);

  const levelRows = LEVELS.map((level) => {
    const modules = MODULES.filter((module) => module.level === level);
    const done = modules.filter((module) => completed[module.id]).length;
    return { level, done, total: modules.length, active: stats.current.level === level };
  });

  const activity = lastSevenDays(progress.days || {});
  const maxActivity = Math.max(1, ...activity.map((day) => day.count));

  return (
    <div className="learning-home">
      <section className="learning-home-hero" aria-labelledby="learning-home-title">
        <div>
          <span className="eyebrow">Willkommen zurück</span>
          <h1 id="learning-home-title">Dein Deutsch-Lernplan</h1>
          <p>
            Du bist bei Kapitel {stats.currentIndex + 1} von {stats.total}. Mach dort weiter,
            wo du aufgehört hast.
          </p>
        </div>

        <div className="learning-home-resume">
          <div className="learning-home-resume-top">
            <span className="eyebrow">{courseComplete ? "Kurs abgeschlossen" : "Als Nächstes"}</span>
            <span className="mono">{stats.percent}%</span>
          </div>
          <h2><LevelTag level={stats.current.level} /> {stats.current.title}</h2>
          <p>
            {courseComplete
              ? "Du hast alle Kapitel des Lernpfads abgeschlossen."
              : step === "complete" && nextModule
                ? `${nextModule.level} · ${nextModule.title}`
                : `Aktueller Schritt: ${stepCopy.label}`}
          </p>
          <Bar value={stats.percent / 100} color="var(--nom)" />
          <button className="btn learning-home-continue" type="button" onClick={onContinue}>
            {courseComplete ? "Abschluss ansehen" : stepCopy.action} <IconArrowRight />
          </button>
        </div>
      </section>

      <section className="learning-home-stats" aria-label="Deine Lernstatistik">
        <HomeStat label="Kursfortschritt" value={`${stats.percent}%`} detail={`${stats.completedCount} von ${stats.total} Kapiteln`} />
        <HomeStat label="Trefferquote" value={accuracy === null ? "—" : `${accuracy}%`} detail={answered ? `${correct} von ${answered} richtig` : "Noch keine Antworten"} />
        <HomeStat
          label="Fehler in Übungen"
          value={exerciseErrors}
          detail={answered ? `aus ${answered} Antworten` : "Noch keine Übungsdaten"}
          tone={exerciseErrors ? "error" : "success"}
        />
        <HomeStat label="Lernserie" value={`${streak}`} detail={streak === 1 ? "Tag in Folge" : "Tage in Folge"} />
      </section>

      <div className="learning-home-grid">
        <section className="card learning-home-progress">
          <div className="card-head">
            <div>
              <span className="eyebrow">Fortschritt</span>
              <h2>Dein Weg nach C1</h2>
            </div>
            <span className="mono dim">{stats.completedCount}/{stats.total}</span>
          </div>
          <div className="card-body">
            <div className="learning-level-list">
              {levelRows.map((row) => (
                <div className={row.active ? "learning-level is-active" : "learning-level"} key={row.level}>
                  <LevelTag level={row.level} />
                  <div>
                    <span>{row.active ? "Aktuelles Niveau" : row.done === row.total ? "Abgeschlossen" : "Kapitel"}</span>
                    <Bar value={row.done / row.total} color={`var(--${row.level.toLowerCase()})`} />
                  </div>
                  <b>{row.done}/{row.total}</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card learning-home-errors">
          <div className="card-head">
            <div>
              <span className="eyebrow">Fehler im Blick</span>
              <h2>Das solltest du wiederholen</h2>
            </div>
            {errorRules.length > 0 && <IconWarning />}
          </div>
          <div className="card-body">
            {errorRules.length === 0 ? (
              <div className="learning-home-empty">
                <IconCheckCircle />
                <div>
                  <b>Noch keine Fehlerschwerpunkte</b>
                  <p>Nach deinen ersten Übungen erscheinen hier die Regeln, die noch Aufmerksamkeit brauchen.</p>
                </div>
              </div>
            ) : (
              <div className="learning-error-list">
                {errorRules.map((rule) => {
                  const rate = rule.answered ? rule.correct / rule.answered : 0;
                  return (
                    <div className="learning-error" key={rule.id}>
                      <span className="learning-error-count">{rule.errors}×</span>
                      <div>
                        <b>{rule.name}</b>
                        <span><LevelTag level={rule.level} /> {Math.round(rate * 100)}% richtig</span>
                      </div>
                      <Bar value={rate} color={rate >= 0.75 ? "var(--warn)" : "var(--no)"} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="card learning-home-activity">
          <div className="card-head">
            <div>
              <span className="eyebrow">Letzte 7 Tage</span>
              <h2>Deine Aktivität</h2>
            </div>
            <span className="mono dim">{activity.reduce((sum, day) => sum + day.count, 0)} Aufgaben</span>
          </div>
          <div className="card-body">
            <div className="learning-activity-chart" aria-label="Beantwortete Aufgaben in den letzten sieben Tagen">
              {activity.map((day) => (
                <div key={day.key} title={`${day.label}: ${day.count} Aufgaben`}>
                  <span className="learning-activity-value">{day.count || ""}</span>
                  <i style={{ height: `${Math.max(day.count ? 12 : 3, (day.count / maxActivity) * 100)}%` }} />
                  <span>{day.short}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card learning-home-writing">
          <div className="card-head">
            <div>
              <span className="eyebrow">Letzter Schreibcheck</span>
              <h2>{latestWriting?.title || "Noch kein Text bewertet"}</h2>
            </div>
            {latestWriting && <LevelTag level={latestWriting.feedback?.cefr_estimate || latestWriting.level} />}
          </div>
          <div className="card-body">
            {!latestWriting ? (
              <p className="muted">Sobald ein Text korrigiert wurde, findest du hier die wichtigsten Fehlermuster.</p>
            ) : (
              <>
                <div className="learning-writing-summary">
                  <strong>{writingErrors}</strong>
                  <span>{writingErrors === 1 ? "markierter Fehler" : "markierte Fehler"}</span>
                  {hasWritingDate && (
                    <time dateTime={latestWritingDate.toISOString()}>
                      {latestWritingDate.toLocaleDateString("de-DE")}
                    </time>
                  )}
                </div>
                {writingPatterns.length > 0 && (
                  <ul className="learning-writing-patterns">
                    {writingPatterns.map((pattern, index) => (
                      <li key={`${pattern.rule || pattern.label}-${index}`}>
                        <span>{pattern.label || pattern.rule || "Fehlermuster"}</span>
                        <b>{Number(pattern.frequency) || pattern.evidence?.length || 1}×</b>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function HomeStat({ label, value, detail, tone = "" }) {
  return (
    <div className={`learning-home-stat${tone ? ` is-${tone}` : ""}`}>
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function lastSevenDays(days) {
  const formatter = new Intl.DateTimeFormat("de-DE", { weekday: "short" });
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString("de-DE"),
      short: formatter.format(date).replace(".", ""),
      count: days[key] || 0,
    };
  });
}
