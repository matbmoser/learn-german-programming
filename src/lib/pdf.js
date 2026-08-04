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

// ============================================================================
//  PDF EXPORT — renders a full correction report as a standalone printable
//  document in the app's dark theme (with charts) and opens the browser print
//  dialog, where "Save as PDF" produces the file. No third-party dependency.
// ============================================================================

import { WRITING_CRITERIA } from "../data/writing.js";
import { PALETTE, computeWritingStats, donutSvg, barsSvg } from "./charts.js";

const CRIT = Object.fromEntries(WRITING_CRITERIA.map((c) => [c.id, c.name]));

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function section(title, inner) {
  if (!inner) return "";
  return `<section><h2>${esc(title)}</h2>${inner}</section>`;
}

function corrList(items = []) {
  if (!items.length) return "";
  return `<ul class="corr">${items
    .map(
      (c) => `<li class="sev-${esc(c.severity || "mittel")}">
        <div class="ctype">${esc(c.type || "")} · ${esc(c.severity || "")}</div>
        <div class="cline"><span class="bad">${esc(c.original)}</span> → <span class="good">${esc(c.corrected)}</span></div>
        <div class="why">${esc(c.why || "")}</div>
      </li>`
    )
    .join("")}</ul>`;
}

function chartsBlock(fb) {
  const stats = computeWritingStats(fb);
  const cards = [];

  if (stats.scores.length) {
    const bars = barsSvg({
      items: stats.scores.map((s) => ({ label: CRIT[s.criterion] || s.criterion, value: s.score, color: PALETTE.gen })),
      width: 300,
      max: 5,
      suffix: "/5",
    });
    cards.push(`<figure class="chart"><figcaption>Bewertung</figcaption>${bars}</figure>`);
  }

  if (stats.totalErrors > 0) {
    const donut = donutSvg({
      segments: stats.severity,
      centerTop: String(stats.totalErrors),
      centerSub: "Fehler",
    });
    const legend = stats.severity
      .map((s) => `<span class="lg"><i style="background:${s.color}"></i>${esc(s.label)} · ${s.count}</span>`)
      .join("");
    cards.push(`<figure class="chart"><figcaption>Fehler nach Schwere</figcaption>${donut}<div class="legend">${legend}</div></figure>`);
  }

  if (stats.types.length) {
    const bars = barsSvg({ items: stats.types.slice(0, 6), width: 300 });
    cards.push(`<figure class="chart"><figcaption>Fehlerarten</figcaption>${bars}</figure>`);
  }

  if (stats.patterns.length) {
    const bars = barsSvg({ items: stats.patterns.slice(0, 5).map((p) => ({ ...p, color: PALETTE.akk })), width: 300 });
    cards.push(`<figure class="chart"><figcaption>Fehlermuster</figcaption>${bars}</figure>`);
  }

  if (!cards.length) return "";
  return `<div class="charts">${cards.join("")}</div>`;
}

