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
import { downloadProgress, importProgress } from "../lib/storage.js";
import { testKey, MODEL } from "../lib/claude.js";
import { Callout, Spinner } from "./ui.jsx";
import { LEVELS, MODULES } from "../data/curriculum.js";
import { learningPathStats } from "../lib/learningPath.js";
import { totalInputTokens, totalTokens } from "../lib/apiUsage.js";

function formatTokens(value) {
  const tokens = Math.max(0, Number(value) || 0);
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })}k`;
  return String(tokens);
}

export default function Settings({
  progress, apiKey, apiUsage, onApiKey, onResetApiUsage, onSettings, onReset, onImport,
  learningPathEnabled, onPathLevel, onPathModule, onOpenPath, onResetPath,
}) {
  const [keyDraft, setKeyDraft] = React.useState(apiKey);
  const [showKey, setShowKey] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [confirmPathReset, setConfirmPathReset] = React.useState(false);
  const [importMsg, setImportMsg] = React.useState("");
  const fileRef = React.useRef(null);

  const mode = progress.settings.mode || "api";
  const model = progress.settings.model || MODEL;
  const experienceMode = learningPathEnabled && progress.settings.experienceMode !== "free" ? "learning" : "free";
  const pathStats = learningPathStats(progress.learningPath);
  const levelModules = MODULES.filter((module) => module.level === pathStats.current.level);
  const usedTokens = totalTokens(apiUsage);
  const usedInputTokens = totalInputTokens(apiUsage);
  const remainingTokens = apiUsage?.rateLimit?.remaining;
  const rateLimit = apiUsage?.rateLimit?.limit;

  async function runTest() {
    setTesting(true); setTestResult(null);
    setTestResult(await testKey({ apiKey: keyDraft, model }));
    setTesting(false);
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        onImport(importProgress(String(r.result)));
        setImportMsg("Fortschritt importiert.");
      } catch (err) {
        setImportMsg("Import fehlgeschlagen: " + err.message);
      }
    };
    r.readAsText(f);
    e.target.value = "";
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">§ Einstellungen</span>
        <h1>Lernmodus, Claude und Fortschritt</h1>
      </div>

      {learningPathEnabled && (
        <div className="card settings-path-card" style={{ marginBottom: "var(--s4)" }}>
          <div className="card-head"><span className="eyebrow">Lernerfahrung</span></div>
          <div className="card-body">
            <div className="seg" role="group" aria-label="Lernmodus wählen">
              <button type="button" aria-pressed={experienceMode === "learning"} onClick={() => onSettings({ experienceMode: "learning" })}>
                Lernmodus
              </button>
              <button type="button" aria-pressed={experienceMode === "free"} onClick={() => onSettings({ experienceMode: "free" })}>
                Freier Modus
              </button>
            </div>
            <p className="help" style={{ marginTop: "var(--s3)" }}>
              {experienceMode === "learning"
                ? "Ein Lernfenster führt durch Erklärung, vorbereitete Übungen und eine kurze Anwendung—ohne Wechsel zwischen Regeln, Drill und Schreiben."
                : "Alle Regeln, Drills, Prüfungen und Schreibaufgaben sind frei zugänglich — die bisherige Ansicht."}
            </p>

            <div className="path-settings-grid">
              <div>
                <span className="eyebrow">Aktueller Stand</span>
                <p><b>{pathStats.current.level} · {pathStats.current.title}</b></p>
                <p className="muted">{pathStats.completedCount} von {pathStats.total} Kapiteln · {pathStats.percent}%</p>
              </div>
              <div>
                <span className="eyebrow">Bei einem Niveau einsteigen</span>
                <div className="chips" style={{ marginTop: "var(--s2)" }}>
                  {LEVELS.map((level) => (
                    <button key={level} type="button" className="chip" aria-pressed={pathStats.current.level === level} onClick={() => onPathLevel(level)}>
                      {level === "A2" ? "A1/A2 Grundlagen" : level}
                    </button>
                  ))}
                </div>
                <label className="path-module-picker" htmlFor="path-module">
                  <span>Kapitel in {pathStats.current.level}</span>
                  <select
                    id="path-module"
                    className="input"
                    value={pathStats.current.id}
                    onChange={(event) => onPathModule(event.target.value)}
                  >
                    {levelModules.map((module, index) => (
                      <option key={module.id} value={module.id}>
                        {index + 1}. {module.title}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="help">Wähle ein Niveau und danach ein bestimmtes Kapitel. Hilfreich nach verlorenem Browser-Fortschritt; frühere Kapitel werden dadurch nicht als abgeschlossen markiert.</p>
                <div className="actions path-module-actions">
                  <button className="btn btn-sm" type="button" onClick={onOpenPath}>
                    Mit diesem Kapitel fortfahren
                  </button>
                </div>
              </div>
            </div>

            <div className="actions">
              {!confirmPathReset ? (
                <button className="btn btn-danger btn-sm" type="button" onClick={() => setConfirmPathReset(true)}>
                  Nur Lernpfad zurücksetzen
                </button>
              ) : (
                <>
                  <button className="btn btn-danger btn-sm" type="button" onClick={() => { onResetPath(); setConfirmPathReset(false); }}>
                    Ja, Lernpfad löschen
                  </button>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => setConfirmPathReset(false)}>Abbrechen</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div id="doc-api-settings" className="card" style={{ marginBottom: "var(--s4)" }}>
        <div className="card-head"><span className="eyebrow">Wie Claude erreicht wird</span></div>
        <div className="card-body">
          <div className="seg" role="group" aria-label="Modus">
            <button type="button" aria-pressed={mode === "api"} onClick={() => onSettings({ mode: "api" })}>
              API-Key
            </button>
            <button type="button" aria-pressed={mode === "manual"} onClick={() => onSettings({ mode: "manual" })}>
              Manuell (ohne Key)
            </button>
          </div>

          {mode === "api" ? (
            <div style={{ marginTop: "var(--s4)" }}>
              <div className="field">
                <label htmlFor="key">Anthropic API-Key</label>
                <p className="help">
                  Diese Seite ist statisch — es gibt keinen Server, also ruft der Browser die API direkt auf.
                  Der Key wird nur in <span className="mono">localStorage</span> dieses Browsers gespeichert und
                  ist bei jedem API-Aufruf im Netzwerk-Tab sichtbar. Nimm einen Key nur für dich, gib ihn nicht
                  weiter, und benutze diesen Modus nicht auf einem fremden Rechner. Ein Export deines
                  Fortschritts enthält den Key <b>nicht</b>.
                </p>
                <div style={{ display: "flex", gap: ".5em", flexWrap: "wrap" }}>
                  <input
                    id="key"
                    className="input"
                    style={{ flex: "1 1 22rem" }}
                    type={showKey ? "text" : "password"}
                    value={keyDraft}
                    onChange={(e) => setKeyDraft(e.target.value)}
                    placeholder="sk-ant-…"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => setShowKey((v) => !v)}>
                    {showKey ? "Verbergen" : "Zeigen"}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="model">Modell</label>
                <input
                  id="model"
                  className="input"
                  value={model}
                  onChange={(e) => onSettings({ model: e.target.value })}
                  spellCheck="false"
                />
                <p className="help">Standard: <span className="mono">{MODEL}</span></p>
              </div>

              <div className="actions">
                <button className="btn" type="button" onClick={() => { onApiKey(keyDraft.trim()); setTestResult(null); }}>
                  Key speichern
                </button>
                <button className="btn btn-ghost" type="button" onClick={runTest} disabled={!keyDraft.trim() || testing}>
                  {testing ? <><Spinner /> Teste …</> : "Verbindung testen"}
                </button>
                {apiKey && (
                  <button className="btn btn-danger btn-sm" type="button" onClick={() => { onApiKey(""); setKeyDraft(""); setTestResult(null); }}>
                    Key löschen
                  </button>
                )}
              </div>

              {testResult && (
                <Callout kind={testResult.ok ? "info" : "bad"}>{testResult.message}</Callout>
              )}

              <div className="api-usage-panel">
                <div className="api-usage-head">
                  <span className="eyebrow">Tokenverbrauch dieses API-Keys</span>
                  <span className="mono">{apiUsage?.requests || 0} API-Aufrufe</span>
                </div>
                <div className="api-usage-grid">
                  <div><b>{formatTokens(usedTokens)}</b><span>insgesamt genutzt</span></div>
                  <div><b>{formatTokens(usedInputTokens)}</b><span>Eingabe inkl. Cache</span></div>
                  <div><b>{formatTokens(apiUsage?.outputTokens)}</b><span>Ausgabe</span></div>
                  <div>
                    <b>{remainingTokens == null ? "—" : formatTokens(remainingTokens)}</b>
                    <span>zuletzt im Ratenlimit frei</span>
                  </div>
                </div>
                {rateLimit > 0 && (
                  <div className="api-rate-track" role="progressbar" aria-label="Verfügbares Token-Ratenlimit" aria-valuemin="0" aria-valuemax={rateLimit} aria-valuenow={remainingTokens || 0}>
                    <i style={{ width: `${Math.max(0, Math.min(100, ((remainingTokens || 0) / rateLimit) * 100))}%` }} />
                  </div>
                )}
                <p className="help">
                  „Genutzt“ zählt alle Antworten, die diese App seit Einführung des Zählers in diesem Browser erhalten hat.
                  „Frei“ ist das zuletzt von Anthropic gemeldete, laufend wieder aufgefüllte Ratenlimit — kein Token- oder
                  Guthabenstand des Kontos. Ein normaler API-Key stellt diesen Kontostand nicht bereit.
                </p>
                {apiUsage?.lastRequestAt && (
                  <p className="help mono">Zuletzt aktualisiert: {new Date(apiUsage.lastRequestAt).toLocaleString("de-DE")}</p>
                )}
                {usedTokens > 0 && (
                  <button className="btn btn-ghost btn-sm" type="button" onClick={onResetApiUsage}>
                    Lokalen Zähler zurücksetzen
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "var(--s4)" }}>
              <p className="muted">
                Im manuellen Modus baut die App den kompletten Prompt und du kopierst ihn in claude.ai,
                Claude Code oder die Claude-App. Claudes JSON-Antwort fügst du zurück ins Feld. Gleiche
                Auswertung, kein Key im Browser, keine Kosten über die API.
              </p>
              <Callout kind="info">
                Der manuelle Modus ist die sichere Variante — nichts verlässt diese Seite außer dem Text,
                den du selbst einfügst.
              </Callout>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--s4)" }}>
        <div className="card-head"><span className="eyebrow">Editor</span></div>
        <div className="card-body">
          <label className="dict-toggle">
            <input
              type="checkbox"
              checked={progress.settings.suggestions !== false}
              onChange={(e) => onSettings({ suggestions: e.target.checked })}
            />
            <span>
              <b>Wortvorschläge beim Schreiben</b>
              <span className="help" style={{ display: "block" }}>
                Zeigt beim Tippen passende deutsche Wörter aus dem Wörterbuch — wie eine Autovervollständigung.
                Lässt sich auch direkt im Editor an- und abschalten.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--s4)" }}>
        <div className="card-head"><span className="eyebrow">Fortschritt</span></div>
        <div className="card-body">
          <p className="muted">
            Alles liegt in <span className="mono">localStorage</span> dieses Browsers: {progress.totals.answered} beantwortete
            Aufgaben, {progress.exams.length} Einstufung{progress.exams.length === 1 ? "" : "en"}, {progress.writings.length} Text
            {progress.writings.length === 1 ? "" : "e"}. Nichts geht an einen Server. Wenn du den Browser-Speicher
            löschst, ist der Fortschritt weg — deshalb der Export.
          </p>

          <div className="actions">
            <button className="btn btn-ghost" type="button" onClick={() => downloadProgress(progress)}>
              Als JSON exportieren
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => fileRef.current?.click()}>
              JSON importieren
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} style={{ display: "none" }} />
          </div>
          {importMsg && <Callout kind={importMsg.startsWith("Import fehl") ? "bad" : "info"}>{importMsg}</Callout>}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="eyebrow">Zurücksetzen</span></div>
        <div className="card-body">
          <p className="muted">
            Löscht Lernpfad, Beherrschungswerte, Serien, Einstufungen und gespeicherte Texte. Der API-Key bleibt
            erhalten — den löschst du oben separat.
          </p>
          <div className="actions">
            {!confirmReset ? (
              <button className="btn btn-danger" type="button" onClick={() => setConfirmReset(true)}>
                Fortschritt zurücksetzen
              </button>
            ) : (
              <>
                <button className="btn btn-danger" type="button" onClick={() => { onReset(); setConfirmReset(false); }}>
                  Ja, alles löschen
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => setConfirmReset(false)}>
                  Abbrechen
                </button>
                <span className="dim" style={{ fontSize: ".85rem" }}>Das lässt sich nicht rückgängig machen.</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
