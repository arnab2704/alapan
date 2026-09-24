import { getSupabase } from "./client";

export interface AddaCategory {
  slug: string;
  name_bn: string;
  name_en: string;
}

export interface PostRow {
  id: string;
  author_id: string;
  author_username: string;
  author_display_name: string;
  category_slug: string;
  title: string;
  body: string;
  created_at: string;
  comment_count: number;
}

export interface CommentRow {
  id: string;
  post_id: string;
  author_id: string;
  author_username: string;
  author_display_name: string;
  body: string;
  created_at: string;
}

export type ReportReason = "spam" | "abuse" | "hate" | "unsafe" | "copyright" | "other";
export type ReportTarget = "post" | "comment";

/** Errors are mapped to short codes so the UI can show translated messages. */
export type AddaError = "unavailable" | "rate_limit" | "not_allowed" | "failed";

export interface Result<T> {
  data: T | null;
  error: AddaError | null;
}

function fail<T>(error: AddaError): Result<T> {
  return { data: null, error };
}

function mapError(err: { code?: string; message?: string }): AddaError {
  if (err.message?.includes("rate_limit")) return "rate_limit";
  if (err.code === "42501") return "not_allowed";
  return "failed";
}

export async function fetchCategories(): Promise<Result<AddaCategory[]>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase
    .from("adda_categories")
    .select("slug, name_bn, name_en")
    .order("sort_order");
  return error ? fail("failed") : { data: data ?? [], error: null };
}

export async function fetchPosts(category: string | null): Promise<Result<PostRow[]>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  let query = supabase.from("post_feed").select("*").order("created_at", { ascending: false }).limit(30);
  if (category) query = query.eq("category_slug", category);
  const { data, error } = await query;
  return error ? fail("failed") : { data: (data as PostRow[]) ?? [], error: null };
}

export const EDITORIAL_SLUG = "editorial";

/** The newest editorial posts, for the homepage strip. */
export async function fetchLatestEditorial(limit: number): Promise<Result<PostRow[]>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase
    .from("post_feed")
    .select("*")
    .eq("category_slug", EDITORIAL_SLUG)
    .order("created_at", { ascending: false })
    .limit(limit);
  return error ? fail("failed") : { data: (data as PostRow[]) ?? [], error: null };
}

export async function fetchPost(id: string): Promise<Result<PostRow | null>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase.from("post_feed").select("*").eq("id", id).maybeSingle();
  return error ? fail("failed") : { data: (data as PostRow | null) ?? null, error: null };
}

export async function fetchComments(postId: string): Promise<Result<CommentRow[]>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase
    .from("comment_feed")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);
  return error ? fail("failed") : { data: (data as CommentRow[]) ?? [], error: null };
}

export async function createPost(input: {
  userId: string;
  category: string;
  title: string;
  body: string;
}): Promise<Result<string>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: input.userId,
      category_slug: input.category,
      title: input.title.trim(),
      body: input.body.trim()
    })
    .select("id")
    .single();
  return error ? fail(mapError(error)) : { data: data.id as string, error: null };
}

export async function createComment(input: {
  userId: string;
  postId: string;
  body: string;
}): Promise<Result<true>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { error } = await supabase
    .from("comments")
    .insert({ author_id: input.userId, post_id: input.postId, body: input.body.trim() });
  return error ? fail(mapError(error)) : { data: true, error: null };
}

/** Like counts and whether the viewer liked each target. */
export async function fetchLikes(
  targetType: ReportTarget,
  ids: string[],
  userId: string | null
): Promise<Record<string, { count: number; mine: boolean }>> {
  const supabase = getSupabase();
  const out: Record<string, { count: number; mine: boolean }> = {};
  ids.forEach((id) => (out[id] = { count: 0, mine: false }));
  if (!supabase || ids.length === 0) return out;
  const { data } = await supabase
    .from("reactions")
    .select("target_id, user_id")
    .eq("target_type", targetType)
    .in("target_id", ids);
  (data ?? []).forEach((row) => {
    const entry = out[row.target_id as string];
    if (!entry) return;
    entry.count += 1;
    if (row.user_id === userId) entry.mine = true;
  });
  return out;
}

export async function setLike(
  userId: string,
  targetType: ReportTarget,
  targetId: string,
  liked: boolean
): Promise<Result<true>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { error } = liked
    ? await supabase
        .from("reactions")
        .upsert({ user_id: userId, target_type: targetType, target_id: targetId, kind: "like" })
    : await supabase
        .from("reactions")
        .delete()
        .eq("user_id", userId)
        .eq("target_type", targetType)
        .eq("target_id", targetId);
  return error ? fail(mapError(error)) : { data: true, error: null };
}

