using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.Company;
using VCV_API.Models.Origin;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class CompanyService : IAssetCompany
    {

        private readonly AppDbContext _context;

        public CompanyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CompanyModel>> GetCompanyAsync()
        {
            var assetCompany = new List<CompanyModel>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Select_GetCompany";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var company = new CompanyModel
                            {
                                CompanyID = reader.GetInt32(reader.GetOrdinal("CompanyID")),
                                CompanyName = reader.IsDBNull(reader.GetOrdinal("CompanyName")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyName")),
                            };

                            assetCompany.Add(company);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving asset status list: {ex.Message}", ex);
            }

            return assetCompany;
        }
    }
}
