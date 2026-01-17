const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051";

export const getAllWorks = async () => {
    const res = await fetch(`${API_URL}/api/works`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch works");
    }
    return res.json();
};

export const getWorkById = async (id: string) => {
    const res = await fetch(`${API_URL}/api/works/${id}`, { cache: "no-store" });
    if (!res.ok) {
        return null;
    }
    const data = await res.json();
    return data.result;
};

export const createWork = async (workData: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/works`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: workData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create work");
    }
    return res.json();
};

export const updateWork = async (id: string, workData: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/works/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: workData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update work");
    }
    return res.json();
};

export const deleteWork = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete work");
    }
    return res.json();
};
