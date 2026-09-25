import { getAllDailyWords } from "./culture";
import { WORD_BANK } from "./data/word-bank";
import type { WordCategory, WordEntry } from "./data/word-bank";
import { normalizeBengali } from "./normalize";
import { tokenizeToTiles } from "./tokenize";

export type { WordCategory, WordEntry };

/** Categories for the daily words that pre-date the word bank. */
const DAILY_WORD_CATEGORY: Record<string, WordCategory> = {
  আড্ডা: "society",
  শিউলি: "nature",
  কাশফুল: "nature",
  আলপনা: "arts",
  ঢাক: "arts",
  রোদ্দুর: "nature",
  প্রবাস: "society",
  স্বপ্ন: "mind",
  মায়া: "mind",
  সন্ধ্যা: "time",
  নৌকা: "society",
  মিষ্টি: "food",
  বৃষ্টি: "nature",
  খিচুড়ি: "food",
  পুঁথি: "arts",
  ভাটিয়ালি: "arts",
  পার্বণ: "festival",
  পিঠে: "food",
  শাঁখ: "festival",
  উদাস: "mind",
  পাড়া: "place",
  গল্প: "arts",
  বইমেলা: "arts",
  ভোর: "time",
  "নকশি কাঁথা": "arts",
  বিজয়া: "festival",
  হাওয়া: "nature",
  বাউল: "arts"
};

const key = (word: string) => normalizeBengali(word);

/** Rough difficulty from the word's shape: number of akshara tiles plus extra weight for conjuncts. */
export function estimateDifficulty(word: string): 1 | 2 | 3 | 4 | 5 {
  const normalized = key(word);
  const tiles = tokenizeToTiles(normalized).length;
  const conjuncts = Array.from(normalized).filter((ch) => ch === "্").length;
  const score = tiles + conjuncts * 2;
  return score <= 2 ? 1 : score <= 3 ? 2 : score <= 5 ? 3 : score <= 7 ? 4 : 5;
}

let index: Map<string, WordEntry> | null = null;

function buildIndex(): Map<string, WordEntry> {
  const map = new Map<string, WordEntry>();
  // Daily words first, so richer word-bank entries for the same word replace them.
  for (const d of getAllDailyWords()) {
    map.set(key(d.word), {
      word: key(d.word),
      pronunciation: d.roman,
      meaningBn: d.meaningBn,
      meaningEn: d.meaningEn,
      difficulty: estimateDifficulty(d.word),
      category: DAILY_WORD_CATEGORY[d.word] ?? "society",
      relatedWords: [],
      exampleBn: d.exampleBn,
      exampleEn: "",
      source: "Alapon editorial"
    });
  }
  for (const entry of WORD_BANK) map.set(key(entry.word), { ...entry, word: key(entry.word) });
  return map;
}

export function getAllWordEntries(): WordEntry[] {
  index ??= buildIndex();
  return [...index.values()];
}

/** The curated entry for a word, or null when Alapon has no written meaning for it yet. */
export function getWordEntry(word: string): WordEntry | null {
  index ??= buildIndex();
  return index.get(key(word)) ?? null;
}

export interface WordDNA {
  word: string;
  /** The word split into game/orthographic tiles (aksharas). */
  tiles: string[];
  conjunctCount: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Curated meaning, category, related words, example and story - null for words without an entry. */
  entry: WordEntry | null;
  /** Related words that themselves have a curated entry (safe to link with confidence). */
  relatedWithEntries: string[];
}

/** Everything Word DNA can say about a word. Works for any word; richer when it is in the bank. */
export function getWordDNA(word: string): WordDNA {
  const normalized = key(word);
  const entry = getWordEntry(normalized);
  return {
    word: normalized,
    tiles: tokenizeToTiles(normalized),
    conjunctCount: Array.from(normalized).filter((ch) => ch === "্").length,
    difficulty: entry?.difficulty ?? estimateDifficulty(normalized),
    entry,
    relatedWithEntries: (entry?.relatedWords ?? []).filter((w) => getWordEntry(w) !== null)
  };
}

/** Words that the learner can meaningfully be sent to: those with a curated entry. */
export function hasWordEntry(word: string): boolean {
  return getWordEntry(word) !== null;
}
