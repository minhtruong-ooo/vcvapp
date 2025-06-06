﻿namespace VCV_API.Models.Asset
{
    public class AssetCreateDto
    {
        public int TemplateID { get; set; }
        public string? SerialNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? WarrantyExpiry { get; set; }
        public int? StatusID { get; set; }
        public int? LocationID { get; set; }
        public string? ChangeBy { get; set; }
    }
}
