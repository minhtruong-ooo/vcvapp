namespace VCV_API.Models.AssetHistory
{
    public class AssetHistory
    {
        public int HistoryID { get; set; }
        public int AssetID { get; set; }
        public string? ActionType { get; set; }
        public string? ChangeDate { get; set; }
        public string? ChangedBy { get; set; }
        public string? FieldChanged { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string? Note { get; set; }
    }
}
