namespace VCV_API.Models.AssetAssignment
{
    public class AssetAssignmentHistory
    {
        public int AssignmentID { get; set; }
        public string? AssignmentCode { get; set; }
        public string? AssetID { get; set; }
        public string? EmployeeID { get; set; }
        public string? EmployeeCode { get; set; }
        public string? FullName { get; set; }
        public string? Avatar { get; set; }
        public string? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? AssignmentAction { get; set; }
        public string? AssignmentDate { get; set; }
        public string? AssignedDate { get; set; }
        public string? AssignedToCode { get; set; }
        public string? AssignedToName { get; set; }
        public string? AssignedByName { get; set; }
        public string? AssignedByCode { get; set; }
        public string? AssignStatus { get; set; }
        public string? Notes { get; set; }
        public string? CreateBy { get; set; }
    }
}
