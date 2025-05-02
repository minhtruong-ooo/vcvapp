using System.Collections.Generic;
using VCV_API.Models.Asset;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetService
    {
        Task<List<Asset>> GetAllAssetAsync();
        Task<AssetDetailDto?> GetAssetDetailByTagAsync(string assetTag);
        Task<string?> CreateAssetAsync(AssetCreateDto assetDto);
        Task<List<(int AssetID, string AssetTag)>> CreateAssetsAsync(List<AssetCreateDto> assets);
        Task<int?> DeleteAssetsAsync(List<AssetDeleteDto> assetDeleteDtos);
    }
}
