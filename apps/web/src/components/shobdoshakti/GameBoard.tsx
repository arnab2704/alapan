"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { cellKey, getBonusType, getCenter } from "@alapon/game-engine";
import type { GameState as EngineGameState } from "@alapon/game-engine";
import { BoardCell } from "./BoardCell";
import type { PendingPlacement } from "./gameTypes";

const MemoBoardCell = memo(BoardCell);

export interface GameBoardProps {
  engine: EngineGameState;
  pendingPlacements: PendingPlacement[];
  isFirstMove: boolean;
  onCellActivate: (row: number, col: number) => void;
  ariaLabel: string;
}

/**
 * The 15x15 board. Keyboard users move the roving-tabindex focus with the
 * arrow keys and activate a cell with Enter/Space (native <button>
 * behavior) - see spec §6/§21.
 */
export function GameBoard({
  engine,
  pendingPlacements,
  isFirstMove,
  onCellActivate,
  ariaLabel
}: GameBoardProps) {
  const size = engine.board.size;
  const center = getCenter(size);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusPos, setFocusPos] = useState<{ row: number; col: number }>({ row: center, col: center });

  const pendingMap = useMemo(() => {
    const m = new Map<string, PendingPlacement>();
    for (const p of pendingPlacements) m.set(cellKey(p.row, p.col), p);
    return m;
  }, [pendingPlacements]);

  const bonusGrid = useMemo(() => {
    const grid: ReturnType<typeof getBonusType>[][] = [];
    for (let row = 0; row < size; row++) {
      const rowBonus: ReturnType<typeof getBonusType>[] = [];
      for (let col = 0; col < size; col++) {
        rowBonus.push(getBonusType(row, col, size));
      }
      grid.push(rowBonus);
    }
    return grid;
  }, [size]);

  const focusCell = useCallback((row: number, col: number) => {
    setFocusPos({ row, col });
    const btn = containerRef.current?.querySelector<HTMLButtonElement>(
      `button[data-row="${row}"][data-col="${col}"]`
    );
    btn?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const { row, col } = focusPos;
      let nextRow = row;
      let nextCol = col;
      switch (event.key) {
        case "ArrowUp":
          nextRow = Math.max(0, row - 1);
          break;
        case "ArrowDown":
          nextRow = Math.min(size - 1, row + 1);
          break;
        case "ArrowLeft":
          nextCol = Math.max(0, col - 1);
          break;
        case "ArrowRight":
          nextCol = Math.min(size - 1, col + 1);
          break;
        default:
          return;
      }
      event.preventDefault();
      focusCell(nextRow, nextCol);
    },
    [focusPos, focusCell, size]
  );

  return (
    <div
      ref={containerRef}
      role="grid"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="mx-auto grid w-full max-w-[760px] gap-px rounded-md border border-ink-200 bg-ink-200 p-px"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: size }).map((_, row) =>
        Array.from({ length: size }).map((_, col) => {
          const key = cellKey(row, col);
          const pendingTile = pendingMap.get(key)?.tile;
          const placedTile = engine.board.cells.get(key)?.tile;
          const tile = pendingTile ?? placedTile;
          const isCenter = row === center && col === center;
          const isFocusTarget = row === focusPos.row && col === focusPos.col;

          return (
            <MemoBoardCell
              key={key}
              row={row}
              col={col}
              tile={tile}
              bonus={bonusGrid[row][col]}
              isCenter={isCenter}
              isPending={pendingMap.has(key)}
              isFirstMove={isFirstMove}
              tabIndex={isFocusTarget ? 0 : -1}
              onFocus={() => setFocusPos({ row, col })}
              onClick={() => onCellActivate(row, col)}
            />
          );
        })
      )}
    </div>
  );
}
