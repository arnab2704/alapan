"use client";

import { useTranslations } from "next-intl";
import { Container } from "@alapon/ui";
import { Link, usePathname } from "@/i18n/navigation";
import { UserMenu } from "@/components/auth/UserMenu";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LogoMark } from "@/components/brand/LogoMark";
import { CompactLocaleToggle } from "./CompactLocaleToggle";
import { SearchIcon } from "./NavIcons";
import { NAV_ITEMS, isActive } from "./navConfig";

const iconButton =
  "flex h-11 w-11 items-center justify-center rounded-full text-ink-700 hover:bg-sindoor-50 hover:text-sindoor-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:text-ink-100 dark:hover:bg-ink-800";

/**
 * Site header. Desktop: logo, five direct section links, then language, search and profile.
 * Below `lg` the section links live in the bottom navigation instead (BottomNav).
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-cream-50/95 backdrop-blur dark:border-ink-700 dark:bg-ink-900/95">
      <div
        className="h-1 bg-gradient-to-r from-sindoor-500 via-marigold-400 to-sindoor-500"
        aria-hidden="true"
      />
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="font-bengaliDisplay flex shrink-0 items-baseline gap-2 text-xl font-bold text-alpona-700 dark:text-alpona-300"
        >
          <LogoMark className="h-8 w-8 self-center" />
          <span>আলাপন</span>{" "}
          <span className="font-latin hidden text-xs font-normal tracking-wide text-ink-400 sm:inline">
            ALAPON
          </span>
        </Link>

        <nav aria-label={t("primaryLabel")} className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center rounded-full px-4 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 ${
                  active
                    ? "text-sindoor-700 dark:text-sindoor-300"
                    : "text-ink-800 hover:bg-sindoor-50 hover:text-sindoor-700 dark:text-ink-100 dark:hover:bg-ink-800"
                }`}
              >
                {t(`primary.${item.id}`)}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-sindoor-500"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <div className="sm:hidden">
            <CompactLocaleToggle />
          </div>
          <Link href="/search" aria-label={t("search")} className={iconButton}>
            <SearchIcon />
          </Link>
          <UserMenu variant="dropdown" />
        </div>
      </Container>
    </header>
  );
}
