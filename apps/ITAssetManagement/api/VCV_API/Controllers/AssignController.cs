using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignController : ControllerBase
    {
        private readonly IAssetAssign _assetAssignService;
        public AssignController(IAssetAssign assetAssignService)
        {
            _assetAssignService = assetAssignService;
        }

        [HttpGet("GetAssignments")]
        public async Task<IActionResult> GetAssignments()
        {
            try
            {
                var assignments = await _assetAssignService.GetAssetAssignments();
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
