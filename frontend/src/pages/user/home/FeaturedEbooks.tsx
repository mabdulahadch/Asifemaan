import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { FeaturedContent as FeaturedContentType, ContentService } from "@/lib/api/content";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedEbooks = () => {
    const { t, isUrdu } = useLanguage();
    const [ebooks, setEbooks] = useState<FeaturedContentType[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await ContentService.getFeaturedContent();
                const filtered = data.filter(item => item.type === "EBOOK");
                setEbooks(filtered);
            } catch (err) {
                console.error("Failed to fetch featured ebooks:", err);
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

    if (ebooks.length === 0) return null;

    return (
        <section className="relative bg-white py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {t("featuredEbooks")}
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
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-2 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {ebooks.map((book) => (
                            <Link
                                key={book.id}
                                to={`/poet/${book.poetId}/ebook/${book.id}`}
                                className="group flex-shrink-0 w-44 sm:w-52 snap-start flex flex-col transition-transform hover:-translate-y-1"
                            >
                                <div className="h-64 sm:h-72 w-full overflow-hidden rounded-md border border-rekhta-border/50 shadow-sm bg-gray-100 mb-3">
                                    {book.coverImage ? (
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="bg-rekhta-card/50 h-full w-full flex items-center justify-center p-4 text-center">
                                            <span className="text-sm text-rekhta-muted font-serif">{book.title}</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-rekhta-muted mt-1 uppercase line-clamp-1">
                                    {book.penName || book.realName}
                                </p>
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

export default FeaturedEbooks;
