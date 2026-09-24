import { getSupabase } from "./client";

/** Saves a finished quiz for the signed-in user, keeping only their best score. Failures are silent: local progress is the source of truth for play. */
export async function saveQuizResult(
  userId: string,
  kind: "daily" | "level",
  ref: string,
  score: number,
  total: number
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data } = await supabase
    .from("quiz_results")
    .select("score")
    .eq("user_id", userId)
    .eq("kind", kind)
    .eq("ref", ref)
    .maybeSingle();
  if (data && data.score >= score) return;
  await supabase
    .from("quiz_results")
    .upsert({ user_id: userId, kind, ref, score, total }, { onConflict: "user_id,kind,ref" });
}
