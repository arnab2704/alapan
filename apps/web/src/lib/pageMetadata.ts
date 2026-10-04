import type { Metadata } from "next";

const PAGES = {
  today: [
    "আজ",
    "Today",
    "আজকের শব্দ, খেলা আর আবিষ্কার - প্রতিদিন বাংলার সঙ্গে একটু সময়।",
    "Today's word, game and discovery - a few minutes with Bengal, every day."
  ],
  play: ["খেলুন", "Play", "বাংলা শব্দের খেলা ও কুইজ।", "Bengali word games and quizzes."],
  learn: [
    "শিখুন",
    "Learn",
    "বাংলা বর্ণমালা, শব্দ ও বাক্য ধাপে ধাপে।",
    "Bengali letters, words and sentences, step by step."
  ],
  calendar: [
    "বাংলা পঞ্জিকা",
    "Bengali Calendar",
    "বাংলা তারিখ, মাস ও উৎসব।",
    "Bengali dates, months and festivals."
  ],
  puja: [
    "পুজো পাসপোর্ট",
    "Puja Passport",
    "দুর্গাপূজার দিনে দিনে বাংলার সঙ্গে।",
    "Day by day through Durga Puja."
  ],
  leaderboard: ["লিডারবোর্ড", "Leaderboard", "ShobdoShakti-র সেরা স্কোর।", "Top ShobdoShakti scores."],
  adda: ["থেকে আড্ডা", "Theke Adda", "বাংলা নিয়ে আড্ডার জায়গা।", "A place to talk Bengali culture."],
  daily: [
    "আজকের ShobdoShakti",
    "Today's ShobdoShakti",
    "প্রতিদিনের তিন রাউন্ডের শব্দ-খেলা।",
    "The daily three-round word game."
  ],
  free: ["ফ্রি খেলা", "Free play", "নিজের মতো করে শব্দ গড়ুন।", "Build words at your own pace."],
  levels: ["লেভেল", "Levels", "সহজ থেকে কঠিন ধাপে ShobdoShakti।", "ShobdoShakti from easy to hard."],
  quiz: ["কুইজ", "Quiz", "বাংলা সংস্কৃতির কুইজ।", "Bengali culture quizzes."]
} as const;

const OG_IMAGE: Partial<Record<keyof typeof PAGES, string>> = {
  play: "/og/game.jpg",
  daily: "/og/game.jpg",
  free: "/og/game.jpg",
  levels: "/og/game.jpg",
  quiz: "/og/game.jpg",
  puja: "/og/puja.jpg"
};

export function metaFor(key: keyof typeof PAGES, locale: string): Metadata {
  const [tb, te, db, de] = PAGES[key];
  const bn = locale === "bn";
  const title = bn ? tb : te;
  const description = bn ? db : de;
  const image = OG_IMAGE[key];
  return {
    title,
    description,
    ...(image
      ? { openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] } }
      : {})
  };
}
