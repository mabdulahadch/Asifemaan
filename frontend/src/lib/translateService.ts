import { Language } from "./translations";
import { transliterate } from "./transliterate";

/**
 * Transliterate dynamic text locally using character maps.
 * Replaces the old MyMemory API approach with instant local transliteration.
 */
export const translateText = async (
    text: string,
    _from: Language,
    to: Language
): Promise<string> => {
    return transliterate(text, to);
};

/**
 * Transliterate multiple texts in batch.
 */
export const translateBatch = async (
    texts: string[],
    _from: Language,
    to: Language
): Promise<string[]> => {
    return texts.map((text) => transliterate(text, to));
};
