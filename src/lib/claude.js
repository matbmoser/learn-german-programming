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
//  CLAUDE — writing correction, challenge generation, and mistake explanation.
//
//  Two paths, both supported:
//    "api"    → the browser calls the Anthropic API directly with a key the
//               user pastes in. Convenient; the key lives in this browser.
//    "manual" → the app builds the prompt, you paste it into claude.ai and
//               paste the JSON answer back. No key anywhere.
// ============================================================================

export const MODEL = "claude-haiku-4-5-20251001";

// The SDK is only needed once the user actually calls the API, so it is loaded
// on demand and kept out of the initial bundle.
let sdk = null;
async function loadSdk() {
  if (!sdk) sdk = await import("@anthropic-ai/sdk");
  return sdk;
}

async function client(apiKey) {
  if (!apiKey) throw new Error("Kein API-Key hinterlegt.");
  const { default: Anthropic } = await loadSdk();
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function friendlyError(err) {
  const Anthropic = sdk?.default;
  if (Anthropic) {
    if (err instanceof Anthropic.AuthenticationError) return "Der API-Key wurde abgelehnt. Prüfe ihn in den Einstellungen.";
    if (err instanceof Anthropic.PermissionDeniedError) return "Dieser Key darf dieses Modell nicht verwenden.";
    if (err instanceof Anthropic.RateLimitError) return "Rate-Limit erreicht. Warte kurz und versuche es erneut.";
    if (err instanceof Anthropic.NotFoundError) return "Modell nicht gefunden — prüfe die Modell-ID in den Einstellungen.";
    if (err instanceof Anthropic.APIConnectionError)
      return "Keine Verbindung zur API. Manche Browser oder Erweiterungen blockieren den Direktaufruf — nutze dann den manuellen Modus.";
    if (err instanceof Anthropic.APIError) return `API-Fehler ${err.status ?? ""}: ${err.message}`;
  }
  return err?.message || "Unbekannter Fehler.";
}

/**
 * Long corrections can exhaust the output budget. Streaming keeps the request
 * under the SDK's HTTP timeout so the limit can be raised far enough that the
 * JSON actually closes.
 */
const MAX_TOKENS = 32000;

async function createMessage(apiKey, params) {
  const anthropic = await client(apiKey);
  return anthropic.messages.stream(params).finalMessage();
}

const TRUNCATED =
  "Die Antwort des Modells wurde abgeschnitten und ist unvollständig. " +
  "Kürze deinen Text etwas und versuche es erneut.";

/** The first text block of a structured-output response is valid JSON. */
function parseJsonResponse(response) {
  if (response.stop_reason === "refusal") {
    throw new Error("Die Anfrage wurde abgelehnt. Formuliere den Text um und versuche es erneut.");
  }
  if (response.stop_reason === "max_tokens") throw new Error(TRUNCATED);
  const block = response.content.find((b) => b.type === "text");
  if (!block) throw new Error("Leere Antwort vom Modell.");
  try {
    return JSON.parse(block.text);
  } catch {
    // Valid JSON is guaranteed unless the response was cut short.
    throw new Error(TRUNCATED);
  }
}

/** Pull a JSON object out of pasted text (handles ```json fences and prose). */
export function extractJson(text) {
  const t = String(text || "").trim();
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : t;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("In der Eingabe wurde kein JSON-Objekt gefunden.");
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    throw new Error("Das eingefügte JSON ist unvollständig oder fehlerhaft — kopiere Claudes Antwort noch einmal vollständig.");
  }
}

// ---------------------------------------------------------------------------
//  1 · Writing correction
// ---------------------------------------------------------------------------

const CORRECTION_SCHEMA = {
  type: "object",
  properties: {
    cefr_estimate: { type: "string", enum: ["A1", "A2", "B1", "B2", "C1", "C2"] },
    cefr_reasoning: { type: "string" },
    word_count: { type: "integer" },
    task_met: { type: "boolean" },
    scores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          criterion: { type: "string", enum: ["aufgabe", "kohaerenz", "wortschatz", "grammatik", "register"] },
          score: { type: "integer" },
          comment: { type: "string" },
        },
        required: ["criterion", "score", "comment"],
        additionalProperties: false,
      },
    },
    corrections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          corrected: { type: "string" },
          type: { type: "string" },
          rule: { type: "string" },
          why: { type: "string" },
          severity: { type: "string", enum: ["hoch", "mittel", "niedrig"] },
        },
        required: ["original", "corrected", "type", "rule", "why", "severity"],
        additionalProperties: false,
      },
    },
    upgrades: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          upgraded: { type: "string" },
          why: { type: "string" },
        },
        required: ["original", "upgraded", "why"],
        additionalProperties: false,
      },
    },
    improved_version: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    next_steps: { type: "array", items: { type: "string" } },
    error_patterns: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rule: { type: "string" },
          label: { type: "string" },
          pattern: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
          frequency: { type: "integer" },
        },
        required: ["rule", "label", "pattern", "evidence", "frequency"],
        additionalProperties: false,
      },
    },
    study_plan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          focus: { type: "string" },
          rule: { type: "string" },
          action: { type: "string" },
        },
        required: ["focus", "rule", "action"],
        additionalProperties: false,
      },
    },
    exercise_prompt: { type: "string" },
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rule: { type: "string" },
          level: { type: "string", enum: ["A2", "B1", "B2", "C1", "C2"] },
          kind: { type: "string" },
          prompt: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "string" },
          why: { type: "string" },
        },
        required: ["rule", "level", "kind", "prompt", "options", "answer", "why"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "cefr_estimate", "cefr_reasoning", "word_count", "task_met",
    "scores", "corrections", "upgrades", "improved_version", "strengths", "next_steps",
    "error_patterns", "study_plan", "exercise_prompt", "exercises",
  ],
  additionalProperties: false,
};

