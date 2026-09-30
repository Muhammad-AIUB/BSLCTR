import { redirect } from "next/navigation";
import { adminFromCookies } from "@/lib/admin-auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export const metadata = { title: "Dashboard | BSLCTR" };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const email = await adminFromCookies();
    if (!email) redirect("/");

    return (
        <div className="flex min-h-svh flex-col bg-wash md:flex-row">
            <DashboardSidebar email={email} />
            <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
        </div>
    );
}
