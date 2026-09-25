export type WordCategory =
  | "mind"
  | "nature"
  | "food"
  | "family"
  | "festival"
  | "learning"
  | "arts"
  | "time"
  | "society"
  | "place"
  | "spirit";

export interface WordEntry {
  word: string;
  /** Latin-script pronunciation guide. */
  pronunciation: string;
  meaningBn: string;
  meaningEn: string;
  /** 1 (everyday, short) to 5 (long, conjunct-heavy or literary). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: WordCategory;
  relatedWords: string[];
  exampleBn: string;
  exampleEn: string;
  /** A short cultural or contextual story, when there is a good one. */
  culturalNote?: { bn: string; en: string };
  /** Where usage differs, stated neutrally. */
  region?: { bn: string; en: string };
  source: string;
}

import { KARTIK_ROWS } from "./word-bank-kartik";
import { PUJA_ROWS } from "./word-bank-puja";
import { VOCAB_ROWS } from "./word-bank-vocab";

const SOURCE = "Alapon editorial";

type Row = [
  word: string,
  pronunciation: string,
  meaningBn: string,
  meaningEn: string,
  difficulty: 1 | 2 | 3 | 4 | 5,
  category: WordCategory,
  related: string[],
  exampleBn: string,
  exampleEn: string,
  noteBn?: string,
  noteEn?: string
];

