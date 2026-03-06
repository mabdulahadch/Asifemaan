import { useOutletContext } from "react-router-dom";
import GhazalSection from "../sections/GhazalSection";
import SherSection from "../sections/SherSection";
import NazmSection from "../sections/NazmSection";
import EBookSection from "../sections/EBookSection";
import AudioSection from "../sections/AudioSection";
import VideoSection from "../sections/VideoSection";
import { Poet } from "@/lib/api/poets";
import { useLanguage } from "@/contexts/LanguageContext";

const PoetAllView = () => {
    const { poet } = useOutletContext<{ poet: Poet }>();
    const { t, transliterate } = useLanguage();

    if (!poet) return null;

    return (
        <div className="space-y-10">

            <h2 className="text-lg font-semibold text-rekhta-gold">
                {t("about")}
            </h2>
            <p className={`leading-relaxed text-rekhta-light/80`}>
                {transliterate(poet.bio)}
            </p>
            <GhazalSection poetId={poet.id} limit={3} />
            <SherSection poetId={poet.id} limit={3} />
            <NazmSection poetId={poet.id} limit={3} />
            <EBookSection poetId={poet.id} limit={3} />
            <AudioSection poetId={poet.id} limit={3} />
            <VideoSection poetId={poet.id} limit={3} />
        </div>
    );
};

export default PoetAllView;
