"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NavIcon } from "./NavIcons";
import { NAV_ITEMS, isActive, isImmersive } from "./navConfig";

/** Thumb-reach navigation for phones and tablets. Hidden on immersive screens (games, lessons, quiz play). */
export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;

  return (
    <nav
      aria-label={t("primaryLabel")}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-cream-50/95 backdrop-blur dark:border-ink-700 dark:bg-ink-900/95 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sindoor-500 ${
                  active ? "text-sindoor-600 dark:text-sindoor-300" : "text-ink-600 dark:text-ink-200"
                }`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-sindoor-50 dark:bg-ink-800" : ""
                  }`}
                >
                  <NavIcon id={item.id} />
                </span>
                {t(`primary.${item.id}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
