"use client";

import { useEffect } from "react";

export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console and any error tracker attached via window.onerror.
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="display text-3xl">কিছু একটা ভুল হয়েছে</h1>
      <p className="mt-2 text-ink-600">Something went wrong. Please try again.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-6">
        আবার চেষ্টা করুন / Try again
      </button>
    </div>
  );
}
