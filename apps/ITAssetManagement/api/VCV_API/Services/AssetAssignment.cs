using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using VCV_API.Data;
using VCV_API.Models.Asset;
using VCV_API.Models.AssetAssignment;
using VCV_API.Services.Interfaces;

namespace VCV_API.Services
{
    public class AssetAssignment : IAssetAssign
    {
        private readonly AppDbContext _context;
        public AssetAssignment(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<AssetAssignmentModel>> GetAssetAssignments()
        {
            var assetAssigns = new List<AssetAssignmentModel>();

            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_Table_GetAssignments";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var assetAssign = new AssetAssignmentModel
                            {
                                AssignmentID = reader.GetInt32(reader.GetOrdinal("AssignmentID")),
                                AssignmentCode = reader.IsDBNull(reader.GetOrdinal("AssignmentCode")) ? null : reader.GetString(reader.GetOrdinal("AssignmentCode")),
                                EmployeeID = reader.IsDBNull(reader.GetOrdinal("EmployeeID")) ? null : reader.GetInt32(reader.GetOrdinal("EmployeeID")),
                                EmployeeName = reader.IsDBNull(reader.GetOrdinal("EmployeeName")) ? null : reader.GetString(reader.GetOrdinal("EmployeeName")),
                                EmployeeCode = reader.IsDBNull(reader.GetOrdinal("EmployeeCode")) ? null : reader.GetString(reader.GetOrdinal("EmployeeCode")),
                                DepartmentName = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? null : reader.GetString(reader.GetOrdinal("DepartmentName")),
                                AssignmentAction = reader.IsDBNull(reader.GetOrdinal("AssignmentAction")) ? null : reader.GetString(reader.GetOrdinal("AssignmentAction")),
                                AssignmentDate = reader.IsDBNull(reader.GetOrdinal("AssignmentDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignmentDate")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                AssignmentBy = reader.IsDBNull(reader.GetOrdinal("AssignmentBy")) ? null : reader.GetInt32(reader.GetOrdinal("AssignmentBy")),
                                AssignmentByName = reader.IsDBNull(reader.GetOrdinal("AssignmentByName")) ? null : reader.GetString(reader.GetOrdinal("AssignmentByName")),
                                AssignStatus = reader.IsDBNull(reader.GetOrdinal("AssignStatus")) ? null : reader.GetString(reader.GetOrdinal("AssignStatus")),
                                CreateAt = reader.IsDBNull(reader.GetOrdinal("CreateAt")) ? null : reader.GetDateTime(reader.GetOrdinal("CreateAt")),
                                UpdateAt = reader.IsDBNull(reader.GetOrdinal("UpdateAt")) ? null : reader.GetDateTime(reader.GetOrdinal("UpdateAt")),
                            };
                            assetAssigns.Add(assetAssign);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }
            return assetAssigns;
        }

        public async Task<List<Asset>> GetAssignedAssets(string employeeID)
        {
            var assets = new List<Asset>();
            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_GetAssignAssetByEmployeeID";

                    var param = new SqlParameter("@EmployeeID", SqlDbType.Int, 20)
                    {
                        Value = employeeID
                    };
                    command.Parameters.Add(param);

                    using var reader = await command.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        var asset = new Asset
                        {
                            AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                            AssetTag = reader.GetString(reader.GetOrdinal("AssetTag")),
                            TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                            SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                        };

                        assets.Add(asset);
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
