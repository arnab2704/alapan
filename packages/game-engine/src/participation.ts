function dayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

/**
 * Consecutive completed days ending today, or ending yesterday when today is not done yet
 * (so a fresh morning does not read as a broken run). Purely informational - never a penalty.
 */
export function participationStreak(completedDays: string[], todayIso: string): number {
  const days = new Set(completedDays.map(dayNumber));
  let cursor = dayNumber(todayIso);
  if (!days.has(cursor)) cursor -= 1;
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor -= 1;
  }
  return count;
}
