import { Inter, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";

/** Body text - Bengali and Latin UI copy. */
export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap"
});

/** Headings - editorial Bengali serif for a premium "Modern Bengal" feel (NYT Games-adjacent, not playful/childish). */
export const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["500", "600", "700"],
  variable: "--font-bengali-display",
  display: "swap"
});

/** Latin fallback for English-locale UI. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap"
});
