import { useState } from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { FileUploader } from "../../src/components/upload/FileUploader";
import { UploadFile } from "../../src/components/upload/types";

const GB = 1024 * 1024 * 1024;

type TestUploaderProps = {
  multiple?: boolean;
  initialFiles?: UploadFile[];
};

/**
 * Stateful uploader for Playwright CT: added files are appended as "done" and
 * removable. State lives here (browser side) because CT cannot bridge
 * callbacks from the test file.
 */
export const TestUploader = ({
  multiple = true,
  initialFiles = [],
}: TestUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>(initialFiles);
  return (
    <CunninghamProvider currentLocale="en-US">
      <FileUploader
        multiple={multiple}
        maxSize={5 * GB}
        files={files}
        onAddFiles={(added) =>
          setFiles((prev) => [
            ...prev,
            ...added.map((f, i) => ({
              id: `${prev.length + i}`,
              name: f.name,
              size: f.size,
              type: f.type,
              status: "done" as const,
            })),
          ])
        }
        onRemoveFile={(file) =>
          setFiles((prev) => prev.filter((f) => f.id !== file.id))
        }
      />
    </CunninghamProvider>
  );
};

/** Controlled uploader for rendering static states (no internal state). */
export const TestUploaderStatic = ({
  multiple = false,
  files = [],
}: {
  multiple?: boolean;
  files?: UploadFile[];
}) => (
  <CunninghamProvider currentLocale="en-US">
    <FileUploader multiple={multiple} maxSize={5 * GB} files={files} />
  </CunninghamProvider>
);
