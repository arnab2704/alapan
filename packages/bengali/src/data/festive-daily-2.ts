import type { AddaPrompt } from "./adda-prompts";
import type { DailyWord } from "./culture";

/**
 * Dated content for the weeks after Durga Puja: Kojagari Lakshmi Puja (25 Oct), Kali Puja
 * (8 Nov), Bhai Phota (10 Nov) and Jagaddhatri Puja (17 Nov). Draft content for native review.
 */
export const FESTIVE_DAILY_WORDS_2: Record<string, DailyWord> = {
  "2026-10-25": {
    word: "কোজাগরী",
    roman: "kojagori",
    meaningBn: "আশ্বিন পূর্ণিমার রাত, যেদিন লক্ষ্মীপুজো হয়",
    meaningEn: "the Ashwin full-moon night on which Lakshmi is worshipped",
    exampleBn: "কোজাগরী পূর্ণিমার রাতে ঘরে ঘরে আলপনা আর লক্ষ্মীর পা আঁকা হয়।"
  },
  "2026-10-26": {
    word: "নাড়ু",
    roman: "naru",
    meaningBn: "নারকেল, তিল বা মুড়ি দিয়ে গুড় বা চিনিতে বাঁধা গোল মিষ্টি",
    meaningEn: "a round sweet of coconut, sesame or puffed rice bound in jaggery or sugar",
    exampleBn: "লক্ষ্মীপুজোর জন্য ঠাকুমা নারকেলের নাড়ু বানালেন।"
  },
  "2026-10-27": {
    word: "ঝাঁপি",
    roman: "jhanpi",
    meaningBn: "ঢাকনাওয়ালা ছোট পাত্র, যাতে লক্ষ্মীপুজোয় ধান বা চাল রাখা হয়",
    meaningEn: "a small lidded pot in which paddy or rice is kept for Lakshmi Puja",
    exampleBn: "লক্ষ্মীর ঝাঁপিতে ধান ভরে আলপনার পাশে রাখা হল।"
  },
  "2026-10-28": {
    word: "প্রদীপ",
    roman: "prodip",
    meaningBn: "তেল বা ঘি আর সলতে দিয়ে জ্বালানো মাটির বা ধাতুর আলো",
    meaningEn: "a clay or metal lamp lit with oil or ghee and a wick",
    exampleBn: "সন্ধ্যায় তুলসীতলায় প্রদীপ জ্বলে উঠল।"
  },
  "2026-11-06": {
    word: "অমাবস্যা",
    roman: "omabosha",
    meaningBn: "চাঁদ দেখা যায় না এমন রাত, কৃষ্ণপক্ষের শেষ তিথি",
    meaningEn: "the moonless night, the last tithi of the dark fortnight",
    exampleBn: "কালীপুজো হয় কার্তিকের অমাবস্যার রাতে।"
  },
  "2026-11-07": {
    word: "ভূতচতুর্দশী",
    roman: "bhutchoturdoshi",
    meaningBn: "কালীপুজোর আগের দিনের চতুর্দশী, যেদিন চৌদ্দ প্রদীপ জ্বালানো ও চৌদ্দ শাক খাওয়ার রীতি",
    meaningEn: "the Chaturdashi before Kali Puja, with the custom of fourteen lamps and fourteen greens",
    exampleBn: "ভূতচতুর্দশীর সন্ধ্যায় বাড়ির কোণে কোণে চৌদ্দ প্রদীপ জ্বলল।"
  },
  "2026-11-08": {
    word: "দীপাবলি",
    roman: "dipabali",
    meaningBn: "প্রদীপের সারির উৎসব, কার্তিকের অমাবস্যায় আলো জ্বালার রাত",
    meaningEn: "the festival of rows of lamps, the Kartik new-moon night of light",
    exampleBn: "দীপাবলির রাতে ছাদে ছাদে প্রদীপের সারি জ্বলছিল।"
  },
  "2026-11-09": {
    word: "শ্যামাসংগীত",
    roman: "shyamasongit",
    meaningBn: "কালী বা শ্যামা মায়ের প্রতি ভক্তি নিয়ে গাওয়া গান",
    meaningEn: "devotional songs sung to Mother Kali, or Shyama",
    exampleBn: "কালীপুজোর রাতে বৃদ্ধ গায়ক শ্যামাসংগীত গেয়ে শোনালেন।"
  },
  "2026-11-10": {
    word: "ভাইফোঁটা",
    roman: "bhaiphota",
    meaningBn: "বোনেরা ভাইদের কপালে চন্দনের ফোঁটা দিয়ে মঙ্গল কামনা করার উৎসব",
    meaningEn: "the festival when sisters put a sandalwood tika on brothers' foreheads and wish them well",
    exampleBn: "ভাইফোঁটার সকালে দিদি ভাইয়ের কপালে চন্দনের ফোঁটা দিল।"
  },
  "2026-11-11": {
    word: "চন্দন",
    roman: "chandan",
    meaningBn: "সুগন্ধি কাঠের পেস্ট, যা ফোঁটা ও পুজোয় ব্যবহৃত হয়",
    meaningEn: "fragrant wood paste used for tikas and worship",
    exampleBn: "ঠাকুরের কপালে চন্দন মাখানো হল।"
  },
  "2026-11-12": {
    word: "জবা",
    roman: "jaba",
    meaningBn: "গাঢ় লাল রঙের ফুল, যা কালীপুজোয় নিবেদন করা হয়",
    meaningEn: "the deep red hibiscus flower offered in Kali Puja",
    exampleBn: "গাছ ভরে লাল জবা ফুটেছে।"
  },
  "2026-11-17": {
    word: "জগদ্ধাত্রী",
    roman: "jogoddhatri",
    meaningBn: "চতুর্ভুজা সিংহবাহিনী দেবী, যাঁর পুজো কার্তিকে বিশেষত চন্দননগরে বিখ্যাত",
    meaningEn:
      "the four-armed, lion-mounted goddess whose Kartik puja is renowned especially in Chandannagar",
    exampleBn: "জগদ্ধাত্রী পুজোর সন্ধ্যায় চন্দননগরের রাস্তা আলোয় ভরে ওঠে।"
  }
};

