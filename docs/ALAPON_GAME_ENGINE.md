# Game engine (ShobdoShakti)

Package `packages/game-engine` (pure TS, no React, Vitest-covered).

- **Levels**: `wordJaalLevels` - each level has combinations `{ letters, canForm }`. Note: the dataset contains many fragment "words" (pre-existing); curating it is future work.
- **Daily Challenge** (`dailyChallenge.ts`): 3 rounds (`DAILY_ROUNDS`). Base level by weekday `[3,1,2,3,4,5,6]` (Sun..Sat) plus round offset, capped at the last level; combination index from a `mulberry32` seed of the day index since 2026-01-01. `getDailyChallengeSpec(iso, override?)` accepts an editor override (validated by `isRoundAvailable`). `resolveDailyChallenge` fills in letters and findable words.
- **Result** (`summarizeDailyResult`): score, words in play order, best word (longest, then highest score), used for `GameResult` and share text.
- **Participation** (`participation.ts`): `participationStreak` counts consecutive played days; the UI never uses punitive language.
- **Validation**: dictionary `canForm` per round; moves are grapheme-based.
- Server: `/api/shobdoshakti/daily?date=` (date must be within +-1 day of UTC) merges `daily_challenges` override then falls back to the deterministic spec.
- Ranking: `game_results` + `daily_rank(day, score)` exist in migration 0005; the result screen does not yet show rank (hidden when unavailable).
