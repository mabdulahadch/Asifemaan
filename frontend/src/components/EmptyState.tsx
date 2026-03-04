import { useScript } from "@/contexts/ScriptContext";

interface EmptyStateProps {
    messageEn?: string;
    messageUr?: string;
}

const EmptyState = ({
    messageEn = "No content available.",
    messageUr = "کوئی مواد دستیاب نہیں ہے"
}: EmptyStateProps) => {
    const { isUrdu } = useScript();

    return (
        <p className="text-rekhta-muted text-sm italic py-4">
            {isUrdu ? messageUr : messageEn}
        </p>
    );
};

export default EmptyState;
