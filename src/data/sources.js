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
//  SOURCES — every rule in this app that can be checked against a German
//  reference authority links to one. Nothing here is a blog, a course site or
//  a language-school summary: only the institutions that actually describe or
//  codify standard German.
//
//  Hierarchy of authority used throughout:
//
//   1. Rat für deutsche Rechtschreibung — the intergovernmental body whose
//      Amtliches Regelwerk is legally binding for schools and public
//      administration in DE/AT/CH. Orthography and punctuation only.
//   2. IDS Mannheim · grammis — the Leibniz-Institut für Deutsche Sprache's
//      grammatical information system. The reference *description* of German
//      grammar; not prescriptive, but corpus-based and peer-reviewed.
//   3. Duden — the standard usage reference. Descriptive-normative; the
//      Sprachratgeber articles answer the "which variant is correct" questions.
//   4. DWDS (BBAW) — Digitales Wörterbuch der deutschen Sprache: corpus
//      evidence and word articles.
//   5. Goethe-Institut / Europarat — CEFR level definitions (A2–C1), not
//      grammar.
//
//  A rule with no source entry is either uncontroversial school grammar or a
//  didactic simplification made by this app — treat those with more suspicion,
//  not less.
// ============================================================================

export const SOURCE_ORGS = {
  ids: { name: "IDS Mannheim · grammis", note: "Leibniz-Institut für Deutsche Sprache — beschreibende Referenzgrammatik" },
  duden: { name: "Duden", note: "Standardnachschlagewerk, Sprachratgeber" },
  rdr: { name: "Rat für deutsche Rechtschreibung", note: "Amtliches Regelwerk — verbindlich für Schule und Verwaltung" },
  dwds: { name: "DWDS · BBAW", note: "Korpusbelege und Wortartikel" },
  cefr: { name: "Europarat / Goethe-Institut", note: "GER-Niveaubeschreibungen" },
};

/** id → { org, label, url }. Ids are referenced from rulebook.js / curriculum.js. */
export const SOURCES = {
  // ---------------------------------------------------------------- IDS ----
  "ids-kasus": {
    org: "ids", label: "Kasus",
    url: "https://grammis.ids-mannheim.de/terminologie/117",
  },
  "ids-nomen": {
    org: "ids", label: "Nomen",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/273",
  },
  "ids-flexionsklassen": {
    org: "ids", label: "Flexionsklassen der Nomina (inkl. schwache Maskulina)",
    url: "https://grammis.ids-mannheim.de/progr@mm/4064",
  },
  "ids-numerus": {
    org: "ids", label: "Numerusflexion — Pluralbildung",
    url: "https://grammis.ids-mannheim.de/progr@mm/4065",
  },
  "ids-adjflex": {
    org: "ids", label: "Flexion der Adjektive",
    url: "https://grammis.ids-mannheim.de/progr@mm/4067",
  },
  "ids-adjstark": {
    org: "ids", label: "Starke und schwache Adjektivflexion",
    url: "https://grammis.ids-mannheim.de/progr@mm/6751",
  },
  "ids-steigerung": {
    org: "ids", label: "Steigerung der Adjektive",
    url: "https://grammis.ids-mannheim.de/progr@mm/6759",
  },
  "ids-satzklammer": {
    org: "ids", label: "Stellungsfelder und Satzklammer",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/1241",
  },
  "ids-klammer-progr": {
    org: "ids", label: "Wortstellung in der Satzklammer",
    url: "https://grammis.ids-mannheim.de/progr@mm/6840",
  },
  "ids-konnektoren": {
    org: "ids", label: "Konnektoren",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/1182",
  },
  "ids-verbstellung-weil": {
    org: "ids", label: "Verbstellung nach weil, obwohl, wobei",
    url: "https://grammis.ids-mannheim.de/fragen/133",
  },
  "ids-relativ": {
    org: "ids", label: "Relativ-Elemente",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/368",
  },
  "ids-ersatzinfinitiv": {
    org: "ids", label: "Ersatzinfinitiv",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/1615",
  },
  "ids-verbalkomplex": {
    org: "ids", label: "Hilfsverben im Verbalkomplex",
    url: "https://grammis.ids-mannheim.de/kontrastive-grammatik/6049",
  },
  "ids-inf-zu": {
    org: "ids", label: "Verben mit einem Infinitiv mit oder ohne zu",
    url: "https://grammis.ids-mannheim.de/fragen/98",
  },
  "ids-modalverb": {
    org: "ids", label: "Modalverb",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/380",
  },
  "ids-konjunktiv": {
    org: "ids", label: "Konjunktiv",
    url: "https://grammis.ids-mannheim.de/terminologie/132",
  },
  "ids-werden-passiv": {
    org: "ids", label: "Werden-Passiv",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/929",
  },
  "ids-sein-passiv": {
    org: "ids", label: "sein-Passiv (Zustandspassiv)",
    url: "https://grammis.ids-mannheim.de/terminologie/355",
  },
  "ids-passivfaehigkeit": {
    org: "ids", label: "Passivfähigkeit bei werden- und sein-Passiv",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/1136",
  },
  "ids-subjektloses-passiv": {
    org: "ids", label: "Subjektloses werden-Passiv",
    url: "https://grammis.ids-mannheim.de/systematische-grammatik/1068",
  },
  "ids-praeposition": {
    org: "ids", label: "Präposition",
    url: "https://grammis.ids-mannheim.de/sgt/2212",
  },

  // -------------------------------------------------------------- Duden ----
  "duden-steigerung": {
    org: "duden", label: "Die Steigerung (Komparation) deutscher Adjektive",
    url: "https://www.duden.de/sprachwissen/sprachratgeber/steigerung-komparation-deutsche-adjektive",
  },
  "duden-entlang": {
    org: "duden", label: "entlang — Kasus je nach Stellung",
    url: "https://www.duden.de/rechtschreibung/entlang_seitlich_zuseiten",
  },
  "duden-genitivpraep": {
    org: "duden", label: "Präpositionen mit Genitiv",
    url: "https://www.duden.de/sprachwissen/sprachratgeber/Pr%C3%A4positionen-mit-Genitiv",
  },
  "duden-lehren": {
    org: "duden", label: "Das Verb „lehren“ — Infinitiv mit oder ohne zu",
    url: "https://www.duden.de/sprachwissen/sprachratgeber/Das-Verb-%E2%80%9Elehren%E2%80%9C",
  },
  "duden-inf-komma": {
    org: "duden", label: "Das Komma beim Infinitiv mit „zu“",
    url: "https://www.duden.de/sprachwissen/sprachratgeber/Das-Komma-beim-Infinitiv-mit-%E2%80%9Ezu%E2%80%9C",
  },
  "duden-als": {
    org: "duden", label: "Funktionen von „als“",
    url: "https://www.duden.de/sprachwissen/sprachratgeber/Funktionen-von-als",
  },

  // ------------------------------------------------------ Regelwerk etc. ----
  "rdr-regelwerk": {
    org: "rdr", label: "Amtliches Regelwerk der deutschen Rechtschreibung",
    url: "https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/",
  },
  "dwds": {
    org: "dwds", label: "DWDS — Wortartikel und Korpusbelege",
    url: "https://www.dwds.de/",
  },
};

