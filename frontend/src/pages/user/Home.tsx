import TopNavBar from "@/components/TopNavBar";
import HeroBannerCarousel from "@/pages/user/home/HeroBannerCarousel";
import FeaturedContent from "@/pages/user/home/FeaturedContent";
import FeaturedEbooks from "@/pages/user/home/FeaturedEbooks";
import FeaturedVideo from "@/pages/user/home/FeaturedVideo";
import FeaturedAudio from "@/pages/user/home/FeaturedAudio";

import PoetTabNav from "./poetdetail/PoetTabNav";
import Footer from "@/components/Footer";

const Home = () => {

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* <PoetTabNav activeTab="home" /> */}
            <TopNavBar />

            {/* Hero Banner Carousel */}
            <HeroBannerCarousel />

            {/* Featured Poetry Content */}
            <FeaturedContent /> 
            
            {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-rekhta-gold/40 to-transparent" />
            </div> */}


            {/* E-book */}
            <FeaturedEbooks />

            {/* Audio */}
            <FeaturedAudio />

            {/* Video */}
            <FeaturedVideo />

      




            {/* Divider */}
           
            {/* <PoetSection/> */}

            {/* ---------- OR ---------- */}
            <Footer />
        </div>
    );
};

export default Home;
