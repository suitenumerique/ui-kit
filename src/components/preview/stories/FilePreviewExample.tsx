import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilePreview } from "../FilePreview";
import type { FilePreviewType } from "../types";
import type { MenuItemAction } from "../../menu";

// Storybook re-mounts on HMR; reusing one client keeps the PDF cache warm.
const queryClient = new QueryClient();

interface FilePreviewExampleProps {
  files: FilePreviewType[];
  initialFileId?: string;
  customHeaderActions?: (headerActions: ReactNode) => ReactNode;
  headerActionsMenuOptions?: (file: FilePreviewType) => MenuItemAction[];
  forceVideoTranscode?: boolean;
}

export const FilePreviewExample = ({
  files,
  initialFileId,
  customHeaderActions,
  headerActionsMenuOptions,
  forceVideoTranscode,
}: FilePreviewExampleProps) => {
  const [openedFileId, setOpenedFileId] = useState<string | undefined>(
    initialFileId ?? files[0]?.id
  );

  useEffect(() => {
    setOpenedFileId(initialFileId ?? files[0]?.id);
  }, [initialFileId, files]);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: 16 }}>
        <button
          type="button"
          onClick={() => setOpenedFileId(initialFileId ?? files[0]?.id)}
          disabled={!!openedFileId}
        >
          Reopen preview
        </button>
        <FilePreview
          isOpen={!!openedFileId}
          openedFileId={openedFileId}
          files={files}
          onClose={() => setOpenedFileId(undefined)}
          onChangeFile={(file) => setOpenedFileId(file?.id)}
          handleDownloadFile={(file) =>
            console.log("[storybook] download", file?.title)
          }
          onOpenInEditor={(file) =>
            console.log("[storybook] open in editor", file.id)
          }
          customHeaderActions={customHeaderActions}
          headerActionsMenuOptions={headerActionsMenuOptions}
          forceVideoTranscode={forceVideoTranscode}
        />
      </div>
    </QueryClientProvider>
  );
};
