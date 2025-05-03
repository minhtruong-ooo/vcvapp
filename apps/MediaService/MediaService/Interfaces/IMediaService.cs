namespace MediaService.Interfaces
{
    public interface IMediaService
    {
        // 1. Lưu ảnh
        Task<string> SaveImageAsync(IFormFile file, string folder = "uploads");

        //// 2. Tạo mã QR cho tài sản
        //Task<string> GenerateQrCodeAsync(string content, string folder = "qrcodes");

        // 3. Export
        //Task<byte[]> ExportAssetToExcelAsync(AssetDetailDto asset);
        //Task<byte[]> ExportAssetToPdfAsync(AssetDetailDto asset);
    }
}
