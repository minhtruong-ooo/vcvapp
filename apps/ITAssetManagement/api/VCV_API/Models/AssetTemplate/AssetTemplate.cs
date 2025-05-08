namespace VCV_API.Models.AssetTemplate
{
    public class AssetTemplate
    {
        public int TemplateID { get; set; }
        public string? TemplateName { get; set; }
        public int AssetTypeID { get; set; }
        public string? Model { get; set; }
        public string? Manufacturer { get; set; }
        public int? DefaultWarrantyMonths { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Unit { get; set; }

    }
}
