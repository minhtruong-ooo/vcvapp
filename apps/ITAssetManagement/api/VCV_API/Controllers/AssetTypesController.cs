using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VCV_API.Data;
using VCV_API.Services;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AssetTypesController : ControllerBase
    {
        private readonly IAssetType _assetType;
        public AssetTypesController(IAssetType assetType)
        {
            _assetType = assetType;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssetTypes()
        {
            try
            {
                var assetTypes = await _assetType.GetAssetTypesAsync();

                if (assetTypes == null || assetTypes.Count == 0)
                {
                    return NotFound("Không tìm thấy loại mẫu tài sản.");
                }

                return Ok(assetTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }
    }
}
