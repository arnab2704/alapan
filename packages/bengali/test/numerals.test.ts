import { describe, expect, it } from "vitest";
import { toBengaliDigits } from "../src/numerals";

describe("toBengaliDigits", () => {
  it("converts ASCII digits to Bengali numerals", () => {
    expect(toBengaliDigits(8)).toBe("৮");
    expect(toBengaliDigits(127)).toBe("১২৭");
  });

  it("leaves non-digit characters untouched", () => {
    expect(toBengaliDigits("127/1000")).toBe("১২৭/১০০০");
    expect(toBengaliDigits("রো ৮, কল ৮")).toBe("রো ৮, কল ৮");
  });
});
