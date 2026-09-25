import { isRoundAvailable } from "@alapon/game-engine";
import type { DailyChallengeOverride, DailyDifficulty } from "@alapon/game-engine";

/**
 * Server-side lookup of an editor-scheduled Daily Challenge for a date (published rows only, read
 * with the public key under row-level security). Any failure means "no override": the game then
 * falls back to the deterministic daily puzzle, so a database hiccup never blocks play.
 */
export async function fetchScheduledChallenge(date: string): Promise<DailyChallengeOverride | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/daily_challenges?day=eq.${encodeURIComponent(date)}&status=eq.published&select=rounds,difficulty&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
        signal: AbortSignal.timeout(2500)
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ rounds: unknown; difficulty: string | null }>;
    const row = rows[0];
    if (!row || !Array.isArray(row.rounds)) return null;
    const rounds = row.rounds
      .map((r) => ({
        level: Number((r as { level: unknown }).level),
        index: Number((r as { index: unknown }).index)
      }))
      .filter(isRoundAvailable);
    if (rounds.length === 0) return null;
    const difficulty = ["easy", "medium", "hard"].includes(row.difficulty ?? "")
      ? (row.difficulty as DailyDifficulty)
      : undefined;
    return { rounds, difficulty };
  } catch {
    return null;
  }
}
