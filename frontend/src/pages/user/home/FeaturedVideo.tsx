import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Play } from "lucide-react";
import { FeaturedContent as FeaturedContentType, ContentService } from "@/lib/api/content";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedVideo = () => {
    const { t, transliterate } = useLanguage();
    const [videos, setVideos] = useState<FeaturedContentType[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await ContentService.getFeaturedContent();
                const filtered = data.filter(item => item.type === "VIDEO");
                setVideos(filtered);
            } catch (err) {
                console.error("Failed to fetch featured videos:", err);
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

    if (videos.length === 0) return null;

    // Helper to get YouTube thumbnail
    const getYoutubeThumb = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
        }
        return null;
    };

    return (
        <section className="relative bg-white py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {t("featuredVideos")}
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
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-2 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {videos.map((video) => {
                            const thumbUrl = video.coverImage || getYoutubeThumb(video.youtubeLink);
                            return (
                                <Link
                                    key={video.id}
                                    to={`/poet/${video.poetId}/video`}
                                    className="group flex-shrink-0 w-64 sm:w-80 snap-start flex flex-col transition-transform hover:-translate-y-1"
                                >
                                    <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl border border-rekhta-border/50 shadow-sm bg-black mb-4">
                                        {thumbUrl ? (
                                            <img
                                                src={thumbUrl}
                                                alt={video.title}
                                                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="bg-rekhta-card/50 h-full w-full flex items-center justify-center p-4 text-center">
                                                <span className="text-sm text-rekhta-muted font-serif">{transliterate(video.title)}</span>
                                            </div>
                                        )}
                                        {/* Play icon overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white transition-transform group-hover:scale-110">
                                                <Play className="h-5 w-5 fill-white ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 pr-4">
                                        {transliterate(video.title)}
                                    </h3>
                                    <p className="text-sm text-rekhta-muted mt-2 font-medium">
                                        {transliterate(video.penName || video.realName)}
                                    </p>
                                </Link>
                            );
                        })}
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

export default FeaturedVideo;
