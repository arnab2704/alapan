"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { ShareButton } from "@/components/ShareButton";
import { formatGregorianDate, toLocalIsoDate } from "@/lib/formatDate";

export function Daily5ShareButton() {
  const t = useTranslations("daily5");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);

  return (
    <ShareButton
      label={t("share")}
      copiedLabel={t("shareCopied")}
      analytics={{ what: "daily5" }}
      build={() => ({
        text: t("shareText", {
          date: formatGregorianDate(toLocalIsoDate(new Date()), locale, toDigits),
          score: toDigits(5),
          total: toDigits(5)
        }),
        url: `${window.location.origin}/${locale}`
      })}
    />
  );
}
