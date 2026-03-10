export type Language = "en" | "ur" | "hi";

export const translations: Record<string, Record<Language, string>> = {
    // ── Navbar ──
    login: { en: "Login", ur: "لاگ ان", hi: "लॉग इन" },
    logout: { en: "Logout", ur: "لاگ آؤٹ", hi: "लॉग आउट" },
    userPanel: { en: "User Panel", ur: "صارف پینل", hi: "उपयोगकर्ता पैनल" },
    adminPanel: { en: "Admin Panel", ur: "ایڈمن پینل", hi: "एडमिन पैनल" },
    language: { en: "Language", ur: "زبان", hi: "भाषा" },

    // ── Poets Page ──
    featuredContent: { en: "Featured Content", ur: "نمایاں مواد", hi: "विशेष सामग्री" },
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

    // ── Featured Content ──
    featuredPoetry: { en: "Featured Poetry", ur: "نمایاں شاعری", hi: "विशेष कविता" },
    featuredEbooks: { en: "Featured E-Books", ur: "نمایاں ای بُک", hi: "विशेष ई-पुस्तकें" },
    featuredVideos: { en: "Featured Videos", ur: "نمایاں ویڈیوز", hi: "विशेष वीडियो" },
    featuredAudios: { en: "Featured Audios", ur: "نمایاں آڈیوز", hi: "विशेष ऑडियो" },
    topShers: { en: "Top Shers", ur: "بہترین اشعار", hi: "शीर्ष शेर" },
    topGhazals: { en: "Top Ghazals", ur: "بہترین غزلیں", hi: "शीर्ष ग़ज़लें" },
    readMore: { en: "Read More", ur: "مزید پڑھیں", hi: "और पढ़ें" },
    allPoets: { en: "All Poets", ur: "تمام شعراء", hi: "सभी कवि" },

    // ── Poet Profile ──
    about: { en: "About", ur: "تعارف", hi: "परिचय" },
    follow: { en: "Follow", ur: "فالو کریں", hi: "फ़ॉलो करें" },
    following: { en: "Following", ur: "فالو کیا ہوا", hi: "फ़ॉलो किया हुआ" },

    // ── Tab Navigation ──
    all: { en: "All", ur: "سب", hi: "सभी" },
    profile: { en: "Profile", ur: "پروفائل", hi: "प्रोफ़ाइल" },
    ghazal: { en: "Ghazal", ur: "غزل", hi: "ग़ज़ल" },
    nazm: { en: "Nazm", ur: "نظم", hi: "नज़्म" },
    sher: { en: "Sher", ur: "شعر", hi: "शेर" },
    ebook: { en: "E-Book", ur: "ای بُک", hi: "ई-बुक" },
    audio: { en: "Audio", ur: "آڈیو", hi: "ऑडियो" },
    video: { en: "Video", ur: "ویڈیو", hi: "वीडियो" },

    // ── Actions ──
    seeAll: { en: "See All", ur: "سب دیکھیں", hi: "सभी देखें" },
    addToFavorites: { en: "Add To Favorites", ur: "پسندیدہ میں شامل کریں", hi: "पसंदीदा में जोड़ें" },
    shareThis: { en: "Share this", ur: "شیئر کریں", hi: "साझा करें" },
    download: { en: "Download", ur: "ڈاؤن لوڈ", hi: "डाउनलोड" },
    copyLink: { en: "Copy Link", ur: "لنک کاپی کریں", hi: "लिंक कॉपी करें" },
    back: { en: "Back", ur: "واپس", hi: "वापस" },
    share: { en: "Share", ur: "شیئر کریں", hi: "साझा करें" },
    remove: { en: "Remove", ur: "ہٹائیں", hi: "हटाएं" },
    unfollow: { en: "Unfollow", ur: "ان فالو", hi: "अनफ़ॉलो" },
    clear: { en: "Clear", ur: "صاف", hi: "साफ़" },

    // ── Empty States ──
    noGhazals: { en: "No ghazals available.", ur: "کوئی غزل دستیاب نہیں ہے", hi: "कोई ग़ज़ल उपलब्ध नहीं है" },
    noShers: { en: "No shers available.", ur: "کوئی شعر دستیاب نہیں ہے", hi: "कोई शेर उपलब्ध नहीं है" },
    noNazms: { en: "No nazms available.", ur: "کوئی نظم دستیاب نہیں ہے", hi: "कोई नज़्म उपलब्ध नहीं है" },
    noEbooks: { en: "No e-books available.", ur: "کوئی ای بُک دستیاب نہیں ہے", hi: "कोई ई-बुक उपलब्ध नहीं है" },
    noAudio: { en: "No audio available.", ur: "کوئی آڈیو دستیاب نہیں ہے", hi: "कोई ऑडियो उपलब्ध नहीं है" },
    noVideo: { en: "No videos available.", ur: "کوئی ویڈیو دستیاب نہیں ہے", hi: "कोई वीडियो उपलब्ध नहीं है" },
    noContentAvailable: { en: "No content available.", ur: "کوئی مواد دستیاب نہیں ہے", hi: "कोई सामग्री उपलब्ध नहीं है" },

    // ── Not Found States ──
    ghazalNotFound: { en: "Ghazal not found", ur: "غزل نہیں ملی", hi: "ग़ज़ल नहीं मिली" },
    nazmNotFound: { en: "Nazm not found", ur: "نظم نہیں ملی", hi: "नज़्म नहीं मिली" },
    sherNotFound: { en: "Sher not found", ur: "شعر نہیں ملا", hi: "शेर नहीं मिला" },
    ebookNotFound: { en: "E-Book not found", ur: "ای بُک نہیں ملی", hi: "ई-बुक नहीं मिली" },

    // ── Login Page ──
    welcomeBack: { en: "Welcome back", ur: "خوش آمدید", hi: "वापसी पर स्वागत" },
    enterCredentials: { en: "Enter your credentials to sign in", ur: "سائن ان کے لیے اپنی تفصیلات درج کریں", hi: "साइन इन के लिए अपने क्रेडेंशियल दर्ज करें" },
    email: { en: "Email", ur: "ای میل", hi: "ईमेल" },
    password: { en: "Password", ur: "پاس ورڈ", hi: "पासवर्ड" },
    signIn: { en: "Sign In", ur: "سائن ان", hi: "साइन इन" },
    dontHaveAccount: { en: "Don't have an account?", ur: "اکاؤنٹ نہیں ہے؟", hi: "खाता नहीं है?" },
    signUp: { en: "Sign Up", ur: "سائن اپ", hi: "साइन अप" },

    // ── Register Page ──
    createAccount: { en: "Create an account", ur: "اکاؤنٹ بنائیں", hi: "खाता बनाएं" },
    enterDetails: { en: "Enter your details below to create your account", ur: "اپنا اکاؤنٹ بنانے کے لیے نیچے تفصیلات درج کریں", hi: "अपना खाता बनाने के लिए नीचे जानकारी दर्ज करें" },
    country: { en: "Country", ur: "ملک", hi: "देश" },
    selectCountry: { en: "Select a country", ur: "ملک منتخب کریں", hi: "देश चुनें" },
    loadingCountries: { en: "Loading countries...", ur: "ممالک لوڈ ہو رہے ہیں...", hi: "देश लोड हो रहे हैं..." },
    alreadyHaveAccount: { en: "Already have an account?", ur: "پہلے سے اکاؤنٹ ہے؟", hi: "पहले से खाता है?" },

    // ── 404 Page ──
    pageNotFound: { en: "Oops! Page not found", ur: "صفحہ نہیں ملا!", hi: "पृष्ठ नहीं मिला!" },
    returnToHome: { en: "Return to Home", ur: "ہوم پر واپس جائیں", hi: "होम पर वापस जाएं" },

    // ── Footer ──
    allRightsReserved: { en: "All rights reserved.", ur: "جملہ حقوق محفوظ ہیں۔", hi: "सर्वाधिकार सुरक्षित।" },
    writeToUs: { en: "Write to Us", ur: "ہمیں لکھیں", hi: "हमें लिखें" },
    writeToUsSub: { en: "We would love to hear from you.", ur: "ہمیں آپ سے سننا پسند آئے گا۔", hi: "स्थानीय संदेश" },
    nameField: { en: "Name", ur: "نام", hi: "नाम" },
    emailField: { en: "Email", ur: "ای میل", hi: "ईमेल" },
    countryField: { en: "Country", ur: "ملک", hi: "देश" },
    messageField: { en: "Your Message...", ur: "آپ کا پیغام...", hi: "आपका संदेश..." },
    sendMessage: { en: "Send Message", ur: "پیغام بھیجیں", hi: "संदेश भेजें" },
    messageSentTitle: { en: "Message Sent", ur: "پیغام بھیج دیا گیا", hi: "संदेश भेजा गया" },
    messageSentDesc: { en: "Your message has been sent successfully.", ur: "آپ کا پیغام کامیابی سے بھیجا جا چکا ہے۔", hi: "आपका संदेश सफलतापूर्वक भेजा गया है।" },
    errorTitle: { en: "Error", ur: "غلطی", hi: "त्रुटि" },
    errorDesc: { en: "An unexpected error occurred. Please try again later.", ur: "ایک غیر متوقع خرابی پیش آگئی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔", hi: "त्रुटि हुई।" },

    // ── Share Dialog ──
    linkCopied: { en: "Link copied to clipboard!", ur: "لنک کاپی ہو گیا!", hi: "लिंक कॉपी हो गया!" },
    failedToCopyLink: { en: "Failed to copy link", ur: "لنک کاپی کرنے میں ناکامی", hi: "लिंक कॉपी करने में विफल" },

    // ── User Panel ──
    favourites: { en: "Favourites", ur: "پسندیدہ", hi: "पसंदीदा" },
    favouriteContent: { en: "Favourite Content", ur: "پسندیدہ مواد", hi: "पसंदीदा सामग्री" },
    followedPoets: { en: "Followed Poets", ur: "فالو شدہ شاعر", hi: "फ़ॉलो किए गए कवि" },
    noFavContentYet: { en: "No favourite content yet", ur: "ابھی تک کوئی پسندیدہ مواد نہیں", hi: "अभी तक कोई पसंदीदा सामग्री नहीं" },
    likeContentToSee: { en: "Like content to see it here", ur: "مواد پسند کریں تاکہ وہ یہاں نظر آئیں", hi: "सामग्री पसंद करें ताकि वह यहाँ दिखे" },
    noFavOfType: { en: "No favourites", ur: "کوئی پسندیدہ نہیں", hi: "कोई पसंदीदा नहीं" },
    notFollowingAnyPoets: { en: "Not following any poets yet", ur: "ابھی تک کسی شاعر کو فالو نہیں کیا", hi: "अभी तक किसी कवि को फ़ॉलो नहीं किया" },
    followPoetsToSee: { en: "Follow poets to see them here", ur: "شاعروں کو فالو کریں تاکہ وہ یہاں نظر آئیں", hi: "कवियों को फ़ॉलो करें ताकि वे यहाँ दिखें" },

    // ── Right Sidebar ──
    // indexOfPoets: { en: "Index of Poets", ur: "شعراء کی فہرست", hi: "कवियों की सूची" },
    // topReadPoets: { en: "Top Read Poets", ur: "سب سے زیادہ پڑھے جانے والے", hi: "सर्वाधिक पढ़े जाने वाले कवि" },
    // classicalPoets: { en: "Classical Poets", ur: "کلاسیکی شعراء", hi: "शास्त्रीय कवि" },
    // womenPoets: { en: "Women Poets", ur: "خواتین شعراء", hi: "महिला कवि" },
    // youngPoets: { en: "Young Poets", ur: "نوجوان شعراء", hi: "युवा कवि" },
    // poetAudios: { en: "Poet Audios", ur: "شعراء کے آڈیو", hi: "कवियों के ऑडियो" },
    exploreMore: { en: "Explore More", ur: "مزید دریافت کریں", hi: "और खोजें" },
    exploreMoreDesc: {
        en: "Welcome to the world of Urdu poetry. Read thousands of ghazals, nazms, and couplets.",
        ur: "اردو شاعری کی دنیا میں خوش آمدید۔ ہزاروں غزلیں، نظمیں اور اشعار پڑھیں۔",
        hi: "उर्दू शायरी की दुनिया में आपका स्वागत है। हज़ारों ग़ज़लें, नज़्में और शेर पढ़ें।",
    },

    // ── EBook Detail ──
    viewFullScreen: { en: "View Full Screen", ur: "بڑے اسکرین پر دیکھیں", hi: "पूर्ण स्क्रीन पर देखें" },
    pdfNotAvailable: { en: "PDF not available.", ur: "پی ڈی ایف دستیاب نہیں ہے", hi: "पीडीएफ उपलब्ध नहीं है।" },

    // ── Video Section ──
    watchOnYoutube: { en: "Watch on YouTube", ur: "یوٹیوب پر دیکھیں", hi: "YouTube पर देखें" },
    noPreview: { en: "No Preview", ur: "کوئی پیش نظارہ نہیں", hi: "कोई प्रीव्यू नहीं" },

    // ── Sher Detail ──
    images: { en: "Images", ur: "تصاویر", hi: "तस्वीरें" },

    // ── Misc ──
    search: { en: "Search...", ur: "تلاش کریں...", hi: "खोजें..." },
    poetNotFound: { en: "Poet not found", ur: "شاعر نہیں ملا", hi: "कवि नहीं मिला" },
    failedToLoadProfile: {
        en: "Failed to load poet profile.",
        ur: "شاعر کا پروفائل لوڈ کرنے میں ناکامی۔",
        hi: "कवि प्रोफ़ाइल लोड करने में विफल।",
    },
};

// Maps specific hardcoded transliterations
const customTransliterations: Record<string, string> = {
    "آصف ایمان": "Asifemaan",
    "ایمان": "Emaan"
};

export const getTranslation = (key: string, language: Language): string => {
    // If exact match in custom transliterations exists, return it when translating to english or if requested directly
    if (language === 'en' && customTransliterations[key]) {
        return customTransliterations[key];
    }
    return translations[key]?.[language] ?? translations[key]?.en ?? customTransliterations[key] ?? key;
};
