import { useCallback } from "react";
import { Button } from ":/cunningham";
import { IconSize } from ":/components/icon";
import { Download } from ":/icons";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { FileIcon } from "../../icons/FileIcon";
import { FilePreviewType } from "../../types";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";

interface ErrorPreviewProps {
  file: FilePreviewType;
  onDownload?: (file: FilePreviewType) => void;
}

export const ErrorPreview = ({ file, onDownload }: ErrorPreviewProps) => {
  const { t } = useCustomTranslations();

  const handleDownload = useCallback(() => {
    onDownload?.(file);
  }, [onDownload, file]);

  return (
    <PreviewMessage
      variant="error"
      icon={<FileIcon file={file} size={64} />}
      title={t("components.filePreview.error.title")}
      description={t("components.filePreview.error.description")}
      action={
        onDownload && (
          <Button
            variant="bordered"
            icon={<Download size={IconSize.SMALL} aria-hidden />}
            onClick={handleDownload}
          >
            {t("components.filePreview.unsupported.download")}
          </Button>
        )
      }
    />
  );
};
