"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";

export interface FoundWordsListProps {
  canForm: string[];
  foundWords: string[];
}

export function FoundWordsList({ canForm, foundWords }: FoundWordsListProps) {
  const t = useTranslations("shobdoshakti.wordJaal");

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-600">
        {t("wordsFound")} ({toBengaliDigits(foundWords.length)}/{toBengaliDigits(canForm.length)})
      </p>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label={t("wordsFound")}>
        {canForm.map((word) => {
          const found = foundWords.includes(word);
          return (
            <li key={word} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={found ? "text-shapla-600" : "text-ink-300"}>
                {found ? "✓" : "•"}
              </span>
              <span
                className={
                  found
                    ? "font-bengali text-lg font-semibold text-ink-900"
                    : "font-bengali text-lg text-ink-300 blur-[2px] select-none"
                }
                aria-label={found ? word : t("hiddenWord")}
              >
                {found ? word : "শব্দ"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
