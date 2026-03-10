import TopNavBar from "@/pages/user/poetdetail/TopNavBar";
import HeroBannerCarousel from "@/pages/user/home/HeroBannerCarousel";
import FeaturedContent from "@/pages/user/home/FeaturedContent";
import FeaturedEbooks from "@/pages/user/home/FeaturedEbooks";
import FeaturedVideo from "@/pages/user/home/FeaturedVideo";
import FeaturedAudio from "@/pages/user/home/FeaturedAudio";

const Home = () => {

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopNavBar />

            {/* Hero Banner Carousel */}
            <HeroBannerCarousel />

            {/* Featured Poetry Content */}
            <div id="featured-poetry">
                <FeaturedContent />
            </div>

            {/* E-book */}
            <div id="featured-ebooks">
                <FeaturedEbooks />
            </div>

            {/* Audio */}
            <div id="featured-audios">
                <FeaturedAudio />
            </div>

            {/* Video */}
            <div id="featured-videos">
                <FeaturedVideo />
            </div>

            {/* <Footer /> */}
        </div>
    );
};

export default Home;
