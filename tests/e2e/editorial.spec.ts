import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("the homepage editorial strip shows at most three articles that link to their discussion pages, or nothing at all", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  // The section shows a spinner while fetching and disappears if there is nothing to show; wait for that to settle.
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("লোড হচ্ছে...")).toHaveCount(0, { timeout: 20_000 });
  const section = page.getByRole("region", { name: "সম্পাদকীয়" });
  if ((await section.count()) === 0) return; // no editorial posts yet: the section stays hidden

  const cards = section.getByRole("list").getByRole("listitem");
  expect(await cards.count()).toBeLessThanOrEqual(3);
  expect(await cards.count()).toBeGreaterThan(0);
  const href = await cards.first().getByRole("link").getAttribute("href");
  expect(href).toMatch(/^\/bn\/theke-adda\/[0-9a-f-]{36}$/);
  await expect(section.getByRole("link", { name: "সব সম্পাদকীয় পড়ুন" })).toHaveAttribute(
    "href",
    "/bn/theke-adda?category=editorial"
  );
});

test("opening Adda with ?category=editorial preselects the editorial filter when it exists", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/theke-adda?category=editorial");
  const chip = page.getByRole("group", { name: "বিভাগ" }).getByRole("button", { name: "সম্পাদকীয়" });
  if ((await chip.count()) === 0) return; // migration 0004 not applied yet
  await expect(chip).toHaveAttribute("aria-pressed", "true");
});

test("visitors cannot post into the editorial section", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/theke-adda");
  await expect(page.getByRole("combobox", { name: "বিভাগ" })).toHaveCount(0);
});

test("the editorial strip scrolls on a desktop: arrows, dots and mouse drag all move it", async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("লোড হচ্ছে...")).toHaveCount(0, { timeout: 20_000 });
  const section = page.getByRole("region", { name: "সম্পাদকীয়" });
  if ((await section.count()) === 0) return; // no editorial posts yet

  const strip = section.getByRole("list");
  const scrollLeft = () => strip.evaluate((el) => Math.round(el.scrollLeft));
  const overflows = await strip.evaluate((el) => el.scrollWidth > el.clientWidth + 8);
  if (!overflows) return; // a single short article - nothing to scroll

  await expect(section.getByRole("button", { name: "আগের লেখা" })).toBeDisabled();
  await section.getByRole("button", { name: "পরের লেখা" }).click();
  await expect.poll(scrollLeft).toBeGreaterThan(50);
  await expect(section.getByRole("button", { name: "আগের লেখা" })).toBeEnabled();

  await section.getByRole("button", { name: "আগের লেখা" }).click();
  await expect.poll(scrollLeft).toBeLessThan(10);

  // Mouse drag.
  const box = (await strip.boundingBox())!;
  await page.mouse.move(box.x + box.width - 40, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 200, box.y + 100, { steps: 8 });
  await page.mouse.up();
  await expect.poll(scrollLeft).toBeGreaterThan(50);
  // A drag must not open the article it ended on.
  await expect(page).toHaveURL(/\/bn$/);
});
