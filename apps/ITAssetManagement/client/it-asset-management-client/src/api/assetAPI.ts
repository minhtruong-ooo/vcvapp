import axios from "axios";
import { Asset } from "../interfaces/interfaces";

const BASE_URL = import.meta.env.VITE_VCV_API_URL;

// Select API

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

export const getAssetTemplates = async (token: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/AssetTemplates/GetAssetTemplates`,
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

export const getAssetTemplates_Select = async (token: string) => {
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

export const getAssetDetail = async (token: string, assetTag: string) => {
  try {
    const response = await axios.get<Asset>(
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

export const getSpecs = async (token: string, templateID: number) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/AssetSpec/GetAssetSpecsByTemplateID/${encodeURIComponent(templateID)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data; // Trả về array luôn
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy thông số kỹ thuật:", error?.response?.data?.details || error.message);
    throw new Error(error?.response?.data?.details || "Lỗi khi lấy thông số kỹ thuật");
  }
};

export const getAssetType = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/AssetTypes/GetAssetTypes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch asset type", error);
    throw error;
  }
};




// Create API 

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

export const createAssetTemplate = async (token: string, data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/AssetTemplates/CreateAssetTemplate/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
  console.log("✅ Success response:", response);
    return response.data;
    
  } catch (error: any) {
    console.error(
      error?.response?.data?.details || error.message
    );
    throw new Error(error?.response?.data?.details || "Unknown error occurred");
  }
};



// Update API

export const updateAssetTemplate = async (token: string, data: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/AssetTemplates/UpdateAssetTemplate/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật tài sản:", error?.response?.data.details);
    throw new Error(error?.response?.data.details);
  }
};


// Delete API

export const deleteAssetTemplates = async (token: string, templateIDs: number[]) => {
  try {
    const response = await axios.post(`${BASE_URL}/AssetTemplates/DeleteAssetTemplates/delete`, templateIDs, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi xoá template:", error?.response?.data?.message);
    throw new Error(error?.response?.data?.message || "Xoá thất bại");
  }
};