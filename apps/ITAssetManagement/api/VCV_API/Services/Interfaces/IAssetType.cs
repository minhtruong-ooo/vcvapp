using VCV_API.Models.AssetType;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetType
    {
        Task<List<AssetType>> GetAssetTypesAsync();
    }
}