function correctionSystem(targetLevel) {
  return `You are an examiner and writing coach for German as a foreign language, grading against CEFR criteria (Goethe/telc). The learner is working towards ${targetLevel}.

LANGUAGE POLICY — this is critical:
- Write EVERY explanation, comment, reasoning, label and instruction in ENGLISH, so a student who does not yet read German can understand it.
- Keep in GERMAN only the learner's actual language material: the "original" passage, its "corrected" form, the "improved_version", the quoted "evidence", and every exercise "prompt", "options" and "answer".
- When you name a German word or form inside an English explanation, quote it in German (e.g. use the dative "dem Mann" because …).

Procedure:
1. Count the words and check whether ALL parts of the task are fulfilled.
2. Estimate the text's CEFR level realistically — like a real exam, not generously. In "cefr_reasoning", explain briefly in ENGLISH with concrete evidence quoted from the text.
3. Score each criterion 0–5: aufgabe, kohaerenz, wortschatz, grammatik, register. Write each "comment" in ENGLISH.
4. List EVERY mistake individually. For each one:
   - "original": the exact faulty passage from the text (verbatim, in German, not paraphrased)
   - "corrected": the fixed version (in German)
   - "type": the error category in ENGLISH (e.g. "Case", "Adjective ending", "Verb position", "Word order", "Gender", "Preposition", "Tense", "Subjunctive", "Spelling", "Word choice", "Register")
   - "rule": the best-fitting ID from this list: kasus, adjektiv, praep, ordnung, zeiten, partizip, modal, konnektor, relativ, konj2, passiv, verbprep, konj1, ndekl, partizipattr, nominal, paired, fvg, passiversatz, konj2past, partikel, wortschatz, rechtschreibung, register
   - "why": WHY it is wrong, in ENGLISH — state the rule, not just the correction. Two sentences maximum. Quote the German forms you refer to.
   - "severity": "hoch" if it blocks understanding or is a level marker, otherwise "mittel" or "niedrig".
5. "upgrades": 3–6 spots that are correct but below level — show the ${targetLevel} variant in German ("upgraded"), and explain in ENGLISH in "why" (nominal style, passive alternatives, Funktionsverbgefüge, sharper connectors, better register).
6. "improved_version": the same text rewritten to ${targetLevel} level, in GERMAN — same content, same length, same person. Do not invent new content.
7. "strengths": 2–3 things done concretely well, in ENGLISH.
8. "next_steps": 2–4 concrete practice recommendations in ENGLISH, derived from the MOST FREQUENT mistakes — no generic advice.
9. "error_patterns": group the individual mistakes into PATTERNS — not every mistake again, but the systematic weaknesses. For each pattern:
   - "rule": the matching rule ID from the list above.
   - "label": a short name of the pattern in ENGLISH (e.g. "Adjective ending in the dative").
   - "pattern": in ENGLISH, how to recognise the pattern and WHAT the learner does systematically wrong — the underlying cause, not the single spot.
   - "evidence": 1–4 verbatim German quotes from the text.
   - "frequency": how often the pattern occurs in the text.
   Sort by frequency, the biggest problem first. At most 5 patterns. If there are no systematic patterns, return an empty list.
10. "study_plan": a concrete learning path in 3–5 steps, derived from the patterns. For each step:
   - "focus": what it is about, in ENGLISH.
   - "rule": the rule ID to be practised.
   - "action": what the learner should concretely do, in ENGLISH (one action, not generic advice).
   Order the steps so the foundation comes first.
11. "exercise_prompt": a ready-to-copy prompt, written in ENGLISH, that generates targeted exercises for exactly these error patterns. Name the concrete rule IDs, the target level ${targetLevel} and this learner's typical mistakes, and specify that the generated exercise sentences themselves must be in German.
12. "exercises": 4–8 ready, immediately solvable practice items that train EXACTLY the error patterns found above. For each item:
   - "rule": the rule ID of the pattern it trains.
   - "level": the target level ${targetLevel} — or one step below if the pattern is foundational.
   - "kind": a short type label in ENGLISH (e.g. "Fill in the blank").
   - "prompt": a complete, natural GERMAN sentence with EXACTLY ONE blank "___".
   - "options": exactly 4 options in German; "answer" is VERBATIM one of them; the three wrong options are exactly the mistakes THIS learner made or would make.
   - "why": in ENGLISH, the rule that forces the correct answer — not just "this is right". Two sentences maximum.
   Tie the items to the learner's real mistakes, not textbook examples. If there are no error patterns, return an empty list.

Be precise and direct. Do not invent mistakes; if a passage is correct, leave it alone. Remember the language policy: all explanations in English, all German material kept in German.`;
}

