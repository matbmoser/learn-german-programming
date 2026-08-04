# Deutsch A2 → C1 — Sprachspezifikation

German grammar taught as a type system. A static React app: a 32-module A2–C1
reference, a drill engine that generates questions fresh and weights them toward
your weak spots, an adaptive CEFR placement exam, and a writing trainer that
sends your text to Claude for a graded, rule-by-rule correction.

No backend. Everything runs in the browser and progress stays in `localStorage`.

---

## Screenshots

| Übersicht | Regeln | Drill |
|---|---|---|
| [![Dashboard](docs/screenshots/dashboard.png)](docs/screenshots/dashboard.png) | [![Learn](docs/screenshots/learn.png)](docs/screenshots/learn.png) | [![Drill](docs/screenshots/drill.png)](docs/screenshots/drill.png) |

| Einstufung | Schreiben | Einstellungen |
|---|---|---|
| [![Exam](docs/screenshots/exam.png)](docs/screenshots/exam.png) | [![Write](docs/screenshots/write.png)](docs/screenshots/write.png) | [![Settings](docs/screenshots/settings.png)](docs/screenshots/settings.png) |

---

## Run it

```bash
npm install
npm run dev
```

Build a static bundle:

```bash
npm run build
```

The output lands in `dist/`. `vite.config.js` sets `base: "./"`, so the same
build works at `username.github.io`, at `username.github.io/repo/`, and from the
local filesystem — no path configuration needed.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: in the repository, go to **Settings → Pages → Build and
deployment → Source** and choose **GitHub Actions**. Then:

```bash
git init && git add -A && git commit -m "Deutsch A2 → C1"
git branch -M main
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

---

## What's in it

| Bereich | Was es tut |
|---|---|
| **§1 Regeln** | 32 modules A2→C1. Each one: the rule as code, the table it collapses to, real examples, and the mistakes that cost marks in an exam. |
| **§2 Drill** | 21 generators produce questions on demand. Every answer — right or wrong — prints the derivation that produced it. Weighted toward your weakest rules. |
| **§3 Einstufung** | 30 adaptive questions. Climbs after three correct at a level, drops after two wrong. Returns a CEFR estimate, the gap to C1, and your weakest topics. |
| **§4 Schreiben** | 12 exam-style writing tasks A2→C1. Claude returns a CEFR estimate, marks per criterion, every error with its rule, correct-but-below-level phrasings with their target-level version, and your text rewritten at level. |
| **§5 Einstellungen** | API key, mode, export/import, reset. |

### The grammar engine

`src/engine/grammar.js` derives forms rather than storing them: articles and
adjective endings from the case/gender tables, all six tenses plus Konjunktiv I
and II and the full passive paradigm by composition. Konjunktiv I applies the
real fallback rule — if the form would be identical to the indicative, it
switches to Konjunktiv II and says so.

`src/engine/drills.js` turns that into questions. `src/engine/exam.js` runs the
adaptive ladder and estimates the level.

---

## Connecting Claude

Two modes, switchable in **§5 Einstellungen**.

### Manual (no key) — the safe default

The app builds the full prompt including the JSON schema. You paste it into
claude.ai, the Claude app, or Claude Code, and paste the JSON answer back. The
app parses and renders it exactly as if it had called the API. Nothing leaves
the page except what you copy yourself.

### API key

This is a static site with no server, so the browser calls the Anthropic API
directly. That means:

- The key is stored in this browser's `localStorage` and is visible in the
  network tab on every request.
- Anyone with access to the browser profile can read it.
- Use a key scoped to you, don't use this mode on a shared machine, and rotate
  the key if you ever publish the site somewhere others use it.
- **A progress export never contains the key** — it is stored under a separate
  `localStorage` entry and excluded from the export.

The API path uses the official `@anthropic-ai/sdk` with
`dangerouslyAllowBrowser: true`, `claude-opus-5`, and structured outputs, so the
response is schema-validated JSON rather than prose to parse. The SDK is loaded
lazily, so it stays out of the initial bundle if you never use it.

Get a key at [console.anthropic.com](https://console.anthropic.com/settings/keys).
Requests are billed to your own account.

### What Claude is asked to do

1. **Correct writing** — CEFR estimate with reasons, 0–5 per criterion
   (Aufgabe, Kohärenz, Wortschatz, Grammatik, Register), every error as
   `original → corrected` with the rule behind it and a severity, 3–6
   below-level phrasings with their target-level version, and the whole text
   rewritten at level.
2. **Generate challenges** — 8 fresh questions aimed at your weakest rules. The
   built-in generators have fixed patterns; Claude does not.
3. **Explain a mistake** — on a wrong drill answer: the rule, why your answer
   fails, a minimal pair, and a mnemonic.

---

## Progress

Stored in `localStorage` under `dc1:progress`: per-rule mastery, streaks, daily
counts, exam history, and every submitted text with its correction.

- **Export / Import** — JSON, in §5. Use it to move between browsers or to keep
  a backup, since clearing site data wipes the store.
- **Reset** — §5, behind a confirmation. Clears mastery, streaks, exams and
  texts. The API key is separate and is deleted with its own button.

---

## Project layout

```
src/
  data/
    lexicon.js      nouns, verbs, modals, prepositions, connectors, phrase banks
    curriculum.js   32 grammar modules A2→C1
    writing.js      12 writing tasks + the CEFR marking criteria
  engine/
    grammar.js      declension + conjugation, each with its rule trace
    drills.js       21 question generators + weak-rule weighting
    exam.js         adaptive ladder, fixed item bank, CEFR estimator
  lib/
    claude.js       Anthropic SDK calls + the manual copy/paste prompts
    storage.js      localStorage, export/import, reset
  components/       Dashboard · Learn · Drill · Exam · Write · Settings
```

---

## License

GPL-3.0-or-later — see [LICENSE](LICENSE).

## AI-generated content

The code and content in this repository were generated with AI assistance
(Claude Code, Anthropic), directed and edited by the author.
