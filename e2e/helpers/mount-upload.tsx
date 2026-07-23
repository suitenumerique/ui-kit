import { useState } from "react";
import { Modal, ModalSize } from "@gouvfr-lasuite/cunningham-react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { FileUploader } from "../../src/components/form/file-uploader/FileUploader";
import { UploadFile } from "../../src/components/form/file-uploader/types";

const GB = 1000 * 1000 * 1000;

export type TestUploadFile = Omit<UploadFile, "originalFile"> & {
  name: string;
  size?: number;
  type?: string;
};

const toUploadFile = ({
  name,
  size = 0,
  type = "",
  ...uploadState
}: TestUploadFile): UploadFile => {
  const originalFile = new File([], name, { type });
  Object.defineProperty(originalFile, "size", { value: size });
  return { ...uploadState, originalFile };
};

type TestUploaderProps = {
  name?: string;
  multiple?: boolean;
  initialFiles?: TestUploadFile[];
  cancelUploads?: boolean;
};

/**
 * Stateful uploader for Playwright CT: added files are appended as "done" and
 * removable. State lives here (browser side) because CT cannot bridge
 * callbacks from the test file.
 */
export const TestUploader = ({
  name,
  multiple = true,
  initialFiles = [],
  cancelUploads = false,
}: TestUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>(() =>
    initialFiles.map(toUploadFile),
  );
  return (
    <CunninghamProvider currentLocale="en-US">
      <FileUploader
        name={name}
        multiple={multiple}
        maxSize={5 * GB}
        files={files}
        onAddFiles={setFiles}
        onRemoveFile={(file) =>
          setFiles((prev) => prev.filter((f) => f.id !== file.id))
        }
        onCancelFile={
          cancelUploads
            ? (file) => setFiles((prev) => prev.filter((f) => f.id !== file.id))
            : undefined
        }
      />
    </CunninghamProvider>
  );
};

/** Controlled uploader for rendering static states (no internal state). */
export const TestUploaderStatic = ({
  multiple = false,
  files = [],
  removable = false,
}: {
  multiple?: boolean;
  files?: TestUploadFile[];
  removable?: boolean;
}) => (
  <CunninghamProvider currentLocale="en-US">
    <FileUploader
      multiple={multiple}
      maxSize={5 * GB}
      files={files.map(toUploadFile)}
      onRemoveFile={removable ? () => undefined : undefined}
    />
  </CunninghamProvider>
);

/** Populated uploader inside a modal, used to guard against layout shifts. */
export const TestUploaderModal = () => (
  <CunninghamProvider currentLocale="en-US">
    <Modal
      isOpen
      onClose={() => undefined}
      title="Upload files"
      size={ModalSize.MEDIUM}
    >
      <div style={{ padding: 16 }}>
        <FileUploader
          multiple
          maxSize={5 * GB}
          files={[
            { id: "1", name: "first.pdf", size: 10, status: "done" as const },
            { id: "2", name: "second.pdf", size: 20, status: "done" as const },
            { id: "3", name: "third.pdf", size: 30, status: "done" as const },
            { id: "4", name: "fourth.pdf", size: 40, status: "done" as const },
          ].map(toUploadFile)}
        />
      </div>
    </Modal>
  </CunninghamProvider>
);
