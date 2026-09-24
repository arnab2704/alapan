export type LearnKind = "letter" | "sign" | "number" | "word" | "conjunct";

export interface LearnItem {
  id: string;
  /** The Bengali glyph, sign combination, digit or word being learned. */
  bn: string;
  /** Latin-script pronunciation guide. Unique within a unit so it can be used as a quiz answer. */
  roman: string;
  /** English meaning (words) or numeral (numbers). */
  en?: string;
  /** Bengali number word, for the number kind. */
  word?: string;
  /** Short English pronunciation note. */
  hint?: string;
  /** An everyday word that shows the item in use. */
  example?: { bn: string; roman: string; en: string };
}

export interface LearnLesson {
  id: string;
  titleBn: string;
  titleEn: string;
  kind: LearnKind;
  /** Review lessons skip the introduction cards and sample from their items. */
  review?: boolean;
  items: LearnItem[];
}

export interface LearnUnit {
  id: string;
  icon: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  lessons: LearnLesson[];
}

type Ex = [bn: string, roman: string, en: string];

function letters(prefix: string, rows: Array<[string, string, string | null, Ex | null]>): LearnItem[] {
  return rows.map(([bn, roman, hint, ex], i) => ({
    id: `${prefix}${i + 1}`,
    bn,
    roman,
    ...(hint ? { hint } : {}),
    ...(ex ? { example: { bn: ex[0], roman: ex[1], en: ex[2] } } : {})
  }));
}

function words(prefix: string, rows: Array<[string, string, string]>): LearnItem[] {
  return rows.map(([bn, roman, en], i) => ({ id: `${prefix}${i + 1}`, bn, roman, en }));
}

const V1 = letters("v", [
  ["অ", "o", "Short, rounded 'o' as in 'hot'", ["অজগর", "ojogor", "python"]],
  ["আ", "a", "Open 'a' as in 'father'", ["আম", "am", "mango"]],
  ["ই", "i", "Short 'i' as in 'sit'", ["ইঁদুর", "indur", "mouse"]],
  ["ঈ", "ee", "Long 'ee' as in 'see'", ["ঈগল", "eegol", "eagle"]],
  ["উ", "u", "Short 'u' as in 'put'", ["উট", "ut", "camel"]],
  ["ঊ", "oo", "Long 'oo' as in 'moon'", ["ঊষা", "usha", "dawn"]],
  ["ঋ", "ri", "Sounds like 'ri' as in 'rich'", ["ঋষি", "rishi", "sage"]],
  ["এ", "e", "'e' as in 'bed'", ["এক", "ek", "one"]],
  ["ঐ", "oi", "Diphthong 'oi' as in 'boy'", ["ঐক্য", "oikko", "unity"]],
  ["ও", "oh", "Long 'o' as in 'go'", ["ওড়না", "orna", "scarf"]],
  ["ঔ", "ou", "Diphthong 'ou' as in 'go-oo'", ["ঔষধ", "oushodh", "medicine"]]
]);

