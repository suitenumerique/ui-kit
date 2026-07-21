import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";

export type ShareModalCopyLinkFooterProps = {
  onCopyLink: () => void;
  onOk: () => void;
};

export const ShareModalCopyLinkFooter = ({
  onCopyLink,
  onOk,
}: ShareModalCopyLinkFooterProps) => {
  const { t } = useCunningham();
  return (
    <div className="c__share-modal__copy-link-footer">
      <Button
        variant="secondary"
        icon={<span className="material-icons">link</span>}
        onClick={onCopyLink}
      >
        {t("components.share.copyLink")}
      </Button>
      <Button variant="primary" onClick={onOk}>
        {t("components.share.ok")}
      </Button>
    </div>
  );
};
