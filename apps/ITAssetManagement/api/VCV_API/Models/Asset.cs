using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace VCV_API.Models
{
    public class Asset
    {
        [Key]
        public int AssetID { get; set; }

        public string AssetTag { get; set; } = string.Empty;

        public int TemplateID { get; set; }

        public string? SerialNumber { get; set; }

        public DateTime? PurchaseDate { get; set; }

        public DateTime? WarrantyExpiry { get; set; }

        public int? StatusID { get; set; }

        public int? LocationID { get; set; }

        public int? AssignedTo { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        [ForeignKey("TemplateID")]
        public AssetTemplate? Template { get; set; }

        [ForeignKey("StatusID")]
        public AssetStatus? Status { get; set; }

        [ForeignKey("LocationID")]
        public Location? Location { get; set; }
    }
}
