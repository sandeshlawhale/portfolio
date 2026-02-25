export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return ""; // In the browser, relative URLs work fine
    }

    // On the server
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};