export async function fileReport(input: {
  userId: string;
  targetType: ReportTarget;
  targetId: string;
  reason: ReportReason;
  description: string;
}): Promise<Result<true>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { error } = await supabase.from("reports").insert({
    reporter_id: input.userId,
    target_type: input.targetType,
    target_id: input.targetId,
    reason: input.reason,
    description: input.description.trim() || null,
    priority: input.reason === "unsafe" ? "high" : "normal"
  });
  return error ? fail(mapError(error)) : { data: true, error: null };
}

export async function blockUser(
  userId: string,
  blockedId: string,
  mutedOnly: boolean
): Promise<Result<true>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { error } = await supabase
    .from("blocks")
    .upsert({ blocker_id: userId, blocked_id: blockedId, muted_only: mutedOnly });
  return error ? fail(mapError(error)) : { data: true, error: null };
}

export interface ReportQueueRow {
  id: string;
  target_type: "post" | "comment" | "profile" | "copyright";
  target_id: string;
  reason: ReportReason;
  description: string | null;
  priority: "low" | "normal" | "high";
  created_at: string;
  target_text: string | null;
  target_author_id: string | null;
}

/** Open reports with the reported text attached (moderators only - RLS enforces this). */
export async function fetchOpenReports(): Promise<Result<ReportQueueRow[]>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const { data, error } = await supabase
    .from("reports")
    .select("id, target_type, target_id, reason, description, priority, created_at")
    .in("status", ["open", "reviewing"])
    .order("created_at", { ascending: true })
    .limit(50);
  if (error) return fail("failed");
  const rows: ReportQueueRow[] = [];
  for (const r of data ?? []) {
    let text: string | null = null;
    let authorId: string | null = null;
    if (r.target_type === "post") {
      const { data: post } = await supabase
        .from("posts")
        .select("title, body, author_id")
        .eq("id", r.target_id)
        .maybeSingle();
      text = post ? `${post.title}\n${post.body}` : null;
      authorId = post?.author_id ?? null;
    } else if (r.target_type === "comment") {
      const { data: comment } = await supabase
        .from("comments")
        .select("body, author_id")
        .eq("id", r.target_id)
        .maybeSingle();
      text = comment?.body ?? null;
      authorId = comment?.author_id ?? null;
    }
    rows.push({
      ...(r as Omit<ReportQueueRow, "target_text" | "target_author_id">),
      target_text: text,
      target_author_id: authorId
    });
  }
  return { data: rows, error: null };
}

export type ModerationAction = "remove" | "dismiss";

export async function resolveReport(
  moderatorId: string,
  report: ReportQueueRow,
  action: ModerationAction
): Promise<Result<true>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  if (action === "remove" && (report.target_type === "post" || report.target_type === "comment")) {
    const table = report.target_type === "post" ? "posts" : "comments";
    const { error } = await supabase
      .from(table)
      .update({ status: "hidden", moderation_status: "removed" })
      .eq("id", report.target_id);
    if (error) return fail(mapError(error));
  }
  const { error } = await supabase
    .from("reports")
    .update({
      status: action === "remove" ? "actioned" : "dismissed",
      resolved_at: new Date().toISOString(),
      resolved_by: moderatorId
    })
    .eq("id", report.id);
  if (error) return fail(mapError(error));
  await supabase.rpc("log_moderation_action", {
    p_action: action === "remove" ? "remove_content" : "dismiss_report",
    p_target_type: report.target_type,
    p_target_id: report.target_id,
    p_detail: { report_id: report.id, reason: report.reason }
  });
  return { data: true, error: null };
}

export async function suspendUser(moderatorId: string, userId: string, days: number): Promise<Result<true>> {
  const supabase = getSupabase();
  if (!supabase) return fail("unavailable");
  const until = new Date(Date.now() + days * 86_400_000).toISOString();
  const { error } = await supabase.from("profiles").update({ suspended_until: until }).eq("id", userId);
  if (error) return fail(mapError(error));
  await supabase.rpc("log_moderation_action", {
    p_action: "suspend_user",
    p_target_type: "profile",
    p_target_id: userId,
    p_detail: { days, by: moderatorId }
  });
  return { data: true, error: null };
}
