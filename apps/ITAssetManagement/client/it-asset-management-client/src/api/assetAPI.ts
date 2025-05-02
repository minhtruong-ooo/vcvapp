import axios from "axios";

const BASE_URL = "https://localhost:7142/api";

export const getAssets = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/Assets/GetAssets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch asset templates", error);
    throw error;
  }
};

export const GetAssetTemplates_Select = async (token: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/AssetTemplates/GetAssetTemplates_Select`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch asset templates", error);
    throw error;
  }
};

export const getLocations = async (token: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/AssetLocation/GetAllLocations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch locations", error);
    throw error;
  }
};

export const getAssetStatuses = async (token: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/AssetStatus/GetAssetStatuses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch asset statuses", error);
    throw error;
  }
};

export const createAsset = async (token: string, data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/Assets/CreateAsset`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo tài sản:", error?.response?.data.details);
    throw new Error(error?.response?.data.details);
  }
};

export const createAssets = async (token: string, data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/Assets/CreateAssets`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi tạo nhiều tài sản:",
      error?.response?.data?.details || error.message
    );
    throw new Error(error?.response?.data?.details || "Unknown error occurred");
  }
};

export const getAssetDetail = async (token: string, assetTag: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Assets/GetDetailAsset/${encodeURIComponent(assetTag)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy chi tiết tài sản:", error?.response?.data?.details || error.message);
    throw new Error(error?.response?.data?.details || "Không thể lấy chi tiết tài sản");
  }
};