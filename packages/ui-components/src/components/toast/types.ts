import type { Id } from "react-toastify";
import {
  NotificationAction,
  NotificationProps,
} from ":/components/notification/types";
import { VariantType } from ":/utils/VariantUtils";

export type ToastId = Id;

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

/**
 * `NotificationProps` carries everything the toast shares with the alert: the
 * variant, the icon and the action row. What follows is specific to the toast.
 */
export interface ToastProps extends NotificationProps {
  type: VariantType;
  duration?: number;
  onDelete?: () => void;
  disableAnimate?: boolean;
  progress?: number;
  closeToast?: () => void;
}

/**
 * What `updateToast` can change on a live toast. These are the kit's own props,
 * not react-toastify's: the toast keeps its wrapper and its variant styling
 * across an update, and the message is replaced through `message`.
 */
export type ToastUpdateOptions = Partial<
  Omit<ToastProps, "children" | "closeToast" | "onDelete">
> & {
  /** Replaces the message the toast was raised with. */
  message?: string;
};

// react-toastify keeps the object form of `dismiss` params internal, so its type
// cannot be referenced in our emitted declarations. Mirror it here instead.
export type ToastDismissParams = {
  id?: ToastId;
  containerId: ToastId;
};

export type ToastAction = NotificationAction;
