namespace VCV_API.Models.AssetAsignment
{
    public class AssetAssignment
    {
        public int AssignmentID { get; set; }
        public string? AssetID { get; set; }
        public string? EmployeeID { get; set; }
        public string? EmployeeCode { get; set; }
        public string? FullName { get; set; }
        public string? Avatar { get; set; }
        public string? DepartmentID { get; set; }
        public string? DepartmentName { get; set; }
        public string? ActionType { get; set; }
        public string? AssignedBy { get; set; }
        public string? AssignmentDate { get; set; }
        public string? AssignedDate { get; set; }
        public string? Notes { get; set; }
        public string? Reason { get; set; }
        public string? CreateBy { get; set; }
    }
}
