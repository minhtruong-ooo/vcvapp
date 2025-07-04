namespace VCV_API.Models.Asset
{
    public class DeleteAssetsResult
    {
        public int DeletedCount { get; set; }
        public List<string> NotDeletedAssetTags { get; set; }
    }
}