const C = {
  ka: letters("ka", [
    ["ক", "ko", null, ["কলম", "kolom", "pen"]],
    ["খ", "kho", "Breathy 'k'", ["খাতা", "khata", "notebook"]],
    ["গ", "go", null, ["গরু", "goru", "cow"]],
    ["ঘ", "gho", "Breathy 'g'", ["ঘর", "ghor", "house"]],
    ["ঙ", "ngo", "Nasal 'ng' as in 'sing'", ["বাঙালি", "bangali", "Bengali person"]]
  ]),
  cha: letters("ch", [
    ["চ", "cho", null, ["চা", "cha", "tea"]],
    ["ছ", "chho", "Breathy 'ch'", ["ছাতা", "chhata", "umbrella"]],
    ["জ", "jo", null, ["জল", "jol", "water"]],
    ["ঝ", "jho", "Breathy 'j'", ["ঝড়", "jhor", "storm"]],
    ["ঞ", "nyo", "Nasal 'ny', as in 'canyon'", null]
  ]),
  ta: letters("ta", [
    ["ট", "ṭo", "Hard 't', tongue curled back", ["টাকা", "taka", "money"]],
    ["ঠ", "ṭho", "Hard breathy 't'", ["ঠোঁট", "thot", "lip"]],
    ["ড", "ḍo", "Hard 'd', tongue curled back", ["ডাল", "dal", "lentils"]],
    ["ঢ", "ḍho", "Hard breathy 'd'", ["ঢাক", "dhak", "drum"]],
    ["ণ", "ṇo", "Nasal 'n', tongue curled back", ["ঘণ্টা", "ghonta", "bell"]]
  ]),
  tha: letters("th", [
    ["ত", "to", "Soft 't', tongue at the teeth", ["তারা", "tara", "star"]],
    ["থ", "tho", "Soft breathy 't'", ["থালা", "thala", "plate"]],
    ["দ", "do", "Soft 'd', tongue at the teeth", ["দিন", "din", "day"]],
    ["ধ", "dho", "Soft breathy 'd'", ["ধান", "dhan", "paddy"]],
    ["ন", "no", null, ["নদী", "nodi", "river"]]
  ]),
  pa: letters("pa", [
    ["প", "po", null, ["পাখি", "pakhi", "bird"]],
    ["ফ", "pho", "Breathy 'p', like 'f'", ["ফল", "phol", "fruit"]],
    ["ব", "bo", null, ["বই", "boi", "book"]],
    ["ভ", "bho", "Breathy 'b'", ["ভাত", "bhat", "rice"]],
    ["ম", "mo", null, ["মাছ", "machh", "fish"]]
  ]),
  ya: letters("ya", [
    ["য", "jjo", "Sounds like জ at the start of a word", ["যদি", "jodi", "if"]],
    ["র", "ro", "Lightly rolled 'r'", ["রাত", "rat", "night"]],
    ["ল", "lo", null, ["লাল", "lal", "red"]],
    ["শ", "sho", "'sh' as in 'shop'", ["শিশু", "shishu", "child"]],
    ["ষ", "ssho", "Also 'sh', in Sanskrit-origin words", ["ষাট", "shat", "sixty"]],
    ["স", "so", "'s' as in 'sun'", ["সকাল", "shokal", "morning"]],
    ["হ", "ho", null, ["হাত", "hat", "hand"]]
  ]),
  sp: letters("sp", [
    ["ড়", "ṛo", "A quick flap of the tongue", ["বড়", "boro", "big"]],
    ["ঢ়", "ṛho", "A breathy flap of the tongue", ["আষাঢ়", "ashar", "the month Ashar"]],
    ["য়", "yo", "'y' as in 'yes'", ["ময়ূর", "moyur", "peacock"]],
    ["ৎ", "t", "A clipped final 't'", ["হঠাৎ", "hothat", "suddenly"]],
    ["ং", "ng", "Nasal 'ng' ending", ["বাংলা", "bangla", "Bengali"]],
    ["ঃ", "h", "A soft breath, 'h'", ["দুঃখ", "dukkho", "sorrow"]],
    ["ঁ", "nasal ~", "Chandrabindu: nasalises the vowel", ["চাঁদ", "chand", "moon"]]
  ])
};

const SIGNS1 = letters("sg", [
  ["কা", "ka", "া is the 'aa' sign, written after the letter", null],
  ["কি", "ki", "ি is the short 'i' sign, written before the letter", null],
  ["কী", "kee", "ী is the long 'ee' sign, written after the letter", null],
  ["কু", "ku", "ু is the short 'u' sign, written below the letter", null],
  ["কূ", "koo", "ূ is the long 'oo' sign, written below the letter", null]
]);
const SIGNS2 = letters("sh", [
  ["কৃ", "kri", "ৃ is the 'ri' sign, written below the letter", null],
  ["কে", "ke", "ে is the 'e' sign, written before the letter", null],
  ["কৈ", "koi", "ৈ is the 'oi' sign, written before the letter", null],
  ["কো", "koh", "ো wraps around the letter", null],
  ["কৌ", "kou", "ৌ wraps around the letter", null]
]);

