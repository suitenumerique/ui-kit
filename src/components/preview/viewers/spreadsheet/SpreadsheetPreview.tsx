import { lazy, Suspense, useState } from "react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { Icon, IconType } from ":/components/icon";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { FileIcon } from "../../icons/FileIcon";
import { FilePreviewType } from "../../types";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";
import { NotSupportedPreview } from "../not-supported/NotSupportedPreview";

// IronCalc (wasm engine + canvas workbook) is ~1.3 MB and only needed for
// spreadsheets, so it is loaded on demand the first time one is previewed.
const IronCalcViewer = lazy(() => import("./IronCalcViewer"));

interface SpreadsheetPreviewProps {
  file: FilePreviewType;
  /** When provided, the file is editable and the editor option is offered. */
  onOpenInEditor?: (file: FilePreviewType) => void;
  onDownload?: () => void;
}

export const SpreadsheetPreview = ({
  file,
  onOpenInEditor,
  onDownload,
}: SpreadsheetPreviewProps) => {
  const { t } = useCustomTranslations();
  const canEdit = Boolean(onOpenInEditor);
  // Auto-open the read-only preview when there is no editor to choose between.
  const [showGrid, setShowGrid] = useState(!canEdit);

  const loading = (
    <div className="spreadsheet-preview__status" data-preview-backdrop="true">
      <div className="spreadsheet-preview__spinner" />
      <span>{t("components.filePreview.spreadsheet.loading")}</span>
    </div>
  );

  if (showGrid) {
    return (
      <div className="spreadsheet-preview">
        <Suspense fallback={loading}>
          <IronCalcViewer
            src={file.url_preview}
            errorFallback={
              <NotSupportedPreview file={file} onDownload={() => onDownload?.()} />
            }
          />
        </Suspense>
        {canEdit && (
          <div className="spreadsheet-preview__statusbar">
            <Button
              size="small"
              variant="tertiary"
              icon={
                <Icon name="open_in_new" type={IconType.OUTLINED} size={16} />
              }
              onClick={() => onOpenInEditor?.(file)}
            >
              {t("components.filePreview.wopi.openInEditor")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Landing screen: offer the read-only preview alongside "open in editor".
  return (
    <PreviewMessage
      icon={<FileIcon file={file} size={64} />}
      title={file.title}
      description={t("components.filePreview.spreadsheet.description")}
      action={
        <div className="spreadsheet-preview__actions">
          <Button
            icon={<Icon name="visibility" type={IconType.OUTLINED} size={16} />}
            onClick={() => setShowGrid(true)}
          >
            {t("components.filePreview.spreadsheet.previewReadOnly")}
          </Button>
          {onOpenInEditor && (
            <Button
              variant="secondary"
              color="neutral"
              icon={
                <Icon name="open_in_new" type={IconType.OUTLINED} size={16} />
              }
              onClick={() => onOpenInEditor(file)}
            >
              {t("components.filePreview.wopi.openInEditor")}
            </Button>
          )}
        </div>
      }
    />
  );
};
