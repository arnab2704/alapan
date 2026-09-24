"use client";

import { useEffect, useState } from "react";
import { GameHeader } from "./GameHeader";
import { GameModeToggle } from "./GameModeToggle";
import { HelpDialog } from "./HelpDialog";
import { WordJaalGame } from "./WordJaalGame";
import { FreePlayGame } from "./FreePlayGame";
import { hasSeenOnboarding, markOnboardingSeen } from "./progressStorage";
import type { GameMode } from "./wordJaalTypes";

/**
 * Top-level ShobdoShakti game surface: a thin router between the two
 * modes, which have genuinely different mechanics and layouts -
 * Level Mode is শব্দজাল (find every word buildable from a letter
 * palette; see wordJaalLevels.ts), Free Play is the open 15x15 board.
 * Each owns its own hook/state; nothing here is shared beyond the chrome
 * (header, mode toggle, help dialog).
 */
export function GameShell() {
  const [mode, setMode] = useState<GameMode>("level");
  const [helpOpen, setHelpOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding()) setOnboardingOpen(true);
  }, []);

  function closeOnboarding() {
    markOnboardingSeen();
    setOnboardingOpen(false);
  }

  return (
    <div>
      <GameHeader onHelp={() => setHelpOpen(true)} />

      <div className="mb-4">
        <GameModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === "level" ? <WordJaalGame /> : <FreePlayGame />}

      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} mode={mode} />
      <HelpDialog open={onboardingOpen} onClose={closeOnboarding} mode="level" showOnboarding />
    </div>
  );
}
