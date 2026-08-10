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

import Anthropic from "@anthropic-ai/sdk";
import { recordApiUsage } from "./apiUsage.js";

export const MODEL = "claude-sonnet-5";

async function client(apiKey) {
  if (!apiKey) throw new Error("Kein API-Key hinterlegt.");
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function friendlyError(err) {
  if (err instanceof Anthropic.AuthenticationError) return "Der API-Key wurde abgelehnt. Prüfe ihn in den Einstellungen.";
  if (err instanceof Anthropic.PermissionDeniedError) return "Dieser Key darf dieses Modell nicht verwenden.";
  if (err instanceof Anthropic.RateLimitError) return "Rate-Limit erreicht. Warte kurz und versuche es erneut.";
  if (err instanceof Anthropic.NotFoundError) return "Modell nicht gefunden — prüfe die Modell-ID in den Einstellungen.";
  if (err instanceof Anthropic.APIConnectionError)
    return "Keine Verbindung zur API. Manche Browser oder Erweiterungen blockieren den Direktaufruf — nutze dann den manuellen Modus.";
  if (err instanceof Anthropic.APIError) return `API-Fehler ${err.status ?? ""}: ${err.message}`;
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
  const stream = anthropic.messages.stream(params);
  const { response } = await stream.withResponse();
  const message = await stream.finalMessage();
  recordApiUsage(apiKey, message.usage, response.headers);
  return message;
}

async function createDirectMessage(apiKey, params) {
  const anthropic = await client(apiKey);
  const { data, response } = await anthropic.messages.create(params).withResponse();
  recordApiUsage(apiKey, data.usage, response.headers);
  return data;
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
    approved: { type: "boolean" },
    approval_reason: { type: "string" },
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
    "cefr_estimate", "cefr_reasoning", "word_count", "task_met", "approved", "approval_reason",
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
13. Decide whether the submission is approved for course progression:
   - Set "approved" to true when the task is fulfilled and the requested structures are used well enough for the stated level. Minor mistakes are allowed; do not demand a perfect text.
   - Set it to false when the task is not fulfilled, a requested structure is missing or fundamentally wrong, or a high-severity error prevents the text from demonstrating the chapter goal.
   - In "approval_reason", give one short, concrete ENGLISH sentence explaining the decision.

Be precise and direct. Do not invent mistakes; if a passage is correct, leave it alone. Remember the language policy: all explanations in English, all German material kept in German.`;
}

function correctionUser(task, text, targetLevel) {
  return `AUFGABE (${task.type}, Niveau ${task.level}, mindestens ${task.minWords} Wörter):
${task.title}
${task.prompt}

Geforderte Strukturen: ${(task.targets || []).join(", ")}
Checkliste: ${(task.checklist || []).join(" · ")}

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
- Jeder Satz muss auch inhaltlich plausibel sein: Subjekt und Objekt müssen zum Verb passen, Adjektive zum Nomen und Konnektoren zur logischen Beziehung. Kombiniere Wörter nie nur deshalb, weil die Grammatik formal stimmt.
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

// ---------------------------------------------------------------------------
//  3 · Personalized support inside Learning Mode
// ---------------------------------------------------------------------------

function learningSupportSchema(allowedRules) {
  return {
    type: "object",
    properties: {
      coach_note: { type: "string" },
      focus: { type: "string" },
      focus_reason: { type: "string" },
      explanation: { type: "string" },
      memory_hook: { type: "string" },
      goals: { type: "array", items: { type: "string" } },
      examples: {
        type: "array",
        items: {
          type: "object",
          properties: {
            german: { type: "string" },
            english: { type: "string" },
            why: { type: "string" },
          },
          required: ["german", "english", "why"],
          additionalProperties: false,
        },
      },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            rule: { type: "string", enum: allowedRules },
            kind: { type: "string" },
            prompt: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            answer: { type: "string" },
            why: { type: "string" },
          },
          required: ["rule", "kind", "prompt", "options", "answer", "why"],
          additionalProperties: false,
        },
      },
      application: {
        type: "object",
        properties: {
          title: { type: "string" },
          prompt: { type: "string" },
          instruction: { type: "string" },
          min_words: { type: "integer" },
          targets: { type: "array", items: { type: "string" } },
        },
        required: ["title", "prompt", "instruction", "min_words", "targets"],
        additionalProperties: false,
      },
    },
    required: [
      "coach_note", "focus", "focus_reason", "explanation", "memory_hook",
      "goals", "examples", "items", "application",
    ],
    additionalProperties: false,
  };
}

