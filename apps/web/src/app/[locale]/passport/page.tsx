import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PassportPage } from "@/components/passport/PassportPage";

export const metadata: Metadata = { robots: { index: false } };

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <PassportPage />;
}
