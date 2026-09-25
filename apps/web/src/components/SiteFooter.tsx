import { useLocale, useTranslations } from "next-intl";
import { Container, AlponaDivider } from "@alapon/ui";
import { Link } from "@/i18n/navigation";

const LEGAL_LINKS = [
  { href: "/terms", bn: "শর্তাবলি", en: "Terms" },
  { href: "/privacy", bn: "গোপনীয়তা", en: "Privacy" },
  { href: "/copyright-policy", bn: "কপিরাইট নীতি", en: "Copyright" },
  { href: "/report-copyright", bn: "কপিরাইট অভিযোগ", en: "Report copyright" },
  { href: "/safety", bn: "নিরাপত্তা", en: "Safety" }
];

const COLUMNS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: "primary.today",
    links: [
      { href: "/today", label: "today" },
      { href: "/calendar", label: "calendar" },
      { href: "/puja", label: "puja" }
    ]
  },
  {
    heading: "primary.play",
    links: [
      { href: "/play/shobdoshakti", label: "shobdoshakti" },
      { href: "/quiz", label: "quiz" },
      { href: "/leaderboard", label: "leaderboard" }
    ]
  },
  {
    heading: "primary.learn",
    links: [
      { href: "/learn", label: "learn" },
      { href: "/learn/alphabet", label: "alphabetLink" }
    ]
  },
  {
    heading: "primary.discover",
    links: [
      { href: "/discover", label: "discover" },
      { href: "/search", label: "search" },
      { href: "/passport", label: "passport" }
    ]
  },
  {
    heading: "primary.adda",
    links: [{ href: "/theke-adda", label: "adda" }]
  }
];

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();
  const bnLocale = useLocale() === "bn";

  return (
    <footer className="mt-8 border-t border-ink-100 pt-2 text-sm text-ink-500 dark:border-ink-700">
      <AlponaDivider className="mx-auto h-3 w-full max-w-xs text-alpona-200 dark:text-ink-700" />
      <Container className="py-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={nav(column.heading)}>
              <h2 className="eyebrow mb-2">{nav(column.heading)}</h2>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-11 items-center text-ink-700 hover:text-sindoor-700 dark:text-ink-200"
                    >
                      {link.label === "alphabetLink" ? t("alphabet") : nav(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <nav aria-label={bnLocale ? "নীতি" : "Legal"} className="mt-6 flex flex-wrap gap-x-5">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex min-h-11 items-center text-ink-600 hover:text-sindoor-700 dark:text-ink-300"
            >
              {bnLocale ? l.bn : l.en}
            </Link>
          ))}
        </nav>
        <p className="font-bengaliDisplay mt-2 border-t border-ink-100 pt-6 text-ink-500 dark:border-ink-700 dark:text-ink-300">
          আলাপন <span className="font-latin text-ink-400">Alapon</span> &copy; {year}. {t("rights")}{" "}
          <span className="text-ink-400">{t("promise")}</span>
        </p>
      </Container>
    </footer>
  );
}
