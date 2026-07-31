import React from "react";
import { Modal, ModalSize } from ":/components/modal/index";
import { useCunningham } from ":/components/provider";
import { Button } from ":/components/button";
import { DecisionModalProps } from ":/components/modal/ModalProvider";

export type ConfirmationModalProps = DecisionModalProps;

export const ConfirmationModal = ({
  title,
  children,
  onDecide,
  ...props
}: ConfirmationModalProps) => {
  const { t } = useCunningham();
  return (
    <Modal
      title={title ?? t("components.modals.helpers.confirmation.title")}
      size={ModalSize.SMALL}
      rightActions={
        <>
          <Button
            variant="bordered"
            color="neutral"
            fullWidth={true}
            onClick={() => onDecide(null)}
          >
            {t("components.modals.helpers.confirmation.cancel")}
          </Button>
          <Button fullWidth={true} onClick={() => onDecide("yes")}>
            {t("components.modals.helpers.confirmation.yes")}
          </Button>
        </>
      }
      {...props}
    >
      <div className="c__modal__content__text">
        {children ?? t("components.modals.helpers.confirmation.children")}
      </div>
    </Modal>
  );
};
