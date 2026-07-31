import { useEffect } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import {
  ShareImportModal,
  ShareImportRow,
} from "../../src/components/share/import-modal/ShareImportModal";

// Playwright CT bridges function props as one-way dispatchers, so tests
// describe scenarios with plain serializable data and this helper — which runs
// in the browser — builds the real callbacks locally. Callback invocations are
// recorded on `window.__shareImportCalls` so tests can assert them via
// `page.evaluate`.

declare global {
  interface Window {
    __shareImportCalls: { name: string; rows?: ShareImportRow[] }[];
  }
}

const useCallRecorder = () => {
  useEffect(() => {
    window.__shareImportCalls = [];
  }, []);
  return (name: string, rows?: ShareImportRow[]) =>
    window.__shareImportCalls.push({ name, rows });
};

interface TestShareImportModalProps {
  title?: string;
  description?: string;
  maxRows?: number;
  /** Registers an onDownloadTemplate handler recorded as "download-template". */
  withDownloadTemplate?: boolean;
}

export const TestShareImportModal = ({
  title,
  description,
  maxRows,
  withDownloadTemplate,
}: TestShareImportModalProps) => {
  const record = useCallRecorder();
  return (
    <CunninghamProvider currentLocale="en-US">
      <ShareImportModal
        isOpen={true}
        onClose={() => record("close")}
        title={title}
        description={description}
        maxRows={maxRows}
        onDownloadTemplate={
          withDownloadTemplate ? () => record("download-template") : undefined
        }
        onImport={(rows) => record("import", rows)}
      />
    </CunninghamProvider>
  );
};
