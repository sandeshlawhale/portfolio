const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051";

export interface AnalyticsEvent {
    type: "view" | "interaction";
    category: string;
    subCategory?: string;
    event?: string;
    metadata?: {
        device?: "desktop" | "tablet" | "mobile";
        browser?: string;
        os?: string;
    };
    duration?: number;
}

export const trackEvent = async (event: AnalyticsEvent) => {
    try {
        await fetch(`${API_URL}/api/analytics/track`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        });
    } catch (error) {
        console.error("Failed to track event:", error);
    }
};

export const getAnalyticsStats = async (days = 7) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/analytics/stats?days=${days}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch analytics stats");
    }
    return res.json();
};

export const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
};
