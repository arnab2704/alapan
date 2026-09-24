import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { QUIZ_LEVEL_COUNT } from "@alapon/game-engine";
import { LevelSets } from "@/components/quiz/LevelSets";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Array.from({ length: QUIZ_LEVEL_COUNT }, (_, i) => ({ locale, level: String(i + 1) }))
  );
}

export const dynamicParams = false;

export default async function QuizLevelPage({
  params: { locale, level }
}: {
  params: { locale: string; level: string };
}) {
  setRequestLocale(locale);
  const levelNumber = Number(level);
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > QUIZ_LEVEL_COUNT) notFound();

  return <LevelSets level={levelNumber} />;
}
