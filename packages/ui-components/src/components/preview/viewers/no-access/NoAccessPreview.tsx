import { Button } from ":/cunningham";
import { BubbleText } from ":/components/icon/icons/BubbleText";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";
import { FileIcon } from "../../icons/FileIcon";
import { FilePreviewType } from "../../types";
import { IconSize } from ":/components/icon";

interface NoAccessPreviewProps {
  file: FilePreviewType;
  onClose?: () => void;
  hideCloseButton?: boolean;
  onRequestAccess?: (file: FilePreviewType) => void;
}

export const NoAccessPreview = ({
  file,
  onClose,
  hideCloseButton,
  onRequestAccess,
}: NoAccessPreviewProps) => {
  const { t } = useCustomTranslations();

  return (
    <div className="file-preview-no-access" data-preview-backdrop="true">
      <PreviewMessage
        icon={
          <div className="file-preview-no-access__illustration">
            <FileIcon file={{ ...file, isFolderAccessDenied: true }} size={64} />
          </div>
        }
        title={file.title}
        description={t("components.filePreview.folderAccessDenied.description")}
        action={
          (!hideCloseButton || onRequestAccess) && (
            <div className="file-preview-no-access__actions">
              {!hideCloseButton && (
                <Button
                  size="nano"
                  variant="secondary"
                  color="neutral"
                  onClick={onClose}
                >
                  {t("components.filePreview.folderAccessDenied.close")}
                </Button>
              )}
              {onRequestAccess && (
                <Button
                  size="nano"
                  variant="secondary"
                  color="brand"
                  icon={<BubbleText size={16} />}
                  onClick={() => onRequestAccess(file)}
                >
                  {t("components.filePreview.folderAccessDenied.requestAccess")}
                </Button>
              )}
            </div>
          )
        }
      />
    </div>
  );
};
