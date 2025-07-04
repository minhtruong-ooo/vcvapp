using System.Collections.Generic;
using VCV_API.Models.Asset;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetService
    {
        Task<List<Asset>> GetAllAssetAsync();
        Task<List<Asset>> GetUnusedAssetsAsync();
        Task<AssetDetailDto?> GetAssetDetailByTagAsync(string assetTag);
        Task<string?> CreateAssetAsync(AssetCreateDto assetDto);
        Task<List<(int AssetID, string AssetTag)>> CreateAssetsAsync(List<AssetCreateDto> assets);
        Task<DeleteAssetsResult> DeleteAssetsAsync(List<AssetDeleteDto> assetDeleteDtos);
    }
}
