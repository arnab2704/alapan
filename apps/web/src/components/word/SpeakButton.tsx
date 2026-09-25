"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Reads a Bengali word aloud with the browser's speech synthesis; hidden where unsupported. */
export function SpeakButton({ word }: { word: string }) {
  const t = useTranslations("wordDna");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "bn-BD";
        window.speechSynthesis.speak(utterance);
      }}
      aria-label={t("listen")}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-sindoor-500 text-white hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-500"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 9v6h4l5 4V5L8 9ZM16 8c2 2 2 6 0 8M19 5c4 4 4 10 0 14" />
      </svg>
    </button>
  );
}
