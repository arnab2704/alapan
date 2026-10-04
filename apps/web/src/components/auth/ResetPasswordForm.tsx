"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50";

/**
 * Landing page for the "reset your password" email link. Supabase's client reads the recovery
 * token from the URL fragment on load and, if valid, signs the visitor in with a short-lived
 * recovery session (no separate token handling needed here) - we just wait for that session and
 * then let them set a new password. A missing/expired/already-used link leaves no session, so we
 * show a plain explanation instead of a broken form.
 */
export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { enabled, ready, user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done && user) {
      const timeout = setTimeout(() => router.replace("/account"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [done, user, router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    if (password !== confirm) {
      setError(t("passwordsDontMatch"));
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message);
    else setDone(true);
  }

  return (
    <Container className="max-w-md py-10 sm:py-14">
      <SectionHeading title={t("resetPasswordTitle")} description={t("resetPasswordDescription")} />
      {!enabled && ready ? (
        <Card>
          <p role="alert">{t("unavailable")}</p>
        </Card>
      ) : !ready ? null : done ? (
        <Card>
          <p role="status" className="font-semibold text-shapla-700 dark:text-shapla-300">
            {t("passwordUpdated")}
          </p>
        </Card>
      ) : !user ? (
        <Card>
          <p role="alert">{t("resetLinkInvalid")}</p>
          <p className="mt-4">
            <Link href="/login" className="font-semibold text-sindoor-600 underline">
              {t("requestNewLink")}
            </Link>
          </p>
        </Card>
      ) : (
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="block text-sm font-medium">
              {t("newPassword")}
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              {t("confirmPassword")}
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </label>
            {error ? (
              <p role="alert" className="text-sm font-medium text-sindoor-700 dark:text-sindoor-300">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary gap-2">
              {busy ? <Spinner /> : null}
              {t("updatePassword")}
            </button>
          </form>
        </Card>
      )}
    </Container>
  );
}
