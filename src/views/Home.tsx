import ConferenceHero from "@/components/ConferenceHero";
import MessageFromChairman from "@/components/MessageFromChairman";
import MessageFromTreasurer from "@/components/MessageFromTreasurer";
import PhotoGallery from "@/components/PhotoGallery";
import RecentUpdates from "@/components/RecentUpdates";
import { Section } from "@/components/ui/section";
import { getGalleryPhotos } from "@/lib/photos";

const Home = async () => {
    // The latest photos from the dashboard's Gallery tab; the section is left
    // out until there are some (or when they cannot be loaded), rather than
    // filled with sample content.
    const photos = (await getGalleryPhotos(8)) ?? [];

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

            {photos.length > 0 && (
                <Section
                    watermark="Moments"
                    eyebrow="Gallery"
                    title="Relive the best moments"
                    className="bg-wash/60"
                >
                    <PhotoGallery photos={photos} />
                </Section>
            )}

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
