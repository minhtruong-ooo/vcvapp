using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;


namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class OriginController : ControllerBase
    {
        private readonly IAssetOrigin _assetOrigin;

        public OriginController(IAssetOrigin assetOrigin)
        {
            _assetOrigin = assetOrigin;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompany()
        {
            try
            {
                var assetsOrigin = await _assetOrigin.GetOriginAsync();

                if (assetsOrigin == null || assetsOrigin.Count == 0)
                {
                    return NotFound("Asset Origin not found");
                }

                return Ok(assetsOrigin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }
    }
}
