using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Models.AssetTemplate;
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

        [HttpGet]
        public async Task<IActionResult> GetAssetTemplates()
        {
            try
            {
                var assetsTemplates = await _assetTemplateService.GetAssetTemplateAsync();
                if (assetsTemplates == null || assetsTemplates.Count == 0)
                {
                    return NotFound("Không tìm thấy mẫu tài sản.");
                }
                return Ok(assetsTemplates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAssetTemplate([FromBody] AssetTemplateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var newId = await _assetTemplateService.CreateAssetTemplateAsync(dto);
                return Ok(new { message = "Create successfully", templateId = newId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error: " + ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAssetTemplate([FromBody] AssetTemplateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var success = await _assetTemplateService.UpdateAssetTemplateAsync(dto);
                if (success)
                    return Ok(new { message = "Template updated successfully" });

                return NotFound(new { message = "Template not found or no change detected" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteAssetTemplates([FromBody] List<int> templateIDs)
        {
            if (templateIDs == null || !templateIDs.Any())
                return BadRequest(new { message = "Danh sách cần xoá rỗng" });

            try
            {
                var deletedCount = await _assetTemplateService.DeleteAssetTemplatesAsync(templateIDs);
                return Ok(new { message = $"Đã xoá {deletedCount} bản ghi", deletedCount });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }


    }
}
