using MediaService.Interfaces;
using MediaService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MediaService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        public readonly IWebHostEnvironment _env;
        public readonly IMediaService _mediaService;

        public MediaController(IWebHostEnvironment env, IMediaService mediaService)
        {
            _env = env;
            _mediaService = mediaService;
        }

        [HttpGet("image/{fileName}")]
        [Authorize]
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

        [HttpPost("generate-qrs")]
        public async Task<IActionResult> GeneratePdf([FromBody] List<QRModel> items)
        {
            var url = await _mediaService.GeneratePdfWithQRCodes(items);
            return Ok(new { url });
        }
    }
}
