import { RefObject, useEffect } from "react";
import { Button } from ":/cunningham";
import type { ButtonElement } from ":/components/button";
import { BubbleText } from ":/icons";
import { IconSize } from "../../icon";

type SupportFormSuccessProps = {
  text: string;
  closeLabel: string;
  onClose: () => void;
  closeRef: RefObject<ButtonElement | null>;
};

/** Shown instead of the form once the message is sent. */
export const SupportFormSuccess = ({
  text,
  closeLabel,
  onClose,
  closeRef,
}: SupportFormSuccessProps) => {
  // The Send button disappeared with the form: move the focus to Close.
  useEffect(() => {
    closeRef.current?.focus();
  }, [closeRef]);

  return (
    <div className="c__generic-support-form__success">
      <BubbleText
        size={IconSize.X_LARGE}
        className="c__generic-support-form__success__icon"
        aria-hidden="true"
      />
      <p className="c__generic-support-form__success__text">{text}</p>
      <Button
        ref={closeRef}
        type="button"
        color="brand"
        variant="secondary"
        onClick={onClose}
        fullWidth
      >
        {closeLabel}
      </Button>
    </div>
  );
};
