import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { BottomNav } from "@/components/nav/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AnalyticsBoot } from "@/components/AnalyticsBoot";
import { PwaRegister } from "@/components/PwaRegister";
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
  description: "Our roots. Always with us. A Bengali-first digital home for culture, play and language.",
  applicationName: "Alapon",
  openGraph: {
    siteName: "Alapon | আলাপন",
    type: "website",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630 }]
  },
  twitter: { card: "summary_large_image", images: ["/og/default.jpg"] }
};

export const viewport: Viewport = { themeColor: "#bf2f3a", width: "device-width", initialScale: 1 };

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
          <AnalyticsBoot />
          <PwaRegister />
          <AuthProvider>
            <WelcomeBanner />
            <SiteHeader />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <SiteFooter />
            <BottomNav />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
