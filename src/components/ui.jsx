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
import { IconCheck } from "./icons.jsx";
import { tokenizeCode } from "../lib/highlight.js";
import { resolveSources } from "../data/sources.js";

/** Renders a prompt string, turning every "___" into a visible blank. */
export function Prompt({ text }) {
  const parts = String(text ?? "").split("___");
  return (
    <span>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < parts.length - 1 && <span className="blank">___</span>}
        </React.Fragment>
      ))}
    </span>
  );
}

/** Pseudocode block used in Regeln / Regelwerk — comments, case labels, and keywords coloured like the IDE overlay. */
export function CodeBlock({ code, label }) {
  if (!code) return null;
  return (
    <pre className="code" aria-label={label}>
      {tokenizeCode(code).map((seg, i) => {
        if (!seg.cls) return <React.Fragment key={i}>{seg.text}</React.Fragment>;
        return seg.bold
          ? <b key={i} className={seg.cls}>{seg.text}</b>
          : <span key={i} className={seg.cls}>{seg.text}</span>;
      })}
    </pre>
  );
}

export function LevelTag({ level }) {
  if (!level) return null;
  return <span className={`tag ${level}`}>{level}</span>;
}

/** The derivation behind an answer: label → value → why. */
export function Trace({ rows }) {
  if (!rows?.length) return null;
  return (
    <div className="trace">
      {rows.filter(Boolean).map((r, i) => (
        <span className="step" key={i}>
          <span className="lbl">{r[0]}</span>
          {r[1]}
          {r[2] ? <span className="why">{"  // " + r[2]}</span> : null}
        </span>
      ))}
    </div>
  );
}

export function Bar({ value, color }) {
  const pct = Math.max(0, Math.min(1, value || 0)) * 100;
  return (
    <span className="m-bar">
      <i style={{ width: pct + "%", background: color || "var(--nom)" }} />
    </span>
  );
}

export function accColor(acc, seen) {
  if (!seen) return "var(--ink-3)";
  if (acc >= 0.85) return "var(--ok)";
  if (acc >= 0.6) return "var(--akk)";
  return "var(--no)";
}

export function MasteryRow({ name, level, r, t }) {
  const seen = t >= 3;
  const acc = t ? r / t : 0;
  return (
    <div className="m-row">
      <span className="name">
        {level && <><LevelTag level={level} /> </>}
        {name}
      </span>
      <span className="val">{t ? `${Math.round(acc * 100)}% · ${r}/${t}` : "—"}</span>
      <Bar value={t ? acc : 0} color={accColor(acc, seen)} />
    </div>
  );
}

export function GrammarTable({ table }) {
  const hot = new Set((table.hot || []).map(([r, c]) => `${r}:${c}`));
  const warm = new Set((table.warm || []).map(([r, c]) => `${r}:${c}`));
  const caseClass = (label) => {
    const key = String(label).trim().toLowerCase();
    if (key === "nominativ" || key === "nom") return "c-nom";
    if (key === "akkusativ" || key === "akk") return "c-akk";
    if (key === "dativ" || key === "dat") return "c-dat";
    if (key === "genitiv" || key === "gen") return "c-gen";
    return undefined;
  };
  return (
    <div className="tbl-wrap">
      <table className="grid-tbl">
        {table.caption && <caption>{table.caption}</caption>}
        <thead>
          <tr>{table.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row" className={caseClass(cell)}>{cell}</th>
                ) : (
                  <td
                    key={ci}
                    className={hot.has(`${ri}:${ci}`) ? "hot" : warm.has(`${ri}:${ci}`) ? "warm" : undefined}
                  >
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note && <p className="tbl-note">{table.note}</p>}
    </div>
  );
}

/** Numbered section heading used by the Spezifikation views. */
export function SecHead({ num, title, sub, anchor }) {
  return (
    <div className="sec-head" id={anchor ? `doc-${anchor}` : undefined}>
      <span className="sec-num">{num}</span>
      <div>
        <h2>
          {title}
          {anchor && (
            <a className="section-link" href={`#spec/${anchor}`} aria-label={`Direktlink zu ${title}`} title="Direktlink zu diesem Abschnitt">
              #
            </a>
          )}
        </h2>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
    </div>
  );
}

/**
 * Where a rule comes from. Only official / institutional references are listed
 * (Rat für deutsche Rechtschreibung, IDS grammis, Duden, DWDS) — see
 * src/data/sources.js. Renders nothing when a rule has no source on file, which
 * is itself information: that rule is uncontroversial school grammar or this
 * app's own didactic shorthand.
 */
export function SourceList({ ids, label = "Quellen" }) {
  const items = resolveSources(ids);
  if (!items.length) return null;
  return (
    <section className="sources">
      <span className="eyebrow">{label}</span>
      <ul>
        {items.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
            <span className="org">{s.org.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="eyebrow">{label}</span>
      <div className="v">{value}</div>
    </div>
  );
}

export function Callout({ kind = "info", children }) {
  return <div className={`callout ${kind}`}>{children}</div>;
}

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

/** Copy-to-clipboard button with graceful fallback for insecure contexts. */
export function CopyButton({ text, label = "Kopieren" }) {
  const [done, setDone] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
      {done ? <>Kopiert <IconCheck /></> : label}
    </button>
  );
}

export const countWords = (s) =>
  String(s || "").trim().split(/\s+/).filter(Boolean).length;
