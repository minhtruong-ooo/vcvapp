using VCV_API.Models.Origin;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetOrigin
    {
        Task<List<OriginModel>> GetOriginAsync();
    }
}
