import { Button } from "@gouvfr-lasuite/cunningham-react";
import { Icon, IconType } from ":/components/icon";
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
          icon={<Icon name="open_in_new" type={IconType.OUTLINED} size={16} />}
          onClick={() => onOpenInEditor(file)}
        >
          {t("components.filePreview.wopi.openInEditor")}
        </Button>
      }
    />
  );
};
