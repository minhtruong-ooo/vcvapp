using System.ComponentModel.DataAnnotations;

namespace VCV_API.Models
{
    public class AssetTemplate
    {
        [Key]
        public int TemplateID { get; set; }
        public string? TemplateName { get; set; }
        public int AssetTypeID { get; set; }
        public string? Model { get; set; }
        public string? Manufacturer { get; set; }
        public int? DefaultWarrantyMonths { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }

        public AssetType? AssetType { get; set; }  // Navigation Property
    }
}
