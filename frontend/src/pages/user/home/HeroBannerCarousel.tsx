import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomeService } from "@/lib/api/home";

const HeroBannerCarousel = () => {
    const [bannerImages, setBannerImages] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await HomeService.getSettings();
                if (res?.data?.banners) {
                    try {
                        const parsed = JSON.parse(res.data.banners);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setBannerImages(parsed);
                        }
                    } catch (e) {
                        console.error("Failed to parse banners", e);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch banners", err);
            }
        };
        fetchBanners();
    }, []);

    const goTo = useCallback(
        (index: number) => {
            if (isTransitioning) return;
            setIsTransitioning(true);
            setCurrent(index);
            setTimeout(() => setIsTransitioning(false), 600);
        },
        [isTransitioning]
    );

    const next = useCallback(() => {
        if (bannerImages.length <= 1) return;
        goTo((current + 1) % bannerImages.length);
    }, [current, goTo, bannerImages.length]);

    const prev = useCallback(() => {
        if (bannerImages.length <= 1) return;
        goTo((current - 1 + bannerImages.length) % bannerImages.length);
    }, [current, goTo, bannerImages.length]);

    // Auto-scroll every 3.5 seconds
    useEffect(() => {
        if (bannerImages.length <= 1) return;
        const timer = setInterval(next, 3500);
        return () => clearInterval(timer);
    }, [next, bannerImages.length]);

    if (bannerImages.length === 0) {
        return null;
    }

    return (
        <section className="relative w-full overflow-hidden" id="hero-banner" dir="ltr">
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-600 ease-in-out"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                    transitionDuration: "600ms",
                }}
            >
                {bannerImages.map((src, i) => (
                    <div key={i} className="w-full flex-shrink-0">
                        <img
                            src={src}
                            alt={`Banner ${i + 1}`}
                            className="h-[280px] w-full object-cover sm:h-[360px] md:h-[440px] lg:h-[500px]"
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
            </div>

            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

            {/* Controls are only visible if there are multiple images */}
            {bannerImages.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40 sm:left-5 sm:p-3"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40 sm:right-5 sm:p-3"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {bannerImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${i === current
                                    ? "w-8 bg-white"
                                    : "w-2.5 bg-white/50 hover:bg-white/70"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default HeroBannerCarousel;
