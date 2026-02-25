export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return ""; // In the browser, relative URLs work fine
    }

    // On the server
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl !== "undefined") {
        return apiUrl;
    }

    return "http://localhost:3000";
};
