namespace VCV_API.Models.AssetAssignment
{
    public class AssignmentRequestDto
    {
        public int EmployeeId { get; set; }
        public int AssignmentBy { get; set; }
        public string? Notes { get; set; }
        public DateTime? Date { get; set; }
        public string? AssignmentAction { get; set; }
        public List<AssetAssignedDetailDto>? Assets { get; set; }
    }

    public class AssetAssignedDetailDto
    {
        public int AssetID { get; set; }
        public int? DetailID { get; set; }  // nullable nếu Assign
    }
}
