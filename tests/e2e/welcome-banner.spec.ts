import { expect, test } from "@playwright/test";

test("the welcome banner appears on a first visit, roots the site in Bengali culture, and dismisses permanently", async ({
  page
}) => {
  await page.goto("/bn");

  const dialog = page.getByRole("dialog", { name: "আলাপনে স্বাগতম" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("আমাদের শিকড়, সবসময় আমাদের সাথে")).toBeVisible();
  await expect(dialog.getByText("ভাষা ও সাহিত্য", { exact: true })).toBeVisible();
  await expect(dialog.getByText("উৎসব", { exact: true })).toBeVisible();
  await expect(dialog.getByText("সংস্কৃতি", { exact: true })).toBeVisible();
  await expect(dialog.getByText("আড্ডা", { exact: true })).toBeVisible();

  await dialog.getByRole("button", { name: "শুরু করি" }).click();
  await expect(dialog).toHaveCount(0);

  // Dismissal persists across a reload and across navigation.
  await page.reload();
  await expect(page.getByRole("dialog", { name: "আলাপনে স্বাগতম" })).toHaveCount(0);

  await page.goto("/bn/calendar");
  await expect(page.getByRole("dialog", { name: "আলাপনে স্বাগতম" })).toHaveCount(0);
});

test("Escape closes the welcome banner and it stays dismissed", async ({ page }) => {
  await page.goto("/bn");
  const dialog = page.getByRole("dialog", { name: "আলাপনে স্বাগতম" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("dialog", { name: "আলাপনে স্বাগতম" })).toHaveCount(0);
});

test("the welcome banner translates to English", async ({ page }) => {
  await page.goto("/en");
  const dialog = page.getByRole("dialog", { name: "Welcome to Alapon" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Our roots. Always with us.")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Let's begin" })).toBeVisible();
});

test("the banner greets every new browsing session, not just the very first visit ever", async ({
  browser
}) => {
  for (let visit = 0; visit < 2; visit++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/bn");
    await expect(page.getByRole("dialog", { name: "আলাপনে স্বাগতম" })).toBeVisible();
    await context.close();
  }
});
