using VCV_API.Models.AssetStatus;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetStatus
    {
        Task<List<AssetStatus>> GetAssetStatusesAsync();
    }
}
