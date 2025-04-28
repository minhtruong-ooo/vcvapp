using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class AssetService : IAssetService
    {
        private readonly AppDbContext _context;

        public AssetService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Asset>> GetAllAssetAsync() // Return a List<Asset>
        {
            var assets = new List<Asset>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_GetAssets";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var asset = new Asset
                            {
                                AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                                AssetTag = reader.GetString(reader.GetOrdinal("AssetTag")),
                                TemplateID = reader.GetInt32(reader.GetOrdinal("TemplateID")),
                                TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                                SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                                PurchaseDate = reader.IsDBNull(reader.GetOrdinal("PurchaseDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("PurchaseDate")),
                                WarrantyExpiry = reader.IsDBNull(reader.GetOrdinal("WarrantyExpiry")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("WarrantyExpiry")),
                                StatusID = reader.IsDBNull(reader.GetOrdinal("StatusID")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("StatusID")),
                                StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
                                LocationID = reader.IsDBNull(reader.GetOrdinal("LocationID")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("LocationID")),
                                LocationName = reader.IsDBNull(reader.GetOrdinal("LocationName")) ? null : reader.GetString(reader.GetOrdinal("LocationName")),
                                AssignedTo = reader.IsDBNull(reader.GetOrdinal("AssignedTo")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("AssignedTo")),
                                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            };

                            assets.Add(asset);
                        }
                    }       
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy danh sách tài sản: {ex.Message}", ex);
            }

            return assets;
        }

    }
}
