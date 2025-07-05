import { Dropdown, } from 'antd';

const ActionsDropdown = ({ onImport, onExport, onDownloadTemplate }: any) => {
  const items = [
    {
      key: '1',
      label: 'Import from Excel',
    },
    {
      key: '2',
      label: 'Export to Excel',
    },
    {
      key: '3',
      label: 'Download Template',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        onImport();
        break;
      case '2':
        onExport();
        break;
      case '3':
        onDownloadTemplate();
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown.Button
      menu={{ items, onClick: handleMenuClick }}
      type="default"
    >
      Actions
    </Dropdown.Button>
  );
};

export default ActionsDropdown;
