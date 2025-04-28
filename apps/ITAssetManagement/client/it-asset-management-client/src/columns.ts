import { ColumnType } from "antd/es/table";

export const assetColumn = (data: any[]): ColumnType<any>[] => {
  const locationFilters = Array.from(
    new Set(data.map((item) => item.location?.locationName))
  )
    .filter(Boolean)
    .map((name) => ({ text: name, value: name }));

  const statusFilters = Array.from(
    new Set(data.map((item) => item.status?.statusName))
  )
    .filter(Boolean)
    .map((name) => ({ text: name, value: name }));

  const assetNameFilters = Array.from(
    new Set(data.map((item) => item.template?.templateName))
  )
    .filter(Boolean)
    .map((name) => ({ text: name, value: name }));

  return [
    {
      title: "Asset Tag",
      dataIndex: "assetTag",
      key: "assetTag",
      sorter: (a, b) => a.assetTag.localeCompare(b.assetTag),
      onFilter: (value, record) => record.assetTag.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.assetTag))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Asset Name",
      dataIndex: ["templateName"],
      key: "templateName",
      onFilter: (value, record) =>
        record.template?.templateName.includes(value),
      filterSearch: true,
      filters: assetNameFilters,
      sorter: (a, b) =>
        (a.template?.templateName || "").localeCompare(
          b.template?.templateName || ""
        ),
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime(),
    },
    {
      title: "Warranty Expiry",
      dataIndex: "warrantyExpiry",
      key: "warrantyExpiry",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.warrantyExpiry).getTime() -
        new Date(b.warrantyExpiry).getTime(),
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      sorter: (a, b) => a.statusName.localeCompare(b.statusName),
      onFilter: (value, record) => record.statusName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.statusName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Location",
      dataIndex: "locationName",
      key: "locationName",
      sorter: (a, b) => a.locationName.localeCompare(b.locationName),
      onFilter: (value, record) => record.locationName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.locationName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
  ];
};
