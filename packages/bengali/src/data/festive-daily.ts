import type { AddaPrompt } from "./adda-prompts";
import type { DailyWord } from "./culture";

/**
 * Date-targeted content for the Sharodiya 1433 season (Durga Puja 2026). On these ISO dates the
 * daily word and Today's Adda prompt come from here instead of the rotating pools. Draft content:
 * a native-speaking reviewer should check it before public launch.
 */
export const FESTIVE_DAILY_WORDS: Record<string, DailyWord> = {
  "2026-10-10": {
    word: "মহালয়া",
    roman: "mohaloya",
    meaningBn: "শরতের অমাবস্যা, যেদিন পিতৃপক্ষ শেষ হয়ে দেবীপক্ষ শুরু হয়",
    meaningEn: "the autumn new-moon day when Pitru Paksha ends and Devi Paksha begins",
    exampleBn: "মহালয়ার ভোরে রেডিওতে চণ্ডীপাঠ শুনে অনেকের দিন শুরু হয়।"
  },
  "2026-10-11": {
    word: "আগমনী",
    roman: "agomoni",
    meaningBn: "দেবীর বাপের বাড়িতে আসার আনন্দ নিয়ে গান বা আবহ",
    meaningEn: "songs and mood celebrating the goddess's arrival home",
    exampleBn: "আগমনী গানে মায়ের মেয়ের ফেরার অপেক্ষা ফুটে ওঠে।"
  },
  "2026-10-12": {
    word: "কুমোরটুলি",
    roman: "kumortuli",
    meaningBn: "কলকাতার উত্তরাংশের যে পাড়ায় কুমোররা প্রতিমা গড়েন",
    meaningEn: "the north Kolkata quarter where potters make idols",
    exampleBn: "পুজোর আগে কুমোরটুলির গলিতে হাঁটলে খড়ের কাঠামোয় মাটির প্রলেপ দেখা যায়।"
  },
  "2026-10-13": {
    word: "প্রতিমা",
    roman: "protima",
    meaningBn: "পুজোর জন্য গড়া দেবদেবীর মূর্তি",
    meaningEn: "the idol made for worship",
    exampleBn: "এবারের প্রতিমায় চোখদুটি ভারি সুন্দর আঁকা হয়েছে।"
  },
  "2026-10-14": {
    word: "মণ্ডপ",
    roman: "mondop",
    meaningBn: "পুজোর প্রতিমা রাখার অস্থায়ী সাজানো কাঠামো, প্যান্ডেল",
    meaningEn: "the decorated temporary structure that houses the idol, a pandal",
    exampleBn: "পাড়ার মণ্ডপে এবার বাঁশ আর কাপড়ের কাজ চোখ টানছে।"
  },
  "2026-10-15": {
    word: "ঢাকি",
    roman: "dhaki",
    meaningBn: "যিনি ঢাক বাজান",
    meaningEn: "the drummer who plays the dhak",
    exampleBn: "ঢাকির বোল উঠতেই সবাই কান পেতে দাঁড়াল।"
  },
  "2026-10-16": {
    word: "শঙ্খ",
    roman: "shonkho",
    meaningBn: "শামুকের খোল দিয়ে তৈরি ফুঁ-বাদ্য, যা শুভ কাজে বাজানো হয়",
    meaningEn: "the conch shell blown at auspicious moments",
    exampleBn: "সন্ধ্যায় শঙ্খ বেজে উঠতেই আরতি শুরু হল।"
  },
  "2026-10-17": {
    word: "বোধন",
    roman: "bodhon",
    meaningBn: "ষষ্ঠীর সন্ধ্যায় দেবীকে জাগানোর অনুষ্ঠান",
    meaningEn: "the Shashthi-evening ritual of awakening the goddess",
    exampleBn: "ষষ্ঠীর সন্ধ্যায় বোধনের মধ্য দিয়ে পুজোর সূচনা হয়।"
  },
  "2026-10-18": {
    word: "নবপত্রিকা",
    roman: "nobopotrika",
    meaningBn: "নয় রকম গাছ একসঙ্গে বেঁধে গড়া পুজোর প্রতীক, যা কলাবউ নামেও পরিচিত",
    meaningEn: "a bundle of nine plants tied together for worship, also called Kolabou",
    exampleBn: "সপ্তমীর ভোরে নবপত্রিকা স্নান করিয়ে মণ্ডপে আনা হল।"
  },
  "2026-10-19": {
    word: "অঞ্জলি",
    roman: "onjoli",
    meaningBn: "দুই হাত জোড় করে ফুল নিবেদন",
    meaningEn: "an offering of flowers with cupped hands",
    exampleBn: "অষ্টমীর সকালে লম্বা লাইনে দাঁড়িয়ে সবাই অঞ্জলি দিল।"
  },
  "2026-10-20": {
    word: "ভোগ",
    roman: "bhog",
    meaningBn: "দেবতাকে নিবেদন করা খাবার, যা পরে সবাই মিলে ভাগ করে খায়",
    meaningEn: "food offered to a deity and afterwards shared by all",
    exampleBn: "নবমীর দুপুরে মণ্ডপে বসে সবাই খিচুড়ির ভোগ খেল।"
  },
  "2026-10-21": {
    word: "বিসর্জন",
    roman: "bishorjon",
    meaningBn: "প্রতিমাকে জলে ভাসিয়ে বিদায় দেওয়ার অনুষ্ঠান",
    meaningEn: "the ritual of immersing the idol in water as a farewell",
    exampleBn: "বিসর্জনের দিনে ঢাকের সুরে আনন্দ আর বিষাদ মিশে গেল।"
  }
};

