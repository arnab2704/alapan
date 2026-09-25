"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { markDaily5Item } from "@/lib/daily5";
import { checkWordJaalGuess } from "@alapon/game-engine";
import type { WordJaalCombination, WordJaalLevel } from "@/lib/wordJaalLevels";
import type { WordJaalGuessStatus, WordJaalLetterTile, WordJaalProgressData } from "./wordJaalTypes";
import { defaultProgress, readProgress, writeProgress } from "./progressStorage";

const SKIP_PENALTY = 10;

let letterTileIdCounter = 0;
function nextLetterTileId(): string {
  letterTileIdCounter += 1;
  return `letter_${letterTileIdCounter}_${Date.now().toString(36)}`;
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildLetterTiles(letters: string[]): WordJaalLetterTile[] {
  return shuffleArray(letters.map((letter) => ({ id: nextLetterTileId(), letter })));
}

/**
 * `available` and `guess` are kept as ONE state slice, updated atomically.
 * An earlier version used two separate useState calls and moved a tile
 * between them by calling the other setter from inside the first one's
 * updater function - which works most of the time, but React Strict
 * Mode's dev-only double-invocation of updater functions turned that into
 * a real, reproducible bug: the nested setter fired twice, so a tile could
 * be appended to `guess` twice (duplicate React keys, and a letter
 * effectively usable more than the rack actually had). Consolidating into
 * one state object makes every move-a-tile action a single, atomic
 * setState call with no nested setters.
 */
interface PaletteState {
  available: WordJaalLetterTile[];
  guess: WordJaalLetterTile[];
}

function buildPalette(letters: string[]): PaletteState {
  return { available: buildLetterTiles(letters), guess: [] };
}

export interface UseWordJaalGameResult {
  isLoading: boolean;
  levelNumber: number;
  totalLevels: number;
  levelDifficulty: string | null;
  levelFocus: string | null;
  combination: WordJaalCombination | null;
  combinationIndex: number;
  combinationCount: number;
  availableLetters: WordJaalLetterTile[];
  currentGuessTiles: WordJaalLetterTile[];
  foundWords: string[];
  guessStatus: WordJaalGuessStatus;
  lastMessageWord: string | null;
  lastPoints: number | null;
  isHelped: boolean;
  totalScore: number;
  levelJustCompleted: boolean;
  gameComplete: boolean;
  selectLetter: (tileId: string) => void;
  removeFromGuess: (tileId: string) => void;
  backspace: () => void;
  clearGuess: () => void;
  submitGuess: () => void;
  useHelp: () => void;
  skipCombination: () => void;
  acknowledgeLevelComplete: () => void;
  restartJourney: () => void;
}

export function useWordJaalGame(): UseWordJaalGameResult {
  const [progress, setProgress] = useState<WordJaalProgressData | null>(null);
  const [level, setLevel] = useState<WordJaalLevel | null>(null);
  const [totalLevels, setTotalLevels] = useState<number | null>(null);

  const [palette, setPalette] = useState<PaletteState>({ available: [], guess: [] });
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [guessStatus, setGuessStatus] = useState<WordJaalGuessStatus>("idle");
  const [lastMessageWord, setLastMessageWord] = useState<string | null>(null);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [isHelped, setIsHelped] = useState(false);
  const [levelJustCompleted, setLevelJustCompleted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const requestIdRef = useRef(0);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setProgress(readProgress());
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const loadLevel = useCallback(async (levelNumber: number) => {
    const requestId = ++requestIdRef.current;
    const res = await fetch(`/api/shobdoshakti/wordjaal/level/${levelNumber}`);
    if (!res.ok) return;
    const data: { level: WordJaalLevel; totalLevels: number } = await res.json();
    if (requestIdRef.current !== requestId) return;
    setLevel(data.level);
    setTotalLevels(data.totalLevels);
  }, []);

  useEffect(() => {
    if (progress) loadLevel(progress.currentLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress?.currentLevel]);

  const combinationIndex = progress?.currentCombinationIndex ?? 0;
  const combination = level?.combinations[combinationIndex] ?? null;

  // Deal a fresh letter palette whenever the combination changes.
  useEffect(() => {
    if (foundWords.length > 0) markDaily5Item("game");
  }, [foundWords.length]);

  useEffect(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (combination) {
      setPalette(buildPalette(combination.letters));
      setFoundWords([]);
      setGuessStatus("idle");
      setLastMessageWord(null);
      setLastPoints(null);
      setIsHelped(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level?.level, combinationIndex]);

  const selectLetter = useCallback((tileId: string) => {
    setPalette((prev) => {
      const tile = prev.available.find((t) => t.id === tileId);
      if (!tile) return prev;
      return { available: prev.available.filter((t) => t.id !== tileId), guess: [...prev.guess, tile] };
    });
    setGuessStatus("idle");
  }, []);

  const removeFromGuess = useCallback((tileId: string) => {
    setPalette((prev) => {
      const tile = prev.guess.find((t) => t.id === tileId);
      if (!tile) return prev;
      return { guess: prev.guess.filter((t) => t.id !== tileId), available: [...prev.available, tile] };
    });
    setGuessStatus("idle");
  }, []);

  const backspace = useCallback(() => {
    setPalette((prev) => {
      if (prev.guess.length === 0) return prev;
      const last = prev.guess[prev.guess.length - 1];
      return { guess: prev.guess.slice(0, -1), available: [...prev.available, last] };
    });
    setGuessStatus("idle");
  }, []);

  const clearGuess = useCallback(() => {
    setPalette((prev) => {
      if (prev.guess.length === 0) return prev;
      return { guess: [], available: [...prev.available, ...prev.guess] };
    });
    setGuessStatus("idle");
  }, []);

  const advanceCombination = useCallback(() => {
    setProgress((prev) => {
      const base = prev ?? defaultProgress();
      const combinationCount = level?.combinations.length ?? 0;
      const isLastCombination = base.currentCombinationIndex + 1 >= combinationCount;

      if (!isLastCombination) {
        const next: WordJaalProgressData = {
          ...base,
          currentCombinationIndex: base.currentCombinationIndex + 1
        };
        writeProgress(next);
        return next;
      }

      const nextLevelNumber = base.currentLevel + 1;
      if (totalLevels !== null && nextLevelNumber > totalLevels) {
        setGameComplete(true);
        return base;
      }

      setLevelJustCompleted(true);
      const next: WordJaalProgressData = {
        currentLevel: nextLevelNumber,
        currentCombinationIndex: 0,
        highestUnlockedLevel: Math.max(base.highestUnlockedLevel, nextLevelNumber),
        totalScore: base.totalScore
      };
      writeProgress(next);
      return next;
    });
  }, [level, totalLevels]);

  const submitGuess = useCallback(() => {
    if (!combination) return;
    const guessTiles = palette.guess;
    const guess = guessTiles.map((t) => t.letter).join("");
    const result = checkWordJaalGuess(combination, guess, foundWords, { isHelped });

    if (result.outcome !== "correct") {
      setGuessStatus(result.outcome);
      setLastMessageWord(result.outcome === "empty" ? null : result.normalizedWord);
      return;
    }

    setGuessStatus("correct");
    setLastMessageWord(result.normalizedWord);
    setLastPoints(result.points);

    const newFoundWords = [...foundWords, result.normalizedWord];
    setFoundWords(newFoundWords);

    // Reset the palette (letters are reusable across different target words in the same combination).
    setPalette((prev) => ({ available: [...prev.available, ...prev.guess], guess: [] }));
    setIsHelped(false);

    if (result.points > 0) {
      setProgress((prev) => {
        const base = prev ?? defaultProgress();
        const next = { ...base, totalScore: base.totalScore + result.points };
        writeProgress(next);
        return next;
      });
    }

    if (newFoundWords.length === combination.canForm.length) {
      advanceTimeoutRef.current = setTimeout(() => {
        advanceCombination();
      }, 900);
    }
  }, [combination, palette.guess, foundWords, isHelped, advanceCombination]);

  const useHelp = useCallback(() => {
    if (!combination) return;
    const unfound = combination.canForm.filter((w) => !foundWords.includes(w));
    if (unfound.length === 0) return;
    const suggestion = unfound[Math.floor(Math.random() * unfound.length)];

    setPalette((prev) => {
      const pool = [...prev.available, ...prev.guess];
      const picked: WordJaalLetterTile[] = [];
      for (const ch of Array.from(suggestion)) {
        const index = pool.findIndex((t) => t.letter === ch && !picked.includes(t));
        if (index !== -1) picked.push(pool[index]);
      }
      const remaining = pool.filter((t) => !picked.includes(t));
      return { available: remaining, guess: picked };
    });
    setIsHelped(true);
    setGuessStatus("idle");
  }, [combination, foundWords]);

  const skipCombination = useCallback(() => {
    setProgress((prev) => {
      const base = prev ?? defaultProgress();
      const next = { ...base, totalScore: Math.max(0, base.totalScore - SKIP_PENALTY) };
      writeProgress(next);
      return next;
    });
    advanceCombination();
  }, [advanceCombination]);

  const acknowledgeLevelComplete = useCallback(() => {
    setLevelJustCompleted(false);
  }, []);

  const restartJourney = useCallback(() => {
    const fresh = defaultProgress();
    writeProgress(fresh);
    setGameComplete(false);
    setLevelJustCompleted(false);
    setProgress(fresh);
  }, []);

  const isLoading = !progress || !level || !combination;

  return {
    isLoading,
    levelNumber: progress?.currentLevel ?? 1,
    totalLevels: totalLevels ?? 10,
    levelDifficulty: level?.difficulty ?? null,
    levelFocus: level?.focus ?? null,
    combination,
    combinationIndex,
    combinationCount: level?.combinations.length ?? 0,
    availableLetters: palette.available,
    currentGuessTiles: palette.guess,
    foundWords,
    guessStatus,
    lastMessageWord,
    lastPoints,
    isHelped,
    totalScore: progress?.totalScore ?? 0,
    levelJustCompleted,
    gameComplete,
    selectLetter,
    removeFromGuess,
    backspace,
    clearGuess,
    submitGuess,
    useHelp,
    skipCombination,
    acknowledgeLevelComplete,
    restartJourney
  };
}
