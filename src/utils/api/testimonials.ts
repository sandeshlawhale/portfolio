import { getBaseUrl } from "./baseUrl";

const API_URL = getBaseUrl();

export const getAllTestimonialsAdmin = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/testimonials`, {
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to fetch testimonials");
    }
    return res.json();
};

export const updateTestimonialStatus = async (id: string, updates: { isActive?: boolean; isFeatured?: boolean }) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update testimonial");
    }
    return res.json();
};

export const deleteTestimonial = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete testimonial");
    }
    return res.json();
};
