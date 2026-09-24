"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { tokenizeBengali, normalizeForDictionary } from "@alapon/bengali";
import { applyMove, buildWordSeededBag, createBoard, drawTiles, cellKey } from "@alapon/game-engine";
import type { DictionaryLookup, GameState as EngineGameState, Tile } from "@alapon/game-engine";
import type { FreePlayViewState, PendingPlacement } from "./gameTypes";

const BOARD_SIZE = 15;
const FREE_PLAY_RACK_SIZE = 7;

let tileIdCounter = 0;
function nextTileId(): string {
  tileIdCounter += 1;
  return `tile_${tileIdCounter}_${Date.now().toString(36)}`;
}

/** Simple, deterministic point curve: rarer/longer conjunct tiles are worth more. */
function pointsForToken(token: string): number {
  const graphemeCount = Array.from(token).length;
  const hasConjunct = /্/.test(token);
  return Math.min(10, (hasConjunct ? 3 : 1) + graphemeCount);
}

/**
 * Free Play's dictionary is a small CLOSED 1000-word list (not an open
 * language dictionary), so a plain frequency-based tile bag leaves most
 * dealt racks unable to spell any dictionary word at all - empirically
 * ~80% of the time (see packages/game-engine/src/wordSeededBag.ts for the
 * full explanation and the measurement that caught this). buildWordSeededBag
 * keeps each word's tokens grouped together so drawing from the bag - both
 * the initial deal and every refill - reliably yields a playable hand.
 */
function buildFreePlayEngineState(words: string[]): EngineGameState {
  const bag = buildWordSeededBag(words, pointsForToken, { targetSize: 200 });
  const { drawn, remaining } = drawTiles(bag, FREE_PLAY_RACK_SIZE);
  return {
    board: createBoard(BOARD_SIZE),
    bag: remaining,
    rack: drawn,
    score: 0,
    movesPlayed: 0,
    rackSize: FREE_PLAY_RACK_SIZE
  };
}

export interface UseFreePlayGameResult extends FreePlayViewState {
  isFirstMove: boolean;
  isLoading: boolean;
  selectTile: (tileId: string) => void;
  placeSelectedTile: (row: number, col: number) => void;
  returnPlacement: (row: number, col: number) => void;
  clearPending: () => void;
  submitMove: () => void;
  newFreeGame: () => void;
}

export function useFreePlayGame(): UseFreePlayGameResult {
  const [allWords, setAllWords] = useState<string[] | null>(null);
  const [engine, setEngine] = useState<EngineGameState | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [pendingPlacements, setPendingPlacements] = useState<PendingPlacement[]>([]);
  const [status, setStatus] = useState<FreePlayViewState["status"]>("idle");
  const [lastPointsScored, setLastPointsScored] = useState<number | null>(null);
  const [lastFormedWords, setLastFormedWords] = useState<string[]>([]);
  const [lastErrors, setLastErrors] = useState<FreePlayViewState["lastErrors"]>([]);

  useEffect(() => {
    fetch("/api/shobdoshakti/words")
      .then((res) => res.json())
      .then((data: { words: string[] }) => setAllWords(data.words));
  }, []);

  const dictionaryLookup: DictionaryLookup = useMemo(() => {
    if (!allWords) return () => false;
    const set = new Set(allWords.map(normalizeForDictionary));
    return (word: string) => set.has(word);
  }, [allWords]);

  // Initialize once the word list has loaded (client-only, Math.random shuffle - avoids a hydration mismatch).
  useEffect(() => {
    if (allWords && allWords.length > 0 && !engine) {
      setEngine(buildFreePlayEngineState(allWords));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWords]);

  const selectTile = useCallback((tileId: string) => {
    setSelectedTileId((prev) => (prev === tileId ? null : tileId));
  }, []);

  const placeSelectedTile = useCallback(
    (row: number, col: number) => {
      if (!engine) return;
      const occupied = engine.board.cells.get(cellKey(row, col));
      const alreadyPending = pendingPlacements.some((p) => p.row === row && p.col === col);
      if (occupied || alreadyPending || !selectedTileId) return;

      const tile = engine.rack.find((t) => t.id === selectedTileId);
      if (!tile) return;

      setPendingPlacements((prev) => [...prev, { row, col, tile }]);
      setSelectedTileId(null);
      setStatus("placing");
    },
    [engine, pendingPlacements, selectedTileId]
  );

  const returnPlacement = useCallback((row: number, col: number) => {
    setPendingPlacements((prev) => {
      const next = prev.filter((p) => !(p.row === row && p.col === col));
      setStatus(next.length > 0 ? "placing" : "idle");
      return next;
    });
  }, []);

  const clearPending = useCallback(() => {
    setPendingPlacements([]);
    setSelectedTileId(null);
    setStatus("idle");
  }, []);

  const submitMove = useCallback(() => {
    if (!engine || pendingPlacements.length === 0) return;
    const result = applyMove(engine, pendingPlacements, dictionaryLookup);

    if (!result.ok) {
      setStatus("invalid");
      setLastErrors(result.errors);
      return;
    }

    setEngine(result.state);
    setPendingPlacements([]);
    setSelectedTileId(null);
    setLastPointsScored(result.pointsScored);
    setLastFormedWords(result.formedWords.map((w) => w.text));
    setLastErrors([]);
    setStatus("idle");
  }, [engine, pendingPlacements, dictionaryLookup]);

  const newFreeGame = useCallback(() => {
    if (!allWords || allWords.length === 0) return;
    setEngine(buildFreePlayEngineState(allWords));
    setPendingPlacements([]);
    setSelectedTileId(null);
    setStatus("idle");
    setLastPointsScored(null);
    setLastFormedWords([]);
    setLastErrors([]);
  }, [allWords]);

  const isFirstMove = engine ? engine.board.cells.size === 0 : true;
  const isLoading = !engine;

  return {
    engine,
    selectedTileId,
    pendingPlacements,
    status,
    lastPointsScored,
    lastFormedWords,
    lastErrors,
    isFirstMove,
    isLoading,
    selectTile,
    placeSelectedTile,
    returnPlacement,
    clearPending,
    submitMove,
    newFreeGame
  };
}
