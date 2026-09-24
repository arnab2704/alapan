import { setRequestLocale } from "next-intl/server";
import { QuizPageContent } from "@/components/quiz/QuizPageContent";

export default async function DailyQuizPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <QuizPageContent />;
}
