namespace VCV_API.Models.AssetSpec
{
    public class AssetSpecModel
    {
        public int? SpecificationID { get; set; }
        public string? SpecificationName { get; set; }
        public string? DataType { get; set; }
        public string? Unit {  get; set; }
        public bool? IsRequired { get; set; }
    }
}
