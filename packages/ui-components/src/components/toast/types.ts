import { ReactNode } from "react";
import type { Id, UpdateOptions } from "react-toastify";

export type ToastId = Id;

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type ToastUpdateOptions = UpdateOptions;

// react-toastify keeps the object form of `dismiss` params internal, so its type
// cannot be referenced in our emitted declarations. Mirror it here instead.
export type ToastDismissParams = {
  id?: ToastId;
  containerId: ToastId;
};

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastExtendedItemStatus = "completed" | "loading";

export type ToastExtendedItem = {
  id?: string;
  title: string;
  size?: string;
  mimetype?: string;
  status: ToastExtendedItemStatus;
  icon?: ReactNode;
};

export type ToastExtendedOptions = {
  items: ToastExtendedItem[];
  summary?: string;
  progress?: number;
  onClose?: () => void;
  onInfoClick?: () => void;
  autoClose?: number | false;
  containerId?: string;
};
