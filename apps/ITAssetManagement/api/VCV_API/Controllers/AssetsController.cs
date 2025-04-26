using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using VCV_API.Data;
using VCV_API.Models.Add;
using VCV_API.Models;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssets()
        {
            var statuses = await _context.Assets
                .Include(a => a.Location)
                .Include(b => b.Status)
                .Include(c => c.Template)
                .ToListAsync();
            return Ok(statuses);
        }


        [HttpPost]
        public async Task<IActionResult> CreateAsset([FromBody] AssetCreateDto dto)
        {
            try
            {
                if (_context == null)
                {
                    return StatusCode(500, "DbContext chưa được khởi tạo.");
                }

                if (dto == null)
                    return BadRequest("Dữ liệu không hợp lệ.");

                // Kiểm tra sự tồn tại của TemplateID
                var templateExists = await _context.AssetTemplates
                    .AnyAsync(t => t.TemplateID == dto.TemplateID);

                if (!templateExists)
                {
                    return BadRequest($"Template với TemplateID {dto.TemplateID} không tồn tại.");
                }

                // Gọi stored procedure để sinh AssetTag
                string nextAssetTag = await GenerateNextAssetTagAsync();

                if (string.IsNullOrEmpty(nextAssetTag))
                {
                    return StatusCode(500, "Không thể sinh mã AssetTag.");
                }

                var asset = new Asset
                {
                    AssetTag = nextAssetTag,
                    TemplateID = dto.TemplateID,
                    SerialNumber = dto.SerialNumber,
                    PurchaseDate = dto.PurchaseDate,
                    WarrantyExpiry = dto.WarrantyExpiry,
                    StatusID = dto.StatusID,
                    LocationID = dto.LocationID,
                    AssignedTo = null,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Assets.AddAsync(asset);
                await _context.SaveChangesAsync();

                return Ok(asset);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, $"Lỗi khi lưu thay đổi vào cơ sở dữ liệu: {dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}\n{ex.StackTrace}");
            }
        }

        //[HttpPost]
        //public async Task<IActionResult> CreateAsset([FromBody] AssetCreateDto dto)
        //{
        //    try
        //    {
        //        if (dto == null)
        //            return BadRequest("Dữ liệu không hợp lệ.");

        //        // Gọi stored procedure để sinh AssetTag
        //        string nextAssetTag = await GenerateNextAssetTagAsync();

        //        if (string.IsNullOrEmpty(nextAssetTag))
        //        {
        //            return StatusCode(500, "Không thể sinh mã AssetTag.");
        //        }

        //        // Cấu hình chuỗi kết nối
        //        string connectionString = "Data Source=192.168.28.5;Initial Catalog=VCV.ITAM;Persist Security Info=False;User ID=vcvapp;Password=Friday02#;TrustServerCertificate=True;";

        //        // Câu lệnh SQL để chèn dữ liệu vào bảng Assets
        //        string query = @"
        //    INSERT INTO Assets (AssetTag, TemplateID, SerialNumber, PurchaseDate, WarrantyExpiry, StatusID, LocationID, AssignedTo, CreatedAt, UpdatedAt)
        //    VALUES (@AssetTag, @TemplateID, @SerialNumber, @PurchaseDate, @WarrantyExpiry, @StatusID, @LocationID, @AssignedTo, @CreatedAt, @UpdatedAt);
        //    SELECT SCOPE_IDENTITY();"; // Lấy ID của bản ghi vừa chèn

        //        using (var connection = new SqlConnection(connectionString))
        //        {
        //            await connection.OpenAsync();

        //            using (var command = new SqlCommand(query, connection))
        //            {
        //                // Thêm tham số vào câu lệnh SQL
        //                command.Parameters.AddWithValue("@AssetTag", nextAssetTag);
        //                command.Parameters.AddWithValue("@TemplateID", dto.TemplateID);
        //                command.Parameters.AddWithValue("@SerialNumber", dto.SerialNumber);
        //                command.Parameters.AddWithValue("@PurchaseDate", dto.PurchaseDate);
        //                command.Parameters.AddWithValue("@WarrantyExpiry", dto.WarrantyExpiry);
        //                command.Parameters.AddWithValue("@StatusID", dto.StatusID);
        //                command.Parameters.AddWithValue("@LocationID", dto.LocationID);
        //                command.Parameters.AddWithValue("@AssignedTo", (object)null ?? DBNull.Value); // Nếu không có giá trị AssignedTo
        //                command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
        //                command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

        //                // Thực thi câu lệnh SQL và lấy ID của bản ghi đã chèn
        //                var assetId = await command.ExecuteScalarAsync(); // Lấy ID mới chèn

        //                // Nếu cần trả về đối tượng Asset với ID mới
        //                var asset = new Asset
        //                {
        //                    AssetTag = nextAssetTag,
        //                    TemplateID = dto.TemplateID,
        //                    SerialNumber = dto.SerialNumber,
        //                    PurchaseDate = dto.PurchaseDate,
        //                    WarrantyExpiry = dto.WarrantyExpiry,
        //                    StatusID = dto.StatusID,
        //                    LocationID = dto.LocationID,
        //                    AssignedTo = null,
        //                    CreatedAt = DateTime.UtcNow,
        //                    UpdatedAt = DateTime.UtcNow,
        //                    AssetID = Convert.ToInt32(assetId) // Gán ID mới vào Asset
        //                };

        //                return Ok(asset);
        //            }
        //        }
        //    }
        //    catch (SqlException sqlEx)
        //    {
        //        return StatusCode(500, $"Lỗi khi lưu thay đổi vào cơ sở dữ liệu: {sqlEx.Message}");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}\n{ex.StackTrace}");
        //    }
        //}

        [HttpPost]
        public async Task<IActionResult> CreateAssets([FromBody] List<AssetCreateDto> assetList)
        {
            if (assetList == null || !assetList.Any())
                return BadRequest("Danh sách tài sản không được rỗng.");

            var newAssets = new List<Asset>();

            foreach (var dto in assetList)
            {
                // Gọi stored procedure để sinh AssetTag
                string nextAssetTag = await GenerateNextAssetTagAsync();

                if (string.IsNullOrEmpty(nextAssetTag))
                {
                    return StatusCode(500, "Không thể sinh mã AssetTag.");
                }

                var asset = new Asset
                {
                    AssetTag = nextAssetTag,
                    TemplateID = dto.TemplateID,
                    SerialNumber = dto.SerialNumber,
                    PurchaseDate = dto.PurchaseDate,
                    WarrantyExpiry = dto.WarrantyExpiry,
                    StatusID = dto.StatusID,
                    LocationID = dto.LocationID,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                newAssets.Add(asset);
            }

            await _context.Assets.AddRangeAsync(newAssets);
            await _context.SaveChangesAsync();

            return Ok(newAssets);
        }

        /// <summary>
        /// Gọi stored procedure sp_GenerateNextCodeByPrefix để lấy AssetTag.
        /// </summary>
        private async Task<string> GenerateNextAssetTagAsync()
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = "sp_GenerateNextCodeByPrefix";
            command.CommandType = System.Data.CommandType.StoredProcedure;

            var prefixParam = new SqlParameter("@Prefix", System.Data.SqlDbType.NVarChar, 10) { Value = "IT" };
            command.Parameters.Add(prefixParam);

            var result = await command.ExecuteScalarAsync();
            return result?.ToString() ?? string.Empty;
        }
    }
}
