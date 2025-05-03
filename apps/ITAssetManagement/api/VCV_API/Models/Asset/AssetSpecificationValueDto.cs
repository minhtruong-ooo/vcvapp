namespace VCV_API.Models.Asset
{
    public class AssetSpecificationValueDto
    {
        public int ValueID { get; set; }
        public int AssetID { get; set; }
        public int SpecificationID { get; set; }
        public string? SpecificationName { get; set; }
        public string? Unit { get; set; }
        public string? DataType { get; set; }
        public bool IsRequired { get; set; }
        public string? Value { get; set; }
    }
}
