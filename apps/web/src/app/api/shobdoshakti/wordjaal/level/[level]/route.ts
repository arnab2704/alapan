import { NextResponse } from "next/server";
import { getWordJaalLevel, TOTAL_WORDJAAL_LEVELS } from "@/lib/wordJaalLevels";

export function GET(_request: Request, { params }: { params: { level: string } }) {
  const levelNumber = Number(params.level);

  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > TOTAL_WORDJAAL_LEVELS) {
    return NextResponse.json({ error: "invalid_level" }, { status: 400 });
  }

  const level = getWordJaalLevel(levelNumber);
  if (!level) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ level, totalLevels: TOTAL_WORDJAAL_LEVELS });
}
