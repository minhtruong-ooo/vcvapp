import dayjs from "dayjs";
import { AssetInput, AssetMapped, LookupLists } from "./interfaces";

export class AssetMapper {
  constructor(private lookups: LookupLists) {}

  public map(asset: AssetInput): AssetMapped {
    const { templates, statuses, locations } = this.lookups;
    return {
      TemplateID: templates.find((t) => t.templateID === asset.templateID)
        ?.templateID,
      SerialNumber: asset.serialNumber,
      PurchaseDate: asset.purchaseDate
        ? dayjs(asset.purchaseDate).format("YYYY-MM-DD")
        : null,
      WarrantyExpiry: asset.warrantyExpiry
        ? dayjs(asset.warrantyExpiry).format("YYYY-MM-DD")
        : null,
      StatusID: statuses.find((s) => s.statusName === asset.status)?.statusID,
      LocationID: locations.find((l) => l.locationName === asset.location)
        ?.locationID,
      ChangeBy: asset.changeBy,
    };
  }

  public mapMany(assets: AssetInput[]): AssetMapped[] {
    return assets.map((a) => this.map(a));
  }
}
