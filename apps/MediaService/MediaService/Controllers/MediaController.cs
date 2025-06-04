using MediaService.Interfaces;
using MediaService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
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
        public IActionResult ExportAssignmentPdf([FromBody] AssetAssignmentModel data)
        {

            Console.WriteLine(JsonSerializer.Serialize(data)); // Log nội dung
            // 1. Đường dẫn file mẫu
            string fileName = $"{Guid.NewGuid()}";
            string templatePath = Path.Combine(_env.WebRootPath, "templates", "IT_BBBG_Template.xlsx");
            string outputExcelPath = Path.Combine(_env.WebRootPath, "excel", $"{fileName}.xlsx");
            string outputPDFPathTemp = Path.Combine(_env.WebRootPath, "pdf", $"{fileName}");
            string outputPdfPath = Path.ChangeExtension(outputPDFPathTemp, ".pdf");

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            // 2. Load Excel mẫu và ghi dữ liệu với EPPlus
            using (var package = new ExcelPackage(new FileInfo(templatePath)))
            {
                ExcelWorksheet ws = package.Workbook.Worksheets[0];

                ws.Cells["C11"].Value = data.assignmentCode;
                ws.Cells["C16"].Value = data.employeeName;
                ws.Cells["C17"].Value = data.employeeCode;
                ws.Cells["C12"].Value = data.assignmentByName;
                ws.Cells["C13"].Value = data.assignerCode;
                ws.Cells["C20"].Value = data.notes;
                ws.Cells["C46"].Value = data.assignmentDate;

                ws.Cells["H16"].Value = data.departmentName;
                ws.Cells["H12"].Value = data.assignerDepartment;


                int rowStart = 24;
                for (int i = 0; i < data.assetAssignments.Count; i++)
                {
                    var item = data.assetAssignments[i];
                    ws.Cells[rowStart + i, 1].Value = i + 1;
                    ws.Cells[rowStart + i, 2].Value = item.templateName ?? "123";
                    ws.Cells[rowStart + i, 5].Value = item.assetTag ?? "123";
                    ws.Cells[rowStart + i, 6].Value = item.serialNumber ?? "123";
                    // Chỉ thêm nếu dữ liệu có unit và quantity
                    ws.Cells[rowStart + i, 7].Value = item.unit ?? "";
                    ws.Cells[rowStart + i, 8].Value = item.quantity ?? "1";
                }

                package.SaveAs(new FileInfo(outputExcelPath));
            }

            // 3. Dùng Spire.XLS để chuyển sang PDF
            var workbook = new Spire.Xls.Workbook();
            workbook.LoadFromFile(outputExcelPath);
            workbook.SaveToFile(outputPdfPath, Spire.Xls.FileFormat.PDF);

            // 4. Trả về URL cho frontend
            var pdfUrl = $"{Request.Scheme}://{Request.Host}/pdf/{fileName}.pdf";
            return Ok(new { success = true, url = pdfUrl });
        }
    }
}
