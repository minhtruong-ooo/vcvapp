using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Models.Asset;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;
        public AssetsController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssets()
        {
            try
            {
                var assets = await _assetService.GetAllAssetAsync();

                if (assets == null || assets.Count == 0)
                {
                    return NotFound("Không tìm thấy tài sản.");
                }

                return Ok(assets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsset([FromBody] AssetCreateDto assetDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var newId = await _assetService.CreateAssetAsync(assetDto);
                return Ok(new { AssetID = newId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Đã xảy ra lỗi khi tạo tài sản.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssets([FromBody] List<AssetCreateDto> assetList)
        {
            try
            {
                var createdAssets = await _assetService.CreateAssetsAsync(assetList);
                return Ok(createdAssets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi tạo tài sản hàng loạt", detail = ex.Message });
            }
        }

        [HttpGet("{assetTag}")]
        public async Task<IActionResult> GetDetailAsset(string assetTag)
        {
            var detail = await _assetService.GetAssetDetailByTagAsync(assetTag);
            if (detail == null)
                return NotFound($"Không tìm thấy tài sản với mã {assetTag}");

            return Ok(detail);
        }
    }
}