function numbers(prefix: string, rows: Array<[string, string, string, string]>): LearnItem[] {
  return rows.map(([bn, word, roman, en], i) => ({ id: `${prefix}${i + 1}`, bn, word, roman, en }));
}
const N1 = numbers("n", [
  ["০", "শূন্য", "shunyo", "0"],
  ["১", "এক", "ek", "1"],
  ["২", "দুই", "dui", "2"],
  ["৩", "তিন", "tin", "3"],
  ["৪", "চার", "char", "4"],
  ["৫", "পাঁচ", "panch", "5"]
]);
const N2 = numbers("m", [
  ["৬", "ছয়", "chhoy", "6"],
  ["৭", "সাত", "shat", "7"],
  ["৮", "আট", "aat", "8"],
  ["৯", "নয়", "noy", "9"],
  ["১০", "দশ", "dosh", "10"]
]);

const J1 = letters("j", [
  ["ক্ষ", "kkho", "ক + ষ joined", ["ক্ষমা", "kkhoma", "forgiveness"]],
  ["জ্ঞ", "gyo", "জ + ঞ joined, said 'gg'", ["জ্ঞান", "gyan", "knowledge"]],
  ["ত্র", "tro", "ত + র joined", ["ছাত্র", "chhatro", "student"]],
  ["ন্ত", "nto", "ন + ত joined", ["শান্ত", "shanto", "calm"]],
  ["স্ত", "sto", "স + ত joined", ["রাস্তা", "rasta", "road"]],
  ["ষ্ট", "shto", "ষ + ট joined", ["কষ্ট", "koshto", "hardship"]]
]);
const J2 = letters("jj", [
  ["ক্র", "kro", "ক + র joined", ["চক্র", "chokro", "wheel"]],
  ["প্র", "pro", "প + র joined", ["প্রণাম", "pronam", "respectful bow"]],
  ["শ্র", "shro", "শ + র joined", ["শ্রাবণ", "shrabon", "the month Shrabon"]],
  ["ন্দ", "ndo", "ন + দ joined", ["আনন্দ", "anondo", "joy"]],
  ["ঙ্গ", "ngo", "ঙ + গ joined", ["বঙ্গ", "bongo", "Bengal"]],
  ["ল্প", "lpo", "ল + প joined", ["গল্প", "golpo", "story"]]
]);

const W = {
  hello: words("w1-", [
    ["নমস্কার", "nomoshkar", "hello (common in West Bengal)"],
    ["আদাব", "adab", "hello (common in Bangladesh)"],
    ["ধন্যবাদ", "dhonnobad", "thank you"],
    ["হ্যাঁ", "hyan", "yes"],
    ["না", "na", "no"],
    ["স্বাগতম", "shagotom", "welcome"],
    ["বিদায়", "biday", "goodbye"]
  ]),
  family: words("w2-", [
    ["মা", "ma", "mother"],
    ["বাবা", "baba", "father"],
    ["ভাই", "bhai", "brother"],
    ["বোন", "bon", "sister"],
    ["দাদু", "dadu", "paternal grandfather"],
    ["দিদা", "dida", "maternal grandmother"],
    ["বন্ধু", "bondhu", "friend"],
    ["শিশু", "shishu", "child"]
  ]),
  food: words("w3-", [
    ["ভাত", "bhat", "rice"],
    ["মাছ", "machh", "fish"],
    ["ডাল", "dal", "lentils"],
    ["রুটি", "ruti", "flatbread"],
    ["দুধ", "dudh", "milk"],
    ["জল", "jol", "water"],
    ["চা", "cha", "tea"],
    ["মিষ্টি", "mishti", "sweet"],
    ["ফল", "phol", "fruit"],
    ["আম", "am", "mango"]
  ]),
  colours: words("w4-", [
    ["লাল", "lal", "red"],
    ["নীল", "neel", "blue"],
    ["সবুজ", "shobuj", "green"],
    ["হলুদ", "holud", "yellow"],
    ["সাদা", "sada", "white"],
    ["কালো", "kalo", "black"],
    ["গোলাপি", "golapi", "pink"],
    ["কমলা", "komola", "orange"]
  ]),
  body: words("w5-", [
    ["হাত", "hat", "hand"],
    ["পা", "pa", "foot"],
    ["চোখ", "chokh", "eye"],
    ["কান", "kan", "ear"],
    ["নাক", "nak", "nose"],
    ["মুখ", "mukh", "mouth"],
    ["মাথা", "matha", "head"],
    ["দাঁত", "dant", "tooth"]
  ]),
  nature: words("w6-", [
    ["নদী", "nodi", "river"],
    ["আকাশ", "akash", "sky"],
    ["চাঁদ", "chand", "moon"],
    ["সূর্য", "surjo", "sun"],
    ["তারা", "tara", "star"],
    ["গাছ", "gachh", "tree"],
    ["ফুল", "phul", "flower"],
    ["বৃষ্টি", "brishti", "rain"],
    ["পাখি", "pakhi", "bird"],
    ["মেঘ", "megh", "cloud"]
  ]),
  home: words("w7-", [
    ["ঘর", "ghor", "house"],
    ["দরজা", "dorja", "door"],
    ["জানালা", "janala", "window"],
    ["বই", "boi", "book"],
    ["কলম", "kolom", "pen"],
    ["খাতা", "khata", "notebook"],
    ["চেয়ার", "cheyar", "chair"],
    ["টেবিল", "tebil", "table"]
  ]),
  days: words("w8-", [
    ["রবিবার", "robibar", "Sunday"],
    ["সোমবার", "shombar", "Monday"],
    ["মঙ্গলবার", "monggolbar", "Tuesday"],
    ["বুধবার", "budhbar", "Wednesday"],
    ["বৃহস্পতিবার", "brihoshpotibar", "Thursday"],
    ["শুক্রবার", "shukrobar", "Friday"],
    ["শনিবার", "shonibar", "Saturday"]
  ])
};

