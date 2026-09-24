import { setRequestLocale } from "next-intl/server";
import { Container, PlaceholderPanel } from "@alapon/ui";

export default async function DiscoverPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <Container className="flex justify-center py-16">
      <PlaceholderPanel
        locale={locale as "bn" | "en"}
        icon="🔎"
        titleBn="আবিষ্কার করুন"
        titleEn="Discover"
        descriptionBn="বাংলার মানুষ, সাহিত্য, সঙ্গীত, সিনেমা আর ইতিহাস নিয়ে কাঠামোবদ্ধ কনটেন্ট শীঘ্রই আসছে।"
        descriptionEn="Structured content on Bengali people, literature, music, cinema and history is coming soon."
      />
    </Container>
  );
}
