namespace MediaService.Models
{
    public class AssetAssignmentModel
    {
        public string? assignmentCode { get; set; }
        public string? employeeName { get; set; }
        public string? employeeCode { get; set; }
        public string? departmentName { get; set; }
        public string? assignerCode { get; set; }
        public string? assignmentByName { get; set; }
        public string? assignerDepartment { get; set; }
        public string? assignmentAction { get; set; }
        public string? assignmentDate { get; set; }
        public string? notes { get; set; }
        public List<AssetAssignment> assetAssignments { get; set; } = new();
    }
    public class AssetAssignment
    {
        public int detailID { get; set; }
        public int assetID { get; set; }
        public string? assetTag { get; set; }
        public string? templateName { get; set; }
        public string? serialNumber { get; set; }
        public string? unit { get; set; }
        public string? quantity { get; set; }
    }
}
