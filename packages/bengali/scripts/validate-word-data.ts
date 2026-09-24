import { readFileSync } from "node:fs";
import { isValidBengaliWord, normalizeForDictionary, tokenizeBengali } from "../src/index";

interface LevelEntry {
  level: number;
  difficulty: string;
  starting_letter: string;
  target_word: string;
  normalized_word: string;
  orthographic_length_approx: number;
  contains_conjunct: boolean;
  difficulty_score: number;
  category: string;
  validation_status: string;
  source: string;
  license_status: string;
}

const path = process.argv[2];
if (!path) {
  console.error("Usage: tsx validate-word-data.ts <path-to-word-data.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(path, "utf-8"));
const levels: LevelEntry[] = raw.levels;

let invalidWords = 0;
let normalizedMismatch = 0;
let lengthMismatch = 0;
let lengthMatchesCodepointCount = 0;
let lengthMatchesGraphemeCount = 0;
let conjunctFlagMismatch = 0;
let conjunctFalseNegatives = 0; // engine says conjunct, json says no
let conjunctFalsePositives = 0; // engine says no conjunct, json says yes
let notMonotonicDifficulty = 0;
let prevScore = -Infinity;

const invalidExamples: string[] = [];
const normMismatchExamples: string[] = [];
const lengthMismatchExamples: string[] = [];
const conjunctMismatchExamples: string[] = [];

for (const entry of levels) {
  const word = entry.target_word;

  if (!isValidBengaliWord(word)) {
    invalidWords++;
    if (invalidExamples.length < 15) invalidExamples.push(`L${entry.level} "${word}"`);
  }

  const normalized = normalizeForDictionary(word);
  if (normalized !== entry.normalized_word) {
    normalizedMismatch++;
    if (normMismatchExamples.length < 15) {
      normMismatchExamples.push(
        `L${entry.level} "${word}" -> engine:"${normalized}" json:"${entry.normalized_word}"`
      );
    }
  }

  const tokens = tokenizeBengali(word).filter((t) => t.type !== "other");
  const tileCount = tokens.length;
  const codepointCount = Array.from(word).length;
  if (tileCount !== entry.orthographic_length_approx) {
    lengthMismatch++;
    const explainedByCodepoints = codepointCount === entry.orthographic_length_approx;
    if (explainedByCodepoints) lengthMatchesCodepointCount++;
    if (!explainedByCodepoints && lengthMismatchExamples.length < 40) {
      lengthMismatchExamples.push(
        `UNEXPLAINED L${entry.level} "${word}" tiles=[${tokens.map((t) => t.text).join("|")}] engine_len=${tileCount} json_len=${entry.orthographic_length_approx} codepoints=${codepointCount}`
      );
    }
  }

  const hasConjunctToken = tokens.some((t) => {
    // A token with more than one consonant grapheme joined by virama.
    return /্/.test(t.text);
  });
  if (hasConjunctToken !== entry.contains_conjunct) {
    conjunctFlagMismatch++;
    if (hasConjunctToken && !entry.contains_conjunct) conjunctFalseNegatives++;
    if (!hasConjunctToken && entry.contains_conjunct) conjunctFalsePositives++;
    if (conjunctMismatchExamples.length < 20) {
      conjunctMismatchExamples.push(
        `L${entry.level} "${word}" tiles=[${tokens.map((t) => t.text).join("|")}] engine_conjunct=${hasConjunctToken} json_conjunct=${entry.contains_conjunct}`
      );
    }
  }

  if (entry.difficulty_score < prevScore) {
    notMonotonicDifficulty++;
  }
  prevScore = entry.difficulty_score;
}

console.log(`Total levels: ${levels.length}`);
console.log(`Structurally invalid Bengali words (isValidBengaliWord=false): ${invalidWords}`);
invalidExamples.forEach((e) => console.log("  " + e));
console.log(`normalized_word mismatches vs normalizeForDictionary(): ${normalizedMismatch}`);
normMismatchExamples.forEach((e) => console.log("  " + e));
console.log(`orthographic_length_approx mismatches vs tokenizeBengali() tile count: ${lengthMismatch}`);
console.log(`  of which json_len == raw codepoint count: ${lengthMatchesCodepointCount}`);
lengthMismatchExamples.forEach((e) => console.log("  " + e));
console.log(`contains_conjunct mismatches vs actual token conjuncts: ${conjunctFlagMismatch}`);
console.log(`  false negatives (engine=true, json=false): ${conjunctFalseNegatives}`);
console.log(`  false positives (engine=false, json=true): ${conjunctFalsePositives}`);
conjunctMismatchExamples.forEach((e) => console.log("  " + e));
console.log(`Non-monotonic difficulty_score transitions: ${notMonotonicDifficulty}`);