// ============================================================================
//  Rule → source mapping. Kept in one file on purpose: this is the list to
//  audit when you want to know whether a claim in the app is backed by an
//  authority or is just this app's didactic shorthand.
// ============================================================================

/** Rulebook rule id → source ids. */
export const RULE_SOURCES = {
  // Nomen & Artikel
  "R-001": ["ids-nomen", "ids-flexionsklassen"],
  "R-002": ["ids-numerus", "ids-flexionsklassen"],
  "R-003": ["ids-flexionsklassen"],
  "R-004": ["ids-flexionsklassen", "ids-kasus"],
  "R-005": ["ids-numerus"],
  "R-006": ["ids-kasus"],
  "R-007": ["ids-kasus"],
  "R-008": ["ids-kasus"],
  // Adjektive
  "R-020": ["ids-adjflex", "ids-adjstark"],
  "R-021": ["ids-adjflex", "ids-adjstark"],
  "R-022": ["ids-adjflex", "ids-adjstark"],
  "R-023": ["duden-steigerung", "ids-steigerung"],
  "R-024": ["duden-steigerung", "ids-steigerung"],
  // Verben
  "R-031": ["dwds"],
  "R-032": ["ids-satzklammer"],
  "R-033": ["ids-satzklammer"],
  "R-034": ["ids-modalverb"],
  "R-035": ["ids-modalverb", "ids-ersatzinfinitiv"],
  "R-036": ["rdr-regelwerk"],
  "R-037": ["ids-adjflex"],
  "R-038": ["ids-inf-zu", "duden-lehren", "duden-inf-komma"],
  "R-039": ["ids-ersatzinfinitiv", "ids-inf-zu", "duden-lehren"],
  "R-051": ["ids-verbalkomplex"],
  "R-052": ["ids-verbalkomplex"],
  "R-053": ["ids-verbalkomplex"],
  "R-054": ["ids-verbalkomplex"],
  // Satzbau
  "R-060": ["ids-satzklammer", "ids-klammer-progr"],
  "R-061": ["ids-satzklammer"],
  "R-062": ["ids-satzklammer", "ids-verbalkomplex", "ids-verbstellung-weil"],
  "R-063": ["ids-satzklammer", "ids-klammer-progr"],
  "R-064": ["ids-satzklammer"],
  "R-065": ["ids-satzklammer"],
  "R-068": ["ids-konnektoren", "ids-verbstellung-weil"],
  "R-069": ["ids-konnektoren"],
  "R-070": ["ids-konnektoren", "ids-verbstellung-weil"],
  "R-071": ["ids-relativ"],
  "R-072": ["ids-konnektoren"],
  // Präpositionen & Kasus
  "R-080": ["ids-kasus"],
  "R-081": ["ids-praeposition", "duden-entlang"],
  "R-082": ["ids-praeposition"],
  "R-083": ["ids-praeposition"],
  "R-084": ["duden-genitivpraep", "ids-praeposition"],
  "R-085": ["ids-praeposition", "dwds"],
  "R-086": ["ids-praeposition"],
  // Konjunktiv
  "R-087": ["ids-konjunktiv"],
  "R-088": ["ids-konjunktiv"],
  "R-089": ["ids-konjunktiv", "ids-verbalkomplex"],
  "R-090": ["ids-konjunktiv"],
  "R-091": ["ids-konjunktiv"],
  // Passiv
  "R-092": ["ids-werden-passiv"],
  "R-093": ["ids-sein-passiv"],
  "R-094": ["ids-subjektloses-passiv"],
  "R-095": ["ids-werden-passiv", "ids-ersatzinfinitiv"],
  "R-096": ["ids-passivfaehigkeit"],
  "R-097": ["ids-passivfaehigkeit"],
  // Register
  "R-101": ["ids-adjflex"],
  "R-103": ["ids-konnektoren"],
  "R-104": ["ids-konnektoren"],
  "R-105": ["ids-inf-zu", "ids-konnektoren"],
};

