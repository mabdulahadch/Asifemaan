import { Language } from "./translations";

// ── Urdu → Hindi (Devanagari) character map ──
const urduToHindiMap: Record<string, string> = {
    // Vowels & Alef
    'ا': 'अ', 'آ': 'आ', 'اَ': 'अ', 'اِ': 'इ', 'اُ': 'उ',
    // Consonants
    'ب': 'ब', 'پ': 'प', 'ت': 'त', 'ٹ': 'ट', 'ث': 'स',
    'ج': 'ज', 'چ': 'च', 'ح': 'ह', 'خ': 'ख़',
    'د': 'द', 'ڈ': 'ड', 'ذ': 'ज़', 'ر': 'र', 'ڑ': 'ड़',
    'ز': 'ज़', 'ژ': 'झ', 'س': 'स', 'ش': 'श',
    'ص': 'स', 'ض': 'ज़', 'ط': 'त', 'ظ': 'ज़',
    'ع': 'अ', 'غ': 'ग़', 'ف': 'फ़', 'ق': 'क़',
    'ک': 'क', 'گ': 'ग', 'ل': 'ल', 'م': 'म',
    'ن': 'न', 'ں': 'ं', 'و': 'व', 'ہ': 'ह', 'ھ': 'ह',
    'ی': 'य', 'ے': 'े', 'ئ': 'य',
    // Diacritics (Harakaat)
    'َ': 'ा', 'ِ': 'ि', 'ُ': 'ु', 'ّ': '', 'ْ': '',
    'ً': 'ाँ', 'ٍ': 'ें', 'ٌ': 'ुं',
    // Punctuation
    '۔': '।', '،': ',', '؟': '?',
};

// ── Urdu → Roman character map ──
const urduToRomanMap: Record<string, string> = {
    'ا': 'a', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't',
    'ٹ': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h',
    'خ': 'kh', 'د': 'd', 'ڈ': 'd', 'ذ': 'z', 'ر': 'r',
    'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'گ': 'g',
    'ل': 'l', 'م': 'm', 'ن': 'n', 'ں': 'n', 'و': 'w',
    'ہ': 'h', 'ھ': 'h', 'ی': 'y', 'ے': 'e', 'ئ': 'y',
    'َ': 'a', 'ِ': 'i', 'ُ': 'u', 'ّ': '', 'ْ': '',
    '۔': '.', '،': ',', '؟': '?',
};

// ── Urdu → Roman common word exceptions ──
const romanExceptions: Record<string, string> = {
    'میں': 'mein', 'ہیں': 'hain', 'ہے': 'hai', 'کی': 'ki', 'کے': 'ke',
    'کو': 'ko', 'تو': 'to', 'ہو': 'ho', 'جو': 'jo', 'وہ': 'woh',
    'یہ': 'yeh', 'سے': 'se', 'اور': 'aur', 'ہم': 'hum', 'تم': 'tum',
    'اس': 'uss', 'ان': 'unn', 'پر': 'par', 'تھا': 'tha', 'تھی': 'thi',
    'تھے': 'thay', 'کر': 'kar', 'کا': 'ka', 'ہوئے': 'hue', 'جسے': 'jise',
    'اسے': 'use', 'تجھے': 'tujhe', 'مجھے': 'mujhe', 'تیرے': 'tere', 'میرے': 'mere',
    'کہ': 'keh', 'کچھ': 'kuch', 'بھی': 'bhi', 'ہی': 'hi', 'نہیں': 'nahi',
    'کیا': 'kya', 'کیوں': 'kyun', 'کہاں': 'kahan', 'یہاں': 'yahan', 'وہاں': 'wahan',
    'آج': 'aaj', 'کل': 'kal', 'اب': 'ab', 'جب': 'jab', 'تب': 'tab',
    'سب': 'sab', 'دل': 'dil', 'جان': 'jaan', 'عشق': 'ishq', 'محبت': 'mohabbat',
    'زمین': 'zameen', 'آسمان': 'aasman', 'دھوپ': 'dhoop',
};

// ── Roman → Urdu character map ──
const romanToUrduMap: Record<string, string> = {
    'sh': 'ش', 'ch': 'چ', 'kh': 'خ', 'gh': 'غ', 'ph': 'پھ', 'th': 'تھ', 'dh': 'دھ', 'zh': 'ژ', 'aa': 'آ', 'ee': 'ی', 'oo': 'و',
    'a': 'ا', 'b': 'ب', 'c': 'ک', 'd': 'د', 'e': 'ی',
    'f': 'ف', 'g': 'گ', 'h': 'ہ', 'i': 'ی', 'j': 'ج',
    'k': 'ک', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و',
    'p': 'پ', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
    'u': 'و', 'v': 'و', 'w': 'و', 'x': 'کس', 'y': 'ی', 'z': 'ز'
};