function learningSupportSystem(level, allowedRules) {
  return `You are the AI learning coach inside a structured German course. The current level is ${level}.

Your role is to PERSONALIZE the current chapter, not to replace the curriculum, change the CEFR level, skip chapters, or decide whether the learner passes. The app owns progression and assessment.

LANGUAGE POLICY:
- Write coaching, reasons, explanations, goals, memory hooks, and instructions in clear ENGLISH.
- Keep German examples, exercise prompts, options, answers, and the writing prompt in GERMAN.
- Adapt explanation length and exercise difficulty to the evidence in the supplied learning profile.
- Refer to concrete evidence such as accuracy, recent answer pattern, placement, or error categories. If there is not enough history, say that the focus is a sensible starting hypothesis—never invent student weaknesses.
- Be supportive but specific; no generic praise or motivational filler.

EXERCISES:
- Return exactly 4 multiple-choice items targeting only these rule IDs: ${allowedRules.join(", ")}.
- Each German prompt has exactly one blank marked "___".
- Each item has exactly 4 distinct options, and "answer" is verbatim one option.
- Wrong options should reflect likely mistakes suggested by the profile.
- "why" explains the forcing rule in English.

APPLICATION:
- Adapt the supplied baseline writing task to the current weakness without making it substantially longer.
- Keep min_words realistic for a focused single-session task.
- Targets must be observable things the learner can check in their own text.`;
}

function learningSupportUser({ module, profile, baselineTask }) {
  const curriculum = {
    id: module.id,
    level: module.level,
    title: module.title,
    summary: module.summary,
    pitfalls: module.pitfalls || [],
    examples: (module.examples || []).slice(0, 4),
  };
  return `CURRENT CURRICULUM CHAPTER:
${JSON.stringify(curriculum, null, 2)}

ANONYMOUS LEARNING PROFILE (no raw learner writing):
${JSON.stringify(profile, null, 2)}

BASELINE APPLICATION TASK:
${JSON.stringify(baselineTask, null, 2)}

Create one personalization pack for this chapter. Keep all content faithful to the supplied curriculum.`;
}

export function normalizeLearningSupport(data, allowedRules = []) {
  if (!data || typeof data !== "object") throw new Error("Die KI-Antwort enthält kein Lernpaket.");
  const allowed = new Set(allowedRules);
  const items = (data.items || []).filter((item) =>
    allowed.has(item?.rule) &&
    typeof item.prompt === "string" && item.prompt.split("___").length === 2 &&
    Array.isArray(item.options) && item.options.length === 4 &&
    new Set(item.options).size === 4 && item.options.includes(item.answer)
  ).slice(0, 4);
  if (!data.focus || !data.explanation || !data.application || items.length === 0) {
    throw new Error("Die KI-Antwort ist unvollständig oder enthält keine gültigen Übungen.");
  }
  return {
    coach_note: String(data.coach_note || ""),
    focus: String(data.focus),
    focus_reason: String(data.focus_reason || ""),
    explanation: String(data.explanation),
    memory_hook: String(data.memory_hook || ""),
    goals: (data.goals || []).map(String).slice(0, 4),
    examples: (data.examples || []).filter((example) => example?.german).slice(0, 4),
    items,
    application: {
      title: String(data.application.title || "Personalized application"),
      prompt: String(data.application.prompt || ""),
      instruction: String(data.application.instruction || ""),
      min_words: Math.max(20, Math.min(180, Number(data.application.min_words) || 40)),
      targets: (data.application.targets || []).map(String).slice(0, 5),
    },
  };
}

