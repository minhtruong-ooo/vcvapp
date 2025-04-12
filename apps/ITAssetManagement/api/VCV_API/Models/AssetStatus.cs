using System.ComponentModel.DataAnnotations;

namespace VCV_API.Models
{
    public class AssetStatus
    {
        [Key]
        public int StatusID { get; set; }
        public string? StatusName { get; set; }
    }
}
