// components/modals/AddAssetImportFileModal.tsx
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import { useKeycloak } from "@react-keycloak/web";
import { importAssetsFromExcel } from "../../api/mediaAPI";

const { Dragger } = Upload;

const AddAssetImportFileModal = forwardRef(({ onSuccess }: { onSuccess?: () => void }, ref) => {
  const { keycloak } = useKeycloak();
  const [file, setFile] = useState<File | null>(null);

  useImperativeHandle(ref, () => ({
    async uploadFile() {
      if (!file) {
        message.warning("Please select a file first.");
        return false;
      }

      try {
        const result = await importAssetsFromExcel(keycloak.token ?? "", file);
        message.success(`Imported ${result.successCount} assets`);
        if (result.failedCount > 0) {
          message.warning(
            `${result.failedCount} row(s) failed:\n${result.failedMessages.join("\n")}`
          );
        }

        onSuccess?.();
        setFile(null);
        return true;
      } catch (error: any) {
        console.error("❌ Import error:", error.message);
        message.error(error.message || "Import failed");
        return false;
      }
    },
  }));

  return (
    <Dragger
      multiple={false}
      beforeUpload={(file) => {
        setFile(file);
        return false;
      }}
      onRemove={() => setFile(null)}
      fileList={file ? [file as any] : []}
      customRequest={() => {}}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag Excel file (.xlsx) to upload</p>
      <p className="ant-upload-hint">Only Excel files in the correct format will be processed.</p>
    </Dragger>
  );
});

export default AddAssetImportFileModal;
