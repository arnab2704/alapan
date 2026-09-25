"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { tokenizeToTiles } from "@alapon/bengali";

function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * "Practise this word": rebuild it from its letter tiles. Learning through play - the tiles are the same
 * orthographic units the game uses. Success is calm; a wrong order simply lets you try again.
 */
export function WordPractice({
  word,
  meaning,
  onSolved
}: {
  word: string;
  meaning: string;
  onSolved?: () => void;
}) {
  const t = useTranslations("wordDna.practice");
  const answer = useMemo(() => tokenizeToTiles(word), [word]);
  // Shuffled after mount: a random order made during server rendering would not match the browser's.
  const [tiles, setTiles] = useState<Array<{ id: number; text: string }> | null>(null);
  useEffect(() => {
    let order = shuffled(answer.map((text, id) => ({ id, text })));
    for (
      let i = 0;
      i < 6 && answer.length > 1 && order.map((x) => x.text).join("|") === answer.join("|");
      i++
    ) {
      order = shuffled(order);
    }
    setTiles(order);
  }, [answer]);
  const [picked, setPicked] = useState<number[]>([]);
  const [state, setState] = useState<"idle" | "wrong" | "solved">("idle");

  if (answer.length < 2 || tiles === null) return null;

  const byId = new Map(tiles.map((x) => [x.id, x]));
  const built = picked.map((id) => byId.get(id)!.text);
  const remaining = tiles.filter((x) => !picked.includes(x.id));

  function check() {
    if (built.join("") === word) {
      setState("solved");
      onSolved?.();
    } else {
      setState("wrong");
    }
  }

  function reset() {
    setPicked([]);
    setState("idle");
  }

  return (
    <section aria-labelledby="practice-heading" className="card-learning">
      <h2 id="practice-heading" className="display text-2xl">
        {t("heading")}
      </h2>
      <p className="mt-1 text-ink-700 dark:text-ink-100">{t("prompt", { meaning })}</p>

      <div
        aria-label={t("yourWord")}
        className="mt-4 flex min-h-16 flex-wrap items-center gap-2 rounded-alpona border-2 border-dashed border-shapla-300 bg-cream-50 p-3 dark:border-ink-600 dark:bg-ink-900/40"
      >
        {picked.map((id) => (
          <button
            key={id}
            type="button"
            disabled={state === "solved"}
            onClick={() => {
              setPicked(picked.filter((p) => p !== id));
              setState("idle");
            }}
            lang="bn"
            className="font-bengaliDisplay min-h-12 min-w-12 rounded-xl border-2 border-sindoor-300 bg-sindoor-50 px-3 text-2xl font-bold dark:bg-ink-700"
          >
            {byId.get(id)!.text}
          </button>
        ))}
      </div>

      <div role="group" aria-label={t("tiles")} className="mt-3 flex flex-wrap gap-2">
        {remaining.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={state === "solved"}
            onClick={() => {
              setPicked([...picked, tile.id]);
              setState("idle");
            }}
            lang="bn"
            className="font-bengaliDisplay min-h-12 min-w-12 rounded-xl border-2 border-marigold-300 bg-gradient-to-b from-marigold-50 to-marigold-100 px-3 text-2xl font-bold shadow-sm hover:-translate-y-0.5"
          >
            {tile.text}
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite" className="mt-3 min-h-6 font-semibold">
        {state === "solved" ? (
          <span className="text-shapla-700 dark:text-shapla-300">{t("solved")}</span>
        ) : state === "wrong" ? (
          <span className="text-sindoor-700 dark:text-sindoor-300">{t("wrong")}</span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-3">
        {state !== "solved" ? (
          <button
            type="button"
            onClick={check}
            disabled={picked.length !== answer.length}
            className="btn btn-primary"
          >
            {t("check")}
          </button>
        ) : null}
        <button type="button" onClick={reset} className="btn btn-secondary">
          {t("reset")}
        </button>
      </div>
    </section>
  );
}
