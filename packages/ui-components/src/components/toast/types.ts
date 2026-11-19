import {
  NotificationAction,
  NotificationProps,
} from ":/components/notification/types";
import { VariantType } from ":/utils/VariantUtils";

export type ToastId = string;

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
}

/**
 * What `updateToast` can change on a live toast. The toast keeps its wrapper
 * and its variant styling across an update, and the message is replaced
 * through `message`.
 */
export type ToastUpdateOptions = Partial<
  Omit<ToastProps, "children" | "onDelete">
> & {
  /** Replaces the message the toast was raised with. */
  message?: string;
};

/** Dismisses one toast, or all of them without `id`, in the given provider. */
export type ToastDismissParams = {
  id?: ToastId;
  containerId: ToastId;
};

export type ToastAction = NotificationAction;
