export interface AssetInput {
    templateName: string;
    serialNumber: string;
    purchaseDate?: string | null;
    warrantyExpiry?: string | null;
    status: string;
    location: string;
  }
  
  export interface AssetMapped {
    TemplateID?: number;
    SerialNumber: string;
    PurchaseDate: string | null;
    WarrantyExpiry: string | null;
    StatusID?: number;
    LocationID?: number;
  }
  
  export interface LookupLists {
    templates: { templateID: number; templateName: string }[];
    statuses: { statusID: number; statusName: string }[];
    locations: { locationID: number; locationName: string }[];
  }
  