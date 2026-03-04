import { useOutletContext } from "react-router-dom";
import { Poet } from "@/lib/api/poets";
import { useScript } from "@/contexts/ScriptContext";

const PoetAboutView = () => {
    const { poet } = useOutletContext<{ poet: Poet }>();
    const { isUrdu } = useScript();

    if (!poet) return null;

    return (
        <div className="rounded-lg border border-rekhta-border bg-rekhta-card/20 p-6">
            <h2 className="mb-3 text-lg font-semibold text-rekhta-gold">
                {isUrdu ? "تعارف" : "About"}
            </h2>
            <p className={`leading-relaxed text-rekhta-light/80 ${isUrdu ? "font-nastaliq text-lg" : ""}`}>
                {poet.bio}
            </p>
        </div>
    );
};

export default PoetAboutView;
