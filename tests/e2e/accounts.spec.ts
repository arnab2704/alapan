import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("the header offers sign-in and the login page renders a working form", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.getByRole("banner").getByRole("link", { name: "সাইন ইন" }).click();
  await expect(page).toHaveURL(/\/bn\/login$/);
  await expect(page.getByLabel("ইমেইল")).toBeVisible();
  await expect(page.getByRole("button", { name: "সাইন ইন", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "অ্যাকাউন্ট খুলুন" }).click();
  await expect(page.getByRole("heading", { name: "অ্যাকাউন্ট খুলুন" })).toBeVisible();
});

test("wrong credentials show a friendly error, not a crash", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/login");
  await page.getByLabel("ইমেইল").fill("nobody-here@example.invalid");
  await page.getByLabel(/পাসওয়ার্ড/).fill("not-a-real-password");
  await page.getByRole("button", { name: "সাইন ইন", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
});

test("the account page sends signed-out visitors to login", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/account");
  await expect(page).toHaveURL(/\/bn\/login$/);
});

test("the leaderboard loads from the database without errors", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/leaderboard");
  await expect(page.getByRole("heading", { name: "আজকের সেরা" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "সর্বকালের সেরা" })).toBeVisible();
  await expect(page.getByText("লোড হচ্ছে...")).toHaveCount(0);
  await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
});
