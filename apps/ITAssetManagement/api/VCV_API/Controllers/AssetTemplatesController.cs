using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AssetTemplatesController : ControllerBase
    {
        private readonly IAssetTemplates _assetTemplateService;
        public AssetTemplatesController(IAssetTemplates assetTemplateService)
        {
            _assetTemplateService = assetTemplateService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssetTemplates_Select()
        {
            try
            {
                var assetsTemplates = await _assetTemplateService.GetAllAssetTemplatesAsync();

                if (assetsTemplates == null || assetsTemplates.Count == 0)
                {
                    return NotFound("Không tìm thấy tài sản.");
                }

                return Ok(assetsTemplates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }
    }
}
