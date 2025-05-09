namespace VCV_API.Models.AssetAssignment
{
    public class AssetAssignmentModel
    {
        public int AssignmentID { get; set; }
        public string? AssignmentCode { get; set; }
        public int? EmployeeID { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeCode { get; set; }
        public string? DepartmentName { get; set; }
        public string? AssignmentAction { get; set; }
        public DateTime? AssignmentDate { get; set; }
        public string? Notes { get; set; }
        public int? AssignmentBy { get; set; }
        public string? AssignmentByName { get; set; }
        public string? AssignStatus { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }
}