function correctionUser(task, text, targetLevel) {
  return `AUFGABE (${task.type}, Niveau ${task.level}, mindestens ${task.minWords} Wörter):
${task.title}
${task.prompt}

Geforderte Strukturen: ${task.targets.join(", ")}
Checkliste: ${task.checklist.join(" · ")}

ZIELNIVEAU DES LERNENDEN: ${targetLevel}

TEXT DES LERNENDEN:
"""
${text}
"""`;
}

export async function correctWriting({ apiKey, model = MODEL, task, text, targetLevel = "C1" }) {
  try {
    const response = await createMessage(apiKey, {
      model,
      max_tokens: MAX_TOKENS,
      output_config: {
        format: { type: "json_schema", schema: CORRECTION_SCHEMA },
      },
      system: [{ type: "text", text: correctionSystem(targetLevel), cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: correctionUser(task, text, targetLevel) }],
    });
    return parseJsonResponse(response);
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export function manualCorrectionPrompt({ task, text, targetLevel = "C1" }) {
  return `${correctionSystem(targetLevel)}

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt nach genau diesem Schema (keine Erklärung davor oder danach):

${JSON.stringify(CORRECTION_SCHEMA, null, 2)}

---

${correctionUser(task, text, targetLevel)}`;
}

// ---------------------------------------------------------------------------
//  2 · Challenge generation
// ---------------------------------------------------------------------------

const CHALLENGE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    focus: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rule: { type: "string" },
          level: { type: "string", enum: ["A2", "B1", "B2", "C1"] },
          kind: { type: "string" },
          prompt: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "string" },
          why: { type: "string" },
        },
        required: ["rule", "level", "kind", "prompt", "options", "answer", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "focus", "items"],
  additionalProperties: false,
};

function challengeSystem(level, count) {
  return `Du erstellst Übungsaufgaben für Deutsch als Fremdsprache auf Niveau ${level}.

Regeln:
- Genau ${count} Aufgaben.
- Jede Aufgabe hat GENAU EINE Lücke, markiert mit "___", eingebettet in einen vollständigen, natürlichen deutschen Satz.
- Genau 4 Antwortoptionen. "answer" muss WORTWÖRTLICH eine der Optionen sein.
- Die drei falschen Optionen müssen plausibel sein: typische Lernerfehler, nicht offensichtlich falsch.
- "why" MUSS auf ENGLISCH sein und die Regel erklären, die die richtige Antwort erzwingt — nicht nur "this is right" — damit ein Lernender, der noch kein Deutsch liest, es versteht. Zwei Sätze maximum. Nenne die deutschen Formen in Anführungszeichen.
- "kind" ist eine kurze englische Typbezeichnung (z.B. "Fill in the blank").
- "prompt", "options" und "answer" bleiben auf DEUTSCH (das ist das Übungsmaterial).
- "rule" ist eine ID aus: kasus, adjektiv, praep, ordnung, zeiten, partizip, modal, konnektor, relativ, konj2, passiv, verbprep, konj1, ndekl, partizipattr, nominal, paired, fvg, passiversatz, konj2past, partikel.
- Sätze aus dem echten Leben: Arbeit, Behörden, Studium, Alltag. Keine Lehrbuchsätze über Ottos Bruder.
- Variiere Kontext und Wortschatz — keine zwei Aufgaben mit demselben Nomen.`;
}

function challengeUser(weakList, level, count) {
  const focus = weakList.length
    ? weakList.map((w) => `${w.name} (aktuell ${Math.round(w.acc * 100)}% richtig)`).join(", ")
    : "gemischt über das ganze Niveau";
  return `Schwächste Bereiche des Lernenden: ${focus}

Erstelle ${count} Aufgaben auf Niveau ${level}, die genau diese Schwächen treffen. Wenn die Liste leer ist, mische über das Niveau.`;
}

