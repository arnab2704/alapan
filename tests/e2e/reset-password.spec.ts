import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("login page offers a forgot-password flow that sends a reset link", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/login");
  const unavailable = page.getByRole("alert").filter({ hasText: /উপলব্ধ|এখন/ });
  if (await unavailable.count()) test.skip(true, "accounts backend not configured");

  await page.getByRole("button", { name: "পাসওয়ার্ড ভুলে গেছেন?" }).click();
  await expect(page.getByRole("heading", { name: "পাসওয়ার্ড ভুলে গেছেন?", level: 2 })).toBeVisible();
  await page.getByLabel("ইমেইল").fill("someone@example.com");
  await page.getByRole("button", { name: "রিসেট লিঙ্ক পাঠান" }).click();
  await expect(page.getByRole("status")).toContainText("যদি এই ইমেইলে");

  await page.getByRole("button", { name: "সাইন ইনে ফিরুন" }).click();
  await expect(page.getByRole("heading", { name: "সাইন ইন", level: 2 })).toBeVisible();
});

test("a reset-password link with no valid session shows a friendly explanation, not a broken form", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/reset-password");
  const unavailable = page.getByRole("alert").filter({ hasText: /উপলব্ধ|এখন/ });
  if (await unavailable.count()) test.skip(true, "accounts backend not configured");

  await expect(page.getByText("মেয়াদোত্তীর্ণ")).toBeVisible();
  await expect(page.getByRole("link", { name: "নতুন রিসেট লিঙ্কের জন্য অনুরোধ করুন" })).toHaveAttribute(
    "href",
    "/bn/login"
  );
});
