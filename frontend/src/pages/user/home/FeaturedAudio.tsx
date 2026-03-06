import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Music } from "lucide-react";
import { FeaturedContent as FeaturedContentType, ContentService } from "@/lib/api/content";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedAudio = () => {
    const { t, transliterate } = useLanguage();
    const [audios, setAudios] = useState<FeaturedContentType[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await ContentService.getFeaturedContent();
                const filtered = data.filter(item => item.type === "AUDIO");
                setAudios(filtered);
            } catch (err) {
                console.error("Failed to fetch featured audios:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-rekhta-gold" />
            </div>
        );
    }

    if (audios.length === 0) return null;

    return (
        <section className="relative bg-white py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {t("featuredAudios")}
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rekhta-gold" />
                </div>

                <div className="relative group">
                    {/* Navigation Arrows */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-rekhta-border bg-white p-2 text-rekhta-muted shadow-sm transition-all hover:border-rekhta-gold hover:text-rekhta-gold opacity-0 group-hover:opacity-100"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 px-2 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {audios.map((audio) => (
                            <Link
                                key={audio.id}
                                to={`/poet/${audio.poetId}/audio`}
                                className="group flex-shrink-0 w-64 sm:w-72 snap-start flex border border-rekhta-border/50 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-rekhta-gold/40"
                            >
                                <div className="h-24 w-24 flex-shrink-0 bg-gray-100 border-r border-rekhta-border/50">
                                    {audio.coverImage ? (
                                        <img
                                            src={audio.coverImage}
                                            alt={audio.title}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-rekhta-gold/10 text-rekhta-gold">
                                            <Music className="h-10 w-10 opacity-70" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center p-4 flex-1 bg-white">
                                    <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-rekhta-gold transition-colors">
                                        {transliterate(audio.title)}
                                    </h3>
                                    <p className="text-xs text-rekhta-muted uppercase line-clamp-1">
                                        {transliterate(audio.penName || audio.realName)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-rekhta-border bg-white p-2 text-rekhta-muted shadow-sm transition-all hover:border-rekhta-gold hover:text-rekhta-gold opacity-0 group-hover:opacity-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedAudio;