export async function generateLearningSupport({ apiKey, model = MODEL, module, profile, baselineTask, allowedRules }) {
  try {
    const schema = learningSupportSchema(allowedRules);
    const response = await createMessage(apiKey, {
      model,
      max_tokens: 8000,
      output_config: { format: { type: "json_schema", schema } },
      system: [{ type: "text", text: learningSupportSystem(module.level, allowedRules), cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: learningSupportUser({ module, profile, baselineTask }) }],
    });
    return normalizeLearningSupport(parseJsonResponse(response), allowedRules);
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}

export function manualLearningSupportPrompt({ module, profile, baselineTask, allowedRules }) {
  return `${learningSupportSystem(module.level, allowedRules)}

Return ONLY one JSON object matching this schema:

${JSON.stringify(learningSupportSchema(allowedRules), null, 2)}

---

${learningSupportUser({ module, profile, baselineTask })}`;
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
//  4 · Explain a mistake
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
    const response = await createDirectMessage(apiKey, {
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
    const r = await createDirectMessage(apiKey, {
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

const TEACHER_EXERCISE_TOOL = {
  name: "present_exercise",
  description:
    "Present an interactive German-learning exercise or structured answer form in the chat. Include its answer key with the question so the app can compare answers locally after submission. Use it when practice would help, the learner asks for an exercise, or your question is best answered with choices or several fields. Call it more than once for a short exercise set.",
  input_schema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Short unique ID, for example adjective-ending-1." },
      type: {
        type: "string",
        enum: ["multiple_choice", "multiple_select", "fill_blanks", "matching", "reorder", "short_answer", "form", "writing"],
      },
      title: { type: "string", description: "A short, friendly exercise title." },
      instructions: { type: "string", description: "One clear sentence in English explaining what to do." },
      prompt: { type: "string", description: "The German question, sentence, or transformation prompt." },
      options: {
        type: "array",
        items: { type: "string" },
        description: "Choices for multiple_choice or multiple_select.",
      },
      fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            placeholder: { type: "string" },
          },
          required: ["id", "label"],
          additionalProperties: false,
        },
        description: "Named answer fields for fill_blanks or a form. Refer to each field naturally in the prompt.",
      },
      matches: {
        type: "array",
        items: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            options: { type: "array", items: { type: "string" } },
          },
          required: ["prompt", "options"],
          additionalProperties: false,
        },
        description: "Rows for matching; the learner chooses one option for every prompt.",
      },
      items: {
        type: "array",
        items: { type: "string" },
        description: "Shuffled words or sentence parts for a reorder exercise.",
      },
      topic: { type: "string", description: "A custom writing topic or situation." },
      minimum_words: { type: "integer", minimum: 10, maximum: 500 },
      requirements: { type: "array", items: { type: "string" } },
      answer_key: {
        type: "array",
        items: { type: "string" },
        description: "Hidden solutions used for local comparison after submission. For choices list the correct option(s); for fields or matching use display order; for reorder use the correct item order; for short answer give one or more accepted examples. Use an empty array only for open forms and writing.",
      },
    },
    required: ["id", "type", "title", "instructions", "answer_key"],
    additionalProperties: false,
  },
};

const TEACHER_CORRECTION_TOOL = {
  name: "present_correction",
  description:
    "Show a structured visual correction after the learner submits an exercise or writing task. Include score statistics and a clear comparison of their answer with the correct or improved answer, plus a short reason. When immediate practice would help, follow this tool call with present_exercise in the same response.",
  input_schema: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      summary: { type: "string", description: "A short, encouraging overall assessment in English." },
      score_percent: { type: "integer", minimum: 0, maximum: 100 },
      total_items: { type: "integer", minimum: 0 },
      correct_items: { type: "integer", minimum: 0 },
      items: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            label: { type: "string", description: "Short question, field, or error label." },
            student_answer: { type: "string", description: "The learner's exact answer or text excerpt." },
            correct_answer: { type: "string", description: "The correct answer or an improved version." },
            is_correct: { type: "boolean" },
            why: { type: "string", description: "A concise explanation in simple English." },
          },
          required: ["label", "student_answer", "correct_answer", "is_correct", "why"],
          additionalProperties: false,
        },
      },
      strengths: { type: "array", items: { type: "string" } },
      next_step: { type: "string", description: "One specific recommendation in English." },
    },
    required: ["id", "title", "summary", "score_percent", "total_items", "correct_items", "items", "strengths", "next_step"],
    additionalProperties: false,
  },
};

