"use client";

import { useEffect, useState } from "react";

/**
 * Today's date, computed client-side on mount rather than baked into the
 * server-rendered/statically-generated HTML. The homepage and /calendar
 * are otherwise static pages - if a Server Component computed `new Date()`
 * directly, Next would freeze it at build time and "today's Bengali date"
 * would silently go stale until the next deploy. Returns null until
 * mounted so callers can render a stable skeleton for the SSR pass.
 */
export function useToday(): Date | null {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  return today;
}
