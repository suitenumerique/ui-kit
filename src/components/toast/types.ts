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
