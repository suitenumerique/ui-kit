import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { FilePreview } from "../../src/components/preview/FilePreview";
import type { FilePreviewType } from "../../src/components/preview/types";

interface TestFilePreviewProps {
  files: FilePreviewType[];
  initialIndexFile?: number;
  handleDownloadFile?: (file?: FilePreviewType) => void;
  onClose?: () => void;
}

export const TestFilePreview = ({
  files,
  initialIndexFile = 0,
  handleDownloadFile,
  onClose,
}: TestFilePreviewProps) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const openedFileId = files[initialIndexFile]?.id;

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
        />
      </CunninghamProvider>
    </QueryClientProvider>
  );
};
