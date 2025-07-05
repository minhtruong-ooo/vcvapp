import { QRModel } from "../interfaces/QRCode";
import { AssetAssignmentPrintModel } from "../interfaces/interfaces";

const API_URL = import.meta.env.VITE_MEDIA_API_URL;

export const fetchImage = async (
  token: string,
  imageUrl: string
): Promise<Blob> => {

  // Nếu imageUrl không bắt đầu bằng http, gắn thêm domain
  const url = imageUrl.startsWith("http")
    ? imageUrl
    : `${API_URL}${imageUrl}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }

  return response.blob();
};


export const generateQrPdfUrl = async (
  token: string,
  qrModels: QRModel[]
): Promise<string> => {
  const response = await fetch(`${API_URL}/api/Media/generate-qrs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(qrModels),
  });

  if (!response.ok) {
    throw new Error("Failed to generate QR PDF");
  }

  const data = await response.json(); // 👈 Parse JSON
  return `${API_URL}${data.url}`; // 👈 Ghép thành URL đầy đủ
};

export const generateAssignmentPdfUrl = async (
  token: string,
  assignmentModels: AssetAssignmentPrintModel
): Promise<string> => {
  const response = await fetch(`${API_URL}/api/Media/assignment/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(assignmentModels),
  });

  if (!response.ok) {
    throw new Error("Failed to generate QR PDF");
  }

  const data = await response.json();
  return data.url;
};

export const importAssetsFromExcel = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/Media/ImportAssets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to import assets");
  }

  return await response.json();
};