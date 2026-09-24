import type { WordJaalCombination } from "@/lib/wordJaalLevels";

export type GameMode = "level" | "free";

export interface WordJaalLetterTile {
  id: string;
  letter: string;
}

export type WordJaalGuessStatus = "idle" | "correct" | "empty" | "already_found" | "not_in_list";

export interface WordJaalProgressData {
  currentLevel: number;
  currentCombinationIndex: number;
  highestUnlockedLevel: number;
  totalScore: number;
}

export interface WordJaalViewState {
  levelNumber: number;
  levelDifficulty: string | null;
  combination: WordJaalCombination | null;
  combinationIndex: number;
  combinationCount: number;
  availableLetters: WordJaalLetterTile[];
  currentGuessTiles: WordJaalLetterTile[];
  foundWords: string[];
  guessStatus: WordJaalGuessStatus;
  lastPoints: number | null;
  isHelped: boolean;
  levelJustCompleted: boolean;
}
