const WELCOME_BANNER_KEY = "alapon.welcome-banner-dismissed.v1";

/**
 * The banner is dismissed for the current browsing session only
 * (sessionStorage), so it greets every new visit rather than vanishing
 * forever after the first dismissal.
 */
export function hasSeenWelcomeBanner(): boolean {
  try {
    return window.sessionStorage.getItem(WELCOME_BANNER_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeBannerSeen(): void {
  try {
    window.sessionStorage.setItem(WELCOME_BANNER_KEY, "1");
  } catch {
    // Storage disabled - the banner will simply show again on the next page load.
  }
}
