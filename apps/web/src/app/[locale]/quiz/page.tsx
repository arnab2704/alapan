import { setRequestLocale } from "next-intl/server";
import { QuizHub } from "@/components/quiz/QuizHub";

export default async function QuizPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <QuizHub />;
}
