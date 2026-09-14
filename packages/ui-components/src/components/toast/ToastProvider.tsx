import React, { PropsWithChildren, useContext, useId, useMemo } from "react";
import { Slide, ToastContainer, toast as notify } from "react-toastify";
import type { ToastPosition } from "react-toastify";
import { Toast, ToastProps } from ":/components/toast/index";
import { ToastExtendedContent } from ":/components/toast/ToastExtendedContent";
import { VariantType } from ":/utils/VariantUtils";
import {
  ToastDismissParams,
  ToastExtendedOptions,
  ToastId,
  ToastUpdateOptions,
} from "./types";

export interface ToastProviderContext {
  toast: (
    message: string,
    type?: VariantType,
    options?: Partial<Omit<ToastInterface, "message" | "type">>,
  ) => ToastId;
  /** Collapsible list of items with a progress summary, for file transfers. */
  toastExtended: (options: ToastExtendedOptions) => ToastId;
  updateToast: (id: ToastId, options?: ToastUpdateOptions) => void;
  dismissToast: (params?: ToastId | ToastDismissParams) => void;
}

const ToastContext = React.createContext<ToastProviderContext | undefined>(
  undefined,
);

export const useToastProvider = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastProvider must be used within a ToastProvider.");
  }
  return context;
};

type ToastInterface = ToastProps & {
  i: number;
  message: string;
};

const DEFAULT_TOAST_DURATION = 6000;

// `neutral` is our name for what react-toastify calls the untyped toast.
const toastifyType = (type: VariantType) =>
  type === VariantType.NEUTRAL ? "default" : type;

export interface ToastProviderProps extends PropsWithChildren {
  /** Where the container is anchored. Defaults to `bottom-left`. */
  position?: ToastPosition;
  /**
   * Pins the container to a known id. Each provider is already isolated with a
   * generated one, so this is only needed to target it from somewhere else.
   */
  containerId?: string;
}

export const ToastProvider = ({
  children,
  position = "bottom-left",
  containerId,
}: ToastProviderProps) => {
  // `toast()` dispatches globally, so without an id every container would
  // compete for the default one and the last mounted would win. Scoping each
  // provider to its own container keeps notifications where they were raised,
  // which is what resolving the provider through context used to guarantee.
  const ownId = useId();
  const target = containerId ?? ownId;

  const context: ToastProviderContext = useMemo(
    () => ({
      toast: (message, type = VariantType.NEUTRAL, options = {}) => {
        const duration = options.duration ?? DEFAULT_TOAST_DURATION;
        return notify(
          <Toast {...options} type={type} duration={duration}>
            {message}
          </Toast>,
          {
            type: toastifyType(type),
            // `disableAnimate` used to opt out of the dismissal timer.
            autoClose: options.disableAnimate ? false : duration,
            icon: false,
            onClose: options.onDelete,
            containerId: target,
          },
        );
      },
      toastExtended: ({
        autoClose = false,
        containerId: override,
        ...options
      }) =>
        notify(
          <div className="c__toast c__toast--extended">
            <ToastExtendedContent {...options} />
          </div>,
          {
            type: "default",
            autoClose,
            icon: false,
            containerId: override ?? target,
          },
        ),
      updateToast: (id, options) =>
        notify.update(id, { containerId: target, ...options }),
      dismissToast: (params) =>
        notify.dismiss(
          typeof params === "object"
            ? params
            : { id: params, containerId: target },
        ),
    }),
    [target],
  );

  return (
    <ToastContext.Provider value={context}>
      {children}
      <ToastContainer
        className="c__toast__container"
        toastClassName="c__toast__wrapper"
        position={position}
        containerId={target}
        autoClose={DEFAULT_TOAST_DURATION}
        hideProgressBar
        // The dismissal timer used to be a plain timeout, so it kept running
        // when the window lost focus. Keep it that way.
        pauseOnFocusLoss={false}
        closeOnClick={false}
        closeButton={false}
        draggable={false}
        transition={Slide}
      />
    </ToastContext.Provider>
  );
};
