import { Container } from "@alapon/ui";
import { LEGAL, LEGAL_UPDATED, type LegalKey } from "@/lib/legalContent";
import { Link } from "@/i18n/navigation";

/** Static legal document. Server-rendered so it is indexable and works without JavaScript. */
export function LegalPage({ docKey, locale }: { docKey: LegalKey; locale: string }) {
  const bn = locale === "bn";
  const doc = LEGAL[docKey][bn ? "bn" : "en"];
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <p className="eyebrow">{bn ? "নীতি" : "Policy"}</p>
      <h1 className="display mt-2 text-4xl sm:text-5xl">{doc.title}</h1>
      <p className="reading mt-2 text-lg text-ink-700 dark:text-ink-100">{doc.summary}</p>
      <p className="mt-1 text-sm text-ink-500">
        {bn ? "সর্বশেষ হালনাগাদ" : "Last updated"}: {LEGAL_UPDATED}
      </p>
      <div className="mt-8 flex flex-col gap-8">
        {doc.sections.map((section) => (
          <section key={section.h}>
            <h2 className="display text-2xl">{section.h}</h2>
            {section.p.map((paragraph) => (
              <p key={paragraph} className="reading mt-2 text-ink-800 dark:text-ink-100">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      {docKey === "copyright" ? (
        <p className="mt-8">
          <Link href="/report-copyright" className="btn btn-primary">
            {bn ? "কপিরাইট অভিযোগ জানান" : "Report copyright"}
          </Link>
        </p>
      ) : null}
    </Container>
  );
}
