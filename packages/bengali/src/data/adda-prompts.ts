export interface AddaPrompt {
  bn: string;
  en: string;
}

/**
 * Culture-first conversation starters for "Today's Adda". They ask for memories and everyday
 * knowledge rather than opinions, and avoid assuming one region, religion or community.
 */
export const ADDA_PROMPTS: AddaPrompt[] = [
  {
    bn: "আপনার ঠাকুমা-দিদা বা দাদু-দাদার মুখে শোনা একটি বাংলা শব্দ কোনটি?",
    en: "Which Bengali word did you first hear from a grandparent?"
  },
  {
    bn: "বাড়ির উৎসবের সবচেয়ে প্রিয় খাবার কোনটি?",
    en: "What is your favourite food at a festival at home?"
  },
  {
    bn: "বাংলার কোন জায়গায় গেলে আপনার ছোটবেলার কথা মনে পড়ে?",
    en: "Which place in Bengal brings back your childhood?"
  },
  { bn: "আপনার প্রিয় বাংলা গান কোনটি, আর কেন?", en: "What is your favourite Bengali song, and why?" },
  {
    bn: "ছোটবেলায় শোনা একটি রূপকথা বা ছড়া মনে আছে?",
    en: "Do you remember a fairy tale or rhyme from your childhood?"
  },
  {
    bn: "আপনার পাড়ার সবচেয়ে মজার চরিত্রটি কেমন ছিলেন?",
    en: "Who was the most memorable character in your neighbourhood?"
  },
  {
    bn: "বর্ষার দিনে আপনার প্রিয় খাবার বা রীতি কী?",
    en: "What is your favourite food or habit on a rainy day?"
  },
  {
    bn: "বাংলা সাহিত্যের কোন বইটি আপনি বারবার পড়তে পারেন?",
    en: "Which Bengali book can you read again and again?"
  },
  {
    bn: "আপনার পরিবারে একটি বিশেষ রান্নার রেসিপি কীভাবে চলে আসছে?",
    en: "How has a special recipe been passed down in your family?"
  },
  {
    bn: "পুজোর কোন স্মৃতিটি আজও সবচেয়ে উজ্জ্বল?",
    en: "Which festival memory is still the brightest for you?"
  },
  {
    bn: "আপনার এলাকার কোনো লোকগান বা লোকনাচের কথা জানেন?",
    en: "Do you know a folk song or dance from your area?"
  },
  { bn: "বাংলার কোন নদীর সঙ্গে আপনার সম্পর্ক আছে?", en: "Which river of Bengal has a place in your life?" },
  {
    bn: "এমন একটি বাংলা প্রবাদ বলুন, যা আপনি প্রায়ই ব্যবহার করেন।",
    en: "Share a Bengali proverb you use often."
  },
  { bn: "আপনার প্রিয় বাংলা সিনেমা বা নাটক কোনটি?", en: "What is your favourite Bengali film or play?" },
  {
    bn: "ছোটবেলায় স্কুলের পথে কোন গন্ধ বা শব্দ মনে পড়ে?",
    en: "Which smell or sound do you remember from the walk to school?"
  },
  {
    bn: "আপনার প্রিয় বাংলা মিষ্টি কোনটি, আর কোন দোকানের?",
    en: "What is your favourite Bengali sweet, and from which shop?"
  },
  { bn: "বাংলা নববর্ষে আপনাদের বাড়িতে কী হয়?", en: "What happens at your home on Bengali New Year?" },
  {
    bn: "প্রবাসে থাকলে কোন বাংলা জিনিসটির অভাব সবচেয়ে বেশি বোধ করেন?",
    en: "If you live away, which Bengali thing do you miss most?"
  },
  { bn: "আপনার প্রিয় কবিতার একটি লাইন কী?", en: "What is a line from your favourite poem?" },
  { bn: "গ্রীষ্মের ছুটির কোন স্মৃতি আপনাকে হাসায়?", en: "Which summer-holiday memory makes you smile?" },
  {
    bn: "আপনার নিজের ভাষায় (আঞ্চলিক ভাষায়) একটি মজার শব্দ শেখান।",
    en: "Teach us a fun word from your own regional way of speaking."
  },
  {
    bn: "আপনার দেখা সবচেয়ে সুন্দর আলপনা বা নকশা কোথায়?",
    en: "Where have you seen the most beautiful alpona or design?"
  },
  {
    bn: "বাংলার কোন মেলা বা হাটের অভিজ্ঞতা ভোলার নয়?",
    en: "Which fair or market in Bengal is unforgettable for you?"
  },
  {
    bn: "আপনি কোন বাংলা ঐতিহাসিক জায়গাটি দেখতে চান?",
    en: "Which historical place in Bengal do you most want to visit?"
  },
  {
    bn: "এক কাপ চায়ের সঙ্গে আপনার প্রিয় আড্ডার বিষয় কী?",
    en: "What is your favourite topic to talk about over a cup of tea?"
  },
  {
    bn: "আপনার প্রিয় বাংলা লেখক বা কবির সঙ্গে কীভাবে পরিচয় হয়েছিল?",
    en: "How did you first meet your favourite Bengali writer or poet?"
  },
  {
    bn: "শীতের সকালে আপনাদের বাড়ির খাবারের কথা বলুন।",
    en: "Tell us about winter-morning food at your home."
  },
  {
    bn: "একটি বাংলা শব্দ, যার ইংরেজি অনুবাদ হয় না বলে আপনার মনে হয়?",
    en: "Which Bengali word do you feel cannot be translated into English?"
  },
  {
    bn: "আপনার প্রিয় বাংলা ছড়া বা গান, যা আপনি এখনও গুনগুন করেন?",
    en: "Which Bengali rhyme or song do you still hum?"
  },
  {
    bn: "আপনার পরিবারে কোন বাংলা রীতি বা বিশ্বাস আজও মানা হয়?",
    en: "Which Bengali custom or belief does your family still follow?"
  }
];
