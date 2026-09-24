import { NextResponse } from "next/server";
import { getAllTargetWords } from "@/lib/wordLevels";

/** Full word list (just the words, no level metadata) for Free Play's tile bag + dictionary. */
export function GET() {
  return NextResponse.json({ words: getAllTargetWords() });
}
