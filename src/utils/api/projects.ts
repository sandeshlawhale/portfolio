export const getAllProject = async ({ limit }: { limit?: number } = {}) => {
  try {
    const url = limit
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects?limit=${limit}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json().catch(() => null);

    if (data?.success && data?.result) {
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

    if (!response.ok) {
      console.error(`Failed to fetch project ${id}: ${response.status} ${response.statusText}`);
      return undefined;
    }

    const data = await response.json().catch(() => null);

    if (data?.success && data?.result) {
      return data.result;
    }
  } catch (error) {
    console.log("error fetching the project", error);
  }
};
