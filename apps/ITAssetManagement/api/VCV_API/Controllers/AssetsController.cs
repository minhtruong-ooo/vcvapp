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
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssets()
        {
            var statuses = await _context.Assets
                .Include(a => a.Location)
                .Include(b => b.Status)
                .Include(c => c.Template)
                .ToListAsync();
            return Ok(statuses);
        }
    }
}
