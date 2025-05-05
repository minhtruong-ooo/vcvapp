using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
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
using iText.Kernel.Pdf.Canvas;
namespace MediaService.Services
{
    public class MediaService : IMediaService
    {
        private readonly IWebHostEnvironment _env;


        public MediaService(IWebHostEnvironment env)
        {
            _env = env;
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

                var pageSize = new PageSize(212.6f, 42.5f);
                string fontPath = Path.Combine(_env.WebRootPath, "fonts", "calibri.ttf");
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
                            QRCodeData qrCodeData = qrGenerator.CreateQrCode(item.AssetURL.ToString(), QRCodeGenerator.ECCLevel.Q);
                            using (var qrCode = new PngByteQRCode(qrCodeData))
                            {
                                byte[] qrBytes = qrCode.GetGraphic(20);

                                // Add QR code image to PDF
                                Image qrImage = new Image(ImageDataFactory.Create(qrBytes));
                                qrImage.ScaleToFit(40, 40);

                                // Create text paragraph
                                Paragraph para = new Paragraph()
                                    .Add($"VCV - IT Asset Management Label\n")
                                    .Add($"Asset Tag: {item.AssetTag}\n")
                                    .Add($"Asset Name: {item.AssetName}\n")
                                    .Add($"Handover Date: {item.PurchaseDate}")
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
                                    .SetVerticalAlignment(VerticalAlignment.MIDDLE);

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
            var folderPath = System.IO.Path.Combine(_env.WebRootPath, folder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}{System.IO.Path.GetExtension(imageFile.FileName)}";
            var filePath = System.IO.Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            return $"/{folder}/{fileName}".Replace("\\", "/"); // Return relative path
        }



    }
}
