namespace VCV_API.Models.AssetAssignment
{
    public class AssetAssignmentDetail
    {
        public int DetailID { get; set; }
        public int AssetID { get; set; }
        public int AssignmentID { get; set; }
        public string? AssetTag { get; set; }
        public int TemplateID { get; set; }
        public string? TemplateName { get; set; }
        public string? SerialNumber { get; set; }
        public string? Unit { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}
