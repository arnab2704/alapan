import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { QUIZ_LEVEL_COUNT, QUIZ_SETS_PER_LEVEL, isValidQuizSet } from "@alapon/game-engine";
import { SetPlayer } from "@/components/quiz/SetPlayer";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Array.from({ length: QUIZ_LEVEL_COUNT }, (_, l) =>
      Array.from({ length: QUIZ_SETS_PER_LEVEL }, (_, s) => ({
        locale,
        level: String(l + 1),
        set: String(s + 1)
      }))
    ).flat()
  );
}

export const dynamicParams = false;

export default async function QuizSetPage({
  params: { locale, level, set }
}: {
  params: { locale: string; level: string; set: string };
}) {
  setRequestLocale(locale);
  const levelNumber = Number(level);
  const setNumber = Number(set);
  if (!isValidQuizSet(levelNumber, setNumber)) notFound();

  return <SetPlayer level={levelNumber} set={setNumber} />;
}
