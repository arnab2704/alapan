import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { NavigationProgress } from "@/components/NavigationProgress";
import { inter, notoSansBengali, notoSerifBengali } from "@/lib/fonts";
import { SITE_URL } from "@/lib/siteUrl";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alapon | আলাপন",
    template: "%s | Alapon"
  },
  description: "Our roots. Always with us. A Bengali-first digital home for culture, play and language."
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${notoSansBengali.variable} ${notoSerifBengali.variable} ${inter.variable}`}
    >
      <body className="font-bengali flex min-h-screen flex-col bg-cream-50 text-ink-900 antialiased dark:bg-ink-900 dark:text-ink-50">
        <NextIntlClientProvider messages={messages}>
          <NavigationProgress />
          <AuthProvider>
            <WelcomeBanner />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
