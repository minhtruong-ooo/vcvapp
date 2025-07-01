using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.AssetStatus;
using VCV_API.Models.Origin;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class OriginService : IAssetOrigin
    {

        private readonly AppDbContext _context;

        public OriginService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<OriginModel>> GetOriginAsync()
        {
            var assetOrigin = new List<OriginModel>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Select_Origin";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var origin = new OriginModel
                            {
                                OriginID = reader.GetInt32(reader.GetOrdinal("OriginID")),
                                OriginName = reader.IsDBNull(reader.GetOrdinal("OriginName")) ? string.Empty : reader.GetString(reader.GetOrdinal("OriginName")),
                            };

                            assetOrigin.Add(origin);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving asset status list: {ex.Message}", ex);
            }

            return assetOrigin;
        }
    }
}
