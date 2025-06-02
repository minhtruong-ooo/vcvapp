using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.AssetSpec;
using VCV_API.Services.Interfaces;
namespace VCV_API.Services
{
    public class AssetSpecService : IAssetSpec
    {
        private readonly AppDbContext _context;

        public AssetSpecService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<AssetSpecModel>> GetAssetSpecsByTemplateID(int templateID)
        {
            var assetSpecs = new List<AssetSpecModel>();

            try
            {
                using var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "Asset_GetSpecificationsByTemplateID";

                var param = new SqlParameter("@TemplateID", SqlDbType.Int)
                {
                    Value = templateID
                };
                command.Parameters.Add(param);

                using var reader = await command.ExecuteReaderAsync();


                while (await reader.ReadAsync())
                {
                    var assetSpecModel = new AssetSpecModel
                    {
                        SpecificationID = reader.GetInt32(reader.GetOrdinal("SpecificationID")),
                        SpecificationName = reader.IsDBNull(reader.GetOrdinal("SpecificationName")) ? null : reader.GetString(reader.GetOrdinal("SpecificationName")),
                        DataType = reader.IsDBNull(reader.GetOrdinal("DataType")) ? null : reader.GetString(reader.GetOrdinal("DataType")),
                        Unit = reader.IsDBNull(reader.GetOrdinal("Unit")) ? null : reader.GetString(reader.GetOrdinal("Unit")),
                        IsRequired = reader.IsDBNull(reader.GetOrdinal("IsRequired")) ? null : reader.GetBoolean(reader.GetOrdinal("IsRequired"))
                    };

                    assetSpecs.Add(assetSpecModel);
                }

            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }

            return assetSpecs;
        }
    }
}
