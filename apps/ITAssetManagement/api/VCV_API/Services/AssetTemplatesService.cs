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
    }
}