const consonantsAll = [...C.ka, ...C.cha, ...C.ta, ...C.tha, ...C.pa, ...C.ya, ...C.sp];

export const LEARN_UNITS: LearnUnit[] = [
  {
    id: "vowels",
    icon: "অ",
    titleBn: "স্বরবর্ণ",
    titleEn: "Vowels",
    descBn: "বাংলার এগারোটি স্বর - সব শেখার শুরু এখান থেকে।",
    descEn: "The eleven Bengali vowels - where every journey begins.",
    lessons: [
      { id: "vowels-1", titleBn: "অ আ ই ঈ", titleEn: "অ আ ই ঈ", kind: "letter", items: V1.slice(0, 4) },
      { id: "vowels-2", titleBn: "উ ঊ ঋ", titleEn: "উ ঊ ঋ", kind: "letter", items: V1.slice(4, 7) },
      { id: "vowels-3", titleBn: "এ ঐ ও ঔ", titleEn: "এ ঐ ও ঔ", kind: "letter", items: V1.slice(7, 11) },
      {
        id: "vowels-4",
        titleBn: "স্বরবর্ণ অনুশীলন",
        titleEn: "Vowel review",
        kind: "letter",
        review: true,
        items: V1
      }
    ]
  },
  {
    id: "consonants",
    icon: "ক",
    titleBn: "ব্যঞ্জনবর্ণ",
    titleEn: "Consonants",
    descBn: "ক থেকে হ - বর্গ ধরে ধরে পুরো বর্ণমালা।",
    descEn: "From ক to হ - the whole alphabet, one group at a time.",
    lessons: [
      { id: "consonants-1", titleBn: "ক-বর্গ", titleEn: "ক group", kind: "letter", items: C.ka },
      { id: "consonants-2", titleBn: "চ-বর্গ", titleEn: "চ group", kind: "letter", items: C.cha },
      { id: "consonants-3", titleBn: "ট-বর্গ", titleEn: "ট group", kind: "letter", items: C.ta },
      { id: "consonants-4", titleBn: "ত-বর্গ", titleEn: "ত group", kind: "letter", items: C.tha },
      { id: "consonants-5", titleBn: "প-বর্গ", titleEn: "প group", kind: "letter", items: C.pa },
      { id: "consonants-6", titleBn: "য র ল শ ষ স হ", titleEn: "য র ল শ ষ স হ", kind: "letter", items: C.ya },
      {
        id: "consonants-7",
        titleBn: "বিশেষ বর্ণ ও চিহ্ন",
        titleEn: "Special letters and marks",
        kind: "letter",
        items: C.sp
      },
      {
        id: "consonants-8",
        titleBn: "ব্যঞ্জনবর্ণ অনুশীলন",
        titleEn: "Consonant review",
        kind: "letter",
        review: true,
        items: consonantsAll
      }
    ]
  },
  {
    id: "signs",
    icon: "কা",
    titleBn: "কার-চিহ্ন",
    titleEn: "Vowel signs",
    descBn: "ব্যঞ্জনের সঙ্গে স্বর জুড়লে কেমন দেখায় - কা কি কী কু...",
    descEn: "How vowels attach to consonants - কা কি কী কু...",
    lessons: [
      { id: "signs-1", titleBn: "া ি ী ু ূ", titleEn: "া ি ী ু ূ", kind: "sign", items: SIGNS1 },
      { id: "signs-2", titleBn: "ৃ ে ৈ ো ৌ", titleEn: "ৃ ে ৈ ো ৌ", kind: "sign", items: SIGNS2 },
      {
        id: "signs-3",
        titleBn: "কার-চিহ্ন অনুশীলন",
        titleEn: "Vowel sign review",
        kind: "sign",
        review: true,
        items: [...SIGNS1, ...SIGNS2]
      }
    ]
  },
  {
    id: "numbers",
    icon: "১",
    titleBn: "সংখ্যা",
    titleEn: "Numbers",
    descBn: "শূন্য থেকে দশ - বাংলা অঙ্ক আর তাদের নাম।",
    descEn: "Zero to ten - Bengali digits and their names.",
    lessons: [
      { id: "numbers-1", titleBn: "০ থেকে ৫", titleEn: "০ to ৫", kind: "number", items: N1 },
      { id: "numbers-2", titleBn: "৬ থেকে ১০", titleEn: "৬ to ১০", kind: "number", items: N2 },
      {
        id: "numbers-3",
        titleBn: "সংখ্যা অনুশীলন",
        titleEn: "Number review",
        kind: "number",
        review: true,
        items: [...N1, ...N2]
      }
    ]
  },
  {
    id: "words",
    icon: "শব্দ",
    titleBn: "শব্দভাণ্ডার",
    titleEn: "Everyday words",
    descBn: "দৈনন্দিন কথাবার্তার শব্দ - বিষয় ধরে ধরে।",
    descEn: "Words for everyday talk, one topic at a time.",
    lessons: [
      { id: "words-1", titleBn: "সম্ভাষণ", titleEn: "Greetings", kind: "word", items: W.hello },
      { id: "words-2", titleBn: "পরিবার", titleEn: "Family", kind: "word", items: W.family },
      { id: "words-3", titleBn: "খাওয়া-দাওয়া", titleEn: "Food and drink", kind: "word", items: W.food },
      { id: "words-4", titleBn: "রং", titleEn: "Colours", kind: "word", items: W.colours },
      { id: "words-5", titleBn: "শরীর", titleEn: "The body", kind: "word", items: W.body },
      { id: "words-6", titleBn: "প্রকৃতি", titleEn: "Nature", kind: "word", items: W.nature },
      { id: "words-7", titleBn: "ঘরের জিনিস", titleEn: "Around the home", kind: "word", items: W.home },
      { id: "words-8", titleBn: "সপ্তাহের দিন", titleEn: "Days of the week", kind: "word", items: W.days }
    ]
  },
  {
    id: "conjuncts",
    icon: "ক্ষ",
    titleBn: "যুক্তাক্ষর",
    titleEn: "Conjuncts",
    descBn: "দুটি ব্যঞ্জন জুড়ে যে নতুন আকার - ক্ষ, ন্ত, ঙ্গ...",
    descEn: "Two consonants fused into one shape - ক্ষ, ন্ত, ঙ্গ...",
    lessons: [
      {
        id: "conjuncts-1",
        titleBn: "ক্ষ জ্ঞ ত্র ন্ত স্ত ষ্ট",
        titleEn: "First conjuncts",
        kind: "conjunct",
        items: J1
      },
      {
        id: "conjuncts-2",
        titleBn: "ক্র প্র শ্র ন্দ ঙ্গ ল্প",
        titleEn: "More conjuncts",
        kind: "conjunct",
        items: J2
      }
    ]
  }
];
