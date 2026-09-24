import { ImageResponse } from "next/og";
import { parseChallenge } from "@alapon/game-engine";
import { toBengaliDigits } from "@alapon/bengali";

export const runtime = "edge";

const fontPromise = fetch(new URL("./NotoSansBengali-Bold.woff", import.meta.url)).then((res) =>
  res.arrayBuffer()
);

/**
 * Link-preview card for a quiz challenge. Satori (the renderer behind next/og)
 * does not reorder Bengali vowel signs correctly, so the card uses only the
 * brand word and digits - which render correctly - plus English text, and
 * deliberately leaves out the challenger's (possibly Bengali) name.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = parseChallenge(
    {
      d: searchParams.get("d") ?? undefined,
      s: searchParams.get("s") ?? undefined,
      n: searchParams.get("n") ?? undefined
    },
    new Date()
  );
  const bn = searchParams.get("l") !== "en";
  const digits = bn ? toBengaliDigits : (n: number) => String(n);
  const score = challenge?.score ?? 0;
  const total = challenge?.total ?? 5;
  const fontData = await fontPromise;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fffaf2 0%, #f9e29b 100%)",
        fontFamily: "Noto Sans Bengali, sans-serif",
        color: "#1c1518",
        border: "16px solid #bf2f3a"
      }}
    >
      <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#7d1d28" }}>আলাপন</div>
      <div style={{ display: "flex", fontSize: 36, letterSpacing: 6, color: "#4d4346" }}>QUIZ CHALLENGE</div>
      <div style={{ display: "flex", fontSize: 220, fontWeight: 700, color: "#bf2f3a", marginTop: 6 }}>
        {digits(score)}/{digits(total)}
      </div>
      <div style={{ display: "flex", fontSize: 46, fontWeight: 700, marginTop: 6 }}>Can you beat it?</div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData ? [{ name: "Noto Sans Bengali", data: fontData, weight: 700, style: "normal" }] : []
    }
  );
}
