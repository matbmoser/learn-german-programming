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
//  CHARTS — dependency-free SVG statistics, shared by the Write UI and the PDF
//  report so both show the same figures in the app's dark palette.
// ============================================================================

export const PALETTE = {
  paper: "#0f1211",
  surface: "#161a18",
  raised: "#1e2320",
  raised2: "#262c28",
  ink: "#e9ede7",
  ink2: "#a6afa7",
  ink3: "#727a73",
  rule: "#2c332e",
  nom: "#6fb3e8",
  akk: "#f09a5c",
  dat: "#c49bee",
  gen: "#52c3ae",
  ok: "#5cc78d",
  no: "#f0736b",
  warn: "#f0c05c",
};

// Colour cycled through error-type bars.
const CYCLE = [PALETTE.nom, PALETTE.akk, PALETTE.dat, PALETTE.gen, PALETTE.ok, PALETTE.warn];

const SEV = {
  hoch: { label: "hoch", color: PALETTE.no },
  mittel: { label: "mittel", color: PALETTE.warn },
  niedrig: { label: "niedrig", color: PALETTE.ink3 },
};

function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clip(s, n = 22) {
  const t = String(s ?? "");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

/** Distil a correction feedback object into the numbers the charts need. */
export function computeWritingStats(fb = {}) {
  const corrections = fb.corrections || [];
  const sevCounts = { hoch: 0, mittel: 0, niedrig: 0 };
  const typeCounts = {};
  for (const c of corrections) {
    const sev = SEV[c.severity] ? c.severity : "mittel";
    sevCounts[sev] += 1;
    const t = (c.type || "—").trim() || "—";
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  }
  const severity = Object.keys(SEV).map((k) => ({ key: k, label: SEV[k].label, color: SEV[k].color, count: sevCounts[k] }));
  const types = Object.entries(typeCounts)
    .map(([label, count], i) => ({ label, count, color: CYCLE[i % CYCLE.length] }))
    .sort((a, b) => b.count - a.count);
  const patterns = (fb.error_patterns || [])
    .map((p) => ({ label: p.label || p.rule || "—", count: Number(p.frequency) || (p.evidence?.length ?? 0) }))
    .sort((a, b) => b.count - a.count);
  const scores = (fb.scores || []).map((s) => ({ criterion: s.criterion, score: Number(s.score) || 0 }));
  return { totalErrors: corrections.length, severity, types, patterns, scores };
}

/** Doughnut chart. `segments` = [{ value, color }]. Returns an SVG string. */
export function donutSvg({ segments = [], centerTop = "", centerSub = "", size = 132, stroke = 18 }) {
  const val = (s) => s.value ?? s.count ?? 0;
  const total = segments.reduce((n, s) => n + val(s), 0);
  const cx = size / 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const rings =
    total === 0
      ? `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${PALETTE.rule}" stroke-width="${stroke}"/>`
      : segments
          .filter((s) => val(s) > 0)
          .map((s) => {
            const len = (val(s) / total) * c;
            const el = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${stroke}" stroke-linecap="butt" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cx})"/>`;
            offset += len;
            return el;
          })
          .join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" font-family="Helvetica Neue, Arial, sans-serif">
    ${rings}
    <text x="${cx}" y="${cx - 1}" text-anchor="middle" font-size="30" font-weight="600" fill="${PALETTE.ink}">${esc(centerTop)}</text>
    <text x="${cx}" y="${cx + 15}" text-anchor="middle" font-size="9" letter-spacing="1" fill="${PALETTE.ink3}">${esc(String(centerSub).toUpperCase())}</text>
  </svg>`;
}

/** Horizontal bar chart. `items` = [{ label, value, color }]. Returns SVG string. */
export function barsSvg({ items = [], width = 300, max, suffix = "", labelW = 104, barH = 16, gap = 10 }) {
  if (!items.length) return "";
  const val = (it) => it.value ?? it.count ?? 0;
  const top = max ?? Math.max(1, ...items.map(val));
  const rowH = barH + gap;
  const height = items.length * rowH - gap + 4;
  const valW = 34;
  const trackW = Math.max(20, width - labelW - valW);
  const rows = items
    .map((it, i) => {
      const y = i * rowH;
      const w = Math.max(2, (val(it) / top) * trackW);
      const color = it.color || PALETTE.nom;
      return `
      <text x="0" y="${y + barH - 3}" font-size="11" fill="${PALETTE.ink2}">${esc(clip(it.label))}</text>
      <rect x="${labelW}" y="${y}" width="${trackW}" height="${barH}" rx="4" fill="${PALETTE.rule}"/>
      <rect x="${labelW}" y="${y}" width="${w}" height="${barH}" rx="4" fill="${color}"/>
      <text x="${labelW + trackW + valW}" y="${y + barH - 3}" font-size="11" text-anchor="end" fill="${PALETTE.ink3}">${esc(val(it) + suffix)}</text>`;
    })
    .join("");
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" font-family="Helvetica Neue, Arial, sans-serif">${rows}</svg>`;
}
