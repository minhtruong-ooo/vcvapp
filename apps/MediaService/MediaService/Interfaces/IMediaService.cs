using MediaService.Models;

namespace MediaService.Interfaces
{
    public interface IMediaService
    {
        Task<string> SaveImageAsync(IFormFile file, string folder = "uploads");
        Task<string> GeneratePdfWithQRCodes(List<QRModel> items);
    }
}
