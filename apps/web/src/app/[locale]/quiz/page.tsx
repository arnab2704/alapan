import { setRequestLocale } from "next-intl/server";
import { QuizHub } from "@/components/quiz/QuizHub";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("quiz", locale);

export default async function QuizPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <QuizHub />;
}
