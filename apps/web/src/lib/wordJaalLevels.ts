import "server-only";
import { getWordJaalLevel, getWordJaalLevelSummaries, TOTAL_WORDJAAL_LEVELS } from "@alapon/game-engine";
export type { WordJaalLevel, WordJaalCombination, WordJaalLevelSummary } from "@alapon/game-engine";

/**
 * Thin server-only wrapper around @alapon/game-engine's শব্দজাল level
 * loader - see apps/web/src/lib/wordLevels.ts for why this boundary lives
 * here and not in the engine package. Only import from Route
 * Handlers/Server Components, never from a "use client" file.
 */
export { getWordJaalLevel, getWordJaalLevelSummaries, TOTAL_WORDJAAL_LEVELS };
