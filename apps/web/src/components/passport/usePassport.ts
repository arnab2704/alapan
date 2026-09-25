"use client";

import { useEffect, useState } from "react";
import { PASSPORT_EVENT, emptyPassport, readPassport } from "@/lib/passport";
import type { PassportData } from "@/lib/passport";

/** The reader's Bengal Passport, live: updates whenever anything is discovered anywhere on the site. */
export function usePassport() {
  const [data, setData] = useState<PassportData>(emptyPassport);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setData(readPassport());
    sync();
    setReady(true);
    window.addEventListener(PASSPORT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PASSPORT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const total = Object.values(data).reduce((sum, list) => sum + list.length, 0);
  return { data, ready, total };
}
