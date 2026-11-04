import { Button } from ":/components/button";
import { Modal, ModalSize } from ":/components/modal";
import { useCunningham } from ":/components/provider";
import {
  CustomTranslations,
  useCustomTranslations,
} from ":/hooks/useCustomTranslations";
import { FolderRestricted } from ":/components/icon/icons/FolderRestricted";
import { Folder } from ":/components/icon/icons/Folder";

type ShareAccessConfirmationModalProps = {
  action: "restrict" | "unrestrict";
  onClose: () => void;
  onConfirm?: () => void;
  customTranslations?: CustomTranslations;
};

export const ShareAccessConfirmationModal = ({
  action,
  onClose,
  onConfirm,
  customTranslations,
}: ShareAccessConfirmationModalProps) => {
  const { t } = useCunningham();
  // The consumer may name its items, e.g. "folder" instead of "item".
  const { t: tCopy } = useCustomTranslations(customTranslations);

  return (
    <Modal
      isOpen
      onClose={onClose}
      size={ModalSize.SMALL}
      title={tCopy(`components.share.${action}.title`)}
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
            {tCopy(`components.share.${action}.title`)}
          </Button>
        </>
      }
    >
      <p className="c__share-access-confirmation-modal">
        <strong>{tCopy(`components.share.${action}.confirmation`)}</strong>{" "}
        {tCopy(`components.share.${action}.details`)}
      </p>
    </Modal>
  );
};
