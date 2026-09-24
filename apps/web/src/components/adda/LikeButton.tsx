"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { setLike, type ReportTarget } from "@/lib/supabase/adda";
import { ghostButton, useParticipation } from "./addaUi";

export function LikeButton({
  targetType,
  targetId,
  initialCount,
  initialMine
}: {
  targetType: ReportTarget;
  targetId: string;
  initialCount: number;
  initialMine: boolean;
}) {
  const t = useTranslations("adda");
  const { userId, canParticipate } = useParticipation();
  const [count, setCount] = useState(initialCount);
  const [mine, setMine] = useState(initialMine);

  async function toggle() {
    if (!userId) return;
    const next = !mine;
    setMine(next);
    setCount((c) => c + (next ? 1 : -1));
    const { error } = await setLike(userId, targetType, targetId, next);
    if (error) {
      setMine(!next);
      setCount((c) => c + (next ? -1 : 1));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!canParticipate}
      aria-pressed={mine}
      title={canParticipate ? undefined : t("likeNeedsAdult")}
      className={ghostButton}
    >
      <span aria-hidden="true">{mine ? "❤️" : "🤍"}</span>
      <span className="ml-1">
        {t("like")} {count > 0 ? count : ""}
      </span>
    </button>
  );
}
