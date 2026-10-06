import React, {
  PropsWithChildren,
  useContext,
  useId,
  useMemo,
  useRef,
} from "react";
import { ToastContainer, cssTransition, toast as notify } from "react-toastify";
import { Toast, ToastProps } from ":/components/toast/index";
import { VariantType } from ":/utils/VariantUtils";
import {
  ToastDismissParams,
  ToastId,
  ToastPosition,
  ToastUpdateOptions,
} from "./types";

const ToastSlide = cssTransition({
  enter: "c__toast__wrapper--slide-in",
  exit: "c__toast__wrapper--slide-out",
});

const slideSideFromPosition = (position: ToastPosition) =>
  position.includes("right") ? "right" : "left";

export interface ToastProviderContext {
  toast: (
    message: string,
    type?: VariantType,
    options?: Partial<Omit<ToastInterface, "message" | "type">>,
  ) => ToastId;
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

/** What a live toast was last rendered with, so an update can build on it. */
type ToastState = {
  message: string;
  type: VariantType;
  props: Partial<Omit<ToastProps, "type">>;
};

// The provider owns the dismissal here, so the component must not run its own
// timer: `duration` and `onDelete` are consumed as react-toastify options and
// deliberately kept out of the rendered element.
const renderToast = ({ message, type, props }: ToastState) => {
  const { duration: _duration, onDelete: _onDelete, ...presentation } = props;
  return (
    <Toast {...presentation} type={type}>
      {message}
    </Toast>
  );
};

export interface ToastProviderProps extends PropsWithChildren {
  /** Corner the toast sits in. The slide follows that side. Defaults to `bottom-left`. */
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

  // Updating a toast means rebuilding the component with merged props, so keep
  // track of what each live toast was last rendered with.
  const live = useRef(new Map<ToastId, ToastState>());
  const counter = useRef(0);

  const context: ToastProviderContext = useMemo(
    () => ({
      toast: (message, type = VariantType.NEUTRAL, options = {}) => {
        const duration = options.duration ?? DEFAULT_TOAST_DURATION;
        // Minting the id up front lets `onClose` release the entry it created.
        const id = `${target}-${(counter.current += 1)}`;
        const state: ToastState = { message, type, props: options };
        live.current.set(id, state);

        return notify(renderToast(state), {
          toastId: id,
          type: toastifyType(type),
          // `disableAnimate` used to opt out of the dismissal timer.
          autoClose: options.disableAnimate ? false : duration,
          icon: false,
          onClose: () => {
            live.current.delete(id);
            options.onDelete?.();
          },
          containerId: target,
        });
      },
      updateToast: (id, options = {}) => {
        const current = live.current.get(id);
        if (!current) {
          return;
        }
        const { message, type, duration, ...props } = options;
        const next: ToastState = {
          message: message ?? current.message,
          type: type ?? current.type,
          props: { ...current.props, ...props },
        };
        live.current.set(id, next);

        notify.update(id, {
          containerId: target,
          type: toastifyType(next.type),
          render: renderToast(next),
          // Leaving `autoClose` out keeps the timer the toast was raised with.
          ...(duration === undefined ? {} : { autoClose: duration }),
        });
      },
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
        className={`c__toast__container c__toast__container--slide-${slideSideFromPosition(position)}`}
        toastClassName="c__toast__wrapper"
        position={position}
        containerId={target}
        autoClose={DEFAULT_TOAST_DURATION}
        // `Toast` carries the alert role itself, so that a standalone one is
        // announced too. Leaving the default here would nest two of them.
        role="presentation"
        hideProgressBar
        // The dismissal timer used to be a plain timeout, so it kept running
        // when the window lost focus. Keep it that way.
        pauseOnFocusLoss={false}
        closeOnClick={false}
        closeButton={false}
        draggable={false}
        transition={ToastSlide}
      />
    </ToastContext.Provider>
  );
};
