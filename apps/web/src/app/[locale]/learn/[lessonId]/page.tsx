import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllLearnLessons, getLearnLesson } from "@alapon/game-engine";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllLearnLessons().map(({ lesson }) => ({ locale, lessonId: lesson.id }))
  );
}

export const dynamicParams = false;

export default async function LessonPage({
  params: { locale, lessonId }
}: {
  params: { locale: string; lessonId: string };
}) {
  setRequestLocale(locale);
  if (!getLearnLesson(lessonId)) notFound();

  return <LessonPlayer lessonId={lessonId} />;
}
