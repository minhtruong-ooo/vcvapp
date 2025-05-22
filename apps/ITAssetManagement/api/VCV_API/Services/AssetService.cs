using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.Asset;
using VCV_API.Models.AssetAssignment;
using VCV_API.Models.AssetHistory;
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
                throw new Exception($"Error: {ex.Message}", ex);
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
                throw new Exception("Error: " + ex.Message, ex);
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

        public async Task<AssetDetailDto?> GetAssetDetailByTagAsync(string assetTag)
        {
            AssetDetailDto? assetDetail = null;

            try
            {
                using var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "Asset_GetDetailByTag";

                var param = new SqlParameter("@AssetTag", SqlDbType.NVarChar, 20)
                {
                    Value = assetTag
                };
                command.Parameters.Add(param);

                using var reader = await command.ExecuteReaderAsync();


                if (await reader.ReadAsync())
                {
                    assetDetail = new AssetDetailDto
                    {
                        AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                        AssetTag = reader.GetString(reader.GetOrdinal("AssetTag")),
                        TemplateID = reader.GetInt32(reader.GetOrdinal("TemplateID")),
                        TemplateName = reader.GetString(reader.GetOrdinal("TemplateName")),
                        TypeName = reader.IsDBNull(reader.GetOrdinal("TypeName")) ? null : reader.GetString(reader.GetOrdinal("TypeName")),
                        Manufacturer = reader.IsDBNull(reader.GetOrdinal("Manufacturer")) ? null : reader.GetString(reader.GetOrdinal("Manufacturer")),
                        Model = reader.IsDBNull(reader.GetOrdinal("Model")) ? null : reader.GetString(reader.GetOrdinal("Model")),
                        SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                        PurchaseDate = reader.IsDBNull(reader.GetOrdinal("PurchaseDate")) ? null : reader.GetDateTime(reader.GetOrdinal("PurchaseDate")).ToString("yyyy-MM-dd"),
                        WarrantyExpiry = reader.IsDBNull(reader.GetOrdinal("WarrantyExpiry")) ? null : reader.GetDateTime(reader.GetOrdinal("WarrantyExpiry")).ToString("yyyy-MM-dd"),
                        StatusID = reader.GetInt32(reader.GetOrdinal("StatusID")),
                        StatusName = reader.GetString(reader.GetOrdinal("StatusName")),
                        LocationID = reader.GetInt32(reader.GetOrdinal("LocationID")),
                        LocationName = reader.GetString(reader.GetOrdinal("LocationName")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                        Unit = reader.IsDBNull(reader.GetOrdinal("Unit")) ? null : reader.GetString(reader.GetOrdinal("Unit")),
                        Specifications = new List<AssetSpecificationValueDto>(),
                        Images = new List<AssetImageDto>()
                    };
                }

                if (assetDetail == null)
                    return null;

                // Next result set: Specification values
                if (await reader.NextResultAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        assetDetail.Specifications.Add(new AssetSpecificationValueDto
                        {
                            ValueID = reader.GetInt32(reader.GetOrdinal("ValueID")),
                            AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                            SpecificationID = reader.GetInt32(reader.GetOrdinal("SpecificationID")),
                            SpecificationName = reader.GetString(reader.GetOrdinal("SpecificationName")),
                            Unit = reader.IsDBNull(reader.GetOrdinal("Unit")) ? null : reader.GetString(reader.GetOrdinal("Unit")),
                            DataType = reader.GetString(reader.GetOrdinal("DataType")),
                            IsRequired = reader.GetBoolean(reader.GetOrdinal("IsRequired")),
                            Value = reader.GetString(reader.GetOrdinal("Value"))
                        });
                    }
                }

                // Next result set: Asset Images
                if (await reader.NextResultAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        assetDetail.Images.Add(new AssetImageDto
                        {
                            ImageID = reader.GetInt32(reader.GetOrdinal("ImageID")),
                            AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                            ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")),
                            Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                            UploadedBy = reader.IsDBNull(reader.GetOrdinal("UploadedBy")) ? null : reader.GetString(reader.GetOrdinal("UploadedBy")),
                            UploadedAt = reader.IsDBNull(reader.GetOrdinal("UploadedAt")) ? null : reader.GetDateTime(reader.GetOrdinal("UploadedAt"))
                        });
                    }


                    // Next result set: Asset Licenses
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            assetDetail.Licenses.Add(new Models.AssetLicense.AssetLicense
                            {
                                LicenseID = reader.GetInt32(reader.GetOrdinal("LicenseID")),
                                SoftwareName = reader.IsDBNull(reader.GetOrdinal("SoftwareName")) ? null : reader.GetString(reader.GetOrdinal("SoftwareName")),
                                LicenseType = reader.IsDBNull(reader.GetOrdinal("LicenseType")) ? null : reader.GetString(reader.GetOrdinal("LicenseType")),
                                LicenseKey = reader.IsDBNull(reader.GetOrdinal("LicenseKey")) ? null : reader.GetString(reader.GetOrdinal("LicenseKey")),
                                ExpiryDate = reader.IsDBNull(reader.GetOrdinal("ExpiryDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ExpiryDate")).ToString("yyyy-MM-dd"),
                                PurchaseDate = reader.IsDBNull(reader.GetOrdinal("PurchaseDate")) ? null : reader.GetDateTime(reader.GetOrdinal("PurchaseDate")).ToString("yyyy-MM-dd"),
                                AssignedDate = reader.IsDBNull(reader.GetOrdinal("AssignedDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignedDate")).ToString("yyyy-MM-dd"),
                                AssignedBy = reader.IsDBNull(reader.GetOrdinal("AssignedBy")) ? null : reader.GetString(reader.GetOrdinal("AssignedBy")),
                            });
                        }
                    }

                    // Next result set: Current Employee Assignments
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            assetDetail.AssignmentsCurrent.Add(new AssetAssignmentCurrent
                            {
                                EmployeeCode = reader.IsDBNull(reader.GetOrdinal("EmployeeCode")) ? null : reader.GetString(reader.GetOrdinal("EmployeeCode")),
                                FullName = reader.IsDBNull(reader.GetOrdinal("FullName")) ? null : reader.GetString(reader.GetOrdinal("FullName")),
                                Avatar = reader.IsDBNull(reader.GetOrdinal("Avatar")) ? null : reader.GetString(reader.GetOrdinal("Avatar")),
                                DepartmentName = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? null : reader.GetString(reader.GetOrdinal("DepartmentName")),
                                AssignmentDate = reader.IsDBNull(reader.GetOrdinal("AssignmentDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignmentDate")).ToString("yyyy-MM-dd"),
                            });
                        }
                    }

                    // Next result set: Asset History
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            assetDetail.History.Add(new AssetHistory
                            {
                                HistoryID = reader.GetInt32(reader.GetOrdinal("HistoryID")),
                                AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                                ActionType = reader.IsDBNull(reader.GetOrdinal("ActionType")) ? null : reader.GetString(reader.GetOrdinal("ActionType")),
                                ChangeDate = reader.IsDBNull(reader.GetOrdinal("ChangeDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ChangeDate")).ToString(),
                                ChangedBy = reader.IsDBNull(reader.GetOrdinal("ChangedBy")) ? null : reader.GetString(reader.GetOrdinal("ChangedBy")),
                                FieldChanged = reader.IsDBNull(reader.GetOrdinal("FieldChanged")) ? null : reader.GetString(reader.GetOrdinal("FieldChanged")),
                                OldValue = reader.IsDBNull(reader.GetOrdinal("OldValue")) ? null : reader.GetString(reader.GetOrdinal("OldValue")),
                                NewValue = reader.IsDBNull(reader.GetOrdinal("NewValue")) ? null : reader.GetString(reader.GetOrdinal("NewValue")),
                                Note = reader.IsDBNull(reader.GetOrdinal("Note")) ? null : reader.GetString(reader.GetOrdinal("Note")),
                            });
                        }
                    }

                    // Next result set: Asset Assignment History
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            assetDetail.AssignmentsHistory.Add(new AssetAssignmentHistory
                            {
                                AssignmentID = reader.GetInt32(reader.GetOrdinal("AssignmentID")),
                                AssignmentCode = reader.IsDBNull(reader.GetOrdinal("AssignmentCode")) ? null : reader.GetString(reader.GetOrdinal("AssignmentCode")),
                                AssignmentDate = reader.IsDBNull(reader.GetOrdinal("AssignmentDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignmentDate")).ToString("yyyy-MM-dd"),
                                AssignmentAction = reader.IsDBNull(reader.GetOrdinal("AssignmentAction")) ? null : reader.GetString(reader.GetOrdinal("AssignmentAction")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                AssignStatus = reader.IsDBNull(reader.GetOrdinal("AssignStatus")) ? null : reader.GetString(reader.GetOrdinal("AssignStatus")),
                                AssignedToName = reader.IsDBNull(reader.GetOrdinal("AssignedToName")) ? null : reader.GetString(reader.GetOrdinal("AssignedToName")),
                                AssignedByName = reader.IsDBNull(reader.GetOrdinal("AssignedByName")) ? null : reader.GetString(reader.GetOrdinal("AssignedByName")),
                            });
                        }
                    }

                }

            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }
            return assetDetail;

        }

        public async Task<List<Asset>> GetUnusedAssetsAsync()
        {
            var assets = new List<Asset>();
            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Table_GetUnusedAssetsAsync";
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var asset = new Asset
                            {
                                AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                                AssetTag = reader.GetString(reader.GetOrdinal("AssetTag")),
                                TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                                SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                                StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
                            };
                            assets.Add(asset);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }
            return assets;
        }
    }
}
