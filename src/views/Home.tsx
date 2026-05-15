import HeroSection from "@/components/HeroSection";
import HeroSlider from "@/components/HeroSlider";
import MessageFromChairman from "@/components/MessageFromChairman";
import MessageFromTreasurer from "@/components/MessageFromTreasurer";
import PhotoGallery from "@/components/PhotoGallery";
import RecentUpdates from "@/components/RecentUpdates";

const Home = () => {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <HeroSlider />
            <PhotoGallery />
            <RecentUpdates />
            <MessageFromChairman />
            <MessageFromTreasurer />
        </div>
    );
};

export default Home;
