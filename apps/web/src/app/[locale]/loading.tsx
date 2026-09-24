"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";

/** Shown while a page that renders on demand is still being prepared. */
export default function Loading() {
  const t = useTranslations("common");
  return (
    <div
      role="status"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-ink-600 dark:text-ink-200"
    >
      <Spinner className="h-8 w-8 border-[3px] text-sindoor-500" />
      <p className="text-sm font-medium">{t("loading")}</p>
    </div>
  );
}
