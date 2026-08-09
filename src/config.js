// SPDX-License-Identifier: GPL-3.0-or-later

// Set VITE_LEARNING_PATH_ENABLED=false at build time to ship the original
// unrestricted experience only. The comparison is deliberately explicit so
// local development and existing deployments get the learning path by default.
export const LEARNING_PATH_ENABLED =
  String(import.meta.env.VITE_LEARNING_PATH_ENABLED ?? "true").toLowerCase() !== "false";

