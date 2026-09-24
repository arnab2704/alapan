import "server-only";
import { getQuizSet } from "@alapon/game-engine";
export type { QuizSetData } from "@alapon/game-engine";

/**
 * Server-only gateway to the ~1,100-question level bank. The bank is far
 * too large to ship to every visitor's browser, so it is only ever
 * imported from Route Handlers (see app/api/quiz/set) - the client
 * downloads one set of ~10 questions at a time. Same boundary as
 * wordJaalLevels.ts.
 */
export { getQuizSet };
