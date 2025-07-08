// TableTransfer.tsx
import { useState } from 'react';
import type { TableProps } from 'antd';
import { Table, Transfer } from 'antd';
import type { TransferItem } from 'antd/es/transfer';

interface AssetItem extends TransferItem {
  assetID: string;
  assetTag: string;
  templateName: string;
  serialNumber: string;
}

interface TableTransferProps {
  dataSource: AssetItem[];
  targetKeys: string[];
  onChange: (nextTargetKeys: string[]) => void;
  titles: [string, string];
}

const TableTransfer: React.FC<TableTransferProps> = ({
  dataSource,
  targetKeys,
  onChange,
  titles
}) => {
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState<string[]>([]);
  const [targetSelectedKeys, setTargetSelectedKeys] = useState<string[]>([]);

  const columns = [
    { title: 'Asset Tag', dataIndex: 'assetTag', width: 100 },
    { title: 'Asset Name', dataIndex: 'templateName', width: 300 },
    { title: 'Serial Number', dataIndex: 'serialNumber', width: 200 },
  ];


  return (
    <Transfer
      dataSource={dataSource}
      titles={titles}
      targetKeys={targetKeys}
      onChange={(nextTargetKeys) => {
        onChange(nextTargetKeys.map((key) => String(key)));
        setSourceSelectedKeys([]);
        setTargetSelectedKeys([]);
      }}
      onSelectChange={(sourceKeys: React.Key[], targetKeys: React.Key[]) => {
        const sourceKeysAsString: string[] = sourceKeys.map((key) => String(key));
        const targetKeysAsString: string[] = targetKeys.map((key) => String(key));
        setSourceSelectedKeys(sourceKeysAsString);
        setTargetSelectedKeys(targetKeysAsString);
      }}
      showSearch
      showSelectAll={false}
      filterOption={(inputValue, item) =>
        item.assetTag?.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.templateName?.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.serialNumber?.toLowerCase().includes(inputValue.toLowerCase())
      }
      rowKey={(record) => record.assetID} // Đổi sang assetID
      render={(item) => item.assetID} // Hiển thị assetID
      listStyle={{ width: '48%', height: 300 }}
      style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      operations={["Add", "Remove"]}
    >
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
      }) => {
        const rowSelection: TableProps<AssetItem>['rowSelection'] = {
          selectedRowKeys: direction === 'left' ? sourceSelectedKeys : targetSelectedKeys,
          onChange: (selectedRowKeys: React.Key[]) => {
            const stringKeys: string[] = selectedRowKeys.map((key) => String(key))
            if (direction === 'left') {
              setSourceSelectedKeys(stringKeys);
            } else {
              setTargetSelectedKeys(stringKeys);
            }
          },
          onSelect: (record: AssetItem, selected: boolean) => {
            onItemSelect(record.assetID, selected);
            if (direction === 'left') {
              setSourceSelectedKeys((prev) =>
                selected
                  ? [...prev, record.assetID]
                  : prev.filter((key) => key !== record.assetID)
              );
            } else {
              setTargetSelectedKeys((prev) =>
                selected
                  ? [...prev, record.assetID]
                  : prev.filter((key) => key !== record.assetID)
              );
            }
          },
          onSelectAll: (selected: boolean, changeRows: AssetItem[]) => {
            const keys = changeRows.map((item) => item.assetID); // phải dùng changeRows chứ không phải selectedRows
            onItemSelectAll(keys, selected);

            if (direction === 'left') {
              setSourceSelectedKeys((prev) => {
                return selected
                  ? Array.from(new Set([...prev, ...keys]))
                  : prev.filter((key) => !keys.includes(key));
              });
            } else {
              setTargetSelectedKeys((prev) => {
                return selected
                  ? Array.from(new Set([...prev, ...keys]))
                  : prev.filter((key) => !keys.includes(key));
              });
            }
          }
        };

        return (
          <>
            <div style={{height: 200, overflowY: 'auto', width: '100%'}}>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredItems as AssetItem[]}
                size="small"
                rowKey="assetID" // Đảm bảo là 'assetID'
                pagination={false}
                style={{ width: '100%' }}
                scroll={{ y: "100%", x: "100%" }} // giữ table nằm trong vùng height đã định
              />

            </div>

          </>


        );
      }}
    </Transfer>
  );
};

export default TableTransfer;