// ── Roman → Hindi character map ──
const romanToHindiMap: Record<string, string> = {
    'sh': 'श', 'ch': 'च', 'kh': 'ख़', 'gh': 'ग़', 'ph': 'फ', 'th': 'थ', 'dh': 'ध', 'zh': 'झ', 'aa': 'आ', 'ee': 'ई', 'oo': 'ऊ',
    'a': 'अ', 'b': 'ब', 'c': 'क', 'd': 'द', 'e': 'ए',
    'f': 'फ़', 'g': 'ग', 'h': 'ह', 'i': 'इ', 'j': 'ज',
    'k': 'क', 'l': 'ल', 'm': 'म', 'n': 'न', 'o': 'ओ',
    'p': 'प', 'q': 'क़', 'r': 'र', 's': 'स', 't': 'त',
    'u': 'उ', 'v': 'व', 'w': 'व', 'x': 'क्स', 'y': 'य', 'z': 'ज़'
};

/**
 * Walk the string and replace each character using the given map.
 * Multi-char sequences (like 'آ' which is alef + madda) are checked first
 * by trying 2-char lookahead before falling back to single chars.
 */
function transliterateWithMap(
    text: string,
    map: Record<string, string>
): string {
    let result = "";
    let i = 0;

    while (i < text.length) {
        // Try 2-char match first (for composed characters)
        if (i + 1 < text.length) {
            const twoChar = text[i] + text[i + 1];
            if (map[twoChar] !== undefined) {
                result += map[twoChar];
                i += 2;
                continue;
            }
        }

        // Single char match
        const ch = text[i];
        if (map[ch] !== undefined) {
            result += map[ch];
        } else {
            // Keep the character as-is (spaces, numbers, latin chars, etc.)
            result += ch;
        }
        i++;
    }

    return result;
}

/** Transliterate Urdu text to Hindi (Devanagari) */
export function urduToHindi(text: string): string {
    let processedText = text.replace(/آ/g, 'آ').replace(/ئ/g, 'ئ').replace(/ىٔ/g, 'ئ');
    return transliterateWithMap(processedText, urduToHindiMap);
}

/** Transliterate Urdu text to Roman Urdu */
export function urduToRoman(text: string): string {
    // Normalize separate diacritics to composed forms
    let processedText = text.replace(/آ/g, 'آ').replace(/ئ/g, 'ئ').replace(/ىٔ/g, 'ئ');

    // Tokenize by words to handle common exceptions (keeping delimiters)
    const regex = /([\u0600-\u06FF]+)/g;

    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(processedText)) !== null) {
        // Append text between matches (whitespace, punctuation, english letters)
        result += processedText.substring(lastIndex, match.index);
        lastIndex = regex.lastIndex;

        let word = match[1];

        // 1. Check for whole word exceptions
        if (romanExceptions[word]) {
            result += romanExceptions[word];
        } else {
            // 2. Apply common suffix rules
            let suffix = "";
            if (word.endsWith('وں')) {
                word = word.slice(0, -2);
                suffix = "on";
            } else if (word.endsWith('یں')) {
                word = word.slice(0, -2);
                suffix = "ein";
            } else if (word.endsWith('ئے')) {
                word = word.slice(0, -2);
                suffix = "ye";
            } else if (word.endsWith('ئی')) {
                word = word.slice(0, -2);
                suffix = "i";
            } else if (word.endsWith('یا')) {
                word = word.slice(0, -2);
                suffix = "ya";
            }

            // 3. Map remaining characters
            result += transliterateWithMap(word, urduToRomanMap) + suffix;
        }
    }
    // Append remaining text
    result += processedText.substring(lastIndex);

    return result;
}

/** Transliterate Roman text to Urdu */
export function romanToUrdu(text: string): string {
    return transliterateWithMap(text.toLowerCase(), romanToUrduMap);
}

/** Transliterate Roman text to Hindi */
export function romanToHindi(text: string): string {
    return transliterateWithMap(text.toLowerCase(), romanToHindiMap);
}

function isRoman(text: string): boolean {
    const hasLatin = /[a-zA-Z]/.test(text);
    const hasUrduOrHindi = /[\u0600-\u06FF\u0900-\u097F]/.test(text);
    return hasLatin && !hasUrduOrHindi;
}

/**
 * Transliterate dynamic text to the target language script.
 * Handles both Urdu->Hindi/Roman and Roman->Urdu/Hindi
 */
export function transliterate(text: string, targetLang: Language): string {
    if (!text) return text;

    if (targetLang === "en") {
        const exactMatch = text.trim();
        if (exactMatch === "آصف ایمان") return "Asifemaan";
        if (exactMatch === "ایمان") return "Emaan";
    }

    if (isRoman(text)) {
        if (targetLang === "en") return text;
        if (targetLang === "ur") return romanToUrdu(text);
        if (targetLang === "hi") return romanToHindi(text);
    }

    if (targetLang === "ur") return text;
    if (targetLang === "hi") return urduToHindi(text);
    return urduToRoman(text); // "en"
}
