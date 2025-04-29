using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AssetLocationController : ControllerBase
    {
        private readonly IAssetLocation _assetLocation;

        public AssetLocationController(IAssetLocation assetLocation)
        {
            _assetLocation = assetLocation;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLocations()
        {
            try
            {
                var assetsLocations = await _assetLocation.GetAssetLocationsAsync();

                if (assetsLocations == null || assetsLocations.Count == 0)
                {
                    return NotFound("Asset Location not found");
                }

                return Ok(assetsLocations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }
    }
}
