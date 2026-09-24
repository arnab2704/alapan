export type QuizCategory =
  | "history"
  | "culture"
  | "literature"
  | "festival"
  | "language"
  | "geography"
  | "religion"
  | "arts"
  | "people";

export interface QuizOption {
  textBn: string;
  textEn: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  questionBn: string;
  questionEn: string;
  options: QuizOption[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
  /** Short "why" shown after answering. Optional - the large level bank ships without explanations. */
  explanationBn?: string;
  explanationEn?: string;
}

/**
 * A general-knowledge bank of Bengali history and culture questions -
 * well-established, uncontroversial facts only (no contested-origin food
 * claims, no politically sensitive framing), consistent with this
 * project's "treat cultural/religious content respectfully" standard.
 * `getDailyQuiz()` (quiz.ts) draws a deterministic subset from this pool
 * each day - extend this list over time to keep the daily rotation fresh.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "history-tagore-nobel",
    category: "history",
    questionBn: "১৯১৩ সালে সাহিত্যে নোবেল পুরস্কার পাওয়া প্রথম এশীয় ব্যক্তি কে ছিলেন?",
    questionEn: "Who was the first Asian to win the Nobel Prize, for Literature in 1913?",
    options: [
      { textBn: "রবীন্দ্রনাথ ঠাকুর", textEn: "Rabindranath Tagore" },
      { textBn: "কাজী নজরুল ইসলাম", textEn: "Kazi Nazrul Islam" },
      { textBn: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়", textEn: "Bankim Chandra Chattopadhyay" },
      { textBn: "শরৎচন্দ্র চট্টোপাধ্যায়", textEn: "Sharatchandra Chattopadhyay" }
    ],
    correctIndex: 0,
    explanationBn:
      'রবীন্দ্রনাথ ঠাকুর তাঁর কাব্যগ্রন্থ "গীতাঞ্জলি"-র জন্য ১৯১৩ সালে সাহিত্যে নোবেল পুরস্কার পান - এশিয়ার কারো জন্য এটিই প্রথম নোবেল পুরস্কার।',
    explanationEn:
      'Rabindranath Tagore won the 1913 Nobel Prize in Literature for "Gitanjali" - the first Nobel Prize ever awarded to an Asian.'
  },
  {
    id: "history-language-movement",
    category: "history",
    questionBn: "ভাষা আন্দোলন, যা পরবর্তীতে আন্তর্জাতিক মাতৃভাষা দিবসের সূচনা করে, কোন সালে হয়েছিল?",
    questionEn:
      "The Bhasha Andolon (Language Movement), which later led to International Mother Language Day, took place in which year?",
    options: [
      { textBn: "১৯৪৭", textEn: "1947" },
      { textBn: "১৯৫২", textEn: "1952" },
      { textBn: "১৯৭১", textEn: "1971" },
      { textBn: "১৯০৫", textEn: "1905" }
    ],
    correctIndex: 1,
    explanationBn:
      "১৯৫২ সালের ২১শে ফেব্রুয়ারি বাংলা ভাষার মর্যাদার দাবিতে আন্দোলনকারীরা প্রাণ দেন - এই দিনটিই এখন আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে পালিত হয়।",
    explanationEn:
      "On 21 February 1952, protestors gave their lives demanding recognition for the Bengali language - the day is now observed worldwide as International Mother Language Day."
  },
  {
    id: "history-netaji",
    category: "history",
    questionBn: '"নেতাজি" নামে পরিচিত ছিলেন কে?',
    questionEn: 'Who was popularly known as "Netaji"?',
    options: [
      { textBn: "সুভাষচন্দ্র বসু", textEn: "Subhas Chandra Bose" },
      { textBn: "চিত্তরঞ্জন দাশ", textEn: "Chittaranjan Das" },
      { textBn: "সূর্য সেন", textEn: "Surya Sen" },
      { textBn: "খুদিরাম বসু", textEn: "Khudiram Bose" }
    ],
    correctIndex: 0,
    explanationBn:
      'সুভাষচন্দ্র বসু "নেতাজি" নামে পরিচিত ছিলেন এবং তিনি আজাদ হিন্দ ফৌজ (INA) প্রতিষ্ঠা করেছিলেন।',
    explanationEn:
      'Subhas Chandra Bose was known as "Netaji" and founded the Azad Hind Fauj (Indian National Army).'
  },
  {
    id: "history-kolkata-capital",
    category: "history",
    questionBn: "১৯১১ সালের আগে ব্রিটিশ ভারতের রাজধানী কোন শহর ছিল?",
    questionEn: "Which city was the capital of British India before 1911?",
    options: [
      { textBn: "দিল্লি", textEn: "Delhi" },
      { textBn: "বোম্বাই", textEn: "Bombay" },
      { textBn: "কলকাতা", textEn: "Kolkata" },
      { textBn: "মাদ্রাজ", textEn: "Madras" }
    ],
    correctIndex: 2,
    explanationBn:
      "কলকাতা ১৯১১ সাল পর্যন্ত ব্রিটিশ ভারতের রাজধানী ছিল, এরপর রাজধানী দিল্লিতে স্থানান্তরিত হয়।",
    explanationEn:
      "Kolkata (Calcutta) was the capital of British India until 1911, when the capital moved to Delhi."
  },
  {
    id: "history-bengal-renaissance",
    category: "history",
    questionBn: "বাংলার নবজাগরণের (Bengal Renaissance) পথিকৃৎ হিসেবে কাকে গণ্য করা হয়?",
    questionEn: "Who is regarded as the pioneering figure of the Bengal Renaissance?",
    options: [
      { textBn: "রাজা রামমোহন রায়", textEn: "Raja Ram Mohan Roy" },
      { textBn: "স্বামী বিবেকানন্দ", textEn: "Swami Vivekananda" },
      { textBn: "দ্বারকানাথ ঠাকুর", textEn: "Dwarkanath Tagore" },
      { textBn: "মাইকেল মধুসূদন দত্ত", textEn: "Michael Madhusudan Dutt" }
    ],
    correctIndex: 0,
    explanationBn:
      "রাজা রামমোহন রায়কে প্রায়ই বাংলা তথা ভারতীয় নবজাগরণের জনক বলা হয়, সমাজ সংস্কারে তাঁর অবদানের জন্য।",
    explanationEn:
      "Raja Ram Mohan Roy is often called the father of the Bengal (and wider Indian) Renaissance, for his pioneering social reform work."
  },
  {
    id: "history-vidyasagar",
    category: "history",
    questionBn: "ঈশ্বরচন্দ্র বিদ্যাসাগর প্রধানত কোন সমাজ সংস্কারের জন্য স্মরণীয়?",
    questionEn: "Ishwar Chandra Vidyasagar is most remembered for championing which social reform?",
    options: [
      { textBn: "বিধবা বিবাহ", textEn: "Widow remarriage" },
      { textBn: "ভূমি সংস্কার", textEn: "Land reform" },
      { textBn: "রেল সম্প্রসারণ", textEn: "Railway expansion" },
      { textBn: "কর সংস্কার", textEn: "Tax reform" }
    ],
    correctIndex: 0,
    explanationBn:
      "ঈশ্বরচন্দ্র বিদ্যাসাগর বিধবা বিবাহ আইনসিদ্ধ করার আন্দোলনে নেতৃত্ব দেন এবং বাংলা বর্ণমালা ও শিক্ষা সংস্কারেও গুরুত্বপূর্ণ ভূমিকা রাখেন।",
    explanationEn:
      "Vidyasagar led the movement to legalise widow remarriage, and also reformed the Bengali alphabet and educational system."
  },
  {
    id: "culture-sundarbans-tiger",
    category: "culture",
    questionBn: "সুন্দরবনের ম্যানগ্রোভ অরণ্য কোন বিখ্যাত প্রাণীর আবাসস্থল?",
    questionEn: "The Sundarbans mangrove forest is home to which famous animal?",
    options: [
      { textBn: "রয়্যাল বেঙ্গল টাইগার", textEn: "Royal Bengal Tiger" },
      { textBn: "এশিয়াটিক সিংহ", textEn: "Asiatic Lion" },
      { textBn: "ভারতীয় গণ্ডার", textEn: "Indian Rhinoceros" },
      { textBn: "তুষার চিতা", textEn: "Snow Leopard" }
    ],
    correctIndex: 0,
    explanationBn:
      "সুন্দরবন - পৃথিবীর বৃহত্তম ম্যানগ্রোভ অরণ্য - বিখ্যাত রয়্যাল বেঙ্গল টাইগারের প্রাকৃতিক আবাসস্থল।",
    explanationEn:
      "The Sundarbans, the world's largest mangrove forest, is the natural habitat of the famous Royal Bengal Tiger."
  },
  {
    id: "culture-delta",
    category: "culture",
    questionBn: "গঙ্গা ও ব্রহ্মপুত্র নদী মিলে পৃথিবীর কেমন বদ্বীপ (ডেল্টা) গঠন করেছে?",
    questionEn: "The Ganges and Brahmaputra rivers together form what kind of delta?",
    options: [
      { textBn: "পৃথিবীর বৃহত্তম বদ্বীপ", textEn: "The world's largest delta" },
      { textBn: "পৃথিবীর ক্ষুদ্রতম বদ্বীপ", textEn: "The world's smallest delta" },
      { textBn: "একটি মরু বদ্বীপ", textEn: "A desert delta" },
      { textBn: "একটি হিমবাহী বদ্বীপ", textEn: "A glacial delta" }
    ],
    correctIndex: 0,
    explanationBn:
      "গঙ্গা-ব্রহ্মপুত্র বদ্বীপ পৃথিবীর বৃহত্তম বদ্বীপ, যা বাংলাদেশ ও পশ্চিমবঙ্গের অধিকাংশ জুড়ে বিস্তৃত।",
    explanationEn:
      "The Ganges-Brahmaputra delta is the largest delta in the world, spanning most of Bangladesh and West Bengal."
  },
  {
    id: "culture-football",
    category: "culture",
    questionBn: "কলকাতার ময়দান আর মোহনবাগান-ইস্টবেঙ্গলের মতো ক্লাবের সঙ্গে জড়িত জনপ্রিয় খেলাটি কী?",
    questionEn:
      "Which sport is closely associated with Kolkata's Maidan and clubs like Mohun Bagan and East Bengal?",
    options: [
      { textBn: "ফুটবল", textEn: "Football" },
      { textBn: "ক্রিকেট", textEn: "Cricket" },
      { textBn: "হকি", textEn: "Hockey" },
      { textBn: "কাবাডি", textEn: "Kabaddi" }
    ],
    correctIndex: 0,
    explanationBn: "ফুটবল বাংলার এক গভীর ঐতিহ্য - মোহনবাগান ১৯১১ সালে ব্রিটিশ দলকে হারিয়ে ইতিহাস গড়েছিল।",
    explanationEn:
      "Football has deep roots in Bengal - Mohun Bagan made history in 1911 by defeating a British team."
  },
  {
    id: "literature-two-anthems",
    category: "literature",
    questionBn: "রবীন্দ্রনাথ ঠাকুরের লেখা গান দুটি দেশের জাতীয় সংগীত হয়েছে - ভারত ও কোন দেশ?",
    questionEn: "Rabindranath Tagore wrote the national anthems of India and which other country?",
    options: [
      { textBn: "বাংলাদেশ", textEn: "Bangladesh" },
      { textBn: "নেপাল", textEn: "Nepal" },
      { textBn: "শ্রীলঙ্কা", textEn: "Sri Lanka" },
      { textBn: "মায়ানমার", textEn: "Myanmar" }
    ],
    correctIndex: 0,
    explanationBn:
      'রবীন্দ্রনাথ ঠাকুর ভারতের "জনগণমন" এবং বাংলাদেশের "আমার সোনার বাংলা" - দুটি জাতীয় সংগীতই রচনা করেছিলেন।',
    explanationEn:
      'Tagore wrote both India\'s "Jana Gana Mana" and Bangladesh\'s "Amar Shonar Bangla" - the national anthems of two countries.'
  },
  {
    id: "literature-bidrohi-kobi",
    category: "literature",
    questionBn: 'কাজী নজরুল ইসলামকে "বিদ্রোহী কবি" বলা হয় কেন?',
    questionEn: 'Why is Kazi Nazrul Islam known as the "Bidrohi Kobi" (Rebel Poet)?',
    options: [
      {
        textBn: "তাঁর বিদ্রোহাত্মক, স্বাধীনতাকামী কবিতার জন্য",
        textEn: "For his rebellious, freedom-spirited poetry"
      },
      { textBn: "তিনি সেনাবাহিনীতে বিদ্রোহ করেছিলেন", textEn: "He led a military mutiny" },
      { textBn: "তিনি প্রথম আধুনিক উপন্যাস লিখেছিলেন", textEn: "He wrote the first modern novel" },
      { textBn: "তিনি একটি রাজনৈতিক দল গঠন করেছিলেন", textEn: "He founded a political party" }
    ],
    correctIndex: 0,
    explanationBn:
      'নজরুলের কবিতা "বিদ্রোহী" ও তাঁর সামগ্রিক রচনায় ঔপনিবেশিক শাসন ও অন্যায়ের বিরুদ্ধে তীব্র প্রতিবাদের সুর ছিল, যা তাঁকে এই উপাধি এনে দেয়।',
    explanationEn:
      'Nazrul\'s poem "Bidrohi" and his wider body of work carried a fierce spirit of protest against colonial rule and injustice, earning him this title.'
  },
  {
    id: "literature-pather-panchali-director",
    category: "literature",
    questionBn: 'উপন্যাস "পথের পাঁচালী" অবলম্বনে বিখ্যাত চলচ্চিত্রটি কে পরিচালনা করেছিলেন?',
    questionEn: 'Who directed the celebrated film adaptation of the novel "Pather Panchali"?',
    options: [
      { textBn: "সত্যজিৎ রায়", textEn: "Satyajit Ray" },
      { textBn: "ঋত্বিক ঘটক", textEn: "Ritwik Ghatak" },
      { textBn: "মৃণাল সেন", textEn: "Mrinal Sen" },
      { textBn: "তপন সিংহ", textEn: "Tapan Sinha" }
    ],
    correctIndex: 0,
    explanationBn:
      'সত্যজিৎ রায়ের ১৯৫৫ সালের "পথের পাঁচালী" আন্তর্জাতিক ভাবে প্রশংসিত হয় এবং বাংলা চলচ্চিত্রকে বিশ্ব মানচিত্রে নিয়ে আসে।',
    explanationEn:
      'Satyajit Ray\'s 1955 film "Pather Panchali" won international acclaim and put Bengali cinema on the world map.'
  },
  {
    id: "literature-apu-trilogy",
    category: "literature",
    questionBn: '"পথের পাঁচালী" কোন বিখ্যাত ত্রয়ীর প্রথম চলচ্চিত্র?',
    questionEn: '"Pather Panchali" is the first film of which celebrated trilogy?',
    options: [
      { textBn: "অপু ত্রয়ী", textEn: "The Apu Trilogy" },
      { textBn: "কলকাতা ত্রয়ী", textEn: "The Calcutta Trilogy" },
      { textBn: "দেবী ত্রয়ী", textEn: "The Devi Trilogy" },
      { textBn: "নায়ক ত্রয়ী", textEn: "The Nayak Trilogy" }
    ],
    correctIndex: 0,
    explanationBn: '"পথের পাঁচালী", "অপরাজিত" ও "অপুর সংসার" মিলে গঠিত হয়েছে বিখ্যাত "অপু ত্রয়ী"।',
    explanationEn:
      '"Pather Panchali", "Aparajito" and "Apur Sansar" together form the celebrated "Apu Trilogy".'
  },
  {
    id: "music-rabindra-sangeet",
    category: "culture",
    questionBn: '"রবীন্দ্রসংগীত" বলতে কার লেখা ও সুর করা গান বোঝায়?',
    questionEn: '"Rabindra Sangeet" refers to songs written and composed by whom?',
    options: [
      { textBn: "রবীন্দ্রনাথ ঠাকুর", textEn: "Rabindranath Tagore" },
      { textBn: "কাজী নজরুল ইসলাম", textEn: "Kazi Nazrul Islam" },
      { textBn: "দ্বিজেন্দ্রলাল রায়", textEn: "Dwijendralal Ray" },
      { textBn: "অতুলপ্রসাদ সেন", textEn: "Atul Prasad Sen" }
    ],
    correctIndex: 0,
    explanationBn:
      'রবীন্দ্রনাথ ঠাকুর প্রায় দুই হাজারের বেশি গান রচনা ও সুর করেছিলেন, যেগুলো আজ "রবীন্দ্রসংগীত" নামে পরিচিত।',
    explanationEn:
      'Rabindranath Tagore wrote and composed over two thousand songs, now known collectively as "Rabindra Sangeet".'
  },
  {
    id: "festival-bijoya-dashami",
    category: "festival",
    questionBn: "দুর্গাপূজার শেষ দিনকে কী বলা হয়?",
    questionEn: "What is the final day of Durga Puja called?",
    options: [
      { textBn: "বিজয়া দশমী", textEn: "Bijoya Dashami" },
      { textBn: "মহালয়া", textEn: "Mahalaya" },
      { textBn: "নবমী", textEn: "Nabami" },
      { textBn: "ষষ্ঠী", textEn: "Shashthi" }
    ],
    correctIndex: 0,
    explanationBn: "বিজয়া দশমীতে দেবী দুর্গার বিসর্জন হয় এবং একে অপরকে বিজয়ার শুভেচ্ছা জানানো হয়।",
    explanationEn:
      "Bijoya Dashami is when Goddess Durga's idol is immersed, and people exchange Bijoya greetings."
  },
  {
    id: "festival-poila-boishakh",
    category: "festival",
    questionBn: "পয়লা বৈশাখ কী চিহ্নিত করে?",
    questionEn: "What does Poila Boishakh mark?",
    options: [
      { textBn: "বাংলা নববর্ষ", textEn: "The Bengali New Year" },
      { textBn: "দুর্গাপূজার সূচনা", textEn: "The start of Durga Puja" },
      { textBn: "স্বাধীনতা দিবস", textEn: "Independence Day" },
      { textBn: "শীতকালের শুরু", textEn: "The start of winter" }
    ],
    correctIndex: 0,
    explanationBn:
      "পয়লা বৈশাখ বাংলা সনের প্রথম দিন, নতুন জামা, হালখাতা আর মঙ্গল শোভাযাত্রার মধ্য দিয়ে উদযাপিত হয়।",
    explanationEn:
      "Poila Boishakh is the first day of the Bengali calendar year, celebrated with new clothes, Halkhata ledgers and the Mangal Shobhajatra procession."
  },
  {
    id: "festival-kojagari",
    category: "festival",
    questionBn: "কোজাগরী লক্ষ্মীপূজা চান্দ্র মাসের কোন তিথিতে পালিত হয়?",
    questionEn: "Kojagari Lakshmi Puja is observed on which lunar day?",
    options: [
      { textBn: "পূর্ণিমা (পূর্ণচন্দ্র)", textEn: "Purnima (full moon)" },
      { textBn: "অমাবস্যা (নতুন চাঁদ)", textEn: "Amavasya (new moon)" },
      { textBn: "একাদশী", textEn: "Ekadashi" },
      { textBn: "চতুর্থী", textEn: "Chaturthi" }
    ],
    correctIndex: 0,
    explanationBn: "কোজাগরী লক্ষ্মীপূজা হয় আশ্বিন মাসের পূর্ণিমায় - দুর্গাপূজার বিজয়া দশমীর কিছুদিন পরে।",
    explanationEn:
      "Kojagari Lakshmi Puja falls on the Purnima (full moon) of Ashwin, a few days after Durga Puja's Bijoya Dashami."
  },
  {
    id: "language-script",
    category: "language",
    questionBn: "বাংলা ভাষা কোন লিপিতে লেখা হয়?",
    questionEn: "Bengali is written in which script?",
    options: [
      { textBn: "বাংলা লিপি", textEn: "The Bengali script" },
      { textBn: "দেবনাগরী লিপি", textEn: "The Devanagari script" },
      { textBn: "তামিল লিপি", textEn: "The Tamil script" },
      { textBn: "আরবি লিপি", textEn: "The Arabic script" }
    ],
    correctIndex: 0,
    explanationBn:
      "বাংলা তার নিজস্ব লিপিতে লেখা হয়, যা ব্রাহ্মী লিপি থেকে উদ্ভূত এবং অসমিয়া ভাষার সঙ্গে ঘনিষ্ঠভাবে সম্পর্কিত।",
    explanationEn:
      "Bengali is written in its own script, descended from the Brahmi script and closely related to the script used for Assamese."
  },
  {
    id: "language-dhonnobad",
    category: "language",
    questionBn: '"ধন্যবাদ" শব্দের ইংরেজি অর্থ কী?',
    questionEn: 'What does the Bengali word "ধন্যবাদ" (dhonnobad) mean in English?',
    options: [
      { textBn: "Thank you", textEn: "Thank you" },
      { textBn: "Good morning", textEn: "Good morning" },
      { textBn: "Welcome", textEn: "Welcome" },
      { textBn: "Goodbye", textEn: "Goodbye" }
    ],
    correctIndex: 0,
    explanationBn: '"ধন্যবাদ" মানে "Thank you" - বাংলায় কৃতজ্ঞতা প্রকাশের সবচেয়ে সাধারণ শব্দ।',
    explanationEn: '"Dhonnobad" means "Thank you" - the most common way to express gratitude in Bengali.'
  },
  {
    id: "geography-dhaka",
    category: "geography",
    questionBn: "বাংলাদেশের রাজধানী কোন শহর?",
    questionEn: "What is the capital of Bangladesh?",
    options: [
      { textBn: "ঢাকা", textEn: "Dhaka" },
      { textBn: "চট্টগ্রাম", textEn: "Chittagong" },
      { textBn: "খুলনা", textEn: "Khulna" },
      { textBn: "সিলেট", textEn: "Sylhet" }
    ],
    correctIndex: 0,
    explanationBn: "ঢাকা বাংলাদেশের রাজধানী ও বৃহত্তম শহর, বুড়িগঙ্গা নদীর তীরে অবস্থিত।",
    explanationEn:
      "Dhaka is the capital and largest city of Bangladesh, situated on the banks of the Buriganga River."
  },
  {
    id: "geography-kolkata",
    category: "geography",
    questionBn: "পশ্চিমবঙ্গের রাজধানী কোন শহর?",
    questionEn: "What is the capital of West Bengal?",
    options: [
      { textBn: "কলকাতা", textEn: "Kolkata" },
      { textBn: "হাওড়া", textEn: "Howrah" },
      { textBn: "দুর্গাপুর", textEn: "Durgapur" },
      { textBn: "শিলিগুড়ি", textEn: "Siliguri" }
    ],
    correctIndex: 0,
    explanationBn:
      "কলকাতা পশ্চিমবঙ্গের রাজধানী এবং বাংলার সাংস্কৃতিক ও ঐতিহাসিক কেন্দ্রস্থল হিসেবে সুপরিচিত।",
    explanationEn:
      "Kolkata is the capital of West Bengal, long recognised as Bengal's cultural and historical heart."
  }
];
