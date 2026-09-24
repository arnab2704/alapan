import "server-only";
import { getAllTargetWords } from "@alapon/game-engine";

/**
 * Thin server-only wrapper exposing the 1000-word ShobdoShakti dataset's
 * flat word list - used only by Free Play's dictionary/tile bag now (the
 * old single-target-word board Level Mode this originally also served was
 * replaced by শব্দজাল; see wordJaalLevels.ts). Only import from Route
 * Handlers/Server Components, never from a "use client" file.
 */
export { getAllTargetWords };
