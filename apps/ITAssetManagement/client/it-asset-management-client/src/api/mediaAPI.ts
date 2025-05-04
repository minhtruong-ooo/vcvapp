import { QRModel } from "../interfaces/QRCode";

const API_URL = import.meta.env.VITE_MEDIA_API_URL;

export const fetchImage = async (
  token: string,
  imageUrl: string
): Promise<Blob> => {
  const response = await fetch(imageUrl, {
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
