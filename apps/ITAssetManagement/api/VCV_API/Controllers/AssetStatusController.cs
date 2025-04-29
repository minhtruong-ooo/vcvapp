using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AssetStatusController : ControllerBase
    {
        private readonly IAssetStatus _assetStatus;

        public AssetStatusController(IAssetStatus assetStatus)
        {
            _assetStatus = assetStatus;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssetStatuses()
        {
            try
            {
                var assetsStatus = await _assetStatus.GetAssetStatusesAsync();

                if (assetsStatus == null || assetsStatus.Count == 0)
                {
                    return NotFound("Asset Location not found");
                }

                return Ok(assetsStatus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }
    }
}
