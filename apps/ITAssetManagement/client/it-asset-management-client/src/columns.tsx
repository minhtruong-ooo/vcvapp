import { ColumnType } from "antd/es/table";
import { formatDate } from "./utils"; // Adjust the import path as necessary
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

export const assetColumn = (data: any[]): ColumnType<any>[] => {
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
      sorter: (a, b) => a.templateName.localeCompare(b.templateName),
      onFilter: (value, record) => record.templateName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.templateName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 200,
      onFilter: (value, record) => record.serialNumber.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.serialNumber))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD") : ""),
      sorter: (a, b) =>
        new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime(),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <DatePicker
            onChange={(date) => {
              const formatted = date ? date.format("YYYY-MM-DD") : "";
              setSelectedKeys(formatted ? [formatted] : []);
            }}
            value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : null}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: "100%", marginBottom: 4 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              if (clearFilters) {
                clearFilters();
              }
              confirm();
            }}
            size="small"
            style={{ width: "100%" }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const recordDate = dayjs(record.purchaseDate).format("YYYY-MM-DD");
        return recordDate === value;
      },
    },
    {
      title: "Warranty Expiry",
      dataIndex: "warrantyExpiry",
      key: "warrantyExpiry",
      render: (text: string) => formatDate(text),
      sorter: (a, b) =>
        new Date(a.warrantyExpiry).getTime() -
        new Date(b.warrantyExpiry).getTime(),
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      width: 150,
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
      width: 200,
      sorter: (a, b) => a.locationName.localeCompare(b.locationName),
      onFilter: (value, record) => record.locationName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.locationName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
  ];
};
