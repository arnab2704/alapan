import { describe, expect, it } from "vitest";
import {
  buildChallengeQuery,
  cleanChallengeName,
  compareToChallenge,
  parseChallenge,
  shareGrid
} from "../src";

const now = new Date(2026, 8, 24, 12);

describe("shareGrid", () => {
  it("renders one square per question", () => {
    expect(shareGrid([true, true, false, true, true])).toBe("🟩🟩🟥🟩🟩");
    expect(shareGrid([])).toBe("");
  });
});

describe("parseChallenge", () => {
  it("accepts a valid link and cleans the name", () => {
    expect(parseChallenge({ d: "2026-09-24", s: "4", n: "  Priya  " }, now)).toEqual({
      date: "2026-09-24",
      score: 4,
      total: 5,
      name: "Priya"
    });
  });

  it("allows tomorrow for timezone slack but not further ahead", () => {
    expect(parseChallenge({ d: "2026-09-25", s: "3" }, now)).not.toBeNull();
    expect(parseChallenge({ d: "2026-09-26", s: "3" }, now)).toBeNull();
  });

  it("rejects malformed, impossible, too-early or out-of-range values", () => {
    expect(parseChallenge({}, now)).toBeNull();
    expect(parseChallenge({ d: "2026-13-01", s: "3" }, now)).toBeNull();
    expect(parseChallenge({ d: "2026-02-30", s: "3" }, now)).toBeNull();
    expect(parseChallenge({ d: "2025-12-31", s: "3" }, now)).toBeNull();
    expect(parseChallenge({ d: "2026-09-24", s: "6" }, now)).toBeNull();
    expect(parseChallenge({ d: "2026-09-24", s: "-1" }, now)).toBeNull();
    expect(parseChallenge({ d: "2026-09-24", s: "abc" }, now)).toBeNull();
  });

  it("treats a missing or empty name as anonymous", () => {
    expect(parseChallenge({ d: "2026-09-24", s: "2" }, now)?.name).toBeNull();
    expect(parseChallenge({ d: "2026-09-24", s: "2", n: "   " }, now)?.name).toBeNull();
  });
});

describe("cleanChallengeName", () => {
  it("strips markup characters and control characters and caps the length", () => {
    expect(cleanChallengeName("<b>Rina</b>")).toBe("bRina/b");
    expect(cleanChallengeName("a\nb")).toBe("ab");
    expect(cleanChallengeName("x".repeat(80))?.length).toBe(24);
  });
});

describe("buildChallengeQuery + compareToChallenge", () => {
  it("round-trips through parseChallenge", () => {
    const query = buildChallengeQuery({ date: "2026-09-24", score: 5, total: 5, name: "রিনা" });
    const params = Object.fromEntries(new URLSearchParams(query));
    expect(parseChallenge(params, now)).toEqual({ date: "2026-09-24", score: 5, total: 5, name: "রিনা" });
  });

  it("compares scores", () => {
    expect(compareToChallenge(5, 4)).toBe("win");
    expect(compareToChallenge(3, 3)).toBe("tie");
    expect(compareToChallenge(1, 4)).toBe("lose");
  });
});
