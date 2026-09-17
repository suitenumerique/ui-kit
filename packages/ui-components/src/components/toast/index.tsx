import { PropsWithChildren, ReactNode } from "react";
import classNames from "classnames";
import { ButtonProps } from ":/components/button";
import { ArrowRight } from ":/components/icon/icons/ArrowRight";
import { NotificationContent } from ":/components/notification/NotificationContent";
import { VariantType } from ":/utils/VariantUtils";
import { ToastAction } from "./types";

export * from "./types";

export interface ToastProps extends PropsWithChildren {
  duration: number;
  type: VariantType;
  onDelete?: () => void;
  icon?: ReactNode;
  /** Hides the leading icon. The default is an arrow; pass `icon` to replace it. */
  hideIcon?: boolean;
  primaryLabel?: string;
  primaryOnClick?: ButtonProps["onClick"];
  primaryProps?: ButtonProps;
  tertiaryLabel?: string;
  tertiaryOnClick?: ButtonProps["onClick"];
  tertiaryProps?: ButtonProps;
  disableAnimate?: boolean;
  /**
   * Either a ready-made node, or a list of `{ label, onClick }` rendered as
   * borderless buttons matching the toast variant.
   */
  actions?: ReactNode | ToastAction[];
  /** Completion percentage, displayed next to the message. */
  progress?: number;
  /** Adds a close button at the end of the action row. */
  canClose?: boolean;
  /**
   * Dismisses the toast. react-toastify injects it on the element it renders,
   * so `canClose` works without the caller wiring anything.
   */
  closeToast?: () => void;
}

export const Toast = ({ type, ...props }: ToastProps) => {
  return (
    <div
      className={classNames("c__toast", type && "c__toast--" + type, {
        "c__toast--no-animate": props.disableAnimate,
      })}
    >
      <NotificationContent
        block="c__toast"
        type={type}
        icon={props.icon}
        defaultIcon={<ArrowRight size={24} />}
        hideIcon={props.hideIcon}
        iconAriaHidden
        actions={props.actions}
        primaryLabel={props.primaryLabel}
        primaryOnClick={props.primaryOnClick}
        primaryProps={props.primaryProps}
        tertiaryLabel={props.tertiaryLabel}
        tertiaryOnClick={props.tertiaryOnClick}
        tertiaryProps={props.tertiaryProps}
        canClose={props.canClose}
        onClose={() => props.closeToast?.()}
        trailing={
          props.progress !== undefined && (
            <span className="c__toast__content__progress">
              {props.progress}%
            </span>
          )
        }
      >
        {props.children}
      </NotificationContent>
    </div>
  );
};

export const ToastIcon = ({
  icon,
  hideIcon,
}: Pick<ToastProps, "icon" | "hideIcon">) => {
  if (hideIcon) {
    return null;
  }
  return (
    <div className="c__toast__icon" aria-hidden="true">
      {icon ?? <ArrowRight size={24} />}
    </div>
  );
};
