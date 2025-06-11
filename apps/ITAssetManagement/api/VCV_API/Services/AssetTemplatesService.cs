using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.AssetTemplate;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class AssetTemplatesService : IAssetTemplates
    {
        private readonly AppDbContext _context;

        public AssetTemplatesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AssetTemplate_Select>> GetAllAssetTemplatesAsync()
        {
            var assetTemplates = new List<AssetTemplate_Select>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Select_GetTemplates";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var assetTemplate = new AssetTemplate_Select
                            {
                                TemplateID = reader.GetInt32(reader.GetOrdinal("TemplateID")),
                                TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                            };

                            assetTemplates.Add(assetTemplate);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }

            return assetTemplates;
        }

        public async Task<List<AssetTemplate>> GetAssetTemplateAsync()
        {
            var assetTemplates = new List<AssetTemplate>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Table_GetTemplates";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var assetTemplate = new AssetTemplate
                            {
                                TemplateID = reader.GetInt32(reader.GetOrdinal("TemplateID")),
                                TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                                AssetTypeID = reader.GetInt32(reader.GetOrdinal("AssetTypeID")),
                                Model = reader.IsDBNull(reader.GetOrdinal("Model")) ? null : reader.GetString(reader.GetOrdinal("Model")),
                                Manufacturer = reader.IsDBNull(reader.GetOrdinal("Manufacturer")) ? null : reader.GetString(reader.GetOrdinal("Manufacturer")),
                                DefaultWarrantyMonths = reader.IsDBNull(reader.GetOrdinal("DefaultWarrantyMonths")) ? null : reader.GetInt32(reader.GetOrdinal("DefaultWarrantyMonths")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                Unit = reader.IsDBNull(reader.GetOrdinal("Unit")) ? null : reader.GetString(reader.GetOrdinal("Unit")),
                                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                TypeName = reader.IsDBNull(reader.GetOrdinal("TypeName")) ? null : reader.GetString(reader.GetOrdinal("TypeName"))
                            };

                            assetTemplates.Add(assetTemplate);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }

            return assetTemplates;
        }

        public async Task<bool> UpdateAssetTemplateAsync(AssetTemplateDTO dto)
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "AssetTemplate_UpdateAssetTemplate";

                    command.Parameters.Add(new SqlParameter("@TemplateID", dto.TemplateID));
                    command.Parameters.Add(new SqlParameter("@TemplateName", (object?)dto.TemplateName ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@Model", (object?)dto.Model ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@Manufacturer", (object?)dto.Manufacturer ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@DefaultWarrantyMonths", (object?)dto.DefaultWarrantyMonths ?? DBNull.Value));
                    command.Parameters.Add(new SqlParameter("@Unit", (object?)dto.Unit ?? DBNull.Value));

                    var outputParam = new SqlParameter("@IsSuccess", SqlDbType.Bit)
                    {
                        Direction = ParameterDirection.Output
                    };
                    command.Parameters.Add(outputParam);

                    await command.ExecuteNonQueryAsync();

                    return (bool)outputParam.Value;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Update failed: {ex.Message}", ex);
            }
        }

        public async Task<int> DeleteAssetTemplatesAsync(List<int> templateIDs)
        {
            if (templateIDs == null || !templateIDs.Any())
                return 0;

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "AssetTemplate_DeleteMany";
                    command.CommandType = CommandType.StoredProcedure;

                    var table = new DataTable();
                    table.Columns.Add("Value", typeof(int));
                    foreach (var id in templateIDs)
                        table.Rows.Add(id);

                    var param = new SqlParameter("@TemplateIDs", SqlDbType.Structured)
                    {
                        TypeName = "dbo.IntList",
                        Value = table
                    };

                    command.Parameters.Add(param);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return reader.GetInt32(reader.GetOrdinal("DeletedCount"));
                        }
                    }

                    return 0;
                }
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("1"))
                    throw new InvalidOperationException("Không thể xoá vì template đang được sử dụng");
                throw;
            }
        }

    }
}
