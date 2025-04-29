using VCV_API.Models.AssetLocation;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetLocation
    {
        Task<List<AssetLocation>> GetAssetLocationsAsync();
    }
}
