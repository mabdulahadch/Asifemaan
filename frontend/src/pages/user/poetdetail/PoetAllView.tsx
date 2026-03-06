import { useOutletContext } from "react-router-dom";
import GhazalSection from "../sections/GhazalSection";
import SherSection from "../sections/SherSection";
import NazmSection from "../sections/NazmSection";
import EBookSection from "../sections/EBookSection";
import AudioSection from "../sections/AudioSection";
import VideoSection from "../sections/VideoSection";
import { Poet } from "@/lib/api/poets";

const PoetAllView = () => {
    const { poet } = useOutletContext<{ poet: Poet }>();

    if (!poet) return null;

    return (
        <div className="space-y-10">

             {/* <div className="rounded-lg border border-rekhta-border bg-rekhta-card/20 p-6"> */}
            <h2 className="text-lg font-semibold text-rekhta-gold">
                {"About"}
            </h2>
            <p className={`leading-relaxed text-rekhta-light/80`}>
                {poet.bio}
            </p>
        {/* </div> */}
            <GhazalSection poetId={poet.id} limit={3} />   {/* onSelectGhazal={(id) => navigate(`/poet/${poet.id}/ghazal/${id}`)}  */}
            <SherSection poetId={poet.id} limit={3} />
            <NazmSection poetId={poet.id} limit={3} />
            <EBookSection poetId={poet.id} limit={3} />
            <AudioSection poetId={poet.id} limit={3} />
            <VideoSection poetId={poet.id} limit={3} />
        </div>
    );
};

export default PoetAllView;
