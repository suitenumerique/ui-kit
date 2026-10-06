import React, { ReactNode } from "react";
import { useControllableState } from ":/hooks/useControllableState";
import { AlertAdditionalExpandable } from ":/components/alert/AlertAdditionalExpandable";
import { AlertAdditional } from ":/components/alert/AlertAdditional";
import { AlertOneLine } from ":/components/alert/AlertOneLine";
import { NotificationProps } from ":/components/notification/types";
import { VariantType } from ":/utils/VariantUtils";

/**
 * `NotificationProps` carries everything the alert shares with the toast: the
 * variant, the icon and the action row. What follows is specific to the alert.
 */
export interface AlertProps extends NotificationProps {
  additional?: ReactNode;
  /** Free-form node appended after the labelled buttons. */
  buttons?: ReactNode;
  className?: string;
  closed?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  hide?: boolean;
  onClose?: (value: boolean) => void;
  onExpand?: (value: boolean) => void;
}

export const Alert = (props: AlertProps) => {
  const [closed, onClose] = useControllableState(
    false,
    props.closed,
    props.onClose,
  );

  const propsWithDefault = {
    type: VariantType.INFO,
    ...props,
    onClose,
  };

  if (closed) {
    return null;
  }
  if (props.additional) {
    if (props.expandable) {
      return <AlertAdditionalExpandable {...propsWithDefault} />;
    }
    return <AlertAdditional {...propsWithDefault} />;
  }
  return <AlertOneLine {...propsWithDefault} />;
};
