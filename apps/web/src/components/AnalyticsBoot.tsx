"use client";

import { useEffect } from "react";
import { registerAnalyticsProvider } from "@/lib/analytics";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com").replace(/\/$/, "");

function anonymousId(): string {
  try {
    let id = sessionStorage.getItem("alapon.anon");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("alapon.anon", id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

/** Sends product events to PostHog when NEXT_PUBLIC_POSTHOG_KEY is set. Session-scoped anonymous id, no personal data. */
export function AnalyticsBoot() {
  useEffect(() => {
    if (!KEY) return;
    registerAnalyticsProvider({
      name: "posthog",
      track(event, props) {
        void fetch(`${HOST}/capture/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({ api_key: KEY, event, distinct_id: anonymousId(), properties: props })
        }).catch(() => undefined);
      }
    });
  }, []);
  return null;
}
