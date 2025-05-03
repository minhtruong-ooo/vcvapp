using MediaService.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MediaService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MediaController : ControllerBase
    {
        public readonly IWebHostEnvironment _env;

        public MediaController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("image/{fileName}")]
        public IActionResult GetProtectedImage(string fileName)
        {
            var imagePath = Path.Combine(_env.WebRootPath, "images", fileName);
            if (!System.IO.File.Exists(imagePath))
                return NotFound();

            var mimeType = GetMimeType(fileName);
            var bytes = System.IO.File.ReadAllBytes(imagePath);
            return File(bytes, mimeType);
        }

        private string GetMimeType(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };
        }
    }
}
