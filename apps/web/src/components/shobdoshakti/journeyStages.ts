export interface JourneyStage {
  level: number;
  titleBn: string;
  titleEn: string;
}

/**
 * Level-milestone flavor text shown when a level completes - a light
 * narrative thread through the campaign, not a mechanic. Adapted from the
 * source app's 6-stage "journey" (extended to all 10 levels in this
 * dataset).
 */
export const JOURNEY_STAGES: JourneyStage[] = [
  { level: 1, titleBn: "প্রথম ধাপ", titleEn: "First Step" },
  { level: 2, titleBn: "গ্রামের পথে", titleEn: "Village Paths" },
  { level: 3, titleBn: "নদীর তীরে", titleEn: "River Bank" },
  { level: 4, titleBn: "শহরের কোলাহল", titleEn: "City Bustle" },
  { level: 5, titleBn: "পাহাড়ের চূড়া", titleEn: "Mountain Peak" },
  { level: 6, titleBn: "সাগরপারে", titleEn: "Seaside" },
  { level: 7, titleBn: "মেঘের রাজ্যে", titleEn: "Cloud Kingdom" },
  { level: 8, titleBn: "তারার আলোয়", titleEn: "Starlight" },
  { level: 9, titleBn: "শব্দ বিশারদ", titleEn: "Word Scholar" },
  { level: 10, titleBn: "শব্দসম্রাট", titleEn: "Word Master" }
];

export function getJourneyStage(level: number): JourneyStage {
  return JOURNEY_STAGES.find((s) => s.level === level) ?? JOURNEY_STAGES[JOURNEY_STAGES.length - 1];
}
