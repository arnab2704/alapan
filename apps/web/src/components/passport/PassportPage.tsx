"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { PASSPORT_CATEGORIES, PASSPORT_MILESTONES, earnedMilestones } from "@/lib/passport";
import { PassportStamp } from "./PassportStamp";
import { usePassport } from "./usePassport";

/** The Bengal Passport: everything discovered so far, as a growing set of stamps. Local to this device for now. */
export function PassportPage() {
  const t = useTranslations("passport");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const reduce = useReducedMotion();
  const { data, ready, total } = usePassport();

  const stampsEarned = PASSPORT_CATEGORIES.reduce(
    (sum, c) => sum + earnedMilestones(data[c].length).length,
    0
  );
  const stampsPossible = PASSPORT_CATEGORIES.length * PASSPORT_MILESTONES.length;

  return (
    <Container className="max-w-4xl py-8 sm:py-12">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-alpona bg-gradient-to-br from-sindoor-700 via-sindoor-600 to-sindoor-800 p-6 text-cream-50 shadow-lg shadow-sindoor-900/20 sm:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-marigold-300">{t("cover")}</p>
        <h1 className="font-bengaliDisplay mt-2 text-4xl font-extrabold sm:text-5xl">{t("heading")}</h1>
        <p className="mt-2 max-w-xl text-cream-100/90">{t("description")}</p>
        <p className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-marigold-200">
          <span>
            <span className="font-bengaliDisplay text-3xl font-extrabold text-cream-50">
              {ready ? toDigits(total) : "-"}
            </span>{" "}
            {t("discoveries")}
          </span>
          <span>
            <span className="font-bengaliDisplay text-3xl font-extrabold text-cream-50">
              {ready ? toDigits(stampsEarned) : "-"}
            </span>
            /{toDigits(stampsPossible)} {t("stamps")}
          </span>
        </p>
      </motion.header>

      <section aria-labelledby="passport-stamps" className="mt-8">
        <h2 id="passport-stamps" className="eyebrow">
          {t("yourStamps")}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PASSPORT_CATEGORIES.map((category) => (
            <PassportStamp key={category} category={category} count={data[category].length} />
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink-500">{t("localNote")}</p>
      </section>

      <section
        aria-labelledby="passport-how"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="passport-how" className="display text-2xl">
          {t("howHeading")}
        </h2>
        <ul className="reading mt-3 grid gap-2 text-ink-700 dark:text-ink-100 sm:grid-cols-2">
          <li>
            <Link href="/play/shobdoshakti" className="btn btn-text">
              {t("how.words")}
            </Link>
          </li>
          <li>
            <Link href="/today" className="btn btn-text">
              {t("how.people")}
            </Link>
          </li>
          <li>
            <Link href="/puja" className="btn btn-text">
              {t("how.festivals")}
            </Link>
          </li>
          <li>
            <Link href="/learn" className="btn btn-text">
              {t("how.lessons")}
            </Link>
          </li>
        </ul>
      </section>
    </Container>
  );
}
