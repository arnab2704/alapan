"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NAVIGATION_START_EVENT } from "@/lib/navigationProgress";

const MAX_WAIT_MS = 12_000;

function isPlainLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/**
 * A thin progress bar across the top of the page that starts the moment someone
 * clicks an in-app link (or a navigation is announced) and finishes when the new
 * page arrives. The App Router exposes no navigation events, so it listens for
 * link clicks and watches the pathname change. Also sets a busy cursor and tells
 * screen readers that a page is loading.
 */
export function NavigationProgress() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const giveUp = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPath = useRef(pathname);

  const clearTimers = useCallback(() => {
    if (trickle.current) clearInterval(trickle.current);
    if (giveUp.current) clearTimeout(giveUp.current);
    if (hide.current) clearTimeout(hide.current);
    trickle.current = giveUp.current = hide.current = null;
  }, []);

  const finish = useCallback(() => {
    if (trickle.current) clearInterval(trickle.current);
    if (giveUp.current) clearTimeout(giveUp.current);
    setProgress(100);
    hide.current = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 250);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setActive(true);
    setProgress(8);
    trickle.current = setInterval(() => {
      // Ease towards 90% so the bar always seems to be moving but never claims to be done.
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.12 : p));
    }, 200);
    giveUp.current = setTimeout(finish, MAX_WAIT_MS);
  }, [clearTimers, finish]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank" || anchor.hasAttribute("download"))
        return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    }
    window.addEventListener("click", onClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, start);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, start);
      clearTimers();
    };
  }, [start, clearTimers]);

  useEffect(() => {
    if (pathname !== lastPath.current) {
      lastPath.current = pathname;
      finish();
    }
  }, [pathname, finish]);

  // A marker that the page's scripts are running, so automated tests never click before the handlers exist.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-navigating", active);
  }, [active]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1"
        style={{ opacity: active ? 1 : 0, transition: "opacity 200ms ease" }}
      >
        <div
          className="h-full bg-gradient-to-r from-sindoor-500 via-marigold-400 to-sindoor-500 shadow-[0_0_8px_rgba(191,47,58,0.6)]"
          style={{ width: `${progress}%`, transition: progress === 0 ? "none" : "width 200ms ease-out" }}
        />
      </div>
      <span aria-live="polite" className="sr-only">
        {active ? t("pageLoading") : ""}
      </span>
    </>
  );
}
