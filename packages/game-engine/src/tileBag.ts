import type { LetterDistribution, Tile } from "./types";

let counter = 0;
function nextId(): string {
  counter += 1;
  return `tile_${counter}_${Date.now().toString(36)}`;
}

export function createTileBag(distribution: LetterDistribution[], rng: () => number = Math.random): Tile[] {
  const bag: Tile[] = [];
  for (const entry of distribution) {
    for (let i = 0; i < entry.count; i++) {
      bag.push({ id: nextId(), token: entry.token, points: entry.points });
    }
  }
  return shuffle(bag, rng);
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function drawTiles(bag: Tile[], count: number): { drawn: Tile[]; remaining: Tile[] } {
  const drawn = bag.slice(0, count);
  const remaining = bag.slice(count);
  return { drawn, remaining };
}
