import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { FeaturedContent as FeaturedContentType, ContentService } from "@/lib/api/content";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedContent = () => {
    const { t, isUrdu } = useLanguage();
    const [items, setItems] = useState<FeaturedContentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await ContentService.getFeaturedContent();
                setItems(data);
            } catch (err) {
                console.error("Failed to fetch featured content:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const next = useCallback(() => {
        if (items.length === 0) return;
        setCurrent((c) => (c + 1) % items.length);
    }, [items.length]);

    const prev = useCallback(() => {
        if (items.length === 0) return;
        setCurrent((c) => (c - 1 + items.length) % items.length);
    }, [items.length]);

    // Auto-scroll every 4 seconds
    // useEffect(() => {
    //     if (items.length <= 1) return;
    //     const timer = setInterval(next, 4000);
    //     return () => clearInterval(timer);
    // }, [next, items.length]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-rekhta-gold" />
            </div>
        );
    }

    if (items.length === 0) return null;

    const item = items[current];
    const poetName = item.penName || item.realName;
    const contentRoute = item.type === "SHER" ? "sher" : item.type === "GHAZAL" ? "ghazal" : item.type === "NAZM" ? "nazm" : "ghazal";

    return (
        <section className="relative bg-gradient-to-b from-white to-gray-50 py-10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {t("featuredPoetry")}
                    </h2>
                     <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rekhta-gold" />
                </div>

                {/* Carousel Content */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    {items.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full border border-rekhta-border bg-white p-2 text-rekhta-muted shadow-sm transition-all hover:border-rekhta-gold hover:text-rekhta-gold sm:-left-6"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full border border-rekhta-border bg-white p-2 text-rekhta-muted shadow-sm transition-all hover:border-rekhta-gold hover:text-rekhta-gold sm:-right-6"
                                aria-label="Next"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Card */}
                    <Link
                        to={`/poet/${item.poetId}/${contentRoute}/${item.id}`}
                        className="block rounded-xl border border-rekhta-border bg-white px-8 py-8 text-center shadow-sm transition-all hover:border-rekhta-gold/40 hover:shadow-md sm:px-16 sm:py-10"
                    >
                        {/* Content Text */}
                        <div className="mb-6">
                            <p
                                className={`leading-loose text-foreground ${isUrdu
                                        ? "font-nastaliq text-xl sm:text-2xl"
                                        : "text-lg italic sm:text-xl"
                                    }`}
                            >
                                {item.title}
                            </p>

                            {item.textContent && (
                                <p
                                    className={`mt-4 leading-relaxed text-rekhta-muted ${isUrdu
                                            ? "font-nastaliq text-lg"
                                            : "text-base italic"
                                        }`}
                                >
                                    {item.textContent.length > 200
                                        ? item.textContent.substring(0, 200) + "..."
                                        : item.textContent}
                                </p>
                            )}
                        </div>

                        {/* Poet Name */}
                        <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {poetName}
                        </p>

                        {/* Type Badge */}
                        <span className="mt-3 inline-block rounded-full bg-rekhta-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-rekhta-gold">
                            {t(contentRoute)}
                        </span>
                    </Link>

                    {/* Dot Indicators */}
                    {items.length > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {items.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === current
                                            ? "w-6 bg-rekhta-gold"
                                            : "w-2 bg-rekhta-border hover:bg-rekhta-muted"
                                        }`}
                                    aria-label={`Go to item ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedContent;
