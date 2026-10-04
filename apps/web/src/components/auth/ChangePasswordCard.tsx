"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";
import { Card } from "@alapon/ui";
import { getSupabase } from "@/lib/supabase/client";

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50";

/** Lets a signed-in user set a new password directly, without the email-link reset flow. */
export function ChangePasswordCard() {
  const t = useTranslations("auth");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    if (password !== confirm) {
      setMessage({ kind: "error", text: t("passwordsDontMatch") });
      return;
    }
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage({ kind: "error", text: error.message });
    } else {
      setMessage({ kind: "ok", text: t("passwordUpdated") });
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <Card className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between text-left"
      >
        <h2 className="display text-xl">{t("changePassword")}</h2>
        <span aria-hidden="true" className="text-ink-400">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
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
            className="btn btn-secondary self-start gap-2"
          >
            {busy ? <Spinner /> : null}
            {t("updatePassword")}
          </button>
        </form>
      ) : null}
    </Card>
  );
}
