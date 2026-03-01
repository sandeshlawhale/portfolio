export const getBaseUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl !== "undefined") {
        return apiUrl;
    }

    if (typeof window !== "undefined") {
        return ""; // Fallback for relative paths if needed
    }

    // On the server
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:5051";
};
