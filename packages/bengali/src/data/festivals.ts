export interface FestivalDay {
  labelBn: string;
  labelEn: string;
  /** ISO yyyy-mm-dd. */
  date: string;
}

export type FestivalCategory = "puja" | "sankranti" | "cultural";

export interface Festival {
  slug: string;
  nameBn: string;
  nameEn: string;
  /** ISO yyyy-mm-dd - first day. */
  date: string;
  /** ISO yyyy-mm-dd - last day, for multi-day festivals. Omitted for single-day ones. */
  endDate?: string;
  category: FestivalCategory;
  emoji: string;
  descriptionBn: string;
  descriptionEn: string;
  /** True for festivals whose date follows the lunisolar Hindu Panchang (tithi-based), which can shift by a day depending on regional convention - as opposed to a fixed solar date like Poila Boishakh. */
  lunisolar: boolean;
  days?: FestivalDay[];
}

/**
 * One year of major Bengali festivals from Sharodiya 1433 (autumn 2026)
 * through the start of Sharodiya 1434 season (autumn 2027). Lunisolar
 * dates are sourced from published Panchang/Panjika references for these
 * specific years - they cannot be derived algorithmically the way
 * `calendar.ts`'s solar conversion can, and need re-sourcing every year
 * this list is extended. See docs/architecture for provenance notes.
 */
