export type DiscoveryCategory =
  | "person"
  | "place"
  | "history"
  | "literature"
  | "food"
  | "song"
  | "cinema"
  | "theatre"
  | "art"
  | "science"
  | "tradition"
  | "education";

export interface Discovery {
  slug: string;
  category: DiscoveryCategory;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  /** Words from the word bank that belong to this subject. */
  relatedWords: string[];
  /** Slugs of other discoveries. */
  relatedSlugs: string[];
  source: string;
  /** Optional illustration path under /public. Text-first for now. */
  image?: string;
}

type Row = [
  slug: string,
  category: DiscoveryCategory,
  titleBn: string,
  titleEn: string,
  summaryBn: string,
  summaryEn: string,
  relatedWords: string[],
  relatedSlugs: string[],
  source: string
];

const ROWS: Row[] = [
  // ---- Places ----
  [
    "murshidabad",
    "place",
    "মুর্শিদাবাদ",
    "Murshidabad",
    "অষ্টাদশ শতকের শুরুতে বাংলার নবাবদের রাজধানী হয়ে ওঠা এই শহর ভাগীরথীর তীরে। হাজারদুয়ারি প্রাসাদ আর নবাবি স্মৃতিতে ভরা।",
    "The city on the Bhagirathi became the Nawabs' capital of Bengal in the early 18th century, and is full of palaces and Nawabi memories, including Hazarduari.",
    ["নদী", "মূর্তি", "গৌরব"],
    ["plassey", "gaur-pandua"],
    "ASI site notes; standard histories of Bengal"
  ],
  [
    "santiniketan",
    "place",
    "শান্তিনিকেতন",
    "Santiniketan",
    "রবীন্দ্রনাথের প্রতিষ্ঠিত বিদ্যালয় ও বিশ্বভারতীর শহর, বীরভূমে। ২০২৩ সালে ইউনেস্কো একে বিশ্ব ঐতিহ্যের স্বীকৃতি দিয়েছে; এখানে পৌষমেলা ও বসন্ত উৎসব বিখ্যাত।",
    "The town in Birbhum around Tagore's school and Visva-Bharati. UNESCO added it to the World Heritage List in 2023; the Poush Mela and Basanta Utsav are famous here.",
    ["শিক্ষা", "প্রকৃতি", "গান", "ফাল্গুন"],
    ["rabindranath-tagore", "rabindra-sangeet", "nandalal-bose"],
    "UNESCO World Heritage List, 2023; Visva-Bharati"
  ],
  [
    "darjeeling",
    "place",
    "দার্জিলিং",
    "Darjeeling",
    "হিমালয়ের কোলে চায়ের বাগান আর মেঘে ঢাকা পাহাড়ের শহর। দার্জিলিং হিমালয়ান রেলওয়ে (টয় ট্রেন) ১৯৯৯ সালে ইউনেস্কোর বিশ্ব ঐতিহ্যের তালিকায় ঢোকে।",
    "A town of tea gardens and cloud-covered hills in the Himalayan foothills. The Darjeeling Himalayan Railway (the Toy Train) joined the UNESCO World Heritage List in 1999.",
    ["পাহাড়", "চা", "মেঘ"],
    ["sundarbans"],
    "UNESCO World Heritage List, 1999"
  ],
  [
    "sundarbans",
    "place",
    "সুন্দরবন",
    "The Sundarbans",
    "গঙ্গা-ব্রহ্মপুত্রের মোহনার বিশাল ম্যানগ্রোভ অরণ্য, রয়্যাল বেঙ্গল টাইগারের বাসভূমি। ভারতের অংশ সুন্দরবন জাতীয় উদ্যান ১৯৮৭ সালে বিশ্ব ঐতিহ্যের স্বীকৃতি পায়।",
    "A vast mangrove forest at the delta of the Ganga and Brahmaputra, home of the Royal Bengal tiger. The Indian part, Sundarbans National Park, was inscribed as World Heritage in 1987.",
    ["বাঘ", "নদী", "জল", "প্রকৃতি"],
    ["darjeeling"],
    "UNESCO World Heritage List, 1987"
  ],
  [
    "nabadwip",
    "place",
    "নবদ্বীপ",
    "Nabadwip",
    "শ্রীচৈতন্যের জন্মস্থান, ১৪৮৬ সালে; ন্যায়শাস্ত্র ও সংস্কৃত শিক্ষার কেন্দ্র হিসেবেও খ্যাত। এখানেই তন্ত্রসাধক কৃষ্ণানন্দ আগমবাগীশের কর্মভূমি বলে মানা হয়।",
    "Birthplace of Sri Chaitanya in 1486 and a renowned centre of Sanskrit and logic scholarship, traditionally linked with the tantric scholar Krishnananda Agamavagisha.",
    ["প্রণাম", "ধর্ম", "বিদ্যা"],
    ["krishnananda-agamavagisha"],
    "Standard histories of medieval Bengal"
  ],
  [
    "college-street",
    "place",
    "কলেজ স্ট্রিট",
    "College Street",
    "কলকাতার বইপাড়া - কলকাতা বিশ্ববিদ্যালয়, প্রেসিডেন্সি আর সারি সারি পুরোনো বইয়ের দোকানের এলাকা। ইন্ডিয়ান কফি হাউস এখানে আড্ডার জন্য বিখ্যাত।",
    "Kolkata's book quarter, around the University of Calcutta and Presidency, lined with second-hand bookstalls. The Indian Coffee House here is famous for adda.",
    ["বই", "আড্ডা", "চা", "শিক্ষা"],
    ["vidyasagar"],
    "Public records of the University of Calcutta"
  ],
  [
    "kumartuli",
    "place",
    "কুমোরটুলি",
    "Kumartuli",
    "উত্তর কলকাতার কুমোর-পাড়া, যেখানে প্রতিবছর দুর্গা ও অন্যান্য প্রতিমা গড়া হয়। মহালয়ার দিনে প্রতিমার চোখ আঁকা - 'চক্ষুদান' - এখানকার বিখ্যাত রীতি।",
    "North Kolkata's potters' quarter, where Durga and other idols are made every year. Painting the idol's eyes on Mahalaya - 'chakshudan' - is a celebrated ritual here.",
    ["মূর্তি", "শিল্প", "চোখ", "দুর্গা"],
    ["mahalaya"],
    "Kolkata Durga Puja heritage documentation (UNESCO, 2021)"
  ],
  [
    "dakshineswar",
    "place",
    "দক্ষিণেশ্বর",
    "Dakshineswar",
    "গঙ্গার তীরে কালীমন্দির, ১৮৫৫ সালে রানি রাসমণি প্রতিষ্ঠা করেন। শ্রীরামকৃষ্ণ এখানকার পুরোহিত ছিলেন।",
    "The Kali temple on the Ganga, founded by Rani Rashmoni in 1855, where Sri Ramakrishna served as priest.",
    ["প্রসাদ", "আশীর্বাদ", "নদী"],
    ["kali-puja"],
    "Temple records; biographies of Ramakrishna"
  ],
  [
    "gaur-pandua",
    "place",
    "গৌড় ও পাণ্ডুয়া",
    "Gaur and Pandua",
    "মালদার এই দুই স্থানের ধ্বংসাবশেষে মধ্যযুগে বাংলার সালতানাতের রাজধানীর স্মৃতি। পাণ্ডুয়ার আদিনা মসজিদ চতুর্দশ শতকের।",
    "The ruins at these two places in Malda recall the capitals of the medieval Bengal Sultanate. Pandua's Adina Mosque dates from the 14th century.",
    ["গৌরব", "সংস্কৃতি"],
    ["murshidabad"],
    "ASI monuments in Malda"
  ],
  // ---- Food ----
  [
    "rasgulla",
    "food",
    "রসগোল্লা",
    "Rasgulla",
    "ছানার গোল মিষ্টি চিনির রসে ডোবানো। উৎপত্তি নিয়ে বাংলা ও ওড়িশার মধ্যে বিতর্ক আছে; 'বাংলার রসোগোল্লা' ২০১৭ সালে জিআই স্বীকৃতি পায়।",
    "Round cheese sweets soaked in syrup. Its origin is debated between Bengal and Odisha; 'Banglar Rasogolla' received a GI tag in 2017.",
    ["মিষ্টি", "স্বাদ", "দুধ"],
    ["mishti-doi"],
    "Geographical Indications Registry, 2017"
  ],
  [
    "ilish",
    "food",
    "ইলিশ",
    "Ilish (hilsa)",
    "বর্ষার রুপোলি মাছ, বাঙালির প্রিয়তম পদগুলির একটি - সর্ষে-ইলিশ, ইলিশ ভাপা, ইলিশ পাতুরি।",
    "The silvery monsoon fish and one of the most beloved Bengali dishes - shorshe ilish, ilish bhapa, ilish paturi.",
    ["মাছ", "বর্ষা", "ভাত", "নদী"],
    ["khichuri-bhog"],
    "Bengali culinary tradition"
  ],
  [
    "mishti-doi",
    "food",
    "মিষ্টি দই",
    "Mishti doi",
    "মাটির ভাঁড়ে জমানো মিষ্টি ও গাঢ় দই - পুজো, বিয়ে আর ভোজের শেষ পাতের প্রিয় পদ।",
    "Sweet, thick yogurt set in an earthen pot - a favourite last course at festivals, weddings and feasts.",
    ["মিষ্টি", "দুধ", "স্বাদ"],
    ["rasgulla"],
    "Bengali culinary tradition"
  ],
  [
    "khichuri-bhog",
    "food",
    "খিচুড়ির ভোগ",
    "Khichuri bhog",
    "পুজোর অষ্টমী-নবমীতে খিচুড়ি, লাবড়া আর পায়েসের ভোগ - সবাই একসঙ্গে বসে খাওয়ার আনন্দ।",
    "On Ashtami and Nabami the Puja bhog of khichuri, labra and payesh is shared by everyone sitting together.",
    ["ভাত", "ডাল", "প্রসাদ"],
    ["ilish", "durga-puja-unesco"],
    "Bengali festival tradition"
  ],
  [
    "pithe-puli",
    "food",
    "পিঠে-পুলি",
    "Pithe and puli",
    "পৌষ সংক্রান্তিতে নতুন ধানের চালের গুঁড়ো, নারকেল আর নলেন গুড় দিয়ে তৈরি পিঠে - পাটিসাপটা, পুলি, ভাপা।",
    "On Poush Sankranti, rice-flour cakes with coconut and date-palm jaggery - patishapta, puli, bhapa pithe.",
    ["ধান", "মিষ্টি", "পার্বণ"],
    ["rasgulla"],
    "Bengali Sankranti tradition"
  ],
  [
    "luchi-alur-dom",
    "food",
    "লুচি-আলুর দম",
    "Luchi and alur dom",
    "ময়দার ফোলা লুচি আর মশলাদার আলুর তরকারি - রবিবার সকাল আর উৎসবের প্রিয় জলখাবার।",
    "Puffed flour luchi with a spiced potato curry - a favourite Sunday and festival breakfast.",
    ["রুটি", "সকাল", "স্বাদ"],
    ["khichuri-bhog"],
    "Bengali culinary tradition"
  ],
  // ---- Literature ----
  [
    "charyapada",
    "literature",
    "চর্যাপদ",
    "Charyapada",
    "বৌদ্ধ সহজিয়া সাধকদের গানের সংকলন, প্রাচীনতম বাংলা সাহিত্যের নিদর্শন; ১৯০৭ সালে হরপ্রসাদ শাস্ত্রী নেপালে পুঁথিটি খুঁজে পান।",
    "A collection of songs by Buddhist Sahajiya mystics, the oldest known Bengali literature; Haraprasad Shastri found the manuscript in Nepal in 1907.",
    ["গান", "ধর্ম", "গল্প"],
    ["gitanjali"],
    "Haraprasad Shastri, 1907 discovery"
  ],
  [
    "gitanjali",
    "literature",
    "গীতাঞ্জলি",
    "Gitanjali",
    "রবীন্দ্রনাথের গান ও কবিতার সংকলন (বাংলা ১৯১০)। ইংরেজি 'Gitanjali' (১৯১২) তাঁকে ১৯১৩ সালে সাহিত্যে নোবেল পুরস্কার এনে দেয়।",
    "Tagore's collection of songs and poems (Bengali, 1910). The English 'Gitanjali' (1912) won him the 1913 Nobel Prize in Literature.",
    ["গান", "আত্মা", "প্রকৃতি"],
    ["rabindranath-tagore", "rabindra-sangeet"],
    "Nobel Prize records, 1913"
  ],
  [
    "pather-panchali",
    "literature",
    "পথের পাঁচালী",
    "Pather Panchali",
    "বিভূতিভূষণ বন্দ্যোপাধ্যায়ের উপন্যাস (১৯২৯), অপু-দুর্গার গ্রামবাংলা। সত্যজিৎ রায়ের ১৯৫৫ সালের ছবিটি বিশ্বসিনেমার মাইলফলক।",
    "Bibhutibhushan Bandyopadhyay's 1929 novel of Apu and Durga in rural Bengal. Satyajit Ray's 1955 film is a milestone of world cinema.",
    ["পথ", "গ্রাম", "নদী"],
    ["satyajit-ray", "bibhutibhushan-bandyopadhyay"],
    "Published editions; Satyajit Ray filmography"
  ],
  [
    "abol-tabol",
    "literature",
    "আবোল তাবোল",
    "Abol Tabol",
    "সুকুমার রায়ের উদ্ভট ছড়ার সংকলন, তাঁর মৃত্যুর পরে ১৯২৩ সালে প্রকাশিত - বাংলা নন্সেন্স-ভার্সের সেরা বই।",
    "Sukumar Ray's collection of nonsense verse, published in 1923 after his death - the finest of Bengali nonsense rhymes.",
    ["গল্প", "কল্পনা", "হাসি"],
    ["sukumar-ray"],
    "Published editions"
  ],
  [
    "meghnad-badh-kavya",
    "literature",
    "মেঘনাদবধ কাব্য",
    "Meghnad Badh Kavya",
    "মাইকেল মধুসূদন দত্তের মহাকাব্য (১৮৬১) - বাংলায় প্রথম সার্থক অমিত্রাক্ষর ছন্দের রচনা।",
    "Michael Madhusudan Dutt's epic (1861) - the first successful work in Bengali blank verse.",
    ["চিত্র", "গৌরব"],
    ["michael-madhusudan-dutt"],
    "Published editions"
  ],
  [
    "devdas",
    "literature",
    "দেবদাস",
    "Devdas",
    "শরৎচন্দ্র চট্টোপাধ্যায়ের বিখ্যাত উপন্যাস (১৯১৭), যার কাহিনি বহুবার সিনেমায় এসেছে।",
    "Sarat Chandra Chattopadhyay's celebrated novel (1917), whose story has been filmed many times.",
    ["প্রিয়", "কষ্ট", "গল্প"],
    ["sarat-chandra-chattopadhyay"],
    "Published editions"
  ],
  // ---- Songs ----
  [
    "rabindra-sangeet",
    "song",
    "রবীন্দ্রসংগীত",
    "Rabindra Sangeet",
    "রবীন্দ্রনাথের রচিত দুই হাজারেরও বেশি গান - পূজা, প্রেম, প্রকৃতি, স্বদেশ - বাঙালির জীবনের প্রায় সব মুহূর্তের জন্য একটি করে গান।",
    "More than two thousand songs by Tagore - devotion, love, nature, homeland - a song for almost every moment of Bengali life.",
    ["গান", "সুর", "প্রকৃতি"],
    ["rabindranath-tagore", "gitanjali", "santiniketan"],
    "Visva-Bharati publications"
  ],
  [
    "nazrul-geeti",
    "song",
    "নজরুলগীতি",
    "Nazrul Geeti",
    "কাজী নজরুল ইসলামের কয়েক হাজার গান - শ্যামাসংগীত থেকে গজল, বিদ্রোহের গান থেকে প্রেমের গান।",
    "Several thousand songs by Kazi Nazrul Islam - from devotional Shyama Sangeet to ghazals, from songs of rebellion to love songs.",
    ["গান", "সুর"],
    ["kazi-nazrul-islam"],
    "Nazrul Institute records"
  ],
  [
    "bhatiali-bhawaiya",
    "song",
    "ভাটিয়ালি ও ভাওয়াইয়া",
    "Bhatiali and Bhawaiya",
    "নদীর মাঝির ভাটিয়ালি আর উত্তরবঙ্গের ভাওয়াইয়া - বাংলার দুটি প্রিয় লোকগান, নদী আর মাটির সুরে গাঁথা।",
    "The boatmen's bhatiali and North Bengal's bhawaiya - two beloved Bengali folk traditions woven from river and earth.",
    ["নদী", "সুর", "গান", "নৌকা"],
    ["baul-fakiri"],
    "Folk music scholarship"
  ],
  [
    "baul-fakiri",
    "song",
    "বাউল-ফকিরি গান",
    "Baul-Fakiri songs",
    "একতারা হাতে ঘুরে বেড়ানো সাধকদের গান - মানুষ আর মনের কথা। বীরভূমের জয়দেব-কেন্দুলিতে মকর সংক্রান্তিতে বাউলদের বড় মেলা বসে।",
    "Songs of wandering mystics with their ektara - about humanity and the inner self. At Joydeb-Kenduli in Birbhum a large Baul gathering meets on Makar Sankranti.",
    ["বাউল", "গান", "আত্মা"],
    ["lalon-fakir", "bhatiali-bhawaiya"],
    "Folk music scholarship"
  ],
  // ---- History / festival ----
  [
    "durga-puja-unesco",
    "history",
    "কলকাতার দুর্গাপূজা - ইউনেস্কো স্বীকৃতি",
    "Kolkata's Durga Puja - UNESCO recognition",
    "২০২১ সালের ডিসেম্বরে ইউনেস্কো 'কলকাতার দুর্গাপূজা'-কে মানবজাতির অস্পর্শনীয় সাংস্কৃতিক ঐতিহ্যের তালিকায় স্থান দেয়।",
    "In December 2021 UNESCO inscribed 'Durga Puja in Kolkata' on the Representative List of the Intangible Cultural Heritage of Humanity.",
    ["দুর্গা", "শিল্প", "সংস্কৃতি"],
    ["kumartuli", "mahalaya"],
    "UNESCO ICH, 2021"
  ],
  [
    "mahalaya",
    "history",
    "মহালয়া",
    "Mahalaya",
    "দেবীপক্ষের সূচনা; ভোরে বীরেন্দ্রকৃষ্ণ ভদ্রের 'মহিষাসুরমর্দিনী' শোনা বাঙালির প্রিয় রীতি, আর সেদিনই কুমোরটুলিতে প্রতিমার চোখ আঁকা হয়।",
    "The start of Devi Paksha; listening to Birendra Krishna Bhadra's 'Mahishasuramardini' at dawn is a beloved ritual, and idols' eyes are painted in Kumartuli that day.",
    ["ভোর", "চোখ", "দুর্গা"],
    ["kumartuli", "durga-puja-unesco"],
    "All India Radio broadcast tradition (from 1931)"
  ],
  [
    "kali-puja",
    "history",
    "কালীপূজা",
    "Kali Puja",
    "দীপাবলির অমাবস্যায় বাংলায় শ্যামাপুজো; জবা ফুল, প্রদীপ আর মাঝরাতের আরাধনা। কৃষ্ণানন্দ আগমবাগীশের ধারায় দক্ষিণাকালী রূপ জনপ্রিয় হয় বলে মানা হয়।",
    "On the new-moon night of Diwali Bengal worships Shyama: hibiscus, lamps and midnight rites. The Dakshina Kali form is traditionally said to have been popularised through Krishnananda Agamavagisha's tradition.",
    ["প্রসাদ", "রাত", "আশীর্বাদ"],
    ["dakshineswar", "krishnananda-agamavagisha"],
    "Brihat Tantrasara; Bengali tradition"
  ],
  [
    "plassey",
    "history",
    "পলাশীর যুদ্ধ",
    "The Battle of Plassey",
    "১৭৫৭ সালের ২৩ জুন নবাব সিরাজউদ্দৌলার পরাজয়ের পর বাংলায় ইস্ট ইন্ডিয়া কোম্পানির শাসনের পথ খোলে।",
    "After Nawab Siraj ud-Daulah's defeat on 23 June 1757, the way opened for East India Company rule in Bengal.",
    ["গৌরব"],
    ["murshidabad"],
    "Standard histories of Bengal"
  ],
  [
    "krishnananda-agamavagisha",
    "history",
    "কৃষ্ণানন্দ আগমবাগীশ",
    "Krishnananda Agamavagisha",
    "ষোড়শ-সপ্তদশ শতকের নবদ্বীপের তন্ত্রসাধক; তাঁর 'বৃহৎ তন্ত্রসার' কালীর ধ্যান ও পুজোবিধির সংকলন।",
    "A 16th-17th century tantric scholar of Nabadwip whose 'Brihat Tantrasara' compiles meditations and rites of Kali.",
    ["ধর্ম", "ধ্যান", "বিদ্যা"],
    ["nabadwip", "kali-puja"],
    "Brihat Tantrasara"
  ],
  [
    "vidyasagar",
    "history",
    "বিদ্যাসাগর ও বিধবা বিবাহ আইন",
    "Vidyasagar and the Widow Remarriage Act",
    "ঈশ্বরচন্দ্র বিদ্যাসাগরের দীর্ঘ আন্দোলনের ফলে ১৮৫৬ সালে বিধবা বিবাহ আইন পাস হয়; তিনি বাংলা গদ্য ও শিক্ষারও সংস্কার করেন।",
    "Ishwar Chandra Vidyasagar's long campaign led to the Hindu Widows' Remarriage Act of 1856; he also reformed Bengali prose and education.",
    ["বিদ্যা", "শিক্ষা", "দয়া"],
    ["ishwar-chandra-vidyasagar", "college-street"],
    "Act XV of 1856"
  ],
  [
    "pather-panchali-film",
    "cinema",
    "পথের পাঁচালী",
    "Pather Panchali",
    "সত্যজিৎ রায়ের প্রথম ছবি (১৯৫৫), বিভূতিভূষণ বন্দ্যোপাধ্যায়ের উপন্যাস অবলম্বনে। অপু-ত্রয়ীর প্রথম ছবিটি বিশ্ব সিনেমায় বাংলার নাম ছড়িয়ে দেয়।",
    "Satyajit Ray's first film (1955), based on Bibhutibhushan Bandyopadhyay's novel. The first of the Apu Trilogy, it carried Bengal's name across world cinema.",
    [],
    ["pather-panchali", "satyajit-ray"],
    "Alapon editorial"
  ],
  [
    "meghe-dhaka-tara",
    "cinema",
    "মেঘে ঢাকা তারা",
    "The Cloud-Capped Star",
    "ঋত্বিক ঘটকের ১৯৬০ সালের ছবি। দেশভাগের পর উদ্বাস্তু পরিবারের এক তরুণীর কষ্ট আর স্বপ্নের গল্প, বাংলা সিনেমার এক অবিস্মরণীয় কাজ।",
    "Ritwik Ghatak's 1960 film about a young woman in a refugee family after Partition, her hardship and her dreams, a landmark of Bengali cinema.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "jatra",
    "theatre",
    "যাত্রা",
    "Jatra",
    "বাংলার লোকনাট্য। খোলা আসরে গান, সংলাপ আর উচ্চকিত অভিনয় মিলিয়ে পৌরাণিক, ঐতিহাসিক ও সামাজিক পালা দেখানো হয়, গ্রাম-শহর সব জায়গার আপন শিল্প।",
    "Bengal's folk theatre. Songs, dialogue and bold acting fill an open-air stage in mythological, historical and social plays, loved in villages and towns alike.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "nabanna-play",
    "theatre",
    "নবান্ন (নাটক)",
    "Nabanna (play)",
    "বিজন ভট্টাচার্যের নাটক, ১৯৪৪ সালে গণনাট্য সংঘ মঞ্চস্থ করে। ১৯৪৩-এর মন্বন্তরের পটভূমিতে লেখা, বাংলা নাটকের এক মোড়-ঘোরানো কাজ।",
    "Bijon Bhattacharya's play, staged by the IPTA in 1944. Set against the 1943 Bengal famine, it was a turning point for Bengali theatre.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "kalighat-pat",
    "art",
    "কালীঘাটের পট",
    "Kalighat pat",
    "উনিশ শতকে কলকাতার কালীঘাট মন্দিরের কাছে গড়ে ওঠা চিত্রশৈলী। জোরালো রেখা আর উজ্জ্বল রঙে দেবদেবী থেকে সমকালীন জীবন পর্যন্ত আঁকা হত।",
    "A painting style that grew near the Kalighat temple in 19th-century Calcutta, with bold lines and bright colour, showing gods and goddesses as well as everyday contemporary life.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "nakshi-kantha",
    "art",
    "নকশি কাঁথা",
    "Nakshi kantha",
    "পুরনো কাপড় স্তরে স্তরে জুড়ে সুঁচ-সুতোর ফোঁড়ে ফুল, পাখি আর গল্প তোলা বাংলার ঘরোয়া শিল্প। প্রধানত গ্রামের মেয়েদের হাতে বংশপরম্পরায় চলে এসেছে।",
    "A household art of Bengal: old cloth layered and stitched with flowers, birds and stories in needle and thread, carried down mostly by village women through generations.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "satyendra-nath-bose",
    "science",
    "সত্যেন্দ্রনাথ বসু",
    "Satyendra Nath Bose",
    "অধ্যাপনার সময় (১৯২৪) আলোর কণা নিয়ে তাঁর গণনা পদার্থবিদ্যায় বোস পরিসংখ্যান হিসেবে পরিচিত হয়। কণাদের একটি শ্রেণির নাম বোসন তাঁর নামে।",
    "While teaching (1924), his work on light quanta became known as Bose statistics. A whole class of particles, the bosons, is named after him.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "jagadish-chandra-bose-radio",
    "science",
    "জগদীশচন্দ্র বসু ও বেতার তরঙ্গ",
    "J. C. Bose and radio waves",
    "উনিশ শতকের শেষে কলকাতায় জগদীশচন্দ্র বসু অতি-ক্ষুদ্র বেতার তরঙ্গ নিয়ে পরীক্ষা করেন। পরে গাছের সাড়া মাপার যন্ত্র বানিয়েও তিনি বিশ্বজোড়া পরিচিতি পান।",
    "In late 19th-century Calcutta, Jagadish Chandra Bose experimented with very short radio waves. He later became known worldwide for instruments that measured how plants respond.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "halkhata",
    "tradition",
    "হালখাতা",
    "Halkhata",
    "পয়লা বৈশাখে ব্যবসায়ীরা নতুন খাতা খোলেন, গণেশপুজো করেন আর ক্রেতাদের মিষ্টিমুখ করান। পুরনো হিসেব মিটিয়ে নতুন বছর শুরুর বাঙালি রীতি।",
    "On Poila Boishakh traders open a new ledger, worship Ganesha and offer customers sweets. It is the Bengali custom of settling old accounts and starting the new year fresh.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "alpona",
    "tradition",
    "আলপনা",
    "Alpona",
    "পুজো-পার্বণ আর শুভ কাজে চালের গুঁড়োর গোলা দিয়ে মেঝেতে আঁকা নকশা। পদ্ম, লতা আর শঙ্খের মোটিফ ঘরের দোরগোড়ায় আনন্দের ডাক দেয়।",
    "Designs painted on floors with rice-flour paste for festivals and auspicious occasions. Motifs of lotus, vine and conch welcome joy to the doorstep.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "nabanna-festival",
    "tradition",
    "নবান্ন",
    "Nabanna (harvest)",
    "অগ্রহায়ণে নতুন ধানের প্রথম অন্ন নিবেদনের উৎসব। নতুন চালে পিঠে-পায়েস তৈরি হয়, গ্রামবাংলার ফসল-উৎসবের আনন্দে।",
    "The Agrahayan festival of offering the first meal of new rice. Pithe and payesh are made from the new grain in the joy of Bengal's harvest season.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "bethune-school",
    "education",
    "বেথুন স্কুল",
    "Bethune School",
    "১৮৪৯ সালে কলকাতায় জন ড্রিঙ্কওয়াটার বেথুন মেয়েদের জন্য স্কুল স্থাপন করেন, ঈশ্বরচন্দ্র বিদ্যাসাগরের সহযোগিতায়। বাংলায় নারীশিক্ষার এক মাইলফলক।",
    "In 1849 John Drinkwater Bethune founded a school for girls in Calcutta, with the support of Ishwar Chandra Vidyasagar. A milestone for women's education in Bengal.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "calcutta-university",
    "education",
    "কলকাতা বিশ্ববিদ্যালয়",
    "University of Calcutta",
    "১৮৫৭ সালে প্রতিষ্ঠিত, ভারতের প্রথম আধুনিক বিশ্ববিদ্যালয়গুলির একটি। বহু লেখক, বিজ্ঞানী ও চিন্তাবিদ এখানে পড়েছেন বা পড়িয়েছেন।",
    "Founded in 1857, one of the first modern universities in India. Many writers, scientists and thinkers studied or taught here.",
    [],
    [],
    "Alapon editorial"
  ],
  [
    "puja-dhak",
    "tradition",
    "ঢাক ও ঢাকি",
    "The dhak and the dhaki",
    "পুজোর প্রধান বাদ্য ঢাক। ঢাকিরা কাঁধে ঝুলিয়ে কাঠি দিয়ে বোল তোলেন; আরতি, ধুনুচি নাচ আর বিসর্জনে ঢাকের তালই উৎসবের মেজাজ ঠিক করে।",
    "The dhak is the signature drum of Puja. Dhakis play it slung on the shoulder with sticks, and its rhythm sets the mood of aarti, the dhunuchi dance and immersion.",
    ["ঢাকি", "আরতি", "ধুনুচি"],
    ["durga-puja-unesco"],
    "Alapon editorial"
  ],
  [
    "dhunuchi-naach",
    "tradition",
    "ধুনুচি নাচ",
    "Dhunuchi dance",
    "আরতির সময় ঢাকের তালে ধুনুচিতে ধুনো জ্বালিয়ে নাচার রীতি। কেউ দুই হাতে, কেউ মুখে ধুনুচি নিয়েও নাচেন।",
    "A custom of dancing with dhunuchis of burning incense to the dhak during aarti. Some dance with one in each hand, some even hold one in the mouth.",
    ["ধুনুচি", "আরতি", "ঢাকি"],
    ["puja-dhak"],
    "Alapon editorial"
  ],
  [
    "sindoor-khela",
    "tradition",
    "সিঁদুর খেলা",
    "Sindoor Khela",
    "দশমীতে দেবীকে বরণের পর বিবাহিত মহিলারা পরস্পরকে ও দেবীকে সিঁদুর পরান। লাল রঙে হাসি আর বিদায়ের বিষাদ মিশে যায়।",
    "On Dashami, after boron, married women smear vermilion on the goddess and on one another. Laughter and the sadness of farewell mix in red.",
    ["সিঁদুর", "বিসর্জন", "উলুধ্বনি"],
    ["bijoya-greetings"],
    "Alapon editorial"
  ],
  [
    "kolabou-nabapatrika",
    "tradition",
    "নবপত্রিকা ও কলাবউ",
    "Nabapatrika and Kolabou",
    "সপ্তমীর ভোরে নয় রকম গাছ একসঙ্গে বেঁধে কলাগাছের সঙ্গে শাড়ি পরিয়ে স্নান করানো হয়, তারপর মণ্ডপে প্রতিষ্ঠা করা হয়।",
    "On Saptami morning nine plants are tied together with a banana plant, draped in a sari and bathed, then installed at the pandal.",
    ["নবপত্রিকা", "মণ্ডপ", "প্রতিমা"],
    [],
    "Alapon editorial"
  ],
  [
    "sandhi-puja",
    "tradition",
    "সন্ধিপুজো",
    "Sandhi Puja",
    "অষ্টমী শেষ ও নবমী শুরুর সন্ধিক্ষণে বিশেষ পুজো, প্রচলিত রীতিতে ১০৮টি প্রদীপ জ্বালিয়ে। এই মুহূর্তটির সময় প্রতি বছর তিথি ধরে ঠিক হয়।",
    "The special worship at the moment Ashtami ends and Nabami begins, by custom with 108 lamps. The exact time is set by the tithi each year.",
    ["সন্ধিপূজা", "অঞ্জলি", "আরতি"],
    [],
    "Alapon editorial"
  ],
  [
    "kumari-puja",
    "tradition",
    "কুমারী পুজো",
    "Kumari Puja",
    "অষ্টমী বা নবমীতে একটি অল্পবয়সী মেয়েকে দেবীর রূপ ভেবে পুজো করার রীতি। বেলুড় মঠের কুমারী পুজো বিশেষ পরিচিত।",
    "A tradition of worshipping a young girl as a form of the goddess on Ashtami or Nabami. The Kumari Puja at Belur Math is especially well known.",
    ["অঞ্জলি", "ভোগ"],
    [],
    "Alapon editorial"
  ],
  [
    "bodhon",
    "tradition",
    "বোধন",
    "Bodhon",
    "ষষ্ঠীর সন্ধ্যায় দেবীকে জাগানোর অনুষ্ঠান। বেলগাছের তলায় বা মণ্ডপে বোধন হয়, আর তার সঙ্গেই পুজোর মূল আয়োজন শুরু।",
    "The Shashthi-evening ritual of awakening the goddess. Bodhon is done under a bel tree or at the pandal, and the main Puja begins with it.",
    ["বোধন", "শঙ্খ", "আগমনী"],
    ["mahalaya"],
    "Alapon editorial"
  ],
  [
    "pandal-hopping",
    "tradition",
    "ঠাকুর দেখা",
    "Pandal-hopping",
    "পুজোর কয়েক দিন দল বেঁধে মণ্ডপে মণ্ডপে ঘুরে প্রতিমা আর সাজসজ্জা দেখা। থিম, আলো আর শিল্পের কাজ দেখতে মানুষ সারা রাত পথে থাকে।",
    "During Puja, groups go from pandal to pandal to see idols and decoration. People stay out through the night to see themes, lights and craft.",
    ["ঠাকুর", "মণ্ডপ", "পুজো"],
    ["durga-puja-unesco"],
    "Alapon editorial"
  ],
  [
    "barowari-puja",
    "tradition",
    "বারোয়ারি পুজো",
    "Barowari puja",
    "বারোয়ারি মানে পাড়ার সবাই মিলে চাঁদা তুলে করা পুজো। বাড়ির পুজো থেকে সবার পুজো হয়ে ওঠার এই পথ বাংলার উৎসবকে সামাজিক রূপ দিয়েছে।",
    "Barowari means a puja funded and organised by a whole neighbourhood. The move from home worship to community worship gave the festival its social character.",
    ["পুজো", "মণ্ডপ", "ঠাকুর"],
    ["durga-puja-unesco"],
    "Alapon editorial"
  ],
  [
    "puja-bhog",
    "food",
    "পুজোর ভোগ",
    "Puja bhog",
    "দেবীকে নিবেদনের পর সবাই মিলে খাওয়া ভোগ। খিচুড়ি, লাবড়া, চাটনি আর পায়েস অনেক মণ্ডপের চেনা পদ। লুচি-আলুর দম উৎসবের অন্য এক প্রিয় সকাল।",
    "Food offered to the goddess and then eaten together. Khichuri, labra, chutney and payesh are familiar dishes at many pandals, and luchi with alur dom is another festive favourite.",
    ["ভোগ", "অঞ্জলি", "মণ্ডপ"],
    [],
    "Alapon editorial"
  ],
  [
    "daker-saj",
    "art",
    "ডাকের সাজ",
    "Daker saaj",
    "প্রতিমাকে রুপোলি জরি ও পাতলা পাত দিয়ে সাজানোর ঐতিহ্য। নামের উৎস নিয়ে একটি প্রচলিত কথা আছে যে সাজটি একসময় ডাকযোগে আসত; সূক্ষ্ম কাজ প্রতিমায় আলাদা সৌন্দর্য আনে।",
    "A tradition of decorating the idol with silvery tinsel and thin foil. A popular account of the name says the decoration once arrived by post; its fine work adds distinct beauty to the idol.",
    ["প্রতিমা", "চালচিত্র"],
    [],
    "Alapon editorial"
  ],
  [
    "puja-new-clothes",
    "tradition",
    "পুজোর নতুন জামা",
    "Puja new clothes",
    "পুজোর আগে নতুন জামাকাপড় কেনা বাঙালি পরিবারের প্রায় রীতি। ষষ্ঠী থেকে দশমী প্রতিদিনের জন্য আলাদা সাজের ভাবনা উৎসবের আনন্দের অংশ।",
    "Buying new clothes before Puja is almost a custom in Bengali families. Planning a different look for each day from Shashthi to Dashami is part of the joy.",
    ["পুজো", "ঠাকুর"],
    [],
    "Alapon editorial"
  ],
  [
    "bijoya-greetings",
    "tradition",
    "বিজয়ার শুভেচ্ছা",
    "Bijoya greetings",
    'দশমীর পর বড়দের প্রণাম, বন্ধুদের কোলাকুলি আর "শুভ বিজয়া" বলা; সঙ্গে নাড়ু, মিষ্টি আর ঘরোয়া মিলন।',
    'After Dashami, younger people touch elders\' feet, friends embrace and say "Shubho Bijoya", with narus, sweets and family gatherings.',
    ["বিসর্জন", "সিঁদুর", "ভোগ"],
    ["sindoor-khela"],
    "Alapon editorial"
  ],
  [
    "agomoni-songs",
    "song",
    "আগমনী গান",
    "Agomoni songs",
    "দেবীর আগমনের আনন্দ ও মায়ের কন্যাকে ফিরে পাওয়ার অপেক্ষা নিয়ে গান, যা মহালয়ার আগে-পরে গাওয়া হয়। এতে মা-মেয়ের আবেগ কাব্য হয়ে ওঠে।",
    "Songs of the joy of the goddess's arrival and a mother's wait for her daughter, sung around Mahalaya. In them a parent's feeling becomes poetry.",
    ["আগমনী", "মহালয়া", "শঙ্খ"],
    ["mahalaya"],
    "Alapon editorial"
  ],
  [
    "chandannagar-lights",
    "art",
    "চন্দননগরের আলোকসজ্জা",
    "Chandannagar lights",
    "হুগলির চন্দননগর পুজোর আলোর কাজের জন্য বিখ্যাত। বৈদ্যুতিক আলোয় গড়া বিশাল তোরণ ও মণ্ডপ দেখতে দূর-দূরান্ত থেকে মানুষ আসেন।",
    "Chandannagar in Hooghly is famed for Puja lighting. People travel from far to see its large gateways and pandals built of electric light.",
    ["মণ্ডপ", "ঠাকুর", "পুজো"],
    [],
    "Alapon editorial"
  ],
  [
    "kojagari-lakshmi-puja",
    "tradition",
    "কোজাগরী লক্ষ্মীপুজো",
    "Kojagari Lakshmi Puja",
    "আশ্বিনের পূর্ণিমার রাতে ঘরে ঘরে লক্ষ্মীর আরাধনা। আলপনায় লক্ষ্মীর পা, পদ্ম আর ধানের ঝাঁপি; ভোগে নাড়ু, খিচুড়ি আর পায়েস। লোকমতে এই রাতে জেগে থাকা মানুষের ঘরে লক্ষ্মীর কৃপা নামে।",
    "On the full-moon night of Ashwin, homes worship Lakshmi. Alpona of her footprints, lotuses and a pot of paddy; naru, khichuri and payesh as bhog. Folk belief says Lakshmi favours those who stay awake this night.",
    ["কোজাগরী", "নাড়ু", "ঝাঁপি"],
    ["alpona"],
    "Alapon editorial"
  ],
  [
    "dakshineswar-kali-temple",
    "place",
    "দক্ষিণেশ্বর কালীমন্দির",
    "Dakshineswar Kali Temple",
    "কলকাতার উত্তরাংশে গঙ্গার তীরে ১৮৫৫ সালে রানি রাসমণির প্রতিষ্ঠিত কালীমন্দির। শ্রীরামকৃষ্ণ এখানে পুরোহিত ছিলেন, তাই এটি বহু মানুষের কাছে বিশেষ তীর্থ।",
    "A Kali temple on the Ganga in north Kolkata, founded by Rani Rashmoni in 1855. Sri Ramakrishna served as priest here, making it a special pilgrimage site for many.",
    ["জবা", "প্রদীপ", "শ্যামাসংগীত"],
    ["kali-puja"],
    "Alapon editorial"
  ],
  [
    "kalighat-temple",
    "place",
    "কালীঘাট",
    "Kalighat",
    "কলকাতার দক্ষিণাংশে আদি গঙ্গার তীরের কালীঘাট কালী মায়ের মন্দিরের জন্য বিখ্যাত। কলকাতা নামের সঙ্গেও কালীঘাটের নাম প্রায়ই জড়িয়ে বলা হয়।",
    "Kalighat on the Adi Ganga in south Kolkata is famed for its temple of Mother Kali. The name Kolkata is often spoken of in connection with Kalighat.",
    ["জবা", "প্রদীপ"],
    ["kali-puja", "kalighat-pat"],
    "Alapon editorial"
  ],
  [
    "bhoot-chaturdashi",
    "tradition",
    "ভূতচতুর্দশী",
    "Bhoot Chaturdashi",
    "কালীপুজোর আগের দিন চৌদ্দ প্রদীপ জ্বালানো আর চৌদ্দ রকম শাক খাওয়ার রীতি। ভূত তাড়ানো আর ঘর আলো করার লোকবিশ্বাস এতে মিশে আছে।",
    "The day before Kali Puja, when fourteen lamps are lit and fourteen kinds of greens are eaten. Folk beliefs about driving away spirits and lighting the home mingle in it.",
    ["ভূতচতুর্দশী", "প্রদীপ", "অমাবস্যা"],
    ["kali-puja"],
    "Alapon editorial"
  ],
  [
    "bhai-phota",
    "tradition",
    "ভাইফোঁটা",
    "Bhai Phota",
    "কালীপুজোর দুদিন পর বোনেরা ভাইদের কপালে চন্দনের ফোঁটা দিয়ে দীর্ঘ জীবন কামনা করেন; ভাইরা উপহার দেন। অনেক বাড়িতে পাতানো ভাই-বোনদেরও ফোঁটা দেওয়া হয়।",
    "Two days after Kali Puja, sisters apply a sandalwood tika on their brothers' foreheads and wish them long life; brothers give gifts. Many homes include adopted brothers and sisters too.",
    ["ভাইফোঁটা", "চন্দন"],
    ["kali-puja"],
    "Alapon editorial"
  ],
  [
    "jagaddhatri-puja",
    "tradition",
    "জগদ্ধাত্রী পুজো",
    "Jagaddhatri Puja",
    "কার্তিকে কালীপুজোর কয়েক দিন পর চতুর্ভুজা সিংহবাহিনী জগদ্ধাত্রীর পুজো। চন্দননগর ও কৃষ্ণনগরের পুজো আর চন্দননগরের আলোকসজ্জা সুবিখ্যাত।",
    "Some days after Kali Puja in Kartik, the four-armed, lion-mounted Jagaddhatri is worshipped. The pujas of Chandannagar and Krishnanagar, and Chandannagar's lighting, are renowned.",
    ["জগদ্ধাত্রী", "প্রদীপ"],
    ["chandannagar-lights"],
    "Alapon editorial"
  ],
  [
    "shyama-sangeet",
    "song",
    "শ্যামাসংগীত",
    "Shyama Sangeet",
    "কালী বা শ্যামা মায়ের প্রতি ভক্তি ও আত্মসমর্পণের গান। রামপ্রসাদ সেনের গান এই ধারার সবচেয়ে পরিচিত নামগুলোর একটি।",
    "Songs of devotion and surrender to Mother Kali, or Shyama. The songs of Ramprasad Sen are among the best-known names of this tradition.",
    ["শ্যামাসংগীত", "জবা"],
    ["kali-puja"],
    "Alapon editorial"
  ]
];

export const DISCOVERIES: Discovery[] = ROWS.map(
  ([slug, category, titleBn, titleEn, summaryBn, summaryEn, relatedWords, relatedSlugs, source]) => ({
    slug,
    category,
    titleBn,
    titleEn,
    summaryBn,
    summaryEn,
    relatedWords,
    relatedSlugs,
    source
  })
);