export function exportWritingPdf({ task, text, words, feedback, targetLevel = "C1" }) {
  const fb = feedback || {};
  const scores = (fb.scores || [])
    .map(
      (s) =>
        `<tr><td>${esc(CRIT[s.criterion] || s.criterion)}</td><td class="num">${esc(s.score)}/5</td><td>${esc(s.comment || "")}</td></tr>`
    )
    .join("");

  const patterns = (fb.error_patterns || [])
    .map(
      (p) => `<li>
        <div class="ctype">${esc(p.label || "")} · ${esc(p.frequency || 0)}×</div>
        <div class="why">${esc(p.pattern || "")}</div>
        ${
          (p.evidence || []).length
            ? `<ul class="ev">${p.evidence.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`
            : ""
        }
      </li>`
    )
    .join("");

  const upgrades = (fb.upgrades || [])
    .map(
      (u) => `<li>
        <div class="cline"><span class="dim">${esc(u.original)}</span> → <span class="up">${esc(u.upgraded)}</span></div>
        <div class="why">${esc(u.why || "")}</div>
      </li>`
    )
    .join("");

  const studyPlan = (fb.study_plan || [])
    .map(
      (s, i) => `<li><b>${i + 1}. ${esc(s.focus || "")}</b><div class="why">${esc(s.action || "")}</div></li>`
    )
    .join("");

  const list = (arr) => (arr || []).map((s) => `<li>${esc(s)}</li>`).join("");

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<title>Korrektur — ${esc(task?.title || "Text")}</title>
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { background: ${PALETTE.paper}; }
  body { font-family: Charter, "Iowan Old Style", Palatino, Georgia, serif; color: ${PALETTE.ink};
         margin: 0; padding: 34px 40px; line-height: 1.55; }
  h1 { font-size: 23px; margin: 0 0 4px; font-family: "Futura", "Avenir Next", "Helvetica Neue", Arial, sans-serif; font-weight: 500; }
  h2 { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: ${PALETTE.gen};
       border-bottom: 1px solid ${PALETTE.rule}; padding-bottom: 5px; margin: 28px 0 12px;
       font-family: "Futura", "Avenir Next", "Helvetica Neue", Arial, sans-serif; font-weight: 600; }
  .sub { color: ${PALETTE.ink3}; font-size: 12px; font-family: "Helvetica Neue", Arial, sans-serif; letter-spacing: .02em; }

  .meta { display: flex; gap: 12px; margin: 16px 0 6px; }
  .meta div { flex: 1; background: ${PALETTE.surface}; border: 1px solid ${PALETTE.rule}; border-radius: 8px; padding: 10px 14px; }
  .meta div span { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: ${PALETTE.ink3};
                   font-family: "Helvetica Neue", Arial, sans-serif; }
  .meta div b { font-size: 22px; font-family: "Futura", "Avenir Next", "Helvetica Neue", Arial, sans-serif; font-weight: 500; }

  .charts { display: flex; flex-wrap: wrap; gap: 12px; margin: 4px 0; }
  .chart { flex: 1 1 300px; min-width: 280px; margin: 0; background: ${PALETTE.surface};
           border: 1px solid ${PALETTE.rule}; border-radius: 10px; padding: 14px 16px; text-align: center; }
  .chart figcaption { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: ${PALETTE.ink3};
                      margin-bottom: 10px; font-family: "Helvetica Neue", Arial, sans-serif; text-align: left; }
  .chart svg { max-width: 100%; height: auto; }
  .legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 8px;
            font-size: 11px; color: ${PALETTE.ink2}; font-family: "Helvetica Neue", Arial, sans-serif; }
  .legend .lg { display: inline-flex; align-items: center; gap: 5px; }
  .legend i { width: 9px; height: 9px; border-radius: 2px; display: inline-block; }

  .orig, .improved { white-space: pre-wrap; background: ${PALETTE.surface}; border: 1px solid ${PALETTE.rule};
          border-radius: 8px; padding: 12px 14px; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  td { border-bottom: 1px solid ${PALETTE.rule}; padding: 7px 8px; vertical-align: top; }
  td.num { font-family: "Helvetica Neue", Arial, sans-serif; white-space: nowrap; width: 48px; color: ${PALETTE.ink2}; }
  ul { list-style: none; padding: 0; margin: 0; }
  ul.corr > li, section > ul > li { border-left: 3px solid ${PALETTE.rule}; padding: 7px 0 7px 12px; margin: 9px 0; }
  .sev-hoch { border-left-color: ${PALETTE.no}; }
  .sev-mittel { border-left-color: ${PALETTE.warn}; }
  .sev-niedrig { border-left-color: ${PALETTE.ink3}; }
  .ctype { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: ${PALETTE.ink3};
           font-family: "Helvetica Neue", Arial, sans-serif; }
  .cline { font-size: 15px; margin: 3px 0; }
  .bad { color: ${PALETTE.no}; text-decoration: line-through; }
  .good { color: ${PALETTE.ok}; }
  .up { color: ${PALETTE.dat}; }
  .dim { color: ${PALETTE.ink3}; }
  .why { font-size: 13px; color: ${PALETTE.ink2}; }
  ul.ev { margin: 5px 0 0; }
  ul.ev li { border: none; padding: 1px 0 1px 12px; font-size: 13px; color: ${PALETTE.ink3}; font-style: italic; }
  .cols { display: flex; gap: 26px; }
  .cols section { flex: 1; }
  @media print { body { padding: 0 8mm; } h2 { break-after: avoid; } li, tr, .chart, figure { break-inside: avoid; } }
</style></head>
<body>
  <h1>${esc(task?.title || "Textkorrektur")}</h1>
  <div class="sub">${esc(task?.type || "")} · Niveau ${esc(task?.level || "")} · Zielniveau ${esc(targetLevel)} · ${new Date().toLocaleDateString("de-DE")}</div>

  <div class="meta">
    <div><span>Niveau des Textes</span><b>${esc(fb.cefr_estimate || "—")}</b></div>
    <div><span>Wörter</span><b>${esc(fb.word_count ?? words ?? "—")}</b></div>
    <div><span>Fehler</span><b>${(fb.corrections || []).length}</b></div>
    <div><span>Aufgabe erfüllt</span><b style="color:${fb.task_met ? PALETTE.ok : PALETTE.no}">${fb.task_met ? "ja" : "nein"}</b></div>
  </div>
  ${fb.cefr_reasoning ? `<p class="why">${esc(fb.cefr_reasoning)}</p>` : ""}

  ${section("Statistik", chartsBlock(fb))}
  ${section("Aufgabenstellung", task?.prompt ? `<p class="why">${esc(task.prompt)}</p>` : "")}
  ${section("Dein Text", `<div class="orig">${esc(text)}</div>`)}
  ${section("Bewertung", scores ? `<table>${scores}</table>` : "")}
  ${section(`Fehler (${(fb.corrections || []).length})`, corrList(fb.corrections))}
  ${section(`Fehlermuster (${(fb.error_patterns || []).length})`, patterns ? `<ul>${patterns}</ul>` : "")}
  ${section("Korrekt, aber unter Niveau", upgrades ? `<ul>${upgrades}</ul>` : "")}
  ${section("Auf Zielniveau umgeschrieben", fb.improved_version ? `<div class="improved">${esc(fb.improved_version)}</div>` : "")}
  <div class="cols">
    ${section("Das sitzt schon", list(fb.strengths) ? `<ul>${list(fb.strengths)}</ul>` : "")}
    ${section("Nächste Schritte", list(fb.next_steps) ? `<ul>${list(fb.next_steps)}</ul>` : "")}
  </div>
  ${section("Dein Lernweg", studyPlan ? `<ul>${studyPlan}</ul>` : "")}
</body></html>`;

  const win = window.open("", "_blank");
  if (!win) {
    throw new Error("Der Druck-Tab wurde vom Browser blockiert. Erlaube Pop-ups und versuche es erneut.");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  // let the new document lay out before invoking print
  win.setTimeout(() => win.print(), 350);
}