function normalizeTeacherExercise(input, index) {
  const exercise = input && typeof input === "object" ? { ...input } : {};
  const options = Array.isArray(exercise.options) ? exercise.options.filter(Boolean).map(String) : [];
  const fields = Array.isArray(exercise.fields) ? exercise.fields.filter((field) => field?.id && field?.label) : [];
  const matches = Array.isArray(exercise.matches)
    ? exercise.matches.filter((row) => row?.prompt && Array.isArray(row.options) && row.options.length)
    : [];
  const items = Array.isArray(exercise.items) ? exercise.items.filter(Boolean).map(String) : [];
  const answerKey = Array.isArray(exercise.answer_key) ? exercise.answer_key.filter(Boolean).map(String) : [];

  if (["multiple_choice", "multiple_select"].includes(exercise.type) && options.length < 2) exercise.type = "short_answer";
  if (["fill_blanks", "form"].includes(exercise.type) && !fields.length) exercise.type = "short_answer";
  if (exercise.type === "matching" && !matches.length) exercise.type = "short_answer";
  if (exercise.type === "reorder" && items.length < 2) exercise.type = "short_answer";

  return {
    ...exercise,
    id: exercise.id || `exercise-${Date.now()}-${index}`,
    type: ["multiple_choice", "multiple_select", "fill_blanks", "matching", "reorder", "short_answer", "form", "writing"].includes(exercise.type)
      ? exercise.type
      : "short_answer",
    title: exercise.title || "Quick practice",
    instructions: exercise.instructions || "Write your answer and send it to Frau Müller.",
    options,
    fields,
    matches,
    items,
    answer_key: answerKey,
  };
}

function normalizeTeacherCorrection(input, index) {
  const correction = input && typeof input === "object" ? { ...input } : {};
  const items = Array.isArray(correction.items)
    ? correction.items.filter((item) => item && typeof item === "object").map((item, itemIndex) => ({
        label: String(item.label || `Answer ${itemIndex + 1}`),
        student_answer: String(item.student_answer || "—"),
        correct_answer: String(item.correct_answer || "—"),
        is_correct: Boolean(item.is_correct),
        why: String(item.why || ""),
      }))
    : [];
  const derivedCorrect = items.filter((item) => item.is_correct).length;
  const total = items.length || Math.max(0, Number.isFinite(correction.total_items) ? correction.total_items : 0);
  const correct = items.length
    ? derivedCorrect
    : Math.min(total, Math.max(0, Number.isFinite(correction.correct_items) ? correction.correct_items : 0));
  const derivedScore = total ? Math.round((correct / total) * 100) : 0;

  return {
    ...correction,
    id: correction.id || `correction-${Date.now()}-${index}`,
    title: correction.title || "Exercise results",
    summary: correction.summary || "Here is your feedback.",
    score_percent: total
      ? derivedScore
      : Math.min(100, Math.max(0, Number.isFinite(correction.score_percent) ? correction.score_percent : 0)),
    total_items: total,
    correct_items: correct,
    items,
    strengths: Array.isArray(correction.strengths) ? correction.strengths.filter(Boolean).map(String) : [],
    next_step: String(correction.next_step || "Review the explanation and try one similar example."),
  };
}

function requestsInteractiveExercise(text, messages) {
  const value = String(text || "").trim().toLowerCase();
  const namedRequest = /\b(?:give|make|create|show|send|generate|want|need|have|get|try|do|start|another|new|next|more)\b.{0,50}\b(?:exercises?|quiz|drill|practice questions?|practice tasks?)\b/i.test(value) ||
    /\b(?:exercises?|quiz|drill)\b.{0,20}\bplease\b/i.test(value) ||
    /^(?:please\s+)?(?:an?\s+)?(?:interactive\s+)?(?:exercise|quiz|drill)\b/i.test(value) ||
    /^(?:please\s+)?practice\b/i.test(value) ||
    /\b(?:can|could|may)\s+(?:we|i)\s+(?:practice|try)\b/i.test(value) ||
    /(?:übung|übungen|aufgabe|aufgaben)/i.test(value) ||
    /\b(?:test me|give me something to solve)\b/i.test(value);
  if (namedRequest) return true;

  const asksForAnother = /^(?:please\s+)?(?:(?:give|send|show)\s+me\s+)?(?:another|one more|the next|next one)(?:\s+one)?[.!?]*$/i.test(value);
  const hasExerciseContext = messages.some((message) => message.role === "assistant" && (
    message.exercises?.length || /\[Exercises shown to the student\]|Exercise\s+\d+:/i.test(message.modelContent || message.content || "")
  ));
  return asksForAnother && hasExerciseContext;
}

