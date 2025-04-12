using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace VCV_API.Models
{
    public class Asset
    {
        [Key]
        public int AssetID { get; set; }

        [Required]
        [MaxLength(20)]
        public string AssetTag { get; set; } = string.Empty;

        [Required]
        public int TemplateID { get; set; }

        [MaxLength(100)]
        public string? SerialNumber { get; set; }

        public DateTime? PurchaseDate { get; set; }

        public DateTime? WarrantyExpiry { get; set; }

        public int? StatusID { get; set; }

        public int? LocationID { get; set; }

        public int? AssignedTo { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // 👉 Navigation Properties (nếu cần)
        [ForeignKey("TemplateID")]
        public AssetTemplate? Template { get; set; }

        [ForeignKey("StatusID")]
        public AssetStatus? Status { get; set; }

        [ForeignKey("LocationID")]
        public Location? Location { get; set; }
    }
}
