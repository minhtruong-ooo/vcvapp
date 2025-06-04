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

        public async Task<List<AssetReturnViewModel>> GetAssignedAssets(string employeeID)
        {
            var assets = new List<AssetReturnViewModel>();
            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                using (var command = connection.CreateCommand())
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "Asset_GetAssignAssetByEmployeeID";

                    var param = new SqlParameter("@EmployeeID", SqlDbType.NVarChar, 20)
                    {
                        Value = employeeID
                    };
                    command.Parameters.Add(param);

                    using var reader = await command.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        var asset = new AssetReturnViewModel
                        {
                            AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                            AssetTag = reader.GetString(reader.GetOrdinal("AssetTag")),
                            TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                            SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                            DetailID = reader.IsDBNull(reader.GetOrdinal("DetailID")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("DetailID")),
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

        public async Task<bool> CreateAssignmentAsync(AssignmentRequestDto dto)
        {
            try
            {
                using var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();


                using var command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "Asset_Assignment_Create";

                // Tạo DataTable phù hợp với TVP: AssetID + DetailID
                var table = new DataTable();
                table.Columns.Add("AssetID", typeof(int));
                table.Columns.Add("SourceDetailID", typeof(int));

                foreach (var item in dto.Assets ?? Enumerable.Empty<AssetAssignedDetailDto>())
                {
                    table.Rows.Add(item.AssetID, item.DetailID ?? (object)DBNull.Value);
                }

                command.Parameters.AddRange(new[]
                {
                new SqlParameter("@EmployeeID", dto.EmployeeId),
                new SqlParameter("@Notes", dto.Notes ?? (object)DBNull.Value),
                new SqlParameter("@AssignmentDate", dto.Date ?? (object)DBNull.Value),
                new SqlParameter("@AssignmentAction", dto.AssignmentAction ?? (object)DBNull.Value),
                new SqlParameter("@AssignmentBy", dto.AssignmentBy),
                new SqlParameter
                {
                    ParameterName = "@Assets",
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "AssetIdListType", // TVP phải định nghĩa có 2 cột AssetID & DetailID
                    Value = table
                }
            });

                var rows = await command.ExecuteNonQueryAsync();
                return rows > 0;

            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
                throw;
            }
        }

        public async Task<AssetAsignmentDto?> GetAssetAssignmentDetailsByCode(string assignmentCode)
        {
            AssetAsignmentDto? assetAsignmentDto = null;

            try
            {
                using var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "Assignment_GetAssetAssignmentDetailsByCode";

                var param = new SqlParameter("@AssignmentCode", SqlDbType.NVarChar, 20)
                {
                    Value = assignmentCode
                };
                command.Parameters.Add(param);

                using var reader = await command.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    assetAsignmentDto = new AssetAsignmentDto
                    {
                        AssignmentID = reader.GetInt32(reader.GetOrdinal("AssignmentID")),
                        AssignmentCode = reader.IsDBNull(reader.GetOrdinal("AssignmentCode")) ? null : reader.GetString(reader.GetOrdinal("AssignmentCode")),
                        EmployeeCode = reader.IsDBNull(reader.GetOrdinal("EmployeeCode")) ? null : reader.GetString(reader.GetOrdinal("EmployeeCode")),
                        EmployeeName = reader.IsDBNull(reader.GetOrdinal("EmployeeName")) ? null : reader.GetString(reader.GetOrdinal("EmployeeName")),
                        DepartmentName = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? null : reader.GetString(reader.GetOrdinal("DepartmentName")),
                        AssignerCode = reader.IsDBNull(reader.GetOrdinal("AssignerCode")) ? null : reader.GetString(reader.GetOrdinal("AssignerCode")),
                        AssignmentByName = reader.IsDBNull(reader.GetOrdinal("AssignmentByName")) ? null : reader.GetString(reader.GetOrdinal("AssignmentByName")),
                        AssignmentAction = reader.IsDBNull(reader.GetOrdinal("AssignmentAction")) ? null : reader.GetString(reader.GetOrdinal("AssignmentAction")),
                        AssignerDepartment = reader.IsDBNull(reader.GetOrdinal("AssignerDepartment")) ? null : reader.GetString(reader.GetOrdinal("AssignerDepartment")),
                        AssignmentDate = reader.IsDBNull(reader.GetOrdinal("AssignmentDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignmentDate")).ToString("yyyy-MM-dd"),
                        Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? string.Empty : reader.GetString(reader.GetOrdinal("Notes")),
                        AssignStatus = reader.IsDBNull(reader.GetOrdinal("AssignStatus")) ? null : reader.GetString(reader.GetOrdinal("AssignStatus")),
                        CreateAt = reader.IsDBNull(reader.GetOrdinal("CreateAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreateAt")),
                        UpdateAt = reader.IsDBNull(reader.GetOrdinal("UpdateAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdateAt"))
                    };
                }

                if (assetAsignmentDto == null)
                {
                    return null;
                }

                if (await reader.NextResultAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        assetAsignmentDto.AssetAssignments.Add(new AssetAssignmentDetail
                        {
                            DetailID = reader.GetInt32(reader.GetOrdinal("DetailID")),
                            AssetID = reader.GetInt32(reader.GetOrdinal("AssetID")),
                            AssetTag = reader.IsDBNull(reader.GetOrdinal("AssetTag")) ? null : reader.GetString(reader.GetOrdinal("AssetTag")),
                            TemplateName = reader.IsDBNull(reader.GetOrdinal("TemplateName")) ? null : reader.GetString(reader.GetOrdinal("TemplateName")),
                            SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                            Unit = reader.IsDBNull(reader.GetOrdinal("Unit")) ? null : reader.GetString(reader.GetOrdinal("Unit")),
                        });
                    }
                }

                if (await reader.NextResultAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        assetAsignmentDto.EmployeeInfomation.Add(new AssetAssignmentCurrent
                        {
                            EmployeeCode = reader.IsDBNull(reader.GetOrdinal("EmployeeCode")) ? null : reader.GetString(reader.GetOrdinal("EmployeeCode")),
                            FullName = reader.IsDBNull(reader.GetOrdinal("FullName")) ? null : reader.GetString(reader.GetOrdinal("FullName")),
                            Avatar = reader.IsDBNull(reader.GetOrdinal("Avatar")) ? null : reader.GetString(reader.GetOrdinal("Avatar")),
                            DepartmentName = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? null : reader.GetString(reader.GetOrdinal("DepartmentName")),
                            AssignmentDate = reader.IsDBNull(reader.GetOrdinal("AssignmentDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignmentDate")).ToString("yyyy-MM-dd"),
                        });
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }

            return assetAsignmentDto;
        }
    }
}
