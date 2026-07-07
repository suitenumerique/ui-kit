import { ReactNode } from "react";
import { toast as reactToastify, Id } from "react-toastify";
import { ToastContent } from "./ToastContent";
import { ToastOptions } from "./types";

export const toast = (message: ReactNode, options?: ToastOptions): Id => {
  return reactToastify(
    <ToastContent
      message={message}
      icon={options?.icon}
      type={options?.type}
      actions={options?.actions}
      progress={options?.progress}
    />,
    {
      type: options?.type ?? "default",
      autoClose: options?.autoClose ?? 5000,
      icon: false,
      containerId: options?.containerId,
    },
  );
};

toast.info = (message: ReactNode, options?: Omit<ToastOptions, "type">): Id =>
  toast(message, { ...options, type: "info" });

toast.success = (
  message: ReactNode,
  options?: Omit<ToastOptions, "type">,
): Id => toast(message, { ...options, type: "success" });

toast.warning = (
  message: ReactNode,
  options?: Omit<ToastOptions, "type">,
): Id => toast(message, { ...options, type: "warning" });

toast.error = (
  message: ReactNode,
  options?: Omit<ToastOptions, "type">,
): Id => toast(message, { ...options, type: "error" });

toast.update = reactToastify.update;
toast.dismiss = reactToastify.dismiss;
