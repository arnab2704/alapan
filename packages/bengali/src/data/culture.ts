export interface DailyWord {
  word: string;
  roman: string;
  meaningBn: string;
  meaningEn: string;
  exampleBn: string;
}

export interface CulturePerson {
  slug: string;
  nameBn: string;
  nameEn: string;
  lifeBn: string;
  lifeEn: string;
  fieldBn: string;
  fieldEn: string;
  blurbBn: string;
  blurbEn: string;
}

export interface HistoryEvent {
  slug: string;
  /** 1-12 */
  month: number;
  day: number;
  year: number;
  titleBn: string;
  titleEn: string;
  detailBn: string;
  detailEn: string;
}

export const DAILY_WORDS: DailyWord[] = [
  {
    word: "আড্ডা",
    roman: "adda",
    meaningBn: "বন্ধুবান্ধব মিলে অবসরে প্রাণখোলা গল্প",
    meaningEn: "a leisurely, free-flowing conversation among friends",
    exampleBn: "চায়ের দোকানে জমে উঠল সন্ধ্যার আড্ডা।"
  },
  {
    word: "শিউলি",
    roman: "shiuli",
    meaningBn: "শরতের ভোরে ঝরে পড়া সাদা-কমলা সুগন্ধি ফুল",
    meaningEn: "the fragrant white-and-orange night jasmine that falls at autumn dawn",
    exampleBn: "ভোরে উঠোনজুড়ে শিউলি ছড়িয়ে ছিল।"
  },
  {
    word: "কাশফুল",
    roman: "kashphul",
    meaningBn: "শরৎকালের নদীতীর ও মাঠে ফোটা সাদা ফুল",
    meaningEn: "the white grass plumes that bloom along riverbanks in autumn",
    exampleBn: "কাশফুলের দোল দেখেই বোঝা গেল পুজো এসে গেছে।"
  },
  {
    word: "আলপনা",
    roman: "alpona",
    meaningBn: "চালের গুঁড়োর গোলা দিয়ে মেঝেতে আঁকা নকশা",
    meaningEn: "ritual floor art painted with rice-paste",
    exampleBn: "দরজার সামনে মা সুন্দর আলপনা এঁকেছেন।"
  },
  {
    word: "ঢাক",
    roman: "dhak",
    meaningBn: "পুজোর সময় বাজানো বড় বাঙালি ঢোল",
    meaningEn: "the large drum whose beat announces Durga Puja",
    exampleBn: "ঢাকের বোলে মন নেচে ওঠে।"
  },
  {
    word: "রোদ্দুর",
    roman: "roddur",
    meaningBn: "সূর্যের আলো, বিশেষত মিষ্টি শীতের রোদ",
    meaningEn: "sunshine, especially the gentle winter sun",
    exampleBn: "শীতের রোদ্দুরে ছাদে বসে গল্প জমল।"
  },
  {
    word: "প্রবাস",
    roman: "probash",
    meaningBn: "নিজের দেশ বা ঘর ছেড়ে দূরে থাকা",
    meaningEn: "living away from one's homeland",
    exampleBn: "প্রবাসে থেকেও তিনি বাংলা বই পড়েন।"
  },
  {
    word: "স্বপ্ন",
    roman: "shopno",
    meaningBn: "ঘুমের মধ্যে দেখা দৃশ্য; আশা বা আকাঙ্ক্ষা",
    meaningEn: "a dream; a hope or aspiration",
    exampleBn: "বড় হওয়ার স্বপ্ন নিয়ে সে শহরে এল।"
  },
  {
    word: "মায়া",
    roman: "maya",
    meaningBn: "স্নেহ, মমতা বা টান",
    meaningEn: "affection and an emotional pull",
    exampleBn: "পুরোনো পাড়ার প্রতি তার মায়া কমেনি।"
  },
  {
    word: "সন্ধ্যা",
    roman: "shondhya",
    meaningBn: "দিন ও রাতের মিলনের সময়",
    meaningEn: "dusk, where day meets night",
    exampleBn: "সন্ধ্যায় ঘরে ঘরে শাঁখ বেজে উঠল।"
  },
  {
    word: "নৌকা",
    roman: "nouka",
    meaningBn: "নদীতে চলার ছোট জলযান",
    meaningEn: "a boat for travelling on rivers",
    exampleBn: "মাঝি নৌকা ভাসিয়ে দিল পদ্মার বুকে।"
  },
  {
    word: "মিষ্টি",
    roman: "mishti",
    meaningBn: "মিষ্টান্ন; মধুর স্বাদের খাবার বা মধুর স্বভাব",
    meaningEn: "a sweet; also sweet-natured",
    exampleBn: "বিজয়ার দিনে সবাই মিষ্টি খাওয়ায়।"
  },
  {
    word: "বৃষ্টি",
    roman: "brishti",
    meaningBn: "আকাশ থেকে পড়া জলের ফোঁটা",
    meaningEn: "rain",
    exampleBn: "ঝিরঝিরে বৃষ্টিতে খিচুড়ির গন্ধ ভেসে এল।"
  },
  {
    word: "খিচুড়ি",
    roman: "khichuri",
    meaningBn: "চাল-ডাল একসঙ্গে রান্না করা খাবার",
    meaningEn: "rice and lentils cooked together, a monsoon and festival favourite",
    exampleBn: "অষ্টমীর ভোগে খিচুড়ি ছিল সবচেয়ে প্রিয়।"
  },
  {
    word: "পুঁথি",
    roman: "punthi",
    meaningBn: "হাতে লেখা প্রাচীন পাণ্ডুলিপি",
    meaningEn: "a handwritten manuscript of old",
    exampleBn: "গ্রন্থাগারে একটি পুরোনো পুঁথি সংরক্ষিত আছে।"
  },
  {
    word: "ভাটিয়ালি",
    roman: "bhatiali",
    meaningBn: "নদীর মাঝিদের গাওয়া ভাটির সুরের লোকগান",
    meaningEn: "a folk song sung by boatmen drifting downstream",
    exampleBn: "মাঝির ভাটিয়ালি সুরে নদী যেন আরও শান্ত হল।"
  },
  {
    word: "পার্বণ",
    roman: "parbon",
    meaningBn: "ধর্মীয় বা সামাজিক উৎসবের দিন",
    meaningEn: "a festival or ritual occasion",
    exampleBn: "পৌষ পার্বণে ঘরে ঘরে পিঠের আয়োজন।"
  },
  {
    word: "পিঠে",
    roman: "pithe",
    meaningBn: "চাল বা গুড়ের তৈরি শীতের ঐতিহ্যবাহী মিষ্টি",
    meaningEn: "traditional winter rice-cakes made with jaggery",
    exampleBn: "সংক্রান্তিতে দিদা পুলি পিঠে বানালেন।"
  },
  {
    word: "শাঁখ",
    roman: "shankh",
    meaningBn: "শঙ্খের তৈরি বাদ্য, মঙ্গলধ্বনির জন্য বাজানো হয়",
    meaningEn: "a conch shell blown as an auspicious call",
    exampleBn: "সন্ধ্যায় শাঁখের আওয়াজে পাড়া ভরে গেল।"
  },
  {
    word: "উদাস",
    roman: "udas",
    meaningBn: "অন্যমনস্ক, কিছুতে মন না বসা ভাব",
    meaningEn: "a wistful, absent-minded mood",
    exampleBn: "বর্ষার দুপুরে মনটা কেমন উদাস হয়ে যায়।"
  },
  {
    word: "পাড়া",
    roman: "para",
    meaningBn: "শহর বা গ্রামের ছোট প্রতিবেশী এলাকা",
    meaningEn: "a close-knit neighbourhood",
    exampleBn: "আমাদের পাড়ার পুজোই সবচেয়ে জমজমাট।"
  },
  {
    word: "গল্প",
    roman: "golpo",
    meaningBn: "কাহিনি বা কথাবার্তা",
    meaningEn: "a story, or a chat",
    exampleBn: "ঠাকুরমার কাছে রূপকথার গল্প শুনতে ভালো লাগত।"
  },
  {
    word: "বইমেলা",
    roman: "boimela",
    meaningBn: "বই কেনাবেচা ও লেখক-পাঠকের মিলনমেলা",
    meaningEn: "a book fair, a meeting place for readers and writers",
    exampleBn: "ফেব্রুয়ারিতে বইমেলায় ভিড় উপচে পড়ে।"
  },
  {
    word: "ভোর",
    roman: "bhor",
    meaningBn: "সূর্যোদয়ের ঠিক আগের সময়",
    meaningEn: "the hour just before sunrise",
    exampleBn: "মহালয়ার ভোরে রেডিওতে চণ্ডীপাঠ শোনার রেওয়াজ আছে।"
  },
  {
    word: "নকশি কাঁথা",
    roman: "nokshi kantha",
    meaningBn: "পুরোনো কাপড়ে সুতোর নকশা তুলে তৈরি কাঁথা",
    meaningEn: "a quilt embroidered from layers of old cloth",
    exampleBn: "গ্রামের মেয়েরা নকশি কাঁথায় গল্প বুনে দেয়।"
  },
  {
    word: "বিজয়া",
    roman: "bijoya",
    meaningBn: "দশমীর পর প্রণাম, কোলাকুলি ও শুভেচ্ছা বিনিময়",
    meaningEn: "the post-Dashami exchange of blessings and greetings",
    exampleBn: "বিজয়ার দিনে বড়দের প্রণাম করতে হয়।"
  },
  {
    word: "হাওয়া",
    roman: "haowa",
    meaningBn: "বাতাস, বায়ু",
    meaningEn: "the breeze",
    exampleBn: "শরতের হাওয়ায় আলাদা একটা আনন্দ আছে।"
  },
  {
    word: "বাউল",
    roman: "baul",
    meaningBn: "গানের মাধ্যমে জীবনদর্শন প্রকাশ করা লোকসাধক",
    meaningEn: "a wandering folk mystic who sings of life and spirit",
    exampleBn: "একতারা হাতে বাউল গ্রামের পথ ধরে হাঁটছিল।"
  }
];

