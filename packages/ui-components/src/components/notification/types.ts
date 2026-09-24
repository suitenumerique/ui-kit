import type { PropsWithChildren, ReactNode } from "react";
import type { ButtonProps } from ":/components/button";
import type { VariantType } from ":/utils/VariantUtils";

/**
 * Descriptor for the borderless buttons that `Alert` and `Toast` render in
 * their action row.
 */
export type NotificationAction = {
  label: string;
  onClick: () => void;
};

/**
 * Props that `Alert` and `Toast` honour the same way, because both delegate
 * their content row to `NotificationContent`. Each component adds its own on
 * top: dismissal and expansion for the alert, timing and progress for the
 * toast.
 */
export interface NotificationProps extends PropsWithChildren {
  type?: VariantType;
  /**
   * Replaces the leading icon. It defaults to the variant icon on the alert,
   * and to an arrow on the toast.
   */
  icon?: ReactNode;
  /** Hides the leading icon. Pass `icon` instead to replace it. */
  hideIcon?: boolean;
  /**
   * Either a ready-made node, or a list of `{ label, onClick }` rendered as
   * borderless buttons matching the variant.
   */
  actions?: ReactNode | NotificationAction[];
  primaryLabel?: string;
  primaryOnClick?: ButtonProps["onClick"];
  primaryProps?: ButtonProps;
  tertiaryLabel?: string;
  tertiaryOnClick?: ButtonProps["onClick"];
  tertiaryProps?: ButtonProps;
  /** Adds a close button at the end of the action row. */
  canClose?: boolean;
}
