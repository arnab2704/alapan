"use client";

import { Spinner } from "@/components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Container } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { recordDiscovery } from "@/lib/passport";
import {
  blockUser,
  createComment,
  fetchComments,
  fetchLikes,
  fetchPost,
  type CommentRow,
  type PostRow
} from "@/lib/supabase/adda";
import { LikeButton } from "./LikeButton";
import { ReportButton } from "./ReportButton";
import {
  fieldClass,
  ghostButton,
  primaryButton,
  useAddaError,
  useFormatDate,
  useParticipation
} from "./addaUi";

type Likes = Record<string, { count: number; mine: boolean }>;

export function PostThread({ postId }: { postId: string }) {
  const t = useTranslations("adda");
  const errorText = useAddaError();
  const formatDate = useFormatDate();
  const { ready, userId, signedIn, canParticipate } = useParticipation();

  const [state, setState] = useState<"loading" | "missing" | "error" | "ok">("loading");
  const [post, setPost] = useState<PostRow | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [likes, setLikes] = useState<Likes>({});
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const postResult = await fetchPost(postId);
    if (postResult.error) return setState("error");
    if (!postResult.data) return setState("missing");
    const commentResult = await fetchComments(postId);
    const list = commentResult.data ?? [];
    setPost(postResult.data);
    if (postResult.data.category_slug === "editorial") recordDiscovery("stories", postResult.data.id);
    setComments(list);
    const [postLikes, commentLikes] = await Promise.all([
      fetchLikes("post", [postId], userId),
      fetchLikes(
        "comment",
        list.map((c) => c.id),
        userId
      )
    ]);
    setLikes({ ...postLikes, ...commentLikes });
    setState("ok");
  }, [postId, userId]);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    setBusy(true);
    setFormError(null);
    const { error } = await createComment({ userId, postId, body });
    setBusy(false);
    if (error) return setFormError(errorText(error));
    setBody("");
    await load();
  }

  async function block(authorId: string) {
    if (!userId) return;
    const { error } = await blockUser(userId, authorId, false);
    if (error) setNotice(errorText(error));
    else {
      setNotice(t("blocked"));
      await load();
    }
  }

  async function mute(authorId: string) {
    if (!userId) return;
    const { error } = await blockUser(userId, authorId, true);
    if (error) setNotice(errorText(error));
    else {
      setNotice(t("muted"));
      await load();
    }
  }

  if (state === "loading") {
    return (
      <Container className="py-10">
        <p role="status" className="flex items-center gap-2 text-ink-500">
          <Spinner className="text-sindoor-500" />
          {t("loading")}
        </p>
      </Container>
    );
  }
  if (state !== "ok" || !post) {
    return (
      <Container className="py-10">
        <p role={state === "error" ? "alert" : undefined}>
          {state === "error" ? t("errors.failed") : t("postMissing")}
        </p>
        <Link href="/theke-adda" className="mt-3 inline-block font-semibold text-sindoor-600 underline">
          {t("backToAdda")}
        </Link>
      </Container>
    );
  }

  const isMine = (authorId: string) => authorId === userId;

  return (
    <Container className="max-w-2xl py-10 sm:py-14">
      <Link href="/theke-adda" className="text-sm font-semibold text-sindoor-600 underline decoration-dotted">
        {t("backToAdda")}
      </Link>
      <Card className="mt-4 border-t-4 border-t-sindoor-400">
        <h1 className="font-bengaliDisplay text-2xl font-extrabold text-ink-900 dark:text-ink-50">
          {post.title}
        </h1>
        <p className="mt-1 text-xs text-ink-500">
          {post.author_display_name} · {formatDate(post.created_at)}
        </p>
        <p className="mt-3 whitespace-pre-wrap text-ink-800 dark:text-ink-100">{post.body}</p>
        <div className="mt-3 flex flex-wrap items-start gap-1">
          <LikeButton
            targetType="post"
            targetId={post.id}
            initialCount={likes[post.id]?.count ?? 0}
            initialMine={likes[post.id]?.mine ?? false}
          />
          {!isMine(post.author_id) ? <ReportButton targetType="post" targetId={post.id} /> : null}
          {signedIn && !isMine(post.author_id) ? (
            <>
              <button type="button" onClick={() => mute(post.author_id)} className={ghostButton}>
                {t("muteAuthor")}
              </button>
              <button type="button" onClick={() => block(post.author_id)} className={ghostButton}>
                {t("blockAuthor")}
              </button>
            </>
          ) : null}
        </div>
      </Card>

      {notice ? (
        <p role="status" className="mt-3 text-sm text-ink-600">
          {notice}
        </p>
      ) : null}

      <h2 className="font-bengaliDisplay mt-8 text-lg font-bold">{t("commentsHeading")}</h2>
      {comments.length === 0 ? <p className="mt-2 text-sm text-ink-500">{t("noComments")}</p> : null}
      <ul className="mt-3 flex flex-col gap-3">
        {comments.map((c) => (
          <li key={c.id}>
            <Card>
              <p className="text-xs text-ink-500">
                {c.author_display_name} · {formatDate(c.created_at)}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink-800 dark:text-ink-100">{c.body}</p>
              <div className="mt-2 flex flex-wrap items-start gap-1">
                <LikeButton
                  targetType="comment"
                  targetId={c.id}
                  initialCount={likes[c.id]?.count ?? 0}
                  initialMine={likes[c.id]?.mine ?? false}
                />
                {!isMine(c.author_id) ? <ReportButton targetType="comment" targetId={c.id} /> : null}
                {signedIn && !isMine(c.author_id) ? (
                  <>
                    <button type="button" onClick={() => mute(c.author_id)} className={ghostButton}>
                      {t("muteAuthor")}
                    </button>
                    <button type="button" onClick={() => block(c.author_id)} className={ghostButton}>
                      {t("blockAuthor")}
                    </button>
                  </>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="mt-6">
        {canParticipate ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="text-sm font-medium">
              {t("yourComment")}
              <textarea
                required
                maxLength={2000}
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={fieldClass}
              />
            </label>
            {formError ? (
              <p role="alert" className="text-sm font-medium text-sindoor-700 dark:text-sindoor-300">
                {formError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              aria-busy={busy}
              className={`${primaryButton} gap-2 self-start`}
            >
              {busy ? <Spinner /> : null}
              {t("addComment")}
            </button>
          </form>
        ) : (
          <p className="text-sm text-ink-700 dark:text-ink-100">
            {signedIn ? t("needAdult") : t("needSignIn")}{" "}
            <Link
              href={signedIn ? "/account" : "/login"}
              className="font-semibold text-sindoor-600 underline decoration-dotted"
            >
              {signedIn ? t("goAccount") : t("goSignIn")}
            </Link>
          </p>
        )}
      </Card>
    </Container>
  );
}
