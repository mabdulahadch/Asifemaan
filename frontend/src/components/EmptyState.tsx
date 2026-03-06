import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyStateProps {
    /** Translation key to look up in translations.ts */
    translationKey?: string;
    /** Fallback: plain English message (used if no translationKey) */
    messageEn?: string;
    messageUr?: string;
}

const EmptyState = ({
    translationKey,
    messageEn = "No content available.",
    messageUr = "کوئی مواد دستیاب نہیں ہے"
}: EmptyStateProps) => {
    const { t, isUrdu } = useLanguage();

    const message = translationKey
        ? t(translationKey)
        : isUrdu ? messageUr : messageEn;

    return (
        <p className="text-rekhta-muted text-sm italic py-4">
            {message}
        </p>
    );
};

export default EmptyState;
