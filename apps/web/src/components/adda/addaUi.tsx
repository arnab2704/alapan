"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import type { AddaError } from "@/lib/supabase/adda";

export const primaryButton = "btn btn-primary";
export const ghostButton =
  "inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-400 dark:text-ink-200 dark:hover:bg-ink-700";
export const fieldClass =
  "mt-1 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 py-2 text-base text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50";

/** Adults who are signed in may post, comment and react; anyone signed in may report. */
export function useParticipation() {
  const { user, profile, ready } = useAuth();
  return {
    ready,
    userId: user?.id ?? null,
    signedIn: Boolean(user),
    canParticipate: Boolean(user && profile?.is_adult),
    isModerator: profile?.role === "moderator" || profile?.role === "admin"
  };
}

export function useAddaError() {
  const t = useTranslations("adda.errors");
  return useCallback((code: AddaError) => t(code), [t]);
}

export function useFormatDate() {
  const locale = useLocale();
  return (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
}
