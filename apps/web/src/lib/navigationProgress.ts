export const NAVIGATION_START_EVENT = "alapon:navigation-start";

/** Tells the top progress bar a navigation began that was not started by clicking a link (e.g. a language switch or a redirect after sign-in). */
export function announceNavigationStart(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
}
