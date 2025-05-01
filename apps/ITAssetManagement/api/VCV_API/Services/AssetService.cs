using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.Asset;
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

        public async Task<List<Asset>> GetAllAssetAsync()
        {
            var assets = new List<Asset>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Table_GetAssets";

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

        public async Task<string?> CreateAssetAsync(AssetCreateDto assetDto)
        {
            string? newAssetId = "";

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "Asset_CreateAsset";
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@TemplateID", assetDto.TemplateID));
                    command.Parameters.Add(new SqlParameter("@SerialNumber", (object?)assetDto.SerialNumber ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@PurchaseDate", (object?)assetDto.PurchaseDate ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@WarrantyExpiry", (object?)assetDto.WarrantyExpiry ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@StatusID", (object?)assetDto.StatusID ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@LocationID", (object?)assetDto.LocationID ?? DBNull.Value));

                    var result = await command.ExecuteReaderAsync();
                    if (await result.ReadAsync())
                    {
                        newAssetId = Convert.ToString(result["AssetTag"]);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi thêm tài sản mới: " + ex.Message, ex);
            }

            return newAssetId;
        }

        public async Task<List<(int AssetID, string AssetTag)>> CreateAssetsAsync(List<AssetCreateDto> assets)
        {
            var result = new List<(int, string)>();

            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            using (var command = connection.CreateCommand())
            {
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "Asset_CreateAssets";

                // Convert to DataTable
                var table = new DataTable();
                table.Columns.Add("TemplateID", typeof(int));
                table.Columns.Add("SerialNumber", typeof(string));
                table.Columns.Add("PurchaseDate", typeof(DateTime));
                table.Columns.Add("WarrantyExpiry", typeof(DateTime));
                table.Columns.Add("StatusID", typeof(int));
                table.Columns.Add("LocationID", typeof(int));

                foreach (var a in assets)
                {
                    table.Rows.Add(a.TemplateID, a.SerialNumber ?? (object)DBNull.Value, a.PurchaseDate ?? (object)DBNull.Value,
                                   a.WarrantyExpiry ?? (object)DBNull.Value, a.StatusID ?? (object)DBNull.Value, a.LocationID ?? (object)DBNull.Value);
                }

                var parameter = new SqlParameter
                {
                    ParameterName = "@Assets",
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "dbo.AssetCreateTableType",
                    Value = table
                };

                command.Parameters.Add(parameter);

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var id = reader.GetInt32(reader.GetOrdinal("AssetID"));
                        var tag = reader.GetString(reader.GetOrdinal("AssetTag"));
                        result.Add((id, tag));
                    }
                }
            }

            return result;
        }

        public async Task<int?> DeleteAssetsAsync(List<AssetDeleteDto> assetDeleteDtos)
        {
            if (assetDeleteDtos == null || assetDeleteDtos.Count == 0)
            {
                return 0;
            }    

            var table = new DataTable();
            table.Columns.Add("AssetTag", typeof(int));

            foreach (var id in assetDeleteDtos)
                table.Rows.Add(id);

            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "Asset_DeleteAssets";

            var parameter = new SqlParameter
            {
                ParameterName = "@AssetIDs",
                SqlDbType = SqlDbType.Structured,
                TypeName = "dbo.AssetIdTableType",
                Value = table
            };

            command.Parameters.Add(parameter);

            int result = 0;
            using (var reader = await command.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    result = reader.GetInt32(reader.GetOrdinal("DeletedCount"));
                }
            }

            return result;
        }
    }
}
