namespace VCV_API.Models.AssetTemplate
{
    public class AssetTemplateDTO
    {
        public int TemplateID { get; set; }
        public string? TemplateName { get; set; }
        public string? Model { get; set; }
        public string? Manufacturer { get; set; }
        public int? DefaultWarrantyMonths { get; set; }
        public string? Unit { get; set; }
    }
}