const LIST: AddaPrompt[] = [
  {
    bn: "পুজো শেষে বাড়ি ফিরে সবচেয়ে বেশি কী মিস করেন?",
    en: "What do you miss most when you return home after Puja?"
  },
  {
    bn: "আপনার ছোটবেলার কালীপুজোর রাতের একটি স্মৃতি বলুন।",
    en: "Share a memory of a Kali Puja night from your childhood."
  },
  {
    bn: "ভূতচতুর্দশীতে চৌদ্দ শাক খাওয়ার অভিজ্ঞতা আছে? কোন শাক সবচেয়ে ভালো লেগেছে?",
    en: "Have you eaten the fourteen greens on Bhoot Chaturdashi? Which was your favourite?"
  },
  {
    bn: "দীপাবলির রাতে আপনার বাড়ির আলোসজ্জার কোন রীতি আছে?",
    en: "What is your home's lighting custom on Dipabali night?"
  },
  {
    bn: "কালীপুজোর প্রসাদ বা ভোগের কী আপনার সবচেয়ে প্রিয়?",
    en: "What is your favourite prasad or bhog of Kali Puja?"
  },
  { bn: "শ্যামাসংগীতের কোন গান আপনার মনে গেঁথে আছে?", en: "Which Shyama Sangeet song has stayed with you?" },
  {
    bn: "ভাইফোঁটার দিনে বোন বা ভাইয়ের সঙ্গে আপনার সবচেয়ে মজার স্মৃতি কী?",
    en: "What is your funniest memory with a sibling on Bhai Phota?"
  },
  { bn: "ফোঁটার পর কী খাওয়ার আয়োজন হয় আপনার বাড়িতে?", en: "What meal follows the tika at your home?" },
  {
    bn: "পাতানো ভাই-বোনের সঙ্গে সম্পর্কের কোনো গল্প আছে?",
    en: "Do you have a story of an adopted brother or sister?"
  },
  {
    bn: "চন্দননগরের আলো দেখেছেন? কেমন লেগেছিল?",
    en: "Have you seen the lights of Chandannagar? How did it feel?"
  },
  {
    bn: "কার্তিক মাসের সকালে বা সন্ধ্যায় কোন গন্ধ বা শব্দ আপনার মনে পড়ে?",
    en: "Which smell or sound of a Kartik morning or evening do you remember?"
  },
  {
    bn: "শীত আসার আগের হালকা ঠান্ডার দিনগুলোতে আপনার প্রিয় খাবার কী?",
    en: "What is your favourite food in the light-chill days before winter?"
  },
  { bn: "নবান্নের কথা মনে পড়লে কী মনে আসে?", en: "What comes to mind when you think of Nabanna?" },
  {
    bn: "আপনার এলাকার কোনো পুরোনো ঠাকুরবাড়ি বা মন্দিরের গল্প বলুন।",
    en: "Tell us the story of an old temple or thakurbari in your area."
  },
  {
    bn: "প্রবাস থেকে দেশে ফেরার সময় আপনি কী সঙ্গে নিয়ে আসেন?",
    en: "What do you bring along when returning home from abroad?"
  },
  {
    bn: "পুজোর ছবি তোলার সবচেয়ে সুন্দর স্মৃতি কোনটি?",
    en: "What is the loveliest memory of taking photographs during Puja?"
  },
  {
    bn: "কোন বাংলা শব্দ এই উৎসবের মরশুমে আপনার নতুন করে ভালো লেগেছে?",
    en: "Which Bengali word did you newly love this festive season?"
  },
  {
    bn: "আপনার পরিবারে উৎসবের কোন রেসিপি বংশপরম্পরায় চলে আসছে?",
    en: "Which festive recipe has been handed down in your family?"
  },
  {
    bn: "উৎসবের পরের নীরব দিনগুলো আপনি কীভাবে কাটান?",
    en: "How do you spend the quiet days after the festivals?"
  }
];

/** One prompt for each day from 30 Oct to 17 Nov 2026. */
export const FESTIVE_ADDA_PROMPTS_2: Record<string, AddaPrompt> = Object.fromEntries(
  LIST.map((prompt, i) => {
    const day = 30 + i;
    const date = day <= 31 ? `2026-10-${day}` : `2026-11-${String(day - 31).padStart(2, "0")}`;
    return [date, prompt];
  })
);
