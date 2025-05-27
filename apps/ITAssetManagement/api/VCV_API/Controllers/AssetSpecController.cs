using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AssetSpecController : ControllerBase
    {
        private readonly IAssetSpec _assetSpecService;
        public AssetSpecController(IAssetSpec assetSpecService)
        {
            _assetSpecService = assetSpecService;
        }

        [HttpGet("{templateID}")]
        public async Task<IActionResult> GetAssetSpecsByTemplateID(int templateID)
        {
            try
            {
                var assetSpecs = await _assetSpecService.GetAssetSpecsByTemplateID(templateID);
                return Ok(assetSpecs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving asset specifications: {ex.Message}");
            }
        }
    }
}
