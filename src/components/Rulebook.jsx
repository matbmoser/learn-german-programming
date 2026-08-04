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
import { RULES, RULES_BY_CATEGORY, RULES_BY_LEVEL, RULE_BY_ID } from "../data/rulebook.js";
import { LEVELS } from "../data/curriculum.js";
import { LevelTag, CodeBlock } from "./ui.jsx";

export default function Rulebook() {
  const [catFilter, setCatFilter] = React.useState("alle");
  const [levelFilter, setLevelFilter] = React.useState("alle");
  const [openId, setOpenId] = React.useState(RULES[0].id);
  const [query, setQuery] = React.useState("");

  const rule = RULE_BY_ID[openId] || RULES[0];

  const visibleRules = React.useMemo(() => {
    return RULES.filter((r) => {
      const matchCat = catFilter === "alle" || r.category === catFilter;
      const matchLvl = levelFilter === "alle" || r.level === levelFilter;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.en.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.rule.toLowerCase().includes(q);
      return matchCat && matchLvl && matchQ;
    });
  }, [catFilter, levelFilter, query]);

  // Group visible rules by category for sidebar display
  const sidebarGroups = React.useMemo(() => {
    return RULES_BY_CATEGORY
      .map((cat) => ({
        ...cat,
        rules: visibleRules.filter((r) => r.category === cat.id),
      }))
      .filter((g) => g.rules.length > 0);
  }, [visibleRules]);

  // Make sure the open rule is always visible
  React.useEffect(() => {
    if (!visibleRules.find((r) => r.id === openId) && visibleRules.length > 0) {
      setOpenId(visibleRules[0].id);
    }
  }, [visibleRules, openId]);

  const levelCounts = React.useMemo(() => {
    const counts = {};
    RULES.forEach((r) => { counts[r.level] = (counts[r.level] || 0) + 1; });
    return counts;
  }, []);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">§ Regelwerk</span>
        <h1>Vollständiges Regelwerk</h1>
        <p>
          {RULES.length} Regeln von A2 bis C1 — Morphologie, Syntax, Kasus, Konjunktiv, Passiv
          und Register. Jede Regel als Formel, mit Beispielen und Ausnahmen.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s3)", marginTop: "var(--s3)" }}>
          <div className="seg" role="group" aria-label="Niveau filtern">
            <button type="button" aria-pressed={levelFilter === "alle"} onClick={() => setLevelFilter("alle")}>
              Alle ({RULES.length})
            </button>
            {LEVELS.map((l) => (
              <button key={l} type="button" aria-pressed={levelFilter === l} onClick={() => setLevelFilter(l)}>
                {l} ({levelCounts[l] || 0})
              </button>
            ))}
          </div>

          <div className="seg" role="group" aria-label="Kategorie filtern">
            <button type="button" aria-pressed={catFilter === "alle"} onClick={() => setCatFilter("alle")}>
              Alle
            </button>
            {RULES_BY_CATEGORY.map((cat) => (
              <button key={cat.id} type="button" aria-pressed={catFilter === cat.id} onClick={() => setCatFilter(cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Regel suchen …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginTop: "var(--s3)", width: "100%", maxWidth: "28rem" }}
          aria-label="Regelwerk durchsuchen"
        />
      </div>

      <div className="learn-layout">
        <nav aria-label="Regeln">
          {sidebarGroups.length === 0 ? (
            <p className="dim" style={{ padding: "var(--s3)" }}>Keine Regeln gefunden.</p>
          ) : (
            sidebarGroups.map((g) => (
              <div key={g.id} style={{ marginBottom: "var(--s4)" }}>
                <span className="eyebrow" style={{ display: "block", marginBottom: "var(--s2)" }}>
                  {g.label}
                </span>
                <p className="dim" style={{ fontSize: ".82rem", marginBottom: "var(--s2)" }}>{g.en}</p>
                <div className="mod-list">
                  {g.rules.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className="mod"
                      aria-current={r.id === openId}
                      onClick={() => setOpenId(r.id)}
                    >
                      <span className="mod-top">
                        <LevelTag level={r.level} />
                        <span className="t">{r.title}</span>
                        <span className="dim mono" style={{ fontSize: ".65rem", marginLeft: "auto" }}>{r.id}</span>
                      </span>
                      <span className="s">{r.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </nav>

        <article className="detail">
          <span className="eyebrow">
            <LevelTag level={rule.level} /> {rule.id} · {rule.en}
          </span>
          <h2 style={{ marginTop: "var(--s2)" }}>{rule.title}</h2>

          <CodeBlock code={rule.rule} />

          {rule.examples?.length > 0 && (
            <section>
              <span className="eyebrow">Beispiele</span>
              <div className="ex-list">
                {rule.examples.map((ex, i) => (
                  <div key={i} className="ex">
                    <span className="de">{ex.de}</span>
                    <span className="en">{ex.en}</span>
                    {ex.note && <span className="note dim">{ex.note}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {rule.exceptions?.length > 0 && (
            <section>
              <span className="eyebrow">Ausnahmen</span>
              <ul className="pit">
                {rule.exceptions.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </section>
          )}

          {rule.seeAlso?.length > 0 && (
            <section>
              <span className="eyebrow">Siehe auch</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s2)", marginTop: "var(--s2)" }}>
                {rule.seeAlso.map((id) => {
                  const ref = RULE_BY_ID[id];
                  return ref ? (
                    <button
                      key={id}
                      type="button"
                      className="tag-btn"
                      onClick={() => setOpenId(id)}
                    >
                      <LevelTag level={ref.level} />
                      <span style={{ marginLeft: "var(--s1)" }}>{id} {ref.title}</span>
                    </button>
                  ) : null;
                })}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
