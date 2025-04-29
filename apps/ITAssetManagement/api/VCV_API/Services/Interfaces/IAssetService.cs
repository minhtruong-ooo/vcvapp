using VCV_API.Models.Asset;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetService
    {
        Task<List<Asset>> GetAllAssetAsync();
        Task<string?> CreateAssetAsync(AssetCreateDto assetDto);
        Task<List<(int AssetID, string AssetTag)>> CreateAssetsAsync(List<AssetCreateDto> assets);
    }
}
