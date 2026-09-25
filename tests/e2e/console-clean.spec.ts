import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

/**
 * A page that logs errors or hydration warnings can silently fall back to client rendering, so the main
 * pages are visited and must stay quiet. (Network errors from optional services are ignored.)
 */
const PAGES = [
  "/bn",
  "/bn/today",
  "/bn/play",
  "/bn/play/shobdoshakti",
  `/bn/word/${encodeURIComponent("নদী")}`,
  `/bn/word/${encodeURIComponent("তভ")}`,
  "/bn/learn",
  "/bn/theke-adda",
  "/bn/search",
  "/en",
  "/en/today"
];

for (const path of PAGES) {
  test(`no console errors on ${decodeURIComponent(path)}`, async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !/Failed to load resource|net::ERR|supabase/i.test(text))
        problems.push(text.slice(0, 200));
    });
    page.on("pageerror", (error) => problems.push(error.message.slice(0, 200)));
    await gotoWithoutWelcomeBanner(page, path);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    expect(problems).toEqual([]);
  });
}
