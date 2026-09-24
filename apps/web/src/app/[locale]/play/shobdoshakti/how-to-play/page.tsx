import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";

const RULES = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"] as const;

export default async function HowToPlayPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("help");
  const tGame = await getTranslations("shobdoshakti");

  return (
    <Container className="py-10">
      <SectionHeading title={t("title")} />
      <Card className="max-w-2xl">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{t("rulesHeading")}</h2>
        <ul className="mt-3 flex flex-col gap-2 text-ink-700">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span aria-hidden="true" className="text-marigold-500">
                •
              </span>
              {t(`rules.${rule}`)}
            </li>
          ))}
        </ul>
        <Link
          href="/play/shobdoshakti"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sindoor-600"
        >
          {tGame("heading")}
        </Link>
      </Card>
    </Container>
  );
}
