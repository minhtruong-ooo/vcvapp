// columns.ts
import { ColumnType } from 'antd/es/table';

export const defaultColumns: ColumnType<any>[] = [
  {
    title: 'Asset Tag',
    dataIndex: 'assetTag',
    key: 'assetTag',
  },
  {
    title: 'Serial Number',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
  },
  {
    title: 'Purchase Date',
    dataIndex: 'purchaseDate',
    key: 'purchaseDate',
    render: (text: string) => new Date(text).toLocaleDateString(),
  },
  {
    title: 'Warranty Expiry',
    dataIndex: 'warrantyExpiry',
    key: 'warrantyExpiry',
    render: (text: string) => new Date(text).toLocaleDateString(),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Location',
    dataIndex: 'locationName',
    key: 'locationName',
  },
];
