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
  originID: number;
  originName: string;
  companyID: number | null;
  companyName: string | null;
  locationID: number;
  locationName: string;
  createdAt: string;
  updatedAt: string;
  unit: string | null;
  specifications: Specification[];
  images: AssetImage[];
  assignmentsCurrent: AssetAssignment[];
  licenses: AssetLicense[];
  history: AssetHistory[];
  assignmentsHistory: AssetAssignmentHistory[];
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

export interface AssetAssignment {
  employeeCode: string;
  fullName: string;
  avatar: string;
  departmentName: string;
  assignmentDate: string;
}


 
export interface AssetLicense {
  licenseKey: number;
  softwareName: string;
  licenseType: string;
  purchaseDate: string | null;
  expiryDate: string | null;
  assignedBy: string;
  assignedDate: string | null;
}

export interface AssetHistory {
  historyID: number;
  assetID: number;
  actionType: string;
  changeDate: string;
  changedBy: string;
  fieldChanged: string;
  oldValue: string | null;
  newValue: string;
  note: string | null;
}

export interface AssetAssignmentHistory {
  assignmentID : number;
  assignmentCode : string;
  assignmentAction : string;
  assignmentDate : string;
  assignedToName : string;
  assignedByName : string;
  assignStatus : string;
  notes : string | null;
}

export interface AssetMapped {
  TemplateID?: number;
  SerialNumber: string;
  PurchaseDate: string | null;
  WarrantyExpiry: string | null;
  StatusID?: number;
  LocationID?: number;
  OriginID?: number;
  ChangeBy: string;
}

export interface LookupLists {
  templates: { templateID: number; templateName: string }[];
  statuses: { statusID: number; statusName: string }[];
  locations: { locationID: number; locationName: string }[];
  origins: { originID: number; originName: string }[];
}

export interface AssetInput {
  templateID: number;
  serialNumber: string;
  purchaseDate?: string | null;
  warrantyExpiry?: string | null;
  status: string;
  location: string;
  origin: string;
  changeBy: string;
}

export interface CreateAssignmentPayload {
  employeeId: number;
  notes: string;
  assignmentAction: string;
  assets: AssetItem[];
  assignmentBy: number;
}

interface AssetItem {
  assetID: number;
  detailID: number | null;
}



export interface EmployeeSingle {
  employeeInfo: string;
}

export interface AssetSpecificationDto {
  specificationID: number;
  specificationName: string;
  dataType: string | null;
  isRequired: boolean;
}


export interface AssetAssignmentDto {
  assignmentID: number;
  assignmentCode: string;
  employeeID: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  assignerCode: string;
  assignmentBy: number;
  assignmentByName: string;
  assignerDepartment: string;
  assignmentAction: string;
  assignmentDate: string;
  notes: string | null;
  assignStatus: string;
  createAt: string;
  updateAt: string;
  assetAssignments: AssetAssignmentItem[];
  employeeInfomation: AssetAssignment[];
}

export interface AssetAssignmentPrintModel {
  assignmentCode: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  assignerCode: string;
  assignmentBy: number;
  assignmentByName: string;
  assignerDepartment: string;
  assignmentAction: string;
  assignmentDate: string;
  notes: string | null;
  assignStatus: string;
  assetAssignments: AssetAssignmentItem[];
}

export interface AssetAssignmentItem {
  detailID: number;
  assetID: number | null;
  assignmentID: number | null;
  assetTag: string;
  templateName: string;
  serialNumber: string;
  unit: string | null;
  quantity: string | "1";
}