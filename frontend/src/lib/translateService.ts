import { Language } from "./translations";

// In-memory cache for translated texts
const translationCache: Record<string, string> = {};

const langCodeMap: Record<Language, string> = {
    en: "en",
    ur: "ur",
    hi: "hi",
};

/**
 * Translate dynamic text using MyMemory API.
 * Falls back to original text on failure.
 * Caches results to reduce API calls.
 */
export const translateText = async (
    text: string,
    from: Language,
    to: Language
): Promise<string> => {
    if (from === to || !text.trim()) return text;

    const cacheKey = `${from}:${to}:${text}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        const fromCode = langCodeMap[from] || "en";
        const toCode = langCodeMap[to] || "en";
        const encodedText = encodeURIComponent(text);

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${fromCode}|${toCode}`
        );

        if (!response.ok) {
            return text;
        }

        const data = await response.json();
        const translated = data?.responseData?.translatedText;

        if (translated && translated !== text) {
            translationCache[cacheKey] = translated;
            return translated;
        }

        return text;
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
};

/**
 * Translate multiple texts in batch (sequential to respect rate limits).
 */
export const translateBatch = async (
    texts: string[],
    from: Language,
    to: Language
): Promise<string[]> => {
    const results: string[] = [];
    for (const text of texts) {
        results.push(await translateText(text, from, to));
    }
    return results;
};
