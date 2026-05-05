import { Icon, IconType } from ":/components/icon";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";

export const OutdatedBrowserPreview = () => {
  const { t } = useCustomTranslations();

  return (
    <div className="file-preview-unsupported" data-preview-backdrop="true">
      <div className="file-preview-unsupported__icon">
        <Icon name="security" type={IconType.OUTLINED} size={48} />
      </div>
      <p className="file-preview-unsupported__title">
        {t("components.filePreview.outdatedBrowser.title")}
      </p>
      <p className="file-preview-unsupported__description">
        {t("components.filePreview.outdatedBrowser.description")}
      </p>
    </div>
  );
};
