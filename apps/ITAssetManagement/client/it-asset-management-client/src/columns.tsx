import { ColumnType } from "antd/es/table";
import { formatDate } from "./utils"; // Adjust the import path as necessary
import { DatePicker, Button, Tag } from "antd";
import dayjs from "dayjs";

export const assetColumn = (data: any[]): ColumnType<any>[] => {
  return [
    {
      title: "Asset Tag",
      dataIndex: "assetTag",
      key: "assetTag",
      width: 150,
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
      width: 150,
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
      title: "Origin",
      dataIndex: "originName",
      key: "originName",
      width: 100,
      sorter: (a, b) => a.originName.localeCompare(b.originName),
      onFilter: (value, record) => record.originName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.originName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Managed By",
      dataIndex: "companyNameShort",
      key: "companyNameShort",
      width: 150,
      sorter: (a, b) => a.companyNameShort.localeCompare(b.companyNameShort),
      onFilter: (value, record) => record.companyNameShort.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.companyNameShort))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Location",
      dataIndex: "locationName",
      key: "locationName",
      width: 150,
      sorter: (a, b) => a.locationName.localeCompare(b.locationName),
      onFilter: (value, record) => record.locationName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.locationName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      width: 100,
      sorter: (a, b) => a.statusName.localeCompare(b.statusName),
      onFilter: (value, record) => record.statusName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.statusName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
  ];
};

export const assetAssignmentColumn = (data: any[]): ColumnType<any>[] => {
  return [
    {
      title: "Assignment Code",
      dataIndex: "assignmentCode",
      key: "assignmentCode",
      sorter: (a, b) => a.assignmentCode.localeCompare(b.assignmentCode),
      onFilter: (value, record) => record.assignmentCode.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.assignmentCode))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Employee Code",
      dataIndex: ["employeeCode"],
      key: "employeeCode",
      sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
      onFilter: (value, record) => record.employeeCode.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.employeeCode))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Employee Name",
      dataIndex: ["employeeName"],
      key: "employeeName",
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
      onFilter: (value, record) => record.employeeName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.employeeName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
      width: 200,
      onFilter: (value, record) => record.departmentName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.departmentName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Assignment Date",
      dataIndex: "assignmentDate",
      key: "assignmentDate",
      render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD") : ""),
      sorter: (a, b) =>
        new Date(a.assignmentDate).getTime() - new Date(b.assignmentDate).getTime(),
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
        const recordDate = dayjs(record.assignmentDate).format("YYYY-MM-DD");
        return recordDate === value;
      },
    },
    {
      title: "Assignment Action",
      dataIndex: "assignmentAction",
      key: "assignmentAction",
      width: 200,
      onFilter: (value, record) => record.assignmentAction.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.assignmentAction))).map(
        (tag) => ({ text: tag, value: tag })
      ),
      render: (text: string) => {
        const statusColor = text === "Assign" ? "green" : "red";
        return (
          <Tag color={statusColor} style={{ marginRight: 8 }}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: "Assign Status",
      dataIndex: "assignStatus",
      key: "assignStatus",
      width: 200,
      onFilter: (value, record) => record.assignStatus.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.assignStatus))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
  ];
}

export const assetUnUsedColumn = (data: any[]): ColumnType<any>[] => {
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
      dataIndex: "templateName",
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
  ];
}

export const assetTemplateColumn = (data: any[]): ColumnType<any>[] => {
  return [
    {
      title: "Type",
      dataIndex: "typeName",
      key: "typeName",
      width: 150,
      sorter: (a, b) => a.typeName.localeCompare(b.typeName),
      onFilter: (value, record) => record.typeName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.typeName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      sorter: (a, b) => a.templateName.localeCompare(b.templateName),
      onFilter: (value, record) => record.templateName.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.templateName))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model.localeCompare(b.model),
      onFilter: (value, record) => record.model.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.model))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      width: 200,
      onFilter: (value, record) => record.manufacturer.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.manufacturer))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Warranty Months",
      dataIndex: "defaultWarrantyMonths",
      key: "defaultWarrantyMonths",
      width: 200,
      onFilter: (value, record) => record.defaultWarrantyMonths.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.defaultWarrantyMonths))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 200,
      onFilter: (value, record) => record.unit.includes(value),
      filterSearch: true,
      filters: Array.from(new Set(data.map((item) => item.unit))).map(
        (tag) => ({ text: tag, value: tag })
      ),
    },
  ];
}