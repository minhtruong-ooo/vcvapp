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
