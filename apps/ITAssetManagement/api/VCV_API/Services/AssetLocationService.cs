using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.AssetLocation;
using VCV_API.Models.AssetStatus;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class AssetLocationService : IAssetLocation
    {
        private readonly AppDbContext _context;

        public AssetLocationService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<AssetLocation>> GetAssetLocationsAsync()
        {
            var assetLocation = new List<AssetLocation>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Select_Location";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var asset = new AssetLocation
                            {
                                LocationID = reader.GetInt32(reader.GetOrdinal("LocationID")),
                                LocationName = reader.IsDBNull(reader.GetOrdinal("LocationName")) ? null : reader.GetString(reader.GetOrdinal("LocationName")),
                            };

                            assetLocation.Add(asset);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving asset location list: {ex.Message}", ex);
            }

            return assetLocation;
        }
    }
}
