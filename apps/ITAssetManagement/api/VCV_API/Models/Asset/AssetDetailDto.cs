using VCV_API.Models.AssetAssignment;

namespace VCV_API.Models.Asset
{
    public class AssetDetailDto
    {
        public int AssetID { get; set; }
        public string? AssetTag { get; set; }
        public int TemplateID { get; set; }
        public string? TemplateName { get; set; }
        public string? TypeName { get; set; }
        public string? Manufacturer { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public string? PurchaseDate { get; set; }
        public string? WarrantyExpiry { get; set; }
        public int StatusID { get; set; }
        public string? StatusName { get; set; }
        public int LocationID { get; set; }
        public string? LocationName { get; set; }
        public int? CompanyID { get; set; }
        public string? CompanyName { get; set; }
        public int? OriginID { get; set; }
        public string? OriginName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Unit { get; set; }


        public List<AssetSpecificationValueDto> Specifications { get; set; } = new();
        public List<AssetImageDto> Images { get; set; } = new();
        public List<AssetAssignmentCurrent> AssignmentsCurrent { get; set; } = new();
        public List<AssetLicense.AssetLicense> Licenses { get; set; } = new();
        public List<AssetHistory.AssetHistory> History { get; set; } = new();
        public List<AssetAssignmentHistory> AssignmentsHistory { get; set; } = new();
    }
}
