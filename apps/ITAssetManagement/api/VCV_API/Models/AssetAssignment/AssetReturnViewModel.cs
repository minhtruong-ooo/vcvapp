namespace VCV_API.Models.AssetAssignment
{
    public class AssetReturnViewModel
    {
        public int AssetID { get; set; }

        public string AssetTag { get; set; } = string.Empty;

        public int? DetailID { get; set; }

        public int TemplateID { get; set; }

        public string? TemplateName { get; set; }

        public string? SerialNumber { get; set; }
    }
}
