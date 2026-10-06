import { ReactNode } from "react";
import { ButtonProps } from ":/components/button";
import { VariantType } from ":/utils/VariantUtils";
import { ToastAction } from "./types";

/**
 * This function is used for doc purpose only.
 */
export const toast = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options,
}: {
  /** Message displayed inside the toast */
  message: string;
  /** Type of the toast */
  type?: VariantType;
  /** Various options */
  options?: {
    /** Delay before the toast dismisses itself. Defaults to 6000ms */
    duration?: number;
    icon?: ReactNode;
    /** Hides the leading arrow. Pass `icon` to show something else instead. */
    hideIcon?: boolean;
    primaryLabel?: string;
    primaryOnClick?: ButtonProps["onClick"];
    primaryProps?: ButtonProps;
    /** Completion percentage, displayed next to the message */
    progress?: number;
    /** Ready-made node, or a list of `{ label, onClick }` */
    actions?: ReactNode | ToastAction[];
    /** Opts out of the dismissal timer, keeping the toast until dismissed */
    disableAnimate?: boolean;
  };
}) => {
  return {};
};
