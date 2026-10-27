import { Button } from ":/cunningham";
import { IconSize } from ":/components/icon";
import { ExternalLink } from ":/icons";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { FileIcon } from "../../icons/FileIcon";
import { FilePreviewType } from "../../types";
import { PreviewMessage } from "../../components/preview-message/PreviewMessage";

interface WopiOpenInEditorProps {
  file: FilePreviewType;
  onOpenInEditor: (file: FilePreviewType) => void;
}

export const WopiOpenInEditor = ({
  file,
  onOpenInEditor,
}: WopiOpenInEditorProps) => {
  const { t } = useCustomTranslations();

  return (
    <PreviewMessage
      icon={<FileIcon file={file} size={64} />}
      title={file.title}
      description={t("components.filePreview.wopi.openInEditorDescription")}
      action={
        <Button
          icon={<ExternalLink size={IconSize.SMALL} aria-hidden />}
          onClick={() => onOpenInEditor(file)}
        >
          {t("components.filePreview.wopi.openInEditor")}
        </Button>
      }
    />
  );
};
