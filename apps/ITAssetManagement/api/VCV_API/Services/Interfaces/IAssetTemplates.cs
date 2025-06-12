using VCV_API.Models.AssetTemplate;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetTemplates
    {
        Task<List<AssetTemplate>> GetAssetTemplateAsync();
        Task<List<AssetTemplate_Select>> GetAllAssetTemplatesAsync();
        Task<int> CreateAssetTemplateAsync(AssetTemplateDTO dto);
        Task<bool> UpdateAssetTemplateAsync(AssetTemplateDTO dto);
        Task<int> DeleteAssetTemplatesAsync(List<int> templateIDs);
    }
}
