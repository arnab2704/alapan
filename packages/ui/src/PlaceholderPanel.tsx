import type { ReactNode } from "react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { AlponaDivider } from "./AlponaMotif";

export interface PlaceholderPanelProps {
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  locale: "bn" | "en";
  icon?: ReactNode;
}

/**
 * Used by /discover and /theke-adda in V0.1: these sections are intentionally
 * not built yet (see scope decision in docs/architecture) but need a real,
 * navigable, on-brand placeholder rather than a 404.
 */
export function PlaceholderPanel({
  titleBn,
  titleEn,
  descriptionBn,
  descriptionEn,
  locale,
  icon
}: PlaceholderPanelProps) {
  const title = locale === "bn" ? titleBn : titleEn;
  const description = locale === "bn" ? descriptionBn : descriptionEn;

  return (
    <Card className="flex w-full max-w-md flex-col items-center gap-4 py-10 text-center">
      {icon ? (
        <div className="text-4xl" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Badge tone="gold">{locale === "bn" ? "শীঘ্রই আসছে" : "Coming soon"}</Badge>
      <h1 className="font-bengaliDisplay text-2xl font-bold text-ink-900 dark:text-ink-50">{title}</h1>
      <AlponaDivider className="h-3 w-28 text-alpona-300" />
      <p className="max-w-md text-ink-600 dark:text-ink-100">{description}</p>
    </Card>
  );
}
