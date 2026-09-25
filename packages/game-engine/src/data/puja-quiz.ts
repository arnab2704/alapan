import { FESTIVE_QUIZ_2 } from "./festive-quiz-2";
import type { QuizQuestion } from "./quiz-questions";

/**
 * Sharodiya 1433 (Durga Puja 2026) daily quiz sets: ten questions for each of Mahalaya and
 * Shashthi to Dashami. On these dates `getDailyQuiz` draws its five questions from the day's set.
 * Draft content written for Alapon - a native-speaking reviewer must check ritual and cultural
 * details before public launch (docs/compliance). Dates follow src/data/festivals.ts.
 */
type Q = [
  id: string,
  qBn: string,
  qEn: string,
  options: Array<[string, string]>,
  correct: number,
  eBn: string,
  eEn: string
];

function build(prefix: string, rows: Q[]): QuizQuestion[] {
  return rows.map(([id, questionBn, questionEn, options, correctIndex, explanationBn, explanationEn]) => ({
    id: `${prefix}-${id}`,
    category: "festival",
    questionBn,
    questionEn,
    options: options.map(([textBn, textEn]) => ({ textBn, textEn })),
    correctIndex,
    explanationBn,
    explanationEn
  }));
}

const MAHALAYA: Q[] = [
  [
    "devi-paksha",
    "মহালয়ার পরে কোন পক্ষ শুরু হয়?",
    "Which fortnight begins after Mahalaya?",
    [
      ["দেবীপক্ষ", "Devi Paksha"],
      ["পিতৃপক্ষ", "Pitru Paksha"],
      ["বসন্তপক্ষ", "Vasanta Paksha"],
      ["শীতপক্ষ", "Shita Paksha"]
    ],
    0,
    "মহালয়ায় পিতৃপক্ষ শেষ হয় আর দেবীপক্ষ শুরু হয়।",
    "Pitru Paksha ends on Mahalaya and Devi Paksha begins."
  ],
  [
    "tarpan",
    "মহালয়ার ভোরে পূর্বপুরুষদের উদ্দেশে জল নিবেদনের রীতিকে কী বলে?",
    "What is the offering of water to ancestors on Mahalaya morning called?",
    [
      ["তর্পণ", "Tarpan"],
      ["অঞ্জলি", "Anjali"],
      ["আরতি", "Aarti"],
      ["বিসর্জন", "Bisarjan"]
    ],
    0,
    "মহালয়ায় বহু মানুষ নদী বা ঘাটে গিয়ে তর্পণ করেন।",
    "On Mahalaya many people offer tarpan at a river or ghat."
  ],
  [
    "radio-voice",
    "মহালয়ার ভোরের বেতার অনুষ্ঠান 'মহিষাসুরমর্দিনী'-তে চণ্ডীপাঠের জন্য কার কণ্ঠ সবচেয়ে পরিচিত?",
    "Whose voice is best known for reciting the Chandi in the Mahalaya radio programme 'Mahishasuramardini'?",
    [
      ["বীরেন্দ্রকৃষ্ণ ভদ্র", "Birendra Krishna Bhadra"],
      ["রবীন্দ্রনাথ ঠাকুর", "Rabindranath Tagore"],
      ["স্বামী বিবেকানন্দ", "Swami Vivekananda"],
      ["কাজী নজরুল ইসলাম", "Kazi Nazrul Islam"]
    ],
    0,
    "বীরেন্দ্রকৃষ্ণ ভদ্রের কণ্ঠে চণ্ডীপাঠ বহু বাঙালির মহালয়ার ভোরের স্মৃতি।",
    "Birendra Krishna Bhadra's recitation of the Chandi is a Mahalaya-dawn memory for many Bengalis."
  ],
  [
    "chokkhudaan",
    "মহালয়ায় শিল্পীরা প্রতিমার কোন অংশ আঁকেন, যাকে চক্ষুদান বলা হয়?",
    "On Mahalaya artisans paint which part of the idol, a ritual known as Chokkhudaan?",
    [
      ["চোখ", "The eyes"],
      ["মুকুট", "The crown"],
      ["হাত", "The hands"],
      ["পা", "The feet"]
    ],
    0,
    "চক্ষুদান মানে চোখ আঁকা; প্রচলিত রীতিতে এতেই প্রতিমা যেন প্রাণ পায়।",
    "Chokkhudaan means painting the eyes; in tradition this is when the idol comes alive."
  ],
  [
    "kumartuli-city",
    "প্রতিমা গড়ার জন্য বিখ্যাত কুমোরটুলি কোন শহরে?",
    "Kumartuli, famous for making idols, is in which city?",
    [
      ["কলকাতা", "Kolkata"],
      ["কৃষ্ণনগর", "Krishnanagar"],
      ["শিলিগুড়ি", "Siliguri"],
      ["আসানসোল", "Asansol"]
    ],
    0,
    "উত্তর কলকাতার কুমোরটুলি প্রতিমা-শিল্পীদের পাড়া।",
    "Kumartuli in north Kolkata is the artisans' quarter."
  ],
  [
    "kashful",
    "শরতের আকাশের নিচে মাঠে ফোটা কোন সাদা ফুল পুজোর আগমনের ইঙ্গিত দেয়?",
    "Which white flower blooming in autumn fields signals the coming of Puja?",
    [
      ["কাশফুল", "Kash flower"],
      ["গোলাপ", "Rose"],
      ["সূর্যমুখী", "Sunflower"],
      ["রজনীগন্ধা", "Tuberose"]
    ],
    0,
    "কাশফুলের সাদা ঢেউ শরতের চেনা ছবি।",
    "The white waves of kash flowers are the familiar picture of autumn."
  ],
  [
    "amavasya",
    "মহালয়া কোন তিথিতে পালিত হয়?",
    "On which lunar day is Mahalaya observed?",
    [
      ["অমাবস্যা", "Amavasya (new moon)"],
      ["পূর্ণিমা", "Purnima (full moon)"],
      ["একাদশী", "Ekadashi"],
      ["চতুর্থী", "Chaturthi"]
    ],
    0,
    "মহালয়া অমাবস্যা তিথিতে পড়ে।",
    "Mahalaya falls on the new-moon day."
  ],
  [
    "unesco",
    "কলকাতার দুর্গাপুজো ইউনেস্কোর অধরা সাংস্কৃতিক ঐতিহ্যের তালিকায় কোন বছর স্থান পায়?",
    "In which year was Durga Puja in Kolkata inscribed on UNESCO's Intangible Cultural Heritage list?",
    [
      ["২০২১", "2021"],
      ["২০১১", "2011"],
      ["২০১৬", "2016"],
      ["২০২৪", "2024"]
    ],
    0,
    "২০২১ সালে 'কলকাতার দুর্গাপুজো' ইউনেস্কোর তালিকাভুক্ত হয়।",
    "'Durga Puja in Kolkata' was inscribed in 2021."
  ],
  [
    "chandi",
    "'যা দেবী সর্বভূতেষু' স্তোত্রটি কোন গ্রন্থের অংশ?",
    "The hymn 'Ya Devi Sarvabhuteshu' is part of which text?",
    [
      ["চণ্ডী (দেবীমাহাত্ম্য)", "Chandi (Devi Mahatmya)"],
      ["গীতাঞ্জলি", "Gitanjali"],
      ["আনন্দমঠ", "Anandamath"],
      ["মেঘনাদবধ কাব্য", "Meghnad Badh Kavya"]
    ],
    0,
    "স্তোত্রটি চণ্ডী বা দেবীমাহাত্ম্যের অংশ।",
    "The hymn belongs to the Chandi, also called the Devi Mahatmya."
  ],
  [
    "agomoni",
    "দেবীর আগমনের আনন্দ নিয়ে গাওয়া গানকে কী বলে?",
    "What are songs about the joyful arrival of the goddess called?",
    [
      ["আগমনী", "Agomoni"],
      ["বাউল", "Baul"],
      ["ভাটিয়ালি", "Bhatiali"],
      ["কীর্তন", "Kirtan"]
    ],
    0,
    "আগমনী গানে কন্যা উমার বাপের বাড়ি ফেরার অপেক্ষা ফুটে ওঠে।",
    "Agomoni songs express the wait for daughter Uma's homecoming."
  ]
];

