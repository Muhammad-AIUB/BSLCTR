import PhotoGallery from "@/components/PhotoGallery";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const photos = [
    {
        id: 1,
        src: "/80.jpeg",
        alt: "BSLCTR surgical team in the operating theatre",
        title: "Surgical Team in the Operating Theatre",
        date: "",
        location: "",
        attendees: "",
        category: "Surgery",
    },
];

export default function PhotoGalleryPage() {
    return (
        <div>
            <div className="px-6 pt-6">
                <Link href="/gallery" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm py-2 -my-2 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back to Gallery
                </Link>
            </div>
            <PhotoGallery photos={photos} />
        </div>
    );
}
