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
//  DICTIONARY — free, key-less German dictionary lookups used by the editor.
//
//  Suggestions come from the German Wiktionary OpenSearch API (CORS-enabled via
//  origin=*). Word lookups combine a DE→EN translation (MyMemory) with German
//  definitions (Free Dictionary API) when available. All endpoints are public.
// ============================================================================

const WIKTIONARY = (lang) => `https://${lang}.wiktionary.org/w/api.php`;
const MYMEMORY = "https://api.mymemory.translated.net/get";
const FREEDICT = (lang) => `https://api.dictionaryapi.dev/api/v2/entries/${lang}`;

/** Autocomplete: words in `lang` that start with `prefix`. Returns up to 8. */
export async function suggestWords(prefix, { lang = "de", signal } = {}) {
  const q = String(prefix || "").trim();
  if (q.length < 2) return [];
  const url = `${WIKTIONARY(lang)}?action=opensearch&search=${encodeURIComponent(q)}&limit=8&namespace=0&format=json&origin=*`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Wörterbuch nicht erreichbar.");
  const data = await res.json();
  return Array.isArray(data?.[1]) ? data[1] : [];
}

/** Translate a word or short phrase between two languages. */
async function translateWord(word, { from, to, signal }) {
  const url = `${MYMEMORY}?q=${encodeURIComponent(word)}&langpair=${from}|${to}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Übersetzung nicht erreichbar.");
  const data = await res.json();
  const t = data?.responseData?.translatedText || "";
  // MyMemory echoes the input when it has no match — treat that as empty.
  return t && t.toLowerCase() !== String(word).toLowerCase() ? t : "";
}

/** Definitions from the Free Dictionary API (often 404s — that's fine). */
async function defineWord(word, { lang = "de", signal } = {}) {
  const url = `${FREEDICT(lang)}/${encodeURIComponent(word)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const data = await res.json();
  const entry = Array.isArray(data) ? data[0] : null;
  if (!entry) return null;
  return {
    word: entry.word,
    phonetic: entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || "",
    meanings: (entry.meanings || []).map((m) => ({
      pos: m.partOfSpeech,
      defs: (m.definitions || []).map((d) => d.definition).filter(Boolean).slice(0, 3),
    })),
  };
}

/** Full lookup in the given direction ("de-en" or "en-de"). */
export async function lookupWord(word, { direction = "de-en", signal } = {}) {
  const w = String(word || "").trim();
  if (!w) return { word: "", translation: "", definition: null };
  const [from, to] = direction === "en-de" ? ["en", "de"] : ["de", "en"];
  const [translation, definition] = await Promise.all([
    translateWord(w, { from, to, signal }).catch(() => ""),
    defineWord(w, { lang: from, signal }).catch(() => null),
  ]);
  return { word: w, translation, definition };
}
