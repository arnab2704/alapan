"use client";

import { useState } from "react";
import { track, type AnalyticsProps } from "@/lib/analytics";
import { Spinner } from "@/components/Spinner";

export interface ShareButtonProps {
  label: string;
  copiedLabel: string;
  /** What to share. Built lazily so it can use `window` (origin, current URL). */
  build: () => { text: string; url: string };
  /** Analytics context, e.g. { what: "daily5" }. */
  analytics?: AnalyticsProps;
  variant?: "primary" | "secondary";
}

/** Native share sheet where available, clipboard otherwise. */
export function ShareButton({ label, copiedLabel, build, analytics, variant = "primary" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function share() {
    const { text, url } = build();
    track("share_clicked", analytics);
    setBusy(true);
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to recover.
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-center gap-1">
      <button type="button" onClick={share} disabled={busy} className={`btn btn-${variant}`}>
        {busy ? <Spinner /> : null}
        {label}
      </button>
      <span role="status" className="min-h-4 text-xs text-shapla-700 dark:text-shapla-300">
        {copied ? copiedLabel : ""}
      </span>
    </span>
  );
}
