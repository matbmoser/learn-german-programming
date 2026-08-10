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
import {
  EXAM_FORMATS,
  EXAM_PARTS,
  EXAM_STRATEGY,
  EXERCISE_TYPES,
  FORMAT_BY_ID,
  LEVEL_EXPECTATIONS,
  TYPE_BY_ID,
} from "../data/cheatsheet.js";
import { LEVELS, MODULE_BY_ID } from "../data/curriculum.js";
import { RULE_BY_ID } from "../data/rulebook.js";
import { LevelTag } from "./ui.jsx";
import {
  IconArrowRight, IconCancel, IconCheck, IconCheckCircle,
  IconIdea, IconInfo, IconWarning,
} from "./icons.jsx";

const TABS = [
  { id: "typen", label: "Aufgabentypen", hint: "Was gefragt wird — und der Trick dazu" },
  { id: "niveaus", label: "Niveaustufen", hint: "Was A2, B1, B2 und C1 verlangen" },
  { id: "formate", label: "Prüfungsformate", hint: "Goethe, telc, TestDaF, DSH — Teil für Teil" },
];

/* Section route encoding: "<typeId>" | "niveau-<LEVEL>" | "format-<formatId>" */
function readSection(section) {
  if (!section) return null;
  if (section.startsWith("niveau-")) {
    const level = section.slice(7);
    return LEVELS.includes(level) ? { tab: "niveaus", level } : null;
  }
  if (section.startsWith("format-")) {
    const id = section.slice(7);
    return FORMAT_BY_ID[id] ? { tab: "formate", format: id } : null;
  }
  return TYPE_BY_ID[section] ? { tab: "typen", type: section } : null;
}

