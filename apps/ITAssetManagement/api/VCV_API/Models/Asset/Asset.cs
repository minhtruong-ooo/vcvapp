namespace VCV_API.Models.Asset
{
    public class Asset
    {
        public int AssetID { get; set; }

        public string AssetTag { get; set; } = string.Empty;

        public int TemplateID { get; set; }

        public string? TemplateName { get; set; }

        public string? SerialNumber { get; set; }

        public DateTime? PurchaseDate { get; set; }

        public DateTime? WarrantyExpiry { get; set; }

        public int? StatusID { get; set; }
        public string? StatusName { get; set; }

        public int? LocationID { get; set; }
        public string? LocationName { get; set; }

        public int? AssignedTo { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
