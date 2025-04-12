import axios from 'axios';

const API_URL = 'https://localhost:7142/api/Assets';

export const getAssets = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/GetAssets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,  // Thêm timeout để tránh yêu cầu bị treo quá lâu
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch assets", error);
    throw error;
  }
};
