using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using VCV_API.Data;
using VCV_API.Models.Add;
using VCV_API.Models;
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
        public async Task<IActionResult> CreateAsset([FromBody] AssetCreateDto dto)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssets([FromBody] List<AssetCreateDto> assetList)
        {
            return Ok();
        }
    }
}