export default function CheatSheet({ section, onSectionChange, onGo, learningMode }) {
  const initial = readSection(section);
  const [tab, setTab] = React.useState(initial?.tab || "typen");
  const [openId, setOpenId] = React.useState(initial?.type || EXERCISE_TYPES[0].id);
  const [level, setLevel] = React.useState(initial?.level || "B1");
  const [formatId, setFormatId] = React.useState(initial?.format || "goethe-b1");
  const [levelFilter, setLevelFilter] = React.useState("alle");
  const [partFilter, setPartFilter] = React.useState("alle");
  const [query, setQuery] = React.useState("");

  // Keep the view in sync when the hash changes from outside (back button, link).
  React.useEffect(() => {
    const parsed = readSection(section);
    if (!parsed) return;
    setTab(parsed.tab);
    if (parsed.type) setOpenId(parsed.type);
    if (parsed.level) setLevel(parsed.level);
    if (parsed.format) setFormatId(parsed.format);
  }, [section]);

  const openType = React.useCallback((id) => {
    setTab("typen");
    setOpenId(id);
    onSectionChange?.(id);
  }, [onSectionChange]);

  const openLevel = React.useCallback((lvl) => {
    setTab("niveaus");
    setLevel(lvl);
    onSectionChange?.(`niveau-${lvl}`);
  }, [onSectionChange]);

  const openFormat = React.useCallback((id) => {
    setTab("formate");
    setFormatId(id);
    onSectionChange?.(`format-${id}`);
  }, [onSectionChange]);

  const goTab = React.useCallback((next) => {
    setTab(next);
    if (next === "typen") onSectionChange?.(openId);
    else if (next === "niveaus") onSectionChange?.(`niveau-${level}`);
    else onSectionChange?.(`format-${formatId}`);
  }, [onSectionChange, openId, level, formatId]);

  const visibleTypes = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISE_TYPES.filter((t) => {
      if (levelFilter !== "alle" && !t.levels.includes(levelFilter)) return false;
      if (partFilter !== "alle" && t.part !== partFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.en.toLowerCase().includes(q) ||
        t.signal.toLowerCase().includes(q) ||
        t.trick.name.toLowerCase().includes(q) ||
        t.where.toLowerCase().includes(q)
      );
    });
  }, [levelFilter, partFilter, query]);

  // Never leave the detail pane pointing at something the filters hid.
  React.useEffect(() => {
    if (visibleTypes.length && !visibleTypes.some((t) => t.id === openId)) {
      setOpenId(visibleTypes[0].id);
    }
  }, [visibleTypes, openId]);

  const groups = React.useMemo(
    () => EXAM_PARTS
      .map((part) => ({ ...part, types: visibleTypes.filter((t) => t.part === part.id) }))
      .filter((g) => g.types.length),
    [visibleTypes],
  );

  const levelCounts = React.useMemo(() => {
    const counts = {};
    LEVELS.forEach((l) => { counts[l] = EXERCISE_TYPES.filter((t) => t.levels.includes(l)).length; });
    return counts;
  }, []);

  const current = TYPE_BY_ID[openId] || EXERCISE_TYPES[0];

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">§ Spickzettel</span>
        <h1>Prüfungs-Spickzettel</h1>
        <p>
          {EXERCISE_TYPES.length} Aufgabentypen aus den Modellsätzen von Goethe, telc, TestDaF und DSH —
          jeder mit dem mechanischen Trick, der ihn löst, den typischen Fallen und dem, was auf jedem
          Niveau erwartet wird. Sprache können reicht nicht: die Aufgabenform kennen entscheidet die Prüfung.
        </p>

        <div className="cheat-tabs" role="tablist" aria-label="Spickzettel-Bereiche">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? "is-on" : undefined}
              onClick={() => goTab(t.id)}
            >
              <b>{t.label}</b>
              <span>{t.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === "typen" && (
        <>
          <div className="cheat-filters">
            <div className="seg" role="group" aria-label="Niveau filtern">
              <button type="button" aria-pressed={levelFilter === "alle"} onClick={() => setLevelFilter("alle")}>
                Alle ({EXERCISE_TYPES.length})
              </button>
              {LEVELS.map((l) => (
                <button key={l} type="button" aria-pressed={levelFilter === l} onClick={() => setLevelFilter(l)}>
                  {l} ({levelCounts[l]})
                </button>
              ))}
            </div>

            <div className="seg" role="group" aria-label="Prüfungsteil filtern">
              <button type="button" aria-pressed={partFilter === "alle"} onClick={() => setPartFilter("alle")}>
                Alle Teile
              </button>
              {EXAM_PARTS.map((p) => (
                <button key={p.id} type="button" aria-pressed={partFilter === p.id} onClick={() => setPartFilter(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Aufgabentyp oder Trick suchen …"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Spickzettel durchsuchen"
            />
          </div>

          <div className="learn-layout">
            <nav aria-label="Aufgabentypen">
              {groups.length === 0 ? (
                <p className="dim" style={{ padding: "var(--s3)" }}>Kein Aufgabentyp passt zu diesem Filter.</p>
              ) : groups.map((g) => (
                <div key={g.id} style={{ marginBottom: "var(--s4)" }}>
                  <span className="eyebrow" style={{ display: "block", marginBottom: "var(--s2)" }}>{g.label}</span>
                  <p className="dim" style={{ fontSize: ".82rem", marginBottom: "var(--s2)" }}>{g.blurb}</p>
                  <div className="mod-list">
                    {g.types.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className="mod"
                        aria-current={t.id === openId}
                        onClick={() => openType(t.id)}
                      >
                        <span className="mod-top">
                          <span className="t">{t.title}</span>
                          <span className="cheat-levels">
                            {t.levels.map((l) => <LevelTag key={l} level={l} />)}
                          </span>
                        </span>
                        <span className="s">{t.en}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <TypeDetail
              type={current}
              onGo={onGo}
              onOpenType={openType}
              onOpenLevel={openLevel}
              learningMode={learningMode}
            />
          </div>

          <section className="cheat-strategy">
            <span className="eyebrow">Gilt in jeder Prüfung, auf jedem Niveau</span>
            <div className="cheat-strategy-grid">
              {EXAM_STRATEGY.map((s) => (
                <div key={s.id}>
                  <b>{s.title}</b>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "niveaus" && (
        <LevelView
          level={level}
          onLevel={openLevel}
          onOpenType={openType}
          onOpenFormat={openFormat}
          onGo={onGo}
          learningMode={learningMode}
        />
      )}

      {tab === "formate" && (
        <FormatView
          formatId={formatId}
          onFormat={openFormat}
          onOpenType={openType}
          onOpenLevel={openLevel}
        />
      )}
    </>
  );
}

/* ========================================================== type detail === */

function TypeDetail({ type, onGo, onOpenType, onOpenLevel, learningMode }) {
  const [byLevel, setByLevel] = React.useState(type.levels[0]);

  React.useEffect(() => { setByLevel(type.levels[0]); }, [type.id]);

  const part = EXAM_PARTS.find((p) => p.id === type.part);
  const rules = (type.rules || []).map((id) => RULE_BY_ID[id]).filter(Boolean);
  const modules = (type.modules || []).map((id) => MODULE_BY_ID[id]).filter(Boolean);
  const shownLevel = type.byLevel[byLevel] ? byLevel : type.levels[0];

  return (
    <article className="detail cheat-detail" id={`doc-${type.id}`}>
      <span className="eyebrow">
        {part?.label} · {type.en}
      </span>
      <h2 style={{ marginTop: "var(--s2)" }}>
        {type.title}
        <a className="section-link" href={`#cheat/${encodeURIComponent(type.id)}`} title="Direktlink zu diesem Aufgabentyp" aria-label={`Direktlink zu ${type.title}`}>#</a>
      </h2>

      <p className="cheat-signal">
        <IconInfo /> <span>{type.signal}</span>
      </p>

      <div className="cheat-meta">
        <div>
          <span className="eyebrow">Wo es vorkommt</span>
          <p>{type.where}</p>
        </div>
        <div>
          <span className="eyebrow">Zeitbudget</span>
          <p>{type.time}</p>
        </div>
        <div>
          <span className="eyebrow">Niveaus</span>
          <p className="cheat-levels">
            {type.levels.map((l) => (
              <button key={l} type="button" className="cheat-level-btn" onClick={() => onOpenLevel(l)} title={`Was auf ${l} erwartet wird`}>
                <LevelTag level={l} />
              </button>
            ))}
          </p>
        </div>
      </div>

      <section>
        <span className="eyebrow">So sieht die Aufgabe aus</span>
        <div className="cheat-sample">
          <b>{type.sample.task}</b>
          <p>{type.sample.body}</p>
          {type.sample.options?.length > 0 && (
            <ul>{type.sample.options.map((o, i) => <li key={i}>{o}</li>)}</ul>
          )}
        </div>
      </section>

      <section className="cheat-trick">
        <span className="eyebrow"><IconIdea /> Der Trick</span>
        <h3>{type.trick.name}</h3>
        <ol>
          {type.trick.steps.map((s, i) => (
            <li key={i}><span>{i + 1}</span><p>{s}</p></li>
          ))}
        </ol>
      </section>

      <div className="cheat-two">
        <section>
          <span className="eyebrow">Darauf kommt es an</span>
          <ul className="cheat-focus">
            {type.focus.map((f, i) => <li key={i}><IconCheck />{f}</li>)}
          </ul>
        </section>
        <section>
          <span className="eyebrow"><IconWarning /> Fallen</span>
          <ul className="pit">
            {type.traps.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      </div>

      <section>
        <span className="eyebrow">Falsch neben richtig</span>
        <div className="cheat-compare">
          <p className="cheat-compare-task">{type.compare.task}</p>
          <div>
            <div className="is-wrong">
              <span><IconCancel /> so nicht</span>
              <b>{type.compare.wrong}</b>
            </div>
            <div className="is-right">
              <span><IconCheckCircle /> so ja</span>
              <b>{type.compare.right}</b>
            </div>
          </div>
          <p className="cheat-compare-why">{type.compare.why}</p>
        </div>
      </section>

      <section>
        <span className="eyebrow">Was auf welchem Niveau erwartet wird</span>
        <div className="seg" role="group" aria-label="Niveau vergleichen" style={{ marginBottom: "var(--s3)" }}>
          {type.levels.map((l) => (
            <button key={l} type="button" aria-pressed={shownLevel === l} onClick={() => setByLevel(l)}>{l}</button>
          ))}
        </div>
        <div className="cheat-bylevel">
          <LevelTag level={shownLevel} />
          <p>{type.byLevel[shownLevel]}</p>
        </div>
        <button type="button" className="cheat-inline-link" onClick={() => onOpenLevel(shownLevel)}>
          Alles, was {shownLevel} verlangt <IconArrowRight />
        </button>
      </section>

      {!learningMode && (rules.length > 0 || modules.length > 0) && (
        <section>
          <span className="eyebrow">Die Regeln dahinter</span>
          <div className="cheat-links">
            {modules.map((m) => (
              <button key={m.id} type="button" className="tag-btn" onClick={() => onGo?.("learn", m.id)}>
                <LevelTag level={m.level} />
                <span style={{ marginLeft: "var(--s1)" }}>{m.title}</span>
              </button>
            ))}
            {rules.map((r) => (
              <button key={r.id} type="button" className="tag-btn" onClick={() => onGo?.("rulebook", r.id)}>
                <LevelTag level={r.level} />
                <span style={{ marginLeft: "var(--s1)" }}>{r.id} {r.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <RelatedTypes type={type} onOpenType={onOpenType} />
    </article>
  );
}

function RelatedTypes({ type, onOpenType }) {
  const siblings = EXERCISE_TYPES.filter((t) => t.part === type.part && t.id !== type.id);
  if (!siblings.length) return null;
  return (
    <section>
      <span className="eyebrow">Weitere Aufgaben in diesem Prüfungsteil</span>
      <div className="cheat-links">
        {siblings.map((t) => (
          <button key={t.id} type="button" className="tag-btn" onClick={() => onOpenType(t.id)}>
            {t.title}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ========================================================== level view === */

function LevelView({ level, onLevel, onOpenType, onOpenFormat, onGo, learningMode }) {
  const info = LEVEL_EXPECTATIONS[level];
  const modules = (info.modules || []).map((id) => MODULE_BY_ID[id]).filter(Boolean);
  const types = EXERCISE_TYPES.filter((t) => t.levels.includes(level));
  const formats = (info.formats || []).map((id) => FORMAT_BY_ID[id]).filter(Boolean);

  return (
    <div className="cheat-level-view">
      <div className="seg" role="group" aria-label="Niveau wählen">
        {LEVELS.map((l) => (
          <button key={l} type="button" aria-pressed={level === l} onClick={() => onLevel(l)}>{l}</button>
        ))}
      </div>

      <header className="cheat-level-hero">
        <div>
          <span className="eyebrow"><LevelTag level={level} /> Niveaustufe</span>
          <h2>{info.name}</h2>
          <p>{info.claim}</p>
        </div>
        <dl>
          <div><dt>Prüfungen</dt><dd>{info.exams}</dd></div>
          <div><dt>Bestehen</dt><dd>{info.pass}</dd></div>
        </dl>
      </header>

      <div className="callout info cheat-new-here">
        <span className="eyebrow">Neu auf diesem Niveau</span>
        <p>{info.newHere}</p>
      </div>

      <section>
        <span className="eyebrow">Die vier Fertigkeiten</span>
        <div className="cheat-skills">
          {info.skills.map((s) => (
            <div key={s.id}>
              <b>{s.label}</b>
              <span className="mono">{s.time}</span>
              <p>{s.expect}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="cheat-two">
        <section>
          <span className="eyebrow">Das musst du auf {level} können</span>
          <ul className="cheat-focus">
            {info.mustHave.map((m, i) => <li key={i}><IconCheck />{m}</li>)}
          </ul>
        </section>
        <section>
          <span className="eyebrow"><IconWarning /> Die Fehler, die hier durchfallen lassen</span>
          <ul className="pit">
            {info.killers.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        </section>
      </div>

      {formats.length > 0 && (
        <section>
          <span className="eyebrow">Prüfungen auf diesem Niveau</span>
          <div className="cheat-links">
            {formats.map((f) => (
              <button key={f.id} type="button" className="tag-btn" onClick={() => onOpenFormat(f.id)}>
                {f.name} <IconArrowRight />
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <span className="eyebrow">Aufgabentypen, die auf {level} vorkommen ({types.length})</span>
        <div className="cheat-links">
          {types.map((t) => (
            <button key={t.id} type="button" className="tag-btn" onClick={() => onOpenType(t.id)}>
              {t.title}
            </button>
          ))}
        </div>
      </section>

      {!learningMode && modules.length > 0 && (
        <section>
          <span className="eyebrow">Kapitel im Regelteil</span>
          <div className="cheat-links">
            {modules.map((m) => (
              <button key={m.id} type="button" className="tag-btn" onClick={() => onGo?.("learn", m.id)}>
                {m.title}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ========================================================= format view === */

function FormatView({ formatId, onFormat, onOpenType, onOpenLevel }) {
  const format = FORMAT_BY_ID[formatId] || EXAM_FORMATS[0];

  return (
    <div className="cheat-format-view">
      <div className="chips" role="group" aria-label="Prüfung wählen">
        {EXAM_FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            aria-pressed={f.id === format.id}
            onClick={() => onFormat(f.id)}
          >
            <LevelTag level={f.level} /> {f.name}
          </button>
        ))}
      </div>

      <header className="cheat-format-head">
        <div>
          <span className="eyebrow">{format.provider}</span>
          <h2>{format.name}</h2>
          <p>{format.scope}</p>
        </div>
        <dl>
          <div><dt>Niveau</dt><dd><button type="button" className="cheat-level-btn" onClick={() => onOpenLevel(format.level)}><LevelTag level={format.level} /></button></dd></div>
          <div><dt>Bestehen</dt><dd>{format.pass}</dd></div>
        </dl>
      </header>

      {format.note && (
        <div className="callout warn"><p>{format.note}</p></div>
      )}

      <div className="cheat-parts">
        {format.parts.map((part) => (
          <section key={part.label}>
            <header>
              <b>{part.label}</b>
              <span className="mono">{part.time}</span>
              <span className="dim">{part.items}</span>
            </header>
            <div className="tbl-wrap">
              <table className="grid-tbl cheat-part-tbl">
                <thead>
                  <tr>
                    <th scope="col">Teil</th>
                    <th scope="col">Text</th>
                    <th scope="col">Aufgabenform</th>
                    <th scope="col">Umfang</th>
                    <th scope="col">Trick</th>
                  </tr>
                </thead>
                <tbody>
                  {part.teile.map((t, i) => {
                    const target = TYPE_BY_ID[t.typeId];
                    return (
                      <tr key={i}>
                        <th scope="row">{t.n}</th>
                        <td>{t.text}</td>
                        <td>{t.format}</td>
                        <td className="dim">{t.items}</td>
                        <td>
                          {target && (
                            <button type="button" className="cheat-inline-link" onClick={() => onOpenType(target.id)}>
                              {target.trick.name} <IconArrowRight />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {format.url && (
        <p className="cheat-source">
          Offizielles Material: <a href={format.url} target="_blank" rel="noopener noreferrer">{format.provider}</a>
          {" · "}Formate werden gelegentlich überarbeitet — prüfe den aktuellen Modellsatz deines Prüfungszentrums.
        </p>
      )}
    </div>
  );
}
