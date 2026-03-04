import TopNavBar from "@/components/TopNavBar";
import HeroBannerCarousel from "@/pages/user/home/HeroBannerCarousel";
import FeaturedContent from "@/pages/user/home/FeaturedContent";

import PoetSection from "./home/PoetSection";

const Home = () => {

    return (
        <div className="min-h-screen bg-background">
            <TopNavBar />

            {/* Hero Banner Carousel */}
            <HeroBannerCarousel />

            {/* Featured Poetry Content */}
            <FeaturedContent />
            {/* Audio */}
            <FeaturedContent />  
            {/* E-book */}

            <FeaturedContent />
            {/* video */}

            <FeaturedContent />

           
            {/* Divider */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-rekhta-gold/40 to-transparent" />
            </div>
            
             {/* <PoetSection/> */}

            {/* ---------- OR ---------- */}

        </div>
    );
};

export default Home;
