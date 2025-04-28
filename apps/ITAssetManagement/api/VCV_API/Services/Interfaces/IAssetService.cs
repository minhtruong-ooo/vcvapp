using VCV_API.Models.Add;
using VCV_API.Models;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetService
    {
        Task<List<Asset>> GetAllAssetAsync();
    }
}
