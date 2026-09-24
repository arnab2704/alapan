"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Card } from "@alapon/ui";
import { useWordJaalGame } from "./useWordJaalGame";
import { LetterPalette } from "./LetterPalette";
import { WordBuilder } from "./WordBuilder";
import { FoundWordsList } from "./FoundWordsList";
import { WordJaalActions } from "./WordJaalActions";
import { LevelProgress } from "./LevelProgress";
import { WordJaalLevelComplete } from "./WordJaalLevelComplete";
import { ScorePanel } from "./ScorePanel";

export function WordJaalGame() {
  const t = useTranslations("shobdoshakti.wordJaal");
  const game = useWordJaalGame();

  if (game.isLoading) {
    return (
      <Card className="py-16 text-center text-ink-400" aria-busy="true">
        …
      </Card>
    );
  }

  if (game.gameComplete) {
    return (
      <Card className="flex flex-col items-center gap-3 py-12 text-center">
        <span aria-hidden="true" className="text-4xl">
          🏆
        </span>
        <p className="font-bengaliDisplay text-2xl font-bold text-ink-900">{t("allLevelsComplete")}</p>
        <button
          type="button"
          onClick={game.restartJourney}
          className="mt-2 min-h-11 inline-flex items-center justify-center rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white shadow-sm shadow-sindoor-900/20 transition-colors hover:bg-sindoor-600"
        >
          {t("playAgain")}
        </button>
      </Card>
    );
  }

  const combination = game.combination!;

  return (
    <div className="flex flex-col gap-4">
      <ScorePanel score={game.totalScore} />

      <LevelProgress
        level={game.levelNumber}
        totalLevels={game.totalLevels}
        difficulty={game.levelDifficulty ?? ""}
        combinationIndex={game.combinationIndex}
        combinationCount={game.combinationCount}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col items-center gap-4">
          <WordBuilder
            tiles={game.currentGuessTiles}
            status={game.guessStatus}
            onRemoveTile={game.removeFromGuess}
          />

          {game.guessStatus === "correct" && game.lastMessageWord ? (
            <p role="status" className="text-sm font-semibold text-shapla-600">
              {t("wordFound", { word: game.lastMessageWord })}
              {game.lastPoints ? ` (+${toBengaliDigits(game.lastPoints)})` : ""}
            </p>
          ) : game.guessStatus === "already_found" ? (
            <p role="alert" className="text-sm font-semibold text-sindoor-600">
              {t("alreadyFound", { word: game.lastMessageWord ?? "" })}
            </p>
          ) : game.guessStatus === "not_in_list" ? (
            <p role="alert" className="text-sm font-semibold text-sindoor-600">
              {t("notInList")}
            </p>
          ) : game.guessStatus === "empty" ? (
            <p role="alert" className="text-sm font-semibold text-sindoor-600">
              {t("selectLettersFirst")}
            </p>
          ) : null}

          <LetterPalette letters={game.availableLetters} onSelect={game.selectLetter} />

          <div className="w-full">
            <WordJaalActions
              hasGuess={game.currentGuessTiles.length > 0}
              onSubmit={game.submitGuess}
              onClear={game.clearGuess}
              onHelp={game.useHelp}
              onSkip={game.skipCombination}
            />
          </div>
        </Card>

        <Card>
          <FoundWordsList canForm={combination.canForm} foundWords={game.foundWords} />
        </Card>
      </div>

      {game.levelJustCompleted ? (
        <WordJaalLevelComplete reachedLevel={game.levelNumber} onContinue={game.acknowledgeLevelComplete} />
      ) : null}
    </div>
  );
}
