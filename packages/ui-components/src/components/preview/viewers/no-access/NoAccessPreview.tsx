import { Button } from ":/cunningham";
import { BubbleText } from ":/components/icon/icons/BubbleText";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import type { TranslationKey } from ":/types/translations";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";
import { FileIcon } from "../../icons/FileIcon";
import { FilePreviewType } from "../../types";
import { IconSize } from ":/components/icon";

export type RequestAccessState = "not-requested" | "sent" | "already-requested";

interface NoAccessPreviewProps {
  file: FilePreviewType;
  onClose?: () => void;
  hideCloseButton?: boolean;
  onRequestAccess?: (file: FilePreviewType) => void;
  requestAccessState?: RequestAccessState;
}

const requestAccessLabel: Record<RequestAccessState, TranslationKey> = {
  "not-requested": "components.filePreview.folderAccessDenied.requestAccess",
  sent: "components.filePreview.folderAccessDenied.requestSent",
  "already-requested":
    "components.filePreview.folderAccessDenied.alreadyRequested",
};

export const NoAccessPreview = ({
  file,
  onClose,
  hideCloseButton,
  onRequestAccess,
  requestAccessState = "not-requested",
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
                  disabled={requestAccessState !== "not-requested"}
                >
                  {t(requestAccessLabel[requestAccessState])}
                </Button>
              )}
            </div>
          )
        }
      />
    </div>
  );
};
