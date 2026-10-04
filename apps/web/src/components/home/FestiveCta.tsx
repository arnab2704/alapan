"use client";

import { useTranslations } from "next-intl";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";
import { isFestiveWindow } from "./HomeHeroMedia";

/** Extra hero CTA to the Puja hub, shown only in the lead-up to and through Durga Puja. */
export function FestiveCta() {
  const t = useTranslations("nav");
  const today = useToday();
  if (!isFestiveWindow(today)) return null;

  return (
    <Link href="/puja" className="btn btn-gold btn-lg">
      <span aria-hidden="true">🪔</span> {t("puja")}
    </Link>
  );
}
