"use client";

import { Spinner } from "@/components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createPost,
  fetchCategories,
  fetchPosts,
  type AddaCategory,
  type PostRow
} from "@/lib/supabase/adda";
import { fieldClass, primaryButton, useAddaError, useFormatDate, useParticipation } from "./addaUi";
import { EDITORIAL_SLUG } from "@/lib/supabase/adda";

export function AddaHome() {
  const t = useTranslations("adda");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const errorText = useAddaError();
  const formatDate = useFormatDate();
  const router = useRouter();
  const { enabled } = useAuth();
  const { userId, signedIn, canParticipate, isModerator } = useParticipation();

  const [categories, setCategories] = useState<AddaCategory[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postCategory, setPostCategory] = useState("aajker-adda");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setPosts(null);
    setLoadError(false);
    const { data, error } = await fetchPosts(category);
    if (error) setLoadError(true);
    else setPosts(data);
  }, [category]);

  useEffect(() => {
    fetchCategories().then(({ data }) => {
      if (!data) return;
      setCategories(data);
      const wanted = new URLSearchParams(window.location.search).get("category");
      if (wanted && data.some((c) => c.slug === wanted)) setCategory(wanted);
    });
  }, []);

  // Editorial is staff-only; everyone else can read it but not post into it.
  const composerCategories = categories.filter((c) => c.slug !== EDITORIAL_SLUG || isModerator);

  useEffect(() => {
    if (enabled) void load();
  }, [enabled, load]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    setBusy(true);
    setFormError(null);
    const { data, error } = await createPost({ userId, category: postCategory, title, body });
    setBusy(false);
    if (error) setFormError(errorText(error));
    else if (data) router.push(`/theke-adda/${data}`);
  }

  const name = (c: AddaCategory) => (locale === "bn" ? c.name_bn : c.name_en);
  const categoryName = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? name(c) : slug;
  };
  const chip = (active: boolean) =>
    `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 ${
      active
        ? "border-sindoor-500 bg-sindoor-500 text-white"
        : "border-ink-200 bg-cream-100 text-ink-700 hover:bg-sindoor-50 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-100"
    }`;

  if (!enabled) {
    return (
      <Container className="py-10 sm:py-14">
        <SectionHeading title={t("title")} description={t("description")} />
        <Card>
          <p role="alert">{t("errors.unavailable")}</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("title")} description={t("description")} />
      <p className="mb-4 rounded-lg bg-marigold-50 p-3 text-sm text-ink-700 dark:bg-ink-800 dark:text-ink-100">
        {t("guidelines")}
      </p>

      <Card className="mb-6 border-t-4 border-t-sindoor-400">
        {canParticipate ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <h2 className="font-bengaliDisplay text-lg font-bold">{t("newPost")}</h2>
            <label className="text-sm font-medium">
              {t("category")}
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className={fieldClass}
              >
                {composerCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {name(c)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              {t("postTitle")}
              <input
                required
                minLength={3}
                maxLength={140}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-medium">
              {t("postBody")}
              <textarea
                required
                maxLength={5000}
                rows={4}
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
              {t("publish")}
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

      <div role="group" aria-label={t("category")} className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={chip(category === null)}
        >
          {t("all")}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            aria-pressed={category === c.slug}
            className={chip(category === c.slug)}
          >
            {name(c)}
          </button>
        ))}
      </div>

      {loadError ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 text-sindoor-700 dark:text-sindoor-300"
        >
          <p>{t("loadFailed")}</p>
          <button type="button" onClick={() => void load()} className={primaryButton}>
            {t("retry")}
          </button>
        </div>
      ) : posts === null ? (
        <p role="status" className="flex items-center gap-2 text-ink-500">
          <Spinner className="text-sindoor-500" />
          {t("loading")}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-ink-500">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/theke-adda/${post.id}`} className="block">
                <Card className="transition-shadow hover:shadow-md">
                  <p className="text-xs font-semibold text-sindoor-600">{categoryName(post.category_slug)}</p>
                  <h2 className="font-bengaliDisplay mt-1 text-lg font-bold text-ink-900 dark:text-ink-50">
                    {post.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-600 dark:text-ink-200">{post.body}</p>
                  <p className="mt-2 text-xs text-ink-500">
                    {post.author_display_name} · {formatDate(post.created_at)} ·{" "}
                    {t("comments", { count: toDigits(post.comment_count) })}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
