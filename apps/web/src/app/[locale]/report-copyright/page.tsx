import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CopyrightReportForm } from "@/components/legal/CopyrightReportForm";

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return { title: locale === "bn" ? "কপিরাইট অভিযোগ" : "Report copyright" };
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <CopyrightReportForm />;
}
