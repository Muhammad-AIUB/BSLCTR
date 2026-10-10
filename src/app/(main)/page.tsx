import Home from "@/views/Home";

// The home page shows gallery photos from the database, so render per request.
export const dynamic = "force-dynamic";

export default function HomePage() {
    return <Home />;
}
