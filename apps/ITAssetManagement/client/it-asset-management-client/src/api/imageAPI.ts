// imageAPI.ts
export const fetchImage = async (token: string, imageUrl: string): Promise<Blob> => {
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
  