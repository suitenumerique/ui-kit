import { Button } from ":/components/button";
import { Modal, ModalSize } from ":/components/modal";
import { useCunningham } from ":/components/provider";
import { FolderRestricted } from ":/components/icon/icons/FolderRestricted";
import { Folder } from ":/components/icon/icons/Folder";

type ShareAccessConfirmationModalProps = {
  action: "restrict" | "unrestrict";
  onClose: () => void;
  onConfirm?: () => void;
};

export const ShareAccessConfirmationModal = ({
  action,
  onClose,
  onConfirm,
}: ShareAccessConfirmationModalProps) => {
  const { t } = useCunningham();

  return (
    <Modal
      isOpen
      onClose={onClose}
      size={ModalSize.SMALL}
      title={t(`components.share.${action}.title`)}
      rightActions={
        <>
          <Button variant="bordered" color="neutral" onClick={onClose}>
            {t("components.modals.helpers.confirmation.cancel")}
          </Button>
          <Button
            icon={action === "restrict" ? <FolderRestricted /> : <Folder />}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {t(`components.share.${action}.title`)}
          </Button>
        </>
      }
    >
      <div className="c__share-access-confirmation-modal">
        <p>{t(`components.share.${action}.confirmation`)}</p>
        <p className="c__share-access-confirmation-modal__hint">
          {t(`components.share.${action}.hint`)}
        </p>
      </div>
    </Modal>
  );
};
