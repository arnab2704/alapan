import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DiscoverHub } from "@/components/discover/DiscoverHub";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "discover" });
  return { title: t("heading"), description: t("description") };
}

export default async function DiscoverPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <DiscoverHub />;
}
