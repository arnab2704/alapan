"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@alapon/ui";
import { Link, usePathname } from "@/i18n/navigation";
import { UserMenu } from "./auth/UserMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface MenuItem {
  href: string;
  labelKey: string;
  descKey: string;
  icon: string;
}

interface MenuGroup {
  id: "today" | "play" | "community";
  labelKey: string;
  items: MenuItem[];
}

const GROUPS: MenuGroup[] = [
  {
    id: "today",
    labelKey: "groupToday",
    items: [
      { href: "/today", labelKey: "today", descKey: "descToday", icon: "🌅" },
      { href: "/calendar", labelKey: "calendar", descKey: "descCalendar", icon: "📅" },
      { href: "/puja", labelKey: "puja", descKey: "descPuja", icon: "🪔" }
    ]
  },
  {
    id: "play",
    labelKey: "groupPlay",
    items: [
      { href: "/learn", labelKey: "learn", descKey: "descLearn", icon: "📖" },
      { href: "/play/shobdoshakti", labelKey: "shobdoshakti", descKey: "descShobdoshakti", icon: "🔤" },
      { href: "/quiz/daily", labelKey: "dailyQuiz", descKey: "descDailyQuiz", icon: "❓" },
      { href: "/quiz", labelKey: "quiz", descKey: "descQuiz", icon: "🏅" },
      { href: "/leaderboard", labelKey: "leaderboard", descKey: "descLeaderboard", icon: "🏆" }
    ]
  },
  {
    id: "community",
    labelKey: "groupCommunity",
    items: [
      { href: "/theke-adda", labelKey: "adda", descKey: "descAdda", icon: "☕" },
      { href: "/discover", labelKey: "discover", descKey: "descDiscover", icon: "🔎" }
    ]
  }
];

const triggerClass =
  "flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-medium text-ink-800 hover:bg-sindoor-50 hover:text-sindoor-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:text-ink-100 dark:hover:bg-ink-800";

function MenuLinks({ group, onNavigate }: { group: MenuGroup; onNavigate: () => void }) {
  const t = useTranslations("nav");
  return (
    <ul className="grid grid-cols-2 gap-1 lg:grid-cols-4">
      {group.items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-sindoor-50 sm:items-start sm:gap-3 sm:p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:hover:bg-ink-800"
          >
            <span aria-hidden="true" className="text-xl sm:text-2xl">
              {item.icon}
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink-900 dark:text-ink-50">
                {t(item.labelKey)}
              </span>
              <span className="hidden text-xs text-ink-500 sm:block dark:text-ink-300">
                {t(item.descKey)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Site header with grouped dropdown panels on desktop and a stacked panel behind a menu button on mobile. */
export function MegaMenu() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const [openGroup, setOpenGroup] = useState<MenuGroup["id"] | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeAll = useCallback(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    if (!openGroup && !mobileOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) closeAll();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openGroup, mobileOpen, closeAll]);

  const active = GROUPS.find((g) => g.id === openGroup);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-20 border-b border-ink-100 bg-cream-50/95 backdrop-blur dark:border-ink-700 dark:bg-ink-900/95"
    >
      <div
        className="h-1 bg-gradient-to-r from-sindoor-500 via-marigold-400 to-sindoor-500"
        aria-hidden="true"
      />
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="font-bengaliDisplay flex shrink-0 items-baseline gap-2 text-xl font-bold text-alpona-700 dark:text-alpona-300"
        >
          আলাপন{" "}
          <span className="font-latin hidden text-xs font-normal tracking-wide text-ink-400 sm:inline">
            ALAPON
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-expanded={openGroup === group.id}
              aria-controls={`menu-${group.id}`}
              onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setOpenGroup(group.id);
              }}
              className={`${triggerClass} ${openGroup === group.id ? "bg-sindoor-50 text-sindoor-700 dark:bg-ink-800" : ""}`}
            >
              {t(group.labelKey)}
              <span aria-hidden="true" className="text-xs">
                ▾
              </span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <UserMenu variant="dropdown" />
          </div>
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={t("menu")}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-lg hover:bg-sindoor-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 lg:hidden dark:border-ink-600 dark:hover:bg-ink-800"
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {active ? (
        <div
          id={`menu-${active.id}`}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setOpenGroup(null);
          }}
          className="absolute inset-x-0 top-full hidden border-b border-ink-100 bg-cream-50 shadow-lg shadow-ink-900/10 lg:block dark:border-ink-700 dark:bg-ink-900"
        >
          <Container className="py-4">
            <MenuLinks group={active} onNavigate={closeAll} />
          </Container>
        </div>
      ) : null}

      {mobileOpen ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100vh-4.5rem)] overflow-y-auto border-b border-ink-100 bg-cream-50 shadow-lg lg:hidden dark:border-ink-700 dark:bg-ink-900"
        >
          <Container className="flex flex-col gap-4 py-4">
            {GROUPS.map((group) => (
              <section key={group.id} aria-label={t(group.labelKey)}>
                <h2 className="px-3 text-xs font-bold uppercase tracking-wide text-sindoor-600">
                  {t(group.labelKey)}
                </h2>
                <MenuLinks group={group} onNavigate={closeAll} />
              </section>
            ))}
            <div className="flex flex-col gap-3 border-t border-ink-100 pt-3 dark:border-ink-700">
              <UserMenu variant="list" />
              <div className="px-3 sm:hidden">
                <LocaleSwitcher />
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
