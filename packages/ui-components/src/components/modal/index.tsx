import React, { PropsWithChildren, ReactNode, useEffect, useId } from "react";
import classNames from "classnames";
import ReactModal from "react-modal";
import { NOSCROLL_CLASS, useModals } from ":/components/modal/ModalProvider";
import { ModalDefaultLayout } from "./ModalDefaultLayout";
import { ModalTabLayout } from "./ModalTabLayout";

export type ModalHandle = {};

export const MODAL_CLASS = "c__modal";

export enum ModalSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRA_LARGE = "extra-large",
  FULL = "full",
}

export const useModal = ({
  isOpenDefault,
}: { isOpenDefault?: boolean } = {}) => {
  const [isOpen, setIsOpen] = React.useState(!!isOpenDefault);
  const onClose = () => {
    setIsOpen(false);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    onClose();
  };

  return {
    isOpen,
    onClose,
    open,
    close,
  };
};

export interface ModalTab {
  id: string;
  label: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
}

export type ModalActionProps = {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  actions?: React.ReactNode;
};

export type ModalConstraints = {
  minHeight?: string | number;
  maxHeight?: string | number;
  preferredHeight?: string | number;
};

type ModalBaseProps = {
  size: ModalSize;
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: React.ReactNode;
  stickyFooter?: boolean;
  hideCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  preventClose?: boolean;
  /** Height constraints, ignored when `size` is `ModalSize.FULL`. */
  constraints?: ModalConstraints;
  "aria-label"?: string;
};

export type ModalDefaultVariantProps = ModalBaseProps &
  PropsWithChildren &
  ModalActionProps & {
    variant?: "default";
    title?: ReactNode;
    subtitle?: ReactNode;
    titleIcon?: React.ReactNode;
    titleVariant?: "default" | "compact";
    stickyFooter?: boolean;
  };

export type ModalTabVariantProps = ModalBaseProps &
  ModalActionProps & {
    variant: "tab";
    tabs: ModalTab[];
    sidebarTitle?: ReactNode;
    defaultActiveTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    stickyFooter?: boolean;
  };

export type ModalProps = ModalDefaultVariantProps | ModalTabVariantProps;

export const Modal = (props: ModalProps) => {
  /**
   * This is a workaround to prevent the modal from rendering on the first render because if the modal is open on the
   * first render, it will not be able to resolve document.getElementById(<MODAL_PARENT_ID>) which is not rendered yet.
   */
  const [firstRender, setFirstRender] = React.useState(true);
  useEffect(() => {
    setFirstRender(false);
  }, []);

  if (firstRender) {
    return null;
  }

  return <ModalInner {...props} />;
};

export const ModalInner = (props: ModalProps) => {
  const { modalParentSelector } = useModals();
  const id = useId();
  const titleId = `${id}-title`;
  const subtitleId = `${id}-subtitle`;
  const showCloseButton = !props.hideCloseButton && !props.preventClose;
  const closeOnEsc = props.closeOnEsc ?? true;
  const variant = props.variant ?? "default";

  if (!props.isOpen) {
    return null;
  }

  // The visible title names the dialog; `aria-label` only applies without one.
  const hasVisibleTitle =
    variant === "tab"
      ? !!(props as ModalTabVariantProps).sidebarTitle
      : !!(props as ModalDefaultVariantProps).title;
  const hasSubtitle =
    variant === "default" &&
    (props as ModalDefaultVariantProps).titleVariant !== "compact" &&
    !!(props as ModalDefaultVariantProps).subtitle;
  const aria: ReactModal.Aria = {};
  if (hasVisibleTitle) {
    aria.labelledby = titleId;
  }
  if (hasSubtitle) {
    aria.describedby = subtitleId;
  }
  const contentLabel = hasVisibleTitle ? undefined : props["aria-label"];

  // A full-screen modal always spans the viewport height: inline height
  // constraints would take precedence over the stylesheet and shrink it.
  const constraints =
    props.size === ModalSize.FULL ? undefined : props.constraints;
  const constraintStyle: React.CSSProperties = {};
  if (constraints?.minHeight !== undefined)
    constraintStyle.minHeight = constraints.minHeight;
  if (constraints?.maxHeight !== undefined)
    constraintStyle.maxHeight = constraints.maxHeight;
  if (constraints?.preferredHeight !== undefined)
    constraintStyle.height = constraints.preferredHeight;

  return (
    <ReactModal
      isOpen={props.isOpen}
      style={{ content: constraintStyle }}
      onRequestClose={() => {
        if (!props.preventClose) {
          props.onClose();
        }
      }}
      parentSelector={modalParentSelector}
      overlayClassName="c__modal__backdrop"
      className={classNames(MODAL_CLASS, `${MODAL_CLASS}--${props.size}`, {
        [`${MODAL_CLASS}--tab`]: variant === "tab",
      })}
      shouldCloseOnOverlayClick={!!props.closeOnClickOutside}
      shouldCloseOnEsc={closeOnEsc}
      bodyOpenClassName={classNames("c__modals--opened", NOSCROLL_CLASS)}
      contentLabel={contentLabel}
      aria={aria}
    >
      {variant === "tab" ? (
        <ModalTabLayout
          {...(props as ModalTabVariantProps)}
          showCloseButton={showCloseButton}
          titleId={titleId}
        />
      ) : (
        <ModalDefaultLayout
          {...(props as ModalDefaultVariantProps)}
          showCloseButton={showCloseButton}
          titleId={titleId}
          subtitleId={subtitleId}
        />
      )}
    </ReactModal>
  );
};