function cleanTeacherReply(text) {
  return String(text || "")
    .replace(/\n*\[(?:Exercises shown to the student|Correction results shown to the student)\][\s\S]*$/i, "")
    .trim();
}

function buildTeacherInternalContext(messages) {
  const exerciseSets = messages
    .filter((message) => message.role === "assistant" && message.exercises?.length)
    .slice(-4)
    .map((message) => message.exercises);
  const correctionSets = messages
    .filter((message) => message.role === "assistant" && message.corrections?.length)
    .slice(-3)
    .map((message) => message.corrections);
  if (!exerciseSets.length && !correctionSets.length) return "";

  return `\n\n<private_ui_context>
This data belongs to interactive UI cards. Use it to understand prior exercises and corrections, but never quote it, describe its structure, or expose hidden answer keys in visible text.
${exerciseSets.length ? `Recent exercises: ${JSON.stringify(exerciseSets)}` : ""}
${correctionSets.length ? `Recent corrections: ${JSON.stringify(correctionSets)}` : ""}
</private_ui_context>`;
}

export async function chatWithTeacher({ apiKey, model = MODEL, messages, currentText = "", task = null, targetLevel = "C1" }) {
  const system = buildChatSystem({ targetLevel, task, currentText }) + buildTeacherInternalContext(messages);
  const lastMessage = messages.at(-1);
  const lastContent = String(lastMessage?.content || "");
  const isExerciseSubmission = lastMessage?.role === "user" && (
    lastMessage.exerciseSubmission === true || /^I completed the exercise\b/i.test(lastContent.trim())
  );
  const wantsExercise = lastMessage?.role === "user" && requestsInteractiveExercise(lastContent, messages);
  const forcedTool = isExerciseSubmission
    ? TEACHER_CORRECTION_TOOL.name
    : wantsExercise
      ? TEACHER_EXERCISE_TOOL.name
      : null;
  try {
    const response = await createDirectMessage(apiKey, {
      model,
      max_tokens: 4096,
      system,
      tools: [TEACHER_EXERCISE_TOOL, TEACHER_CORRECTION_TOOL],
      ...(forcedTool
        ? { tool_choice: { type: "tool", name: forcedTool, disable_parallel_tool_use: false } }
        : {}),
      messages: messages.map((message) => ({
        role: message.role,
        content: message.role === "assistant" ? cleanTeacherReply(message.content) : message.content,
      })),
    });
    const reply = cleanTeacherReply(response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n\n")
    );
    const exercises = response.content
      .filter((block) => block.type === "tool_use" && block.name === TEACHER_EXERCISE_TOOL.name)
      .map((block, index) => normalizeTeacherExercise(block.input, index));
    const corrections = response.content
      .filter((block) => block.type === "tool_use" && block.name === TEACHER_CORRECTION_TOOL.name)
      .map((block, index) => normalizeTeacherCorrection(block.input, index));
    if (isExerciseSubmission && !corrections.length) {
      throw new Error("Frau Müller could not build the visual correction results. Please submit the exercise again.");
    }
    if (wantsExercise && !exercises.length) {
      throw new Error("Frau Müller could not build the interactive exercise. Please ask again.");
    }
    if (!reply && !exercises.length && !corrections.length) throw new Error("Empty response from Frau Müller.");
    const fallbackReply = corrections.length && exercises.length
      ? "Let’s look at your results. I also made a short follow-up exercise for you below."
      : corrections.length
        ? "Let’s look at your results."
        : "Here is a little exercise for you.";
    return {
      reply: reply || fallbackReply,
      exercises,
      corrections,
      usage: response.usage,
    };
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}
