// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser

// Token usage is stored separately from learning progress and grouped by API
// key. Only a one-way, non-secret identifier is stored alongside the counts.

const STORAGE_KEY = "dc1:api-usage";
export const API_USAGE_EVENT = "dc1:api-usage-change";

export function emptyApiUsage() {
  return {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationInputTokens: 0,
    cacheReadInputTokens: 0,
    requests: 0,
    lastRequestAt: null,
    rateLimit: null,
  };
}

export function apiKeyId(apiKey) {
  const value = String(apiKey || "");
  if (!value) return "";
  // FNV-1a is sufficient here: this is an identifier, not authentication.
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${value.length}-${(hash >>> 0).toString(36)}`;
}

function normalizeUsage(value) {
  const base = emptyApiUsage();
  if (!value || typeof value !== "object") return base;
  const number = (key) => Math.max(0, Number(value[key]) || 0);
  return {
    ...base,
    inputTokens: number("inputTokens"),
    outputTokens: number("outputTokens"),
    cacheCreationInputTokens: number("cacheCreationInputTokens"),
    cacheReadInputTokens: number("cacheReadInputTokens"),
    requests: number("requests"),
    lastRequestAt: Number(value.lastRequestAt) || null,
    rateLimit: value.rateLimit && typeof value.rateLimit === "object" ? value.rateLimit : null,
  };
}

function loadStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && parsed.byKey && typeof parsed.byKey === "object"
      ? parsed
      : { v: 1, byKey: {} };
  } catch {
    return { v: 1, byKey: {} };
  }
}

function saveStore(store) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* keep working in memory */ }
}

export function loadApiUsage(apiKey) {
  const id = apiKeyId(apiKey);
  return id ? normalizeUsage(loadStore().byKey[id]) : emptyApiUsage();
}

function headerNumber(headers, name) {
  const value = headers?.get?.(name);
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function headerValue(headers, name) {
  return headers?.get?.(name) || null;
}

function readRateLimit(headers) {
  if (!headers?.get) return null;
  const limit = headerNumber(headers, "anthropic-ratelimit-tokens-limit");
  const remaining = headerNumber(headers, "anthropic-ratelimit-tokens-remaining");
  const inputRemaining = headerNumber(headers, "anthropic-ratelimit-input-tokens-remaining");
  const outputRemaining = headerNumber(headers, "anthropic-ratelimit-output-tokens-remaining");

  if ([limit, remaining, inputRemaining, outputRemaining].every((value) => value == null)) return null;
  return {
    limit,
    remaining,
    reset: headerValue(headers, "anthropic-ratelimit-tokens-reset"),
    inputLimit: headerNumber(headers, "anthropic-ratelimit-input-tokens-limit"),
    inputRemaining,
    inputReset: headerValue(headers, "anthropic-ratelimit-input-tokens-reset"),
    outputLimit: headerNumber(headers, "anthropic-ratelimit-output-tokens-limit"),
    outputRemaining,
    outputReset: headerValue(headers, "anthropic-ratelimit-output-tokens-reset"),
  };
}

function announce(id, usage) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(API_USAGE_EVENT, { detail: { id, usage } }));
  }
}

export function recordApiUsage(apiKey, responseUsage, headers) {
  const id = apiKeyId(apiKey);
  if (!id || !responseUsage) return;

  const store = loadStore();
  const current = normalizeUsage(store.byKey[id]);
  const next = {
    ...current,
    inputTokens: current.inputTokens + (Number(responseUsage.input_tokens) || 0),
    outputTokens: current.outputTokens + (Number(responseUsage.output_tokens) || 0),
    cacheCreationInputTokens: current.cacheCreationInputTokens + (Number(responseUsage.cache_creation_input_tokens) || 0),
    cacheReadInputTokens: current.cacheReadInputTokens + (Number(responseUsage.cache_read_input_tokens) || 0),
    requests: current.requests + 1,
    lastRequestAt: Date.now(),
    rateLimit: readRateLimit(headers) || current.rateLimit,
  };
  store.byKey[id] = next;

  // Avoid leaving an unbounded set of old key identifiers in localStorage.
  const ids = Object.keys(store.byKey);
  if (ids.length > 5) {
    ids
      .sort((a, b) => (store.byKey[b]?.lastRequestAt || 0) - (store.byKey[a]?.lastRequestAt || 0))
      .slice(5)
      .forEach((oldId) => delete store.byKey[oldId]);
  }

  saveStore(store);
  announce(id, next);
}

export function resetApiUsage(apiKey) {
  const id = apiKeyId(apiKey);
  if (!id) return;
  const store = loadStore();
  delete store.byKey[id];
  saveStore(store);
  announce(id, emptyApiUsage());
}

export function totalInputTokens(usage) {
  return (usage?.inputTokens || 0)
    + (usage?.cacheCreationInputTokens || 0)
    + (usage?.cacheReadInputTokens || 0);
}

export function totalTokens(usage) {
  return totalInputTokens(usage) + (usage?.outputTokens || 0);
}
