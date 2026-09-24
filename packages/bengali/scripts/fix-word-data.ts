/**
 * Recomputes orthographic_length_approx (akshara/game-tile count) and
 * contains_conjunct (virama-joined consonant cluster present) from the real
 * tokenizeBengali() engine, replacing the dataset's raw-codepoint-based and
 * curated-list-based approximations. See validate-word-data.ts for the
 * discrepancy report this fixes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { tokenizeBengali } from "../src/index";

const path = process.argv[2];
if (!path) {
  console.error("Usage: tsx fix-word-data.ts <path-to-word-data.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(path, "utf-8"));

let lengthChanged = 0;
let conjunctChanged = 0;

for (const entry of raw.levels) {
  const tokens = tokenizeBengali(entry.target_word).filter((t: { type: string }) => t.type !== "other");
  const tileCount = tokens.length;
  const hasConjunct = tokens.some((t: { text: string }) => /্/.test(t.text));

  if (entry.orthographic_length_approx !== tileCount) {
    entry.orthographic_length_approx = tileCount;
    lengthChanged++;
  }
  if (entry.contains_conjunct !== hasConjunct) {
    entry.contains_conjunct = hasConjunct;
    conjunctChanged++;
  }
}

writeFileSync(path, JSON.stringify(raw, null, 2) + "\n", "utf-8");

console.log(`Rewrote ${path}`);
console.log(`orthographic_length_approx corrected: ${lengthChanged}`);
console.log(`contains_conjunct corrected: ${conjunctChanged}`);
