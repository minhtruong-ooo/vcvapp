using MediaService.Interfaces;
using MediaService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.IO.Compression;
using System.Text.Json;

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

        [HttpGet("image/{folder}/{fileName}")]
        [Authorize]
        public IActionResult GetProtectedImage(string folder, string fileName)
        {
            var imagePath = Path.Combine(_env.WebRootPath, "images", folder, fileName);
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

        [HttpPost("assignment/pdf")]
        [Authorize]
        public async Task<IActionResult> ExportAssignmentPdf([FromBody] AssetAssignmentModel model)
        {
            var pdfPath = await _mediaService.ExportAssignmentPdfAsync(model);
            var url = $"{Request.Scheme}://{Request.Host}{pdfPath}";
            return Ok(new { success = true, url });
        }

        [HttpPost("assignment/zip")]
        [Authorize]
        public async Task<IActionResult> ExportAssignmentsZip([FromBody] List<AssetAssignmentModel> models)
        {
            if (models == null || !models.Any())
                return BadRequest(new { success = false, message = "No data provided." });

            var zipPath = await _mediaService.ExportAssignmentsZipAsync(models);
            var url = $"{Request.Scheme}://{Request.Host}{zipPath}";
            return Ok(new { success = true, url });
        }
        [HttpPost("ImportAssets")]
        public async Task<IActionResult> ImportAssets(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            var result = await _mediaService.ImportAssetsFromExcelAsync(file);
            return Ok(result);
        }
    }
}
