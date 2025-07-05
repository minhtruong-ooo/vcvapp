namespace MediaService.Models
{
    public class ImportAssetResult
    {
        public int SuccessCount { get; set; }
        public int FailedCount { get; set; }
        public List<string> FailedMessages { get; set; } = new();
    }
}
