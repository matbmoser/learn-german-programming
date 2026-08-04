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
import { RULES } from "../engine/drills.js";
import { LEVELS, MODULES } from "../data/curriculum.js";
import { overallMastery, weakRules, currentStreakDays } from "../lib/storage.js";
import { MasteryRow, Stat, LevelTag, Bar, accColor, Callout } from "./ui.jsx";

const LEVEL_IDX = { A2: 0, B1: 1, B2: 2, C1: 3 };

export default function Dashboard({ progress, onGo, onDrillTopic }) {
  const lastExam = progress.exams?.[progress.exams.length - 1] || null;
  const overall = overallMastery(progress);
  const weak = weakRules(progress, 5).map((w) => ({ ...w, name: RULES.find((r) => r.id === w.id)?.name || w.id }));
  const days = currentStreakDays(progress);
  const readCount = Object.keys(progress.read || {}).length;

  // per-level mastery from the drill history
  const perLevel = LEVELS.map((lvl) => {
    let r = 0, t = 0;
    RULES.filter((x) => x.level === lvl).forEach((x) => {
      const m = progress.mastery[x.id];
      if (m) { r += m.r; t += m.t; }
    });
    return { level: lvl, r, t, acc: t ? r / t : 0 };
  });

  const reached = lastExam?.reached || null;

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Sprachspezifikation · Deutsch · A2 → C1</span>
        <h1>Der Weg nach C1, als Spezifikation gelesen.</h1>
        <p>
          Jede Regel steht hier als Code, als Tabelle und als der Fehler, den sie verhindert. Der Drill
          erzeugt Aufgaben frisch und gewichtet sie nach deinen Schwächen, der Einstufungstest sagt dir,
          wo du wirklich stehst, und Claude korrigiert, was du schreibst.
        </p>
      </div>

      <div className="grid g4" style={{ marginBottom: "var(--s4)" }}>
        <div className="card"><div className="card-body">
          <span className="eyebrow">Aktuelles Niveau</span>
          <div className="stat"><div className="v" style={{ marginTop: ".2em" }}>{lastExam ? lastExam.level : "—"}</div></div>
          <p className="dim" style={{ fontSize: ".8rem" }}>
            {lastExam ? `Test vom ${new Date(lastExam.at).toLocaleDateString("de-DE")}` : "noch kein Einstufungstest"}
          </p>
        </div></div>
        <div className="card"><div className="card-body">
          <span className="eyebrow">Beherrschung gesamt</span>
          <div className="stat"><div className="v" style={{ marginTop: ".2em" }}>{Math.round(overall * 100)}%</div></div>
          <Bar value={overall} color={accColor(overall, progress.totals.answered > 10)} />
        </div></div>
        <div className="card"><div className="card-body">
          <span className="eyebrow">Aufgaben</span>
          <div className="stat"><div className="v" style={{ marginTop: ".2em" }}>{progress.totals.answered}</div></div>
          <p className="dim" style={{ fontSize: ".8rem" }}>beste Serie {progress.totals.best}</p>
        </div></div>
        <div className="card"><div className="card-body">
          <span className="eyebrow">Tage in Folge</span>
          <div className="stat"><div className="v" style={{ marginTop: ".2em" }}>{days}</div></div>
          <p className="dim" style={{ fontSize: ".8rem" }}>{readCount}/{MODULES.length} Module gelesen</p>
        </div></div>
      </div>

      {!lastExam && (
        <Callout kind="info">
          <b>Fang mit dem Einstufungstest an.</b> 30 adaptive Aufgaben, etwa 10 Minuten — danach weiß die App,
          welche Regeln sie dir vorlegen muss und wie weit es noch bis C1 ist.
          <div className="actions">
            <button className="btn" type="button" onClick={() => onGo("exam")}>Test starten</button>
          </div>
        </Callout>
      )}

      <div className="grid g2" style={{ marginTop: "var(--s4)" }}>
        <div className="card">
          <div className="card-head"><span className="eyebrow">Der Weg nach C1</span></div>
          <div className="card-body">
            <div className="m-list" style={{ gridTemplateColumns: "1fr" }}>
              {perLevel.map((p) => {
                const done = reached && LEVEL_IDX[p.level] <= LEVEL_IDX[reached];
                return (
                  <div className="m-row" key={p.level}>
                    <span className="name">
                      <LevelTag level={p.level} />{" "}
                      {done ? "erreicht" : p.t ? `${p.r}/${p.t} im Drill` : "noch nicht geübt"}
                    </span>
                    <span className="val">{p.t ? Math.round(p.acc * 100) + "%" : "—"}</span>
                    <Bar value={p.t ? p.acc : 0} color={done ? "var(--ok)" : accColor(p.acc, p.t >= 5)} />
                  </div>
                );
              })}
            </div>
            <div className="actions">
              <button className="btn" type="button" onClick={() => onGo("drill")}>Drill starten</button>
              <button className="btn btn-ghost" type="button" onClick={() => onGo("learn")}>Regeln lesen</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="eyebrow">Was dich gerade am meisten kostet</span></div>
          <div className="card-body">
            {weak.length === 0 ? (
              <p className="muted">
                Noch zu wenig Datenpunkte. Beantworte ein paar Dutzend Aufgaben — ab drei Antworten pro
                Regel fängt die Gewichtung an zu greifen.
              </p>
            ) : (
              <>
                <div className="m-list" style={{ gridTemplateColumns: "1fr" }}>
                  {weak.map((w) => (
                    <div className="m-row" key={w.id}>
                      <span className="name">{w.name}</span>
                      <span className="val">{Math.round(w.acc * 100)}% · {w.r}/{w.t}</span>
                      <Bar value={w.acc} color={accColor(w.acc, true)} />
                    </div>
                  ))}
                </div>
                <div className="actions">
                  <button className="btn" type="button" onClick={() => onDrillTopic(weak[0].id)}>
                    »{weak[0].name}« gezielt üben
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--s4)" }}>
        <div className="card-head">
          <span className="eyebrow">Schreiben</span>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => onGo("write")}>Zum Schreibtrainer</button>
        </div>
        <div className="card-body">
          {progress.writings.length === 0 ? (
            <p className="muted">
              Noch kein Text eingereicht. Der Schreibtrainer gibt dir Prüfungsaufgaben von A2 bis C1 und
              lässt Claude jeden Fehler einzeln erklären — mit Regel, nicht nur mit Korrektur.
            </p>
          ) : (
            <div className="m-list" style={{ gridTemplateColumns: "1fr" }}>
              {progress.writings.slice(-5).reverse().map((w) => (
                <div className="m-row" key={w.id}>
                  <span className="name">
                    <LevelTag level={w.level} /> {w.title}
                    <span className="dim"> · {new Date(w.at).toLocaleDateString("de-DE")}</span>
                  </span>
                  <span className="val">
                    {w.feedback?.cefr_estimate || "—"} · {w.feedback?.corrections?.length ?? 0} Fehler
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--s4)" }}>
        <div className="card-head"><span className="eyebrow">Alle Regeln</span></div>
        <div className="card-body">
          <div className="m-list">
            {RULES.map((r) => {
              const m = progress.mastery[r.id] || { r: 0, t: 0 };
              return <MasteryRow key={r.id} name={r.name} level={r.level} r={m.r} t={m.t} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