const SHASHTHI: Q[] = [
  [
    "bodhon",
    "ষষ্ঠীর সন্ধ্যায় দেবীকে জাগানোর অনুষ্ঠানকে কী বলে?",
    "What is the evening ritual of awakening the goddess on Shashthi called?",
    [
      ["বোধন", "Bodhon"],
      ["বিসর্জন", "Bisarjan"],
      ["সিঁদুর খেলা", "Sindoor Khela"],
      ["কুমারী পুজো", "Kumari Puja"]
    ],
    0,
    "বোধন মানে জাগরণ; ষষ্ঠীতে দেবীর বোধন হয়।",
    "Bodhon means awakening; the goddess is awakened on Shashthi."
  ],
  [
    "arms",
    "প্রচলিত প্রতিমায় দুর্গার কয়টি হাত দেখানো হয়?",
    "How many arms does Durga usually have in the traditional idol?",
    [
      ["দশ", "Ten"],
      ["চার", "Four"],
      ["ছয়", "Six"],
      ["বারো", "Twelve"]
    ],
    0,
    "তিনি দশভুজা।",
    "She is Dashabhuja, the ten-armed."
  ],
  [
    "lion",
    "দুর্গার বাহন কোন প্রাণী?",
    "Which animal is Durga's mount?",
    [
      ["সিংহ", "Lion"],
      ["ময়ূর", "Peacock"],
      ["হাতি", "Elephant"],
      ["পেঁচা", "Owl"]
    ],
    0,
    "সিংহ দুর্গার বাহন।",
    "The lion is Durga's mount."
  ],
  [
    "mahishasura",
    "পুজোয় দুর্গা কোন অসুরকে বধ করছেন এমন রূপে পূজিত হন?",
    "Durga is worshipped in the form slaying which asura?",
    [
      ["মহিষাসুর", "Mahishasura"],
      ["রাবণ", "Ravana"],
      ["কংস", "Kamsa"],
      ["হিরণ্যকশিপু", "Hiranyakashipu"]
    ],
    0,
    "মহিষাসুরমর্দিনী রূপেই দেবী পূজিত হন।",
    "She is worshipped as Mahishasuramardini."
  ],
  [
    "not-in-family",
    "বাঙালি ঘরানার একচালার প্রতিমায় সাধারণত কাকে দেখা যায় না?",
    "Who is not usually seen in the traditional Bengali family tableau of the idol?",
    [
      ["হনুমান", "Hanuman"],
      ["গণেশ", "Ganesha"],
      ["কার্তিক", "Kartik"],
      ["সরস্বতী", "Saraswati"]
    ],
    0,
    "দুর্গার সঙ্গে সাধারণত লক্ষ্মী, সরস্বতী, গণেশ ও কার্তিক থাকেন।",
    "Lakshmi, Saraswati, Ganesha and Kartik usually accompany Durga."
  ],
  [
    "chalchitra",
    "প্রতিমার পেছনের অর্ধবৃত্তাকার সাজানো কাঠামোকে কী বলে?",
    "What is the decorated arched backdrop behind the idol called?",
    [
      ["চালচিত্র", "Chalchitra"],
      ["আলপনা", "Alpona"],
      ["তোরণ", "Toran"],
      ["মুকুট", "Mukut"]
    ],
    0,
    "চালচিত্রে দেবদেবীর ছবি আঁকা থাকে।",
    "The chalchitra carries painted images of deities."
  ],
  [
    "mandap",
    "পুজোর প্রতিমা রাখার অস্থায়ী সাজানো কাঠামোকে কী বলে?",
    "What is the temporary decorated structure that houses the idol called?",
    [
      ["মণ্ডপ", "Mandap (pandal)"],
      ["মিনার", "Minar"],
      ["গম্বুজ", "Gombuj"],
      ["বারান্দা", "Baranda"]
    ],
    0,
    "মণ্ডপ বা প্যান্ডেলে প্রতিমা প্রতিষ্ঠিত হয়।",
    "The idol is installed in the mandap or pandal."
  ],
  [
    "dhak",
    "পুজোর প্রধান বাদ্যযন্ত্র কোনটি?",
    "Which is the signature musical instrument of Puja?",
    [
      ["ঢাক", "Dhak"],
      ["সেতার", "Sitar"],
      ["বাঁশি", "Flute"],
      ["একতারা", "Ektara"]
    ],
    0,
    "ঢাকের বোল পুজোর আবহ তৈরি করে।",
    "The beat of the dhak creates the mood of Puja."
  ],
  [
    "dhunuchi",
    "ধুনুচি কী?",
    "What is a dhunuchi?",
    [
      ["ধুনো পোড়ানোর মাটির পাত্র", "A clay incense burner"],
      ["ঢাকের কাঠি", "A dhak stick"],
      ["শাঁখ", "A conch"],
      ["প্রদীপ-স্ট্যান্ড", "A lamp stand"]
    ],
    0,
    "ধুনুচিতে ধুনো জ্বালিয়ে আরতি হয়।",
    "Incense is burned in the dhunuchi during aarti."
  ],
  [
    "after-shashthi",
    "ষষ্ঠীর পরের দিন কোনটি?",
    "Which day comes after Shashthi?",
    [
      ["সপ্তমী", "Saptami"],
      ["অষ্টমী", "Ashtami"],
      ["নবমী", "Nabami"],
      ["দশমী", "Dashami"]
    ],
    0,
    "ষষ্ঠীর পর সপ্তমী, তারপর অষ্টমী, নবমী ও দশমী।",
    "After Shashthi come Saptami, Ashtami, Nabami and Dashami."
  ]
];

