namespace VCV_API.Models.AssetAssignment
{
    public class AssetAsignmentDto
    {
        public int AssignmentID { get; set; }
        public string? AssignmentCode { get; set; }
        public int EmployeeID { get; set; }
        public string? EmployeeName { get; set; }
        public int AssignmentBy { get; set; }
        public string? AssignmentByName { get; set; }
        public string? AssignmentAction { get; set; } // e.g., "Assign", "Return"

        public DateTime AssignmentDate { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string? AssignStatus { get; set; } // e.g., "Assigned", "Returned", "Pending"
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }


        public List<AssetAssignmentDetail> AssetAssignments { get; set; } = new();
    }
}
