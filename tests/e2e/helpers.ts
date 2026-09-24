import type { Page } from "@playwright/test";

/**
 * Navigates to a page with the site-wide welcome banner pre-dismissed (via
 * an init script that runs before any page script), so tests that aren't
 * specifically exercising the banner don't have its full-viewport overlay
 * intercepting clicks on everything else. Mirrors
 * tests/shobdoshakti/helpers.ts's gotoGame pattern.
 */
export async function gotoWithoutWelcomeBanner(page: Page, path: string) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("alapon.welcome-banner-dismissed.v1", "1");
  });
  await page.goto(path);
  await page.locator('html[data-hydrated="true"]').waitFor({ state: "attached" });
}