export const CULTURE_PEOPLE: CulturePerson[] = [
  {
    slug: "rabindranath-tagore",
    nameBn: "রবীন্দ্রনাথ ঠাকুর",
    nameEn: "Rabindranath Tagore",
    lifeBn: "১৮৬১–১৯৪১",
    lifeEn: "1861–1941",
    fieldBn: "কবি ও সাহিত্যিক",
    fieldEn: "Poet and writer",
    blurbBn:
      "গীতাঞ্জলির জন্য ১৯১৩ সালে সাহিত্যে নোবেল পুরস্কার পান; রচনা করেছেন কবিতা, গান, গল্প, উপন্যাস ও নাটক।",
    blurbEn:
      "Won the 1913 Nobel Prize in Literature for Gitanjali; wrote poems, songs, stories, novels and plays."
  },
  {
    slug: "kazi-nazrul-islam",
    nameBn: "কাজী নজরুল ইসলাম",
    nameEn: "Kazi Nazrul Islam",
    lifeBn: "১৮৯৯–১৯৭৬",
    lifeEn: "1899–1976",
    fieldBn: "কবি ও সংগীতস্রষ্টা",
    fieldEn: "Poet and composer",
    blurbBn: "'বিদ্রোহী কবি' নামে পরিচিত; তাঁর কবিতা ও গানে সাম্য, স্বাধীনতা আর মানবতার সুর।",
    blurbEn: "Known as the 'Rebel Poet'; his poems and songs carry themes of equality, freedom and humanity."
  },
  {
    slug: "satyajit-ray",
    nameBn: "সত্যজিৎ রায়",
    nameEn: "Satyajit Ray",
    lifeBn: "১৯২১–১৯৯২",
    lifeEn: "1921–1992",
    fieldBn: "চলচ্চিত্রকার ও লেখক",
    fieldEn: "Filmmaker and writer",
    blurbBn:
      "'পথের পাঁচালী' (১৯৫৫) দিয়ে বিশ্বদরবারে বাংলা সিনেমার আসন পাকা করেন; ফেলুদা ও প্রফেসর শঙ্কুর স্রষ্টা।",
    blurbEn:
      "Put Bengali cinema on the world map with Pather Panchali (1955); creator of Feluda and Professor Shonku."
  },
  {
    slug: "ishwar-chandra-vidyasagar",
    nameBn: "ঈশ্বরচন্দ্র বিদ্যাসাগর",
    nameEn: "Ishwar Chandra Vidyasagar",
    lifeBn: "১৮২০–১৮৯১",
    lifeEn: "1820–1891",
    fieldBn: "শিক্ষাবিদ ও সমাজসংস্কারক",
    fieldEn: "Educator and social reformer",
    blurbBn:
      "বিধবা বিবাহ আইন (১৮৫৬) প্রবর্তনে নেতৃত্ব দেন এবং আধুনিক বাংলা গদ্য ও বর্ণপরিচয়ের ভিত্তি গড়েন।",
    blurbEn:
      "Led the campaign behind the Widow Remarriage Act of 1856 and shaped modern Bengali prose and primer education."
  },
  {
    slug: "jagadish-chandra-bose",
    nameBn: "জগদীশচন্দ্র বসু",
    nameEn: "Jagadish Chandra Bose",
    lifeBn: "১৮৫৮–১৯৩৭",
    lifeEn: "1858–1937",
    fieldBn: "বিজ্ঞানী",
    fieldEn: "Scientist",
    blurbBn:
      "বিনা তারে বার্তা প্রেরণ ও উদ্ভিদের সাড়া নিয়ে পথিকৃৎ গবেষণা করেছেন; বসু বিজ্ঞান মন্দিরের প্রতিষ্ঠাতা।",
    blurbEn: "Pioneered research on radio waves and plant responses; founded the Bose Institute."
  },
  {
    slug: "satyendra-nath-bose",
    nameBn: "সত্যেন্দ্রনাথ বসু",
    nameEn: "Satyendra Nath Bose",
    lifeBn: "১৮৯৪–১৯৭৪",
    lifeEn: "1894–1974",
    fieldBn: "পদার্থবিজ্ঞানী",
    fieldEn: "Physicist",
    blurbBn: "আইনস্টাইনের সঙ্গে বোস–আইনস্টাইন পরিসংখ্যানের ভিত্তি গড়েন; বোসন কণার নাম তাঁর নামেই।",
    blurbEn: "Laid the foundations of Bose–Einstein statistics with Einstein; the boson is named after him."
  },
  {
    slug: "bankim-chandra-chattopadhyay",
    nameBn: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
    nameEn: "Bankim Chandra Chattopadhyay",
    lifeBn: "১৮৩৮–১৮৯৪",
    lifeEn: "1838–1894",
    fieldBn: "ঔপন্যাসিক",
    fieldEn: "Novelist",
    blurbBn: "বাংলা উপন্যাসের অগ্রদূত; 'দুর্গেশনন্দিনী' ও 'আনন্দমঠ' তাঁর বিখ্যাত রচনা।",
    blurbEn: "A pioneer of the Bengali novel, known for Durgeshnandini and Anandamath."
  },
  {
    slug: "sarat-chandra-chattopadhyay",
    nameBn: "শরৎচন্দ্র চট্টোপাধ্যায়",
    nameEn: "Sarat Chandra Chattopadhyay",
    lifeBn: "১৮৭৬–১৯৩৮",
    lifeEn: "1876–1938",
    fieldBn: "ঔপন্যাসিক",
    fieldEn: "Novelist",
    blurbBn: "'দেবদাস', 'শ্রীকান্ত' ও 'পথের দাবী'র মতো জনপ্রিয় উপন্যাসের লেখক।",
    blurbEn: "Author of beloved novels such as Devdas, Srikanta and Pather Dabi."
  },
  {
    slug: "bibhutibhushan-bandyopadhyay",
    nameBn: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    nameEn: "Bibhutibhushan Bandyopadhyay",
    lifeBn: "১৮৯৪–১৯৫০",
    lifeEn: "1894–1950",
    fieldBn: "ঔপন্যাসিক",
    fieldEn: "Novelist",
    blurbBn: "'পথের পাঁচালী' ও 'আরণ্যক'-এ গ্রামবাংলা আর প্রকৃতির অপূর্ব ছবি এঁকেছেন।",
    blurbEn: "Painted rural Bengal and nature with rare tenderness in Pather Panchali and Aranyak."
  },
  {
    slug: "jibanananda-das",
    nameBn: "জীবনানন্দ দাশ",
    nameEn: "Jibanananda Das",
    lifeBn: "১৮৯৯–১৯৫৪",
    lifeEn: "1899–1954",
    fieldBn: "কবি",
    fieldEn: "Poet",
    blurbBn:
      "'রূপসী বাংলা' ও 'বনলতা সেন'-এর কবি; প্রকৃতির নিবিড় চিত্রকল্পে আধুনিক বাংলা কবিতার অন্যতম প্রধান কণ্ঠ।",
    blurbEn:
      "Poet of Rupasi Bangla and Banalata Sen, a leading voice of modern Bengali poetry with vivid nature imagery."
  },
  {
    slug: "michael-madhusudan-dutt",
    nameBn: "মাইকেল মধুসূদন দত্ত",
    nameEn: "Michael Madhusudan Dutt",
    lifeBn: "১৮২৪–১৮৭৩",
    lifeEn: "1824–1873",
    fieldBn: "কবি ও নাট্যকার",
    fieldEn: "Poet and playwright",
    blurbBn: "'মেঘনাদবধ কাব্য'-এর মাধ্যমে বাংলায় অমিত্রাক্ষর ছন্দ প্রবর্তন করেন।",
    blurbEn: "Introduced blank verse to Bengali with the epic Meghnad Badh Kavya."
  },
  {
    slug: "begum-rokeya",
    nameBn: "বেগম রোকেয়া",
    nameEn: "Begum Rokeya",
    lifeBn: "১৮৮০–১৯৩২",
    lifeEn: "1880–1932",
    fieldBn: "লেখক ও নারী শিক্ষার অগ্রদূত",
    fieldEn: "Writer and pioneer of women's education",
    blurbBn: "'সুলতানার স্বপ্ন'-এর লেখক; নারীশিক্ষার প্রসারে স্কুল প্রতিষ্ঠা করেন।",
    blurbEn: "Author of Sultana's Dream; founded a school to advance girls' education."
  },
  {
    slug: "amartya-sen",
    nameBn: "অমর্ত্য সেন",
    nameEn: "Amartya Sen",
    lifeBn: "জন্ম ১৯৩৩",
    lifeEn: "born 1933",
    fieldBn: "অর্থনীতিবিদ",
    fieldEn: "Economist",
    blurbBn: "শান্তিনিকেতনে বেড়ে ওঠা; কল্যাণ অর্থনীতিতে অবদানের জন্য ১৯৯৮ সালে নোবেল পান।",
    blurbEn: "Grew up in Santiniketan; won the 1998 Nobel Prize in Economics for work on welfare economics."
  },
  {
    slug: "sukumar-ray",
    nameBn: "সুকুমার রায়",
    nameEn: "Sukumar Ray",
    lifeBn: "১৮৮৭–১৯২৩",
    lifeEn: "1887–1923",
    fieldBn: "ছড়াকার ও লেখক",
    fieldEn: "Nonsense-verse writer",
    blurbBn: "'আবোল তাবোল' ও 'হ য ব র ল'-এর স্রষ্টা; বাংলা উদ্ভট ছড়ার সম্রাট।",
    blurbEn: "Creator of Abol Tabol and HaJaBaRaLa, master of Bengali nonsense verse."
  },
  {
    slug: "nandalal-bose",
    nameBn: "নন্দলাল বসু",
    nameEn: "Nandalal Bose",
    lifeBn: "১৮৮২–১৯৬৬",
    lifeEn: "1882–1966",
    fieldBn: "শিল্পী",
    fieldEn: "Artist",
    blurbBn: "বেঙ্গল স্কুলের অন্যতম প্রধান শিল্পী; শান্তিনিকেতনের কলাভবনের অধ্যক্ষ ছিলেন।",
    blurbEn: "A leading artist of the Bengal School and principal of Kala Bhavana at Santiniketan."
  },
  {
    slug: "zainul-abedin",
    nameBn: "জয়নুল আবেদিন",
    nameEn: "Zainul Abedin",
    lifeBn: "১৯১৪–১৯৭৬",
    lifeEn: "1914–1976",
    fieldBn: "শিল্পী",
    fieldEn: "Artist",
    blurbBn: "১৯৪৩-এর দুর্ভিক্ষের ছবিগুলোর জন্য বিখ্যাত; আধুনিক বাংলার চিত্রকলার পথিকৃৎ।",
    blurbEn: "Famed for his sketches of the 1943 famine; a pioneer of modern Bengali painting."
  },
  {
    slug: "ram-mohan-roy",
    nameBn: "রামমোহন রায়",
    nameEn: "Ram Mohan Roy",
    lifeBn: "১৭৭২–১৮৩৩",
    lifeEn: "1772–1833",
    fieldBn: "সমাজসংস্কারক",
    fieldEn: "Social reformer",
    blurbBn: "সতীদাহ প্রথা রদের আন্দোলনে অগ্রণী; ব্রাহ্ম সমাজের প্রতিষ্ঠাতা।",
    blurbEn: "Led the campaign against sati and founded the Brahmo Samaj."
  },
  {
    slug: "hemanta-mukhopadhyay",
    nameBn: "হেমন্ত মুখোপাধ্যায়",
    nameEn: "Hemanta Mukhopadhyay",
    lifeBn: "১৯২০–১৯৮৯",
    lifeEn: "1920–1989",
    fieldBn: "গায়ক ও সুরকার",
    fieldEn: "Singer and composer",
    blurbBn: "গভীর কণ্ঠের জন্য বিখ্যাত; রবীন্দ্রসংগীত ও আধুনিক গানে অবিস্মরণীয়।",
    blurbEn: "Celebrated for his deep voice, unforgettable in Rabindra Sangeet and modern Bengali songs."
  },
  {
    slug: "salil-chowdhury",
    nameBn: "সলিল চৌধুরী",
    nameEn: "Salil Chowdhury",
    lifeBn: "১৯২৫–১৯৯৫",
    lifeEn: "1925–1995",
    fieldBn: "সুরকার ও গীতিকার",
    fieldEn: "Composer and lyricist",
    blurbBn: "গণসংগীত ও চলচ্চিত্রে অনন্য সুরের জন্য পরিচিত; বাংলা ও হিন্দি দুই ভাষাতেই কাজ করেছেন।",
    blurbEn: "Known for distinctive mass songs and film scores in both Bengali and Hindi."
  },
  {
    slug: "mahasweta-devi",
    nameBn: "মহাশ্বেতা দেবী",
    nameEn: "Mahasweta Devi",
    lifeBn: "১৯২৬–২০১৬",
    lifeEn: "1926–2016",
    fieldBn: "লেখক ও সমাজকর্মী",
    fieldEn: "Writer and activist",
    blurbBn: "'হাজার চুরাশির মা'-র লেখক; আদিবাসী ও প্রান্তিক মানুষের জীবন তাঁর লেখার কেন্দ্রে।",
    blurbEn:
      "Author of Hajar Churashir Maa; placed tribal and marginalised lives at the centre of her writing."
  },
  {
    slug: "lalon-fakir",
    nameBn: "লালন ফকির",
    nameEn: "Lalon Fakir",
    lifeBn: "উনিশ শতক",
    lifeEn: "19th century",
    fieldBn: "বাউল সাধক ও গীতিকার",
    fieldEn: "Baul saint and songwriter",
    blurbBn: "মানবতা ও জাতিভেদহীন সমাজের কথা বলা অসংখ্য গানের রচয়িতা; বাউল ঐতিহ্যের প্রধান কণ্ঠ।",
    blurbEn:
      "Composer of countless songs about humanity beyond caste and creed; a central voice of the Baul tradition."
  },
  {
    slug: "asha-purna-devi",
    nameBn: "আশাপূর্ণা দেবী",
    nameEn: "Ashapurna Devi",
    lifeBn: "১৯০৯–১৯৯৫",
    lifeEn: "1909–1995",
    fieldBn: "ঔপন্যাসিক",
    fieldEn: "Novelist",
    blurbBn: "'প্রথম প্রতিশ্রুতি'র লেখক; বাংলার নারীজীবনের কাহিনি তুলে ধরেছেন সংবেদনশীলভাবে।",
    blurbEn: "Author of Pratham Pratishruti, who portrayed the lives of Bengali women with sensitivity."
  }
];

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    slug: "language-movement",
    month: 2,
    day: 21,
    year: 1952,
    titleBn: "ভাষা আন্দোলনের শহিদ দিবস",
    titleEn: "Language Movement Day",
    detailBn:
      "ঢাকায় বাংলা ভাষার মর্যাদার দাবিতে মিছিলে প্রাণ হারান বহু তরুণ; এই দিনটি আজ আন্তর্জাতিক মাতৃভাষা দিবস।",
    detailEn:
      "Protesters demanding recognition of Bangla were killed in Dhaka; the day is now observed as International Mother Language Day."
  },
  {
    slug: "tagore-born",
    month: 5,
    day: 7,
    year: 1861,
    titleBn: "রবীন্দ্রনাথ ঠাকুরের জন্ম",
    titleEn: "Birth of Rabindranath Tagore",
    detailBn: "জোড়াসাঁকোর ঠাকুরবাড়িতে জন্ম; বাংলায় পঁচিশে বৈশাখ হিসেবে দিনটি পালিত হয়।",
    detailEn: "Born at the Tagore house in Jorasanko; celebrated in Bengali as Pochishe Boishakh."
  },
  {
    slug: "nazrul-born",
    month: 5,
    day: 24,
    year: 1899,
    titleBn: "কাজী নজরুল ইসলামের জন্ম",
    titleEn: "Birth of Kazi Nazrul Islam",
    detailBn: "বর্ধমানের চুরুলিয়ায় জন্ম নেন 'বিদ্রোহী কবি'।",
    detailEn: "The 'Rebel Poet' was born in Churulia, Burdwan."
  },
  {
    slug: "satyajit-ray-born",
    month: 5,
    day: 2,
    year: 1921,
    titleBn: "সত্যজিৎ রায়ের জন্ম",
    titleEn: "Birth of Satyajit Ray",
    detailBn: "কলকাতায় জন্ম নেন বিশ্বনন্দিত চলচ্চিত্রকার ও লেখক।",
    detailEn: "The globally admired filmmaker and writer was born in Calcutta."
  },
  {
    slug: "plassey",
    month: 6,
    day: 23,
    year: 1757,
    titleBn: "পলাশীর যুদ্ধ",
    titleEn: "Battle of Plassey",
    detailBn: "নবাব সিরাজউদ্দৌলার পরাজয়ের পর বাংলায় ইস্ট ইন্ডিয়া কোম্পানির শাসনের পথ খুলে যায়।",
    detailEn: "After Nawab Siraj ud-Daulah's defeat, the way opened for East India Company rule in Bengal."
  },
  {
    slug: "bankim-born",
    month: 6,
    day: 26,
    year: 1838,
    titleBn: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের জন্ম",
    titleEn: "Birth of Bankim Chandra Chattopadhyay",
    detailBn: "নৈহাটির কাঁঠালপাড়ায় জন্ম; বাংলা উপন্যাসের প্রথম সার্থক স্রষ্টা।",
    detailEn: "Born in Kanthalpara, Naihati; the first great architect of the Bengali novel."
  },
  {
    slug: "tagore-died",
    month: 8,
    day: 7,
    year: 1941,
    titleBn: "রবীন্দ্রনাথের প্রয়াণ",
    titleEn: "Passing of Rabindranath Tagore",
    detailBn: "বাইশে শ্রাবণ; কবির প্রয়াণদিবস বাংলা সংস্কৃতিতে স্মরণের দিন।",
    detailEn: "Observed as Baishe Srabon; a day of remembrance across Bengali culture."
  },
  {
    slug: "vidyasagar-born",
    month: 9,
    day: 26,
    year: 1820,
    titleBn: "ঈশ্বরচন্দ্র বিদ্যাসাগরের জন্ম",
    titleEn: "Birth of Ishwar Chandra Vidyasagar",
    detailBn: "মেদিনীপুরের বীরসিংহ গ্রামে জন্ম; শিক্ষা ও সমাজসংস্কারের প্রবাদপ্রতিম নাম।",
    detailEn: "Born in Birsingha village, Medinipur; a towering name in education and social reform."
  },
  {
    slug: "partition-1905",
    month: 10,
    day: 16,
    year: 1905,
    titleBn: "বঙ্গভঙ্গ কার্যকর",
    titleEn: "Partition of Bengal takes effect",
    detailBn: "এই দিনে রাখিবন্ধন উৎসবের মাধ্যমে বাংলা জুড়ে প্রতিবাদ ছড়িয়ে পড়ে।",
    detailEn: "Protest spread across Bengal, marked by the Rakhi Bandhan solidarity movement."
  },
  {
    slug: "tagore-nobel",
    month: 11,
    day: 13,
    year: 1913,
    titleBn: "রবীন্দ্রনাথের নোবেল ঘোষণা",
    titleEn: "Tagore's Nobel Prize announced",
    detailBn: "এশিয়ার প্রথম নোবেল সাহিত্য পুরস্কারের ঘোষণা আসে রবীন্দ্রনাথের জন্য।",
    detailEn: "Tagore became the first Asian Nobel laureate in Literature."
  },
  {
    slug: "jc-bose-born",
    month: 11,
    day: 30,
    year: 1858,
    titleBn: "জগদীশচন্দ্র বসুর জন্ম",
    titleEn: "Birth of Jagadish Chandra Bose",
    detailBn: "ময়মনসিংহে জন্ম; বিজ্ঞানের ইতিহাসে বাঙালির অগ্রণী নাম।",
    detailEn: "Born in Mymensingh; a pioneering Bengali name in the history of science."
  },
  {
    slug: "partition-annulled",
    month: 12,
    day: 12,
    year: 1911,
    titleBn: "বঙ্গভঙ্গ রদের ঘোষণা",
    titleEn: "Partition of Bengal annulled",
    detailBn: "তীব্র গণআন্দোলনের পর দিল্লি দরবারে বঙ্গভঙ্গ রদের ঘোষণা হয়।",
    detailEn: "After intense popular movement, the annulment was announced at the Delhi Durbar."
  },
  {
    slug: "vivekananda-born",
    month: 1,
    day: 12,
    year: 1863,
    titleBn: "স্বামী বিবেকানন্দের জন্ম",
    titleEn: "Birth of Swami Vivekananda",
    detailBn: "কলকাতায় নরেন্দ্রনাথ দত্ত রূপে জন্ম; দিনটি জাতীয় যুব দিবস হিসেবেও পালিত হয়।",
    detailEn: "Born in Calcutta as Narendranath Datta; also observed as National Youth Day."
  },
  {
    slug: "netaji-born",
    month: 1,
    day: 23,
    year: 1897,
    titleBn: "সুভাষচন্দ্র বসুর জন্ম",
    titleEn: "Birth of Subhas Chandra Bose",
    detailBn: "কটকে জন্ম; স্বাধীনতা আন্দোলনের অন্যতম প্রধান নেতা।",
    detailEn: "Born in Cuttack; a leading figure of the independence movement."
  },
  {
    slug: "historic-7-march",
    month: 3,
    day: 7,
    year: 1971,
    titleBn: "ঐতিহাসিক ৭ই মার্চের ভাষণ",
    titleEn: "The 7 March speech",
    detailBn: "ঢাকার রেসকোর্স ময়দানে শেখ মুজিবুর রহমানের ভাষণ, যা স্বাধীনতা সংগ্রামের প্রেরণা হয়ে ওঠে।",
    detailEn:
      "Sheikh Mujibur Rahman's speech at the Dhaka Racecourse became a spur to the independence struggle."
  },
  {
    slug: "independence-day-bd",
    month: 3,
    day: 26,
    year: 1971,
    titleBn: "বাংলাদেশের স্বাধীনতা ঘোষণা",
    titleEn: "Declaration of Bangladesh's independence",
    detailBn: "২৬শে মার্চ বাংলাদেশের স্বাধীনতা দিবস হিসেবে পালিত হয়।",
    detailEn: "26 March is observed as Independence Day in Bangladesh."
  },
  {
    slug: "victory-day",
    month: 12,
    day: 16,
    year: 1971,
    titleBn: "বিজয় দিবস",
    titleEn: "Victory Day",
    detailBn: "মুক্তিযুদ্ধের অবসান ও বাংলাদেশের বিজয়ের দিন।",
    detailEn: "The day the Liberation War ended in victory for Bangladesh."
  }
];
