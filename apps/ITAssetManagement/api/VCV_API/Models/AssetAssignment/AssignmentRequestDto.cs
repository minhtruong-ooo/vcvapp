namespace VCV_API.Models.AssetAssignment
{
    public class AssignmentRequestDto
    {
        public int EmployeeId { get; set; }
        public int AssignmentBy { get; set; }
        public string? Notes { get; set; }
        public string? AssignmentAction { get; set; }
        public List<int>? Assets { get; set; }
    }
}
