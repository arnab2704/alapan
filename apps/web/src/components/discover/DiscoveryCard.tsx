import { Link } from "@/i18n/navigation";
import type { Discovery } from "@alapon/bengali";

const ICON: Record<Discovery["category"], string> = {
  person: "🧑",
  place: "📍",
  history: "🏛️",
  literature: "📖",
  food: "🍲",
  song: "🎶",
  cinema: "🎬",
  theatre: "🎭",
  art: "🎨",
  science: "🔬",
  tradition: "🪔",
  education: "🎓"
};

/** A discovery in a list: category, title, and the first lines of its summary. Purely presentational. */
export function DiscoveryCard({
  discovery,
  bn,
  categoryLabel
}: {
  discovery: Discovery;
  bn: boolean;
  categoryLabel: string;
}) {
  return (
    <Link href={`/discover/${discovery.slug}`} className="card-discovery group flex h-full flex-col">
      <p className="eyebrow flex items-center gap-2">
        <span aria-hidden="true">{ICON[discovery.category]}</span>
        {categoryLabel}
      </p>
      <h3 className="display mt-2 text-2xl group-hover:text-sindoor-700">
        {bn ? discovery.titleBn : discovery.titleEn}
      </h3>
      <p className="reading mt-2 line-clamp-3 text-sm text-ink-600 dark:text-ink-200">
        {bn ? discovery.summaryBn : discovery.summaryEn}
      </p>
    </Link>
  );
}
