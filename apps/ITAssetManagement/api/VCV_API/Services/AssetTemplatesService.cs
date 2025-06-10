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
    }
}
