"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, getDeviceType } from "@/utils/api/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const startTimeRef = useRef<number>(Date.now());
    const prevPathnameRef = useRef<string>(pathname);

    const sendDuration = useCallback((path: string) => {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (duration > 0) {
            const category = getCategoryFromPath(path);
            const subCategory = getSubCategoryFromPath(path);

            // We update the view with duration or create an exit event
            // For simplicity, let's just track a "duration" event or 
            // the backend could handle updating the last view.
            // But fetch is often cancelled on unload, so we use sendBeacon if possible.
            const payload = {
                type: "view",
                category,
                subCategory,
                duration,
                metadata: { device: getDeviceType() }
            };

            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(`${API_URL}/api/analytics/track`, blob);
            } else {
                fetch(`${API_URL}/api/analytics/track`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    keepalive: true
                });
            }
        }
    }, []);

    useEffect(() => {
        // Track the initial page view or route change
        const trackPageView = () => {
            const category = getCategoryFromPath(pathname);
            const subCategory = getSubCategoryFromPath(pathname);

            trackEvent({
                type: "view",
                category,
                subCategory,
                metadata: {
                    device: getDeviceType(),
                    browser: navigator.userAgent,
                },
            });
        };

        const handleBeforeUnload = () => {
            sendDuration(prevPathnameRef.current);
        };

        trackPageView();
        startTimeRef.current = Date.now();
        prevPathnameRef.current = pathname;

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            sendDuration(prevPathnameRef.current);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [pathname, sendDuration]);

    const getCategoryFromPath = (path: string) => {
        if (path === "/") return "home";
        if (path.startsWith("/projects")) {
            const parts = path.split("/");
            if (parts.length > 2) return "individual_project";
            return "projects";
        }
        if (path === "/resume") return "resume";
        if (path === "/contact") return "contact";
        return "other";
    };

    const getSubCategoryFromPath = (path: string) => {
        if (path.startsWith("/projects/")) {
            return path.split("/")[2];
        }
        return undefined;
    };

    return null;
}
