"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { announceNavigationStart } from "@/lib/navigationProgress";

/** One-tap language switch for narrow screens: shows the language you would switch to. */
export function CompactLocaleToggle() {
  const locale = useLocale() as "bn" | "en";
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "bn" ? "en" : "bn";

  return (
    <button
      type="button"
      onClick={() => {
        announceNavigationStart();
        router.replace(pathname, { locale: next });
      }}
      lang={next}
      aria-label={next === "en" ? "Switch to English" : "বাংলায় দেখুন"}
      className="flex h-11 min-w-11 items-center justify-center rounded-full border border-ink-200 px-2 text-sm font-bold text-ink-700 hover:bg-sindoor-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:text-ink-100 dark:hover:bg-ink-800"
    >
      {next === "en" ? "EN" : "বাং"}
    </button>
  );
}
