export const formatAssetData = (data: any[]) => {
  return data.map((item, index) => ({
    key: index.toString(),
    assetTag: item.assetTag,
    serialNumber: item.serialNumber?.replace(/\r?\n|\r/g, ""), // Loại bỏ ký tự xuống dòng
    purchaseDate: item.purchaseDate,
    warrantyExpiry: item.warrantyExpiry,
    status: item.status?.statusName || "Unknown",
    locationName: item.location?.locationName || "Unknown", // Trích xuất locationName từ đối tượng location
  }));
};

export const formatDate = (input: string | Date): string => {
  const date = new Date(input);
  if (isNaN(date.getTime())) return ""; // trả về rỗng nếu không phải ngày hợp lệ

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};
