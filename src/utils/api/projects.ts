const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllProjects = async (options: { limit?: number; draft?: boolean } = {}) => {
  const { limit, draft } = options;
  const params = new URLSearchParams();
  if (limit !== undefined) params.append("limit", limit.toString());
  if (draft !== undefined) params.append("draft", draft.toString());

  const res = await fetch(`${API_URL}/api/projects?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
};

export const getProjectById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/projects/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }
  const data = await res.json();
  return data.result;
};

export const createProject = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create project");
  }
  return res.json();
};

export const updateProject = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update project");
  }
  return res.json();
};

export const deleteProject = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete project");
  }
  return res.json();
};