/** Twenty conversation starters, one for each day from Mahalaya (10 Oct) to 29 Oct 2026. */
const PROMPT_LIST: AddaPrompt[] = [
  {
    bn: "মহালয়ার ভোরের কোন স্মৃতি আপনার মনে সবচেয়ে উজ্জ্বল?",
    en: "Which Mahalaya-dawn memory shines brightest for you?"
  },
  {
    bn: "ছোটবেলায় পুজোর নতুন জামা কেনার সবচেয়ে মজার গল্প কী?",
    en: "What is your funniest story about buying new Puja clothes as a child?"
  },
  {
    bn: "আপনার পাড়ার পুজোর সবচেয়ে প্রিয় জিনিস কোনটা?",
    en: "What is the thing you love most about your neighbourhood Puja?"
  },
  {
    bn: "কুমোরটুলি বা প্রতিমা-শিল্পীদের নিয়ে আপনার কোনো অভিজ্ঞতা আছে?",
    en: "Do you have an experience of Kumartuli or idol makers?"
  },
  { bn: "পুজোর কোন গান শুনলেই আপনার মন ভালো হয়ে যায়?", en: "Which Puja song instantly lifts your mood?" },
  {
    bn: "ষষ্ঠীর সন্ধ্যায় আপনার বাড়িতে বা পাড়ায় কী হয়?",
    en: "What happens at your home or neighbourhood on Shashthi evening?"
  },
  {
    bn: "সপ্তমীর সকালের কোন গন্ধ বা শব্দ আপনার মনে পড়ে?",
    en: "Which smell or sound of Saptami morning do you remember?"
  },
  {
    bn: "অষ্টমীর অঞ্জলির লাইনে দাঁড়ানোর মজার স্মৃতি কী?",
    en: "What is a fun memory of standing in the Ashtami anjali line?"
  },
  { bn: "পুজোর ভোগের কোন পদটি আপনার সবচেয়ে প্রিয়?", en: "Which dish of the Puja bhog is your favourite?" },
  {
    bn: "ধুনুচি নাচ কি আপনি কখনও নেচেছেন বা দেখেছেন? কেমন লেগেছিল?",
    en: "Have you ever danced or watched the dhunuchi dance? How did it feel?"
  },
  {
    bn: "ঠাকুর দেখতে গিয়ে কোন মণ্ডপ আপনাকে সবচেয়ে অবাক করেছে?",
    en: "Which pandal surprised you most while pandal-hopping?"
  },
  {
    bn: "পুজোর সময় বাড়ির বড়দের কাছ থেকে শোনা কোনো গল্প মনে আছে?",
    en: "Do you remember a story an elder told you during Puja?"
  },
  {
    bn: "প্রবাসে পুজো কাটানোর অভিজ্ঞতা থাকলে ভাগ করুন।",
    en: "If you have spent Puja away from home, share the experience."
  },
  {
    bn: "বিজয়ার দিনে প্রণাম আর কোলাকুলির কোন স্মৃতি আপনার প্রিয়?",
    en: "Which memory of Bijoya pranam and kolakuli do you treasure?"
  },
  { bn: "বিজয়ার মিষ্টির মধ্যে আপনার প্রথম পছন্দ কী?", en: "What is your first choice among Bijoya sweets?" },
  { bn: "পুজোর কোন সাজ বা পোশাক আপনার সবচেয়ে প্রিয়?", en: "Which Puja outfit is your favourite?" },
  {
    bn: "পুজোর ছুটিতে কোথায় বেড়াতে যাওয়ার অভ্যাস আপনার?",
    en: "Where do you usually travel during the Puja holidays?"
  },
  {
    bn: "কোজাগরী লক্ষ্মীপুজোয় আপনার বাড়ির রীতি কী?",
    en: "What is your home's custom for Kojagari Lakshmi Puja?"
  },
  { bn: "পুজো শেষের বিষণ্ণতা আপনি কীভাবে কাটান?", en: "How do you get through the post-Puja blues?" },
  {
    bn: "কালীপুজো আর দীপাবলির প্রস্তুতিতে আপনার বাড়ি কেমন সাজে?",
    en: "How does your home get ready for Kali Puja and Diwali?"
  }
];

export const FESTIVE_ADDA_PROMPTS: Record<string, AddaPrompt> = Object.fromEntries(
  PROMPT_LIST.map((prompt, i) => [`2026-10-${String(10 + i).padStart(2, "0")}`, prompt])
);
