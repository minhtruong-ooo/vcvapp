using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VCV_API.Models.AssetAssignment;
using VCV_API.Services;
using VCV_API.Services.Interfaces;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AssignController : ControllerBase
    {
        private readonly IAssetAssign _assetAssignService;
        public AssignController(IAssetAssign assetAssignService)
        {
            _assetAssignService = assetAssignService;
        }

        [HttpGet]
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



        [HttpGet("{employeeID}")]
        public async Task<IActionResult> GetAssignedAssetsByEmployeeID(string employeeID)
        {
            try
            {
                var assets = await _assetAssignService.GetAssignedAssets(employeeID);
                return Ok(assets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy dữ liệu: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentRequestDto dto)
        {
            try
            {
                await _assetAssignService.CreateAssignmentAsync(dto);
                return Ok(new { message = "Assignment created successfully" }); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create assignment", error = ex.Message });
            }
        }



    }
}
