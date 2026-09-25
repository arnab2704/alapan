"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { DAILY5_EVENT, DAILY5_ITEMS, markDaily5Item, readDaily5, todayIso } from "@/lib/daily5";
import type { Daily5Item } from "@/lib/daily5";

/** Today's Daily 5 progress, shared live between every component on the page. */
export function useDaily5() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<Daily5Item[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDaily5(todayIso()).done);
    sync();
    setReady(true);
    window.addEventListener(DAILY5_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DAILY5_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const mark = useCallback((item: Daily5Item) => {
    const before = readDaily5(todayIso()).done;
    if (before.includes(item)) return;
    if (before.length === 0) track("daily5_started");
    const { state, completedNow } = markDaily5Item(item);
    track("daily5_item_completed", { item, count: state.done.length });
    if (completedNow) track("daily5_completed");
  }, []);

  return {
    ready,
    done,
    count: done.length,
    total: DAILY5_ITEMS.length,
    complete: done.length === DAILY5_ITEMS.length,
    isDone: (item: Daily5Item) => done.includes(item),
    mark
  };
}
