export type LegalKey = "terms" | "privacy" | "copyright" | "safety";

interface Section {
  h: string;
  p: string[];
}
interface Doc {
  title: string;
  summary: string;
  sections: Section[];
}

/** Last substantive edit of the legal texts. Update whenever a document changes. */
export const LEGAL_UPDATED = "2026-09-25";

export const LEGAL: Record<LegalKey, { bn: Doc; en: Doc }> = {
  terms: {
    en: {
      title: "Terms of Service",
      summary: "The simple rules for using Alapon.",
      sections: [
        {
          h: "Using Alapon",
          p: [
            "Alapon is a Bengali-first place for culture, play and learning. Games, learning and cultural content are free and need no account.",
            "Posting and commenting in Theke Adda needs an account and is limited to adults (18+). By confirming you are an adult you tell us this is true."
          ]
        },
        {
          h: "Your content",
          p: [
            "You keep the rights to what you write. You give Alapon a non-exclusive licence to display it on the service.",
            "Only post things you created or have the right to share. Do not post full books, full articles, complete songs, film clips or other people's photographs or artwork without permission."
          ]
        },
        {
          h: "Behaviour",
          p: [
            "No harassment, hate, threats, spam, impersonation or sharing of private information. Respect festivals and religious imagery.",
            "Anyone can report content. Moderators may remove content, restrict or suspend accounts. You can appeal a decision from your account page."
          ]
        },
        {
          h: "Service",
          p: [
            "We work to keep Alapon available and accurate, but it is provided as is. Festival dates that follow the lunar calendar can differ by a day between regions.",
            "We may change or stop features. We will update this page when the terms change."
          ]
        },
        {
          h: "Contact",
          p: [
            "Questions about these terms: use the contact address shown in the site footer or the operator's published address."
          ]
        }
      ]
    },
    bn: {
      title: "ব্যবহারের শর্তাবলি",
      summary: "আলাপন ব্যবহারের সহজ নিয়ম।",
      sections: [
        {
          h: "আলাপন ব্যবহার",
          p: [
            "আলাপন বাংলা সংস্কৃতি, খেলা ও শেখার জায়গা। খেলা, শেখা ও সাংস্কৃতিক বিষয়বস্তু বিনামূল্যে, অ্যাকাউন্ট ছাড়াই ব্যবহার করা যায়।",
            "ঠেকের আড্ডায় লেখা ও মন্তব্য করতে অ্যাকাউন্ট লাগে এবং তা শুধু প্রাপ্তবয়স্কদের (১৮+) জন্য। প্রাপ্তবয়স্ক বলে নিশ্চিত করলে আপনি জানাচ্ছেন যে তা সত্য।"
          ]
        },
        {
          h: "আপনার লেখা",
          p: [
            "আপনার লেখার অধিকার আপনারই থাকে। সেবায় দেখানোর জন্য আপনি আলাপনকে একটি অ-একচেটিয়া অনুমতি দেন।",
            "শুধু নিজের তৈরি বা শেয়ার করার অধিকার আছে এমন জিনিস দিন। অনুমতি ছাড়া পুরো বই, পুরো প্রবন্ধ, সম্পূর্ণ গান, সিনেমার অংশ বা অন্যের ছবি ও শিল্পকর্ম দেবেন না।"
          ]
        },
        {
          h: "আচরণ",
          p: [
            "হয়রানি, বিদ্বেষ, হুমকি, স্প্যাম, ছদ্মবেশ বা ব্যক্তিগত তথ্য ফাঁস নয়। উৎসব ও ধর্মীয় প্রতীকের প্রতি শ্রদ্ধা রাখুন।",
            "যে কেউ অভিযোগ জানাতে পারেন। মডারেটররা লেখা সরাতে, অ্যাকাউন্ট সীমিত বা স্থগিত করতে পারেন। সিদ্ধান্তের বিরুদ্ধে অ্যাকাউন্ট পাতা থেকে আপিল করা যায়।"
          ]
        },
        {
          h: "সেবা",
          p: [
            "আমরা আলাপন চালু ও নির্ভুল রাখতে চেষ্টা করি, তবে সেবাটি যেমন আছে তেমনই দেওয়া হয়। চান্দ্র পঞ্জিকা মেনে চলা উৎসবের তারিখ অঞ্চলভেদে এক দিন আলাদা হতে পারে।",
            "আমরা ফিচার বদলাতে বা বন্ধ করতে পারি। শর্ত বদলালে এই পাতা হালনাগাদ হবে।"
          ]
        },
        {
          h: "যোগাযোগ",
          p: ["এই শর্ত নিয়ে প্রশ্ন থাকলে ফুটারে দেওয়া বা পরিচালকের প্রকাশিত ঠিকানায় জানান।"]
        }
      ]
    }
  },
  privacy: {
    en: {
      title: "Privacy Notice",
      summary: "What we collect, why, and how you control it.",
      sections: [
        {
          h: "What stays on your device",
          p: [
            "Your Daily 5 progress, Bengal Passport, saved words, learning progress and game history are stored only in your browser (localStorage). We do not receive them. Clearing site data in Settings removes them."
          ]
        },
        {
          h: "What we store if you make an account",
          p: [
            "Email (for sign-in), a display name and username you choose, whether you are an adult, your privacy setting, and your quiz scores and Theke Adda posts, comments and reactions.",
            "We do not collect your address, exact location, contacts or phone number. Profiles are private by default."
          ]
        },
        {
          h: "Children",
          p: [
            "Games, quizzes, learning and culture pages work without an account and collect no personal data. Community posting is limited to adults. We do not offer direct messages, public child profiles or location features, and we do not profile children for advertising."
          ]
        },
        {
          h: "Analytics and cookies",
          p: [
            "Analytics are off unless the operator enables them, and never include names, emails or free text. We use no advertising cookies. Your language and theme choices are kept in your browser."
          ]
        },
        {
          h: "Your rights",
          p: [
            "From your account page you can download your data, edit your profile and request deletion. Deletion removes your profile, scores, posts, comments and reactions; it is completed within 30 days of the request.",
            "Service providers: our database and sign-in are provided by Supabase. Content you post may be visible to other signed-in users."
          ]
        }
      ]
    },
    bn: {
      title: "গোপনীয়তা নীতি",
      summary: "আমরা কী সংগ্রহ করি, কেন করি এবং আপনি কীভাবে নিয়ন্ত্রণ করবেন।",
      sections: [
        {
          h: "যা আপনার ডিভাইসেই থাকে",
          p: [
            "আজকের ৫-এর অগ্রগতি, বাংলা পাসপোর্ট, সংরক্ষিত শব্দ, শেখার অগ্রগতি ও খেলার ইতিহাস শুধু আপনার ব্রাউজারে (localStorage) থাকে। আমরা তা পাই না। সেটিংসে গিয়ে সাইটের তথ্য মুছলে সবই মুছে যায়।"
          ]
        },
        {
          h: "অ্যাকাউন্ট খুললে যা রাখি",
          p: [
            "সাইন-ইনের জন্য ইমেইল, আপনার বাছা প্রদর্শন-নাম ও ইউজারনেম, আপনি প্রাপ্তবয়স্ক কি না, গোপনীয়তার সেটিং এবং কুইজের স্কোর ও ঠেকের আড্ডার লেখা, মন্তব্য ও প্রতিক্রিয়া।",
            "আপনার ঠিকানা, সঠিক অবস্থান, কন্টাক্ট বা ফোন নম্বর আমরা নিই না। প্রোফাইল ডিফল্টে ব্যক্তিগত।"
          ]
        },
        {
          h: "শিশুরা",
          p: [
            "খেলা, কুইজ, শেখা ও সংস্কৃতির পাতা অ্যাকাউন্ট ছাড়াই চলে এবং কোনো ব্যক্তিগত তথ্য নেয় না। কমিউনিটিতে লেখা শুধু প্রাপ্তবয়স্কদের জন্য। আমরা সরাসরি বার্তা, শিশুদের প্রকাশ্য প্রোফাইল বা অবস্থান-সুবিধা দিই না, এবং বিজ্ঞাপনের জন্য শিশুদের প্রোফাইল তৈরি করি না।"
          ]
        },
        {
          h: "অ্যানালিটিক্স ও কুকি",
          p: [
            "পরিচালক চালু না করলে অ্যানালিটিক্স বন্ধ থাকে, এবং তাতে কখনও নাম, ইমেইল বা মুক্ত লেখা যায় না। আমরা বিজ্ঞাপনের কুকি ব্যবহার করি না। ভাষা ও থিমের পছন্দ আপনার ব্রাউজারে থাকে।"
          ]
        },
        {
          h: "আপনার অধিকার",
          p: [
            "অ্যাকাউন্ট পাতা থেকে আপনি নিজের তথ্য ডাউনলোড, প্রোফাইল সম্পাদনা ও মুছে ফেলার অনুরোধ করতে পারেন। মুছলে প্রোফাইল, স্কোর, লেখা, মন্তব্য ও প্রতিক্রিয়া সরে যায়; অনুরোধের ৩০ দিনের মধ্যে তা সম্পন্ন হয়।",
            "সেবাদাতা: ডাটাবেস ও সাইন-ইন Supabase দেয়। আপনার লেখা অন্য সাইন-ইন করা ব্যবহারকারীরা দেখতে পারেন।"
          ]
        }
      ]
    }
  },
  copyright: {
    en: {
      title: "Copyright Policy",
      summary: "How we treat copyright and what to do if your work is used without permission.",
      sections: [
        {
          h: "Our approach",
          p: [
            "Alapon's own cultural content is written by us or drawn from public-domain and openly licensed sources, and each source is recorded. We do not import datasets whose rights are unknown.",
            "Users may only upload content they created or have permission to use."
          ]
        },
        {
          h: "Report a copyright problem",
          p: [
            "If you believe content on Alapon infringes your copyright, use the Report copyright form. Tell us who you are, where the content is, what the original work is, and confirm your claim is made in good faith.",
            "We record the claim, may restrict the content while we review it, decide, notify the parties and keep an audit log."
          ]
        },
        {
          h: "Counter-notice and repeat infringement",
          p: [
            "If your content was restricted and you believe this was a mistake, you can appeal from your account page. Accounts that repeatedly infringe may be suspended.",
            "Notice-and-takedown rules differ by country; the operator should have them reviewed for each market it serves."
          ]
        }
      ]
    },
    bn: {
      title: "কপিরাইট নীতি",
      summary: "কপিরাইট নিয়ে আমাদের অবস্থান এবং অনুমতি ছাড়া আপনার কাজ ব্যবহার হলে কী করবেন।",
      sections: [
        {
          h: "আমাদের নীতি",
          p: [
            "আলাপনের সাংস্কৃতিক বিষয়বস্তু আমরা নিজেরা লিখি বা পাবলিক ডোমেইন ও উন্মুক্ত লাইসেন্সের উৎস থেকে নিই, এবং প্রতিটি উৎস নথিভুক্ত থাকে। অধিকার অজানা এমন ডেটাসেট আমরা আমদানি করি না।",
            "ব্যবহারকারীরা শুধু নিজের তৈরি বা ব্যবহারের অনুমতি আছে এমন বিষয় দিতে পারেন।"
          ]
        },
        {
          h: "কপিরাইট সমস্যা জানান",
          p: [
            "আলাপনের কোনো বিষয় আপনার কপিরাইট লঙ্ঘন করছে মনে করলে 'কপিরাইট অভিযোগ' ফর্ম ব্যবহার করুন। আপনি কে, বিষয়টি কোথায়, মূল কাজটি কী তা জানান এবং সরল বিশ্বাসে দাবি করছেন বলে নিশ্চিত করুন।",
            "আমরা অভিযোগ নথিভুক্ত করি, পর্যালোচনার সময় বিষয়টি সাময়িকভাবে সীমিত করতে পারি, সিদ্ধান্ত নিই, দুই পক্ষকে জানাই এবং অডিট লগ রাখি।"
          ]
        },
        {
          h: "পাল্টা আপত্তি ও বারবার লঙ্ঘন",
          p: [
            "আপনার লেখা সীমিত হলে এবং তা ভুল মনে করলে অ্যাকাউন্ট পাতা থেকে আপিল করতে পারেন। বারবার লঙ্ঘন করলে অ্যাকাউন্ট স্থগিত হতে পারে।",
            "নোটিস-অ্যান্ড-টেকডাউনের নিয়ম দেশভেদে আলাদা; পরিচালকের উচিত যে বাজারে সেবা দিচ্ছেন সেখানকার নিয়ম আইনজীবীকে দিয়ে যাচাই করানো।"
          ]
        }
      ]
    }
  },
  safety: {
    en: {
      title: "Safety and Community Guidelines",
      summary: "How Alapon stays welcoming, and how we protect children.",
      sections: [
        {
          h: "Child-safe by design",
          p: [
            "The games, quizzes, learning and culture areas are open to everyone and collect no personal data.",
            "Community posting (Theke Adda) is for adults only. There are no direct messages, no public child profiles, no exact-location features and no open follower mechanics."
          ]
        },
        {
          h: "Community guidelines",
          p: [
            "Be kind. Disagree with ideas, not people. No harassment, hate, threats, sexual content, spam or private information.",
            "Treat festival and religious imagery with respect. Sacred figures are never rewards in games."
          ]
        },
        {
          h: "Tools",
          p: [
            "Report any post or comment. Block or mute anyone. Moderators review reports, act, and record every action in an audit log. Suspensions can be appealed.",
            "Automated checks such as rate limits help against spam, but people make the serious decisions."
          ]
        },
        {
          h: "If something is urgent",
          p: [
            "If someone is in immediate danger, contact local emergency services. Report unsafe content using the report button so moderators see it with high priority."
          ]
        }
      ]
    },
    bn: {
      title: "নিরাপত্তা ও কমিউনিটি নির্দেশিকা",
      summary: "আলাপন কীভাবে আন্তরিক থাকে এবং আমরা শিশুদের কীভাবে সুরক্ষা দিই।",
      sections: [
        {
          h: "শুরু থেকেই শিশু-নিরাপদ",
          p: [
            "খেলা, কুইজ, শেখা ও সংস্কৃতির অংশ সবার জন্য খোলা এবং কোনো ব্যক্তিগত তথ্য নেয় না।",
            "কমিউনিটিতে লেখা (ঠেকের আড্ডা) শুধু প্রাপ্তবয়স্কদের জন্য। সরাসরি বার্তা, শিশুদের প্রকাশ্য প্রোফাইল, সঠিক অবস্থান বা খোলা ফলোয়ার ব্যবস্থা নেই।"
          ]
        },
        {
          h: "কমিউনিটি নির্দেশিকা",
          p: [
            "সদয় থাকুন। মতের সঙ্গে দ্বিমত করুন, মানুষের সঙ্গে নয়। হয়রানি, বিদ্বেষ, হুমকি, অশালীন বিষয়, স্প্যাম বা ব্যক্তিগত তথ্য নয়।",
            "উৎসব ও ধর্মীয় প্রতীকের প্রতি শ্রদ্ধা রাখুন। পবিত্র চরিত্র কখনও খেলার পুরস্কার হয় না।"
          ]
        },
        {
          h: "সরঞ্জাম",
          p: [
            "যেকোনো লেখা বা মন্তব্যের বিরুদ্ধে অভিযোগ করুন। যে কাউকে ব্লক বা মিউট করুন। মডারেটররা অভিযোগ দেখেন, ব্যবস্থা নেন এবং প্রতিটি কাজ অডিট লগে রাখেন। স্থগিতাদেশের বিরুদ্ধে আপিল করা যায়।",
            "রেট লিমিটের মতো স্বয়ংক্রিয় ব্যবস্থা স্প্যাম ঠেকাতে সাহায্য করে, কিন্তু গুরুতর সিদ্ধান্ত মানুষই নেন।"
          ]
        },
        {
          h: "জরুরি হলে",
          p: [
            "কেউ তাৎক্ষণিক বিপদে থাকলে স্থানীয় জরুরি সেবায় যোগাযোগ করুন। অনিরাপদ বিষয় অভিযোগ বোতামে জানান, মডারেটররা তা উচ্চ অগ্রাধিকারে দেখবেন।"
          ]
        }
      ]
    }
  }
};
