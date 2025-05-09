namespace VCV_API.Models.AssetAssignment
{
    public class AssetAssignmentHistory
    {
        public int AssignmentID { get; set; }
        public string? AssignmentCode { get; set; }
        public string? AssignmentAction { get; set; }
        public string? AssignmentDate { get; set; }
        public string? AssignedToName { get; set; }
        public string? AssignedByName { get; set; }
        public string? AssignStatus { get; set; }
        public string? Notes { get; set; }
    }
}
