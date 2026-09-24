import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("Theke Adda shows the nine sections and asks visitors to sign in before posting", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/theke-adda");
  await expect(page.getByRole("heading", { name: "ঠেকের আড্ডা", level: 2 })).toBeVisible();

  const sections = page.getByRole("group", { name: "বিভাগ" });
  await expect(sections.getByRole("button", { name: "পুজোর আড্ডা" })).toBeVisible();
  const chips = await sections.getByRole("button").count();
  expect([10, 11]).toContain(chips); // "সব" + nine sections, plus Editorial once migration 0004 is applied

  await expect(page.getByText("আড্ডায় অংশ নিতে সাইন ইন করুন।")).toBeVisible();
  await expect(page.getByText("ঘৃণা, হয়রানি, স্প্যাম", { exact: false })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "শিরোনাম" })).toHaveCount(0);
});

test("the feed loads from the database (needs migration 0003)", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/theke-adda");
  await expect(page.getByText("লোড হচ্ছে...")).toHaveCount(0);
  await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
});

test("an unknown discussion shows a friendly not-found message", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/theke-adda/00000000-0000-0000-0000-000000000000");
  await expect(page.getByText("এই আলোচনাটি পাওয়া যায়নি।").or(page.getByRole("alert"))).toBeVisible();
});

test("the moderation queue is closed to non-moderators", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/moderation");
  await expect(page.getByText("শুধু মডারেটররা এই পাতা দেখতে পারেন।")).toBeVisible();
});
