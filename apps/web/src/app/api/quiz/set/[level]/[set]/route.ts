import { NextResponse } from "next/server";
import { isValidQuizSet } from "@alapon/game-engine";
import { getQuizSet } from "@/lib/quizBank";

export function GET(_request: Request, { params }: { params: { level: string; set: string } }) {
  const level = Number(params.level);
  const set = Number(params.set);
  if (!isValidQuizSet(level, set)) {
    return NextResponse.json({ error: "Unknown quiz set" }, { status: 404 });
  }
  return NextResponse.json(getQuizSet(level, set));
}
