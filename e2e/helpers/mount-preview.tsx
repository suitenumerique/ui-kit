import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { FilePreview } from "../../src/components/preview/FilePreview";
import type { FilePreviewType } from "../../src/components/preview/types";
import { MenuItemAction } from ":/index";

// Playwright CT bridges function props as one-way dispatchers whose return
// value is always `undefined`, so render props can't be passed from the test
// file. Tests declare scenarios via plain data and this helper (which runs in
// the browser) builds the actual render-prop functions locally.
type CustomHeaderActionsMode = "wrap" | "replace";

interface TestFilePreviewProps {
  files: FilePreviewType[];
  initialIndexFile?: number;
  handleDownloadFile?: (file?: FilePreviewType) => void;
  onClose?: () => void;
  customHeaderActionsMode?: CustomHeaderActionsMode;
  extraMenuOptions?: MenuItemAction[];
}

export const TestFilePreview = ({
  files,
  initialIndexFile = 0,
  handleDownloadFile,
  onClose,
  customHeaderActionsMode,
  extraMenuOptions,
}: TestFilePreviewProps) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const openedFileId = files[initialIndexFile]?.id;

  const customHeaderActions =
    customHeaderActionsMode === "wrap"
      ? (headerActions: React.ReactNode) => (
          <>
            <button data-testid="custom-before">Before</button>
            {headerActions}
            <button data-testid="custom-after">After</button>
          </>
        )
      : customHeaderActionsMode === "replace"
        ? () => <button data-testid="custom-only">Only custom</button>
        : undefined;

  const headerActionsMenuOptions = extraMenuOptions
    ? () => extraMenuOptions
    : undefined;

  return (
    <QueryClientProvider client={queryClient}>
      <CunninghamProvider currentLocale="en-US">
        <FilePreview
          isOpen={true}
          files={files}
          openedFileId={openedFileId}
          pdfWorkerSrc="/pdf.worker.mjs"
          handleDownloadFile={handleDownloadFile}
          onClose={onClose}
          customHeaderActions={customHeaderActions}
          headerActionsMenuOptions={headerActionsMenuOptions}
        />
      </CunninghamProvider>
    </QueryClientProvider>
  );
};
