using VCV_API.Models.AssetSpec;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetSpec
    {
        Task<List<AssetSpecModel>> GetAssetSpecsByTemplateID(int templateID);
    }
}
