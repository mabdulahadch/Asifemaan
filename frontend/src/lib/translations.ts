export type Language = "en" | "ur" | "hi";

export const translations: Record<string, Record<Language, string>> = {
    // Navbar
    login: { en: "Login", ur: "لاگ ان", hi: "लॉग इन" },
    logout: { en: "Logout", ur: "لاگ آؤٹ", hi: "लॉग आउट" },
    userPanel: { en: "User Panel", ur: "صارف پینل", hi: "उपयोगकर्ता पैनल" },
    adminPanel: { en: "Admin Panel", ur: "ایڈمن پینل", hi: "एडमिन पैनल" },
    language: { en: "Language", ur: "زبان", hi: "भाषा" },

    // Poets Page
    poets: { en: "Poets", ur: "شعراء", hi: "कवि" },
    poetsSubtitle: {
        en: "Explore the collection of Urdu poets",
        ur: "اردو شعراء کا مجموعہ دیکھیں",
        hi: "उर्दू कवियों का संग्रह देखें",
    },
    noPoetsFound: {
        en: "No poets found.",
        ur: "کوئی شاعر نہیں ملا۔",
        hi: "कोई कवि नहीं मिला।",
    },
    failedToLoadPoets: {
        en: "Failed to load poets. Please try again later.",
        ur: "شعراء لوڈ کرنے میں ناکامی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔",
        hi: "कवियों को लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
    },

    // Featured Content
    featuredPoetry: { en: "Featured Poetry", ur: "نمایاں شاعری", hi: "विशेष कविता" },
    featuredEbooks: { en: "Featured E-Books", ur: "نمایاں ای بُک", hi: "विशेष ई-पुस्तकें" },
    featuredVideos: { en: "Featured Videos", ur: "نمایاں ویڈیوز", hi: "विशेष वीडियो" },
    featuredAudios: { en: "Featured Audios", ur: "نمایاں آڈیوز", hi: "विशेष ऑडियो" },
    topShers: { en: "Top Shers", ur: "بہترین اشعار", hi: "शीर्ष शेर" },
    topGhazals: { en: "Top Ghazals", ur: "بہترین غزلیں", hi: "शीर्ष ग़ज़लें" },
    readMore: { en: "Read More", ur: "مزید پڑھیں", hi: "और पढ़ें" },
    allPoets: { en: "All Poets", ur: "تمام شعراء", hi: "सभी कवि" },

    // Poet Profile
    about: { en: "About", ur: "تعارف", hi: "परिचय" },
    follow: { en: "Follow", ur: "فالو کریں", hi: "फ़ॉलो करें" },
    following: { en: "Following", ur: "فالو کیا ہوا", hi: "फ़ॉलो किया हुआ" },

    // Tab Navigation
    all: { en: "All", ur: "سب", hi: "सभी" },
    profile: { en: "Profile", ur: "پروفائل", hi: "प्रोफ़ाइल" },
    ghazal: { en: "Ghazal", ur: "غزل", hi: "ग़ज़ल" },
    nazm: { en: "Nazm", ur: "نظم", hi: "नज़्म" },
    sher: { en: "Sher", ur: "شعر", hi: "शेर" },
    ebook: { en: "E-Book", ur: "ای بُک", hi: "ई-बुक" },
    audio: { en: "Audio", ur: "آڈیو", hi: "ऑडियो" },
    video: { en: "Video", ur: "ویڈیو", hi: "वीडियो" },

    // Actions
    seeAll: { en: "See All", ur: "سب دیکھیں", hi: "सभी देखें" },
    addToFavorites: { en: "Add To Favorites", ur: "پسندیدہ میں شامل کریں", hi: "पसंदीदा में जोड़ें" },
    shareThis: { en: "Share this", ur: "شیئر کریں", hi: "साझा करें" },
    download: { en: "Download", ur: "ڈاؤن لوڈ", hi: "डाउनलोड" },
    copyLink: { en: "Copy Link", ur: "لنک کاپی کریں", hi: "लिंक कॉपी करें" },

    // Empty States
    noGhazals: { en: "No ghazals available.", ur: "کوئی غزل دستیاب نہیں ہے", hi: "कोई ग़ज़ल उपलब्ध नहीं है" },
    noShers: { en: "No shers available.", ur: "کوئی شعر دستیاب نہیں ہے", hi: "कोई शेर उपलब्ध नहीं है" },
    noNazms: { en: "No nazms available.", ur: "کوئی نظم دستیاب نہیں ہے", hi: "कोई नज़्म उपलब्ध नहीं है" },
    noEbooks: { en: "No e-books available.", ur: "کوئی ای بُک دستیاب نہیں ہے", hi: "कोई ई-बुक उपलब्ध नहीं है" },
    noAudio: { en: "No audio available.", ur: "کوئی آڈیو دستیاب نہیں ہے", hi: "कोई ऑडियो उपलब्ध नहीं है" },
    noVideo: { en: "No videos available.", ur: "کوئی ویڈیو دستیاب نہیں ہے", hi: "कोई वीडियो उपलब्ध नहीं है" },

    // Misc
    search: { en: "Search...", ur: "تلاش کریں...", hi: "खोजें..." },
    poetNotFound: { en: "Poet not found", ur: "شاعر نہیں ملا", hi: "कवि नहीं मिला" },
    failedToLoadProfile: {
        en: "Failed to load poet profile.",
        ur: "شاعر کا پروفائل لوڈ کرنے میں ناکامی۔",
        hi: "कवि प्रोफ़ाइल लोड करने में विफल।",
    },
};

export const getTranslation = (key: string, language: Language): string => {
    return translations[key]?.[language] ?? translations[key]?.en ?? key;
};
