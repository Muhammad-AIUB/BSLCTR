import PhotoGallery from "@/components/PhotoGallery";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PhotoGalleryPage() {
    return (
        <div>
            <div className="px-6 pt-6">
                <Link href="/gallery" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back to Gallery
                </Link>
            </div>
            <PhotoGallery />
        </div>
    );
}
