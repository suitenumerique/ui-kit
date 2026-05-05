import { useCallback } from "react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { Icon, IconType } from ":/components/icon";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { FileIcon } from "../../icons/FileIcon";
import { FilePreviewType } from "../../types";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";

interface NotSupportedPreviewProps {
  file: FilePreviewType;
  onDownload?: (file: FilePreviewType) => void;
  title?: string;
}

export const NotSupportedPreview = ({
  file,
  onDownload,
  title,
}: NotSupportedPreviewProps) => {
  const { t } = useCustomTranslations();

  const handleDownload = useCallback(() => {
    onDownload?.(file);
  }, [onDownload, file]);

  return (
    <PreviewMessage
      icon={<FileIcon file={file} size={64} />}
      title={file.title}
      description={
        title ?? (
          <>
            <strong>
              {t("components.filePreview.unsupported.disclaimer")}
            </strong>{" "}
            {t("components.filePreview.unsupported.description")}
          </>
        )
      }
      action={
        onDownload && (
          <Button
            variant="secondary"
            color="neutral"
            icon={
              <Icon name="file_download" type={IconType.OUTLINED} size={16} />
            }
            onClick={handleDownload}
          >
            {t("components.filePreview.suspicious.download")}
          </Button>
        )
      }
    />
  );
};
