using VCV_API.Models.Company;

namespace VCV_API.Services.Interfaces
{
    public interface IAssetCompany
    {
        Task<List<CompanyModel>> GetCompanyAsync();
    }
}
