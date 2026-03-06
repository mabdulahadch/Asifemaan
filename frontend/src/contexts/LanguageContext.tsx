import React, { createContext, useContext, useState } from "react";
import { Language, getTranslation } from "@/lib/translations";
import { transliterate as transliterateText } from "@/lib/transliterate";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    isUrdu: boolean;
    isHindi: boolean;
    t: (key: string) => string;
    /** Transliterate dynamic Urdu text (from DB) to the current language script */
    transliterate: (text: string) => string;
    dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => { },
    isUrdu: false,
    isHindi: false,
    t: (key: string) => key,
    transliterate: (text: string) => text,
    dir: "ltr",
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState<Language>("en");

    const isUrdu = language === "ur";
    const isHindi = language === "hi";
    const dir = isUrdu ? "rtl" : "ltr";

    const t = (key: string): string => getTranslation(key, language);

    const transliterate = (text: string): string =>
        transliterateText(text, language);

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage, isUrdu, isHindi, t, transliterate, dir }}
        >
            <div dir={dir}>{children}</div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

// Backward compatibility alias
export const useScript = () => {
    const ctx = useContext(LanguageContext);
    return {
        script: ctx.isUrdu ? ("urdu" as const) : ("roman" as const),
        toggleScript: () =>
            ctx.setLanguage(ctx.language === "ur" ? "en" : "ur"),
        isUrdu: ctx.isUrdu,
        t: ctx.t,
        transliterate: ctx.transliterate,
        language: ctx.language,
    };
};
