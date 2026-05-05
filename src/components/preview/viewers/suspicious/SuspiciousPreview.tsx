import { Button } from "@gouvfr-lasuite/cunningham-react";
import { Icon, IconType } from ":/components/icon";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import mimeSuspicious from ":/assets/files/icons/suspicious_file.svg";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";

interface SuspiciousPreviewProps {
  handleDownload?: () => void;
}

export const SuspiciousPreview = ({
  handleDownload,
}: SuspiciousPreviewProps) => {
  const { t } = useCustomTranslations();

  return (
    <PreviewMessage
      icon={
        <img
          src={mimeSuspicious}
          alt=""
          className="c__file-icon"
          style={{ width: "64px", height: "64px" }}
        />
      }
      title={t("components.filePreview.suspicious.title")}
      description={t("components.filePreview.suspicious.description")}
      action={
        handleDownload && (
          <Button
            variant="secondary"
            color="warning"
            icon={
              <Icon name="file_download" type={IconType.OUTLINED} size={16} />
            }
            onClick={handleDownload}
          >
            {t("components.filePreview.unsupported.download")}
          </Button>
        )
      }
    />
  );
};
