using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VCV_API.Data;

namespace VCV_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class AssetTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetTemplatesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssetTemplates()
        {
            return Ok();
        }
    }
}
