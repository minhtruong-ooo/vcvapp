using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;


namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly IAssetCompany _assetCompany;

        public CompanyController(IAssetCompany assetCompany)
        {
            _assetCompany = assetCompany;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompany()
        {
            try
            {
                var assetsCompany = await _assetCompany.GetCompanyAsync();

                if (assetsCompany == null || assetsCompany.Count == 0)
                {
                    return NotFound("Asset Company not found");
                }

                return Ok(assetsCompany);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }
    }
}
