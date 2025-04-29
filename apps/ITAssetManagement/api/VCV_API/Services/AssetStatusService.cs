using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.AssetStatus;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class AssetStatusService : IAssetStatus
    {
        private readonly AppDbContext _context;

        public AssetStatusService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<AssetStatus>> GetAssetStatusesAsync()
        {
            var assetStatus = new List<AssetStatus>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Select_GetStatus";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var asset = new AssetStatus
                            {
                                StatusID = reader.GetInt32(reader.GetOrdinal("StatusID")),
                                StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
                            };

                            assetStatus.Add(asset);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving asset status list: {ex.Message}", ex);
            }

            return assetStatus;
        }
    }
}
