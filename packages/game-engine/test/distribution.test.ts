import { describe, expect, it } from "vitest";
import { buildDistributionFromWords } from "../src/distribution";

describe("buildDistributionFromWords", () => {
  it("gives more common tokens a higher tile count and fewer points than rare ones", () => {
    // "ক" appears in every word; "ক্ষ" appears once.
    const words = ["কলা", "কলম", "কথা", "ক্ষমা"];
    const dist = buildDistributionFromWords(words, { totalTiles: 100 });

    const ka = dist.find((d) => d.token === "ক");
    const ksha = dist.find((d) => d.token === "ক্ষ");

    expect(ka).toBeDefined();
    expect(ksha).toBeDefined();
    expect(ka!.count).toBeGreaterThan(ksha!.count);
    expect(ka!.points).toBeLessThan(ksha!.points);
  });

  it("returns an empty distribution for an empty word list", () => {
    expect(buildDistributionFromWords([])).toEqual([]);
  });
});
