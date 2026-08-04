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
import { Callout, Spinner } from "./ui.jsx";
import { IconBook, IconClose } from "./icons.jsx";
import { suggestWords, lookupWord } from "../lib/dictionary.js";

// ---------------------------------------------------------------------------
//  Dictionary drawer — opened from the header, available on every view.
//  Search translations (DE↔EN) + definitions.
// ---------------------------------------------------------------------------

export default function Dictionary({ open, onClose, query, setQuery, trigger }) {
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [direction, setDirection] = React.useState("de-en");
  const abortRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const run = React.useCallback(async (word, dir) => {
    const w = String(word || "").trim();
    if (!w) return;
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setBusy(true); setError(""); setResult(null); setSuggestions([]);
    try {
      const res = await lookupWord(w, { direction: dir, signal: ctrl.signal });
      if (ctrl.signal.aborted) return;
      setResult(res);
      if (!res.translation && !res.definition) {
        setError("Keine Treffer. Prüfe die Schreibweise oder wähle einen Vorschlag.");
        try {
          const s = await suggestWords(w, { lang: dir === "en-de" ? "en" : "de", signal: ctrl.signal });
          if (!ctrl.signal.aborted) setSuggestions(s);
        } catch { /* ignore */ }
      }
    } catch {
      if (!ctrl.signal.aborted) setError("Wörterbuch nicht erreichbar. Bist du online?");
    } finally {
      if (!ctrl.signal.aborted) setBusy(false);
    }
  }, []);

  // Run whenever an external lookup is triggered (e.g. double-click in editor).
  React.useEffect(() => {
    if (trigger && query) { setDirection("de-en"); run(query, "de-en"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  function onSubmit(e) {
    e.preventDefault();
    run(query, direction);
  }

  function switchDirection(dir) {
    if (dir === direction) return;
    setDirection(dir);
    if (query.trim()) run(query, dir);
  }

  const enToDe = direction === "en-de";
  const transLabel = enToDe ? "Deutsch" : "Englisch";
  const placeholder = enToDe ? "Look up a word … e.g. “sustainable”" : "Wort nachschlagen … z. B. „nachhaltig“";

  return (
    <div className="dict-drawer">
      <div className="dict-drawer-head">
        <span className="dict-drawer-title"><IconBook /> Wörterbuch</span>
        <button className="ide-icon" type="button" title="Schließen" onClick={onClose}><IconClose /></button>
      </div>

      <div className="dict">
        <div className="seg seg-sm dict-dir" aria-label="Richtung">
          <button type="button" aria-pressed={!enToDe} onClick={() => switchDirection("de-en")}>DE → EN</button>
          <button type="button" aria-pressed={enToDe} onClick={() => switchDirection("en-de")}>EN → DE</button>
        </div>

        <form className="dict-search" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Wörterbuch-Suche"
            autoComplete="off"
          />
          <button className="btn btn-sm" type="submit" disabled={busy || !query.trim()}>
            {busy ? <><Spinner /> …</> : "Suchen"}
          </button>
        </form>

        <p className="dict-hint muted">
          {enToDe ? "Englisch → Deutsch." : "Deutsch → Englisch."} Tipp: Doppelklick auf ein Wort im Text schlägt es direkt hier nach.
        </p>

        {error && <Callout kind="bad">{error}</Callout>}

        {suggestions.length > 0 && (
          <div className="dict-suggest">
            <span className="eyebrow">Meintest du</span>
            <div className="dict-chips">
              {suggestions.map((s) => (
                <button key={s} type="button" className="dict-chip" onClick={() => { setQuery(s); run(s, direction); }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {result && (result.translation || result.definition) && (
          <div className="dict-result">
            <h3 className="dict-word">{result.word}</h3>

            {result.translation && (
              <div className="dict-block">
                <span className="eyebrow">{transLabel}</span>
                <p className="dict-trans">{result.translation}</p>
              </div>
            )}

            {result.definition?.meanings?.length > 0 && (
              <div className="dict-block">
                <span className="eyebrow">
                  Bedeutung{result.definition.phonetic ? ` · ${result.definition.phonetic}` : ""}
                </span>
                {result.definition.meanings.map((m, mi) => (
                  <div key={mi} className="dict-mean">
                    {m.pos && <span className="dict-pos mono">{m.pos}</span>}
                    <ul className="pit" style={{ marginTop: "var(--s1)" }}>
                      {m.defs.map((d, di) => (
                        <li key={di} style={{ borderLeftColor: "var(--gen)" }}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
