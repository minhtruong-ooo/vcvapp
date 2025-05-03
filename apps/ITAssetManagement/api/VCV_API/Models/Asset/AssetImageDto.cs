namespace VCV_API.Models.Asset
{
    public class AssetImageDto
    {
        public int ImageID { get; set; }
        public int AssetID { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public string? UploadedBy { get; set; }
        public DateTime? UploadedAt { get; set; }
    }
}
