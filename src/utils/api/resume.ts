const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051";

export const getAllResumes = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/resumes`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch resumes");
    }
    return res.json();
};

export const getResumeById = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/resumes/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    });
    // Note: getResumeById isn't standard in the controller, 
    // but we can use getAllResumes and filter or update the controller if needed.
    // For now, let's assume we fetch all and find the one.
    const data = await getAllResumes();
    return data.result.find((r: any) => r._id === id);
};

export const createResume = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/resumes`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create resume");
    }
    return res.json();
};

export const updateResume = async (id: string, formData: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/resumes/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update resume");
    }
    return res.json();
};

export const deleteResume = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/resumes/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete resume");
    }
    return res.json();
};

export const getActiveResume = async () => {
    const res = await fetch(`${API_URL}/api/resumes/active`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch active resume");
    }
    return res.json();
};