const ROWS: Row[] = [
  [
    "আকাশ",
    "akash",
    "পৃথিবীর উপরে দেখা যায় যে খোলা শূন্যতা",
    "the sky",
    1,
    "nature",
    ["মেঘ", "তারা", "সূর্য"],
    "আকাশে মেঘ জমেছে।",
    "Clouds have gathered in the sky.",
    "শরতের নীল আকাশে সাদা মেঘ আর কাশফুল - পুজো আসার খবর।",
    "The blue autumn sky with white clouds and kash grass is the sign that Puja is near."
  ],
  [
    "আশা",
    "asha",
    "ভবিষ্যতে ভালো কিছু হওয়ার ভরসা",
    "hope",
    1,
    "mind",
    ["স্বপ্ন", "ভরসা"],
    "কাল ভালো কিছু হবে, এই আশায় সে ঘুমোল।",
    "He slept in the hope that tomorrow would be better."
  ],
  [
    "আম",
    "am",
    "গ্রীষ্মের প্রিয় রসালো ফল",
    "mango",
    1,
    "food",
    ["ফল", "বাগান"],
    "বাগানের আম পেকেছে।",
    "The mangoes in the orchard have ripened.",
    "গ্রীষ্মের আমবাগান আর আমসত্ত্ব বাঙালির শৈশবস্মৃতির অংশ।",
    "Summer orchards and sun-dried mango sheets are part of many Bengali childhoods."
  ],
  [
    "আশীর্বাদ",
    "ashirbad",
    "গুরুজনের শুভকামনা",
    "a blessing",
    3,
    "spirit",
    ["প্রণাম", "প্রসাদ"],
    "ঠাকুমা মাথায় হাত রেখে আশীর্বাদ করলেন।",
    "Grandmother blessed her with a hand on her head.",
    "বিজয়া দশমীতে বড়দের প্রণাম করে আশীর্বাদ নেওয়ার রীতি আছে।",
    "On Bijoya Dashami it is customary to bow to elders and receive their blessing."
  ],
  [
    "আশ্বিন",
    "ashshin",
    "বাংলা বছরের ষষ্ঠ মাস",
    "Ashwin, the sixth month of the Bengali year",
    3,
    "time",
    ["শরৎ", "বৈশাখ", "ফাল্গুন"],
    "আশ্বিনের শুরুতেই পুজোর আমেজ।",
    "The festive mood begins early in Ashwin.",
    "শারদীয়া দুর্গাপূজা সাধারণত আশ্বিন বা কার্তিক মাসে পড়ে।",
    "Autumn Durga Puja usually falls in Ashwin or Kartik."
  ],
  [
    "অন্ধকার",
    "ondhokar",
    "আলোর অভাব",
    "darkness",
    2,
    "nature",
    ["আলো", "রাত"],
    "ঘরে অন্ধকার নেমে এল।",
    "Darkness fell over the room."
  ],
  [
    "অভিজ্ঞতা",
    "obhiggota",
    "কাজ বা দেখা-শোনা থেকে পাওয়া জ্ঞান",
    "experience",
    3,
    "learning",
    ["জ্ঞান", "শিক্ষা"],
    "এই কাজে তাঁর অনেক অভিজ্ঞতা।",
    "She has a lot of experience in this work."
  ],
  [
    "অসাধারণ",
    "osharon",
    "যা সাধারণ নয়, বিশেষ",
    "extraordinary",
    3,
    "mind",
    ["প্রশংসা"],
    "গানটি ছিল অসাধারণ।",
    "The song was extraordinary."
  ],
  [
    "আদর্শ",
    "adorsho",
    "অনুসরণযোগ্য নীতি বা নমুনা",
    "an ideal, a model",
    3,
    "society",
    ["সত্য", "শিক্ষা"],
    "তিনি আমাদের কাছে এক আদর্শ শিক্ষক।",
    "To us he is an ideal teacher."
  ],
  [
    "আরোগ্য",
    "arogyo",
    "রোগমুক্তি, সুস্থতা",
    "recovery, good health",
    3,
    "society",
    ["সুখ", "স্বাস্থ্য"],
    "আরোগ্য কামনা করি।",
    "I wish you a speedy recovery."
  ],
  [
    "আত্মা",
    "atta",
    "দেহের ভেতরের চেতন সত্তা, প্রাণ",
    "the soul, the self",
    3,
    "spirit",
    ["ধ্যান", "ধর্ম"],
    "গানটি আত্মাকে ছুঁয়ে যায়।",
    "The song touches the soul."
  ],
  [
    "উল্লাস",
    "ullash",
    "প্রবল আনন্দ",
    "jubilation",
    3,
    "mind",
    ["আনন্দ", "হাসি"],
    "জয়ের উল্লাসে সবাই মেতে উঠল।",
    "Everyone erupted in joy at the win."
  ],
  [
    "কন্যা",
    "konna",
    "মেয়ে",
    "a daughter",
    2,
    "family",
    ["দিদি", "মা"],
    "তাঁর একমাত্র কন্যা ডাক্তার।",
    "Her only daughter is a doctor."
  ],
  [
    "কলম",
    "kolom",
    "লেখার যন্ত্র",
    "a pen",
    1,
    "learning",
    ["খাতা", "বই"],
    "কলমে কালি ফুরিয়ে গেছে।",
    "The pen has run out of ink."
  ],
  [
    "কল্পনা",
    "kolpona",
    "মনে মনে ছবি গড়ে তোলার ক্ষমতা",
    "imagination",
    3,
    "mind",
    ["স্বপ্ন", "গল্প"],
    "শিশুদের কল্পনা সীমাহীন।",
    "Children's imagination knows no limits."
  ],
  [
    "কষ্ট",
    "koshto",
    "শারীরিক বা মানসিক দুঃখ",
    "hardship, pain",
    2,
    "mind",
    ["দুঃখ", "ত্যাগ"],
    "অনেক কষ্ট করে সে পড়াশোনা শেষ করেছে।",
    "She finished her studies after great hardship."
  ],
  [
    "কাজ",
    "kaj",
    "কর্ম, করণীয় বিষয়",
    "work, a task",
    1,
    "society",
    ["কর্ম", "সময়"],
    "আজ অনেক কাজ আছে।",
    "There is a lot of work today."
  ],
  [
    "কৃষক",
    "krishok",
    "যিনি চাষ করেন",
    "a farmer",
    2,
    "society",
    ["ধান", "মাঠ"],
    "কৃষক মাঠে ধান কাটছেন।",
    "The farmer is harvesting rice in the field.",
    "নবান্ন - নতুন ধান ওঠার উৎসব - কৃষকের জীবনের আনন্দের দিন।",
    "Nabanna, the festival of the new rice, is a day of joy for farmers."
  ],
  [
    "কৃতজ্ঞ",
    "kritoggo",
    "উপকার মনে রাখেন এমন",
    "grateful",
    3,
    "mind",
    ["ধন্যবাদ", "ধন্য"],
    "আপনার সাহায্যের জন্য আমি কৃতজ্ঞ।",
    "I am grateful for your help."
  ],
  [
    "ক্ষমা",
    "kkhoma",
    "অন্যের দোষ মাফ করে দেওয়া",
    "forgiveness",
    4,
    "mind",
    ["দয়া", "বিজয়া"],
    "ভুল বুঝতে পেরে সে ক্ষমা চাইল।",
    "Realising his mistake, he asked for forgiveness.",
    "বিজয়া দশমীতে পুরোনো মন-কষাকষি ভুলে কোলাকুলির চল আছে।",
    "On Bijoya Dashami people traditionally set old quarrels aside and embrace."
  ],
  [
    "ক্ষুধা",
    "kkhudha",
    "খাওয়ার তীব্র ইচ্ছা",
    "hunger",
    4,
    "society",
    ["ভাত", "তৃষ্ণা"],
    "সারাদিন খাওয়া হয়নি, ক্ষুধায় কাতর।",
    "He hasn't eaten all day and is faint with hunger."
  ],
  [
    "খাতা",
    "khata",
    "লেখার জন্য পাতা বাঁধানো কাগজ",
    "a notebook",
    1,
    "learning",
    ["কলম", "বই"],
    "নতুন খাতায় নাম লিখলাম।",
    "I wrote my name in the new notebook."
  ],
  [
    "খুশি",
    "khushi",
    "আনন্দিত অবস্থা",
    "happy, glad",
    1,
    "mind",
    ["হাসি", "সুখ"],
    "পরীক্ষার ফল দেখে সে খুশি হলো।",
    "She was happy to see the exam result."
  ],
  [
    "গল্প",
    "golpo",
    "কাহিনি, বলা বা লেখা ঘটনা",
    "a story; chat",
    2,
    "arts",
    ["কল্পনা", "আড্ডা"],
    "ঠাকুমার কাছে রূপকথার গল্প শুনতাম।",
    "I used to listen to fairy tales from Grandma.",
    "'গল্প করা' মানে শুধু কাহিনি বলা নয়, আড্ডায় মেতে ওঠাও।",
    "'Golpo kora' means not only telling a story but also a relaxed chat."
  ],
  [
    "গান",
    "gan",
    "সুর দিয়ে গাওয়া কথা",
    "a song",
    1,
    "arts",
    ["সুর", "নৃত্য"],
    "সন্ধ্যায় রবীন্দ্রসংগীতের গান বাজছিল।",
    "A Rabindra Sangeet song was playing in the evening.",
    "রবীন্দ্রসংগীত, নজরুলগীতি, লোকগান - বাঙালির গানের ভুবন বিশাল।",
    "Rabindra Sangeet, Nazrul Geeti and folk songs - the Bengali world of song is vast."
  ],
  [
    "গাছ",
    "gachh",
    "উদ্ভিদ, বৃক্ষ",
    "a tree",
    1,
    "nature",
    ["ফুল", "পাতা", "বাগান"],
    "উঠোনের গাছে পাখি বসেছে।",
    "A bird has perched on the tree in the yard."
  ],
  [
    "গ্রাম",
    "gram",
    "শহরের বাইরের ছোট জনপদ",
    "a village",
    2,
    "place",
    ["মাঠ", "নদী"],
    "আমার দাদুর গ্রাম নদীর ধারে।",
    "My grandfather's village is by a river."
  ],
  [
    "গোলাপ",
    "golap",
    "সুগন্ধি ফুল",
    "a rose",
    2,
    "nature",
    ["ফুল", "বাগান"],
    "বাগানে লাল গোলাপ ফুটেছে।",
    "Red roses have bloomed in the garden."
  ],
  [
    "গৌরব",
    "gourob",
    "মর্যাদা, সম্মানের অনুভূতি",
    "pride, glory",
    3,
    "mind",
    ["সম্মান", "আদর্শ"],
    "ভাষার গৌরব আমাদের সবার।",
    "The glory of the language belongs to all of us."
  ],
  [
    "চিত্র",
    "chitro",
    "ছবি",
    "a picture",
    2,
    "arts",
    ["শিল্প", "রং"],
    "দেয়ালে একটি সুন্দর চিত্র টাঙানো।",
    "A beautiful picture hangs on the wall."
  ],
  [
    "চিন্তা",
    "chinta",
    "ভাবনা; দুশ্চিন্তা",
    "thought; worry",
    2,
    "mind",
    ["কল্পনা", "মন"],
    "এত চিন্তা কোরো না।",
    "Don't worry so much."
  ],
  [
    "ছাত্র",
    "chhatro",
    "যে বিদ্যালয়ে বা গুরুর কাছে শেখে",
    "a student",
    3,
    "learning",
    ["শিক্ষা", "বিদ্যা"],
    "ছাত্ররা মন দিয়ে পড়ছে।",
    "The students are studying attentively."
  ],
  [
    "ছাতা",
    "chhata",
    "রোদ-বৃষ্টি থেকে বাঁচার আবরণ",
    "an umbrella",
    1,
    "society",
    ["বৃষ্টি", "বর্ষা"],
    "বৃষ্টি আসছে, ছাতা নিয়ে যাও।",
    "It's going to rain; take an umbrella."
  ],
  [
    "জল",
    "jol",
    "পান করার তরল; পানি",
    "water",
    1,
    "nature",
    ["নদী", "বৃষ্টি"],
    "গ্লাসে ঠান্ডা জল ঢাললাম।",
    "I poured cold water into the glass.",
    "",
    ""
  ],
  [
    "জ্ঞান",
    "gyan",
    "জানা, বোঝার ক্ষমতা ও ফল",
    "knowledge",
    3,
    "learning",
    ["বিদ্যা", "বিজ্ঞান"],
    "বই পড়লে জ্ঞান বাড়ে।",
    "Reading books increases knowledge."
  ],
  [
    "জ্যোৎস্না",
    "jyotshna",
    "চাঁদের আলো",
    "moonlight",
    4,
    "nature",
    ["চাঁদ", "রাত"],
    "জ্যোৎস্নায় উঠোন ভেসে যাচ্ছে।",
    "The yard is flooded with moonlight.",
    "কোজাগরী লক্ষ্মীপূজার পূর্ণিমা রাত জ্যোৎস্নায় ভাসে।",
    "The full-moon night of Kojagari Lakshmi Puja is bathed in moonlight."
  ],
  [
    "তারা",
    "tara",
    "রাতের আকাশে জ্বলজ্বলে বিন্দু",
    "a star",
    1,
    "nature",
    ["আকাশ", "রাত", "চাঁদ"],
    "আকাশে অজস্র তারা ফুটেছে।",
    "Countless stars have appeared in the sky."
  ],
  [
    "তিথি",
    "tithi",
    "চান্দ্র দিন, পঞ্জিকার হিসাব",
    "a lunar day",
    2,
    "festival",
    ["পুজো", "পঞ্জিকা"],
    "আজ কোন তিথি?",
    "Which tithi is it today?",
    "বাংলা পঞ্জিকায় পুজো-পার্বণ তিথি ধরে ঠিক হয়।",
    "In the Bengali almanac, festival dates are set by tithi."
  ],
  [
    "তৃষ্ণা",
    "trishna",
    "জল খাওয়ার তীব্র ইচ্ছা; গভীর আকাঙ্ক্ষা",
    "thirst; deep longing",
    4,
    "mind",
    ["জল", "ক্ষুধা"],
    "গরমে তৃষ্ণায় গলা শুকিয়ে গেল।",
    "My throat went dry with thirst in the heat."
  ],
  [
    "ত্যাগ",
    "tyag",
    "নিজের কিছু ছেড়ে দেওয়া",
    "sacrifice, renunciation",
    3,
    "spirit",
    ["কষ্ট", "দয়া"],
    "দেশের জন্য তিনি অনেক ত্যাগ করেছেন।",
    "He made many sacrifices for the country."
  ],
  [
    "দয়া",
    "doya",
    "অন্যের কষ্টে সহানুভূতি",
    "kindness, mercy",
    1,
    "mind",
    ["ক্ষমা", "মায়া"],
    "গরিবদের প্রতি তাঁর দয়া ছিল।",
    "He was kind to the poor."
  ],
  [
    "দাদা",
    "dada",
    "বড় ভাই; ঠাকুরদা",
    "elder brother; paternal grandfather",
    1,
    "family",
    ["দিদি", "ভাই"],
    "দাদা আমাকে সাইকেল চালানো শিখিয়েছে।",
    "My elder brother taught me to ride a bicycle.",
    "",
    ""
  ],
  [
    "দিদি",
    "didi",
    "বড় বোন",
    "elder sister",
    1,
    "family",
    ["দাদা", "বোন"],
    "দিদি আমার হোমওয়ার্ক দেখিয়ে দিল।",
    "My elder sister helped with my homework."
  ],
  [
    "দুর্গা",
    "durga",
    "শারদীয় উৎসবের দেবী",
    "Durga, the goddess of the autumn festival",
    3,
    "festival",
    ["পুজো", "প্রণাম"],
    "মণ্ডপে দুর্গার প্রতিমা সাজানো হয়েছে।",
    "The image of Durga has been set up in the pavilion.",
    "নামের অর্থ 'যিনি দুর্গম বিপদ থেকে রক্ষা করেন' বলে ব্যাখ্যা করা হয়।",
    "The name is explained as 'one who protects from difficult situations'."
  ],
  [
    "দেশ",
    "desh",
    "নিজের ভূমি, স্বদেশ",
    "homeland, country",
    1,
    "place",
    ["গ্রাম", "স্বাধীনতা"],
    "প্রবাসে থেকেও দেশের কথা মনে পড়ে।",
    "Even abroad, one remembers the homeland."
  ],
  [
    "দোকান",
    "dokan",
    "জিনিস কেনাবেচার জায়গা",
    "a shop",
    2,
    "society",
    ["বাজার"],
    "মোড়ের দোকানে মিষ্টি পাওয়া যায়।",
    "Sweets are available at the corner shop."
  ],
  [
    "দোয়েল",
    "doyel",
    "সুরেলা ডাকের ছোট পাখি",
    "the magpie-robin, a small songbird",
    3,
    "nature",
    ["পাখি", "গান"],
    "ভোরে দোয়েলের ডাকে ঘুম ভাঙল।",
    "I woke to the magpie-robin's call at dawn."
  ],
  [
    "ধন্য",
    "dhonno",
    "সৌভাগ্যবান; কৃতজ্ঞ",
    "blessed, fortunate",
    2,
    "mind",
    ["কৃতজ্ঞ", "আশীর্বাদ"],
    "আপনাকে পেয়ে আমরা ধন্য।",
    "We are blessed to have you."
  ],
  [
    "ধর্ম",
    "dhormo",
    "বিশ্বাস ও নীতির পথ; কর্তব্য",
    "religion; duty",
    3,
    "spirit",
    ["ধ্যান", "সত্য"],
    "মানবধর্মই সবচেয়ে বড় ধর্ম।",
    "Humanity is the greatest duty."
  ],
  [
    "ধান",
    "dhan",
    "যে গাছের দানা থেকে চাল হয়",
    "paddy (rice plant)",
    1,
    "food",
    ["ভাত", "কৃষক", "মাঠ"],
    "মাঠে সোনালি ধান পেকেছে।",
    "Golden paddy has ripened in the fields.",
    "নবান্ন - নতুন ধান ওঠার উৎসব - বাঙালির প্রাচীন উদযাপন।",
    "Nabanna, the new-rice festival, is an old Bengali celebration."
  ],
  [
    "ধ্যান",
    "dhyan",
    "মন স্থির করে গভীর চিন্তা",
    "meditation",
    3,
    "spirit",
    ["আত্মা", "শান্ত"],
    "সে রোজ সকালে ধ্যান করে।",
    "She meditates every morning."
  ],
  [
    "নদী",
    "nodi",
    "স্রোতস্বিনী জলধারা",
    "a river",
    1,
    "nature",
    ["জল", "সাগর"],
    "নদীর ধারে সন্ধ্যা নামছে।",
    "Evening is falling by the river.",
    "গঙ্গা ও তার শাখানদীর পলিমাটিই বাংলার সংস্কৃতি ও চাষবাসের ভিত্তি।",
    "The silt of the Ganga and its distributaries is the foundation of Bengal's culture and farming."
  ],
  [
    "নৃত্য",
    "nritto",
    "নাচ",
    "dance",
    3,
    "arts",
    ["গান", "সুর"],
    "মঞ্চে শাস্ত্রীয় নৃত্য হলো।",
    "A classical dance was performed on stage."
  ],
  [
    "পথ",
    "poth",
    "রাস্তা",
    "a path, a road",
    1,
    "place",
    ["গ্রাম", "যাত্রা"],
    "পথের ধারে কাশফুল ফুটেছে।",
    "Kash flowers have bloomed by the roadside.",
    "'পথের পাঁচালী' - সত্যজিৎ রায়ের ছবি ও বিভূতিভূষণের উপন্যাসের নাম।",
    "'Pather Panchali' is the title of both Bibhutibhushan's novel and Satyajit Ray's film."
  ],
  [
    "পাখি",
    "pakhi",
    "ডানাওয়ালা প্রাণী",
    "a bird",
    1,
    "nature",
    ["গাছ", "আকাশ"],
    "ভোরে পাখির কলরবে ঘুম ভাঙে।",
    "Birdsong wakes you at dawn."
  ],
  [
    "পাহাড়",
    "pahar",
    "উঁচু ভূমি, শৈলশ্রেণি",
    "a hill, a mountain",
    2,
    "nature",
    ["আকাশ", "নদী"],
    "দার্জিলিংয়ের পাহাড়ে কুয়াশা নেমেছে।",
    "Mist has settled on the hills of Darjeeling."
  ],
  [
    "পুতুল",
    "putul",
    "খেলার বা সাজানোর মূর্তি",
    "a doll, a puppet",
    2,
    "arts",
    ["খেলা", "গল্প"],
    "মেলায় কাঠের পুতুল কিনলাম।",
    "I bought a wooden doll at the fair.",
    "পুতুলনাচ বাংলার একটি পুরোনো লোকশিল্প।",
    "Puppet theatre (putul nach) is an old Bengali folk art."
  ],
  [
    "পৃথিবী",
    "prithibi",
    "আমাদের গ্রহ",
    "the earth",
    3,
    "nature",
    ["আকাশ", "সূর্য"],
    "পৃথিবী সূর্যের চারদিকে ঘোরে।",
    "The earth revolves around the sun."
  ],
  [
    "প্রণাম",
    "pronam",
    "শ্রদ্ধায় মাথা নত করা",
    "a respectful bow",
    3,
    "society",
    ["আশীর্বাদ", "বিজয়া"],
    "গুরুজনদের প্রণাম করলাম।",
    "I bowed to my elders."
  ],
  [
    "প্রকৃতি",
    "prokriti",
    "সৃষ্ট জগৎ; স্বভাব",
    "nature",
    3,
    "nature",
    ["গাছ", "নদী"],
    "প্রকৃতির কোলে শান্তি মেলে।",
    "One finds peace in the lap of nature."
  ],
  [
    "প্রভাত",
    "provat",
    "ভোর",
    "dawn, morning",
    3,
    "time",
    ["সকাল", "সূর্য"],
    "প্রভাতে পাখিরা ডেকে ওঠে।",
    "Birds call out at dawn."
  ],
  [
    "প্রশ্ন",
    "proshno",
    "জানতে চাওয়া কথা",
    "a question",
    3,
    "learning",
    ["উত্তর", "জ্ঞান"],
    "শিক্ষক প্রশ্ন করলেন।",
    "The teacher asked a question."
  ],
  [
    "প্রসাদ",
    "proshad",
    "দেবতাকে নিবেদন করা খাবার বা অনুগ্রহ",
    "a blessed food offering; grace",
    3,
    "festival",
    ["আশীর্বাদ", "পুজো"],
    "অঞ্জলির পর সবাই প্রসাদ পেল।",
    "Everyone received prasad after the anjali.",
    "পুজোর প্রসাদে ফল, নাড়ু আর মিষ্টি থাকে।",
    "Puja prasad usually includes fruit, naru and sweets."
  ],
  [
    "প্রিয়",
    "priyo",
    "যাকে ভালোবাসা যায়",
    "dear, favourite",
    3,
    "mind",
    ["ভালোবাসা"],
    "এটা আমার প্রিয় গান।",
    "This is my favourite song."
  ],
  [
    "ফাল্গুন",
    "falgun",
    "বাংলা বছরের একাদশ মাস",
    "Falgun, the eleventh Bengali month",
    3,
    "time",
    ["বসন্ত", "চৈত্র"],
    "ফাল্গুনের হাওয়ায় বসন্তের ছোঁয়া।",
    "The Falgun breeze carries a touch of spring.",
    "বসন্ত উৎসব ও দোলযাত্রা ফাল্গুনে পড়ে।",
    "Basanta Utsav and Dol Jatra fall in Falgun."
  ],
  [
    "বই",
    "boi",
    "পড়ার জন্য লেখা ও বাঁধানো পাতা",
    "a book",
    1,
    "learning",
    ["পাঠ", "খাতা", "কলম"],
    "আমি রোজ রাতে বই পড়ি।",
    "I read a book every night.",
    "ফেব্রুয়ারির বইমেলা বাঙালির এক বড় উৎসব।",
    "The February book fair is a major Bengali festival."
  ],
  [
    "বৃষ্টি",
    "brishti",
    "আকাশ থেকে পড়া জল",
    "rain",
    3,
    "nature",
    ["বর্ষা", "মেঘ"],
    "বৃষ্টিতে ভিজে বাড়ি ফিরলাম।",
    "I came home drenched in the rain."
  ],
  [
    "বর্ষা",
    "borsha",
    "বৃষ্টির ঋতু",
    "the monsoon",
    2,
    "nature",
    ["বৃষ্টি", "শরৎ"],
    "বর্ষায় নদী কূল ছাপিয়ে যায়।",
    "In the monsoon rivers overflow their banks."
  ],
  [
    "বাগান",
    "bagan",
    "গাছপালা ও ফুলের জায়গা",
    "a garden",
    2,
    "nature",
    ["গাছ", "ফুল"],
    "বিকেলে বাগানে বসলাম।",
    "I sat in the garden in the afternoon."
  ],
  [
    "বাঘ",
    "bagh",
    "ডোরাকাটা বড় বনের প্রাণী",
    "a tiger",
    1,
    "nature",
    ["বন", "বিড়াল"],
    "সুন্দরবনের বাঘ বিখ্যাত।",
    "The tigers of the Sundarbans are famous.",
    "রয়্যাল বেঙ্গল টাইগার বাংলার পরিচিত প্রতীক।",
    "The Royal Bengal tiger is a well-known emblem of Bengal."
  ],
  [
    "বিজ্ঞান",
    "biggyan",
    "প্রকৃতির নিয়ম জানার পদ্ধতিগত চর্চা",
    "science",
    3,
    "learning",
    ["জ্ঞান", "শিক্ষা"],
    "বিজ্ঞানের বই পড়তে ভালো লাগে।",
    "I enjoy reading science books.",
    "জগদীশচন্দ্র বসু ও সত্যেন্দ্রনাথ বসু বাঙালি বিজ্ঞানীদের উজ্জ্বল নাম।",
    "Jagadish Chandra Bose and Satyendra Nath Bose are bright names among Bengali scientists."
  ],
  [
    "বিদ্যা",
    "biddya",
    "শেখা জ্ঞান",
    "learning, knowledge",
    3,
    "learning",
    ["জ্ঞান", "শিক্ষা"],
    "বিদ্যা বিনয় দান করে।",
    "Learning gives humility.",
    "ঈশ্বরচন্দ্র 'বিদ্যাসাগর' উপাধি পান - অর্থাৎ বিদ্যার সাগর।",
    "Ishwar Chandra earned the title 'Vidyasagar' - an ocean of learning."
  ],
  [
    "বৈশাখ",
    "boishakh",
    "বাংলা বছরের প্রথম মাস",
    "Boishakh, the first month of the Bengali year",
    3,
    "time",
    ["ফাল্গুন", "আশ্বিন"],
    "বৈশাখের প্রথম দিনে নববর্ষ।",
    "The new year begins on the first day of Boishakh.",
    "পয়লা বৈশাখে নতুন খাতা (হালখাতা) খোলার রীতি আছে।",
    "On Poila Boishakh many shops open a new account book (halkhata)."
  ],
  [
    "ভয়",
    "bhoy",
    "বিপদের আশঙ্কায় মনের অস্বস্তি",
    "fear",
    1,
    "mind",
    ["সাহস"],
    "অন্ধকারে ভয় করছিল।",
    "I felt afraid in the dark."
  ],
  [
    "ভাত",
    "bhat",
    "সিদ্ধ চাল",
    "cooked rice",
    1,
    "food",
    ["ধান", "মাছ", "ডাল"],
    "মাছ-ভাত বাঙালির প্রিয় খাবার।",
    "Fish and rice is a Bengali favourite.",
    "'মাছে-ভাতে বাঙালি' - প্রবাদটি বাঙালির খাদ্যাভ্যাসকে তুলে ধরে।",
    "'Maachhe-bhaate Bangali' - the saying captures the Bengali diet."
  ],
  [
    "ভ্রমণ",
    "bhromon",
    "বেড়ানো, ঘুরে দেখা",
    "travel, a journey",
    3,
    "society",
    ["পথ", "পাহাড়"],
    "পুজোর ছুটিতে ভ্রমণে যাব।",
    "I'll go travelling in the Puja holidays.",
    "পুজোর ছুটিতে বেড়াতে যাওয়া বাঙালির প্রিয় রীতি।",
    "Travelling in the Puja holidays is a beloved Bengali habit."
  ],
  [
    "মানুষ",
    "manush",
    "মনুষ্যজাতির সদস্য",
    "a human being, a person",
    2,
    "society",
    ["দয়া", "সমাজ"],
    "মানুষ মানুষের জন্য।",
    "People are for people."
  ],
  [
    "মালা",
    "mala",
    "ফুল বা পুঁতি দিয়ে গাঁথা হার",
    "a garland",
    1,
    "festival",
    ["ফুল", "পুজো"],
    "ঠাকুরের গলায় জবার মালা।",
    "A garland of hibiscus around the deity's neck."
  ],
  [
    "মূর্তি",
    "murti",
    "প্রতিমা, আকৃতি",
    "an idol, a statue",
    3,
    "arts",
    ["প্রতিমা", "শিল্প"],
    "শিল্পী কাদা দিয়ে মূর্তি গড়ছেন।",
    "The artist is shaping an idol from clay."
  ],
  [
    "রাত",
    "rat",
    "সূর্যাস্ত থেকে সূর্যোদয় পর্যন্ত সময়",
    "night",
    1,
    "time",
    ["সন্ধ্যা", "অন্ধকার"],
    "রাত গভীর হলো।",
    "The night grew deep."
  ],
  [
    "লক্ষ্মী",
    "lokkhi",
    "সম্পদ ও সৌভাগ্যের দেবী; সুলক্ষণা",
    "Lakshmi, goddess of prosperity; a fortunate person",
    4,
    "festival",
    ["দুর্গা", "ধান"],
    "ঘরে লক্ষ্মীর পুজো হলো।",
    "Lakshmi Puja was held at home.",
    "কোজাগরী পূর্ণিমায় বাংলার ঘরে ঘরে লক্ষ্মীর আরাধনা হয়; আলপনায় লক্ষ্মীর পায়ের ছাপ আঁকা হয়।",
    "On Kojagari Purnima homes worship Lakshmi, and her footprints are drawn in alpona."
  ],
  [
    "লতা",
    "lota",
    "যে গাছ অন্যকে জড়িয়ে ওঠে",
    "a creeper, a vine",
    1,
    "nature",
    ["গাছ", "ফুল"],
    "দেয়াল বেয়ে লতা উঠেছে।",
    "A creeper has climbed the wall."
  ],
  [
    "শান্ত",
    "shanto",
    "স্থির, নিস্তরঙ্গ",
    "calm, quiet",
    3,
    "mind",
    ["ধ্যান", "সুখ"],
    "নদীটি আজ শান্ত।",
    "The river is calm today."
  ],
  [
    "শিক্ষা",
    "shikkha",
    "শেখা ও শেখানো",
    "education",
    3,
    "learning",
    ["বিদ্যা", "ছাত্র"],
    "শিক্ষা মানুষকে আলো দেখায়।",
    "Education shows people the light."
  ],
  [
    "শিল্প",
    "shilpo",
    "কলা, কারুকাজ",
    "art, craft",
    3,
    "arts",
    ["চিত্র", "মূর্তি"],
    "কুমোরটুলির শিল্পীরা প্রতিমা গড়েন।",
    "The artisans of Kumartuli make the idols.",
    "নকশি কাঁথা, টেরাকোটা, পটচিত্র - বাংলার লোকশিল্পের বৈচিত্র্য বিশাল।",
    "Nakshi kantha, terracotta, patachitra - Bengal's folk arts are richly varied."
  ],
  [
    "শূন্য",
    "shunyo",
    "ফাঁকা; সংখ্যা ০",
    "empty; zero",
    3,
    "learning",
    ["সংখ্যা"],
    "ঘরটা শূন্য পড়ে আছে।",
    "The room lies empty."
  ],
  [
    "সকাল",
    "shokal",
    "দিনের শুরুর সময়",
    "morning",
    2,
    "time",
    ["প্রভাত", "রাত"],
    "সকালে চা আর খবরের কাগজ।",
    "Tea and the newspaper in the morning."
  ],
  [
    "সত্য",
    "shotyo",
    "যা সত্যি",
    "truth",
    3,
    "spirit",
    ["ধর্ম", "আদর্শ"],
    "সত্য কথা বলা ভালো।",
    "It is good to tell the truth."
  ],
  [
    "সংস্কৃতি",
    "songskriti",
    "মানুষের জীবনচর্চা, শিল্প ও রীতির সমষ্টি",
    "culture",
    4,
    "society",
    ["শিল্প", "গান"],
    "বাংলার সংস্কৃতি বহুরঙা।",
    "Bengal's culture is many-coloured."
  ],
  [
    "সাগর",
    "shagor",
    "বিশাল লোনা জলরাশি",
    "sea, ocean",
    2,
    "nature",
    ["নদী", "জল"],
    "সাগরের ঢেউ তীরে আছড়ে পড়ছে।",
    "Waves crash on the shore of the sea."
  ],
  [
    "সাদা",
    "shada",
    "দুধের মতো রং",
    "white",
    1,
    "nature",
    ["কাশফুল", "মেঘ"],
    "শরতের আকাশে সাদা মেঘ।",
    "White clouds in the autumn sky."
  ],
  [
    "সুখ",
    "shukh",
    "আনন্দ ও তৃপ্তির অনুভূতি",
    "happiness",
    1,
    "mind",
    ["খুশি", "শান্ত"],
    "সুখ মনের ভেতরে থাকে।",
    "Happiness lives inside the mind."
  ],
  [
    "সুর",
    "shur",
    "গানের স্বরবিন্যাস",
    "a tune, a melody",
    1,
    "arts",
    ["গান", "নৃত্য"],
    "সুরটা মনে গেঁথে গেল।",
    "The tune stuck in my mind."
  ],
  [
    "সূর্য",
    "surjo",
    "আমাদের আলো ও তাপ দেওয়া তারা",
    "the sun",
    3,
    "nature",
    ["আকাশ", "প্রভাত"],
    "ভোরে সূর্য উঠল।",
    "The sun rose at dawn."
  ],
  [
    "স্বাধীনতা",
    "shadhinota",
    "নিজের মতো চলার অধিকার",
    "freedom, independence",
    4,
    "society",
    ["দেশ", "গৌরব"],
    "স্বাধীনতা সবার প্রিয়।",
    "Freedom is dear to everyone."
  ],
  [
    "স্বাদ",
    "shad",
    "খাবারের রস; আস্বাদ",
    "taste, flavour",
    2,
    "food",
    ["ভাত", "মিষ্টি"],
    "খিচুড়ির স্বাদ অপূর্ব।",
    "The khichuri tastes wonderful."
  ],
  [
    "হাসি",
    "hashi",
    "আনন্দে মুখের ভাব; হাসা",
    "a smile, laughter",
    1,
    "mind",
    ["খুশি", "সুখ"],
    "তার মুখে মিষ্টি হাসি।",
    "A sweet smile is on her face."
  ],
  [
    "হৃদয়",
    "hridoy",
    "হৃৎপিণ্ড; মন",
    "the heart",
    3,
    "mind",
    ["মন", "ভালোবাসা"],
    "গানটি হৃদয় ছুঁয়ে গেল।",
    "The song touched my heart."
  ]
];

export const WORD_BANK: WordEntry[] = [...ROWS, ...VOCAB_ROWS, ...PUJA_ROWS, ...KARTIK_ROWS].map(
  ([
    word,
    pronunciation,
    meaningBn,
    meaningEn,
    difficulty,
    category,
    relatedWords,
    exampleBn,
    exampleEn,
    noteBn,
    noteEn
  ]) => ({
    word,
    pronunciation,
    meaningBn,
    meaningEn,
    difficulty,
    category,
    relatedWords,
    exampleBn,
    exampleEn,
    ...(noteBn && noteEn ? { culturalNote: { bn: noteBn, en: noteEn } } : {}),
    ...(word === "জল"
      ? {
          region: {
            bn: "বাংলাভাষী অঞ্চলে 'জল' ও 'পানি' - দুটিই চলে; কোনটি বেশি চলে তা অঞ্চল ও সম্প্রদায়ভেদে ভিন্ন।",
            en: "Both 'jol' and 'pani' are used across Bengali-speaking regions; which is more common varies by region and community."
          }
        }
      : {}),
    source: SOURCE
  })
);
