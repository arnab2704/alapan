"use client";

import { Spinner } from "@/components/Spinner";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { useRouter } from "@/i18n/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

type Mode = "signin" | "signup";

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50";
const primaryClass = "btn btn-primary";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user, enabled, ready } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const redirectTo = `${window.location.origin}${window.location.pathname.replace(/\/login$/, "/account")}`;
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo }
      });
      if (err) setError(err.message);
      else if (!data.session) setNotice(t("checkEmail"));
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(t("badCredentials"));
    }
    setBusy(false);
  }

  async function magicLink() {
    const supabase = getSupabase();
    if (!supabase || !email) {
      setError(t("emailRequired"));
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname.replace(/\/login$/, "/account")}`
      }
    });
    if (err) setError(err.message);
    else setNotice(t("checkEmail"));
    setBusy(false);
  }

  return (
    <Container className="max-w-md py-10 sm:py-14">
      <SectionHeading
        title={mode === "signin" ? t("signInTitle") : t("signUpTitle")}
        description={t("description")}
      />
      {!enabled && ready ? (
        <Card>
          <p role="alert">{t("unavailable")}</p>
        </Card>
      ) : (
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="block text-sm font-medium">
              {t("email")}
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              {t("password")}
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            {error ? (
              <p role="alert" className="text-sm font-medium text-sindoor-700 dark:text-sindoor-300">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p role="status" className="text-sm font-medium text-shapla-700 dark:text-shapla-300">
                {notice}
              </p>
            ) : null}
            <button type="submit" disabled={busy} aria-busy={busy} className={`${primaryClass} gap-2`}>
              {busy ? <Spinner /> : null}
              {mode === "signin" ? t("signIn") : t("signUp")}
            </button>
            <button
              type="button"
              onClick={magicLink}
              disabled={busy}
              className="min-h-11 text-sm font-semibold text-sindoor-600 underline decoration-dotted"
            >
              {t("magicLink")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-ink-600 dark:text-ink-200">
            {mode === "signin" ? t("noAccount") : t("haveAccount")}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
              }}
              className="font-semibold text-sindoor-600 underline"
            >
              {mode === "signin" ? t("signUp") : t("signIn")}
            </button>
          </p>
          <p className="mt-3 text-xs text-ink-400">{t("privacyNote")}</p>
        </Card>
      )}
    </Container>
  );
}
