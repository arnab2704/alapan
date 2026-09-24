"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, Container } from "@alapon/ui";
import { useAuth } from "@/components/auth/AuthProvider";
import { Spinner } from "@/components/Spinner";
import { Link } from "@/i18n/navigation";
import { fetchLatestEditorial, type PostRow } from "@/lib/supabase/adda";

const arrowClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-cream-50 text-lg text-ink-700 hover:bg-sindoor-50 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-100";

function excerpt(body: string, max = 160) {
  const clean = body.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

/** The three newest editorials in a swipeable strip. Renders nothing when there are none or accounts/database are unavailable. */
export function HomeEditorial() {
  const t = useTranslations("editorial");
  const locale = useLocale();
  const { enabled } = useAuth();
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const scroller = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ canPrev: false, canNext: false });
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, startScroll: 0, moved: false, down: false });

  useEffect(() => {
    if (!enabled) return;
    fetchLatestEditorial(3).then(({ data, error }) => {
      if (error) setFailed(true);
      else setPosts(data);
    });
  }, [enabled]);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    });
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const count = el.children.length;
    setActive(atEnd ? count - 1 : Math.min(count - 1, Math.round(el.scrollLeft / step)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, posts]);

  function scrollToCard(index: number) {
    const card = scroller.current?.children[index] as HTMLElement | undefined;
    // "nearest" on the block axis keeps the page itself from jumping vertically.
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  // Mouse users get no touch swipe and the scrollbar is hidden, so let them drag the strip.
  function onPointerDown(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0 || !scroller.current) return;
    drag.current = {
      startX: event.clientX,
      startScroll: scroller.current.scrollLeft,
      moved: false,
      down: true
    };
  }
  function onPointerMove(event: React.PointerEvent<HTMLUListElement>) {
    const d = drag.current;
    if (!d.down || !scroller.current) return;
    const dx = event.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) scroller.current.scrollLeft = d.startScroll - dx;
  }
  function endDrag() {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved) {
      setDragging(false);
      // Let the click that ends a drag pass by, then settle on the nearest card.
      window.setTimeout(() => {
        d.moved = false;
        const el = scroller.current;
        if (!el) return;
        const card = el.querySelector("li");
        const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth;
        scrollToCard(Math.min(el.children.length - 1, Math.round(el.scrollLeft / step)));
      }, 0);
    }
  }

  function scrollByCard(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (!enabled || failed || (posts !== null && posts.length === 0)) return null;

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

  return (
    <section
      aria-labelledby="home-editorial-heading"
      className="border-b border-ink-100 py-10 dark:border-ink-700 sm:py-12"
    >
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <Badge tone="gold">{t("eyebrow")}</Badge>
            <h2
              id="home-editorial-heading"
              className="font-bengaliDisplay mt-2 text-2xl font-extrabold text-ink-900 dark:text-ink-50 sm:text-3xl"
            >
              {t("heading")}
            </h2>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("description")}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!edges.canPrev}
              aria-label={t("previous")}
              className={arrowClass}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!edges.canNext}
              aria-label={t("next")}
              className={arrowClass}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {posts === null ? (
          <p role="status" className="flex items-center gap-2 text-ink-500">
            <Spinner className="text-sindoor-500" />
            {t("loading")}
          </p>
        ) : (
          <ul
            ref={scroller}
            onScroll={measure}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(event) => {
              if (drag.current.moved) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            onDragStart={(event) => event.preventDefault()}
            aria-label={t("heading")}
            className={`-mx-4 flex gap-4 overflow-x-auto scroll-pl-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              dragging
                ? "cursor-grabbing select-none snap-none"
                : "cursor-grab snap-x snap-mandatory scroll-smooth"
            }`}
          >
            {posts.map((post) => (
              <li key={post.id} className="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[44%]">
                <Link
                  href={`/theke-adda/${post.id}`}
                  className="group flex h-full flex-col rounded-alpona border border-ink-100 border-t-4 border-t-marigold-400 bg-cream-100 p-5 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-700 dark:bg-ink-800"
                >
                  <h3 className="font-bengaliDisplay text-lg font-bold text-ink-900 group-hover:text-sindoor-700 dark:text-ink-50">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink-600 dark:text-ink-200">{excerpt(post.body)}</p>
                  <p className="mt-4 flex items-center justify-between text-xs text-ink-500">
                    <span>
                      {post.author_display_name} · {date(post.created_at)}
                    </span>
                    <span className="font-semibold text-sindoor-600">{t("read")} →</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {posts !== null && posts.length > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label={t("heading")}>
            {posts.map((post, i) => (
              <button
                key={post.id}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-label={t("goTo", { n: i + 1 })}
                aria-current={active === i}
                className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    active === i ? "w-6 bg-sindoor-500" : "w-2.5 bg-ink-300 dark:bg-ink-600"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-2 text-right">
          <Link
            href="/theke-adda?category=editorial"
            className="text-sm font-semibold text-sindoor-600 underline decoration-dotted hover:text-sindoor-700"
          >
            {t("viewAll")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
