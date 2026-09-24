"use client";

import { Spinner } from "@/components/Spinner";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50";

export function AccountPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { ready, user, profile, refreshProfile, signOut } = useAuth();
  const isModerator = profile?.role === "moderator" || profile?.role === "admin";
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name);
    setUsername(profile.username);
    setIsPublic(profile.privacy_level === "public");
    setIsAdult(profile.is_adult);
  }, [profile]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setBusy(true);
    setMessage(null);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        username: username.trim(),
        privacy_level: isPublic ? "public" : "private",
        is_adult: isAdult
      })
      .eq("id", user.id);
    if (error) {
      setMessage({ kind: "error", text: error.code === "23505" ? t("usernameTaken") : t("saveFailed") });
    } else {
      setMessage({ kind: "ok", text: t("saved") });
      await refreshProfile();
    }
    setBusy(false);
  }

  if (!ready || !user) {
    return <Container className="py-14">{null}</Container>;
  }

  return (
    <Container className="max-w-lg py-10 sm:py-14">
      <SectionHeading title={t("accountTitle")} description={user.email ?? ""} />
      <Card>
        <form onSubmit={save} className="flex flex-col gap-4">
          <label className="block text-sm font-medium">
            {t("displayName")}
            <input
              required
              maxLength={40}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium">
            {t("username")}
            <input
              required
              pattern="[a-zA-Z0-9_]{3,20}"
              title={t("usernameHint")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
            <span className="text-xs text-ink-400">{t("usernameHint")}</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span>
              <span className="font-medium">{t("publicProfile")}</span>
              <br />
              <span className="text-xs text-ink-400">{t("publicProfileHint")}</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span>
              <span className="font-medium">{t("adultConfirm")}</span>
              <br />
              <span className="text-xs text-ink-400">{t("adultHint")}</span>
            </span>
          </label>
          {message ? (
            <p
              role={message.kind === "error" ? "alert" : "status"}
              className={`text-sm font-medium ${message.kind === "error" ? "text-sindoor-700 dark:text-sindoor-300" : "text-shapla-700 dark:text-shapla-300"}`}
            >
              {message.text}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white hover:bg-sindoor-600 disabled:opacity-60"
          >
            {busy ? <Spinner /> : null}
            {t("save")}
          </button>
        </form>
        {isModerator ? (
          <p className="mt-4">
            <Link
              href="/moderation"
              className="text-sm font-semibold text-sindoor-600 underline decoration-dotted"
            >
              {t("moderationLink")}
            </Link>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4 dark:border-ink-700">
          <Link
            href="/leaderboard"
            className="text-sm font-semibold text-sindoor-600 underline decoration-dotted"
          >
            {t("viewLeaderboard")}
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.replace("/");
            }}
            className="min-h-11 text-sm font-semibold text-ink-600 underline dark:text-ink-200"
          >
            {t("signOut")}
          </button>
        </div>
      </Card>
    </Container>
  );
}
