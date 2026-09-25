import type { QuizQuestion } from "./quiz-questions";

/**
 * Sharodiya countdown (11-16 Oct 2026) and the festivals that follow Durga Puja: Kojagari Lakshmi
 * Puja (25 Oct), Kali Puja (8 Nov), Bhai Phota (10 Nov) and Jagaddhatri Puja (17 Nov). Draft
 * content: a native-speaking reviewer must check ritual and cultural details before public launch.
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

const COUNTDOWN: Q[] = [
  [
    "sharodiya",
    "'শারদীয়া' শব্দটি কোন ঋতুর সঙ্গে যুক্ত?",
    "The word 'Sharodiya' is linked to which season?",
    [
      ["শরৎ", "Sharat (autumn)"],
      ["গ্রীষ্ম", "Grishma (summer)"],
      ["হেমন্ত", "Hemanta (late autumn)"],
      ["বসন্ত", "Basanta (spring)"]
    ],
    0,
    "শরৎকালের পুজো বলেই শারদীয়া।",
    "It is the Puja of Sharat, the autumn."
  ],
  [
    "shiuli",
    "শরতের ভোরে গাছের নিচে ঝরে পড়া কোন সুগন্ধি সাদা-কমলা ফুল পুজোর গন্ধ বয়ে আনে?",
    "Which fragrant white-and-orange flower falling under trees at autumn dawn carries the scent of Puja?",
    [
      ["শিউলি", "Shiuli (night jasmine)"],
      ["জবা", "Joba (hibiscus)"],
      ["পদ্ম", "Padma (lotus)"],
      ["গাঁদা", "Gada (marigold)"]
    ],
    0,
    "শিউলি শরতের ভোরের চেনা ফুল।",
    "Shiuli is the familiar flower of autumn dawn."
  ],
  [
    "uma",
    "আগমনী গানে দেবী দুর্গাকে কোন নামে বাপের বাড়ির মেয়ে হিসেবে ডাকা হয়?",
    "In Agomoni songs, by what name is Durga addressed as the daughter returning to her parental home?",
    [
      ["উমা", "Uma"],
      ["সীতা", "Sita"],
      ["রাধা", "Radha"],
      ["মীরা", "Mira"]
    ],
    0,
    "আগমনী গানে দুর্গা কন্যা উমা।",
    "In Agomoni songs Durga is the daughter Uma."
  ],
  [
    "himalaya",
    "লোককথায় উমার বাবার নাম কী?",
    "In folk tradition, who is Uma's father?",
    [
      ["গিরিরাজ হিমালয়", "Giriraj Himalaya"],
      ["ব্রহ্মা", "Brahma"],
      ["বরুণ", "Varuna"],
      ["ইন্দ্র", "Indra"]
    ],
    0,
    "লোকবিশ্বাসে উমা গিরিরাজ হিমালয় ও মেনকার কন্যা।",
    "In popular belief Uma is the daughter of Giriraj Himalaya and Menaka."
  ],
  [
    "kumortuli-clay",
    "প্রতিমা গড়ার প্রথম ধাপে মাটি লাগানো হয় কীসের কাঠামোর ওপর?",
    "Clay is first laid over a frame made of what when making an idol?",
    [
      ["খড় ও বাঁশ", "Straw and bamboo"],
      ["লোহা", "Iron"],
      ["কাচ", "Glass"],
      ["প্লাস্টিক", "Plastic"]
    ],
    0,
    "প্রচলিত কাঠামো বাঁশ আর খড় দিয়ে বাঁধা।",
    "The traditional frame is tied of bamboo and straw."
  ],
  [
    "theme",
    "আধুনিক বারোয়ারি পুজোয় মণ্ডপ সাজানোর মূল ভাবনাকে কী বলে?",
    "What is the central idea of decorating a modern community pandal called?",
    [
      ["থিম", "Theme"],
      ["মেনু", "Menu"],
      ["টিকিট", "Ticket"],
      ["বিল", "Bill"]
    ],
    0,
    "থিম-পুজোয় প্রতিটি মণ্ডপ একটি ভাবনা বা গল্প বলে।",
    "In a theme puja each pandal tells one idea or story."
  ],
  [
    "kolkata-bridge",
    "চন্দননগর কোন নদীর তীরে?",
    "Chandannagar stands on the bank of which river?",
    [
      ["হুগলি", "Hooghly"],
      ["অজয়", "Ajay"],
      ["ময়ূরাক্ষী", "Mayurakshi"],
      ["তিস্তা", "Teesta"]
    ],
    0,
    "চন্দননগর হুগলি নদীর তীরের শহর।",
    "Chandannagar is a town on the Hooghly."
  ],
  [
    "pujo-sangkhya",
    "পুজোর আগে প্রকাশিত সাহিত্য-সংকলনকে বাংলায় কী বলে?",
    "What are the literary collections published before Puja called in Bengali?",
    [
      ["পুজোসংখ্যা", "Pujosonkhya (Puja special issue)"],
      ["ক্যালেন্ডার", "Calendar"],
      ["পাঁজি", "Panji only"],
      ["বিজ্ঞাপন", "Advertisement"]
    ],
    0,
    "পুজোসংখ্যা পত্রিকা বাঙালির পুজোর পাঠের অংশ।",
    "Puja special issues are part of Bengali Puja reading."
  ],
  [
    "panch-day",
    "ষষ্ঠীর ঠিক আগের দিন কোনটি?",
    "Which day comes just before Shashthi?",
    [
      ["পঞ্চমী", "Panchami"],
      ["সপ্তমী", "Saptami"],
      ["অষ্টমী", "Ashtami"],
      ["দশমী", "Dashami"]
    ],
    0,
    "পঞ্চমীর পর ষষ্ঠী।",
    "Shashthi comes after Panchami."
  ],
  [
    "shola",
    "প্রতিমার সাজে ব্যবহৃত হালকা সাদা উদ্ভিজ্জ উপাদান কোনটি?",
    "Which light white plant material is used in idol decoration?",
    [
      ["শোলা", "Shola (pith)"],
      ["লোহা", "Iron"],
      ["প্লাস্টিক", "Plastic"],
      ["কাঁচ", "Glass"]
    ],
    0,
    "শোলার কাজ বাংলার এক পরিচিত হস্তশিল্প।",
    "Shola work is a well-known Bengali craft."
  ],
  [
    "kash-place",
    "কাশফুল কোথায় বেশি ফোটে?",
    "Where does kash grass bloom most?",
    [
      ["নদীর চর ও মাঠের ধারে", "River banks and field edges"],
      ["গভীর সমুদ্রে", "The deep sea"],
      ["বরফের ওপর", "On snow"],
      ["মরুভূমিতে", "In deserts"]
    ],
    0,
    "নদীর ধারে আর মাঠে কাশফুলের ঢেউ দেখা যায়।",
    "Waves of kash are seen along rivers and in fields."
  ],
  [
    "amantran",
    "দেবীকে আহ্বান জানানোর ধাপগুলোর মধ্যে বোধনের আগের প্রস্তুতিকে কী বলা হয়?",
    "Which preparatory ritual of invitation is associated with Bodhon?",
    [
      ["আমন্ত্রণ", "Amantran"],
      ["বিসর্জন", "Bisarjan"],
      ["তর্পণ", "Tarpan"],
      ["বরণ", "Boron"]
    ],
    0,
    "বোধনের সঙ্গে আমন্ত্রণ ও অধিবাসের রীতি জড়িয়ে আছে।",
    "Amantran and Adhivas are rites attached to Bodhon."
  ],
  [
    "dhaki-region",
    "ঢাকিরা পুজোর আগে প্রায়ই কোথা থেকে শহরে আসেন?",
    "Where do dhakis often travel to the city from before Puja?",
    [
      ["গ্রাম থেকে", "From villages"],
      ["সমুদ্রপথে বিদেশ থেকে", "From overseas by sea"],
      ["পাহাড়ের চূড়া থেকে", "From mountain peaks"],
      ["আকাশ থেকে", "From the sky"]
    ],
    0,
    "বহু ঢাকি গ্রাম থেকে শহরে আসেন পুজোর মরশুমে।",
    "Many dhakis come from villages in the Puja season."
  ],
  [
    "aarti-item",
    "আরতিতে সাধারণত কী ঘুরিয়ে দেবীকে নিবেদন করা হয়?",
    "What is usually waved before the goddess during aarti?",
    [
      ["প্রদীপ ও ধুনুচি", "Lamps and incense"],
      ["বই", "Books"],
      ["ছাতা", "Umbrellas"],
      ["মাছ", "Fish"]
    ],
    0,
    "প্রদীপ, ধুনুচি আর ফুল দিয়ে আরতি হয়।",
    "Aarti is done with lamps, incense and flowers."
  ],
  [
    "pratima-stage",
    "প্রতিমা গড়ার প্রচলিত ধাপ কোনটি সঠিক ক্রমে?",
    "Which is the correct order of steps in making an idol?",
    [
      ["কাঠামো, মাটি, রং", "Frame, clay, colour"],
      ["রং, কাঠামো, মাটি", "Colour, frame, clay"],
      ["মাটি, রং, কাঠামো", "Clay, colour, frame"],
      ["সাজ, মাটি, কাঠামো", "Decoration, clay, frame"]
    ],
    0,
    "আগে কাঠামো, তারপর মাটি, শেষে রং ও সাজ।",
    "First the frame, then clay, and finally colour and decoration."
  ],
  [
    "pandal-material",
    "মণ্ডপ তৈরিতে সাধারণত কোন হালকা উপাদান বেশি ব্যবহৃত হয়?",
    "Which light material is commonly used to build pandals?",
    [
      ["বাঁশ ও কাপড়", "Bamboo and cloth"],
      ["সোনা", "Gold"],
      ["কংক্রিট শুধু", "Only concrete"],
      ["কাচ শুধু", "Only glass"]
    ],
    0,
    "বাঁশ আর কাপড়ে অস্থায়ী মণ্ডপ গড়া সহজ।",
    "Bamboo and cloth make temporary pandals easy to build."
  ],
  [
    "purohit-role",
    "পুজোর মন্ত্র কে পড়েন?",
    "Who recites the mantras of the Puja?",
    [
      ["পুরোহিত", "The priest"],
      ["ঢাকি", "The dhaki"],
      ["কুমোর", "The potter"],
      ["দর্জি", "The tailor"]
    ],
    0,
    "পুরোহিত মন্ত্রোচ্চারণে পুজো করান।",
    "The priest conducts the Puja with mantras."
  ],
  [
    "festive-colour",
    "শুভ কাজে বাঙালি ঘরে সাধারণত কোন লাল-সাদা শাড়ি পরার চল?",
    "Which red-and-white sari is customarily worn on auspicious occasions in Bengali homes?",
    [
      ["লালপেড়ে সাদা শাড়ি", "Red-bordered white sari"],
      ["নীল শাড়ি শুধু", "Only blue saris"],
      ["কালো শাড়ি", "Black sari"],
      ["ধূসর শাড়ি", "Grey sari"]
    ],
    0,
    "লালপেড়ে সাদা শাড়ি বাংলার শুভ অনুষ্ঠানের চেনা সাজ।",
    "The red-bordered white sari is a familiar look for auspicious Bengali occasions."
  ]
];

const LAKSHMI: Q[] = [
  [
    "when",
    "কোজাগরী লক্ষ্মীপুজো কোন রাতে হয়?",
    "On which night is Kojagari Lakshmi Puja held?",
    [
      ["আশ্বিনের পূর্ণিমায়", "The full moon of Ashwin"],
      ["অমাবস্যায়", "New moon"],
      ["একাদশীতে", "Ekadashi"],
      ["সংক্রান্তিতে", "Sankranti"]
    ],
    0,
    "কোজাগরী লক্ষ্মীপুজো আশ্বিন পূর্ণিমার রাতে।",
    "It is held on the full-moon night of Ashwin."
  ],
  [
    "goddess",
    "কোজাগরী পূর্ণিমায় কোন দেবীর পুজো হয়?",
    "Which goddess is worshipped on the Kojagari full moon?",
    [
      ["লক্ষ্মী", "Lakshmi"],
      ["সরস্বতী", "Saraswati"],
      ["কালী", "Kali"],
      ["জগদ্ধাত্রী", "Jagaddhatri"]
    ],
    0,
    "লক্ষ্মী ধন ও সমৃদ্ধির দেবী।",
    "Lakshmi is the goddess of wealth and prosperity."
  ],
  [
    "owl",
    "লক্ষ্মীর বাহন কোন পাখি?",
    "Which bird is Lakshmi's mount?",
    [
      ["পেঁচা", "Owl"],
      ["ময়ূর", "Peacock"],
      ["হাঁস", "Swan"],
      ["টিয়া", "Parrot"]
    ],
    0,
    "লক্ষ্মীর বাহন পেঁচা।",
    "The owl is Lakshmi's mount."
  ],
  [
    "flower",
    "লক্ষ্মীকে সাধারণত কোন ফুলের ওপর বসা দেখানো হয়?",
    "On which flower is Lakshmi usually shown seated?",
    [
      ["পদ্ম", "Lotus"],
      ["জবা", "Hibiscus"],
      ["গোলাপ", "Rose"],
      ["গাঁদা", "Marigold"]
    ],
    0,
    "লক্ষ্মী পদ্মাসনা।",
    "Lakshmi is Padmasana, seated on a lotus."
  ],
  [
    "alpona",
    "লক্ষ্মীপুজোর দিন ঘরের মেঝেতে চালের গুঁড়োর গোলা দিয়ে কী আঁকা হয়?",
    "What is drawn on the floor with rice paste on Lakshmi Puja day?",
    [
      ["আলপনা ও লক্ষ্মীর পা", "Alpona and Lakshmi's footprints"],
      ["মানচিত্র", "A map"],
      ["বর্ণমালা শুধু", "Only the alphabet"],
      ["ঘড়ি", "A clock"]
    ],
    0,
    "চালের গুঁড়োয় আলপনা আর লক্ষ্মীর পায়ের ছাপ আঁকার রীতি।",
    "It is customary to draw alpona and Lakshmi's footprints in rice paste."
  ],
  [
    "naru",
    "কোজাগরীতে ঘরে ঘরে যে নারকেল-চিনির মিষ্টি বানানো হয়, তার নাম কী?",
    "What coconut-and-sugar sweet is made in homes on Kojagari?",
    [
      ["নাড়ু", "Naru"],
      ["রসগোল্লা", "Rasgulla"],
      ["জিলিপি", "Jilipi"],
      ["পান্তুয়া", "Pantua"]
    ],
    0,
    "নারকেলের নাড়ু কোজাগরীর চেনা ভোগ।",
    "Coconut naru is a familiar Kojagari offering."
  ],
  [
    "jagar",
    "'কোজাগরী' নামটির সঙ্গে লোকবিশ্বাসে কোন ভাবনা জড়িয়ে আছে?",
    "In popular belief, which idea is tied to the name 'Kojagari'?",
    [
      ["'কে জেগে আছে' - জেগে থাকা", "'Who is awake' - staying awake"],
      ["'কে ঘুমোচ্ছে'", "'Who is asleep'"],
      ["'কে গাইছে'", "'Who is singing'"],
      ["'কে হাসছে'", "'Who is laughing'"]
    ],
    0,
    "লোকমতে এই রাতে জেগে থাকা মানুষের ওপর লক্ষ্মীর কৃপা।",
    "Folk belief says Lakshmi favours those awake on this night."
  ],
  [
    "panchali",
    "লক্ষ্মীপুজোয় পাঠ করা পদ্যে-লেখা কাহিনি কী নামে পরিচিত?",
    "By what name is the verse story read at Lakshmi Puja known?",
    [
      ["লক্ষ্মীর পাঁচালী", "Lakshmir Panchali"],
      ["মেঘনাদবধ", "Meghnadbadh"],
      ["গীতাঞ্জলি", "Gitanjali"],
      ["আনন্দমঠ", "Anandamath"]
    ],
    0,
    "লক্ষ্মীর পাঁচালী লক্ষ্মীপুজোয় পড়া হয়।",
    "Lakshmir Panchali is read at Lakshmi Puja."
  ],
  [
    "jhanpi",
    "লক্ষ্মীর ঝাঁপিতে সাধারণত কী রাখা হয়?",
    "What is usually kept in the Lakshmi jhanpi (pot)?",
    [
      ["ধান", "Paddy"],
      ["ইট", "Bricks"],
      ["কাগজ", "Paper"],
      ["লোহা", "Iron"]
    ],
    0,
    "ধান বা চাল লক্ষ্মীর ঝাঁপির প্রতীক।",
    "Paddy or rice symbolises the Lakshmi pot."
  ],
  [
    "after-dashami",
    "কোজাগরী লক্ষ্মীপুজো দুর্গাপুজোর কতদিন পরে?",
    "How long after Durga Puja's Dashami is Kojagari Lakshmi Puja?",
    [
      ["কয়েক দিন পরে, পূর্ণিমায়", "A few days later, on the full moon"],
      ["এক বছর পরে", "A year later"],
      ["এক মাস আগে", "A month before"],
      ["সেদিনই", "The same day"]
    ],
    0,
    "বিজয়া দশমীর কয়েক দিন পরের পূর্ণিমায় লক্ষ্মীপুজো।",
    "Lakshmi Puja is on the full moon a few days after Bijoya Dashami."
  ]
];

const KALI: Q[] = [
  [
    "tithi",
    "বাংলায় কালীপুজো কোন তিথিতে হয়?",
    "On which lunar day is Kali Puja held in Bengal?",
    [
      ["অমাবস্যায়", "New moon (Amavasya)"],
      ["পূর্ণিমায়", "Full moon"],
      ["একাদশীতে", "Ekadashi"],
      ["ষষ্ঠীতে", "Shashthi"]
    ],
    0,
    "কার্তিকের অমাবস্যার রাতে কালীপুজো।",
    "Kali Puja is on the new-moon night of Kartik."
  ],
  [
    "diwali",
    "বাংলায় কালীপুজোর রাতে আর কোন উৎসবের আলো জ্বলে?",
    "Which festival's lights are lit on the night of Kali Puja in Bengal?",
    [
      ["দীপাবলি", "Dipabali (Diwali)"],
      ["হোলি", "Holi"],
      ["রথযাত্রা", "Rath Yatra"],
      ["নবান্ন", "Nabanna"]
    ],
    0,
    "কালীপুজোর রাতেই দীপাবলির প্রদীপ ও আলো।",
    "Lamps of Diwali light up the same night as Kali Puja."
  ],
  [
    "bhoot",
    "কালীপুজোর আগের দিনের চতুর্দশীকে বাংলায় কী বলে?",
    "What is the Chaturdashi the day before Kali Puja called in Bengal?",
    [
      ["ভূতচতুর্দশী", "Bhoot Chaturdashi"],
      ["জামাইষষ্ঠী", "Jamai Shashthi"],
      ["ভাইফোঁটা", "Bhai Phota"],
      ["বিজয়া", "Bijoya"]
    ],
    0,
    "ভূতচতুর্দশীতে চৌদ্দ প্রদীপ জ্বালানো আর চৌদ্দ শাক খাওয়ার রীতি।",
    "On Bhoot Chaturdashi, lighting fourteen lamps and eating fourteen greens is a custom."
  ],
  [
    "shaak",
    "ভূতচতুর্দশীতে কয়টি শাক খাওয়ার রীতি?",
    "How many kinds of greens are traditionally eaten on Bhoot Chaturdashi?",
    [
      ["চৌদ্দ", "Fourteen"],
      ["পাঁচ", "Five"],
      ["সাত", "Seven"],
      ["একশো", "One hundred"]
    ],
    0,
    "চৌদ্দ রকম শাক খাওয়ার প্রচলন আছে।",
    "Eating fourteen kinds of greens is customary."
  ],
  [
    "dakshineswar",
    "দক্ষিণেশ্বর কালীমন্দির কোন রানি প্রতিষ্ঠা করেন?",
    "Which Rani founded the Dakshineswar Kali Temple?",
    [
      ["রানি রাসমণি", "Rani Rashmoni"],
      ["রানি ভিক্টোরিয়া", "Queen Victoria"],
      ["রানি লক্ষ্মীবাঈ", "Rani Lakshmibai"],
      ["রানি ভবানী", "Rani Bhabani"]
    ],
    0,
    "১৮৫৫ সালে রানি রাসমণি দক্ষিণেশ্বর কালীমন্দির প্রতিষ্ঠা করেন।",
    "Rani Rashmoni founded the Dakshineswar Kali Temple in 1855."
  ],
  [
    "ramakrishna",
    "দক্ষিণেশ্বর মন্দিরের সঙ্গে কোন সাধক বিশেষভাবে জড়িত?",
    "Which saint is closely associated with the Dakshineswar temple?",
    [
      ["শ্রীরামকৃষ্ণ", "Sri Ramakrishna"],
      ["রাজা রামমোহন রায়", "Raja Ram Mohan Roy"],
      ["নেতাজি", "Netaji"],
      ["কাজী নজরুল", "Kazi Nazrul"]
    ],
    0,
    "শ্রীরামকৃষ্ণ এই মন্দিরের পুরোহিত ছিলেন।",
    "Sri Ramakrishna served as priest at this temple."
  ],
  [
    "flower",
    "কালীপুজোয় সাধারণত কোন লাল ফুল নিবেদন করা হয়?",
    "Which red flower is commonly offered in Kali Puja?",
    [
      ["জবা", "Joba (hibiscus)"],
      ["রজনীগন্ধা", "Rajanigandha"],
      ["শিউলি", "Shiuli"],
      ["কাশ", "Kash"]
    ],
    0,
    "লাল জবা কালীপুজোর চেনা ফুল।",
    "Red hibiscus is the familiar Kali Puja flower."
  ],
  [
    "shyama",
    "কালীকে নিবেদিত ভক্তিগীতির ধারাকে কী বলা হয়?",
    "What is the genre of devotional songs to Kali called?",
    [
      ["শ্যামাসংগীত", "Shyama Sangeet"],
      ["বাউল", "Baul"],
      ["রবীন্দ্রসংগীত", "Rabindra Sangeet"],
      ["ভাটিয়ালি", "Bhatiali"]
    ],
    0,
    "শ্যামাসংগীতে কালী মায়ের প্রতি ভক্তি ও আত্মসমর্পণ ফুটে ওঠে।",
    "Shyama Sangeet expresses devotion to Mother Kali."
  ],
  [
    "kalighat",
    "কলকাতার কালীঘাট কোন দেবীর মন্দিরের জন্য বিখ্যাত?",
    "Kalighat in Kolkata is famous for the temple of which goddess?",
    [
      ["কালী", "Kali"],
      ["লক্ষ্মী", "Lakshmi"],
      ["সরস্বতী", "Saraswati"],
      ["জগদ্ধাত্রী", "Jagaddhatri"]
    ],
    0,
    "কালীঘাটের কালীমন্দির বহু মানুষের কাছে পরিচিত তীর্থ।",
    "The Kalighat Kali temple is a well-known pilgrimage site."
  ],
  [
    "light",
    "দীপাবলির রাতে বাড়ির চারপাশে কী জ্বালানো হয়?",
    "What is lit around the house on the night of Dipabali?",
    [
      ["মাটির প্রদীপ ও মোমবাতি", "Clay lamps and candles"],
      ["শুধু টর্চ", "Only torches"],
      ["আগুনের গোলা", "Fire balls only"],
      ["কিছুই না", "Nothing"]
    ],
    0,
    "প্রদীপ ও মোমের আলোয় বাড়ি সাজে।",
    "Homes are decorated with lamps and candle light."
  ]
];

const BHAI_PHOTA: Q[] = [
  [
    "who",
    "ভাইফোঁটায় কারা কাদের কপালে ফোঁটা দেন?",
    "On Bhai Phota, who applies the tika on whose forehead?",
    [
      ["বোনেরা ভাইদের", "Sisters on brothers"],
      ["ভাইয়েরা বোনদের", "Brothers on sisters"],
      ["ছাত্ররা শিক্ষকদের", "Students on teachers"],
      ["কেউ না", "No one"]
    ],
    0,
    "বোনেরা ভাইদের কপালে চন্দনের ফোঁটা দিয়ে মঙ্গল কামনা করেন।",
    "Sisters apply a sandalwood tika on brothers' foreheads and wish them well."
  ],
  [
    "sub",
    "ভাইফোঁটায় ফোঁটা দেওয়ার জন্য সাধারণত কী ব্যবহার করা হয়?",
    "What is commonly used to apply the Bhai Phota tika?",
    [
      ["চন্দন", "Sandalwood paste"],
      ["কালি", "Ink"],
      ["আলকাতরা", "Tar"],
      ["রং-পেন্সিল", "Crayon"]
    ],
    0,
    "চন্দনের ফোঁটা ভাইফোঁটার চেনা রীতি।",
    "The sandalwood tika is the familiar custom."
  ],
  [
    "gift",
    "ভাইফোঁটায় ভাইয়েরা সাধারণত বোনদের কী দেন?",
    "What do brothers usually give sisters on Bhai Phota?",
    [
      ["উপহার", "Gifts"],
      ["কাজ", "Work"],
      ["গালি", "Insults"],
      ["ঘুম", "Sleep"]
    ],
    0,
    "ভাইয়েরা উপহার দেন আর বোনেরা মিষ্টিমুখ করান।",
    "Brothers give gifts and sisters offer sweets."
  ],
  [
    "date",
    "ভাইফোঁটা কালীপুজোর কত দিন পরে পালিত হয়?",
    "How long after Kali Puja is Bhai Phota observed?",
    [
      ["দুই দিন পরে", "Two days later"],
      ["এক বছর পরে", "A year later"],
      ["ঠিক আগের দিন", "The day before"],
      ["এক মাস পরে", "A month later"]
    ],
    0,
    "কালীপুজোর পর দ্বিতীয় দিনে ভাইফোঁটা।",
    "Bhai Phota falls on the second day after Kali Puja."
  ],
  [
    "meaning",
    "'ফোঁটা' শব্দের অর্থ কী?",
    "What does the word 'phota' mean here?",
    [
      ["কপালে দেওয়া ছোট টিপ বা দাগ", "A small dot applied on the forehead"],
      ["ফোটা ফুল", "A blossom"],
      ["ফোঁটা জল শুধু", "A drop of water only"],
      ["একটি গান", "A song"]
    ],
    0,
    "কপালে চন্দনের ছোট টিপকেই ফোঁটা বলে।",
    "The sandalwood dot on the forehead is the phota."
  ],
  [
    "dhan",
    "ভাইফোঁটার ফোঁটার সঙ্গে সাধারণত কোন দুটি জিনিস মাথায় ছোঁয়ানো হয়?",
    "Which two items are typically touched to the head with the tika?",
    [
      ["ধান ও দূর্বা", "Paddy and durva grass"],
      ["ইট ও বালি", "Brick and sand"],
      ["লোহা ও কাচ", "Iron and glass"],
      ["কাগজ ও কলম", "Paper and pen"]
    ],
    0,
    "ধান আর দূর্বা আশীর্বাদের প্রতীক।",
    "Paddy and durva are symbols of blessing."
  ],
  [
    "feast",
    "ভাইফোঁটায় বোনেরা ভাইদের জন্য কী আয়োজন করেন?",
    "What do sisters arrange for their brothers on Bhai Phota?",
    [
      ["মিষ্টি ও ভালো খাবার", "Sweets and good food"],
      ["পরীক্ষা", "An exam"],
      ["দৌড় প্রতিযোগিতা", "A race"],
      ["কিছু না", "Nothing"]
    ],
    0,
    "ভাইফোঁটার দিনে বাড়িতে মিষ্টি ও বিশেষ খাওয়ার আয়োজন হয়।",
    "Homes prepare sweets and a special meal."
  ],
  [
    "cousins",
    "ভাইফোঁটা শুধু সহোদর নয়, আর কাদের মধ্যেও পালিত হয়?",
    "Besides siblings, between whom else is Bhai Phota also observed?",
    [
      ["পাতানো ভাই-বোনদের মধ্যে", "Adopted or cousin brothers and sisters"],
      ["গাছেদের মধ্যে", "Trees"],
      ["পাখিদের মধ্যে", "Birds"],
      ["নদীদের মধ্যে", "Rivers"]
    ],
    0,
    "অনেকে মামাতো-পিসতুতো ও পাতানো ভাই-বোনদেরও ফোঁটা দেন।",
    "Many also perform it with cousins and adopted siblings."
  ],
  [
    "yama",
    "লোককথায় ভাইফোঁটার সঙ্গে কোন ভাই-বোনের গল্প জড়িয়ে আছে?",
    "Which sibling pair's story is linked to Bhai Phota in folk tradition?",
    [
      ["যম ও যমুনা", "Yama and Yamuna"],
      ["রাম ও লক্ষ্মণ", "Ram and Lakshman"],
      ["গণেশ ও কার্তিক", "Ganesha and Kartik"],
      ["উমা ও গঙ্গা", "Uma and Ganga"]
    ],
    0,
    "যম ও যমুনার কাহিনির সঙ্গে এই রীতির যোগ বলা হয়।",
    "The custom is said to be linked to the tale of Yama and Yamuna."
  ],
  [
    "greet",
    "ভাইফোঁটার দিনে বোন ভাইকে কী কামনা করেন?",
    "What does a sister wish for her brother on Bhai Phota?",
    [
      ["দীর্ঘ জীবন ও মঙ্গল", "Long life and well-being"],
      ["গরম আবহাওয়া", "Hot weather"],
      ["ভারী বোঝা", "A heavy load"],
      ["দেরি", "Delay"]
    ],
    0,
    "ফোঁটা দিয়ে ভাইয়ের দীর্ঘ জীবন ও মঙ্গল কামনা করা হয়।",
    "The tika carries wishes for long life and well-being."
  ]
];

const JAGADDHATRI: Q[] = [
  [
    "town",
    "জগদ্ধাত্রী পুজোর জন্য বাংলার কোন শহর সবচেয়ে বিখ্যাত?",
    "Which Bengal town is most famous for Jagaddhatri Puja?",
    [
      ["চন্দননগর", "Chandannagar"],
      ["দার্জিলিং", "Darjeeling"],
      ["দুর্গাপুর", "Durgapur"],
      ["হলদিয়া", "Haldia"]
    ],
    0,
    "চন্দননগরের জগদ্ধাত্রী পুজো ও আলোকসজ্জা সুবিখ্যাত।",
    "Chandannagar's Jagaddhatri Puja and its lights are renowned."
  ],
  [
    "arms",
    "প্রচলিত প্রতিমায় জগদ্ধাত্রীর কয়টি হাত?",
    "How many arms does Jagaddhatri have in the usual idol?",
    [
      ["চার", "Four"],
      ["দশ", "Ten"],
      ["দুই", "Two"],
      ["আট", "Eight"]
    ],
    0,
    "জগদ্ধাত্রী চতুর্ভুজা।",
    "Jagaddhatri is four-armed."
  ],
  [
    "lion",
    "জগদ্ধাত্রীর বাহন কী?",
    "What is Jagaddhatri's mount?",
    [
      ["সিংহ", "Lion"],
      ["পেঁচা", "Owl"],
      ["ময়ূর", "Peacock"],
      ["হাঁস", "Swan"]
    ],
    0,
    "জগদ্ধাত্রী সিংহবাহিনী।",
    "Jagaddhatri rides a lion."
  ],
  [
    "meaning",
    "'জগদ্ধাত্রী' নামের অর্থ কী?",
    "What does the name 'Jagaddhatri' mean?",
    [
      ["জগৎ-ধারণকারী মাতা", "Bearer or sustainer of the world"],
      ["নদীর দেবী", "Goddess of rivers"],
      ["ঋতুর দেবী", "Goddess of seasons"],
      ["বাদ্যের দেবী", "Goddess of music"]
    ],
    0,
    "জগৎ + ধাত্রী: জগৎকে ধারণ যিনি করেন।",
    "Jagat plus dhatri: she who sustains the world."
  ],
  [
    "after",
    "জগদ্ধাত্রী পুজো কালীপুজোর আগে না পরে হয়?",
    "Does Jagaddhatri Puja come before or after Kali Puja?",
    [
      ["পরে", "After"],
      ["আগে", "Before"],
      ["একই রাতে", "The same night"],
      ["এক বছর আগে", "A year before"]
    ],
    0,
    "কার্তিক মাসে কালীপুজোর কয়েক দিন পরে জগদ্ধাত্রী পুজো।",
    "Jagaddhatri Puja follows Kali Puja by some days in Kartik."
  ],
  [
    "lights",
    "চন্দননগরের জগদ্ধাত্রী পুজোর সঙ্গে কোন শিল্প বিশেষভাবে জড়িত?",
    "Which craft is especially linked with Chandannagar's Jagaddhatri Puja?",
    [
      ["আলোকসজ্জা", "Lighting art"],
      ["বই ছাপা", "Book printing"],
      ["জাহাজ তৈরি", "Shipbuilding"],
      ["চা বাগান", "Tea gardens"]
    ],
    0,
    "চন্দননগরের আলোর কাজ দেশজুড়ে পরিচিত।",
    "Chandannagar's light work is known across the country."
  ],
  [
    "river",
    "চন্দননগরের বিসর্জন শোভাযাত্রা কোন নদীর তীরে শেষ হয়?",
    "The Chandannagar immersion procession ends on the bank of which river?",
    [
      ["হুগলি (গঙ্গা)", "Hooghly (Ganga)"],
      ["তিস্তা", "Teesta"],
      ["অজয়", "Ajay"],
      ["দামোদর", "Damodar"]
    ],
    0,
    "চন্দননগরের শোভাযাত্রা গঙ্গার তীরে শেষ হয়।",
    "The procession ends at the Ganga's bank."
  ],
  [
    "krishnanagar",
    "জগদ্ধাত্রী পুজোর জন্য নদিয়ার কোন শহরও পরিচিত?",
    "Which town in Nadia is also known for Jagaddhatri Puja?",
    [
      ["কৃষ্ণনগর", "Krishnanagar"],
      ["শিলিগুড়ি", "Siliguri"],
      ["আসানসোল", "Asansol"],
      ["হাওড়া", "Howrah"]
    ],
    0,
    "কৃষ্ণনগরেও জগদ্ধাত্রী পুজো বিখ্যাত।",
    "Krishnanagar too is known for it."
  ],
  [
    "month",
    "জগদ্ধাত্রী পুজো বাংলা কোন মাসে হয়?",
    "In which Bengali month is Jagaddhatri Puja held?",
    [
      ["কার্তিক", "Kartik"],
      ["বৈশাখ", "Boishakh"],
      ["আষাঢ়", "Ashar"],
      ["চৈত্র", "Chaitra"]
    ],
    0,
    "কার্তিক মাসে জগদ্ধাত্রী পুজো।",
    "It falls in the month of Kartik."
  ],
  [
    "compare",
    "জগদ্ধাত্রী আর দুর্গার প্রতিমার একটি মিল কী?",
    "What do the idols of Jagaddhatri and Durga share?",
    [
      ["দুজনেরই বাহন সিংহ", "Both have a lion as mount"],
      ["দুজনেরই বাহন পেঁচা", "Both have an owl"],
      ["দুজনেরই দশ হাত", "Both have ten arms"],
      ["দুজনেই বীণা বাজান", "Both play the veena"]
    ],
    0,
    "দুই দেবীকেই সিংহবাহিনী রূপে দেখানো হয়।",
    "Both goddesses are shown with a lion."
  ]
];

/** Keyed by ISO date. The countdown set is shared by 11-16 Oct: each day draws its own five. */
export const FESTIVE_QUIZ_2: Record<string, QuizQuestion[]> = (() => {
  const countdown = build("countdown", COUNTDOWN);
  const out: Record<string, QuizQuestion[]> = {};
  for (let d = 11; d <= 16; d++) out[`2026-10-${String(d).padStart(2, "0")}`] = countdown;
  out["2026-10-25"] = build("lakshmi", LAKSHMI);
  out["2026-11-08"] = build("kali", KALI);
  out["2026-11-10"] = build("bhaiphota", BHAI_PHOTA);
  out["2026-11-17"] = build("jagaddhatri", JAGADDHATRI);
  return out;
})();
