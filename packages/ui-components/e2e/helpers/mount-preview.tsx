import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CunninghamProvider } from "../../src/components/provider/Provider";
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
  // Bridge functions always return undefined; use requestAccessShouldReject /
  // requestAccessDelayMs to control async behaviour from the test side.
  onRequestAccess?: (file: FilePreviewType) => void;
  requestAccessShouldReject?: boolean;
  requestAccessDelayMs?: number;
  onOpenInEditor?: (file: FilePreviewType) => void;
  hideCloseButton?: boolean;
  currentLocale?: string;
  customHeaderActionsMode?: CustomHeaderActionsMode;
  extraMenuOptions?: MenuItemAction[];
}

export const TestFilePreview = ({
  files,
  initialIndexFile = 0,
  handleDownloadFile,
  onClose,
  onRequestAccess,
  requestAccessShouldReject = false,
  requestAccessDelayMs = 0,
  onOpenInEditor,
  hideCloseButton,
  currentLocale = "en-US",
  customHeaderActionsMode,
  extraMenuOptions,
}: TestFilePreviewProps) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const openedFileId = files[initialIndexFile]?.id;

  // The CT bridge always returns undefined, so tests for rejection (error toast)
  // and in-flight locking (double-submit) pass plain-data flags instead of
  // async functions, and we build the actual Promise behaviour here.
  const wrappedOnRequestAccess = onRequestAccess
    ? async (file: FilePreviewType) => {
        onRequestAccess(file);
        if (requestAccessDelayMs > 0) {
          await new Promise<void>((resolve) =>
            setTimeout(resolve, requestAccessDelayMs),
          );
        }
        if (requestAccessShouldReject) throw new Error("request-failed");
      }
    : undefined;

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
      <CunninghamProvider currentLocale={currentLocale}>
        <FilePreview
          isOpen={true}
          files={files}
          openedFileId={openedFileId}
          pdfWorkerSrc="/pdf.worker.mjs"
          handleDownloadFile={handleDownloadFile}
          onClose={onClose}
          onRequestAccess={wrappedOnRequestAccess}
          onOpenInEditor={onOpenInEditor}
          hideCloseButton={hideCloseButton}
          customHeaderActions={customHeaderActions}
          headerActionsMenuOptions={headerActionsMenuOptions}
        />
      </CunninghamProvider>
    </QueryClientProvider>
  );
};
