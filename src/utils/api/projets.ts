import axios from "axios";

export const getAllProject = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }
  } catch (error) {
    console.log("error fetching the projects", error);
  }
};

export const getProjectById = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${id}`
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }
  } catch (error) {
    console.log("error fetching the project", error);
  }
};
