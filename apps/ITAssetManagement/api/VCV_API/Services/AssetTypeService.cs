using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.AssetTemplate;
using VCV_API.Models.AssetType;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class AssetTypeService : IAssetType
    {
        private readonly AppDbContext _context;

        public AssetTypeService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<AssetType>> GetAssetTypesAsync()
        {
            var assetTypes = new List<AssetType>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "AssetType_GetAssetType";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var assetType = new AssetType
                            {
                                AssetTypeID = reader.GetInt32(reader.GetOrdinal("AssetTypeID")),
                                TypeName = reader.IsDBNull(reader.GetOrdinal("TypeName")) ? null : reader.GetString(reader.GetOrdinal("TypeName")),
                            };

                            assetTypes.Add(assetType);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }

            return assetTypes;
        }
    }
}