export async function generateChallenges({ apiKey, model = MODEL, weakList = [], level = "B2", count = 8 }) {
  try {
    const response = await createMessage(apiKey, {
      model,
      max_tokens: MAX_TOKENS,
      output_config: {
        format: { type: "json_schema", schema: CHALLENGE_SCHEMA },
      },
      system: [{ type: "text", text: challengeSystem(level, count), cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: challengeUser(weakList, level, count) }],
    });
    return parseJsonResponse(response);
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export function manualChallengePrompt({ weakList = [], level = "B2", count = 8 }) {
  return `${challengeSystem(level, count)}

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt nach genau diesem Schema:

${JSON.stringify(CHALLENGE_SCHEMA, null, 2)}

---

${challengeUser(weakList, level, count)}`;
}

/**
 * A prompt targeted at ONE recurring mistake. Paste it into claude.ai to get
 * exercises that train exactly this weakness so the student stops repeating it.
 */
export function patternExercisePrompt({ rule, label, description = "", evidence = [], level = "B2", count = 8 }) {
  const mistakeLines = evidence.map((e) => `- "${e}"`).join("\n");
  const mistakes = evidence.length ? `\n\nKonkrete Fehler aus dem Text des Lernenden:\n${mistakeLines}` : "";
  const musterLine = description ? `\nMuster: ${description}` : "";
  const user = `Der Lernende macht WIEDERHOLT diesen Fehler: ${label || rule} (Regel-ID: ${rule}).${musterLine}${mistakes}

Erstelle ${count} Aufgaben auf Niveau ${level}, die genau diese Schwäche trainieren, sodass der Lernende diesen Fehler nicht mehr macht. Jede Aufgabe MUSS die Regel "${rule}" treffen. Steigere die Schwierigkeit leicht von Aufgabe zu Aufgabe und variiere Kontext und Wortschatz.`;
  return `${challengeSystem(level, count)}

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt nach genau diesem Schema:

${JSON.stringify(CHALLENGE_SCHEMA, null, 2)}

---

${user}`;
}

// ---------------------------------------------------------------------------
//  3 · Explain a mistake
// ---------------------------------------------------------------------------

const EXPLAIN_SCHEMA = {
  type: "object",
  properties: {
    short: { type: "string" },
    rule: { type: "string" },
    why_wrong: { type: "string" },
    contrast: { type: "string" },
    remember: { type: "string" },
  },
  required: ["short", "rule", "why_wrong", "contrast", "remember"],
  additionalProperties: false,
};

export async function explainMistake({ apiKey, model = MODEL, question, given }) {
  const sys = `You explain German grammar mistakes precisely and briefly. Answer in ENGLISH so a student who does not yet read German can understand; quote the German forms in German.
- "short": one sentence naming the mistake.
- "rule": the rule that applies here, as a formula or short sentence.
- "why_wrong": why the given answer fails.
- "contrast": a minimal pair (in German) that shows the difference.
- "remember": a memory hook that still works in four weeks.
No filler, no praise.`;
  const user = `Aufgabe: ${question.prompt}
Kontext: ${question.hint || "—"}
Richtige Antwort: ${question.answer}
Antwort des Lernenden: ${given || "(leer)"}`;
  try {
    const response = await (await client(apiKey)).messages.create({
      model,
      max_tokens: 4000,
      output_config: { format: { type: "json_schema", schema: EXPLAIN_SCHEMA } },
      system: [{ type: "text", text: sys, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: user }],
    });
    return parseJsonResponse(response);
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export async function testKey({ apiKey, model = MODEL }) {
  try {
    const r = await (await client(apiKey)).messages.create({
      model,
      max_tokens: 16,
      messages: [{ role: "user", content: "Antworte mit genau dem Wort: OK" }],
    });
    const t = r.content.find((b) => b.type === "text")?.text || "";
    return { ok: true, message: `Verbindung steht (${r.model}) — ${t.trim()}` };
  } catch (err) {
    return { ok: false, message: friendlyError(err) };
  }
}

// ---------------------------------------------------------------------------
//  4 · Teacher chat — Frau Müller (deutsch-teacher agent v1.0)
// ---------------------------------------------------------------------------

import { buildChatSystem } from "./teacherAgent.js";

export async function chatWithTeacher({ apiKey, model = MODEL, messages, currentText = "", task = null, targetLevel = "C1" }) {
  const system = buildChatSystem({ targetLevel, task, currentText });
  try {
    const response = await (await client(apiKey)).messages.create({
      model,
      max_tokens: 1024,
      system,
      messages,
    });
    const block = response.content.find((b) => b.type === "text");
    if (!block) throw new Error("Empty response from Frau Müller.");
    return { reply: block.text, usage: response.usage };
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}
