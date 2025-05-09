import axios from "axios";

const BASE_URL = "https://localhost:7142/api";

export const getAssetAssignments = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/Assign/GetAssignments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch: ", error);
      throw error;
    }
  };