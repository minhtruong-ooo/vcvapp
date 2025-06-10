using VCV_API.Models.AssetTemplate;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetTemplates
    {
        Task<List<AssetTemplate>> GetAssetTemplateAsync();
        Task<List<AssetTemplate_Select>> GetAllAssetTemplatesAsync();
    }
}