/** Curriculum module id → source ids. */
export const MODULE_SOURCES = {
  kasus: ["ids-kasus", "ids-nomen"],
  adjektiv: ["ids-adjflex", "ids-adjstark"],
  praep: ["ids-praeposition", "duden-entlang"],
  wortstellung: ["ids-satzklammer", "ids-klammer-progr"],
  zeiten: ["ids-verbalkomplex", "rdr-regelwerk"],
  modalverben: ["ids-modalverb", "ids-ersatzinfinitiv"],
  reflexiv: ["ids-kasus"],
  komparativ: ["duden-steigerung", "ids-steigerung"],
  genitiv: ["duden-genitivpraep", "ids-kasus"],
  nebensatz: ["ids-konnektoren", "ids-verbstellung-weil", "duden-als"],
  relativsatz: ["ids-relativ"],
  konjunktiv2: ["ids-konjunktiv"],
  passiv: ["ids-werden-passiv", "ids-sein-passiv"],
  "infinitiv-zu": ["ids-inf-zu", "duden-lehren", "duden-inf-komma"],
  temporal: ["duden-als", "ids-konnektoren"],
  futur: ["ids-verbalkomplex"],
  verbpraep: ["ids-praeposition", "dwds"],
  konjunktiv1: ["ids-konjunktiv"],
  "n-deklination": ["ids-flexionsklassen"],
  partizipialattribut: ["ids-adjflex"],
  nominalisierung: ["duden-genitivpraep", "ids-konnektoren"],
  "konnektoren-b2": ["ids-konnektoren"],
  "modal-subjektiv": ["ids-modalverb"],
  "passiv-b2": ["ids-passivfaehigkeit", "ids-subjektloses-passiv", "ids-werden-passiv"],
  nominalstil: ["dwds"],
  passiversatz: ["ids-passivfaehigkeit"],
  "konjunktiv2-vergangenheit": ["ids-konjunktiv", "ids-verbalkomplex"],
  "erweitertes-attribut": ["ids-adjflex", "ids-relativ"],
  "konnektoren-c1": ["ids-konnektoren"],
  modalpartikeln: ["dwds"],
  "schreiben-c1": ["rdr-regelwerk"],
};

export const sourceById = (id) => SOURCES[id] || null;

/** Resolve a list of ids to renderable entries, silently dropping unknown ids. */
export function resolveSources(ids) {
  return (ids || [])
    .map((id) => {
      const s = SOURCES[id];
      return s ? { id, ...s, org: SOURCE_ORGS[s.org] || { name: s.org } } : null;
    })
    .filter(Boolean);
}
