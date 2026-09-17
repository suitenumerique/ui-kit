import React, { PropsWithChildren, ReactNode } from "react";
import { ButtonProps } from ":/components/button";
import { useControllableState } from ":/hooks/useControllableState";
import { AlertAdditionalExpandable } from ":/components/alert/AlertAdditionalExpandable";
import { AlertAdditional } from ":/components/alert/AlertAdditional";
import { AlertOneLine } from ":/components/alert/AlertOneLine";
import { NotificationAction } from ":/components/notification/types";
import { VariantType } from ":/utils/VariantUtils";

export interface AlertProps extends PropsWithChildren {
  additional?: React.ReactNode;
  /**
   * Either a ready-made node, or a list of `{ label, onClick }` rendered as
   * borderless buttons matching the alert variant.
   */
  actions?: ReactNode | NotificationAction[];
  buttons?: React.ReactNode;
  canClose?: boolean;
  className?: string;
  closed?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  hide?: boolean;
  icon?: ReactNode;
  /** Hides the leading icon. Pass `icon` instead to replace it. */
  hideIcon?: boolean;
  onClose?: (value: boolean) => void;
  onExpand?: (value: boolean) => void;
  primaryLabel?: string;
  primaryOnClick?: ButtonProps["onClick"];
  primaryProps?: ButtonProps;
  tertiaryLabel?: string;
  tertiaryOnClick?: ButtonProps["onClick"];
  tertiaryProps?: ButtonProps;
  type?: VariantType;
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
