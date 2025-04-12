using System.ComponentModel.DataAnnotations;

namespace VCV_API.Models
{
    public class AssetType
    {
        [Key]
        public int AssetTypeID { get; set; }
        public string? TypeName { get; set; }
    }

}
