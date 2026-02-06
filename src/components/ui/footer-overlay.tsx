"use client";

import { usePathname } from "next/navigation";

const FooterOverlay = () => {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <div
            className="absolute bottom-0 left-0 right-0 h-20
             bg-black/40 backdrop-blur-xl pointer-events-none"
            style={{
                maskImage: "linear-gradient(to bottom, transparent, black)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
            }}
        />
    );
};

export default FooterOverlay;