const SAPTAMI: Q[] = [
  [
    "kolabou",
    "কলাবউ কী?",
    "What is the Kolabou?",
    [
      ["শাড়ি-পরানো কলাগাছ", "A banana plant dressed in a sari"],
      ["একটি গান", "A song"],
      ["একটি মিষ্টি", "A sweet"],
      ["ঢাকের বোল", "A dhak rhythm"]
    ],
    0,
    "কলাবউ নবপত্রিকার অংশ; কলাগাছকে শাড়ি পরিয়ে সাজানো হয়।",
    "The Kolabou is part of the Nabapatrika, a banana plant draped in a sari."
  ],
  [
    "nabapatrika",
    "নবপত্রিকা বলতে কী বোঝায়?",
    "What does Nabapatrika refer to?",
    [
      ["নয়টি গাছের সমষ্টি", "A bundle of nine plants"],
      ["নয়টি প্রদীপ", "Nine lamps"],
      ["নয়টি ফুল", "Nine flowers"],
      ["নয়টি ঢাক", "Nine dhaks"]
    ],
    0,
    "নব মানে নয়; নবপত্রিকায় নয় রকম গাছ একসঙ্গে বাঁধা হয়।",
    "Nava means nine; nine kinds of plants are tied together."
  ],
  [
    "snan",
    "সপ্তমীর ভোরে কলাবউকে সাধারণত কোথায় স্নান করানো হয়?",
    "Where is the Kolabou traditionally bathed on Saptami morning?",
    [
      ["নদীতে (গঙ্গায়)", "In a river (the Ganga)"],
      ["পুকুরের ধারে ঘরে", "At home in a tub"],
      ["সমুদ্রে", "In the sea"],
      ["কুয়োয়", "At a well"]
    ],
    0,
    "প্রচলিত রীতিতে নদীর জলে কলাবউয়ের স্নান হয়।",
    "By custom the Kolabou is bathed in river water."
  ],
  [
    "shankh",
    "শুভ মুহূর্তে যে বাদ্যটি ফুঁ দিয়ে বাজানো হয়, তা কোন জিনিস দিয়ে তৈরি?",
    "The instrument blown at auspicious moments is made from what?",
    [
      ["শঙ্খ (শামুকের খোল)", "Conch shell"],
      ["বাঁশ", "Bamboo"],
      ["পিতল", "Brass sheet"],
      ["কাঠ", "Wood"]
    ],
    0,
    "শাঁখ শঙ্খের খোল দিয়ে তৈরি।",
    "The shankh is made from a conch shell."
  ],
  [
    "ulu",
    "উলুধ্বনি কী?",
    "What is ulu-dhwani?",
    [
      ["শুভ কাজে মেয়েদের উঁচু স্বরে ধ্বনি", "A high-pitched auspicious call made by women"],
      ["একটি নাচ", "A dance"],
      ["একটি ফুল", "A flower"],
      ["একটি খাবার", "A food"]
    ],
    0,
    "শুভ মুহূর্তে জিভ নেড়ে উলুধ্বনি দেওয়া হয়।",
    "It is sounded at auspicious moments."
  ],
  [
    "prana",
    "মন্ত্র পড়ে প্রতিমায় দেবীর উপস্থিতি আহ্বানের ক্রিয়াকে কী বলে?",
    "What is the ritual invoking the goddess's presence in the idol called?",
    [
      ["প্রাণপ্রতিষ্ঠা", "Pran Pratishtha"],
      ["বিসর্জন", "Bisarjan"],
      ["আরতি", "Aarti"],
      ["ভোগ", "Bhog"]
    ],
    0,
    "প্রাণপ্রতিষ্ঠায় প্রতিমা পূজার যোগ্য হয়ে ওঠে বলে বিশ্বাস।",
    "Through it the idol is believed to become ready for worship."
  ],
  [
    "new-clothes",
    "পুজোর আগে বাঙালি পরিবারে কোন কেনাকাটা প্রায় রীতি?",
    "Which shopping is almost a custom in Bengali families before Puja?",
    [
      ["নতুন জামাকাপড়", "New clothes"],
      ["নতুন গাড়ি", "A new car"],
      ["নতুন বই", "A new book only"],
      ["নতুন জুতো শুধু", "Only new shoes"]
    ],
    0,
    "পুজোর জামাকাপড় কেনা উৎসবের আনন্দের অংশ।",
    "Buying Puja clothes is part of the festive joy."
  ],
  [
    "season",
    "দুর্গাপুজো বাংলার কোন ঋতুতে হয়?",
    "In which Bengali season is Durga Puja held?",
    [
      ["শরৎ", "Sharat (autumn)"],
      ["বসন্ত", "Basanta (spring)"],
      ["বর্ষা", "Barsha (monsoon)"],
      ["শীত", "Sheet (winter)"]
    ],
    0,
    "শরতে হয় বলে একে শারদীয়া বলা হয়।",
    "It is held in autumn, hence 'Sharodiya'."
  ],
  [
    "month",
    "দুর্গাপুজো সাধারণত বাংলা কোন মাসে পড়ে?",
    "In which Bengali month does Durga Puja usually fall?",
    [
      ["আশ্বিন", "Ashwin"],
      ["বৈশাখ", "Boishakh"],
      ["পৌষ", "Poush"],
      ["ফাল্গুন", "Falgun"]
    ],
    0,
    "শারদীয়া দুর্গাপুজো আশ্বিন মাসে।",
    "Sharodiya Durga Puja falls in Ashwin."
  ],
  [
    "saptami-day",
    "মূল পুজোর প্রথম দিন কোনটি ধরা হয়?",
    "Which day is counted as the first day of the main Puja?",
    [
      ["সপ্তমী", "Saptami"],
      ["দশমী", "Dashami"],
      ["নবমী", "Nabami"],
      ["অষ্টমী", "Ashtami"]
    ],
    0,
    "সপ্তমী থেকে দশমী পর্যন্ত মূল পুজো, এর আগে ষষ্ঠীতে বোধন।",
    "The main Puja runs Saptami to Dashami, preceded by Bodhon on Shashthi."
  ]
];

