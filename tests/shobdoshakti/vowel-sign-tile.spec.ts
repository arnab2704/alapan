import { expect, test } from "@playwright/test";
import { gotoGame, letterPalette } from "./helpers";

/**
 * Regression test for a rendering bug: dependent vowel signs were displayed as the literal
 * string "◌" (U+25CC dotted circle) + the mark. U+25CC isn't in the Bengali Unicode block, so the
 * Bengali web font has no glyph for it; the browser pulled it from an unrelated fallback font,
 * which breaks cross-font mark shaping and can render as a garbled, unrelated glyph (reported as
 * looking like a Latin "f" with a floating ring). The fix draws the dotted-circle placeholder in
 * CSS and renders only the raw mark character in the Bengali font - see WordJaalTile.tsx.
 *
 * Level 1, combination index 2 (shobdojaal-levels.json) contains a vowel-sign letter; Skip
 * advances the combination index sequentially from a fresh (no saved progress) start at index 0.
 */
test("a dependent vowel sign tile shows only the mark, with no dotted-circle character in its text or accessible name", async ({
  page
}) => {
  await gotoGame(page);
  const skip = page.getByRole("button", { name: "এড়িয়ে যান" });
  await skip.click();
  await skip.click();

  const palette = letterPalette(page);
  const tiles = palette.getByRole("button");
  const count = await tiles.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const tile = tiles.nth(i);
    const text = (await tile.textContent())?.trim() ?? "";
    const label = (await tile.getAttribute("aria-label")) ?? "";
    expect(text, `tile text "${text}" must not contain U+25CC`).not.toContain("◌");
    expect(label, `tile label "${label}" must not contain U+25CC`).not.toContain("◌");
  }

  const vowelSignTile = tiles.filter({ hasText: "ি" });
  if (await vowelSignTile.count()) {
    await expect(vowelSignTile.first()).toHaveAttribute("aria-label", "অক্ষর ি");
    // The CSS-drawn placeholder circle sits behind the mark as a decorative sibling element.
    await expect(vowelSignTile.first().locator("span.rounded-full")).toBeAttached();
  }
});
