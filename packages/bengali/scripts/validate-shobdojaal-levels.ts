import { readFileSync } from "node:fs";
import { isValidBengaliWord, normalizeBengali } from "../src/index";

interface Combination {
  letters: string[];
  canForm: string[];
}

interface Level {
  level: number;
  difficulty: string;
  focus: string;
  combinations: Combination[];
}

interface GameLevels {
  game_name: string;
  total_levels: number;
  total_combinations: number;
  levels: Level[];
}

const path = process.argv[2];
if (!path) {
  console.error("Usage: tsx validate-shobdojaal-levels.ts <path-to-game-levels.json>");
  process.exit(1);
}

const data: GameLevels = JSON.parse(readFileSync(path, "utf-8"));

let totalCombinations = 0;
let unspellableWordInstances = 0;
let invalidWords = 0;
let emptyCanForm = 0;
let duplicateCanFormWithinCombo = 0;
let notNfcNormalized = 0;
let duplicateCombinationKeys = 0;

const seenComboKeys = new Set<string>();
const unspellableExamples: string[] = [];
const invalidWordExamples: string[] = [];

function multisetFromLetters(letters: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of letters) m.set(l, (m.get(l) ?? 0) + 1);
  return m;
}

function canSpell(word: string, availableLetters: Map<string, number>): boolean {
  const need = new Map<string, number>();
  for (const ch of Array.from(word)) need.set(ch, (need.get(ch) ?? 0) + 1);
  for (const [ch, count] of need) {
    if ((availableLetters.get(ch) ?? 0) < count) return false;
  }
  return true;
}

for (const level of data.levels) {
  for (const combo of level.combinations) {
    totalCombinations++;

    const comboKey = `L${level.level}:${[...combo.letters].sort().join("")}`;
    if (seenComboKeys.has(comboKey)) duplicateCombinationKeys++;
    seenComboKeys.add(comboKey);

    if (combo.canForm.length === 0) emptyCanForm++;
    if (new Set(combo.canForm).size !== combo.canForm.length) duplicateCanFormWithinCombo++;

    const available = multisetFromLetters(combo.letters);

    for (const word of combo.canForm) {
      if (normalizeBengali(word) !== word) notNfcNormalized++;

      if (!isValidBengaliWord(word)) {
        invalidWords++;
        if (invalidWordExamples.length < 20) {
          invalidWordExamples.push(`L${level.level} letters=[${combo.letters.join("|")}] word="${word}"`);
        }
      }

      if (!canSpell(word, available)) {
        unspellableWordInstances++;
        if (unspellableExamples.length < 30) {
          unspellableExamples.push(`L${level.level} letters=[${combo.letters.join("|")}] canForm="${word}"`);
        }
      }
    }
  }
}

console.log(`Total combinations: ${totalCombinations}`);
console.log(
  `Duplicate combination keys (same letter multiset reused within a level): ${duplicateCombinationKeys}`
);
console.log(`Combinations with empty canForm: ${emptyCanForm}`);
console.log(
  `Combinations with duplicate words within their own canForm list: ${duplicateCanFormWithinCombo}`
);
console.log(`canForm words not already NFC-normalized: ${notNfcNormalized}`);
console.log(`Structurally invalid Bengali canForm words (isValidBengaliWord=false): ${invalidWords}`);
invalidWordExamples.forEach((e) => console.log("  " + e));
console.log(
  `canForm word instances NOT spellable from their combination's letters: ${unspellableWordInstances}`
);
unspellableExamples.forEach((e) => console.log("  " + e));
