import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legalContent";

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  const doc = LEGAL["terms"][locale === "bn" ? "bn" : "en"];
  return { title: doc.title, description: doc.summary };
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <LegalPage docKey="terms" locale={locale} />;
}
