using iText.Kernel.Pdf;
using iText.Kernel.Geom;
using iText.Layout;
using iText.Layout.Element;
using iText.IO.Image;
using QRCoder;
using MediaService.Interfaces;
using iText.Layout.Properties;
using iText.Layout.Borders;
using MediaService.Models;
using Path = System.IO.Path;
using iText.IO.Font;
using iText.Kernel.Font;
using OfficeOpenXml;
using Spire.Xls;
using System.IO.Compression;
using System.Diagnostics;
using MediaService.Data;
using System;
using System.Net.Http;
namespace MediaService.Services
{
    public class MediaService : IMediaService
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDBContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public MediaService(IWebHostEnvironment env, IHttpClientFactory httpClientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _env = env;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> ExportAssignmentPdfAsync(AssetAssignmentModel model)
        {
            return await Task.Run(() =>
            {
                string fileName = $"{Guid.NewGuid()}";
                string templatePath = "";

                // Chọn template phù hợp
                if (model.assignmentAction == "Assign")
                {
                    templatePath = Path.Combine(_env.WebRootPath, "templates", "IT_BBBG_Template.xlsx");
                }
                else if (model.assignmentAction == "Return")
                {
                    templatePath = Path.Combine(_env.WebRootPath, "templates", "IT_BBTH_Template.xlsx");
                }

                // Đường dẫn file Excel và PDF tạm thời
                string excelDir = Path.Combine(_env.WebRootPath, "excel");
                string pdfDir = Path.Combine(_env.WebRootPath, "pdf");
                string excelPath = Path.Combine(excelDir, $"{fileName}.xlsx");
                string pdfPath = Path.Combine(pdfDir, $"{fileName}.pdf");

                // Tạo thư mục nếu chưa tồn tại
                Directory.CreateDirectory(excelDir);
                Directory.CreateDirectory(pdfDir);

                // Tạo file Excel từ template
                
                using (var package = new ExcelPackage(new FileInfo(templatePath)))
                {
                    var ws = package.Workbook.Worksheets[0];
                    FillAssignmentData(ws, model); // Ghi dữ liệu vào file Excel
                    package.SaveAs(new FileInfo(excelPath));
                }

                // Chuyển đổi Excel sang PDF bằng LibreOffice
                var process = new Process();
                process.StartInfo.FileName = "libreoffice"; // hoặc "soffice"
                process.StartInfo.Arguments = $"--headless --convert-to pdf --outdir \"{pdfDir}\" \"{excelPath}\"";
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.CreateNoWindow = true;

                process.Start();
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (!File.Exists(pdfPath))
                {
                    throw new Exception($"Chuyển đổi PDF thất bại.\nLỗi: {error}\nOutput: {output}");
                }

                // Trả về URL truy cập file PDF
                return $"/pdf/{fileName}.pdf";
            });
        }
        public async Task<string> ExportAssignmentsZipAsync(List<AssetAssignmentModel> dataList)
        {
            return await Task.Run(async () =>
            {
                string zipName = $"{Guid.NewGuid()}.zip";
                string zipPath = Path.Combine(_env.WebRootPath, "zip", zipName);
                Directory.CreateDirectory(Path.GetDirectoryName(zipPath)!);

                List<string> pdfPaths = new();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                foreach (var data in dataList)
                {
                    string id = Guid.NewGuid().ToString();
                    string excelPath = Path.Combine(_env.WebRootPath, "excel", $"{id}.xlsx");
                    string pdfPath = Path.Combine(_env.WebRootPath, "pdf", $"{id}.pdf");

                    using (var package = new ExcelPackage(new FileInfo(Path.Combine(_env.WebRootPath, "templates", "IT_BBBG_Template.xlsx"))))
                    {
                        var ws = package.Workbook.Worksheets[0];
                        FillAssignmentData(ws, data);
                        await Task.Run(() => package.SaveAs(new FileInfo(excelPath)));
                    }

                    var workbook = new Workbook();
                    workbook.LoadFromFile(excelPath);
                    workbook.SaveToFile(pdfPath, FileFormat.PDF);
                    pdfPaths.Add(pdfPath);
                }

                using (var zipStream = new FileStream(zipPath, FileMode.Create))
                using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create))
                {
                    foreach (var pdf in pdfPaths)
                    {
                        var entryName = Path.GetFileName(pdf);
                        archive.CreateEntryFromFile(pdf, entryName);
                    }
                }

                foreach (var pdf in pdfPaths)
                {
                    if (File.Exists(pdf)) File.Delete(pdf);
                }

                return $"/zip/{zipName}";
            });
        }
        private void FillAssignmentData(ExcelWorksheet ws, AssetAssignmentModel data)
        {
            ws.Cells["C11"].Value = data.assignmentCode;
            ws.Cells["C16"].Value = data.employeeName;
            ws.Cells["C17"].Value = data.employeeCode;
            ws.Cells["C12"].Value = data.assignmentByName;
            ws.Cells["C13"].Value = data.assignerCode;
            ws.Cells["C20"].Value = data.notes;
            ws.Cells["C50"].Value = data.assignmentDate;
            ws.Cells["H16"].Value = data.departmentName;
            ws.Cells["H12"].Value = data.assignerDepartment;

            int rowStart = 24;
            for (int i = 0; i < data.assetAssignments.Count; i++)
            {
                var item = data.assetAssignments[i];
                ws.Cells[rowStart + i, 1].Value = i + 1;
                ws.Cells[rowStart + i, 2].Value = item.templateName ?? "";
                ws.Cells[rowStart + i, 5].Value = item.assetTag ?? "";
                ws.Cells[rowStart + i, 6].Value = item.serialNumber ?? "";
                ws.Cells[rowStart + i, 7].Value = item.unit ?? "";
                ws.Cells[rowStart + i, 8].Value = item.quantity ?? "1";
            }
        }
        public Task<string> GeneratePdfWithQRCodes(List<QRModel> items)
        {
            return Task.Run(() =>
            {
                string folder = "qr";
                string folderPath = Path.Combine(_env.WebRootPath, folder);
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string fileName = $"{Guid.NewGuid()}.pdf";
                string filePath = Path.Combine(folderPath, fileName);

                var pageSize = new PageSize(198.43f, 42.52f);
                string fontPath = Path.Combine(_env.WebRootPath, "fonts", "CALIBRI.TTF");
                PdfFont calibri = PdfFontFactory.CreateFont(fontPath, PdfEncodings.WINANSI);

                using (var writer = new PdfWriter(filePath))
                using (var pdf = new PdfDocument(writer))
                {
                    var document = new Document(pdf);
                    foreach (var item in items)
                    {
                        // Create new page with specific size
                        pdf.AddNewPage(pageSize);
                        document.SetMargins(0, 1, 1, 1);

                        // Generate QR Code
                        using (var qrGenerator = new QRCodeGenerator())
                        {
                            if (string.IsNullOrEmpty(item.AssetURL))
                                throw new ArgumentNullException(nameof(item.AssetURL), "AssetURL cannot be null or empty.");

                            QRCodeData qrCodeData = qrGenerator.CreateQrCode(item.AssetURL, QRCodeGenerator.ECCLevel.Q);
                            using (var qrCode = new PngByteQRCode(qrCodeData))
                            {
                                byte[] qrBytes = qrCode.GetGraphic(20);

                                // Add QR code image to PDF
                                Image qrImage = new Image(ImageDataFactory.Create(qrBytes));
                                qrImage.ScaleToFit(40, 40);

                                // Create text paragraph
                                Paragraph para = new Paragraph()
                                    .Add($"VCV - IT Asset Management Label\n")
                                    .Add($"Asset Tag: {item.AssetTag} | Purchase Date: {item.PurchaseDate}\n")
                                    .Add($"Asset Name: {item.AssetName}\n")
                                    .Add($"Serial Number: {item.SerialNumber}")
                                    .SetFontSize(5).SetFont(calibri);

                                // Create table for QR and text layout
                                Table table = new Table(UnitValue.CreatePercentArray(new float[] { 1, 3 }));
                                table.SetWidth(UnitValue.CreatePercentValue(100));

                                var qrCell = new Cell()
                                    .Add(qrImage)
                                    .SetBorder(Border.NO_BORDER)
                                    .SetVerticalAlignment(VerticalAlignment.MIDDLE);

                                var textCell = new Cell()
                                    .Add(para)
                                    .SetBorder(Border.NO_BORDER)
                                    .SetVerticalAlignment(VerticalAlignment.MIDDLE)
                                    .SetPaddingLeft(-5);

                                table.AddCell(qrCell);
                                table.AddCell(textCell);

                                document.Add(table);
                            }
                        }
                    }
                    document.Close();
                }

                return $"/{folder}/{fileName}".Replace("\\", "/");
            });
        }
        public async Task<string> SaveImageAsync(IFormFile imageFile, string folder = "images")
        {
            var folderPath = Path.Combine(_env.WebRootPath, folder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            return $"/{folder}/{fileName}".Replace("\\", "/"); // Return relative path
        }
        public async Task<ImportAssetResult> ImportAssetsFromExcelAsync(IFormFile file)
        {
            var result = new ImportAssetResult();
            var assetList = new List<AssetCreateDTO>();

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];

            for (int row = 2; row <= worksheet.Dimension.Rows; row++)
            {
                try
                {
                    var asset = new AssetCreateDTO
                    {
                        TemplateID = int.Parse(worksheet.Cells[row, 1].Text),
                        SerialNumber = worksheet.Cells[row, 2].Text,
                        PurchaseDate = DateTime.TryParse(worksheet.Cells[row, 3].Text, out var pd) ? pd : null,
                        WarrantyExpiry = DateTime.TryParse(worksheet.Cells[row, 4].Text, out var we) ? we : null,
                        StatusID = int.TryParse(worksheet.Cells[row, 5].Text, out var s) ? s : null,
                        LocationID = int.TryParse(worksheet.Cells[row, 6].Text, out var l) ? l : null,
                        OriginID = int.TryParse(worksheet.Cells[row, 7].Text, out var o) ? o : null
                    };

                    assetList.Add(asset);
                }
                catch (Exception ex)
                {
                    result.FailedCount++;
                    result.FailedMessages.Add($"Row {row}: {ex.Message}");
                }
            }

            if (!assetList.Any())
            {
                result.FailedMessages.Add("No valid asset data found.");
                return result;
            }

            try
            {
                var client = _httpClientFactory.CreateClient("VCV_API");

                // Gắn lại Bearer token từ request gốc
                var tokenHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
                if (!string.IsNullOrEmpty(tokenHeader) && tokenHeader.StartsWith("Bearer "))
                {
                    var tokenValue = tokenHeader.Replace("Bearer ", "");

                    client.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokenValue);

                    Console.WriteLine("VCV_API Bearer Token:");
                    Console.WriteLine(tokenValue);
                }

                var response = await client.PostAsJsonAsync("api/Assets/CreateAssets", assetList);

                if (response.IsSuccessStatusCode)
                {
                    var createdAssets = await response.Content.ReadFromJsonAsync<List<object>>();
                    result.SuccessCount = createdAssets?.Count ?? 0;
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    result.FailedCount += assetList.Count;
                    result.FailedMessages.Add($"VCV_API error: {error}");
                }
            }
            catch (Exception ex)
            {
                result.FailedCount += assetList.Count;
                result.FailedMessages.Add($"Error calling VCV_API: {ex.Message}");
            }

            return result;
        }
    }
}