const ASHTAMI: Q[] = [
  [
    "anjali",
    "অষ্টমীর সকালে মন্ত্রসহ ফুল নিবেদন করাকে কী বলে?",
    "What is offering flowers with mantras on Ashtami morning called?",
    [
      ["অঞ্জলি", "Anjali"],
      ["তর্পণ", "Tarpan"],
      ["বরণ", "Boron"],
      ["বিসর্জন", "Bisarjan"]
    ],
    0,
    "অষ্টমীর অঞ্জলি বহু মানুষের কাছে পুজোর সবচেয়ে প্রিয় স্মৃতি।",
    "The Ashtami anjali is a favourite Puja memory for many."
  ],
  [
    "sandhi",
    "সন্ধিপুজো কোন দুই তিথির সন্ধিক্ষণে হয়?",
    "Sandhi Puja is held at the juncture of which two tithis?",
    [
      ["অষ্টমী ও নবমী", "Ashtami and Nabami"],
      ["ষষ্ঠী ও সপ্তমী", "Shashthi and Saptami"],
      ["নবমী ও দশমী", "Nabami and Dashami"],
      ["সপ্তমী ও অষ্টমী", "Saptami and Ashtami"]
    ],
    0,
    "অষ্টমী শেষ ও নবমী শুরুর সন্ধিক্ষণে সন্ধিপুজো।",
    "Sandhi Puja marks the moment Ashtami ends and Nabami begins."
  ],
  [
    "108",
    "সন্ধিপুজোয় প্রচলিত রীতিতে কয়টি প্রদীপ জ্বালানো হয়?",
    "How many lamps are traditionally lit during Sandhi Puja?",
    [
      ["১০৮", "108"],
      ["৯", "9"],
      ["৫১", "51"],
      ["১০০০", "1000"]
    ],
    0,
    "১০৮টি প্রদীপ জ্বালানোর প্রথা প্রচলিত।",
    "Lighting 108 lamps is the customary practice."
  ],
  [
    "kumari",
    "কুমারী পুজোয় কাকে দেবীরূপে পুজো করা হয়?",
    "In Kumari Puja, whom is worshipped as the goddess?",
    [
      ["একটি অল্পবয়সী মেয়েকে", "A young girl"],
      ["একজন সন্ন্যাসীকে", "A monk"],
      ["একটি গাছকে", "A tree"],
      ["একটি পাথরকে", "A stone"]
    ],
    0,
    "কুমারী পুজোয় একটি অল্পবয়সী মেয়েকে দেবীর রূপ ভেবে পুজো করা হয়।",
    "A young girl is worshipped as a form of the goddess."
  ],
  [
    "belur",
    "বেলুড় মঠে কুমারী পুজো সাধারণত কোন দিনে হয়?",
    "On which day is Kumari Puja usually held at Belur Math?",
    [
      ["অষ্টমী", "Ashtami"],
      ["ষষ্ঠী", "Shashthi"],
      ["মহালয়া", "Mahalaya"],
      ["দশমী", "Dashami"]
    ],
    0,
    "রামকৃষ্ণ মিশনের বেলুড় মঠের কুমারী পুজো অষ্টমীতে হয়।",
    "Belur Math's Kumari Puja is held on Ashtami."
  ],
  [
    "bhog",
    "দেবীকে নিবেদন করে ভক্তদের মধ্যে বিতরণ করা খাবারকে কী বলে?",
    "What is food offered to the goddess and then shared with devotees called?",
    [
      ["ভোগ", "Bhog"],
      ["বরণ", "Boron"],
      ["বোধন", "Bodhon"],
      ["তর্পণ", "Tarpan"]
    ],
    0,
    "ভোগ নিবেদনের পর ভাগ করে খাওয়া হয়; খিচুড়ি তার জনপ্রিয় রূপ।",
    "Bhog is shared after being offered; khichuri is a popular form."
  ],
  [
    "aarti",
    "ধুনুচি নাচ কোন অনুষ্ঠানের সময় হয়?",
    "During which ritual is the dhunuchi dance performed?",
    [
      ["আরতি", "Aarti"],
      ["তর্পণ", "Tarpan"],
      ["অন্নপ্রাশন", "Annaprashan"],
      ["গৃহপ্রবেশ", "Griha Pravesh"]
    ],
    0,
    "সন্ধ্যা-আরতিতে ঢাকের তালে ধুনুচি নাচ হয়।",
    "The dhunuchi dance accompanies the evening aarti to the dhak's beat."
  ],
  [
    "dhaki",
    "যিনি ঢাক বাজান তাঁকে কী বলা হয়?",
    "What is a dhak player called?",
    [
      ["ঢাকি", "Dhaki"],
      ["মাঝি", "Majhi"],
      ["কবিয়াল", "Kabiyal"],
      ["ঘটক", "Ghatak"]
    ],
    0,
    "ঢাকি ঢাকের বোল তোলেন।",
    "The dhaki plays the rhythms of the dhak."
  ],
  [
    "ashtami-order",
    "অষ্টমীর পরের দিন কোনটি?",
    "Which day follows Ashtami?",
    [
      ["নবমী", "Nabami"],
      ["সপ্তমী", "Saptami"],
      ["ষষ্ঠী", "Shashthi"],
      ["একাদশী", "Ekadashi"]
    ],
    0,
    "অষ্টমীর পরে নবমী, তারপর দশমী।",
    "Nabami follows Ashtami, then Dashami."
  ],
  [
    "pushpa",
    "অঞ্জলিতে সাধারণত কী দেওয়া হয়?",
    "What is usually offered in the anjali?",
    [
      ["ফুল ও বেলপাতা", "Flowers and bel leaves"],
      ["শুধু জল", "Only water"],
      ["ধান", "Only rice"],
      ["কাগজ", "Paper"]
    ],
    0,
    "অঞ্জলিতে ফুল ও বেলপাতা দেওয়া হয়।",
    "Flowers and bel leaves are offered."
  ]
];