export const FESTIVALS: Festival[] = [
  {
    slug: "durga-puja-2026",
    nameBn: "দুর্গাপূজা",
    nameEn: "Durga Puja",
    date: "2026-10-10",
    endDate: "2026-10-21",
    category: "puja",
    emoji: "🪔",
    descriptionBn:
      "শারদীয়া উৎসব - মহালয়ায় দেবীপক্ষের সূচনা থেকে বিজয়া দশমী পর্যন্ত, দুর্গার আগমনের বারো দিন।",
    descriptionEn:
      "Bengal's biggest festival - from Mahalaya's Devi Paksha opening through Bijoya Dashami, Durga's homecoming celebrated over twelve days.",
    lunisolar: true,
    days: [
      { labelBn: "মহালয়া", labelEn: "Mahalaya", date: "2026-10-10" },
      { labelBn: "ষষ্ঠী", labelEn: "Shashthi", date: "2026-10-17" },
      { labelBn: "সপ্তমী", labelEn: "Saptami", date: "2026-10-18" },
      { labelBn: "অষ্টমী", labelEn: "Ashtami", date: "2026-10-19" },
      { labelBn: "নবমী", labelEn: "Nabami", date: "2026-10-20" },
      { labelBn: "বিজয়া দশমী", labelEn: "Bijoya Dashami", date: "2026-10-21" }
    ]
  },
  {
    slug: "kojagari-lakshmi-puja-2026",
    nameBn: "কোজাগরী লক্ষ্মীপূজা",
    nameEn: "Kojagari Lakshmi Puja",
    date: "2026-10-25",
    category: "puja",
    emoji: "🌕",
    descriptionBn: "দুর্গাপূজার পূর্ণিমায় লক্ষ্মীর আরাধনা - সমৃদ্ধি আর গৃহস্থের মঙ্গল কামনায়।",
    descriptionEn:
      "Lakshmi worshipped on the full moon after Durga Puja, for prosperity and the wellbeing of the home.",
    lunisolar: true
  },
  {
    slug: "kali-puja-2026",
    nameBn: "কালীপূজা",
    nameEn: "Kali Puja",
    date: "2026-11-08",
    category: "puja",
    emoji: "🕯️",
    descriptionBn: "দীপাবলির রাতে দেবী কালীর আরাধনা - প্রদীপ, আতশবাজি আর মায়ের আশীর্বাদ।",
    descriptionEn:
      "Kali worshipped on Diwali night - lamps, fireworks and the goddess's fierce, protective blessing.",
    lunisolar: true
  },
  {
    slug: "bhai-phota-2026",
    nameBn: "ভাইফোঁটা",
    nameEn: "Bhai Phota",
    date: "2026-11-10",
    category: "cultural",
    emoji: "❤️",
    descriptionBn: "বোনেরা ভাইয়ের কপালে ফোঁটা দিয়ে দীর্ঘায়ু কামনা করেন - বাংলার নিজস্ব ভাই দুজ।",
    descriptionEn:
      "Sisters mark their brothers' foreheads and pray for their long life - Bengal's own version of Bhai Dooj.",
    lunisolar: true
  },
  {
    slug: "jagaddhatri-puja-2026",
    nameBn: "জগদ্ধাত্রী পূজা",
    nameEn: "Jagaddhatri Puja",
    date: "2026-11-17",
    category: "puja",
    emoji: "🙏",
    descriptionBn: "চন্দননগর ও কৃষ্ণনগরের বিখ্যাত উৎসব - দেবী জগদ্ধাত্রীর আরাধনা।",
    descriptionEn:
      "Especially grand in Chandannagar and Krishnanagar - the worship of Jagaddhatri, sustainer of the world.",
    lunisolar: true
  },
  {
    slug: "poush-sankranti-2027",
    nameBn: "পৌষ সংক্রান্তি",
    nameEn: "Poush Sankranti",
    date: "2027-01-15",
    category: "sankranti",
    emoji: "🌾",
    descriptionBn: "নতুন ফসল আর পিঠেপুলির উৎসব - সূর্যের মকর রাশিতে প্রবেশ।",
    descriptionEn: "The harvest festival of pithe-puli sweets, marking the sun's transit into Capricorn.",
    lunisolar: false
  },
  {
    slug: "saraswati-puja-2027",
    nameBn: "সরস্বতী পূজা",
    nameEn: "Saraswati Puja",
    date: "2027-02-11",
    category: "puja",
    emoji: "📚",
    descriptionBn: "বসন্ত পঞ্চমীতে বিদ্যার দেবীর আরাধনা - বই-খাতা আর হলুদ শাড়ির দিন।",
    descriptionEn:
      "The goddess of learning worshipped on Vasant Panchami - books, pens and yellow saris fill the day.",
    lunisolar: true
  },
  {
    slug: "dol-jatra-2027",
    nameBn: "দোলযাত্রা",
    nameEn: "Dol Jatra",
    date: "2027-03-22",
    category: "cultural",
    emoji: "🎨",
    descriptionBn: "বাংলার হোলি - আবির, দোলের গান আর রাধা-কৃষ্ণের দোলনা।",
    descriptionEn: "Bengal's Holi - colour, spring songs and the swinging of Radha-Krishna's idols.",
    lunisolar: true
  },
  {
    slug: "poila-boishakh-2027",
    nameBn: "পয়লা বৈশাখ",
    nameEn: "Poila Boishakh",
    date: "2027-04-15",
    category: "cultural",
    emoji: "🎉",
    descriptionBn: "বাংলা নববর্ষ ১৪৩৪ - হালখাতা, নতুন জামা আর মঙ্গল শোভাযাত্রা।",
    descriptionEn:
      "Bengali New Year 1434 - Halkhata ledgers, new clothes and the Mangal Shobhajatra procession.",
    lunisolar: false
  },
  {
    slug: "rabindra-jayanti-2027",
    nameBn: "রবীন্দ্র জয়ন্তী",
    nameEn: "Rabindra Jayanti",
    date: "2027-05-09",
    category: "cultural",
    emoji: "🖋️",
    descriptionBn: "২৫শে বৈশাখ - রবীন্দ্রনাথ ঠাকুরের জন্মজয়ন্তী, গান আর কবিতায় স্মরণ।",
    descriptionEn: "25 Boishakh - Rabindranath Tagore's birth anniversary, marked with song and recitation.",
    lunisolar: false
  },
  {
    slug: "jamai-shashti-2027",
    nameBn: "জামাই ষষ্ঠী",
    nameEn: "Jamai Shashti",
    date: "2027-06-10",
    category: "cultural",
    emoji: "🍽️",
    descriptionBn: "জামাইদের নিমন্ত্রণ করে ভুরিভোজে আপ্যায়নের দিন।",
    descriptionEn: "Sons-in-law are invited home and honoured with an elaborate feast.",
    lunisolar: true
  },
  {
    slug: "rath-yatra-2027",
    nameBn: "রথযাত্রা",
    nameEn: "Rath Yatra",
    date: "2027-07-05",
    category: "puja",
    emoji: "🛕",
    descriptionBn: "জগন্নাথ, বলরাম ও সুভদ্রার রথযাত্রা - রশি টেনে রথ টানার উৎসব।",
    descriptionEn:
      "The chariot festival of Jagannath, Balaram and Subhadra, pulled through the streets by devotees.",
    lunisolar: true
  },
  {
    slug: "raksha-bandhan-2027",
    nameBn: "রাখী বন্ধন",
    nameEn: "Raksha Bandhan",
    date: "2027-08-17",
    category: "cultural",
    emoji: "🧵",
    descriptionBn: "ভাই-বোনের রক্ষাসূত্র বাঁধার দিন।",
    descriptionEn: "Siblings tie protective rakhi threads and renew their bond.",
    lunisolar: true
  },
  {
    slug: "janmashtami-2027",
    nameBn: "জন্মাষ্টমী",
    nameEn: "Janmashtami",
    date: "2027-08-25",
    category: "puja",
    emoji: "🪈",
    descriptionBn: "শ্রীকৃষ্ণের জন্মতিথি - উপবাস আর মধ্যরাতের আরাধনা।",
    descriptionEn: "Krishna's birth tithi, observed with fasting and midnight worship.",
    lunisolar: true
  },
  {
    slug: "vishwakarma-puja-2027",
    nameBn: "বিশ্বকর্মা পূজা",
    nameEn: "Vishwakarma Puja",
    date: "2027-09-17",
    category: "puja",
    emoji: "🛠️",
    descriptionBn: "দেবশিল্পীর আরাধনা - কারখানা, দোকান আর যন্ত্রপাতিতে পুজো, পুজোর মরসুমের সূচনা।",
    descriptionEn:
      "The divine architect worshipped in workshops and factories - the traditional starting whistle of puja season.",
    lunisolar: false
  }
];
