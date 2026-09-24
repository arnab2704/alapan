import { readFileSync, writeFileSync } from "node:fs";
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
  console.error("Usage: tsx fix-shobdojaal-levels.ts <path-to-game-levels.json>");
  process.exit(1);
}

const data: GameLevels = JSON.parse(readFileSync(path, "utf-8"));

let wordsDropped = 0;
let combosWithLettersChanged = 0;
let combosWithWordsDropped = 0;
let emptyCombosAfterClean = 0;

const droppedExamples: string[] = [];

for (const level of data.levels) {
  const cleanedCombos: Combination[] = [];

  for (const combo of level.combinations) {
    // Clean canForm: normalize to NFC, drop anything structurally invalid
    // (non-Bengali script leaks, orphan vowel signs, dangling viramas,
    // multi-word entries with spaces), dedupe.
    const seen = new Set<string>();
    const cleanedWords: string[] = [];
    for (const raw of combo.canForm) {
      const word = normalizeBengali(raw);
      if (!isValidBengaliWord(word)) {
        wordsDropped++;
        if (droppedExamples.length < 20) {
          droppedExamples.push(`L${level.level} "${raw}"`);
        }
        continue;
      }
      if (seen.has(word)) continue;
      seen.add(word);
      cleanedWords.push(word);
    }

    if (cleanedWords.length === 0) {
      emptyCombosAfterClean++;
      continue; // drop the whole combination - nothing left to play
    }
    if (cleanedWords.length !== combo.canForm.length) combosWithWordsDropped++;

    // Recompute letters as the exact union-max character multiset actually
    // needed to spell every word in this combination - guarantees every
    // word is spellable from the given tiles, which ~47% of the original
    // dataset's combinations were not (see validate-shobdojaal-levels.ts).
    const requiredCounts = new Map<string, number>();
    for (const word of cleanedWords) {
      const counts = new Map<string, number>();
      for (const ch of Array.from(word)) counts.set(ch, (counts.get(ch) ?? 0) + 1);
      for (const [ch, count] of counts) {
        requiredCounts.set(ch, Math.max(requiredCounts.get(ch) ?? 0, count));
      }
    }

    // Stable order: first appearance across the cleaned word list.
    const orderedLetters: string[] = [];
    for (const word of cleanedWords) {
      for (const ch of Array.from(word)) {
        if ((requiredCounts.get(ch) ?? 0) > 0) {
          orderedLetters.push(ch);
          requiredCounts.set(ch, requiredCounts.get(ch)! - 1);
        }
      }
    }
    orderedLetters.sort(); // will be shuffled client-side at play time; sort here just for a stable diff

    const lettersChanged =
      JSON.stringify([...combo.letters].sort()) !== JSON.stringify([...orderedLetters].sort());
    if (lettersChanged) combosWithLettersChanged++;

    cleanedCombos.push({ letters: orderedLetters, canForm: cleanedWords });
  }

  level.combinations = cleanedCombos;
}

data.total_combinations = data.levels.reduce((sum, l) => sum + l.combinations.length, 0);

writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");

console.log(`Rewrote ${path}`);
console.log(`Structurally invalid canForm words dropped: ${wordsDropped}`);
droppedExamples.forEach((e) => console.log("  " + e));
console.log(`Combinations with at least one word dropped: ${combosWithWordsDropped}`);
console.log(`Combinations dropped entirely (nothing valid left): ${emptyCombosAfterClean}`);
console.log(`Combinations with letters recomputed to a different multiset: ${combosWithLettersChanged}`);
console.log(`Final total combinations: ${data.total_combinations}`);
