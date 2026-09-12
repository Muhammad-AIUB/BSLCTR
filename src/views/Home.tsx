import ConferenceHero from "@/components/ConferenceHero";
import MessageFromChairman from "@/components/MessageFromChairman";
import MessageFromTreasurer from "@/components/MessageFromTreasurer";
import PhotoGallery from "@/components/PhotoGallery";
import RecentUpdates from "@/components/RecentUpdates";
import { Section } from "@/components/ui/section";

const Home = () => {
    return (
        <div className="flex flex-col">
            <ConferenceHero />

            <Section
                watermark="Chairman"
                eyebrow="Welcome"
                title="Message from the Chairman"
            >
                <MessageFromChairman />
            </Section>

            <Section
                watermark="Moments"
                eyebrow="Gallery"
                title="Relive the best moments"
                className="bg-wash/60"
            >
                <PhotoGallery />
            </Section>

            <Section watermark="Updates" eyebrow="News" title="Recent updates">
                <RecentUpdates />
            </Section>

            <Section
                watermark="Treasurer"
                eyebrow="Finance"
                title="Message from the Treasurer"
            >
                <MessageFromTreasurer />
            </Section>
        </div>
    );
};

export default Home;
