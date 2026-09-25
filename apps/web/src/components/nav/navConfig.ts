export type NavId = "today" | "play" | "learn" | "discover" | "adda";

export interface NavItem {
  id: NavId;
  href: string;
  /** Path prefixes (after the locale) that count as "inside" this section, for the active state. */
  match: string[];
}

/** The five primary destinations. Everything else is reached from these sections and the footer. */
export const NAV_ITEMS: NavItem[] = [
  { id: "today", href: "/today", match: ["/today", "/calendar", "/puja", "/festival"] },
  { id: "play", href: "/play", match: ["/play", "/quiz", "/leaderboard"] },
  { id: "learn", href: "/learn", match: ["/learn"] },
  { id: "discover", href: "/discover", match: ["/discover", "/word", "/search"] },
  { id: "adda", href: "/theke-adda", match: ["/theke-adda", "/moderation"] }
];

export function isActive(item: NavItem, pathname: string): boolean {
  return item.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Screens where the bottom navigation is hidden so it never competes with game or lesson
 * controls: the game boards, lesson players and quiz play screens.
 */
const IMMERSIVE = [
  /^\/play\/shobdoshakti\/(daily|free|levels)(\/|$)/,
  /^\/learn\/(?!alphabet(\/|$))[^/]+/,
  /^\/quiz\/daily(\/|$)/,
  /^\/quiz\/challenge(\/|$)/,
  /^\/quiz\/level\/[^/]+\/[^/]+/
];

export function isImmersive(pathname: string): boolean {
  return IMMERSIVE.some((pattern) => pattern.test(pathname));
}
