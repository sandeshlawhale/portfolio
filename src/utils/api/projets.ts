export const getAllProject = async ({ limit }: { limit?: number } = {}) => {
  try {
    const url = limit
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects?limit=${limit}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const data = await response.json();

    if (data.success && data.result) {
      return data.result;
    }
    return [];
  } catch (error) {
    console.log("error fetching the projects", error);
    return [];
  }
};

export const getProjectById = async ({ id }: { id: string }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${id}`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    if (data.success && data.result) {
      return data.result;
    }
  } catch (error) {
    console.log("error fetching the project", error);
  }
};