const NABAMI: Q[] = [
  [
    "last-main-day",
    "মূল পুজোর শেষ দিন কোনটি?",
    "Which is the last day of the main Puja?",
    [
      ["দশমী", "Dashami"],
      ["নবমী", "Nabami"],
      ["অষ্টমী", "Ashtami"],
      ["সপ্তমী", "Saptami"]
    ],
    0,
    "নবমীর পর দশমীতে বিজয়া ও বিসর্জন।",
    "After Nabami comes Dashami with Bijoya and immersion."
  ],
  [
    "priest",
    "পুজো যিনি পরিচালনা করেন তাঁকে কী বলে?",
    "What is the person who conducts the Puja called?",
    [
      ["পুরোহিত", "Purohit (priest)"],
      ["ঢাকি", "Dhaki"],
      ["কুমোর", "Kumor (potter)"],
      ["মাঝি", "Majhi"]
    ],
    0,
    "পুরোহিত মন্ত্র পড়ে পুজো করেন।",
    "The purohit recites the mantras and performs the rites."
  ],
  [
    "clay",
    "প্রতিমা গড়ার মাটি প্রচলিত রীতিতে প্রধানত কোথা থেকে আনা হয়?",
    "Where is clay for idols traditionally sourced mainly from?",
    [
      ["গঙ্গার তীর", "The banks of the Ganga"],
      ["পাহাড়", "Hills"],
      ["মরুভূমি", "Desert"],
      ["সমুদ্রতট", "Seashore"]
    ],
    0,
    "গঙ্গামাটি প্রতিমা গড়ায় প্রচলিত।",
    "Ganga clay is customary for making idols."
  ],
  [
    "barowari",
    "বারোয়ারি পুজো বলতে কী বোঝায়?",
    "What does barowari puja mean?",
    [
      ["সবাই মিলে চাঁদা তুলে করা পুজো", "A puja organised collectively by a community"],
      ["শুধু বাড়ির পুজো", "Only a home puja"],
      ["বারো দিনের পুজো", "A twelve-day puja"],
      ["বিদেশে পুজো", "A puja abroad"]
    ],
    0,
    "বারোয়ারি মানে পাড়ার সবার সম্মিলিত আয়োজন।",
    "Barowari means a collective community arrangement."
  ],
  [
    "thakur-dekha",
    "'ঠাকুর দেখা' বলতে সাধারণত কী বোঝায়?",
    "What does 'thakur dekha' usually mean?",
    [
      ["বিভিন্ন মণ্ডপ ঘুরে প্রতিমা দেখা", "Visiting pandals to see the idols"],
      ["বই পড়া", "Reading books"],
      ["ঘুমোনো", "Sleeping"],
      ["রান্না করা", "Cooking"]
    ],
    0,
    "ঠাকুর দেখা পুজোর আনন্দের বড় অংশ।",
    "Thakur dekha is a big part of the festive joy."
  ],
  [
    "chandannagar",
    "হুগলি জেলার কোন শহর পুজোর আলোকসজ্জার জন্য বিখ্যাত?",
    "Which town in Hooghly district is famous for Puja lighting decorations?",
    [
      ["চন্দননগর", "Chandannagar"],
      ["দার্জিলিং", "Darjeeling"],
      ["বহরমপুর", "Berhampore"],
      ["বাঁকুড়া", "Bankura"]
    ],
    0,
    "চন্দননগরের আলোর কাজ দেশজুড়ে পরিচিত।",
    "Chandannagar's light work is known widely."
  ],
  [
    "luchi",
    "লুচি কী দিয়ে তৈরি?",
    "What is luchi made from?",
    [
      ["ময়দা", "Refined wheat flour"],
      ["চাল", "Rice"],
      ["ডাল", "Lentils"],
      ["আলু", "Potato"]
    ],
    0,
    "লুচি ময়দার ফোলা ভাজা রুটি।",
    "Luchi is a puffed deep-fried bread of refined flour."
  ],
  [
    "payesh",
    "পায়েস কী?",
    "What is payesh?",
    [
      ["দুধ-চালের মিষ্টি", "A sweet milk-and-rice dish"],
      ["একটি মাছ", "A fish"],
      ["একটি ডাল", "A dal"],
      ["একটি আচার", "A pickle"]
    ],
    0,
    "পায়েস দুধ, চাল আর গুড় বা চিনিতে তৈরি।",
    "Payesh is made from milk, rice and jaggery or sugar."
  ],
  [
    "khichuri",
    "ভোগের খিচুড়ি প্রধানত কোন দুই উপাদানে তৈরি?",
    "Which two ingredients mainly make bhog khichuri?",
    [
      ["চাল ও ডাল", "Rice and lentils"],
      ["আটা ও চিনি", "Flour and sugar"],
      ["আলু ও মাছ", "Potato and fish"],
      ["দুধ ও ছানা", "Milk and chhana"]
    ],
    0,
    "খিচুড়ি চাল আর ডালের মিশ্রণ।",
    "Khichuri is a mix of rice and lentils."
  ],
  [
    "nabami-order",
    "নবমীর পরের দিন কোনটি?",
    "Which day follows Nabami?",
    [
      ["দশমী", "Dashami"],
      ["একাদশী", "Ekadashi"],
      ["অষ্টমী", "Ashtami"],
      ["ষষ্ঠী", "Shashthi"]
    ],
    0,
    "নবমীর পর দশমী।",
    "Dashami follows Nabami."
  ]
];

