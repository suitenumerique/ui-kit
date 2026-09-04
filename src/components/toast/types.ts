import { ReactNode } from "react";

export type ToastType = "info" | "success" | "warning" | "error";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  icon?: ReactNode;
  type?: ToastType;
  actions?: ToastAction[];
  progress?: number;
  autoClose?: number | false;
  containerId?: string;
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
