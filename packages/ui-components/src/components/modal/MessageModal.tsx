import React from "react";
import classNames from "classnames";
import { Modal, ModalSize } from ":/components/modal/index";
import { useCunningham } from ":/components/provider";
import { Button } from ":/components/button";
import { DecisionModalProps } from ":/components/modal/ModalProvider";
import { iconFromType, VariantType } from ":/utils/VariantUtils";

export type MessageModalProps = DecisionModalProps & {
  messageType: VariantType;
};

export const MessageModal = ({
  title,
  children,
  onDecide,
  messageType,
  ...props
}: MessageModalProps) => {
  const { t } = useCunningham();
  return (
    <Modal
      title={title ?? t("components.modals.helpers.disclaimer.title")}
      titleIcon={
        messageType !== VariantType.NEUTRAL && (
          <span
            className={classNames(
              "material-icons",
              `modal-message-${messageType}-icon`,
            )}
          >
            {iconFromType(messageType)}
          </span>
        )
      }
      size={ModalSize.SMALL}
      rightActions={
        <Button fullWidth={true} onClick={() => onDecide("ok")}>
          {t("components.modals.helpers.disclaimer.ok")}
        </Button>
      }
      {...props}
    >
      <div className="c__modal__content__text">
        {children ?? t("components.modals.helpers.disclaimer.children")}
      </div>
    </Modal>
  );
};
