namespace VCV_API.Models.AssetLicense
{
    public class AssetLicense
    {
        public int LicenseID { get; set; }
        public string? LicenseKey { get; set; }
        public string? SoftwareName { get; set; }
        public string? LicenseType { get; set; }
        public string? PurchaseDate { get; set; }
        public string? ExpiryDate { get; set; }
        public string? AssignmentType { get; set; }
        public string? MaxSeats { get; set; }
        public string? Notes { get; set; }
        public string? AssignedBy { get; set; }
        public string? AssignedDate { get; set; }
    }
}
