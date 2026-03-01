import Navbar from "@/components/navbar/navbar";
import BottomNavbar from "@/components/navbar/bottom-navbar";
import FooterOverlay from "@/components/ui/footer-overlay";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen h-screen flex">
            <Navbar />
            <main className="w-full flex flex-col items-center h-screen overflow-y-auto scrollbar">
                {children}
            </main>
            <BottomNavbar />
            <FooterOverlay />
        </div>
    );
}
