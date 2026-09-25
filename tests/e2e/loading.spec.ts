import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("clicking a link shows a loading indicator straight away and clears it when the page arrives", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.waitForLoadState("networkidle");

  // Make the next page slow to arrive so the indicator is observable.
  await page.route(/\/bn\/learn(\?|$)/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.locator("main").getByRole("link", { name: "শেখা শুরু করুন" }).click();

  await expect(page.getByText("পাতা লোড হচ্ছে")).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/is-navigating/);

  await expect(page).toHaveURL(/\/bn\/learn$/);
  await expect(page.getByText("পাতা লোড হচ্ছে")).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator("html")).not.toHaveClass(/is-navigating/);
});

test("switching language also shows the indicator", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.waitForLoadState("networkidle");
  await page.route(/\/en(\?|$)/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await route.continue();
  });
  await page.getByRole("button", { name: "English" }).click();
  await expect(page.getByText("পাতা লোড হচ্ছে")).toBeVisible();
  await expect(page).toHaveURL(/\/en$/);
});

test("clicking a link to the page you are already on does not start the indicator", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz");
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "আজকের কুইজ খেলুন" }).first().waitFor();
  await page
    .locator("header")
    .getByRole("link", { name: /^আলাপন/ })
    .click();
  await expect(page).toHaveURL(/\/bn$/);
  await expect(page.getByText("পাতা লোড হচ্ছে")).toHaveCount(0, { timeout: 5000 });
});
