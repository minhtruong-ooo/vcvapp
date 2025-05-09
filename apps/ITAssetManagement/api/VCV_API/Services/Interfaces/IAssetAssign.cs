using VCV_API.Models.Asset;
using VCV_API.Models.AssetAssignment;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetAssign
    {
        Task<List<AssetAssignmentModel>> GetAssetAssignments();
    }
}
