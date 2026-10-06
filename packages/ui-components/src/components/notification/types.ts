import type { PropsWithChildren, ReactNode } from "react";
import type { ButtonProps } from ":/components/button";
import type { VariantType } from ":/utils/VariantUtils";

/** Descriptor for the borderless buttons rendered in the action row. */
export type NotificationAction = {
  label: string;
  onClick: () => void;
};

/**
 * Props rendered by `NotificationContent`: the variant, the icon and the
 * action row. Components embedding it add their own on top.
 */
export interface NotificationProps extends PropsWithChildren {
  type?: VariantType;
  /** Replaces the leading icon, which defaults to the variant icon. */
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
