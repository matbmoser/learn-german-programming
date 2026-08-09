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
import { MODULES, MODULES_BY_LEVEL, LEVELS } from "../data/curriculum.js";
import { RULE_BY_ID } from "../engine/drills.js";
import { MODULE_SOURCES } from "../data/sources.js";
import { GrammarTable, LevelTag, Bar, accColor, CodeBlock, SourceList } from "./ui.jsx";

export default function Learn({ progress, onRead, onDrillTopic, section, onSectionChange }) {
  const [openId, setOpenId] = React.useState(
    MODULES.some((m) => m.id === section) ? section : MODULES[0].id
  );
  const [levelFilter, setLevelFilter] = React.useState("alle");
  const mod = MODULES.find((m) => m.id === openId) || MODULES[0];

  React.useEffect(() => { onRead(mod.id); }, [mod.id, onRead]);
  React.useEffect(() => {
    if (MODULES.some((m) => m.id === section)) setOpenId(section);
  }, [section]);

  function openModule(id) {
    setOpenId(id);
    onSectionChange?.(id);
  }

  const groups = MODULES_BY_LEVEL.filter((g) => levelFilter === "alle" || g.level === levelFilter);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">§ Referenz</span>
        <h1>Die Sprachspezifikation</h1>
        <p>
          Von A2 bis C1, jede Regel als Code, als Tabelle und als Fehler, der dich in einer Prüfung
          Punkte kostet. {MODULES.length} Module · {progress ? Object.keys(progress.read || {}).length : 0} gelesen.
        </p>
        <div className="seg" style={{ marginTop: "var(--s3)" }} role="group" aria-label="Niveau filtern">
          {["alle", ...LEVELS].map((l) => (
            <button key={l} type="button" aria-pressed={levelFilter === l} onClick={() => setLevelFilter(l)}>
              {l === "alle" ? "Alle" : l}
            </button>
          ))}
        </div>
      </div>

      <div className="learn-layout">
        <nav aria-label="Module">
          {groups.map((g) => (
            <div key={g.level} style={{ marginBottom: "var(--s4)" }}>
              <span className="eyebrow" style={{ display: "block", marginBottom: "var(--s2)" }}>
                {g.name}
              </span>
              <p className="dim" style={{ fontSize: ".82rem", marginBottom: "var(--s2)" }}>{g.blurb}</p>
              <div className="mod-list">
                {g.modules.map((m) => {
                  const drillId = m.drills?.[0];
                  const mm = drillId ? progress.mastery[drillId] : null;
                  const acc = mm && mm.t ? mm.r / mm.t : null;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className="mod"
                      aria-current={m.id === openId}
                      onClick={() => openModule(m.id)}
                    >
                      <span className="mod-top">
                        <LevelTag level={m.level} />
                        <span className="t">{m.title}</span>
                        {progress.read?.[m.id] && <span className="dim mono" style={{ fontSize: ".65rem" }}>gelesen</span>}
                      </span>
                      <span className="s">{m.en}</span>
                      {acc !== null && <Bar value={acc} color={accColor(acc, mm.t >= 3)} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <article className="detail" id={`doc-${mod.id}`}>
          <ModuleContent module={mod} onDrillTopic={onDrillTopic} />
        </article>
      </div>
    </>
  );
}

export function ModuleContent({ module: mod, onDrillTopic, anchorView = "learn", showDrills = true }) {
  return (
    <>
      <span className="eyebrow">
        <LevelTag level={mod.level} /> {mod.en}
      </span>
      <h2 style={{ marginTop: "var(--s2)" }}>
        {mod.title}
        <a className="section-link" href={`#${anchorView}/${encodeURIComponent(mod.id)}`} aria-label={`Direktlink zu ${mod.title}`} title="Direktlink zu diesem Modul">#</a>
      </h2>
      <p className="lede">{mod.summary}</p>

      <CodeBlock code={mod.code} />

      {mod.tables?.length > 0 && (
        <section>
          <span className="eyebrow">Tabellen</span>
          {mod.tables.map((t, i) => <GrammarTable key={i} table={t} />)}
        </section>
      )}

      {mod.examples?.length > 0 && (
        <section>
          <span className="eyebrow">Beispiele</span>
          <div className="ex-list">
            {mod.examples.map((e, i) => (
              <div className="ex" key={i}>
                <div className="de">{e.de}</div>
                <div className="en">{e.en}</div>
                {e.note && <div className="note">{e.note}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {mod.pitfalls?.length > 0 && (
        <section>
          <span className="eyebrow">Typische Fehler</span>
          <ul className="pit">
            {mod.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
      )}

      {showDrills && mod.drills?.length > 0 && (
        <section>
          <span className="eyebrow">Dazu üben</span>
          <div className="actions" style={{ marginTop: 0 }}>
            {mod.drills.map((d) => (
              <button key={d} className="btn" type="button" onClick={() => onDrillTopic?.(d)}>
                {RULE_BY_ID[d]?.name || d} drillen
              </button>
            ))}
          </div>
        </section>
      )}

      <SourceList ids={mod.sources || MODULE_SOURCES[mod.id]} />
    </>
  );
}
