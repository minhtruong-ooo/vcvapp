export interface Asset {
  assetID: number;
  assetTag: string;
  templateID: number;
  templateName: string;
  typeName: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string | null;
  warrantyExpiry: string | null;
  statusID: number;
  statusName: string;
  locationID: number;
  locationName: string;
  createdAt: string;
  updatedAt: string;
  specifications: Specification[];
  images: AssetImage[];
}

export interface Specification {
  valueID: number;
  assetID: number;
  specificationID: number;
  specificationName: string;
  unit: string | null;
  dataType: string;
  isRequired: boolean;
  value: string;
}

export interface AssetImage {
  imageID: number;
  assetID: number;
  imageUrl: string;
  description: string | null;
  uploadedBy: string;
  updatedAt: string;
}

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
