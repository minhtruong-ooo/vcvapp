using System.ComponentModel.DataAnnotations;

namespace VCV_API.Models
{
    public class Location
    {
        [Key]
        public int LocationID { get; set; }

        [Required]
        [MaxLength(100)]
        public string? LocationName { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }
    }
}
