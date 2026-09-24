"use client";

import { Spinner } from "@/components/Spinner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fileReport, type ReportReason, type ReportTarget } from "@/lib/supabase/adda";
import { fieldClass, ghostButton, primaryButton, useAddaError, useParticipation } from "./addaUi";

const REASONS: ReportReason[] = ["spam", "abuse", "hate", "unsafe", "copyright", "other"];

export function ReportButton({ targetType, targetId }: { targetType: ReportTarget; targetId: string }) {
  const t = useTranslations("adda");
  const errorText = useAddaError();
  const { userId, signedIn } = useParticipation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  if (!signedIn) {
    return (
      <Link href="/login" className={ghostButton}>
        {t("reportSignIn")}
      </Link>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    setBusy(true);
    const { error } = await fileReport({ userId, targetType, targetId, reason, description });
    setBusy(false);
    if (error) setMessage({ ok: false, text: errorText(error) });
    else {
      setMessage({ ok: true, text: t("reportThanks") });
      setOpen(false);
    }
  }

  return (
    <div className="inline-block">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={ghostButton}>
        {t("report")}
      </button>
      {message ? (
        <span role={message.ok ? "status" : "alert"} className="ml-2 text-xs text-ink-500">
          {message.text}
        </span>
      ) : null}
      {open ? (
        <form
          onSubmit={submit}
          className="mt-2 flex max-w-sm flex-col gap-2 rounded-lg border border-ink-200 p-3 dark:border-ink-600"
        >
          <label className="text-sm font-medium">
            {t("reportReason")}
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className={fieldClass}
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {t(`reasons.${r}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            {t("reportDetails")}
            <textarea
              maxLength={1000}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={fieldClass}
            />
          </label>
          <button type="submit" disabled={busy} aria-busy={busy} className={`${primaryButton} gap-2`}>
            {busy ? <Spinner /> : null}
            {t("reportSubmit")}
          </button>
        </form>
      ) : null}
    </div>
  );
}
