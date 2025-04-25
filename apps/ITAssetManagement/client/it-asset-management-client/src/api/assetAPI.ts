import axios from 'axios';

const BASE_URL = 'https://localhost:7142/api';


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
    console.error('Failed to fetch asset templates', error);
    throw error;
  }
};

export const getAssetTemplates = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/AssetTemplates/GetAssetTemplates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch asset templates', error);
    throw error;
  }
};

export const getLocations = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/Location/GetAllLocations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch locations', error);
    throw error;
  }
};

export const getAssetStatuses = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/AssetStatus/GetAssetStatuses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch asset statuses', error);
    throw error;
  }
};
