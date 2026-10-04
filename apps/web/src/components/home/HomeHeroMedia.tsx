"use client";

import Image from "next/image";
import { getFestivalBySlug } from "@alapon/bengali";
import { useToday } from "@/components/calendar/useToday";
import { toLocalIsoDate } from "@/lib/formatDate";

const PUJA_SLUG = "durga-puja-2026";
/** How many days before Mahalaya the festive hero starts showing. */
const LEAD_DAYS = 20;

/** True from LEAD_DAYS before Mahalaya through the last day of Durga Puja. Exported for the festive CTA. */
export function isFestiveWindow(today: Date | null): boolean {
  if (!today) return false;
  const festival = getFestivalBySlug(PUJA_SLUG);
  if (!festival) return false;
  const iso = toLocalIsoDate(today);
  const start = new Date(`${festival.date}T00:00:00`);
  start.setDate(start.getDate() - LEAD_DAYS);
  return iso >= toLocalIsoDate(start) && iso <= (festival.endDate ?? festival.date);
}

/**
 * Homepage hero artwork: the Durga Puja scene during the lead-up to and through Sharodiya 1433
 * (see LEAD_DAYS/festival end above), the everyday river scene the rest of the year. "Today" is
 * resolved client-side, so the first render (and non-JS/SSR) falls back to the everyday scene.
 */
export function HomeHeroMedia() {
  const today = useToday();
  const festive = isFestiveWindow(today);
  const desktopSrc = festive ? "/images/hero-puja.webp" : "/images/homepage-banner.webp";

  return (
    <>
      <Image
        key={desktopSrc}
        src={desktopSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`hidden object-cover md:block ${festive ? "object-top" : "object-[75%_center]"}`}
      />
      {festive ? (
        <Image
          src="/images/hero-puja.webp"
          alt=""
          width={1024}
          height={400}
          priority
          sizes="100vw"
          className="mb-6 w-full rounded-alpona object-cover md:hidden"
        />
      ) : (
        <Image
          src="/images/hero-mobile.webp"
          alt=""
          width={900}
          height={1200}
          priority
          sizes="100vw"
          className="mb-6 w-full rounded-alpona object-cover md:hidden"
        />
      )}
    </>
  );
}