const DASHAMI: Q[] = [
  [
    "sindoor-khela",
    "দশমীতে বিবাহিত মহিলারা পরস্পরকে সিঁদুর পরান - এই রীতিকে কী বলে?",
    "On Dashami married women smear vermilion on each other. What is this called?",
    [
      ["সিঁদুর খেলা", "Sindoor Khela"],
      ["আলপনা", "Alpona"],
      ["হালখাতা", "Halkhata"],
      ["পুণ্যাহ", "Punyaho"]
    ],
    0,
    "সিঁদুর খেলা দশমীর আগে বা বিসর্জনের সময় হয়।",
    "Sindoor Khela is held around the farewell on Dashami."
  ],
  [
    "boron",
    "দশমীতে দেবীকে পান, মিষ্টি ও সিঁদুর দিয়ে বিদায় জানানোর রীতিকে কী বলে?",
    "What is the ritual of bidding the goddess farewell with betel leaf, sweets and vermilion called?",
    [
      ["বরণ", "Boron"],
      ["বোধন", "Bodhon"],
      ["অঞ্জলি", "Anjali"],
      ["তর্পণ", "Tarpan"]
    ],
    0,
    "বরণ দিয়ে দেবীকে বিদায় জানানো হয়।",
    "Devotees bid farewell to the goddess with boron."
  ],
  [
    "bisarjan",
    "প্রতিমা জলে ভাসানোকে কী বলে?",
    "What is immersing the idol in water called?",
    [
      ["বিসর্জন", "Bisarjan"],
      ["বোধন", "Bodhon"],
      ["আরতি", "Aarti"],
      ["প্রতিষ্ঠা", "Pratishtha"]
    ],
    0,
    "দশমীতে প্রতিমার বিসর্জন হয়।",
    "The idol is immersed on Dashami."
  ],
  [
    "greeting",
    "বিজয়ায় বাঙালিরা পরস্পরকে কী বলে শুভেচ্ছা জানান?",
    "What greeting do Bengalis exchange on Bijoya?",
    [
      ["শুভ বিজয়া", "Shubho Bijoya"],
      ["শুভ নববর্ষ", "Shubho Noboborsho"],
      ["শুভ জন্মদিন", "Happy birthday"],
      ["শুভ যাত্রা", "Bon voyage"]
    ],
    0,
    "'শুভ বিজয়া' দশমীর চেনা শুভেচ্ছা।",
    "'Shubho Bijoya' is the familiar Dashami greeting."
  ],
  [
    "pronam",
    "বিজয়ার দিন ছোটরা বড়দের কী করে?",
    "What do younger people do to elders on Bijoya?",
    [
      ["প্রণাম", "Pranam (touch feet respectfully)"],
      ["ঝগড়া", "Quarrel"],
      ["পালিয়ে যায়", "Run away"],
      ["গান শোনায় শুধু", "Only sing"]
    ],
    0,
    "বড়দের প্রণাম আর আশীর্বাদ বিজয়ার রীতি।",
    "Pranam and blessings from elders are a Bijoya custom."
  ],
  [
    "kolakuli",
    "বিজয়ায় বন্ধু-আত্মীয়ের বুকে বুক মেলানো আলিঙ্গনকে কী বলে?",
    "What is the Bijoya embrace among friends and relatives called?",
    [
      ["কোলাকুলি", "Kolakuli"],
      ["সাঁতার", "Shantar"],
      ["ডুব", "Dub"],
      ["লুকোচুরি", "Lukochuri"]
    ],
    0,
    "কোলাকুলি ও মিষ্টিমুখ বিজয়ার আনন্দ।",
    "Kolakuli and sweets are the joy of Bijoya."
  ],
  [
    "victory",
    "বিজয়া দশমী কোন ঘটনার স্মরণে?",
    "Bijoya Dashami commemorates which event?",
    [
      ["দেবী দুর্গার মহিষাসুর-বিজয়", "Durga's victory over Mahishasura"],
      ["বর্ষার শুরু", "The start of monsoon"],
      ["নববর্ষ", "New Year"],
      ["ফসল কাটা", "The harvest"]
    ],
    0,
    "শুভশক্তির জয় হিসেবে বিজয়া পালিত হয়।",
    "Bijoya celebrates the victory of good."
  ],
  [
    "sammilani",
    "বিজয়ার পরে আত্মীয়-বন্ধুদের মিলনের আসরকে কী বলে?",
    "What is the get-together of friends and relatives after Bijoya called?",
    [
      ["বিজয়া সম্মিলনী", "Bijoya Sammilani"],
      ["পিকনিক", "Picnic"],
      ["হালখাতা", "Halkhata"],
      ["নবান্ন", "Nabanna"]
    ],
    0,
    "বিজয়া সম্মিলনীতে মিষ্টি ও গান-গল্প হয়।",
    "Sweets, songs and conversation fill the Bijoya Sammilani."
  ],
  [
    "lakshmi",
    "দশমীর কয়েক দিন পরের পূর্ণিমায় কোন পুজো হয়?",
    "Which puja is held on the full moon a few days after Dashami?",
    [
      ["কোজাগরী লক্ষ্মীপুজো", "Kojagari Lakshmi Puja"],
      ["সরস্বতী পুজো", "Saraswati Puja"],
      ["দোলযাত্রা", "Dol Jatra"],
      ["রথযাত্রা", "Rath Yatra"]
    ],
    0,
    "কোজাগরী পূর্ণিমায় লক্ষ্মীপুজো হয়।",
    "Lakshmi Puja is held on the Kojagari full moon."
  ],
  [
    "abar-hobe",
    "'আসছে বছর আবার হবে' - এর অর্থ কী?",
    "What does 'Aschhe bochhor abar hobe' mean?",
    [
      ["আসছে বছর আবার পুজো হবে", "Next year, Puja will come again"],
      ["আজ বৃষ্টি হবে", "It will rain today"],
      ["কাল ছুটি", "Holiday tomorrow"],
      ["বই পড়ব", "I will read"]
    ],
    0,
    "বিসর্জনের সময় এই কথায় দেবীকে আবার আসার আহ্বান জানানো হয়।",
    "At immersion this call invites the goddess to return."
  ]
];

/** Keyed by ISO date (yyyy-mm-dd). Includes the countdown and post-Puja festival sets. */
export const PUJA_QUIZ: Record<string, QuizQuestion[]> = {
  ...FESTIVE_QUIZ_2,
  "2026-10-10": build("puja-mahalaya", MAHALAYA),
  "2026-10-17": build("puja-shashthi", SHASHTHI),
  "2026-10-18": build("puja-saptami", SAPTAMI),
  "2026-10-19": build("puja-ashtami", ASHTAMI),
  "2026-10-20": build("puja-nabami", NABAMI),
  "2026-10-21": build("puja-dashami", DASHAMI)
};
