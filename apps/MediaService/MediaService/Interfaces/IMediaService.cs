using MediaService.Models;

namespace MediaService.Interfaces
{
    public interface IMediaService
    {
        Task<string> SaveImageAsync(IFormFile file, string folder = "uploads");
        Task<string> GeneratePdfWithQRCodes(List<QRModel> items);
        Task<string> ExportAssignmentPdfAsync(AssetAssignmentModel model);
        Task<string> ExportAssignmentsZipAsync(List<AssetAssignmentModel> dataList);
        Task<ImportAssetResult> ImportAssetsFromExcelAsync(IFormFile file);
    }
}
